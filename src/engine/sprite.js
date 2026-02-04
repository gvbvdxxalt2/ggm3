var Costume = require("./costume.js");
var Sound = require("./sound.js");
var Thread = require("./thread.js");
var SpriteEffects = require("./effects.js");
var SoundManager = require("./soundmanager.js");

var dialogs = require("../interface/dialogs.js");

class Sprite {
  constructor(engine, name) {
    var id = "";
    id += Date.now();
    id += "_";
    id += Math.round(Math.random() * 999999);
    this.id = id;

    this.costumes = [];
    this.sounds = [];
    this.costumeIndex = 0;
    this.engine = engine;
    this.errorLogs = [];

    this.name = name || "Sprite";
    this.blocklyXML = null; //Used to hold code for the editor.

    this.scaleX = 1;
    this.scaleY = 1;
    this.size = 100;
    this.skewX = 0;
    this.skewY = 0;
    this.x = 0;
    this.y = 0;
    this.angle = 0;

    this.hatFunctions = {};
    this.listeners = {
      beforestart: [],
      started: [],
      clonestart: [],
    };
    this.runningStacks = {};
    this.frameListeners = [];

    this.threadEndListener = null;
    this.threadErrorListener = null;
    this.threadStartListener = null;

    this.direction = 90; //Wrapper around this.angle

    this.alpha = 100;

    this._variable_ids_ = [];
    this.variables = {};

    this.zIndex = 0;
    this.hidden = false;

    this.costumeMap = {}; //Used to switch costumes by name quickly.
    this.soundMap = {};

    this.customBlockListeners = {};
    this.customBlockRef = {};

    this.spriteFunctions = {};
    this.isClone = false;
    this.parent = null; //This is used by clones.
    this.clones = [];
    this.effects = new SpriteEffects(this);

    this.errorLogs = [];

    this.broadcastListeners = [];

    this.playingSounds = {};
    this.soundManager = new SoundManager(engine, this);

    this.spriteProperties = {};
  }

  removeProperty (name) {
    delete this.spriteProperties[name];
  }

  setSProperty(spriteName, name, value) {
    var targetSprite = this.findSpriteByName(spriteName);
    if (!targetSprite) {
      window.alert("target sprite not found");
      return;
    }
    targetSprite.spriteProperties[name] = value;
        window.alert(name);
    window.alert(value);
    window.alert(targetSprite.spriteProperties[name]);
  }

  changeSProperty(spriteName, name, value) {
    var targetSprite = this.findSpriteByName(spriteName);
    if (!targetSprite) {
      return;
    }
    targetSprite.spriteProperties[name] = (+targetSprite.spriteProperties[name] || 0) + (+value || 0);
    window.alert(name);
    window.alert(value);
    window.alert(targetSprite.spriteProperties[name]);
  }

  getSProperty(spriteName, name) {
    var targetSprite = this.findSpriteByName(spriteName);
    window.alert(`Looking for "${spriteName}": Found?: ${targetSprite}`);
    if (!targetSprite) {
      return;
    }
    return targetSprite.spriteProperties[name];
  }

  set skewX(v) {
    this._skewX = this.wrapClamp(v + 90, -179, 180) - 90;
  }
  get skewX() {
    return this._skewX;
  }

  set skewY(v) {
    this._skewY = this.wrapClamp(v + 90, -179, 180) - 90;
  }
  get skewY() {
    return this._skewY;
  }

  stopAllSounds() {
    this.soundManager.stopAllSounds();
  }

  stopAllWaitingSounds() {
    this.soundManager.stopAllWaitingSounds();
  }

  getSound(identifier) {
    var index = this.soundMap[identifier];
    if (this.soundMap[index]) {
      return this.sounds[index];
    }

    if (!isNaN(+identifier)) {
      return this.sounds[+identifier];
    }

    return null;
  }

  stopSound(identifier) {
    var sound = this.getSound(identifier);
    if (!sound) {
      return;
    }
    this.soundManager.stopSound(sound);
  }

  playSound(identifier) {
    var sound = this.getSound(identifier);
    if (!sound) {
      return;
    }
    this.soundManager.startSound(sound);
  }

  setSoundEffect(identifier,name,value) {
    var sound = this.getSound(identifier);
    if (!sound) {
      return;
    }
    this.soundManager.setEffect(sound, name, value);
  }

  getSoundEffect(identifier,name,value) {
    var sound = this.getSound(identifier);
    if (!sound) {
      return 0;
    }
    return this.soundManager.getEffect(sound, name, value);
  }

