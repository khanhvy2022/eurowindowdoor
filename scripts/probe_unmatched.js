async function main() {
  const slugs = [
    'sinh-vien-dh-kinh-te-quoc-dan-tham-quan-nha-may-eurowindow-va-dinh-huong-nghe-nghiep-cung-eurowindow-holding',
    'eurowindow-22-nam-dong-hanh-cung-nganh-vat-lieu-xay-dung-phat-trien-ben-vung',
    'cua-upvc-eurowindow-giai-phap-so-1-cho-trai-nghiem-song-thuong-luu',
    'kinh-dien-doi-mau-the-he-moi',
    'khai-truong-dau-xuan-2025-chi-nhanh-mien-nam-eurowindow',
    'cua-thong-minh-tuyet-tac-khong-gian-nha-o-duong-dai',
    'eurowindow-ky-ket-hop-tac-chien-luoc-voi-cong-ty-qstone-usa-llc-my',
    'eurowindow-cung-cap-cua-du-an-midori-park-the-ten-binh-duong',
    'eurowindow-nang-tam-dang-cap-biet-thu-nghi-duong-5-sao-mandarin-oriental-da-nang',
    'kinh-dien-thong-minh-ung-dung-hien-dai-cho-khong-gian-song-tien-nghi',
    'eurowindow-16-nam-lien-tiep-dat-danh-hieu-hang-viet-nam-chat-luong-cao-2025',
    'eurowindow-duoc-vinh-danh-tai-vietnam-esg-awards-lan-thu-nhat',
    'vi-sao-kien-truc-su-uu-tien-chon-cua-eurowindow-cho-cong-trinh-cao-cap',
    'crazy-cooperation',
  ];
  const cats = ['tin-tuc-su-kien', 'tin-du-an', 'tin-noi-bo', 'tin-khuyen-mai', 'tuyen-dung', 'tu-van'];
  const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120';

  for (const slug of slugs) {
    let found = null;
    for (const cat of cats) {
      const url = `https://eurowindow.biz/${cat === 'tu-van' ? 'tu-van' : 'tin-tuc/' + cat}/${slug}.html`;
      try {
        const res = await fetch(url, { headers: { 'user-agent': UA }, redirect: 'manual' });
        if (res.status === 200) {
          const t = await res.text();
          const title = (t.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
          if (!t.includes('404 Not Found') && !t.includes('Không tìm thấy')) {
            found = { url, status: res.status, title: title.trim().slice(0, 60) };
            break;
          }
        }
      } catch (e) {}
    }
    console.log(slug, '=>', found ? JSON.stringify(found) : 'NOT FOUND');
  }
}
main();