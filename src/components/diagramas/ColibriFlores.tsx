import { useEffect, useState } from 'react'

// Picos y flores: se elige una flor y se ve qué colibrí alcanza el néctar. Cada pico está adaptado a una forma de
// flor (el colibrí pico de espada de los Andes, con el pico más largo que el cuerpo, llega a las flores más largas).

const FLORES = [
  { id: 'corta', n: 'Flor corta', largo: 30, curva: 0, c: '#e06aa0' },
  { id: 'curva', n: 'Flor curva', largo: 60, curva: 1, c: '#e8743b' },
  { id: 'larga', n: 'Flor muy larga', largo: 105, curva: 0, c: '#9b5fc0' },
]
const COLIBRIES = [
  { id: 'corto', n: 'Pico corto', flor: 'corta', pico: 'M 0 0 L 26 2', ic: '🐦' },
  { id: 'curvo', n: 'Pico curvo (ermitaño)', flor: 'curva', pico: 'M 0 0 Q 30 0 50 -28', ic: '🐦' },
  { id: 'espada', n: 'Pico de espada', flor: 'larga', pico: 'M 0 0 L 110 4', ic: '🐦' },
]

function Flor({ largo, curva, c }: { largo: number; curva: number; c: string }) {
  const d = curva ? `M 0 0 Q ${largo * 0.6} 0 ${largo * 0.85} ${largo * 0.5}` : `M 0 0 L ${largo} 0`
  return (
    <g>
      <path d={d} stroke={c} strokeWidth="16" strokeLinecap="round" fill="none" />
      <path d={d} stroke="#fff" strokeWidth="3" fill="none" opacity="0.5" />
      <circle r="12" fill={c} />
      {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="0" cy="-14" rx="6" ry="10" fill={c} transform={`rotate(${a})`} opacity="0.85" />)}
    </g>
  )
}

function Ave({ pico, alcanza }: { pico: string; alcanza: boolean }) {
  return (
    <g>
      <path d="M -40 6 l -22 10 l 4 -12 z" fill="#2f7a5a" />
      <ellipse cx="-20" cy="6" rx="24" ry="12" fill="#3d9a70" />
      <path d="M -24 -2 q -10 -30 10 -24" fill="#5fb48a" opacity="0.8" />
      <circle cx="0" cy="0" r="10" fill="#3d9a70" />
      <circle cx="3" cy="-3" r="2" fill="#fff" />
      <path d={pico} transform="translate(8 0)" stroke={alcanza ? '#2b2b2b' : '#777'} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </g>
  )
}

export default function ColibriFlores() {
  const [flor, setFlor] = useState(0)
  const [ave, setAve] = useState(0)
  const f = FLORES[flor]
  const a = COLIBRIES[ave]
  const alcanza = a.flor === f.id

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const n = Number(e.key)
      if (n >= 1 && n <= 3) setFlor(n - 1)
      const k = { q: 0, w: 1, e: 2 }[e.key.toLowerCase()]
      if (k !== undefined) setAve(k)
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-2">
        {FLORES.map((x, k) => (
          <button key={x.id} onClick={() => setFlor(k)} className={`rounded-full border px-3 py-1 text-sm font-semibold ${k === flor ? 'bg-[var(--acento)] text-white' : 'bg-white'}`}>
            {k + 1}. 🌺 {x.n}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 600 240" role="img" aria-label={`${a.n} con ${f.n}`} className="mx-auto w-full max-w-3xl">
        <rect width="600" height="240" rx="14" fill={alcanza ? '#eef6ea' : '#f6efee'} style={{ transition: 'fill 0.5s' }} />
        <g transform="translate(460 110) scale(-1 1)"><Flor largo={f.largo} curva={f.curva} c={f.c} /></g>
        <g transform={`translate(${460 - (a.id === 'espada' ? 120 : a.id === 'curvo' ? 60 : 40)} ${a.id === 'curvo' ? 138 : 110})`} style={{ transition: 'transform 0.6s' }}>
          <Ave pico={a.pico} alcanza={alcanza} />
        </g>
        <text x="300" y="210" textAnchor="middle" fontSize="16" fontWeight="800" fill={alcanza ? '#3f7a35' : '#c43c3c'}>
          {alcanza ? '✓ Alcanza el néctar: pico y flor encajan' : '✗ No alcanza bien el néctar'}
        </text>
      </svg>
      <div className="flex flex-wrap justify-center gap-2">
        {COLIBRIES.map((x, k) => (
          <button key={x.id} onClick={() => setAve(k)} className={`rounded-full border px-3 py-1 text-sm font-semibold ${k === ave ? 'bg-[#3d9a70] text-white' : 'bg-white'}`}>
            {'QWE'[k]}. {x.n}
          </button>
        ))}
      </div>
      <p className="max-w-xl text-center text-sm">Elige una flor (1 a 3) y un colibrí (Q, W, E). Cada pico es una adaptación a un tipo de flor; y la flor, a su vez, se adaptó a su polinizador.</p>
    </div>
  )
}
