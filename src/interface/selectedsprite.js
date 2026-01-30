var elements = require("../gp2/elements.js");
var AElement = require("../gp2/aelement.js");

var engine = require("./curengine.js");
var blocks = require("./blocks.js");
var costumeViewer = require("./costumeviewer.js");
var soundViewer = require("./soundviewer.js");
var compiler = require("../compiler");
var blockMenu = require("./blockmenuloader.js");
var { valueReport } = require("./value-report.js");
var { makeSortable } = require("./drag-utils.js");
var { loadBlockMenus } = blockMenu;

var currentSelectedSprite = null;
var currentSelectedSpriteIndex = null;

var spriteNameInput = elements.getGPId("spriteNameInput");
var spriteXPosInput = elements.getGPId("spriteXPosInput");
var spriteYPosInput = elements.getGPId("spriteYPosInput");
var spriteDirectionInput = elements.getGPId("spriteDirectionInput");
var spriteSizeInput = elements.getGPId("spriteSizeInput");
var spriteHiddenInput = elements.getGPId("spriteHiddenInput");

var spritesContainer = elements.getGPId("spritesContainer");
var addSpriteButton = elements.getGPId("addSpriteButton");

var errorLogsContainer = elements.getGPId("errorLogsContainer");

addSpriteButton.addEventListener("click", () => {
  engine.createEmptySprite();
  engine.makeUniqueSpriteNames();
  setCurrentSprite(engine.sprites.length - 1);
});

var draggingSpriteIndex = null;

function updateSpritesContainer() {
  elements.setInnerJSON(
    spritesContainer,
    engine.sprites.map((spr, i) => {
      return {
        element: "div",
        className: "spriteContainer",
        style: {
          cursor: "grab",
        },
        GPWhenCreated: function (elm) {
          if (currentSelectedSpriteIndex == i) {
            elm.setAttribute("selected", "");
          }
        },
        children: [
          {
            element: "div",
            className: "spriteTextContainer",
            textContent: spr.name,
            style: {
              marginRight: "5px",
            },
          },
          {
            element: "button",
            className: "greyButtonStyle",
            textContent: "Select",
            style: {
              fontSize: "15px",
              marginRight: "5px",
            },
            eventListeners: [
              {
                event: "click",
                func: function (elm) {
                  setCurrentSprite(i);
                },
              },
            ],
          },
          {
            element: "button",
            className: "greyButtonStyle",
            textContent: "Delete",
            style: {
              fontSize: "15px",
              marginRight: "5px",
            },
            eventListeners: [
              {
                event: "click",
                func: function (elm) {
                  if (engine.sprites.length > 1) {
                    var newIndex = currentSelectedSpriteIndex;
                    engine.deleteSprite(spr);
                    if (
                      currentSelectedSpriteIndex >
                      engine.sprites.length - 1
                    ) {
                      newIndex = engine.sprites.length - 1;
                    }
                    setCurrentSprite(newIndex, true);
                    updateSpritesContainer();
                  }
                },
              },
            ],
          },
          {
            element: "button",
            className: "greyButtonStyle",
            textContent: "Duplicate",
            style: {
              fontSize: "15px",
              marginRight: "5px",
            },
            eventListeners: [
              {
                event: "click",
                func: function (elm) {
                  saveCurrentSpriteCode();
                  var newSprite = engine.duplicateSprite(spr);
                  compileSpriteXML(newSprite);
                  engine.makeUniqueSpriteNames();
                  updateSpritesContainer();
                },
              },
            ],
          },
        ],
      };
    }),
  );
}

var workspace = null;
var disposingWorkspace = false;

