var elements = require("../../gp2/elements.js");

function init(state, deps) {
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
    deps.engine.createEmptySprite();
    deps.engine.makeUniqueSpriteNames();
    if (typeof deps.onSetCurrentSprite === "function") {
      deps.onSetCurrentSprite(deps.engine.sprites.length - 1);
    }
  });

  function getErrorLogDiv(error) {
    var logDiv = document.createElement("div");
    logDiv.className = "errorLogError";
    logDiv.textContent = error.toString();
    return logDiv;
  }

  function updateSpritesContainer() {
    var engine = deps.engine;
    elements.setInnerJSON(
      spritesContainer,
      engine.sprites.map((spr, i) => {
        return {
          element: "div",
          className: "spriteContainer",
          style: {
            cursor: "grab",
          },
          eventListeners: [
            {
              event: "dragover",
              func: function (evt) {
                try {
                  evt.preventDefault();
                  var elm = evt.currentTarget || evt.target;
                  elm.classList.add("sprite-drop-target");
                } catch (err) {}
              },
            },
            {
              event: "dragleave",
              func: function (evt) {
                try {
                  var elm = evt.currentTarget || evt.target;
                  elm.classList.remove("sprite-drop-target");
                } catch (err) {}
              },
            },
            {
              event: "mouseup",
              func: function (evt) {
                var elm = evt.currentTarget || evt.target;
                
                // --- FIX 1: Ignore if clicking buttons ---
                // If the user clicked "Select", "Delete", etc., stop here.
                if (evt.target.tagName === "BUTTON") return;
                // -----------------------------------------

                try {
                  elm.classList.remove("sprite-drop-target");
                } catch (err) {}

                var draggedBlock = null;
                
                // --- FIX 2: Strict Drag Check ---
                // Blockly.selected exists even if you just click a block. 
                // We must check if a drag is actually IN PROGRESS.
                // Depending on your Blockly version, use isDragging() or check the gesture.
                if (Blockly.Gesture && Blockly.Gesture.inProgress) {
                    // Modern Blockly
                    draggedBlock = Blockly.selected; 
                } else if (Blockly.dragMode_ !== 0) { 
                    // Older Blockly / Internal flag check
                    draggedBlock = Blockly.selected;
                } else if (window.__ggm3_currentDragBlock) {
                    // Your custom drag handler
                    draggedBlock = window.__ggm3_currentDragBlock;
                }
                
                // If we still don't think we are dragging, STOP.
                if (!draggedBlock) return;

                try {
                  if (!draggedBlock.workspace) return;
                  var srcWorkspace = deps.blocks.getCurrentWorkspace();
                  if (draggedBlock.workspace !== srcWorkspace) return;
                } catch (err) {
                  return;
                }

                if (i === state.currentSelectedSpriteIndex) return;
                if (
                  state.currentSelectedSprite &&
                  state.currentSelectedSprite.clones
                ) {
                  if (state.currentSelectedSprite.clones.indexOf(spr) !== -1)
                    return;
                }

                try {
                  var root = draggedBlock.getRootBlock();
                  if (!root) return;
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

                  var xmlBlock = Blockly.Xml.blockToDom(root);
                  Blockly.Xml.domToBlock(xmlBlock, tempWorkspace);

                  try {
                    if (
                      state.currentSelectedSprite &&
                      state.currentSelectedSprite.variables
                    ) {
                      for (var varId of Object.keys(
                        state.currentSelectedSprite.variables,
                      )) {
                        if (!spr.variables[varId]) {
                          spr.variables[varId] =
                            state.currentSelectedSprite.variables[varId];
                        }
                      }
                    }
                    if (
                      state.currentSelectedSprite &&
                      state.currentSelectedSprite.spriteProperties
                    ) {
                      for (var propName of Object.keys(
                        state.currentSelectedSprite.spriteProperties,
                      )) {
                        if (!spr.spriteProperties[propName]) {
                          spr.spriteProperties[propName] =
                            state.currentSelectedSprite.spriteProperties[
                              propName
                            ];
                        }
                      }
                    }
                  } catch (varErr) {
                    console.warn(
                      "Warning: could not copy variables to target sprite:",
                      varErr,
                    );
                  }

                  spr.blocklyXML = Blockly.Xml.workspaceToDom(tempWorkspace);

                  tempWorkspace.dispose();
                  div.remove();

                  try {
                    deps.compile.compileSpriteXML(spr);
                  } catch (e) {}

                  updateSpritesContainer();
                } catch (err) {
                  console.error("Error copying block to sprite:", err);
                }
              },
            },
          ],
          GPWhenCreated: function (elm) {
            if (state.currentSelectedSpriteIndex == i) {
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
                    try {
                      if (typeof deps.onSetCurrentSprite === "function") {
                        deps.onSetCurrentSprite(i);
                      }
                    } catch (e) {
                      window.alert("Error selecting sprite: " + e.message);
                    }
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
                    if (deps.engine.sprites.length > 1) {
                      var newIndex = state.currentSelectedSpriteIndex;
                      deps.engine.deleteSprite(spr);
                      if (
                        state.currentSelectedSpriteIndex >
                        deps.engine.sprites.length - 1
                      ) {
                        newIndex = deps.engine.sprites.length - 1;
                      }
                      if (typeof deps.onSetCurrentSprite === "function") {
                        deps.onSetCurrentSprite(newIndex, true);
                      }
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
                    deps.workspace.saveCurrentSpriteCode();
                    var newSprite = deps.engine.duplicateSprite(spr);
                    if (spr && spr.blocklyXML) {
                      try {
                        newSprite.blocklyXML = Blockly.Xml.textToDom(
                          Blockly.Xml.domToText(spr.blocklyXML),
                        );
                      } catch (e) {
                        console.warn("Failed to copy blockly XML:", e);
                      }
                    }
                    deps.compile.compileSpriteXML(newSprite);
                    deps.engine.makeUniqueSpriteNames();
                    try {
                      var newIndex = deps.engine.sprites.indexOf(newSprite);
                      if (newIndex !== -1) {
                        if (typeof deps.onSetCurrentSprite === "function") {
                          deps.onSetCurrentSprite(newIndex, true);
                        }
                      } else {
                        updateSpritesContainer();
                      }
                    } catch (e) {
                      updateSpritesContainer();
                    }
                  },
                },
              ],
            },

            {
              element: "button",
              className: "greyButtonStyle",
              textContent: "Export",
              style: {
                fontSize: "15px",
                marginRight: "5px",
              },
              eventListeners: [
                {
                  event: "click",
                  func: async function (elm) {
                    deps.exportSprite(spr);
                  },
                },
              ],
            },
          ],
        };
      }),
    );
  }

  spriteNameInput.addEventListener("input", () => {
    if (!state.currentSelectedSprite) return;
    state.currentSelectedSprite.name = spriteNameInput.value;
    deps.engine.makeUniqueSpriteNames();
    updateSpritesContainer();
  });
  spriteXPosInput.addEventListener("input", () => {
    if (!state.currentSelectedSprite) return;
    state.currentSelectedSprite.x = +spriteXPosInput.value || 0;
  });
  spriteYPosInput.addEventListener("input", () => {
    if (!state.currentSelectedSprite) return;
    state.currentSelectedSprite.y = +spriteYPosInput.value || 0;
  });
  spriteDirectionInput.addEventListener("input", () => {
    if (!state.currentSelectedSprite) return;
    state.currentSelectedSprite.direction = +spriteDirectionInput.value || 0;
  });
  spriteSizeInput.addEventListener("input", () => {
    if (!state.currentSelectedSprite) return;
    state.currentSelectedSprite.size = +spriteSizeInput.value || 0;
  });
  spriteHiddenInput.addEventListener("input", () => {
    if (!state.currentSelectedSprite) return;
    state.currentSelectedSprite.hidden = spriteHiddenInput.checked;
  });

  setInterval(() => {
    if (state.currentSelectedSprite) {
      if (spriteNameInput.value !== state.currentSelectedSprite.name) {
        spriteNameInput.value = state.currentSelectedSprite.name;
      }
      if (
        Math.round(+spriteXPosInput.value || 0) !==
        Math.round(state.currentSelectedSprite.x)
      ) {
        spriteXPosInput.value = Math.round(state.currentSelectedSprite.x);
      }
      if (
        Math.round(+spriteYPosInput.value || 0) !==
        Math.round(state.currentSelectedSprite.y)
      ) {
        spriteYPosInput.value = Math.round(state.currentSelectedSprite.y);
      }
      if (
        Math.round(+spriteDirectionInput.value || 0) !==
        Math.round(state.currentSelectedSprite.direction)
      ) {
        spriteDirectionInput.value = Math.round(
          state.currentSelectedSprite.direction,
        );
      }
      if (
        Math.round(+spriteSizeInput.value || 0) !==
        Math.round(state.currentSelectedSprite.size)
      ) {
        spriteSizeInput.value = Math.round(state.currentSelectedSprite.size);
      }
      if (spriteHiddenInput.checked !== state.currentSelectedSprite.hidden) {
        spriteHiddenInput.checked = state.currentSelectedSprite.hidden;
      }
    }
  }, 1000 / 30);

  // Make sprites sortable
  deps.makeSortable(
    spritesContainer,
    ".spriteContainer",
    (oldIndex, newIndex) => {
      if (oldIndex === newIndex) return;
      var spriteToMove = deps.engine.sprites[oldIndex];
      deps.engine.sprites.splice(oldIndex, 1);
      deps.engine.sprites.splice(newIndex, 0, spriteToMove);
      if (state.currentSelectedSprite) {
        state.currentSelectedSpriteIndex = deps.engine.sprites.indexOf(
          state.currentSelectedSprite,
        );
      }
      deps.engine.makeUniqueSpriteNames();
      updateSpritesContainer();
    },
  );

  return {
    updateSpritesContainer,
    getErrorLogDiv,
    errorLogsContainerRef: errorLogsContainer,
  };
}

module.exports = { init };
