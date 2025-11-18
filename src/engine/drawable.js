var twgl = require("twgl.js");

const position = [
  -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
];
const texcoord = [
  0,
  0, // Bottom-left vertex maps to (0,0)
  1,
  0, // Bottom-right vertex maps to (1,0)
  0,
  1, // Top-left vertex maps to (0,1)
  0,
  1, // Top-left vertex maps to (0,1)
  1,
  0, // Bottom-right vertex maps to (1,0)
  1,
  1, // Top-right vertex maps to (1,1)
];

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

    this.texture = twgl.createTexture(gl, {
      src: this.canvas,
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
