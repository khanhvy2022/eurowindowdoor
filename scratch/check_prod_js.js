const https = require('https');

https.get('https://eurowindowdoor.com/chat', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const scripts = [];
    let start = 0;
    while (true) {
      const idx = data.indexOf('/_next/static/chunks/', start);
      if (idx === -1) break;
      const end = data.indexOf('"', idx);
      if (end !== -1) {
        scripts.push(data.substring(idx, end));
      }
      start = idx + 1;
    }
    console.log('Script chunks found:', scripts.length);
    let checked = 0;
    scripts.forEach(s => {
      const url = 'https://eurowindowdoor.com' + s;
      https.get(url, (jsRes) => {
        let js = '';
        jsRes.on('data', chunk => js += chunk);
        jsRes.on('end', () => {
          if (js.includes('CLIENT_QUERY_CACHE') || js.includes('getReader') || js.includes('abortControllerRef')) {
            console.log('FOUND NEW CODE IN:', url);
          }
          checked++;
          if (checked === scripts.length) console.log('Done searching.');
        });
      }).on('error', e => {});
    });
  });
}).on('error', e => console.error(e.message));
