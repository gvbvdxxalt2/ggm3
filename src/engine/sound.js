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
    this.name = "";
    this.willPreload = true;
    this.playingOn = {};
    this.mimeType = "audio/mp3";
  }

  stopForSpriteID(spriteid) {
    var _this = this;
    var sound = this.playingOn[spriteid];
    if (!sound) {
      return;
    }
    sound.onended = function () {};
    sound.stop();
    sound.dispose();
    delete this.playingOn[spriteid];
  }

  stopForSprite(sprite = this.sprite) {
    this.stopForSpriteID(sprite.id);
  }

  stopAll() {
    for (var id of Object.keys(this.playingOn)) {
      this.stopForSpriteID(id);
    }
  }

  tweakVolume(spriteContext, volume = 1) {
    var sprite = spriteContext || this.sprite;

    var sound = sprite.playingSounds[this.id];
    if (sound) {
      sound.volume = +volume || 0;
      if (sound.volume < 0) {
        sound.volume = 0;
      }
      if (sound.volume > 999) {
        sound.volume = 999;
      }
    }
  }

  tweakPlaybackRate(spriteContext, playbackRate = 1) {
    var sprite = spriteContext || this.sprite;

    var sound = sprite.playingSounds[this.id];
    if (sound) {
      var playbackRate = +playbackRate || 0;
      if (playbackRate < 0.005) {
        playbackRate = 0.005;
      }
      if (playbackRate > 999) {
        playbackRate = 999;
      }
      sound.playbackRate = playbackRate;
    }
  }

  play (spriteContext, time = 0, volume = 1, playbackRate = 1) {
    var sprite = spriteContext || this.sprite;

    if (this.data) {
      var oldSound = sprite.playingSounds[this.id];
      if (oldSound) {
        oldSound.stop();
        oldSound.dispose();
        delete sprite.playingSounds[this.id];
      }
      var playbackRate = +playbackRate || 0;
      if (playbackRate < 0) {
        playbackRate = 0;
      }
      if (playbackRate > 999) {
        playbackRate = 999;
      }
      if (playbackRate < 0.005) {
        return new Promise((r) => r());
      }
      var sound = new AudioEngine.Player(this.data);
      sprite.playingSounds[this.id] = sound;
      this.playingOn[sprite.id] = sound;
      sound.playbackRate = playbackRate;
      sound.volume = +volume || 0;
      if (sound.volume < 0) {
        sound.volume = 0;
      }
      if (sound.volume > 999) {
        sound.volume = 999;
      }
      var _this = this;
      return new Promise((resolve) => {
        sound.onended = function () {
          sound.dispose();
          delete sprite.playingSounds[this.id];
          delete _this.playingOn[sprite.id];
        };
        sound.play(+time || 0);
      });
    } else {
      return new Promise((r) => r());
    }
  }

  async loadSound () {
    var data = await AudioEngine.loadSoundFromURL(this.src);
    this.data = data;
    if (this.onread) {
      this.onread(true);
    }
  }

  deloadSound () {
    this.data = null;
  }

  dispose () {
    this.data = null;
    this.stopAll();
  }
}

module.exports = Sound;
