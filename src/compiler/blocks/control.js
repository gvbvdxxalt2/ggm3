var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");
var starterBlocks = require("./starters.js");
var outputBlocks = require("./output_blocks.js");

JavascriptTranslation["control_wait"] = function (jsonblock, utils, options) {
  // Fallback to "0" to prevent "waitSeconds()" with no args or undefined
  var DURATION = utils.getInput(jsonblock, "DURATION", options, "0");

  return `${utilFunctions.aliveCheck(jsonblock)}await thread.waitSeconds(${DURATION});${utilFunctions.aliveCheck(jsonblock)}`;
};

JavascriptTranslation["control_forever"] = function (
  jsonblock,
  utils,
  options,
) {
  // Fallback to empty string "" so we don't write "undefined" inside the loop
  var SUBSTACK = utils.getInput(jsonblock, "SUBSTACK", options, "");

  return `${utilFunctions.aliveCheck(jsonblock)}while (true) {${utilFunctions.aliveCheck(jsonblock)}${SUBSTACK}if (thread.screenRefresh) {await thread.waitForNextFrame();};${utilFunctions.aliveCheck(jsonblock)}}${utilFunctions.aliveCheck(jsonblock)}`;
};

JavascriptTranslation["control_repeat"] = function (jsonblock, utils, options) {
  var TIMES = utils.getInput(jsonblock, "TIMES", options, "0");
  var SUBSTACK = utils.getInput(jsonblock, "SUBSTACK", options, "");

  return `${utilFunctions.aliveCheck(jsonblock)}await thread.repeatTimes(${TIMES},async function (){${SUBSTACK}});${utilFunctions.aliveCheck(jsonblock)}`;
};

JavascriptTranslation["control_repeat_until"] = function (
  jsonblock,
  utils,
  options,
) {
  // Fallback to "false". "while(!(false))" is valid syntax (infinite loop).
  // "while(!())" is a syntax crash.
  var CONDITION = utils.getInput(jsonblock, "CONDITION", options, "false");
  var SUBSTACK = utils.getInput(jsonblock, "SUBSTACK", options, "");

  return `${utilFunctions.aliveCheck(jsonblock)}while (!(${CONDITION})) {${utilFunctions.aliveCheck(jsonblock)}${utilFunctions.aliveCheck(jsonblock)} ${SUBSTACK} if (thread.screenRefresh) {await thread.waitForNextFrame();}}${utilFunctions.aliveCheck(jsonblock)}`;
};

JavascriptTranslation["control_while"] = function (jsonblock, utils, options) {
  var CONDITION = utils.getInput(jsonblock, "CONDITION", options, "false");
  var SUBSTACK = utils.getInput(jsonblock, "SUBSTACK", options, "");

  return `${utilFunctions.aliveCheck(jsonblock)}while (${CONDITION}) {${utilFunctions.aliveCheck(jsonblock)} ${utilFunctions.aliveCheck(jsonblock)} ${SUBSTACK} if (thread.screenRefresh) {await thread.waitForNextFrame();}}${utilFunctions.aliveCheck(jsonblock)}`;
};

JavascriptTranslation["control_if"] = function (jsonblock, utils, options) {
  var CONDITION = utils.getInput(jsonblock, "CONDITION", options, "false");
  var SUBSTACK = utils.getInput(jsonblock, "SUBSTACK", options, "");

  return `if (${CONDITION}) {${SUBSTACK}}`;
};

JavascriptTranslation["control_if_else"] = function (
  jsonblock,
  utils,
  options,
) {
  var CONDITION = utils.getInput(jsonblock, "CONDITION", options, "false");
  var SUBSTACK = utils.getInput(jsonblock, "SUBSTACK", options, "");
  var SUBSTACK2 = utils.getInput(jsonblock, "SUBSTACK2", options, "");

  return `if (${CONDITION}) {${SUBSTACK}} else {${SUBSTACK2}}`;
};

JavascriptTranslation["control_wait_until"] = function (
  jsonblock,
  utils,
  options,
) {
  var CONDITION = utils.getInput(jsonblock, "CONDITION", options, "false");

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
  // Fallback to null string. "findSpriteByName()" with empty args might be valid or fail gracefully,
  // but "findSpriteByName( )" (empty space) is syntax error if generated poorly.
  // We use '"_myself_"' or 'null' to be safe.
  var CLONE_OPTION = utils.getInput(
    jsonblock,
    "CLONE_OPTION",
    options,
    '"_myself_"',
  );

  return `sprite.findSpriteByName(${CLONE_OPTION})?.createClone();`;
  // Added optional chaining (?.) just in case sprite is not found, to prevent crash.
};

JavascriptTranslation["control_delete_this_clone"] = function (
  jsonblock,
  utils,
  options,
) {
  return `sprite.destroyClone();`;
};

outputBlocks.push("control_elapsed");
JavascriptTranslation["control_elapsed"] = function (
  jsonblock,
  utils,
  options,
) {
  return `(engine.elapsedFrameTime / 1000)`;
};

outputBlocks.push("control_isclone");
JavascriptTranslation["control_isclone"] = function (
  jsonblock,
  utils,
  options,
) {
  return `sprite.isClone`;
};

outputBlocks.push("control_stop");
JavascriptTranslation["control_stop"] = function (jsonblock, utils, options) {
  var STOP_OPTION = utils.getField(jsonblock, "STOP_OPTION", options);

  if (STOP_OPTION == "this script") {
    return `thread.stop();${utilFunctions.aliveCheck(jsonblock)}`;
  }
  if (STOP_OPTION == "other scripts in sprite") {
    return `thread.stopEverythingButMe();`;
  }
  // Safe return if option is somehow missing
  return "";
};

module.exports = JavascriptTranslation;
