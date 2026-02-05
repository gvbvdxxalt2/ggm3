var JSZip = require("jszip");
var engine = require("../curengine.js");

const RESOURCE_FOLDER = "resources";
const RESOURCE_SOUNDS_FOLDER = "sounds";
const RESOURCE_COSTUMES_FOLDER = "costumes";
const GAME_FILE = "game.json";

var { ProgressMonitor } = require("./progressmonitor.js");
var { arrayBufferToDataURL, dataURLToArrayBuffer } = require("./dataurl.js");

var {
  getCostumeData,
  getSoundData,
  loadCostume,
  loadSound,
} = require("./asset.js");

const {
  toEngineJSON,
  toSpriteJSON,
  toCostumeJSON,
  toSoundJSON,

  fromEngineJSON,
  fromSpriteJSON,
  fromCostumeJSON,
  fromSoundJSON,
} = require("./from-to.js");

var { compileSprite, saveCurrentSpriteCode } = require("./spritestuff.js");

function calculateProjectSaveMax() {
  var max = 0;
  for (var sprite of engine.sprites) {
    max += sprite.costumes.length;
    max += sprite.sounds.length;
  }
  return max;
}

//Writing a entire game file.

async function saveProjectZip(progress = new ProgressMonitor()) {
  saveCurrentSpriteCode(); //Save current code to be safe that its saved.

  var zip = new JSZip();
  zip.folder(RESOURCE_FOLDER);

  var max = calculateProjectSaveMax();
  progress.calculatedMax(max);
  progress.current = 0;

  var spriteArray = [];
  var spriteIndex = 0;
  for (var sprite of engine.sprites) {
    var spriteJson = toSpriteJSON(sprite); //add the sprite properties, without the sound and costume properties.

    //Some bit of organizing the folders.
    zip.folder(`${RESOURCE_FOLDER}/${spriteIndex}`);
    zip.folder(`${RESOURCE_FOLDER}/${spriteIndex}/${RESOURCE_COSTUMES_FOLDER}`);
    zip.folder(`${RESOURCE_FOLDER}/${spriteIndex}/${RESOURCE_SOUNDS_FOLDER}`);

    //Manually create the costumes array.
    var costumeData = getCostumeData(sprite, spriteIndex);
    spriteJson.costumes = [];
    for (var file of costumeData) {
      var arrayBuffer = await dataURLToArrayBuffer(file.dataURL);
      var filePath = `${RESOURCE_FOLDER}/${spriteIndex}/${RESOURCE_COSTUMES_FOLDER}/${file.fileName}`;
      zip.file(filePath, arrayBuffer);
      progress.current += 1;

      var costumeJson = file.costumeJson; //get costume property data.
      costumeJson.file = filePath; //add file path to read later.
      spriteJson.costumes.push(costumeJson);
    }

    //Manually create the sounds array.
    var soundData = getSoundData(sprite, spriteIndex);
    spriteJson.sounds = [];
    for (var file of soundData) {
      var arrayBuffer = await dataURLToArrayBuffer(file.dataURL);
      var filePath = `${RESOURCE_FOLDER}/${spriteIndex}/${RESOURCE_SOUNDS_FOLDER}/${file.fileName}`;
      zip.file(filePath, arrayBuffer);
      progress.current += 1;

      var soundJson = file.soundJson; //get sound property data.
      soundJson.file = filePath; //add file path to read later.
      spriteJson.sounds.push(soundJson);
    }

    spriteArray.push(spriteJson);

    spriteIndex += 1;
  }

  var engineJson = toEngineJSON();
  engineJson.sprites = spriteArray;

  zip.file(GAME_FILE, JSON.stringify(engineJson));

  progress.finish();
  return zip;
}

async function saveProjectZipBlob(progress = new ProgressMonitor()) {
  var zip = await saveProjectZip(progress);
  var blob = await zip.generateAsync({ type: "blob" });
  progress.finish();
  return blob;
}

//Loading an entire game file.

async function loadProjectZip(zipSource, progress = new ProgressMonitor()) {
  var zip = await JSZip.loadAsync(zipSource);

  var gameFile = zip.file(GAME_FILE);
  if (!gameFile) {
    throw new Error("Game JSON file doesn't exist in zip file.");
    return;
  }
  try {
    var engineJson = JSON.parse(await gameFile.async("string"));
  } catch (e) {
    console.error("Corrupt game JSON: ", e);
    throw new Error(
      "The project game JSON data is corrupt. Check the console for errors.",
    );
    return;
  }

  //Calculate the amount of assets to be loaded.
  var max = 0;
  for (var sprite of engineJson.sprites) {
    max += sprite.costumes.length;
    max += sprite.sounds.length;
  }
  progress.calculatedMax(max);

  //Load everything

  engine.emptyProject(); //Start from empty project

  fromEngineJSON(engineJson);

  for (var spriteJson of engineJson.sprites) {
    var sprite = engine.createEmptySprite();

    //Load costumes

    for (var costumeJson of spriteJson.costumes) {
      var mimeType = costumeJson.mimeType ? costumeJson.mimeType : "image/png"; //Fallback to PNG file type if it doesn't have a mime type.
      var filePath = costumeJson.file;

      var file = zip.file(filePath); //Find the file
      if (!file) {
        throw new Error(
          `Unable to locate file path "${filePath}" in the ggm3 file.`,
        );
        return;
      }
      var arrayBuffer = await file.async("arraybuffer");
      var dataURL = await arrayBufferToDataURL(arrayBuffer, mimeType);

      await loadCostume(sprite, costumeJson, dataURL);
      progress.current += 1;
    }

    //Load sounds

    for (var soundJson of spriteJson.sounds) {
      var mimeType = soundJson.mimeType ? soundJson.mimeType : "audio/mp3"; //Fallback to MP3 file type if it doesn't have a mime type.
      var filePath = soundJson.file;

      var file = zip.file(filePath); //Find the file
      if (!file) {
        throw new Error(
          `Unable to locate file path "${filePath}" in the ggm3 file.`,
        );
        return;
      }
      var arrayBuffer = await file.async("arraybuffer");
      var dataURL = await arrayBufferToDataURL(arrayBuffer, mimeType);

      await loadSound(sprite, soundJson, dataURL);
      progress.current += 1;
    }

    //Add sprite properties.
    fromSpriteJSON(sprite, spriteJson);

    //Compile the sprite so that code works.
    compileSprite(sprite);
  }

  progress.finish();
}

module.exports = {
  saveProjectZip,
  saveProjectZipBlob,

  loadProjectZip,
};
