const fs = require('fs');

const t = fs.readFileSync('F:/Nextjs/eurowindowdoor/src/data/news.ts', 'utf8');

const idx = t.indexOf('khu-nghi-duong-ban-mong-sa-pa');
console.log(t.substring(idx - 100, idx + 2000));
