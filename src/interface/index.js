if (window.Blockly) {
  window.ScratchBlocks = window.Blockly;
} else {
  throw new Error("Blockly global definition is missing.");
}

require("./main.js");
