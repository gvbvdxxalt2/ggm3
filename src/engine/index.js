const twgl = require("twgl.js");

const Drawable = require("./drawable.js");
const Sprite = require("./sprite.js");
const calculateMatrix = require("./calculatematrix.js");

var CollisionSprite = require("./mask.js");

const spriteVertexShader = require("./sprite.vert").default;
const spriteFragmentShader = require("./sprite.frag").default;

var created = false;

class GGM3Engine {
  constructor(canvas) {
    if (!created) {
      created = true;
    } else {
      throw new Error("A GGM3Engine was already created.");
    }
    this.canvas = canvas;
    if (!canvas) {
      this.canvas = document.createElement("canvas");
    }
    this.editMode = false;
    this.drawables = [];
    this.sprites = [];
    this.frameRate = 60;
    this.initCanvas();
    this.generateMouseMask();
    this.startRenderLoop();
  }

  stopGame() {
    for (var sprite of this.sprites) {
      sprite.stopAllScripts();
    }
  }

  startGame() {
    this.stopGame();
    for (var sprite of this.sprites) {
      sprite.emitStackListener("started");
    }
  }

  deleteSprite(sprite) {
    if (!sprite.id) {
      return;
    }
    sprite.dispose();
    this.sprites = this.sprites.filter((s) => s.id !== sprite.id);
  }

  emptyProject() {
    var _this = this;
    this.sprites.forEach((s) => {
      _this.deleteSprite(s);
    });
    this.sprites = [];
  }

  createEmptySprite() {
    var spr = new Sprite(this, "Sprite " + (this.sprites.length + 1));
    this.sprites.push(spr);
    return spr;
  }

  startRenderLoop() {
    const _this = this;

    // --- Framerate Capping Logic ---

    // We store frameDuration in milliseconds (e.g., 1000ms / 60fps = 16.66ms)
    // We can't set this.frameDuration in the constructor,
    // because this.frameRate might be changed later.

    // 'previous' will track the timestamp of the last *rendered* frame
    let previous = performance.now();
    // -------------------------------

    function loop(now) {
      requestAnimationFrame(loop);
      const frameDuration = 1000 / _this.frameRate;
      const delta = now - previous;

      if (delta >= frameDuration) {
        previous = previous + frameDuration;

        _this.render(delta);
      }
    }

    requestAnimationFrame(loop);
  }

  newDrawable(canvas) {
    var drawable = new Drawable(this, canvas, this.drawables.length);
    this.drawables.push(drawable);
    return drawable;
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

  generateMouseMask() {
    var c = document.createElement("canvas");
    var ctx = c.getContext("2d");
    c.width = 1;
    c.height = 1;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1, 1);
    this._mouseMask = new CollisionSprite(ctx.getImageData(0, 0, 1, 1));
    c.width = 0;
    c.height = 0;
    c.remove();
  }

  initCanvas() {
    if (this.gl) {
      return;
    }
    var canvas = this.canvas;
    canvas.width = 640;
    canvas.height = 360;
    const contextAttribs = { alpha: false, stencil: true, antialias: false };
    var gl =
      canvas.getContext("webgl", contextAttribs) ||
      canvas.getContext("experimental-webgl", contextAttribs) ||
      canvas.getContext("webgl2", contextAttribs);

    var fragmentShader = spriteFragmentShader;
    fragmentShader +=
      "\n" + "#define ENABLE_whirl" + "\n" + "#define ENABLE_color";
    this._gl_spriteProgramInfo = twgl.createProgramInfo(gl, [
      spriteVertexShader,
      fragmentShader,
    ]);

    this.gl = gl;

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    this._gl_position = [-0, -0, 1, -0, -0, 1, -0, 1, 1, -0, 1, 1];
    this._gl_texcoord = [
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
    this._gl_quadBufferInfo = twgl.createBufferInfoFromArrays(gl, {
      a_position: {
        // This now matches `attribute vec2 a_position`
        numComponents: 2,
        data: this._gl_position,
      },
      a_texCoord: {
        // This now matches `attribute vec2 a_texCoord`
        numComponents: 2,
        data: this._gl_texcoord,
      },
    });

    var projectionMatrix = twgl.m4.ortho(
      0,
      gl.canvas.width,
      gl.canvas.height,
      0,
      -1,
      1
    );

    this._gl_projectionMatrix = projectionMatrix;

    //this.generateWhitePixelTexture();
    this.render();
  }

  render(elapsed) {
    var { canvas, gl } = this;
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.clearColor(1, 1, 1, 0); // Use 0,0,0,0 to respect canvas style background
    gl.clear(gl.COLOR_BUFFER_BIT);

    var _this = this;
    this.sprites.forEach((spr) => {
      _this.tickSprite(spr);
      _this.renderSprite(spr);
    });
  }

  tickSprite(sprite) {
    sprite.emitFrameListeners();
  }

  renderSprite(spr) {
    var {
      gl,
      _gl_spriteProgramInfo,
      _gl_projectionMatrix,
      _gl_quadBufferInfo,
    } = this;
    if (spr.costumes[spr.costumeIndex]) {
      var costume = spr.costumes[spr.costumeIndex];
      var drawable = costume.drawable;
      if (costume.drawable) {
        var center = costume.getFinalRotationCenter();
        const modelMatrix = calculateMatrix({
          x: spr.x + this.canvas.width / 2,
          y: -spr.y + this.canvas.height / 2,
          rotation: spr.angle * (Math.PI / 180),
          rotationCenterX: center[0],
          rotationCenterY: center[1],
          textureWidth: costume.canvas.width,
          textureHeight: costume.canvas.height,
          scaleX: spr.scaleX * (spr.size / 100),
          scaleY: spr.scaleY * (spr.size / 100),
        });

        var uniforms = {
          u_modelMatrix: modelMatrix,
          u_skin: drawable.texture,
          u_projectionMatrix: _gl_projectionMatrix,

          u_whirl: 0,
          u_color: 0,
        };

        gl.useProgram(_gl_spriteProgramInfo.program);
        twgl.setBuffersAndAttributes(
          gl,
          _gl_spriteProgramInfo,
          _gl_quadBufferInfo
        );
        twgl.setUniforms(_gl_spriteProgramInfo, uniforms);
        twgl.drawBufferInfo(gl, _gl_quadBufferInfo);
      }
    }
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
