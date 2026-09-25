const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');
const js = html.split('<script>')[1].split('</script>')[0];

const setup = `
  const state = { ovenBlocks: [] };
  // Generate 10000 random oven blocks
  for(let i=0; i<10000; i++) {
    const day = Math.floor(Math.random() * 7);
    const startSlot = Math.floor(Math.random() * 90);
    const endSlot = startSlot + Math.floor(Math.random() * 5) + 1;
    state.ovenBlocks.push({ id: i, day, startSlot, endSlot });
  }

  function blocksOverlap(a, b) {
    return a.day === b.day && a.startSlot < b.endSlot && b.startSlot < a.endSlot;
  }
`;

const oldFn = `
function getOvenConflictIdsOld() {
  const conflicts = new Set();
  const ob = state.ovenBlocks;
  for (let i = 0; i < ob.length; i++) {
    for (let j = i + 1; j < ob.length; j++) {
      if (blocksOverlap(ob[i], ob[j])) {
        conflicts.add(ob[i].id);
        conflicts.add(ob[j].id);
      }
    }
  }
  return conflicts;
}
`;

const newFn = `
function getOvenConflictIdsNew() {
  const conflicts = new Set();
  // copy and sort
  const ob = state.ovenBlocks.slice().sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day;
    return a.startSlot - b.startSlot;
  });

  for (let i = 0; i < ob.length; i++) {
    const current = ob[i];
    // check subsequent blocks
    for (let j = i + 1; j < ob.length; j++) {
      const next = ob[j];
      if (next.day !== current.day || next.startSlot >= current.endSlot) {
        break; // no more overlaps possible for 'current'
      }
      // If we are here, it means next.startSlot < current.endSlot
      // Since it's sorted, next.startSlot >= current.startSlot is true.
      // We just need to ensure current.startSlot < next.endSlot (which is true since next.endSlot > next.startSlot >= current.startSlot)
      conflicts.add(current.id);
      conflicts.add(next.id);
    }
  }
  return conflicts;
}
`;

const testCode = setup + oldFn + newFn + `
  const t0 = performance.now();
  getOvenConflictIdsOld();
  const t1 = performance.now();

  const t2 = performance.now();
  getOvenConflictIdsNew();
  const t3 = performance.now();

  console.log("Old algorithm: " + (t1 - t0) + " ms");
  console.log("New algorithm: " + (t3 - t2) + " ms");
`;

new Function(testCode)();
