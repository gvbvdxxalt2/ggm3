var engine = require("./curengine.js");
var tabs = require("./tabs.js");
var helpers = {
  //overriden by selectedsprite.js
  loadWorkspaceFromSprite: function (func) {},
};

function loadGlobalVariableBlocks(spr) {
  function contextMenuFunction(options) {
    var variableField = this.getField("VARIABLE");
    if (variableField) {
      var variableName = variableField.getValue();
      // Try to get main workspace from flyout/toolbox
      var mainWorkspace = null;
      if (this.workspace && this.workspace.targetWorkspace) {
        mainWorkspace = this.workspace.targetWorkspace;
      } else if (
        this.workspace &&
        this.workspace.options &&
        this.workspace.options.parentWorkspace
      ) {
        mainWorkspace = this.workspace.options.parentWorkspace;
      } else if (window.Blockly && Blockly.getMainWorkspace) {
        mainWorkspace = Blockly.getMainWorkspace();
      }

      options.push({
        text: "Delete variable",
        enabled: true,
        callback: function () {
          Blockly.confirm(
            `Delete global variable "${variableName}"? This will also delete all blocks using this variable.`,
            function (accepted) {
              if (accepted) {
                engine.removeGlobalVariable(variableName);

                // Refresh toolbox in main workspace
                mainWorkspace.getToolbox().refreshSelection();
                
                // Helper to delete blocks in a workspace
                function deleteBlocksInWorkspace(workspace) {
                  if (workspace && workspace.getAllBlocks) {
                    var blocks = workspace.getAllBlocks(false);
                    for (var i = blocks.length - 1; i >= 0; i--) {
                      var block = blocks[i];
                      if (
                        block.type === "globaldata_get" ||
                        block.type === "globaldata_set" ||
                        block.type === "globaldata_changeby"
                      ) {
                        var field = block.getField("VARIABLE");
                        if (field && field.getText() === variableName) {
                          block.dispose(true);
                        }
                      }
                    }
                  }
                }

                // Delete in main workspace
                deleteBlocksInWorkspace(mainWorkspace);

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
                // Delete in all sprite workspaces
                if (engine.sprites && Array.isArray(engine.sprites)) {
                  for (var s = 0; s < engine.sprites.length; s++) {
                    var sprite = engine.sprites[s];
                    if (sprite.id !== spr.id) {
                      if (sprite) {
                        tempWorkspace.clear();
                        if (sprite.blocklyXML) {
                          Blockly.Xml.domToWorkspace(
                            sprite.blocklyXML,
                            tempWorkspace,
                          );
                        }
                        deleteBlocksInWorkspace(tempWorkspace);
                        sprite.blocklyXML =
                          Blockly.Xml.workspaceToDom(tempWorkspace);
                      }
                    }
                  }
                }
                tempWorkspace.dispose();
                div.remove();

                // Refresh toolbox in main workspace
                mainWorkspace.getToolbox().refreshSelection();

                Blockly.svgResize(mainWorkspace);
              }
            },
          );
        },
      });

      var _this = this;
      Object.keys(engine.globalVariables).forEach(function (name) {
        if (name !== variableName) {
          options.push({
            text: name,
            enabled: !this.isInFlyout,
            callback: function () {
              _this.setFieldValue(name, "VARIABLE");
            },
          });
        }
      });
    }
  }
  Blockly.Blocks["globaldata_get"] = {
    init: function () {
      this.jsonInit({
        message0: "%1",
        args0: [
          {
            type: "field_label_serializable",
            name: "VARIABLE",
            //options: menu,
          },
        ],
        colour: "#00c756",
        extensions: ["output_string"],
      });
    },
    customContextMenu: contextMenuFunction,
  };

  Blockly.Blocks["globaldata_set"] = {
    init: function () {
      this.jsonInit({
        message0: "set %1 to %2",
        args0: [
          {
            type: "field_dropdown",
            name: "VARIABLE",
            options: function () {
              var currentMenu = Object.keys(engine.globalVariables).map(
                (name, i) => {
                  return [name, name];
                },
              );
              if (currentMenu.length < 1) {
                currentMenu = [["(No Global Variables)", "none"]];
              }
              return currentMenu;
            },
          },
          {
            type: "input_value",
            name: "VALUE",
          },
        ],
        colour: "#00c756",
        extensions: ["shape_statement"],
      });
    },
    customContextMenu: contextMenuFunction,
  };

  Blockly.Blocks["globaldata_changeby"] = {
    init: function () {
      this.jsonInit({
        message0: "change %1 by %2",
        args0: [
          {
            type: "field_dropdown",
            name: "VARIABLE",
            options: function () {
              var currentMenu = Object.keys(engine.globalVariables).map(
                (name, i) => {
                  return [name, name];
                },
              );
              if (currentMenu.length < 1) {
                currentMenu = [["(No Global Variables)", "none"]];
              }
              return currentMenu;
            },
          },
          {
            type: "input_value",
            name: "VALUE",
          },
        ],
        colour: "#00c756",
        extensions: ["shape_statement"],
      });
    },
    customContextMenu: contextMenuFunction,
  };
}

