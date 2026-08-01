const fs = require('fs');
const pt = fs.readFileSync('F:/Nextjs/eurowindowdoor/src/data/projects.ts', 'utf8');
const p = [...pt.matchAll(/description:\s*['"](.*?)['"]/g)].length;
const pTotal = [...pt.matchAll(/id:\s*['"]/g)].length;
console.log('Projects with desc:', p, 'Total:', pTotal);

const nt = fs.readFileSync('F:/Nextjs/eurowindowdoor/src/data/news.ts', 'utf8');
const n = [...nt.matchAll(/excerpt:\s*['"](.*?)['"]/g)].length;
const nTotal = [...nt.matchAll(/id:\s*['"]/g)].length;
console.log('News with excerpt:', n, 'Total:', nTotal);
