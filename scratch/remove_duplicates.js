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

// We'll use a regex to match each object in the array.
// This assumes each object is formatted from `{\n  id: ` to `\n}`
const objectRegex = /\{\s*id:\s*"([^"]+)",[\s\S]*?\n\}/g;

const seenIds = new Set();
const seenSlugs = new Set();
const uniqueObjects = [];
let match;
let count = 0;
let dupCount = 0;

while ((match = objectRegex.exec(arrayContent)) !== null) {
    count++;
    const objStr = match[0];
    
    // Extract ID and Slug
    const idMatch = objStr.match(/id:\s*"([^"]+)"/);
    const slugMatch = objStr.match(/slug:\s*"([^"]+)"/);
    
    if (idMatch && slugMatch) {
        const id = idMatch[1];
        const slug = slugMatch[1];
        
        if (seenSlugs.has(slug)) {
            console.log(`Duplicate found (Slug): ${slug}`);
            dupCount++;
        } else {
            seenSlugs.add(slug);
            uniqueObjects.push(objStr);
        }
    } else {
        console.log("Failed to parse object:", objStr.substring(0, 50));
        uniqueObjects.push(objStr); // push it anyway so we don't lose data
    }
}

console.log(`Total objects: ${count}`);
console.log(`Duplicates removed: ${dupCount}`);

const newFileContent = header + 'export const newsArticles: NewsArticle[] = [\n' + uniqueObjects.join(',\n') + '\n];\n';
fs.writeFileSync('src/data/news.ts', newFileContent);
console.log("Updated news.ts with unique articles.");

