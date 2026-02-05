var EventEmitter = require('eventemitter3');

function ProgressEvent(p) {
    this.max = p._max;
    this.current = p._current;
    this.finished = p._finished;
}

class ProgressMonitor extends EventEmitter {
    constructor () {
        super();
        this._max = 0;
        this._current = 0;
        this._state = "";
        this._didCalculate = false;
        this._finished = false;
    }

    calculatedMax(v) {
        if (this._finished) {
            return;
        }
        if (!this._didCalculate) {
            this._didCalculate = true;
            this._max = +v || 0;
            this.emit("progress", new ProgressEvent(this));
        }
    }

    get max() {
        return this._max;
    }

    set current(v) {
        if (this._finished) {
            return;
        }
        var value = +v || 0;
        if (value !== this._current) {
            this._current = value;
            this.emit("progress", new ProgressEvent(this));
        }
    }

    get current() {
        return this._current;
    }

    finish(...values) {
        if (this._finished) {
            return;
        }
        this._finished = true;
        this.emit("progress", new ProgressEvent(this));
        this.emit("finish", new ProgressEvent(this), ...values);
        this.removeAllListeners();
    }
}

module.exports = {ProgressMonitor};