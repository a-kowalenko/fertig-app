import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (path) => ipcRenderer.invoke('save-settings', path),
  selectDefaultPath: () => ipcRenderer.invoke('select-default-path'),
  selectFolderAndSave: (data) => ipcRenderer.invoke('select-folder-and-save', data)
});
