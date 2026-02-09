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
  // Clone xml so we can safely rewrite ids without mutating caller state
  var xmlIn = xml.cloneNode(true);

  // Remap block/comment ids that would collide with existing workspace ids.
  // This prevents duplicate ids when copying blocks between sprites/workspaces
  // and avoids compile/runtime issues caused by id collisions.
  try {
    var idMap = {};
    var genId = function () {
      if (Blockly.utils && Blockly.utils.genUid) return Blockly.utils.genUid();
      if (Blockly.utils && Blockly.utils.createUuid)
        return Blockly.utils.createUuid();
      return "b" + Math.random().toString(36).substring(2, 10);
    };

    var nodeList = xmlIn.getElementsByTagName("*");
    for (var ni = 0; ni < nodeList.length; ni++) {
      var node = nodeList[ni];
      if (!node.nodeName) continue;
      var name = node.nodeName.toLowerCase();
      if (name === "block" || name === "shadow" || name === "comment") {
        if (node.hasAttribute && node.hasAttribute("id")) {
          var oldId = node.getAttribute("id");
          if (!oldId) continue;
          var collides = false;
          try {
            if (workspace.getBlockById && workspace.getBlockById(oldId))
              collides = true;
            if (
              !collides &&
              workspace.getCommentById &&
              workspace.getCommentById(oldId)
            )
              collides = true;
          } catch (e) {
            collides = false;
          }

          // Also remap if we've already assigned a mapping for this oldId
          if (collides || idMap[oldId]) {
            var newId = idMap[oldId] || genId();
            // Ensure newId doesn't collide either
            while (
              (workspace.getBlockById && workspace.getBlockById(newId)) ||
              (workspace.getCommentById && workspace.getCommentById(newId)) ||
              Object.values(idMap).indexOf(newId) !== -1
            ) {
              newId = genId();
            }
            idMap[oldId] = newId;
            node.setAttribute("id", newId);
          }
        }
      }
    }
  } catch (e) {
    // If remapping fails for any reason, fall back to original xml
    xmlIn = xml;
  }

  var newBlockIds = [];
  Blockly.Field.startCache();
  var childCount = xmlIn.childNodes.length;
  var existingGroup = Blockly.Events.getGroup();
  if (!existingGroup) Blockly.Events.setGroup(true);

  if (workspace.setResizesEnabled) workspace.setResizesEnabled(false);

  try {
    // --- PASS 1: Create all variables first ---
    for (var i = 0; i < childCount; i++) {
      var xmlChild = xmlIn.childNodes[i];
      if (xmlChild.nodeName && xmlChild.nodeName.toLowerCase() == "variables") {
        Blockly.Xml.domToVariables(xmlChild, workspace);
      }
    }

    // --- PASS 2: Create blocks and comments ---
    for (var i = 0; i < childCount; i++) {
      var xmlChild = xmlIn.childNodes[i];
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

// Wrap domToBlock so single-block imports (like duplication) also avoid id collisions.
if (Blockly.Xml && Blockly.Xml.domToBlock) {
  (function () {
    var _origDomToBlock = Blockly.Xml.domToBlock;
    Blockly.Xml.domToBlock = function (xmlBlock, workspace) {
      try {
        var xmlClone = xmlBlock.cloneNode(true);
        if (xmlClone.hasAttribute && xmlClone.hasAttribute("id")) {
          var oldId = xmlClone.getAttribute("id");
          var collides = false;
          try {
            if (workspace.getBlockById && workspace.getBlockById(oldId))
              collides = true;
            if (
              !collides &&
              workspace.getCommentById &&
              workspace.getCommentById(oldId)
            )
              collides = true;
          } catch (e) {
            collides = false;
          }
          if (collides) {
            var genId = function () {
              if (Blockly.utils && Blockly.utils.genUid)
                return Blockly.utils.genUid();
              if (Blockly.utils && Blockly.utils.createUuid)
                return Blockly.utils.createUuid();
              return "b" + Math.random().toString(36).substring(2, 10);
            };
            var newId = genId();
            while (
              (workspace.getBlockById && workspace.getBlockById(newId)) ||
              (workspace.getCommentById && workspace.getCommentById(newId))
            ) {
              newId = genId();
            }
            xmlClone.setAttribute("id", newId);
          }
        }
        return _origDomToBlock.call(this, xmlClone, workspace);
      } catch (e) {
        return _origDomToBlock.call(this, xmlBlock, workspace);
      }
    };
  })();
}
