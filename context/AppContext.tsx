import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CrewMember, WatchConfig, AppSettings, WatchShift } from '../types';
import { saveToStorage, loadFromStorage } from '../services/storageService';
import { generateSchedule } from '../utils/scheduleLogic';

interface AppContextType {
  crew: CrewMember[];
  addCrewMember: (name: string) => void;
  removeCrewMember: (id: string) => void;
  reorderCrew: (newOrder: CrewMember[]) => void;
  updateCrewMember: (id: string, updates: Partial<CrewMember>) => void;
  
  config: WatchConfig;
  updateConfig: (updates: Partial<WatchConfig>) => void;
  
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  
  schedule: WatchShift[]; // Derived state
  refreshSchedule: () => void;

  // Routing
  currentRoute: string;
  navigateTo: (path: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SAMPLE_CREW: CrewMember[] = [
  { id: 'c-1', name: 'Alex (Skipper)', isActive: true },
  { id: 'c-2', name: 'Sarah (Nav)', isActive: true },
  { id: 'c-3', name: 'James', isActive: true },
  { id: 'c-4', name: 'Mia', isActive: true },
  { id: 'c-5', name: 'Robert', isActive: true },
];

const DEFAULT_CONFIG: WatchConfig = {
  watchDurationHours: 4,
  startTime: '20:00',
  startDate: new Date().toISOString(),
  captainsHourEnabled: true,
  captainsHourStart: 18,
};

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  nightVision: false,
  shipTimeOffset: 0,
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [crew, setCrew] = useState<CrewMember[]>(() => loadFromStorage('wm_crew', SAMPLE_CREW));
  
  const [config, setConfig] = useState<WatchConfig>(() => {
    const saved = loadFromStorage('wm_config', {});
    // Merge defaults to ensure new fields (like startDate) are populated if missing in old save
    return { ...DEFAULT_CONFIG, ...saved };
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = loadFromStorage('wm_settings', {});
    return { ...DEFAULT_SETTINGS, ...saved };
  });

  const [schedule, setSchedule] = useState<WatchShift[]>([]);

  // Simple Hash Router Implementation
  const [currentRoute, setCurrentRoute] = useState(() => window.location.hash.slice(1) || '/');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || '/';
      setCurrentRoute(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (path: string) => {
    window.location.hash = path;
  };

  useEffect(() => {
    saveToStorage('wm_crew', crew);
    refreshSchedule();
  }, [crew]);

  useEffect(() => {
    saveToStorage('wm_config', config);
    refreshSchedule();
  }, [config]);

  useEffect(() => {
    saveToStorage('wm_settings', settings);
    if (settings.nightVision) {
      document.body.classList.add('night-vision-filter');
    } else {
      document.body.classList.remove('night-vision-filter');
    }
    
    if (settings.theme === 'dark' && !settings.nightVision) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

  }, [settings]);

  const refreshSchedule = () => {
    const newSchedule = generateSchedule(crew, config);
    setSchedule(newSchedule);
  };

  const addCrewMember = (name: string) => {
    const newMember: CrewMember = {
      id: crypto.randomUUID(),
      name,
      isActive: true,
    };
    setCrew(prev => [...prev, newMember]);
  };

  const removeCrewMember = (id: string) => {
    setCrew(prev => prev.filter(c => c.id !== id));
  };
  
  const updateCrewMember = (id: string, updates: Partial<CrewMember>) => {
    setCrew(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const reorderCrew = (newOrder: CrewMember[]) => {
    setCrew(newOrder);
  };

  const updateConfig = (updates: Partial<WatchConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider value={{
      crew,
      addCrewMember,
      removeCrewMember,
      reorderCrew,
      updateCrewMember,
      config,
      updateConfig,
      settings,
      updateSettings,
      schedule,
      refreshSchedule,
      currentRoute,
      navigateTo
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};