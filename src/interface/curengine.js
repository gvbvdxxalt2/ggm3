var elements = require("../gp2/elements.js");
var AElement = require("../gp2/aelement.js");
var engine = require("../engine/");

module.exports = new engine(elements.getGPId("projectCanvas"));
