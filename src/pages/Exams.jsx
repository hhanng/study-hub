import { useMemo, useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import { subjects } from '../data/seedData'
import SubjectBadge from '../components/SubjectBadge.jsx'
import { formatDateLong, daysUntil, countdownLabel } from '../utils/date'
import './Exams.css'

const emptyForm = { subject: subjects[0], title: '', date: '', notes: '' }

export default function Exams() {
  const { exams, addExam, deleteExam } = useData()
  const [form, setForm] = useState(emptyForm)

  const sorted = useMemo(
    () => [...exams].sort((a, b) => (a.date || '').localeCompare(b.date || '')),
    [exams]
  )

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.date) return
    addExam({ ...form, title: form.title.trim() })
    setForm({ ...emptyForm, subject: form.subject })
  }

  function urgencyClass(isoDate) {
    const d = daysUntil(isoDate)
    if (d < 0) return 'badge-outline'
    if (d <= 2) return 'badge-red'
    if (d <= 6) return 'badge-amber'
    return 'badge-green'
  }

  return (
    <div>
      <div className="page-header">
        <h1>Exam Tracker</h1>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="field">
            <label htmlFor="exam-subject">Class</label>
            <select
              id="exam-subject"
              className="select"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            >
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="field" style={{ flex: 2 }}>
            <label htmlFor="exam-title">Exam</label>
            <input
              id="exam-title"
              className="input"
              placeholder="e.g. Unit 3 Test"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="exam-date">Date</label>
            <input
              id="exam-date"
              type="date"
              className="input"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="exam-notes">Notes (optional)</label>
          <input
            id="exam-notes"
            className="input"
            placeholder="e.g. Covers chapters 5-7"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
        <button type="submit" className="btn btn-primary">+ Add exam</button>
      </form>

      <div className="exam-list">
        {sorted.map((exam) => (
          <div key={exam.id} className="card exam-item">
            <div className="exam-item-top">
              <SubjectBadge subject={exam.subject} />
              <span className={'badge ' + urgencyClass(exam.date)}>{countdownLabel(exam.date)}</span>
            </div>
            <h3 className="exam-item-title">{exam.title}</h3>
            <p className="hint-text">{formatDateLong(exam.date)}</p>
            {exam.notes && <p className="exam-item-notes">{exam.notes}</p>}
            <button className="icon-btn" onClick={() => deleteExam(exam.id)}>Remove</button>
          </div>
        ))}
      </div>

      {sorted.length === 0 && (
        <p className="empty-state">No exams on the calendar yet. Add one above to start the countdown! ⏳</p>
      )}
    </div>
  )
}
