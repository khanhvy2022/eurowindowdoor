async function main() {
  const url = process.argv[2] || 'https://eurowindow.biz/tu-van/cua-cach-am-cach-nhiet-giai-phap-2-trong-1-cho-do-thi.html';
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36' } });
  const t = await res.text();
  // find the article body container
  const needle = 'css-content">';
  let idx = t.indexOf(needle);
  let count = 0;
  while (idx !== -1) { count++; idx = t.indexOf(needle, idx + needle.length); }
  console.log('html len', t.length, 'needle count', count);
  idx = t.indexOf(needle);
  if (idx === -1) { console.log('NO css-content'); return; }
  // Read a large slice after css-content div
  const start = idx + needle.length;
  const slice = t.slice(start, start + 12000);
  console.log('=== SLICE START ===');
  console.log(slice);
}

main().catch(e => { console.error('FETCH ERR', e); process.exit(1); });