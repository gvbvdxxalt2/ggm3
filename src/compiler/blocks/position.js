var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");

JavascriptTranslation["motion_gotoxy"] = function (jsonblock, utils, options) {
  var X = utils.getInput(jsonblock, "X", options);
  var Y = utils.getInput(jsonblock, "Y", options);

  return `sprite.x = ${X}; sprite.y = ${Y};`;
};

module.exports = JavascriptTranslation;
