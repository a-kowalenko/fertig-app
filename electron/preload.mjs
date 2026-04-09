import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getLatestVersionInfo: () => ipcRenderer.invoke('get-latest-version-info'),
  getHistory: () => ipcRenderer.invoke('get-history'),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (path) => ipcRenderer.invoke('save-settings', path),
  selectDefaultPath: () => ipcRenderer.invoke('select-default-path'),
  selectFolderAndSave: (data) => ipcRenderer.invoke('select-folder-and-save', data),

  // Update API
  checkForUpdates: (isManual) => ipcRenderer.invoke('check-for-updates', isManual),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  skipUpdate: (version) => ipcRenderer.invoke('skip-update', version),
  onUpdateEvent: (callback) => {
    ipcRenderer.on('update-event', (event, data) => callback(data));
  }
});
