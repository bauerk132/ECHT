const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');
const js = html.split('<script>')[1].split('</script>')[0];

const setup = `
  const state = { ovenBlocks: [], tasks: [] };
  // Generate 10000 random oven blocks
  for(let i=0; i<10000; i++) {
    const day = Math.floor(Math.random() * 7);
    const startSlot = Math.floor(Math.random() * 90);
    const endSlot = startSlot + Math.floor(Math.random() * 5) + 1;
    state.ovenBlocks.push({ id: i, day, startSlot, endSlot });

    state.tasks.push({ id: i, day, startSlot, endSlot, passive: Math.random() > 0.5 });
  }

  function blocksOverlap(a, b) {
    return a.day === b.day && a.startSlot < b.endSlot && b.startSlot < a.endSlot;
  }
`;

const oldFn = `
function hasOvenConflictOld() {
  const ob = state.ovenBlocks;
  for (let i = 0; i < ob.length; i++) {
    for (let j = i + 1; j < ob.length; j++) {
      if (blocksOverlap(ob[i], ob[j])) return true;
    }
  }
  return false;
}

function hasScheduleConflictOld() {
  const active = state.tasks.filter(t => !t.passive);
  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      if (blocksOverlap(active[i], active[j])) return true;
    }
  }
  return false;
}
`;

const newFn = `
function hasOvenConflictNew() {
  const ob = state.ovenBlocks.slice().sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day;
    return a.startSlot - b.startSlot;
  });
  for (let i = 0; i < ob.length; i++) {
    const current = ob[i];
    for (let j = i + 1; j < ob.length; j++) {
      const next = ob[j];
      if (next.day !== current.day || next.startSlot >= current.endSlot) break;
      return true;
    }
  }
  return false;
}

function hasScheduleConflictNew() {
  const active = state.tasks.filter(t => !t.passive).sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day;
    return a.startSlot - b.startSlot;
  });
  for (let i = 0; i < active.length; i++) {
    const current = active[i];
    for (let j = i + 1; j < active.length; j++) {
      const next = active[j];
      if (next.day !== current.day || next.startSlot >= current.endSlot) break;
      return true;
    }
  }
  return false;
}
`;

const testCode = setup + oldFn + newFn + `
  const t0 = performance.now();
  hasOvenConflictOld();
  const t1 = performance.now();

  const t2 = performance.now();
  hasOvenConflictNew();
  const t3 = performance.now();

  console.log("hasOvenConflictOld: " + (t1 - t0) + " ms");
  console.log("hasOvenConflictNew: " + (t3 - t2) + " ms");

  const t4 = performance.now();
  hasScheduleConflictOld();
  const t5 = performance.now();

  const t6 = performance.now();
  hasScheduleConflictNew();
  const t7 = performance.now();

  console.log("hasScheduleConflictOld: " + (t5 - t4) + " ms");
  console.log("hasScheduleConflictNew: " + (t7 - t6) + " ms");
`;

new Function(testCode)();
