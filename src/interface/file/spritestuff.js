var {compileSpriteXML} = require("../selectedsprite.js");

function compileSprite(sprite) {
    compileSpriteXML(sprite);
}

function saveCurrentSpriteCode() {
    selectedSprite.saveCurrentSpriteCode();
}

module.exports = {
    compileSprite,
    saveCurrentSpriteCode
};