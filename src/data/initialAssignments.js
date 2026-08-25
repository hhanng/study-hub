// ============================================================================
// One-time seed data for the Homework and Exam trackers, pulled from her
// actual syllabi, the school's parent-portal calendar, and the compiled
// academic planner (cross-checked against each other — a couple of CS dates
// in the planner were off by a day vs. the syllabus's own A/B-day table;
// the syllabus version won since it's the primary source).
//
// This only seeds localStorage ONCE, the first time the app loads with an
// empty tracker (see DataContext.jsx) — after that it's normal editable
// data, so marking things done/deleting them sticks and won't reset on
// reload. Past-dated items are skipped except the two Biology assignments
// still showing as missing/ungraded as of the source date.
// ============================================================================

export const initialHomework = [
  { subject: 'Biology', title: 'CW: GC Scavenger Hunt', dueDate: '2026-08-11', done: false },
  { subject: 'Biology', title: 'HW: Syllabus and Safety Contract', dueDate: '2026-08-17', done: false },
  { subject: 'Principles of Computer Science', title: 'Signed Policy Form (needs a parent signature)', dueDate: '2026-08-25', done: false },
  { subject: 'Algebra I', title: '1.5 Writing Expressions HW', dueDate: '2026-08-27', done: false },
  { subject: 'Principles of Computer Science', title: 'Loading Files in jGRASP', dueDate: '2026-08-27', done: false },
  { subject: 'Art I: 2D Drawing/Painting', title: 'Daily Draw #1-5 (sketchbook)', dueDate: '2026-08-28', done: false },
  { subject: 'World Cultures and Geography', title: 'Ch.2 (2.2) notes: Rise of Egypt cont.', dueDate: '2026-08-28', done: false },
  { subject: 'Algebra I', title: '1.6 Combining Like Terms HW', dueDate: '2026-08-31', done: false },
  { subject: 'Principles of Computer Science', title: 'Exercises 3.2-4', dueDate: '2026-08-31', done: false },
  { subject: 'Principles of Computer Science', title: 'Minor Lab 3A Parts 1 & 2 (show to Mr. Schram AND turn in to Classroom)', dueDate: '2026-08-31', done: false },
  { subject: 'Principles of Computer Science', title: 'Minor Lab 3B', dueDate: '2026-09-02', done: false },
  { subject: 'Principles of Computer Science', title: 'Exercises 3.5-7', dueDate: '2026-09-08', done: false },
]

export const initialExams = [
  { subject: 'Biology', title: 'Lab: Waterpalooza + Quiz', date: '2026-08-25', notes: 'Major grade — good opportunity to pull the Biology grade up' },
  { subject: 'Principles of Computer Science', title: 'Chapters 1 & 2 Test', date: '2026-08-25', notes: 'Bring laptop — all chapter tests are done online' },
  { subject: 'World Cultures and Geography', title: 'Project Due (Intro + Comparison Chart)', date: '2026-09-01', notes: 'Major grade' },
  { subject: 'Algebra I', title: 'Unit 1 Test (sections 1.1–1.6)', date: '2026-09-02', notes: '' },
  { subject: 'Principles of Computer Science', title: 'Chapter 3 Test', date: '2026-09-08', notes: '' },
  { subject: 'World Cultures and Geography', title: 'Chapter 2 Quiz + Ch.2 notes due', date: '2026-09-17', notes: 'Egypt, E. Mediterranean, Indus Valley, China — open-note' },
  { subject: 'Principles of Computer Science', title: 'Chapter 4 Test', date: '2026-09-25', notes: '' },
  { subject: 'World Cultures and Geography', title: 'Chapter 3 Quiz + Ch.3 notes due', date: '2026-09-28', notes: 'Akkad, Babylon, Egypt/Kush, Assyria/Persia — open-note' },
  { subject: 'World Cultures and Geography', title: 'Quarter 1 Exam (40 MC, cumulative)', date: '2026-09-30', notes: 'Covers Ch. 1–3' },
  { subject: 'World Cultures and Geography', title: 'Thesis Test (paragraph writing skill)', date: '2026-10-06', notes: '' },
  { subject: 'Principles of Computer Science', title: 'Lab 5B due (first major lab)', date: '2026-10-07', notes: '' },
  { subject: 'Principles of Computer Science', title: 'Chapter 5 Test', date: '2026-10-09', notes: '' },
  { subject: 'Community Service', title: 'Service Experiences 1, 2 & 3 due', date: '2026-10-09', notes: '3:55 PM — long-term, no rush' },
  { subject: 'PSAT', title: 'PSAT (school-wide)', date: '2026-10-19', notes: '' },
  { subject: 'Principles of Computer Science', title: 'Chapter 6 Test', date: '2026-11-03', notes: '' },
  { subject: 'Principles of Computer Science', title: 'Chapter 7 Test', date: '2026-11-19', notes: '' },
  { subject: 'Principles of Computer Science', title: 'Christmas Project due', date: '2026-12-11', notes: '' },
  { subject: 'All Classes', title: 'Fall Semester Final Exam Week begins', date: '2026-12-15', notes: 'Study Day is Dec 14; exams run Dec 15–18' },
]
