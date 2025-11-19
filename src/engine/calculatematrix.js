const twgl = require("twgl.js");
const m4 = twgl.m4;

/**
 * Calculates a 2D model matrix for a sprite.
 * Assumes the sprite's geometry is a 1x1 quad with its
 * top-left corner at (0,0).
 *
 * @param {object} sprite The sprite to calculate.
 * @param {mat4} [dst] An optional matrix to store the result in.
 * @returns {mat4} The calculated model matrix.
 */
function calculateMatrix(sprite, dst) {
  dst = dst || m4.identity();
  m4.identity(dst);

  // 1. Translate to the final sprite.x, sprite.y position
  m4.translate(dst, [sprite.x, sprite.y, 0], dst);

  // 2. Rotate around the Z axis
  m4.rotateZ(dst, sprite.rotation, dst);

  // 3. Scale the 1x1 quad up to the final pixel size
  // NOTE: I removed your "/ 2". The bug is in the data
  // you are passing to this function, not here.
  const finalWidth = sprite.textureWidth * sprite.scaleX;
  const finalHeight = sprite.textureHeight * sprite.scaleY;
  m4.scale(dst, [finalWidth, finalHeight, 1], dst); // Z-scale should be 1

  // 4. Apply the pivot translation.
  const pivotNormX = sprite.rotationCenterX / sprite.textureWidth;
  const pivotNormY = sprite.rotationCenterY / sprite.textureHeight;

  // Move the pivot point to the origin (0,0)
  m4.translate(dst, [-pivotNormX, -pivotNormY, 0], dst);

  return dst;
}

module.exports = calculateMatrix;
