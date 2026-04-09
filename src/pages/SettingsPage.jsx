import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [defaultPath, setDefaultPath] = useState('');
  const [isPathLoading, setIsPathLoading] = useState(true);
  const [isVersionLoading, setIsVersionLoading] = useState(true);
  const [appVersion, setAppVersion] = useState('');
  const [latestVersion, setLatestVersion] = useState('');
  const [skippedVersion, setSkippedVersion] = useState('');

  useEffect(() => {
    async function loadSettings() {
      if (window.electronAPI) {
        try {
          const path = await window.electronAPI.getSettings();
          setDefaultPath(path);
        } catch (e) {
          console.error('Error loading path:', e);
        } finally {
          setIsPathLoading(false);
        }

        try {
          if (window.electronAPI.getAppVersion) {
            const version = await window.electronAPI.getAppVersion();
            setAppVersion(version);
          }

          if (window.electronAPI.getLatestVersionInfo) {
            const info = await window.electronAPI.getLatestVersionInfo();
            if (info) {
              setLatestVersion(info.latestVersion);
              setSkippedVersion(info.skippedVersion);
            }
          }
        } catch (e) {
          console.error('Error loading versions:', e);
        } finally {
          setIsVersionLoading(false);
        }
      } else {
        setIsPathLoading(false);
        setIsVersionLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    if (!window.electronAPI) return;
    try {
      await window.electronAPI.saveSettings(defaultPath);
      toast.success('Einstellungen gespeichert!');
    } catch (e) {
      toast.error('Fehler beim Speichern');
    }
  };

  const handleSelectPath = async () => {
    if (!window.electronAPI) return;
    try {
      const result = await window.electronAPI.selectDefaultPath();
      if (result.success) {
        setDefaultPath(result.filePath);
      }
    } catch (e) {
      console.error('Fehler bei der Ordnerauswahl', e);
    }
  };

  const handleCheckForUpdates = async () => {
    if (!window.electronAPI) return;
    try {
      toast.loading('Suche nach Updates...', { id: 'update-check' });
      await window.electronAPI.checkForUpdates(true);
      toast.dismiss('update-check');

      // Update UI directly after manual check
      if (window.electronAPI.getLatestVersionInfo) {
        setIsVersionLoading(true);
        const info = await window.electronAPI.getLatestVersionInfo();
        if (info) {
          setLatestVersion(info.latestVersion);
          setSkippedVersion(info.skippedVersion);
        }
        setIsVersionLoading(false);
      }
    } catch (e) {
      toast.error('Fehler bei der Update-Suche.', { id: 'update-check' });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Einstellungen</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Standard-Pfad für den Ordner-Dialog
        </label>
        
        {isPathLoading ? (
          <div className="flex gap-2 mb-4 items-center h-[42px] px-2 text-gray-500">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
            <span className="text-sm">Lade Pfad...</span>
          </div>
        ) : (
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={defaultPath}
              onChange={(e) => setDefaultPath(e.target.value)}
              placeholder="z.B. C:\Users\Max\Documents"
              className="flex-grow p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={handleSelectPath}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors border border-gray-300"
            >
              Auswählen
            </button>
          </div>
        )}

        <p className="text-sm text-gray-500 mb-6">
          Dieser Pfad wird verwendet, wenn der Dialog zum Speichern der "_fertig.txt" geöffnet wird.
        </p>

        <button
          onClick={handleSave}
          disabled={isPathLoading}
          className={`bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-6 rounded transition-colors ${isPathLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Speichern
        </button>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-xl font-bold mb-2 text-gray-800">App-Updates</h3>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            Aktuelle Version:
            {isVersionLoading ? (
              <span className="flex items-center justify-center w-12 h-[26px] bg-gray-50 rounded border border-gray-200">
                <span className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-gray-400"></span>
              </span>
            ) : (
              appVersion && (
                <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded border border-gray-200 font-mono">
                  v{appVersion}
                </span>
              )
            )}
          </p>

          <p className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            Neueste Version:
            {isVersionLoading ? (
              <span className="flex items-center justify-center w-12 h-[26px] bg-gray-50 rounded border border-gray-200">
                <span className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-gray-400"></span>
              </span>
            ) : (
              latestVersion ? (
                <>
                  <span className={`px-2 py-0.5 rounded border font-mono ${latestVersion === appVersion ? 'bg-green-50 text-green-800 border-green-200' : 'bg-blue-50 text-blue-800 border-blue-200'}`}>
                    v{latestVersion}
                  </span>
                  {latestVersion === appVersion && <span className="text-green-600 text-xs ml-1">(Sie sind auf dem neuesten Stand)</span>}
                  {latestVersion !== appVersion && latestVersion === skippedVersion && <span className="text-orange-500 text-xs ml-1">(Diese Version wird aktuell ignoriert)</span>}
                </>
              ) : (
                <span className="text-gray-500 italic">Unbekannt</span>
              )
            )}
          </p>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Hier können Sie manuell nach neuen Versionen suchen. Wenn Sie ein Update zuvor ignoriert haben, wird es Ihnen nun wieder angeboten.
        </p>
        <button
          onClick={handleCheckForUpdates}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors"
        >
          Auf Updates prüfen
        </button>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Andreas Kowalenko. Alle Rechte vorbehalten.
      </div>
    </div>
  );
}
