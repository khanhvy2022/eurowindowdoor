const fs = require('fs');
const file = 'F:/Nextjs/eurowindowdoor/src/data/news.ts';
let t = fs.readFileSync(file, 'utf8');

// Replace markdown inside <p> tags
t = t.replace(/<p>### \*\*(.*?)\*\*<\/p>/g, '<h3><strong>$1</strong></h3>');
t = t.replace(/<p>## \*\*(.*?)\*\*<\/p>/g, '<h2><strong>$1</strong></h2>');
t = t.replace(/<p># \*\*(.*?)\*\*<\/p>/g, '<h1><strong>$1</strong></h1>');

t = t.replace(/<p>### (.*?)<\/p>/g, '<h3>$1</h3>');
t = t.replace(/<p>## (.*?)<\/p>/g, '<h2>$1</h2>');
t = t.replace(/<p># (.*?)<\/p>/g, '<h1>$1</h1>');

// If there are raw ## ** without <p> wrappers
t = t.replace(/### \*\*(.*?)\*\*/g, '<h3><strong>$1</strong></h3>');
t = t.replace(/## \*\*(.*?)\*\*/g, '<h2><strong>$1</strong></h2>');
t = t.replace(/# \*\*(.*?)\*\*/g, '<h1><strong>$1</strong></h1>');

// Replace any remaining **...** with <strong>...</strong>
t = t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

fs.writeFileSync(file, t);
console.log('Cleaned HTML markdown in news.ts');
