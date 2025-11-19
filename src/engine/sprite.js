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
    this.listeners = {};
    this.runningStacks = {};
    this.frameListeners = [];
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
  }

  addStackListener(name, blockID) {
    if (this.listeners[name]) {
      this.listeners[name].push(blockID);
    }
  }

  createThread(firstBlockID) {
    this.stopScript(firstBlockID);
    var thread = new Thread(firstBlockID, this);
    this.runningStacks[firstBlockID] = thread;
    return thread;
  }

  getFunction(code) {
    //Used by compiling.
    var func = eval("(async function () {" + code + "})");
    return func.bind(this);
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
}

module.exports = Sprite;
