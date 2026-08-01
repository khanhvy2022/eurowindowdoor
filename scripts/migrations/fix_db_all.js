const fs = require('fs');
const path = require('path');

const fixFile = (filePath) => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  if (!code.includes('@/app/utils/mongodb')) return;
  
  code = code.replace(/import \{ connectToDatabase \} from '@\/app\/utils\/mongodb';/g, `import connectToDatabase from '@/lib/db';\nimport mongoose from 'mongoose';`);
  code = code.replace(/const \{ db \} = await connectToDatabase\(\);/g, `await connectToDatabase();\n      const db = mongoose.connection.db;\n      if (!db) { throw new Error('DB missing'); }`);
  code = code.replace(/const \{ db \} = await connectToDatabase\(\)/g, `await connectToDatabase();\nconst db = mongoose.connection.db;\nif (!db) { throw new Error('DB missing'); }`);
  
  // Some files might just use it without destructuring, let's catch that too if necessary.
  fs.writeFileSync(filePath, code);
  console.log('Fixed', filePath);
};

const getFiles = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
};

const aiGatewayFiles = getFiles('src/lib/ai/gateway');
aiGatewayFiles.forEach(fixFile);
fixFile('src/lib/rag.ts');
fixFile('src/lib/ai/sandbox.ts');
fixFile('src/lib/ai/gateway/knowledge-db.ts');
