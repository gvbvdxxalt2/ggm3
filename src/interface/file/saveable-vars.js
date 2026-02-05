function getSaveableVariables(variables) {
  var saveableVars = {};
  for (var varName in variables) {
    var variable = variables[varName];
    try {
      saveableVars[varName] = JSON.parse(JSON.stringify(variable.value));
    } catch (e) {
      saveableVars[varName] = 0;
    }
  }
  return saveableVars;
}

function getSaveableVariablesGlobal(variables) {
  var saveableVars = {};
  for (var varName in variables) {
    var variable = variables[varName];
    try {
      saveableVars[varName] = JSON.parse(JSON.stringify(variable));
    } catch (e) {
      saveableVars[varName] = 0;
    }
  }
  return saveableVars;
}

module.exports = {
  getSaveableVariables,
  getSaveableVariablesGlobal,
};