function loadCode(spr) {
  if (!spr) {
    return;
  }
  loadBlockMenus(spr);
  disposingWorkspace = true;
  Blockly.Events.disable();
  blocks.createFreshWorkspace(spr);
  workspace = blocks.getCurrentWorkspace();
  if (spr.blocklyXML) {
    Blockly.Xml.domToWorkspace(spr.blocklyXML, workspace);
  }
  var currentBlocks = {};
  var currentBlockParentIDs = {};

  async function compileRoot(rootBlock) {
    if (!rootBlock) return;
    // We don't need to stop it since it automatically stops the previous stack when ran.
    if (compiler.isStarterBlock(rootBlock)) {
      try {
        var code = compiler.compileBlock(rootBlock);
        spr.removeSpriteFunction(rootBlock.id);
        spr.addFunction(code, rootBlock.id);
        spr.runFunctionID(rootBlock.id);
      } catch (e) {
        workspace.reportValue(rootBlock.id, "Unable to compile: " + e);
        console.error(`Unable to compile block `, e);
        return;
      }
    }
  }

  function compileAll() {
    var blocks = workspace.getTopBlocks(true);
    for (var block of blocks) {
      compileRoot(block.getRootBlock());
    }
  }

  function unglowErrorOnBlock(blockId) {
    try {
      var changedBlock = workspace.getBlockById(blockId);
      if (changedBlock && changedBlock.getSvgRoot) {
        var changedSvg = changedBlock.getSvgRoot();
        if (changedSvg && changedSvg.classList)
          changedSvg.classList.remove("error-glow");
        try {
          var errFilterId2 =
            workspace.options && workspace.options.errorGlowFilterId;
          if (
            errFilterId2 &&
            changedSvg &&
            changedSvg.getAttribute &&
            changedSvg.getAttribute("filter") === "url(#" + errFilterId2 + ")"
          ) {
            changedSvg.removeAttribute("filter");
          }
        } catch (innerErr) {}
      }
    } catch (err) {}
  }

  workspace.addChangeListener(function (e) {
    if (disposingWorkspace) {
      //window.alert(JSON.stringify(e));
      //disposingWorkspace = false;
      return;
    }
    spr.editorScanVariables(workspace);

    if (e.element == "click") {
      var clickedBlock = workspace.getBlockById(e.blockId);
      if (clickedBlock && clickedBlock.getSvgRoot) {
        try {
          var svg = clickedBlock.getSvgRoot();
          if (svg && svg.classList) svg.classList.remove("error-glow");
          try {
            var errFilterId =
              workspace.options && workspace.options.errorGlowFilterId;
            if (
              errFilterId &&
              svg &&
              svg.getAttribute &&
              svg.getAttribute("filter") === "url(#" + errFilterId + ")"
            ) {
              svg.removeAttribute("filter");
            }
          } catch (inner) {}
        } catch (err) {}
      }
      var root = clickedBlock.getRootBlock();
      if (!spr.runningStacks[root.id]) {
        (async function () {
          var code = compiler.compileBlockWithThreadForced(root);
          var outputThread = await spr.runFunction(code);
          if (outputThread) {
            if (typeof outputThread.output !== "undefined") {
              workspace.reportValue(
                e.blockId,
                valueReport(outputThread.output),
              );
            }
          }
        })();
      } else {
        spr.runningStacks[root.id].stop();
      }
    } else if (e.blockId && e.element !== "stackclick") {
      var eventBlock = workspace.getBlockById(e.blockId);

      if (!eventBlock) {
        if (currentBlocks[e.blockId]) {
          var thread = spr.runningStacks[e.blockId];
          if (thread) {
            thread.stop();
          }
        }
        spr.removeSpriteFunction(e.blockId);
        spr.removeStackListener(e.blockId);
        delete currentBlocks[e.blockId];

        if (e.oldParentId) {
          var oldParentBlock = workspace.getBlockById(e.oldParentId);
          if (oldParentBlock) {
            unglowErrorOnBlock(oldParentBlock.getRootBlock().id);
            //compileRoot(oldParentBlock.getRootBlock());
            compileAll();
          }
        }
      } else {
        currentBlocks[e.blockId] = true;

        var newRoot = eventBlock.getRootBlock();
        //compileRoot(newRoot);
        compileAll();

        if (
          (e instanceof Blockly.Events.Move || e.type == "move") &&
          e.oldParentId
        ) {
          var oldParentBlock = workspace.getBlockById(e.oldParentId);
          if (oldParentBlock) {
            var oldRoot = oldParentBlock.getRootBlock();
            if (oldRoot.id !== newRoot.id) {
              unglowErrorOnBlock(oldRoot.id);
              //compileRoot(oldRoot);
              compileAll();
            }
          }
        }

        // If any change happens to a block (move, change, mutate, etc.), clear
        // its error glow so that moved/edited blocks don't accumulate persistent
        // red highlights (similar to Scratch 1.4 behavior).
        if (e.blockId) {
          unglowErrorOnBlock(e.blockId);
        }
      }
    }
  });

  var flyoutWorkspace = workspace.getFlyout().getWorkspace();
  flyoutWorkspace.addChangeListener(function (e) {
    spr.editorScanVariables(workspace);
    if (e.element == "click") {
      var root = workspace.getBlockById(e.blockId).getRootBlock();
      if (!spr.runningStacks[root.id]) {
        (async function () {
          var code = compiler.compileBlockWithThreadForced(root);
          var outputThread = await spr.runFunction(code);
          if (outputThread) {
            if (typeof outputThread.output !== "undefined") {
              workspace.reportValue(e.blockId, outputThread.output);
            }
          }
        })();
      } else {
        spr.runningStacks[root.id].stop();
      }
    }
  });

  for (var id of Object.keys(spr.runningStacks)) {
    if (workspace.getBlockById(id)) {
      workspace.glowStack(id, true);
    }
  }
  var endTimeouts = {};
  spr.threadStartListener = function (id) {
    if (disposingWorkspace) {
      return;
    }
    if (workspace.getBlockById(id)) {
      if (typeof endTimeouts[id] !== "undefined") {
        clearTimeout(endTimeouts[id]);
      }
      workspace.glowStack(id, true);
    }
  };
  spr.threadEndListener = function (id, isPreviewMode) {
    if (disposingWorkspace) {
      return;
    }
    if (workspace.getBlockById(id)) {
      //Only do it if it exists.
      if (typeof endTimeouts[id] !== "undefined") {
        clearTimeout(endTimeouts[id]);
      }
      endTimeouts[id] = setTimeout(() => {
        //Breif flash so it indicates its running something (like a block that runs immediatley).
        delete endTimeouts[id];
        if (workspace.getBlockById(id)) {
          //Just a double check so that no breaking happens when its deleted before the timeout finishes.
          // Turn off the default glow.
          workspace.glowStack(id, false);
          try {
            var b = workspace.getBlockById(id);
            if (b && b.getSvgRoot) {
              var svg = b.getSvgRoot();
              // Remove any error-glow class and remove the error filter if present.
              if (svg && svg.classList) svg.classList.remove("error-glow");
              try {
                var errFilterId =
                  workspace.options && workspace.options.errorGlowFilterId;
                if (
                  errFilterId &&
                  svg &&
                  svg.getAttribute &&
                  svg.getAttribute("filter") === "url(#" + errFilterId + ")"
                ) {
                  svg.removeAttribute("filter");
                }
              } catch (inner) {}
            }
          } catch (e) {}
        }
      }, 1000 / 30);
    }
  };

  // When a thread errors, show a persistent red glow on the root block.
  spr.threadErrorListener = function (id, output) {
    if (disposingWorkspace) {
      return;
    }
    if (workspace.getBlockById(id)) {
      if (typeof endTimeouts[id] !== "undefined") {
        clearTimeout(endTimeouts[id]);
      }
      // Ensure the default glow is on (so Blockly knows it's active), then
      // replace the block's filter with our red error filter so it appears red.
      workspace.glowStack(id, true);
      try {
        var b = workspace.getBlockById(id);
        if (b && b.getSvgRoot) {
          var svg = b.getSvgRoot();
          // Remove any previous marker class.
          if (svg && svg.classList) svg.classList.add("error-glow");
          try {
            var errFilterId =
              workspace.options && workspace.options.errorGlowFilterId;
            if (errFilterId && svg && svg.setAttribute) {
              svg.setAttribute("filter", "url(#" + errFilterId + ")");
            }
          } catch (inner) {
            // Fallback: rely on CSS class if filter injection fails.
          }
        }
      } catch (e) {
        console.warn("Failed to add error-glow filter/class", e);
      }
    }
  };

  setTimeout(function () {
    Blockly.svgResize(workspace);
  }, 0);

  scrollToPrevious();

  disposingWorkspace = false;
  Blockly.Events.enable();
  workspace.getToolbox().refreshSelection();
  return { scrollToPrevious };
}
function scrollToPrevious() {
  if (!workspace) {
    return;
  }
  var spr = currentSelectedSprite;
  if (typeof spr._editor_scrollX == "number") {
    Blockly.svgResize(workspace);
    workspace.scrollX = spr._editor_scrollX;
    workspace.scrollY = spr._editor_scrollY;
    workspace.scale = spr._editor_scale;

    var flyoutWorkspace = workspace.getFlyout().getWorkspace();
    flyoutWorkspace.scrollX = spr._flyout_scrollX || 0;
    flyoutWorkspace.scrollY = spr._flyout_scrollY || 0;
    flyoutWorkspace.scale = spr._flyout_scale || 0;
    flyoutWorkspace.resize();

    workspace.resize();
    Blockly.svgResize(workspace);
  }
}
function saveScroll() {
  if (!workspace) {
    return;
  }
  var spr = currentSelectedSprite;
  var flyoutWorkspace = workspace.getFlyout().getWorkspace();
  spr._flyout_scrollX = flyoutWorkspace.scrollX;
  spr._flyout_scrollY = flyoutWorkspace.scrollY;
  spr._flyout_scale = flyoutWorkspace.scale;

  spr._editor_scrollX = workspace.scrollX;
  spr._editor_scrollY = workspace.scrollY;
  spr._editor_scale = workspace.scale;
}

