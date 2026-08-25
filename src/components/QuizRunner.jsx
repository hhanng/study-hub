import { useState } from 'react'
import { gradeShortAnswers, GeminiError } from '../utils/gemini'
import { todayISO } from '../utils/date'
import './QuizRunner.css'

export const MASTERY_THRESHOLD = 85

export default function QuizRunner({ quiz, subject, apiKey, onComplete }) {
  const [answers, setAnswers] = useState({})
  const [grading, setGrading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const allAnswered = quiz.every((q) => (answers[q.id] || '').trim().length > 0)

  async function handleSubmit() {
    setGrading(true)
    setError('')
    try {
      const shortItems = quiz
        .filter((q) => q.type === 'short')
        .map((q) => ({ ...q, studentAnswer: answers[q.id] || '' }))
      const shortGrades = await gradeShortAnswers(apiKey, subject, shortItems)

      let correctCount = 0
      const wrongItems = []
      for (const q of quiz) {
        const yourAnswer = answers[q.id] || ''
        let correct
        let feedback = ''
        if (q.type === 'mcq') {
          correct = yourAnswer === q.correctAnswer
        } else {
          const grade = shortGrades[q.id]
          correct = grade?.correct ?? false
          feedback = grade?.feedback || ''
        }
        if (correct) {
          correctCount += 1
        } else {
          wrongItems.push({
            topic: q.topic,
            question: q.question,
            yourAnswer,
            correctAnswer: q.correctAnswer,
            feedback,
          })
        }
      }

      const percent = Math.round((correctCount / quiz.length) * 100)
      const passed = percent >= MASTERY_THRESHOLD
      const finalResult = {
        subject,
        date: todayISO(),
        score: correctCount,
        total: quiz.length,
        percent,
        passed,
        wrongItems,
      }
      setResult(finalResult)
      onComplete?.(finalResult)
    } catch (err) {
      setError(err instanceof GeminiError ? err.message : 'Something went wrong grading the quiz.')
    } finally {
      setGrading(false)
    }
  }

  if (result) {
    return (
      <div className="quiz-result">
        <div className={'quiz-score-banner' + (result.passed ? ' passed' : ' failed')}>
          <div className="quiz-score-number">{result.percent}%</div>
          <div>
            <strong>{result.passed ? "Mastered! 🎉" : 'Not quite there yet'}</strong>
            <p className="hint-text" style={{ margin: 0 }}>
              {result.score}/{result.total} correct · needs {MASTERY_THRESHOLD}% to count as understood
            </p>
          </div>
        </div>

        {result.wrongItems.length > 0 && (
          <div>
            <h4 style={{ marginTop: 18 }}>Questions/topics to review</h4>
            {result.wrongItems.map((item, i) => (
              <div key={i} className="card quiz-wrong-item">
                <span className="badge badge-outline" style={{ color: 'var(--pink-600)' }}>{item.topic}</span>
                <p className="quiz-wrong-question">{item.question}</p>
                {item.yourAnswer && <p className="hint-text">Your answer: {item.yourAnswer}</p>}
                <p className="hint-text">Correct: {item.correctAnswer}</p>
                {item.feedback && <p className="hint-text">{item.feedback}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {quiz.map((q, i) => (
        <div key={q.id} className="card quiz-question">
          <p className="quiz-question-text">
            <span className="hint-text">Q{i + 1} · {q.topic}</span>
            <br />
            {q.question}
          </p>
          {q.type === 'mcq' ? (
            <div className="quiz-options">
              {q.options?.map((opt) => (
                <label key={opt} className="quiz-option">
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === opt}
                    onChange={() => setAnswers({ ...answers, [q.id]: opt })}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ) : (
            <textarea
              className="textarea"
              placeholder="Type your answer..."
              value={answers[q.id] || ''}
              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            />
          )}
        </div>
      ))}

      {error && <p className="error-text">{error}</p>}

      <button className="btn btn-primary" onClick={handleSubmit} disabled={!allAnswered || grading}>
        {grading ? <span className="spinner" /> : 'Submit quiz'}
      </button>
    </div>
  )
}