  changeSoundEffect(identifier,name,value) {
    var sound = this.getSound(identifier);
    if (!sound) {
      return 0;
    }
    return this.soundManager.changeEffect(sound, name, value);
  }

  async playSoundUntilDone(
    identifier = ""
  ) {
    var sound = this.getSound(identifier);
    if (!sound) {
      return;
    }
    await this.soundManager.playSoundUntilDone(sound);
  }

  toString() {
    if (this.isClone) {
      return `[Sprite - clone of "${this.parent.name}"]`;
    }
    return `[Sprite - "${this.name}"]`;
  }

  isTouchingMouse() {
    if (!this.mask) {
      return false;
    }
    this.alignMask();
    if (this.engine.mouseMask.collisionTest(this.mask)) {
      return true;
    }
    return false;
  }

  isTouchingSprite(otherSpriteName) {
    if (otherSpriteName == "__mouse_pointer__") {
      return this.isTouchingMouse();
    }
    if (this.hidden) {
      return false;
    }
    var otherSprite = this.findSpriteByName(otherSpriteName);
    if (!otherSprite) {
      return false;
    }
    for (var clone of otherSprite.clones) {
      if (this.isTouchingSprite(clone)) {
        return clone;
      }
    }
    if (otherSprite.hidden) {
      return false;
    }
    this.alignMask();
    otherSprite.alignMask();
    var mask1 = this.mask;
    var mask2 = otherSprite.mask;
    if (!mask1) {
      return false;
    }
    if (!mask2) {
      return false;
    }
    if (mask1.collisionTest(mask2)) {
      return otherSprite;
    }
    return false;
  }

  onErrorLog(error) {
    //Expected to be overridden by the editor.

    console.error("Sprite code error: ", error); //Used for exported games.
  }

  removeCloneFromList(clone) {
    this.clones = this.clones.filter(
      (otherClone) => clone.id !== otherClone.id,
    );
  }

  destroyClone() {
    if (!this.isClone) {
      return;
    }
    this.stopAllScripts();
    this.parent.removeCloneFromList(this);
    this.dispose();
  }

  deleteClones() {
    if (this.isClone) {
      return this.parent.deleteClones();
    }
    for (var sprite of this.clones) {
      sprite.destroyClone();
    }
  }

  createClone() {
    if (this.isClone) {
      return this.parent.createClone();
    }
    var sprite = new Sprite(this.engine, "Clone of " + this.name);
    sprite.isClone = true;
    sprite.parent = this;
    sprite.x = this.x;
    sprite.y = this.y;
    sprite.costumes = this.costumes;
    sprite.costumeMap = this.costumeMap;
    sprite.costumeIndex = this.costumeIndex;
    sprite.hidden = this.hidden;
    sprite.alpha = this.alpha;
    sprite.angle = this.angle;
    sprite.scaleX = this.scaleX;
    sprite.scaleY = this.scaleY;
    sprite.size = this.size;
    sprite.zIndex = this.zIndex;
    sprite.skewX = this.skewX;
    sprite.skewY = this.skewY;

    sprite.spriteFunctions = this.spriteFunctions;

    for (var variable of Object.keys(this.variables)) {
      try {
        sprite.variables[variable] = JSON.parse(
          JSON.stringify(this.variables[variable]),
        ); //This clones the variable value, including json values.
      } catch (e) {
        sprite.variables[variable] = this.variables[variable]; //If it fails, just assign directly.
      }
    }

    this.clones.push(sprite);

    for (var key of Object.keys(this.spriteFunctions)) {
      sprite.runFunctionID(key);
    }
    sprite.emitStackListener("clonestart");
  }

  findSpriteByName(name) {
    if (name instanceof Sprite) {
      return name;
    }
    if (name == "_myself_") {
      return this;
    }
    return this.engine.findSpriteByName(name);
  }

  addCustom(id, ref, func) {
    this.customBlockRef[ref] = id;
    this.customBlockListeners[id] = func;
  }
  /* @todo find a faster way to call and manage custom blocks. */
  async callCustom(id, values = {}, thisThread) {
    if (this.customBlockRef[id]) {
      await this.customBlockListeners[this.customBlockRef[id]](
        values,
        thisThread,
      );
    }
  }

  getCostumeIndex(v) {
    if (isNaN(+v)) {
      return this.costumeMap[v];
    } else {
      return Math.round(+v);
    }
  }

  getCostume(v) {
    var costumeIndex = this.getCostumeIndex(v);
    if (typeof costumeIndex == "number") {
      return this.costumes[costumeIndex];
    } else {
      return null;
    }
  }

