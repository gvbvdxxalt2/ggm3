var twgl = require("twgl.js");

class Drawable {
  static getImageCanvas(img, scale = 1) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
  }
  constructor(engine, canvas, id) {
    this.engine = engine;
    this.gl = engine && engine.gl ? engine.gl : null;
    this.isOutdated = true;
    this.texture = null;
    this.canvas = canvas || document.createElement("canvas");
    this.disposed = false;

    // Create initial texture only if GL is available and canvas has size
    try {
      this.update();
    } catch (e) {
      // swallow errors during construction; update will be retried later
      console.warn("Drawable: initial update failed", e);
    }
  }
  markAsOutdated() {
    this.isOutdated = true;
  }
  update() {
    if (!this.isOutdated) return;

    // Ensure GL and canvas are available
    if (!this.gl) {
      // Try to recover the GL reference from engine
      if (this.engine && this.engine.gl) this.gl = this.engine.gl;
      if (!this.gl) return;
    }

    if (!this.canvas || this.canvas.width === 0 || this.canvas.height === 0) {
      // Nothing to upload
      this.isOutdated = false;
      return;
    }

    if (this.texture) {
      try {
        this.gl.deleteTexture(this.texture);
      } catch (e) {
        // ignore GL errors
      }
      this.texture = null;
    }

    try {
      this.texture = twgl.createTexture(this.gl, {
        src: this.canvas,
        mag: this.gl ? this.gl.NEAREST : undefined,
      });
    } catch (e) {
      console.warn("Drawable: failed to create texture", e);
      this.texture = null;
    }

    this.isOutdated = false;
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    try {
      if (this.texture && this.gl) {
        try {
          this.gl.deleteTexture(this.texture);
        } catch (e) {}
      }
    } finally {
      this.texture = null;
      this.canvas = null;
      this.gl = null;
      this.engine = null;
    }
  }
}

module.exports = Drawable;
