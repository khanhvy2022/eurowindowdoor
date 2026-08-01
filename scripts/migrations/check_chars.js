const fs = require('fs');
const t = fs.readFileSync('F:/Nextjs/eurowindowdoor/src/data/news.ts', 'utf8');
const idx = t.indexOf('content: `<p className="text-center');
if (idx === -1) {
  console.log("NOT FOUND");
} else {
  console.log(Array.from(t.substring(idx, idx + 40)).map(c => [c, c.charCodeAt(0)]));
}
