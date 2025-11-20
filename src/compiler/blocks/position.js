var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");

JavascriptTranslation["motion_gotoxy"] = function (jsonblock, utils, options) {
  var X = utils.getInput(jsonblock, "X", options);
  var Y = utils.getInput(jsonblock, "Y", options);

  return `sprite.x = +(${X}) || 0; sprite.y = +(${Y}) || 0;`;
};

JavascriptTranslation["motion_changexby"] = function (
  jsonblock,
  utils,
  options
) {
  var DX = utils.getInput(jsonblock, "DX", options);

  return `sprite.x += +(${DX}) || 0;`;
};

JavascriptTranslation["motion_changeyby"] = function (
  jsonblock,
  utils,
  options
) {
  var DY = utils.getInput(jsonblock, "DY", options);

  return `sprite.y += +(${DY}) || 0;`;
};

JavascriptTranslation["motion_pointindirection"] = function (
  jsonblock,
  utils,
  options
) {
  var DIRECTION = utils.getInput(jsonblock, "DIRECTION", options);

  return `sprite.direction = +(${DIRECTION}) || 0;`;
};

JavascriptTranslation["motion_turnleft"] = function (
  jsonblock,
  utils,
  options
) {
  var DEGREES = utils.getInput(jsonblock, "DEGREES", options);

  return `sprite.direction -= +(${DEGREES}) || 0;`;
};

JavascriptTranslation["motion_turnright"] = function (
  jsonblock,
  utils,
  options
) {
  var DEGREES = utils.getInput(jsonblock, "DEGREES", options);

  return `sprite.direction += +(${DEGREES}) || 0;`;
};

JavascriptTranslation["motion_movesteps"] = function (
  jsonblock,
  utils,
  options
) {
  var STEPS = utils.getInput(jsonblock, "STEPS", options);

  return `sprite.moveSteps(+(${STEPS}) || 0);`;
};

module.exports = JavascriptTranslation;
