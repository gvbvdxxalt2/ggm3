var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");

JavascriptTranslation["control_wait"] = function (jsonblock, utils, options) {
  var DURATION = utils.getInput(jsonblock, "DURATION", options);

  return `${utilFunctions.aliveCheck(jsonblock)}await thread.waitSeconds(${DURATION});${utilFunctions.aliveCheck(jsonblock)}`;
};

JavascriptTranslation["control_repeat"] = function (jsonblock, utils, options) {
  var TIMES = utils.getInput(jsonblock, "TIMES", options);
  var SUBSTACK = utils.getInput(jsonblock, "SUBSTACK", options);

  return `${utilFunctions.aliveCheck(jsonblock)}await thread.repeatTimes(${TIMES},async function (){${SUBSTACK}});${utilFunctions.aliveCheck(jsonblock)}`;
};

module.exports = JavascriptTranslation;
