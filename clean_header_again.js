const fs = require('fs');
const file = 'F:/Nextjs/eurowindowdoor/src/data/news.ts';
let t = fs.readFileSync(file, 'utf8');

// Replace remaining headers
t = t.replace(/content:\s*(`|'|")([\s\S]*?)\1(,?)/g, (match, quote, content, comma) => {
    if (content.includes('GIỚI THIỆU') && (content.includes('* VN') || content.includes('[Nhận tư vấn]'))) {
        // This is a crawler header
        const marker = '[ Trang chủ ](https://eurowindow.biz)';
        const idx = content.indexOf(marker);
        if (idx !== -1 && idx < 3000) {
            // Find the start of actual content (starts with # or something)
            // It could be `# `, so let's try finding `# `
            let cutIdx = content.indexOf('\\n# ', idx);
            if (cutIdx === -1) cutIdx = content.indexOf('\\r\\n# ', idx);
            
            if (cutIdx !== -1 && cutIdx < 4000) {
                // If we found `# `, start from there
                content = content.substring(cutIdx + (content.includes('\\r\\n# ') ? 2 : 1));
            } else {
                // Fallback to cutting after double newline
                let nIdx = content.indexOf('\\n\\n', idx);
                if (nIdx === -1) nIdx = content.indexOf('\\r\\n\\r\\n', idx);
                if (nIdx !== -1) {
                    content = content.substring(nIdx + (content.includes('\\r\\n') ? 4 : 2));
                }
            }
        }
    }
    return `content: ${quote}${content}${quote}${comma}`;
});

fs.writeFileSync(file, t);
console.log('Cleaned header again');
