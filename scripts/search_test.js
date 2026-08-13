async function main() {
  const terms = process.argv.slice(2);
  if (terms.length === 0) terms.push('Khai Trương Văn Phòng Kinh Doanh Tại Phú Yên');
  for (const term of terms) {
    const q = encodeURIComponent(term);
    const url = `https://eurowindow.biz/tim-kiem.html?tu-khoa=${q}`;
    // try search endpoint
    try {
      const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
      const t = await res.text();
      const links = [...t.matchAll(/href="(https:\/\/eurowindow\.biz\/(?:tin-tuc|tu-van)\/[^"]+\.html)"/g)].map(m => m[1]);
      const found = t.includes('không tìm thấy') || t.includes('không có kết quả');
      console.log(term, '=>', res.status, 'links:', links.length, 'noresult:', found);
      [...new Set(links)].slice(0, 5).forEach(l => console.log('   ', l));
    } catch (e) { console.log(term, 'ERR', e.message); }
  }
}
main();