"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.backendProcess = exports.mainWindow = void 0;
const electron_1 = require("electron");
const path = __importStar(require("path"));
const isDev = __importStar(require("electron-is-dev"));
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
let mainWindow = null;
exports.mainWindow = mainWindow;
let backendProcess = null;
exports.backendProcess = backendProcess;
const isDevelopment = isDev.default;
const createWindow = () => {
    exports.mainWindow = mainWindow = new electron_1.BrowserWindow({
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
        exports.mainWindow = mainWindow = null;
    });
};
const startBackendServer = () => {
    const backendPath = path.join(__dirname, '../../packages/backend/dist/server.js');
    if (!fs.existsSync(backendPath)) {
        console.error('Backend server file not found. Please run: npm run build');
        return;
    }
    exports.backendProcess = backendProcess = (0, child_process_1.spawn)('node', [backendPath], {
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
        exports.backendProcess = backendProcess = null;
    });
};
const createMenu = () => {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Exit',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => {
                        electron_1.app.quit();
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
                        electron_1.dialog.showMessageBox(mainWindow, {
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
    const menu = electron_1.Menu.buildFromTemplate(template);
    electron_1.Menu.setApplicationMenu(menu);
};
// Handle IPC messages
electron_1.ipcMain.handle('get-app-version', () => electron_1.app.getVersion());
electron_1.ipcMain.handle('get-app-path', () => electron_1.app.getAppPath());
electron_1.ipcMain.handle('show-message-box', async (event, options) => {
    return electron_1.dialog.showMessageBox(mainWindow, options);
});
// App event handlers
electron_1.app.on('ready', () => {
    startBackendServer();
    createWindow();
    createMenu();
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
// Cleanup on app quit
electron_1.app.on('before-quit', () => {
    if (backendProcess) {
        backendProcess.kill();
    }
});
