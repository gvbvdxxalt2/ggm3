var elements = require("../gp2/elements.js");
var AElement = require("../gp2/aelement.js");

var engine = require("./curengine.js");
var blocks = require("./blocks.js");
var tabs = require("./tabs.js");
var costumeViewer = require("./costumeviewer.js");

var currentSelectedSprite = null;
var currentSelectedSpriteIndex = null;

var spriteNameInput = elements.getGPId("spriteNameInput");
var spriteXPosInput = elements.getGPId("spriteXPosInput");
var spriteYPosInput = elements.getGPId("spriteYPosInput");

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
        eventListeners: [
          {
            event: "click",
            func: function (elm) {
              setCurrentSprite(i);
            },
          },
        ],
        children: [
          {
            element: "span",
            textContent: spr.name,
          },
        ],
      };
    })
  );
}

function loadCode(spr) {
  blocks.createFreshWorkspace();
  var workspace = blocks.getCurrentWorkspace();
  if (spr.blocklyXML) {
    Blockly.Xml.domToWorkspace(spr.blocklyXML, workspace);
  }
  workspace.addChangeListener(function (e) {
    spr.blocklyXML = Blockly.Xml.workspaceToDom(workspace);
  });
}

function setCurrentSprite(index) {
  if (currentSelectedSpriteIndex == index) {
    return;
  }
  currentSelectedSpriteIndex = index;
  currentSelectedSprite = engine.sprites[index];

  spriteNameInput.value = currentSelectedSprite.name;
  spriteXPosInput.value = currentSelectedSprite.x;
  spriteYPosInput.value = currentSelectedSprite.y;
  updateSpritesContainer();
  loadCode(currentSelectedSprite);
  tabs.updateVisibility();
  costumeViewer.reloadCostumes(currentSelectedSprite);
}

spriteNameInput.addEventListener("change", () => {
  if (!currentSelectedSprite) {
    return;
  }
  currentSelectedSprite.name = spriteNameInput.value.trim();
});
spriteXPosInput.addEventListener("change", () => {
  if (!currentSelectedSprite) {
    return;
  }
  currentSelectedSprite.x = +spriteXPosInput.value || 0;
});
spriteYPosInput.addEventListener("change", () => {
  if (!currentSelectedSprite) {
    return;
  }
  currentSelectedSprite.y = +spriteYPosInput.value || 0;
});

function getCurSprite() {
  return currentSelectedSprite;
}
function getCurSpriteIndex() {
  return currentSelectedSpriteIndex;
}

module.exports = {
  setCurrentSprite,
  updateSpritesContainer,
  getCurSprite,
  getCurSpriteIndex,
};
