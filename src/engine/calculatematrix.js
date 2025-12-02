const twgl = require("twgl.js");
const m4 = twgl.m4;

function calculateMatrix(sprite, dst) {
  dst = dst || m4.identity();
  m4.identity(dst);

  m4.translate(dst, [sprite.x, sprite.y, 0], dst);

  m4.rotateZ(dst, sprite.rotation, dst);

  const finalWidth = sprite.textureWidth * sprite.scaleX;
  const finalHeight = sprite.textureHeight * sprite.scaleY;
  m4.scale(dst, [finalWidth, finalHeight, 1], dst); // Z-scale should be 1

  const pivotNormX = sprite.rotationCenterX / sprite.textureWidth;
  const pivotNormY = sprite.rotationCenterY / sprite.textureHeight;

  m4.translate(dst, [-pivotNormX, -pivotNormY, 0], dst);

  return dst;
}

module.exports = calculateMatrix;
