module.exports = {
  newThread: function (blockjson) {
    return `var thread = sprite.createThread(${JSON.stringify(blockjson.id)});`;
  },
  threadWaitFrame: function (blockjson) {
    return `await thread.waitForNextFrame();`;
  },
  endThread: function (blockjson) {
    return `thread.stop();`;
  },
  aliveCheck: function (blockjson) {
    return `try{if (!thread.running) {thread.stop();return thread;}}catch(e){}`;
  },
};
