const CATEGORIES = Array.from({length: 10}, (_, i) => ({ id: `cat_${i}` }));
const state = {
  tasks: Array.from({length: 1000}, (_, i) => ({ category: `cat_${i % 10}` })),
  ovenBlocks: Array.from({length: 500}, (_, i) => ({ category: `cat_${i % 10}` }))
};

// Mock DOM
global.document = {
  getElementById: () => ({ textContent: '' })
};

function originalUpdateCategoryCounts() {
  CATEGORIES.forEach(c => {
    const count = state.tasks.filter(t => t.category === c.id).length
                + state.ovenBlocks.filter(b => b.category === c.id).length;
    const el = document.getElementById(`cat-count-${c.id}`);
    if (el) el.textContent = count || '';
  });
}

function optimizedUpdateCategoryCounts() {
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
    const el = document.getElementById(`cat-count-${c.id}`);
    if (el) {
      const count = counts[c.id] || 0;
      el.textContent = count || '';
    }
  }
}

console.time("original");
for (let i = 0; i < 1000; i++) originalUpdateCategoryCounts();
console.timeEnd("original");

console.time("optimized");
for (let i = 0; i < 1000; i++) optimizedUpdateCategoryCounts();
console.timeEnd("optimized");
