Blockly.Blocks["json_new"] = {
  init: function () {
    this.jsonInit({
      message0: "New %1",
      args0: [
        {
          type: "field_dropdown",
          name: "TYPE",
          options: [
            ["object", "object"],
            ["array", "array"],
          ],
        },
      ],
      colour: "#058fff",
      extensions: ["output_number"],
    });
  },
};

//Object blocks:

Blockly.Blocks["json_setto"] = {
  init: function () {
    this.jsonInit({
      message0: "Set %1 to %2 on %3",
      args0: [
        {
          type: "input_value",
          name: "NAME",
        },
        {
          type: "input_value",
          name: "VALUE",
        },
        {
          type: "input_value",
          name: "OBJECT",
        },
      ],
      colour: "#058fff",
      extensions: ["shape_statement"],
    });
  },
};

Blockly.Blocks["json_geton"] = {
  init: function () {
    this.jsonInit({
      message0: "Get %1 on %2",
      args0: [
        {
          type: "input_value",
          name: "NAME",
        },
        {
          type: "input_value",
          name: "OBJECT",
        },
      ],
      colour: "#058fff",
      extensions: ["output_string"],
    });
  },
};

Blockly.Blocks["json_deleteon"] = {
  init: function () {
    this.jsonInit({
      message0: "Delete %1 on %2",
      args0: [
        {
          type: "input_value",
          name: "NAME",
        },
        {
          type: "input_value",
          name: "OBJECT",
        },
      ],
      colour: "#058fff",
      extensions: ["shape_statement"],
    });
  },
};

Blockly.Blocks["json_keys"] = {
  init: function () {
    this.jsonInit({
      message0: "Get value names of %1",
      args0: [
        {
          type: "input_value",
          name: "OBJECT",
        },
      ],
      colour: "#058fff",
      extensions: ["output_string"],
    });
  },
};

Blockly.Blocks["json_tostring"] = {
  init: function () {
    this.jsonInit({
      message0: "%1 to json string",
      args0: [
        {
          type: "input_value",
          name: "OBJECT",
        },
      ],
      colour: "#058fff",
      extensions: ["output_string"],
    });
  },
};

Blockly.Blocks["json_fromstring"] = {
  init: function () {
    this.jsonInit({
      message0: "%1 from json string",
      args0: [
        {
          type: "input_value",
          name: "OBJECT",
        },
      ],
      colour: "#058fff",
      extensions: ["output_string"],
    });
  },
};

//Array blocks:

Blockly.Blocks["json_array_push"] = {
  init: function () {
    this.jsonInit({
      message0: "Add %1 to end of %2",
      args0: [
        {
          type: "input_value",
          name: "VALUE",
        },
        {
          type: "input_value",
          name: "OBJECT",
        },
      ],
      colour: "#058fff",
      extensions: ["shape_statement"],
    });
  },
};

Blockly.Blocks["json_array_unshift"] = {
  init: function () {
    this.jsonInit({
      message0: "Add %1 to start of %2",
      args0: [
        {
          type: "input_value",
          name: "VALUE",
        },
        {
          type: "input_value",
          name: "OBJECT",
        },
      ],
      colour: "#058fff",
      extensions: ["shape_statement"],
    });
  },
};

Blockly.Blocks["json_array_lengthof"] = {
  init: function () {
    this.jsonInit({
      message0: "Length of array %1",
      args0: [
        {
          type: "input_value",
          name: "OBJECT",
        },
      ],
      colour: "#058fff",
      extensions: ["output_number"],
    });
  },
};

Blockly.Blocks["json_array_indexof"] = {
  init: function () {
    this.jsonInit({
      message0: "Index of %1 in %2",
      args0: [
        {
          type: "input_value",
          name: "VALUE",
        },
        {
          type: "input_value",
          name: "OBJECT",
        },
      ],
      colour: "#058fff",
      extensions: ["output_number"],
    });
  },
};

// Additional JSON utility blocks

