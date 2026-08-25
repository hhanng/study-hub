import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Schedule from './pages/Schedule.jsx'
import Homework from './pages/Homework.jsx'
import Exams from './pages/Exams.jsx'
import Syllabus from './pages/Syllabus.jsx'
import Practice from './pages/Practice.jsx'
import Performance from './pages/Performance.jsx'

export default function App() {
  return (
    <HashRouter>
      <div className="app-shell">
        <NavBar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Schedule />} />
            <Route path="/homework" element={<Homework />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/syllabus" element={<Syllabus />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/upload" element={<Navigate to="/practice" replace />} />
            <Route path="/performance" element={<Performance />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}
