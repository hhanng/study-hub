// Small wrapper around the Gemini REST API. Every function here takes the
// API key explicitly (it's read from settings/localStorage by the caller,
// pre-filled once from VITE_GEMINI_API_KEY — see .env.local) and returns
// parsed JSON — the model is always instructed to answer with JSON only,
// and we defensively strip markdown code fences before parsing.

const GEMINI_MODEL = 'gemini-2.5-flash'
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

export class GeminiError extends Error {}

async function callGemini(apiKey, prompt) {
  if (!apiKey) {
    throw new GeminiError(
      'No Gemini API key set up yet — ask Han Han to add one to .env.local.'
    )
  }

  let response
  try {
    response = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4 },
      }),
    })
  } catch {
    throw new GeminiError('Could not reach Gemini. Check your internet connection.')
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    if (response.status === 400 || response.status === 403) {
      throw new GeminiError('Gemini rejected the API key — ask Han Han to double-check .env.local.')
    }
    throw new GeminiError(`Gemini request failed (${response.status}). ${body.slice(0, 200)}`)
  }

  const data = await response.json()
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ?? ''
  if (!text) {
    throw new GeminiError('Gemini returned an empty response. Try again.')
  }
  return text
}

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const raw = fenced ? fenced[1] : text
  const start = raw.indexOf('[') === -1 ? raw.indexOf('{') : Math.min(...[raw.indexOf('['), raw.indexOf('{')].filter((i) => i !== -1))
  const lastBrace = raw.lastIndexOf('}')
  const lastBracket = raw.lastIndexOf(']')
  const end = Math.max(lastBrace, lastBracket)
  const slice = start !== -1 && end !== -1 ? raw.slice(start, end + 1) : raw
  try {
    return JSON.parse(slice)
  } catch {
    throw new GeminiError('Could not understand Gemini\'s response. Try again.')
  }
}

export async function generateFlashcards(apiKey, subject, notesText, count = 8) {
  const prompt = `You are helping a 14-year-old student study for "${subject}".
Read these notes and create exactly ${count} flashcards covering the most
important facts, vocabulary, and concepts. Keep answers short (1-2 sentences).

Notes:
"""
${notesText}
"""

Respond with ONLY a JSON array, no markdown, in this exact shape:
[{"question": "...", "answer": "..."}]`

  const text = await callGemini(apiKey, prompt)
  const parsed = extractJson(text)
  if (!Array.isArray(parsed)) throw new GeminiError('Unexpected flashcard format from Gemini.')
  return parsed
    .filter((c) => c && c.question && c.answer)
    .map((c) => ({ question: String(c.question), answer: String(c.answer) }))
}

export async function generateQuiz(apiKey, subject, notesText) {
  const prompt = `You are a teacher creating a short quiz for a 14-year-old
student's "${subject}" class, based on the notes below. Create 6 questions
total: 4 multiple choice (4 options each, one correct) and 2 short answer.
Cover the main topics in the notes so a good score reflects real understanding.

Notes:
"""
${notesText}
"""

Respond with ONLY a JSON array, no markdown, in this exact shape:
[
  {"type": "mcq", "topic": "short topic label", "question": "...", "options": ["...","...","...","..."], "correctAnswer": "the exact matching option text"},
  {"type": "short", "topic": "short topic label", "question": "...", "correctAnswer": "an ideal model answer"}
]`

  const text = await callGemini(apiKey, prompt)
  const parsed = extractJson(text)
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new GeminiError('Unexpected quiz format from Gemini.')
  }
  return parsed.map((q, i) => ({
    id: `q${i}`,
    type: q.type === 'mcq' ? 'mcq' : 'short',
    topic: q.topic || subject,
    question: String(q.question || ''),
    options: Array.isArray(q.options) ? q.options.map(String) : undefined,
    correctAnswer: String(q.correctAnswer || ''),
  }))
}

// Grades the short-answer questions in one batched call (MCQ is graded
// locally by exact match, no API call needed). Returns a map of
// { [questionId]: { correct: boolean, feedback: string } }.
export async function gradeShortAnswers(apiKey, subject, shortAnswerItems) {
  if (shortAnswerItems.length === 0) return {}

  const prompt = `You are grading short-answer quiz questions for a
14-year-old's "${subject}" class. For each item, decide if the student's
answer demonstrates understanding of the model answer (be reasonably
lenient about exact wording, strict about the actual concept being right).

Items:
${JSON.stringify(
    shortAnswerItems.map((it) => ({
      id: it.id,
      question: it.question,
      modelAnswer: it.correctAnswer,
      studentAnswer: it.studentAnswer,
    })),
    null,
    2
  )}

Respond with ONLY a JSON array, no markdown, in this exact shape:
[{"id": "...", "correct": true, "feedback": "one short sentence"}]`

  const text = await callGemini(apiKey, prompt)
  const parsed = extractJson(text)
  if (!Array.isArray(parsed)) throw new GeminiError('Unexpected grading format from Gemini.')

  const result = {}
  for (const item of parsed) {
    if (item && item.id) {
      result[item.id] = { correct: !!item.correct, feedback: String(item.feedback || '') }
    }
  }
  return result
}

export async function generatePracticeProblem(apiKey, subject, topic) {
  const prompt = `Create one step-by-step practice problem for a 14-year-old
studying "${subject}"${topic ? `, focused on: ${topic}` : ''}. Break the
solution into clear, small steps she can reveal one at a time.

Respond with ONLY JSON, no markdown, in this exact shape:
{"problem": "the problem statement", "steps": ["step 1 explanation", "step 2 explanation", "..."], "finalAnswer": "the final answer"}`

  const text = await callGemini(apiKey, prompt)
  const parsed = extractJson(text)
  if (!parsed || !Array.isArray(parsed.steps)) {
    throw new GeminiError('Unexpected practice problem format from Gemini.')
  }
  return {
    problem: String(parsed.problem || ''),
    steps: parsed.steps.map(String),
    finalAnswer: String(parsed.finalAnswer || ''),
  }
}
