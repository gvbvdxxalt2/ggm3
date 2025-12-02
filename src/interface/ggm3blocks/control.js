Blockly.Blocks["control_while"] = {
  init: function () {
    this.jsonInit({
      message0: "while %1",
      message1: "%1",
      message2: "%1",
      lastDummyAlign2: "RIGHT",
      args0: [
        {
          type: "input_value",
          name: "CONDITION",
          check: "Boolean",
        },
      ],
      args1: [
        {
          type: "input_statement",
          name: "SUBSTACK",
        },
      ],
      args2: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "repeat.svg",
          width: 24,
          height: 24,
          alt: "*",
          flip_rtl: true,
        },
      ],
      category: Blockly.Categories.control,
      extensions: ["colours_control", "shape_statement"],
    });
  },
};

Blockly.Blocks["control_elapsed"] = {
  init: function () {
    this.jsonInit({
      message0: "elapsed frame time",
      args0: [],
      category: Blockly.Categories.control,
      extensions: ["colours_control", "output_number"],
    });
  },
};

Blockly.Blocks["control_isclone"] = {
  init: function () {
    this.jsonInit({
      message0: "Is a clone?",
      args0: [],
      category: Blockly.Categories.control,
      extensions: ["colours_control", "output_boolean"],
    });
  },
};
