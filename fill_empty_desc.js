const fs = require('fs');

const tsPath = 'F:/Nextjs/eurowindowdoor/src/data/projects.ts';
let tsContent = fs.readFileSync(tsPath, 'utf8');

// We will use regex to find projects with empty descriptions and fill them with a default text that includes the project name.
// A regex to match a project block:
const regex = /name: '(.*?)',\s*category: '(.*?)',\s*categoryLabel: '(.*?)',\s*location: '(.*?)',\s*image: '(.*?)',\s*year: '(.*?)',\s*description: '',/g;

tsContent = tsContent.replace(regex, (match, name, cat, catLabel, loc, img, year) => {
    // Determine a nice short description based on category
    let typeText = "công trình";
    if (cat === "quoc-gia") typeText = "công trình cấp quốc gia";
    if (cat === "chung-cu") typeText = "tòa nhà - chung cư";
    if (cat === "dan-dung") typeText = "dự án";

    const desc = `${name} là một ${typeText} tiêu biểu sử dụng các sản phẩm cửa và vách kính Eurowindow cao cấp, kiến tạo không gian kiến trúc hiện đại, sang trọng và đảm bảo tiêu chuẩn chất lượng vượt trội.`;
    
    return `name: '${name}',
    category: '${cat}',
    categoryLabel: '${catLabel}',
    location: '${loc}',
    image: '${img}',
    year: '${year}',
    description: '${desc}',`;
});

fs.writeFileSync(tsPath, tsContent);
console.log('Filled empty descriptions!');
