// Test the updated parsePricingTable function

const { parsePricingTable } = require('./packageParser.js');

// Test case: 9 columns
const testData = `Category | 2 Pax | 4 Pax | 6 Pax | 8 Pax | 10 Pax | 12 Pax | Extra Bed | Child | Infant
Standard | Rs 15,000 | Rs 12,000 | Rs 10,000 | Rs 9,000 | Rs 8,000 | Rs 7,500 | Rs 2,500 | Rs 5,000 | Rs 2,000
Deluxe | Rs 20,000 | Rs 17,000 | Rs 15,000 | Rs 14,000 | Rs 13,000 | Rs 12,500 | Rs 3,000 | Rs 6,500 | Rs 2,500
Premium | Rs 25,000 | Rs 22,000 | Rs 20,000 | Rs 19,000 | Rs 18,000 | Rs 17,500 | Rs 3,500 | Rs 7,000 | Rs 3,000`;

const result = parsePricingTable(testData);

console.log('Parsed Result:');
console.log(JSON.stringify(result, null, 2));

console.log('\n--- Column Count Check ---');
result.forEach((row, idx) => {
  const columnCount = row.columns ? Object.keys(row.columns).length : 0;
  console.log(`Row ${idx + 1} (${row.category}): ${columnCount} columns`);
});

if (result.length === 3 && result[0].columns && Object.keys(result[0].columns).length === 9) {
  console.log('\n✅ SUCCESS: All 9 columns parsed correctly!');
} else {
  console.log('\n❌ FAILED: Expected 3 rows with 9 columns each');
}
