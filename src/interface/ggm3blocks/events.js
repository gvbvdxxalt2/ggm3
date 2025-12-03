Blockly.Blocks["event_whengamestarts"] = {
  init: function () {
    this.jsonInit({
      id: "event_whengamestarts",
      message0: "When game starts",
      inputsInline: true,
      nextStatement: null,
      category: Blockly.Categories.event,
      colour: Blockly.Colours.event.primary,
    });
  },
};

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
  "GGM3_BROADCASTING",
  function (workspace) {
    var xmlList = [];

    xmlList.push(
      createElement("button", {
        text: "Create broadcast message",
        callbackKey: "GGM3_CREATE_BROADCAST_MESSAGE",
      }),
    );

    workspace.registerButtonCallback(
      "GGM3_CREATE_BROADCAST_MESSAGE",
      (button) => {
        Blockly.prompt("New broadcast message name: ", "message", function (output) {
          if (!output) {
            return;
          }
          var name = output.trim();
          engine.addBroadcastName(name);
          workspace.getToolbox().refreshSelection();
        });
      },
    );

    var broadcastNames = engine.getBroadcastNames();

    for (var brodcastName of broadcastNames) {
      xmlList.push(
        createElementXML(`
          <block type="event_ggm3_whenbroadcasted">
            <field name="BROADCAST_NAME">${getSafeHTML(brodcastName)}</field>
          </block>`),
      );
      xmlList.push(
        createElementXML(`
          <block type="event_ggm3_broadcast">
            <value name="BROADCAST_NAME">
              <shadow type="event_ggm3_broadcast_menu">
                <field name="BROADCAST_NAME">${getSafeHTML(brodcastName)}</field>
              </shadow>
            </value>
          </block>`),
      );
      xmlList.push(
        createElementXML(`
          <block type="event_ggm3_broadcast_and_wait">
            <value name="BROADCAST_NAME">
              <shadow type="event_ggm3_broadcast_menu">
                <field name="BROADCAST_NAME">${getSafeHTML(brodcastName)}</field>
              </shadow>
            </value>
          </block>`),
      );
      xmlList.push(
        createElementXML(`
          <block type="event_ggm3_frame_broadcast" gap="20">
            <value name="BROADCAST_NAME">
              <shadow type="event_ggm3_broadcast_menu">
                <field name="BROADCAST_NAME">${getSafeHTML(brodcastName)}</field>
              </shadow>
            </value>
          </block>`),
      );
    }

    return xmlList;
  },
);

function getBroadcastMenuFunction() {
  return function () {
    var broadcastNames = engine.getBroadcastNames();
    if (broadcastNames.length === 0) {
      return [["(No Broadcast Messages)", "none"]];
    }
    return broadcastNames.map((name) => [name, name]);
  }
}

function contextMenuFunction(options) {
    var broadcastField = this.getField("BROADCAST_NAME");
    if (broadcastField) {
      var broadcastName = broadcastField.getValue();
      // Try to get main workspace from flyout/toolbox
      var mainWorkspace = null;
      if (this.workspace && this.workspace.targetWorkspace) {
        mainWorkspace = this.workspace.targetWorkspace;
      } else if (
        this.workspace &&
        this.workspace.options &&
        this.workspace.options.parentWorkspace
      ) {
        mainWorkspace = this.workspace.options.parentWorkspace;
      } else if (window.Blockly && Blockly.getMainWorkspace) {
        mainWorkspace = Blockly.getMainWorkspace();
      }

      options.push({
        text: "Delete broadcast message",
        enabled: true,
        callback: function () {
          Blockly.confirm(
            `Delete broadcast message "${broadcastName}"?`,
            function (accepted) {
              if (accepted) {
                engine.removeBroadcastName(broadcastName);

                if (
                  mainWorkspace &&
                  mainWorkspace.getToolbox &&
                  mainWorkspace.getToolbox()
                ) {
                  mainWorkspace.getToolbox().refreshSelection();
                }
              }
            },
          );
        },
      });
    }
  }

Blockly.Blocks["event_ggm3_broadcast_menu"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "BROADCAST_NAME",
          options: getBroadcastMenuFunction()
        },
      ],
      category: Blockly.Categories.control,
      extensions: ["output_string"],
      colour: "#bf9c00",
    });
  },
  customContextMenu: contextMenuFunction,
};

Blockly.Blocks["event_ggm3_broadcast"] = {
  init: function () {
    this.jsonInit({
      message0: "broadcast %1",
      args0: [
        {
          type: "input_value",
          name: "BROADCAST_NAME",
        },
      ],
      category: Blockly.Categories.control,
      extensions: ["shape_statement"],
      colour: "#bf9c00"
    });
  },
};

Blockly.Blocks["event_ggm3_frame_broadcast"] = {
  init: function () {
    this.jsonInit({
      message0: "broadcast %1 before next frame",
      args0: [
        {
          type: "input_value",
          name: "BROADCAST_NAME",
        },
      ],
      category: Blockly.Categories.control,
      extensions: ["shape_statement"],
      colour: "#bf9c00"
    });
  },
};

Blockly.Blocks["event_ggm3_broadcast_and_wait"] = {
  init: function () {
    this.jsonInit({
      message0: "broadcast %1 and wait",
      args0: [
        {
          type: "input_value",
          name: "BROADCAST_NAME",
        },
      ],
      category: Blockly.Categories.control,
      extensions: ["shape_statement"],
      colour: "#bf9c00"
    });
  },
};

Blockly.Blocks["event_ggm3_whenbroadcasted"] = {
  init: function () {
    this.jsonInit({
      message0: "when %1 broadcasted",
      args0: [
        {
          type: "field_dropdown",
          name: "BROADCAST_NAME",
          options: getBroadcastMenuFunction()
        },
      ],
      category: Blockly.Categories.control,
      colour: "#bf9c00",
      extensions: ["shape_hat"],
    });
  },
  customContextMenu: contextMenuFunction,
};
