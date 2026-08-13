async function main() {
  const target = process.argv[2] || 'https://eurowindow.biz/tin-tuc';
  const res = await fetch(target, { headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36' } });
  const t = await res.text();
  const links = [...t.matchAll(/href="(https:\/\/eurowindow\.biz\/(?:tin-tuc|tu-van)\/[^"]+\.html)"/g)].map(m => m[1]);
  const unique = [...new Set(links)];
  console.log('total links:', unique.length);
  unique.forEach(u => console.log(u));
  // also find pagination info
  const pages = [...t.matchAll(/href="(https:\/\/eurowindow\.biz\/tin-tuc[^"]*page[^"]*)"/gi)].map(m => m[1]);
  console.log('--- pagination:', [...new Set(pages)].length);
}
main().catch(e => { console.error('ERR', e.message); process.exit(1); });