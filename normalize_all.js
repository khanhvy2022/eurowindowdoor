const fs = require('fs');
const path = 'F:/Nextjs/eurowindowdoor/src/data/news.ts';
let code = fs.readFileSync(path, 'utf8');

// Convert single-quoted string property values to double-quoted string property values cleanly:
// e.g., title: '...', excerpt: '...', category: '...'
const propRegex = /([a-zA-Z0-9]+):\s*('[^'\\]*(?:\\.[^'\\]*)*'|`[^`\\]*(?:\\.[^`\\]*)*`)/g;

let updatedCode = code.replace(propRegex, (match, key, strVal) => {
  // If it's single quoted or backtick quoted, convert to double quote
  const raw = strVal.slice(1, -1);
  const escaped = raw
    .replace(/\\'/g, "'")
    .replace(/\\`/g, "`")
    .replace(/\\"/g, '"')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r\n/g, '\\n')
    .replace(/\n/g, '\\n');
    
  return `${key}: "${escaped}"`;
});

fs.writeFileSync(path, updatedCode);
console.log("Successfully normalized all property values in news.ts!");
