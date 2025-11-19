var twgl = require("twgl.js");

class Drawable {
  static getImageCanvas(img, scale = 1) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
  constructor(engine, canvas, id) {
    this.engine = engine;
    this.gl = engine.gl;
    this.isOutdated = true;
    this.texture = null;
    this.canvas = canvas || document.createElement("canvas");
    this.disposed = false;

    this.update();
  }
  markAsOutdated() {
    this.isOutdated = true;
  }
  update() {
    if (!this.isOutdated) {
      return;
    }
    if (this.texture) {
      this.gl.deleteTexture(this.texture);
    }

    this.texture = twgl.createTexture(this.gl, {
      src: this.canvas,
      mag: this.gl.NEAREST
    });

    this.isOutdated = false;
  }
  dispose() {
    if (!this.disposed) {
      this.disposed = true;
    }
  }
}

module.exports = Drawable;
