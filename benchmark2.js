const fs = require('fs');

function blocksOverlap(a, b) {
  return a.day === b.day && a.startSlot < b.endSlot && b.startSlot < a.endSlot;
}

const activeTasks = [];
for (let i = 0; i < 5000; i++) {
  const day = Math.floor(Math.random() * 7);
  const startSlot = Math.floor(Math.random() * 90);
  const duration = Math.floor(Math.random() * 8) + 1;
  activeTasks.push({ day, startSlot, endSlot: startSlot + duration, id: i });
}

function oldMethod(activeTasks) {
  const activeConflicts = [];
  for (let i = 0; i < activeTasks.length; i++) {
    for (let j = i+1; j < activeTasks.length; j++) {
      if (blocksOverlap(activeTasks[i], activeTasks[j])) {
        activeConflicts.push({ type: 'active', a: activeTasks[i], b: activeTasks[j] });
      }
    }
  }
  return activeConflicts;
}

function newMethod(activeTasks) {
  const activeConflicts = [];
  const sorted = [...activeTasks].sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day;
    return a.startSlot - b.startSlot;
  });

  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      if (sorted[j].day !== sorted[i].day || sorted[j].startSlot >= sorted[i].endSlot) {
        break;
      }
      if (blocksOverlap(sorted[i], sorted[j])) {
        activeConflicts.push({ type: 'active', a: sorted[i], b: sorted[j] });
      }
    }
  }
  return activeConflicts;
}

console.time('old_active');
const oldRes = oldMethod(activeTasks);
console.timeEnd('old_active');

console.time('new_active');
const newRes = newMethod(activeTasks);
console.timeEnd('new_active');
