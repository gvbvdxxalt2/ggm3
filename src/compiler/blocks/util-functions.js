module.exports = {
  newThread: function (blockjson) {
    return `var thread = sprite.createThread(${JSON.stringify(blockjson.id)})`;
  },
};
