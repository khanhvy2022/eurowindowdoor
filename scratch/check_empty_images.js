const fs = require('fs');
const content = fs.readFileSync('src/data/news.ts', 'utf8');

const articles = [];
const articleRegex = /\{\s*id:\s*['"](.*?)['"][\s\S]*?title:\s*['"](.*?)['"][\s\S]*?content:\s*"(.*?)"\s*,?\s*\n\s*\}/g;
let m;
while ((m = articleRegex.exec(content)) !== null) {
  articles.push({ id: m[1], title: m[2], text: m[3] });
}

let emptyCount = 0;
for (const a of articles) {
  const imgCount = (a.text.match(/<img/g) || []).length + (a.text.match(/!\[/g) || []).length;
  if (imgCount === 0) {
    emptyCount++;
    console.log(`Article "${a.title}" has NO images in content.`);
  }
}
console.log(`Total articles: ${articles.length}`);
console.log(`Articles without content images: ${emptyCount}`);
