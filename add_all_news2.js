const fs = require('fs');
const path = require('path');

const tsPath = 'F:/Nextjs/eurowindowdoor/src/data/news.ts';
let tsContent = fs.readFileSync(tsPath, 'utf8');

const endIndex = tsContent.lastIndexOf('];');
if (endIndex === -1) {
    console.error("Could not find end of newsArticles array");
    process.exit(1);
}

const originalDataStr = tsContent.substring(0, endIndex + 2);

const categories = [
  { dir: 'tin-tuc-su-kien', cat: 'Tin tức & Sự kiện' },
  { dir: 'tin-khuyen-mai', cat: 'Tin khuyến mãi' },
  { dir: 'tu-van', cat: 'Tư vấn' }
];

const skipSlugs = [
    'bao-hanh', 'cua-go-tu-nhien', 'he-thong-cua-hang', 'gioi-thieu', 'chuong-trinh-khuyen-mai-dac-biet-danh-cho-khach-hang-mua-kinh-dien-eurowindow', 'tt-truyen-hinh-thong-tan-xa-viet-nam'
];

let nextId = Date.now(); // Using timestamp as ID for uniqueness just in case
const newArticles = [];

for (const category of categories) {
  const dataDir = path.join('F:/Nextjs/eurowindowdoor/docs/research/crawled_data', category.dir);
  if (!fs.existsSync(dataDir)) continue;
  
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''));
  
  for (const slugBase of files) {
    if (skipSlugs.includes(slugBase)) {
        continue;
    }
    
    if (originalDataStr.includes(`slug: '${slugBase}'`) || originalDataStr.includes(`slug: "${slugBase}"`)) {
      console.log(`Skipping ${slugBase}, already exists.`);
      continue;
    }

    const metaPath = path.join(dataDir, `${slugBase}_meta.json`);
    const mdPath = path.join(dataDir, `${slugBase}.md`);
    
    if (!fs.existsSync(metaPath) || !fs.existsSync(mdPath)) continue;
    
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    const md = fs.readFileSync(mdPath, 'utf8');
    
    let cleanImage = '/images/placeholder.webp';
    if (meta.images && meta.images.length > 0) {
        let firstImg = meta.images[0].src;
        if (firstImg.startsWith('http')) {
            cleanImage = firstImg;
        } else {
            cleanImage = `https://eurowindow.biz${firstImg}`;
        }
    }
    
    if (cleanImage.startsWith('https://eurowindow.bizhttps://eurowindow.biz')) {
      cleanImage = cleanImage.replace('https://eurowindow.bizhttps://eurowindow.biz', 'https://eurowindow.biz');
    }
    
    let description = meta.description || '';
    if (!description || description.includes('![vi]') || description.includes('![en]')) {
        const paragraphs = md.split('\n').map(p => p.trim()).filter(p => 
            p.length > 50 && 
            !p.startsWith('#') && 
            !p.startsWith('[') && 
            !p.startsWith('![') &&
            !p.startsWith('* [') &&
            !p.includes('![vi]') && 
            !p.includes('![en]') && 
            !p.includes('TRANG CHỦ') &&
            !p.includes('GIỚI THIỆU') &&
            !p.includes('Thiếu Địa chỉ công trình') &&
            !p.includes('Cảm ơn bạn đã cung cấp thông tin')
        );
        if (paragraphs.length > 0) {
            description = paragraphs[0];
        } else {
            description = `${meta.title} - Nội dung chi tiết bài viết đang được cập nhật.`;
        }
    }
    
    // Attempt to parse date (e.g. 15/12/2023)
    let dateStr = '20/12/2023';
    const dateMatch = md.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
    if (dateMatch) {
        dateStr = dateMatch[1];
    }
    
    const titleClean = (meta.title || slugBase).replace(/'/g, "\\'").replace(/\n/g, " ");
    const descClean = description.replace(/'/g, "\\'").replace(/\n/g, " ");
    const imgClean = cleanImage.replace(/'/g, "\\'");
    
    // Parse markdown content to JS template string safely
    const contentSafe = md.replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
    
    const objCode = `\n{
  id: '${nextId++}',
  slug: '${slugBase}',
  title: '${titleClean}',
  date: '${dateStr}',
  category: '${category.cat}',
  image: '${imgClean}',
  excerpt: '${descClean}',
  content: \`${contentSafe}\`
},`;
    
    newArticles.push(objCode);
  }
}

if (newArticles.length > 0) {
  const before = tsContent.substring(0, endIndex);
  const after = tsContent.substring(endIndex);
  const newData = newArticles.join('') + '\n' + after;
  fs.writeFileSync(tsPath, before + newData);
  console.log(`Added ${newArticles.length} news articles successfully!`);
} else {
  console.log("No new news articles to add.");
}
