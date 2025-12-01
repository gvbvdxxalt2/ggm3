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
var loadingScreenContainer = elements.getGPId("loadingScreenContainer");

require("./enginecontrol.js");

async function newProject() {
  loadingScreenContainer.hidden = false;
  await defaultProject.loadDefaultProject();
  selectedSprite.setCurrentSprite(0, true, true);
  loadingScreenContainer.hidden = true;
}

newProject();

var newProjectButton = elements.getGPId("newProjectButton");
newProjectButton.addEventListener("click", async function () {
  if (!(await dialogs.confirm("Start a new project?"))) {
    return;
  }
  newProject();
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

loadProjectButton.addEventListener("click", async function () {
  var input = document.createElement("input");
  input.type = "file";
  input.accept = ".ggm3";
  input.click();

  input.addEventListener("change", function () {
    if (!input.files[0]) {
      return;
    }
    loadingScreenContainer.hidden = false;
    var reader = new FileReader();
    reader.onload = async function () {
      try {
        await projectSaver.loadProjectFromZip(reader.result);
      } catch (e) {
        await defaultProject.loadDefaultProject();
        console.error("Project load error: ", e);
        dialogs.alert("Project load error: " + e.message);
      }
      selectedSprite.setCurrentSprite(0, true, true);
      loadingScreenContainer.hidden = true;
    };
    reader.readAsArrayBuffer(input.files[0]);
  });
});
