const S_QUAD_POSITION = [
  -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
];

const S_TEXCOORDS = [
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

const S_DEFINES = `
#define ENABLE_whirl
#define ENABLE_color
`;

module.exports = {
  S_QUAD_POSITION,
  S_TEXCOORDS,
  S_DEFINES,
};
