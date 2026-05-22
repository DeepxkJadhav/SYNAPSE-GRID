"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electron', {
    app: {
        getVersion: () => electron_1.ipcRenderer.invoke('get-app-version'),
        getAppPath: () => electron_1.ipcRenderer.invoke('get-app-path'),
    },
    dialog: {
        showMessageBox: (options) => electron_1.ipcRenderer.invoke('show-message-box', options),
    },
});
