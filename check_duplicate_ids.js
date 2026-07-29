const fs = require('fs');
const t = fs.readFileSync('F:/Nextjs/eurowindowdoor/src/data/news.ts', 'utf8');
const regex = /id:\s*['"]([^'"]+)['"]/g;
let match;
const ids = [];
const duplicates = [];
while ((match = regex.exec(t)) !== null) {
  if (ids.includes(match[1])) {
    duplicates.push(match[1]);
  }
  ids.push(match[1]);
}
console.log('Duplicate IDs:', duplicates);
