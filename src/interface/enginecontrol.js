var elements = require("../gp2/elements.js");
var AElement = require("../gp2/aelement.js");
var engine = require("./curengine.js");

elements.setInnerJSON(elements.getGPId("projectControls"), [
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
          },
        ]);
      } else {
        elements.setInnerJSON(elm, [
          {
            element: "img",
            src: "icons/nograb.svg",
          },
        ]);
      }
    },
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
              },
            ]);
          } else {
            elements.setInnerJSON(this, [
              {
                element: "img",
                src: "icons/nograb.svg",
              },
            ]);
          }
        },
      },
    ],
  },
]);
