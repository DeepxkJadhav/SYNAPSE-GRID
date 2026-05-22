import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';

let mainWindow: BrowserWindow | null = null;
let backendProcess: ChildProcess | null = null;
const isDevelopment = isDev.default;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    icon: path.join(__dirname, '../../assets/icon.ico'),
  });

  const startURL = isDevelopment ? 'http://localhost:3000' : `file://${path.join(__dirname, '../../packages/frontend/out/index.html')}`;

  mainWindow.loadURL(startURL);

  if (isDevelopment) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

const startBackendServer = () => {
  const backendPath = path.join(__dirname, '../../packages/backend/dist/server.js');

  if (!fs.existsSync(backendPath)) {
    console.error('Backend server file not found. Please run: npm run build');
    return;
  }

  backendProcess = spawn('node', [backendPath], {
    stdio: 'inherit',
    env: {
      ...process.env,
      BACKEND_PORT: '5000',
      NODE_ENV: isDevelopment ? 'development' : 'production',
    },
  });

  backendProcess.on('error', (err) => {
    console.error('Failed to start backend:', err);
  });

  backendProcess.on('exit', (code) => {
    console.log(`Backend process exited with code ${code}`);
    backendProcess = null;
  });
};

const createMenu = () => {
  const template: any = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About SynapseGrid',
          click: () => {
            dialog.showMessageBox(mainWindow!, {
              type: 'info',
              title: 'About SynapseGrid',
              message: 'SynapseGrid v1.0.0',
              detail: 'Advanced collaborative development environment with multi-language compiler, AI assistant, and host control.\n\nGitHub: https://github.com/DeepxkJadhav/SYNAPSE-GRID',
            });
          },
        },
        {
          label: 'Documentation',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://github.com/DeepxkJadhav/SYNAPSE-GRID/blob/main/README.md');
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

// Handle IPC messages
ipcMain.handle('get-app-version', () => app.getVersion());

ipcMain.handle('get-app-path', () => app.getAppPath());

ipcMain.handle('show-message-box', async (event, options) => {
  return dialog.showMessageBox(mainWindow!, options);
});

// App event handlers
app.on('ready', () => {
  startBackendServer();
  createWindow();
  createMenu();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Cleanup on app quit
app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});

export { mainWindow, backendProcess };
