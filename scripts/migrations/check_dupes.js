const fs = require('fs'); 
const t = fs.readFileSync('F:/Nextjs/eurowindowdoor/src/data/news.ts', 'utf8'); 
const ids = [...t.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]); 
const dupes = ids.filter((item, index) => ids.indexOf(item) !== index); 
console.log('Duplicates:', dupes);
