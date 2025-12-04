var elements = require("../gp2/elements.js");
var AElement = require("../gp2/aelement.js");

var costumesContainer = elements.getGPId("costumesContainer");
var costumesHeaderContainer = elements.getGPId("costumesHeaderContainer");
var costumesSelectorContainer = elements.getGPId("costumesSelectorContainer");

var costumePivots = require("./costumepivoteditor.js");

var { makeSortable } = require("./drag-utils.js");

function reloadCostumes(spr, reloadTabCallback = function () {}) {
  costumePivots.reloadCostumes(spr, reloadTabCallback);
  elements.setInnerJSON(costumesHeaderContainer, [
    {
      element: "button",
      className: "greyButtonStyle",
      textContent: "Import Costume",
      style: {
        marginRight: "2px",
      },
      eventListeners: [
        {
          event: "click",
          func: function () {
            var input = document.createElement("input");
            input.type = "file";
            input.accept = ".webp, .png, .bmp, .svg, .jpg, .jpeg";
            input.multiple = true;
            input.onchange = async function () {
              if (input.files[0]) {
                var p = [];
                for (var _file of input.files) {
                  function load(file) {
                    return new Promise((resolve) => {
                      var reader = new FileReader();
                      reader.onload = async function () {
                        input.value = "";
                        input.remove();

                        try {
                          var costume = await spr.addCostume(reader.result);
                          costume.mimeType = file.type;
                          costume.name = file.name.split(".").slice(0,file.name.split(".").length-1).join(".").trim();
                          spr.ensureUniqueCostumeNames();
                          resolve();
                          reloadCostumes(spr);
                        } catch (e) {
                          window.alert(e);
                        }
                      };
                      reader.readAsDataURL(file);
                    });
                  }
                  p.push(load(_file));
                }
                Promise.all(p).then(() => {
                  reloadTabCallback(spr);
                });
              } else {
                input.value = "";
                input.remove();
              }
            };
            input.click();
          },
        },
      ],
    },
  ]);
  if (spr.costumes.length < 1) {
    elements.setInnerJSON(costumesSelectorContainer, [
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
    elements.setInnerJSON(
      costumesSelectorContainer,
      spr.costumes.map((costume, i) => {
        return {
          element: "div",
          className: "costumeContainer",
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
              element: "input",
              value: costume.name,
              className: "selectedCostumeInput",
              eventListeners: [
                {
                  event: "change",
                  func: function () {
                    costume.name = this.value.trim();
                    spr.ensureUniqueCostumeNames();
                    reloadCostumes(spr);
                    reloadTabCallback(spr);
                  },
                },
              ],
            },
            {
              element: "button",
              className: "greyButtonStyle",
              textContent: "Switch",
              style: {
                marginRight: "2px",
                fontSize: "12px",
              },
              eventListeners: [
                {
                  event: "click",
                  func: function () {
                    spr.costumeIndex = i;
                  },
                },
              ],
            },
            {
              element: "button",
              className: "greyButtonStyle",
              style: {
                marginRight: "2px",
                fontSize: "12px",
              },
              GPWhenCreated: function (elm) {
                if (costume.willPreload) {
                  elm.textContent = "Disable preloading";
                } else {
                  elm.textContent = "Enable preloading";
                }
              },
              eventListeners: [
                {
                  event: "click",
                  func: function () {
                    costume.willPreload = !costume.willPreload;
                    if (costume.willPreload) {
                      this.textContent = "Disable preloading";
                    } else {
                      this.textContent = "Enable preloading";
                    }
                  },
                },
              ],
            },
            {
              element: "button",
              className: "greyButtonStyle",
              textContent: "Load",
              style: {
                marginRight: "2px",
                fontSize: "12px",
              },
              eventListeners: [
                {
                  event: "click",
                  func: function () {
                    costume.loadCostume();
                  },
                },
              ],
            },
            {
              element: "button",
              className: "greyButtonStyle",
              textContent: "Delete",
              style: {
                marginRight: "2px",
                fontSize: "12px",
              },
              eventListeners: [
                {
                  event: "click",
                  func: function () {
                    spr.deleteCostume(costume);
                    reloadCostumes(spr);
                    reloadTabCallback(spr);
                  },
                },
              ],
            },
          ],
        };
      }),
    );

    makeSortable(
      costumesSelectorContainer,
      ".costumeContainer",
      (oldIndex, newIndex) => {
        // This callback runs only when the user releases the mouse
        // and the order has actually changed.

        if (oldIndex === newIndex) return;

        // 1. Move data in the engine
        var costumeToMove = spr.costumes[oldIndex];
        spr.costumes.splice(oldIndex, 1);
        spr.costumes.splice(newIndex, 0, costumeToMove);

        spr.costumeIndex = spr.costumes.indexOf(spr.costumes[spr.costumeIndex]);

        spr.ensureUniqueCostumeNames();

        reloadCostumes(spr);
        reloadTabCallback(spr);
      },
    );
  }
}

module.exports = {
  reloadCostumes,
};
