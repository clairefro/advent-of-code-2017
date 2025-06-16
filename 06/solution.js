const load = require("../util/load");

const raw = load(__dirname + "/input.txt");

/** ------------------------------------- */

// each cycle, find bank with most blocks (tie = lowest numbered bank) and redistributes those among the banks
//    - removes all blocks from selected bank, then moves to next index and inserts 1
//    - continues until out of blocks
//    - if reach last bank, wrap to first

// how many redistributions done before  a block sin banks config is produced that has been seen before?

// ----- PT 1 -------

const banks = raw.split(/\s+/).map((b) => +b);

function trampoline(fn) {
  while (typeof fn === "function") {
    fn = fn();
  }
  return fn;
}

function reallocate(_banks, _redists = {}, step = 0) {
  const redist = _banks.join(".");
  if (redist && _redists[redist] !== undefined) return { step, banks: _banks };
  _redists[redist] = step;
  const nextBanks = redistribute(_banks);
  return () => reallocate(nextBanks, _redists, step + 1);
}

function redistribute(_banks) {
  const bs = [..._banks];
  const maxV = Math.max(...bs);
  const bigI = bs.findIndex((x) => x === maxV);
  bs[bigI] = 0; // reset big bank
  let i = bigI;
  for (let a = 0; a < maxV; a++) {
    i = (i + 1) % bs.length;
    bs[i] = bs[i] + 1;
  }
  return bs;
}

console.log("PT1");
const info = trampoline(() => reallocate(banks));
console.log(info);

// ----- PT 2 -------

const infoLoop = trampoline(() => reallocate(info.banks));
console.log("PT2");
console.log(infoLoop);
