var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");
var outputBlocks = require("./output_blocks.js");

outputBlocks.push("loader_costume");
JavascriptTranslation["loader_costume"] = function (jsonblock, utils, options) {
  var COSTUME = utils.getField(jsonblock, "COSTUME", options);
  return JSON.stringify(COSTUME);
};

outputBlocks.push("loader_costume_scale");
JavascriptTranslation["loader_costume_scale"] = function (
  jsonblock,
  utils,
  options,
) {
  var COSTUME = utils.getInput(jsonblock, "COSTUME", options);
  return `(await sprite.blockGetCostumeScale(${COSTUME}))`;
};

outputBlocks.push("loader_costumeisloaded");
JavascriptTranslation["loader_costumeisloaded"] = function (
  jsonblock,
  utils,
  options,
) {
  var COSTUME = utils.getInput(jsonblock, "COSTUME", options);
  return `sprite.isCostumeLoaded(${COSTUME})`;
};

JavascriptTranslation["loader_loadcostume"] = function (
  jsonblock,
  utils,
  options,
) {
  var COSTUME = utils.getInput(jsonblock, "COSTUME", options);
  return `await sprite.blockLoadCostume(${COSTUME});${utilFunctions.aliveCheck()}`;
};

JavascriptTranslation["loader_deloadcostume"] = function (
  jsonblock,
  utils,
  options,
) {
  var COSTUME = utils.getInput(jsonblock, "COSTUME", options);
  return `await sprite.blockDeloadCostume(${COSTUME});${utilFunctions.aliveCheck()}`;
};

JavascriptTranslation["loader_rendercostumescale"] = function (
  jsonblock,
  utils,
  options,
) {
  var COSTUME = utils.getInput(jsonblock, "COSTUME", options);
  var SCALE = utils.getInput(jsonblock, "SCALE", options);
  return `sprite.setCostumeRenderScale(${COSTUME},${SCALE});`;
};

JavascriptTranslation["loader_setrenderscale"] = function (
  jsonblock,
  utils,
  options,
) {
  var COSTUME = utils.getInput(jsonblock, "COSTUME", options);
  return `sprite.blockRerenderCostume(${COSTUME});`;
};

module.exports = JavascriptTranslation;
