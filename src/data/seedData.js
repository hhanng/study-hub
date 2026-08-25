// ============================================================================
// Real class list and schedule, sourced from her syllabi and school calendar
// exports (John Paul II HS runs a true alternating A-Day / B-Day block
// schedule — each class meets on ONE of the two day types, not daily).
//
// To keep updating this file easy: `subjects` drives every dropdown in the
// app (Homework, Exams, Syllabus, Practice, Performance). `daySchedule`
// drives the period grid on the Schedule page. Both are safe to hand-edit
// the same way as before.
// ============================================================================

// The 7 academic classes with real coursework (quizzes/homework/exams).
// Community Service and Girls' Basketball are period commitments too, but
// don't have graded coursework, so they're kept out of the quiz/homework
// dropdowns — see `extraPeriods` below for where they show up instead.
export const subjects = [
  'Theology I',
  'World Cultures and Geography',
  'Art I: 2D Drawing/Painting',
  'Algebra I',
  'Biology',
  'Principles of Computer Science',
  'English I',
]

// Subjects to visually flag as priority focus areas on the Performance page.
export const prioritySubjects = ['English I', 'Principles of Computer Science']

export const subjectColors = {
  'Theology I': '#7a3b8f',
  'World Cultures and Geography': '#2e8b57',
  'Art I: 2D Drawing/Painting': '#b3862e',
  'Algebra I': '#1a5c99',
  'Biology': '#b30000',
  'Principles of Computer Science': '#5c3d99',
  'English I': '#99331a',
  'Community Service': '#555555',
  "Girls' Basketball": '#888888',
}

// Periods that don't carry graded coursework — shown on the Schedule page's
// period grid, but left out of `subjects` (no quizzes/homework for these).
export const extraPeriods = {
  4: { subject: "Girls' Basketball", teacher: 'Mr. John Griffin' },
}

// Her real period-by-period schedule. JPII runs on alternating A/B days, so
// each class meets on only one of the two — not every day. `confirmed:
// false` means the day-type is a reasonable inference (from a typical 4/4
// block split) rather than something directly confirmed in a syllabus or
// portal export — double check before relying on it.
export const daySchedule = {
  A: [
    { period: 1, subject: 'Theology I', teacher: 'Ms. Tuñón', room: '1121', confirmed: false },
    { period: 2, subject: 'World Cultures and Geography', teacher: 'Mr. Zachary Berry', confirmed: true },
    { period: 3, subject: 'Art I: 2D Drawing/Painting', teacher: 'Ms. Cindy Mills', room: '1407', confirmed: true },
    { period: 4, subject: "Girls' Basketball", teacher: 'Mr. John Griffin', confirmed: false },
  ],
  B: [
    { period: 5, subject: 'Algebra I', teacher: 'Mrs. Granier', confirmed: true },
    { period: 6, subject: 'Biology', teacher: 'Ms. Stacy Grizzle', room: '2407', confirmed: true },
    { period: 7, subject: 'Principles of Computer Science', teacher: 'Mr. John Schram', confirmed: true },
    { period: 8, subject: 'English I', teacher: 'Mr. Matthew Duffy', confirmed: true },
  ],
}
