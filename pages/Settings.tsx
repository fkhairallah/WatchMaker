import React from 'react';
import { useApp } from '../context/AppContext';
import { Moon, Sun, Eye, Clock, RotateCcw } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const handleReset = () => {
    if (window.confirm("Reset all settings to default?")) {
       localStorage.clear();
       window.location.reload();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>

      {/* Theme */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Appearance</h2>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-2 flex">
          <button
            onClick={() => updateSettings({ theme: 'light' })}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg transition-all ${
              settings.theme === 'light' 
                ? 'bg-gray-100 text-slate-900 font-medium' 
                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            <Sun className="w-5 h-5" />
            <span>Light</span>
          </button>
          <button
            onClick={() => updateSettings({ theme: 'dark' })}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg transition-all ${
              settings.theme === 'dark' 
                ? 'bg-slate-700 text-white font-medium' 
                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            <Moon className="w-5 h-5" />
            <span>Dark</span>
          </button>
        </div>
      </section>

      {/* Night Vision */}
      <section className="space-y-4">
        <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${settings.nightVision ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300'}`}>
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white">Night Vision Mode</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Red tint to preserve eyes at night.</p>
            </div>
          </div>
          <button
            onClick={() => updateSettings({ nightVision: !settings.nightVision })}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.nightVision ? 'bg-red-600' : 'bg-gray-200 dark:bg-slate-600'}`}
          >
             <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.nightVision ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
        </div>
      </section>

      {/* Ship Time */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Time & Location</h2>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-slate-800 dark:text-white">Ship Time Offset</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Adjust the ship's clock relative to UTC/System time as you cross timezones.
            </p>
            <div className="flex items-center space-x-4">
                <button 
                    onClick={() => updateSettings({ shipTimeOffset: settings.shipTimeOffset - 1 })}
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center font-bold text-lg hover:bg-gray-200 dark:hover:bg-slate-600"
                >-</button>
                <div className="flex-1 text-center font-mono text-xl font-medium dark:text-white">
                    {settings.shipTimeOffset > 0 ? '+' : ''}{settings.shipTimeOffset} Hrs
                </div>
                <button 
                     onClick={() => updateSettings({ shipTimeOffset: settings.shipTimeOffset + 1 })}
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center font-bold text-lg hover:bg-gray-200 dark:hover:bg-slate-600"
                >+</button>
            </div>
        </div>
      </section>

      {/* Danger Zone */}
       <section className="pt-6 border-t border-gray-200 dark:border-slate-800">
        <button 
            onClick={handleReset}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors"
        >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Application Data</span>
        </button>
       </section>

    </div>
  );
};