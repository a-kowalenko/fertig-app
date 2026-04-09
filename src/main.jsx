import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './style.css';

const splashElement = document.getElementById('app-splash');
const splashVersionElement = document.getElementById('app-splash-version');
const splashLoadingTextElement = document.getElementById('app-splash-loading-text');

const FUNNY_LOADING_TEXTS = [
  'Sortiere Kaffee nach Bohnen-Prioritaet...',
  'Bringe Pixel in Reih und Glied...',
  'Verhandle mit der Ladeleiste...',
  'Fuehre eine sehr wichtige Mauskonferenz durch...',
  'Poliere den Export-Button...',
  'Suche den schnellsten Weg durch den RAM...',
  'Entstaube die Formulareingaben...',
  'Kalibriere den Spinner auf Maximum...',
  'Aktiviere den Turbo fuer gute Laune...',
  'Finde den perfekten Farbton fuer Produktivitaet...',
  'Falte die Daten in ordentliche Pakete...',
  'Waerme die Datenbank auf Betriebstemperatur...',
  'Fuehre geheime Qualitaetsrituale aus...',
  'Bringe alle Kundenkarten in Formation...',
  'Richte die Historie fuer Glanzauftritte her...',
  'Verbinde Sternenstaub mit Benutzerfreundlichkeit...',
  'Schicke den Debug-Ninja auf Kontrollrunde...',
  'Lade gute Vibes aus dem Cache...',
  'Synchronisiere produktive Gedanken...',
  'Setze den Feierabendmodus schon mal auf Standby...'
];

const VERSION_FALLBACK = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.2';
let funnyTextIntervalId = null;
let lastFunnyText = '';

function pickRandomFunnyText() {
  const pool = FUNNY_LOADING_TEXTS.filter((item) => item !== lastFunnyText);
  const nextText = pool[Math.floor(Math.random() * pool.length)] || FUNNY_LOADING_TEXTS[0];
  lastFunnyText = nextText;
  return nextText;
}

function formatVersionLabel(meta) {
  const version = meta?.version || VERSION_FALLBACK;
  const buildNumber = meta?.buildNumber ? String(meta.buildNumber).trim() : '';
  const channel = meta?.channel ? String(meta.channel).trim() : '';

  if (!buildNumber) {
    return `Version ${version.startsWith('v') ? version : `v${version}`}`;
  }

  const buildSuffix = channel ? `${buildNumber}/${channel}` : buildNumber;
  const normalizedVersion = version.startsWith('v') ? version : `v${version}`;
  return `Version ${normalizedVersion} (${buildSuffix})`;
}

async function prepareSplashMetadata() {
  if (!splashElement) return;


  if (!splashVersionElement) return;

  if (window.electronAPI?.getAppMeta) {
    try {
      const appMeta = await window.electronAPI.getAppMeta();
      splashVersionElement.textContent = formatVersionLabel(appMeta);
      return;
    } catch (error) {
      console.error('Konnte App-Metadaten nicht laden:', error);
    }
  }

  if (window.electronAPI?.getAppVersion) {
    try {
      const version = await window.electronAPI.getAppVersion();
      splashVersionElement.textContent = formatVersionLabel({ version });
      return;
    } catch (error) {
      console.error('Konnte App-Version nicht laden:', error);
    }
  }

  splashVersionElement.textContent = `Version ${VERSION_FALLBACK}`;
}

function startFunnyLoadingTextCycle() {
  if (!splashElement || !splashLoadingTextElement || splashElement.classList.contains('is-hiding')) {
    return;
  }

  splashElement.classList.add('is-delayed');
  splashLoadingTextElement.hidden = false;
  splashLoadingTextElement.textContent = pickRandomFunnyText();

  funnyTextIntervalId = window.setInterval(() => {
    splashLoadingTextElement.textContent = pickRandomFunnyText();
  }, 5000);
}

function removeSplash() {
  if (!splashElement) return;

  splashElement.classList.add('is-hiding');
  window.setTimeout(() => {
    splashElement.remove();
  }, 260);
}

prepareSplashMetadata();

const loadingTextTimeoutId = window.setTimeout(() => {
  startFunnyLoadingTextCycle();
}, 1000);

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

window.requestAnimationFrame(() => {
  window.requestAnimationFrame(() => {
    window.clearTimeout(loadingTextTimeoutId);
    if (funnyTextIntervalId) {
      window.clearInterval(funnyTextIntervalId);
    }
    removeSplash();
  });
});

