module.exports = {
  element: "div",
  className: "rightPanel",
  children: [
    {
      element: "div",
      className: "projectControls",
      gid: "projectControls",
    },
    {
      element: "canvas",
      gid: "projectCanvas",
      className: "projectCanvas",
    },
    {
      element: "div",
      className: "selectedSpriteContainer",
      children: [
        {
          element: "span",
          className: "selectedSpriteLabel",
          textContent: "Name:",
        },
        {
          element: "input",
          className: "selectedSpriteInput",
          value: "Sprite",
          gid: "spriteNameInput",
        },
        {
          element: "span",
          className: "selectedSpriteLabel",
          textContent: "X (Position):",
        },
        {
          element: "input",
          type: "number",
          className: "selectedSpriteInput",
          gid: "spriteXPosInput",
        },
        {
          element: "span",
          className: "selectedSpriteLabel",
          textContent: "Y (Position):",
        },
        {
          element: "input",
          type: "number",
          className: "selectedSpriteInput",
          gid: "spriteYPosInput",
        },
      ],
    },
    {
      element: "div",
      className: "spritesContainer",
      gid: "spritesContainer",
      children: [],
    },
  ],
};
