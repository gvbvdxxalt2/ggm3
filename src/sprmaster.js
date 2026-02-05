//Constant generator for Sprite Master category.
//Need this because many properties and may add more later.

var SPRITE_MASTER_VALUES = {
  "x position": "x",
  "y position": "y",
  direction: "direction",
  "costume name": "costumeName",
  "costume index/number": "costumeIndex",
  alpha: "alpha",
  "x stretch": "scaleX",
  "y stretch": "scaleY",
  "skew x": "skewX",
  "skew y": "skewY",
};
var SPRITE_MASTER_DROPDOWN = Object.keys(SPRITE_MASTER_VALUES).map((name) => [
  name,
  name,
]);

var SPRITE_MASTER_CODE = {};
Object.keys(SPRITE_MASTER_VALUES).forEach((name) => {
  SPRITE_MASTER_CODE[name] = `${SPRITE_MASTER_VALUES[name]}`;
});

module.exports = {
  SPRITE_MASTER_VALUES,
  SPRITE_MASTER_DROPDOWN,
  SPRITE_MASTER_CODE,
};
