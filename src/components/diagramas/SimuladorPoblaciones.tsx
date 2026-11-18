import { useState } from 'react'

// Simulador depredador–presa (modelo sencillo por pasos). Se eligen cuántas presas y depredadores hay al empezar,
// y si hay depredadores o no; la gráfica muestra las dos poblaciones en el tiempo.

const K = 600
function simular(p0: number, d0: number, conDep: boolean, pasos = 200) {
  let P = p0
  let D = conDep ? d0 : 0
  const out: [number, number][] = []
  for (let t = 0; t < pasos; t++) {
    out.push([P, D])
    const nP = Math.max(0, P + 0.1 * P * (1 - P / K) - 0.002 * P * D)
    const nD = Math.max(0, D + 0.25 * 0.002 * P * D - 0.08 * D)
    P = nP
    D = nD
  }
  return out
}

export default function SimuladorPoblaciones() {
  const [p0, setP0] = useState(200)
  const [d0, setD0] = useState(20)
  const [conDep, setConDep] = useState(true)
  const datos = simular(p0, d0, conDep)
  const W = 600, H = 240, max = 650
  const linea = (j: 0 | 1, esc = 1) => datos.map((v, t) => `${(t / (datos.length - 1)) * W},${H - Math.min(max, v[j] * esc) / max * H}`).join(' ')
  const fin = datos[datos.length - 1]
  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <label className="flex items-center gap-2 text-sm font-bold">🐇 Presas al inicio
          <input type="range" min={20} max={600} step={10} value={p0} onChange={(e) => setP0(Number(e.target.value))} className="accent-[var(--acento)]" />
          <span className="w-10">{p0}</span>
        </label>
        <label className="flex items-center gap-2 text-sm font-bold">🦊 Depredadores al inicio
          <input type="range" min={2} max={100} step={1} value={d0} onChange={(e) => setD0(Number(e.target.value))} disabled={!conDep} className="accent-[var(--acento)]" />
          <span className="w-8">{conDep ? d0 : 0}</span>
        </label>
        <button type="button" aria-pressed={!conDep} onClick={() => setConDep((v) => !v)}
          className="min-h-11 rounded-full border border-[var(--acento)] px-4 text-sm font-semibold text-[var(--acento)] aria-pressed:bg-[var(--acento)] aria-pressed:text-[var(--sobre-acento)]">
          {conDep ? '🚫 Quitar los depredadores' : '🦊 Volver a poner depredadores'}
        </button>
      </div>
      <svg viewBox={`-40 -10 ${W + 60} ${H + 40}`} role="img" aria-label="Gráfica de presas y depredadores en el tiempo" className="w-full max-w-3xl">
        <line x1="0" y1={H} x2={W} y2={H} stroke="#888" /><line x1="0" y1="0" x2="0" y2={H} stroke="#888" />
        <line x1="0" x2={W} y1={H - (K / max) * H} y2={H - (K / max) * H} stroke="#c43c3c" strokeDasharray="5 4" opacity="0.5" />
        <text x={W - 4} y={H - (K / max) * H - 4} textAnchor="end" fontSize="11" fill="#c43c3c">capacidad de carga de las presas</text>
        <polyline points={linea(0)} fill="none" stroke="#3f9a5a" strokeWidth="3" />
        {conDep && <polyline points={linea(1, 5)} fill="none" stroke="#e08a2e" strokeWidth="3" />}
        <text x={W / 2} y={H + 24} textAnchor="middle" fontSize="12" fill="#3a3a3a">tiempo →</text>
      </svg>
      <p className="text-center text-sm"><span className="font-bold text-[#3f9a5a]">— presas</span> · {conDep && <span className="font-bold text-[#e08a2e]">— depredadores (escala × 5)</span>}</p>
      <p aria-live="polite" className="max-w-2xl text-center text-lg">
        {conDep
          ? `Las dos poblaciones suben y bajan una tras otra hasta acercarse a un equilibrio (unas ${Math.round(fin[0])} presas y ${Math.round(fin[1])} depredadores).`
          : `Sin depredadores, las presas crecen hasta la capacidad de carga (${K}) y ahí se frenan: curva en S.`}
      </p>
    </div>
  )
}
