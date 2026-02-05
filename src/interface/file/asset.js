var engine = require("../curengine.js");
var { toSoundJSON, toCostumeJSON } = require("./from-to.js");

//file names

function getCostumeFileName(spriteIndex, costumeIndex) {
  var fileName =
    "sprite_" + spriteIndex + "_costume_" + costumeIndex + ".image";
  return fileName;
}

function getSoundFileName(spriteIndex, soundIndex) {
  var fileName = "sprite_" + spriteIndex + "_sound_" + soundIndex + ".mp3";
  return fileName;
}

//sprite files

function getCostumeData(sprite, spriteIndex) {
  var data = [];
  var costumeIndex = 0;
  for (var costume of sprite.costumes) {
    data.push({
      fileName: getCostumeFileName(spriteIndex || 0, costumeIndex),
      dataURL: costume.dataURL,
      costumeJson: toCostumeJSON(costume),
    });
    costumeIndex += 1;
  }

  return data;
}

function getSoundData(sprite, spriteIndex) {
  var data = [];
  var soundIndex = 0;
  for (var sound of sprite.sounds) {
    data.push({
      fileName: getSoundFileName(spriteIndex || 0, soundIndex),
      dataURL: sound.dataURL,
      soundJson: toSoundJSON(sound),
    });
    soundIndex += 1;
  }

  return data;
}

//array buffer loading for costumes and sounds.

var { fromCostumeJSON, fromSoundJSON } = require("./from-to.js");

async function loadCostume(sprite, costumeJson, fileDataURL) {
  if (costumeJson.willPreload) {
    var costume = await sprite.addCostume(fileDataURL, costumeJson.name);
  } else {
    var costume = sprite.addCostumeWithoutLoading(
      fileDataURL,
      costumeJson.name,
    );
  }
  fromCostumeJSON(costume, costumeJson);
  return costume;
}

async function loadSound(sprite, soundJson, fileDataURL) {
  if (soundJson.willPreload) {
    var sound = await sprite.addSound(fileDataURL, soundJson.name);
  } else {
    var sound = sprite.addSoundWithoutLoading(fileDataURL, soundJson.name);
  }
  fromSoundJSON(sound, soundJson);
  return sound;
}

module.exports = {
  getCostumeFileName,
  getSoundFileName,

  getCostumeData,
  getSoundData,

  loadCostume,
  loadSound,
};
