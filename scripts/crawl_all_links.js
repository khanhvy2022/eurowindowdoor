const fs = require('fs');

const CATS = [
  { name: 'tin-tuc-su-kien', max: 103 },
  { name: 'tin-du-an', max: 37 },
  { name: 'tin-noi-bo', max: 67 },
  { name: 'tin-khuyen-mai', max: 3 },
  { name: 'tuyen-dung', max: 3 },
  { name: 'tu-van', max: 55 },
];

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

async function fetchPage(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': UA } });
      if (res.status === 429) { await sleep(3000); continue; }
      return await res.text();
    } catch (e) { await sleep(1500); }
  }
  return null;
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  const allUrls = new Set();
  const perCat = {};
  for (const cat of CATS) {
    const catUrls = new Set();
    for (let page = 1; page <= cat.max; page++) {
      const url = page === 1 ? `https://eurowindow.biz/${cat.name === 'tu-van' ? 'tu-van' : 'tin-tuc/' + cat.name}` : `https://eurowindow.biz/${cat.name === 'tu-van' ? 'tu-van' : 'tin-tuc/' + cat.name}?page=${page}`;
      const t = await fetchPage(url);
      if (!t) { console.log('FAIL', cat.name, page); break; }
      const links = [...t.matchAll(/href="(https:\/\/eurowindow\.biz\/(?:tin-tuc|tu-van)\/[^"]+?\.html)"/g)].map(m => m[1]);
      for (const l of links) { catUrls.add(l); allUrls.add(l); }
      if (page % 10 === 0) console.log(`[${cat.name}] page ${page}, accumulated ${catUrls.size}`);
      await sleep(250);
    }
    perCat[cat.name] = [...catUrls].sort();
    console.log(`DONE ${cat.name}: ${catUrls.size} urls`);
  }
  fs.writeFileSync('scripts/eurowindow-all-links.json', JSON.stringify({ all: [...allUrls].sort(), perCat }, null, 2));
  console.log('TOTAL all:', allUrls.size);
}

main().catch(e => { console.error(e); process.exit(1); });