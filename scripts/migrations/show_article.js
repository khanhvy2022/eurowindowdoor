const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const env = fs.readFileSync(path.join(__dirname, '..', '..', '.env.local'), 'utf8');
const m = env.match(/^MONGODB_URI=(.*)$/m);
const MONGODB_URI = m ? m[1].trim() : process.env.MONGODB_URI;

const slug = process.argv[2];
async function main() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection.db;
  const col = db.collection('articles');
  const a = await col.findOne({ slug });
  if (!a) { console.error('NOT FOUND', slug); process.exit(1); }
  console.log('TITLE:', a.title);
  console.log('DATE:', a.date, '| CATEGORY:', a.category, '| IMAGE:', a.image);
  console.log('EXCERPT:', (a.excerpt||'').slice(0,300));
  console.log('=== CONTENT ===');
  console.log(a.content);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });