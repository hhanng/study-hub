import { useMemo, useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import { subjects } from '../data/seedData'
import SubjectBadge from '../components/SubjectBadge.jsx'
import { formatDateShort, daysUntil } from '../utils/date'
import './Homework.css'

const emptyForm = { subject: subjects[0], title: '', dueDate: '' }

export default function Homework() {
  const { homework, addHomework, toggleHomework, deleteHomework } = useData()
  const [form, setForm] = useState(emptyForm)
  const [hideDone, setHideDone] = useState(false)

  const grouped = useMemo(() => {
    const bySubject = {}
    for (const subject of subjects) bySubject[subject] = []
    for (const item of homework) {
      if (!bySubject[item.subject]) bySubject[item.subject] = []
      bySubject[item.subject].push(item)
    }
    for (const subject of Object.keys(bySubject)) {
      bySubject[subject].sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))
    }
    return bySubject
  }, [homework])

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    addHomework({ subject: form.subject, title: form.title.trim(), dueDate: form.dueDate })
    setForm({ ...emptyForm, subject: form.subject })
  }

  return (
    <div>
      <div className="page-header">
        <h1>Homework Tracker</h1>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="field">
            <label htmlFor="hw-subject">Class</label>
            <select
              id="hw-subject"
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
            <label htmlFor="hw-title">Assignment</label>
            <input
              id="hw-title"
              className="input"
              placeholder="e.g. Read Ch. 4 and answer questions"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="hw-due">Due date</label>
            <input
              id="hw-due"
              type="date"
              className="input"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">+ Add homework</button>
      </form>

      <label className="checkbox-row" style={{ margin: '18px 0 4px' }}>
        <input type="checkbox" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} />
        <span className="hint-text">Hide completed</span>
      </label>

      {subjects.map((subject) => {
        const items = grouped[subject]?.filter((i) => !hideDone || !i.done) || []
        if (items.length === 0) return null
        return (
          <div key={subject}>
            <div className="section-title"><SubjectBadge subject={subject} /></div>
            <div className="hw-list">
              {items.map((item) => {
                const overdue = !item.done && item.dueDate && daysUntil(item.dueDate) < 0
                return (
                  <div key={item.id} className={'card hw-item' + (item.done ? ' is-done' : '')}>
                    <label className="checkbox-row hw-item-main">
                      <input type="checkbox" checked={item.done} onChange={() => toggleHomework(item.id)} />
                      <span className="hw-item-title">{item.title}</span>
                    </label>
                    <div className="hw-item-meta">
                      {item.dueDate && (
                        <span className={'badge' + (overdue ? ' badge-red' : ' badge-amber')}>
                          {overdue ? 'Overdue · ' : 'Due '}{formatDateShort(item.dueDate)}
                        </span>
                      )}
                      <button className="icon-btn" onClick={() => deleteHomework(item.id)} aria-label="Delete">✕</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {homework.length === 0 && (
        <p className="empty-state">No homework yet — add your first assignment above! 🎀</p>
      )}
    </div>
  )
}
