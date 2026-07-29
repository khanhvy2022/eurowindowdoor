const fs = require('fs');
const ts = require('typescript');

const content = fs.readFileSync('src/data/news.ts', 'utf8');

// We'll just parse the TS AST or transpile it.
// Actually, let's just transpile it to JS and run it.
const jsCode = ts.transpileModule(content, {
  compilerOptions: { module: ts.ModuleKind.CommonJS }
}).outputText;

fs.writeFileSync('scratch/temp_news.js', jsCode);
console.log("Transpiled to temp_news.js");
