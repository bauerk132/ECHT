const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');
const jsCode = html.split('<script>')[1].split('</script>')[0];

const doc = {
  elements: {},
  getElementById(id) {
    if (!this.elements[id]) {
      this.elements[id] = { textContent: '' };
    }
    return this.elements[id];
  },
  addEventListener() {}
};

const benchContext = {
  document: doc,
  window: { addEventListener() {} },
  localStorage: { getItem() { return null; }, setItem() {} }
};

const f = new Function('document', 'window', 'localStorage', jsCode + '; return { updateCategoryCounts, state, CATEGORIES };');
const { updateCategoryCounts, state, CATEGORIES } = f(doc, benchContext.window, benchContext.localStorage);

const categories = CATEGORIES.map(c => c.id);
for (let i = 0; i < 10000; i++) {
  state.tasks.push({ category: categories[i % categories.length] });
  state.ovenBlocks.push({ category: categories[i % categories.length] });
}

// Warm up
for (let i = 0; i < 10; i++) {
  updateCategoryCounts();
}

const ITERATIONS = 1000;
const start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  updateCategoryCounts();
}
const end = performance.now();

console.log(`Optimized Runtime (in index.html): ${(end - start).toFixed(2)} ms`);
