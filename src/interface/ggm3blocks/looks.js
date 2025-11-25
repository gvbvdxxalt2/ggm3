Blockly.Blocks["looks_hidden"] = {
  init: function () {
    this.jsonInit({
      message0: "Hidden?",
      category: Blockly.Categories.looks,
      extensions: ["colours_looks", "output_boolean"],
    });
  },
};

Blockly.Blocks["looks_visible"] = {
  init: function () {
    this.jsonInit({
      message0: "Visible?",
      category: Blockly.Categories.looks,
      extensions: ["colours_looks", "output_boolean"],
    });
  },
};

Blockly.Blocks["looks_xstretch_to"] = {
  init: function () {
    this.jsonInit({
      message0: "set x stretch to %1",
      args0: [
        {
          type: "input_value",
          name: "VALUE",
        },
      ],
      category: Blockly.Categories.looks,
      extensions: ["colours_looks", "shape_statement"],
    });
  },
};
Blockly.Blocks["looks_ystretch_to"] = {
  init: function () {
    this.jsonInit({
      message0: "set y stretch to %1",
      args0: [
        {
          type: "input_value",
          name: "VALUE",
        },
      ],
      category: Blockly.Categories.looks,
      extensions: ["colours_looks", "shape_statement"],
    });
  },
};

Blockly.Blocks["looks_xstretch_by"] = {
  init: function () {
    this.jsonInit({
      message0: "change x stretch by %1",
      args0: [
        {
          type: "input_value",
          name: "VALUE",
        },
      ],
      category: Blockly.Categories.looks,
      extensions: ["colours_looks", "shape_statement"],
    });
  },
};
Blockly.Blocks["looks_ystretch_by"] = {
  init: function () {
    this.jsonInit({
      message0: "change y stretch by %1",
      args0: [
        {
          type: "input_value",
          name: "VALUE",
        },
      ],
      category: Blockly.Categories.looks,
      extensions: ["colours_looks", "shape_statement"],
    });
  },
};

Blockly.Blocks["looks_xstretch"] = {
  init: function () {
    this.jsonInit({
      message0: "x stretch",
      category: Blockly.Categories.looks,
      extensions: ["colours_looks", "output_number"],
    });
  },
};
Blockly.Blocks["looks_ystretch"] = {
  init: function () {
    this.jsonInit({
      message0: "y stretch",
      category: Blockly.Categories.looks,
      extensions: ["colours_looks", "output_number"],
    });
  },
};
/*Throw error test thats used to check if error handling works, not used by actual game stuff.*/
Blockly.Blocks["error_test"] = {
  init: function () {
    this.jsonInit({
      message0: "Throw error",
      category: Blockly.Categories.looks,
      extensions: ["colours_looks", "shape_statement"],
    });
  },
};
