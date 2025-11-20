var elements = require("../gp2/elements.js");
var AElement = require("../gp2/aelement.js");
require("./ggm3blocks");
require("./dom/index.js");
//var { createFreshWorkspace, getCurrentWorkspace } = require("./blocks.js");

var engine = require("./curengine.js");
var tabs = require("./tabs.js");
var selectedSprite = require("./selectedsprite.js");

require("./enginecontrol.js");

engine.createEmptySprite();
engine.createEmptySprite();
engine.createEmptySprite();
selectedSprite.setCurrentSprite(0);
