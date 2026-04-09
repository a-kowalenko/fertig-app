import React, { useState } from 'react';
import Button from './Button';

export default function PersonSelectionModal({ persons, onClose, onSelect }) {
  const [search, setSearch] = useState('');

  const filteredPersons = persons.filter(p => {
    if (p.processed) return false; // Nur nicht-bearbeitete Kunden

    const term = search.toLowerCase();
    if (!term) return true;

    return (
      (p.vorname && p.vorname.toLowerCase().includes(term)) ||
      (p.nachname && p.nachname.toLowerCase().includes(term)) ||
      (p.email && p.email.toLowerCase().includes(term)) ||
      (p.telefon && p.telefon.toLowerCase().includes(term))
    );
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex xl:items-center justify-center z-[70] px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
          <h3 className="text-lg font-bold text-gray-800">Kunde für gewählten Ordner zuweisen</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <input
            type="text"
            placeholder="Kunden suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div className="flex-1 overflow-y-auto border border-gray-200 rounded p-2 mb-4 bg-gray-50/50">
          {filteredPersons.length > 0 ? (
            <div className="flex flex-col gap-2">
              {filteredPersons.map(p => (
                <div
                  key={p.id}
                  className="flex justify-between items-center p-3 rounded border border-gray-200 bg-white hover:bg-blue-50 transition-colors"
                >
                  <div>
                    <div className="font-medium text-gray-800">{p.vorname} {p.nachname}</div>
                    <div className="text-xs text-gray-500">{p.email} {p.telefon ? `• ${p.telefon}` : ''}</div>
                  </div>
                  <Button
                    onClick={() => onSelect(p.id)}
                    className="text-sm px-4 py-1.5 ml-2"
                  >
                    Auswählen & Exportieren
                  </Button>
                </div>
              ))}
            </div>
          ) : (
             <div className="py-8 text-center text-gray-400 italic">
                {search ? 'Keine passenden Kunden gefunden.' : 'Keine unfertigen Kunden vorhanden.'}
             </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
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
