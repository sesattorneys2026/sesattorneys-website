// Local preview server for the built site (docs/). Run: node build.js && node serve.js  then open http://localhost:8080
// No dependencies. Behaves like GitHub Pages: /about redirects to /about/, unknown paths get 404.html.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'docs');
const PORT = Number(process.env.PORT) || 8080;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.md': 'text/plain; charset=utf-8', '.txt': 'text/plain; charset=utf-8'
};

function send(res, status, file) {
  res.writeHead(status, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(res);
}

http.createServer((req, res) => {
  let rel;
  try { rel = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { rel = '/'; }
  let file = path.normalize(path.join(ROOT, rel));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.stat(file, (err, st) => {
    if (!err && st.isDirectory()) {
      if (!rel.endsWith('/')) { res.writeHead(301, { Location: rel + '/' + (req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '') }); return res.end(); }
      file = path.join(file, 'index.html');
    }
    fs.stat(file, (err2, st2) => {
      if (!err2 && st2.isFile()) return send(res, 200, file);
      console.log('404', rel);
      send(res, 404, path.join(ROOT, '404.html'));
    });
  });
}).listen(PORT, () => console.log(`SES Attorneys site running at http://localhost:${PORT}  (Ctrl+C to stop)`));
