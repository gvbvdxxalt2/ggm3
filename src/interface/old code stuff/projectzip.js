var JSZip = require("jszip");
var engine = require("./curengine.js");
var selectedSprite = require("./selectedsprite.js");

function fromEnginePropertyNames(from) {
  engine.propertyVariables = {};
  for (var name of from || []) {
    engine.propertyVariables[name] = true;
  }
}

function toEnginePropertyNames(from) {
  return Object.keys(engine.propertyVariables);
}

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

function getSaveableVariables(variables) {
  var saveableVars = {};
  for (var varName in variables) {
    var variable = variables[varName];
    try {
      saveableVars[varName] = JSON.parse(JSON.stringify(variable.value));
    } catch (e) {
      saveableVars[varName] = 0;
    }
  }
  return saveableVars;
}

function getSaveableVariablesGlobal(variables) {
  var saveableVars = {};
  for (var varName in variables) {
    var variable = variables[varName];
    try {
      saveableVars[varName] = JSON.parse(JSON.stringify(variable));
    } catch (e) {
      saveableVars[varName] = 0;
    }
  }
  return saveableVars;
}

function toSpriteJSON(sprite) {
  return {
    x: sprite.x,
    y: sprite.y,
    angle: sprite.angle,
    scaleX: sprite.scaleX,
    scaleY: sprite.scaleY,
    skewX: sprite.skewX,
    skewY: sprite.skewY,
    size: sprite.size,
    blocklyXML: sprite.blocklyXML
      ? Blockly.Xml.domToText(sprite.blocklyXML)
      : null,
    name: sprite.name,
    zIndex: sprite.zIndex,
    costumeIndex: sprite.costumeIndex,
    variables: getSaveableVariables(sprite.variables),
    properties: getSaveableVariablesGlobal(sprite.spriteProperties),
    hidden: sprite.hidden,
  };
}

function toCostumeJSON(costume) {
  return {
    name: costume.name,
    id: costume.id,
    rotationCenterX: costume.rotationCenterX,
    rotationCenterY: costume.rotationCenterY,
    preferedScale: costume.preferedScale,
    willPreload: costume.willPreload,
    mimeType: costume.mimeType,
  };
}

function toSoundJSON(sound) {
  return {
    name: sound.name,
    id: sound.id,
    willPreload: sound.willPreload,
    mimeType: sound.mimeType,
  };
}

async function saveProjectToZip(progressBar = function () {}) {
  var zip = new JSZip();
  var spritesArray = [];
  var i = 0;
  selectedSprite.saveCurrentSpriteCode();
  progressBar(0);
  function calculateNeeded() {
    var needed = 0;
    for (var spriteJson of engine.sprites) {
      var costumes = spriteJson.costumes;
      var sounds = spriteJson.sounds ? spriteJson.sounds : [];
      needed += spriteJson.costumes.length + sounds.length;
    }
    return needed;
  }
  var needed = calculateNeeded() + 1; //add 1 to count for saving project json.
  var saved = 0;
  for (var sprite of engine.sprites) {
    var costumesObj = [];
    var soundsObj = [];
    var spriteObj = toSpriteJSON(sprite);
    var ci = 0;
    for (var costume of sprite.costumes) {
      saved += 1;
      progressBar(saved / needed);
      var costumeObj = toCostumeJSON(costume);
      var response = await fetch(costume.dataURL);
      var arrayBuffer = await response.arrayBuffer();

      var fileName = "sprite_" + i + "_costume_" + ci + ".image";
      zip.file(fileName, arrayBuffer);
      costumeObj.file = fileName;
      costumesObj.push(costumeObj);
      ci += 1;
    }
    var si = 0;
    for (var sound of sprite.sounds) {
      saved += 1;
      progressBar(saved / needed);
      var obj = toSoundJSON(sound);
      var response = await fetch(sound.src);
      var arrayBuffer = await response.arrayBuffer();

      var fileName = "sprite_" + i + "_sound_" + si + ".mp3";
      zip.file(fileName, arrayBuffer);
      obj.file = fileName;
      soundsObj.push(obj);
      si += 1;
    }
    spriteObj.costumes = costumesObj;
    spriteObj.sounds = soundsObj;
    spritesArray.push(spriteObj);
    i += 1;
  }
  zip.file(
    "game.json",
    JSON.stringify({
      sprites: spritesArray,
      globalVariables: getSaveableVariablesGlobal(engine.globalVariables),
      broadcastNames: engine.broadcastNames,
      frameRate: engine.frameRate,
      spriteProperties: toEnginePropertyNames(),
    }),
  );
  saved += 1;
  progressBar(saved / needed);
  return zip;
}

function arrayBufferToDataURL(arrayBuffer, mimeType) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([arrayBuffer], { type: mimeType });

    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(blob);
  });
}

