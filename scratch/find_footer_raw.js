const fs = require('fs');
const content = fs.readFileSync('src/data/news.ts', 'utf8');

// Search for footer patterns in raw content field
const emailRegex = /thangtq2|cskhhn|export@eurowindow|Dự án quốc tế và xuất khẩu|Chăm sóc khách hàng/g;
let m;
while ((m = emailRegex.exec(content)) !== null) {
  const snippet = content.substring(Math.max(0, m.index - 200), m.index + 200);
  console.log('MATCH at', m.index, ':', JSON.stringify(m[0]));
  console.log('Context:', snippet.replace(/\\n/g, '\n').substring(0, 300));
  console.log('---');
}
