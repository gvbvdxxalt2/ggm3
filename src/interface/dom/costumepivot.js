module.exports = {
    element: "div",
    className: "costumePivotContainer",
    gid: "costumePivotContainer",
    children: [
      {
        element: "div",
        className: "costumesInPivotContainer",
        gid: "costumesInPivotContainer",
      },
      {
        element: "div",
        className: "pivotEditor",
        gid: "pivotEditor",
        children: [
          {
            element: "div",
            className: "pivotEditorContainer",
            gid: "pivotEditorContainer",
            children: [
              {
                element: "div",
                className: "pivotEditorImageContainer",
                gid: "pivotEditorImageContainer",
                children: [
                  {
                    element: "img",
                    gid: "pivotEditorImage"
                  },
                  {
                    element: "div",
                    gid: "pivotEditorDot",
                    className: "pivotEditorDot"
                  }
                ]
              }
            ]
          },
          {
            element: "div",
            className: "pivotEditorMenuBar",
            gid: "pivotEditorMenuBar",
            children: [
                {
                    element: "span",
                    style: {
                        fontWeight: "bold"
                    },
                    textContent: "X: "
                },
                {
                    element: "input",
                    className: "pivotEditorMenuInput",
                    type: "number",
                    gid: "pivotEditorXInput"
                },
                {
                    element: "span",
                    style: {
                        fontWeight: "bold"
                    },
                    textContent: "Y: "
                },
                {
                    element: "input",
                    className: "pivotEditorMenuInput",
                    type: "number",
                    gid: "pivotEditorYInput"
                },
                {
                    element: "span",
                    style: {
                        fontWeight: "bold"
                    },
                    textContent: "Zoom: "
                },
                {
                    element: "input",
                    type: "range",
                    min: 1,
                    max: 500,
                    gid: "pivotEditorZoomInput"
                },
                {
                    element: "button",
                    textContent: "Center image",
                    className: "greyButtonStyle",
                    gid: "centerImagePivotEditor"
                }
            ]
          },
        ]
      }
    ],
  };