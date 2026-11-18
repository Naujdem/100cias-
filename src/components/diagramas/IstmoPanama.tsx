import { useEffect, useState } from 'react'

// El istmo de Panamá: al cerrarse (hace unos 3 millones de años) separó los camarones del Caribe y del Pacífico,
// que se volvieron especies distintas (especiación alopátrica), y unió Norte y Sudamérica para los animales
// terrestres (gran intercambio americano). Se mueve el tiempo con un deslizador o con ← → (teclas A y D).

const PASOS = [10, 6, 4, 3, 2, 0] // millones de años atrás
const TEXTOS = [
  'Hace 10 millones de años: el mar une el Caribe y el Pacífico. Una sola especie de camarón vive en ambos lados.',
  'Hace 6 millones de años: surgen islas volcánicas; el agua aún pasa.',
  'Hace 4 millones de años: el paso se estrecha y las poblaciones casi no se mezclan.',
  'Hace unos 3 millones de años: el istmo se cierra. Los camarones quedan separados.',
  'Hace 2 millones de años: los animales terrestres cruzan el puente: perezosos y armadillos al norte; felinos, osos y venados al sur.',
  'Hoy: los camarones de cada lado son especies distintas; juntos casi no se aparean.',
]

function Camaron({ x, y, c }: { x: number; y: number; c: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M -14 0 q 10 -12 26 -4 q -4 10 -18 10 z" fill={c} style={{ transition: 'fill 0.8s' }} />
      <path d="M 12 -4 l 10 -8 M 12 -2 l 12 -2" stroke={c} strokeWidth="1.5" />
      <path d="M -14 0 l -6 -4 l 0 8 z" fill={c} />
    </g>
  )
}

export default function IstmoPanama() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (k === 'd') setI((v) => Math.min(PASOS.length - 1, v + 1))
      if (k === 'a') setI((v) => Math.max(0, v - 1))
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])

  const abierto = [70, 50, 18, 0, 0, 0][i]
  const caribe = i >= 4 ? '#c46a3c' : i >= 2 ? '#d07a46' : '#d9824a'
  const pacifico = i >= 4 ? '#6a6ab8' : i >= 2 ? '#a07070' : '#d9824a'
  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 600 300" role="img" aria-label={`Istmo de Panamá hace ${PASOS[i]} millones de años`} className="mx-auto w-full max-w-3xl">
        <rect width="600" height="300" rx="14" fill="#9cc6e4" />
        {/* Norteamérica y Sudamérica */}
        <path d="M 0 0 H 260 Q 250 60 230 90 L 240 120 H 0 Z" fill="#cfdcb8" />
        <path d="M 600 300 H 320 Q 340 220 380 190 L 370 160 H 600 Z" fill="#cfdcb8" />
        <text x="90" y="50" fontSize="13" fontWeight="800">Norteamérica</text>
        <text x="460" y="260" fontSize="13" fontWeight="800">Sudamérica</text>
        {/* el istmo que se cierra */}
        <path d={`M 230 110 Q 300 ${130 + abierto / 3} ${370 - abierto} 170`} stroke="#cfdcb8" strokeWidth="28" fill="none" style={{ transition: 'all 0.8s' }} />
        <path d={`M ${370 - abierto} 170 L 380 175`} stroke="#cfdcb8" strokeWidth="28" style={{ transition: 'all 0.8s', opacity: abierto === 0 ? 1 : 0 }} />
        {[[290, 140], [330, 158]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="8" fill="#cfdcb8" style={{ opacity: i >= 1 && i <= 2 ? 1 : 0 }} />)}
        <text x="420" y="80" fontSize="13" fontWeight="800" fill="#1f4f7a">Caribe</text>
        <text x="120" y="230" fontSize="13" fontWeight="800" fill="#1f4f7a">Pacífico</text>
        {[[430, 110], [470, 130], [400, 140]].map(([x, y], k) => <Camaron key={`c${k}`} x={x} y={y} c={caribe} />)}
        {[[150, 190], [190, 210], [120, 260]].map(([x, y], k) => <Camaron key={`p${k}`} x={x} y={y} c={pacifico} />)}
        {/* animales terrestres cruzando */}
        <g style={{ transition: 'opacity 0.8s', opacity: i >= 4 ? 1 : 0 }}>
          <text x="270" y="118" fontSize="20">🦥</text>
          <text x="330" y="160" fontSize="20">🐆</text>
          <text x="250" y="100" fontSize="12" fontWeight="800">↖</text>
          <text x="360" y="175" fontSize="12" fontWeight="800">↘</text>
        </g>
        <rect x="20" y="248" width="80" height="40" rx="8" fill="#fff" />
        <text x="60" y="274" textAnchor="middle" fontSize="16" fontWeight="800">{PASOS[i] ? `−${PASOS[i]} Ma` : 'Hoy'}</text>
      </svg>
      <input type="range" min="0" max={PASOS.length - 1} step="1" value={i} onChange={(e) => setI(Number(e.target.value))}
        onPointerUp={(e) => e.currentTarget.closest<HTMLElement>('[role=dialog]')?.focus()} className="h-8 w-full max-w-xl accent-[var(--acento)]" aria-label="Tiempo" />
      <p className="max-w-xl text-center text-sm">{TEXTOS[i]}</p>
      <p className="text-xs opacity-70">Mueve el tiempo con el deslizador o con las teclas A y D.</p>
    </div>
  )
}
