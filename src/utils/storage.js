// Thin localStorage wrapper. Every piece of app data lives under one of
// these keys as plain JSON, so it survives page reloads with no backend.

export const STORAGE_KEYS = {
  homework: 'studyhub_homework',
  exams: 'studyhub_exams',
  notes: 'studyhub_notes',
  flashcards: 'studyhub_flashcards',
  quizHistory: 'studyhub_quizHistory',
  dailyUploads: 'studyhub_dailyUploads',
  settings: 'studyhub_settings',
}

export function loadFromStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function saveToStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage can be unavailable (private browsing quota, etc). Ignore.
  }
}
