var elements = require("../gp2/elements.js");
var AElement = require("../gp2/aelement.js");
var engine = require("./curengine.js");
var canvas = engine.canvas;

var isFullscreen = false;
var fullscreenModeContainer = elements.getGPId("fullscreenModeContainer");
var projectControls = elements.getGPId("projectControls");
var projectContainer = elements.getGPId("projectContainer");
function switchFullscreenMode() {
  canvas.remove();
  projectControls.remove();
  fullscreenModeContainer.hidden = !isFullscreen;
  if (isFullscreen) {
    fullscreenModeContainer.append(projectControls);
    fullscreenModeContainer.append(canvas);
    function handleResize() {
      var controlsRect = projectControls.getBoundingClientRect();
      var scale = (window.innerHeight - controlsRect.height) / engine.gameHeight;
      var scaleHorizontal = window.innerWidth / engine.gameWidth;
      if (scale > scaleHorizontal) {
        scale = scaleHorizontal;
      }
      canvas.style.width = (scale*engine.gameWidth)+"px";
      canvas.style.height = (scale*engine.gameHeight)+"px";
      engine.screenScale = scale;
      engine.updateCanvasSize();
    }
    window.onresize = handleResize;
    handleResize();
  } else {
    projectContainer.append(projectControls);
    projectContainer.append(canvas);
    window.onresize = function () {};
    canvas.style.width = "unset";
    canvas.style.height = "unset";
    engine.screenScale = 1;
    engine.updateCanvasSize();
  }
}

fullscreenModeContainer.hidden = true;
switchFullscreenMode();
elements.setInnerJSON(projectControls, [
  {
    element: "div",
    className: "projectButton",
    textContent: "Start",
    eventListeners: [
      {
        event: "click",
        func: function () {
          engine.startGame();
        },
      },
    ],
  },
  {
    element: "div",
    className: "projectButton",
    textContent: "Stop",
    eventListeners: [
      {
        event: "click",
        func: function () {
          engine.stopGame();
        },
      },
    ],
  },
  {
    element: "div",
    style: {
      marginRight: "auto",
    },
  },
  {
    element: "div",
    className: "projectButton",
    GPWhenCreated: (elm) => {
      if (engine.editMode) {
        elements.setInnerJSON(elm, [
          {
            element: "img",
            src: "icons/grab.svg",
            className: "projectButtonImg",
          },
        ]);
      } else {
        elements.setInnerJSON(elm, [
          {
            element: "img",
            src: "icons/nograb.svg",
            className: "projectButtonImg",
          },
        ]);
      }
    },
    title: "Toggle dragging sprites",
    eventListeners: [
      {
        event: "click",
        func: function () {
          if (engine.editMode) {
            engine.turnOffEditing();
          } else {
            engine.turnOnEditing();
          }
          if (engine.editMode) {
            elements.setInnerJSON(this, [
              {
                element: "img",
                src: "icons/grab.svg",
                className: "projectButtonImg",
              },
            ]);
          } else {
            elements.setInnerJSON(this, [
              {
                element: "img",
                src: "icons/nograb.svg",
                className: "projectButtonImg",
              },
            ]);
          }
        },
      },
    ],
  },
  {
    element: "div",
    className: "projectButton",
    GPWhenCreated: (elm) => {
      if (isFullscreen) {
        elements.setInnerJSON(elm, [
          {
            element: "img",
            src: "icons/fullscreen-exit.svg",
            className: "projectButtonImg",
          },
        ]);
      } else {
        elements.setInnerJSON(elm, [
          {
            element: "img",
            src: "icons/fullscreen.svg",
            className: "projectButtonImg",
          },
        ]);
      }
    },
    title: "Toggle fullscreen",
    eventListeners: [
      {
        event: "click",
        func: function () {
          isFullscreen = !isFullscreen;
          switchFullscreenMode();
          if (isFullscreen) {
            elements.setInnerJSON(this, [
              {
                element: "img",
                src: "icons/fullscreen-exit.svg",
                className: "projectButtonImg",
              },
            ]);
          } else {
            elements.setInnerJSON(this, [
              {
                element: "img",
                src: "icons/fullscreen.svg",
                className: "projectButtonImg",
              },
            ]);
          }
        },
      },
    ],
  },
]);

var canvas = elements.getGPId("projectCanvas");
var projectMouseCoordinates = elements.getGPId("projectMouseCoordinates");

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

function updateCoordinates() {
  projectMouseCoordinates.textContent = `X: ${Math.round(engine.mouseMask.x)} Y: ${Math.round(engine.mouseMask.y)} Down: ${engine.mouseMask.isDown}`;
}

document.addEventListener("mousemove", (event) => {
  var pos = getMousePosition(event, canvas, [canvas.width, canvas.height]);
  engine.changeMousePosition(pos.x, pos.y);
  updateCoordinates();
});

canvas.addEventListener("mousedown", (event) => {
  var pos = getMousePosition(event, canvas, [canvas.width, canvas.height]);
  engine.changeMousePosition(pos.x, pos.y);
  engine.changeMouseDown(true);
  updateCoordinates();
  event.preventDefault();
});

document.addEventListener("mouseup", (event) => {
  var pos = getMousePosition(event, canvas, [canvas.width, canvas.height]);
  engine.changeMousePosition(pos.x, pos.y);
  engine.changeMouseDown(false);
  updateCoordinates();
});

document.addEventListener("keydown", (event) => {
  if (document.activeElement == document.body) {
    engine.changeKeyPressed(event.key, true);
    event.preventDefault();
  }
});

document.addEventListener("keyup", (event) => {
  engine.changeKeyPressed(event.key, false);
});

updateCoordinates();
