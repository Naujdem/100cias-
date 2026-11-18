import { useEffect, useRef, useState } from 'react'

// Explora (Química área 4, tema 2): pistón con partículas. Se elige qué se mantiene fijo (1 = T, Boyle;
// 2 = P, Charles; 3 = V, Gay-Lussac) y con W/S se cambia la variable que se controla. 1 mol de gas.

const R = 0.082
const N = 1
const MODOS = [
  { ley: 'Boyle', fija: 'temperatura', controla: 'volumen', valores: [6, 8, 12, 16, 24.6, 32, 40, 49.2] },
  { ley: 'Charles', fija: 'presión', controla: 'temperatura', valores: [150, 200, 250, 300, 400, 500, 600] },
  { ley: 'Gay-Lussac', fija: 'volumen', controla: 'temperatura', valores: [150, 200, 250, 300, 400, 500, 600] },
]
const INICIO = [4, 3, 3]
const ANCHO = 200, ALTO_MAX = 220, RP = 4, NP = 24

const f = (x: number, d = 2) => x.toLocaleString('es-CO', { maximumFractionDigits: d })

type P = { x: number; y: number; vx: number; vy: number }

export default function PistonGas() {
  const [m, setM] = useState(0)
  const [k, setK] = useState(INICIO[0])
  const [, setCuadro] = useState(0)
  const modo = MODOS[m]
  const val = modo.valores[Math.min(k, modo.valores.length - 1)]
  const V = m === 0 ? val : m === 1 ? (N * R * val) / 1 : 24.6
  const T = m === 0 ? 300 : val
  const P = (N * R * T) / V
  const alto = (V / 50) * ALTO_MAX
  const ps = useRef<P[]>([])
  const datos = useRef({ alto, T })
  datos.current = { alto, T }

  if (ps.current.length === 0) {
    ps.current = Array.from({ length: NP }, () => {
      const a = Math.random() * Math.PI * 2
      return { x: RP + Math.random() * (ANCHO - 2 * RP), y: ALTO_MAX - RP - Math.random() * 80, vx: Math.cos(a), vy: Math.sin(a) }
    })
  }

  useEffect(() => {
    let raf = 0, antes = performance.now()
    const paso = (ahora: number) => {
      const dt = Math.min(0.05, (ahora - antes) / 1000)
      antes = ahora
      const { alto: h, T: t } = datos.current
      const v = 70 * Math.sqrt(t / 300)
      const techo = ALTO_MAX - h
      for (const p of ps.current) {
        const norma = Math.hypot(p.vx, p.vy) || 1
        p.x += (p.vx / norma) * v * dt; p.y += (p.vy / norma) * v * dt
        if (p.x < RP) { p.x = RP; p.vx = Math.abs(p.vx) }
        if (p.x > ANCHO - RP) { p.x = ANCHO - RP; p.vx = -Math.abs(p.vx) }
        if (p.y < techo + RP) { p.y = techo + RP; p.vy = Math.abs(p.vy) }
        if (p.y > ALTO_MAX - RP) { p.y = ALTO_MAX - RP; p.vy = -Math.abs(p.vy) }
      }
      setCuadro((c) => c + 1)
      raf = requestAnimationFrame(paso)
    }
    raf = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => {
      const n = Number(ev.key)
      const t = ev.key.toLowerCase()
      if (n >= 1 && n <= 3) { setM(n - 1); setK(INICIO[n - 1]) }
      if (t === 'w') setK((v) => Math.min(MODOS[m].valores.length - 1, v + 1))
      if (t === 's') setK((v) => Math.max(0, v - 1))
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [m])

  // gráfica de la ley activa
  const G = { w: 220, h: 150 }
  const curva = Array.from({ length: 41 }, (_, j) => {
      if (m === 0) { const vv = 6 + (j / 40) * 44; return [vv / 50, (N * R * 300) / vv / 4.2] }
      const tt = (j / 40) * 600
      return m === 1 ? [tt / 600, (N * R * tt) / 50] : [tt / 600, (N * R * tt) / 24.6 / 2.1]
    })
  const punto = m === 0 ? [V / 50, P / 4.2] : m === 1 ? [T / 600, V / 50] : [T / 600, P / 2.1]
  const ejes = m === 0 ? ['V (L)', 'P (atm)'] : m === 1 ? ['T (K)', 'V (L)'] : ['T (K)', 'P (atm)']
  const ecuacion = m === 0
    ? `P × V = ${f(P)} × ${f(V, 1)} = ${f(P * V, 1)} (constante)`
    : m === 1 ? `V / T = ${f(V, 1)} / ${T} = ${f(V / T, 3)} (constante)` : `P / T = ${f(P)} / ${T} = ${f(P / T, 4)} (constante)`

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-1">
        {MODOS.map((x, j) => (
          <button key={x.ley} onClick={() => { setM(j); setK(INICIO[j]) }} className={`rounded-full border px-3 py-1 text-sm font-semibold ${m === j ? 'bg-[var(--acento)] text-white' : 'bg-white'}`}>
            {j + 1} · {x.ley} ({x.fija} fija)
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <svg viewBox={`-20 -30 ${ANCHO + 40} ${ALTO_MAX + 50}`} className="w-56" role="img" aria-label={`Pistón: ${f(V, 1)} L, ${T} K, ${f(P)} atm`}>
          <line x1="-6" y1="-25" x2="-6" y2={ALTO_MAX + 6} stroke="#3a3a3a" strokeWidth="5" />
          <line x1={ANCHO + 6} y1="-25" x2={ANCHO + 6} y2={ALTO_MAX + 6} stroke="#3a3a3a" strokeWidth="5" />
          <line x1="-8" y1={ALTO_MAX + 6} x2={ANCHO + 8} y2={ALTO_MAX + 6} stroke="#3a3a3a" strokeWidth="5" />
          <rect x="-3" y={ALTO_MAX - alto - 14} width={ANCHO + 6} height="14" fill="#9aa1a8" style={{ transition: 'y 0.6s' }} />
          <rect x={ANCHO / 2 - 5} y={ALTO_MAX - alto - 60} width="10" height="46" fill="#9aa1a8" style={{ transition: 'y 0.6s' }} />
          {ps.current.map((p, j) => <circle key={j} cx={p.x} cy={p.y} r={RP} fill={T > 350 ? '#c43c3c' : T < 250 ? '#3f6fb8' : '#5b8fd6'} />)}
          {m === 2 && <text x={ANCHO / 2} y={ALTO_MAX - alto - 66} textAnchor="middle" fontSize="11" fontWeight="800" fill="#c43c3c">trabado</text>}
        </svg>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2 text-center">
            {[['P', `${f(P)} atm`], ['V', `${f(V, 1)} L`], ['T', `${T} K`]].map(([n, v], j) => {
              const fija = (m === 0 && j === 2) || (m === 1 && j === 0) || (m === 2 && j === 1)
              const controla = (m === 0 && j === 1) || (m !== 0 && j === 2)
              return (
                <div key={String(n)} className={`rounded-xl border-2 bg-white px-2 py-1 ${controla ? 'border-[var(--acento)]' : ''}`}>
                  <p className="text-xs font-bold opacity-70">{n} {fija ? '🔒' : controla ? '🎚️' : '👀'}</p>
                  <p className="font-black">{String(v)}</p>
                </div>
              )
            })}
          </div>
          <svg viewBox={`-30 -10 ${G.w + 40} ${G.h + 40}`} className="w-64 rounded-xl bg-white" role="img" aria-label="Gráfica de la ley">
            <line x1="0" y1={G.h} x2={G.w} y2={G.h} stroke="#3a3a3a" />
            <line x1="0" y1="0" x2="0" y2={G.h} stroke="#3a3a3a" />
            <polyline fill="none" stroke="#3f6fb8" strokeWidth="2" points={curva.map(([x, y]) => `${x * G.w},${G.h - Math.min(1, y) * G.h}`).join(' ')} />
            <circle cx={punto[0] * G.w} cy={G.h - Math.min(1, punto[1]) * G.h} r="6" fill="#c43c3c" />
            <text x={G.w / 2} y={G.h + 22} textAnchor="middle" fontSize="11" fontWeight="700">{ejes[0]}</text>
            <text x="-22" y={G.h / 2} textAnchor="middle" fontSize="11" fontWeight="700" transform={`rotate(-90 -22 ${G.h / 2})`}>{ejes[1]}</text>
          </svg>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setK((v) => Math.max(0, v - 1))} className="rounded-full border bg-white px-4 py-1 text-sm font-semibold">Menos {modo.controla} (S)</button>
        <button onClick={() => setK((v) => Math.min(modo.valores.length - 1, v + 1))} className="rounded-full border bg-white px-4 py-1 text-sm font-semibold">Más {modo.controla} (W)</button>
      </div>
      <div className="rounded-xl border-2 border-[var(--acento)] bg-white px-4 py-2 text-center font-semibold">{ecuacion}</div>
      <p className="max-w-xl text-center text-xs opacity-70">1–3 elige la ley (qué queda fijo 🔒) · W/S cambia la variable 🎚️ · 👀 mira cómo responde la otra. Un mol de gas; temperaturas en kelvin.</p>
    </div>
  )
}
