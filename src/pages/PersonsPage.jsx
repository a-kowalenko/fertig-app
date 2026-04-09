import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import FolderSelectionModal from '../components/FolderSelectionModal';

export default function PersonsPage() {
  const [persons, setPersons] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'unprocessed', 'processed'

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // States for Edit Modal
  const [editingPerson, setEditingPerson] = useState(null);
  const [editFormData, setEditFormData] = useState({ vorname: '', nachname: '', email: '', telefon: '' });

  // Custom Folder Export Modal
  const [exportingPersonId, setExportingPersonId] = useState(null);

  const loadPersons = async () => {
    if (window.electronAPI) {
      const data = await window.electronAPI.getPersons();
      setPersons(data || []);
    }
  };

  useEffect(() => {
    loadPersons();
  }, []);

  const handleExport = async (id) => {
    if (!window.electronAPI) return;
    setExportingPersonId(id);
  };

  const executeExport = async (folderPath) => {
    if (!window.electronAPI || !exportingPersonId) return;

    try {
      const result = await window.electronAPI.exportPersonToPath({ id: exportingPersonId, targetPath: folderPath });
      if (result.success) {
        toast.success(`Datei erfolgreich erstellt:\n${result.filePath}`, { duration: 4000 });
        loadPersons(); // Aktualisiere die Liste nach Erfolg
        setExportingPersonId(null);
      } else {
        toast.error(`Fehler: ${result.error}`);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!window.electronAPI || !editingPerson) return;
    try {
      const payload = {
        id: editingPerson.id,
        vorname: editFormData.vorname.trim(),
        nachname: editFormData.nachname.trim(),
        email: editFormData.email.trim(),
        telefon: editFormData.telefon?.trim() || ''
      };

      const result = await window.electronAPI.updatePerson(payload);
      if (result.success) {
        toast.success('Kunde erfolgreich aktualisiert!');
        setEditingPerson(null);
        loadPersons();
      } else {
        toast.error(`Fehler: ${result.error}`);
      }
    } catch (err) {
      toast.error('Unerwarteter Fehler beim Speichern.');
    }
  };

  const openEditModal = (p) => {
    setEditingPerson(p);
    setEditFormData({ vorname: p.vorname, nachname: p.nachname, email: p.email, telefon: p.telefon || '' });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  const filteredPersons = persons.filter(p => {
    // Filter by Status
    if (filter === 'unprocessed' && p.processed) return false;
    if (filter === 'processed' && !p.processed) return false;

    // Filter by Search
    const term = search.toLowerCase();
    if (!term) return true;

    return (
      (p.vorname && p.vorname.toLowerCase().includes(term)) ||
      (p.nachname && p.nachname.toLowerCase().includes(term)) ||
      (p.email && p.email.toLowerCase().includes(term)) ||
      (p.telefon && p.telefon.toLowerCase().includes(term))
    );
  });

  const totalPages = Math.ceil(filteredPersons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredPersons.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-full mx-auto w-full">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Kunden Übersicht</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700 font-medium"
          >
            <option value="all">Alle Kunden</option>
            <option value="unprocessed">Nicht bearbeitet</option>
            <option value="processed">Bearbeitet</option>
          </select>

          <input
            type="text"
            placeholder="Suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none flex-grow sm:min-w-[200px]"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded border border-gray-200">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
            <tr>
              <th className="py-3 px-4 w-12 text-center"></th>
              <th className="py-3 px-4">Vorname</th>
              <th className="py-3 px-4">Nachname</th>
              <th className="py-3 px-4">E-Mail</th>
              <th className="py-3 px-4">Telefon</th>
              <th className="py-3 px-4 w-40">Status</th>
              <th className="py-3 px-4 w-[200px] text-right">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((p) => (
                <tr key={p.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${p.processed ? 'bg-gray-50/50' : ''}`}>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => openEditModal(p)}
                      className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded"
                      title="Bearbeiten"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-800">{p.vorname}</td>
                  <td className="py-4 px-4">{p.nachname}</td>
                  <td className="py-4 px-4">{p.email}</td>
                  <td className="py-4 px-4">{p.telefon || '-'}</td>
                  <td className="py-4 px-4">
                    {p.processed ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg className="mr-1.5 h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                        Bearbeitet
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <svg className="mr-1.5 h-3 w-3 text-yellow-600 animate-pulse" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                        Zu bearbeiten
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right h-[52px]">
                    {p.processed ? (
                      <button
                         onClick={() => handleExport(p.id)}
                         className="text-xs text-gray-500 hover:text-blue-600 transition-colors underline whitespace-nowrap inline-block"
                         title="Erneuter Export möglich"
                      >
                        Erneut Exportieren
                      </button>
                    ) : (
                      <button
                        onClick={() => handleExport(p.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 rounded text-xs transition-colors shadow-sm whitespace-nowrap inline-block"
                      >
                        Exportieren
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">
                  {search || filter !== 'all' ? 'Keine passenden Kunden gefunden.' : 'Noch keine Kunden in der Datenbank.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">
            Zeige {startIndex + 1} bis {Math.min(startIndex + itemsPerPage, filteredPersons.length)} von {filteredPersons.length} Einträgen
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
              {[...Array(totalPages)].map((_, i) => {
                // Show a limited number of pages to avoid overflow if there are many pages
                // For simplicity, mimicking HistoryPage logic which renders all buttons
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded border text-sm font-medium transition-colors ${currentPage === i + 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
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

      {exportingPersonId && (
        <FolderSelectionModal
          onClose={() => setExportingPersonId(null)}
          onSelect={(folderPath) => executeExport(folderPath)}
        />
      )}

      {editingPerson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Kunde bearbeiten</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vorname *</label>
                <input
                  type="text"
                  value={editFormData.vorname}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, vorname: e.target.value }))}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nachname *</label>
                <input
                  type="text"
                  value={editFormData.nachname}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, nachname: e.target.value }))}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail *</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input
                  type="tel"
                  value={editFormData.telefon}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, telefon: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPerson(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition"
                >
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

