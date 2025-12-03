const indexForPositionOnList = ({ x, y }, boxes, isRtl) => {
  if (boxes.length === 0) return null;
  let index = null;
  const leftEdge = Math.min.apply(
    null,
    boxes.map((b) => b.left),
  );
  const rightEdge = Math.max.apply(
    null,
    boxes.map((b) => b.right),
  );
  const topEdge = Math.min.apply(
    null,
    boxes.map((b) => b.top),
  );
  const bottomEdge = Math.max.apply(
    null,
    boxes.map((b) => b.bottom),
  );
  for (let n = 0; n < boxes.length; n++) {
    const box = boxes[n];
    // Construct an "extended" box for each, extending out to infinity if
    // the box is along a boundary.
    let minX = box.left === leftEdge ? -Infinity : box.left;
    let maxX = box.right === rightEdge ? Infinity : box.right;
    const minY = box.top === topEdge ? -Infinity : box.top;
    const maxY = box.bottom === bottomEdge ? Infinity : box.bottom;
    // The last item in the wrapped list gets a right edge at infinity, even
    // if it isn't the farthest right, in RTL mode. In LTR mode, it gets a
    // left edge at infinity.
    if (n === boxes.length - 1) {
      if (isRtl) {
        minX = -Infinity;
      } else {
        maxX = Infinity;
      }
    }

    // Check if the point is in the bounds.
    if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
      index = n;
      break; // No need to keep looking.
    }
  }
  return index;
};

function makeSortable(container, selector, onChange) {
  var isDragging = false;
  var draggedItem = null; // The actual DOM element
  var ghostItem = null; // The visual clone following the mouse
  var placeholder = null; // The invisible spacer in the list

  var initialIndex = null;
  var cachedBoxes = []; // Snapshot of positions at start of drag
  var startX = 0;
  var startY = 0;
  var offsetX = 0;
  var offsetY = 0;

  // 1. Mouse Down Handler
  container.onmousedown = function (e) {
    // Find the closest draggable item
    var target = e.target.closest(selector);

    // Ignore if clicking buttons/inputs inside the item
    if (
      !target ||
      e.target.tagName === "BUTTON" ||
      e.target.tagName === "INPUT"
    ) {
      return;
    }

    e.preventDefault(); // Prevent text selection
    startDrag(target, e.clientX, e.clientY);
  };

  function startDrag(target, clientX, clientY) {
    isDragging = true;
    draggedItem = target;

    // Calculate initial index
    var children = Array.from(container.children);
    initialIndex = children.indexOf(target);

    // 1. Snapshot layout (Exclude the dragged item from logic to keep grid stable)
    // We want the boxes of where items *are*, to calculate where to slot in.
    cachedBoxes = children.map((c) => {
      var rect = c.getBoundingClientRect();
      return {
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      };
    });

    // 2. Calculate offset so the item doesn't snap to top-left of mouse
    var rect = target.getBoundingClientRect();
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;

    // 3. Create Ghost (Visual representation)
    ghostItem = document.createElement("div");
    ghostItem.style.position = "fixed";
    ghostItem.style.zIndex = "10000";
    ghostItem.style.pointerEvents = "none"; // Important: lets events pass through to calculation
    ghostItem.style.width = rect.width + "px";
    ghostItem.style.height = rect.height + "px";
    ghostItem.style.boxShadow = "0 8px 15px rgba(0,0,0,1)";
    ghostItem.style.left = clientX - offsetX + "px";
    ghostItem.style.top = clientY - offsetY + "px";
    ghostItem.style.background = "#000000";
    ghostItem.style.opacity = "0.5";
    document.body.appendChild(ghostItem);

    // 4. Style the original item to act as the "Placeholder"
    // We keep it in the DOM but make it invisible, it will move around as we sort.
    //draggedItem.style.opacity = "0.0";
    draggedItem.style.backgroundColor = "#000000";
    //draggedItem.style.visibility = "hidden"; // Keep layout space, hide content

    // 5. Add Global Listeners
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  function onMouseMove(e) {
    if (!isDragging) return;

    // 1. Move Ghost
    ghostItem.style.left = e.clientX - offsetX + "px";
    ghostItem.style.top = e.clientY - offsetY + "px";

    // 2. Calculate Index
    // Note: We check against cachedBoxes (static layout) to prevent jitter
    var newIndex = indexForPositionOnList(
      { x: e.clientX, y: e.clientY },
      cachedBoxes,
      false, // Assuming LTR for now, pass true if RTL needed
    );

    if (newIndex !== null) {
      var children = Array.from(container.children);
      var currentIndex = children.indexOf(draggedItem);

      // If the geometric index is different from where the item currently sits:
      if (newIndex !== currentIndex) {
        // Move the actual DOM element (the invisible placeholder)
        // This causes the other items to shift visually
        if (newIndex >= children.length) {
          container.appendChild(draggedItem);
        } else {
          // Logic to determine insert direction
          var refNode = children[newIndex];
          if (currentIndex < newIndex) {
            // Dragging down/right, insert after
            container.insertBefore(draggedItem, refNode.nextSibling);
          } else {
            // Dragging up/left, insert before
            container.insertBefore(draggedItem, refNode);
          }
        }
      }
    }
  }

  function onMouseUp(e) {
    if (!isDragging) return;

    // 1. Cleanup Visuals
    document.body.removeChild(ghostItem);
    draggedItem.style.backgroundColor = "";

    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);

    // 2. Calculate final change
    var children = Array.from(container.children);
    var finalIndex = children.indexOf(draggedItem);

    isDragging = false;
    ghostItem = null;
    draggedItem = null;
    cachedBoxes = [];

    // 3. Trigger Callback if changed
    if (initialIndex !== finalIndex) {
      onChange(initialIndex, finalIndex);
    }
  }
}

module.exports = { makeSortable };