function loadPropertyVariableBlocks(spr) {
  function contextMenuFunction(options) {
    var variableField = this.getField("VARIABLE");
    if (variableField) {
      var variableName = variableField.getValue();
      // Try to get main workspace from flyout/toolbox
      var mainWorkspace = null;
      if (this.workspace && this.workspace.targetWorkspace) {
        mainWorkspace = this.workspace.targetWorkspace;
      } else if (
        this.workspace &&
        this.workspace.options &&
        this.workspace.options.parentWorkspace
      ) {
        mainWorkspace = this.workspace.options.parentWorkspace;
      } else if (window.Blockly && Blockly.getMainWorkspace) {
        mainWorkspace = Blockly.getMainWorkspace();
      }

      options.push({
        text: "Delete property",
        enabled: true,
        callback: function () {
          Blockly.confirm(
            `Delete sprite property "${variableName}"? This will also delete all blocks using this property.`,
            function (accepted) {
              if (accepted) {
                engine.removeGlobalVariable(variableName);

                // Helper to delete blocks in a workspace
                function deleteBlocksInWorkspace(workspace) {
                  if (workspace && workspace.getAllBlocks) {
                    var blocks = workspace.getAllBlocks(false);
                    for (var i = blocks.length - 1; i >= 0; i--) {
                      var block = blocks[i];
                      if (
                        block.type === "propertydata_get" ||
                        block.type === "propertydata_set" ||
                        block.type === "propertydata_changeby"
                      ) {
                        var field = block.getField("VARIABLE");
                        if (field && field.getText() === variableName) {
                          block.dispose(true);
                        }
                      }
                    }
                  }
                }

                // Delete in main workspace
                deleteBlocksInWorkspace(mainWorkspace);

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
                // Delete in all sprite workspaces
                if (engine.sprites && Array.isArray(engine.sprites)) {
                  for (var s = 0; s < engine.sprites.length; s++) {
                    var sprite = engine.sprites[s];
                    if (sprite.id !== spr.id) {
                      if (sprite) {
                        tempWorkspace.clear();
                        if (sprite.blocklyXML) {
                          Blockly.Xml.domToWorkspace(
                            sprite.blocklyXML,
                            tempWorkspace,
                          );
                        }
                        deleteBlocksInWorkspace(tempWorkspace);
                        sprite.blocklyXML =
                          Blockly.Xml.workspaceToDom(tempWorkspace);
                      }
                    }
                  }
                }
                tempWorkspace.dispose();
                div.remove();

                // Refresh toolbox in main workspace
                if (
                  mainWorkspace &&
                  mainWorkspace.getToolbox &&
                  mainWorkspace.getToolbox()
                ) {
                  mainWorkspace.getToolbox().refreshSelection();
                }
              }
            },
          );
        },
      });

      var _this = this;
      Object.keys(engine.propertyVariables).forEach(function (name) {
        if (name !== variableName) {
          options.push({
            text: name,
            enabled: !this.isInFlyout,
            callback: function () {
              _this.setFieldValue(name, "VARIABLE");
            },
          });
        }
      });
    }
  }
  Blockly.Blocks["propertydata_get"] = {
    init: function () {
      this.jsonInit({
        message0: "%1 %2",
        args0: [
          {
            type: "input_value",
            name: "TARGET_SPRITE",
            //options: menu,
          },
          {
            type: "field_label_serializable",
            name: "VARIABLE",
            //options: menu,
          },
        ],
        colour: "#d1cd77",
        extensions: ["output_string"],
      });
    },
    customContextMenu: contextMenuFunction,
  };

  Blockly.Blocks[
    "spritemaster_checktouchingsprite_equals_propertyvalue"
  ]._listProperties = function () {
    var currentMenu = Object.keys(engine.propertyVariables).map((name, i) => {
      return [name, name];
    });
    if (currentMenu.length < 1) {
      currentMenu = [["(No Sprite Properties)", "none"]];
    }
    return currentMenu;
  };

  Blockly.Blocks["propertydata_set"] = {
    init: function () {
      this.jsonInit({
        message0: "on %1 set %2 to %3",
        args0: [
          {
            type: "input_value",
            name: "TARGET_SPRITE",
            //options: menu,
          },
          {
            type: "field_dropdown",
            name: "VARIABLE",
            options: function () {
              var currentMenu = Object.keys(engine.propertyVariables).map(
                (name, i) => {
                  return [name, name];
                },
              );
              if (currentMenu.length < 1) {
                currentMenu = [["(No Sprite Properties)", "none"]];
              }
              return currentMenu;
            },
          },
          {
            type: "input_value",
            name: "VALUE",
          },
        ],
        colour: "#d1cd77",
        extensions: ["shape_statement"],
      });
    },
    customContextMenu: contextMenuFunction,
  };

  Blockly.Blocks["propertydata_changeby"] = {
    init: function () {
      this.jsonInit({
        message0: "on %1 change %2 by %3",
        args0: [
          {
            type: "input_value",
            name: "TARGET_SPRITE",
            //options: menu,
          },
          {
            type: "field_dropdown",
            name: "VARIABLE",
            options: function () {
              var currentMenu = Object.keys(engine.propertyVariables).map(
                (name, i) => {
                  return [name, name];
                },
              );
              if (currentMenu.length < 1) {
                currentMenu = [["(No Sprite Properties)", "none"]];
              }
              return currentMenu;
            },
          },
          {
            type: "input_value",
            name: "VALUE",
          },
        ],
        colour: "#d1cd77",
        extensions: ["shape_statement"],
      });
    },
    customContextMenu: contextMenuFunction,
  };
}

