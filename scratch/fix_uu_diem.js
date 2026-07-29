const fs = require('fs');
let content = fs.readFileSync('src/data/news.ts', 'utf8');

// The caption class that is centering the text
const captionClass = 'class=\\"text-center italic text-sm text-gray-500 mt-2 mb-4\\"';

// Replace any <p class="...">Ưu điểm...</p> with <h3>Ưu điểm...</h3> or <p><strong>Ưu điểm...</strong></p>
content = content.replace(new RegExp(`<p ${captionClass}>([\\s\\-]*Ưu điểm[^<]*)<\\/p>`, 'gi'), '<p><strong>$1</strong></p>');

// Just in case it's in a slightly different format (e.g. without the exact class match but still text-center)
content = content.replace(/<p[^>]*text-center[^>]*>([\s\-]*Ưu điểm[^<]*)<\/p>/gi, '<p><strong>$1</strong></p>');

fs.writeFileSync('src/data/news.ts', content);
console.log("Fixed 'Ưu điểm' formatting in news.ts");
