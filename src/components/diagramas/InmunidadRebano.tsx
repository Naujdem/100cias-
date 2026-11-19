import { useEffect, useRef, useState } from 'react'

// Inmunidad de rebaño: un curso de 100 personas en una cuadrícula. A/D cambia el % de vacunados; Enter (o el botón)
// suelta un contagio en una persona sin vacunar. Cada día, cada enfermo contagia con cierta probabilidad a sus vecinos
// no vacunados y se cura a los 3 días. Modelo de juguete para la clase (la vacuna se supone 100 % eficaz).

const N = 10
type Estado = 'sano' | 'vacunado' | 'enfermo' | 'curado'
const PROB = 0.55

function aleatorio(semilla: number) {
  let s = semilla
  return () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
}

function armar(pct: number, semilla: number): Estado[] {
  const r = aleatorio(semilla)
  const orden = Array.from({ length: N * N }, (_, k) => k).sort(() => r() - 0.5)
  const vac = new Set(orden.slice(0, Math.round((pct / 100) * N * N)))
  return Array.from({ length: N * N }, (_, k) => (vac.has(k) ? 'vacunado' : 'sano'))
}

export default function InmunidadRebano() {
  const [pct, setPct] = useState(30)
  const [semilla, setSemilla] = useState(7)
  const [celdas, setCeldas] = useState<Estado[]>(() => armar(30, 7))
  const [dias, setDias] = useState<number[]>(() => Array(N * N).fill(0))
  const [corre, setCorre] = useState(false)
  const [dia, setDia] = useState(0)
  const rnd = useRef(aleatorio(99))

  const reiniciar = (p: number, s: number) => {
    setCeldas(armar(p, s)); setDias(Array(N * N).fill(0)); setCorre(false); setDia(0)
  }
  const soltar = () => {
    const sanos = celdas.map((e, k) => (e === 'sano' ? k : -1)).filter((k) => k >= 0)
    if (!sanos.length || corre) return
    const k = sanos[Math.floor(sanos.length / 2)]
    setCeldas((c) => c.map((e, j) => (j === k ? 'enfermo' : e)))
    setCorre(true)
  }

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const t = e.key.toLowerCase()
      if (t === 'd') { const p = Math.min(95, pct + 5); setPct(p); reiniciar(p, semilla) }
      if (t === 'a') { const p = Math.max(0, pct - 5); setPct(p); reiniciar(p, semilla) }
      if (t === 'enter') soltar()
      if (t === 'r') { const s = semilla + 1; setSemilla(s); reiniciar(pct, s) }
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  })

  useEffect(() => {
    if (!corre) return
    const id = setTimeout(() => {
      const nuevo = [...celdas]
      const nd = [...dias]
      let hay = false
      celdas.forEach((e, k) => {
        if (e !== 'enfermo') return
        hay = true
        const x = k % N, y = Math.floor(k / N)
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const xx = x + dx, yy = y + dy
          if (xx < 0 || yy < 0 || xx >= N || yy >= N) continue
          const j = yy * N + xx
          if (celdas[j] === 'sano' && nuevo[j] === 'sano' && rnd.current() < PROB) nuevo[j] = 'enfermo'
        }
        nd[k] += 1
        if (nd[k] >= 3) nuevo[k] = 'curado'
      })
      setCeldas(nuevo); setDias(nd); setDia((d) => d + 1)
      if (!hay || !nuevo.includes('enfermo')) setCorre(false)
    }, 450)
    return () => clearTimeout(id)
  }, [corre, celdas, dias])

  const cuenta = (e: Estado) => celdas.filter((c) => c === e).length
  const contagiados = cuenta('enfermo') + cuenta('curado')
  const sinVacuna = N * N - cuenta('vacunado')
  const COLOR: Record<Estado, string> = { sano: '#f6e3d3', vacunado: '#9cc8ec', enfermo: '#c43c3c', curado: '#b8b0a8' }
  const ICONO: Record<Estado, string> = { sano: '🙂', vacunado: '💉', enfermo: '🤒', curado: '😌' }

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 600 330" role="img" aria-label={`${pct} % vacunados; ${contagiados} contagiados`} className="mx-auto w-full max-w-3xl">
        <rect x="0" y="0" width="600" height="330" fill="#f3f0ea" />
        {celdas.map((e, k) => (
          <g key={k} transform={`translate(${20 + (k % N) * 30} ${15 + Math.floor(k / N) * 30})`}>
            <rect width="27" height="27" rx="6" fill={COLOR[e]} style={{ transition: 'fill 0.4s ease' }} />
            <text x="13.5" y="19" textAnchor="middle" fontSize="13">{ICONO[e]}</text>
          </g>
        ))}
        <text x="460" y="50" textAnchor="middle" fontSize="16" fontWeight="800" fill="#2f6fc1">{pct} % vacunados</text>
        <text x="460" y="90" textAnchor="middle" fontSize="14" fill="#3a3a3a">Día {dia}</text>
        <text x="460" y="130" textAnchor="middle" fontSize="14" fill="#c43c3c">🤒 enfermos ahora: {cuenta('enfermo')}</text>
        <text x="460" y="160" textAnchor="middle" fontSize="14" fill="#555">😌 ya se curaron: {cuenta('curado')}</text>
        <text x="460" y="210" textAnchor="middle" fontSize="15" fontWeight="800" fill="#3a3a3a">Se contagiaron</text>
        <text x="460" y="240" textAnchor="middle" fontSize="22" fontWeight="900" fill="#c43c3c">{contagiados} de {sinVacuna}</text>
        <text x="460" y="260" textAnchor="middle" fontSize="12" fill="#555">sin vacunar</text>
      </svg>
      <p aria-live="polite" className="max-w-3xl text-center text-lg">
        {dia === 0
          ? 'Elige cuántos se vacunan y suelta el contagio.'
          : corre
            ? 'El microbio pasa de vecino en vecino…'
            : contagiados <= 5
              ? '🛡️ El contagio se apagó solo: los vacunados hicieron de muro. Eso es la inmunidad de rebaño.'
              : '⚠️ El contagio se regó. Prueba con más vacunados (D) y vuelve a soltarlo.'}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <button onClick={soltar} className="rounded-xl border-2 border-gray-300 bg-white px-3 py-1.5 font-bold"><span className="mr-1 rounded bg-gray-700 px-1.5 text-white">Enter</span>Soltar el contagio</button>
        <button onClick={() => { const s = semilla + 1; setSemilla(s); reiniciar(pct, s) }} className="rounded-xl border-2 border-gray-300 bg-white px-3 py-1.5 font-bold"><span className="mr-1 rounded bg-gray-700 px-1.5 text-white">R</span>Otro curso</button>
      </div>
      <p className="max-w-3xl text-center text-sm text-gray-600">A/D: menos o más vacunados (de a 5 %). Modelo de juguete: cada enfermo contagia a sus vecinos no vacunados y se cura a los 3 días; en la vida real ninguna vacuna es 100 % eficaz.</p>
    </div>
  )
}
