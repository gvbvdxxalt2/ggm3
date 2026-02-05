var {
  getSaveableVariables,
  getSaveableVariablesGlobal,
} = require("./saveable-vars.js");
var engine = require("../curengine.js");

//Engine property names

function _fromEnginePropertyNames(from) {
  engine.propertyVariables = {};
  for (var name of from || []) {
    engine.propertyVariables[name] = true;
  }
}

function _toEnginePropertyNames(from) {
  return Object.keys(engine.propertyVariables);
}

//Engine properties

function fromEngineJSON(mainJSON) {
  Object.assign(engine, {
    globalVariables: mainJSON.globalVariables || {},
    broadcastNames: mainJSON.broadcastNames || [],
    frameRate: mainJSON.frameRate || 60,
  });
  _fromEnginePropertyNames(mainJSON.spriteProperties);
}

function toEngineJSON() {
  return {
    globalVariables: getSaveableVariablesGlobal(engine.globalVariables),
    broadcastNames: engine.broadcastNames,
    frameRate: engine.frameRate,
    spriteProperties: _toEnginePropertyNames(),
  };
}

//Sprite properties

function fromSpriteJSON(sprite, spriteJson) {
  Object.assign(sprite, {
    x: spriteJson.x,
    y: spriteJson.y,
    angle: spriteJson.angle,
    scaleX: spriteJson.scaleX,
    scaleY: spriteJson.scaleY,
    skewX: spriteJson.skewX || 0,
    skewY: spriteJson.skewY || 0,
    size: spriteJson.size,
    blocklyXML: spriteJson.blocklyXML
      ? Blockly.Xml.textToDom(spriteJson.blocklyXML)
      : null,
    name: spriteJson.name,
    costumeIndex: spriteJson.costumeIndex,
    zIndex: spriteJson.zIndex,
    variables: spriteJson.variables,
    hidden: spriteJson.hidden,
    spriteProperties: spriteJson.properties || {},
  });
}

function toSpriteJSON(sprite) {
  return {
    x: sprite.x,
    y: sprite.y,
    angle: sprite.angle,
    scaleX: sprite.scaleX,
    scaleY: sprite.scaleY,
    skewX: sprite.skewX,
    skewY: sprite.skewY,
    size: sprite.size,
    blocklyXML: sprite.blocklyXML
      ? Blockly.Xml.domToText(sprite.blocklyXML)
      : null,
    name: sprite.name,
    zIndex: sprite.zIndex,
    costumeIndex: sprite.costumeIndex,
    variables: getSaveableVariables(sprite.variables),
    properties: getSaveableVariablesGlobal(sprite.spriteProperties),
    hidden: sprite.hidden,
  };
}

//Costume properties

function fromCostumeJSON(costume, costumeJson) {
  Object.assign(costume, {
    id: costumeJson.id,
    rotationCenterX: costumeJson.rotationCenterX,
    rotationCenterY: costumeJson.rotationCenterY,
    preferedScale: costumeJson.preferedScale,
    willPreload: costumeJson.willPreload,
    mimeType: costumeJson.mimeType,
  });
}

function toCostumeJSON(costume) {
  return {
    name: costume.name,
    id: costume.id,
    rotationCenterX: costume.rotationCenterX,
    rotationCenterY: costume.rotationCenterY,
    preferedScale: costume.preferedScale,
    willPreload: costume.willPreload,
    mimeType: costume.mimeType,
  };
}

//Sound properties

function fromSoundJSON(sound, soundJson) {
  Object.assign(sound, {
    id: soundJson.id,
    willPreload: soundJson.willPreload,
    mimeType: soundJson.mimeType,
  });
}

function toSoundJSON(sound) {
  return {
    name: sound.name,
    id: sound.id,
    willPreload: sound.willPreload,
    mimeType: sound.mimeType,
  };
}

module.exports = {
  fromEngineJSON,
  toEngineJSON,

  fromSpriteJSON,
  toSpriteJSON,

  fromCostumeJSON,
  toCostumeJSON,

  fromSoundJSON,
  toSoundJSON,
};
