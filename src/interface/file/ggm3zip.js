var JSZip = require("jszip");
var engine = require("../curengine.js");

const RESOURCE_FOLDER = "resources";
const GAME_FILE = "game.json";

var {ProgressMonitor} = require("./progressmonitor.js");
var {arrayBufferToDataURL, dataURLToArrayBuffer} = require("./dataurl.js");

var {getCostumeData, getSoundData, loadCostume, loadSound} = require("./asset.js");
const {
    toEngineJSON,
    toSpriteJSON,
    toCostumeJSON,
    toSoundJSON,

    fromEngineJSON,
    fromSpriteJSON,
    fromCostumeJSON,
    fromSoundJSON
} = require("./from-to.js");

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
    var zip = new JSZip();
    zip.folder(RESOURCE_FOLDER);

    var max = calculateProjectSaveMax();
    progress.calculatedMax(max);
    progress.current = 0;

    var spriteArray = [];
    var spriteIndex = 0;
    for (var sprite of engine.sprites) {
        var spriteJson = toSpriteJSON(sprite); //add the sprite properties, without the sound and costume properties.

        //Manually create the costumes array.
        var costumeData = getCostumeData(sprite, spriteIndex);
        spriteJson.costumes = [];
        for (var file of costumeData) {
            
            var arrayBuffer = await dataURLToArrayBuffer(file.dataURL);
            var filePath = `${RESOURCE_FOLDER}/${file.fileName}`;
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
            var filePath = `${RESOURCE_FOLDER}/${file.fileName}`;
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
    var zip = JSZip.loadAsync(zipSource);

    var gameFile = zip.file(GAME_FILE);
    if (!gameFile) {
        throw new Error("Game JSON file doesn't exist in zip file.");
        return;
    }
    try{
        var engineJson = JSON.parse(await gameFile.async("string"));
    }catch(e){
        console.error("Corrupt game JSON: ",e);
        throw new Error("The project game JSON data is corrupt. Check the console for errors.");
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

    fromEngineJSON(engineJson);

    for (var spriteJson of engineJson.sprites) {
        var sprite = engine.createEmptySprite();
        for (var costumeJson of spriteJson.costumes) {
            var 
        }
    }
}

module.exports = {
    saveProjectZip,
    saveProjectZipBlob
};