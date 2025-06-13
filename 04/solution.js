const load = require("../util/load");

const raw = load(__dirname + "/input.txt");

/** ------------------------------------- */

const phrases = raw.split("\n");

function isValid(phrase) {
  const words = phrase.split(" ");
  let valid = true;
  for (let i = 0; i < words.length - 1; i++) {
    const w = words[i];
    const rest = words.slice(i + 1);
    if (rest.some((r) => r.match(new RegExp(w, "i")))) {
      valid = false;
      break;
    }
  }

  return valid;
}

console.log("PT1");
const valids = phrases.map(isValid).filter(Boolean).length;
console.log(valids);

//---

function isValid2(phrase) {
  const words = phrase.split(" ");
  let valid = true;
  for (let i = 0; i < words.length - 1; i++) {
    const w = words[i];
    const rest = words.slice(i + 1);
    for (let j = 0; j < rest.length; j++) {
      if (w.split("").sort().join("") === rest[j].split("").sort().join("")) {
        valid = false;
        break;
      }
    }
  }

  return valid;
}

function isValid3(phrase) {
  let valid = true;
  const sorted = {};
  const words = phrase.split(" ");
  for (let i = 0; i < words.length; i++) {
    const s = words[i].split(" ").sort().join("");
    sorted[s] = 1;
    if (s in sorted) {
      valid = false;
      break;
    }
  }
  return valid;
}

console.log("PT2");
const valids2 = phrases.map(isValid2).filter(Boolean).length;
console.log(valids2);

const valids3 = phrases.map(isValid2).filter(Boolean).length;
console.log(valids3);
