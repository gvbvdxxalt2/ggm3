var contextMenuCallbacks = [];
var createdAnyBlockContextMenus = false;
var blocks = require("../blocks.js");
var BlockFlasher = require("./flasher.js");
var BlockInstance = require("./blockinstance.js");
let views = [];
let forward = [];
function getBlockly() {
  return new Promise((r) => r(window.Blockly));
}

const CONTEXT_MENU_ORDER = [
  "jump-to-def",
  "editor-devtools",
  "block-switching",
  "blocks2image",
  "swap-local-global",
];

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

function scrollPosFromOffset({ left, top }, metrics) {
  // New Blockly uses "scrollLeft" and "scrollTop" instead of "contentLeft" and "contentTop"
  let scrollLeft = metrics.scrollLeft ?? metrics.contentLeft;
  let scrollTop = metrics.scrollTop ?? metrics.contentTop;
  return {
    sx: left - scrollLeft,
    sy: top - scrollTop,
  };
}

function distance(pos, next) {
  return Math.sqrt(
    Math.pow(pos.left - next.left, 2) + Math.pow(pos.top - next.top, 2),
  );
}

function storeView(next, dist) {
  forward = [];
  let workspace = blocks.getCurrentWorkspace(),
    s = workspace.getMetrics();

  let pos = { left: s.viewLeft, top: s.viewTop };
  if (!next || distance(pos, next) > dist) {
    views.push(pos);
  }
}

function peek() {
  return views.length > 0 ? views[views.length - 1] : null;
}
function getTopOfStackFor(block) {
  let base = block;
  while (base.getOutputShape() && base.getSurroundParent()) {
    base = base.getSurroundParent();
  }
  return base;
}

function scrollBlockIntoView(blockOrId) {
  var offsetX = 32;
  var offsetY = 32;
  let workspace = blocks.getCurrentWorkspace();
  /** @type {Blockly.Block} */
  let block; // or is it really a Blockly.BlockSvg?

  if (blockOrId instanceof BlockInstance) {
    // Highlight the block!
    block = workspace.getBlockById(blockOrId.id);
  } else {
    block =
      blockOrId && blockOrId.id ? blockOrId : workspace.getBlockById(blockOrId);
  }

  if (!block) {
    return;
  }

  /**
   * !Blockly.Block
   */
  let root = block.getRootBlock();
  let base = getTopOfStackFor(block);
  let ePos = base.getRelativeToSurfaceXY(), // Align with the top of the block
    rPos = root.getRelativeToSurfaceXY(), // Align with the left of the block 'stack'
    scale = workspace.scale,
    x = rPos.x * scale,
    y = ePos.y * scale,
    xx = block.width + x, // Turns out they have their x & y stored locally, and they are the actual size rather than scaled or including children...
    yy = block.height + y,
    s = workspace.getMetrics();
  if (
    x < s.viewLeft + offsetX - 4 ||
    xx > s.viewLeft + s.viewWidth ||
    y < s.viewTop + offsetY - 4 ||
    yy > s.viewTop + s.viewHeight
  ) {
    let { sx, sy } = scrollPosFromOffset(
      {
        left: x - offsetX,
        top: y - offsetY,
      },
      s,
    );

    storeView(peek(), 64);

    // workspace.hideChaff(),
    workspace.scrollbar.set(sx, sy);
    storeView({ left: sx, top: sy }, 64);
  }
  this.blockly?.hideChaff();
  BlockFlasher.flash(block);
}

module.exports = {
  createBlockContextMenu,
  scrollBlockIntoView,
};
