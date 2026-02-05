var AudioEngine = require("./audio.js");

var SoundEffects = require("./soundeffects.js");

class Sound {
  constructor(engine, sprite, dataURL, onread) {
    this.engine = engine;
    this.sprite = sprite;
    this.src = dataURL;
    this.data = null;
    this.onread = onread || function () {};
    this.id = Date.now() + "_" + Math.round(Math.random() * 9999999);
    this.name = "";
    this.willPreload = true;
    this.playingOn = {};
    this.mimeType = "audio/mp3";
    this.loading = false;
    this.effects = new SoundEffects(this);
  }

  getSoundIdentifier() {
    //used by sound manager.
    return this.name;
  }

  get dataURL() {
    return this.src;
  }

  set dataURL(v) {
    this.src = v;
  }

  stopForSpriteID(spriteid) {
    throw new Error(
      "Deprecated call for stopForSpriteID, use the new SoundManager system.",
    );
  }

  stopForSprite(sprite = this.sprite) {
    throw new Error(
      "Deprecated call for stopForSprite, use the new SoundManager system.",
    );
  }

  stopAll() {
    throw new Error(
      "Deprecated call for stopAll, use the new SoundManager system.",
    );
  }

  tweakVolume(spriteContext, volume = 1) {
    throw new Error(
      "Deprecated call for tweakVolume, use the new SoundManager system.",
    );
  }

  tweakPlaybackRate(spriteContext, playbackRate = 1) {
    throw new Error(
      "Deprecated call for tweakPlaybackRate, use the new SoundManager system.",
    );
  }

  play(spriteContext, time = 0, volume = 1, playbackRate = 1) {
    throw new Error(
      "Deprecated call for play, use the new SoundManager system.",
    );
  }

  async loadSound() {
    if (this.loading) {
      return;
    }
    if (this.data) {
      return;
    }
    this.loading = true;
    var data = await AudioEngine.loadSoundFromURL(this.src);
    this.data = data;
    if (this.onread) {
      this.onread(true);
    }
    this.loading = false;
  }

  deloadSound() {
    this.data = null;
    this.loading = false;
  }

  dispose() {
    this.data = null;
    this.effects.dispose();
  }
}

module.exports = Sound;
