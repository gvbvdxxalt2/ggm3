module.exports = {
  element: "div",
  className: "rightPanel",
  children: [
    {
      element: "div",
      className: "rightPanelContent",
      children: [
        {
          element: "div",
          className: "projectContainer",
          gid: "projectContainer",
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
          ]
        },
        {
          element: "span",
          className: "projectMouseCoordinates",
          gid: "projectMouseCoordinates",
        },
        {
          element: "div",
          className: "selectedSpriteContainer",
          children: require("./sprite-inputs.js"),
        },
        {
          element: "div",
          className: "spritesContainer",
          gid: "spritesContainer",
          children: [],
        },
        {
          element: "div",
          className: "addSpriteButton greyButtonStyle",
          gid: "addSpriteButton",
          children: [
            {
              element: "img",
              src: "/icons/add.svg",
              style: {
                width: "32px",
                height: "32px",
              },
            },
          ],
        },
      ],
    },
  ],
};
