"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  getAppVersion: () => electron.ipcRenderer.invoke("get-app-version"),
  getLatestVersionInfo: () => electron.ipcRenderer.invoke("get-latest-version-info"),
  getHistory: () => electron.ipcRenderer.invoke("get-history"),
  getSettings: () => electron.ipcRenderer.invoke("get-settings"),
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
