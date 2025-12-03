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

var effectTypes = [
  ["wave time", "waveTime"],
  ["wave x time", "waveXTime"],
  ["wave y time", "waveYTime"],
  ["wave x multiplier", "waveX"],
  ["wave y multiplier", "waveY"],
];

Blockly.Blocks["looks_seteffectto"] = {
  init: function () {
    this.jsonInit({
      message0: "set %1 effect to %2",
      args0: [
        {
          type: "field_dropdown",
          name: "EFFECT",
          options: effectTypes,
        },
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

Blockly.Blocks["looks_change_effect_by"] = {
  init: function () {
    this.jsonInit({
      message0: "change %1 effect by %2",
      args0: [
        {
          type: "field_dropdown",
          name: "EFFECT",
          options: effectTypes,
        },
        {
          type: "input_value",
          name: "BY",
        },
      ],
      category: Blockly.Categories.looks,
      extensions: ["colours_looks", "shape_statement"],
    });
  },
};

Blockly.Blocks["looks_geteffect"] = {
  init: function () {
    this.jsonInit({
      message0: "get effect %1",
      args0: [
        {
          type: "field_dropdown",
          name: "EFFECT",
          options: effectTypes,
        },
      ],
      category: Blockly.Categories.looks,
      extensions: ["colours_looks", "output_number"],
    });
  },
};

Blockly.Blocks["looks_zindex_to"] = {
  init: function () {
    this.jsonInit({
      message0: "set z index to %1",
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

Blockly.Blocks["looks_zindex_by"] = {
  init: function () {
    this.jsonInit({
      message0: "change z index by %1",
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

Blockly.Blocks["looks_zindex"] = {
  init: function () {
    this.jsonInit({
      message0: "z index",
      category: Blockly.Categories.looks,
      extensions: ["colours_looks", "output_number"],
    });
  },
};

Blockly.Blocks["looks_alpha_to"] = {
  init: function () {
    this.jsonInit({
      message0: "set alpha to %1",
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

Blockly.Blocks["looks_alpha_by"] = {
  init: function () {
    this.jsonInit({
      message0: "change alpha by %1",
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

Blockly.Blocks["looks_alpha"] = {
  init: function () {
    this.jsonInit({
      message0: "alpha",
      category: Blockly.Categories.looks,
      extensions: ["colours_looks", "output_number"],
    });
  },
};