  setCostumeRenderScale(costumeRef, scale) {
    var costume = this.getCostume(costumeRef);
    var scaleNumber = +scale || 0;
    if (scaleNumber < 0.001) {
      scaleNumber = 0.001;
    }
    if (costume) {
      costume.preferedScale = scaleNumber;
    }
  }

  blockRerenderCostume(costumeRef, scale) {
    var costume = this.getCostume(costumeRef);
    if (costume) {
      costume.renderImageAtScale();
    }
  }

  isCostumeLoaded(costumeRef) {
    var costume = this.getCostume(costumeRef);
    if (costume) {
      return !!costume.loaded;
    } else {
      return false;
    }
  }

  async blockLoadCostume(number) {
    var costume = this.getCostume(number);
    if (!costume) {
      return;
    }
    await costume.loadCostume();
  }

  async blockDeloadCostume(number) {
    var costume = this.getCostume(number);
    if (!costume) {
      return;
    }
    await costume.deloadCostume();
  }

  async blockLoadSound(number) {
    var sound = this.getSound(number);
    if (!sound) {
      return;
    }
    await sound.loadSound();
  }

  soundIsLoaded(number) {
    var sound = this.getSound(number);
    if (!sound) {
      return false;
    }
    return sound.data ? true : false;
  }

  async blockDeloadSound(number) {
    var sound = this.getSound(number);
    if (!sound) {
      return;
    }
    await sound.deloadSound();
  }

  blockGetCostumeScale(number) {
    var costume = this.getCostume(number);
    if (!costume) {
      return;
    }
    return costume.preferedScale;
  }

  switchCostume(number) {
    var costumeIndex = this.getCostumeIndex(v);
    if (typeof costumeIndex == "number") {
      this.costumeIndex = costumeIndex;
    }
  }

  get costume() {
    if (this.costumes[this.costumeIndex]) {
      return this.costumes[this.costumeIndex];
    }
  }

  get mask() {
    if (this.costumes[this.costumeIndex]) {
      return this.costumes[this.costumeIndex].mask;
    }
  }

  alignMask() {
    var costume = this.costume;
    var mask = this.mask;
    if (!mask) {
      return;
    }
    mask.scaleX = ((this.size / 100) * this.scaleX) / costume.currentScale;
    mask.scaleY = ((this.size / 100) * this.scaleY) / costume.currentScale;
    mask.x = this.x;
    mask.y = -this.y; //Negative because Y is inverted in GGM3 coordinates.
    mask.centerX = costume.rotationCenterX * costume.currentScale;
    mask.centerY = costume.rotationCenterY * costume.currentScale;
    mask.angle = this.angle;
  }

  ensureUniqueName() {
    this.engine.makeUniqueSpriteNames();
  }

  ensureUniqueCostumeNames() {
    //This is called alot by the editor and engine, so we can use this to map out costume names.
    var existingNames = [];
    var nameCounts = {};
    var _this = this;
    this.costumeMap = {};
    this.costumes.forEach((costume, i) => {
      _this.costumeMap[costume.name] = i;
      if (existingNames.indexOf(costume.name) !== -1) {
        if (nameCounts[costume.name]) {
          nameCounts[costume.name] += 1;
        } else {
          nameCounts[costume.name] = 1;
        }
        costume.name = costume.name + ` (${nameCounts[costume.name]})`;
      } else {
        existingNames.push(costume.name);
      }
    });
  }

  ensureUniqueSoundNames() {
    //This is called alot by the editor and engine, so we can use this to map out sound names.
    var existingNames = [];
    var nameCounts = {};
    var _this = this;
    this.soundMap = {};
    this.sounds.forEach((sound, i) => {
      _this.soundMap[sound.name] = i;
      if (existingNames.indexOf(sound.name) !== -1) {
        if (nameCounts[sound.name]) {
          nameCounts[sound.name] += 1;
        } else {
          nameCounts[sound.name] = 1;
        }
        sound.name = sound.name + ` (${nameCounts[sound.name]})`;
      } else {
        existingNames.push(sound.name);
      }
    });
  }

  getSound(v) {
    if (isNaN(+v)) {
      return this.sounds[this.soundMap[v]];
    } else {
      return this.sounds[v];
    }
  }

  getAllVariableIDS() {
    return Object.keys(this.variables);
  }

