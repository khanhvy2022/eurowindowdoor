const fs = require('fs');
const content = fs.readFileSync('src/data/news.ts', 'utf8');
const linkRegex = /(?<!\!)\[([^\]]+)\]\((https?:\/\/[^)]+\.(?:jpg|png|webp|jpeg))\)/gi;
let m;
while ((m = linkRegex.exec(content)) !== null) {
  console.log('Image link without !:', m[0]);
}
