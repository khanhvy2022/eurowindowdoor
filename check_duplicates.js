const fs = require('fs');
const t = fs.readFileSync('F:/Nextjs/eurowindowdoor/src/data/news.ts', 'utf8');
const regex = /slug:\s*['"]([^'"]+)['"]/g;
let match;
const slugs = [];
const duplicates = [];
while ((match = regex.exec(t)) !== null) {
  if (slugs.includes(match[1])) {
    duplicates.push(match[1]);
  }
  slugs.push(match[1]);
}
console.log('Duplicates:', duplicates);
