var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");
var outputBlocks = require("./output_blocks.js");

outputBlocks.push("sounds_sound_menu");
JavascriptTranslation["sounds_sound_menu"] = function (jsonblock, utils, options) {
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


module.exports = JavascriptTranslation;
