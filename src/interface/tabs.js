var elements = require("../gp2/elements.js");
var AElement = require("../gp2/aelement.js");
var blocks = require("./blocks.js");
var selectedSprite = require("./selectedsprite.js");
var costumeViewer = require("./costumeviewer.js");
var costumePivot = require("./costumepivoteditor.js");

var tabArea = elements.getGPId("tabArea");
function createTabElementJSON(label, src, whenClick, isSelected) {
  return {
    element: "div",
    className: "tabButton",
    eventListeners: [
      {
        event: "click",
        func: whenClick,
      },
    ],
    GPWhenCreated: function (elm) {
      if (isSelected) {
        elm.setAttribute("selected", "");
      }
    },
    children: [
      {
        element: "img",
        className: "tabIcon",
        src,
      },
      {
        element: "span",
        textContent: label,
      },
    ],
  };
}

const tabs = [
  {
    label: "Code",
    src: "icons/code.svg",
    default: true,
    id: "SCRIPT",
  },
  {
    label: "Costumes",
    src: "icons/brush.svg",
    default: true,
    id: "COSTUMES",
  },
  {
    label: "Sounds",
    src: "icons/speaker.svg",
    default: true,
    id: "SOUNDS",
  },
  {
    label: "Costume pivots",
    src: "icons/pivot.svg",
    default: true,
    id: "COSTUME_PIVOT",
  },
  {
    label: "Error Logs",
    src: "icons/logs.svg",
    default: true,
    id: "ERROR_LOGS",
  },
];

var currentTab = tabs[0].id;

function updateTabs() {
  elements.setInnerJSON(
    tabArea,
    tabs.map((tab) =>
      createTabElementJSON(
        tab.label,
        tab.src,
        () => switchTab(tab.id),
        currentTab == tab.id,
      ),
    ),
  );
  updateVisibility();
}

var blocklyDiv = elements.getGPId("blocklyDiv");

function setWorkspaceVisibility(visible) {
  blocklyDiv.hidden = !visible;

  var workspace = blocks.getCurrentWorkspace();
  if (!workspace) {
    return;
  }
  if (visible) {
    workspace.setVisible(true);
    setTimeout(function () {
      Blockly.svgResize(workspace);
    }, 0);
  } else {
    workspace.setVisible(false);
  }
}

var costumesContainer = elements.getGPId("costumesContainer");
var soundsContainer = elements.getGPId("soundsContainer");
var costumePivotContainer = elements.getGPId("costumePivotContainer");
var errorLogsContainer = elements.getGPId("errorLogsContainer");

function hideEverything() {
  setWorkspaceVisibility(false);
  costumesContainer.hidden = true;
  costumePivotContainer.hidden = true;
  errorLogsContainer.hidden = true;
  soundsContainer.hidden = true;
}

function updateVisibility() {
  hideEverything();

  if (currentTab == "SCRIPT") {
    setWorkspaceVisibility(true);
  }
  if (currentTab == "COSTUMES") {
    costumesContainer.hidden = false;
  }
  if (currentTab == "COSTUME_PIVOT") {
    costumePivotContainer.hidden = false;
    costumePivot.reloadCostumes(selectedSprite.getCurSprite());
  }
  if (currentTab == "ERROR_LOGS") {
    errorLogsContainer.hidden = false;
  }
  if (currentTab == "SOUNDS") {
    soundsContainer.hidden = false;
  }
}

function switchTab(id) {
  if (currentTab == id) {
    return;
  }
  currentTab = id;
  updateTabs();
}

updateTabs();

module.exports = { updateTabs, updateVisibility, hideEverything, switchTab };
