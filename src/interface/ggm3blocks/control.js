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

Blockly.Blocks['control_stop'] = {
  /**
   * Block for stop all scripts.
   * @this Blockly.Block
   */
  init: function() {
    var THIS_SCRIPT = 'this script';
    var OTHER_SCRIPTS = 'other scripts in sprite';
    var stopDropdown = new Blockly.FieldDropdown(function() {
      if (this.sourceBlock_ &&
          this.sourceBlock_.nextConnection &&
          this.sourceBlock_.nextConnection.isConnected()) {
        return [
          ["other scripts in sprite", OTHER_SCRIPTS]
        ];
      }
      return [
        ["this script", THIS_SCRIPT],
        ["other scripts in sprite", OTHER_SCRIPTS]
      ];
    }, function(option) {
      // Create an event group to keep field value and mutator in sync
      // Return null at the end because setValue is called here already.
      Blockly.Events.setGroup(true);
      var oldMutation = Blockly.Xml.domToText(this.sourceBlock_.mutationToDom());
      this.sourceBlock_.setNextStatement(option == OTHER_SCRIPTS);
      var newMutation = Blockly.Xml.domToText(this.sourceBlock_.mutationToDom());
      Blockly.Events.fire(new Blockly.Events.BlockChange(this.sourceBlock_,
          'mutation', null, oldMutation, newMutation));
      this.setValue(option);
      Blockly.Events.setGroup(false);
      return null;
    });
    this.appendDummyInput()
        .appendField("stop")
        .appendField(stopDropdown, 'STOP_OPTION');
    this.setCategory(Blockly.Categories.control);
    this.setColour(Blockly.Colours.control.primary,
        Blockly.Colours.control.secondary,
        Blockly.Colours.control.tertiary,
        Blockly.Colours.control.quaternary
    );
    this.setPreviousStatement(true);
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('hasnext', this.nextConnection != null);
    return container;
  },
  domToMutation: function(xmlElement) {
    var hasNext = (xmlElement.getAttribute('hasnext') == 'true');
    this.setNextStatement(hasNext);
  }
};