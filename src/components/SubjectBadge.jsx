import { subjectColors } from '../data/seedData'

export default function SubjectBadge({ subject }) {
  const color = subjectColors[subject] || '#ff77ac'
  return (
    <span className="badge" style={{ background: color }}>
      {subject}
    </span>
  )
}
