const {
  getOrderedTopBlockColumns,
  autoPositionComment,
} = require("./devtools-utils.js");

const doCleanUp = (workspace) => {
  const result = getOrderedTopBlockColumns(true, workspace);
  const columns = result.cols;

  const gridSize = workspace.getGrid().spacing || workspace.getGrid().spacing_; // new blockly || old blockly

  // coordinates start between the workspace dots but script-snap snaps to them
  let cursorX = gridSize / 2;

  const maxWidths = result.maxWidths;

  for (const column of columns) {
    let cursorY = gridSize / 2;
    let maxWidth = 0;

    for (const block of column.blocks) {
      const xy = block.getRelativeToSurfaceXY();
      if (cursorX - xy.x !== 0 || cursorY - xy.y !== 0) {
        block.moveBy(cursorX - xy.x, cursorY - xy.y);
      }
      const heightWidth = block.getHeightWidth();
      cursorY += heightWidth.height + gridSize;
      cursorY += gridSize - ((cursorY + gridSize / 2) % gridSize);

      const maxWidthWithComments = maxWidths[block.id] || 0;
      maxWidth = Math.max(
        maxWidth,
        Math.max(heightWidth.width, maxWidthWithComments),
      );
    }

    cursorX += maxWidth + gridSize;
    cursorX += gridSize - ((cursorX + gridSize / 2) % gridSize);
  }

  const topComments = workspace.getTopComments();
  for (const comment of topComments) {
    autoPositionComment(comment);
  }
};

module.exports = { doCleanUp };
