var JSZip = require("jszip");
var engine = require("../curengine.js");

const RESOURCE_FOLDER = "resources";

var {ProgressMonitor} = require("./progressmonitor.js");
var {arrayBufferToDataURL, dataURLToArrayBuffer} = require("./dataurl.js");

var {getCostumeData, getSoundData} = require("./asset.js");
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

    var engineJSON = toEngineJSON();
    engineJSON.sprites = spriteArray;

    zip.file("game.json", JSON.stringify(engineJSON));

    progress.finish();
    return zip;
}

module.exports = {
    saveProjectZip
};