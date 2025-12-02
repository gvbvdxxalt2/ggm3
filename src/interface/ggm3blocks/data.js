var previous_DataCategory = Blockly.DataCategory;
Blockly.DataCategory = function (workspace) {
  var variableModelList = workspace.getVariablesOfType("");
  variableModelList.sort(Blockly.VariableModel.compareByName);
  var xmlList = [];

  Blockly.DataCategory.addCreateButton(xmlList, workspace, "VARIABLE");

  for (var i = 0; i < variableModelList.length; i++) {
    Blockly.DataCategory.addDataVariable(xmlList, variableModelList[i]);
  }

  if (variableModelList.length > 0) {
    xmlList[xmlList.length - 1].setAttribute("gap", 24);
    var firstVariable = variableModelList[0];

    Blockly.DataCategory.addSetVariableTo(xmlList, firstVariable);
    Blockly.DataCategory.addChangeVariableBy(xmlList, firstVariable);
    //Blockly.DataCategory.addShowVariable(xmlList, firstVariable);
    //Blockly.DataCategory.addHideVariable(xmlList, firstVariable);
  }

  return xmlList;
};

Blockly.DataCategory.addCreateButton = previous_DataCategory.addCreateButton;
Blockly.DataCategory.addDataVariable = previous_DataCategory.addDataVariable;
Blockly.DataCategory.addSetVariableTo = previous_DataCategory.addSetVariableTo;
Blockly.DataCategory.addChangeVariableBy =
  previous_DataCategory.addChangeVariableBy;
Blockly.DataCategory.addBlock = previous_DataCategory.addBlock;
Blockly.DataCategory.createValue = previous_DataCategory.createValue;

function createElement(type, args = {}, children = []) {
  var element = document.createElement(type);
  for (var name of Object.keys(args)) {
    element.setAttribute(name, args[name]);
  }
  for (var child of children) {
    element.append(child);
  }
  return element;
}

function createElementXML(text) {
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(text, "text/xml");
  return xmlDoc.children[0];
}

Blockly.WorkspaceSvg.prototype.registerToolboxCategoryCallback(
  "GGM3_VARIABLE",
  function (workspace) {
    var xmlList = [];

    xmlList.push(
      createElement("button", {
        text: "Create variable",
        callbackKey: "GGM3_CREATE_VARIABLE",
      }),
    );

    workspace.registerButtonCallback("GGM3_CREATE_VARIABLE", (button) => {
      Blockly.Variables.createVariable(button.getTargetWorkspace(), null, "");
    });

    var variables = workspace.getVariablesOfType("");
    variables.sort(Blockly.VariableModel.compareByName);

    for (var variable of variables) {
      xmlList.push(
        createElementXML(`
          <block type="data_variable">
            <field name="VARIABLE" id="${variable.getId()}"></field>
          </block>`),
      );
    }

    if (variables.length > 0) {
      var firstVariable = variables[0];
      xmlList.push(
        createElementXML(`
          <block type="data_changevariableby">
            <field name="VARIABLE" id="${firstVariable.getId()}"></field>
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
          </block>`),
      );

      xmlList.push(
        createElementXML(`
          <block type="data_setvariableto">
            <field name="VARIABLE" id="${firstVariable.getId()}"></field>
            <value name="VALUE">
                <shadow type="text">
                    <field name="TEXT">0</field>
                </shadow>
            </value>
          </block>`),
      );
    }

    return xmlList;
  },
);
