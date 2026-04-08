import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [defaultPath, setDefaultPath] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    async function loadSettings() {
      if (window.electronAPI) {
        try {
          const path = await window.electronAPI.getSettings();
          setDefaultPath(path);
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    if (!window.electronAPI) return;
    try {
      await window.electronAPI.saveSettings(defaultPath);
      setStatus({ type: 'success', message: 'Einstellungen gespeichert!' });
      setTimeout(() => setStatus(null), 3000);
    } catch (e) {
      setStatus({ type: 'error', message: 'Fehler beim Speichern' });
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

  if (loading) return <div>Laden...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Einstellungen</h2>

      {status && (
        <div className={`p-4 mb-4 rounded ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {status.message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Standard-Pfad für den Ordner-Dialog
        </label>
        
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

        <p className="text-sm text-gray-500 mb-6">
          Dieser Pfad wird verwendet, wenn der Dialog zum Speichern der "_fertig.txt" geöffnet wird.
        </p>

        <button
          onClick={handleSave}
          className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-6 rounded transition-colors"
        >
          Speichern
        </button>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Andreas Kowalenko. Alle Rechte vorbehalten.
      </div>
    </div>
  );
}
