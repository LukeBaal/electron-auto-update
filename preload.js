const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronApi', {
    appVersion: () => ipcRenderer.invoke("appVersion"),
    onUpdateAvailable: (callback) => ipcRenderer.on("updateAvailable", (_event) => callback()),
    onUpdateDownloaded: (callback) => ipcRenderer.on("updateDownloaded", (_event) => callback()),
    restartApp: () => ipcRenderer.send("restartApp"),
});