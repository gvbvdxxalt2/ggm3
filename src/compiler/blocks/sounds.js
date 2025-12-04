var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");
var outputBlocks = require("./output_blocks.js");

outputBlocks.push("sound_sounds_menu");
JavascriptTranslation["sound_sounds_menu"] = function (jsonblock, utils, options) {
  var SOUND_MENU = utils.getField(jsonblock, "SOUND_MENU", options);
  return JSON.stringify(SOUND_MENU);
};

JavascriptTranslation["sound_play"] = function (jsonblock, utils, options) {
  var SOUND_MENU = utils.getInput(jsonblock, "SOUND_MENU", options, '0');
  return `sprite.playSound(${SOUND_MENU});`;
};

JavascriptTranslation["sound_playuntildone"] = function (jsonblock, utils, options) {
  var SOUND_MENU = utils.getInput(jsonblock, "SOUND_MENU", options, '0');
  return `await sprite.playSoundUntilDone(${SOUND_MENU});${utilFunctions.aliveCheck(jsonblock)}`;
};

JavascriptTranslation["sound_stopsound"] = function (jsonblock, utils, options) {
  var SOUND_MENU = utils.getInput(jsonblock, "SOUND_MENU", options, '0');
  return `sprite.stopSound(${SOUND_MENU});`;
};

JavascriptTranslation["sound_stopallsounds"] = function (jsonblock, utils, options) {
  return `engine.stopAllSounds();`;
};

JavascriptTranslation["sound_stopallsoundsinsprite"] = function (jsonblock, utils, options) {
  return `sprite.stopAllSounds();`;
};

module.exports = JavascriptTranslation;
