var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");
var outputBlocks = require("./output_blocks.js");

//Basic math:

outputBlocks.push("operator_add");
JavascriptTranslation["operator_add"] = function (jsonblock, utils, options) {
  var NUM1 = utils.getInput(jsonblock, "NUM1", options);
  var NUM2 = utils.getInput(jsonblock, "NUM2", options);
  //Although this is GGM3, not Scratch, falling back to zero or converting to number automatically is more convient.
  return `((+(${NUM1}) || 0) + (+(${NUM2}) || 0))`;
};

outputBlocks.push("operator_subtract");
JavascriptTranslation["operator_subtract"] = function (
  jsonblock,
  utils,
  options
) {
  var NUM1 = utils.getInput(jsonblock, "NUM1", options);
  var NUM2 = utils.getInput(jsonblock, "NUM2", options);
  return `((+(${NUM1}) || 0) - (+(${NUM2}) || 0))`;
};

outputBlocks.push("operator_multiply");
JavascriptTranslation["operator_multiply"] = function (
  jsonblock,
  utils,
  options
) {
  var NUM1 = utils.getInput(jsonblock, "NUM1", options);
  var NUM2 = utils.getInput(jsonblock, "NUM2", options);
  return `((+(${NUM1}) || 0) * (+(${NUM2}) || 0))`;
};

outputBlocks.push("operator_divide");
JavascriptTranslation["operator_divide"] = function (
  jsonblock,
  utils,
  options
) {
  var NUM1 = utils.getInput(jsonblock, "NUM1", options);
  var NUM2 = utils.getInput(jsonblock, "NUM2", options);
  return `((+(${NUM1}) || 0) / (+(${NUM2}) || 0))`;
};

outputBlocks.push("operator_sign");
JavascriptTranslation["operator_sign"] = function (jsonblock, utils, options) {
  var NUM = utils.getInput(jsonblock, "NUM", options);
  return `Math.sign(+(${NUM}) || 0)`;
};

outputBlocks.push("operator_fixed");
JavascriptTranslation["operator_fixed"] = function (jsonblock, utils, options) {
  var NUM = utils.getInput(jsonblock, "NUM", options);
  var DECIMALS = utils.getInput(jsonblock, "DECIMALS", options);
  return `(+(${NUM}) || 0).toFixed(+(${DECIMALS}) || 0)`;
};

outputBlocks.push("operator_mathop");
JavascriptTranslation["operator_mathop"] = function (jsonblock, utils, options) {
  var OPERATOR = utils.getField(jsonblock, "OPERATOR", options);
  var NUM = utils.getInput(jsonblock, "NUM", options);
  var numberCode = `(+(${NUM}) || 0)`;
  switch (OPERATOR) {
    case 'abs': return `Math.abs(${numberCode})`;
    case 'floor': return `Math.floor(${numberCode})`;
    case 'ceiling': return `Math.ceil(${numberCode})`;
    case 'sqrt': return `Math.sqrt(${numberCode})`;
    case 'sin': return `Math.round(Math.sin((Math.PI * ${numberCode}) / 180) * 1e10) / 1e10`;
    case 'cos': return `Math.round(Math.cos((Math.PI * ${numberCode}) / 180) * 1e10) / 1e10`;
    case 'tan': return `MathUtil.tan(${numberCode})`;
    case 'asin': return `(Math.asin(${numberCode}) * 180) / Math.PI`;
    case 'acos': return `(Math.acos(${numberCode}) * 180) / Math.PI`;
    case 'atan': return `(Math.atan(${numberCode}) * 180) / Math.PI`;
    case 'ln': return `Math.log(${numberCode})`;
    case 'log': return `Math.log(${numberCode}) / Math.LN10`;
    case 'e ^': return `Math.exp(${numberCode})`;
    case '10 ^': return `Math.pow(10, ${numberCode})`;
    case '20 ^': return `Math.pow(20, ${numberCode})`;
    }
    return `0`;
};

//Randomizing:

outputBlocks.push("operator_random");
JavascriptTranslation["operator_random"] = function (
  jsonblock,
  utils,
  options
) {
  var FROM = utils.getInput(jsonblock, "FROM", options);
  var TO = utils.getInput(jsonblock, "TO", options);
  return `thread.random(+(${FROM}) || 0, +(${TO}) || 0)`;
};

//Conditional:

outputBlocks.push("operator_equals");
JavascriptTranslation["operator_equals"] = function (
  jsonblock,
  utils,
  options
) {
  var OPERAND1 = utils.getInput(jsonblock, "OPERAND1", options);
  var OPERAND2 = utils.getInput(jsonblock, "OPERAND2", options);
  return `((${OPERAND1}) == (${OPERAND2}))`;
};

outputBlocks.push("operator_gt");
JavascriptTranslation["operator_gt"] = function (jsonblock, utils, options) {
  var OPERAND1 = utils.getInput(jsonblock, "OPERAND1", options);
  var OPERAND2 = utils.getInput(jsonblock, "OPERAND2", options);
  return `((+(${OPERAND1}) || 0) > (+(${OPERAND2}) || 0))`;
};

outputBlocks.push("operator_lt");
JavascriptTranslation["operator_lt"] = function (jsonblock, utils, options) {
  var OPERAND1 = utils.getInput(jsonblock, "OPERAND1", options);
  var OPERAND2 = utils.getInput(jsonblock, "OPERAND2", options);
  return `((+(${OPERAND1}) || 0) < (+(${OPERAND2}) || 0))`;
};

outputBlocks.push("operator_and");
JavascriptTranslation["operator_and"] = function (jsonblock, utils, options) {
  var OPERAND1 = utils.getInput(jsonblock, "OPERAND1", options);
  var OPERAND2 = utils.getInput(jsonblock, "OPERAND2", options);
  return `((${OPERAND1}) && (${OPERAND2}))`;
};

outputBlocks.push("operator_or");
JavascriptTranslation["operator_or"] = function (jsonblock, utils, options) {
  var OPERAND1 = utils.getInput(jsonblock, "OPERAND1", options);
  var OPERAND2 = utils.getInput(jsonblock, "OPERAND2", options);
  return `((${OPERAND1}) || (${OPERAND2}))`;
};

outputBlocks.push("operator_not");
JavascriptTranslation["operator_not"] = function (jsonblock, utils, options) {
  var OPERAND = utils.getInput(jsonblock, "OPERAND", options);
  return `(!(${OPERAND}))`;
};


module.exports = JavascriptTranslation;
