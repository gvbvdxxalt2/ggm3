var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");
var starterBlocks = require("./starters.js");
var outputBlocks = require("./output_blocks.js");

JavascriptTranslation["control_wait"] = function (jsonblock, utils, options) {
  var DURATION = utils.getInput(jsonblock, "DURATION", options);

  return `${utilFunctions.aliveCheck(jsonblock)}await thread.waitSeconds(${DURATION});${utilFunctions.aliveCheck(jsonblock)}`;
};

JavascriptTranslation["control_forever"] = function (
  jsonblock,
  utils,
  options,
) {
  var SUBSTACK = utils.getInput(jsonblock, "SUBSTACK", options);

  return `${utilFunctions.aliveCheck(jsonblock)}while (true) {${utilFunctions.aliveCheck(jsonblock)}if (thread.screenRefresh) {await thread.waitForNextFrame();}${utilFunctions.aliveCheck(jsonblock)}${SUBSTACK}}${utilFunctions.aliveCheck(jsonblock)}`;
};

JavascriptTranslation["control_repeat"] = function (jsonblock, utils, options) {
  var TIMES = utils.getInput(jsonblock, "TIMES", options);
  var SUBSTACK = utils.getInput(jsonblock, "SUBSTACK", options);

  return `${utilFunctions.aliveCheck(jsonblock)}await thread.repeatTimes(${TIMES},async function (){${SUBSTACK}});${utilFunctions.aliveCheck(jsonblock)}`;
};

JavascriptTranslation["control_repeat_until"] = function (
  jsonblock,
  utils,
  options,
) {
  var CONDITION = utils.getInput(jsonblock, "CONDITION", options);
  var SUBSTACK = utils.getInput(jsonblock, "SUBSTACK", options);

  return `${utilFunctions.aliveCheck(jsonblock)}while (!(${CONDITION})) {${utilFunctions.aliveCheck(jsonblock)} if (thread.screenRefresh) {await thread.waitForNextFrame();} ${utilFunctions.aliveCheck(jsonblock)} ${SUBSTACK}}${utilFunctions.aliveCheck(jsonblock)}`;
};

JavascriptTranslation["control_while"] = function (jsonblock, utils, options) {
  var CONDITION = utils.getInput(jsonblock, "CONDITION", options);
  var SUBSTACK = utils.getInput(jsonblock, "SUBSTACK", options);

  return `${utilFunctions.aliveCheck(jsonblock)}while (${CONDITION}) {${utilFunctions.aliveCheck(jsonblock)} if (thread.screenRefresh) {await thread.waitForNextFrame();} ${utilFunctions.aliveCheck(jsonblock)} ${SUBSTACK}}${utilFunctions.aliveCheck(jsonblock)}`;
};

JavascriptTranslation["control_if"] = function (jsonblock, utils, options) {
  var CONDITION = utils.getInput(jsonblock, "CONDITION", options);

  var SUBSTACK = utils.getInput(jsonblock, "SUBSTACK", options);

  return `if (${CONDITION}) {${SUBSTACK}}`;
};

JavascriptTranslation["control_if_else"] = function (
  jsonblock,
  utils,
  options,
) {
  var CONDITION = utils.getInput(jsonblock, "CONDITION", options);

  var SUBSTACK = utils.getInput(jsonblock, "SUBSTACK", options);
  var SUBSTACK2 = utils.getInput(jsonblock, "SUBSTACK2", options);

  return `if (${CONDITION}) {${SUBSTACK}} else {${SUBSTACK2}}`;
};

JavascriptTranslation["control_wait_until"] = function (
  jsonblock,
  utils,
  options,
) {
  var CONDITION = utils.getInput(jsonblock, "CONDITION", options);

  return `${utilFunctions.aliveCheck(jsonblock)}while (!(${CONDITION})) {${utilFunctions.aliveCheck(jsonblock)}await thread.waitForNextFrame();}${utilFunctions.aliveCheck(jsonblock)}`;
};

starterBlocks.push("control_start_as_clone");
JavascriptTranslation["control_start_as_clone"] = function (
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
        "clonestart",
        ${JSON.stringify(jsonblock.id)},
        async function () {
        ${utilFunctions.startThreadStack(jsonblock)}
        ${insideCode}
        ${utilFunctions.endThreadStack(jsonblock)}
      });`;
    }
  };
};

starterBlocks.push("control_create_clone_of_menu");
JavascriptTranslation["control_create_clone_of_menu"] = function (
  jsonblock,
  utils,
  options,
) {
  var CLONE_OPTION = utils.getField(jsonblock, "CLONE_OPTION", options);

  return JSON.stringify(CLONE_OPTION);
};


JavascriptTranslation["control_create_clone_of"] = function (
  jsonblock,
  utils,
  options,
) {
  var CLONE_OPTION = utils.getInput(jsonblock, "CLONE_OPTION", options);

  return `sprite.findSpriteByName(${CLONE_OPTION}).createClone();`;
};

module.exports = JavascriptTranslation;
