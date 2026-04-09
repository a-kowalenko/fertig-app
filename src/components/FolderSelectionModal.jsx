import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Button from './Button';

export default function FolderSelectionModal({ onClose, onSelect }) {
  const [currentPath, setCurrentPath] = useState(null);
  const [folders, setFolders] = useState([]);
  const [parentPath, setParentPath] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadDirectory = async (path = null) => {
    if (!window.electronAPI) return;
    setLoading(true);
    try {
      const res = await window.electronAPI.readDirectory(path);
      if (res.success) {
        setFolders(res.folders);
        setCurrentPath(res.path);
        setParentPath(res.parent);
      } else {
        toast.error(`Fehler beim Laden des Ordners: ${res.error}`);
      }
    } catch (err) {
      toast.error('Unerwarteter Fehler beim Lesen des Verzeichnisses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDirectory(); // Lädt beim ersten Mal den in Settings hinterlegten Standardpfad
    
    // Polling alle 2 Sekunden um Änderungen zu bemerken
    const interval = setInterval(() => {
        loadDirectory(currentPath);
    }, 2000);
    return () => clearInterval(interval);
  }, [currentPath]);

  return (
    <div className="fixed inset-0 bg-black/50 flex xl:items-center justify-center z-[60] px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
          <h3 className="text-lg font-bold text-gray-800">Zielordner wählen</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-2 text-sm font-mono text-gray-500 bg-gray-50 px-3 py-2 rounded break-all">
          {currentPath || 'Lade...'}
        </div>

        <div className="flex-1 overflow-y-auto min-h-[300px] border border-gray-200 rounded p-2 mb-4 bg-gray-50/50 relative">
          {loading && folders.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50">
              <span className="text-gray-500">Lade...</span>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {folders.map(f => (
              <div 
                key={f.name} 
                className={`flex justify-between items-center p-2 rounded border transition-colors ${f.isReady ? 'bg-green-50 border-green-200 hover:bg-green-100' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
              >
                <button
                  onClick={() => loadDirectory(f.path)}
                  className="flex-1 flex items-center gap-2 text-left truncate overflow-hidden"
                  title={f.name}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 flex-shrink-0 ${f.isReady ? 'text-green-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <span className="truncate text-gray-700 font-medium">{f.name}</span>
                </button>
                <div className="flex items-center">
                  {!f.isReady && (
                     <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse mr-3" title="Kopiervorgang evtl. aktiv"></div>
                  )}
                  <Button
                    variant="success"
                    onClick={() => onSelect(f.path)}
                    disabled={!f.isReady}
                    className="text-xs px-3 py-1 ml-2"
                  >
                    Hier speichern
                  </Button>
                </div>
              </div>
            ))}
            
            {folders.length === 0 && !loading && (
              <div className="col-span-full py-8 text-center text-gray-400 italic">
                Keine Unterordner vorhanden
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="inline-block w-3 h-3 bg-green-100 border border-green-200 rounded"></span> = Bereit
                <span className="inline-block w-3 h-3 bg-white border border-gray-200 rounded ml-2"></span> = Wird geschrieben
            </div>
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Abbrechen
            </Button>
        </div>
      </div>
    </div>
  );
}

