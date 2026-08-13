const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

function extractCssContent(html) {
  // locate the FIRST css-content class div
  const re = /class="[^"]*css-content[^"]*"/;
  const m = html.match(re);
  if (!m) return null;
  const startTagEnd = m.index + m[0].length;
  // find opening '>' after class
  const gt = html.indexOf('>', startTagEnd);
  if (gt === -1) return null;
  const depthStart = gt + 1;
  // walk and count <div ...> and </div>
  let depth = 1;
  let i = depthStart;
  const tokens = [];
  const openRe = /<div(?=[\s>])/gi;
  const closeRe = /<\/div\s*>/gi;
  let captures = [];
  openRe.lastIndex = depthStart;
  closeRe.lastIndex = depthStart;
  let closeIdx = closeRe.exec(html);
  let openIdx = openRe.exec(html);
  while (closeIdx) {
    if (openIdx && openIdx.index < closeIdx.index) {
      depth++; captures.push(['open', openIdx.index]);
      openIdx = openRe.exec(html);
    } else {
      depth--;
      if (depth === 0) {
        return { inner: html.slice(depthStart, closeIdx.index), raw: html.slice(0, closeIdx.index + 7) };
      }
      closeIdx = closeRe.exec(html);
    }
  }
  return null;
}

async function main() {
  const url = process.argv[2];
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  const t = await res.text();
  const out = extractCssContent(t);
  if (!out) { console.log('NO css-content'); return; }
  console.log('=== INNER HTML LEN:', out.inner.length, '===');
  const fs = require('fs');
  fs.writeFileSync('scripts/sample_css_content.html', out.inner);
  // print first 4000 chars
  console.log(out.inner.slice(0, 4000));
}
main().catch(e => { console.error(e); process.exit(1); });