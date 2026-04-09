"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  getAppVersion: () => electron.ipcRenderer.invoke("get-app-version"),
  getLatestVersionInfo: () => electron.ipcRenderer.invoke("get-latest-version-info"),
  getHistory: () => electron.ipcRenderer.invoke("get-history"),
  getSettings: () => electron.ipcRenderer.invoke("get-settings"),
  savePerson: (data) => electron.ipcRenderer.invoke("save-person", data),
  getPersons: () => electron.ipcRenderer.invoke("get-persons"),
  updatePerson: (data) => electron.ipcRenderer.invoke("update-person", data),
  exportPerson: (id) => electron.ipcRenderer.invoke("export-person", id),
  readDirectory: (path) => electron.ipcRenderer.invoke("read-directory", path),
  exportPersonToPath: (data) => electron.ipcRenderer.invoke("export-person-to-path", data),
  saveSettings: (path) => electron.ipcRenderer.invoke("save-settings", path),
  selectDefaultPath: () => electron.ipcRenderer.invoke("select-default-path"),
  selectFolderAndSave: (data) => electron.ipcRenderer.invoke("select-folder-and-save", data),
  // Update API
  checkForUpdates: (isManual) => electron.ipcRenderer.invoke("check-for-updates", isManual),
  downloadUpdate: () => electron.ipcRenderer.invoke("download-update"),
  installUpdate: () => electron.ipcRenderer.invoke("install-update"),
  skipUpdate: (version) => electron.ipcRenderer.invoke("skip-update", version),
  onUpdateEvent: (callback) => {
    electron.ipcRenderer.on("update-event", (event, data) => callback(data));
  }
});
