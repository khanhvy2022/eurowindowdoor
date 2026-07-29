const fs = require('fs');

const content = fs.readFileSync('src/data/news.ts', 'utf8');

const arrayStartIdx = content.indexOf('export const newsArticles: NewsArticle[] = [');
const arrayContent = content.substring(arrayStartIdx);

const objectRegex = /\{\s*id:\s*"([^"]+)",[\s\S]*?\n\}/g;

const articles = [];
let match;
while ((match = objectRegex.exec(arrayContent)) !== null) {
    const id = match[1];
    const titleMatch = match[0].match(/title:\s*"([^"]+)"/);
    const contentMatch = match[0].match(/content:\s*"(.*?)"/s); // match across newlines
    
    if (titleMatch && contentMatch) {
        articles.push({
            id: id,
            title: titleMatch[1],
            content: contentMatch[1],
            fullObj: match[0]
        });
    }
}

// Compare content lengths and calculate simple overlap
console.log(`Checking ${articles.length} articles for duplicates based on content similarity...`);

const duplicatesToRemove = new Set();

for (let i = 0; i < articles.length; i++) {
    for (let j = i + 1; j < articles.length; j++) {
        const c1 = articles[i].content;
        const c2 = articles[j].content;
        
        // Exact content match
        if (c1 === c2) {
            console.log(`EXACT DUPLICATE CONTENT:\n 1. [${articles[i].id}] ${articles[i].title}\n 2. [${articles[j].id}] ${articles[j].title}`);
            duplicatesToRemove.add(articles[j].id);
        } else {
            // Check for high length similarity + first 100 chars match
            if (Math.abs(c1.length - c2.length) < 50 && c1.substring(0, 100) === c2.substring(0, 100)) {
                console.log(`HIGH SIMILARITY CONTENT:\n 1. [${articles[i].id}] ${articles[i].title}\n 2. [${articles[j].id}] ${articles[j].title}`);
                duplicatesToRemove.add(articles[j].id);
            }
        }
    }
}

console.log(`\nFound ${duplicatesToRemove.size} duplicates.`);
