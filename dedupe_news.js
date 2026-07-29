const fs = require('fs');
const file = 'F:/Nextjs/eurowindowdoor/src/data/news.ts';
let t = fs.readFileSync(file, 'utf8');

const occurrences = [];
const regex = /id:\s*['"]biz-eurowindow-trung-thau-thi-cong['"]/g;
let match;
while ((match = regex.exec(t)) !== null) {
  occurrences.push(match.index);
}

if (occurrences.length > 1) {
  const secondOcc = occurrences[1];
  t = t.substring(0, secondOcc) + t.substring(secondOcc).replace('biz-eurowindow-trung-thau-thi-cong', 'biz-eurowindow-trung-thau-thi-cong-2');
  fs.writeFileSync(file, t);
  console.log('Fixed duplicate id');
} else {
  console.log('No duplicates found or already fixed');
}
