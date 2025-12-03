sprite.addBroadcastListener(
  "message",
  "~.S7tzfqrCX#U5G.1JU2",
  async function () {
    var thread = sprite.createThread("~.S7tzfqrCX#U5G.1JU2");
    try {
      sprite.x = +0 || 0;
      sprite.y = +-13 || 0;
      sprite.effects.waveTime = +0 || 0;
      sprite.variables["SZunkkic9MUj(YZS14m$"] = "1";
      sprite.alpha = +100 || 0;
      try {
        if (!thread.running) {
          thread.stop();
          return thread;
        }
      } catch (e) {}
      while (!(sprite.variables["SZunkkic9MUj(YZS14m$"] == "0")) {
        try {
          if (!thread.running) {
            thread.stop();
            return thread;
          }
        } catch (e) {}
        try {
          if (!thread.running) {
            thread.stop();
            return thread;
          }
        } catch (e) {}
        sprite.variables["Um[5F98/;HpI|vXwN.zo"] =
          (+sprite.variables["Um[5F98/;HpI|vXwN.zo"] || 0) + (+0 || 0);
        if (thread.screenRefresh) {
          await thread.waitForNextFrame();
        }
      }
      try {
        if (!thread.running) {
          thread.stop();
          return thread;
        }
      } catch (e) {}
      try {
        if (!thread.running) {
          thread.stop();
          return thread;
        }
      } catch (e) {}
      await thread.waitSeconds(3);
      try {
        if (!thread.running) {
          thread.stop();
          return thread;
        }
      } catch (e) {}
      thread.stop();
    } catch (e) {
      thread.hadError = true;
      thread.output = e;
      thread.stop();
      return thread;
    }
  },
);
