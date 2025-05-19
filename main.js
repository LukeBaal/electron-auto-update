const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require("electron-updater");
const path = require("node:path");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
        },
    });
    if (!app.isPackaged) {
        mainWindow.webContents.openDevTools();
    }
    mainWindow.loadFile('index.html');
    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    mainWindow.once('ready-to-show', () => {
        autoUpdater.checkForUpdatesAndNotify();
    });
}

app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('updateAvailable');
});

autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('updateDownloaded');
});

ipcMain.handle("appVersion", () => {
    return { version: app.getVersion() };
});

ipcMain.on("restartApp", () => {
    autoUpdater.quitAndInstall();
});

