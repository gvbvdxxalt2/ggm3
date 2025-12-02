var engine = require("./curengine.js");

var helpers = {
  //overriden by selectedsprite.js
  loadWorkspaceFromSprite: function (func) {}
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
      } else if (this.workspace && this.workspace.options && this.workspace.options.parentWorkspace) {
        mainWorkspace = this.workspace.options.parentWorkspace;
      } else if (window.Blockly && Blockly.getMainWorkspace) {
        mainWorkspace = Blockly.getMainWorkspace();
      }

      options.push({
        text: "Delete variable",
        enabled: true,
        callback: function() {
          Blockly.confirm(`Delete global variable "${variableName}"? This will also delete all blocks using this variable.`, function (accepted) {
            if (accepted) {
              engine.removeGlobalVariable(variableName);

              // Helper to delete blocks in a workspace
              function deleteBlocksInWorkspace(workspace) {
                if (workspace && workspace.getAllBlocks) {
                  var blocks = workspace.getAllBlocks(false);
                  for (var i = blocks.length - 1; i >= 0; i--) {
                    var block = blocks[i];
                    if (block.type === "globaldata_get" || block.type === "globaldata_set" || block.type === "globaldata_changeby") {
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
                        Blockly.Xml.domToWorkspace(sprite.blocklyXML, tempWorkspace);
                      }
                      deleteBlocksInWorkspace(tempWorkspace);
                      sprite.blocklyXML = Blockly.Xml.workspaceToDom(tempWorkspace);
                    }
                  }
                }
              }
              tempWorkspace.dispose();
              div.remove();

              // Refresh toolbox in main workspace
              if (mainWorkspace && mainWorkspace.getToolbox && mainWorkspace.getToolbox()) {
                mainWorkspace.getToolbox().refreshSelection();
              }
            }
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
    customContextMenu: contextMenuFunction
  };

  Blockly.Blocks["globaldata_set"] = {
    init: function () {
      this.jsonInit({
        message0: "set %1 to %2",
        args0: [
          {
            type: "field_dropdown",
            name: "VARIABLE",
            options: function() {
              var currentMenu = Object.keys(engine.globalVariables).map((name, i) => {
                return [name, name];
              });
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
    customContextMenu: contextMenuFunction
  };

  Blockly.Blocks["globaldata_changeby"] = {
    init: function () {
      this.jsonInit({
        message0: "change %1 by %2",
        args0: [
          {
            type: "field_dropdown",
            name: "VARIABLE",
            options: function() {
              var currentMenu = Object.keys(engine.globalVariables).map((name, i) => {
                return [name, name];
              });
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
    customContextMenu: contextMenuFunction
  };
}

function loadBlockMenus(spr) {
  var sprites = engine.sprites;
  Blockly.Blocks['sensing_touchingobjectmenu'] = {
  init: function() {
    this.jsonInit({
      "message0": "%1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "TOUCHINGOBJECTMENU",
          "options": [
            ["mouse pointer", '__mouse_pointer__'],
          ].concat(sprites.map(s => [s.name, s.name]))
        }
      ],
      "extensions": ["colours_sensing", "output_string"]
    });
  }
};
  Blockly.Blocks["control_create_clone_of_menu"] = {
    /**
     * Create-clone drop-down menu.
     * @this Blockly.Block
     */
    init: function () {
      this.jsonInit({
        message0: "%1",
        args0: [
          {
            type: "field_dropdown",
            name: "CLONE_OPTION",
            options: [["myself", "_myself_"]].concat(
              sprites.map((s) => [s.name, s.name]),
            ),
          },
        ],
        extensions: ["colours_control", "output_string"],
      });
    },
  };
  Blockly.Blocks["looks_costume"] = {
    init: function () {
      var costumeMenu = spr.costumes.map((costume, i) => {
        return [costume.name, costume.name];
      });
      if (costumeMenu.length < 1) {
        costumeMenu = [["(No Costumes)", null]];
      }
      this.jsonInit({
        message0: "%1",
        args0: [
          {
            type: "field_dropdown",
            name: "COSTUME",
            options: costumeMenu,
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
      var costumeMenu = spr.costumes.map((costume, i) => {
        return [costume.name, costume.name];
      });
      if (costumeMenu.length < 1) {
        costumeMenu = [["(No Costumes)", null]];
      }
      this.jsonInit({
        message0: "%1",
        args0: [
          {
            type: "field_dropdown",
            name: "COSTUME",
            options: costumeMenu,
          },
        ],
        colour: "#0066a1",
        extensions: ["output_string"],
      });
    },
  };

  loadGlobalVariableBlocks(spr);
}

module.exports = { loadBlockMenus, helpers };
