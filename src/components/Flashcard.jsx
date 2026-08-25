import { useState } from 'react'
import './Flashcard.css'

export default function Flashcard({ card, onDelete }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="flashcard" onClick={() => setFlipped((f) => !f)}>
      <div className="flashcard-face">
        <p>{flipped ? card.answer : card.question}</p>
        <span className="flashcard-hint">{flipped ? 'Answer · tap to flip back' : 'Question · tap to reveal'}</span>
      </div>
      {onDelete && (
        <button
          className="icon-btn flashcard-delete"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(card.id)
          }}
          aria-label="Delete flashcard"
        >
          ✕
        </button>
      )}
    </div>
  )
}
