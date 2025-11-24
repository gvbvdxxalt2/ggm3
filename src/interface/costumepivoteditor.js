var elements = require("../gp2/elements.js");
var AElement = require("../gp2/aelement.js");

var costumesInPivotContainer = elements.getGPId("costumesInPivotContainer");
var pivotEditorMenuBar = elements.getGPId("pivotEditorMenuBar");
var pivotEditorXInput = elements.getGPId("pivotEditorXInput");
var pivotEditorYInput = elements.getGPId("pivotEditorYInput");
var pivotEditorZoomInput = elements.getGPId("pivotEditorZoomInput");

var pivotEditorImageContainer = elements.getGPId("pivotEditorImageContainer");
var pivotEditorImage = elements.getGPId("pivotEditorImage");
var pivotEditorDot = elements.getGPId("pivotEditorDot");

function getMousePosition(event, onElement, size) {
  var client = onElement.getBoundingClientRect();

  var relativeX = event.x - client.x;
  var relativeY = event.y - client.y;

  var scaleX = client.width / size[0];
  var realX = relativeX * scaleX;

  var scaleY = client.height / size[1];
  var realY = relativeY * scaleY;

  if (realX < 0) {
    realX = 0;
  }
  if (realY < 0) {
    realY = 0;
  }

  if (realX > size[0]) {
    realX = size[0];
  }
  if (realY > size[1]) {
    realY = size[1];
  }

  var pos = {
    x: realX,
    y: realY,
  };
  return pos;
}

function reloadCostumes(spr, reloadTabCallback = function () {}) {
  if (spr.costumes.length < 1) {
    elements.setInnerJSON(costumesInPivotContainer, [
      {
        element: "span",
        textContent: "This sprite has no costumes.",
        style: {
          fontWeight: "bold",
          textDecoration: "underline",
        },
      },
    ]);
  } else {
    var selectedCostume = 0;
    function updateList() {
      elements.setInnerJSON(
        costumesInPivotContainer,
        spr.costumes.map((costume, i) => {
          return {
            element: "div",
            className: "pivotCostumeButton",
            GPWhenCreated: function (elm) {
              if (i == selectedCostume) {
                elm.setAttribute("selected", "");
              }
            },
            eventListeners: [
              {
                event: "click",
                func: function () {
                  selectedCostume = i;
                  updateList();
                  updateEditor();
                },
              },
            ],
            children: [
              {
                element: "img",
                src: costume.dataURL,
                style: {
                  width: "70px",
                  height: "70px",
                  objectFit: "contain",
                },
              },
              {
                element: "span",
                textContent: costume.name,
              },
            ],
          };
        }),
      );
    }

    updateList();

    function updateEditor() {
      var costume = spr.costumes[selectedCostume];
      if (!costume) {
        pivotEditorImage.src = "";
        return;
      }
      pivotEditorImage.src = costume.dataURL;
      function updateSize() {
        pivotEditorImageContainer.style.left = `calc(50% - ${costume.rotationCenterX}px)`;
        pivotEditorImageContainer.style.top = `calc(50% - ${costume.rotationCenterY}px)`;
        pivotEditorDot.style.left = `${costume.rotationCenterX}px`;
        pivotEditorDot.style.top = `${costume.rotationCenterY}px`;
        pivotEditorImageContainer.style.scale = pivotEditorZoomInput.value / 100;
        pivotEditorDot.style.width = `${(100 / pivotEditorZoomInput.value) * 20}px`;
        pivotEditorDot.style.height = `${(100 / pivotEditorZoomInput.value) * 20}px`;
      }
      updateSize();
      pivotEditorZoomInput.oninput = function () {
        updateSize();
      };

      pivotEditorImageContainer.onclick = function (event) {
        var pos = getMousePosition(event, pivotEditorImage);
        costume.rotationCenterX = pos.x;
        costume.rotationCenterY = pos.y;
        updateSize();
      };
    }

    updateEditor();
  }
}

module.exports = {
  reloadCostumes,
};