  //Function used by editor that tracks new and old variables.
  editorScanVariables(workspace) {
    var ids = this.getAllVariableIDS();
    var variables = workspace.getVariablesOfType("");
    variables.sort(Blockly.VariableModel.compareByName);

    var unusedOnes = ids.map((id) => id);
    for (var blocklyVariable of variables) {
      var id = blocklyVariable.getId();
      var exists = ids.indexOf(blocklyVariable.getId()) !== -1;

      if (exists) {
        unusedOnes = unusedOnes.filter((id2) => id2 !== id);
      } else {
        this.variables[id] = 0; //The default value is zero.
      }
    }

    for (var unusedId of unusedOnes) {
      delete this.variables[unusedId];
    }
  }

  set alpha(v = 0) {
    this._alpha = v;
    if (v > 100) {
      this._alpha = 100;
    }
    if (v < 0) {
      this._alpha = 0;
    }
  }

  get alpha() {
    return this._alpha;
  }

  moveSteps(steps) {
    var rad = this.angle * (Math.PI / 180);
    this.x += Math.cos(rad) * steps;
    this.y -= Math.sin(rad) * steps;
  }

  wrapClamp(n, min, max) {
    const range = max - min + 1;
    return n - Math.floor((n - min) / range) * range;
  }

  set direction(v) {
    this.angle = this.wrapClamp(v, -179, 180) - 90;
  }
  get direction() {
    return this.angle + 90;
  }

  _addFrameListener(resolve) {
    this.frameListeners.push(resolve);
  }

  emitFrameListeners() {
    this.frameListeners.forEach((f) => f());
    this.frameListeners = [];
  }

  stopScript(firstBlockID) {
    if (!this.runningStacks[firstBlockID]) {
      return;
    }
    this.runningStacks[firstBlockID].stop();
    delete this.runningStacks[firstBlockID];
  }

  removeBroadcastListener(blockID) {
    var listeners = this.broadcastListeners;
    for (var listener of Object.keys(listeners)) {
      if (listeners[listener].indexOf(blockID) !== -1) {
        listeners[listener] = listeners[listener].filter(
          (id) => id !== blockID,
        );
        if (listeners[listener].length == 0) {
          delete listeners[listener];
        }
      }
    }
  }

  removeStackListener(blockID) {
    this.removeBroadcastListener(blockID);
    for (var listener of Object.keys(this.listeners)) {
      if (this.listeners[listener].indexOf(blockID) !== -1) {
        this.listeners[listener] = this.listeners[listener].filter(
          (id) => id !== blockID,
        );
      }
    }

    for (var key of Object.keys(this.customBlockRef)) {
      if (this.customBlockRef[key] == blockID) {
        delete this.customBlockRef[key];
      }
    }
    delete this.hatFunctions[blockID];
    delete this.customBlockListeners[blockID];
  }

  removeSpriteFunction(blockID) {
    this.spriteFunctions[blockID] = null;
    delete this.spriteFunctions[blockID];
  }

  addStackListener(name, blockID, func) {
    this.removeStackListener(blockID);
    if (this.listeners[name]) {
      this.listeners[name].push(blockID);
      this.hatFunctions[blockID] = func;
    }
  }

  addBroadcastListener(name, blockID, func) {
    this.removeStackListener(blockID);
    if (this.broadcastListeners[name]) {
      this.broadcastListeners[name].push(blockID);
      this.hatFunctions[blockID] = func;
    } else {
      this.broadcastListeners[name] = [blockID];
      this.hatFunctions[blockID] = func;
    }
  }

  emitStackListener(name, ...args) {
    if (this.listeners[name]) {
      for (var blockID of this.listeners[name]) {
        if (this.hatFunctions[blockID]) {
          this.hatFunctions[blockID](...args);
        }
      }
    }
  }

  emitBroadcastListener(name, ...args) {
    var promises = [];
    if (this.broadcastListeners[name]) {
      for (var blockID of this.broadcastListeners[name]) {
        if (this.hatFunctions[blockID]) {
          promises.push(this.hatFunctions[blockID](...args));
        }
      }
    }
    return Promise.all(promises);
  }

  stopAllScripts() {
    for (var thread of Object.keys(this.runningStacks)) {
      this.stopScript(thread);
    }
    this.stopAllWaitingSounds();
  }

  stopAllScriptsExceptThread(thread) {
    for (var thread2 of Object.keys(this.runningStacks)) {
      if (thread2 !== thread.id) {
        this.stopScript(thread2);
      }
    }
    this.stopAllWaitingSounds();
  }

