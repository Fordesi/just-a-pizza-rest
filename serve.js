// Local static server: node serve.js [port]  ->  http://127.0.0.1:8080
const http = require('http'), fs = require('fs'), path = require('path');
const root = __dirname, port = +process.argv[2] || 8080;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.jpg': 'image/jpeg' };

http.createServer((req, res) => {
  const name = req.url.split('?')[0] === '/' ? 'index.html' : decodeURIComponent(req.url.split('?')[0]);
  const file = path.resolve(root, '.' + path.sep + name);
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  fs.readFile(file, (err, body) =>
    err ? res.writeHead(404).end('Not found')
        : res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' }).end(body));
}).listen(port, '127.0.0.1', () => console.log(`http://127.0.0.1:${port}`));
