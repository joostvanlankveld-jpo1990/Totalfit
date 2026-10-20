// Bedragen worden overal als hele centen opgeslagen, zodat er geen afrondingsfouten ontstaan.
export function formatPrice(cents: number): string {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(Math.round(cents));
  const euros = Math.floor(abs / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const rest = (abs % 100).toString().padStart(2, '0');
  return `${sign}€ ${euros},${rest}`;
}

const DAYS = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
const DAYS_SHORT = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
const MONTHS = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
const MONTHS_LONG = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december',
];

export const dayName = (d: Date) => DAYS[d.getDay()];
export const dayShort = (d: Date) => DAYS_SHORT[d.getDay()];
export const monthShort = (d: Date) => MONTHS[d.getMonth()];

export function formatTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function formatLongDate(d: Date): string {
  return `${dayName(d)} ${d.getDate()} ${MONTHS_LONG[d.getMonth()]}`;
}

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return dateKey(a) === dateKey(b);
}

export function relativeDay(d: Date, now = new Date()): string {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round((target.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return 'Vandaag';
  if (diff === 1) return 'Morgen';
  return formatLongDate(d).replace(/^./, (c) => c.toUpperCase());
}
