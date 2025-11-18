var elements = require("../gp2/elements.js");
var AElement = require("../gp2/aelement.js");

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

function switchTab(id) {
  currentTab = id;
  updateTabs();
}

updateTabs();

module.exports = {};
