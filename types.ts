export interface CrewMember {
  id: string;
  name: string;
  isActive: boolean;
}

export interface WatchConfig {
  watchDurationHours: number;
  startTime: string; // ISO string
  captainsHourEnabled: boolean;
  captainsHourStart: number; // 0-23
  startDate: string; // ISO string for the date part
}

export interface AppSettings {
  theme: 'light' | 'dark';
  nightVision: boolean;
  shipTimeOffset: number; // Offset in hours from UTC/System time
}

export interface WatchShift {
  id: string;
  startTime: number; // Timestamp
  endTime: number; // Timestamp
  crewMemberIds: string[];
  isCaptainsHour: boolean;
}

export enum RotationStatus {
  GOOD = 'GOOD',
  BAD = 'BAD', // Crew stuck in same slots
  WARNING = 'WARNING'
}