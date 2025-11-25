function blockToJSON(block) {
  var myjson = {};
  //myjson.blockObject = block;
  myjson.type = block.type;
  myjson.id = block.id;

  if (typeof block.warp_ !== "undefined") {
    myjson.warp = block.warp_;
  }
  if (typeof block.procCode_ !== "undefined") {
    myjson.procCode = block.procCode_;
  }
  if (typeof block.argumentIds_ !== "undefined") {
    myjson.argumentIds = block.argumentIds_;
  }
  if (typeof block.displayNames_ !== "undefined") {
    myjson.displayNames = block.displayNames_;
  }
  if (typeof block.argumentDefaults_ !== "undefined") {
    myjson.argumentDefaults = block.argumentDefaults_;
  }

  var jsonFields = [];
  var jsonInputs = [];
  if (block.inputList) {
    for (var input of block.inputList) {
      if (input.type == Blockly.DUMMY_INPUT) {
        //Nothing!
      } else {
        var inputjson = {};
        var childBlock = input.connection.targetBlock();
        if (input.type == Blockly.INPUT_VALUE) {
          inputjson.type = "value";
        } else if (input.type == Blockly.NEXT_STATEMENT) {
          inputjson.type = "statement";
        }
        //var shadow = input.connection.getShadowDom();
        //if (shadow && (!childBlock || !childBlock.isShadow())) {
        //
        //}
        if (childBlock) {
          inputjson.name = input.name;

          inputjson.block = blockToJSON(childBlock);
          jsonInputs.push(inputjson);
        }
      }

      for (var field of input.fieldRow) {
        if (field.name && field.SERIALIZABLE) {
          if (field.referencesVariables()) {
            var id = field.getValue();
            if (!id) {
              field.initModel();
              id = field.getValue();
            }

            var variable = field.getVariable();
            if (variable) {
              jsonFields.push({
                variable: {
                  name: variable.name,
                  id: variable.getId(),
                },
                name: field.name,
                text: field.getText(),
              });
            }
          } else {
            jsonFields.push({
              value: field.getValue(),
              name: field.name,
              text: field.getText(),
            });
          }
        }
      }
    }
  }

  myjson.fields = jsonFields;
  myjson.inputs = jsonInputs;

  if (block.getNextBlock) {
    var nextBlock = block.getNextBlock();
    if (nextBlock) {
      myjson.next = blockToJSON(nextBlock);
    }
  }
  return myjson;
}

function workspaceToJSON(workspace) {
  var blocks = workspace.getTopBlocks(true);
  var generated = [];
  for (var block of blocks) {
    generated.push(blockToJSON(block));
  }
  return generated;
}

module.exports = {
  blockToJSON,
  workspaceToJSON,
};
