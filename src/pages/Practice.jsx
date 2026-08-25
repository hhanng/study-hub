import { useEffect, useMemo, useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import { subjects, daySchedule } from '../data/seedData'
import { getDayType } from '../data/schoolCalendar'
import SubjectBadge from '../components/SubjectBadge.jsx'
import Flashcard from '../components/Flashcard.jsx'
import QuizRunner from '../components/QuizRunner.jsx'
import { generateFlashcards, generateQuiz, generatePracticeProblem, GeminiError } from '../utils/gemini'
import { extractPdfText } from '../utils/pdf'
import {
  supportsFolderSave,
  chooseNotesFolder,
  getSavedFolderHandle,
  ensureFolderPermission,
  saveFileToFolder,
  downloadFileCopy,
} from '../utils/fileSave'
import { todayISO, formatDateLong } from '../utils/date'
import './Practice.css'

export default function Practice() {
  const { flashcards, addFlashcards, deleteFlashcard, dailyUploads, setDailyUpload, addQuizResult, settings } = useData()
  const [subject, setSubject] = useState(subjects[0])

  // Today's notes / quiz state
  const [isoDate, setIsoDate] = useState(todayISO())
  const [noteText, setNoteText] = useState('')
  const [fileLoading, setFileLoading] = useState(false)
  const [fileError, setFileError] = useState('')
  const [folderHandle, setFolderHandle] = useState(null)
  const [fileSavedName, setFileSavedName] = useState('')
  const [quiz, setQuiz] = useState(null)
  const [quizLoading, setQuizLoading] = useState(false)
  const [quizError, setQuizError] = useState('')
  const [genLoading, setGenLoading] = useState(false)
  const [genError, setGenError] = useState('')

  // Manual flashcard add state
  const [manualQ, setManualQ] = useState('')
  const [manualA, setManualA] = useState('')

  // Step-by-step practice problem state
  const [topic, setTopic] = useState('')
  const [problem, setProblem] = useState(null)
  const [revealedSteps, setRevealedSteps] = useState(0)
  const [showFinal, setShowFinal] = useState(false)
  const [problemLoading, setProblemLoading] = useState(false)
  const [problemError, setProblemError] = useState('')

  const cards = flashcards[subject] || []

  const dayType = getDayType(isoDate)
  const scheduledSubjects = useMemo(() => {
    if (!dayType) return []
    return daySchedule[dayType].map((s) => s.subject).filter((s) => subjects.includes(s))
  }, [dayType])

  const uploadsForDate = dailyUploads[isoDate] || {}
  const missingSubjects = scheduledSubjects.filter((s) => !uploadsForDate[s])
  const hasSavedNotes = Boolean(uploadsForDate[subject])

  useEffect(() => {
    setNoteText(uploadsForDate[subject]?.content || '')
    setQuiz(null)
    setQuizError('')
    setGenError('')
    setFileSavedName('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isoDate, subject])

  useEffect(() => {
    getSavedFolderHandle().then(setFolderHandle)
  }, [])

  async function handleChooseFolder() {
    try {
      setFolderHandle(await chooseNotesFolder())
    } catch {
      // she cancelled the picker — leave things as they were
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setFileError('')
    setFileSavedName('')
    setFileLoading(true)

    // Save a copy to her laptop first, while still close to the click that
    // triggered this (the folder-write permission prompt needs that).
    const savedName = `${isoDate}_${subject.replace(/[^a-z0-9]+/gi, '_')}_${file.name}`
    try {
      if (folderHandle && (await ensureFolderPermission(folderHandle))) {
        await saveFileToFolder(folderHandle, savedName, file)
      } else {
        downloadFileCopy(savedName, file)
      }
      setFileSavedName(savedName)
    } catch {
      // don't block note extraction if the copy-save failed
    }

    try {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        setNoteText(await extractPdfText(file))
      } else {
        setNoteText(await file.text())
      }
    } catch (err) {
      setFileError(err.message || 'Could not read that file.')
    } finally {
      setFileLoading(false)
    }
  }

  function handleSaveNotes() {
    if (!noteText.trim()) return
    setDailyUpload(isoDate, subject, noteText)
  }

  async function handleGenerateQuiz() {
    const content = uploadsForDate[subject]?.content || noteText
    if (!content.trim()) return
    setQuizLoading(true)
    setQuizError('')
    setQuiz(null)
    try {
      setQuiz(await generateQuiz(settings.apiKey, subject, content))
    } catch (err) {
      setQuizError(err instanceof GeminiError ? err.message : 'Something went wrong generating the quiz.')
    } finally {
      setQuizLoading(false)
    }
  }

  async function handleGenerateFlashcards() {
    const content = uploadsForDate[subject]?.content || noteText
    if (!content.trim()) return
    setGenLoading(true)
    setGenError('')
    try {
      addFlashcards(subject, await generateFlashcards(settings.apiKey, subject, content))
    } catch (err) {
      setGenError(err instanceof GeminiError ? err.message : 'Something went wrong generating flashcards.')
    } finally {
      setGenLoading(false)
    }
  }

  function handleManualAdd(e) {
    e.preventDefault()
    if (!manualQ.trim() || !manualA.trim()) return
    addFlashcards(subject, [{ question: manualQ.trim(), answer: manualA.trim() }])
    setManualQ('')
    setManualA('')
  }

  async function handleGenerateProblem() {
    setProblemLoading(true)
    setProblemError('')
    setProblem(null)
    setRevealedSteps(0)
    setShowFinal(false)
    try {
      setProblem(await generatePracticeProblem(settings.apiKey, subject, topic))
    } catch (err) {
      setProblemError(err instanceof GeminiError ? err.message : 'Something went wrong generating a problem.')
    } finally {
      setProblemLoading(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Practice</h1>
      </div>

      <div className="field" style={{ maxWidth: 280 }}>
        <label htmlFor="practice-subject">Class</label>
        <select
          id="practice-subject"
          className="select"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="section-title">Today's notes</div>

      <div className="field" style={{ maxWidth: 260 }}>
        <label htmlFor="upload-date">Date</label>
        <input
          id="upload-date"
          type="date"
          className="input"
          value={isoDate}
          onChange={(e) => setIsoDate(e.target.value)}
        />
      </div>

      <div className="card daily-status">
        <h3 style={{ fontSize: '0.95rem' }}>{formatDateLong(isoDate)}{dayType ? ` — ${dayType} Day` : ''}</h3>
        {scheduledSubjects.length === 0 ? (
          <p className="hint-text">
            {dayType ? 'No graded classes scheduled this day.' : 'Day type not entered yet — add it to src/data/schoolCalendar.js.'}
          </p>
        ) : (
          <div className="daily-status-list">
            {scheduledSubjects.map((s) => (
              <div key={s} className="daily-status-row">
                <SubjectBadge subject={s} />
                {uploadsForDate[s] ? (
                  <span className="badge badge-green">Notes uploaded ✓</span>
                ) : (
                  <span className="badge badge-red">Missing notes</span>
                )}
              </div>
            ))}
          </div>
        )}
        {missingSubjects.length > 0 && (
          <p className="hint-text" style={{ marginTop: 10 }}>
            Still need notes for: {missingSubjects.join(', ')}
          </p>
        )}
      </div>

      <div className="card">
        <textarea
          className="textarea"
          placeholder={`Paste or upload ${subject} notes here...`}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />

        <div className="daily-upload-actions">
          <label className="btn btn-sm">
            {fileLoading ? <span className="spinner" /> : 'Upload PDF or .txt file'}
            <input
              type="file"
              accept=".pdf,application/pdf,.txt,text/plain"
              onChange={handleFileUpload}
              disabled={fileLoading}
              hidden
            />
          </label>
          <button className="btn btn-sm" onClick={handleSaveNotes} disabled={!noteText.trim()}>
            Save notes
          </button>
          {hasSavedNotes && <span className="badge badge-green">Saved for {subject}</span>}
        </div>
        {fileError && <p className="error-text">{fileError}</p>}
        {fileSavedName && <p className="hint-text">💾 File saved as "{fileSavedName}"</p>}

        <p className="hint-text folder-status">
          {folderHandle ? (
            <>💾 Uploaded files are saved to "{folderHandle.name}" · <button type="button" className="link-btn" onClick={handleChooseFolder}>change folder</button></>
          ) : supportsFolderSave ? (
            <>💾 Uploaded files aren't going anywhere yet — <button type="button" className="link-btn" onClick={handleChooseFolder}>choose a folder</button> to auto-save them</>
          ) : (
            <>💾 Uploaded files will download to your Downloads folder automatically (this browser can't pick a custom folder)</>
          )}
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
          <button
            className="btn btn-primary"
            onClick={handleGenerateQuiz}
            disabled={quizLoading || !(uploadsForDate[subject]?.content || noteText).trim()}
          >
            {quizLoading ? <span className="spinner" /> : '✨ Generate quiz from these notes'}
          </button>
          <button
            className="btn"
            onClick={handleGenerateFlashcards}
            disabled={genLoading || !(uploadsForDate[subject]?.content || noteText).trim()}
          >
            {genLoading ? <span className="spinner" /> : '✨ Generate flashcards from these notes'}
          </button>
        </div>
        {quizError && <p className="error-text">{quizError}</p>}
        {genError && <p className="error-text">{genError}</p>}
      </div>

      {quiz && (
        <>
          <div className="section-title">Quiz — {subject}</div>
          <QuizRunner
            quiz={quiz}
            subject={subject}
            apiKey={settings.apiKey}
            onComplete={(result) => addQuizResult(result)}
          />
        </>
      )}

      <div className="section-title">Flashcards</div>

      <form className="card" onSubmit={handleManualAdd}>
        <h3 style={{ fontSize: '0.95rem' }}>Add one manually</h3>
        <div className="form-row">
          <div className="field">
            <label htmlFor="manual-q">Question</label>
            <input id="manual-q" className="input" value={manualQ} onChange={(e) => setManualQ(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="manual-a">Answer</label>
            <input id="manual-a" className="input" value={manualA} onChange={(e) => setManualA(e.target.value)} />
          </div>
        </div>
        <button type="submit" className="btn">+ Add flashcard</button>
      </form>

      {cards.length > 0 ? (
        <div className="flashcard-grid">
          {cards.map((card) => (
            <Flashcard key={card.id} card={card} onDelete={(id) => deleteFlashcard(subject, id)} />
          ))}
        </div>
      ) : (
        <p className="empty-state">No {subject} flashcards yet — generate some above or add one manually.</p>
      )}

      <div className="section-title">Step-by-step practice problem</div>
      <div className="card">
        <div className="form-row" style={{ alignItems: 'flex-end' }}>
          <div className="field" style={{ flex: 2 }}>
            <label htmlFor="topic">Topic (optional)</label>
            <input
              id="topic"
              className="input"
              placeholder="e.g. solving two-step equations"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleGenerateProblem} disabled={problemLoading} style={{ marginBottom: 12 }}>
            {problemLoading ? <span className="spinner" /> : '✨ Generate problem'}
          </button>
        </div>
        {problemError && <p className="error-text">{problemError}</p>}

        {problem && (
          <div className="problem-box">
            <p className="problem-statement">{problem.problem}</p>
            {problem.steps.slice(0, revealedSteps).map((step, i) => (
              <div key={i} className="problem-step">
                <span className="badge badge-outline" style={{ color: 'var(--pink-600)' }}>Step {i + 1}</span>
                <p>{step}</p>
              </div>
            ))}
            {revealedSteps < problem.steps.length && (
              <button className="btn" onClick={() => setRevealedSteps((n) => n + 1)}>
                Reveal step {revealedSteps + 1} of {problem.steps.length}
              </button>
            )}
            {revealedSteps >= problem.steps.length && !showFinal && (
              <button className="btn btn-primary" onClick={() => setShowFinal(true)}>Reveal final answer</button>
            )}
            {showFinal && (
              <div className="problem-final">
                <strong>Final answer:</strong> {problem.finalAnswer}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
