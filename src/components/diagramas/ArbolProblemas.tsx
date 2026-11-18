import { useEffect, useState } from 'react'

// Árbol de problemas: se elige un problema (teclas 1–3) y se van mostrando sus causas (C, raíces), sus efectos
// (E, ramas) y las soluciones que atacan cada causa (S, frutos junto a las raíces). Ejemplos de una vereda.

const PROBLEMAS = [
  {
    n: 'La quebrada está contaminada', ic: '🏞️',
    causas: ['Aguas negras sin tratar', 'Mieles del café al agua', 'Ganado en la orilla'],
    efectos: ['Diarrea en los niños', 'Mueren los peces', 'Mal olor'],
    soluciones: ['Pozos sépticos', 'Tratar las mieles', 'Cercar y sembrar la orilla'],
  },
  {
    n: 'Basura regada en la vereda', ic: '🗑️',
    causas: ['No hay recolección', 'No se separa en casa', 'Mucho empaque desechable'],
    efectos: ['Plagas y ratas', 'Basura en la quebrada', 'Quemas con humo tóxico'],
    soluciones: ['Punto de acopio comunitario', 'Separar y compostar', 'Comprar sin tanto empaque'],
  },
  {
    n: 'Se seca el nacimiento en verano', ic: '💧',
    causas: ['Tala alrededor', 'Ganado pisando el suelo', 'Quemas en la loma'],
    efectos: ['Falta agua en las casas', 'Se pierden cosechas', 'Conflictos por el agua'],
    soluciones: ['Sembrar nativas', 'Cercar el nacimiento', 'Acuerdo de no quemar'],
  },
]

export default function ArbolProblemas() {
  const [p, setP] = useState(0)
  const [ver, setVer] = useState({ c: true, e: false, s: false })
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const t = e.key.toLowerCase()
      const n = Number(t) - 1
      if (n >= 0 && n < PROBLEMAS.length) setP(n)
      if (t === 'c' || t === 'e' || t === 's') setVer((v) => ({ ...v, [t]: !v[t as 'c' | 'e' | 's'] }))
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])

  const pr = PROBLEMAS[p]
  const tt = 'opacity 0.6s ease'
  const caja = (x: number, y: number, t: string, fondo: string, borde: string, k: number) => (
    <g key={t + k}>
      <rect x={x - 82} y={y - 18} width="164" height="36" rx="10" fill={fondo} stroke={borde} strokeWidth="2" />
      <text x={x} y={y + 5} textAnchor="middle" fontSize="12" fontWeight="800" fill="#3a3a3a">{t}</text>
    </g>
  )
  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 600 400" role="img" aria-label={`Árbol de problemas: ${pr.n}`} className="mx-auto w-full max-w-3xl">
        <rect x="0" y="0" width="600" height="400" fill="#f3f6ee" />
        {/* copa y ramas: efectos */}
        <ellipse cx="300" cy="80" rx="260" ry="70" fill="#cfe5c0" />
        <g style={{ transition: tt, opacity: ver.e ? 1 : 0 }}>{pr.efectos.map((t, k) => caja(120 + k * 180, 70, t, '#fbeaea', '#c43c3c', k))}</g>
        {/* tronco: el problema */}
        <rect x="270" y="140" width="60" height="110" fill="#8a6a3a" />
        <rect x="160" y="175" width="280" height="44" rx="12" fill="#fff" stroke="#3a3a3a" strokeWidth="3" />
        <text x="300" y="203" textAnchor="middle" fontSize="15" fontWeight="900" fill="#3a3a3a">{pr.ic} {pr.n}</text>
        {/* raíces: causas */}
        <rect x="0" y="250" width="600" height="150" fill="#9a7a50" />
        {[-1, 0, 1].map((d) => <path key={d} d={`M 300 250 Q ${300 + d * 60} 280 ${300 + d * 180} 300`} stroke="#6a4a2a" strokeWidth="8" fill="none" />)}
        <g style={{ transition: tt, opacity: ver.c ? 1 : 0 }}>{pr.causas.map((t, k) => caja(120 + k * 180, 310, t, '#fff6d6', '#a06a2a', k))}</g>
        {/* soluciones bajo cada causa */}
        <g style={{ transition: tt, opacity: ver.s ? 1 : 0 }}>{pr.soluciones.map((t, k) => caja(120 + k * 180, 365, `✓ ${t}`, '#dff0d8', '#3f9a5a', k))}</g>
        <text x="20" y="30" fontSize="12" fontWeight="800" fill="#c43c3c" opacity={ver.e ? 1 : 0}>EFECTOS (ramas)</text>
        <text x="20" y="272" fontSize="12" fontWeight="800" fill="#fff" opacity={ver.c ? 1 : 0}>CAUSAS (raíces)</text>
      </svg>
      <div className="flex flex-wrap justify-center gap-2">
        {PROBLEMAS.map((x, n) => (
          <button key={x.n} onClick={() => setP(n)} className={`rounded-xl border-2 px-3 py-1.5 font-bold ${p === n ? 'border-[#3a3a3a] bg-white' : 'border-gray-300 bg-white text-gray-500'}`}>
            <span className="mr-1 rounded bg-gray-700 px-1.5 text-white">{n + 1}</span>{x.ic} {x.n}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {([['c', 'Causas', '#a06a2a'], ['e', 'Efectos', '#c43c3c'], ['s', 'Soluciones', '#3f9a5a']] as const).map(([k, n, col]) => (
          <button key={k} onClick={() => setVer((v) => ({ ...v, [k]: !v[k] }))} style={{ borderColor: ver[k] ? col : undefined }} className="rounded-xl border-2 border-gray-300 bg-white px-3 py-1.5 font-bold">
            <span className="mr-1 rounded bg-gray-700 px-1.5 uppercase text-white">{k}</span>{ver[k] ? 'Ocultar' : 'Ver'} {n.toLowerCase()}
          </button>
        ))}
      </div>
      <p className="max-w-3xl text-center text-base text-gray-700">Cada solución ataca una causa: si solo se atienden los efectos, el problema vuelve.</p>
    </div>
  )
}
