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
    this.keyNames = {
      " ": "space-bar",
      ArrowLeft: "left-arrow",
      ArrowRight: "right-arrow",
      ArrowUp: "up-arrow",
      ArrowDown: "down-arrow",
    };
    this.keysPressed = {};
    this.initCanvas();
    this.generateMouseMask();
    this.startRenderLoop();
    this.spriteMap = {};
    this.globalVariables = {};
    this.broadcastNames = [];
    this.broadcastQueue = [];

    this.gameWidth = 640;
    this.gameHeight = 360;
    this.screenScale = 1;
    this.updateCanvasSize();
  }

  broadcast(name) {
    this.getAllTopSprites().forEach((sprite) => {
      sprite.emitBroadcastListener(name);
    });
  }

  broadcastOnNextFrame(name) {
    this.broadcastQueue.push(() => {
      this.getAllTopSprites().forEach((sprite) => {
        sprite.emitBroadcastListener(name);
      });
    });
  }

  async broadcastAndWait(name) {
    var promises = [];
    this.getAllTopSprites().forEach((sprite) => {
      promises.push(sprite.emitBroadcastListener(name));
    });
    await Promise.all(promises);
  }

  getBroadcastNames() {
    return this.broadcastNames;
  }

  addBroadcastName(name) {
    if (this.broadcastNames.indexOf(name) === -1) {
      this.broadcastNames.push(name);
    }
  }

  removeBroadcastName(name) {
    this.broadcastNames = this.broadcastNames.filter((n) => n !== name);
  }

  updateCanvasSize() {
    var { canvas, gameWidth, gameHeight, screenScale } = this;
    canvas.width = gameWidth * screenScale;
    canvas.height = gameHeight * screenScale;
    this.calculateGLStuff();
  }

  hasGlobalVariable(name) {
    return Object.keys(this.globalVariables).indexOf(name) > -1;
  }

  addGlobalVariable(name) {
    this.globalVariables[name] = 0;
  }

  removeGlobalVariable(name) {
    delete this.globalVariables[name];
  }

  makeUniqueSpriteNames() {
    var existingNames = [];
    var nameCounts = {};
    var spriteMap = {};
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
      spriteMap[sprite.name] = sprite;
    });
    this.spriteMap = spriteMap;
  }

  get mouseX() {
    return this.mouseMask.x;
  }
  get mouseY() {
    return -this.mouseMask.y;
  }
  get mouseIsDown() {
    return this.mouseMask.isDown;
  }

  stopGame() {
    this.broadcastQueue = [];
    for (var sprite of this.sprites) {
      sprite.stopAllScripts();
      sprite.deleteClones();
      sprite.effects.reset();
    }
  }

  startGame() {
    this.stopGame();
    this.makeUniqueSpriteNames();
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

  duplicateSprite(fromSprite) {
    var newSprite = this.createEmptySprite();
    newSprite.name = fromSprite.name;
    this.makeUniqueSpriteNames();

    newSprite.x = fromSprite.x + 10;
    newSprite.y = fromSprite.y - 10;
    newSprite.angle = fromSprite.angle;
    newSprite.scaleX = fromSprite.scaleX;
    newSprite.scaleY = fromSprite.scaleY;
    newSprite.size = fromSprite.size;
    newSprite.costumeIndex = fromSprite.costumeIndex;
    newSprite.blocklyXML = fromSprite.blocklyXML;

    fromSprite.costumes.forEach(async (fromCostume) => {
      var costume = await newSprite.addCostume(fromCostume.dataURL);
      costume.name = fromCostume.name;
      costume.rotationCenterX = fromCostume.rotationCenterX;
      costume.rotationCenterY = fromCostume.rotationCenterY;
      costume.preferedScale = fromCostume.preferedScale;
      costume.renderImageAtScale();
    });

    return newSprite;
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
  }

  calculateGLStuff() {
    var gl = this.gl;

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
      this.canvas.width,
      this.canvas.height,
      0,
      -1,
      1,
    );

    this._gl_projectionMatrix = projectionMatrix;

    this.render(1 / this.frameRate);
  }

  render(elapsed) {
    var { canvas, gl } = this;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1, 1, 1, 0); // Use 0,0,0,0 to respect canvas style background
    gl.clear(gl.COLOR_BUFFER_BIT);

    this._iTime += elapsed / 1000;
    this.elapsedFrameTime = elapsed;

    var _this = this;
    while (this.broadcastQueue.length > 0) {
      var broadcastFunc = this.broadcastQueue.shift();
      broadcastFunc();
    }
    this.getAllTopSprites().forEach((spr) => {
      _this.tickSprite(spr);
      _this.renderSprite(spr);
    });
    if (this.editMode) {
      this.tickEditMode();
    } else {
      this._editDragging = null;
    }
  }

  findSpriteByName(name) {
    if (name instanceof Sprite) {
      return name;
    }
    var spr = this.spriteMap[name];
    if (spr) {
      return spr;
    }
    for (var spr of this.sprites) {
      if (spr.name == name) {
        return spr;
      }
    }
    return null;
  }

  changeMousePosition(cx, cy) {
    this.mouseMask.x = (+cx || 0) / this.screenScale - this.gameWidth / 2;
    this.mouseMask.y = (+cy || 0) / this.screenScale - this.gameHeight / 2;
  }

  changeMouseDown(down) {
    this.mouseMask.isDown = !!down;
  }

  changeKeyPressed(key, down) {
    var keyName = key.toLowerCase();
    if (this.keyNames[key]) {
      keyName = this.keyNames[key];
    }
    if (down) {
      this.keysPressed[keyName] = true;
    } else {
      delete this.keysPressed[keyName];
    }
  }

  tickSprite(sprite) {
    sprite.emitFrameListeners();
  }

  sortLayers() {
    var i = 0;
    for (var sprite of this.getAllTopSprites()) {
      sprite.zIndex = i;
      i += 1;
    }
  }

  getAllTopSprites() {
    var sprs = [];
    for (var spr of this.sprites) {
      for (var clone of spr.clones) {
        sprs.push(clone);
      }
      sprs.push(spr);
    }
    var topSprites = sprs
      .map((s) => s)
      .sort((sprite, sprite2) => sprite2.zIndex - sprite.zIndex);
    return topSprites;
  }

  getTopSprites() {
    var topSprites = this.sprites
      .map((s) => s)
      .sort((sprite, sprite2) => sprite2.zIndex - sprite.zIndex);
    return topSprites;
  }

  tickEditMode() {
    if (this._editDragging) {
      if (this.mouseIsDown) {
        var { sprite, offsetx, offsety } = this._editDragging;
        sprite.x = this.mouseX + offsetx;
        sprite.y = this.mouseY + offsety;
        this.canvas.style.cursor = "grabbing";
      } else {
        this._editDragging = null;
      }
    } else {
      this._editDragging = null;
      var topSprites = this.getAllTopSprites()
        .filter((s) => !s.hidden)
        .filter((s) => s.alpha > 70);
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
      this.canvas.style.cursor = "unset";
      if (touchedSprite) {
        this.canvas.style.cursor = "grab";
      }
      if (this.mouseIsDown) {
        if (!this._previousMouseDown) {
          this._previousMouseDown = true;
          if (touchedSprite) {
            this._editDragging = {
              offsetx: touchedSprite.x - this.mouseX,
              offsety: touchedSprite.y - this.mouseY,
              sprite: touchedSprite,
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
    if (spr.alpha <= 0) {
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
        costume.drawable.update(); //This updates the costume texture if needed.
        var center = costume.getFinalRotationCenter();
        var modelMatrix = calculateMatrix({
          x: spr.x * this.screenScale + this.canvas.width / 2,
          y: -spr.y * this.screenScale + this.canvas.height / 2,
          rotation: spr.angle * (Math.PI / 180),
          rotationCenterX: center[0],
          rotationCenterY: center[1],
          textureWidth: costume.canvas.width,
          textureHeight: costume.canvas.height,
          scaleX:
            ((spr.scaleX * (spr.size / 100)) / costume.currentScale) *
            this.screenScale,
          scaleY:
            ((spr.scaleY * (spr.size / 100)) / costume.currentScale) *
            this.screenScale,
        });

        //var modelMatrix = twgl.m4.identity();
        //modelMatrix = twgl.m4.scale(modelMatrix, [100, 100, 1]);
        var uniforms = {
          u_modelMatrix: modelMatrix,
          u_skin: drawable.texture,
          u_projectionMatrix: _gl_projectionMatrix,

          u_ghost: spr.alpha / 100,
          ...spr.effects.getRenderableEffects(),
        };

        //window.alert(JSON.stringify(uniforms));

        gl.useProgram(_gl_spriteProgramInfo.program);
        twgl.setBuffersAndAttributes(
          gl,
          _gl_spriteProgramInfo,
          _gl_quadBufferInfo,
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
