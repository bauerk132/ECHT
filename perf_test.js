const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// A very basic mock DOM to let us test performance
class MockElement {
  constructor(tag) {
    this.tag = tag;
    this.className = '';
    this.dataset = {};
    this.children = [];
    this.listeners = [];
  }
  addEventListener(event, fn) {
    this.listeners.push({event, fn});
  }
  querySelectorAll(sel) {
    if (sel === '.time-cell') {
      return Array(672).fill(0).map(() => {
        const el = new MockElement('div');
        el.className = 'time-cell';
        return el;
      });
    }
    return [];
  }
  appendChild(child) {
    this.children.push(child);
  }
  set innerHTML(val) {
    this.children = [];
  }
}

const mockGrid = new MockElement('div');
mockGrid.id = 'test-grid';

// Current approach
const start1 = process.hrtime.bigint();
for (let i = 0; i < 1000; i++) {
  mockGrid.querySelectorAll('.time-cell').forEach(cell => {
    cell.addEventListener('click', e => {
      if (e.target !== cell) return;
    });
  });
}
const end1 = process.hrtime.bigint();
console.log('Current (1000 renders):', Number(end1 - start1) / 1000000, 'ms');

// Optimized approach (event delegation - attached once)
mockGrid.addEventListener('click', e => {
  if (e.target.classList && e.target.classList.contains('time-cell')) {
    // ...
  }
});
const start2 = process.hrtime.bigint();
for (let i = 0; i < 1000; i++) {
  // We just don't attach anything in the render loop for time-cells!
}
const end2 = process.hrtime.bigint();
console.log('Optimized (1000 renders):', Number(end2 - start2) / 1000000, 'ms');
