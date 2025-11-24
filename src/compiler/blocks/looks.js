var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");
var outputBlocks = require("./output_blocks.js");

outputBlocks.push("looks_hidden");
JavascriptTranslation["looks_hidden"] = function (jsonblock, utils, options) {
  return `sprite.hidden`;
};

outputBlocks.push("looks_visible");
JavascriptTranslation["looks_visible"] = function (jsonblock, utils, options) {
  return `!sprite.hidden`;
};

JavascriptTranslation["looks_show"] = function (jsonblock, utils, options) {
  return `sprite.hidden = false;`;
};

JavascriptTranslation["looks_hide"] = function (jsonblock, utils, options) {
  return `sprite.hidden = true;`;
};

JavascriptTranslation["looks_changesizeby"] = function (jsonblock, utils, options) {
  var CHANGE = utils.getInput(jsonblock, "CHANGE", options);
  return `sprite.size += +${CHANGE} || 0;`;
};

JavascriptTranslation["looks_setsizeto"] = function (jsonblock, utils, options) {
    var SIZE = utils.getInput(jsonblock, "SIZE", options);
    return `sprite.size = +${SIZE} || 0;`;
  };

outputBlocks.push("looks_size");
JavascriptTranslation["looks_size"] = function (jsonblock, utils, options) {
    return `sprite.size`;
  };

/* Throw error test thats used to check if error handling works, not used by actual game stuff */
JavascriptTranslation["error_test"] = function (jsonblock, utils, options) {
    return `throw new Error("This is an error reported by the block");`;
  };


module.exports = JavascriptTranslation;
