class Thread {
  constructor(firstBlockID, sprite) {
    this.id = firstBlockID;
    this.sprite = sprite;
    this.running = true;
    this.screenRefresh = true;
    this._hasStopped = false;
    this.withoutRefresh = false;
  }

  turnOnWithoutRefresh() {
    this.withoutRefresh = true;
  }

  stop() {
    this.running = false;
    if (!this._hasStopped) {
      this._hasStopped = true;
      this.sprite.removeThread(this.id);
    }
  }

  waitForNextFrame() {
    if (this.screenRefresh) {
      var _this = this;
      return new Promise((resolve) => {
        _this.sprite._addFrameListener(resolve);
      });
    } else {
      return new Promise((a) => a());
    }
  }

  waitSeconds(seconds) {
    var _this = this;
    return new Promise((resolve) => {
      if (!_this.running) {
        resolve();
      }
      var milliseconds = seconds * 1000;
      var start = performance.now();
      var interval = setInterval(() => {
        var now = performance.now();
        if (!_this.running) {
          clearInterval(interval);
          resolve();
        }
        if (now - start > milliseconds) {
          clearInterval(interval);
          resolve();
        }
      });
    });
  }

  async repeatTimes(times, func) {
    if (!this.running) {
      return;
    }
    var i = 1;
    while (i < times) {
      if (!this.running) {
        return;
      }
      await func();
      if (!this.withoutRefresh) {
        await this.waitForNextFrame();
      }
      if (!this.running) {
        return;
      }
      i += 1;
    }
    if (!this.running) {
      return;
    }
  }
}

module.exports = Thread;