function getErrorLogDiv(error) {
  var logDiv = document.createElement("div");
  logDiv.className = "errorLogError";
  logDiv.textContent = error.toString();
  return logDiv;
}

function handleSpriteErrorLog(spr) {
  errorLogsContainer.innerHTML = "";
  var willScroll = false;
  if (
    errorLogsContainer.scrollTop + errorLogsContainer.offsetHeight + 2 >=
    errorLogsContainer.scrollHeight
  ) {
    willScroll = true;
  }
  for (var error of spr.errorLogs) {
    var logDiv = getErrorLogDiv(error);
    errorLogsContainer.appendChild(logDiv);
  }
  if (willScroll) {
    errorLogsContainer.scrollTo(0, errorLogsContainer.scrollHeight);
  }

  spr.onErrorLog = function (error) {
    var willScroll = false;
    if (
      errorLogsContainer.scrollTop + errorLogsContainer.offsetHeight + 2 >=
      errorLogsContainer.scrollHeight
    ) {
      willScroll = true;
    }
    var logDiv = getErrorLogDiv(error);
    errorLogsContainer.appendChild(logDiv);
    if (willScroll) {
      errorLogsContainer.scrollTo(0, errorLogsContainer.scrollHeight);
    }
  };
}

function setCurrentSprite(index, forced, dontSave) {
  if (!forced) {
    if (currentSelectedSpriteIndex == index) {
      return;
    }
  }
  if (currentSelectedSprite) {
    currentSelectedSprite.onErrorLog = function () {}; //Stop listening to errors.
    currentSelectedSprite.threadStartListener = null;
    currentSelectedSprite.threadEndListener = null;
    if (workspace) {
      saveScroll();
      if (!dontSave) {
        currentSelectedSprite.blocklyXML =
          Blockly.Xml.workspaceToDom(workspace);
      }
    }
  }
  currentSelectedSpriteIndex = index;
  currentSelectedSprite = engine.sprites[index];

  spriteNameInput.value = currentSelectedSprite.name;
  spriteXPosInput.value = currentSelectedSprite.x;
  spriteYPosInput.value = currentSelectedSprite.y;
  updateSpritesContainer();
  loadCode(currentSelectedSprite);
  handleSpriteErrorLog(currentSelectedSprite);
  loadCostumes();
  loadSounds();
}
function loadCostumes() {
  costumeViewer.reloadCostumes(currentSelectedSprite, loadCostumes);
}
function loadSounds() {
  soundViewer.reloadSounds(currentSelectedSprite, loadSounds);
}

