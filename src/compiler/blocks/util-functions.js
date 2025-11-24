module.exports = {
  startThreadStack: function (blockjson) {
    return `var thread = sprite.createThread(${JSON.stringify(blockjson.id)});try {`;
  },
  endThreadStack: function (blockjson) {
    return `thread.stop();}catch(e){thread.hadError = true;thread.output = e;thread.stop();return thread;}`;
  },
  stopThisThread: function (blockjson) {
    return `thread.stop();`;
  },
  threadWaitFrame: function (blockjson) {
    return `await thread.waitForNextFrame();`;
  },
  aliveCheck: function (blockjson) {
    return `try{if (!thread.running) {thread.stop();return thread;}}catch(e){}`;
  },
};
