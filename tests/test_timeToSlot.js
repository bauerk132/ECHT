const fs = require('fs');
const assert = require('assert');
const { describe, it } = require('node:test');

// Extract JS from index.html
const html = fs.readFileSync('index.html', 'utf-8');
const js = html.split('<script>')[1].split('</script>')[0];

// Provide mocks for browser globals so the script can evaluate
const mockEnv = `
  const document = {
    addEventListener: () => {},
    getElementById: () => ({
      addEventListener: () => {},
      getContext: () => ({}),
      appendChild: () => {},
      querySelector: () => ({}),
      classList: { add: () => {}, remove: () => {} },
      style: {}
    }),
    createElement: () => ({
      classList: { add: () => {}, remove: () => {} },
      style: {},
      appendChild: () => {},
      addEventListener: () => {}
    }),
    querySelectorAll: () => []
  };
  const window = {
    addEventListener: () => {},
    localStorage: { getItem: () => null, setItem: () => {} }
  };
  const localStorage = window.localStorage;
  const URL = { createObjectURL: () => '', revokeObjectURL: () => {} };
  const Blob = class {};
`;

// Evaluate script and extract function
const getFunction = new Function(`${mockEnv}\n${js}\nreturn timeToSlot;`);
const timeToSlot = getFunction();

describe('timeToSlot', () => {
  it('should parse 00:00 to 0', () => {
    assert.strictEqual(timeToSlot('00:00'), 0);
  });
  it('should parse 01:00 to 4', () => {
    assert.strictEqual(timeToSlot('01:00'), 4);
  });
  it('should parse 01:15 to 5', () => {
    assert.strictEqual(timeToSlot('01:15'), 5);
  });
  it('should parse 01:30 to 6', () => {
    assert.strictEqual(timeToSlot('01:30'), 6);
  });
  it('should parse 01:45 to 7', () => {
    assert.strictEqual(timeToSlot('01:45'), 7);
  });
  it('should round 01:07 down to 4', () => { // 67 / 15 = 4.46 -> 4
    assert.strictEqual(timeToSlot('01:07'), 4);
  });
  it('should round 01:08 up to 5', () => { // 68 / 15 = 4.53 -> 5
    assert.strictEqual(timeToSlot('01:08'), 5);
  });
  it('should parse 23:59 to 96 (end of day)', () => { // (23*60 + 59)/15 = 1439/15 = 95.93 -> 96
    assert.strictEqual(timeToSlot('23:59'), 96);
  });
  it('should return NaN for invalid strings', () => {
    assert.ok(Number.isNaN(timeToSlot('invalid')));
  });
});
