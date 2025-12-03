var elements = require("../gp2/elements.js");
var AElement = require("../gp2/aelement.js");

var soundsContainer = elements.getGPId("soundsContainer");
var soundsHeaderContainer = elements.getGPId("soundsHeaderContainer");
var soundsSelectorContainer = elements.getGPId("soundsSelectorContainer");

var { makeSortable } = require("./drag-utils.js");

function reloadSounds(spr, reloadTabCallback = function () {}) {
  elements.setInnerJSON(soundsHeaderContainer, [
    {
      element: "button",
      className: "greyButtonStyle",
      textContent: "Import Sound",
      style: {
        marginRight: "2px",
      },
      eventListeners: [
        {
          event: "click",
          func: function () {
            var input = document.createElement("input");
            input.type = "file";
            input.accept = ".mp3, .webm, .ogg, .flac, .wav";
            input.multiple = true;
            input.onchange = async function () {
              if (input.files[0]) {
                var p = [];
                for (var _file of input.files) {
                  function load(file) {
                    return new Promise((resolve) => {
                      var reader = new FileReader();
                      reader.onload = async function () {
                        input.value = "";
                        input.remove();

                        try {
                          var sound = await spr.addSound(reader.result);
                          sound.mimeType = file.type;
                          resolve();
                          reloadSounds(spr);
                        } catch (e) {
                          window.alert(e);
                        }
                      };
                      reader.readAsDataURL(file);
                    });
                  }
                  p.push(load(_file));
                }
                Promise.all(p).then(() => {
                  reloadTabCallback(spr);
                });
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
  if (spr.sounds.length < 1) {
    elements.setInnerJSON(soundsSelectorContainer, [
      {
        element: "span",
        textContent: "This sprite has no sounds.",
        style: {
          fontWeight: "bold",
          textDecoration: "underline",
        },
      },
    ]);
  } else {
    elements.setInnerJSON(
      soundsSelectorContainer,
      spr.sounds.map((sound, i) => {
        return {
          element: "div",
          className: "soundContainer",
          children: [
            {
              element: "audio",
              controls: true,
              src: sound.src,
              style: {
                objectFit: "contain",
              },
            },
            {
                element: "br"
            },
            {
                element: "div",
                style: {
                    display: "flex",
                    flexDirection: "row"
                },
                children: [
                    {
                        element: "input",
                        value: sound.name,
                        className: "selectedCostumeInput",
                        eventListeners: [
                          {
                            event: "change",
                            func: function () {
                              sound.name = this.value.trim();
                              spr.ensureUniqueSoundNames();
                              reloadSounds(spr);
                              reloadTabCallback(spr);
                            },
                          },
                        ],
                      },
                      {
                        element: "button",
                        className: "greyButtonStyle",
                        style: {
                          marginRight: "2px",
                          fontSize: "12px",
                        },
                        GPWhenCreated: function (elm) {
                          if (sound.willPreload) {
                            elm.textContent = "Disable preloading";
                          } else {
                            elm.textContent = "Enable preloading";
                          }
                        },
                        eventListeners: [
                          {
                            event: "click",
                            func: function () {
                              sound.willPreload = !sound.willPreload;
                              if (sound.willPreload) {
                                this.textContent = "Disable preloading";
                              } else {
                                this.textContent = "Enable preloading";
                              }
                            },
                          },
                        ],
                      },
                      {
                        element: "button",
                        className: "greyButtonStyle",
                        textContent: "Load",
                        style: {
                          marginRight: "2px",
                          fontSize: "12px",
                        },
                        eventListeners: [
                          {
                            event: "click",
                            func: function () {
                              sound.loadSound();
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
                              spr.deleteSound(sound);
                              reloadSounds(spr);
                              reloadTabCallback(spr);
                            },
                          },
                        ],
                      },
                ]
            }
            
          ],
        };
      }),
    );

    makeSortable(
      soundsSelectorContainer,
      ".soundContainer",
      (oldIndex, newIndex) => {
        // This callback runs only when the user releases the mouse
        // and the order has actually changed.

        if (oldIndex === newIndex) return;

        // 1. Move data in the engine
        var soundToMove = spr.sound[oldIndex];
        spr.sounds.splice(oldIndex, 1);
        spr.sounds.splice(newIndex, 0, soundToMove);

        spr.ensureUniqueSoundNames();

        reloadSounds(spr);
        reloadTabCallback(spr);
      },
    );
  }
}

module.exports = {
  reloadSounds,
};
