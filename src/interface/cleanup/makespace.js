var blocks = require("../blocks.js");

var contextMenuCallbacks = [];
var createdAnyBlockContextMenus = false;

function getBlockly() {
  return new Promise((r) => r(window.Blockly));
}

function getBlockPosAndXMax(block) {
  const { x, y } = block.getRelativeToSurfaceXY();
  const width = block.getRootBlock().getHeightWidth().width;
  return block.RTL
    ? { pos: { x: x + width, y }, xMax: x }
    : { pos: { x, y }, xMax: x + width };
}

function createBlockContextMenu(
  callback,
  { workspace = false, blocks = false, flyout = false, comments = false } = {},
) {
  contextMenuCallbacks.push({
    addonId: this._addonId,
    callback,
    workspace,
    blocks,
    flyout,
    comments,
  });

  // Sort to ensure userscript run order doesn't change callback order
  contextMenuCallbacks.sort(
    (b, a) =>
      CONTEXT_MENU_ORDER.indexOf(b.addonId) -
      CONTEXT_MENU_ORDER.indexOf(a.addonId),
  );

  if (createdAnyBlockContextMenus) return;
  createdAnyBlockContextMenus = true;

  getBlockly().then((ScratchBlocks) => {
    if (ScratchBlocks.registry) {
      // new Blockly
      const oldGenerateContextMenu =
        ScratchBlocks.BlockSvg.prototype.generateContextMenu;
      ScratchBlocks.BlockSvg.prototype.generateContextMenu = function (
        ...args
      ) {
        let items = oldGenerateContextMenu.call(this, ...args);
        for (const { callback, blocks, flyout } of contextMenuCallbacks) {
          let injectMenu =
            // Block in workspace
            (blocks && !this.isInFlyout) ||
            // Block in flyout
            (flyout && this.isInFlyout);
          if (injectMenu) {
            try {
              items = callback(items, this);
            } catch (e) {
              console.error("Error while calling context menu callback: ", e);
            }
          }
        }
        return items;
      };
      return;
    }

    const oldShow = ScratchBlocks.ContextMenu.show;
    ScratchBlocks.ContextMenu.show = function (event, items, rtl) {
      const gesture = ScratchBlocks.mainWorkspace.currentGesture_;
      const block = gesture.targetBlock_;

      for (const {
        callback,
        workspace,
        blocks,
        flyout,
        comments,
      } of contextMenuCallbacks) {
        let injectMenu =
          // Workspace
          (workspace && !block && !gesture.flyout_ && !gesture.startBubble_) ||
          // Block in workspace
          (blocks && block && !gesture.flyout_) ||
          // Block in flyout
          (flyout && gesture.flyout_) ||
          // Comments
          (comments && gesture.startBubble_);
        if (injectMenu) {
          try {
            items = callback(items, block);
          } catch (e) {
            console.error("Error while calling context menu callback: ", e);
          }
        }
      }

      const oldCreateWidget = ScratchBlocks.ContextMenu.createWidget_;
      ScratchBlocks.ContextMenu.createWidget_ = function (...args) {
        oldCreateWidget.call(this, ...args);
        // Add styles to separator items
        // This must be done before ContextMenu.position_() is called because it changes the height
        const blocklyContextMenu = ScratchBlocks.WidgetDiv.DIV.firstChild;
        items.forEach((item, i) => {
          if (item.separator) {
            const itemElt = blocklyContextMenu.children[i];
            itemElt.setAttribute("role", "separator");
            itemElt.style.padding = "0";
            if (i !== 0) {
              itemElt.style.borderTop = "1px solid hsla(0, 0%, 0%, 0.15)";
            }
          }
        });
      };

      oldShow.call(this, event, items, rtl);

      ScratchBlocks.ContextMenu.createWidget_ = oldCreateWidget;
    };
  });
}

function makeSpaceInWorkspace(targetBlock) {
  const wksp = blocks.getCurrentWorkspace();

  const topBlocks = wksp.getTopBlocks();
  const { pos: tPos, xMax: tXMax } = getBlockPosAndXMax(targetBlock);
  const targetRoot = targetBlock.getRootBlock();
  const isRTL = targetBlock.RTL;

  // TODO: move shift distances to a setting option defined in multiples of grid spacing
  const maxXShift = 380,
    maxYShift = 410;
  let minXShift = maxXShift,
    minYShift = maxYShift;

  // first pass we determine if a block stack should be shifted
  // and if it should be shifted and is closer than maxShift we update the min shift distance
  const shouldShift = [];
  for (const topBlock of topBlocks) {
    if (topBlock === targetRoot) continue;
    const { pos, xMax } = getBlockPosAndXMax(topBlock);

    const withinColumn = isRTL
      ? tPos.x >= xMax && pos.x >= tXMax
      : tPos.x <= xMax && pos.x <= tXMax;

    const shouldShiftX = pos.x < tXMax === isRTL;
    const shouldShiftY = pos.y > tPos.y && withinColumn;
    shouldShift.push([topBlock, shouldShiftX, shouldShiftY]);

    if (shouldShiftX && Math.abs(pos.x - tXMax) < minXShift)
      minXShift = Math.abs(pos.x - tXMax);
    if (shouldShiftY && pos.y - tPos.y < minYShift) minYShift = pos.y - tPos.y;
  }

  // in the second pass we apply a shift based on the min shift to all the blocks we found should be shifted in the first pass
  const shiftX = (isRTL ? -1 : 1) * (maxXShift - minXShift);
  const shiftY = maxYShift - minYShift;
  for (const [block, shldShiftX, shldShiftY] of shouldShift)
    block.moveBy(shiftX * shldShiftX, shiftY * shldShiftY);
}

createBlockContextMenu(
  (items, block) => {
    items.push(
      {
        separator: true,
        _isDevtoolsFirstItem: true,
      },
      {
        enabled: true,
        text: "Make space",
        callback: () => {
          makeSpaceInWorkspace(block, blocks.getCurrentWorkspace());
        },
      },
    );

    return items;
  },
  { blocks: true },
);
