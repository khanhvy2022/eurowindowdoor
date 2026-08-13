const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const env = fs.readFileSync(path.join(__dirname, '..', '..', '.env.local'), 'utf8');
const m = env.match(/^MONGODB_URI=(.*)$/m);
const MONGODB_URI = m ? m[1].trim() : process.env.MONGODB_URI;

const crawlRoot = path.join(__dirname, '..', '..', 'docs', 'research', 'crawled_data');

function listCrawled(base) {
  const out = new Set();
  if (!fs.existsSync(base)) return out;
  for (const dir of fs.readdirSync(base)) {
    const full = path.join(base, dir);
    if (fs.statSync(full).isDirectory()) {
      for (const f of fs.readdirSync(full)) {
        if (f.endsWith('.md')) out.add(f.replace('.md', ''));
      }
    } else if (full.endsWith('.md')) out.add(full.replace(/\\/g, '/').split('/').pop().replace('.md', ''));
  }
  return out;
}
const crawled = listCrawled(crawlRoot);

async function main() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection.db;
  const col = db.collection('articles');
  const arts = await col.find({}).sort({ createdAt: -1 }).toArray();
  const report = [];
  for (const a of arts) {
    const c = a.content || '';
    const hasImgHtml = c.includes('<img');
    const hasMarkdownImg = /!\[[^\]]*\]\(/.test(c);
    const looksJunk = !hasImgHtml && !hasMarkdownImg && !c.includes('<p') && !c.includes('<h');
    report.push({ slug: a.slug, title: a.title.slice(0, 60), hasCrawled: crawled.has(a.slug), hasImg: hasImgHtml || hasMarkdownImg, plainTextOnly: looksJunk, len: c.length });
  }
  console.log('crawled set size:', crawled.size);
  report.forEach(r => console.log(JSON.stringify(r)));
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });