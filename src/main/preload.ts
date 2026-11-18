import { contextBridge, ipcRenderer } from 'electron';

// Expose high-performance Synapse Cybernetic Desktop API
contextBridge.exposeInMainWorld('synapseDesktop', {
  isDesktop: true,
  window: {
    minimize: () => ipcRenderer.invoke('synapse:window:minimize'),
    maximize: () => ipcRenderer.invoke('synapse:window:maximize'),
    close: () => ipcRenderer.invoke('synapse:window:close'),
    isMaximized: () => ipcRenderer.invoke('synapse:window:isMaximized'),
  },
  fs: {
    selectDirectory: () => ipcRenderer.invoke('synapse:fs:selectDirectory'),
    readTree: (dirPath: string) => ipcRenderer.invoke('synapse:fs:readTree', dirPath),
    readFile: (filePath: string) => ipcRenderer.invoke('synapse:fs:readFile', filePath),
    writeFile: (filePath: string, content: string) => ipcRenderer.invoke('synapse:fs:writeFile', filePath, content),
    createFile: (filePath: string, initialContent?: string) => ipcRenderer.invoke('synapse:fs:createFile', filePath, initialContent),
    createFolder: (dirPath: string) => ipcRenderer.invoke('synapse:fs:createFolder', dirPath),
    delete: (targetPath: string) => ipcRenderer.invoke('synapse:fs:delete', targetPath),
  },
  host: {
    getStats: () => ipcRenderer.invoke('synapse:host:getStats'),
    killProcess: (pid: number) => ipcRenderer.invoke('synapse:host:killProcess', pid),
    scanPorts: (ports: number[]) => ipcRenderer.invoke('synapse:host:scanPorts', ports),
  },
  compiler: {
    runLocal: (code: string, language: string) => ipcRenderer.invoke('synapse:compiler:runLocal', code, language),
  },
  prime: {
    detect: () => ipcRenderer.invoke('synapse:prime:detect'),
  },
  app: {
    getVersion: () => ipcRenderer.invoke('get-app-version'),
    getAppPath: () => ipcRenderer.invoke('get-app-path'),
    showMessageBox: (options: any) => ipcRenderer.invoke('show-message-box', options),
  },
});

// Backward compatibility bridge
contextBridge.exposeInMainWorld('electron', {
  app: {
    getVersion: () => ipcRenderer.invoke('get-app-version'),
    getAppPath: () => ipcRenderer.invoke('get-app-path'),
  },
  dialog: {
    showMessageBox: (options: any) => ipcRenderer.invoke('show-message-box', options),
  },
});
