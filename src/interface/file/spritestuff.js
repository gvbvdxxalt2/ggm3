var {
  compileSpriteXML,
  saveCurrentSpriteCode,
} = require("../selectedsprite.js");

function compileSprite(sprite) {
  compileSpriteXML(sprite);
}

module.exports = {
  compileSprite,
  saveCurrentSpriteCode,
};
