function oldMethod(oven) {
  const ovenConflicts = [];
  for (let i = 0; i < oven.length; i++) {
    for (let j = i+1; j < oven.length; j++) {
      if (oven[i].day === oven[j].day && oven[i].startSlot < oven[j].endSlot && oven[j].startSlot < oven[i].endSlot) {
        ovenConflicts.push({ type: 'oven', a: oven[i], b: oven[j] });
      }
    }
  }
  return ovenConflicts;
}

function newMethod(oven) {
  const ovenConflicts = [];
  const sorted = [...oven].sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day;
    return a.startSlot - b.startSlot;
  });

  for (let i = 0; i < sorted.length; i++) {
    const a = sorted[i];
    for (let j = i + 1; j < sorted.length; j++) {
      const b = sorted[j];
      if (b.day !== a.day || b.startSlot >= a.endSlot) {
        break;
      }
      if (a.startSlot < b.endSlot && b.startSlot < a.endSlot) {
        ovenConflicts.push({ type: 'oven', a, b });
      }
    }
  }
  return ovenConflicts;
}

const oven = [];
for (let i = 0; i < 5000; i++) {
  const day = Math.floor(Math.random() * 7);
  const startSlot = Math.floor(Math.random() * 90);
  const duration = Math.floor(Math.random() * 8) + 1;
  oven.push({ day, startSlot, endSlot: startSlot + duration, id: i });
}

console.time('old');
oldMethod(oven);
console.timeEnd('old');

console.time('new');
newMethod(oven);
console.timeEnd('new');
