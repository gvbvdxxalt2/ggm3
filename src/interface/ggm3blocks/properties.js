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
  "GGM3_PROPERTY_VARIABLES",
  function (workspace) {
    var xmlList = [];

    xmlList.push(
      createElement("button", {
        text: "Create variable",
        callbackKey: "GGM3_CREATE_VARIABLE_PROPERTY",
      }),
    );

    workspace._ggm3_createVariableProperty = (button) => {
      Blockly.prompt("New variable property name: ", "", function (output) {
        if (!output) {
          return;
        }
        var name = output.trim();
        if (!engine.hasSpriteProperty(name)) {
          engine.addSpriteProperty(name);
        }
        workspace.getToolbox().refreshSelection();
      });
    };

    workspace.registerButtonCallback(
      "GGM3_CREATE_VARIABLE_PROPERTY",
      (button) => {
        workspace._ggm3_createVariableProperty(button);
      },
    );

    var variables = Object.keys(engine.propertyVariables);

    for (var variable of variables) {
      var blockElement = createElementXML(`
          <block type="propertydata_get">
            <value name="TARGET_SPRITE">
                  <shadow type="propertydata_sprite"></shadow>
            </value>
            <field name="VARIABLE">${getSafeHTML(variable)}</field>
          </block>`);

      // Add context menu to delete the variable
      blockElement.setAttribute("propertydata-variable-name", variable);

      xmlList.push(blockElement);
    }

    if (variables.length > 0) {
      var firstVariable = variables[0];

      xmlList.push(
        createElementXML(`
          <block type="propertydata_changeby">
            <value name="TARGET_SPRITE">
                  <shadow type="propertydata_sprite"></shadow>
            </value>
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
          <block type="propertydata_set">
            <value name="TARGET_SPRITE">
                  <shadow type="propertydata_sprite"></shadow>
            </value>
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
