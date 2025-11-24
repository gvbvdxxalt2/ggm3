var elements = require("../gp2/elements.js");
var AElement = require("../gp2/aelement.js");

var engine = require("./curengine.js");
var blocks = require("./blocks.js");
var costumeViewer = require("./costumeviewer.js");
var compiler = require("../compiler");
var {loadBlockMenus} = require("./blockmenuloader.js");

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

addSpriteButton.addEventListener("click", () => {
  engine.createEmptySprite();
  setCurrentSprite(engine.sprites.length - 1);
});

function updateSpritesContainer() {
  elements.setInnerJSON(
    spritesContainer,
    engine.sprites.map((spr, i) => {
      return {
        element: "div",
        className: "spriteContainer",
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
                    if (currentSelectedSpriteIndex > engine.sprites.length - 1) {
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
                  if (engine.sprites.length > 1) {
                    var newIndex = currentSelectedSpriteIndex;
                    engine.duplicateSprite(spr);
                    updateSpritesContainer();
                  }
                },
              },
            ],
          },
        ],
      };
    })
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

  function compileRoot(rootBlock) {
    if (!rootBlock) return;
    // We don't need to stop it since it automatically stops the previous stack when ran.
    var code = compiler.compileBlock(rootBlock);
    spr.runFunction(code);
  }

  workspace.addChangeListener(function (e) {
    if (disposingWorkspace) {
      //window.alert(JSON.stringify(e));
      //disposingWorkspace = false;
      return;
    }
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
    } else if (e.blockId && e.element !== "stackclick") {
      // Catches Create, Delete, Change, Move

      var eventBlock = workspace.getBlockById(e.blockId);

      if (!eventBlock) {
        // --- This is a DELETE event (e.type == "delete" or e instanceof Blockly.Events.Delete) ---
        if (currentBlocks[e.blockId]) {
          var thread = spr.runningStacks[e.blockId];
          if (thread) {
            thread.stop();
          }
        }
        spr.removeStackListener(e.blockId);
        delete currentBlocks[e.blockId];

        // Re-compile the parent stack it was deleted from
        if (e.oldParentId) {
          var oldParentBlock = workspace.getBlockById(e.oldParentId);
          if (oldParentBlock) {
            compileRoot(oldParentBlock.getRootBlock());
          }
        }
      } else {
        // --- This is a CREATE, CHANGE, or MOVE event ---
        currentBlocks[e.blockId] = true;

        // Re-compile the root of the stack that was just modified.
        var newRoot = eventBlock.getRootBlock();
        compileRoot(newRoot);

        // **THE FIX**
        // Use `instanceof` to check for the move event.
        // This handles "dragging a block out" of the stack.
        if (
          (e instanceof Blockly.Events.Move || e.type == "move") &&
          e.oldParentId
        ) {
          var oldParentBlock = workspace.getBlockById(e.oldParentId);
          if (oldParentBlock) {
            var oldRoot = oldParentBlock.getRootBlock();
            // Only recompile if the block moved to a *different* stack
            if (oldRoot.id !== newRoot.id) {
              compileRoot(oldRoot);
            }
          }
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
  spr.threadEndListener = function (id) {
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
          workspace.glowStack(id, false);
        }
      }, 1000 / 30);
    }
  };

  setTimeout(function () {
    Blockly.svgResize(workspace);
  }, 0);

  if (typeof spr._editor_scrollX == "number") {
    workspace.scrollX = spr._editor_scrollX;
    workspace.scrollY = spr._editor_scrollY;
    workspace.scale = spr._editor_scale;
    workspace.resize();
  }

  disposingWorkspace = false;
  Blockly.Events.enable();
}

function setCurrentSprite(index, forced) {
  if (!forced) {
    if (currentSelectedSpriteIndex == index) {
      return;
    }
  }
  if (currentSelectedSprite) {
    currentSelectedSprite.threadStartListener = null;
    currentSelectedSprite.threadEndListener = null;
    if (workspace) {
      currentSelectedSprite._editor_scrollX = workspace.scrollX;
      currentSelectedSprite._editor_scrollY = workspace.scrollY;
      currentSelectedSprite._editor_scale = workspace.scale;
      currentSelectedSprite.blocklyXML = Blockly.Xml.workspaceToDom(workspace);
    }
  }
  currentSelectedSpriteIndex = index;
  currentSelectedSprite = engine.sprites[index];

  spriteNameInput.value = currentSelectedSprite.name;
  spriteXPosInput.value = currentSelectedSprite.x;
  spriteYPosInput.value = currentSelectedSprite.y;
  updateSpritesContainer();
  loadCode(currentSelectedSprite);
  costumeViewer.reloadCostumes(currentSelectedSprite, function () {
	  setCurrentSprite(index, true);
  });
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
    if (
      spriteHiddenInput.checked !==
      currentSelectedSprite.hidden
    ) {
      spriteHiddenInput.checked = currentSelectedSprite.hidden;
    }
  }
}, 1000 / 30);

module.exports = {
  setCurrentSprite,
  updateSpritesContainer,
  getCurSprite,
  getCurSpriteIndex,
  loadCode,
};
