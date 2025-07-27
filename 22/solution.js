const load = require("../util/load");

const raw = load(__dirname + "/input.txt");

/** ------------------------------------- */

//  carrier begins in MIDDLE of map, facing UP

class Carrier {
  bursts = 0;
  history = [];
  infected = 0;
  cleaned = 0;
  map = [];
  curNode;
  curDir = 0; // default up

  constructor(map) {
    this.map = map;
    const initX = Math.floor(map[0].length / 2);
    const initY = Math.floor(map.length / 2);
    this.curNode = [initX, initY];
  }

  changeDirLeft() {
    this.updateDir(-1);
  }

  changeDirRight() {
    this.updateDir(1);
  }

  updateDir(offset) {
    this.curDir = (((this.curDir + offset) % 4) + 4) % 4; // 4 dirs: 0 = up, 1 = right...
  }

  burst() {
    const [x, y] = this.curNode;

    if (this.map[y][x] === undefined) {
    }

    const isInfected = this.map[y][x] === "#";

    if (isInfected) {
      this.changeDirRight();
      this.clean(x, y);
    } else {
      this.changeDirLeft();
      this.infect(x, y);
    }
    this.move();
    this.bursts += 1;
  }

  infect(x, y) {
    this.updateMap(x, y, 1);
    this.infected += 1;
    this.history.push(`${x},${y}#`);
  }

  clean(x, y) {
    this.updateMap(x, y, 0);
    this.cleaned += 1;
    this.history.push(`${x},${y}.`);
  }

  updateMap(x, y, isInfected) {
    const symbol = isInfected ? "#" : ".";
    this.map[y][x] = symbol;
  }

  move() {
    let [x, y] = this.curNode;
    switch (this.curDir) {
      case 0:
        y -= 1;
        break; // up
      case 1:
        x += 1;
        break; // right
      case 2:
        y += 1;
        break; // down
      case 3:
        x -= 1;
        break; // left
    }

    if (x < 0) {
      this.addColLeft();
      x = 0;
    } else if (x >= this.map[0].length) {
      this.addColRight();
    }

    if (y < 0) {
      this.addRowTop();
      y = 0;
    } else if (y >= this.map.length) {
      this.addRowBottom();
    }

    this.curNode = [x, y];
  }

  addColRight() {
    this.map.forEach((r) => r.push("."));
  }

  addColLeft() {
    this.map = this.map.map((r) => [".", ...r]);
    this.curNode[0] += 1; // shift right
  }

  addRowTop() {
    const newRow = new Array(this.map[0].length).fill(".");
    this.map = [newRow, ...this.map];
  }

  addRowBottom() {
    const newRow = new Array(this.map[0].length).fill(".");
    this.map.push(newRow);
    this.curNode[1] += 1; // shift down
  }

  run(bursts) {
    for (let i = 0; i < bursts; i++) {
      console.log(`i: ${i}`);
      this.burst();
    }
  }

  stats() {
    return {
      infected: this.infected,
      cleaned: this.cleaned,
      bursts: this.bursts,
      curNode: this.curNode,
      curDir: this.curDir,
    };
  }

  displayMap() {
    return this.map.map((m) => m.join("")).join("\n");
  }
}

const map = raw.split("\n").map((r) => r.split(""));

const c = new Carrier(map);
c.run(10000);

console.log("PT1");
console.log(c.stats());
