import { useEffect, useState } from 'react'

// Simulador de selección natural con polillas sobre un tronco. El estudiante hace de ave: toca las polillas que
// ve para comérselas; al pasar de generación, las sobrevivientes se reproducen. Si no toca ninguna, las aves
// «automáticas» comen más a las que no se camuflan. Se puede cambiar el color del tronco (hollín o aire limpio).

type Color = 'c' | 'o'
const N = 30
const POS = Array.from({ length: N }, (_, k) => {
  const fila = Math.floor(k / 6)
  const col = k % 6
  return [150 + col * 55 + (fila % 2) * 22 + ((k * 37) % 13) - 6, 30 + fila * 52 + ((k * 53) % 15) - 7]
})
const inicial = (): Color[] => Array.from({ length: N }, (_, k) => (k % 10 === 0 ? 'o' : 'c'))

function nuevaGeneracion(vivas: Color[]): Color[] {
  if (vivas.length === 0) return inicial()
  return Array.from({ length: N }, () => {
    const madre = vivas[Math.floor(Math.random() * vivas.length)]
    if (Math.random() < 0.03) return madre === 'c' ? 'o' : 'c' // una mutación de vez en cuando
    return madre
  })
}

function Polilla({ x, y, c, comida, alTocar }: { x: number; y: number; c: Color; comida: boolean; alTocar: () => void }) {
  const ala = c === 'c' ? '#e9e4d8' : '#3b3631'
  const mota = c === 'c' ? '#9d968a' : '#58524b'
  return (
    <g transform={`translate(${x} ${y})`} onClick={alTocar} style={{ cursor: 'pointer', opacity: comida ? 0 : 1, transition: 'opacity 0.4s' }}>
      <path d="M 0 0 L -16 -8 Q -20 6 -6 8 Z M 0 0 L 16 -8 Q 20 6 6 8 Z" fill={ala} stroke={mota} strokeWidth="0.8" />
      <circle cx="-9" cy="-1" r="1.6" fill={mota} /><circle cx="9" cy="-1" r="1.6" fill={mota} />
      <ellipse rx="2.5" ry="7" fill="#5a4a3c" />
    </g>
  )
}

export default function SimuladorPolillas() {
  const [oscuro, setOscuro] = useState(false)
  const [pobl, setPobl] = useState<Color[]>(inicial)
  const [comidas, setComidas] = useState<Set<number>>(new Set())
  const [historia, setHistoria] = useState<number[]>([0.1])

  const pasar = () => {
    let vivas: Color[]
    if (comidas.size > 0) vivas = pobl.filter((_, k) => !comidas.has(k))
    else vivas = pobl.filter((c) => Math.random() > ((c === 'o') === oscuro ? 0.15 : 0.6))
    const sig = nuevaGeneracion(vivas)
    setPobl(sig)
    setComidas(new Set())
    setHistoria((h) => [...h, sig.filter((c) => c === 'o').length / N].slice(-15))
  }
  const reiniciar = () => { setPobl(inicial()); setComidas(new Set()); setHistoria([0.1]) }

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'g') { document.getElementById('sp-pasar')?.click() }
      if (e.key.toLowerCase() === 't') setOscuro((o) => !o)
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])

  const oscuras = pobl.filter((c) => c === 'o').length
  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 600 320" role="img" aria-label="Simulador de selección natural con polillas" className="mx-auto w-full max-w-3xl">
        <rect width="600" height="320" rx="14" fill="#eef1ea" />
        {/* tronco */}
        <rect x="120" y="0" width="360" height="320" fill={oscuro ? '#35302b' : '#d9d3c4'} style={{ transition: 'fill 1s' }} />
        {[150, 230, 330, 420].map((x) => <path key={x} d={`M ${x} 0 q 10 160 -6 320`} stroke={oscuro ? '#2a2622' : '#c4bca9'} strokeWidth="4" fill="none" />)}
        {pobl.map((c, k) => (
          <Polilla key={`${historia.length}-${k}`} x={POS[k][0]} y={POS[k][1]} c={c} comida={comidas.has(k)}
            alTocar={() => setComidas((s) => new Set(s).add(k))} />
        ))}
        {/* gráfica de % de oscuras */}
        <g transform="translate(490 40)">
          <rect width="100" height="120" fill="#fff" rx="8" />
          <polyline fill="none" stroke="#3b3631" strokeWidth="2.5"
            points={historia.map((p, k) => `${8 + k * 6},${110 - p * 100}`).join(' ')} />
          <text x="50" y="-6" textAnchor="middle" fontSize="10" fontWeight="700">% oscuras</text>
        </g>
        <text x="60" y="40" textAnchor="middle" fontSize="12" fontWeight="800">Generación</text>
        <text x="60" y="70" textAnchor="middle" fontSize="28" fontWeight="800">{historia.length}</text>
        <text x="60" y="120" textAnchor="middle" fontSize="12" fontWeight="700" fill="#8a836f">claras: {N - oscuras}</text>
        <text x="60" y="140" textAnchor="middle" fontSize="12" fontWeight="700" fill="#3b3631">oscuras: {oscuras}</text>
        <text x="60" y="190" textAnchor="middle" fontSize="11" fontWeight="600">comidas: {comidas.size}</text>
      </svg>
      <div className="flex flex-wrap justify-center gap-2">
        <button onClick={() => setOscuro((o) => !o)} className="rounded-full border bg-white px-3 py-1 text-sm font-semibold">
          Tronco: {oscuro ? 'con hollín 🏭' : 'limpio 🌳'} (T)
        </button>
        <button id="sp-pasar" onClick={pasar} className="rounded-full bg-[var(--acento)] px-4 py-1 text-sm font-semibold text-white">
          Pasar una generación (G)
        </button>
        <button onClick={reiniciar} className="rounded-full border bg-white px-3 py-1 text-sm font-semibold">Reiniciar</button>
      </div>
      <p className="max-w-xl text-center text-sm">Eres un ave: toca las polillas que veas para comértelas y pasa de generación. Si no tocas ninguna, comen las aves del bosque. Cambia el tronco y mira cómo cambia la población.</p>
    </div>
  )
}
