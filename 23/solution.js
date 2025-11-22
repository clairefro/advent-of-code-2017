const load = require("../util/load");
const fs = require("fs");

const raw = load(__dirname + "/input.txt");

/** ------------------------------------- */

// set X Y sets register X to the value of Y.
// sub X Y decreases register X by the value of Y.
// mul X Y sets register X to the result of multiplying the value contained in register X by the value of Y.
// jnz X Y jumps with an offset of the value of Y, but only if the value of X is not zero. (An offset of 2 skips the next instruction, an offset of -1 jumps to the previous instruction, and so on.)

const instructions = raw.split("\n").map((l) => l.split(/\s/));

class Processor {
  history = [];
  r = {};
  historyStream = null;

  reset() {
    this.history = [];

    const r = {};
    "abcdefgh".split("").forEach((c) => (r[c] = 0));
    this.r = r;

    // Create write stream
    if (this.historyStream) {
      this.historyStream.end();
    }
    this.historyStream = fs.createWriteStream(__dirname + "/history.txt");
  }

  run(instructions) {
    this.reset();
    let pc = 0;

    let running = true;
    while (running) {
      const ins = instructions[pc];
      this.history.push(ins);

      // Stream to file
      this.historyStream.write(ins.join(" ") + "\n");

      const [opcode, argA, argB] = ins.map((i) =>
        /^-?\d+$/.test(i) ? parseInt(i) : i
      );

      const valA = typeof argA === "number" ? argA : this.r[argA];
      const valB = typeof argB === "number" ? argB : this.r[argB];

      switch (opcode) {
        case "set":
          this.r[argA] = valB;
          pc += 1;
          break;
        case "sub":
          this.r[argA] -= valB;
          pc += 1;
          break;
        case "mul":
          this.r[argA] *= valB;
          pc += 1;
          break;
        case "jnz":
          if (valA !== 0) {
            pc += valB;
          } else {
            pc += 1;
          }
          if (pc >= instructions.length || pc < 0) {
            running = false;
          }
          break;
      }
    }

    // Close stream when done
    if (this.historyStream) {
      this.historyStream.end();
    }
  }
}

// Part 1
const p = new Processor();
p.run(instructions);
console.log(`PT1 - ran ${p.history.length} times`);

const muls = p.history.reduce((acc, item) => {
  return acc + (item[0] === "mul" ? 1 : 0);
}, 0);

console.log(`PT1 - mul invoked ${muls} times`);

// Part 2 - Optimized
// The assembly code counts composite (non-prime) numbers in a range
function isComposite(n) {
  if (n < 2) return false;
  if (n === 2) return false;
  if (n % 2 === 0) return true;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return true;
  }
  return false;
}

// Parse initial b value from instruction 0
let b = parseInt(instructions[0][2]);
let c = b;

// When a=1, these transformations happen (lines 3-8):
// mul b 100 -> sub b -100000 -> set c b -> sub c -17000
b = b * 100 + 100000;
c = b + 17000;

let h = 0;
// Count composites from b to c, incrementing by 17 each step
for (let num = b; num <= c; num += 17) {
  if (isComposite(num)) {
    h++;
  }
}

console.log(`PT2 - Register h: ${h}`);
