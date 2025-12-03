var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");
var outputBlocks = require("./output_blocks.js");

outputBlocks.push("data_variable");
JavascriptTranslation["data_variable"] = function (jsonblock, utils, options) {
  var VARIABLE = utils.getFieldVariableID(jsonblock, "VARIABLE");
  return `sprite.variables[${JSON.stringify(VARIABLE)}]`;
};

JavascriptTranslation["data_changevariableby"] = function (
  jsonblock,
  utils,
  options,
) {
  var VARIABLE = utils.getFieldVariableID(jsonblock, "VARIABLE");
  var VALUE = utils.getInput(jsonblock, "VALUE", options, "null");
  return `sprite.variables[${JSON.stringify(VARIABLE)}] = (+(sprite.variables[${JSON.stringify(VARIABLE)}]) || 0) + (+(${VALUE}) || 0);`;
};

JavascriptTranslation["data_setvariableto"] = function (
  jsonblock,
  utils,
  options,
) {
  var VARIABLE = utils.getFieldVariableID(jsonblock, "VARIABLE");
  var VALUE = utils.getInput(jsonblock, "VALUE", options, "null");
  return `sprite.variables[${JSON.stringify(VARIABLE)}] = ${VALUE};`;
};

module.exports = JavascriptTranslation;
