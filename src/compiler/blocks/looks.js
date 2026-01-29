var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");
var outputBlocks = require("./output_blocks.js");

outputBlocks.push("looks_costume");
JavascriptTranslation["looks_costume"] = function (jsonblock, utils, options) {
  var COSTUME = utils.getField(jsonblock, "COSTUME", options);
  return JSON.stringify(COSTUME);
};

JavascriptTranslation["looks_switchcostumeto"] = function (
  jsonblock,
  utils,
  options,
) {
  var COSTUME = utils.getInput(jsonblock, "COSTUME", options);
  return `sprite.costumeIndex = +(sprite.getCostumeIndex(${COSTUME})) || 0;`;
};

JavascriptTranslation["looks_nextcostume"] = function (
  jsonblock,
  utils,
  options,
) {
  return `sprite.costumeIndex += 1;if (sprite.costumeIndex+1 > sprite.costumes.length) {sprite.costumeIndex = 0;}`;
};

outputBlocks.push("looks_costumenumbername");
JavascriptTranslation["looks_costumenumbername"] = function (
  jsonblock,
  utils,
  options,
) {
  var NUMBER_NAME = utils.getField(jsonblock, "NUMBER_NAME", options);
  return NUMBER_NAME == "number"
    ? "sprite.costumeIndex"
    : "sprite.costume.name";
};

outputBlocks.push("looks_hidden");
JavascriptTranslation["looks_hidden"] = function (jsonblock, utils, options) {
  return `(!!sprite.hidden)`;
};

outputBlocks.push("looks_visible");
JavascriptTranslation["looks_visible"] = function (jsonblock, utils, options) {
  return `(!sprite.hidden)`;
};

JavascriptTranslation["looks_show"] = function (jsonblock, utils, options) {
  return `sprite.hidden = false;`;
};

JavascriptTranslation["looks_hide"] = function (jsonblock, utils, options) {
  return `sprite.hidden = true;`;
};

JavascriptTranslation["looks_changesizeby"] = function (
  jsonblock,
  utils,
  options,
) {
  var CHANGE = utils.getInput(jsonblock, "CHANGE", options);
  return `sprite.size += +${CHANGE} || 0;`;
};

JavascriptTranslation["looks_setsizeto"] = function (
  jsonblock,
  utils,
  options,
) {
  var SIZE = utils.getInput(jsonblock, "SIZE", options);
  return `sprite.size = +${SIZE} || 0;`;
};

outputBlocks.push("looks_size");
JavascriptTranslation["looks_size"] = function (jsonblock, utils, options) {
  return `sprite.size`;
};

outputBlocks.push("looks_xstretch");
JavascriptTranslation["looks_xstretch"] = function (jsonblock, utils, options) {
  return `(sprite.scaleX * 100)`;
};

outputBlocks.push("looks_ystretch");
JavascriptTranslation["looks_ystretch"] = function (jsonblock, utils, options) {
  return `(sprite.scaleY * 100)`; //Lol this was stretch x value instead of y, so fixed here.
};

JavascriptTranslation["looks_xstretch_to"] = function (
  jsonblock,
  utils,
  options,
) {
  var VALUE = utils.getInput(jsonblock, "VALUE", options);
  return `sprite.scaleX = (+(${VALUE}) || 0) / 100;`;
};

JavascriptTranslation["looks_ystretch_to"] = function (
  jsonblock,
  utils,
  options,
) {
  var VALUE = utils.getInput(jsonblock, "VALUE", options);
  return `sprite.scaleY = (+(${VALUE}) || 0) / 100;`;
};

JavascriptTranslation["looks_xstretch_by"] = function (
  jsonblock,
  utils,
  options,
) {
  var VALUE = utils.getInput(jsonblock, "VALUE", options);
  return `sprite.scaleX += (+(${VALUE}) || 0) / 100;`;
};

JavascriptTranslation["looks_ystretch_by"] = function (
  jsonblock,
  utils,
  options,
) {
  var VALUE = utils.getInput(jsonblock, "VALUE", options);
  return `sprite.scaleY += (+(${VALUE}) || 0) / 100;`;
};

JavascriptTranslation["looks_seteffectto"] = function (
  jsonblock,
  utils,
  options,
) {
  var EFFECT = utils.getField(jsonblock, "EFFECT", options);
  var VALUE = utils.getInput(jsonblock, "VALUE", options);
  return `sprite.effects.${EFFECT} = +(${VALUE}) || 0;`;
};

JavascriptTranslation["looks_change_effect_by"] = function (
  jsonblock,
  utils,
  options,
) {
  var EFFECT = utils.getField(jsonblock, "EFFECT", options);
  var BY = utils.getInput(jsonblock, "BY", options);
  return `sprite.effects.${EFFECT} += +(${BY}) || 0;`;
};

outputBlocks.push("looks_geteffect");
JavascriptTranslation["looks_geteffect"] = function (
  jsonblock,
  utils,
  options,
) {
  var EFFECT = utils.getField(jsonblock, "EFFECT", options);
  var VALUE = utils.getInput(jsonblock, "VALUE", options);
  return `sprite.effects.${EFFECT}`;
};

JavascriptTranslation["looks_zindex_to"] = function (
  jsonblock,
  utils,
  options,
) {
  var VALUE = utils.getInput(jsonblock, "VALUE", options);
  return `sprite.zIndex = (+(${VALUE}) || 0);`;
};
JavascriptTranslation["looks_zindex_by"] = function (
  jsonblock,
  utils,
  options,
) {
  var VALUE = utils.getInput(jsonblock, "VALUE", options);
  return `sprite.zIndex += (+(${VALUE}) || 0);`;
};
outputBlocks.push("looks_zindex");
JavascriptTranslation["looks_zindex"] = function (jsonblock, utils, options) {
  return `(sprite.zIndex)`;
};

JavascriptTranslation["looks_alpha_to"] = function (jsonblock, utils, options) {
  var VALUE = utils.getInput(jsonblock, "VALUE", options);
  return `sprite.alpha = (+(${VALUE}) || 0);`;
};
JavascriptTranslation["looks_alpha_by"] = function (jsonblock, utils, options) {
  var VALUE = utils.getInput(jsonblock, "VALUE", options);
  return `sprite.alpha += (+(${VALUE}) || 0);`;
};
outputBlocks.push("looks_alpha");
JavascriptTranslation["looks_alpha"] = function (jsonblock, utils, options) {
  return `(sprite.alpha)`;
};

/* Throw error test thats used to check if error handling works, so that when something fails unexpectedly then the threads won't leak memory */
/*JavascriptTranslation["error_test"] = function (jsonblock, utils, options) {
  return `throw new Error("This is an error reported by the block");`;
};*/

module.exports = JavascriptTranslation;
