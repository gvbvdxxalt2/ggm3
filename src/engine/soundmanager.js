var AudioEngine = require("./audio.js");

function getIdentifier(sound) {
    return sound.getSoundIdentifier();
}

class SoundManager {
    constructor(engine, sprite) {
        this.engine = engine;
        this.sprite = sprite;
        
        this.playingSounds = {};
    }

    _applyEffects(sound) {
        var player = this.playingSounds[getIdentifier(sound)];
        if (!player) {
            return; //Sound isn't playing, no need to apply effects.
        }
        player.playbackRate = sound.effects.playbackRate;
        player.volume = sound.effects.volume;
    }

    stopSound(sound) {
        if (!sound) {
            return; //No sound to play, do nothing.
        }
        var player = this.playingSounds[getIdentifier(sound)];
        if (!player) {
            return; //Sound isn't playing, no need to stop.
        }
        player.pause();
        player.dispose();
        delete this.playingSounds[getIdentifier(sound)];
    }

    startSound(sound) {
        if (!sound) {
            return; //No sound to play, do nothing.
        }
        this.stopSound(sound); //The sound will be stopped even if its not loaded.
        if (!sound.data) {
            return; //Sound isn't loaded, don't play.
        }
        var player = new AudioEngine.Player(sound.data);
        player._soundName = sound.name;
        player._soundIdentifier = getIdentifier(sound);
        player._fromSprite = this.sprite;
        player._isWait = false;
        player._sound = sound;
        player.play();
        this.playingSounds[getIdentifier(sound)] = player;
        this._applyEffects(sound);
    }

    playSoundUntilDone(sound) {
        if (!sound) {
            return new Promise((resolve) => {
                resolve();
            });
        }
        this.stopSound(sound); //The sound will be stopped even if its not loaded.
        if (!sound.data) {
            return new Promise((resolve) => {
                resolve();
            });
        }
        var player = new AudioEngine.Player(sound.data);
        player._soundName = sound.name;
        player._soundIdentifier = getIdentifier(sound);
        player._fromSprite = this.sprite;
        player._isWait = true;
        player._sound = sound;
        player.play();
        this.playingSounds[getIdentifier(sound)] = player;
        this._applyEffects(sound);

        return new Promise((resolve) => {
            player.onended = () => resolve();
        });
    }

    setEffect(sound, effectName, effectValue) {
        if (!sound) {
            return;
        }
        var effects = sound.effects;
        if (effects[effectName]) {
            effects[effectName] = effectValue;
        }
        this._applyEffects(sound);
    }

    changeEffect(sound, effectName, effectValue) {
        if (!sound) {
            return;
        }
        var effects = sound.effects;
        if (effects[effectName]) {
            var previousValue = +effects[effectName] || 0;
            effects[effectName] = (+previousValue || 0) + (+effectValue || 0);
        }
        this._applyEffects(sound);
    }

    getEffect(sound, effectName, effectValue) {
        if (!sound) {
            return;
        }
        var effects = sound.effects;
        if (effects[effectName]) {
            return effects[effectName];
        }
        return 0;
    }

    stopAllWaitingSounds () {
        for (var key of Object.keys(this.playingSounds)) {
            var player = this.playingSounds[key];
            if (player._isWait) {
                this.stopSound(player._sound);
            }
        }
    }

    stopAllSounds () {
        for (var key of Object.keys(this.playingSounds)) {
            var player = this.playingSounds[key];
            this.stopSound(player._sound);
        }
    }

    dispose() {
        this.stopAllSounds();
        this.playingSounds = null;
        this.engine = null;
        this.sprite = null;
    }
}

module.exports = SoundManager;