import { useEffect, useRef, useState } from 'react'

// Explora (Química área 4, tema 6): reactor de colisiones. Partículas A y B que reaccionan (A + B → AB) solo si
// chocan con energía suficiente. W/S temperatura, Q/A concentración, C catalizador (baja la energía de
// activación), espacio pausa, R reinicia. Se grafica cuántos reactivos quedan en el tiempo.

const W = 340, H = 220, RA = 6
const TEMPS = [200, 250, 300, 350, 400, 500, 600]
const CANT = [10, 20, 30, 40]
const EA = 1.0, EA_CAT = 0.45

type P = { x: number; y: number; vx: number; vy: number; t: 0 | 1 | 2; f?: number }

function crear(n: number, temp: number): P[] {
  const ps: P[] = []
  for (let k = 0; k < 2 * n; k++) {
    const a = Math.random() * Math.PI * 2
    const v = 60 * Math.sqrt(temp / 300) * (0.4 + Math.random() * 1.2)
    ps.push({ x: RA + Math.random() * (W - 2 * RA), y: RA + Math.random() * (H - 2 * RA), vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: (k % 2) as 0 | 1 })
  }
  return ps
}

export default function ReactorColisiones() {
  const [ti, setTi] = useState(2)
  const [ni, setNi] = useState(1)
  const [cat, setCat] = useState(false)
  const [pausa, setPausa] = useState(false)
  const [, setCuadro] = useState(0)
  const ps = useRef<P[]>(crear(CANT[1], TEMPS[2]))
  const inicio = useRef(performance.now())
  const historia = useRef<{ t: number; n: number }[]>([])
  const conf = useRef({ ea: EA, pausa: false, temp: TEMPS[2] })
  conf.current = { ea: cat ? EA_CAT : EA, pausa, temp: TEMPS[ti] }

  const reiniciar = (temp = TEMPS[ti], n = CANT[ni]) => {
    ps.current = crear(n, temp)
    inicio.current = performance.now()
    historia.current = []
  }
  useEffect(() => { reiniciar() }, [ti, ni, cat]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let raf = 0, antes = performance.now(), ultimo = 0
    const paso = (ahora: number) => {
      const dt = Math.min(0.05, (ahora - antes) / 1000)
      antes = ahora
      if (!conf.current.pausa) {
        const arr = ps.current
        for (const p of arr) {
          p.x += p.vx * dt; p.y += p.vy * dt
          if (p.x < RA) { p.x = RA; p.vx = Math.abs(p.vx) }
          if (p.x > W - RA) { p.x = W - RA; p.vx = -Math.abs(p.vx) }
          if (p.y < RA) { p.y = RA; p.vy = Math.abs(p.vy) }
          if (p.y > H - RA) { p.y = H - RA; p.vy = -Math.abs(p.vy) }
          // de vez en cuando la partícula cambia de rapidez (choques con el solvente): así siempre hay algunas rápidas
          if (Math.random() < dt * 0.6) {
            const a = Math.random() * Math.PI * 2
            const v = 60 * Math.sqrt(conf.current.temp / 300) * (0.4 + Math.random() * 1.2)
            p.vx = Math.cos(a) * v; p.vy = Math.sin(a) * v
          }
        }
        // choques A–B: reaccionan si la energía del choque supera la de activación
        for (let a = 0; a < arr.length; a++) {
          if (arr[a].t !== 0) continue
          for (let b = 0; b < arr.length; b++) {
            const A = arr[a], B = arr[b]
            if (B.t !== 1 || A.t !== 0) continue
            const dx = B.x - A.x, dy = B.y - A.y
            if (dx * dx + dy * dy > (2 * RA) ** 2) continue
            const vr = Math.hypot(B.vx - A.vx, B.vy - A.vy) / 100
            if (0.5 * vr * vr >= conf.current.ea) {
              A.t = 2; A.f = ahora; A.x = (A.x + B.x) / 2; A.y = (A.y + B.y) / 2
              A.vx = (A.vx + B.vx) / 2; A.vy = (A.vy + B.vy) / 2
              B.t = 2; B.x = -100; B.vx = 0; B.vy = 0 // B se une a A y desaparece
            } else {
              // rebote simple
              const tvx = A.vx, tvy = A.vy
              A.vx = B.vx; A.vy = B.vy; B.vx = tvx; B.vy = tvy
              A.x -= dx * 0.1; A.y -= dy * 0.1
            }
          }
        }
        ps.current = arr.filter((p) => p.x > -50)
        if (ahora - ultimo > 250) {
          ultimo = ahora
          historia.current.push({ t: (ahora - inicio.current) / 1000, n: ps.current.filter((p) => p.t === 0).length })
          if (historia.current.length > 120) historia.current.shift()
        }
      }
      setCuadro((c) => c + 1)
      raf = requestAnimationFrame(paso)
    }
    raf = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => {
      const k = ev.key.toLowerCase()
      if (k === 'w') setTi((v) => Math.min(TEMPS.length - 1, v + 1))
      if (k === 's') setTi((v) => Math.max(0, v - 1))
      if (k === 'q') setNi((v) => Math.min(CANT.length - 1, v + 1))
      if (k === 'a') setNi((v) => Math.max(0, v - 1))
      if (k === 'c') setCat((v) => !v)
      if (k === 'r') reiniciar()
      if (ev.key === ' ') { ev.preventDefault(); setPausa((v) => !v) }
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  })

  const n0 = CANT[ni]
  const quedan = ps.current.filter((p) => p.t === 0).length
  const hechos = n0 - quedan
  const seg = (performance.now() - inicio.current) / 1000
  const h = historia.current
  const GW = 220, GH = 90, TMAX = 30
  const linea = h.map((p) => `${Math.min(1, p.t / TMAX) * GW},${GH - (p.n / n0) * GH}`).join(' ')
  const ahora = performance.now()

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-start justify-center gap-4">
        <svg viewBox={`-6 -6 ${W + 12} ${H + 12}`} className="w-full max-w-md rounded-xl bg-white" role="img" aria-label={`Reactor: quedan ${quedan} de ${n0} pares`}>
          <rect x="-3" y="-3" width={W + 6} height={H + 6} fill={cat ? '#f3f8ee' : '#fbfbfb'} stroke="#3a3a3a" strokeWidth="5" />
          {ps.current.map((p, k) => p.t === 2
            ? <g key={k}><circle cx={p.x - 4} cy={p.y} r={RA} fill="#3f6fb8" /><circle cx={p.x + 4} cy={p.y} r={RA} fill="#c43c3c" />{p.f && ahora - p.f < 400 && <circle cx={p.x} cy={p.y} r={16} fill="none" stroke="#f6b73c" strokeWidth="3" />}</g>
            : <circle key={k} cx={p.x} cy={p.y} r={RA} fill={p.t === 0 ? '#3f6fb8' : '#c43c3c'} />)}
        </svg>
        <div className="flex w-60 flex-col gap-2 text-sm">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-xl border bg-white p-1"><p className="text-xs font-bold opacity-70">TEMPERATURA (W/S)</p><p className="font-black">{TEMPS[ti]} K</p></div>
            <div className="rounded-xl border bg-white p-1"><p className="text-xs font-bold opacity-70">PARES A+B (Q/A)</p><p className="font-black">{n0}</p></div>
          </div>
          <button onClick={() => setCat((v) => !v)} className={`rounded-xl border-2 px-2 py-1 font-semibold ${cat ? 'border-green-700 bg-green-50' : 'bg-white'}`}>Catalizador (C): {cat ? 'sí' : 'no'}</button>
          <div className="rounded-xl border-2 border-[var(--acento)] bg-white p-2">
            <p className="font-semibold">Se formaron <b>{hechos}</b> AB en {Math.round(seg)} s</p>
            <svg viewBox={`-4 -4 ${GW + 8} ${GH + 18}`} className="mt-1 w-full">
              <line x1="0" y1={GH} x2={GW} y2={GH} stroke="#3a3a3a" /><line x1="0" y1="0" x2="0" y2={GH} stroke="#3a3a3a" />
              <polyline points={linea} fill="none" stroke="#3f6fb8" strokeWidth="2" />
              <text x={GW / 2} y={GH + 13} textAnchor="middle" fontSize="9">reactivo A que queda (30 s)</text>
            </svg>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setPausa((v) => !v)} className="rounded-full border bg-white px-4 py-1 text-sm font-semibold">{pausa ? 'Seguir' : 'Pausa'} (espacio)</button>
        <button onClick={() => reiniciar()} className="rounded-full border bg-white px-4 py-1 text-sm font-semibold">Reiniciar (R)</button>
      </div>
      <p className="max-w-xl text-center text-xs opacity-70">W/S temperatura · Q/A concentración · C catalizador · espacio pausa · R reinicia. A (azul) + B (rojo) → AB. Solo los choques con energía suficiente reaccionan (destello amarillo); los demás rebotan. Compara qué tan rápido baja la curva.</p>
    </div>
  )
}
