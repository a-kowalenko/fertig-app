import React, { useState, useEffect } from 'react';
import Button from './Button';

export default function UpdateModal() {
  const [visible, setVisible] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [status, setStatus] = useState(''); // 'available', 'downloading', 'downloaded', 'error', 'not-available'
  const [progress, setProgress] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (window.electronAPI && window.electronAPI.onUpdateEvent) {
      window.electronAPI.onUpdateEvent((data) => {
        if (data.type === 'update-available') {
          setUpdateInfo(data.info);
          setStatus('available');
          setVisible(true);
        } else if (data.type === 'update-not-available') {
          setUpdateInfo(data.info);
          setStatus('not-available');
          setVisible(true);
        } else if (data.type === 'download-progress') {
          setStatus('downloading');
          setProgress(data.progress);
        } else if (data.type === 'update-downloaded') {
          setStatus('downloaded');
        } else if (data.type === 'error') {
          setStatus('error');
          setErrorMsg(data.error);
          setVisible(true);
        }
      });
    }
  }, []);

  const handleDownload = () => {
    setStatus('downloading');
    window.electronAPI.downloadUpdate();
  };

  const handleInstall = () => {
    window.electronAPI.installUpdate();
  };

  const handleSkip = () => {
    if (updateInfo && updateInfo.version) {
      window.electronAPI.skipUpdate(updateInfo.version);
    }
    setVisible(false);
  };

  const handleClose = () => {
    setVisible(false);
    // Wenn 'error' war oder 'available', können wir einfach das Modal schließen.
  };

  if (!visible) return null;

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">

        {status === 'not-available' && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Kein Update verfügbar</h3>
            <p className="text-gray-600 mb-6">Sie sind bereits auf der neuesten Version.</p>
            <div className="flex justify-end gap-3">
              <Button onClick={handleClose}>
                Schließen
              </Button>
            </div>
          </div>
        )}

        {status === 'available' && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Update verfügbar!</h3>
            <p className="text-gray-600 mb-6">
              Eine neue Version ({updateInfo?.version}) ist verfügbar. Möchten Sie sie jetzt herunterladen?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={handleSkip}>
                Version ignorieren
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Später
              </Button>
              <Button onClick={handleDownload}>
                Herunterladen
              </Button>
            </div>
          </div>
        )}

        {status === 'downloading' && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Update wird heruntergeladen...</h3>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress?.percent || 0}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-sm text-gray-500 font-medium">
              <span>{Math.round(progress?.percent || 0)}%</span>
              {progress ? (
                <span>
                  {formatBytes(progress.transferred)} / {formatBytes(progress.total)}
                  {' • '}{formatBytes(progress.bytesPerSecond)}/s
                </span>
              ) : (
                <span>Ermittle Größe...</span>
              )}
            </div>
          </div>
        )}

        {status === 'downloaded' && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Update bereit</h3>
            <p className="text-gray-600 mb-6">
              Das Update wurde erfolgreich heruntergeladen. Starten Sie die App neu, um es zu installieren.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={handleClose}>
                Später installieren
              </Button>
              <Button variant="success" onClick={handleInstall}>
                Jetzt neu starten
              </Button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-red-600">Fehler beim Update</h3>
            <p className="text-gray-600 text-sm mb-6 bg-red-50 p-3 rounded">
              {errorMsg}
            </p>
            <div className="flex justify-end">
              <Button variant="outline" onClick={handleClose}>
                Schließen
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

