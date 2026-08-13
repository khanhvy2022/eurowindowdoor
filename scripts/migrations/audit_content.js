const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const env = fs.readFileSync(path.join(__dirname, '..', '..', '.env.local'), 'utf8');
const m = env.match(/^MONGODB_URI=(.*)$/m);
const MONGODB_URI = m ? m[1].trim() : process.env.MONGODB_URI;

async function main() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection.db;
  const col = db.collection('articles');
  const arts = await col.find({}).sort({ createdAt: -1 }).toArray();
  for (const a of arts) {
    const c = a.content || '';
    const imgCount = (c.match(/<img\b/g) || []).length;
    const mdImgCount = (c.match(/!\[/g) || []).length;
    const httpImgs = [...c.matchAll(/<img[^>]*src="([^"]+)"/g)].map(mm => mm[1]).filter(s => !s || s.includes('default_image') || s.includes('placeholder'));
    const hasPtag = c.includes('<p');
    const newlines = (c.match(/\n/g) || []).length;
    console.log(JSON.stringify({
      slug: a.slug,
      len: c.length,
      imgTags: imgCount,
      mdImgs: mdImgCount,
      hasP: hasPtag,
      newlines,
      firstLine: c.slice(0, 80).replace(/\n/g, '\\n'),
      brokenImgs: httpImgs.length
    }));
  }
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });