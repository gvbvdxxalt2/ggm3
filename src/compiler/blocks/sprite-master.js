var SpriteMasterConsts = require("../../sprmaster.js");

var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");
var outputBlocks = require("./output_blocks.js");
var MYSELF_INPUT = JSON.stringify("__myself__");

outputBlocks.push("spritemaster_spriteobjectof");
JavascriptTranslation["spritemaster_spriteobjectof"] = function (jsonblock, utils, options) {
  var SPRITE = utils.getInput(jsonblock, "SPRITE", options);
  if (SPRITE == MYSELF_INPUT) {
    return "sprite";
  }
  return "";
};