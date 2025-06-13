const load = require("../util/load");

const raw = load(__dirname + "/input.txt");

/** ------------------------------------- */

const instructions = raw.split("\n").map((n) => parseInt(n));

// my stack overflowed :(
function jump(ins, jumps = 0, i = 0) {
  if (ins[i] === undefined) return jumps;
  jumps++;
  const next = i + ins[i];
  ins[i] = ins[i] + 1;

  return () => jump(ins, jumps, next);
}

function trampoline(fn) {
  while (typeof fn === "function") {
    fn = fn();
  }
  return fn;
}

console.log("PT1");
const t1 = performance.now();
// console.log(trampoline(() => jump(instructions)));
const t2 = performance.now();

// tried to benchmark the compute time (first time it took several seconds, but subsequent times ~9ms!? CPU caching?)
console.log("elapsed: ", t2 - t1, "ms");

// but weirdly, when i offset the array by one with instructions.slice(1), it also took only 9ms??!??

// ------ PT 2 ---
function jump2(ins, jumps = 0, i = 0) {
  if (ins[i] === undefined) return jumps;
  jumps++;
  const next = i + ins[i];
  ins[i] = ins[i] >= 3 ? ins[i] - 1 : ins[i] + 1;

  return () => jump(ins, jumps, next);
}

console.log("PT2");
const t3 = performance.now();
console.log(trampoline(jump2(instructions)));
const t4 = performance.now();

console.log("elapsed: ", t4 - t3, "ms");
