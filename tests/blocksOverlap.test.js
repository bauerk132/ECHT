const fs = require('fs');
const assert = require('assert');

// Read the index.html file
const html = fs.readFileSync('index.html', 'utf-8');

// Extract the blocksOverlap function
const match = html.match(/function blocksOverlap\s*\([^)]*\)\s*{[^}]*}/);

if (!match) {
  console.error("Function blocksOverlap not found in index.html");
  process.exit(1);
}

// Evaluate the function string into an actual function
const blocksOverlapStr = match[0];
const blocksOverlap = eval(`(${blocksOverlapStr})`);

console.log("Running tests for blocksOverlap...");
let passedCount = 0;
let failedCount = 0;

function runTest(description, expected, a, b) {
  try {
    const result = blocksOverlap(a, b);
    assert.strictEqual(result, expected);
    console.log(`✅ PASS: ${description}`);
    passedCount++;
  } catch (error) {
    console.error(`❌ FAIL: ${description}`);
    console.error(`   Expected ${expected} but got ${!expected}`);
    failedCount++;
  }
}

// Test cases

// Scenario 1: Same day, partial overlap
runTest(
  "Same day, partial overlap (a starts first)",
  true,
  { day: 1, startSlot: 10, endSlot: 20 },
  { day: 1, startSlot: 15, endSlot: 25 }
);

runTest(
  "Same day, partial overlap (b starts first)",
  true,
  { day: 1, startSlot: 15, endSlot: 25 },
  { day: 1, startSlot: 10, endSlot: 20 }
);

// Scenario 2: Same day, no overlap
runTest(
  "Same day, no overlap (b starts when a ends)",
  false,
  { day: 1, startSlot: 10, endSlot: 15 },
  { day: 1, startSlot: 15, endSlot: 20 }
);

runTest(
  "Same day, no overlap (a starts when b ends)",
  false,
  { day: 1, startSlot: 15, endSlot: 20 },
  { day: 1, startSlot: 10, endSlot: 15 }
);

runTest(
  "Same day, no overlap with gap between",
  false,
  { day: 1, startSlot: 10, endSlot: 15 },
  { day: 1, startSlot: 20, endSlot: 25 }
);

// Scenario 3: Same day, identical blocks (full overlap)
runTest(
  "Same day, completely identical blocks",
  true,
  { day: 1, startSlot: 10, endSlot: 20 },
  { day: 1, startSlot: 10, endSlot: 20 }
);

// Scenario 4: Same day, one block inside another
runTest(
  "Same day, b completely inside a",
  true,
  { day: 1, startSlot: 10, endSlot: 30 },
  { day: 1, startSlot: 15, endSlot: 25 }
);

runTest(
  "Same day, a completely inside b",
  true,
  { day: 1, startSlot: 15, endSlot: 25 },
  { day: 1, startSlot: 10, endSlot: 30 }
);

// Scenario 5: Different days, would overlap if on same day
runTest(
  "Different days, overlapping times",
  false,
  { day: 1, startSlot: 10, endSlot: 20 },
  { day: 2, startSlot: 15, endSlot: 25 }
);

runTest(
  "Different days, identical times",
  false,
  { day: 1, startSlot: 10, endSlot: 20 },
  { day: 3, startSlot: 10, endSlot: 20 }
);

// Scenario 6: Zero duration block tests (edge cases)
runTest(
  "Zero duration blocks on same day, touching edge",
  false,
  { day: 1, startSlot: 10, endSlot: 10 }, // zero duration
  { day: 1, startSlot: 10, endSlot: 20 }
);

console.log(`\nTest Summary: ${passedCount} passed, ${failedCount} failed`);

if (failedCount > 0) {
  process.exit(1);
}
