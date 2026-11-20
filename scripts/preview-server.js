const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const FRONTEND_DIR = path.join(__dirname, '..', 'packages', 'frontend', 'out');
const PORT = 3456;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
};

// 1. Start Backend on port 5000
const backendProcess = spawn(process.execPath, [path.join(__dirname, '..', 'dist', 'backend', 'server.js')], {
  env: {
    ...process.env,
    PORT: '5000',
    NODE_ENV: 'development',
  },
  stdio: 'inherit',
});

backendProcess.on('error', (err) => {
  console.error('[BACKEND ERROR]', err);
});

// 2. Start Static UI Server on port 3456
const server = http.createServer((req, res) => {
  try {
    const parsedUrl = new URL(req.url || '/', 'http://127.0.0.1:' + PORT);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    let filePath = path.join(FRONTEND_DIR, pathname);
    if (!filePath.startsWith(FRONTEND_DIR)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    } else if (!fs.existsSync(filePath)) {
      if (fs.existsSync(`${filePath}.html`)) {
        filePath = `${filePath}.html`;
      } else if (pathname.startsWith('/editor/')) {
        filePath = path.join(FRONTEND_DIR, 'editor', '[sessionId]', 'index.html');
      }
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      const fallback404 = path.join(FRONTEND_DIR, '404.html');
      if (fs.existsSync(fallback404)) {
        filePath = fallback404;
      } else {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
    });
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    res.writeHead(500);
    res.end('Error: ' + err.message);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[PREVIEW] SynapseGrid Live Server ready at http://127.0.0.1:${PORT}/editor/session-desktop`);
});

process.on('SIGINT', () => {
  backendProcess.kill();
  server.close();
  process.exit();
});
