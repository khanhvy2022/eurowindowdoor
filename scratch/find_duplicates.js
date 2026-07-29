const fs = require('fs');

const content = fs.readFileSync('src/data/news.ts', 'utf8');

// Find the start of the array
const arrayStartIdx = content.indexOf('export const newsArticles: NewsArticle[] = [');
if (arrayStartIdx === -1) {
    console.error("Could not find array start");
    process.exit(1);
}

const header = content.substring(0, arrayStartIdx);
const arrayContent = content.substring(arrayStartIdx);

const objectRegex = /\{\s*id:\s*"([^"]+)",[\s\S]*?\n\}/g;

const titles = [];
let match;

while ((match = objectRegex.exec(arrayContent)) !== null) {
    const objStr = match[0];
    
    // Extract Title
    const titleMatch = objStr.match(/title:\s*"([^"]+)"/);
    if (titleMatch) {
        titles.push({
            id: match[1],
            original: titleMatch[1],
            normalized: titleMatch[1].toLowerCase().replace(/[^a-z0-9]/gi, '')
        });
    }
}

console.log(`Total titles: ${titles.length}`);

// Find duplicates by normalized title
const grouped = {};
for (const t of titles) {
    if (!grouped[t.normalized]) grouped[t.normalized] = [];
    grouped[t.normalized].push(t);
}

for (const norm in grouped) {
    if (grouped[norm].length > 1) {
        console.log(`\nDuplicate Group:`);
        grouped[norm].forEach(t => console.log(` - [${t.id}] ${t.original}`));
    }
}
