var JSZip = require("jszip");
var engine = require("./curengine.js");

async function saveProjectToZip() {
  var zip = new JSZip();
  var spritesArray = [];
  var i = 0;
  for (var sprite of engine.sprites) {
    var costumesObj = [];
    var spriteObj = {
      x: sprite.x,
      y: sprite.y,
      angle: sprite.angle,
      scaleX: sprite.scaleX,
      scaleY: sprite.scaleY,
      size: sprite.size,
      blocklyXML: sprite.blocklyXML ? Blockly.Xml.domToText(sprite.blocklyXML) : null,
      name: sprite.name,
      zIndex: sprite.zIndex,
      costumeIndex: sprite.costumeIndex
    };
    var ci = 0;
    for (var costume of sprite.costumes) {
      var costumeObj = {
        name: costume.name,
        id: costume.id,
        rotationCenterX: costume.rotationCenterX,
        rotationCenterY: costume.rotationCenterY,
        preferedScale: costume.preferedScale,
        willPreload: costume.willPreload,
        mimeType: costume.mimeType,
      };
      var response = await fetch(costume.dataURL);
      var arrayBuffer = await response.arrayBuffer();

      var fileName = "sprite_" + i + "_costume_" + ci + ".image";
      zip.file(fileName, arrayBuffer);
      costumeObj.file = fileName;
      costumesObj.push(costumeObj);
      ci += 1;
    }
    spriteObj.costumes = costumesObj;
    spritesArray.push(spriteObj);
    i += 1;
  }
  zip.file(
    "game.json",
    JSON.stringify({
      sprites: spritesArray,
    }),
  );
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

async function loadProjectFromZip(arrayBuffer) {
  var zip = await JSZip.loadAsync(arrayBuffer);
  var decodedJSON = JSON.parse(await zip.file("game.json").async("string"));
  engine.emptyProject();
  for (var spriteJson of decodedJSON.sprites) {
    var sprite = engine.createEmptySprite();
    for (var costumeJson of spriteJson.costumes) {
      var costume = null;
      if (costumeJson.willPreload) {
        var dataURL = await arrayBufferToDataURL(await zip.file(costumeJson.file).async("arraybuffer"), costumeJson.mimeType ? costumeJson.mimeType : "image/png");
        costume = await sprite.addCostume(dataURL, costumeJson.name);
      } else {
        var dataURL = await arrayBufferToDataURL(await zip.file(costumeJson.file).async("arraybuffer"), costumeJson.mimeType ? costumeJson.mimeType : "image/png");
        costume = sprite.addCostumeWithoutLoading(dataURL, costumeJson.name);
      }
      Object.assign(costume, {
        id: costumeJson.id,
        rotationCenterX: costumeJson.rotationCenterX,
        rotationCenterY: costumeJson.rotationCenterY,
        preferedScale: costumeJson.preferedScale,
        willPreload: costumeJson.willPreload,
        mimeType: costumeJson.mimeType,
      })
    }
    Object.assign(sprite, {
      x: spriteJson.x,
      y: spriteJson.y,
      angle: spriteJson.angle,
      scaleX: spriteJson.scaleX,
      scaleY: spriteJson.scaleY,
      size: spriteJson.size,
      blocklyXML: spriteJson.blocklyXML ? Blockly.Xml.textToDom(spriteJson.blocklyXML) : null,
      name: spriteJson.name,
      costumeIndex: spriteJson.costumeIndex,
      zIndex: sprite.zIndex
    });
  }
  
}

module.exports = {
  saveProjectToZip,
  loadProjectFromZip
};
