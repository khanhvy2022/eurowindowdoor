const fs = require('fs');
const file = 'F:/Nextjs/eurowindowdoor/src/data/news.ts';
let t = fs.readFileSync(file, 'utf8');

// Replace all Markdown symbols like ** and ## in the string literals for excerpt, title, and content
t = t.replace(/\\*\\*/g, ''); // Remove **
t = t.replace(/##\s?/g, ''); // Remove ##

fs.writeFileSync(file, t);
console.log('Removed markdown symbols');
