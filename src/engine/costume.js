var CollisionSprite = require("./mask.js");

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
    this.id = Date.now() + "_" + Math.round(Math.random() * 9999999);

    this.name = name || "Costume";
    this.resolveFunction = resolveFunction;
    this.mask = null;
	this.loaded = false;
  }

  renderImageAtScale() {
	if (this.disposed) {
	  return;
	}
    if (this.drawable) {
      this.engine.disposeDrawable(this.drawable); //Make sure we aren't leaking memory when resetting the drawable.
    }
    var img = this.img;
    var canvas = this.canvas;
    var ctx = canvas.getContext("2d");

    canvas.width = img.width*this.preferedScale;
    canvas.height = img.height*this.preferedScale;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    this.mask = new CollisionSprite(ctx.getImageData(0,0,canvas.width,canvas.height));

    this.drawable = this.engine.newDrawable(canvas);
	this.loading = false;
	this.loaded = true;
  }

  getFinalRotationCenter() {
    return [
      this.preferedScale * this.rotationCenterX,
      this.preferedScale * this.rotationCenterY,
    ];
  }

  loadImage() {
	if (this.disposed) {
	  return;
	}
	this.loading = true;
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
    img.onerror = function () {
      if (_this.resolveFunction) {
        _this.resolveFunction(false);
        _this.resolveFunction = null;
      }
    };
    img.src = this.dataURL;
  }

  onDraw() {}

	deloadCostume () {
		if (this.disposed) {
			return;
		}
		if (this.img) {
		  this.img.onload = function () {};
		  this.img.onerror = function () {};
	      this.img.src = "";
	      this.img = null;
	    }
		if (this.drawable) {
	      this.engine.disposeDrawable(this.drawable);
		  this.drawable = null;
	    }
		this.loading = false;
		this.loaded = false;
	}

	loadCostume () {
		if (this.disposed) {
			return;
		}
		if (this.loading) {
			return;
		}
		if (this.loaded) {
			return;
		}
		this.loadImage();
	}

  dispose() {
	this.disposed = true;
    if (this.drawable) {
      this.engine.disposeDrawable(this.drawable);
    }
    if (this.img) {
	  this.img.onload = function () {};
	  this.img.onerror = function () {};
      this.img.src = "";
      this.img = null;
    }
    this.canvas.width = 1;
    this.canvas.height = 1;
    this.canvas.remove();
    this.resolveFunction = null;
	this.drawable = null;
  }
}

module.exports = Costume;
