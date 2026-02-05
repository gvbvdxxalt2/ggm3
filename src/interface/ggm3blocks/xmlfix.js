Blockly.Xml.domToWorkspace = function (xml, workspace) {
  if (xml instanceof Blockly.Workspace) {
    var swap = xml;
    xml = workspace;
    workspace = swap;
    console.warn(
      "Deprecated call to Blockly.Xml.domToWorkspace, swap the arguments.",
    );
  }

  var width;
  if (workspace.RTL) width = workspace.getWidth();

  var newBlockIds = [];
  Blockly.Field.startCache();
  var childCount = xml.childNodes.length;
  var existingGroup = Blockly.Events.getGroup();
  if (!existingGroup) Blockly.Events.setGroup(true);

  if (workspace.setResizesEnabled) workspace.setResizesEnabled(false);

  try {
    // --- PASS 1: Create all variables first ---
    for (var i = 0; i < childCount; i++) {
      var xmlChild = xml.childNodes[i];
      if (xmlChild.nodeName && xmlChild.nodeName.toLowerCase() == "variables") {
        Blockly.Xml.domToVariables(xmlChild, workspace);
      }
    }

    // --- PASS 2: Create blocks and comments ---
    for (var i = 0; i < childCount; i++) {
      var xmlChild = xml.childNodes[i];
      var name = xmlChild.nodeName ? xmlChild.nodeName.toLowerCase() : "";

      if (name == "block" || (name == "shadow" && !Blockly.Events.recordUndo)) {
        var block = Blockly.Xml.domToBlock(xmlChild, workspace);
        newBlockIds.push(block.id);
        var blockX = xmlChild.hasAttribute("x")
          ? parseInt(xmlChild.getAttribute("x"), 10)
          : 10;
        var blockY = xmlChild.hasAttribute("y")
          ? parseInt(xmlChild.getAttribute("y"), 10)
          : 10;
        if (!isNaN(blockX) && !isNaN(blockY)) {
          block.moveBy(workspace.RTL ? width - blockX : blockX, blockY);
        }
      } else if (name == "comment") {
        if (workspace.rendered) {
          Blockly.WorkspaceCommentSvg.fromXml(xmlChild, workspace, width);
        } else {
          Blockly.WorkspaceComment.fromXml(xmlChild, workspace);
        }
      }
      // Note: we ignore 'variables' here because we did it in Pass 1
    }
  } finally {
    if (!existingGroup) Blockly.Events.setGroup(false);
    Blockly.Field.stopCache();
  }

  if (workspace.setResizesEnabled) workspace.setResizesEnabled(true);
  return newBlockIds;
};

Blockly.Variables.generateUniqueName = function (workspace) {
  // Instead of i, j, k... let's use something that tells us WHERE the bug is
  var variableList = workspace.getAllVariables();
  return "unnamed_variable_" + (variableList.length + 1);
};

Blockly.Variables.createVariable_ = function (
  workspace,
  id,
  opt_name,
  opt_type,
) {
  //Stops creation bug with variable names.
  var potentialVariableMap = workspace.getPotentialVariableMap();
  var realWorkspace = workspace.isFlyout
    ? workspace.targetWorkspace
    : workspace;

  if (opt_name) {
    if (potentialVariableMap) {
      return potentialVariableMap.createVariable(opt_name, opt_type, id);
    } else {
      return workspace.createVariable(opt_name, opt_type, id);
    }
  }

  var existingVars = realWorkspace.getVariablesOfType(opt_type || "");
  if (existingVars.length > 0) {
    return existingVars[0];
  }

  var defaultName = opt_type === "list" ? "my list" : "variable1";
  return realWorkspace.createVariable(defaultName, opt_type, id);
};
