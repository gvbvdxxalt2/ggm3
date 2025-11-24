module.exports = {
  element: "div",
  className: "leftPanel",
  children: [
    {
      element: "div",
      className: "tabArea",
      gid: "tabArea",
    },
    {
      element: "div",
      className: "tabWindow",
      gid: "tabWindow",
      children: [
        {
          element: "div",
          className: "blocklyDiv",
          gid: "blocklyDiv",
        },
        {
          element: "div",
          className: "costumesContainer",
          gid: "costumesContainer",
          children: [
            {
              element: "div",
              className: "costumesHeaderContainer",
              gid: "costumesHeaderContainer",
            },
            {
              element: "div",
              className: "costumesSelectorContainer",
              gid: "costumesSelectorContainer",
            },
          ],
        },
        require("./costumepivot.js")
      ],
    },
  ],
};
