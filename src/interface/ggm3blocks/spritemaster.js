var SpriteMasterConsts = require("../../sprmaster.js");

Blockly.Blocks["spritemaster_spriteobjectof"] = {
  init: function () {
    this.jsonInit({
      message0: "sprite object of %1",
      args0: [
        {
          type: "input_value",
          name: "SPRITE",
        },
      ],
      colour: "#c70000",
      extensions: ["output_string"],
    });
  },
};

Blockly.Blocks["spritemaster_spriteproperty"] = {
  init: function () {
    this.jsonInit({
      message0: "%1 %2",
      args0: [
        {
          type: "input_value",
          name: "SPRITE",
        },
        {
          type: "field_dropdown",
          name: "PROPERTY_OPTION",
          options: SpriteMasterConsts.SPRITE_MASTER_DROPDOWN
        },
      ],
      colour: "#c70000",
      extensions: ["output_string"],
    });
  },
};
