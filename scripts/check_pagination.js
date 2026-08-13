async function main() {
  const res = await fetch('https://eurowindow.biz/tin-tuc', { headers: { 'user-agent': 'Mozilla/5.0' } });
  const t = await res.text();
  // pagination patterns
  const pager = [...t.matchAll(/href="([^"]+)"[^>]*>\s*(\d+)\s*</g)].map(m => ({ url: m[1], page: m[2] }));
  console.log('numeric pager:', JSON.stringify(pager.slice(0, 20)));
  const anyPage = [...t.matchAll(/href="([^"]*page[^"]*)"/gi)].map(m => m[1]);
  console.log('page-ish:', JSON.stringify([...new Set(anyPage)].slice(0, 20)));
  const next = t.match(/rel="next"/g);
  console.log('rel=next count:', next ? next.length : 0);
  // Look for pagination container class
  const i = t.indexOf('pagination');
  console.log('pagination idx:', i);
  if (i > -1) console.log(t.slice(i - 200, i + 800));
}
main().catch(e => { console.error('ERR', e.message); process.exit(1); });