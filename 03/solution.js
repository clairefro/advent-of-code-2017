const load = require("../util/load");

const raw = load(__dirname + "/input.txt");

/** ------------------------------------- */

// Ulam spirals: https://en.wikipedia.org/wiki/Ulam_spiral
/**
 *                  19
 *                  11
 *                   3
 * 
 *  65  64  63  62  61  60  59  58  57      
        37  36  35  34  33  32  31  56
        38  17  16  15  14  13  30  55
        39  18   5   4   3  12  29  54          
        40  19   6  [1]  2  11  28  53          1  9  17
        41  20   7   8   9  10  27  52
        42  21  22  23  24  25  26  51
*       43  44  45  46  47  48  49  50 
*
*                    7
*                   15
* 
 */

/**
 * l = layer #
 * m = max val in layer
 * w = side width of layer
 * r = leg from center to layer
 * wall = 0-3, with wall 0 being bottom and going clockwise
 * offset = offset from max val in that layer
 * x = x coord, with center of spiral @0,0
 * y = y coord, with center of spiral @0,0
 * c = ceiling corner val
 * f = floor corner val
 * mid = mid point val on wall
 * t = taxicab dist to center
 */
function getInfo(n) {
  let x = 0;
  let y = 0;
  let l = 0;
  let m = 1; // smallest max
  if (n === 1) {
    return {
      n: 1,
      l: 0,
      m: 1,
      r: 1,
      w: 1,
      offset: 0,
      wall: 0,
      x,
      y,
      c: 1,
      f: 1,
      mid: 1,
      t: 0,
    };
  }

  if (n > 0) {
    while (true) {
      m = (2 * l + 1) ** 2;
      if (n <= m) break;
      l++;
    }
  } else {
    console.log("invalid n val. must be positive");
  }
  const w = n === 1 ? 1 : 2 * l + 1;
  const r = l + 1;
  const offset = m - n;
  const wall = Math.floor(offset / (w - 1));

  const c = wall === 3 ? m : m - (w - 1) * wall;
  const f = m - (w - 1) * (wall + 1);
  const mid = c - (c - f) / 2;

  switch (wall) {
    case 0: // bottom wall
      x = n - mid;
      y = (r - 1) * -1;
      break;
    case 1: // left wall
      x = (r - 1) * -1;
      y = n - mid;
      break;
    case 2: // top wall
      x = n - mid;
      y = r - 1;
      break;
    case 3: // right wall
      x = r - 1;
      y = n - mid;
      break;
  }

  const t = Math.abs(x) + Math.abs(y);
  return { n, l, m, r, w, offset, wall, x, y, c, f, mid, t };
}

// console.log(getInfo(1));
// console.log(getInfo(2));
// console.log(getInfo(5));
// console.log(getInfo(6));
// console.log(getInfo(8));
// console.log(getInfo(9));
// console.log(getInfo(25));
// console.log(getInfo(47));

console.log("PART 1");
const info = getInfo(parseInt(raw));
console.log(info.t);

console.log("PART 2");
// m = 312481
