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
  if (window.Blockly && Blockly.VerticalFlyout && Blockly.VerticalFlyout.prototype) {
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
