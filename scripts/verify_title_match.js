const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const m = env.match(/^MONGODB_URI=(.*)$/m);
const MONGODB_URI = m ? m[1].trim() : process.env.MONGODB_URI;
const links = JSON.parse(fs.readFileSync(path.join(__dirname, 'eurowindow-all-links.json'), 'utf8'));
const urls = links.all;

function norm(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'd')
    .replace(/[^a-z0-9]+/g, ' ').trim();
}

function similarity(a, b) {
  const wa = new Set(a.split(/\s+/).filter(w => w.length > 2));
  const wb = new Set(b.split(/\s+/).filter(w => w.length > 2));
  if (wa.size === 0 || wb.size === 0) return 0;
  let inter = 0;
  for (const w of wa) if (wb.has(w)) inter++;
  return inter / Math.sqrt(wa.size * wb.size);
}

async function fetchTitle(url) {
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
    if (res.status !== 200) return null;
    const t = await res.text();
    const title = (t.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
    return title.trim();
  } catch (e) { return null; }
}

const UA = 'Mozilla/5.0';

async function main() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection.db;
  const col = db.collection('articles');
  const arts = await col.find({}).sort({ createdAt: -1 }).toArray();
  const results = [];
  let i = 0;
  for (const a of arts) {
    i++;
    // candidate URLs: all urls whose normalized slug shares >=3 significant words with article slug
    const articleNorm = norm(a.slug.replace(/-/g, ' '));
    const words = articleNorm.split(/\s+/).filter(w => w.length > 3).slice(0, 6);
    const cands = [];
    for (const u of urls) {
      const us = norm(u.split('/').pop().replace('.html', '').replace(/[-\u00a0]+/g, ' '));
      let score = 0;
      for (const w of words) if (us.includes(w)) score++;
      if (score >= Math.min(3, words.length)) cands.push(u);
    }
    // fetch titles for up to 4 candidates
    const scored = [];
    for (const u of cands.slice(0, 4)) {
      const t = await fetchTitle(u);
      if (t) {
        const sim = similarity(norm(a.title), norm(t));
        scored.push({ u, t: t.slice(0, 80), sim });
      }
    }
    scored.sort((x, y) => y.sim - x.sim);
    results.push({ slug: a.slug, title: a.title.slice(0, 70), best: scored[0] || null, nCands: cands.length });
    console.log(`${i}/${arts.length} ${a.slug} -> ${scored[0] ? scored[0].u + ' sim=' + scored[0].sim.toFixed(2) : 'NONE'}`);
    await new Promise(r => setTimeout(r, 150));
  }
  fs.writeFileSync('scripts/title-match-results.json', JSON.stringify(results, null, 2));
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });