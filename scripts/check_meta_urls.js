const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const m = env.match(/^MONGODB_URI=(.*)$/m);
const MONGODB_URI = m ? m[1].trim() : process.env.MONGODB_URI;
const crawlRoot = path.join(__dirname, '..', 'docs', 'research', 'crawled_data');

async function main() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection.db;
  const col = db.collection('articles');
  const arts = await col.find({}).sort({ createdAt: -1 }).toArray();

  const crawled = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'scripts', 'match-report.json'), 'utf8'));
  const bySlug = new Map(crawled.map(r => [r.slug, r]));

  for (const a of arts) {
    // Find meta file for this slug
    let metaUrl = null, metaPath = null;
    for (const dir of fs.readdirSync(crawlRoot)) {
      const mp = path.join(crawlRoot, dir, `${a.slug}_meta.json`);
      if (fs.existsSync(mp)) { metaPath = mp; try { metaUrl = JSON.parse(fs.readFileSync(mp, 'utf8')).url || null; } catch(e){} break; }
    }
    const match = bySlug.get(a.slug);
    const murl = match ? match.url : null;
    console.log(JSON.stringify({ slug: a.slug, metaUrl, murl, same: metaUrl === murl, category: a.category, date: a.date }));
  }
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });