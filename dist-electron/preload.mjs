"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  getSettings: () => electron.ipcRenderer.invoke("get-settings"),
  saveSettings: (path) => electron.ipcRenderer.invoke("save-settings", path),
  selectDefaultPath: () => electron.ipcRenderer.invoke("select-default-path"),
  selectFolderAndSave: (data) => electron.ipcRenderer.invoke("select-folder-and-save", data)
});
