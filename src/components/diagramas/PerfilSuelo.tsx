import { useEffect, useState } from 'react'

// Perfil de suelo: se toca un horizonte (o teclas 1–5) para ver qué tiene. Con E se ve el mismo perfil después de
// la erosión: se pierden la hojarasca y la capa fértil, y la planta ya no crece bien.

const HOR = [
  { id: 'O', n: 'Hojarasca', alto: 22, c: '#6a5a2a', texto: 'Hojas, ramas y restos que se están descomponiendo.', vida: '🍂 🐜 🍄', prof: 'unos pocos centímetros' },
  { id: 'A', n: 'Capa fértil', alto: 60, c: '#3a2a1a', texto: 'Oscura por el humus. Aquí están casi todas las raíces y la vida del suelo.', vida: '🪱 🐛 🦠 🌱', prof: 'de 10 a 30 cm' },
  { id: 'B', n: 'Subsuelo', alto: 70, c: '#9a6a3a', texto: 'Más claro y arcilloso: acumula minerales que baja el agua. Llegan raíces profundas.', vida: '🌳 raíces largas', prof: 'de 30 cm a 1 m' },
  { id: 'C', n: 'Roca en pedazos', alto: 60, c: '#b8a080', texto: 'Roca madre desmenuzada por la meteorización. Casi sin vida.', vida: '—', prof: 'más de 1 m' },
  { id: 'R', n: 'Roca madre', alto: 50, c: '#8a857e', texto: 'La roca de la que se formó todo el suelo de arriba.', vida: '—', prof: 'abajo de todo' },
]

export default function PerfilSuelo() {
  const [k, setK] = useState(1)
  const [erosion, setErosion] = useState(false)
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const t = e.key.toLowerCase()
      const n = Number(t) - 1
      if (n >= 0 && n < HOR.length) setK(n)
      if (t === 'e') setErosion((v) => !v)
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])

  const perdido = (n: number) => erosion && n <= 1
  let y = 110
  const capas = HOR.map((h, n) => {
    const alto = perdido(n) ? 0 : h.alto
    const g = { ...h, y, alto }
    y += alto
    return g
  })
  const h = HOR[k]
  const top = capas.find((c) => c.alto > 0)!.y

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 600 380" role="img" aria-label={`Perfil de suelo${erosion ? ' después de la erosión' : ''}: horizonte ${h.id}`} className="mx-auto w-full max-w-3xl">
        <rect x="0" y="0" width="600" height="380" fill="#eef3f6" />
        {/* planta encima */}
        <g style={{ transition: 'transform 0.9s ease', transform: `translate(160px, ${top}px)` }}>
          <rect x="-4" y={erosion ? -40 : -70} width="8" height={erosion ? 40 : 70} fill="#7a5a3a" />
          <circle cy={erosion ? -46 : -86} r={erosion ? 14 : 30} fill={erosion ? '#b8b06a' : '#4f8f4f'} />
          {!erosion && <path d="M 0 0 l -20 40 M 0 0 l 0 60 M 0 0 l 22 45" stroke="#c8b07a" strokeWidth="3" fill="none" />}
        </g>
        {capas.map((c, n) => (
          <g key={c.id} onClick={() => !perdido(n) && setK(n)} style={{ cursor: 'pointer' }} role="button" aria-label={`Horizonte ${c.id}: ${c.n}`}>
            <rect x="60" y={c.y} width="200" height={c.alto} fill={c.c} stroke={n === k && c.alto ? '#e0a800' : 'none'} strokeWidth="4" style={{ transition: 'all 0.9s ease' }} />
            {c.alto > 0 && <text x="285" y={c.y + c.alto / 2 + 5} fontSize="15" fontWeight="800" fill="#3a3a3a">{c.id} · {c.n}</text>}
          </g>
        ))}
        {erosion && <text x="160" y="80" textAnchor="middle" fontSize="14" fontWeight="800" fill="#c43c3c">se perdieron la hojarasca y la capa fértil</text>}
        <g transform="translate(420 120)">
          <rect x="0" y="0" width="170" height="220" rx="12" fill="#fff" stroke="#ddd" strokeWidth="2" />
          <text x="85" y="40" textAnchor="middle" fontSize="30" fontWeight="900" fill={h.c}>{h.id}</text>
          <text x="85" y="66" textAnchor="middle" fontSize="15" fontWeight="800" fill="#3a3a3a">{h.n}</text>
          <text x="85" y="92" textAnchor="middle" fontSize="12" fill="#666">{h.prof}</text>
          <text x="85" y="140" textAnchor="middle" fontSize="18">{h.vida}</text>
        </g>
      </svg>
      <p aria-live="polite" className="max-w-3xl text-center text-lg">
        {perdido(k) ? <>Esta capa <strong>ya no está</strong>: se la llevó la erosión, y tarda cientos de años en volver a formarse.</> : <><strong>{h.id} · {h.n}:</strong> {h.texto}</>}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {HOR.map((x, n) => (
          <button key={x.id} onClick={() => setK(n)} className={`rounded-xl border-2 px-3 py-1.5 font-bold ${n === k ? 'border-[#e0a800] bg-[#fff6d6]' : 'border-gray-300 bg-white'}`}>
            <span className="mr-1 rounded bg-gray-700 px-1.5 text-white">{n + 1}</span>{x.id}
          </button>
        ))}
        <button onClick={() => setErosion((v) => !v)} className={`rounded-xl border-2 px-3 py-1.5 font-bold ${erosion ? 'border-[#c43c3c] bg-[#fbeaea]' : 'border-gray-300 bg-white'}`}>
          <span className="mr-1 rounded bg-gray-700 px-1.5 text-white">E</span>{erosion ? 'Volver al suelo sano' : 'Ver después de la erosión'}
        </button>
      </div>
    </div>
  )
}
