const chalk = require("chalk");
const load = require("../util/load");

const raw = load(__dirname + "/input.txt");

/** ------------------------------------- */

const intArr = raw.split("").map((n) => parseInt(n));

async function animateMatchSum(arr, offset, delay = 20) {
  let sum = 0;

  for (let i = 0; i < arr.length; i++) {
    const a = arr[i];
    const b = arr[(i + offset) % arr.length];
    const match = a === b;

    const colored = arr
      .map((val, j) => {
        if (j === i) return chalk.bgBlue.white(val);
        if (j === (i + offset) % arr.length) return chalk.bgYellow.black(val);
        return chalk.gray(val);
      })
      .join("");

    console.clear();
    console.log(`Comparing index ${i} with ${(i + offset) % arr.length}`);
    console.log(`sum = ${sum}`);

    console.log(colored);

    if (match) sum += a;

    await new Promise((res) => setTimeout(res, delay));
  }

  console.log("\nDone. Final Sum:", chalk.green(sum));
}

// pt 1
// animateMatchSum(intArr, 1);

// pt 2
animateMatchSum(intArr, intArr.length / 2);
