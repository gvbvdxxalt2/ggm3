function loadBlockMenus(spr) {
	var costumeMenu = spr.costumes.map((costume,i) => {
		return [costume.name,costume.name];  
	});
	Blockly.Blocks['looks_costume'] = {
	  init: function() {
	    this.jsonInit({
	      "message0": "%1",
	      "args0": [
	        {
	          "type": "field_dropdown",
	          "name": "COSTUME",
	          "options": costumeMenu
	        }
	      ],
	      "colour": Blockly.Colours.looks.secondary,
	      "colourSecondary": Blockly.Colours.looks.secondary,
	      "colourTertiary": Blockly.Colours.looks.tertiary,
	      "colourQuaternary": Blockly.Colours.looks.quaternary,
	      "extensions": ["output_string"]
	    });
	  }
	};
	Blockly.Blocks['loader_costume'] = {
	  init: function() {
	    this.jsonInit({
	      "message0": "%1",
	      "args0": [
	        {
	          "type": "field_dropdown",
	          "name": "COSTUME",
	          "options": costumeMenu
	        }
	      ],
	      "colour": "#0066a1",
	      "extensions": ["output_string"]
	    });
	  }
	};
}

module.exports = {loadBlockMenus};