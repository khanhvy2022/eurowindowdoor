const fs = require('fs');
const t = fs.readFileSync('F:/Nextjs/eurowindowdoor/src/data/news.ts', 'utf8');
const titles = [...t.matchAll(/title:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const mdTitles = titles.filter(t => t.includes('*') || t.includes('#'));
console.log('Markdown in titles:', mdTitles);
