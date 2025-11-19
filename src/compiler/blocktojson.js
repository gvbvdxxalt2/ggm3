function blockToJSON(block) {
  var myjson = {};

  myjson.type = block.type;
  myjson.id = block.id;

  var jsonFields = [];
  var jsonInputs = [];
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
            });
          }
        } else {
          jsonFields.push({
            value: field.getValue(),
            name: field.name,
          });
        }
      }
    }
  }

  myjson.fields = jsonFields;
  myjson.inputs = jsonInputs;

  var nextBlock = block.getNextBlock();
  if (nextBlock) {
    myjson.next = blockToJSON(nextBlock);
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
