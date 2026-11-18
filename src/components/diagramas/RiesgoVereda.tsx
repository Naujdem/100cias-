import { useEffect, useState } from 'react'

// Mapa de riesgo de una vereda: se elige la amenaza (1 creciente, 2 deslizamiento, 3 sismo) y se activan medidas
// (Q reforestar la ladera, W reubicar la casa de la orilla, E construir sismorresistente, R alerta temprana).
// Cada lugar muestra su riesgo = amenaza en ese sitio × vulnerabilidad. Modelo cualitativo para discutir en clase.

type Amenaza = 'creciente' | 'deslizamiento' | 'sismo'
const AMENAZAS: { id: Amenaza; n: string; ic: string }[] = [
  { id: 'creciente', n: 'Creciente', ic: '🌊' },
  { id: 'deslizamiento', n: 'Deslizamiento', ic: '⛰️' },
  { id: 'sismo', n: 'Sismo', ic: '🫨' },
]
const MEDIDAS = [
  { tecla: 'Q', n: 'Reforestar la ladera', ic: '🌳' },
  { tecla: 'W', n: 'Reubicar la casa de la orilla', ic: '🚚' },
  { tecla: 'E', n: 'Construir sismorresistente', ic: '🏗️' },
  { tecla: 'R', n: 'Alerta temprana y plan', ic: '📢' },
]
const LUGARES = [
  { id: 'orilla', n: 'Casa en la orilla', x: 250, y: 215 },
  { id: 'ladera', n: 'Casa al pie de la ladera', x: 110, y: 200 },
  { id: 'escuela', n: 'Escuela', x: 420, y: 190 },
  { id: 'alto', n: 'Casa en lo alto', x: 520, y: 120 },
]

export default function RiesgoVereda() {
  const [a, setA] = useState<Amenaza>('creciente')
  const [m, setM] = useState([false, false, false, false])
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const t = e.key.toLowerCase()
      if (t === '1') setA('creciente')
      if (t === '2') setA('deslizamiento')
      if (t === '3') setA('sismo')
      const n = ['q', 'w', 'e', 'r'].indexOf(t)
      if (n >= 0) setM((s) => s.map((v, k) => (k === n ? !v : v)))
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])

  const [reforestar, reubicar, sismorresistente, alerta] = m
  const riesgo = (id: string) => {
    const enOrilla = id === 'orilla' && !reubicar
    // amenaza en el sitio (0–3)
    let am = 0
    if (a === 'creciente') am = enOrilla ? 3 : id === 'escuela' ? 1 : 0
    if (a === 'deslizamiento') am = id === 'ladera' ? (reforestar ? 1 : 3) : 0
    if (a === 'sismo') am = 2
    // vulnerabilidad (1–3)
    let v = a === 'sismo' ? (sismorresistente ? 1 : 3) : 2
    if (alerta && a !== 'sismo') v = Math.max(1, v - 1)
    if (alerta && a === 'sismo') v = Math.max(1, v - (sismorresistente ? 0 : 1))
    const r = am * v
    return r >= 6 ? 'alto' : r >= 3 ? 'medio' : 'bajo'
  }
  const COLOR = { alto: '#c43c3c', medio: '#e0a800', bajo: '#3f9a5a' } as const

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 600 300" role="img" aria-label={`Mapa de riesgo de la vereda ante ${a}`} className="mx-auto w-full max-w-3xl">
        <rect x="0" y="0" width="600" height="300" fill="#e7eef2" />
        {/* ladera a la izquierda, loma a la derecha */}
        <polygon points="0,60 180,230 0,230" fill={reforestar ? '#5f9a4a' : '#b89a6a'} style={{ transition: 'fill 0.6s' }} />
        {reforestar && [30, 60, 90, 30, 60].map((x, k) => <circle key={k} cx={x} cy={110 + k * 18} r="12" fill="#3f7f3a" />)}
        <polygon points="440,230 600,70 600,230" fill="#9ab06a" />
        <rect x="0" y="230" width="600" height="70" fill="#8ab06a" />
        {/* río */}
        <rect x="200" y="225" width="110" height="75" fill={a === 'creciente' ? '#6a8aa8' : '#7aa8d0'} />
        {a === 'creciente' && <rect x="180" y="215" width="150" height="20" fill="#7a9ab8" opacity="0.7" />}
        {LUGARES.map((l) => {
          const x = l.id === 'orilla' && reubicar ? 470 : l.x
          const y = l.id === 'orilla' && reubicar ? 155 : l.y
          const r = riesgo(l.id)
          return (
            <g key={l.id} style={{ transition: 'transform 0.8s ease', transform: `translate(${x}px, ${y}px)` }}>
              <circle r="30" fill="none" stroke={COLOR[r]} strokeWidth="5" />
              <text y="10" textAnchor="middle" fontSize="28">{l.id === 'escuela' ? '🏫' : '🏠'}</text>
              <rect x="-26" y="34" width="52" height="18" rx="9" fill={COLOR[r]} />
              <text y="47" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">{r}</text>
            </g>
          )
        })}
        <text x="300" y="30" textAnchor="middle" fontSize="16" fontWeight="800" fill="#3a3a3a">{AMENAZAS.find((x) => x.id === a)!.ic} Amenaza: {AMENAZAS.find((x) => x.id === a)!.n.toLowerCase()}</text>
      </svg>
      <div className="flex flex-wrap justify-center gap-2">
        {AMENAZAS.map((x, n) => (
          <button key={x.id} onClick={() => setA(x.id)} className={`rounded-xl border-2 px-3 py-1.5 font-bold ${a === x.id ? 'border-[#2f7fc1] bg-[#e3f0fa]' : 'border-gray-300 bg-white'}`}>
            <span className="mr-1 rounded bg-gray-700 px-1.5 text-white">{n + 1}</span>{x.ic} {x.n}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {MEDIDAS.map((x, n) => (
          <button key={x.tecla} onClick={() => setM((s) => s.map((v, k) => (k === n ? !v : v)))} className={`rounded-xl border-2 px-3 py-1.5 font-bold ${m[n] ? 'border-[#3f9a5a] bg-[#eef7f0]' : 'border-gray-300 bg-white'}`}>
            <span className="mr-1 rounded bg-gray-700 px-1.5 text-white">{x.tecla}</span>{x.ic} {x.n}
          </button>
        ))}
      </div>
      <p className="max-w-3xl text-center text-base text-gray-700">Un sismo no se puede evitar, pero la vulnerabilidad casi siempre se puede reducir. Activa medidas y mira cómo baja el riesgo.</p>
    </div>
  )
}
