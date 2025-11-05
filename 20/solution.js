const load = require("../util/load");

const raw = load(__dirname + "/input.txt");

/** ------------------------------------- */

const lines = raw.split("\n");

const particles = lines.map((l, i) => {
  const match = l.match(/-?\d+/g);
  const [px, py, pz, vx, vy, vz, ax, ay, az] = match.map(Number);

  return {
    i,
    startP: { x: px, y: py, z: pz },
    p: { x: px, y: py, z: pz },
    v: { x: vx, y: vy, z: vz },
    a: { x: ax, y: ay, z: az },
  };
});

const sorted = particles.sort((q, w) => {
  const absum = (o) => [o.x, o.y, o.z].map(Math.abs).reduce((a, b) => a + b);

  // prioritize acceleration
  const qa = absum(q.a);
  const wa = absum(w.a);
  if (qa !== wa) return qa - wa;

  // tie-break => velocity
  const qv = absum(q.v);
  const wv = absum(w.v);
  if (qv !== wv) return qv - wv;

  // final tie-break => position
  const qp = absum(q.p);
  const wp = absum(w.p);
  return qp - wp;
});

console.log("PART 1");
console.log(sorted.slice(0, 10));
console.log(sorted[0].i);

/** ------------------------------ **/
console.log("PART 2");

function updateParticle(particle) {
  const v = {
    x: particle.v.x + particle.a.x,
    y: particle.v.y + particle.a.y,
    z: particle.v.z + particle.a.z,
  };
  const p = {
    x: particle.p.x + v.x,
    y: particle.p.y + v.y,
    z: particle.p.z + v.z,
  };
  return { ...particle, p, v };
}

function run(ticks) {
  let remaining = [...particles];

  for (let i = 0; i < ticks; i++) {
    let colMap = {};

    const temp = remaining.map((r) => {
      const updated = updateParticle(r);
      const key = JSON.stringify(updated.p);
      colMap[key] = colMap[key] ? [...colMap[key], updated.i] : [updated.i];
      return { ...updated };
    });

    remaining = temp.filter((t) => {
      const key = JSON.stringify(t.p);
      return colMap[key].length === 1; // only keep particles with no collisions
    });

    const diff = temp.length - remaining.length;
    if (diff > 0) {
      console.log(`tick ${i} collisions: ${diff}`);
    }
  }

  console.log("-------");
  console.log("start: ", particles.length);
  console.log(`ticks: ${ticks}`);
  console.log("end: ", remaining.length);
  console.log("particles lost: ", particles.length - remaining.length);
}

run(1000);
