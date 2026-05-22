import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  app: {
    getVersion: () => ipcRenderer.invoke('get-app-version'),
    getAppPath: () => ipcRenderer.invoke('get-app-path'),
  },
  dialog: {
    showMessageBox: (options: any) => ipcRenderer.invoke('show-message-box', options),
  },
});
