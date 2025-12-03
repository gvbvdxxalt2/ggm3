var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");
var starterBlocks = require("./starters.js");
starterBlocks.push("event_whengamestarts"); //When game starts is a on-event block.
JavascriptTranslation["event_whengamestarts"] = function (
  jsonblock,
  utils,
  options,
) {
  return function (insideCode) {
    if (options.EXECUTE_BLOCKS) {
      //Means ONLY execute blocks, don't add listeners to the sprite.
      return `${insideCode}`;
    } else {
      return `sprite.addStackListener(
        "started",
        ${JSON.stringify(jsonblock.id)},
        async function () {
        ${utilFunctions.startThreadStack(jsonblock)}
        ${insideCode}
        ${utilFunctions.endThreadStack(jsonblock)}
      });`;
    }
  };
};

starterBlocks.push("event_ggm3_whenbroadcasted");
JavascriptTranslation["event_ggm3_whenbroadcasted"] = function (
  jsonblock,
  utils,
  options,
) {
  var BROADCAST_NAME = utils.getField(jsonblock, "BROADCAST_NAME", options);
  return function (insideCode) {
    if (options.EXECUTE_BLOCKS) {
      //Means ONLY execute blocks, don't add listeners to the sprite.
      return `${insideCode}`;
    } else {
      return `sprite.addBroadcastListener(
        ${JSON.stringify(BROADCAST_NAME)},
        ${JSON.stringify(jsonblock.id)},
        async function () {
        ${utilFunctions.startThreadStack(jsonblock)}
        ${insideCode}
        ${utilFunctions.endThreadStack(jsonblock)}
      });`;
    }
  };
};

JavascriptTranslation["event_ggm3_broadcast"] = function (
  jsonblock,
  utils,
  options,
) {
  var BROADCAST_NAME = utils.getInput(
    jsonblock,
    "BROADCAST_NAME",
    options,
    "undefined",
  );
  return `engine.broadcast("" + (${BROADCAST_NAME}));`;
};

JavascriptTranslation["event_ggm3_broadcast_and_wait"] = function (
  jsonblock,
  utils,
  options,
) {
  var BROADCAST_NAME = utils.getInput(
    jsonblock,
    "BROADCAST_NAME",
    options,
    "undefined",
  );
  return `${utilFunctions.aliveCheck()}await engine.broadcastAndWait("" + (${BROADCAST_NAME}));${utilFunctions.aliveCheck()}`;
};

JavascriptTranslation["event_ggm3_frame_broadcast"] = function (
  jsonblock,
  utils,
  options,
) {
  var BROADCAST_NAME = utils.getInput(
    jsonblock,
    "BROADCAST_NAME",
    options,
    "undefined",
  );
  return `engine.broadcastOnNextFrame("" + (${BROADCAST_NAME}));`;
};

JavascriptTranslation["event_ggm3_broadcast_menu"] = function (
  jsonblock,
  utils,
  options,
) {
  var BROADCAST_NAME = utils.getField(jsonblock, "BROADCAST_NAME", options);
  return JSON.stringify(BROADCAST_NAME);
};

module.exports = JavascriptTranslation;
