const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');
const js = html.split('<script>')[1].split('</script>')[0];

const setup = `
  const state = { ovenBlocks: [], tasks: [] };
  let currentSlot = 0;
  let currentDay = 0;
  // Generate 10,000 items that do not overlap (worst case for old algorithm, since it doesn't return early)
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
function getOvenConflictIdsNew() {
  const conflicts = new Set();
  const ob = state.ovenBlocks.slice().sort((a, b) =>
    a.day !== b.day ? a.day - b.day : a.startSlot - b.startSlot
  );
  for (let i = 0; i < ob.length; i++) {
    for (let j = i + 1; j < ob.length; j++) {
      if (ob[j].day !== ob[i].day || ob[j].startSlot >= ob[i].endSlot) break;
      conflicts.add(ob[i].id);
      conflicts.add(ob[j].id);
    }
  }
  return conflicts;
}

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
  console.log("No overlap case (Worst-case for O(N^2) no-early-return):");
  const t0 = performance.now(); getOvenConflictIdsOld(); const t1 = performance.now();
  const t2 = performance.now(); getOvenConflictIdsNew(); const t3 = performance.now();
  console.log("getOvenConflictIds: Old", t1-t0, "ms, New", t3-t2, "ms");

  const t4 = performance.now(); hasOvenConflictOld(); const t5 = performance.now();
  const t6 = performance.now(); hasOvenConflictNew(); const t7 = performance.now();
  console.log("hasOvenConflict: Old", t5-t4, "ms, New", t7-t6, "ms");

  const t8 = performance.now(); hasScheduleConflictOld(); const t9 = performance.now();
  const t10 = performance.now(); hasScheduleConflictNew(); const t11 = performance.now();
  console.log("hasScheduleConflict: Old", t9-t8, "ms, New", t11-t10, "ms");
`;

new Function(testCode)();