function getSpriteMenuFunction(spr, defaultOptions) {
  var sprites = engine.sprites;
  return function () {
    var allSpritesExceptSelf = sprites.filter((spr2) => spr.id !== spr2.id);
    var spriteOptions = allSpritesExceptSelf.map((s) => [s.name, s.name]);

    return defaultOptions.concat(spriteOptions);
  };
}

function getCostumeMenuFunction(spr) {
  return function () {
    var costumeMenu = spr.costumes.map((costume, i) => {
      return [costume.name, costume.name];
    });
    if (costumeMenu.length < 1) {
      costumeMenu = [["(No costumes)", ""]];
    }
    return costumeMenu;
  };
}

function getSoundMenuFunction(spr) {
  return function () {
    var soundMenu = spr.sounds.map((sound, i) => {
      return [sound.name, sound.name];
    });
    if (soundMenu.length < 1) {
      soundMenu = [["(No sounds)", ""]];
    }
    return soundMenu;
  };
}

function loadBlockMenus(spr) {
  Blockly.Blocks["spritemaster_sprite"] = {
    init: function () {
      this.jsonInit({
        message0: "%1",
        args0: [
          {
            type: "field_dropdown",
            name: "SPRITE",
            options: getSpriteMenuFunction(spr, [["myself", "__myself__"]]),
          },
        ],
        extensions: ["output_string"],
        colour: "#c70000",
      });
    },
  };
  Blockly.Blocks["propertydata_sprite"] = {
    init: function () {
      this.jsonInit({
        message0: "%1",
        args0: [
          {
            type: "field_dropdown",
            name: "TARGET_SPRITE",
            options: getSpriteMenuFunction(spr, [["myself", "__myself__"]]),
          },
        ],
        extensions: ["output_string"],
        colour: "#d1cd77",
      });
    },
  };
  Blockly.Blocks["sensing_touchingobjectmenu"] = {
    init: function () {
      this.jsonInit({
        message0: "%1",
        args0: [
          {
            type: "field_dropdown",
            name: "TOUCHINGOBJECTMENU",
            options: getSpriteMenuFunction(spr, [
              ["mouse pointer", "__mouse_pointer__"],
            ]),
          },
        ],
        extensions: ["colours_sensing", "output_string"],
      });
    },
  };
  Blockly.Blocks["control_create_clone_of_menu"] = {
    init: function () {
      this.jsonInit({
        message0: "%1",
        args0: [
          {
            type: "field_dropdown",
            name: "CLONE_OPTION",
            options: getSpriteMenuFunction(spr, [["myself", "_myself_"]]),
          },
        ],
        extensions: ["colours_control", "output_string"],
      });
    },
  };
  Blockly.Blocks["looks_costume"] = {
    init: function () {
      this.jsonInit({
        message0: "%1",
        args0: [
          {
            type: "field_dropdown",
            name: "COSTUME",
            options: getCostumeMenuFunction(spr),
          },
        ],
        colour: Blockly.Colours.looks.secondary,
        colourSecondary: Blockly.Colours.looks.secondary,
        colourTertiary: Blockly.Colours.looks.tertiary,
        colourQuaternary: Blockly.Colours.looks.quaternary,
        extensions: ["output_string"],
      });
    },
  };
  Blockly.Blocks["loader_costume"] = {
    init: function () {
      this.jsonInit({
        message0: "%1",
        args0: [
          {
            type: "field_dropdown",
            name: "COSTUME",
            options: getCostumeMenuFunction(spr),
          },
        ],
        colour: "#0066a1",
        extensions: ["output_string"],
      });
    },
  };
  Blockly.Blocks["loader_sound_option"] = {
    init: function () {
      this.jsonInit({
        message0: "%1",
        args0: [
          {
            type: "field_dropdown",
            name: "SOUND",
            options: getSoundMenuFunction(spr),
          },
        ],
        colour: "#0066a1",
        extensions: ["output_string"],
      });
    },
  };
  Blockly.Blocks["sound_sounds_menu"] = {
    init: function () {
      this.jsonInit({
        message0: "%1",
        args0: [
          {
            type: "field_dropdown",
            name: "SOUND_MENU",
            options: getSoundMenuFunction(spr),
          },
        ],
        colour: Blockly.Colours.sounds.secondary,
        colourSecondary: Blockly.Colours.sounds.secondary,
        colourTertiary: Blockly.Colours.sounds.tertiary,
        colourQuaternary: Blockly.Colours.sounds.quaternary,
        extensions: ["output_string"],
      });
    },
  };
  loadGlobalVariableBlocks(spr);
  loadPropertyVariableBlocks(spr);
}

module.exports = { loadBlockMenus, helpers };
