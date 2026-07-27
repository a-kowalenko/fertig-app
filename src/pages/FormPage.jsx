import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '../components/Button';

function parseCustomerJsonPaste(text) {
  const trimmed = text.trim();
  if (!trimmed.startsWith('{')) return null;

  try {
    const data = JSON.parse(trimmed);
    if (typeof data !== 'object' || data === null || Array.isArray(data)) return null;

    const vorname = data.vorname;
    const nachname = data.name ?? data.nachname;
    const email = data.email;
    const telefon = data.telefon;

    if (
      typeof vorname !== 'string' ||
      typeof nachname !== 'string' ||
      typeof email !== 'string'
    ) {
      return null;
    }

    return {
      vorname: vorname.trim(),
      nachname: nachname.trim(),
      email: email.trim(),
      telefon: typeof telefon === 'string' ? telefon.trim() : '',
    };
  } catch {
    return null;
  }
}

async function readClipboardText() {
  if (window.electronAPI?.readClipboardText) {
    return window.electronAPI.readClipboardText();
  }

  if (navigator.clipboard?.readText && document.hasFocus()) {
    return navigator.clipboard.readText();
  }

  return '';
}

function applyCustomerData(parsed, setValue) {
  const fieldOptions = { shouldValidate: true, shouldTouch: true };
  setValue('vorname', parsed.vorname, fieldOptions);
  setValue('nachname', parsed.nachname, fieldOptions);
  setValue('email', parsed.email, fieldOptions);
  setValue('telefon', parsed.telefon, fieldOptions);
}

function hasAnyFormInput(values) {
  return ['vorname', 'nachname', 'email', 'telefon'].some(
    (field) => values[field]?.trim()
  );
}

export default function FormPage() {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors, touchedFields } } = useForm({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      vorname: '',
      nachname: '',
      email: '',
      telefon: '',
    },
  });

  const formValues = watch();
  const telefonValue = watch('telefon');
  const hasFormInput = hasAnyFormInput(formValues);
  const [clipboardCustomer, setClipboardCustomer] = useState(null);
  const lastAppliedClipboardRef = useRef('');

  const checkClipboard = useCallback(async () => {
    try {
      const text = await readClipboardText();
      const trimmedText = text.trim();
      const parsed = parseCustomerJsonPaste(trimmedText);

      if (parsed && trimmedText !== lastAppliedClipboardRef.current) {
        setClipboardCustomer(parsed);
      } else {
        setClipboardCustomer(null);
      }
    } catch {
      setClipboardCustomer(null);
    }
  }, []);

  useEffect(() => {
    checkClipboard();

    const handleFocus = () => checkClipboard();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkClipboard();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const interval = setInterval(checkClipboard, 1000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [checkClipboard]);

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
          lastAppliedClipboardRef.current = '';
          reset();
        } else {
          toast.error(`Fehler beim Hinzufügen der Person`);
        }
      } else {
        toast.error('Electron API nicht verfügbar. (Browser Modus?)');
        console.log('Daten:', payload);
        lastAppliedClipboardRef.current = '';
        reset();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleFormPaste = (e) => {
    const text = e.clipboardData.getData('text');
    const parsed = parseCustomerJsonPaste(text);
    if (!parsed) return;

    e.preventDefault();
    applyCustomerData(parsed, setValue);
    lastAppliedClipboardRef.current = text.trim();
    setClipboardCustomer(null);
  };

  const handleInsertFromClipboard = async () => {
    if (!clipboardCustomer) return;

    try {
      const text = await readClipboardText();
      const trimmedText = text.trim();
      const parsed = parseCustomerJsonPaste(trimmedText);
      if (!parsed) {
        setClipboardCustomer(null);
        return;
      }

      applyCustomerData(parsed, setValue);
      lastAppliedClipboardRef.current = trimmedText;
      setClipboardCustomer(null);
    } catch {
      setClipboardCustomer(null);
    }
  };

  const handleReset = () => {
    reset();
    lastAppliedClipboardRef.current = '';
    checkClipboard();
  };

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto w-full relative"
      onMouseEnter={checkClipboard}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Kunde aufnehmen</h2>
      </div>

      {clipboardCustomer && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between gap-3">
          <p className="text-sm text-blue-800">
            Kundendaten in Zwischenablage:{' '}
            <span className="font-medium">
              {clipboardCustomer.vorname} {clipboardCustomer.nachname}
            </span>
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={handleInsertFromClipboard}
            className="shrink-0 text-sm py-1.5 px-3"
          >
            Einfügen
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} onPaste={handleFormPaste} onFocus={checkClipboard} className="space-y-4">
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

        <Button
          type="submit"
          className="w-full mt-4"
        >
          Kunde anlegen
        </Button>

        {hasFormInput && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
            className="w-full"
          >
            Zurücksetzen
          </Button>
        )}
      </form>
    </div>
  );
}
