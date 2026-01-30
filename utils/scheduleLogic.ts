import { CrewMember, WatchConfig, WatchShift, RotationStatus } from '../types';

export const generateSchedule = (
  crew: CrewMember[],
  config: WatchConfig,
  daysToGenerate: number = 7
): WatchShift[] => {
  if (crew.length === 0) return [];

  const activeCrew = crew.filter(c => c.isActive);
  if (activeCrew.length === 0) return [];

  const shifts: WatchShift[] = [];
  
  // Safe date parsing
  let startDateTime: Date;
  try {
    startDateTime = new Date(config.startDate);
    if (isNaN(startDateTime.getTime())) throw new Error("Invalid date");
  } catch (e) {
    startDateTime = new Date();
  }

  // Safe time parsing
  let startHour = 8, startMinute = 0;
  if (config.startTime && config.startTime.includes(':')) {
    const parts = config.startTime.split(':').map(Number);
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        startHour = parts[0];
        startMinute = parts[1];
    }
  }

  let currentCrewIndex = 0;
  startDateTime.setHours(startHour, startMinute, 0, 0);

  let currentTime = startDateTime.getTime();
  const endTime = currentTime + (daysToGenerate * 24 * 60 * 60 * 1000);

  // Prevent infinite loops if duration is 0
  const minDuration = Math.max(0.5, config.watchDurationHours || 3);

  while (currentTime < endTime) {
    const currentDate = new Date(currentTime);
    const currentHour = currentDate.getHours();

    // Check for Captain's Hour
    let isCaptainsHour = false;
    let durationHours = minDuration;

    if (config.captainsHourEnabled) {
      if (currentHour === config.captainsHourStart) {
        isCaptainsHour = true;
        durationHours = 1;
      } else {
        // Calculate time until next captain's hour
        const nextCaptainsHour = new Date(currentDate);
        nextCaptainsHour.setHours(config.captainsHourStart, 0, 0, 0);
        if (nextCaptainsHour.getTime() <= currentTime) {
            nextCaptainsHour.setDate(nextCaptainsHour.getDate() + 1);
        }
        
        const hoursUntilCaptains = (nextCaptainsHour.getTime() - currentTime) / (1000 * 60 * 60);
        
        // Shorten watch if it overlaps into captain's hour
        if (hoursUntilCaptains < durationHours && hoursUntilCaptains > 0.01) {
            durationHours = hoursUntilCaptains;
        }
      }
    }

    const shiftEndTime = currentTime + (durationHours * 60 * 60 * 1000);
    
    shifts.push({
      id: `shift-${currentTime}`,
      startTime: currentTime,
      endTime: shiftEndTime,
      crewMemberIds: isCaptainsHour ? activeCrew.map(c => c.id) : [activeCrew[currentCrewIndex].id],
      isCaptainsHour
    });

    currentTime = shiftEndTime;

    if (!isCaptainsHour) {
      currentCrewIndex = (currentCrewIndex + 1) % activeCrew.length;
    }
  }

  return shifts;
};

export const checkRotationQuality = (crewCount: number, watchLengthHours: number): RotationStatus => {
  if (crewCount === 0 || watchLengthHours === 0) return RotationStatus.WARNING;
  
  const cycleTime = crewCount * watchLengthHours;
  
  if (cycleTime % 24 === 0) return RotationStatus.BAD;
  if (24 % cycleTime === 0) return RotationStatus.BAD;

  return RotationStatus.GOOD;
};

export const formatTime = (timestamp: number, offsetHours: number = 0): string => {
  if (!timestamp || isNaN(timestamp)) return "--:--";
  
  // Ensure offsetHours is a number, default to 0 if undefined/null/NaN
  const safeOffset = (typeof offsetHours === 'number' && !isNaN(offsetHours)) ? offsetHours : 0;
  
  try {
    const date = new Date(timestamp + (safeOffset * 60 * 60 * 1000));
    if (isNaN(date.getTime())) return "--:--";
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch (e) {
    return "--:--";
  }
};