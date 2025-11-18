var elements = require("../../gp2/elements.js");
var AElement = require("../../gp2/aelement.js");

var cssContent = require("./styles.css");

elements.appendElementsFromJSON(document.body, [
  {
    element: "style",
    textContent: cssContent,
  },
  {
    element: "div",
    className: "appContainer",
    children: [require("./menubar.js")],
  },
]);
