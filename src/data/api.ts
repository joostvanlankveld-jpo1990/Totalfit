// Datalaag. Nu nog lokaal gegenereerd; vervang deze functies door aanroepen naar
// de echte backend (bijv. een API van het ledensysteem) zonder de schermen aan te passen.
import { dateKey } from '../lib/format';
import { WEEKLY_SCHEDULE, classTypeById } from './catalog';
import { ClassSession, User } from './types';

export const SCHEDULE_DAYS = 14;

// Deterministische "bezetting" zodat het rooster er realistisch uitziet.
function pseudoBooked(seed: string, capacity: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return Math.min(capacity, Math.round((h % 100) / 100 * capacity * 1.1));
}

export function getSchedule(from = new Date(), days = SCHEDULE_DAYS): ClassSession[] {
  const sessions: ClassSession[] = [];
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  for (let i = 0; i < days; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    for (const slot of WEEKLY_SCHEDULE.filter((s) => s.day === day.getDay())) {
      const [h, m] = slot.time.split(':').map(Number);
      const startAt = new Date(day);
      startAt.setHours(h, m, 0, 0);
      const id = `${slot.classTypeId}-${dateKey(day)}-${slot.time.replace(':', '')}`;
      sessions.push({
        id,
        classTypeId: slot.classTypeId,
        start: startAt.toISOString(),
        durationMin: classTypeById(slot.classTypeId).durationMin,
        room: slot.room,
        instructor: slot.instructor,
        capacity: slot.capacity,
        bookedByOthers: pseudoBooked(id, slot.capacity),
      });
    }
  }
  return sessions.sort((a, b) => a.start.localeCompare(b.start));
}

export function getSessionById(id: string): ClassSession | undefined {
  return getSchedule(new Date(Date.now() - 86400000), SCHEDULE_DAYS + 1).find((s) => s.id === id);
}

/**
 * Inhoud van de QR-code voor het inchecken bij de scanner bij de ingang.
 * Nu is dat alleen het lidnummer. Het echte formaat hangt af van het toegangssysteem
 * van de sportschool. Liefst geeft de backend een kortlevende, ondertekende code,
 * zodat een screenshot van de code niet door iemand anders gebruikt kan worden.
 */
export function getCheckInCode(user: User): string {
  return user.memberNumber;
}
