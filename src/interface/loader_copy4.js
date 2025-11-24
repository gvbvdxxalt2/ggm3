Blockly.Blocks['loader_loadcostume'] = {
    init: function() {
      this.jsonInit({
        "message0": "Load costume %1",
		  "args0": [
			  {
	            "type": "input_value",
	            "name": "COSTUME"
	          }
		  ],
        "colour": "#0066a1",
        "extensions": ["colours_looks", "shape_statement"]
      });
    }
  };
