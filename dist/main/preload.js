"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose high-performance Synapse Cybernetic Desktop API
electron_1.contextBridge.exposeInMainWorld('synapseDesktop', {
    isDesktop: true,
    window: {
        minimize: () => electron_1.ipcRenderer.invoke('synapse:window:minimize'),
        maximize: () => electron_1.ipcRenderer.invoke('synapse:window:maximize'),
        close: () => electron_1.ipcRenderer.invoke('synapse:window:close'),
        isMaximized: () => electron_1.ipcRenderer.invoke('synapse:window:isMaximized'),
    },
    fs: {
        selectDirectory: () => electron_1.ipcRenderer.invoke('synapse:fs:selectDirectory'),
        readTree: (dirPath) => electron_1.ipcRenderer.invoke('synapse:fs:readTree', dirPath),
        readFile: (filePath) => electron_1.ipcRenderer.invoke('synapse:fs:readFile', filePath),
        writeFile: (filePath, content) => electron_1.ipcRenderer.invoke('synapse:fs:writeFile', filePath, content),
        createFile: (filePath, initialContent) => electron_1.ipcRenderer.invoke('synapse:fs:createFile', filePath, initialContent),
        createFolder: (dirPath) => electron_1.ipcRenderer.invoke('synapse:fs:createFolder', dirPath),
        delete: (targetPath) => electron_1.ipcRenderer.invoke('synapse:fs:delete', targetPath),
    },
    host: {
        getStats: () => electron_1.ipcRenderer.invoke('synapse:host:getStats'),
        killProcess: (pid) => electron_1.ipcRenderer.invoke('synapse:host:killProcess', pid),
        scanPorts: (ports) => electron_1.ipcRenderer.invoke('synapse:host:scanPorts', ports),
    },
    compiler: {
        runLocal: (code, language) => electron_1.ipcRenderer.invoke('synapse:compiler:runLocal', code, language),
    },
    prime: {
        detect: () => electron_1.ipcRenderer.invoke('synapse:prime:detect'),
    },
    app: {
        getVersion: () => electron_1.ipcRenderer.invoke('get-app-version'),
        getAppPath: () => electron_1.ipcRenderer.invoke('get-app-path'),
        showMessageBox: (options) => electron_1.ipcRenderer.invoke('show-message-box', options),
    },
});
// Backward compatibility bridge
electron_1.contextBridge.exposeInMainWorld('electron', {
    app: {
        getVersion: () => electron_1.ipcRenderer.invoke('get-app-version'),
        getAppPath: () => electron_1.ipcRenderer.invoke('get-app-path'),
    },
    dialog: {
        showMessageBox: (options) => electron_1.ipcRenderer.invoke('show-message-box', options),
    },
});
