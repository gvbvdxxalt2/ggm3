var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");
var outputBlocks = require("./output_blocks.js");
var MYSELF_OUTPUT = JSON.stringify("__myself__");

outputBlocks.push("propertydata_sprite");
JavascriptTranslation["propertydata_sprite"] = function (
  jsonblock,
  utils,
  options,
) {
  var TARGET_SPRITE = utils.getField(
    jsonblock,
    "TARGET_SPRITE",
    options,
    "null",
  );
  return JSON.stringify(TARGET_SPRITE);
};

outputBlocks.push("propertydata_get");
JavascriptTranslation["propertydata_get"] = function (
  jsonblock,
  utils,
  options,
) {
  var TARGET_SPRITE = utils.getInput(
    jsonblock,
    "TARGET_SPRITE",
    options,
    "null",
  );
  var VARIABLE = utils.getField(jsonblock, "VARIABLE", options, "null");
  if (TARGET_SPRITE == MYSELF_OUTPUT) {
    return `sprite.spriteProperties[${JSON.stringify(VARIABLE)}]`;
  } else {
    return `sprite.getSProperty(${TARGET_SPRITE}, ${JSON.stringify(VARIABLE)})`;
  }
};

JavascriptTranslation["propertydata_set"] = function (
  jsonblock,
  utils,
  options,
) {
  var TARGET_SPRITE = utils.getInput(
    jsonblock,
    "TARGET_SPRITE",
    options,
    "null",
  );
  var VARIABLE = utils.getField(jsonblock, "VARIABLE", options, "null");
  var VALUE = utils.getInput(jsonblock, "VALUE", options, "null");
  if (TARGET_SPRITE == MYSELF_OUTPUT) {
    return `sprite.spriteProperties[${JSON.stringify(VARIABLE)}] = ${VALUE};`;
  } else {
    return `sprite.setSProperty(${TARGET_SPRITE}, ${JSON.stringify(VARIABLE)}, ${VALUE});`;
  }
};

JavascriptTranslation["propertydata_changeby"] = function (
  jsonblock,
  utils,
  options,
) {
  var TARGET_SPRITE = utils.getInput(
    jsonblock,
    "TARGET_SPRITE",
    options,
    "null",
  );
  var VARIABLE = utils.getField(jsonblock, "VARIABLE", options, "null");
  var VALUE = utils.getInput(jsonblock, "VALUE", options, "null");
  if (TARGET_SPRITE == MYSELF_OUTPUT) {
    return `sprite.spriteProperties[${JSON.stringify(VARIABLE)}] = (+(sprite.spriteProperties[${JSON.stringify(VARIABLE)}]) || 0) + (+(${VALUE}) || 0);`;
  } else {
    return `sprite.changeSProperty(${TARGET_SPRITE}, ${JSON.stringify(VARIABLE)}, ${VALUE});`;
  }
};

module.exports = JavascriptTranslation;
