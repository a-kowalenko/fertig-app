import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function FormPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    mode: 'onTouched',
    reValidateMode: 'onChange'
  });

  const [status, setStatus] = useState(null);

  const onSubmit = async (data) => {
    setStatus({ type: 'info', message: 'Wähle den Zielordner...' });
    
    try {
      const payload = {
        vorname: data.vorname.trim(),
        nachname: data.nachname.trim(),
        email: data.email.trim(),
      };

      if (data.telefon && data.telefon.trim()) {
        payload.telefon = data.telefon.trim();
      }

      if (window.electronAPI) {
        const result = await window.electronAPI.selectFolderAndSave(payload);
        if (result.success) {
          setStatus({ type: 'success', message: `Erfolgreich gespeichert in:\n${result.filePath}` });
          reset();
        } else {
          setStatus({ type: 'error', message: `Fehler: ${result.error}` });
        }
      } else {
        setStatus({ type: 'error', message: 'Electron API nicht verfügbar. (Browser Modus?)' });
        console.log('Daten:', payload);
        reset();
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto w-full relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Person aufnehmen</h2>
      </div>

      <div className="h-20 mb-2 relative">
        {status ? (
          <div className={`absolute inset-0 p-4 rounded ${
            status.type === 'success' ? 'bg-green-100 text-green-800' : 
            status.type === 'error' ? 'bg-red-100 text-red-800' : 
            'bg-blue-100 text-blue-800'
          } whitespace-pre-wrap break-all flex items-center justify-center text-center overflow-auto shadow-sm`}>
            {status.message}
          </div>
        ) : (
          <div className="absolute inset-0 p-4 rounded bg-gray-50 flex items-center justify-center text-gray-500 border border-dashed border-gray-300">
            Bitte fülle das Formular aus.
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none ${errors.vorname ? 'border-red-500' : 'border-gray-300'}`}
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
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none ${errors.nachname ? 'border-red-500' : 'border-gray-300'}`}
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
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefon (Optional)</label>
          <input
            type="tel"
            {...register('telefon', {
              pattern: {
                value: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]*$/,
                message: 'Bitte eine gültige Telefonnummer eingeben'
              }
            })}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none ${errors.telefon ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.telefon && <p className="text-red-500 text-sm mt-1">{errors.telefon.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded mt-4 transition-colors"
        >
          Ordner auswählen & Speichern
        </button>
      </form>
    </div>
  );
}
