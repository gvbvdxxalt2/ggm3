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
          (id) => id !== blockID
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
    var func = eval("(async function (sprite) {" + code + "})");
    return func.bind(this);
  }

  runFunction(code) {
    var func = this.getFunction(code);
    func(this);
  }

  addCostume(dataURL) {
    var _this = this;
    return new Promise(function (resolve, reject) {
      var costume = new Costume(
        _this.engine,
        dataURL,
        "Costume " + (_this.costumes.length + 1),
        function (success) {
          if (success) {
            resolve(costume);
          } else {
            reject("");
          }
        }
      );
      _this.costumes.push(costume);
    });
  }

  deleteCostume(costume) {
    costume.dispose();
    this.costumes = this.costumes.filter((c) => c.id !== costume.id);
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