Blockly.Blocks["json_has_key"] = {
  init: function () {
    this.jsonInit({
      message0: "Has key %1 in %2",
      args0: [
        { type: "input_value", name: "NAME" },
        { type: "input_value", name: "OBJECT" },
      ],
      colour: "#058fff",
      extensions: ["output_boolean"],
    });
  },
};

Blockly.Blocks["json_get_path"] = {
  init: function () {
    this.jsonInit({
      message0: "Get path %1 on %2 default %3",
      args0: [
        { type: "input_value", name: "PATH" },
        { type: "input_value", name: "OBJECT" },
        { type: "input_value", name: "DEFAULT" },
      ],
      colour: "#058fff",
      extensions: ["output_string"],
    });
  },
};

Blockly.Blocks["json_set_path"] = {
  init: function () {
    this.jsonInit({
      message0: "Set path %1 to %2 on %3",
      args0: [
        { type: "input_value", name: "PATH" },
        { type: "input_value", name: "VALUE" },
        { type: "input_value", name: "OBJECT" },
      ],
      colour: "#058fff",
      extensions: ["shape_statement"],
    });
  },
};

Blockly.Blocks["json_delete_path"] = {
  init: function () {
    this.jsonInit({
      message0: "Delete path %1 on %2",
      args0: [
        { type: "input_value", name: "PATH" },
        { type: "input_value", name: "OBJECT" },
      ],
      colour: "#058fff",
      extensions: ["shape_statement"],
    });
  },
};

Blockly.Blocks["json_array_pop"] = {
  init: function () {
    this.jsonInit({
      message0: "Remove last element from %1 and report it",
      args0: [{ type: "input_value", name: "OBJECT" }],
      colour: "#058fff",
      extensions: ["output_string"],
    });
  },
};

Blockly.Blocks["json_array_contains"] = {
  init: function () {
    this.jsonInit({
      message0: "Contains %1 in %2",
      args0: [
        { type: "input_value", name: "VALUE" },
        { type: "input_value", name: "OBJECT" },
      ],
      colour: "#058fff",
      extensions: ["output_boolean"],
    });
  },
};

Blockly.Blocks["json_clone"] = {
  init: function () {
    this.jsonInit({
      message0: "Clone %1",
      args0: [{ type: "input_value", name: "OBJECT" }],
      colour: "#058fff",
      extensions: ["output_string"],
    });
  },
};

Blockly.Blocks["json_parse_safe"] = {
  init: function () {
    this.jsonInit({
      message0: "Parse JSON %1 fallback %2",
      args0: [
        { type: "input_value", name: "STRING" },
        { type: "input_value", name: "DEFAULT" },
      ],
      colour: "#058fff",
      extensions: ["output_string"],
    });
  },
};

Blockly.Blocks["json_pretty_print"] = {
  init: function () {
    this.jsonInit({
      message0: "Pretty print %1 indent %2",
      args0: [
        { type: "input_value", name: "OBJECT" },
        { type: "input_value", name: "INDENT" },
      ],
      colour: "#058fff",
      extensions: ["output_string"],
    });
  },
};

Blockly.Blocks["json_typeof"] = {
  init: function () {
    this.jsonInit({
      message0: "typeof %1",
      args0: [{ type: "input_value", name: "OBJECT" }],
      colour: "#058fff",
      extensions: ["output_string"],
    });
  },
};

Blockly.Blocks["json_array_split"] = {
  init: function () {
    this.jsonInit({
      message0: "split %1 using separator %2",
      args0: [
        { type: "input_value", name: "STRING" },
        { type: "input_value", name: "USING" },
      ],
      colour: "#058fff",
      extensions: ["output_string"],
    });
  },
};

Blockly.Blocks["json_array_join"] = {
  init: function () {
    this.jsonInit({
      message0: "join %1 using separator %2",
      args0: [
        { type: "input_value", name: "ARRAY" },
        { type: "input_value", name: "USING" },
      ],
      colour: "#058fff",
      extensions: ["output_string"],
    });
  },
};
