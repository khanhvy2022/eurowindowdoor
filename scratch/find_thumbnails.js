const fs = require('fs');
const content = fs.readFileSync('src/data/news.ts', 'utf8');
const imgRegex = /image:\s*['"](.*?)['"]/g;
let m;
const urls = new Set();
while ((m = imgRegex.exec(content)) !== null) {
  urls.add(m[1]);
}
console.log(Array.from(urls).join('\n'));
