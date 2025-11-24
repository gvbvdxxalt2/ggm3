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
    label: "Costume pivots",
    src: "icons/pivot.svg",
    default: true,
    id: "COSTUME_PIVOT",
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
var costumePivotContainer = elements.getGPId("costumePivotContainer");

function updateVisibility() {
  setWorkspaceVisibility(false);
  costumesContainer.hidden = true;
  costumePivotContainer.hidden = true;

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
}

function switchTab(id) {
  if (currentTab == id) {
    return;
  }
  currentTab = id;
  updateTabs();
}

updateTabs();

module.exports = { updateTabs, updateVisibility };
