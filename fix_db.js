const fs = require('fs');
let code = fs.readFileSync('src/app/api/chat/route.ts', 'utf8');
code = code.replace(/import \{ connectToDatabase \} from '@\/app\/utils\/mongodb';/g, `import connectToDatabase from '@/lib/db';\nimport mongoose from 'mongoose';`);
code = code.replace(/const \{ db \} = await connectToDatabase\(\);/g, `await connectToDatabase();\n      const db = mongoose.connection.db;`);
code = code.replace(/if \(!db\) \{\n          throw new Error\('Database connection failed'\);\n        \}/g, `if (!db) { throw new Error('Database connection failed'); }`); // Handle any db check if needed
fs.writeFileSync('src/app/api/chat/route.ts', code);
console.log('Fixed DB imports');
