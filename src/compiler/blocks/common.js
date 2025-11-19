var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");

JavascriptTranslation["math_number"] = function (jsonblock, utils, options) {
  var NUM = utils.getField(jsonblock, "NUM");
  return JSON.stringify(+NUM || 0);
};

module.exports = JavascriptTranslation;
