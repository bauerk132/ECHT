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
  for (let i = 0; i < sorted.length - 1; i++) {
    if (blocksOverlap(sorted[i], sorted[i + 1])) return true;
  }
  return false;
}

const cases = [
  [{day: 1, startSlot: 0, endSlot: 10}, {day: 1, startSlot: 10, endSlot: 12}, {day: 1, startSlot: 1, endSlot: 2}],
  [{day: 1, startSlot: 0, endSlot: 2}, {day: 1, startSlot: 2, endSlot: 4}, {day: 1, startSlot: 4, endSlot: 6}],
  [{day: 1, startSlot: 0, endSlot: 5}, {day: 1, startSlot: 6, endSlot: 10}, {day: 1, startSlot: 3, endSlot: 7}],
];

cases.forEach((c, i) => {
  console.log(`Case ${i}: slow=${hasOvenConflict(c)} fast=${hasOvenConflictFast(c)}`);
});
