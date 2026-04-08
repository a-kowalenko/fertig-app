import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import Store from 'electron-store';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const store = new Store();

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 750,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // --- IPC Handlers ---

  ipcMain.handle('get-settings', () => {
    return store.get('defaultPath', app.getPath('documents'));
  });

  ipcMain.handle('save-settings', (event, defaultPath) => {
    store.set('defaultPath', defaultPath);
    return true;
  });

  ipcMain.handle('select-default-path', async () => {
    const defaultPath = store.get('defaultPath', app.getPath('documents'));

    const result = await dialog.showOpenDialog(mainWindow, {
      defaultPath: defaultPath,
      properties: ['openDirectory'],
      title: 'Standard-Ordner auswählen',
      buttonLabel: 'Ordner wählen'
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { success: false };
    }

    return { success: true, filePath: result.filePaths[0] };
  });

  ipcMain.handle('select-folder-and-save', async (event, data) => {
    const defaultPath = store.get('defaultPath', app.getPath('documents'));

    const result = await dialog.showOpenDialog(mainWindow, {
      defaultPath: defaultPath,
      properties: ['openDirectory'],
      title: 'Bitte Zielordner auswählen',
      buttonLabel: 'Speichern unter'
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, error: 'Abgebrochen' };
    }

    const selectedPath = result.filePaths[0];
    const filePath = path.join(selectedPath, '_fertig.txt');

    try {
      const content = JSON.stringify(data, null, 2);
      await fs.writeFile(filePath, content, 'utf-8');
      return { success: true, filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
