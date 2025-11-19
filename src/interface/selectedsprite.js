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
                  setCurrentSprite(i);
                },
              },
            ],
          },
        ],
      };
    })
  );
}

function loadCode(spr) {
  if (!spr) {
    return;
  }
  blocks.createFreshWorkspace(spr);
  var workspace = blocks.getCurrentWorkspace();
  if (spr.blocklyXML) {
    Blockly.Xml.domToWorkspace(spr.blocklyXML, workspace);
  }
  workspace.addChangeListener(function (e) {
    spr.blocklyXML = Blockly.Xml.workspaceToDom(workspace);
    if (e.element == "stackclick") {
      var code = compiler.compileBlock(workspace.getBlockById(e.blockId));
      window.alert(code);
    }
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
      spriteXPosInput.value.trim() !== currentSelectedSprite.x.toString().trim()
    ) {
      spriteXPosInput.value = currentSelectedSprite.x.toString().trim();
    }
    if (
      spriteYPosInput.value.trim() !== currentSelectedSprite.y.toString().trim()
    ) {
      spriteYPosInput.value = currentSelectedSprite.y.toString().trim();
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
