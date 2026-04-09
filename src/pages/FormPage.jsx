import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function FormPage() {
  const { register, handleSubmit, reset, watch, formState: { errors, touchedFields } } = useForm({
    mode: 'onTouched',
    reValidateMode: 'onChange'
  });

  const telefonValue = watch('telefon');

  const onSubmit = async (data) => {
    let loadingToastId;

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
        const result = await window.electronAPI.savePerson(payload);
        if (result.success) {
          toast.success('Person erfolgreich zur Warteschlange hinzugefügt!');
          reset();
        } else {
          toast.error(`Fehler beim Hinzufügen der Person`);
        }
      } else {
        toast.error('Electron API nicht verfügbar. (Browser Modus?)');
        console.log('Daten:', payload);
        reset();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto w-full relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Person aufnehmen</h2>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefon (Optional)</label>
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

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded mt-4 transition-colors"
        >
          Person anlegen
        </button>
      </form>
    </div>
  );
}
