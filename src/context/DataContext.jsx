import { createContext, useContext, useEffect, useState } from 'react'
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../utils/storage'
import { initialHomework, initialExams } from '../data/initialAssignments'
import { initialNotes } from '../data/initialNotes'

const SEED_FLAG_KEY = 'studyhub_seeded_v1'

const DataContext = createContext(null)

function useStoredState(key, initial) {
  const [value, setValue] = useState(() => loadFromStorage(key, initial))
  useEffect(() => {
    saveToStorage(key, value)
  }, [key, value])
  return [value, setValue]
}

let idCounter = 0
function makeId() {
  idCounter += 1
  return `${Date.now()}_${idCounter}`
}

export function DataProvider({ children }) {
  const [homework, setHomework] = useStoredState(STORAGE_KEYS.homework, [])
  const [exams, setExams] = useStoredState(STORAGE_KEYS.exams, [])
  const [notes, setNotes] = useStoredState(STORAGE_KEYS.notes, {})
  const [flashcards, setFlashcards] = useStoredState(STORAGE_KEYS.flashcards, {})
  const [quizHistory, setQuizHistory] = useStoredState(STORAGE_KEYS.quizHistory, [])
  const [dailyUploads, setDailyUploads] = useStoredState(STORAGE_KEYS.dailyUploads, {})
  const [settings, setSettings] = useStoredState(STORAGE_KEYS.settings, { apiKey: '' })

  // First-run only: if no key is saved yet but a .env.local default exists,
  // seed localStorage with it so the app works immediately after `npm run dev`.
  useEffect(() => {
    if (!settings.apiKey && import.meta.env.VITE_GEMINI_API_KEY) {
      setSettings((prev) => ({ ...prev, apiKey: import.meta.env.VITE_GEMINI_API_KEY }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // First-run only: seed real homework/exams/syllabus notes pulled from her
  // actual syllabi. Gated by a flag so deleting a seeded item (or editing a
  // note) sticks — it won't come back on the next reload.
  useEffect(() => {
    if (!window.localStorage.getItem(SEED_FLAG_KEY)) {
      setHomework((prev) => (prev.length === 0 ? initialHomework.map((h) => ({ id: makeId(), done: false, ...h })) : prev))
      setExams((prev) => (prev.length === 0 ? initialExams.map((e) => ({ id: makeId(), ...e })) : prev))
      setNotes((prev) => ({ ...initialNotes, ...prev }))
      window.localStorage.setItem(SEED_FLAG_KEY, '1')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addHomework = (item) =>
    setHomework((prev) => [...prev, { id: makeId(), done: false, ...item }])
  const toggleHomework = (id) =>
    setHomework((prev) => prev.map((h) => (h.id === id ? { ...h, done: !h.done } : h)))
  const deleteHomework = (id) => setHomework((prev) => prev.filter((h) => h.id !== id))

  const addExam = (item) => setExams((prev) => [...prev, { id: makeId(), ...item }])
  const deleteExam = (id) => setExams((prev) => prev.filter((e) => e.id !== id))

  const updateNotes = (subject, text) =>
    setNotes((prev) => ({ ...prev, [subject]: text }))

  const addFlashcards = (subject, cards) =>
    setFlashcards((prev) => ({
      ...prev,
      [subject]: [...(prev[subject] || []), ...cards.map((c) => ({ id: makeId(), ...c }))],
    }))
  const deleteFlashcard = (subject, id) =>
    setFlashcards((prev) => ({
      ...prev,
      [subject]: (prev[subject] || []).filter((c) => c.id !== id),
    }))

  const addQuizResult = (result) =>
    setQuizHistory((prev) => [...prev, { id: makeId(), ...result }])

  const setDailyUpload = (isoDate, subject, content) =>
    setDailyUploads((prev) => ({
      ...prev,
      [isoDate]: {
        ...(prev[isoDate] || {}),
        [subject]: { content, uploadedAt: new Date().toISOString() },
      },
    }))

  const value = {
    homework, addHomework, toggleHomework, deleteHomework,
    exams, addExam, deleteExam,
    notes, updateNotes,
    flashcards, addFlashcards, deleteFlashcard,
    quizHistory, addQuizResult,
    dailyUploads, setDailyUpload,
    settings,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside <DataProvider>')
  return ctx
}
