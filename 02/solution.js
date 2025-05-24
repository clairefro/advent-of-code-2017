const load = require("../util/load");

const raw = load(__dirname + "/input.txt");

/** ------------------------------------- */

// get array of int arrays
const rows = raw.split("\n").map((r) => r.split(/\s+/).map((i) => parseInt(i)));

// ---- PT 1 -----

function checksumDiff(row) {
  const s = [...row].sort((a, b) => a - b);
  return s[s.length - 1] - s[0];
}

const t0 = performance.now();
const result = rows.reduce((acc, cur) => acc + checksumDiff(cur), 0);
const t1 = performance.now();
console.log("pt1: ", result);
console.log(`(${t1 - t0}ms)`);

// ---- PT 2 -----

// assume only one evenly divisbile pair per row
function checksumQuotient(row) {
  const s = [...row].sort((a, b) => b - a); // sort high -> low
  let quotient;

  for (let i = 0; i < s.length; i++) {
    const dividend = s[i];
    const rest = s.slice(i + 1); // all vals after dividend
    for (let j = 0; j < rest.length; j++) {
      const valid = dividend % rest[j] === 0;
      if (valid) {
        quotient = dividend / rest[j];
        break;
      }
    }
  }
  return quotient;
}
const t2 = performance.now();
const result2 = rows.reduce((acc, cur) => acc + checksumQuotient(cur), 0);
const t3 = performance.now();
console.log("pt2: ", result2);
console.log(`(${t3 - t2}ms)`);
