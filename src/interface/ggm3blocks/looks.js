Blockly.Blocks['looks_hidden'] = {
    init: function() {
      this.jsonInit({
        "message0": "Hidden?",
        "category": Blockly.Categories.looks,
        "extensions": ["colours_looks", "output_boolean"]
      });
    }
  };

  Blockly.Blocks['looks_visible'] = {
    init: function() {
      this.jsonInit({
        "message0": "Visible?",
        "category": Blockly.Categories.looks,
        "extensions": ["colours_looks", "output_boolean"]
      });
    }
  };
/*Throw error test thats used to check if error handling works, not used by actual game stuff.*/
  Blockly.Blocks['error_test'] = {
    init: function() {
      this.jsonInit({
        "message0": "Throw error",
        "category": Blockly.Categories.looks,
        "extensions": ["colours_looks", "shape_statement"]
      });
    }
  };