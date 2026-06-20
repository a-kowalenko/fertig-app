import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import FolderSelectionModal from '../components/FolderSelectionModal';
import PersonSelectionModal from '../components/PersonSelectionModal';
import Button from '../components/Button';

export default function PersonsPage() {
  const [persons, setPersons] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'unprocessed', 'processed'

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // React Hook Form for Edit Modal
  const { register, handleSubmit, reset, watch, formState: { errors, touchedFields } } = useForm({
    mode: 'onTouched',
    reValidateMode: 'onChange'
  });
  const telefonValue = watch('telefon');

  // States for Edit Modal
  const [editingPerson, setEditingPerson] = useState(null);

  // Custom Folder Export Modal states
  const [exportingPersonId, setExportingPersonId] = useState(null);
  const [assignFolderMode, setAssignFolderMode] = useState(false);
  const [selectedFolderForAssign, setSelectedFolderForAssign] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const [statusConfirmPerson, setStatusConfirmPerson] = useState(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

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
    setAssignFolderMode(false);
    setSelectedFolderForAssign(null);
    setExportingPersonId(id);
  };

  const handleStartAssignFolder = () => {
    if (!window.electronAPI) return;
    setExportingPersonId(null);
    setAssignFolderMode(true);
  };

  const onAssignFolderSelected = (folderPath) => {
    setAssignFolderMode(false);
    setSelectedFolderForAssign(folderPath);
  };

  const executeExportToAssignedFolder = async (personId) => {
      if (!window.electronAPI || !selectedFolderForAssign || isExporting) return;

      setIsExporting(true);
      try {
        const result = await window.electronAPI.exportPersonToPath({ id: personId, targetPath: selectedFolderForAssign });
        if (result.success) {
          toast.success(`Kunde zugewiesen & Datei erfolgreich erstellt:\n${result.filePath}`, { duration: 4000 });
          loadPersons();
          setSelectedFolderForAssign(null);
        } else {
          toast.error(`Fehler: ${result.error}`);
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsExporting(false);
      }
  };

  const executeExport = async (folderPath) => {
    if (!window.electronAPI || !exportingPersonId || isExporting) return;

    setIsExporting(true);
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
    } finally {
      setIsExporting(false);
    }
  };

  const handleEditSubmit = async (data) => {
    if (!window.electronAPI || !editingPerson) return;
    try {
      const payload = {
        id: editingPerson.id,
        vorname: data.vorname.trim(),
        nachname: data.nachname.trim(),
        email: data.email.trim(),
        telefon: data.telefon?.trim() || ''
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

  const handleDelete = async () => {
    if (!window.electronAPI || !editingPerson) return;

    // Einfache Bestätigung
    if (!window.confirm('Möchten Sie diesen Kunden wirklich löschen?')) {
      return;
    }

    try {
      const result = await window.electronAPI.deletePerson(editingPerson.id);
      if (result.success) {
        toast.success('Kunde erfolgreich gelöscht!');
        setEditingPerson(null);
        loadPersons();
      } else {
        toast.error(`Fehler: ${result.error}`);
      }
    } catch (err) {
      toast.error('Unerwarteter Fehler beim Löschen.');
    }
  };

  const openEditModal = (p) => {
    setEditingPerson(p);
    reset({
      vorname: p.vorname || '',
      nachname: p.nachname || '',
      email: p.email || '',
      telefon: p.telefon || ''
    });
  };

  const handleStatusToggleConfirm = async () => {
    if (!window.electronAPI || !statusConfirmPerson || isTogglingStatus) return;

    setIsTogglingStatus(true);
    try {
      const result = await window.electronAPI.setPersonProcessed({
        id: statusConfirmPerson.id,
        processed: !statusConfirmPerson.processed,
      });
      if (result.success) {
        toast.success(
          statusConfirmPerson.processed
            ? 'Kunde als „Zu bearbeiten“ markiert.'
            : 'Kunde als „Bearbeitet“ markiert.'
        );
        setStatusConfirmPerson(null);
        loadPersons();
      } else {
        toast.error(`Fehler: ${result.error}`);
      }
    } catch (err) {
      toast.error('Unerwarteter Fehler beim Ändern des Status.');
    } finally {
      setIsTogglingStatus(false);
    }
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
          <Button
             variant="success"
             onClick={handleStartAssignFolder}
             className="whitespace-nowrap hidden md:inline-flex"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Ordner verknüpfen
          </Button>

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
              <th className="py-3 px-4 w-48">Status</th>
              <th className="py-3 px-4 w-[200px] text-right">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((p) => (
                <tr key={p.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${p.processed ? 'bg-gray-50/50' : ''}`}>
                  <td className="py-3 px-2 text-center align-middle">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => openEditModal(p)}
                        className="inline-flex items-center justify-center h-7 w-7 text-gray-500 hover:text-blue-600 transition-colors rounded"
                        title="Bearbeiten"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-medium text-gray-800">{p.vorname}</td>
                  <td className="py-3 px-3">{p.nachname}</td>
                  <td className="py-3 px-3">{p.email}</td>
                  <td className="py-3 px-3">{p.telefon || '-'}</td>
                  <td className="py-3 px-1 align-middle">
                    <div className="flex items-center gap-1.5">
                      {p.processed ? (
                        <span className="inline-flex items-center w-[7.75rem] px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 shrink-0">
                          <svg className="mr-1.5 h-3 w-3 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 8 8">
                            <circle cx="4" cy="4" r="3" />
                          </svg>
                          Bearbeitet
                        </span>
                      ) : (
                        <span className="inline-flex items-center w-[7.75rem] px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 shrink-0">
                          <svg className="mr-1.5 h-3 w-3 text-yellow-600 animate-pulse shrink-0" fill="currentColor" viewBox="0 0 8 8">
                            <circle cx="4" cy="4" r="3" />
                          </svg>
                          Zu bearbeiten
                        </span>
                      )}
                      <button
                        onClick={() => setStatusConfirmPerson(p)}
                        className={`inline-flex items-center justify-center shrink-0 h-6 w-6 rounded-full border transition-colors ${
                          p.processed
                            ? 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-200 hover:border-orange-300'
                            : 'bg-green-100 hover:bg-green-200 text-green-700 border-green-200 hover:border-green-300'
                        }`}
                        title={p.processed ? 'Als „Zu bearbeiten“ markieren' : 'Als „Bearbeitet“ markieren'}
                      >
                        {p.processed ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-2 align-middle">
                    <div className="flex items-center justify-end h-7">
                      {p.processed ? (
                        <button
                           onClick={() => handleExport(p.id)}
                           className="inline-flex items-center justify-center h-7 px-3 text-xs text-gray-500 hover:text-gray-700 active:text-gray-900 transition-colors underline whitespace-nowrap"
                           title="Erneuter Export möglich"
                        >
                          Erneut Exportieren
                        </button>
                      ) : (
                        <Button
                          onClick={() => handleExport(p.id)}
                          className="text-xs px-3 py-0 h-7 whitespace-nowrap inline-flex items-center"
                        >
                          Exportieren
                        </Button>
                      )}
                    </div>
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

      {/* Mode 1: Click person -> Select folder -> Export */}
      {exportingPersonId && (
        <FolderSelectionModal
          onClose={() => setExportingPersonId(null)}
          onSelect={(folderPath) => executeExport(folderPath)}
          isExporting={isExporting}
        />
      )}

      {/* Mode 2: Click "Ordner verknüpfen" -> Select folder */}
      {assignFolderMode && (
        <FolderSelectionModal
          onClose={() => setAssignFolderMode(false)}
          onSelect={(folderPath) => onAssignFolderSelected(folderPath)}
          isExporting={isExporting}
        />
      )}

      {/* Mode 2 (Step 3): Folder selected -> Select unassigned person -> Export */}
      {selectedFolderForAssign && (
        <PersonSelectionModal
          persons={persons}
          onClose={() => setSelectedFolderForAssign(null)}
          onSelect={(personId) => executeExportToAssignedFolder(personId)}
          isExporting={isExporting}
        />
      )}

      {statusConfirmPerson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-2 text-gray-800">Status ändern</h3>
            <p className="text-gray-600 mb-6">
              {statusConfirmPerson.processed ? (
                <>
                  Möchten Sie <span className="font-medium text-gray-800">{statusConfirmPerson.vorname} {statusConfirmPerson.nachname}</span> wieder als „Zu bearbeiten“ markieren?
                </>
              ) : (
                <>
                  Möchten Sie <span className="font-medium text-gray-800">{statusConfirmPerson.vorname} {statusConfirmPerson.nachname}</span> als „Bearbeitet“ markieren?
                </>
              )}
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setStatusConfirmPerson(null)}
                disabled={isTogglingStatus}
              >
                Abbrechen
              </Button>
              <Button
                onClick={handleStatusToggleConfirm}
                disabled={isTogglingStatus}
              >
                {isTogglingStatus ? 'Wird gespeichert…' : 'Bestätigen'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {editingPerson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Kunde bearbeiten</h3>
            <form onSubmit={handleSubmit(handleEditSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vorname *</label>
                <input
                  {...register('vorname', {
                    required: 'Vorname ist erforderlich',
                    minLength: { value: 2, message: 'Vorname muss mindestens 2 Zeichen lang sein' },
                    maxLength: { value: 50, message: 'Vorname darf maximal 50 Zeichen lang sein' },
                    pattern: {
                      value: /^[a-zA-ZÀ-ÿ\s\-']+$/,
                      message: 'Der Vorname enthält ungültige Zeichen'
                    }
                  })}
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${errors.vorname ? 'border-red-500 focus:ring-red-500 bg-red-50' : touchedFields.vorname ? 'border-green-500 focus:ring-green-500 bg-green-50/30' : 'border-gray-300'}`}
                />
                {errors.vorname && <p className="text-red-500 text-sm mt-1">{errors.vorname.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nachname *</label>
                <input
                  {...register('nachname', {
                    required: 'Nachname ist erforderlich',
                    minLength: { value: 2, message: 'Nachname muss mindestens 2 Zeichen lang sein' },
                    maxLength: { value: 50, message: 'Nachname darf maximal 50 Zeichen lang sein' },
                    pattern: {
                      value: /^[a-zA-ZÀ-ÿ\s\-']+$/,
                      message: 'Der Nachname enthält ungültige Zeichen'
                    }
                  })}
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${errors.nachname ? 'border-red-500 focus:ring-red-500 bg-red-50' : touchedFields.nachname ? 'border-green-500 focus:ring-green-500 bg-green-50/30' : 'border-gray-300'}`}
                />
                {errors.nachname && <p className="text-red-500 text-sm mt-1">{errors.nachname.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail *</label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'E-Mail ist erforderlich',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Bitte eine gültige E-Mail-Adresse eingeben'
                    }
                  })}
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${errors.email ? 'border-red-500 focus:ring-red-500 bg-red-50' : touchedFields.email ? 'border-green-500 focus:ring-green-500 bg-green-50/30' : 'border-gray-300'}`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input
                  type="tel"
                  {...register('telefon', {
                    pattern: {
                      value: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]*$/,
                      message: 'Bitte eine gültige Telefonnummer eingeben'
                    }
                  })}
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${errors.telefon ? 'border-red-500 focus:ring-red-500 bg-red-50' : (touchedFields.telefon && telefonValue && telefonValue.trim().length > 0) ? 'border-green-500 focus:ring-green-500 bg-green-50/30' : 'border-gray-300'}`}
                />
                {errors.telefon && <p className="text-red-500 text-sm mt-1">{errors.telefon.message}</p>}
              </div>

              <div className="flex justify-between items-center pt-2">
                <Button
                  variant="danger"
                  onClick={handleDelete}
                >
                  Löschen
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setEditingPerson(null)}
                  >
                    Abbrechen
                  </Button>
                  <Button
                    type="submit"
                  >
                    Speichern
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
