var {
  compileSpriteXML,
  saveCurrentSpriteCode,
  compileAllSprites
} = require("../selectedsprite.js");

function compileSprite(sprite) {
  compileSpriteXML(sprite);
}

module.exports = {
  compileSprite,
  saveCurrentSpriteCode,
  compileAllSprites,
};
