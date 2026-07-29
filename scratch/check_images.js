const fs = require('fs');
const content = fs.readFileSync('src/data/news.ts', 'utf8');

const mdRegex = /!\[.*?\]\((.*?)\)/g;
let m;
while ((m = mdRegex.exec(content)) !== null) {
  if (!m[1].startsWith('http') && !m[1].startsWith('/')) console.log('Relative MD:', m[1]);
}

const htmlRegex = /<img.*?src=["'](.*?)["']/g;
while ((m = htmlRegex.exec(content)) !== null) {
  if (!m[1].startsWith('http') && !m[1].startsWith('/')) console.log('Relative HTML:', m[1]);
}
