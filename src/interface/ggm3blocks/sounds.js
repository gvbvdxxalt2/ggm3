Blockly.Blocks['sound_play_advanced'] = {
  /**
   * Block to play sound.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": "start sound %1 at %4 playback rate: %2 volume multiplier: %3",
      "args0": [
        {
          "type": "input_value",
          "name": "SOUND_MENU"
        },
        {
          "type": "input_value",
          "name": "PLAYBACK_RATE"
        },
        {
          "type": "input_value",
          "name": "VOLUME"
        },
        {
          "type": "input_value",
          "name": "TIME"
        },
      ],
      "category": Blockly.Categories.sound,
      "extensions": ["colours_sounds", "shape_statement"]
    });
    /*
    if (this.isInFlyout) {
      var soundMenu = this.getField("SOUND_MENU");
      if (soundMenu) {
        this.setFieldValue(soundMenu.getOptions()[1], "SOUND_MENU");
      }
    }*/
  }
};

Blockly.Blocks['sound_playuntildone_advanced'] = {
  init: function() {
    this.jsonInit({
      "message0": "play sound %1 sound at %4 until done with playback rate: %2 volume multiplier: %3",
      "args0": [
        {
          "type": "input_value",
          "name": "SOUND_MENU"
        },
        {
          "type": "input_value",
          "name": "PLAYBACK_RATE"
        },
        {
          "type": "input_value",
          "name": "VOLUME"
        },
        {
          "type": "input_value",
          "name": "TIME"
        },
      ],
      "category": Blockly.Categories.sound,
      "extensions": ["colours_sounds", "shape_statement"]
    });
  }
};


Blockly.Blocks['sound_stopallsounds'] = {
  init: function() {
    this.jsonInit({
      "message0": "stop all sounds",
      "category": Blockly.Categories.sound,
      "extensions": ["colours_sounds", "shape_statement"]
    });
  }
};

Blockly.Blocks['sound_stopallsoundsinsprite'] = {
  init: function() {
    this.jsonInit({
      "message0": "stop all sounds in sprite",
      "category": Blockly.Categories.sound,
      "extensions": ["colours_sounds", "shape_statement"]
    });
  }
};

Blockly.Blocks['sound_stopsound'] = {
  init: function() {
    this.jsonInit({
      "message0": "stop sound %1",
      "args0": [
        {
          "type": "input_value",
          "name": "SOUND_MENU"
        }
      ],
      "category": Blockly.Categories.sound,
      "extensions": ["colours_sounds", "shape_statement"]
    });
  }
};