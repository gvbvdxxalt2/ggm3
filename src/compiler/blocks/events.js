var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");

require("./starters.js").push("event_whengamestarts"); //When game starts is a on-event block.
JavascriptTranslation["event_whengamestarts"] = function (
  jsonblock,
  utils,
  options
) {
  var X = utils.getInput(jsonblock, "X");
  var Y = utils.getInput(jsonblock, "Y");

  return function (insideCode) {
    if (options.EXECUTE_BLOCKS) {
      //Means ONLY execute blocks, don't add listeners to the sprite.
      return `${insideCode}`;
    } else {
      return `sprite.addStackListener(
        "started",
        ${JSON.stringify(jsonblock.id)},
        async function () {
        ${utilFunctions.newThread(jsonblock)}
        ${insideCode}
        ${utilFunctions.endThread(jsonblock)}
      });`;
    }
  };
};

module.exports = JavascriptTranslation;
