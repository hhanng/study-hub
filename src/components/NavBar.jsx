import { NavLink } from 'react-router-dom'
import './NavBar.css'

const LINKS = [
  { to: '/', label: 'Schedule', end: true },
  { to: '/homework', label: 'Homework' },
  { to: '/exams', label: 'Exams' },
  { to: '/syllabus', label: 'Syllabus' },
  { to: '/practice', label: 'Practice' },
  { to: '/performance', label: 'Performance' },
]

export default function NavBar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <span className="navbar-brand-icon">📚</span>
          <span>Study Hub</span>
        </div>
        <nav className="navbar-links">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => 'navbar-link' + (isActive ? ' active' : '')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