spriteNameInput.addEventListener("input", () => {
  if (!currentSelectedSprite) {
    return;
  }
  currentSelectedSprite.name = spriteNameInput.value;
  engine.makeUniqueSpriteNames();
  updateSpritesContainer();
});
spriteXPosInput.addEventListener("input", () => {
  if (!currentSelectedSprite) {
    return;
  }
  currentSelectedSprite.x = +spriteXPosInput.value || 0;
});
spriteYPosInput.addEventListener("input", () => {
  if (!currentSelectedSprite) {
    return;
  }
  currentSelectedSprite.y = +spriteYPosInput.value || 0;
});
spriteDirectionInput.addEventListener("input", () => {
  if (!currentSelectedSprite) {
    return;
  }
  currentSelectedSprite.direction = +spriteDirectionInput.value || 0;
});
spriteSizeInput.addEventListener("input", () => {
  if (!currentSelectedSprite) {
    return;
  }
  currentSelectedSprite.size = +spriteSizeInput.value || 0;
});
spriteHiddenInput.addEventListener("input", () => {
  if (!currentSelectedSprite) {
    return;
  }
  currentSelectedSprite.hidden = spriteHiddenInput.checked;
});

function getCurSprite() {
  return currentSelectedSprite;
}
function getCurSpriteIndex() {
  return currentSelectedSpriteIndex;
}

