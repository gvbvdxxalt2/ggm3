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