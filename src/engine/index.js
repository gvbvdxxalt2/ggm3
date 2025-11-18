const twgl = require("twgl.js");

class GGM3Engine {
  constructor(canvas) {
    this.canvas = canvas;
    if (!canvas) {
      this.canvas = document.createElement("canvas");
    }
    this.initCanvas();
    this.editMode = false;
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
