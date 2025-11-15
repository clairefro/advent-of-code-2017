const load = require("../util/load");

const raw = load(__dirname + "/input.txt");

/** ------------------------------------- */

const START_PATTERN = `.#./..#/###`;

// create pattern maps
const lines = raw.split("\n");

const m = {};

lines.forEach((l) => {
  const [pattern, output] = l.split(/\s=>\s/);
  m[pattern] = output;
});

function printPattern(input) {
  return input.split("/").join("\n");
}

const patterns = { 2: {}, 3: {} };

Object.entries(m).forEach(([k, v]) => {
  const size = k.split("/")[0].length;
  patterns[`${size}`][k] = v;
});

function getSize(inp) {
  return inp.split("/")[0].length;
}

function patternSearch(input) {
  const size = getSize(input);
  const entry = patterns[size];

  return (
    entry[input] ||
    entry[rotateN(input, 90)] ||
    entry[rotateN(input, 180)] ||
    entry[rotateN(input, 270)] ||
    entry[flipX(input)] ||
    entry[flipY(input)] ||
    entry[rotateN(flipX(input), 90)] ||
    entry[rotateN(flipX(input), 180)] ||
    entry[rotateN(flipX(input), 270)] ||
    null
  );
}

/** "#.#" => 0b101 */
function strToBits(str) {
  const binaryStr = str
    .replace(/[^#\.]/g, "")
    .replace(/#/g, "1")
    .replace(/\./g, "0");
  return parseInt(binaryStr, 2);
}

/** 0b001 => "..#" */
function bitsToStr(bits, size) {
  return bits
    .toString(2)
    .padStart(size, "0")
    .replace(/1/g, "#")
    .replace(/0/g, ".");
}

// --- MUTATORS -----

// arr = [0,0]

// rotate an input by n degrees (positive or negative)
// rotateN(["..#/.../..."], 90) => returns [".../.../#.."]
function rotateN(input, degrees) {
  const size = getSize(input);
  const gridArr = input.split("/");

  // convert grid rows into bits
  const binaryGridArr = gridArr.map(strToBits);

  // convert any angle (positive or negative) into an int between 0 and 3
  const rotations = (((degrees / 90) % 4) + 4) % 4;

  let rotated = [...binaryGridArr];

  // loop through and rotate grid rows clockwise with bitwise ops
  for (let r = 0; r < rotations; r++) {
    // each number in this array will represent a FULL ROW in the final grid
    // ex: size = 3: [0,0,0] (=3 rows, represented by 3-bit numbers)
    // ex: size = 2: [0,0] (=2 rows, represented by 2-bit numbers)
    const next = Array(size).fill(0);
    for (let row = 0; row < size; row++) {
      const curRow = rotated[row]; //ex: 101
      for (let col = 0; col < size; col++) {
        // EXCTRACT rightmost bit at col index (represents # or . at col)
        const bit = (curRow >> col) & 1;
        // MOVE extracted bit to new rotated position
        // (top side becomes right side)
        // next starts as [0, 0, 0]
        // use bitwise OR, filling right-to-left
        const newCol = size - 1 - col;
        // |= preserves existing bits while adding new ones
        next[newCol] |= bit << row; //
        // ex: if bit = 1 and row = 2
        // 0b001 << 2 = 0b100 = 4
        //
        // 0b000 |= 0b100 => 0b100  // first bit added
        // 0b100 |= 0b010 => 0b110  // second bit added
        // 0b110 |= 0b001 => 0b111  // third bit added
      }
    }
    rotated = next;
  }
  const newGrid = rotated.map((s) => bitsToStr(s, size));
  const newStr = newGrid.join("/");
  return newStr;
}

function flipY(input) {
  const size = getSize(input);
  const gridArr = input.split("/");

  const newGrid = [];
  for (let i = 0; i < size; i++) {
    newGrid.push(gridArr[size - 1 - i]);
  }
  return newGrid.join("/");
}

function flipX(input) {
  const size = getSize(input);
  const gridArr = input.split("/");

  const newGrid = [];
  for (let i = 0; i < size; i++) {
    const reversed = gridArr[i].split("").reverse().join("");
    newGrid.push(reversed);
  }
  return newGrid.join("/");
}

// chunks quilt into blocks of given size
// returns array of blocks, each block is an array of rows
// e.g., [['##.', '#..', '...'], ['##.', '#..', '...'], ...]
function chunkQuilt(quilt, blockSize) {
  const rows = quilt.split("\n");
  const gridSize = rows.length;
  const blocksPerRow = gridSize / blockSize;
  const blocks = [];

  // iterate through the grid by blockSize steps
  for (let blockRow = 0; blockRow < blocksPerRow; blockRow++) {
    for (let blockCol = 0; blockCol < blocksPerRow; blockCol++) {
      const block = [];

      // extract each row of the current block
      for (let r = 0; r < blockSize; r++) {
        const rowIndex = blockRow * blockSize + r;
        const startCol = blockCol * blockSize;
        const endCol = startCol + blockSize;
        block.push(rows[rowIndex].slice(startCol, endCol));
      }

      blocks.push(block);
    }
  }

  return blocks;
}

// console.log("CHUNKS");
// const quilt = `##.##.
// #..#..
// ......
// ##.##.
// #..#..
// ......`;
// console.log(printPattern(quilt));
// [
//   '##.', '##.', '#..',
//   '#..', '...', '...',
//   '##.', '##.', '#..',
//   '#..', '...', '...'
// ]

// enter block 1
// skip blockSize - 1, blockSize times
// push block

// block size: 3
// row length: 6
// blocks per row: 2 (row length/block size)
// chunks: 12
// blocks : 4 = (bpr ** 2)

// ##. ##.      0   1     b0 = 0,2,4    b1 = 1,3,5  b2= 6,8,10  b3=7,9,11
// #.. #..      2   3
// ... ...      4   5
//
// ##. ##.      6   7
// #.. #..      8   9
// ... ...      10  11

// block size: 2
// row length: 8
// blocks per row: 4
// chunks: 32 (chunks = bpr * row length)

// ##   .#   ##  .#     0   1   2   3
// #.   .#   ..  ##     4   5   6   7
//
// ..   .#   ..  #.     8   9   10  11
// ##   ##   #.  ..     12  13  14  15
//
// #.   ##  ..   #.     16  17  18  19
// ..   #.  ..  .#      20  21  22  23
//
// #.   ##  ..   #.     24  25  26  27
// ..   #.  ..  .#      28  29  30  31

// b0 = 0,4 b1= 1,5 b2=2,6  b3=3,7  b4 = 8,12   b5 = 9,13 ....

// console.log(chunkQuilt(quilt, 3));

// Stitch blocks back together into a quilt
// blocks ex: [['##.', '#..', '...'], ['##.', '#..', '...'], ...]
function stitchBlocks(blocks) {
  if (blocks.length === 0) return "";

  const blockSize = blocks[0].length;
  const blocksPerRow = Math.sqrt(blocks.length);
  const rows = [];

  for (let blockRow = 0; blockRow < blocksPerRow; blockRow++) {
    for (let rowInBlock = 0; rowInBlock < blockSize; rowInBlock++) {
      let fullRow = "";

      // concatenate this row from all blocks in this block-row
      for (let blockCol = 0; blockCol < blocksPerRow; blockCol++) {
        const blockIndex = blockRow * blocksPerRow + blockCol;
        fullRow += blocks[blockIndex][rowInBlock];
      }

      rows.push(fullRow);
    }
  }

  return rows.join("\n");
}

function updateQuilt(quilt) {
  const size = quilt.split("\n").length;
  // chunk the quilt into blocks
  const blocksRaw = chunkQuilt(quilt, size % 2 === 0 ? 2 : 3);
  // convert blocks to pattern format (join rows with '/')
  const blocks = blocksRaw.map((b) => b.join("/"));
  // transform each block using pattern matching
  const newBlocks = blocks.map(patternSearch);
  // cnvert back to array of row strings
  const newChunks = newBlocks.map((b) => b.split("/"));
  // stitch the transformed blocks back together
  const newQuilt = stitchBlocks(newChunks);

  return newQuilt;
}

// console.log(updateQuilt(updateQuilt(quilt)));

// -------- RUN -------------

// animate quilt growth
function run(iter) {
  console.clear();

  let iterations = 0;
  const max = iter;
  let quilt;
  const interval = setInterval(() => {
    if (iterations === 0) {
      quilt = printPattern(START_PATTERN, iterations);
    } else {
      quilt = updateQuilt(quilt);
    }
    const size = quilt.split("\n").length;

    const ons = quilt.match(/#/g).length;
    const offs = size ** 2 - ons;

    if (iterations > 0) {
      process.stdout.write("\x1B[H"); // mv cursor to home (top-left)
      process.stdout.write("\x1B[0J"); // clear from cursor down
    }

    // draw quilt + status
    console.log(quilt);
    console.log();
    console.log(
      `iterations: ${iterations}  size: ${size}  ON: ${ons}  OFF: ${offs}`
    );

    if (iterations >= max) {
      clearInterval(interval);
      console.log("\nDone!");
    }

    iterations++;
  }, 0);
}

run(18);
