const twgl = require("twgl.js");

const Drawable = require("./drawable.js");

class GGM3Engine {
  constructor(canvas) {
    this.canvas = canvas;
    if (!canvas) {
      this.canvas = document.createElement("canvas");
    }
    this.initCanvas();
    this.editMode = false;
    this.drawables = [];
    this.sprites = [];
  }

  newDrawable(canvas) {
    var drawable = new Drawable(this, canvas, this.drawables.length);
    this.drawables.push(drawable);
  }

  disposeDrawable(drawable) {
    drawable.dispose();
    this.drawables = this.drawables.filter((d) => d.id !== drawable.id);
  }

  disposeAllDrawables() {
    var t = this;
    Array.from(this.drawables).forEach((d) => t.disposeDrawable(d));
  }

  turnOnEditing() {
    this.editMode = true;
  }

  turnOffEditing() {
    this.editMode = false;
  }

  initCanvas() {
    var canvas = this.canvas;
    const contextAttribs = {
      alpha: false,
      stencil: true,
      antialias: false,
    };
    this.gl =
      canvas.getContext("webgl", contextAttribs) ||
      canvas.getContext("experimental-webgl", contextAttribs) ||
      canvas.getContext("webgl2", contextAttribs);
  }

  render() {
    var { canvas, ctx } = this;
    canvas;
  }

  generateID() {
    var id = "";
    id += Date.now();
    id += "_";
    id += Math.round(Math.random() * 999999);
    return id;
  }
}

module.exports = GGM3Engine;
