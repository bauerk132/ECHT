function test() {
  function originalHasConflict(blocks) {
    function blocksOverlap(a, b) {
      return a.day === b.day && a.startSlot < b.endSlot && b.startSlot < a.endSlot;
    }
    for (let i = 0; i < blocks.length; i++) {
      for (let j = i + 1; j < blocks.length; j++) {
        if (blocksOverlap(blocks[i], blocks[j])) return true;
      }
    }
    return false;
  }

  function sweepLineHasConflict(blocks) {
    blocks.sort((a, b) => a.day !== b.day ? a.day - b.day : a.startSlot - b.startSlot);
    let maxEnd = -1;
    let currentDay = -1;
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].day !== currentDay) {
            currentDay = blocks[i].day;
            maxEnd = blocks[i].endSlot;
        } else {
            if (blocks[i].startSlot < maxEnd) return true;
            maxEnd = Math.max(maxEnd, blocks[i].endSlot);
        }
    }
    return false;
  }

  // Generate random blocks with NO overlap
  const blocks = [];
  for (let i = 0; i < 5000; i++) {
    const day = Math.floor(i / 1000);
    const start = (i % 1000) * 10;
    blocks.push({ id: i, day, startSlot: start, endSlot: start + 5 });
  }

  // shuffle randomly
  for (let i = blocks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
  }

  const b1 = [...blocks];
  const b2 = [...blocks];

  console.time('original_no_overlap');
  const r1 = originalHasConflict(b1);
  console.timeEnd('original_no_overlap');

  console.time('sweepLine_no_overlap');
  const r2 = sweepLineHasConflict(b2);
  console.timeEnd('sweepLine_no_overlap');

  console.log('Match:', r1 === r2);
}

for(let i =0; i<5; i++) test();
