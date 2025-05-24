const load = require("../util/load");

const raw = load(__dirname + "/input.txt");

/** ------------------------------------- */

const intArr = raw.split("").map((n) => parseInt(n));

function matchSum(arr, offset) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === arr[(i + offset) % arr.length]) {
      sum += arr[i];
    }
  }
  return sum;
}

console.log("part 1");

const t0 = performance.now();
console.log(matchSum(intArr, 1));
const t1 = performance.now();
console.log(`(${t1 - t0}ms)`);

console.log("part 2");

const t2 = performance.now();
console.log(matchSum(intArr, intArr.length / 2));
const t3 = performance.now();
console.log(`(${t3 - t2}ms)`);
