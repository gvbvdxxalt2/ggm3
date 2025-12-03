var JavascriptTranslation = {};
var utilFunctions = require("./util-functions.js");
var outputBlocks = require("./output_blocks.js");

outputBlocks.push("json_new");
JavascriptTranslation["json_new"] = function (jsonblock, utils, options) {
  var TYPE = utils.getField(jsonblock, "TYPE", options);
  if (TYPE == "object") {
    return "({})";
  }
  if (TYPE == "array") {
    return "([])";
  }
};

JavascriptTranslation["json_setto"] = function (jsonblock, utils, options) {
  var NAME = utils.getInput(jsonblock, "NAME", options);
  var VALUE = utils.getInput(jsonblock, "VALUE", options);
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options, "{}");

  return `(${OBJECT})[${NAME}] = ${VALUE};`;
};

outputBlocks.push("json_geton");
JavascriptTranslation["json_geton"] = function (jsonblock, utils, options) {
  var NAME = utils.getInput(jsonblock, "NAME", options);
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options, "{}");

  return `(${OBJECT})[${NAME}]`;
};

outputBlocks.push("json_keys");
JavascriptTranslation["json_keys"] = function (jsonblock, utils, options) {
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options, "{}");

  return `(Object.keys(${OBJECT}))`;
};

outputBlocks.push("json_tostring");
JavascriptTranslation["json_tostring"] = function (jsonblock, utils, options) {
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options, "{}");

  return `(JSON.stringify(${OBJECT}))`;
};

outputBlocks.push("json_fromstring");
JavascriptTranslation["json_fromstring"] = function (
  jsonblock,
  utils,
  options,
) {
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options, '"{}"');

  return `(JSON.parse(${OBJECT}))`;
};

JavascriptTranslation["json_deleteon"] = function (jsonblock, utils, options) {
  var NAME = utils.getInput(jsonblock, "NAME", options);
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options, "{}");

  return `delete (${OBJECT})[${NAME}];`;
};

JavascriptTranslation["json_array_push"] = function (
  jsonblock,
  utils,
  options,
) {
  var VALUE = utils.getInput(jsonblock, "VALUE", options);
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options, "[]");

  return `(${OBJECT}).push(${VALUE});`;
};

JavascriptTranslation["json_array_unshift"] = function (
  jsonblock,
  utils,
  options,
) {
  var VALUE = utils.getInput(jsonblock, "VALUE", options);
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options, "[]");

  return `(${OBJECT}).unshift(${VALUE});`;
};

outputBlocks.push("json_array_lengthof");
JavascriptTranslation["json_array_lengthof"] = function (
  jsonblock,
  utils,
  options,
) {
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options, "[]");

  return `(${OBJECT}).length`;
};

outputBlocks.push("json_array_indexof");
JavascriptTranslation["json_array_indexof"] = function (
  jsonblock,
  utils,
  options,
) {
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options, "[]");
  var VALUE = utils.getInput(jsonblock, "VALUE", options);

  return `(${OBJECT}).indexOf(${VALUE})`;
};

outputBlocks.push("json_has_key");
JavascriptTranslation["json_has_key"] = function (jsonblock, utils, options) {
  var NAME = utils.getInput(jsonblock, "NAME", options);
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options, "{}");

  return `Object.prototype.hasOwnProperty.call(${OBJECT}, ${NAME})`;
};

outputBlocks.push("json_get_path");
JavascriptTranslation["json_get_path"] = function (jsonblock, utils, options) {
  var PATH = utils.getInput(jsonblock, "PATH", options);
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options, "[]");
  var DEFAULT = utils.getInput(jsonblock, "DEFAULT", options);

  return `(function(o,p,d){var cur=o; if(cur==null) return d; if(Array.isArray(p)){ for(var i=0;i<p.length;i++){ cur=cur[p[i]]; if(cur==null) return d; } return cur; } p=(""+p).split('.'); for(var i=0;i<p.length;i++){ cur=cur[p[i]]; if(cur==null) return d; } return cur;})(${OBJECT},${PATH},${DEFAULT})`;
};

JavascriptTranslation["json_set_path"] = function (jsonblock, utils, options) {
  var PATH = utils.getInput(jsonblock, "PATH", options, "[]");
  var VALUE = utils.getInput(jsonblock, "VALUE", options);
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options);

  return `(function(o,p,v){var cur=o; if(cur==null) return; if(!Array.isArray(p)) p=(""+p).split('.'); for(var i=0;i<p.length-1;i++){ var k=p[i]; if(cur[k]==null || typeof cur[k] !== 'object') cur[k]={}; cur=cur[k]; } cur[p[p.length-1]]=v;})(${OBJECT},${PATH},${VALUE});`;
};

JavascriptTranslation["json_delete_path"] = function (
  jsonblock,
  utils,
  options,
) {
  var PATH = utils.getInput(jsonblock, "PATH", options);
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options);

  return `(function(o,p){var cur=o; if(cur==null) return; if(!Array.isArray(p)) p=(""+p).split('.'); for(var i=0;i<p.length-1;i++){ cur=cur[p[i]]; if(cur==null) return; } delete cur[p[p.length-1]];})(${OBJECT},${PATH});`;
};

outputBlocks.push("json_array_pop");
JavascriptTranslation["json_array_pop"] = function (jsonblock, utils, options) {
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options, "[]");

  return `(${OBJECT}).pop()`;
};

outputBlocks.push("json_array_contains");
JavascriptTranslation["json_array_contains"] = function (
  jsonblock,
  utils,
  options,
) {
  var VALUE = utils.getInput(jsonblock, "VALUE", options);
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options, []);

  return `(${OBJECT}).includes(${VALUE})`;
};

outputBlocks.push("json_clone");
JavascriptTranslation["json_clone"] = function (jsonblock, utils, options) {
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options, "{}");

  return `(JSON.parse(JSON.stringify(${OBJECT})))`;
};

outputBlocks.push("json_parse_safe");
JavascriptTranslation["json_parse_safe"] = function (
  jsonblock,
  utils,
  options,
) {
  var STRING = utils.getInput(jsonblock, "STRING", options);
  var DEFAULT = utils.getInput(jsonblock, "DEFAULT", options);

  return `(function(s,d){try{return JSON.parse(s);}catch(e){return d;}})(${STRING},${DEFAULT})`;
};

outputBlocks.push("json_pretty_print");
JavascriptTranslation["json_pretty_print"] = function (
  jsonblock,
  utils,
  options,
) {
  var OBJECT = utils.getInput(jsonblock, "OBJECT", options, "{}");
  var INDENT = utils.getInput(jsonblock, "INDENT", options, '""');

  return `(JSON.stringify(${OBJECT}, null, (${INDENT}) || 2))`;
};

module.exports = JavascriptTranslation;
