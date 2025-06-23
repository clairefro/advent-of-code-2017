const load = require("../util/load");

const raw = load(__dirname + "/input.txt");

/** ------------------------------------- */

// ---- PART 1 ---
const inputs = raw.split(",").map((n) => +n);

function wrap(arr, i) {
  return arr[i % arr.length];
}

const rope = Array.from(Array(256).keys());

function transform(list, i, size) {
  const updated = [...list];
  const seg = [];
  for (let k = 0; k < size; k++) {
    seg.push(list[(i + k) % list.length]);
  }
  seg.reverse();
  for (let j = 0; j < size; j++) {
    updated[(i + j) % updated.length] = seg[j];
  }
  return updated;
}

function knot(list, inp) {
  let final = [...list];
  let skip = 0;
  let curI = 0;
  for (let i = 0; i < inp.length; i++) {
    const size = inp[i];
    final = transform(final, curI, size);
    curI = size + skip;
    skip++;
  }
  return final;
}

const knotted = knot(rope, inputs);

console.log(knotted);
console.log("Product: ", knotted[0] * knotted[1]);

// ---- PART 2 ---

const byteStrL = raw.split("").map((c) => c.charCodeAt(0));

function knotHashSparse(list, inp) {
  let final = [...list];
  const salt = [17, 31, 73, 47, 23];
  let saltedInp = [...inp, ...salt];
  let curI = 0;
  let skip = 0;
  for (let i = 0; i < 64; i++) {
    for (let length of saltedInp) {
      final = transform(final, curI, length);
      curI = (curI + length + skip) % final.length;
      skip++;
    }
  }
  return final;
}

function knotHashDense(sparse) {
  const reduced = [];
  for (let i = 0; i < sparse.length / 16; i++) {
    const head = i * 16;
    const size = 16;
    const seg = sparse.slice(head, head + size);

    reduced.push(seg.reduce((a, b) => a ^ b, 0));
  }
  return reduced;
}

function toHex(denseHash) {
  return denseHash.map((h) => h.toString(16).padStart(2, "0")).join("");
}

const sparse = knotHashSparse(rope, byteStrL);

const dense = knotHashDense(sparse);
console.log("dense (dec)", dense);
console.log("dense (hexstr)", toHex(dense));
