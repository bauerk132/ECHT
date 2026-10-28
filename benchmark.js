const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const setup = `
const document = {
  elements: {},
  getElementById: function(id) {
    if (!this.elements[id]) {
      this.elements[id] = { textContent: '' };
    }
    return this.elements[id];
  }
};

const CATEGORIES = [];
for (let i = 0; i < 50; i++) {
  CATEGORIES.push({ id: 'cat' + i, name: 'Category ' + i });
}

const state = {
  tasks: [],
  ovenBlocks: []
};

for (let i = 0; i < 5000; i++) {
  state.tasks.push({ category: 'cat' + (Math.floor(Math.random() * 50)) });
  state.ovenBlocks.push({ category: 'cat' + (Math.floor(Math.random() * 50)) });
}
`;

const originalFunc = `
function updateCategoryCounts() {
  CATEGORIES.forEach(c => {
    const count = state.tasks.filter(t => t.category === c.id).length
                + state.ovenBlocks.filter(b => b.category === c.id).length;
    const el = document.getElementById(\`cat-count-\${c.id}\`);
    if (el) el.textContent = count || '';
  });
}
`;

const optimizedFunc = `
// ⚡ Bolt Performance Optimization:
// Problem: O(C*N) bottleneck from calling .filter() inside a category loop.
// Solution: Pre-aggregate category counts in a single O(N) pass using a hash map
// and simple for-loops, reducing redundant array traversals.
function updateCategoryCounts() {
  const counts = {};
  for (let i = 0, len = state.tasks.length; i < len; i++) {
    const cat = state.tasks[i].category;
    counts[cat] = (counts[cat] || 0) + 1;
  }
  for (let i = 0, len = state.ovenBlocks.length; i < len; i++) {
    const cat = state.ovenBlocks[i].category;
    counts[cat] = (counts[cat] || 0) + 1;
  }
  for (let i = 0, len = CATEGORIES.length; i < len; i++) {
    const c = CATEGORIES[i];
    const count = counts[c.id] || 0;
    const el = document.getElementById(\`cat-count-\${c.id}\`);
    if (el) el.textContent = count || '';
  }
}
`;

function runBenchmark(name, funcCode) {
  const func = new Function(setup + funcCode + '\nreturn updateCategoryCounts;');
  const updateCategoryCounts = func();

  // Warmup
  for (let i = 0; i < 100; i++) {
    updateCategoryCounts();
  }

  const start = performance.now();
  for (let i = 0; i < 1000; i++) {
    updateCategoryCounts();
  }
  const end = performance.now();

  console.log(`${name}: ${(end - start).toFixed(2)}ms`);
}

runBenchmark('Original', originalFunc);
runBenchmark('Optimized', optimizedFunc);
