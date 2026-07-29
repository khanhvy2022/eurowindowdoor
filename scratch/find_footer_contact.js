const fs = require('fs');
const content = fs.readFileSync('src/data/news.ts', 'utf8');

// Find articles containing footer contact pattern
const articleBlocks = content.split(/\{\s*id:\s*['"]\d+['"]/);
for (let i = 1; i < articleBlocks.length; i++) {
  const block = articleBlocks[i];
  const titleMatch = block.match(/title:\s*"([^"]{1,80})"/);
  const title = titleMatch ? titleMatch[1] : `Article ${i}`;
  
  const hasCskhhn = block.includes('cskhhn@eurowindowdoor');
  const hasThangtq2 = block.includes('thangtq2@eurowindow');
  const hasExport = block.includes('export@eurowindowdoor');
  const hasDuAn = block.includes('Dự án quốc tế và xuất khẩu');
  const hasChamSoc = block.includes('Chăm sóc khách hàng');
  
  if (hasCskhhn || hasThangtq2 || hasExport || hasDuAn || hasChamSoc) {
    console.log(`Article: "${title.substring(0,60)}"`);
    if (hasThangtq2) console.log('  - has thangtq2@eurowindow');
    if (hasCskhhn) console.log('  - has cskhhn@eurowindowdoor');
    if (hasExport) console.log('  - has export@eurowindowdoor');
    if (hasDuAn) console.log('  - has "Dự án quốc tế và xuất khẩu"');
    if (hasChamSoc) console.log('  - has "Chăm sóc khách hàng"');
    
    // Show snippet around first occurrence
    const patterns = ['cskhhn', 'thangtq2', 'export@eurowindow', 'Dự án quốc tế'];
    for (const p of patterns) {
      const idx = block.indexOf(p);
      if (idx !== -1) {
        const snippet = block.substring(Math.max(0, idx - 100), idx + 200);
        console.log('  Snippet:', JSON.stringify(snippet.replace(/\\n/g, '\n').substring(0, 200)));
        break;
      }
    }
    console.log('');
  }
}
console.log('Done.');
