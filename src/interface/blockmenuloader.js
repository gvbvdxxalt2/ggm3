var engine = require("./curengine.js");

function loadBlockMenus(spr) {
  var sprites = engine.sprites;
  var costumeMenu = spr.costumes.map((costume, i) => {
    return [costume.name, costume.name];
  });
  if (costumeMenu.length < 1) {
    costumeMenu = [["(No Costumes)", null]];
  }
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
            options: [["Myself", "_myself_"]].concat(
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
}

module.exports = { loadBlockMenus };
