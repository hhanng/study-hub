// ============================================================================
// EDIT ME — daily "what she needs" essentials: A/B rotation day, uniform, and
// bell schedule, cross-checked against the school's parent-portal calendar,
// the CS syllabus's own A-Day/B-Day date table, and the compiled academic
// planner — all three agreed, so this range is high-confidence.
//
// Only dates actually confirmed by a source are listed. Extend the same way,
// checking the portal directly:
//
//   '2026-09-08': {
//     dayType: 'B',              // 'A' or 'B'
//     uniform: 'Cardinal Colors',
//     bellSchedule: 'Regular',
//     notes: [],
//   },
//
// Keys are ISO dates (YYYY-MM-DD).
// ============================================================================

export function getDayType(isoDate) {
  return schoolCalendar[isoDate]?.dayType ?? null
}

export const schoolCalendar = {
  '2026-08-10': {
    dayType: 'A',
    uniform: 'Formal',
    bellSchedule: 'Regular',
    notes: ['First Day of Classes', 'Quarter 1 Begins', 'Progress 1 Begins', 'Senior Sunrise', '10:10a Praise & Worship'],
  },
  '2026-08-11': {
    dayType: 'B',
    uniform: 'Formal',
    bellSchedule: 'Regular',
    notes: [],
  },
  '2026-08-12': {
    dayType: 'A',
    uniform: 'Cardinal Colors',
    bellSchedule: 'Regular',
    notes: [],
  },
  '2026-08-13': {
    dayType: 'B',
    uniform: 'Cardinal Colors',
    bellSchedule: 'Service schedule',
    notes: ['8:00a Weekly Mass', '8:45a Service Fair', '10:10a Confessions', '3:45p Treat Sales'],
  },
  '2026-08-14': {
    dayType: 'A',
    uniform: 'JPII Dress',
    bellSchedule: 'Regular',
    notes: ['10:10a Class Officer elections'],
  },
  '2026-08-18': {
    dayType: 'A',
    uniform: 'Formal',
    bellSchedule: 'Regular',
    notes: ['8:00a Yearbook Photos', '10:00a All School Mass'],
  },
  '2026-08-19': {
    dayType: 'B',
    uniform: 'Cardinal Colors',
    bellSchedule: 'Regular',
    notes: ['2:00p Early Dismissal', '6:00p Meet the Teacher Night'],
  },
  '2026-08-20': {
    dayType: 'A',
    uniform: 'Cardinal Colors',
    bellSchedule: 'Regular',
    notes: [],
  },
  '2026-08-21': {
    dayType: 'B',
    uniform: 'Cardinal Colors',
    bellSchedule: 'Regular',
    notes: ['Heavy exam day — Algebra Mid-Chapter Test, CS Quiz 2.1-3'],
  },
  '2026-08-24': {
    dayType: 'A',
    uniform: 'Cardinal Colors',
    bellSchedule: 'Regular',
    notes: ['World Cultures Ch.1 open-note quiz'],
  },
  '2026-08-25': {
    dayType: 'B',
    uniform: 'Cardinal Colors',
    bellSchedule: 'Regular',
    notes: ['Double major-grade day: Biology Waterpalooza Lab 9:35a, CS Ch.1-2 Test 2:15p', '12:00p Class of 2030 Activity', '6:00p Meet the Counselors'],
  },
  '2026-08-26': {
    dayType: 'A',
    uniform: 'Cardinal Colors',
    bellSchedule: 'Regular',
    notes: ['Freshman Retreat (off-campus, all day)'],
  },
  '2026-08-27': {
    dayType: 'B',
    uniform: 'Cardinal Colors',
    bellSchedule: 'Regular',
    notes: [],
  },
  '2026-08-28': {
    dayType: 'A',
    uniform: 'JPII Dress',
    bellSchedule: 'Pep rally schedule',
    notes: ['Progress 1 grading period ends', '3:00p Fall Sports Pep Rally'],
  },
  '2026-08-31': { dayType: 'B', uniform: null, bellSchedule: null, notes: [] },
  '2026-09-01': { dayType: 'A', uniform: null, bellSchedule: null, notes: ['Progress 1 grades posted'] },
  '2026-09-02': { dayType: 'B', uniform: null, bellSchedule: null, notes: [] },
  '2026-09-03': { dayType: 'A', uniform: null, bellSchedule: null, notes: [] },
  '2026-09-04': { dayType: null, uniform: null, bellSchedule: null, notes: ['Student Holiday — no school (Faculty Diocesan In-Service)'] },
  '2026-09-08': { dayType: 'B', uniform: null, bellSchedule: null, notes: [] },
}
