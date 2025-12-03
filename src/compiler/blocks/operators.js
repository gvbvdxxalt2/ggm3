var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");
var outputBlocks = require("./output_blocks.js");

//Basic math:

outputBlocks.push("operator_add");
JavascriptTranslation["operator_add"] = function (jsonblock, utils, options) {
  var NUM1 = utils.getInput(jsonblock, "NUM1", options, "undefined");
  var NUM2 = utils.getInput(jsonblock, "NUM2", options, "undefined");
  //Although this is GGM3, not Scratch, falling back to zero or converting to number automatically is more convient.
  return `((+(${NUM1}) || 0) + (+(${NUM2}) || 0))`;
};

outputBlocks.push("operator_subtract");
JavascriptTranslation["operator_subtract"] = function (
  jsonblock,
  utils,
  options,
) {
  var NUM1 = utils.getInput(jsonblock, "NUM1", options, "undefined");
  var NUM2 = utils.getInput(jsonblock, "NUM2", options, "undefined");
  return `((+(${NUM1}) || 0) - (+(${NUM2}) || 0))`;
};

outputBlocks.push("operator_multiply");
JavascriptTranslation["operator_multiply"] = function (
  jsonblock,
  utils,
  options,
) {
  var NUM1 = utils.getInput(jsonblock, "NUM1", options, "undefined");
  var NUM2 = utils.getInput(jsonblock, "NUM2", options, "undefined");
  return `((+(${NUM1}) || 0) * (+(${NUM2}) || 0))`;
};

outputBlocks.push("operator_divide");
JavascriptTranslation["operator_divide"] = function (
  jsonblock,
  utils,
  options,
) {
  var NUM1 = utils.getInput(jsonblock, "NUM1", options, "undefined");
  var NUM2 = utils.getInput(jsonblock, "NUM2", options, "undefined");
  return `((+(${NUM1}) || 0) / (+(${NUM2}) || 0))`;
};

outputBlocks.push("operator_sign");
JavascriptTranslation["operator_sign"] = function (jsonblock, utils, options) {
  var NUM = utils.getInput(jsonblock, "NUM", options, "undefined");
  return `Math.sign(+(${NUM}) || 0)`;
};

outputBlocks.push("operator_fixed");
JavascriptTranslation["operator_fixed"] = function (jsonblock, utils, options) {
  var NUM = utils.getInput(jsonblock, "NUM", options, "undefined");
  var DECIMALS = utils.getInput(jsonblock, "DECIMALS", options, "undefined");
  return `(+(${NUM}) || 0).toFixed(+(${DECIMALS}) || 0)`;
};

outputBlocks.push("operator_mathop");
JavascriptTranslation["operator_mathop"] = function (
  jsonblock,
  utils,
  options,
) {
  var OPERATOR = utils.getField(jsonblock, "OPERATOR", options, "undefined");
  var NUM = utils.getInput(jsonblock, "NUM", options, "undefined");
  var numberCode = `(+(${NUM}) || 0)`;
  switch (OPERATOR) {
    case "abs":
      return `Math.abs(${numberCode})`;
    case "floor":
      return `Math.floor(${numberCode})`;
    case "ceiling":
      return `Math.ceil(${numberCode})`;
    case "sqrt":
      return `Math.sqrt(${numberCode})`;
    case "sin":
      return `Math.round(Math.sin((Math.PI * ${numberCode}) / 180) * 1e10) / 1e10`;
    case "cos":
      return `Math.round(Math.cos((Math.PI * ${numberCode}) / 180) * 1e10) / 1e10`;
    case "tan":
      return `MathUtil.tan(${numberCode})`;
    case "asin":
      return `(Math.asin(${numberCode}) * 180) / Math.PI`;
    case "acos":
      return `(Math.acos(${numberCode}) * 180) / Math.PI`;
    case "atan":
      return `(Math.atan(${numberCode}) * 180) / Math.PI`;
    case "ln":
      return `Math.log(${numberCode})`;
    case "log":
      return `Math.log(${numberCode}) / Math.LN10`;
    case "e ^":
      return `Math.exp(${numberCode})`;
    case "10 ^":
      return `Math.pow(10, ${numberCode})`;
    case "20 ^":
      return `Math.pow(20, ${numberCode})`;
  }
  return `0`;
};

//Randomizing:

outputBlocks.push("operator_random");
JavascriptTranslation["operator_random"] = function (
  jsonblock,
  utils,
  options,
) {
  var FROM = utils.getInput(jsonblock, "FROM", options, "undefined");
  var TO = utils.getInput(jsonblock, "TO", options, "undefined");
  return `thread.random(+(${FROM}) || 0, +(${TO}) || 0)`;
};

//Conditional:

outputBlocks.push("operator_equals");
JavascriptTranslation["operator_equals"] = function (
  jsonblock,
  utils,
  options,
) {
  var OPERAND1 = utils.getInput(jsonblock, "OPERAND1", options, "undefined");
  var OPERAND2 = utils.getInput(jsonblock, "OPERAND2", options, "undefined");
  return `((${OPERAND1}) == (${OPERAND2}))`;
};

