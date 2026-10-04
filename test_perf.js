const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');
const jsCode = html.split('<script>')[1].split('</script>')[0];

const mockDom = `
  class DOMElement {
    constructor(tagName) {
      this.tagName = tagName;
      this.children = [];
      this.classList = {
        add: () => {},
        remove: () => {},
        toggle: () => {},
        contains: () => false
      };
      this.style = {};
      this.dataset = {};
      this.innerHTML = '';
      this.className = '';
      this.textContent = '';
      this.id = '';
      this.value = '';
      this.checked = false;
      this._events = {};
    }
    appendChild(child) {
      this.children.push(child);
      return child;
    }
    removeChild(child) {
      this.children = this.children.filter(c => c !== child);
    }
    remove() {}
    querySelector() { return new DOMElement('div'); }
    querySelectorAll() { return [new DOMElement('div')]; }
    addEventListener(evt, cb) {
      if (!this._events[evt]) this._events[evt] = [];
      this._events[evt].push(cb);
    }
    removeEventListener(evt, cb) {}
    getBoundingClientRect() { return { width: 1000, height: 1000, left: 0, top: 0 }; }
    focus() {}
  }

  const documentMock = {
    getElementById: (id) => new DOMElement('div'),
    createElement: (tag) => new DOMElement(tag),
    querySelector: () => new DOMElement('div'),
    querySelectorAll: () => [new DOMElement('div')],
    addEventListener: () => {},
    removeEventListener: () => {},
    createDocumentFragment: () => new DOMElement('fragment')
  };

  const windowMock = {
    localStorage: {
      getItem: () => null,
      setItem: () => {}
    },
    URL: {
      createObjectURL: () => '',
      revokeObjectURL: () => {}
    },
    setTimeout: (cb) => cb(),
    setInterval: (cb) => {},
    Date: Date,
    Math: Math,
    String: String,
    parseInt: parseInt,
    Blob: class Blob {}
  };

  var document = documentMock;
  var window = windowMock;
  var localStorage = windowMock.localStorage;
  var URL = windowMock.URL;
  var Blob = windowMock.Blob;
`;

require('vm').runInNewContext(mockDom + jsCode + `
// Add some test data
for(let i=0; i<500; i++) {
  state.tasks.push({
    id: 't'+i,
    name: 'Task '+i,
    category: 'croissant',
    day: i%7,
    startSlot: i%50,
    endSlot: (i%50)+5,
    passive: false,
    notes: ''
  });
  state.ovenBlocks.push({
    id: 'o'+i,
    name: 'Oven '+i,
    category: 'croissant',
    day: i%7,
    startSlot: i%50,
    endSlot: (i%50)+5,
    temp: 400,
    notes: ''
  });
}

const start = performance.now();
for(let i=0; i<100; i++) {
  hasScheduleConflict();
  hasOvenConflict();
  getOvenConflictIds();
}
const end = performance.now();
console.log('Original Conflict Detection (100x with 500 items):', end - start, 'ms');

// Optimization: group by day first
function hasScheduleConflictOptimized() {
  const active = state.tasks.filter(t => !t.passive);
  const byDay = Array.from({length: 7}, () => []);
  for (let i = 0; i < active.length; i++) byDay[active[i].day].push(active[i]);

  for (let d = 0; d < 7; d++) {
    const dayTasks = byDay[d];
    dayTasks.sort((a, b) => a.startSlot - b.startSlot);
    for (let i = 0; i < dayTasks.length; i++) {
      for (let j = i + 1; j < dayTasks.length; j++) {
        if (dayTasks[j].startSlot >= dayTasks[i].endSlot) break;
        if (blocksOverlap(dayTasks[i], dayTasks[j])) return true;
      }
    }
  }
  return false;
}

function hasOvenConflictOptimized() {
  const ob = state.ovenBlocks;
  const byDay = Array.from({length: 7}, () => []);
  for (let i = 0; i < ob.length; i++) byDay[ob[i].day].push(ob[i]);

  for (let d = 0; d < 7; d++) {
    const dayTasks = byDay[d];
    dayTasks.sort((a, b) => a.startSlot - b.startSlot);
    for (let i = 0; i < dayTasks.length; i++) {
      for (let j = i + 1; j < dayTasks.length; j++) {
        if (dayTasks[j].startSlot >= dayTasks[i].endSlot) break;
        if (blocksOverlap(dayTasks[i], dayTasks[j])) return true;
      }
    }
  }
  return false;
}

function getOvenConflictIdsOptimized() {
  const conflicts = new Set();
  const ob = state.ovenBlocks;
  const byDay = Array.from({length: 7}, () => []);
  for (let i = 0; i < ob.length; i++) byDay[ob[i].day].push(ob[i]);

  for (let d = 0; d < 7; d++) {
    const dayTasks = byDay[d];
    dayTasks.sort((a, b) => a.startSlot - b.startSlot);
    for (let i = 0; i < dayTasks.length; i++) {
      for (let j = i + 1; j < dayTasks.length; j++) {
        if (dayTasks[j].startSlot >= dayTasks[i].endSlot) break;
        if (blocksOverlap(dayTasks[i], dayTasks[j])) {
          conflicts.add(dayTasks[i].id);
          conflicts.add(dayTasks[j].id);
        }
      }
    }
  }
  return conflicts;
}

const startOpt = performance.now();
for(let i=0; i<100; i++) {
  hasScheduleConflictOptimized();
  hasOvenConflictOptimized();
  getOvenConflictIdsOptimized();
}
const endOpt = performance.now();
console.log('Optimized Conflict Detection (100x with 500 items):', endOpt - startOpt, 'ms');
`, { performance, console });
