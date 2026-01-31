import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, GripVertical, Plus, User } from 'lucide-react';

export const CrewManagement: React.FC = () => {
  const { crew, addCrewMember, removeCrewMember, updateCrewMember, reorderCrew, navigateTo } = useApp();
  const [newName, setNewName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      addCrewMember(newName.trim());
      setNewName('');
    }
  };

  const moveCrew = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === crew.length - 1) return;
    
    const newCrew = [...crew];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newCrew[index], newCrew[swapIndex]] = [newCrew[swapIndex], newCrew[index]];
    reorderCrew(newCrew);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Crew List</h1>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
          {crew.length} Active
        </span>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter crew name..."
          className="flex-1 rounded-lg border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
        />
        <button
          type="submit"
          disabled={!newName.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="space-y-3">
        {crew.map((member, index) => (
          <div
            key={member.id}
            className="group bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 flex items-center justify-between transition-all"
          >
            <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigateTo(`/crew/${member.id}`)}>
              <div className="flex flex-col space-y-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); moveCrew(index, 'up'); }}
                  disabled={index === 0}
                  className="text-gray-300 hover:text-blue-500 disabled:opacity-0"
                >
                  <GripVertical className="w-4 h-4 transform rotate-90" />
                </button>
                 <button 
                  onClick={(e) => { e.stopPropagation(); moveCrew(index, 'down'); }}
                  disabled={index === crew.length - 1}
                  className="text-gray-300 hover:text-blue-500 disabled:opacity-0"
                >
                  <GripVertical className="w-4 h-4 transform rotate-90" />
                </button>
              </div>
              
              <div className="bg-gray-100 dark:bg-slate-700 p-2.5 rounded-full">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              
              <div className="flex flex-col">
                <span className="font-semibold text-slate-800 dark:text-white text-lg">{member.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Position #{index + 1} in rotation</span>
              </div>
            </div>

            <button
              onClick={() => removeCrewMember(member.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              aria-label="Remove crew member"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        
        {crew.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl">
            <p className="text-gray-500 dark:text-gray-400">No crew members yet.</p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-slate-800/50 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-300">
        <p className="font-medium mb-1">Tip:</p>
        <p>Order matters! The rotation will follow the sequence shown above. Use the arrows to reorder.</p>
      </div>
    </div>
  );
};