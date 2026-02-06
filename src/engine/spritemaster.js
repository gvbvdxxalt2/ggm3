var SpriteMasterConsts = require("../sprmaster.js");

class SpriteMaster {
  //Blocks for sprite master

  constructor(originSprite) {
    this.sprite = originSprite;
  }

  findSpriteByName(spriteName) {
    this.sprite.findSpriteByName(spriteName);
  }

  getSpriteSafe(spriteName) {
    var targetSprite = this.findSpriteByName(spriteName);
    if (!targetSprite) {
      return {};
    }

    return targetSprite;
  }

  getClonesOf(spriteName, option) {
    var targetSprite = this.findSpriteByName(spriteName);
    if (!targetSprite) {
      return [];
    }

    if (targetSprite.isClone) {
      //Get the parent sprite since this is running in a clone.
      return Array.from(targetSprite.parent.clones);
    }
    //Clone the clones array so that editing it
    // won't rearrange clones and stuff.
    return Array.from(targetSprite.clones);
  }

  getCloneCountOf(spriteName, option) {
    var targetSprite = this.findSpriteByName(spriteName);
    if (!targetSprite) {
      return 0;
    }

    if (targetSprite.isClone) {
      //Get the parent sprite since this is running in a clone.
      return targetSprite.parent.clones.length;
    }

    return targetSprite.clones.length;
  }

  dispose() {}
}

module.exports = SpriteMaster;
