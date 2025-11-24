var Costume = require("./costume.js");
var Thread = require("./thread.js");

class Sprite {
  constructor(engine, name) {
    var id = "";
    id += Date.now();
    id += "_";
    id += Math.round(Math.random() * 999999);
    this.id = id;

    this.costumes = [];
    this.costumeIndex = 0;
    this.engine = engine;

    this.name = name || "Sprite";
    this.blocklyXML = null; //Used to hold code for the editor.

    this.scaleX = 1;
    this.scaleY = 1;
    this.size = 100;
    this.x = 0;
    this.y = 0;
    this.angle = 0;

    this.hatFunctions = {};
    this.listeners = {
      started: [],
    };
    this.runningStacks = {};
    this.frameListeners = [];

    this.threadEndListener = null;
    this.threadStartListener = null;

    this.direction = 90; //Wrapper around this.angle

    this.alpha = 100;

    this._variable_ids_ = [];
    this.variables = {};

    this.zIndex = 0;
    this.hidden = false;

    this.costumeMap = {}; //Used to switch costumes by name quickly.
  }

  getCostumeIndex(v) {
    if (isNaN(+v)) {
      return this.costumeMap[v];
    } else {
      return Math.round(+v + 1);
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
    mask.scaleX = ((this.size / 100) * this.scaleX) / costume.preferedScale;
    mask.scaleY = ((this.size / 100) * this.scaleY) / costume.preferedScale;
    mask.x = this.x;
    mask.y = -this.y; //Negative because Y is inverted in GGM3 coordinates.
    mask.centerX = costume.rotationCenterX * costume.preferedScale;
    mask.centerY = costume.rotationCenterY * costume.preferedScale;
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

  removeStackListener(blockID) {
    for (var listener of Object.keys(this.listeners)) {
      if (this.listeners[listener].indexOf(blockID) !== -1) {
        this.listeners[listener] = this.listeners[listener].filter(
          (id) => id !== blockID,
        );
      }
    }

    delete this.hatFunctions[blockID];
  }

  addStackListener(name, blockID, func) {
    this.removeStackListener(blockID);
    if (this.listeners[name]) {
      this.listeners[name].push(blockID);
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

  stopAllScripts() {
    for (var thread of Object.keys(this.runningStacks)) {
      this.stopScript(thread);
    }
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
    if (this.threadEndListener) {
      this.threadEndListener(firstBlockID);
    }
    delete this.runningStacks[firstBlockID];
  }

  getFunction(code) {
    //Used by compiling.
    //window.alert(code);
    var func = eval("(async function (sprite,engine) {" + code + "})");
    return func.bind(this);
  }

  async runFunction(code) {
    var func = this.getFunction(code);
    return await func(this, this.engine);
  }

  addCostume(dataURL, name) {
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
    var costume = new Costume(
      this.engine,
      url,
      name ? name : "Costume " + (_this.costumes.length + 1)
    );
    this.costumes.push(costume);
    this.ensureUniqueCostumeNames();
  }

  deleteCostume(costume) {
    costume.dispose();
    this.costumes = this.costumes.filter((c) => c.id !== costume.id);
    this.ensureUniqueCostumeNames(); //This also causes the costume mapping to happen.
  }

  dispose() {
    for (var costume of this.costumes) {
      this.deleteCostume(costume);
    }
    this.costumes = [];
    this.id = null;
    this.engine = null;
  }

  delete() {
    this.engine.deleteSprite(this);
  }
}

module.exports = Sprite;
