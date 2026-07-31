const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

if (!fs.existsSync('.env.local')) {
  console.error('.env.local file not found!');
  process.exit(1);
}

const envContent = fs.readFileSync('.env.local', 'utf8');
const lines = envContent.split('\n');

const scratchDir = path.join(process.cwd(), 'scratch');
if (!fs.existsSync(scratchDir)) {
  fs.mkdirSync(scratchDir);
}

const tempFile = path.join(scratchDir, 'temp_val.txt');

const environments = ['production', 'preview', 'development'];

for (const line of lines) {
  const cleanLine = line.trim();
  if (!cleanLine || cleanLine.startsWith('#')) continue;

  const eqIdx = cleanLine.indexOf('=');
  if (eqIdx === -1) continue;

  const key = cleanLine.substring(0, eqIdx).trim();
  const value = cleanLine.substring(eqIdx + 1).trim();

  if (!key || !value) continue;

  // Write value to temp file (without trailing newline to avoid injecting \n into env var)
  fs.writeFileSync(tempFile, value, 'utf8');

  console.log(`Đang đẩy biến môi trường: ${key}...`);

  for (const env of environments) {
    try {
      // Use input redirection to safely pass value without shell expansion issues with '&'
      const cmd = `npx vercel env add ${key} ${env} --yes --force < "${tempFile}"`;
      execSync(cmd, { shell: true, stdio: 'ignore' });
      console.log(`  -> Đẩy thành công lên [${env}]`);
    } catch (err) {
      console.error(`  -> Lỗi khi đẩy lên [${env}]:`, err.message || err);
    }
  }
}

// Clean up temp file
if (fs.existsSync(tempFile)) {
  fs.unlinkSync(tempFile);
}

console.log('Hoàn thành đẩy biến môi trường lên Vercel!');
