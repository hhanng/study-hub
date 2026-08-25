import { useMemo } from 'react'
import { useData } from '../context/DataContext.jsx'
import { subjects, prioritySubjects, subjectColors } from '../data/seedData'
import Sparkline from '../components/Sparkline.jsx'
import { MASTERY_THRESHOLD } from '../components/QuizRunner.jsx'
import { formatDateShort } from '../utils/date'
import './Performance.css'

function computeTrend(history) {
  if (history.length < 2) return 'flat'
  const mid = Math.ceil(history.length / 2)
  const firstHalf = history.slice(0, mid)
  const secondHalf = history.slice(mid)
  const avg = (arr) => arr.reduce((sum, h) => sum + h.percent, 0) / arr.length
  const diff = avg(secondHalf) - avg(firstHalf)
  if (diff > 3) return 'up'
  if (diff < -3) return 'down'
  return 'flat'
}

export default function Performance() {
  const { quizHistory } = useData()

  const bySubject = useMemo(() => {
    const map = {}
    for (const subject of subjects) {
      const history = quizHistory
        .filter((q) => q.subject === subject)
        .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
      const average = history.length
        ? Math.round(history.reduce((sum, h) => sum + h.percent, 0) / history.length)
        : null
      const latest = history[history.length - 1] || null
      map[subject] = { history, average, latest, trend: computeTrend(history) }
    }
    return map
  }, [quizHistory])

  return (
    <div>
      <div className="page-header">
        <h1>Subject Performance</h1>
      </div>
      <p className="page-subtitle">
        Quiz scores over time from Daily Upload quizzes. {MASTERY_THRESHOLD}%+ counts as understood.
      </p>

      <div className="performance-grid">
        {subjects.map((subject) => {
          const data = bySubject[subject]
          const isPriority = prioritySubjects.includes(subject)
          return (
            <div key={subject} className={'card performance-card' + (isPriority ? ' is-priority' : '')}>
              <div className="performance-card-top">
                <h3 style={{ color: subjectColors[subject] }}>{subject}</h3>
                {isPriority && <span className="badge badge-amber">★ Priority focus</span>}
              </div>

              {data.average !== null ? (
                <>
                  <div className="performance-stats">
                    <div>
                      <div className="performance-stat-value">{data.average}%</div>
                      <div className="hint-text">average</div>
                    </div>
                    <TrendBadge trend={data.trend} />
                  </div>
                  <Sparkline
                    values={data.history.map((h) => h.percent)}
                    color={subjectColors[subject]}
                  />
                  <p className="hint-text" style={{ marginTop: 4 }}>
                    Last quiz: {data.latest.percent}% on {formatDateShort(data.latest.date)}
                    {data.latest.passed ? ' · mastered ✓' : ''}
                  </p>
                </>
              ) : (
                <p className="empty-state" style={{ padding: '18px 0' }}>
                  No quizzes taken yet. Generate one from Daily Upload!
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TrendBadge({ trend }) {
  if (trend === 'up') return <span className="badge badge-green">▲ Trending up</span>
  if (trend === 'down') return <span className="badge badge-red">▼ Trending down</span>
  return <span className="badge badge-outline" style={{ color: 'var(--ink-soft)' }}>▬ Steady</span>
}
