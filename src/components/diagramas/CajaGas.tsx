import { useEffect, useRef, useState } from 'react'

// Explora (Química área 4, tema 1): caja de gas. Las partículas se aceleran o frenan con la temperatura y
// se cuentan los choques contra las paredes (eso es la presión). W/S temperatura, Q/A partículas,
// espacio pausa, R vuelve al estado inicial.

const W = 360, H = 240, R = 5
const TEMPS = [100, 150, 200, 250, 273, 300, 350, 400, 500, 600]
const CANT = [5, 10, 20, 30, 40, 60]
const REF_T = 300, REF_N = 20

type P = { x: number; y: number; vx: number; vy: number }

function nuevas(n: number, t: number, previas: P[] = []): P[] {
  const v = rapidez(t)
  return Array.from({ length: n }, (_, k) => {
    if (previas[k]) return previas[k]
    const a = Math.random() * Math.PI * 2
    return { x: R + Math.random() * (W - 2 * R), y: R + Math.random() * (H - 2 * R), vx: Math.cos(a) * v, vy: Math.sin(a) * v }
  })
}
// píxeles por segundo, proporcional a la raíz de la temperatura
const rapidez = (t: number) => 60 * Math.sqrt(t / 100)

export default function CajaGas() {
  const [ti, setTi] = useState(5)
  const [ni, setNi] = useState(2)
  const [pausa, setPausa] = useState(false)
  const [, setCuadro] = useState(0)
  const ps = useRef<P[]>(nuevas(CANT[2], TEMPS[5]))
  const golpes = useRef<number[]>([])
  const destellos = useRef<{ x: number; y: number; t: number }[]>([])
  const tRef = useRef(TEMPS[5])

  // cambiar la temperatura reescala las velocidades
  useEffect(() => {
    const f = Math.sqrt(TEMPS[ti] / tRef.current)
    ps.current.forEach((p) => { p.vx *= f; p.vy *= f })
    tRef.current = TEMPS[ti]
  }, [ti])
  useEffect(() => { ps.current = nuevas(CANT[ni], tRef.current, ps.current.slice(0, CANT[ni])) }, [ni])

  useEffect(() => {
    let raf = 0, antes = performance.now()
    const paso = (ahora: number) => {
      const dt = Math.min(0.05, (ahora - antes) / 1000)
      antes = ahora
      if (!pausa) {
        for (const p of ps.current) {
          p.x += p.vx * dt; p.y += p.vy * dt
          let choque = false
          if (p.x < R) { p.x = R; p.vx = Math.abs(p.vx); choque = true }
          if (p.x > W - R) { p.x = W - R; p.vx = -Math.abs(p.vx); choque = true }
          if (p.y < R) { p.y = R; p.vy = Math.abs(p.vy); choque = true }
          if (p.y > H - R) { p.y = H - R; p.vy = -Math.abs(p.vy); choque = true }
          if (choque) { golpes.current.push(ahora); destellos.current.push({ x: p.x, y: p.y, t: ahora }) }
        }
      }
      golpes.current = golpes.current.filter((g) => ahora - g < 2000)
      destellos.current = destellos.current.filter((d) => ahora - d.t < 250)
      setCuadro((c) => c + 1)
      raf = requestAnimationFrame(paso)
    }
    raf = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(raf)
  }, [pausa])

  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => {
      const t = ev.key.toLowerCase()
      if (t === 'w') setTi((v) => Math.min(TEMPS.length - 1, v + 1))
      if (t === 's') setTi((v) => Math.max(0, v - 1))
      if (t === 'q') setNi((v) => Math.min(CANT.length - 1, v + 1))
      if (t === 'a') setNi((v) => Math.max(0, v - 1))
      if (t === 'r') { setTi(5); setNi(2) }
      if (ev.key === ' ') { ev.preventDefault(); setPausa((v) => !v) }
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])

  const temp = TEMPS[ti], n = CANT[ni]
  // presión teórica relativa (P ∝ n·T a volumen fijo) y choques medidos por segundo
  const relativa = (n * temp) / (REF_N * REF_T)
  const choquesSeg = Math.round(golpes.current.length / 2)
  const vAire = Math.round(Math.sqrt((3 * 8.314 * temp) / 0.029))
  const calor = Math.min(1, (temp - 100) / 500)
  const color = `rgb(${Math.round(63 + 133 * calor)}, ${Math.round(111 - 51 * calor)}, ${Math.round(184 - 124 * calor)})`
  const ahora = performance.now()

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-start justify-center gap-4">
        <svg viewBox={`-6 -6 ${W + 12} ${H + 12}`} className="w-full max-w-md rounded-xl bg-white" role="img" aria-label={`Caja con ${n} partículas a ${temp} K`}>
          <rect x="-3" y="-3" width={W + 6} height={H + 6} fill="#fbfbfb" stroke="#3a3a3a" strokeWidth="6" />
          {destellos.current.map((d, k) => <circle key={k} cx={d.x} cy={d.y} r={11} fill="none" stroke="#c43c3c" strokeWidth="2" opacity={1 - (ahora - d.t) / 250} />)}
          {ps.current.map((p, k) => <circle key={k} cx={p.x} cy={p.y} r={R} fill={color} />)}
        </svg>
        <div className="flex w-56 flex-col gap-2 text-sm">
          <div className="rounded-xl border bg-white p-2">
            <p className="text-xs font-bold opacity-70">TEMPERATURA (W/S)</p>
            <p className="text-xl font-black">{temp} K <span className="text-sm font-semibold opacity-70">= {temp - 273} °C</span></p>
            <input type="range" min={0} max={TEMPS.length - 1} value={ti} onChange={(e) => setTi(+e.target.value)} className="w-full" aria-label="Temperatura" />
          </div>
          <div className="rounded-xl border bg-white p-2">
            <p className="text-xs font-bold opacity-70">PARTÍCULAS (Q/A)</p>
            <p className="text-xl font-black">{n}</p>
            <input type="range" min={0} max={CANT.length - 1} value={ni} onChange={(e) => setNi(+e.target.value)} className="w-full" aria-label="Número de partículas" />
          </div>
          <div className="rounded-xl border-2 border-[var(--acento)] bg-white p-2">
            <p className="text-xs font-bold opacity-70">PRESIÓN</p>
            <p className="font-semibold">Choques por segundo: <b>{choquesSeg}</b></p>
            <div className="mt-1 h-3 w-full rounded-full bg-gray-200"><div className="h-3 rounded-full bg-[var(--acento)]" style={{ width: `${Math.min(100, relativa * 25)}%` }} /></div>
            <p className="mt-1 text-xs">{relativa.toLocaleString('es-CO', { maximumFractionDigits: 2 })} veces la del inicio (20 partículas, 300 K)</p>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setPausa((v) => !v)} className="rounded-full border bg-white px-4 py-1 text-sm font-semibold">{pausa ? 'Seguir' : 'Pausa'} (espacio)</button>
        <button onClick={() => { setTi(5); setNi(2) }} className="rounded-full border bg-white px-4 py-1 text-sm font-semibold">Reiniciar (R)</button>
      </div>
      <p className="max-w-xl text-center text-sm">A {temp} K, las moléculas del aire van en promedio a unos <b>{vAire.toLocaleString('es-CO')} m/s</b>{vAire > 340 ? ', más rápido que el sonido' : ''}.</p>
      <p className="max-w-xl text-center text-xs opacity-70">W/S temperatura · Q/A partículas · espacio pausa · R reinicia. Más calor → más rápido → más choques. Más partículas → más choques. En la caja real son billones de billones; aquí van muy despacio para poder verlas.</p>
    </div>
  )
}
