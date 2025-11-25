var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");
var starterBlocks = require("./starters.js");
var outputBlocks = require("./output_blocks.js");

starterBlocks.push("procedures_definition");
JavascriptTranslation["procedures_definition"] = function (
  jsonblock,
  utils,
  options,
) {
  var definitionStuff = utils.getInputBlock(jsonblock, "custom_block", options);
  if (!definitionStuff) {
    return function (insideCode) {
        return "";
    };
  }
  var valueNameCode = "";
  definitionStuff.argumentIds.forEach((argId, i) => {
    var name = definitionStuff.displayNames[i];
    valueNameCode += `thread.customBlockValues[${JSON.stringify(name)}] = customBlockArgs[${JSON.stringify(argId)}];`;
  });

  return function (insideCode) {
    if (options.EXECUTE_BLOCKS) {
      //Means ONLY execute blocks, don't add listeners to the sprite.
      return `${insideCode}`;
    } else {
      return `sprite.addCustom(
        ${JSON.stringify(jsonblock.id)},
        ${JSON.stringify(definitionStuff.procCode)},
        async function (customBlockArgs,parentThread) {
        ${utilFunctions.startThreadStack(jsonblock)}
        thread.customBlockInherit(parentThread);
        ${definitionStuff.warp ? `thread.turnOnWithoutRefresh();` : ""}
        ${valueNameCode}
        ${insideCode}
        ${utilFunctions.endThreadStack(jsonblock)}
      });`;
    }
  };
};

JavascriptTranslation["procedures_call"] = function (
  jsonblock,
  utils,
  options,
) {
    var valueCode = "{";
    var i = 0;
    for (var argId of jsonblock.argumentIds) {
        var code = utils.getInput(jsonblock, argId, options);
        if (code) {
            valueCode += JSON.stringify(argId);
            valueCode += ":";
            valueCode += `(${code})`;
            valueCode += ",";
        }
        i += 1;
    }
    valueCode += "}";
    
    return `await sprite.callCustom(${JSON.stringify(jsonblock.procCode)}, ${valueCode}, thread);`;
};

outputBlocks.push("argument_reporter_boolean");
JavascriptTranslation["argument_reporter_boolean"] = function (
  jsonblock,
  utils,
  options,
) {
    var field = utils.getField(jsonblock, "VALUE", options);
    return `thread.customBlockValues[${JSON.stringify(field)}]`;
};

outputBlocks.push("argument_reporter_string_number");
JavascriptTranslation["argument_reporter_string_number"] = function (
  jsonblock,
  utils,
  options,
) {
    var field = utils.getField(jsonblock, "VALUE", options);
    return `thread.customBlockValues[${JSON.stringify(field)}]`;
};

module.exports = JavascriptTranslation;
