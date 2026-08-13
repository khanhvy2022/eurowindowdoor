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
    .replace(/đ/g, 'd')
    .replace(/á|à|ạ|ả|ã|ă|ắ|ằ|ặ|ẳ|ẵ|â|ấ|ầ|ậ|ẩ|ẫ/g, 'a')
    .replace(/é|è|ẹ|ẻ|ẽ|ê|ế|ề|ệ|ể|ễ/g, 'e')
    .replace(/í|ì|ị|ỉ|ĩ/g, 'i')
    .replace(/ó|ò|ọ|ỏ|õ|ô|ố|ồ|ộ|ổ|ỗ|ơ|ớ|ờ|ợ|ở|ỡ/g, 'o')
    .replace(/ú|ù|ụ|ủ|ũ|ư|ứ|ừ|ự|ử|ữ/g, 'u')
    .replace(/ý|ỳ|ỵ|ỷ|ỹ/g, 'y')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection.db;
  const col = db.collection('articles');
  const arts = await col.find({}).sort({ createdAt: -1 }).toArray();

  for (const a of arts) {
    const maxWords = ['cua-nhom-3-lop-cau-tao-khac-biet-cach-am-uu-viet',
      'cua-cach-am-kinh-hop-eurowindow-cho-khong-gian-song-yen-tinh',
      'vi-sao-kien-truc-su-uu-tien-chon-cua-eurowindow-cho-cong-trinh-cao-cap',
      'kinh-solar-giai-phap-thong-minh-cho-ngoi-nha-hien-dai',
      'eurowindow-duoc-vinh-danh-tai-vietnam-esg-awards-lan-thu-nhat',
      'eurowindow-vinh-danh-trong-top-500-nha-tuyen-dung-hang-dau-viet-nam-nam-2024',
      'eurowindow-khai-truong-van-phong-kinh-doanh-tai-phu-yen',
      'eurowindow-cung-cap-cua-du-an-midori-park-the-ten-binh-duong',
      'eurowindow-ky-ket-hop-tac-chien-luoc-voi-cong-ty-qstone-usa-llc-my',
      'cua-nhom-ew60i-giai-phap-cach-nhiet-va-cach-am-toi-uu-cho-ngoi-nha-ban'];
    // build candidate keywords from the blog slug (remove common company words)
    const slugWords = a.slug.split('-').filter(w => !['eurowindow','cua','va','cho','cua','giap','phap','toi','uu'].includes(w));
    const key = slugWords[0];
    // find urls whose normalized slug contains 3+ of the article's significant words
    const articleNorm = norm(a.slug);
    const words = articleNorm.split('-').filter(w => w.length > 3).slice(0, 6);
    const scoreMatches = [];
    for (const u of urls) {
      const us = norm(u.split('/').pop().replace('.html',''));
      let score = 0;
      for (const w of words) if (us.includes(w)) score++;
      if (score >= Math.min(3, words.length)) scoreMatches.push({ u, us, score });
    }
    scoreMatches.sort((x, y) => y.score - x.score);
    console.log('\n' + a.slug);
    scoreMatches.slice(0, 3).forEach(x => console.log('   ', x.score, x.u));
  }
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });