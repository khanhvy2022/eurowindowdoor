const fs = require('fs');
const t = fs.readFileSync('F:/Nextjs/eurowindowdoor/src/data/news.ts', 'utf8');
const idx = t.indexOf('Eurowindow trúng thầu thi công cửa và vách nhôm kí');
console.log(t.substring(idx, idx + 2000));
