const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const m = env.match(/^MONGODB_URI=(.*)$/m);
const MONGODB_URI = m ? m[1].trim() : process.env.MONGODB_URI;
const links = JSON.parse(fs.readFileSync(path.join(__dirname, 'eurowindow-all-links.json'), 'utf8'));
const urls = links.all;

const UA = 'Mozilla/5.0';

function norm(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'd')
    .replace(/[“”"„]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function words(s) {
  const n = norm(s);
  const list = n.split(/\s+/).filter(w => w.length > 3);
  return new Set(list);
}

function jaccard(a, b) {
  const A = words(a), B = words(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter++;
  return inter / (A.size + B.size - inter);
}

async function fetchInfo(url) {
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA } });
    if (res.status !== 200) return null;
    const html = await res.text();
    const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '';
    const og = (html.match(/property="og:title"\s+content="([^"]*)"/i) || [])[1] || '';
    const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1] || '';
    const clean = s => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    return {
      h1: clean(h1),
      og: clean(og),
      title: clean(title),
      hasCss: html.includes('css-content'),
    };
  } catch (e) { return null; }
}

async function main() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  const col = mongoose.connection.db.collection('articles');
  const arts = await col.find({}).sort({ createdAt: -1 }).toArray();

  // authoritative matches from match-report.json
  const known = {};
  for (const e of require('./match-report.json')) if (e.url) known[e.slug] = e.url;

  const final = [];
  let checked = 0;
  for (const a of arts) {
    checked++;
    if (known[a.slug]) {
      final.push({ slug: a.slug, url: known[a.slug], how: 'exact', dbTitle: a.title });
      continue;
    }
    // candidate: urls whose normalized slug shares >=3 significant words with DB slug
    const slugWords = norm(a.slug.replace(/-/g, ' ')).split(/\s+/).filter(w => w.length > 3).slice(0, 6);
    const cands = [];
    for (const u of urls) {
      const us = norm(u.split('/').pop().replace('.html', '').replace(/[-\u00a0]+/g, ' '));
      let score = 0;
      for (const w of slugWords) if (us.includes(w)) score++;
      if (score >= Math.min(3, slugWords.length)) cands.push(u);
    }
    let best = null;
    for (const u of cands.slice(0, 4)) {
      const info = await fetchInfo(u);
      if (!info || !info.hasCss) continue;
      const simH1 = jaccard(a.title, info.h1 || a.title);
      const simOg = jaccard(a.title, info.og || a.title);
      const simT = jaccard(a.title, info.title || a.title);
      const sim = Math.max(simH1, simOg, simT);
      if (sim >= 0.78 && (!best || sim > best.sim)) {
        best = { u, sim, h1: info.h1.slice(0, 80), og: info.og.slice(0, 80) };
      }
    }
    if (best) final.push({ slug: a.slug, url: best.u, how: 'fuzzy', sim: best.sim, dbTitle: a.title, h1: best.h1, og: best.og });
    else final.push({ slug: a.slug, url: null, how: 'none', dbTitle: a.title });
    await new Promise(r => setTimeout(r, 120));
  }
  const matched = final.filter(f => f.url);
  const unmatched = final.filter(f => !f.url);
  console.log('verified:', matched.length, '(exact:', matched.filter(f => f.how === 'exact').length, '| fuzzy:', matched.filter(f => f.how === 'fuzzy').length, ')');
  console.log('unmatched:', unmatched.length);
  console.log('--- FUZZY ---');
  matched.filter(f => f.how === 'fuzzy').forEach(f => console.log(`${f.sim.toFixed(2)} ${f.slug} => ${f.url}`));
  console.log('--- UNMATCHED SLUGS ---');
  unmatched.forEach(f => console.log(' ', f.slug));
  fs.writeFileSync(path.join(__dirname, 'verified-matches.json'), JSON.stringify(final, null, 2));
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });