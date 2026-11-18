import { useEffect, useState } from 'react'

// Explora (Química área 2, tema 6): armar estructuras de Lewis. El estudiante elige una molécula (A/D) y
// decide cuántos pares comparte cada enlace (clic en el enlace o teclas Q, W, E, R). Los electrones que
// sobran se reparten como pares libres y la app revisa si cada átomo cumple el octeto (el H, el dueto).

type At = { s: string; x: number; y: number }
type Mol = { nombre: string; formula: string; atomos: At[]; enlaces: [number, number][]; solucion: number[] }
const VAL: Record<string, number> = { H: 1, C: 4, N: 5, O: 6, Cl: 7 }
const MOLS: Mol[] = [
  { nombre: 'Hidrógeno', formula: 'H₂', atomos: [{ s: 'H', x: 110, y: 100 }, { s: 'H', x: 190, y: 100 }], enlaces: [[0, 1]], solucion: [1] },
  { nombre: 'Cloro', formula: 'Cl₂', atomos: [{ s: 'Cl', x: 110, y: 100 }, { s: 'Cl', x: 190, y: 100 }], enlaces: [[0, 1]], solucion: [1] },
  { nombre: 'Cloruro de hidrógeno', formula: 'HCl', atomos: [{ s: 'H', x: 110, y: 100 }, { s: 'Cl', x: 190, y: 100 }], enlaces: [[0, 1]], solucion: [1] },
  { nombre: 'Agua', formula: 'H₂O', atomos: [{ s: 'O', x: 150, y: 85 }, { s: 'H', x: 90, y: 140 }, { s: 'H', x: 210, y: 140 }], enlaces: [[0, 1], [0, 2]], solucion: [1, 1] },
  { nombre: 'Amoníaco', formula: 'NH₃', atomos: [{ s: 'N', x: 150, y: 80 }, { s: 'H', x: 80, y: 135 }, { s: 'H', x: 150, y: 160 }, { s: 'H', x: 220, y: 135 }], enlaces: [[0, 1], [0, 2], [0, 3]], solucion: [1, 1, 1] },
  { nombre: 'Metano', formula: 'CH₄', atomos: [{ s: 'C', x: 150, y: 100 }, { s: 'H', x: 150, y: 30 }, { s: 'H', x: 75, y: 100 }, { s: 'H', x: 225, y: 100 }, { s: 'H', x: 150, y: 170 }], enlaces: [[0, 1], [0, 2], [0, 3], [0, 4]], solucion: [1, 1, 1, 1] },
  { nombre: 'Oxígeno', formula: 'O₂', atomos: [{ s: 'O', x: 110, y: 100 }, { s: 'O', x: 190, y: 100 }], enlaces: [[0, 1]], solucion: [2] },
  { nombre: 'Nitrógeno', formula: 'N₂', atomos: [{ s: 'N', x: 110, y: 100 }, { s: 'N', x: 190, y: 100 }], enlaces: [[0, 1]], solucion: [3] },
  { nombre: 'Dióxido de carbono', formula: 'CO₂', atomos: [{ s: 'O', x: 65, y: 100 }, { s: 'C', x: 150, y: 100 }, { s: 'O', x: 235, y: 100 }], enlaces: [[0, 1], [1, 2]], solucion: [2, 2] },
  { nombre: 'Cianuro de hidrógeno', formula: 'HCN', atomos: [{ s: 'H', x: 65, y: 100 }, { s: 'C', x: 150, y: 100 }, { s: 'N', x: 235, y: 100 }], enlaces: [[0, 1], [1, 2]], solucion: [1, 3] },
]
const TECLAS = ['q', 'w', 'e', 'r']
const DIRS: [number, number][] = [[0, -1], [1, 0], [0, 1], [-1, 0], [0.7, -0.7], [0.7, 0.7], [-0.7, 0.7], [-0.7, -0.7]]

function analizar(m: Mol, ord: number[]) {
  const total = m.atomos.reduce((a, t) => a + VAL[t.s], 0)
  const enl = m.atomos.map((_, i) => m.enlaces.reduce((a, [p, q], k) => a + (p === i || q === i ? ord[k] : 0), 0))
  let resto = total - 2 * ord.reduce((a, b) => a + b, 0)
  const pares = m.atomos.map(() => 0)
  if (resto >= 0) {
    // primero los átomos de los extremos (sin contar H), luego los centrales
    const orden = m.atomos.map((_, i) => i).sort((a, b) => enl[a] - enl[b])
    for (const i of orden) {
      if (m.atomos[i].s === 'H') continue
      const falta = Math.max(0, (8 - 2 * enl[i]) / 2)
      const dar = Math.min(falta, Math.floor(resto / 2))
      pares[i] += dar
      resto -= 2 * dar
    }
  }
  const cuenta = m.atomos.map((_, i) => 2 * enl[i] + 2 * pares[i])
  const meta = m.atomos.map((t) => (t.s === 'H' ? 2 : 8))
  return { total, resto, pares, enl, cuenta, meta, ok: resto === 0 && cuenta.every((c, i) => c === meta[i]) }
}

