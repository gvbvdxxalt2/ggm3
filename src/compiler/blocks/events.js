var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");

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
      return `${utilFunctions.newThread(jsonblock)}${insideCode}thread.stop();`;
    } else {
      return `sprite.addStackListener(
        "started",
        ${JSON.stringify(jsonblock.id)},
        async function () {
        ${utilFunctions.newThread(jsonblock)}
        ${insideCode}
        thread.stop();
      });`;
    }
  };
};

module.exports = JavascriptTranslation;
