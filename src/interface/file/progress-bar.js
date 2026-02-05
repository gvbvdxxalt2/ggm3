function createProgessBarJSON(decimal = 0) {
  return {
    element: "div",
    className: "loadingProgressMain",
    children: [
      {
        element: "div",
        className: "loadingProgressInner",
        style: {
          width: Math.round(decimal * 100) + "%",
        },
      },
    ],
  };
}

module.exports = {
  createProgessBarJSON,
};
