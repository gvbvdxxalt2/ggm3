var { blockToJSON, workspaceToJSON } = require("./blocktojson.js");
function compileBlock(block) {
  var json = blockToJSON(block);
}
module.exports = {
  compileBlock,
};
