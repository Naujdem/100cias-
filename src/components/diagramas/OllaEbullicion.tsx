import { useEffect, useState } from 'react'

// Explora (Química área 4, tema 3): ¿a qué temperatura hierve? Curva de presión de vapor (ecuación de Antoine)
// contra la presión del aire del lugar. Teclas 1–4 lugar, Q cambia el líquido, W/S temperatura.

const LUGARES = [
  { nombre: 'Nivel del mar', P: 760 },
  { nombre: 'Neiva', P: 720 },
  { nombre: 'Bogotá', P: 560 },
  { nombre: 'Nevado del Huila', P: 400 },
]
const LIQUIDOS = [
  { nombre: 'Agua', A: 8.07131, B: 1730.63, C: 233.426, color: '#3f6fb8' },
  { nombre: 'Alcohol (etanol)', A: 8.20417, B: 1642.89, C: 230.3, color: '#8a5ab8' },
]
const pVapor = (l: (typeof LIQUIDOS)[number], t: number) => 10 ** (l.A - l.B / (l.C + t))
const tHierve = (l: (typeof LIQUIDOS)[number], P: number) => l.B / (l.A - Math.log10(P)) - l.C

const W = 300, H = 200, TMAX = 110, PMAX = 900
const f = (x: number, d = 0) => x.toLocaleString('es-CO', { maximumFractionDigits: d })

export default function OllaEbullicion() {
  const [li, setLi] = useState(2)
  const [qi, setQi] = useState(0)
  const [t, setT] = useState(60)
  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => {
      const n = Number(ev.key)
      const k = ev.key.toLowerCase()
      if (n >= 1 && n <= 4) setLi(n - 1)
      if (k === 'q') setQi((v) => 1 - v)
      if (k === 'w') setT((v) => Math.min(TMAX, v + 2))
      if (k === 's') setT((v) => Math.max(20, v - 2))
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])
  const L = LUGARES[li], Q = LIQUIDOS[qi]
  const pv = pVapor(Q, t)
  const hierve = pv >= L.P
  const te = tHierve(Q, L.P)
  const tReal = Math.min(t, te) // al hervir, la temperatura del líquido ya no sube
  const px = (x: number) => (x / TMAX) * W
  const py = (p: number) => H - (Math.min(p, PMAX) / PMAX) * H
  const curva = Array.from({ length: 56 }, (_, j) => { const x = j * 2; return `${px(x)},${py(pVapor(Q, x))}` }).join(' ')

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-1">
        {LUGARES.map((x, j) => <button key={x.nombre} onClick={() => setLi(j)} className={`rounded-full border px-3 py-1 text-sm font-semibold ${li === j ? 'bg-[var(--acento)] text-white' : 'bg-white'}`}>{j + 1} · {x.nombre}</button>)}
        <button onClick={() => setQi((v) => 1 - v)} className="rounded-full border bg-white px-3 py-1 text-sm font-semibold">Q · {Q.nombre}</button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <svg viewBox="0 0 200 200" className="w-44" role="img" aria-label={hierve ? 'El líquido hierve' : 'El líquido no hierve'}>
          {[-30, 0, 30].map((d) => <path key={d} d={`M${100 + d} 190 q-6 -10 0 -18 q6 -8 0 -16`} fill="#f6a33c" opacity={0.4 + (t / TMAX) * 0.6} />)}
          <rect x="30" y="70" width="140" height="90" rx="6" fill="#888" />
          <rect x="34" y="80" width="132" height="76" fill={Q.color} opacity="0.45" />
          {hierve && Array.from({ length: 8 }, (_, k) => (
            <circle key={k} cx={45 + k * 16} cy="150" r={3 + (k % 3)} fill="#fff">
              <animate attributeName="cy" values="152;82" dur={`${0.7 + (k % 4) * 0.2}s`} repeatCount="indefinite" />
            </circle>
          ))}
          <text x="100" y="40" textAnchor="middle" fontSize="18" fontWeight="900" fill={hierve ? '#c43c3c' : '#3a3a3a'}>{f(tReal)} °C</text>
          <text x="100" y="60" textAnchor="middle" fontSize="11" fontWeight="700" fill="#3a3a3a">{hierve ? '¡hierve!' : 'todavía no hierve'}</text>
        </svg>
        <svg viewBox={`-40 -10 ${W + 60} ${H + 40}`} className="w-full max-w-sm rounded-xl bg-white" role="img" aria-label="Presión de vapor contra temperatura">
          <line x1="0" y1={H} x2={W} y2={H} stroke="#3a3a3a" /><line x1="0" y1="0" x2="0" y2={H} stroke="#3a3a3a" />
          {[0, 25, 50, 75, 100].map((x) => <text key={x} x={px(x)} y={H + 14} textAnchor="middle" fontSize="10">{x}</text>)}
          {[0, 400, 800].map((p) => <text key={p} x="-6" y={py(p) + 4} textAnchor="end" fontSize="10">{p}</text>)}
          <text x={W / 2} y={H + 30} textAnchor="middle" fontSize="11" fontWeight="700">temperatura (°C)</text>
          <polyline fill="none" stroke={Q.color} strokeWidth="2.5" points={curva} />
          <line x1="0" y1={py(L.P)} x2={W} y2={py(L.P)} stroke="#c43c3c" strokeWidth="2" strokeDasharray="6 4" />
          <text x={W - 4} y={py(L.P) - 5} textAnchor="end" fontSize="10" fontWeight="800" fill="#c43c3c">aire: {L.P} mmHg</text>
          <line x1={px(te)} y1={py(L.P)} x2={px(te)} y2={H} stroke="#c43c3c" strokeDasharray="2 3" />
          <circle cx={px(tReal)} cy={py(pVapor(Q, tReal))} r="6" fill="#3a3a3a" />
        </svg>
      </div>
      <input type="range" min={20} max={TMAX} step={2} value={t} onChange={(e) => setT(+e.target.value)} className="w-72" aria-label="Fuego (temperatura)" />
      <div className="rounded-xl border-2 border-[var(--acento)] bg-white px-4 py-2 text-center">
        <p className="font-semibold">Presión de vapor: <b>{f(pVapor(Q, tReal))} mmHg</b> · Presión del aire en {L.nombre}: <b>{L.P} mmHg</b></p>
        <p className="font-semibold">{Q.nombre} hierve aquí a <b>{f(te, 1)} °C</b></p>
      </div>
      <p className="max-w-xl text-center text-xs opacity-70">1–4 lugar · Q líquido · W/S sube o baja el fuego. Hierve cuando la curva alcanza la línea roja; mientras hierve, la temperatura ya no sube aunque le subas el fuego. Presiones del aire aproximadas.</p>
    </div>
  )
}
