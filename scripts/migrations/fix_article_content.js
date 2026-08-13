const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { extractCssContent, cleanHtml } = require('../content_cleaner');

const ROOT = path.join(__dirname, '..', '..');
const env = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8');
const m = env.match(/^MONGODB_URI=(.*)$/m);
const MONGODB_URI = m ? m[1].trim() : process.env.MONGODB_URI;

const DRY_RUN = process.argv.includes('--apply') ? false : true;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

const verified = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'verified-matches.json'), 'utf8'))
  .filter(e => e.url && e.how === 'exact');

async function fetchCss(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (res.status !== 200) throw new Error('HTTP ' + res.status);
  const html = await res.text();
  const inner = extractCssContent(html);
  if (!inner) throw new Error('NO css-content');
  return inner;
}

function extractExcerpt(cleaned, fallbackTitle) {
  const p = cleaned.match(/<p><span>([^<]*)<\/span><\/p>/) || cleaned.match(/<p>([^<]*)<\/p>/);
  if (p && p[1]) return p[1].trim().slice(0, 280);
  return (fallbackTitle || '').slice(0, 280);
}

function localImageExists(image) {
  if (!image || !image.startsWith('/images/')) return true;
  return fs.existsSync(path.join(ROOT, 'public', image));
}

async function main() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  const col = mongoose.connection.db.collection('articles');
  console.log('MODE:', DRY_RUN ? 'DRY RUN (no writes)' : 'APPLY');
  const report = [];
  let ok = 0, fail = 0;
  for (const v of verified) {
    const article = await col.findOne({ slug: v.slug });
    if (!article) { report.push({ slug: v.slug, status: 'NO_DB_ARTICLE' }); fail++; continue; }
    try {
      const inner = await fetchCss(v.url);
      const cleaned = cleanHtml(inner);
      if (cleaned.length < 200) throw new Error('cleaned too short (' + cleaned.length + ')');
      const imgCount = (cleaned.match(/<img/gi) || []).length;
      const upd = { content: cleaned };
      const excerpt = extractExcerpt(cleaned, article.title);
      if (excerpt) upd.excerpt = excerpt;
      if (!localImageExists(article.image)) {
        const firstImg = (cleaned.match(/<img[^>]*src="([^"]*)"/i) || [])[1];
        if (firstImg) upd.image = firstImg.startsWith('/') ? firstImg : firstImg;
      }
      if (!DRY_RUN) {
        await col.updateOne({ _id: article._id }, { $set: upd });
      }
      report.push({ slug: v.slug, status: 'OK', url: v.url, imgCount, oldLen: article.content.length, newLen: cleaned.length, imgFallback: !!upd.image });
      ok++;
    } catch (e) {
      report.push({ slug: v.slug, status: 'FAIL', url: v.url, err: e.message });
      fail++;
    }
    await new Promise(r => setTimeout(r, 120));
  }
  const out = path.join(__dirname, '..', 'fix-report.json');
  fs.writeFileSync(out, JSON.stringify({ mode: DRY_RUN ? 'dry' : 'apply', ok, fail, report }, null, 2));
  console.log('OK:', ok, 'FAIL:', fail);
  report.forEach(r => console.log(r.status, '|', r.slug.slice(0, 50), r.status === 'OK' ? `| imgs=${r.imgCount} ${r.oldLen}->${r.newLen} ${r.imgFallback ? 'imgFallback' : ''}` : (r.err || '')));
  console.log('report ->', out);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });