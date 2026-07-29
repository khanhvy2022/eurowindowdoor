const fs = require('fs');
const content = fs.readFileSync('src/data/news.ts', 'utf8');

// Find all local /images/ references inside content strings
const imgRegex = /src=\\?"(\/images\/[^"\\]+)\\?"/g;
let m;
const found = new Set();
while ((m = imgRegex.exec(content)) !== null) {
  found.add(m[1]);
}
console.log('Local /images/ URLs in content:');
found.forEach(u => console.log(' ', u));
console.log('Total:', found.size);
