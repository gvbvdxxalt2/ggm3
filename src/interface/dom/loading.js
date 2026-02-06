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
        require("./loadingicon.js"),
        {
          element: "span",
          style: {
            fontSize: "30px",
          },
          textContent: "Loading...",
        },
        {
          element: "div",
          gid: "loadingScreenContent",
          style: {
            textAlign: "center",
          },
        },
      ],
    },
  ],
};
