/**
 * Polish public holidays utility
 */

// Fixed date holidays (month is 0-based)
const FIXED_HOLIDAYS = [
  { day: 1, month: 0, name: 'Nowy Rok' },
  { day: 6, month: 0, name: 'Święto Trzech Króli' },
  { day: 1, month: 4, name: 'Święto Pracy' },
  { day: 3, month: 4, name: 'Święto Konstytucji 3 Maja' },
  { day: 15, month: 7, name: 'Wniebowzięcie Najświętszej Maryi Panny' },
  { day: 1, month: 10, name: 'Wszystkich Świętych' },
  { day: 11, month: 10, name: 'Święto Niepodległości' },
  { day: 25, month: 11, name: 'Boże Narodzenie (pierwszy dzień)' },
  { day: 26, month: 11, name: 'Boże Narodzenie (drugi dzień)' },
];

/**
 * Calculate Easter Sunday date for a given year
 * Using Meeus/Jones/Butcher algorithm
 */
function calculateEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, month, day);
}

/**
 * Get all holidays for a given year
 */
export function getHolidays(year: number): Date[] {
  // Get fixed date holidays
  const holidays = FIXED_HOLIDAYS.map(
    ({ day, month }) => new Date(year, month, day)
  );

  // Calculate Easter and related holidays
  const easter = calculateEaster(year);
  
  // Add Easter Monday (1 day after Easter)
  const easterMonday = new Date(easter);
  easterMonday.setDate(easter.getDate() + 1);
  holidays.push(easterMonday);

  // Add Pentecost (49 days after Easter)
  const pentecost = new Date(easter);
  pentecost.setDate(easter.getDate() + 49);
  holidays.push(pentecost);

  // Add Corpus Christi (60 days after Easter)
  const corpusChristi = new Date(easter);
  corpusChristi.setDate(easter.getDate() + 60);
  holidays.push(corpusChristi);

  return holidays;
}

/**
 * Check if a given date is a holiday
 */
export function isHoliday(date: Date): boolean {
  const holidays = getHolidays(date.getFullYear());
  return holidays.some(holiday => 
    holiday.getDate() === date.getDate() &&
    holiday.getMonth() === date.getMonth() &&
    holiday.getFullYear() === date.getFullYear()
  );
}

/**
 * Get holiday name for a given date (if it's a holiday)
 */
export function getHolidayName(date: Date): string | null {
  // Check fixed holidays first
  const fixedHoliday = FIXED_HOLIDAYS.find(
    holiday => holiday.day === date.getDate() && holiday.month === date.getMonth()
  );
  if (fixedHoliday) return fixedHoliday.name;

  // Calculate Easter and related holidays
  const easter = calculateEaster(date.getFullYear());
  
  // Easter Monday
  const easterMonday = new Date(easter);
  easterMonday.setDate(easter.getDate() + 1);
  if (date.getTime() === easterMonday.getTime()) return 'Poniedziałek Wielkanocny';

  // Pentecost
  const pentecost = new Date(easter);
  pentecost.setDate(easter.getDate() + 49);
  if (date.getTime() === pentecost.getTime()) return 'Zielone Świątki';

  // Corpus Christi
  const corpusChristi = new Date(easter);
  corpusChristi.setDate(easter.getDate() + 60);
  if (date.getTime() === corpusChristi.getTime()) return 'Boże Ciało';

  return null;
} 