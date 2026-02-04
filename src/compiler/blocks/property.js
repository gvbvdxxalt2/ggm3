var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");
var outputBlocks = require("./output_blocks.js");
var MYSELF_OUTPUT = JSON.stringify("__myself__");

outputBlocks.push("propertydata_sprite");
JavascriptTranslation["propertydata_sprite"] = function (jsonblock, utils, options) {
  var TARGET = utils.getField(jsonblock, "TARGET", options, "null");
  return JSON.stringify(TARGET);
};

outputBlocks.push("propertydata_get");
JavascriptTranslation["propertydata_get"] = function (jsonblock, utils, options) {
  var TARGET = utils.getInput(jsonblock, "TARGET", options, "null");
  var VARIABLE = utils.getField(jsonblock, "VARIABLE", options, "null");
  if (TARGET == MYSELF_OUTPUT) {
    return `sprite.spriteProperties[${JSON.stringify(VARIABLE)}]`;
  } else {
    return `sprite.getSProperty(${TARGET})`;
  }
};

JavascriptTranslation["propertydata_set"] = function (jsonblock, utils, options) {
  var TARGET = utils.getInput(jsonblock, "TARGET", options, "null");
  var VARIABLE = utils.getField(jsonblock, "VARIABLE", options, "null");
  var VALUE = utils.getInput(jsonblock, "VALUE", options, "null");
  if (TARGET == MYSELF_OUTPUT) {
    return `sprite.spriteProperties[${JSON.stringify(VARIABLE)}] = ${VALUE};`;
  } else {
    return `sprite.setSProperty(${TARGET}, ${VARIABLE}, ${VALUE});`;
  }
};

JavascriptTranslation["propertydata_changeby"] = function (
  jsonblock,
  utils,
  options,
) {
  var TARGET = utils.getInput(jsonblock, "TARGET", options, "null");
  var VARIABLE = utils.getField(jsonblock, "VARIABLE", options, "null");
  var VALUE = utils.getInput(jsonblock, "VALUE", options, "null");
  if (TARGET == MYSELF_OUTPUT) {
    return `sprite.spriteProperties[${JSON.stringify(VARIABLE)}] = (+(sprite.spriteProperties[${JSON.stringify(VARIABLE)}]) || 0) + (+(${VALUE}) || 0);`;
  } else {
    return `sprite.changeSProperty(${TARGET}, ${VARIABLE}, ${VALUE});`;
  }
};

module.exports = JavascriptTranslation;