export default function ArmaLewis() {
  const [k, setK] = useState(3)
  const [ord, setOrd] = useState<number[]>(MOLS[3].enlaces.map(() => 1))
  const m = MOLS[k]
  const elegir = (n: number) => { setK(n); setOrd(MOLS[n].enlaces.map(() => 1)) }
  const ciclar = (e: number) => setOrd((o) => o.map((v, i) => (i === e ? (v % 3) + 1 : v)))

  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => {
      const t = ev.key.toLowerCase()
      if (t === 'd') elegir((k + 1) % MOLS.length)
      if (t === 'a') elegir((k - 1 + MOLS.length) % MOLS.length)
      const e = TECLAS.indexOf(t)
      if (e >= 0 && e < m.enlaces.length) ciclar(e)
      if (t === 's') setOrd(m.solucion)
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  })

  const r = analizar(m, ord)

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <button onClick={() => elegir((k - 1 + MOLS.length) % MOLS.length)} className="h-10 rounded-full border bg-white px-3 text-sm font-semibold">← (A)</button>
        <div className="text-center"><p className="text-xl font-bold">{m.formula}</p><p className="text-sm">{m.nombre}</p></div>
        <button onClick={() => elegir((k + 1) % MOLS.length)} className="h-10 rounded-full border bg-white px-3 text-sm font-semibold">(D) →</button>
      </div>
      <svg viewBox="0 0 300 200" role="img" aria-label={`Estructura de Lewis de ${m.formula}`} className="mx-auto w-full max-w-lg">
        <rect width="300" height="200" rx="14" fill="#f4f1ea" />
        {m.enlaces.map(([p, q], e) => {
          const a = m.atomos[p], b = m.atomos[q]
          const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy)
          const nx = -dy / L, ny = dx / L
          const ux = dx / L, uy = dy / L
          return (
            <g key={e} onClick={() => ciclar(e)} style={{ cursor: 'pointer' }}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="transparent" strokeWidth="22" />
              {Array.from({ length: ord[e] }, (_, j) => {
                const off = (j - (ord[e] - 1) / 2) * 6
                return <line key={j} x1={a.x + ux * 16 + nx * off} y1={a.y + uy * 16 + ny * off} x2={b.x - ux * 16 + nx * off} y2={b.y - uy * 16 + ny * off} stroke="#3a3a3a" strokeWidth="2.5" />
              })}
              <text x={(a.x + b.x) / 2 + nx * 16} y={(a.y + b.y) / 2 + ny * 16 + 4} textAnchor="middle" fontSize="9" fontWeight="700" fill="#3f6fb8">{TECLAS[e]?.toUpperCase()}</text>
            </g>
          )
        })}
        {m.atomos.map((t, i) => {
          const vecinos = m.enlaces.filter(([p, q]) => p === i || q === i).map(([p, q]) => m.atomos[p === i ? q : p])
          const libres = DIRS.filter(([dx, dy]) => vecinos.every((v) => {
            const vx = v.x - t.x, vy = v.y - t.y, L = Math.hypot(vx, vy)
            return (vx * dx + vy * dy) / L < 0.6
          })).slice(0, r.pares[i])
          const bien = r.cuenta[i] === r.meta[i]
          return (
            <g key={i}>
              <circle cx={t.x} cy={t.y} r="14" fill={bien ? '#e3f1dc' : '#fde3d6'} stroke={bien ? '#4f8a3c' : '#c43c3c'} strokeWidth="1.5" />
              <text x={t.x} y={t.y + 5} textAnchor="middle" fontSize="14" fontWeight="800">{t.s}</text>
              {libres.map(([dx, dy], j) => {
                const cx = t.x + dx * 22, cy = t.y + dy * 22
                return <g key={j}><circle cx={cx - dy * 3.5} cy={cy + dx * 3.5} r="2.2" fill="#3f6fb8" /><circle cx={cx + dy * 3.5} cy={cy - dx * 3.5} r="2.2" fill="#3f6fb8" /></g>
              })}
            </g>
          )
        })}
      </svg>
      <div className="rounded-xl border-2 border-[var(--acento)] bg-white px-4 py-2 text-center text-sm">
        <p>Electrones de valencia en total: <b>{r.total}</b> · en enlaces: <b>{2 * ord.reduce((a, b) => a + b, 0)}</b> · en pares libres: <b>{r.pares.reduce((a, b) => a + 2 * b, 0)}</b></p>
        {r.resto < 0 && <p className="font-semibold text-[#c43c3c]">✘ Usaste más electrones de los que hay. Quita un enlace.</p>}
        {r.resto > 0 && <p className="font-semibold text-[#c43c3c]">✘ Sobran {r.resto} electrones que no caben: algún átomo necesita compartir más (enlace doble o triple).</p>}
        {r.resto === 0 && !r.ok && <p className="font-semibold text-[#c43c3c]">✘ Algún átomo (en rojo) no completa su octeto: prueba con otro tipo de enlace.</p>}
        {r.ok && <p className="font-semibold text-[#4f8a3c]">✔ ¡Todos cumplen! Cada átomo tiene 8 electrones (el hidrógeno, 2).</p>}
      </div>
      <p className="max-w-xl text-center text-xs opacity-70">Toca un enlace (o Q, W, E, R) para cambiarlo: sencillo → doble → triple. S muestra la solución. A/D cambia de molécula.</p>
    </div>
  )
}
