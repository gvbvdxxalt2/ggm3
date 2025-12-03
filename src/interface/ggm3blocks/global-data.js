var engine = require("../curengine.js");

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

function getSafeHTML(text) {
  var span = document.createElement("span");
  span.textContent = text;
  var html = span.innerHTML;
  span.textContent = "";
  span.remove();
  return html;
}

function createElementXML(text) {
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(text, "text/xml");
  return xmlDoc.children[0];
}

Blockly.WorkspaceSvg.prototype.registerToolboxCategoryCallback(
  "GGM3_GLOBAL_VARIABLE",
  function (workspace) {
    var xmlList = [];

    xmlList.push(
      createElement("button", {
        text: "Create variable",
        callbackKey: "GGM3_CREATE_VARIABLE_GLOBAL",
      }),
    );

    workspace._ggm3_createVariable = (button) => {
      Blockly.prompt("New global variable name: ", "", function (output) {
          if (!output) {
            return;
          }
          var name = output.trim();
          if (!engine.hasGlobalVariable(name)) {
            engine.addGlobalVariable(name);
          }
          workspace.getToolbox().refreshSelection();
        });
    };

    workspace.registerButtonCallback(
      "GGM3_CREATE_VARIABLE_GLOBAL",
      (button) => {
        workspace._ggm3_createVariable(button);
      },
    );

    var variables = Object.keys(engine.globalVariables);

    for (var variable of variables) {
      var blockElement = createElementXML(`
          <block type="globaldata_get">
            <field name="VARIABLE">${getSafeHTML(variable)}</field>
          </block>`);

      // Add context menu to delete the variable
      blockElement.setAttribute("data-variable-name", variable);

      xmlList.push(blockElement);
    }

    if (variables.length > 0) {
      var firstVariable = variables[0];
      xmlList.push(
        createElementXML(`
          <block type="globaldata_changeby">
            <field name="VARIABLE">${getSafeHTML(variable)}</field>
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
          </block>`),
      );

      xmlList.push(
        createElementXML(`
          <block type="globaldata_set">
            <field name="VARIABLE">${getSafeHTML(variable)}</field>
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
