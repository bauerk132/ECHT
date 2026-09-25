const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');
const jsCode = html.split('<script>')[1].split('</script>')[0];

// Basic mock for document
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

// Evaluate the code
const f = new Function('document', 'window', 'localStorage', jsCode + '; return { updateCategoryCounts, state, CATEGORIES };');
const { updateCategoryCounts, state, CATEGORIES } = f(doc, benchContext.window, benchContext.localStorage);

// Populate state with a lot of tasks
const categories = CATEGORIES.map(c => c.id);
for (let i = 0; i < 10000; i++) {
  state.tasks.push({ category: categories[i % categories.length] });
  state.ovenBlocks.push({ category: categories[i % categories.length] });
}

const start = performance.now();
for (let i = 0; i < 1000; i++) {
  updateCategoryCounts();
}
const end = performance.now();

console.log(`Baseline: ${end - start} ms`);
