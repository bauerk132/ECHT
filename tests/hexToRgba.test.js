const fs = require('fs');
const assert = require('assert');
const path = require('path');

// Read the index.html file
const htmlPath = path.join(__dirname, '../index.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

// Use a more robust parsing approach leveraging the Function constructor
// First, extract everything inside the <script> tags
const scriptMatches = html.match(/<script>([\s\S]*?)<\/script>/g);
if (!scriptMatches) {
  console.error("No script tags found!");
  process.exit(1);
}

// We know the function is in the first script tag
const jsCode = scriptMatches[0].replace(/<\/?script>/g, '');

// Since this is a vanilla JS app, we can extract the function code
// by compiling the JS in a context and stealing the function
// A safer approach than regex is to create a fake environment and run the script,
// but the script execution has side effects (`document.addEventListener` at root level).

// Instead, let's use a simple tokenizer to find the function block
function extractFunction(code, funcName) {
  const startKeyword = `function ${funcName}(`;
  let startIdx = code.indexOf(startKeyword);
  if (startIdx === -1) return null;

  let braceCount = 0;
  let inFunction = false;
  let endIdx = -1;

  for (let i = startIdx; i < code.length; i++) {
    if (code[i] === '{') {
      braceCount++;
      inFunction = true;
    } else if (code[i] === '}') {
      braceCount--;
      if (inFunction && braceCount === 0) {
        endIdx = i + 1;
        break;
      }
    }
  }

  if (endIdx !== -1) {
    return code.substring(startIdx, endIdx);
  }
  return null;
}

const functionStr = extractFunction(jsCode, 'hexToRgba');

if (!functionStr) {
  console.error("No hexToRgba function found!");
  process.exit(1);
}

// Define the function dynamically using Function constructor (safer than eval)
const hexToRgba = new Function(
  `return ${functionStr}`
)();

// Test Suite
console.log("Running tests for hexToRgba...");
let passed = 0;
let failed = 0;

function runTest(name, testFn) {
  try {
    testFn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (error) {
    console.error(`❌ FAIL: ${name}`);
    console.error(`   ${error.message}`);
    failed++;
  }
}

// Happy paths
runTest('Should convert pure black with full opacity', () => {
  assert.strictEqual(hexToRgba('#000000', 1), 'rgba(0,0,0,1)');
});

runTest('Should convert pure white with full opacity', () => {
  assert.strictEqual(hexToRgba('#ffffff', 1), 'rgba(255,255,255,1)');
});

runTest('Should convert pure red with 0 opacity', () => {
  assert.strictEqual(hexToRgba('#ff0000', 0), 'rgba(255,0,0,0)');
});

runTest('Should convert pure green with 0.5 opacity', () => {
  assert.strictEqual(hexToRgba('#00ff00', 0.5), 'rgba(0,255,0,0.5)');
});

runTest('Should convert pure blue with 0.99 opacity', () => {
  assert.strictEqual(hexToRgba('#0000ff', 0.99), 'rgba(0,0,255,0.99)');
});

runTest('Should convert arbitrary hex with arbitrary alpha', () => {
  assert.strictEqual(hexToRgba('#123456', 0.123), 'rgba(18,52,86,0.123)');
});

runTest('Should convert uppercase hex colors', () => {
  assert.strictEqual(hexToRgba('#FFFFFF', 1), 'rgba(255,255,255,1)');
  assert.strictEqual(hexToRgba('#AABBCC', 0.5), 'rgba(170,187,204,0.5)');
});

// Edge Cases (based on current behavior and limitations)
runTest('Should handle string alpha value', () => {
  assert.strictEqual(hexToRgba('#000000', '0.5'), 'rgba(0,0,0,0.5)');
});

// For 3-digit hex, current implementation is known to not support it correctly (returns NaN for B)
// but we capture its behavior to catch if it changes or gets fixed.
runTest('Current behavior for 3-digit hex (not fully supported)', () => {
  assert.strictEqual(hexToRgba('#fff', 1), 'rgba(255,15,NaN,1)');
});

console.log(`\nTest Summary: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
