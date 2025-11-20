var { blockToJSON, workspaceToJSON } = require("./blocktojson.js");
var JavascriptTranslation = require("./blocks");
var StarterBlocks = require("./blocks/starters.js");
var utilFunctions = require("./blocks/util-functions.js");

function getInput(blockJson, name, options) {
  for (var input of blockJson.inputs) {
    if (input.name == name) {
      console.log(input.block);
      return compileBlockFromJSON(input.block, options);
    }
  }
  return null;
}
function getField(blockJson, name, options) {
  for (var field of blockJson.fields) {
    if (field.name == name) {
      return field.value;
    }
  }
  return null;
}

function compileBlockFromJSON(json, options = {}) {
  if (JavascriptTranslation[json.type]) {
    var output = JavascriptTranslation[json.type](
      json,
      {
        getInput,
        getField,
      },
      options
    );
    if ("function" === typeof output) {
      if (json.next) {
        return output(compileBlockFromJSON(json.next, options));
      } else {
        return output("");
      }
    }
  } else {
    console.warn(
      "Unable to compile block " +
        json.type +
        " because it doesn't exist in the translator."
    );
    var output = "";
  }
  if (json.next) {
    output += compileBlockFromJSON(json.next, options);
  }
  return output;
}

function compileBlock(block, options) {
  if (isStarterBlock(block)) {
    return compileBlockFromJSON(blockToJSON(block), options);
  } else {
    return "";
  }
}

function compileBlockWithThreadForced(block, options) {
  var blockjson = blockToJSON(block);
  return (
    utilFunctions.newThread(blockjson) +
    compileBlockFromJSON(blockToJSON(block), {
      ...options,
      EXECUTE_BLOCKS: true,
    }) +
    utilFunctions.endThread(blockjson)
  );
}

function isStarterBlock(block) {
  var json = blockToJSON(block);
  return StarterBlocks.indexOf(json.type) !== -1;
}

module.exports = {
  compileBlock,
  isStarterBlock,
  compileBlockWithThreadForced,
};
