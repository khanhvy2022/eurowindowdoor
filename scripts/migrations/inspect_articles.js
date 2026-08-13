const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const env = fs.readFileSync(path.join(__dirname, '..', '..', '.env.local'), 'utf8');
const m = env.match(/^MONGODB_URI=(.*)$/m);
const MONGODB_URI = m ? m[1].trim() : process.env.MONGODB_URI;

async function main() {
  if (!MONGODB_URI) { console.error('NO URI'); process.exit(1); }
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection.db;
  const col = db.collection('articles');
  const count = await col.countDocuments();
  console.log('Total articles:', count);
  const arts = await col.find({}).limit(5).toArray();
  arts.forEach(a => {
    console.log('---');
    console.log('title:', a.title);
    console.log('slug:', a.slug);
    console.log('date:', a.date);
    console.log('category:', a.category);
    console.log('image:', a.image);
    console.log('content[:300]:', (a.content || '').slice(0, 300));
  });
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });