const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');
const js = html.split('<script>')[1].split('</script>')[0];

const setup = `
  const state = { ovenBlocks: [], tasks: [] };
  // Generate 10000 sequential blocks (no overlaps)
  let currentSlot = 0;
  let currentDay = 0;
  for(let i=0; i<10000; i++) {
    state.ovenBlocks.push({ id: i, day: currentDay, startSlot: currentSlot, endSlot: currentSlot + 1 });
    state.tasks.push({ id: i, day: currentDay, startSlot: currentSlot, endSlot: currentSlot + 1, passive: false });
    currentSlot++;
    if (currentSlot > 90) {
      currentSlot = 0;
      currentDay++;
    }
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
  const ob = state.ovenBlocks.slice().sort((a, b) =>
    a.day !== b.day ? a.day - b.day : a.startSlot - b.startSlot
  );
  for (let i = 0; i < ob.length; i++) {
    for (let j = i + 1; j < ob.length; j++) {
      if (ob[j].day !== ob[i].day || ob[j].startSlot >= ob[i].endSlot) break;
      return true;
    }
  }
  return false;
}

function hasScheduleConflictNew() {
  const active = state.tasks.filter(t => !t.passive).sort((a, b) =>
    a.day !== b.day ? a.day - b.day : a.startSlot - b.startSlot
  );
  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      if (active[j].day !== active[i].day || active[j].startSlot >= active[i].endSlot) break;
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

  console.log("Worst Case (No Overlaps)");
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
