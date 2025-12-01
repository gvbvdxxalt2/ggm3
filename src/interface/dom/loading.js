module.exports = {
  element: "div",
  gid: "loadingScreenContainer",
  children: [
    {
      element: "div",
      className: "loadingDialogBG",
    },
    {
      element: "div",
      className: "loadingDialogBox",
      children: [
        {
          element: "div",
          className: "loader2",
        },
        {
          element: "span",
          style: {
            fontSize: "30px",
          },
          textContent: "Loading...",
        },
      ],
    },
  ],
};
