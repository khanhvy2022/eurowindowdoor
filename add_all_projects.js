const fs = require('fs');
const path = require('path');

const tsPath = 'F:/Nextjs/eurowindowdoor/src/data/projects.ts';
let tsContent = fs.readFileSync(tsPath, 'utf8');

const categories = [
  { dir: 'cong-trinh-cap-quoc-gia', cat: 'quoc-gia', label: 'CÔNG TRÌNH CẤP QUỐC GIA' },
  { dir: 'toa-nha-vp-chung-cu', cat: 'chung-cu', label: 'TÒA NHÀ VP - CHUNG CƯ' },
  { dir: 'cong-trinh-dan-dung', cat: 'dan-dung', label: 'CÔNG TRÌNH DÂN DỤNG' }
];

let nextId = 10;
const newProjects = [];

for (const category of categories) {
  const dataDir = path.join('F:/Nextjs/eurowindowdoor/docs/research/crawled_data', category.dir);
  if (!fs.existsSync(dataDir)) continue;
  
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''));
  
  for (const slugBase of files) {
    const metaPath = path.join(dataDir, `${slugBase}_meta.json`);
    const mdPath = path.join(dataDir, `${slugBase}.md`);
    
    if (!fs.existsSync(metaPath) || !fs.existsSync(mdPath)) continue;
    
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    const md = fs.readFileSync(mdPath, 'utf8');
    
    // Check if already in file
    if (tsContent.includes(`slug: '${slugBase}'`)) {
      console.log(`Skipping ${slugBase}, already exists.`);
      continue;
    }
    
    const image = (meta.images && meta.images.length > 0) ? meta.images[0].src : '/images/placeholder.webp';
    let cleanImage = image.startsWith('http') ? image : `https://eurowindow.biz${image}`;
    if (cleanImage.startsWith('https://eurowindow.bizhttps://eurowindow.biz')) {
      cleanImage = cleanImage.replace('https://eurowindow.bizhttps://eurowindow.biz', 'https://eurowindow.biz');
    }
    
    let description = meta.description || '';
    if (!description) {
        // try to extract from markdown
        const paragraphs = md.split('\n').filter(p => p.trim().length > 50 && !p.startsWith('#') && !p.startsWith('['));
        if (paragraphs.length > 0) {
            description = paragraphs[0].trim();
        }
    }
    
    let location = 'Việt Nam'; // default fallback
    let year = '2023';
    let solution = 'Thi công lắp đặt cửa và vách nhôm kính';
    
    // Clean string literals for JS code
    const titleClean = meta.title.replace(/'/g, "\\'").replace(/\n/g, " ");
    const descClean = description.replace(/'/g, "\\'").replace(/\n/g, " ");
    const imgClean = cleanImage.replace(/'/g, "\\'");
    
    const projCode = `  {
    id: '${nextId}',
    slug: '${slugBase}',
    name: '${titleClean}',
    category: '${category.cat}',
    categoryLabel: '${category.label}',
    location: '${location}',
    image: '${imgClean}',
    year: '${year}',
    description: '${descClean}',
    solution: '${solution}'
  },`;
    
    newProjects.push(projCode);
    nextId++;
  }
}

if (newProjects.length > 0) {
  // Insert at the end of the projectsData array
  const insertionPoint = tsContent.lastIndexOf('];');
  if (insertionPoint !== -1) {
    const before = tsContent.substring(0, insertionPoint);
    const after = tsContent.substring(insertionPoint);
    const newData = newProjects.join('\n') + '\n' + after;
    fs.writeFileSync(tsPath, before + newData);
    console.log(`Added ${newProjects.length} projects successfully!`);
  } else {
    console.log("Could not find the end of projectsData array.");
  }
} else {
  console.log("No new projects to add.");
}
