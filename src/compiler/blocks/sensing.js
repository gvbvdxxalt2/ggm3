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

module.exports = JavascriptTranslation;
