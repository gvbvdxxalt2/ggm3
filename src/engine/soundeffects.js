class SoundEffects {
    constructor (sound) {
        this.sound = sound;
        this.playbackRate = 1;
        this.volume = 100; 
    }

    set playbackRate(v) {
        this._playbackRate = +v || 0;
        if (this._playbackRate > 9999) {
            this._playbackRate = 9999;
        }
        if (this._playbackRate < 0) {
            this._playbackRate = 0;
        }
    }

    get playbackRate() {
        return this._playbackRate;
    }

    set volume(v) {
        this._volume = +v || 0;
        if (this._volume > 200) {
            this._volume = 200;
        }
        if (this._volume < 0) {
            this._volume = 0;
        }
    }

    get volume() {
        return this._volume;
    }

    dispose() {
        this._volume = null;
        this._playbackRate = null;
    }
}

module.exports = SoundEffects;