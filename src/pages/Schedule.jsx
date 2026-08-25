import { daySchedule } from '../data/seedData'
import { schoolCalendar, getDayType } from '../data/schoolCalendar'
import SubjectBadge from '../components/SubjectBadge.jsx'
import { todayISO } from '../utils/date'
import './Schedule.css'

export default function Schedule() {
  const today = todayISO()
  const essentials = schoolCalendar[today]
  const todayType = getDayType(today)

  return (
    <div>
      <div className="page-header">
        <h1>Weekly Schedule</h1>
      </div>
      <p className="page-subtitle">
        John Paul II HS runs alternating A-Day / B-Day periods — edit{' '}
        <code>src/data/seedData.js</code> and <code>src/data/schoolCalendar.js</code> to keep this current.
      </p>

      <div className="card essentials-card">
        <h3 style={{ fontSize: '0.95rem' }}>Today's Essentials</h3>
        {essentials ? (
          <div className="essentials-body">
            <div className="essentials-row">
              {essentials.dayType && (
                <span className="badge badge-outline" style={{ color: 'var(--pink-600)' }}>
                  {essentials.dayType} Day
                </span>
              )}
              {essentials.bellSchedule && <span className="hint-text">Bell schedule: {essentials.bellSchedule}</span>}
            </div>
            {essentials.uniform && <p className="hint-text">Uniform: {essentials.uniform}</p>}
            {essentials.notes.length > 0 && (
              <ul className="essentials-notes">
                {essentials.notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <p className="hint-text">
            Not entered yet for today — add it to{' '}
            <code>src/data/schoolCalendar.js</code> from the school portal.
          </p>
        )}
      </div>

      <div className="schedule-grid">
        {(['A', 'B']).map((type) => (
          <div key={type} className={'card schedule-day' + (type === todayType ? ' is-today' : '')}>
            <div className="schedule-day-header">
              <h3>{type} Day</h3>
              {type === todayType && <span className="badge badge-green">Today</span>}
            </div>
            <ul className="schedule-list">
              {daySchedule[type].map((slot) => (
                <li key={slot.period} className="schedule-slot">
                  <span className="schedule-period">P{slot.period}</span>
                  <SubjectBadge subject={slot.subject} />
                  <span className="schedule-time">
                    {slot.teacher}
                    {slot.room ? ` · Rm ${slot.room}` : ''}
                    {!slot.confirmed && ' (unconfirmed)'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
