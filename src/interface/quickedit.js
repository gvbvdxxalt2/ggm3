var elements = require("../gp2/elements.js");
var engine = require("./curengine.js");
var dialogs = require("./dialogs.js");

//This stuff is used from GM2 (Gvbvdxx Mod 2 - Modified TurboWarp), edited to fit GGM3.

var GGM3Type = {
  description: "GGM3 game",
  accept: {
    "application/x.ggm3.ggm3": ".ggm3",
  },
};

const showSaveFilePicker = (fileName) =>
  window.showSaveFilePicker({
    suggestedName: fileName,
    types: [GGM3Type],
    excludeAcceptAllOption: true,
  });

const showOpenFilePicker = async () => {
  const [handle] = await window.showOpenFilePicker({
    multiple: false,
    types: [GGM3Type],
  });
  return handle;
};

const available = () => !!window.showSaveFilePicker;

const createWritable = (handle) => handle.createWritable();

const closeWritable = async (writable) => {
  await writable.close();
};

const writeToWritable = async (writable, content) => {
  await writable.write(content);
};

//GGM3 Stuff:

var { addAppMenu } = require("./dropdown-menus.js");
var loadingScreenContainer = elements.getGPId("loadingScreenContainer");
var loadingScreenContent = elements.getGPId("loadingScreenContent");
var selectedSprite = require("./selectedsprite.js");
var defaultProject = require("./defaultproject.js");

var newFileMenus = [];

var projectSaver = require("./file");

async function newProject() {
  loadingScreenContainer.hidden = false;
  await defaultProject.loadDefaultProject();
  selectedSprite.setCurrentSprite(0, true, true);
  loadingScreenContainer.hidden = true;
}

function loadProjectFile(file) {
  if (!file) {
    return;
  }
  loadingScreenContainer.hidden = false;
  elements.setInnerJSON(loadingScreenContent, []);
  var reader = new FileReader();
  reader.onload = async function () {
    try {
      var monitor = new projectSaver.ProgressMonitor();

      monitor.on("progress", (event) => {
        elements.setInnerJSON(loadingScreenContent, [
          {
            element: "span",
            textContent: "Loading...",
          },
          createProgessBarJSON(event.current / event.max),
        ]);
      });

      await projectSaver.loadProjectZip(reader.result, monitor);
    } catch (e) {
      await defaultProject.loadDefaultProject();
      console.error("Project load error: ", e);
      dialogs.alert("Project load error: " + e.message);
    }
    selectedSprite.setCurrentSprite(0, true, true);
    loadingScreenContainer.hidden = true;
  };
  reader.readAsArrayBuffer(file);
}

if (available()) {
  var menuBar = elements.getGPId("menuBar");
  elements.appendElementsFromJSON(menuBar, [
    {
      element: "div",
      style: {
        marginRight: "auto",
      },
    },
    {
      element: "div",
      className: "menuBarItem",
      gid: "editFileQuick",
    },
  ]);

  var editFileQuick = elements.getGPId("editFileQuick");
  var fileHandle = null;
  var isSaving = false;

  editFileQuick.textContent = "Save now";

  function createProgessBarJSON(decimal = 0) {
    return {
      element: "div",
      className: "loadingProgressMain",
      style: {
        height: "15px",
        width: "70px",
      },
      children: [
        {
          element: "div",
          className: "loadingProgressInner",
          style: {
            width: Math.round(decimal * 100) + "%",
          },
        },
      ],
    };
  }

  newFileMenus.push({
    label: "Load and edit",
    icon: "icons/import.svg",
    action: async function () {
      try {
        fileHandle = await showOpenFilePicker();
      } catch (e) {
        fileHandle = null;
      }
      if (fileHandle) {
        loadingScreenContainer.hidden = false;
        elements.setInnerJSON(loadingScreenContent, [
          {
            element: "span",
            textContent: "Reading file...",
          },
        ]);
        var file = await fileHandle.getFile();
        loadProjectFile(file);
      }
    },
  });

  editFileQuick.onclick = async function () {
    if (isSaving) {
      return;
    }
    var previousTextContent = editFileQuick.textContent;
    if (!fileHandle) {
      try {
        fileHandle = await showSaveFilePicker("game.ggm3");
      } catch (e) {
        fileHandle = null;
      }
    }
    editFileQuick.textContent = "Saving...";
    isSaving = true;
    try {
      var writable = await createWritable(fileHandle);
      var monitor = new projectSaver.ProgressMonitor();
      monitor.on("progress", (event) => {
        editFileQuick.textContent = "";
        elements.setInnerJSON(editFileQuick, [
          {
            element: "span",
            textContent: "Saving...",
          },
          {
            element: "br",
          },
          createProgessBarJSON(event.current / event.max),
        ]);
      });
      monitor.on("finish", () => {
        editFileQuick.textContent = "";
        elements.setInnerJSON(editFileQuick, [
          {
            element: "span",
            textContent: "Saving...",
          },
        ]);
      });
      var zipBlob = await projectSaver.saveProjectZipBlob(monitor);
      await writeToWritable(writable, zipBlob);
    } catch (e) {
      console.error(e);
      dialogs.alert("Project save error " + e);
    }
    closeWritable(writable);
    editFileQuick.textContent = previousTextContent;
    isSaving = false;
  };
}

addAppMenu(
  "file",
  [
    {
      element: "img",
      src: "icons/file.svg",
    },
    {
      element: "span",
      textContent: "File",
    },
  ],
  newFileMenus.concat([
    {
      label: "New",
      icon: "icons/add.svg",
      action: async function () {
        if (!(await dialogs.confirm("Start a new project?"))) {
          return;
        }
        newProject();
      },
    },
    {
      label: "Save as",
      icon: "icons/export.svg",
      action: async function () {
        var zipBlob = await projectSaver.saveProjectZipBlob();
        var objectURL = URL.createObjectURL(zipBlob);
        var a = document.createElement("a");
        a.href = objectURL;
        a.download = "project.ggm3";
        a.click();
      },
    },
    {
      label: "Load",
      icon: "icons/import.svg",
      action: function () {
        var input = document.createElement("input");
        input.type = "file";
        input.accept = ".ggm3";
        input.click();

        input.addEventListener("change", function () {
          if (!input.files[0]) {
            return;
          }
          loadProjectFile(input.files[0]);
        });
      },
    },
  ]),
);

newProject();
