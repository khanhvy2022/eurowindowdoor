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

const seenTitles = new Set();
const uniqueObjects = [];
let match;
let count = 0;
let dupCount = 0;

while ((match = objectRegex.exec(arrayContent)) !== null) {
    count++;
    const objStr = match[0];
    
    // Extract Title
    const titleMatch = objStr.match(/title:\s*"([^"]+)"/);
    
    if (titleMatch) {
        let title = titleMatch[1].trim().toLowerCase();
        
        if (seenTitles.has(title)) {
            console.log(`Duplicate found (Title): ${title}`);
            dupCount++;
        } else {
            seenTitles.add(title);
            uniqueObjects.push(objStr);
        }
    } else {
        console.log("Failed to parse title for object:", objStr.substring(0, 50));
        uniqueObjects.push(objStr); // push it anyway so we don't lose data
    }
}

console.log(`Total objects: ${count}`);
console.log(`Duplicates removed: ${dupCount}`);

const newFileContent = header + 'export const newsArticles: NewsArticle[] = [\n' + uniqueObjects.join(',\n') + '\n];\n';
fs.writeFileSync('src/data/news.ts', newFileContent);
console.log("Updated news.ts with unique articles by Title.");