function fromSpriteJSON(sprite, spriteJson) {
  Object.assign(sprite, {
    x: spriteJson.x,
    y: spriteJson.y,
    angle: spriteJson.angle,
    scaleX: spriteJson.scaleX,
    scaleY: spriteJson.scaleY,
    skewX: spriteJson.skewX || 0,
    skewY: spriteJson.skewY || 0,
    size: spriteJson.size,
    blocklyXML: spriteJson.blocklyXML
      ? Blockly.Xml.textToDom(spriteJson.blocklyXML)
      : null,
    name: spriteJson.name,
    costumeIndex: spriteJson.costumeIndex,
    zIndex: spriteJson.zIndex,
    variables: spriteJson.variables,
    hidden: spriteJson.hidden,
    spriteProperties: spriteJson.properties || {},
  });
}

function fromCostumeJSON(costume, costumeJson) {
  Object.assign(costume, {
    id: costumeJson.id,
    rotationCenterX: costumeJson.rotationCenterX,
    rotationCenterY: costumeJson.rotationCenterY,
    preferedScale: costumeJson.preferedScale,
    willPreload: costumeJson.willPreload,
    mimeType: costumeJson.mimeType,
  });
}

function fromSoundJSON(sound, soundJson) {
  Object.assign(sound, {
    id: soundJson.id,
    willPreload: soundJson.willPreload,
    mimeType: soundJson.mimeType,
  });
}

async function loadProjectFromZip(arrayBuffer, progressJSON = function () {}) {
  progressJSON([
    {
      element: "span",
      textContent: "Loading file...",
    },
  ]);
  var zip = await JSZip.loadAsync(arrayBuffer);
  progressJSON([
    {
      element: "span",
      textContent: "Reading data...",
    },
  ]);
  var decodedJSON = JSON.parse(await zip.file("game.json").async("string"));
  engine.stopGame();
  engine.emptyProject();
  Object.assign(engine, {
    globalVariables: decodedJSON.globalVariables || {},
    broadcastNames: decodedJSON.broadcastNames || [],
    frameRate: decodedJSON.frameRate || 60,
  });
  fromEnginePropertyNames(decodedJSON.spriteProperties);

  function calculateNeeded() {
    var needed = 0;
    for (var spriteJson of decodedJSON.sprites) {
      var costumes = spriteJson.costumes;
      var sounds = spriteJson.sounds ? spriteJson.sounds : [];
      needed += spriteJson.costumes.length + sounds.length;
    }
    return needed;
  }
  var needed = calculateNeeded();
  var loaded = 0;
  function markProgress() {
    progressJSON([
      {
        element: "span",
        textContent: "Loading resources...",
      },
      createProgessBarJSON(loaded / needed),
    ]);
  }
  markProgress();
  for (var spriteJson of decodedJSON.sprites) {
    var sprite = engine.createEmptySprite();
    for (var costumeJson of spriteJson.costumes) {
      loaded += 1;
      markProgress();
      var costume = null;
      if (costumeJson.willPreload) {
        var dataURL = await arrayBufferToDataURL(
          await zip.file(costumeJson.file).async("arraybuffer"),
          costumeJson.mimeType ? costumeJson.mimeType : "image/png",
        );
        costume = await sprite.addCostume(dataURL, costumeJson.name);
      } else {
        var dataURL = await arrayBufferToDataURL(
          await zip.file(costumeJson.file).async("arraybuffer"),
          costumeJson.mimeType ? costumeJson.mimeType : "image/png",
        );
        costume = sprite.addCostumeWithoutLoading(dataURL, costumeJson.name);
      }
      fromCostumeJSON(costume, costumeJson);
    }
    var sounds = spriteJson.sounds ? spriteJson.sounds : []; //Some very early versions don't provide sounds.
    for (var soundJson of sounds) {
      loaded += 1;
      markProgress();
      var sound = null;
      if (soundJson.willPreload) {
        var dataURL = await arrayBufferToDataURL(
          await zip.file(soundJson.file).async("arraybuffer"),
          soundJson.mimeType ? soundJson.mimeType : "audio/mp3",
        );
        sound = await sprite.addSound(dataURL, soundJson.name);
      } else {
        var dataURL = await arrayBufferToDataURL(
          await zip.file(soundJson.file).async("arraybuffer"),
          soundJson.mimeType ? soundJson.mimeType : "audio/mp3",
        );
        sound = sprite.addSoundWithoutLoading(dataURL, soundJson.name);
      }
      fromSoundJSON(sound, soundJson);
    }
    fromSpriteJSON(sprite, spriteJson);

    selectedSprite.compileSpriteXML(sprite);
  }
  progressJSON([
    {
      element: "span",
      textContent: "Finishing up...",
    },
  ]);
}

module.exports = {
  saveProjectToZip,
  loadProjectFromZip,
};
