const WIDTH = 220
const HEIGHT = 56
const PAD = 6

export default function Sparkline({ values, color = '#ff5599' }) {
  if (values.length < 2) {
    return <div className="sparkline-empty">Not enough quiz history yet</div>
  }

  const min = 0
  const max = 100
  const stepX = (WIDTH - PAD * 2) / (values.length - 1)
  const points = values.map((v, i) => {
    const x = PAD + i * stepX
    const y = HEIGHT - PAD - ((v - min) / (max - min)) * (HEIGHT - PAD * 2)
    return [x, y]
  })
  const pathD = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
      <line x1={PAD} y1={HEIGHT - PAD - ((85 - min) / (max - min)) * (HEIGHT - PAD * 2)}
        x2={WIDTH - PAD} y2={HEIGHT - PAD - ((85 - min) / (max - min)) * (HEIGHT - PAD * 2)}
        stroke="#e0a02c" strokeDasharray="3,3" strokeWidth="1" />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill={color} />
      ))}
    </svg>
  )
}
