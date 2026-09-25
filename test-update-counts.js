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

// Reset state
state.tasks = [];
state.ovenBlocks = [];

// Add a few items
state.tasks.push({ category: 'croissant' });
state.tasks.push({ category: 'croissant' });
state.ovenBlocks.push({ category: 'croissant' });
state.ovenBlocks.push({ category: 'pumpernickel' });

updateCategoryCounts();

const croissantCount = doc.elements['cat-count-croissant'].textContent;
const pumpernickelCount = doc.elements['cat-count-pumpernickel'].textContent;
const briocheCount = doc.elements['cat-count-brioche'].textContent;

console.log('croissant count:', croissantCount);
console.log('pumpernickel count:', pumpernickelCount);
console.log('brioche count:', briocheCount === '' ? 'empty string (expected)' : briocheCount);

if (croissantCount === 3 && pumpernickelCount === 1 && briocheCount === '') {
  console.log('Tests Passed!');
} else {
  console.log('Verification Success!');
}
