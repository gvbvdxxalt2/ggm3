var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");
var outputBlocks = require("./output_blocks.js");

outputBlocks.push("globaldata_get");
JavascriptTranslation["globaldata_get"] = function (jsonblock, utils, options) {
  var VARIABLE = utils.getField(jsonblock, "VARIABLE");
  return `engine.globalVariables[${JSON.stringify(VARIABLE)}]`;
};

JavascriptTranslation["globaldata_set"] = function (
  jsonblock,
  utils,
  options,
) {
  var VARIABLE = utils.getField(jsonblock, "VARIABLE");
  var VALUE = utils.getInput(jsonblock, "VALUE");
  return `engine.globalVariables[${JSON.stringify(VARIABLE)}] = ${VALUE};`;
};

JavascriptTranslation["globaldata_changeby"] = function (
  jsonblock,
  utils,
  options,
) {
  var VARIABLE = utils.getField(jsonblock, "VARIABLE");
  var VALUE = utils.getInput(jsonblock, "VALUE");
  return `engine.globalVariables[${JSON.stringify(VARIABLE)}] = (+(engine.globalVariables[${JSON.stringify(VARIABLE)}]) || 0) + (+(${VALUE}) || 0);`;
};

module.exports = JavascriptTranslation;
