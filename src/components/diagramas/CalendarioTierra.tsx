import { useEffect, useState } from 'react'

// La historia de la Tierra en un año: el 1 de enero se forma la Tierra (hace 4600 millones de años) y la
// medianoche del 31 de diciembre es hoy. Se recorren los hechos con los botones o con las teclas A y D.

const TOTAL = 4600 // millones de años
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const DIAS_MES = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

const HECHOS: { ma: number; ic: string; t: string }[] = [
  { ma: 4600, ic: '🌋', t: 'Se forma la Tierra' },
  { ma: 3800, ic: '🦠', t: 'Primeras células' },
  { ma: 2400, ic: '🫧', t: 'Las cianobacterias llenan el aire de oxígeno' },
  { ma: 1800, ic: '🧫', t: 'Primeras células con núcleo (eucariotas)' },
  { ma: 600, ic: '🪼', t: 'Primeros animales' },
  { ma: 538, ic: '🦐', t: 'Explosión cámbrica' },
  { ma: 470, ic: '🌱', t: 'Las plantas llegan a tierra firme' },
  { ma: 375, ic: '🦎', t: 'Los primeros tetrápodos salen del agua' },
  { ma: 252, ic: '☠️', t: 'Gran extinción del Pérmico' },
  { ma: 230, ic: '🦕', t: 'Primeros dinosaurios' },
  { ma: 120, ic: '🐊', t: 'Kronosaurus nada en el mar de Villa de Leyva (Boyacá)' },
  { ma: 66, ic: '☄️', t: 'Un asteroide acaba con los dinosaurios (menos las aves)' },
  { ma: 60, ic: '🐍', t: 'Titanoboa vive en los pantanos del Cerrejón (La Guajira)' },
  { ma: 13, ic: '🐒', t: 'Fauna de La Venta, en la Tatacoa (Huila)' },
  { ma: 7, ic: '🦍', t: 'Los linajes de humanos y chimpancés se separan' },
  { ma: 0.3, ic: '🧍', t: 'Aparece Homo sapiens' },
  { ma: 0.012, ic: '🏹', t: 'Hay grupos humanos en la sabana de Bogotá' },
]

function fecha(ma: number) {
  let s = (1 - ma / TOTAL) * 365 * 86400 // segundos desde el 1 de enero
  let m = 0
  while (m < 11 && s >= DIAS_MES[m] * 86400) { s -= DIAS_MES[m] * 86400; m++ }
  const dia = Math.floor(s / 86400) + 1
  const resto = s % 86400
  const hh = Math.floor(resto / 3600)
  const mm = Math.floor((resto % 3600) / 60)
  const ss = Math.floor(resto % 60)
  const hora = m === 11 && dia === 31 ? ` · ${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}` : ''
  return `${dia} de ${MESES[m]}${hora}`
}
const antiguedad = (ma: number) => (ma >= 1 ? `hace ${ma.toLocaleString('es-CO')} millones de años` : `hace ${(ma * 1e6).toLocaleString('es-CO')} años`)

export default function CalendarioTierra() {
  const [k, setK] = useState(0)
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const t = e.key.toLowerCase()
      if (t === 'd') setK((v) => Math.min(HECHOS.length - 1, v + 1))
      if (t === 'a') setK((v) => Math.max(0, v - 1))
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])

  const h = HECHOS[k]
  const x = (ma: number) => 30 + (1 - ma / TOTAL) * 540
  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 600 200" role="img" aria-label={`${h.t}: ${fecha(h.ma)}`} className="mx-auto w-full max-w-3xl">
        <rect width="600" height="200" rx="14" fill="#f4f1ea" />
        {MESES.map((m, i) => (
          <g key={m}>
            <rect x={30 + i * 45} y="70" width="45" height="40" fill={i % 2 ? '#e7dfcd' : '#efe8d8'} />
            <text x={52 + i * 45} y="125" textAnchor="middle" fontSize="11" fontWeight="700">{m}</text>
          </g>
        ))}
        {HECHOS.map((e, i) => (
          <circle key={i} cx={x(e.ma)} cy="90" r={i === k ? 7 : 3.5} fill={i === k ? '#c43c3c' : '#8a7a66'} style={{ cursor: 'pointer', transition: 'r 0.3s' }} onClick={() => setK(i)} />
        ))}
        <line x1={x(h.ma)} y1="60" x2={x(h.ma)} y2="112" stroke="#c43c3c" strokeWidth="2" style={{ transition: 'all 0.6s' }} />
        <text x="300" y="36" textAnchor="middle" fontSize="18" fontWeight="800">{h.ic} {h.t}</text>
        <text x="300" y="56" textAnchor="middle" fontSize="12" fontWeight="600">{antiguedad(h.ma)}</text>
        <text x="300" y="160" textAnchor="middle" fontSize="22" fontWeight="800" fill="#c43c3c">📅 {fecha(h.ma)}</text>
        <text x="300" y="185" textAnchor="middle" fontSize="10" fontWeight="600" fill="#6b6457">Si toda la historia de la Tierra cupiera en un año</text>
      </svg>
      <div className="flex items-center gap-3">
        <button onClick={() => setK(Math.max(0, k - 1))} className="rounded-full border bg-white px-3 py-1 text-sm font-semibold">← Antes (A)</button>
        <span className="text-sm">{k + 1} de {HECHOS.length}</span>
        <button onClick={() => setK(Math.min(HECHOS.length - 1, k + 1))} className="rounded-full bg-[var(--acento)] px-3 py-1 text-sm font-semibold text-white">Después (D) →</button>
      </div>
      <p className="max-w-xl text-center text-xs opacity-70">Los dinosaurios aparecen a mediados de diciembre y los humanos, en los últimos minutos del 31 de diciembre.</p>
    </div>
  )
}
