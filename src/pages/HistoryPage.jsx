import React, { useState, useEffect } from 'react';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getHistory().then(data => {
        setHistory(data || []);
      });
    }
  }, []);

  // Zurück zur ersten Seite, wenn sich der Suchbegriff ändert
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredHistory = history.filter(entry => {
    const term = search.toLowerCase();
    return (
      (entry.vorname && entry.vorname.toLowerCase().includes(term)) ||
      (entry.nachname && entry.nachname.toLowerCase().includes(term)) ||
      (entry.email && entry.email.toLowerCase().includes(term)) ||
      (entry.telefon && entry.telefon.toLowerCase().includes(term)) ||
      (entry.filePath && entry.filePath.toLowerCase().includes(term))
    );
  });

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Verlauf</h2>
        <input
          type="text"
          placeholder="Suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none min-w-[250px]"
        />
      </div>

      <div className="overflow-x-auto rounded border border-gray-200">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
            <tr>
              <th className="py-3 px-4">Datum</th>
              <th className="py-3 px-4">Vorname</th>
              <th className="py-3 px-4">Nachname</th>
              <th className="py-3 px-4">E-Mail</th>
              <th className="py-3 px-4">Telefon</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((entry, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap text-gray-500">{formatDate(entry.timestamp)}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">{entry.vorname}</td>
                  <td className="py-3 px-4">{entry.nachname}</td>
                  <td className="py-3 px-4">{entry.email}</td>
                  <td className="py-3 px-4">{entry.telefon || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-500">
                  {search ? 'Keine Einträge zur Suche gefunden.' : 'Noch keine Einträge vorhanden.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">
            Zeige {startIndex + 1} bis {Math.min(startIndex + itemsPerPage, filteredHistory.length)} von {filteredHistory.length} Einträgen
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border text-sm font-medium transition-colors ${currentPage === 1 ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
            >
              Zurück
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded border text-sm font-medium transition-colors ${currentPage === i + 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border text-sm font-medium transition-colors ${currentPage === totalPages ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
            >
              Nächste
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
