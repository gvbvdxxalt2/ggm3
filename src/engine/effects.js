var Sprite = require("./sprite.js");

class SpriteEffects {
  constructor(sprite) {
    this.sprite = sprite;
    this.reset();
  }

  reset() {
    this.waveTime = 0;
    this.waveXTime = 0;
    this.waveYTime = 0;
    this.waveX = 0;
    this.waveY = 0;
    this.ribbonShiftX = 0;
    this.ribbonShiftY = 0;
    this.brightness = 0;
  }

  set waveTime(v) {
    var value = +v || 0;
    if (value < 0) value = 0;

    this._waveTime = value;
  }
  get waveTime() {
    return this._waveTime;
  }

  set waveXTime(v) {
    var value = +v || 0;
    if (value < 0) value = 0;

    this._waveXTime = value;
  }
  get waveXTime() {
    return this._waveXTime;
  }

  set waveYTime(v) {
    var value = +v || 0;
    if (value < 0) value = 0;

    this._waveYTime = value;
  }
  get waveYTime() {
    return this._waveYTime;
  }

  set waveX(v) {
    var value = +v || 0;
    if (value < 0) value = 0;

    this._waveX = value;
  }
  get waveX() {
    return this._waveX;
  }

  set waveY(v) {
    var value = +v || 0;
    if (value < 0) value = 0;

    this._waveY = value;
  }
  get waveY() {
    return this._waveY;
  }

  set ribbonShiftX(v) {
    this._ribbonShiftX = +v || 0;
  }
  get ribbonShiftX() {
    return this._ribbonShiftX;
  }

  set ribbonShiftY(v) {
    this._ribbonShiftY = +v || 0;
  }
  get ribbonShiftY() {
    return this._ribbonShiftY;
  }

  set brightness(v) {
    var value = +v || 0;
    if (value < -100) value = -100;
    if (value > 100) value = 100;

    this._brightness = value;
  }
  get brightness() {
    return this._brightness;
  }

  getRenderableEffects() {
    // Get costume scale for ribbon shift scaling
    var costumeScale = 1;
    try {
      if (
        this.sprite &&
        this.sprite.costume &&
        typeof this.sprite.costume.currentScale === "number" &&
        this.sprite.costume.currentScale > 0
      ) {
        costumeScale = this.sprite.costume.currentScale;
      }
    } catch (e) {
      // If any error accessing costume, just use default scale
    }

    return {
      iTime: this.waveTime,
      u_wave_xwave: this.waveX,
      u_wave_ywave: this.waveY,
      u_wave_xtime: this.waveXTime,
      u_wave_ytime: this.waveYTime,
      u_ribbonShiftX: this.ribbonShiftX / costumeScale,
      u_ribbonShiftY: this.ribbonShiftY / costumeScale,
      u_brightness: this.brightness / 100,
    };
  }
}
module.exports = SpriteEffects;
