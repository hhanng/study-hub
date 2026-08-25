import { useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import { subjects } from '../data/seedData'
import SubjectBadge from '../components/SubjectBadge.jsx'
import './Syllabus.css'

export default function Syllabus() {
  const { notes, updateNotes } = useData()
  const [activeSubject, setActiveSubject] = useState(subjects[0])

  return (
    <div>
      <div className="page-header">
        <h1>Syllabus &amp; Notes</h1>
      </div>
      <p className="page-subtitle">
        One notes area per class — paste in the real syllabus content whenever you have it.
        Everything here is saved automatically.
      </p>

      <div className="syllabus-tabs">
        {subjects.map((s) => (
          <button
            key={s}
            className={'syllabus-tab' + (s === activeSubject ? ' active' : '')}
            onClick={() => setActiveSubject(s)}
          >
            <SubjectBadge subject={s} />
          </button>
        ))}
      </div>

      <div className="card">
        <textarea
          className="textarea syllabus-textarea"
          placeholder={`Paste ${activeSubject}'s syllabus, grading policy, unit outline, or any notes here...`}
          value={notes[activeSubject] || ''}
          onChange={(e) => updateNotes(activeSubject, e.target.value)}
        />
      </div>
    </div>
  )
}
