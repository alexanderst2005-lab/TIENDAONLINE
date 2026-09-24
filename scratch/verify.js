const fs = require('fs');

['index.html', 'catalogo.html', 'producto.html'].forEach(file => {
  const html = fs.readFileSync(file, 'utf8');
  const opens = (html.match(/<div[\s>]/g) || []).length;
  const closes = (html.match(/<\/div>/g) || []).length;
  console.log(file, '-> open divs:', opens, 'close divs:', closes);
  if (opens !== closes) {
    console.error('DIV MISMATCH IN', file);
    process.exit(1);
  }
  const scriptMatches = html.match(/<script[\s\S]*?<\/script>/g) || [];
  scriptMatches.forEach((s, idx) => {
    const srcMatch = s.match(/src=["']([^"']+)["']/);
    if (srcMatch) return;
    const content = s.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
    if (!content.trim()) return;
    try {
      new Function(content);
      console.log(file, 'inline script', idx, 'OK');
    } catch(e) {
      console.error(file, 'SYNTAX ERROR in script', idx, e);
      process.exit(1);
    }
  });
});

['js/cart.js', 'js/data.js', 'js/animations.js', 'js/filters.js', 'js/quickselect.js'].forEach(file => {
  try {
    const code = fs.readFileSync(file, 'utf8');
    new Function(code);
    console.log(file, 'OK');
  } catch(e) {
    console.error(file, 'SYNTAX ERROR:', e);
    process.exit(1);
  }
});
console.log('ALL FILES VERIFIED SUCCESSFULLY!');
