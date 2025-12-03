var AudioEngine = require("./audio.js");

var CollisionSprite = require("./mask.js");

class Sound {
  constructor(engine, sprite, dataURL, onread) {
    this.engine = engine;
    this.sprite = sprite;
    this.src = dataURL;
    this.data = null;
    this.onread = onread || function () {};
    this.id = Date.now() + "_" + Math.round(Math.random() * 9999999);
  }
  
  set playbackRate(v) {
    this._playbackRate = +v || 0;
    if (this._playbackRate < 0) {
        this._playbackRate = 0;
    }
    if (this._playbackRate > 99999) {
        this._playbackRate = 99999;
    }
  }

  get playbackRate() {
    return this._playbackRate;
  }

  play (spriteContext) {
    var sprite = spriteContext || this.sprite;

    if (this.data) {

    }
  }

  async loadSound () {
    var data = await AudioEngine.loadSoundFromURL(this.src);
    this.data = data;
  }

  deloadSound () {

  }
}

module.exports = Sound;