outputBlocks.push("operator_gt");
JavascriptTranslation["operator_gt"] = function (jsonblock, utils, options) {
  var OPERAND1 = utils.getInput(jsonblock, "OPERAND1", options, "undefined");
  var OPERAND2 = utils.getInput(jsonblock, "OPERAND2", options, "undefined");
  return `((+(${OPERAND1}) || 0) > (+(${OPERAND2}) || 0))`;
};

outputBlocks.push("operator_lt");
JavascriptTranslation["operator_lt"] = function (jsonblock, utils, options) {
  var OPERAND1 = utils.getInput(jsonblock, "OPERAND1", options, "undefined");
  var OPERAND2 = utils.getInput(jsonblock, "OPERAND2", options, "undefined");
  return `((+(${OPERAND1}) || 0) < (+(${OPERAND2}) || 0))`;
};

outputBlocks.push("operator_and");
JavascriptTranslation["operator_and"] = function (jsonblock, utils, options) {
  var OPERAND1 = utils.getInput(jsonblock, "OPERAND1", options, "false");
  var OPERAND2 = utils.getInput(jsonblock, "OPERAND2", options, "false");
  return `((${OPERAND1}) && (${OPERAND2}))`;
};

outputBlocks.push("operator_or");
JavascriptTranslation["operator_or"] = function (jsonblock, utils, options) {
  var OPERAND1 = utils.getInput(jsonblock, "OPERAND1", options, "false");
  var OPERAND2 = utils.getInput(jsonblock, "OPERAND2", options, "false");
  return `((${OPERAND1}) || (${OPERAND2}))`;
};

outputBlocks.push("operator_not");
JavascriptTranslation["operator_not"] = function (jsonblock, utils, options) {
  var OPERAND = utils.getInput(jsonblock, "OPERAND", options, "false");
  return `(!(${OPERAND}))`;
};

outputBlocks.push("operator_outputif");
JavascriptTranslation["operator_outputif"] = function (
  jsonblock,
  utils,
  options,
) {
  var CONDITION = utils.getInput(jsonblock, "CONDITION", options, "false");

  var PASS_OUTPUT = utils.getInput(jsonblock, "PASS_OUTPUT", options, null);
  var FAIL_OUTPUT = utils.getInput(jsonblock, "FAIL_OUTPUT", options, null);
  return `(${CONDITION}) ? (${PASS_OUTPUT}) : (${FAIL_OUTPUT})`;
};

//Constants:

outputBlocks.push("operator_true");
JavascriptTranslation["operator_true"] = function (jsonblock, utils, options) {
  return "true";
};

outputBlocks.push("operator_false");
JavascriptTranslation["operator_false"] = function (jsonblock, utils, options) {
  return "false";
};

outputBlocks.push("operator_nan");
JavascriptTranslation["operator_nan"] = function (jsonblock, utils, options) {
  return "NaN";
};

outputBlocks.push("operator_null");
JavascriptTranslation["operator_null"] = function (jsonblock, utils, options) {
  return "null";
};

outputBlocks.push("operator_infinity");
JavascriptTranslation["operator_infinity"] = function (
  jsonblock,
  utils,
  options,
) {
  return "Infinity";
};

outputBlocks.push("operator_empty_string");
JavascriptTranslation["operator_empty_string"] = function (
  jsonblock,
  utils,
  options,
) {
  return JSON.stringify("");
};

outputBlocks.push("operator_newline");
JavascriptTranslation["operator_newline"] = function (
  jsonblock,
  utils,
  options,
) {
  return JSON.stringify("\n");
};

//Rounding:

outputBlocks.push("operator_round");
JavascriptTranslation["operator_round"] = function (jsonblock, utils, options) {
  var NUM = utils.getInput(jsonblock, "NUM", options, "undefined");
  return `(Math.round(+(${NUM}) || 0))`;
};

//Converters:

outputBlocks.push("operator_tostring");
JavascriptTranslation["operator_tostring"] = function (
  jsonblock,
  utils,
  options,
) {
  var VALUE = utils.getInput(jsonblock, "VALUE", options, "undefined");
  return `"" + (${VALUE})`;
};

outputBlocks.push("operator_tonumber");
JavascriptTranslation["operator_tonumber"] = function (
  jsonblock,
  utils,
  options,
) {
  var VALUE = utils.getInput(jsonblock, "VALUE", options, "undefined");
  return `+(${VALUE})`;
};

outputBlocks.push("operator_toboolean");
JavascriptTranslation["operator_toboolean"] = function (
  jsonblock,
  utils,
  options,
) {
  var VALUE = utils.getInput(jsonblock, "VALUE", options, "undefined");
  return `!!(${VALUE})`;
};

module.exports = JavascriptTranslation;
