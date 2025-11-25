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

module.exports = JavascriptTranslation;
