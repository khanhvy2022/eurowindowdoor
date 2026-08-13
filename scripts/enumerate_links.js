async function main() {
  const cats = [
    'https://eurowindow.biz/tin-tuc/tin-tuc-su-kien',
    'https://eurowindow.biz/tin-tuc/tin-du-an',
    'https://eurowindow.biz/tin-tuc/tin-noi-bo',
    'https://eurowindow.biz/tin-tuc/tin-khuyen-mai',
    'https://eurowindow.biz/tin-tuc/tuyen-dung',
    'https://eurowindow.biz/tu-van',
  ];
  const seen = new Set();
  for (const cat of cats) {
    try {
      const res = await fetch(cat, { headers: { 'user-agent': 'Mozilla/5.0' } });
      const t = await res.text();
      const links = [...t.matchAll(/href="(https:\/\/eurowindow\.biz\/(?:tin-tuc|tu-van)\/[^"]+\.html)"/g)].map(m => m[1]);
      for (const l of links) seen.add(l);
      // discover pagination URLs (page=N)
      const pagers = [...t.matchAll(/href="([^"]*page=[^"]*)"/gi)].map(m => m[1]).filter(u => u.includes('eurowindow.biz'));
      console.log(cat, '->', links.length, 'links; pages:', JSON.stringify([...new Set(pagers)].slice(0,10)));
    } catch (e) { console.log(cat, 'ERR', e.message); }
  }
  console.log('TOTAL unique:', seen.size);
  fs = typeof fs === 'undefined' ? require('fs') : fs;
  fs.writeFileSync('scripts/eurowindow-all-links.txt', [...seen].sort().join('\n'));
}
main().catch(e => { console.error(e); process.exit(1); });