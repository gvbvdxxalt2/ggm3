var elements = require("../gp2/elements.js");
var AElement = require("../gp2/aelement.js");
var blocks = require("./blocks.js");
var selectedSprite = require("./selectedsprite.js");

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
        currentTab == tab.id
      )
    )
  );
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
  } else {
    workspace.setVisible(false);
  }
}

var costumesContainer = elements.getGPId("costumesContainer");

function updateVisibility() {
  if (currentTab == "SCRIPT") {
    setWorkspaceVisibility(true);
    costumesContainer.hidden = true;
  }
  if (currentTab == "COSTUMES") {
    setWorkspaceVisibility(false);
    costumesContainer.hidden = false;
  }
}

function switchTab(id) {
  if (currentTab == id) {
    return;
  }
  currentTab = id;
  updateTabs();
  updateVisibility();
}

updateTabs();

module.exports = { updateTabs, updateVisibility };
