const fs = require('fs');

function runBenchmark() {
  // Mock data
  const tasks = Array.from({ length: 10000 }, (_, i) => ({
    startSlot: i % 100,
    endSlot: (i % 100) + 10,
    passive: i % 2 === 0
  }));

  const start = performance.now();
  for (let i = 0; i < 100; i++) {
    const totalTaskMin = tasks.reduce((s, t) => s + (t.endSlot - t.startSlot) * 15, 0);
    const activeMin = tasks.filter(t => !t.passive).reduce((s, t) => s + (t.endSlot - t.startSlot) * 15, 0);
    const passiveMin = tasks.filter(t => t.passive).reduce((s, t) => s + (t.endSlot - t.startSlot) * 15, 0);
  }
  const end = performance.now();
  console.log(`Original: ${end - start} ms`);

  const start2 = performance.now();
  for (let i = 0; i < 100; i++) {
    let totalTaskMin = 0;
    let activeMin = 0;
    let passiveMin = 0;
    for (let j = 0, len = tasks.length; j < len; j++) {
      const t = tasks[j];
      const dur = (t.endSlot - t.startSlot) * 15;
      totalTaskMin += dur;
      if (t.passive) {
        passiveMin += dur;
      } else {
        activeMin += dur;
      }
    }
  }
  const end2 = performance.now();
  console.log(`Optimized: ${end2 - start2} ms`);
}
runBenchmark();
