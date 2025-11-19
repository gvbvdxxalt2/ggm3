var elements = require("../gp2/elements.js");
var AElement = require("../gp2/aelement.js");

var costumesContainer = elements.getGPId("costumesContainer");
var costumesHeaderContainer = elements.getGPId("costumesHeaderContainer");
var costumesSelectorContainer = elements.getGPId("costumesSelectorContainer");

function reloadCostumes(spr) {
  elements.setInnerJSON(costumesHeaderContainer, [
    {
      element: "button",
      className: "greyButtonStyle",
      textContent: "Import Costume",
      style: {
        marginRight: "2px",
      },
      eventListeners: [
        {
          event: "click",
          func: function () {
            var input = document.createElement("input");
            input.type = "file";
            input.accept = ".webp, .png, .bmp, .svg, .jpg, .jpeg";
            input.onchange = function () {
              if (input.files[0]) {
                var reader = new FileReader();
                reader.onload = async function () {
                  input.value = "";
                  input.remove();

                  try {
                    await spr.addCostume(reader.result);
                    reloadCostumes(spr);
                  } catch (e) {
                    window.alert(e);
                  }
                };
                reader.readAsDataURL(input.files[0]);
              } else {
                input.value = "";
                input.remove();
              }
            };
            input.click();
          },
        },
      ],
    },
  ]);
  if (spr.costumes.length < 1) {
    elements.setInnerJSON(costumesSelectorContainer, [
      {
        element: "span",
        textContent: "This sprite has no costumes.",
        style: {
          fontWeight: "bold",
          textDecoration: "underline",
        },
      },
    ]);
  } else {
    elements.setInnerJSON(
      costumesSelectorContainer,
      spr.costumes.map((costume, i) => {
        return {
          element: "div",
          className: "costumeContainer",
          children: [
            {
              element: "img",
              src: costume.dataURL,
              style: {
                width: "70px",
                height: "70px",
                objectFit: "contain",
              },
            },
            {
              element: "span",
              textContent: costume.name,
            },
            {
              element: "button",
              className: "greyButtonStyle",
              textContent: "Switch",
              style: {
                marginRight: "2px",
                fontSize: "12px",
              },
              eventListeners: [
                {
                  event: "click",
                  func: function () {
                    spr.costumeIndex = i;
                  },
                },
              ],
            },
            {
              element: "button",
              className: "greyButtonStyle",
              textContent: "Delete",
              style: {
                marginRight: "2px",
                fontSize: "12px",
              },
              eventListeners: [
                {
                  event: "click",
                  func: function () {
                    spr.deleteCostume(costume);
                    reloadCostumes(spr);
                  },
                },
              ],
            },
          ],
        };
      })
    );
  }
}

module.exports = {
  reloadCostumes,
};
