const twgl = require("twgl.js");

const m4 = twgl.m4;

function calculateMatrix(sprite, dst) {
  dst = dst || m4.identity();

  // Start with a clean matrix
  m4.identity(dst);

  // 1. Translate to the final sprite.x, sprite.y position
  // This is the last operation to happen.
  m4.translate(dst, [sprite.x, sprite.y, 0], dst);

  // 2. Rotate around the Z axis
  m4.rotateZ(dst, sprite.rotation, dst);

  // 3. Scale the 1x1 quad up to the final pixel size
  const finalWidth = sprite.textureWidth * sprite.scale;
  const finalHeight = sprite.textureHeight * sprite.scale;
  m4.scale(dst, [finalWidth, finalHeight, 1], dst);

  // 4. Apply the pivot translation.
  // This is the first operation to happen. It moves the
  // geometry so the pivot point is at the origin (0,0)
  // before scaling and rotation.

  // Convert pixel pivot (0 to textureWidth) to 0-1 range
  const pivotNormX = sprite.rotationCenterX / sprite.textureWidth;
  const pivotNormY = sprite.rotationCenterY / sprite.textureHeight;

  // Convert 0-1 range to geometry's -0.5 to +0.5 range
  // and negate it to move the pivot *to* the origin.
  const pivotTranslateX = -(pivotNormX - 0.5);
  const pivotTranslateY = -(pivotNormY - 0.5);

  m4.translate(dst, [pivotTranslateX, pivotTranslateY, 0], dst);

  return dst;
}

module.exports = calculateMatrix;
