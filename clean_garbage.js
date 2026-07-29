const fs = require('fs');
const file = 'F:/Nextjs/eurowindowdoor/src/data/news.ts';
let t = fs.readFileSync(file, 'utf8');

// The file contains an array of objects. It's safer to use eval to get the object, modify it, and write it back? No, there are some TS specific things.
// Instead we can use a regex to find the content field and slice it.
const markers = [
    'Chia sẻ:',
    'Tóm tắt với AI:',
    'Đánh giá:',
    'Bình luận (0 Bình luận)',
    'Danh mục tin tức',
    'Đăng ký ngay để nhận tư vấn',
    'Tải thể lệ chương trình',
    'Copyright ©',
    '[![BCT]',
    'Tin tức và Sự kiện',
    'Bản tin Nội bộ',
    'Bài viết đọc nhiều',
    'Chăm sóc khách hàng',
    'Dự án quốc tế và xuất khẩu'
];

t = t.replace(/content:\s*(`|'|")([\s\S]*?)\1(,?)/g, (match, quote, content, comma) => {
    let minIndex = content.length;
    markers.forEach(marker => {
        const idx = content.indexOf(marker);
        if (idx !== -1 && idx < minIndex) {
            minIndex = idx;
        }
    });
    
    if (minIndex < content.length) {
        content = content.substring(0, minIndex);
        // Remove trailing newlines and HTML tags like <br>, <p> if they are empty
        content = content.replace(/(<br\s*\/?>|\s|<p><\/p>)+$/, '');
    }
    return `content: ${quote}${content}${quote}${comma}`;
});

fs.writeFileSync(file, t);
console.log('Cleaned up crawler garbage from news.ts');
