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

// First, extract all objects
const objectRegex = /\{\s*id:\s*"([^"]+)",[\s\S]*?\n\}/g;
const articles = [];
let match;
while ((match = objectRegex.exec(arrayContent)) !== null) {
    const id = match[1];
    const titleMatch = match[0].match(/title:\s*"([^"]+)"/);
    const contentMatch = match[0].match(/content:\s*"(.*?)"/s);
    
    articles.push({
        id: id,
        title: titleMatch ? titleMatch[1] : "",
        content: contentMatch ? contentMatch[1] : "",
        fullObj: match[0]
    });
}

// Now deduplicate based on content
const uniqueArticles = [];
const seenContents = new Set();
let removedCount = 0;

for (const article of articles) {
    if (article.content && article.content.length > 50) {
        if (seenContents.has(article.content)) {
            console.log(`Removing exact duplicate (Content): [${article.id}] ${article.title}`);
            removedCount++;
            continue; // Skip this article, it's a duplicate
        } else {
            seenContents.add(article.content);
            uniqueArticles.push(article);
        }
    } else {
        // Keep articles with empty or very short content just in case
        uniqueArticles.push(article);
    }
}

console.log(`Total removed: ${removedCount}`);
console.log(`Remaining articles: ${uniqueArticles.length}`);

// Write back to file
const newArrayStr = uniqueArticles.map(a => a.fullObj).join(',\n');
const footerStr = '\n];\nexport const articlesData = newsArticles;\n';

fs.writeFileSync('src/data/news.ts', header + 'export const newsArticles: NewsArticle[] = [\n' + newArrayStr + footerStr);
console.log("Updated news.ts with unique articles by content.");
