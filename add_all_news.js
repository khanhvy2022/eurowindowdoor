const fs = require('fs');
const path = require('path');

const dataDir = 'F:/Nextjs/eurowindowdoor/docs/research/crawled_data/tin-du-an';
const newsTsPath = 'F:/Nextjs/eurowindowdoor/src/data/news.ts';

const files = [
  'eurowindow-thi-cong-he-vach-kinh-mat-dung-khu-nghi-duong-ban-mong-sa-pa',
  'eurowindow-dong-hanh-cung-the-opusk-residence-khang-dinh-vi-the-bat-dong-san-thuong-luu-tai-trung-tam-thu-thiem',
  'eurowindow-gop-phan-kien-tao-khong-gian-song-thuong-luu-du-an-sunshine-noble-palace-long-bien',
  'eurowindow-kien-tao-khong-gian-song-thuong-luu-tai-chung-cu-cao-tang-the-prive-nam-rach-chiec%C2%A0',
  'eurowindow-thi-cong-cua-va-vach-nhom-kinh-cho-du-an-to-hop-nghi-duong-5-sao-the-residences-at-arbora-quang-nam',
  'eurowindow-trung-thau-thi-cong-cua-va-vach-nhom-kinh-du-an-the-9-stellars',
  'eurowindow-trung-thau-thi-cong-he-cua-va-vach-nhom-kinh-du-an-fpt-telecom-tower'
];

let newsTsContent = fs.readFileSync(newsTsPath, 'utf8');

for (let i = 0; i < files.length; i++) {
  const slug = decodeURIComponent(files[i]).replace(/\s+$/g, '').trim();
  const slugBase = files[i];
  
  const metaPath = path.join(dataDir, `${slugBase}_meta.json`);
  const mdPath = path.join(dataDir, `${slugBase}.md`);
  
  if (!fs.existsSync(metaPath) || !fs.existsSync(mdPath)) {
    console.error(`Missing file for ${slugBase}`);
    continue;
  }
  
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const md = fs.readFileSync(mdPath, 'utf8');
  
  // Extract date from markdown
  const dateMatch = md.match(new RegExp('(\\d{2}/\\d{2}/\\d{4})'));
  let date = '2025-01-01';
  let year = '2025';
  let month = '01';
  if (dateMatch) {
    const parts = dateMatch[1].split('/');
    date = `${parts[2]}-${parts[1]}-${parts[0]}`;
    year = parts[2];
    month = parts[1];
  }
  
  // Extract content between date line and "Chia sẻ:"
  let contentText = '';
  const lines = md.split('\n');
  let inContent = false;
  let contentLines = [];
  
  for (const line of lines) {
    if (line.includes('Chia sẻ: [ Facebook ]') || line.includes('Chia sẻ:')) {
      inContent = false;
      break;
    }
    if (inContent) {
      contentLines.push(line);
    }
    // Matching the date line to start capturing
    if (line.match(new RegExp('\\d{2}/\\d{2}/\\d{4}')) && line.includes('Lượt xem')) {
      inContent = true;
    }
  }
  
  // Fallback if no content found
  if (contentLines.length === 0) {
     contentLines.push(meta.description || '');
  }
  
  let htmlContent = '';
  for (let idx = 0; idx < contentLines.length; idx++) {
    const line = contentLines[idx].trim();
    if (!line) continue;
    
    // image
    if (line.startsWith('![')) {
      const match = line.match(/!\[(.*?)\]\((.*?)\)/);
      if (match) {
        htmlContent += `<img src="${match[2]}" alt="${match[1]}" title="${match[1]}" />\n`;
      }
    } 
    // italic description under image
    else if (line.startsWith('_') && line.endsWith('_')) {
      const txt = line.substring(1, line.length - 1);
      htmlContent += `<p className="text-center italic text-sm text-gray-500 mt-2 mb-6">${txt}</p>\n`;
    }
    else {
      // First paragraph is bold
      if (idx === 0) {
        htmlContent += `<p className="lead font-bold text-base text-[#005ba7]">${line}</p>\n`;
      } else {
        htmlContent += `<p>${line}</p>\n`;
      }
    }
  }
  
  // Choose an image from meta
  let image = '/core/img/default_image.png';
  if (meta.images && meta.images.length > 0) {
    for (const img of meta.images) {
      if (img.src && !img.src.includes('default_image') && !img.src.includes('popup-website') && img.src.startsWith('http')) {
        image = img.src;
        break;
      }
    }
  }
  
  const articleObj = {
    id: `biz-${slug.substring(0, 30).replace(/[^a-zA-Z0-9-]/g, '')}`,
    slug: slug,
    year,
    month,
    title: meta.title.replace('Eurowindow', 'Eurowindow').replace(/\s+/g, ' ').trim(),
    date,
    category: 'Tin dự án',
    image: image,
    imageAlt: meta.title.substring(0, 50),
    excerpt: meta.description,
    content: htmlContent
  };
  
  // Format replacement
  let objStr = JSON.stringify(articleObj, null, 2);
  objStr = objStr.replace(/"([^(")]+)":/g, "$1:"); // remove quotes around keys
  
  // Insert at the top of the list right after [
  const insertPos = newsTsContent.indexOf('export const newsArticles: NewsArticle[] = [') + 'export const newsArticles: NewsArticle[] = ['.length;
  newsTsContent = newsTsContent.substring(0, insertPos) + '\n' + objStr + ',\n' + newsTsContent.substring(insertPos);
}

fs.writeFileSync(newsTsPath, newsTsContent, 'utf8');
console.log('Successfully added all 7 articles to news.ts');
