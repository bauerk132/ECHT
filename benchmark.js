const { performance } = require('perf_hooks');

const DATA = { tasks: [], ovenBlocks: [] };
const A = { taskDays: new Set([0, 1, 2, 3, 4, 5, 6]) };

// Generate realistic data
for (let i = 0; i < 5000; i++) {
  DATA.tasks.push({ day: i % 7 });
}
for (let i = 0; i < 500; i++) {
  DATA.ovenBlocks.push({ day: i % 7 });
}

function runOriginal() {
  const start = performance.now();
  for (let i = 0; i < 1000; i++) {
    const busyDaysWithoutOven = [...A.taskDays].filter(d => {
      const dayOven = DATA.ovenBlocks.filter(b => b.day === d);
      const dayTasks = DATA.tasks.filter(t => t.day === d);
      return dayOven.length === 0 && dayTasks.length >= 3;
    });
  }
  return performance.now() - start;
}

function runOptimized() {
  const start = performance.now();
  for (let i = 0; i < 1000; i++) {
    const dayOvenCounts = {};
    DATA.ovenBlocks.forEach(b => dayOvenCounts[b.day] = (dayOvenCounts[b.day] || 0) + 1);
    const dayTaskCounts = {};
    DATA.tasks.forEach(t => dayTaskCounts[t.day] = (dayTaskCounts[t.day] || 0) + 1);

    const busyDaysWithoutOven = [...A.taskDays].filter(d => {
      return !dayOvenCounts[d] && (dayTaskCounts[d] || 0) >= 3;
    });
  }
  return performance.now() - start;
}

const originalTime = runOriginal();
const optimizedTime = runOptimized();

console.log(`Original: ${originalTime.toFixed(2)} ms`);
console.log(`Optimized: ${optimizedTime.toFixed(2)} ms`);
console.log(`Improvement: ${((originalTime - optimizedTime) / originalTime * 100).toFixed(2)}%`);
