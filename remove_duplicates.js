const fs = require('fs');
const file = 'F:/Nextjs/eurowindowdoor/src/data/news.ts';
let t = fs.readFileSync(file, 'utf8');

// Parse the news array
// It's a JS object, let's just use `eval` or `Function`
// But we can't because it has `export const newsData = [...]`
const dataStr = t.replace('export const newsData = ', '').replace(/;$/, '');
let newsData;
try {
  newsData = eval(`(${dataStr})`);
} catch (e) {
  console.log('Error parsing:', e);
}

if (newsData) {
  const uniqueSlugs = new Set();
  const filteredData = newsData.filter(item => {
    if (uniqueSlugs.has(item.slug)) {
      return false;
    }
    uniqueSlugs.add(item.slug);
    return true;
  });

  // Now we have to write it back.
  // Converting object back to JS code safely.
  // Since content has backticks, we should escape them.
  let output = 'export const newsData = [\\n';
  for (const item of filteredData) {
    output += '  {\\n';
    for (const key of Object.keys(item)) {
      if (key === 'content') {
        const safeContent = item[key].replace(/`/g, '\\\\`').replace(/\\$\\{/g, '\\\\${');
        output += `    ${key}: \`${safeContent}\`,\\n`;
      } else {
        const val = typeof item[key] === 'string' ? `'${item[key].replace(/'/g, "\\\\'")}'` : item[key];
        output += `    ${key}: ${val},\\n`;
      }
    }
    output += '  },\\n';
  }
  output += '];\\n';
  fs.writeFileSync(file, output);
  console.log('Removed duplicates successfully.');
}
