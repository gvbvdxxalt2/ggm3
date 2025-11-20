var engine = require("./curengine.js");

async function loadDefaultProject() {
  var logo = require("!url-loader!./default/ggm3-png.png").default;
  engine.emptyProject();
  var sprite = engine.createEmptySprite();
  sprite.addCostume(logo);
  sprite.size = 40;
}

module.exports = {
  loadDefaultProject,
};
