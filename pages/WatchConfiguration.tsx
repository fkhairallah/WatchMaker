import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { RotationStatus } from '../types';
import { checkRotationQuality } from '../utils/scheduleLogic';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const WatchConfiguration: React.FC = () => {
  const { config, updateConfig, crew } = useApp();
  
  const rotationStatus = useMemo(() => 
    checkRotationQuality(crew.length, config.watchDurationHours),
    [crew.length, config.watchDurationHours]
  );

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({ startTime: e.target.value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // We only take the date part
    updateConfig({ startDate: e.target.value });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Watch Schedule</h1>

      <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 space-y-6">
          
          {/* Watch Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Watch Duration (Hours)</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {[2, 3, 4, 6].map(hours => (
                <button
                  key={hours}
                  onClick={() => updateConfig({ watchDurationHours: hours })}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    config.watchDurationHours === hours
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {hours} hours
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Common schedules: 3h (fast rotation), 4h (standard), 6h (long rest).</p>
          </div>

          <hr className="border-gray-100 dark:border-slate-700" />

          {/* Start Time/Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
              <input
                type="date"
                value={config.startDate.split('T')[0]}
                onChange={handleDateChange}
                className="w-full rounded-lg border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Time (Ship Time)</label>
              <input
                type="time"
                value={config.startTime}
                onChange={handleTimeChange}
                className="w-full rounded-lg border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              />
            </div>
          </div>

          {/* Captain's Hour */}
          <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-750 p-4 rounded-lg">
            <div>
              <div className="flex items-center space-x-2">
                 <h3 className="text-sm font-medium text-slate-800 dark:text-white">Captain's Hour</h3>
                 <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded font-bold uppercase">All Hands</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Everyone is awake for 1 hour daily.</p>
            </div>
            <div className="flex items-center space-x-3">
               <select 
                  disabled={!config.captainsHourEnabled}
                  value={config.captainsHourStart}
                  onChange={(e) => updateConfig({ captainsHourStart: Number(e.target.value) })}
                  className="text-sm rounded border-gray-300 dark:border-slate-600 dark:bg-slate-700 px-2 py-1"
               >
                 {Array.from({length: 24}).map((_, i) => (
                   <option key={i} value={i}>{i.toString().padStart(2,'0')}:00</option>
                 ))}
               </select>
               <button
                  onClick={() => updateConfig({ captainsHourEnabled: !config.captainsHourEnabled })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${config.captainsHourEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-slate-600'}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.captainsHourEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
            </div>
          </div>

        </div>
      </section>

      {/* Rotation Health Check */}
      <div className={`rounded-xl p-5 border ${
        rotationStatus === RotationStatus.BAD 
          ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-900 dark:text-red-300' 
          : rotationStatus === RotationStatus.WARNING
            ? 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-900 dark:text-yellow-300'
            : 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900 dark:text-green-300'
      }`}>
        <div className="flex items-start space-x-3">
          {rotationStatus === RotationStatus.BAD && <AlertTriangle className="w-6 h-6 flex-shrink-0" />}
          {rotationStatus === RotationStatus.WARNING && <Info className="w-6 h-6 flex-shrink-0" />}
          {rotationStatus === RotationStatus.GOOD && <CheckCircle className="w-6 h-6 flex-shrink-0" />}
          
          <div>
            <h3 className="font-semibold text-lg">
              {rotationStatus === RotationStatus.BAD && 'Static Rotation Detected'}
              {rotationStatus === RotationStatus.WARNING && 'Check Configuration'}
              {rotationStatus === RotationStatus.GOOD && 'Healthy Rotation'}
            </h3>
            <p className="text-sm mt-1 opacity-90">
              {rotationStatus === RotationStatus.BAD && 
                `With ${crew.length} crew and ${config.watchDurationHours}h watches, the schedule repeats exactly every 24 hours. Crew will get the same sleep hours every night.`}
              {rotationStatus === RotationStatus.WARNING && 
                "Add more crew or adjust settings to calculate rotation health."}
              {rotationStatus === RotationStatus.GOOD && 
                `With ${crew.length} crew and ${config.watchDurationHours}h watches, the schedule will drift naturally, ensuring fair share of night shifts.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};