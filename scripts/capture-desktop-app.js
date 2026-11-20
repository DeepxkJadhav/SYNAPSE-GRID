const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');

// Disable GPU crashes on Windows
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

const OUTPUT_DIR = path.join(
  'C:',
  'Users',
  'deepa',
  '.gemini',
  'antigravity',
  'brain',
  'b182917e-6a10-48bb-8ceb-854e7f09f10b',
  'desktop_screenshots'
);

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Embedded static UI server
const FRONTEND_DIR = path.join(__dirname, '..', 'packages', 'frontend', 'out');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
};

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const parsedUrl = new URL(req.url || '/', 'http://127.0.0.1');
        let pathname = decodeURIComponent(parsedUrl.pathname);

        let filePath = path.join(FRONTEND_DIR, pathname);
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
          res.writeHead(404);
          res.end('Not Found');
          return;
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
        res.end(err.message);
      }
    });

    server.listen(0, '127.0.0.1', () => {
      resolve({ port: server.address().port, server });
    });
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.whenReady().then(async () => {
  console.log('[DESKTOP CAPTURE] Electron ready, starting server...');
  const { port, server } = await startServer();
  console.log(`[DESKTOP CAPTURE] Server running at http://127.0.0.1:${port}`);

  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1040,
    minHeight: 680,
    title: 'SynapseGrid - Desktop Workstation',
    backgroundColor: '#0c0d0e',
    show: false,
    frame: true, // Show true desktop window frame
    webPreferences: {
      preload: path.join(__dirname, '..', 'dist', 'main', 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
  });

  const targetUrl = `http://127.0.0.1:${port}/editor/session-desktop`;
  console.log(`[DESKTOP CAPTURE] Loading desktop app URL: ${targetUrl}`);
  await win.loadURL(targetUrl);
  win.show();

  console.log('[DESKTOP CAPTURE] Waiting 4s for Monaco Editor and Workstation UI to mount...');
  await sleep(4000);

  // Helper to capture
  async function capturePart(filename, label) {
    console.log(`[DESKTOP CAPTURE] Capturing ${label} -> ${filename}...`);
    const image = await win.webContents.capturePage();
    const dest = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(dest, image.toPNG());
    console.log(`[DESKTOP CAPTURE] Saved: ${dest} (${image.getSize().width}x${image.getSize().height})`);
  }

  // 1. Part 1: Full Desktop Workstation
  await capturePart('part_1_workstation_main.png', 'Part 1: Full Desktop Workstation');

  // 2. Part 2: Command Palette (Ctrl+K)
  console.log('[DESKTOP CAPTURE] Triggering Command Palette (Ctrl+K)...');
  await win.webContents.executeJavaScript(`
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
  `);
  await sleep(1000);
  await capturePart('part_2_command_palette.png', 'Part 2: Spotlight Command Palette');

  // Close command palette
  await win.webContents.executeJavaScript(`
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  `);
  await sleep(600);

  // 3. Part 3: Create New File Modal
  console.log('[DESKTOP CAPTURE] Triggering Create New File Modal...');
  await win.webContents.executeJavaScript(`
    const newFileBtn = document.querySelector('button[title="New File"]');
    if (newFileBtn) newFileBtn.click();
  `);
  await sleep(800);
  await capturePart('part_3_create_new_file.png', 'Part 3: Native Create New File Modal');

  // Close modal
  await win.webContents.executeJavaScript(`
    const cancelBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Cancel');
    if (cancelBtn) cancelBtn.click();
  `);
  await sleep(600);

  // 4. Part 4: Create New Folder Modal
  console.log('[DESKTOP CAPTURE] Triggering Create New Folder Modal...');
  await win.webContents.executeJavaScript(`
    const newFolderBtn = document.querySelector('button[title="New Folder"]');
    if (newFolderBtn) newFolderBtn.click();
  `);
  await sleep(800);
  await capturePart('part_4_create_new_folder.png', 'Part 4: Native Create New Folder Modal');

  // Close modal
  await win.webContents.executeJavaScript(`
    const cancelBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Cancel');
    if (cancelBtn) cancelBtn.click();
  `);
  await sleep(600);

  // 5. Part 5: Prime Agent RLM Studio
  console.log('[DESKTOP CAPTURE] Switching to Prime Agent RLM Studio...');
  await win.webContents.executeJavaScript(`
    const primeTabs = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('PRIME AGENT RLM'));
    if (primeTabs.length > 0) primeTabs[0].click();
  `);
  await sleep(800);
  // Click "Optimize" preset
  await win.webContents.executeJavaScript(`
    const optBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Optimize'));
    if (optBtn) optBtn.click();
  `);
  await sleep(2500);
  await capturePart('part_5_prime_agent_rlm.png', 'Part 5: Prime Agent RLM Studio');

  // 6. Part 6: Python REPL Kernel
  console.log('[DESKTOP CAPTURE] Switching to Python REPL Kernel...');
  await win.webContents.executeJavaScript(`
    const replTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('REPL KERNEL'));
    if (replTab) replTab.click();
  `);
  await sleep(800);
  await capturePart('part_6_python_repl.png', 'Part 6: Python REPL Kernel');

  // 7. Part 7: Host Telemetry Radar & Active Port Scanner
  console.log('[DESKTOP CAPTURE] Switching to Host Radar...');
  await win.webContents.executeJavaScript(`
    const hostTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('HOST RADAR'));
    if (hostTab) hostTab.click();
  `);
  await sleep(800);
  // Click scan ports
  await win.webContents.executeJavaScript(`
    const scanBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Scan Now'));
    if (scanBtn) scanBtn.click();
  `);
  await sleep(1500);
  await capturePart('part_7_host_radar_telemetry.png', 'Part 7: Host Telemetry Radar & Port Scanner');

  console.log('\n[DESKTOP CAPTURE] ALL DESKTOP SCREENSHOTS CAPTURED SUCCESSFULLY!');
  server.close();
  win.destroy();
  app.quit();
  process.exit(0);
});
