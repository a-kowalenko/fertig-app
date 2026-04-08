import React from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import FormPage from './pages/FormPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import UpdateModal from './components/UpdateModal.jsx';

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center">
        <UpdateModal />
        <header className="w-full bg-white shadow-sm border-b mb-8">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 pt-4">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight pb-4 md:pb-0">Fertig App</h1>
            <nav className="flex gap-1 md:gap-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-4 py-2 mt-1 rounded-t-lg font-medium transition-colors border-b-2 flex items-center justify-center ${
                    isActive 
                      ? 'border-blue-600 text-blue-700 bg-blue-50/50' 
                      : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`
                }
              >
                Formular
              </NavLink>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `px-4 py-2 mt-1 rounded-t-lg font-medium transition-colors border-b-2 flex items-center justify-center ${
                    isActive 
                      ? 'border-blue-600 text-blue-700 bg-blue-50/50' 
                      : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`
                }
              >
                Einstellungen
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="w-full max-w-4xl px-4">
          <Routes>
            <Route path="/" element={<FormPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
