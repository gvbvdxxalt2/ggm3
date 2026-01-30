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
  var COSTUME = utils.getInput(jsonblock, "COSTUME", options, "undefined");
  return `(await sprite.blockGetCostumeScale(${COSTUME}))`;
};

outputBlocks.push("loader_costumeisloaded");
JavascriptTranslation["loader_costumeisloaded"] = function (
  jsonblock,
  utils,
  options,
) {
  var COSTUME = utils.getInput(jsonblock, "COSTUME", options, "undefined");
  return `sprite.isCostumeLoaded(${COSTUME})`;
};

JavascriptTranslation["loader_loadcostume"] = function (
  jsonblock,
  utils,
  options,
) {
  var COSTUME = utils.getInput(jsonblock, "COSTUME", options, "undefined");
  return `await sprite.blockLoadCostume(${COSTUME});${utilFunctions.aliveCheck()}`;
};

JavascriptTranslation["loader_deloadcostume"] = function (
  jsonblock,
  utils,
  options,
) {
  var COSTUME = utils.getInput(jsonblock, "COSTUME", options, "undefined");
  return `await sprite.blockDeloadCostume(${COSTUME});${utilFunctions.aliveCheck()}`;
};

JavascriptTranslation["loader_rendercostumescale"] = function (
  jsonblock,
  utils,
  options,
) {
  var COSTUME = utils.getInput(jsonblock, "COSTUME", options, "undefined");
  var SCALE = utils.getInput(jsonblock, "SCALE", options, "undefined");
  return `sprite.setCostumeRenderScale(${COSTUME},${SCALE});`;
};

JavascriptTranslation["loader_setrenderscale"] = function (
  jsonblock,
  utils,
  options,
) {
  var COSTUME = utils.getInput(jsonblock, "COSTUME", options, "undefined");
  return `sprite.blockRerenderCostume(${COSTUME});`;
};

outputBlocks.push("loader_sound");
JavascriptTranslation["loader_sound"] = function (jsonblock, utils, options) {
  var SOUND = utils.getField(jsonblock, "SOUND", options);
  return JSON.stringify(SOUND);
};

outputBlocks.push("loader_soundisloaded");
JavascriptTranslation["loader_soundisloaded"] = function (jsonblock, utils, options) {
  var SOUND = utils.getField(jsonblock, "SOUND", options);
  return `sprite.soundIsLoaded(${SOUND})`;
};

JavascriptTranslation["loader_loadsound"] = function (jsonblock, utils, options) {
  var SOUND = utils.getField(jsonblock, "SOUND", options);
  return `await sprite.blockLoadSound(${SOUND});`;
};

JavascriptTranslation["loader_deloadsound"] = function (jsonblock, utils, options) {
  var SOUND = utils.getField(jsonblock, "SOUND", options);
  return `await sprite.blockDeloadSound(${SOUND});`;
};


module.exports = JavascriptTranslation;
