var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");
var outputBlocks = require("./output_blocks.js");

outputBlocks.push("sensing_mousex");
JavascriptTranslation["sensing_mousex"] = function (jsonblock, utils, options) {
  return `engine.mouseX`;
};

outputBlocks.push("sensing_mousey");
JavascriptTranslation["sensing_mousey"] = function (jsonblock, utils, options) {
  return `engine.mouseY`;
};

outputBlocks.push("sensing_mousedown");
JavascriptTranslation["sensing_mousedown"] = function (
  jsonblock,
  utils,
  options
) {
  return `engine.mouseIsDown`;
};

outputBlocks.push("sensing_keyoptions");
JavascriptTranslation["sensing_keyoptions"] = function (jsonblock, utils, options) {
  var KEY_OPTION = utils.getField(jsonblock, "KEY_OPTION", options);
  return JSON.stringify(KEY_OPTION);
};

outputBlocks.push("sensing_keypressed");
JavascriptTranslation["sensing_keypressed"] = function (jsonblock, utils, options) {
  var KEY_OPTION = utils.getInput(jsonblock, "KEY_OPTION", options);
  return `!!engine.keysPressed[${KEY_OPTION}]`;
};


module.exports = JavascriptTranslation;
