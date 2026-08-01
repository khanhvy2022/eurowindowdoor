const fs = require('fs');
const pt = fs.readFileSync('F:/Nextjs/eurowindowdoor/src/data/projects.ts', 'utf8');
const p = [...pt.matchAll(/description:\s*['"](.*?)['"]/g)].map(m => m[1]);
console.log('Empty project desc:', p.filter(x => x.length < 10).length);

const nt = fs.readFileSync('F:/Nextjs/eurowindowdoor/src/data/news.ts', 'utf8');
const n = [...nt.matchAll(/excerpt:\s*['"](.*?)['"]/g)].map(m => m[1]);
console.log('Empty news excerpt:', n.filter(x => x.length < 10).length);
