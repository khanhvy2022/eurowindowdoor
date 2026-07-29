const fs = require('fs');
const path = require('path');

const appDir = 'F:/Nextjs/eurowindowdoor/src/app';

function walk(dir) {
  const results = [];
  const list = fs.readdirSync(dir);
  for (const f of list) {
    const fp = path.join(dir, f);
    const stat = fs.statSync(fp);
    if (stat.isDirectory()) results.push(...walk(fp));
    else if (f === 'layout.tsx' || f === 'page.tsx') results.push(fp);
  }
  return results;
}

const files = walk(appDir);
const report = [];

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const hasCanonical = content.includes('canonical');
  const hasMeta = content.includes('metadata') || content.includes('generateMetadata');
  const isClient = content.trimStart().startsWith("'use client'");
  const rel = f.replace('F:/Nextjs/eurowindowdoor/src/app/', '').replace(/\\/g, '/');
  report.push({ file: rel, isClient, hasMeta, hasCanonical });
}

report.forEach(r => {
  const canon = r.hasCanonical ? '✅' : '❌ MISSING';
  const meta  = r.hasMeta ? 'Y' : 'N';
  const client = r.isClient ? '(client)' : '(server)';
  console.log(`${r.file.padEnd(55)} ${client.padEnd(10)} meta:${meta}  canonical:${canon}`);
});
