var elements = require("../gp2/elements.js");
var AElement = require("../gp2/aelement.js");
window.ScratchBlocks = window.Blockly;

var blocklyDiv = elements.getGPId("blocklyDiv");

var toolbox = elements.createElementsFromJSON([
  {
    element: "xml",
    dangerouslySetInnerHTML: require("./toolbox.xml"),
  },
])[0];

var workspace = null;

function getCurrentWorkspace() {
  return workspace;
}

function createFreshWorkspace() {
  if (workspace) {
    workspace.dispose();
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
}

module.exports = {
  getCurrentWorkspace,
  createFreshWorkspace,
};
