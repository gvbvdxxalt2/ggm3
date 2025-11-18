class Sprite {
  constructor() {
    var id = "";
    id += Date.now();
    id += "_";
    id += Math.round(Math.random() * 999999);
    this.id = id;

    this.costume = {};
  }
}
