Blockly.Blocks["loader_costumeisloaded"] = {
  init: function () {
    this.jsonInit({
      message0: "Is costume %1 loaded?",
      args0: [
        {
          type: "input_value",
          name: "COSTUME",
        },
      ],
      colour: "#0066a1",
      extensions: ["output_boolean"],
    });
  },
};

Blockly.Blocks["loader_loadcostume"] = {
  init: function () {
    this.jsonInit({
      message0: "Load costume %1",
      args0: [
        {
          type: "input_value",
          name: "COSTUME",
        },
      ],
      colour: "#0066a1",
      extensions: ["shape_statement"],
    });
  },
};

Blockly.Blocks["loader_deloadcostume"] = {
  init: function () {
    this.jsonInit({
      message0: "Deload costume %1",
      args0: [
        {
          type: "input_value",
          name: "COSTUME",
        },
      ],
      colour: "#0066a1",
      extensions: ["shape_statement"],
    });
  },
};

Blockly.Blocks["loader_rendercostumescale"] = {
  init: function () {
    this.jsonInit({
      message0: "Set costume %1 to render at scale %2",
      args0: [
        {
          type: "input_value",
          name: "COSTUME",
        },
        {
          type: "input_value",
          name: "SCALE",
        },
      ],
      colour: "#0066a1",
      extensions: ["shape_statement"],
    });
  },
};

Blockly.Blocks["loader_setrenderscale"] = {
  init: function () {
    this.jsonInit({
      message0: "Render costume %1 at set scale",
      args0: [
        {
          type: "input_value",
          name: "COSTUME",
        },
      ],
      colour: "#0066a1",
      extensions: ["shape_statement"],
    });
  },
};


Blockly.Blocks["loader_costume_scale"] = {
  init: function () {
    this.jsonInit({
      message0: "Costume %1 scale",
      args0: [
        {
          type: "input_value",
          name: "COSTUME",
        },
      ],
      colour: "#0066a1",
      extensions: ["output_number"],
    });
  },
};
