const fs = require('fs');

function blocksOverlap(a, b) {
  return a.day === b.day && a.startSlot < b.endSlot && b.startSlot < a.endSlot;
}

// Generate large number of random tasks
const oven = [];
for (let i = 0; i < 5000; i++) {
  const day = Math.floor(Math.random() * 7);
  const startSlot = Math.floor(Math.random() * 90);
  const duration = Math.floor(Math.random() * 8) + 1;
  oven.push({ day, startSlot, endSlot: startSlot + duration, id: i });
}

function oldMethod(oven) {
  const ovenConflicts = [];
  for (let i = 0; i < oven.length; i++) {
    for (let j = i+1; j < oven.length; j++) {
      if (blocksOverlap(oven[i], oven[j])) {
        ovenConflicts.push({ type: 'oven', a: oven[i], b: oven[j] });
      }
    }
  }
  return ovenConflicts;
}

function newMethod(oven) {
  const ovenConflicts = [];
  // Sort by day then by startSlot
  const sorted = [...oven].sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day;
    return a.startSlot - b.startSlot;
  });

  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      if (sorted[j].day !== sorted[i].day || sorted[j].startSlot >= sorted[i].endSlot) {
        break; // No more overlaps possible for this element
      }
      if (blocksOverlap(sorted[i], sorted[j])) {
        ovenConflicts.push({ type: 'oven', a: sorted[i], b: sorted[j] });
      }
    }
  }
  return ovenConflicts;
}

console.time('old');
const oldRes = oldMethod(oven);
console.timeEnd('old');

console.time('new');
const newRes = newMethod(oven);
console.timeEnd('new');

console.log('Old length:', oldRes.length);
console.log('New length:', newRes.length);
