class Costume {
  constructor(engine, dataURL, name, resolveFunction) {
    this.engine = engine;
    this.dataURL = dataURL;
    this.isLoaded = false;
    this.loadImage(dataURL);
    this.drawable = null;
    this.rotationCenterX = 0;
    this.rotationCenterY = 0;
    this.preferedScale = 1;
    this.canvas = document.createElement("canvas");

    this.name = name || "Costume";
    this.resolveFunction = resolveFunction;
  }

  renderImageAtScale(scale) {
    if (this.drawable) {
      this.engine.disposeDrawable(this.drawable); //Make sure we aren't leaking memory when resetting the drawable.
    }
    var img = this.img;
    var canvas = this.canvas;
    var ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    this.drawable = this.engine.newDrawable(canvas);
    this.id = Date.now() + "_" + Math.round(Math.random() * 9999999);
  }

  getFinalRotationCenter() {
    return [
      this.preferedScale * this.rotationCenterX,
      this.preferedScale * this.rotationCenterY,
    ];
  }

  loadImage() {
    if (this.img) {
      this.img.src = "";
    }
    var _this = this;
    var engine = this.engine;
    var img = document.createElement("img");
    this.img = img;
    img.onload = function () {
      _this.rotationCenterX = img.width / 2;
      _this.rotationCenterY = img.height / 2;
      _this.renderImageAtScale(_this.preferedScale);
      if (_this.resolveFunction) {
        _this.resolveFunction(true);
        _this.resolveFunction = null;
      }
    };
    img.error = function () {
      if (_this.resolveFunction) {
        _this.resolveFunction(false);
        _this.resolveFunction = null;
      }
    };
    img.src = this.dataURL;
  }

  onDraw() {}

  dispose() {
    if (this.drawable) {
      this.engine.disposeDrawable(this.drawable);
    }
    if (this.img) {
      this.img.src = null;
      this.img = null;
    }
    this.canvas.width = 1;
    this.canvas.height = 1;
    this.canvas.remove();
    this.resolveFunction = null;
  }
}

module.exports = Costume;
