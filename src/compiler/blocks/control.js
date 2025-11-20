var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");

JavascriptTranslation["control_wait"] = function (jsonblock, utils, options) {
  var DURATION = utils.getInput(jsonblock, "DURATION", options);

  return `${utilFunctions.aliveCheck(jsonblock)}await thread.waitSeconds(${DURATION});${utilFunctions.aliveCheck(jsonblock)}`;
};

module.exports = JavascriptTranslation;
