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
      this.clean(x, y);
    } else {
      this.infect(x, y);
    }
    this.move();
    this.bursts += 1;
  }

  infect(x, y) {
    this.changeDirLeft();
    this.updateMap(x, y, 1);
    this.infected += 1;
    this.history.push(`${x},${y}#`);
  }

  clean(x, y) {
    this.changeDirRight();
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

// const c = new Carrier(map);
// c.run(10000);

// console.log("PT1");
// console.log(c.stats());
// console.log(c.displayMap());

// PT 2

// Decide which way to turn based on the current node:
// If it is clean (.), it turns left.
// If it is weakened (W), it does not turn, and will continue moving in the same direction.
// If it is infected (#), it turns right.
// If it is flagged (F), it reverses direction, and will go back the way it came.
// Modify the state of the current node, as described above.
// The virus carrier moves forward one node in the direction it is facing.

class EvolvedCarrier {
  bursts = 0;
  infected = 0;
  cleaned = 0;
  weakened = 0;
  flagged = 0;
  map = [];
  curNode;
  curDir = 0; // default up
  prevDir = undefined;

  STATUS = {
    WEAKENED: "W",
    INFECTED: "#",
    FLAGGED: "F",
    CLEAN: ".",
  };

  constructor(map) {
    this.map = map;
    const initX = Math.floor(map[0].length / 2);
    const initY = Math.floor(map.length / 2);
    this.curNode = [initX, initY];
  }

  changeDirLeft() {
    this.updateDirLeftRight(-1);
  }

  changeDirRight() {
    this.updateDirLeftRight(1);
  }

  //  0
  // 3 1
  //  2
  updateDirReverse() {
    switch (this.prevDir) {
      case 0:
        this.curDir = 2;
        break;
      case 1:
        this.curDir = 3;
        break;
      case 2:
        this.curDir = 0;
        break;
      case 3:
        this.curDir = 1;
        break;
    }
  }

  updateDirLeftRight(offset) {
    this.curDir = (((this.curDir + offset) % 4) + 4) % 4; // 4 dirs: 0 = up, 1 = right...
  }

  burst() {
    const [x, y] = this.curNode;

    if (this.map[y][x] === undefined) {
    }

    const status = this.map[y][x];
    switch (status) {
      case this.STATUS.CLEAN:
        this.weaken(x, y);
        break;
      case this.STATUS.WEAKENED:
        this.infect(x, y);
        break;
      case this.STATUS.INFECTED:
        this.flag(x, y);
        break;
      case this.STATUS.FLAGGED:
        this.clean(x, y);
    }

    this.move();
    this.bursts += 1;
  }

  infect(x, y) {
    // do not change dir
    this.updateMap(x, y, this.STATUS.INFECTED);
    this.infected += 1;
  }

  clean(x, y) {
    this.updateDirReverse();
    this.updateMap(x, y, this.STATUS.CLEAN);
    this.cleaned += 1;
  }

  flag(x, y) {
    this.changeDirRight();
    this.updateMap(x, y, this.STATUS.FLAGGED);
    this.flagged += 1;
  }

  weaken(x, y) {
    this.changeDirLeft();
    this.updateMap(x, y, this.STATUS.WEAKENED);
    this.weakened += 1;
  }

  updateMap(x, y, symbol) {
    this.map[y][x] = symbol;
  }

  move() {
    // cache for reverse
    this.prevDir = this.curDir;

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
      console.log(`${i}`);
      this.burst();
    }
  }

  stats() {
    return {
      infected: this.infected,
      cleaned: this.cleaned,
      weakened: this.weakened,
      flagged: this.flagged,
      bursts: this.bursts,
      curNode: this.curNode,
      curDir: this.curDir,
      prevDir: this.prevDir,
      gridWidth: this.map[0].length,
      gridHeight: this.map.length,
    };
  }

  displayMap() {
    return this.map.map((m) => m.join("")).join("\n");
  }
}

const e = new EvolvedCarrier(map);

console.log("PT2");
console.log("running...");

const startTime = Date.now();

e.run(10000000);

const endTime = Date.now();

const duration = ((endTime - startTime) / 1000).toFixed(2);
console.log(`Completed in ${duration} seconds`);
console.log(e.stats());
