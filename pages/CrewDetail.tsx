import React from 'react';
import { useApp } from '../context/AppContext';
import { formatTime } from '../utils/scheduleLogic';
import { ArrowLeft, Clock } from 'lucide-react';

export const CrewDetail: React.FC = () => {
  const { crew, schedule, settings, currentRoute, navigateTo } = useApp();
  
  // Extract ID from path like /crew/:id
  const id = currentRoute.split('/').pop();

  const member = crew.find(c => c.id === id);

  if (!member) {
    return (
      <div className="text-center py-10">
        <p>Crew member not found.</p>
        <button onClick={() => navigateTo('/crew')} className="text-blue-500 underline mt-2">Go back</button>
      </div>
    );
  }

  const memberShifts = schedule.filter(s => s.crewMemberIds.includes(member.id));

  // Group by day for nicer display
  const shiftsByDay: Record<string, typeof memberShifts> = {};
  
  memberShifts.forEach(shift => {
    // Adjust for Ship Time visualization
    const date = new Date(shift.startTime + (settings.shipTimeOffset * 3600000));
    const dayKey = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    if (!shiftsByDay[dayKey]) shiftsByDay[dayKey] = [];
    shiftsByDay[dayKey].push(shift);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <button 
        onClick={() => navigateTo('/crew')} 
        className="flex items-center text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-sky-300">{member.name}</h1>
        <p className="text-gray-500 dark:text-gray-400">Personal Watch Schedule</p>
      </div>

      <div className="space-y-6">
        {Object.keys(shiftsByDay).length === 0 && (
            <div className="p-4 bg-gray-100 dark:bg-[#1e293b] rounded text-center border dark:border-[#2d3e50]">No shifts assigned.</div>
        )}
        
        {Object.entries(shiftsByDay).map(([day, shifts]) => (
          <div key={day} className="space-y-2">
            <h3 className="sticky top-16 z-10 bg-gray-50/95 dark:bg-[#0a1929]/95 backdrop-blur py-2 px-1 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-200 dark:border-[#2d3e50]">
              {day}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {shifts.map(shift => {
                  const isNight = new Date(shift.startTime).getHours() < 6 || new Date(shift.startTime).getHours() > 20;
                  return (
                    <div 
                        key={shift.id} 
                        className={`p-4 rounded-xl border flex justify-between items-center transition-transform hover:scale-[1.01] ${
                            isNight 
                            ? 'bg-[#0d2847] border-[#1e3a5f] text-white' 
                            : 'bg-white border-gray-200 text-slate-800 dark:bg-[#1e293b] dark:border-[#2d3e50] dark:text-slate-100'
                        }`}
                    >
                    <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${isNight ? 'bg-[#1e3a5f] border border-[#2d4a6f]' : 'bg-blue-50 dark:bg-[#0d2847] dark:border dark:border-[#1e3a5f]'}`}>
                        <Clock className={`w-5 h-5 ${isNight ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`} />
                        </div>
                        <div>
                        <span className="font-mono text-lg font-semibold">
                            {formatTime(shift.startTime, settings.shipTimeOffset)} - {formatTime(shift.endTime, settings.shipTimeOffset)}
                        </span>
                        {shift.isCaptainsHour && (
                            <div className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase mt-0.5">Captain's Hour</div>
                        )}
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs opacity-60 font-medium uppercase tracking-wider">
                            {Math.round((shift.endTime - shift.startTime) / (1000 * 60 * 60))} Hours
                        </span>
                    </div>
                    </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

