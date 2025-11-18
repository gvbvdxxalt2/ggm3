const VERTEXT_SHADER = require("./sprite.vert").default;
const FRAGMENT_SHADER = require("./sprite.frag").default;

FRAGMENT_SHADER += `
#define ENABLE_whirl
#define ENABLE_color
`;

module.exports = {
  VERTEXT_SHADER,
  FRAGMENT_SHADER,
};
