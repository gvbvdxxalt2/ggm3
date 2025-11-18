module.exports = {
  elements: "div",
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
      ],
    },
  ],
};
