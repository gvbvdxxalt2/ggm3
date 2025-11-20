var elements = require("../gp2/elements.js");
var AElement = require("../gp2/aelement.js");

var engine = require("./curengine.js");
var blocks = require("./blocks.js");
var costumeViewer = require("./costumeviewer.js");
var compiler = require("../compiler");

var currentSelectedSprite = null;
var currentSelectedSpriteIndex = null;

var spriteNameInput = elements.getGPId("spriteNameInput");
var spriteXPosInput = elements.getGPId("spriteXPosInput");
var spriteYPosInput = elements.getGPId("spriteYPosInput");
var spriteDirectionInput = elements.getGPId("spriteDirectionInput");
var spriteSizeInput = elements.getGPId("spriteSizeInput");

var spritesContainer = elements.getGPId("spritesContainer");

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
            element: "span",
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
                    engine.deleteSprite(spr);
                    setCurrentSprite(0);
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
  disposingWorkspace = true;
  Blockly.Events.disable();
  blocks.createFreshWorkspace(spr);
  workspace = blocks.getCurrentWorkspace();
  if (spr.blocklyXML) {
    Blockly.Xml.domToWorkspace(spr.blocklyXML, workspace);
  }
  var currentBlocks = {};
  var currentBlockParentIDs = {};

  function compileFromBlockID (blockId) {
    var thread = spr.runningStacks[blockId];
    if (thread) {
      thread.stop();
    }

    //Compile the block if its edited.
    var block = workspace.getBlockById(blockId);
    var firstBlock = block.getRootBlock();
    var code = compiler.compileBlock(firstBlock); //This only generates the block or returns an empty string if its not a event (hat) block.
    spr.runFunction(code); //Usually this code would generate some type of addEventListener which is safe to run a lot.
  }

  workspace.addChangeListener(function (e) {
    if (disposingWorkspace) {
      //window.alert(JSON.stringify(e));
      //disposingWorkspace = false;
      return;
    }
    spr.blocklyXML = Blockly.Xml.workspaceToDom(workspace);
    if (e.element == "click") {
      var root = workspace.getBlockById(e.blockId).getRootBlock();
      if (!spr.runningStacks[root.id]) {
        var code = compiler.compileBlockWithThreadForced(
          root
        );
        //window.alert(code);
        spr.runFunction(code);
      } else {
        spr.runningStacks[root.id].stop();
      }
    } else if (e.blockId && e.element !== "stackclick") {
      if (!workspace.getBlockById(e.blockId)) {
        if (currentBlocks[e.blockId]) {
          //Stop the block and remove the hat event if it exists.
          var thread = spr.runningStacks[e.blockId];
          if (thread) {
            thread.stop();
          }
        }
        spr.removeStackListener(e.blockId);
        delete currentBlocks[e.blockId];
      } else {
        currentBlocks[e.blockId] = true;

        var thread = spr.runningStacks[e.blockId];
        if (thread) {
          thread.stop();
        }

        //Compile the block if its edited.
        var block = workspace.getBlockById(e.blockId);
        var firstBlock = block.getRootBlock();
        currentBlockParentIDs[e.blockId] = firstBlock.id;
        compileFromBlockID(e.blockId);
      }
    }
  });
  for (var id of Object.keys(spr.runningStacks)) {
    if (workspace.getBlockById(id)) {
      workspace.glowStack(id, true);
    }
  }
  spr.threadStartListener = function (id) {
    if (disposingWorkspace) {
      return;
    }
    if (workspace.getBlockById(id)) {
      workspace.glowStack(id, true);
    }
  };
  spr.threadEndListener = function (id) {
    if (disposingWorkspace) {
      return;
    }
    if (workspace.getBlockById(id)) {
      workspace.glowStack(id, false);
    }
  };

  setTimeout(function () {
    Blockly.svgResize(workspace);
  }, 0);

  disposingWorkspace = false;
  Blockly.Events.enable();
}

function setCurrentSprite(index) {
  if (currentSelectedSpriteIndex == index) {
    return;
  }
  if (currentSelectedSprite) {
    currentSelectedSprite.threadStartListener = null;
    currentSelectedSprite.threadEndListener = null;
    if (workspace) {
      // Get the current scrollbar positions
      const metrics = workspace.getMetrics();
      currentSelectedSprite.scrollX = metrics.scrollLeft;
      currentSelectedSprite.scrollY = metrics.scrollTop;
    }
  }
  currentSelectedSpriteIndex = index;
  currentSelectedSprite = engine.sprites[index];

  spriteNameInput.value = currentSelectedSprite.name;
  spriteXPosInput.value = currentSelectedSprite.x;
  spriteYPosInput.value = currentSelectedSprite.y;
  updateSpritesContainer();
  loadCode(currentSelectedSprite);
  costumeViewer.reloadCostumes(currentSelectedSprite);
}

spriteNameInput.addEventListener("input", () => {
  if (!currentSelectedSprite) {
    return;
  }
  currentSelectedSprite.name = spriteNameInput.value.trim();
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
  }
}, 1000 / 30);

module.exports = {
  setCurrentSprite,
  updateSpritesContainer,
  getCurSprite,
  getCurSpriteIndex,
  loadCode,
};
