const load = require("../util/load");

const raw = load(__dirname + "/input.txt");

/** ------------------------------------- */

function initializeMem(raw) {
  const m = {};
  raw.split("\n").forEach((l) => (m[l.match(/^(\w+)\b/)[1]] = 0));
  return m;
}

const mem = initializeMem(raw);
const instructions = raw.split("\n").map((r) => r.split(" "));

function run1(mem, ins) {
  for (let i = 0; i < ins.length; i++) {
    const [bank, op, val, _if, cBank, cOp, cVal] = ins[i];
    if (eval(`${mem[cBank]} ${cOp} ${cVal}`)) {
      mem[bank] =
        op === "inc" ? mem[bank] + parseInt(val) : mem[bank] - parseInt(val);
    }
  }
  return mem;
}

console.log("Part 1");
const m = run1({ ...mem }, instructions);
console.log(Object.values(m).sort((a, b) => a - b));

// -----------------------------

function run2(mem, ins) {
  let highest = 0;

  for (let i = 0; i < ins.length; i++) {
    const [bank, op, val, _if, cBank, cOp, cVal] = ins[i];
    if (eval(`${mem[cBank]} ${cOp} ${cVal}`)) {
      if (mem[bank] > highest) highest = mem[bank];
      mem[bank] =
        op === "inc" ? mem[bank] + parseInt(val) : mem[bank] - parseInt(val);
    }
  }
  return { mem, highest };
}

console.log("Part 2");
const m2 = run2({ ...mem }, instructions);
console.log("highest", m2.highest);
