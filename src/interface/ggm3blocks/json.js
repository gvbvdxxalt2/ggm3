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
                ["array", "array"]
            ]
          },
      ],
      colour: "#058fff",
      extensions: ["output_number"],
    });
  },
};

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