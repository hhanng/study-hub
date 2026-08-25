export function todayISO() {
  return toISODate(new Date())
}

export function toISODate(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDateLong(isoDate) {
  if (!isoDate) return ''
  const d = new Date(`${isoDate}T00:00:00`)
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateShort(isoDate) {
  if (!isoDate) return ''
  const d = new Date(`${isoDate}T00:00:00`)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

// Whole days between today and the given ISO date. Negative if in the past.
export function daysUntil(isoDate) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(`${isoDate}T00:00:00`)
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.round((target - today) / msPerDay)
}

export function countdownLabel(isoDate) {
  const diff = daysUntil(isoDate)
  if (diff < 0) return `${Math.abs(diff)}d ago`
  if (diff === 0) return 'Today!'
  if (diff === 1) return 'Tomorrow'
  return `${diff} days`
}
