const fs = require('fs');
const assert = require('assert');

// Read the index.html file
const html = fs.readFileSync('index.html', 'utf-8');

// Extract the script tag content
const scriptContent = html.split('<script>')[1].split('</script>')[0];

// The function is:
// function slotToTime(slot) { ... }
// We can use a regex to match it. Because it contains {} we will match until the next empty line or next function keyword,
// but simpler: we just find the index of "function slotToTime" and then manually parse until we have balanced braces.

const startIdx = scriptContent.indexOf('function slotToTime(slot)');
if (startIdx === -1) {
    console.error("❌ FAIL: Could not find slotToTime function in index.html");
    process.exit(1);
}

let braceCount = 0;
let started = false;
let endIdx = startIdx;

for (let i = startIdx; i < scriptContent.length; i++) {
    if (scriptContent[i] === '{') {
        braceCount++;
        started = true;
    } else if (scriptContent[i] === '}') {
        braceCount--;
    }

    if (started && braceCount === 0) {
        endIdx = i;
        break;
    }
}

const jsCode = scriptContent.substring(startIdx, endIdx + 1);

// Evaluate the function in the current scope so we can test it
eval(jsCode);

console.log("Running tests for slotToTime...");

try {
    // 0 slots (0 minutes) -> "00:00"
    assert.strictEqual(slotToTime(0), "00:00", "0 slots should be 00:00");
    console.log("✅ PASS: 0 slots should be 00:00");

    // 4 slots (60 minutes) -> "01:00"
    assert.strictEqual(slotToTime(4), "01:00", "4 slots should be 01:00");
    console.log("✅ PASS: 4 slots should be 01:00");

    // 5 slots (75 minutes) -> "01:15"
    assert.strictEqual(slotToTime(5), "01:15", "5 slots should be 01:15");
    console.log("✅ PASS: 5 slots should be 01:15");

    // 48 slots (720 minutes) -> "12:00"
    assert.strictEqual(slotToTime(48), "12:00", "48 slots should be 12:00");
    console.log("✅ PASS: 48 slots should be 12:00");

    // 95 slots (1425 minutes) -> "23:45"
    assert.strictEqual(slotToTime(95), "23:45", "95 slots should be 23:45");
    console.log("✅ PASS: 95 slots should be 23:45");

    // 100 slots (1500 minutes) -> "25:00" (Testing behavior beyond 24h)
    assert.strictEqual(slotToTime(100), "25:00", "100 slots should be 25:00");
    console.log("✅ PASS: 100 slots should be 25:00");

    console.log("\nAll tests passed successfully! 🎉");
} catch (error) {
    console.error(`\n❌ FAIL: ${error.message}`);
    process.exit(1);
}
