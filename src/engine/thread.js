class Thread {
  constructor(firstBlockID, sprite) {
    this.id = firstBlockID;
    this.sprite = sprite;
    this.running = true;
    this.screenRefresh = true;
  }

  stop() {
    this.running = false;
    this.sprite.removeThread(this.id);
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
}

module.exports = Thread;
