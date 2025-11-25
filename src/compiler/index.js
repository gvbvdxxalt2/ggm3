var { blockToJSON, workspaceToJSON } = require("./blocktojson.js");
var JavascriptTranslation = require("./blocks");
var StarterBlocks = require("./blocks/starters.js");
var outputBlocks = require("./blocks/output_blocks.js");
var utilFunctions = require("./blocks/util-functions.js");

function getInput(blockJson, name, options) {
  for (var input of blockJson.inputs) {
    if (input.name == name) {
      return compileBlockFromJSON(input.block, options);
    }
  }
  return null;
}
function getInputBlock(blockJson, name, options) {
  for (var input of blockJson.inputs) {
    if (input.name == name) {
      return input.block;
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
function getFieldText(blockJson, name, options) {
  for (var field of blockJson.fields) {
    if (field.name == name) {
      return field.text;
    }
  }
  return null;
}
function getFieldVariableID(blockJson, name, options) {
  for (var field of blockJson.fields) {
    if (field.name == name) {
      return field.variable.id;
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
        getFieldVariableID,
        getInputBlock,
        getFieldText,
      },
      options,
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
        " because it doesn't exist in the translator.",
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
  if (isOutputBlock(block)) {
    return (
      utilFunctions.startThreadStack(blockjson) +
      `thread.output = ${compileBlockFromJSON(blockjson)};` +
      utilFunctions.endThreadStack(blockjson) +
      "return thread;"
    );
  }
  return (
    utilFunctions.startThreadStack(blockjson) +
    compileBlockFromJSON(blockToJSON(block), {
      ...options,
      EXECUTE_BLOCKS: true,
    }) +
    utilFunctions.endThreadStack(blockjson)
  );
}

function isStarterBlock(block) {
  var json = blockToJSON(block);
  return StarterBlocks.indexOf(json.type) !== -1;
}

function isOutputBlock(block) {
  var json = blockToJSON(block);
  return outputBlocks.indexOf(json.type) !== -1;
}

module.exports = {
  compileBlock,
  isStarterBlock,
  isOutputBlock,
  compileBlockWithThreadForced,
};
