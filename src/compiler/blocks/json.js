var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");
var outputBlocks = require("./output_blocks.js");


outputBlocks.push("json_new");
JavascriptTranslation["json_new"] = function (jsonblock, utils, options) {
  var TYPE = utils.getField(jsonblock, "TYPE", options);
  if (TYPE == "object") {
    return "({})";
  }
  if (TYPE == "array") {
    return "([])";
  }
};

JavascriptTranslation["json_setto"] = function (jsonblock, utils, options) {
  var NAME = utils.getInput(jsonblock, "NAME", options);
  var VALUE = utils.getInput(jsonblock, "VALUE", options);
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options);
  
  return `(${OBJECT})[${NAME}] = ${VALUE};`;
};

outputBlocks.push("json_geton");
JavascriptTranslation["json_geton"] = function (jsonblock, utils, options) {
  var NAME = utils.getInput(jsonblock, "NAME", options);
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options);
  
  return `(${OBJECT})[${NAME}]`;
};

JavascriptTranslation["json_deleteon"] = function (jsonblock, utils, options) {
  var NAME = utils.getInput(jsonblock, "NAME", options);
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options);
  
  return `delete (${OBJECT})[${NAME}];`;
};

module.exports = JavascriptTranslation;