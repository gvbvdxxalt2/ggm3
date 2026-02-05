var { doCleanUp } = require("./cleanup.js");
var blocks = require("../blocks.js");

Blockly.WorkspaceSvg.prototype.cleanUp = function () {
  doCleanUp(blocks.getCurrentWorkspace());
};

require("./makespace.js");
require("./block-duplicate.js");
