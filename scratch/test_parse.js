const fs = require('fs');

const tsCode = fs.readFileSync('src/app/tin-tuc/[id]/ArticleDetailClient.tsx', 'utf8');

const getProcessedContentRegex = /const getProcessedContent = \(content.*?{([\s\S]*?)};\s*const processedContent/m;
const match = getProcessedContentRegex.exec(tsCode);
if (!match) { console.log('Could not find getProcessedContent'); process.exit(1); }

const getProcessedContent = new Function('content', 'language', match[1]);

const newsData = fs.readFileSync('src/data/news.ts', 'utf8');
const articles = [];
const contentRegex = /content:\s*"(.*?)"/g;
let m;
while ((m = contentRegex.exec(newsData)) !== null) {
  articles.push(m[1].replace(/\\"/g, '"').replace(/\\n/g, '\n'));
}

let allUrls = [];
let allErrors = [];
for (let i = 0; i < articles.length; i++) {
  try {
    const processed = getProcessedContent(articles[i], 'VI');
    const imgRegex = /<img[^>]+src=["'](.*?)["']/g;
    let imgM;
    let found = false;
    while ((imgM = imgRegex.exec(processed)) !== null) {
      allUrls.push(imgM[1]);
      found = true;
    }
    if (articles[i].includes('anh-ap-1')) {
      console.log('Article with anh-ap-1 processed html length:', processed.length);
      console.log('Images found in this article:', found);
    }
  } catch (e) {
    allErrors.push('Error processing article ' + i + ': ' + e.message);
  }
}
console.log('Total images found in HTML:', allUrls.length);
console.log('Unique images:', Array.from(new Set(allUrls)).length);
console.log('Errors:', allErrors);
