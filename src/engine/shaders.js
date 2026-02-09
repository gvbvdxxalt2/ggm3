var VERTEX_SHADER = require("./sprite.vert").default;
var FRAGMENT_SHADER_OG = require("./sprite.frag").default;

var FRAGMENT_SHADER = `
#define ENABLE_ghost
#define ENABLE_wavy
#define ENABLE_ribbon
#define ENABLE_brightness
${FRAGMENT_SHADER_OG}
`;

module.exports = {
  VERTEX_SHADER,
  FRAGMENT_SHADER,
};
