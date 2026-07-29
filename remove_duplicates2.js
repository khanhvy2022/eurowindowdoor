const fs = require('fs');
const file = 'F:/Nextjs/eurowindowdoor/src/data/news.ts';
let t = fs.readFileSync(file, 'utf8');

const duplicates = [
  'eurowindow-khuyen-mai-nhan-dip-vietbuild-don-cua-tan-gia-nhan-qua-nghi-duong',
  'giai-phap-cach-nhiet-eurowindow-he-2026',
  'phat-dong-cuoc-thi-eurowindow-noi-lam-viec-toi-yeu',
  'the-le-chuong-trinh-khuyen-mai-%E2%80%9Cdau-tu-xung-tam-%E2%80%93-uu-dai-cuc-pham%E2%80%9D'
];

for (const slug of duplicates) {
  // Find the first and second occurrence
  const regex = new RegExp(`{\\s*id:[^}]+slug:\\s*['"]${slug}['"][\\s\\S]*?\\n\\s*},?`, 'g');
  
  let match1 = regex.exec(t);
  let match2 = regex.exec(t);
  
  if (match1 && match2) {
    // Remove the second occurrence
    t = t.substring(0, match2.index) + t.substring(match2.index + match2[0].length);
  }
}

fs.writeFileSync(file, t);
console.log('Removed second occurrences.');
