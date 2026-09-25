function blocksOverlap(a, b) {
  return a.day === b.day && a.startSlot < b.endSlot && b.startSlot < a.endSlot;
}

function hasOvenConflict(ob) {
  for (let i = 0; i < ob.length; i++) {
    for (let j = i + 1; j < ob.length; j++) {
      if (blocksOverlap(ob[i], ob[j])) return true;
    }
  }
  return false;
}

function hasOvenConflictFast(ob) {
  if (ob.length < 2) return false;
  const sorted = ob.slice().sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day;
    return a.startSlot - b.startSlot;
  });
  let maxEndSlot = sorted[0].endSlot;
  for (let i = 1; i < sorted.length; i++) {
    const a = sorted[i - 1];
    const b = sorted[i];
    if (a.day === b.day && b.startSlot < maxEndSlot) {
      return true; // We know b overlaps with some previous interval
    }
    if (a.day !== b.day) {
      maxEndSlot = b.endSlot;
    } else {
      maxEndSlot = Math.max(maxEndSlot, b.endSlot);
    }
  }
  return false;
}


// Generate large array of non-overlapping blocks, with a conflict at the very end
const blocks = [];
for (let i = 0; i < 5000; i++) {
  blocks.push({day: 1, startSlot: i * 2, endSlot: i * 2 + 1});
}
blocks.push({day: 1, startSlot: 9999, endSlot: 10005}); // overlaps with last block

const t0 = performance.now();
for(let i=0; i<10; i++) hasOvenConflict(blocks);
const t1 = performance.now();

const t2 = performance.now();
for(let i=0; i<10; i++) hasOvenConflictFast(blocks);
const t3 = performance.now();

console.log(`Original: ${t1 - t0}ms`);
console.log(`Fast: ${t3 - t2}ms`);

const cases = [
  [{day: 1, startSlot: 0, endSlot: 10}, {day: 1, startSlot: 10, endSlot: 12}, {day: 1, startSlot: 1, endSlot: 2}], // overlap
  [{day: 1, startSlot: 0, endSlot: 2}, {day: 1, startSlot: 2, endSlot: 4}, {day: 1, startSlot: 4, endSlot: 6}], // no overlap
  [{day: 1, startSlot: 0, endSlot: 5}, {day: 1, startSlot: 6, endSlot: 10}, {day: 1, startSlot: 3, endSlot: 7}], // overlap
  [{day: 1, startSlot: 0, endSlot: 10}, {day: 1, startSlot: 11, endSlot: 12}, {day: 1, startSlot: 5, endSlot: 6}], // overlap (contained)
  [{day: 1, startSlot: 0, endSlot: 10}, {day: 2, startSlot: 0, endSlot: 10}], // no overlap (different days)
];

cases.forEach((c, i) => {
  console.log(`Case ${i}: slow=${hasOvenConflict(c)} fast=${hasOvenConflictFast(c)}`);
});
