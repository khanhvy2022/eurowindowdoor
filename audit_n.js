const fs = require('fs');
const code = fs.readFileSync('F:/Nextjs/eurowindowdoor/src/data/news.ts', 'utf8');

// Check standalone 'n' between tags e.g. `>n<`, `>nn<`
const tagNMatches = code.match(/>n+<|\/>n+<|<\/p>n+<p>|>\s*n+\s*</g) || [];
console.log("Standalone tag 'n' count:", tagNMatches.length);

// Check 'n' stiction between Vietnamese words e.g. `[a-nốớỗổồơớờợởôốồổỗộâấầẩẫậáàảãạđéèẻẽẹíìỉĩịóòỏõọúùủũụứừửữựýỳỷỹỵ]n[a-zàáảãạâấầẩẫậăắằẳẵặđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờợởúpùủũụưứừửữựýỳỷỹỵ]/gi
const vnChar = '[a-zA-ZàáảãạâấầẩẫậăắằẳẵặđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờợởúùủũụưứừửữựýỳỷỹỵA-ZÀÁẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶĐÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỢỞÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ]';
const vnRegex = new RegExp(`(${vnChar})n(${vnChar})`, 'g');

let vnMapped = [];
let m;
while ((m = vnRegex.exec(code)) !== null) {
  // Exclude common English/Vietnamese valid words containing 'n' like 'nh', 'ng', 'nd', 'nc', 'nt', etc. if they are part of a real word
  // Wait, let's sample the matches to see what they are!
  vnMapped.push(`${m[1]}n${m[2]}`);
}

console.log("Sample 'n' stuck between words:", vnMapped.slice(0, 30));
