import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import Store from 'electron-store';
import { autoUpdater } from 'electron-updater';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const store = new Store();

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    width: 950,
    height: 800,
    autoHideMenuBar: true,
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

  // --- AutoUpdater ---
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
  let isManualCheck = false;
  let cachedLatestVersion = null;

  autoUpdater.on('update-available', (info) => {
    const skippedVersion = store.get('skippedUpdateVersion');
    if (!isManualCheck && info.version === skippedVersion) return;
    mainWindow.webContents.send('update-event', { type: 'update-available', info });
  });

  autoUpdater.on('update-not-available', (info) => {
    if (isManualCheck) {
      mainWindow.webContents.send('update-event', { type: 'update-not-available', info });
    }
  });

  autoUpdater.on('download-progress', (progressObj) => {
    mainWindow.webContents.send('update-event', { type: 'download-progress', progress: progressObj });
  });

  autoUpdater.on('update-downloaded', (info) => {
    mainWindow.webContents.send('update-event', { type: 'update-downloaded', info });
  });

  autoUpdater.on('error', (err) => {
    mainWindow.webContents.send('update-event', { type: 'error', error: err.message });
  });

  // Initiale Prüfung im Hintergrund
  setTimeout(async () => {
    isManualCheck = false;
    try {
      const result = await autoUpdater.checkForUpdates();
      if (result && result.updateInfo) {
        cachedLatestVersion = result.updateInfo.version;
      }
    } catch(e) {}
  }, 3000);

  // --- IPC Handlers ---

  ipcMain.handle('check-for-updates', async (event, isManual) => {
    isManualCheck = isManual;
    cachedLatestVersion = null; // Cache verwerfen
    try {
      const result = await autoUpdater.checkForUpdates();
      if (result && result.updateInfo) {
        cachedLatestVersion = result.updateInfo.version;
      }
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });

  ipcMain.handle('download-update', async () => {
    try {
      await autoUpdater.downloadUpdate();
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });

  ipcMain.handle('install-update', () => {
    autoUpdater.quitAndInstall();
  });

  ipcMain.handle('skip-update', (event, version) => {
    store.set('skippedUpdateVersion', version);
    return true;
  });

  ipcMain.handle('get-app-version', () => {
    return app.getVersion();
  });

  ipcMain.handle('get-latest-version-info', async () => {
    const skippedVersion = store.get('skippedUpdateVersion');
    if (!cachedLatestVersion) {
      try {
        const response = await fetch('https://github.com/a-kowalenko/fertig-app/releases/latest/download/latest.yml');
        if (response.ok) {
          const text = await response.text();
          const match = text.match(/version:\s*([^\s]+)/);
          if (match) {
            cachedLatestVersion = match[1];
          }
        }
      } catch (e) {
        console.error('Fehler beim Abrufen der neuesten Version:', e);
      }
    }
    return { skippedVersion, latestVersion: cachedLatestVersion };
  });

  ipcMain.handle('get-history', () => {
    return store.get('history', []);
  });

  ipcMain.handle('get-settings', () => {
    return store.get('defaultPath', app.getPath('documents'));
  });

  ipcMain.handle('save-person', (event, data) => {
    const persons = store.get('persons', []);
    const newPerson = {
      ...data,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      processed: false
    };
    persons.unshift(newPerson);
    store.set('persons', persons);
    return { success: true };
  });

  ipcMain.handle('get-persons', () => {
    return store.get('persons', []);
  });

  ipcMain.handle('update-person', (event, updatedPerson) => {
    const persons = store.get('persons', []);
    const index = persons.findIndex((p) => p.id === updatedPerson.id);
    if (index === -1) {
      return { success: false, error: 'Kunde nicht gefunden' };
    }

    persons[index] = {
      ...persons[index],
      vorname: updatedPerson.vorname,
      nachname: updatedPerson.nachname,
      email: updatedPerson.email,
      telefon: updatedPerson.telefon,
    };

    store.set('persons', persons);
    return { success: true };
  });

  // Neue API für Dateisystem
  ipcMain.handle('read-directory', async (event, dirPath) => {
    try {
      const targetPath = dirPath || store.get('defaultPath', app.getPath('documents'));
      const entries = await fs.readdir(targetPath, { withFileTypes: true });

      const folders = [];
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const fullPath = path.join(targetPath, entry.name);
          // Check ob Kopiervorgang aktiv ist (hier sehr simpel: checken ob Dateien kürzlich (letzte 2s) geändert wurden,
          // besser wäre noch ein lock-check, aber für eine generische Lösung reicht oft das Änderungsdatum)
          let isReady = true;
          try {
            const files = await fs.readdir(fullPath, { withFileTypes: true });
            const now = Date.now();
            for (const f of files) {
              if (f.isFile()) {
                const s = await fs.stat(path.join(fullPath, f.name));
                // Wenn letze Änderung jünger als 3 Sekunden ist -> wir nehmen an, Kopiervorgang aktiv
                if (now - s.mtimeMs < 3000) {
                  isReady = false;
                  break;
                }
              }
            }
          } catch(e) {
            // Zugriffsfehler -> vermutlich nicht ready
            isReady = false;
          }
          folders.push({ name: entry.name, path: fullPath, isReady });
        }
      }

      return { success: true, path: targetPath, folders: folders.sort((a,b) => a.name.localeCompare(b.name)), parent: path.dirname(targetPath) };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });

  ipcMain.handle('export-person-to-path', async (event, { id, targetPath }) => {
    const persons = store.get('persons', []);
    const personIndex = persons.findIndex(p => p.id === id);
    if (personIndex === -1) return { success: false, error: 'Person nicht gefunden' };

    const person = persons[personIndex];
    const filePath = path.join(targetPath, '_fertig.txt');

    try {
      const exportData = {
        vorname: person.vorname,
        nachname: person.nachname,
        email: person.email,
        telefon: person.telefon
      };
      const content = JSON.stringify(exportData, null, 2);
      await fs.writeFile(filePath, content, 'utf-8');

      const history = store.get('history', []);
      const newEntry = {
        ...exportData,
        filePath,
        timestamp: new Date().toISOString()
      };
      history.unshift(newEntry);
      store.set('history', history.slice(0, 100));

      persons[personIndex].processed = true;
      persons[personIndex].filePath = filePath;
      store.set('persons', persons);

      return { success: true, filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('export-person', async (event, id) => {
    const persons = store.get('persons', []);
    const personIndex = persons.findIndex(p => p.id === id);
    if (personIndex === -1) return { success: false, error: 'Person nicht gefunden' };

    const person = persons[personIndex];
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
      const exportData = {
        vorname: person.vorname,
        nachname: person.nachname,
        email: person.email,
        telefon: person.telefon
      };
      const content = JSON.stringify(exportData, null, 2);
      await fs.writeFile(filePath, content, 'utf-8');

      const history = store.get('history', []);
      const newEntry = {
        ...exportData,
        filePath,
        timestamp: new Date().toISOString()
      };
      history.unshift(newEntry);
      store.set('history', history.slice(0, 100));

      persons[personIndex].processed = true;
      persons[personIndex].filePath = filePath;
      store.set('persons', persons);

      return { success: true, filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
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

  // select-folder-and-save ist hiermit obsolet, bleibt aber zwecks Rückwärtskompatibilität,
  // falls noch wo gebraucht.
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

      const history = store.get('history', []);
      const newEntry = {
        ...data,
        filePath,
        timestamp: new Date().toISOString()
      };
      history.unshift(newEntry);
      store.set('history', history.slice(0, 100)); // Behalte die letzten 100 Einträge

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
