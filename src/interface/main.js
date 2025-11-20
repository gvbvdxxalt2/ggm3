var elements = require("../gp2/elements.js");
var AElement = require("../gp2/aelement.js");
require("./ggm3blocks");
require("./dom/index.js");
//var { createFreshWorkspace, getCurrentWorkspace } = require("./blocks.js");

var engine = require("./curengine.js");
var tabs = require("./tabs.js");
var selectedSprite = require("./selectedsprite.js");
var defaultProject = require("./defaultproject.js");

require("./enginecontrol.js");

(async function () {
  await defaultProject.loadDefaultProject();
  selectedSprite.setCurrentSprite(0);
})();
