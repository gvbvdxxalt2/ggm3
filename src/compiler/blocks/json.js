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

outputBlocks.push("json_keys");
JavascriptTranslation["json_keys"] = function (jsonblock, utils, options) {
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options);

  return `(Object.keys(${OBJECT}))`;
};

outputBlocks.push("json_tostring");
JavascriptTranslation["json_tostring"] = function (jsonblock, utils, options) {
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options);

  return `(JSON.stringify(${OBJECT}))`;
};

outputBlocks.push("json_fromstring");
JavascriptTranslation["json_fromstring"] = function (
  jsonblock,
  utils,
  options,
) {
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options);

  return `(JSON.parse(${OBJECT}))`;
};

JavascriptTranslation["json_deleteon"] = function (jsonblock, utils, options) {
  var NAME = utils.getInput(jsonblock, "NAME", options);
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options);

  return `delete (${OBJECT})[${NAME}];`;
};

JavascriptTranslation["json_array_push"] = function (
  jsonblock,
  utils,
  options,
) {
  var VALUE = utils.getInput(jsonblock, "VALUE", options);
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options);

  return `(${OBJECT}).push(${VALUE});`;
};

JavascriptTranslation["json_array_unshift"] = function (
  jsonblock,
  utils,
  options,
) {
  var VALUE = utils.getInput(jsonblock, "VALUE", options);
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options);

  return `(${OBJECT}).unshift(${VALUE});`;
};

outputBlocks.push("json_array_lengthof");
JavascriptTranslation["json_array_lengthof"] = function (
  jsonblock,
  utils,
  options,
) {
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options);

  return `(${OBJECT}).length`;
};

module.exports = JavascriptTranslation;
