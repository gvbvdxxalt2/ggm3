var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");
var outputBlocks = require("./output_blocks.js");

outputBlocks.push("motion_xposition");
JavascriptTranslation["motion_xposition"] = function (
  jsonblock,
  utils,
  options,
) {
  return `sprite.x`;
};

outputBlocks.push("motion_yposition");
JavascriptTranslation["motion_yposition"] = function (
  jsonblock,
  utils,
  options,
) {
  return `sprite.y`;
};

outputBlocks.push("motion_direction");
JavascriptTranslation["motion_direction"] = function (
  jsonblock,
  utils,
  options,
) {
  return `sprite.direction`;
};

JavascriptTranslation["motion_gotoxy"] = function (jsonblock, utils, options) {
  var X = utils.getInput(jsonblock, "X", options, "undefined");
  var Y = utils.getInput(jsonblock, "Y", options, "undefined");

  return `sprite.x = +(${X}) || 0; sprite.y = +(${Y}) || 0;`;
};

JavascriptTranslation["motion_changexby"] = function (
  jsonblock,
  utils,
  options,
) {
  var DX = utils.getInput(jsonblock, "DX", options, "undefined");

  return `sprite.x += +(${DX}) || 0;`;
};

JavascriptTranslation["motion_setx"] = function (jsonblock, utils, options) {
  var X = utils.getInput(jsonblock, "X", options, "undefined");

  return `sprite.x = +(${X}) || 0;`;
};

JavascriptTranslation["motion_changeyby"] = function (
  jsonblock,
  utils,
  options,
) {
  var DY = utils.getInput(jsonblock, "DY", options, "undefined");

  return `sprite.y += +(${DY}) || 0;`;
};

JavascriptTranslation["motion_sety"] = function (jsonblock, utils, options) {
  var Y = utils.getInput(jsonblock, "Y", options, "undefined");

  return `sprite.y = +(${Y}) || 0;`;
};

JavascriptTranslation["motion_pointindirection"] = function (
  jsonblock,
  utils,
  options,
) {
  var DIRECTION = utils.getInput(jsonblock, "DIRECTION", options, "undefined");

  return `sprite.direction = +(${DIRECTION}) || 0;`;
};

JavascriptTranslation["motion_turnleft"] = function (
  jsonblock,
  utils,
  options,
) {
  var DEGREES = utils.getInput(jsonblock, "DEGREES", options, "undefined");

  return `sprite.direction -= +(${DEGREES}) || 0;`;
};

JavascriptTranslation["motion_turnright"] = function (
  jsonblock,
  utils,
  options,
) {
  var DEGREES = utils.getInput(jsonblock, "DEGREES", options, "undefined");

  return `sprite.direction += +(${DEGREES}) || 0;`;
};

JavascriptTranslation["motion_movesteps"] = function (
  jsonblock,
  utils,
  options,
) {
  var STEPS = utils.getInput(jsonblock, "STEPS", options, "undefined");

  return `sprite.moveSteps(+(${STEPS}) || 0);`;
};

module.exports = JavascriptTranslation;
