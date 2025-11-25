var elements = require("../gp2/elements.js");
var AElement = require("../gp2/aelement.js");
var dialogs = require("./dialogs.js");
require("./ggm3blocks");
require("./dom/index.js");
//var { createFreshWorkspace, getCurrentWorkspace } = require("./blocks.js");

var engine = require("./curengine.js");

var tabs = require("./tabs.js");
var selectedSprite = require("./selectedsprite.js");
var defaultProject = require("./defaultproject.js");

require("./enginecontrol.js");

(async function () {
  await defaultProject.loadDefaultProject();
  selectedSprite.setCurrentSprite(0);
})();

var newProjectButton = elements.getGPId("newProjectButton");
newProjectButton.addEventListener("click", async function () {
  if (!(await dialogs.confirm("Start a new project?"))) {
    return;
  }
  await defaultProject.loadDefaultProject();
  selectedSprite.setCurrentSprite(0);
});

var projectSaver = require("./projectzip.js");

var saveProjectButton = elements.getGPId("saveProjectButton");
var loadProjectButton = elements.getGPId("loadProjectButton");

saveProjectButton.addEventListener("click", async function () {
  var zip = await projectSaver.saveProjectToZip();
  var objectURL = URL.createObjectURL(
    await zip.generateAsync({ type: "blob" }),
  );
  var a = document.createElement("a");
  a.href = objectURL;
  a.download = "project.ggm3";
  a.click();
});

loadProjectButton.addEventListener("click", async function () {});
