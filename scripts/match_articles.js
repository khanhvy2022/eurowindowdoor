const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const m = env.match(/^MONGODB_URI=(.*)$/m);
const MONGODB_URI = m ? m[1].trim() : process.env.MONGODB_URI;

const crawlRoot = path.join(__dirname, '..', 'docs', 'research', 'crawled_data');
const links = JSON.parse(fs.readFileSync(path.join(__dirname, 'eurowindow-all-links.json'), 'utf8'));
const urls = links.all;

function normalizeSlug(s) {
  return s.toLowerCase()
    .replace(/%E2%80%93/g, '-')
    .replace(/%E2%80%9C/g, '').replace(/%E2%80%9D/g, '').replace(/%C2%A0/g, ' ')
    .replace(/đ/g, 'd').replace(/Đ/g, 'd')
    .replace(/á|à|ạ|ả|ã/g, 'a').replace(/ă|ắ|ằ|ặ|ẳ|ẵ/g, 'a').replace(/â|ấ|ầ|ậ|ẩ|ẫ/g, 'a')
    .replace(/é|è|ẹ|ẻ|ẽ/g, 'e').replace(/ê|ế|ề|ệ|ể|ễ/g, 'e')
    .replace(/í|ì|ị|ỉ|ĩ/g, 'i')
    .replace(/ó|ò|ọ|ỏ|õ/g, 'o').replace(/ô|ố|ồ|ộ|ổ|ỗ/g, 'o').replace(/ơ|ớ|ờ|ợ|ở|ỡ/g, 'o')
    .replace(/ú|ù|ụ|ủ|ũ/g, 'u').replace(/ư|ứ|ừ|ự|ử|ữ/g, 'u')
    .replace(/ý|ỳ|ỵ|ỷ|ỹ/g, 'y')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();
}

function urlSlug(url) {
  const p = url.replace(/\.html$/, '').split('/').pop();
  return normalizeSlug(decodeURIComponent(p));
}

// Build exact index
const byNorm = new Map();
for (const u of urls) {
  const ns = urlSlug(u);
  if (!byNorm.has(ns)) byNorm.set(ns, u);
}

async function main() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection.db;
  const col = db.collection('articles');
  const arts = await col.find({}).sort({ createdAt: -1 }).toArray();

  const report = [];
  for (const a of arts) {
    // 1. Check crawled_data meta for authoritative URL
    let url = null;
    for (const dir of fs.readdirSync(crawlRoot)) {
      const metaPath = path.join(crawlRoot, dir, `${a.slug}_meta.json`);
      if (fs.existsSync(metaPath)) {
        try { const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8')); if (meta.url) url = meta.url; } catch (e) {}
        break;
      }
    }
    // 2. Fall back to exact normalized slug match
    if (!url) {
      const ns = normalizeSlug(a.slug);
      url = byNorm.get(ns) || null;
    }
    report.push({ slug: a.slug, url });
  }
  const matched = report.filter(r => r.url);
  console.log('DB articles:', arts.length, '| exact/authoritative matched:', matched.length);
  const unmatched = report.filter(r => !r.url);
  console.log('UNMATCHED count:', unmatched.length);
  unmatched.forEach(r => console.log('  NO MATCH:', r.slug));
  fs.writeFileSync('scripts/match-report.json', JSON.stringify(report, null, 2));
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });