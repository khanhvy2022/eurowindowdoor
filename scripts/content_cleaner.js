const fs = require('fs');
const path = require('path');

function extractCssContent(html) {
  const re = /class="[^"]*css-content[^"]*"/;
  const m = html.match(re);
  if (!m) return null;
  const startTagEnd = m.index + m[0].length;
  const gt = html.indexOf('>', startTagEnd);
  if (gt === -1) return null;
  const depthStart = gt + 1;
  let depth = 1;
  const openRe = /<div(?=[\s>])/gi;
  const closeRe = /<\/div\s*>/gi;
  openRe.lastIndex = depthStart;
  closeRe.lastIndex = depthStart;
  let closeIdx = closeRe.exec(html);
  let openIdx = openRe.exec(html);
  while (closeIdx) {
    if (openIdx && openIdx.index < closeIdx.index) {
      depth++;
      openIdx = openRe.exec(html);
    } else {
      depth--;
      if (depth === 0) return html.slice(depthStart, closeIdx.index);
      closeIdx = closeRe.exec(html);
    }
  }
  return null;
}

function cleanHtml(inner) {
  let t = inner;

  // 1. Unwrap tubo-media-item divs → keep inner content
  t = t.replace(/<div class="tubo-media-item"[^>]*>([\s\S]*?)<\/div>/gi, '$1');

  // 2. Strip attributes we don't want on images: keep src, alt, title
  t = t.replace(/<img\b/gi, '<img');
  t = t.replace(/<img([^>]*?)>/gi, (m, attrs) => {
    const src = (attrs.match(/\bsrc="([^"]*)"/i) || [])[1] || '';
    const alt = (attrs.match(/\balt="([^"]*)"/i) || [])[1] || '';
    const title = (attrs.match(/\btitle="([^"]*)"/i) || [])[1] || '';
    let out = '<img';
    if (src) out += ` src="${src.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`;
    if (alt) out += ` alt="${alt.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`;
    if (title && title !== alt) out += ` title="${title.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`;
    out += ' />';
    return out;
  });

  // 3. Remove all style/id/class/other attributes from block & inline tags except href on a
  const keepHref = (m, tag, attrs) => {
    if (/^a$/i.test(tag)) {
      const href = (attrs.match(/\bhref="([^"]*)"/i) || [])[1] || '';
      let out = `<a`;
      if (href) out += ` href="${href.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`;
      return out + '>';
    }
    return `<${tag.toLowerCase()}>`;
  };
  t = t.replace(/<(p|h1|h2|h3|h4|h5|h6|span|div|strong|em|b|i|u|ul|ol|li|table|thead|tbody|tr|td|th|blockquote|figure|figcaption)(\s[^>]*)?>/gi, keepHref);

  // 4. Remove empty <a> wrappers around images/videos that survived (keep content)
  t = t.replace(/<a\s*>([\s\S]*?)<\/a>/gi, '$1');

  // 4b. Drop fragment-only links (dead TOC anchors like #mcetoc_*), keep inner text
  t = t.replace(/<a\s+href="#[^"]*"[^>]*>([\s\S]*?)<\/a>/gi, '$1');

  // 5. Convert markdown-ish leftovers: ![x](url)
  t = t.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />');

  // 6. Strip scripts, iframes, object, noscript
  t = t.replace(/<(script|style|noscript|iframe|object|embed)\b[^>]*>[\s\S]*?<\/\1>/gi, '');

  // 7. Collapse whitespace runs inside text (keep single spaces/newlines)
  t = t.replace(/\s+/g, ' ');

  // 8. Fix leftover entities & quotes
  t = t.replace(/&nbsp;/g, ' ')
       .replace(/&amp;/g, '&')
       .replace(/&quot;/g, '"')
       .replace(/&lt;/g, '<')
       .replace(/&gt;/g, '>');

  // 9. Remove empty paragraphs / headings
  t = t.replace(/<(p|h1|h2|h3|div|span|strong|em|li)[^>]*>\s*<\/\1>/gi, '');

  // 10. Remove `<p>` that is entirely a bare image (images stand alone)
  t = t.replace(/<p>\s*(<img[^>]*\/?>)\s*<\/p>/gi, '$1');

  // 11. Drop leading/trailing whitespace and any leading stray separators
  t = t.replace(/^\s+/, '').replace(/\s+$/, '');

  return t;
}

module.exports = { extractCssContent, cleanHtml };

if (require.main === module) {
  const file = process.argv[2] || path.join(__dirname, 'sample_css_content.html');
  const html = fs.readFileSync(file, 'utf8');
  const cleaned = cleanHtml(html);
  console.log('INPUT len:', html.length, '-> OUTPUT len:', cleaned.length);
  console.log('=== OUTPUT (first 3000) ===');
  console.log(cleaned.slice(0, 3000));
  console.log('\n=== IMG COUNT:', (cleaned.match(/<img/gi) || []).length, '===');
  console.log('=== P COUNT:', (cleaned.match(/<p>/gi) || []).length, '===');
  console.log('=== H2 COUNT:', (cleaned.match(/<h2>/gi) || []).length, '===');
  console.log('=== REMAINING ATTRS (should be minimal): ===');
  const attrs = cleaned.match(/<[a-z0-9]+[^>]*\s(?:style|class|id|width|height|border|fetchpriority|decoding|loading)=/gi);
  console.log(attrs ? attrs.slice(0, 10) : 'none');
}