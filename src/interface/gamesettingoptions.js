var gameSettingOptions = {};
var elements = require("../gp2/elements.js");
var engine = require("./curengine.js");

function numberInputEventListeners() {
  return {
    eventListeners: [
      {
        event: "change",
        func: function () {
          this.value = +this.value;
          if (+this.value > +this.max) {
            this.value = +this.max;
          }
          if (+this.value < +this.min) {
            this.value = +this.min;
          }
        },
      },
    ],
  };
}

gameSettingOptions.elements = [
  //Game resolution
  {
    element: "div",
    className: "infoDiv",
    children: [
      {
        element: "b",
        textContent: "Game resolution: ",
      },

      {
        element: "br",
      },
      {
        element: "span",
        textContent: "Width: ",
      },
      {
        element: "input",
        ...numberInputEventListeners(),
        type: "number",
        min: 1,
        max: 99999,
        value: 5,
        gid: "game-settings-gameWidth",
      },

      {
        element: "br",
      },
      {
        element: "span",
        textContent: "Height: ",
      },
      {
        element: "input",
        ...numberInputEventListeners(),
        type: "number",
        min: 1,
        max: 99999,
        value: 5,
        gid: "game-settings-gameHeight",
      },
    ],
  },
  //Game runtime
  {
    element: "div",
    className: "infoDiv",
    children: [
      {
        element: "b",
        textContent: "Game runtime: ",
      },

      {
        element: "br",
      },
      {
        element: "span",
        textContent: "Framerate: ",
      },
      {
        element: "input",
        ...numberInputEventListeners(),
        type: "number",
        min: 1,
        max: 99999,
        value: 5,
        gid: "game-settings-frameRate",
      },

      {
        element: "br",
      },
    ],
  },
];

gameSettingOptions.start = function () {
  var widthInput = elements.getGPId("game-settings-gameWidth");
  var heightInput = elements.getGPId("game-settings-gameHeight");
  var frameRateInput = elements.getGPId("game-settings-frameRate");

  widthInput.addEventListener("change", () => {
    engine.gameWidth = +widthInput.value || 1;
    engine.updateCanvasSize();
  });

  frameRateInput.addEventListener("change", () => {
    engine.setFramerate(frameRateInput.value);
  });

  heightInput.addEventListener("change", () => {
    engine.gameHeight = +heightInput.value || 1;
    engine.updateCanvasSize();
  });

  function updateGameInfo() {
    widthInput.value = engine.gameWidth;
    heightInput.value = engine.gameHeight;
    frameRateInput.value = engine.frameRate;
  }

  engine.on(engine.RESOLUTION_UPDATED, updateGameInfo);
  engine.on(engine.FRAMERATE_CHANGED, updateGameInfo);
  updateGameInfo();
};

module.exports = gameSettingOptions;
