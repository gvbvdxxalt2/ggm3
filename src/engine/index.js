const twgl = require("twgl.js");

const Drawable = require("./drawable.js");
const Sprite = require("./sprite.js");
const calculateMatrix = require("./calculatematrix.js");

var CollisionSprite = require("./mask.js");

var SHADERS = require("./shaders.js");

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
    this._editDragging = null;
    this.drawables = [];
    this.sprites = [];
    this.frameRate = 60;
    this._iTime = 0;
    this.initCanvas();
    this.generateMouseMask();
    this.startRenderLoop();
  }

  makeUniqueSpriteNames() {
    var existingNames = [];
    var nameCounts = {};
    this.sprites.forEach((sprite) => {
      if (existingNames.indexOf(sprite.name) !== -1) {
        if (nameCounts[sprite.name]) {
          nameCounts[sprite.name] += 1;
        } else {
          nameCounts[sprite.name] = 1;
        }
        sprite.name = sprite.name + ` (${nameCounts[sprite.name]})`;
      } else {
        existingNames.push(sprite.name);
      }
    });
  }

  get mouseX() {
    return this.mouseMask.x;
  }
  get mouseY() {
    return this.mouseMask.y;
  }
  get mouseIsDown() {
    return this.mouseMask.isDown;
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
    this.makeUniqueSpriteNames();
    return spr;
  }

  startRenderLoop() {
    const _this = this;

    let previous = performance.now();
    let lag = 0.0;

    function loop(now) {
      requestAnimationFrame(loop);

      const frameDuration = 1000 / _this.frameRate;

      // Calculate time since last frame
      let delta = now - previous;
      previous = now;

      // --- THE FIX ---
      // If delta is huge (like switching tabs), cap it.
      // This prevents the game from trying to simulate
      // thousands of frames and locking up.
      // We'll cap it at 1 second.
      if (delta > 1000) {
        delta = 1000;
      }

      // Add the (capped) delta to our lag accumulator
      lag += delta;

      // Run update logic in fixed steps
      // This loop will run 0 or more times
      while (lag >= frameDuration) {
        // Pass the *fixed* step to the update logic
        _this.render(frameDuration);
        lag -= frameDuration;
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
    this.mouseMask = new CollisionSprite(ctx.getImageData(0, 0, 1, 1));
    this.mouseMask.isDown = false;
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

    var fragmentShader = SHADERS.FRAGMENT_SHADER;
    this._gl_spriteProgramInfo = twgl.createProgramInfo(gl, [
      SHADERS.VERTEX_SHADER,
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

    twgl.resizeCanvasToDisplaySize(gl.canvas);

    this.render();
  }

  render(elapsed) {
    var { canvas, gl } = this;
    gl.clearColor(1, 1, 1, 0); // Use 0,0,0,0 to respect canvas style background
    gl.clear(gl.COLOR_BUFFER_BIT);

    this._iTime += elapsed / 1000;

    var _this = this;
    this.getTopSprites().forEach((spr) => {
      _this.tickSprite(spr);
      _this.renderSprite(spr);
    });
    if (this.editMode) {
      this.tickEditMode();
    } else {
      this._editDragging = null;
    }
  }

  changeMousePosition(cx, cy) {
    this.mouseMask.x = (+cx || 0) - this.canvas.width / 2;
    this.mouseMask.y = -((+cy || 0) - this.canvas.height / 2);
  }

  changeMouseDown(down) {
    this.mouseMask.isDown = !!down;
  }

  tickSprite(sprite) {
    sprite.emitFrameListeners();
  }

  sortLayers() {
    var i = 0;
    var newSprites = [];
    for (var sprite of this.getTopSprites()) {
      sprite.zIndex = i;
      newSprites.push(sprite);
      i += 1;
    }
    this.sprites = newSprites;
  }

  getTopSprites () {
    var topSprites = this.sprites.map((s) => s).sort((sprite, sprite2) => sprite2.zIndex - sprite.zIndex);
    return topSprites;
  }

  tickEditMode() {
    if (this._editDragging) {
      if (this.mouseIsDown) {
        var {sprite,offsetx,offsety} = this._editDragging;
        sprite.x = this.mouseX+offsetx;
        sprite.y = this.mouseY+offsety;
      } else {
        this._editDragging = null;
      }
    } else {
      this._editDragging = null;
      if (this.mouseIsDown) {
        if (!this._previousMouseDown) {
          this._previousMouseDown = true;
          var topSprites = this.getTopSprites();
          var touchedSprite = null;
          var mouseMask = this.mouseMask;
          for (var sprite of topSprites) {
            sprite.alignMask();
            var mask = sprite.mask;
            if (mask && mouseMask) {
              if (mouseMask.collisionTest(mask)) {
                touchedSprite = sprite;
              }
            }
          }
          if (touchedSprite) {
            this._editDragging = {
              offsetx: touchedSprite.x - this.mouseX,
              offsety: touchedSprite.y - this.mouseY,
              sprite: touchedSprite
            };  
          }
        }
      } else {
        this._previousMouseDown = false;
      }
    }
  }

  renderSprite(spr) {
    if (spr.hidden) {
      return;
    }
    var {
      gl,
      _gl_spriteProgramInfo,
      _gl_projectionMatrix,
      _gl_quadBufferInfo,
      _iTime,
    } = this;
    if (spr.costumes[spr.costumeIndex]) {
      var costume = spr.costumes[spr.costumeIndex];
      var drawable = costume.drawable;
      if (costume.drawable) {
        var center = costume.getFinalRotationCenter();
        var modelMatrix = calculateMatrix({
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

        //var modelMatrix = twgl.m4.identity();
        //modelMatrix = twgl.m4.scale(modelMatrix, [100, 100, 1]);
        var uniforms = {
          u_modelMatrix: modelMatrix,
          u_skin: drawable.texture,
          u_projectionMatrix: _gl_projectionMatrix,

          u_ghost: spr.alpha / 100,
          /*iTime: _iTime,
          u_wave_xwave: 30,
          u_wave_ywave: 40,
          u_wave_xtime: 30,
          u_wave_ytime: 50,*/
        };

        //window.alert(JSON.stringify(uniforms));

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
