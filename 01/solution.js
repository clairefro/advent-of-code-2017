const load = require("../util/load");

const raw = load(__dirname + "/input.txt");

/** ------------------------------------- */

// add first digit to the end to complete the "loop"
const loop = raw + raw[0];

const loopArr = loop.split("").map((n) => parseInt(n));

// -- PART 1 ---

let sum = 0;

loopArr.forEach((_v, i) => {
  if (loopArr[i] === loopArr[i + 1]) {
    sum += loopArr[i];
  }
});

console.log("part 1");
console.log(sum);

// -- PART 2 ---

let sumHalf = 0;

// [ 0, 1, 2, 3, 4, 5 ]

// 0 => 3
// 1 => 4
// 2 => 5
// 3 => 0
// 4 => 1
// 5 => 2

const intArr = raw.split("").map((n) => parseInt(n));
intArr.forEach((_v, i) => {
  // cyclical indexing: arr[(i + offest) % arr.length]
  if (intArr[i] === intArr[(i + intArr.length / 2) % intArr.length]) {
    sumHalf += intArr[i];
  }
});
console.log("part 2");
console.log(sumHalf);

// ---- REVISED ------
// HINDISGHT IS 20-20

function matchSum(arr, offset) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === arr[(i + offset) % arr.length]) {
      sum += arr[i];
    }
  }
  return sum;
}

console.log("--------");
console.log("Refactored:");

console.log("part 1");
console.log(matchSum(intArr, 1));

console.log("part 2");
console.log(matchSum(intArr, intArr.length / 2));
