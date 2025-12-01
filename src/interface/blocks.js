var elements = require("../gp2/elements.js");
var AElement = require("../gp2/aelement.js");
window.ScratchBlocks = window.Blockly;

// Disable flyout checkboxes early so initial flyout blocks don't get checkboxes.
try {
  if (window.Blockly && Blockly.Block && Blockly.Block.prototype) {
    Blockly.Block.prototype.hasCheckboxInFlyout = function () {
      return false;
    };
  }
  if (
    window.Blockly &&
    Blockly.VerticalFlyout &&
    Blockly.VerticalFlyout.prototype
  ) {
    Blockly.VerticalFlyout.prototype.createCheckbox_ = function () {
      // no-op
    };
  }
} catch (e) {
  console.warn("Unable to override Blockly flyout checkbox behavior:", e);
}

var blocklyDiv = elements.getGPId("blocklyDiv");

var toolboxGenerator = require("./toolbox.js");
var dialogs = require("./dialogs.js");
var customBlocks = require("./customblocks.js");

var workspace = null;

function getCurrentWorkspace() {
  return workspace;
}

function createFreshWorkspace(spr) {
  if (workspace) {
    workspace.dispose();
  }
  if (spr) {
    var toolbox = elements.createElementsFromJSON([
      {
        element: "xml",
        dangerouslySetInnerHTML: toolboxGenerator(spr.x, spr.y),
      },
    ])[0];
  } else {
    var toolbox = elements.createElementsFromJSON([
      {
        element: "xml",
        dangerouslySetInnerHTML: toolboxGenerator(),
      },
    ])[0];
  }
  workspace = Blockly.inject(blocklyDiv, {
    comments: true,
    disable: false,
    collapse: false,
    media: "../media/",
    readOnly: false,
    rtl: false,
    scrollbars: true,
    toolbox,
    //toolboxPosition: "side",
    //horizontalLayout: "start",
    trashcan: false,
    sounds: false,
    zoom: {
      controls: true,
      wheel: true,
      startScale: 0.75,
      maxScale: 4,
      minScale: 0.25,
      scaleSpeed: 1.1,
    },
    colours: {
      workspace: "#7d7d7d",
      flyout: "#787878",
      toolbox: "#7d7d7d",
      toolboxSelected: "#3d3d3d",
      scrollbar: "#CECDCE",
      scrollbarHover: "#CECDCE",
      insertionMarker: "#000000",
      insertionMarkerOpacity: 0.2,
      fieldShadow: "rgba(255, 255, 255, 0.3)",
      dragShadowOpacity: 0.6,
      text: "#ffffff",
    },
    grid: {
      spacing: 40,
      length: 2,
      colour: "#ddd",
    },
  });
  // Create an SVG filter for error glow (red) and store its id on workspace.options
  try {
    var parentSvg = workspace.getParentSvg && workspace.getParentSvg();
    var defs =
      parentSvg && parentSvg.querySelector && parentSvg.querySelector("defs");
    if (defs && Blockly && Blockly.utils && Blockly.utils.createSvgElement) {
      var errId = "blocklyErrorGlowFilter" + String(Math.random()).slice(2);
      var f = Blockly.utils.createSvgElement(
        "filter",
        { id: errId, height: "160%", width: "180%", y: "-30%", x: "-40%" },
        defs,
      );
      // Use a moderate blur for the error glow to make it visible but not oversized.
      var stdDev =
        typeof Blockly.Colours.stackGlowSize === "number"
          ? Math.max(1, Blockly.Colours.stackGlowSize / 1.5)
          : 2.5;
      Blockly.utils.createSvgElement(
        "feGaussianBlur",
        { in: "SourceGraphic", stdDeviation: stdDev },
        f,
      );
      var comp = Blockly.utils.createSvgElement(
        "feComponentTransfer",
        { result: "outBlur" },
        f,
      );
      Blockly.utils.createSvgElement(
        "feFuncA",
        { type: "table", tableValues: "0" + " 1".repeat(16) },
        comp,
      );
      // Increase flood opacity to make the glow more visible and thicker.
      Blockly.utils.createSvgElement(
        "feFlood",
        { "flood-color": "#ff0000", "flood-opacity": 1, result: "outColor" },
        f,
      );
      Blockly.utils.createSvgElement(
        "feComposite",
        { in: "outColor", in2: "outBlur", operator: "in", result: "outGlow" },
        f,
      );
      Blockly.utils.createSvgElement(
        "feComposite",
        { in: "SourceGraphic", in2: "outGlow", operator: "over" },
        f,
      );
      workspace.options.errorGlowFilterId = errId;
    }
  } catch (e) {
    console.warn("Could not create error glow filter for Blockly workspace", e);
  }

  var flyoutWorkspace = workspace.getFlyout().getWorkspace();
  Blockly.Procedures.externalProcedureDefCallback = function (a, b) {
    customBlocks.showCustomBlockDialog(a, b, workspace);
  };
  var procButtonCallback = () => {
    Blockly.Procedures.createProcedureDefCallback_(workspace);
  };
  flyoutWorkspace.registerButtonCallback(
    "MAKE_A_PROCEDURE",
    procButtonCallback,
  );
}

Blockly.alert = function (msg, callback) {
  dialogs.alert(msg).then(callback);
};
Blockly.prompt = function (msg, defaultValue, callback) {
  dialogs.prompt(msg, defaultValue).then(callback);
};
Blockly.confirm = function (msg, callback) {
  dialogs.confirm(msg).then(callback);
};

module.exports = {
  getCurrentWorkspace,
  createFreshWorkspace,
};
