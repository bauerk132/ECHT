const fs = require('fs');

function simulate() {
  // Same logic as our optimization
  function originalHasScheduleConflict(tasks) {
    function blocksOverlap(a, b) {
      return a.day === b.day && a.startSlot < b.endSlot && b.startSlot < a.endSlot;
    }
    const active = tasks.filter(t => !t.passive);
    for (let i = 0; i < active.length; i++) {
      for (let j = i + 1; j < active.length; j++) {
        if (blocksOverlap(active[i], active[j])) return true;
      }
    }
    return false;
  }

  function optimizedHasScheduleConflict(tasks) {
    const active = tasks.filter(t => !t.passive);
    if (active.length < 2) return false;
    // We sort the active array directly since it's already a copy from filter()
    active.sort((a, b) => a.day !== b.day ? a.day - b.day : a.startSlot - b.startSlot);
    let maxEnd = -1;
    let currentDay = -1;
    for (let i = 0; i < active.length; i++) {
      const b = active[i];
      if (b.day !== currentDay) {
        currentDay = b.day;
        maxEnd = b.endSlot;
      } else {
        if (b.startSlot < maxEnd) return true;
        maxEnd = Math.max(maxEnd, b.endSlot);
      }
    }
    return false;
  }

  function originalGetOvenConflictIds(ovenBlocks) {
    function blocksOverlap(a, b) {
      return a.day === b.day && a.startSlot < b.endSlot && b.startSlot < a.endSlot;
    }
    const conflicts = new Set();
    const ob = ovenBlocks;
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

  function optimizedGetOvenConflictIds(ovenBlocks) {
    const conflicts = new Set();
    if (ovenBlocks.length < 2) return conflicts;
    const ob = [...ovenBlocks].sort((a, b) => a.day !== b.day ? a.day - b.day : a.startSlot - b.startSlot);

    let active = [];
    let currentDay = -1;

    for (let i = 0; i < ob.length; i++) {
      const b = ob[i];
      if (b.day !== currentDay) {
        currentDay = b.day;
        active = [b];
      } else {
        active = active.filter(a => a.endSlot > b.startSlot);
        for (const a of active) {
          conflicts.add(a.id);
          conflicts.add(b.id);
        }
        active.push(b);
      }
    }
    return conflicts;
  }

  const tasks = [];
  const ovenBlocks = [];

  // Create 5000 tasks, all on the same day, no overlap
  for (let i = 0; i < 5000; i++) {
    tasks.push({ id: i, passive: false, day: 0, startSlot: i * 10, endSlot: i * 10 + 5 });
    ovenBlocks.push({ id: i, day: 0, startSlot: i * 10, endSlot: i * 10 + 5 });
  }

  // randomly shuffle them
  for (let i = tasks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tasks[i], tasks[j]] = [tasks[j], tasks[i]];
      [ovenBlocks[i], ovenBlocks[j]] = [ovenBlocks[j], ovenBlocks[i]];
  }

  // Warmup
  originalHasScheduleConflict([...tasks]);
  optimizedHasScheduleConflict([...tasks]);

  const t0 = process.hrtime.bigint();
  originalHasScheduleConflict(tasks);
  const t1 = process.hrtime.bigint();

  const t2 = process.hrtime.bigint();
  optimizedHasScheduleConflict(tasks);
  const t3 = process.hrtime.bigint();

  console.log(`hasScheduleConflict - Original: ${Number(t1 - t0) / 1e6} ms`);
  console.log(`hasScheduleConflict - Optimized: ${Number(t3 - t2) / 1e6} ms`);

  const t4 = process.hrtime.bigint();
  originalGetOvenConflictIds(ovenBlocks);
  const t5 = process.hrtime.bigint();

  const t6 = process.hrtime.bigint();
  optimizedGetOvenConflictIds(ovenBlocks);
  const t7 = process.hrtime.bigint();

  console.log(`getOvenConflictIds - Original: ${Number(t5 - t4) / 1e6} ms`);
  console.log(`getOvenConflictIds - Optimized: ${Number(t7 - t6) / 1e6} ms`);
}

for (let i = 0; i < 5; i++) {
  console.log(`\nRun ${i+1}`);
  simulate();
}