  stopAllScriptsExceptThreads(threadIds = []) {
    for (var thread2 of Object.keys(this.runningStacks)) {
      if (!threadIds.includes(thread2)) {
        this.stopScript(thread2);
      }
    }
    this.stopAllWaitingSounds();
  }

  createThread(firstBlockID) {
    this.stopScript(firstBlockID);
    var thread = new Thread(firstBlockID, this);
    this.runningStacks[firstBlockID] = thread;
    if (this.threadStartListener) {
      this.threadStartListener(firstBlockID);
    }
    return thread;
  }
  removeThread(firstBlockID) {
    var thread = this.runningStacks[firstBlockID];
    try {
      if (thread && this.threadErrorListener && thread.hadError) {
        if (thread.isPreviewMode) {
          //Means that the block was clicked, so skip error handling (this stops it from glowing it).
          if (this.threadEndListener) {
            this.threadEndListener(firstBlockID);
          }
          return;
        }
        this.threadErrorListener(firstBlockID, thread.output);
      } else if (this.threadEndListener) {
        this.threadEndListener(firstBlockID);
      }
    } finally {
      delete this.runningStacks[firstBlockID];
    }
  }

  getFunction(code) {
    //Used by compiling.
    //window.alert(code);
    var func = eval("(async function (sprite,engine) {" + code + "})");
    return func;
  }

  addFunction(code, blockID) {
    var func = this.getFunction(code);
    this.spriteFunctions[blockID] = func;
  }

  async runFunction(code) {
    var func = this.getFunction(code);
    return await func(this, this.engine);
  }

  async runFunctionID(blockID) {
    var func = this.spriteFunctions[blockID];
    return await func(this, this.engine);
  }

  addCostume(dataURL, name) {
    if (this.isClone) {
      throw new Error("Clones can't create their own costumes.");
    }
    var _this = this;
    return new Promise(function (resolve, reject) {
      var costume = new Costume(
        _this.engine,
        dataURL,
        name ? name : "Costume " + (_this.costumes.length + 1),
        function (success) {
          if (success) {
            resolve(costume);
          } else {
            reject("");
          }
        },
      );
      costume.loadCostume();
      _this.costumes.push(costume);
      _this.ensureUniqueCostumeNames();
    });
  }

  addCostumeWithoutLoading(url, name) {
    if (this.isClone) {
      throw new Error("Clones can't create their own costumes.");
    }
    var costume = new Costume(
      this.engine,
      url,
      name ? name : "Costume " + (this.costumes.length + 1),
    );
    this.costumes.push(costume);
    this.ensureUniqueCostumeNames();
    return costume;
  }

  addSound(dataURL, name) {
    if (this.isClone) {
      throw new Error("Clones can't create their own sounds.");
    }
    var _this = this;
    return new Promise(function (resolve, reject) {
      var s = new Sound(_this.engine, _this, dataURL, function (success) {
        if (success) {
          resolve(s);
        } else {
          reject("");
        }
      });
      s.loadSound();
      s.name = name ? name : "Sound " + (_this.sounds.length + 1);
      _this.sounds.push(s);
      _this.ensureUniqueSoundNames();
    });
  }

  addSoundWithoutLoading(url, name) {
    if (this.isClone) {
      throw new Error("Clones can't create their own sounds.");
    }
    var s = new Sound(this.engine, this, url);
    s.name = name ? name : "Sound " + (this.sounds.length + 1);
    this.sounds.push(s);
    this.ensureUniqueSoundNames();
    return s;
  }

  deleteCostume(costume) {
    if (this.isClone) {
      throw new Error("Clones can't delete their own costumes.");
    }
    costume.dispose();
    this.costumes = this.costumes.filter((c) => c.id !== costume.id);
    this.ensureUniqueCostumeNames(); //This also causes the costume mapping to happen.
  }

  deleteSound(sound) {
    if (this.isClone) {
      throw new Error("Clones can't delete their own sounds.");
    }
    sound.dispose();
    this.sounds = this.sounds.filter((s) => s.id !== sound.id);
    this.ensureUniqueCostumeNames(); //This also causes the costume mapping to happen.
  }

  dispose() {
    if (!this.isClone) {
      for (var costume of this.costumes) {
        this.deleteCostume(costume);
      }
      for (var sound of this.sounds) {
        this.deleteSound(sound);
      }
    }
    this.stopAllScripts();
    this.costumes = [];
    this.id = null;
    this.engine = null;
  }

  delete() {
    if (this.isClone) {
      throw new Error("This sprite is a clone, use destroyClone instead.");
    }
    this.engine.deleteSprite(this);
  }
}

module.exports = Sprite;
