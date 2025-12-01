var Sprite = require("./sprite.js");

class SpriteEffects {
    constructor (sprite) {
        this.sprite = sprite;
        this.reset();
    }

    reset() {
        this.waveTime = 0;
        this.waveXTime = 0;
        this.waveYTime = 0;
        this.waveX = 0;
        this.waveY = 0;
    }

    set waveTime (v) {
        var value = +v || 0;
        if (value < 0) value = 0;

        this._waveTime = value;
    }
    get waveTime () {
        return this._waveTime;
    } 

    set waveXTime (v) {
        var value = +v || 0;
        if (value < 0) value = 0;

        this._waveXTime = value;
    }
    get waveXTime () {
        return this._waveXTime;
    } 

    set waveYTime (v) {
        var value = +v || 0;
        if (value < 0) value = 0;

        this._waveYTime = value;
    }
    get waveYTime () {
        return this._waveYTime;
    } 

    set waveX (v) {
        var value = +v || 0;
        if (value < 0) value = 0;

        this._waveX = value;
    }
    get waveX () {
        return this._waveX;
    } 

    set waveY (v) {
        var value = +v || 0;
        if (value < 0) value = 0;

        this._waveY = value;
    }
    get waveY () {
        return this._waveY;
    } 

    getRenderableEffects() {
        return {
            iTime: this.waveTime,
            u_wave_xwave: this.waveX,
            u_wave_ywave: this.waveY,
            u_wave_xtime: this.waveXTime,
            u_wave_ytime: this.waveYTime,
        };
    }
}
module.exports = SpriteEffects