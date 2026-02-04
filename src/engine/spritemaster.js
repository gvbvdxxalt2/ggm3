class SpriteMaster { //Blocks for sprite master
    static SPRITE_MASTER_VALUES = {
        "x position": "x",
        "y position": "y",
        "direction": "direction",
        "costume name": "costume.name",
        "costume index/number": "costumeIndex",
        "alpha": "alpha",
        "x stretch": "scaleX",
        "y stretch": "scaleY",
        "skew x": "skewX",
        "skew y": "skewY"
    };

    constructor (originSprite) {
        this.sprite = originSprite;
    }

    findSpriteByName(spriteName) {
        this.sprite.findSpriteByName(spriteName);
    }

    dispose() {
        
    }
}

module.exports = SpriteMaster;