setInterval(() => {
  if (currentSelectedSprite) {
    if (spriteNameInput.value !== currentSelectedSprite.name) {
      spriteNameInput.value = currentSelectedSprite.name;
    }
    if (
      Math.round(+spriteXPosInput.value || 0) !==
      Math.round(currentSelectedSprite.x)
    ) {
      spriteXPosInput.value = Math.round(currentSelectedSprite.x);
    }
    if (
      Math.round(+spriteYPosInput.value || 0) !==
      Math.round(currentSelectedSprite.y)
    ) {
      spriteYPosInput.value = Math.round(currentSelectedSprite.y);
    }
    if (
      Math.round(+spriteDirectionInput.value || 0) !==
      Math.round(currentSelectedSprite.direction)
    ) {
      spriteDirectionInput.value = Math.round(currentSelectedSprite.direction);
    }
    if (
      Math.round(+spriteSizeInput.value || 0) !==
      Math.round(currentSelectedSprite.size)
    ) {
      spriteSizeInput.value = Math.round(currentSelectedSprite.size);
    }
    if (spriteHiddenInput.checked !== currentSelectedSprite.hidden) {
      spriteHiddenInput.checked = currentSelectedSprite.hidden;
    }
  }
}, 1000 / 30);

blockMenu.helpers.loadWorkspaceFromSprite = function (spr) {
  var div = document.createElement("div");
  document.body.append(div);
  var tempWorkspace = Blockly.inject(div, {
    comments: true,
    disable: false,
    collapse: false,
    media: "../media/",
    readOnly: false,
    rtl: false,
    scrollbars: false,
    trashcan: false,
    sounds: false,
  });

  if (spr.blocklyXML) {
    Blockly.Xml.domToWorkspace(spr.blocklyXML, tempWorkspace);
  }

  return tempWorkspace;
};

function compileSpriteXML(spr) {
  async function compileRoot(rootBlock) {
    if (!rootBlock) return;
    // We don't need to stop it since it automatically stops the previous stack when ran.
    if (compiler.isStarterBlock(rootBlock)) {
      try {
        var code = compiler.compileBlock(rootBlock);
        spr.removeSpriteFunction(rootBlock.id);
        spr.addFunction(code, rootBlock.id);
        spr.runFunctionID(rootBlock.id);
      } catch (e) {
        return;
      }
    }
  }
  var div = document.createElement("div");
  document.body.append(div);
  var tempWorkspace = Blockly.inject(div, {
    comments: true,
    disable: false,
    collapse: false,
    media: "../media/",
    readOnly: false,
    rtl: false,
    scrollbars: false,
    trashcan: false,
    sounds: false,
  });

  if (spr.blocklyXML) {
    Blockly.Xml.domToWorkspace(spr.blocklyXML, tempWorkspace);
  }

  var blocks = tempWorkspace.getTopBlocks(true);
  for (var block of blocks) {
    compileRoot(block.getRootBlock());
  }

  tempWorkspace.dispose();
  div.remove();
}

function saveCurrentSpriteCode() {
  currentSelectedSprite.blocklyXML = Blockly.Xml.workspaceToDom(workspace);
}

makeSortable(spritesContainer, ".spriteContainer", (oldIndex, newIndex) => {
  // This callback runs only when the user releases the mouse
  // and the order has actually changed.

  if (oldIndex === newIndex) return;

  // 1. Move data in the engine
  var spriteToMove = engine.sprites[oldIndex];
  engine.sprites.splice(oldIndex, 1);
  engine.sprites.splice(newIndex, 0, spriteToMove);

  // 2. Update selected index
  if (currentSelectedSprite) {
    currentSelectedSpriteIndex = engine.sprites.indexOf(currentSelectedSprite);
  }

  engine.makeUniqueSpriteNames();

  updateSpritesContainer();
});

module.exports = {
  setCurrentSprite,
  updateSpritesContainer,
  getCurSprite,
  getCurSpriteIndex,
  loadCode,
  compileSpriteXML,
  saveCurrentSpriteCode,
  saveScroll,
  scrollToPrevious,
};
