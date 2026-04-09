import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getLatestVersionInfo: () => ipcRenderer.invoke('get-latest-version-info'),
  getHistory: () => ipcRenderer.invoke('get-history'),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  savePerson: (data) => ipcRenderer.invoke('save-person', data),
  getPersons: () => ipcRenderer.invoke('get-persons'),
  updatePerson: (data) => ipcRenderer.invoke('update-person', data),
  deletePerson: (id) => ipcRenderer.invoke('delete-person', id),
  exportPerson: (id) => ipcRenderer.invoke('export-person', id),
  readDirectory: (path) => ipcRenderer.invoke('read-directory', path),
  exportPersonToPath: (data) => ipcRenderer.invoke('export-person-to-path', data),
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
