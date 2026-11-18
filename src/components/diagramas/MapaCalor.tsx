import { useEffect, useMemo, useState } from 'react'
import { ELEMENTOS } from '../../lib/elementos.ts'
import { RADIO, IONIZACION, ELECTRONEGATIVIDAD, AFINIDAD } from '../../lib/propiedades.ts'

// Explora (Química área 2, tema 5): la tabla periódica como mapa de calor de una propiedad.
// Teclas 1–4 cambian la propiedad, T muestra las flechas de tendencia, las flechas recorren la tabla.

type Prop = 'radio' | 'ionizacion' | 'en' | 'afinidad'
const PROPS: { id: Prop; nombre: string; unidad: string; datos: Record<string, number>; sube: string; derecha: string }[] = [
  { id: 'radio', nombre: 'Radio atómico', unidad: 'pm', datos: RADIO, sube: 'Aumenta hacia abajo', derecha: 'Disminuye hacia la derecha' },
  { id: 'ionizacion', nombre: 'Energía de ionización', unidad: 'kJ/mol', datos: IONIZACION, sube: 'Disminuye hacia abajo', derecha: 'Aumenta hacia la derecha' },
  { id: 'en', nombre: 'Electronegatividad', unidad: '(Pauling)', datos: ELECTRONEGATIVIDAD, sube: 'Disminuye hacia abajo', derecha: 'Aumenta hacia la derecha' },
  { id: 'afinidad', nombre: 'Afinidad electrónica (11°)', unidad: 'kJ/mol', datos: AFINIDAD, sube: 'En general disminuye hacia abajo', derecha: 'En general aumenta hacia la derecha (con excepciones)' },
]

function color(t: number) {
  // de amarillo claro (bajo) a rojo oscuro (alto)
  const a = [255, 244, 200], b = [178, 34, 52]
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * t)).join(',')})`
}

export default function MapaCalor() {
  const [p, setP] = useState(0)
  const [tend, setTend] = useState(false)
  const [sel, setSel] = useState(11)
  const porPos = useMemo(() => new Map(ELEMENTOS.map((e) => [`${e.fila}-${e.col}`, e])), [])
  const prop = PROPS[p]
  const valores = Object.values(prop.datos)
  const min = Math.min(...valores), max = Math.max(...valores)

  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => {
      const n = Number(ev.key)
      if (n >= 1 && n <= 4) { setP(n - 1); return }
      if (ev.key.toLowerCase() === 't') { setTend((v) => !v); return }
      const d = { ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowDown: [1, 0], ArrowUp: [-1, 0] }[ev.key]
      if (!d) return
      ev.preventDefault()
      setSel((z) => {
        const e = ELEMENTOS[z - 1]
        let [f, c] = [e.fila, e.col]
        for (let paso = 0; paso < 20; paso++) {
          f += d[0]; c += d[1]
          if (f < 1 || f > 7 || c < 1 || c > 18) return z
          const o = porPos.get(`${f}-${c}`)
          if (o) return o.z
        }
        return z
      })
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [porPos])

  const e = ELEMENTOS[sel - 1]
  const v = prop.datos[e.s]

  return (
    <div data-diagrama className="flex flex-col gap-3">
      <div className="flex flex-wrap justify-center gap-2">
        {PROPS.map((q, k) => (
          <button key={q.id} onClick={() => setP(k)} className={`rounded-full border px-3 py-1 text-sm font-semibold ${p === k ? 'bg-[var(--acento)] text-white' : 'bg-white'}`}>{k + 1} · {q.nombre}</button>
        ))}
        <button onClick={() => setTend((t) => !t)} className={`rounded-full border px-3 py-1 text-sm font-semibold ${tend ? 'bg-[#3a3a3a] text-white' : 'bg-white'}`}>T · Tendencias</button>
      </div>
      <div className="relative overflow-x-auto">
        <div className="mx-auto grid min-w-[760px] max-w-5xl gap-[3px]" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
          {ELEMENTOS.filter((el) => el.fila <= 7).map((el) => {
            const x = prop.datos[el.s]
            const t = x === undefined ? null : (x - min) / (max - min || 1)
            return (
              <button key={el.z} onClick={() => setSel(el.z)} title={el.n}
                className={`flex aspect-square flex-col items-center justify-center rounded border leading-none ${el.z === sel ? 'ring-2 ring-[#3a3a3a]' : ''}`}
                style={{ gridRow: el.fila, gridColumn: el.col, background: t === null ? '#f3f3f3' : color(t), color: t !== null && t > 0.6 ? '#fff' : '#3a3a3a', borderColor: '#0002' }}>
                <span className="text-sm font-bold">{el.s}</span>
                {x !== undefined && <span className="text-[8px]">{x}</span>}
              </button>
            )
          })}
        </div>
        {tend && (
          <svg viewBox="0 0 180 70" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 mx-auto h-full w-full min-w-[760px] max-w-5xl">
            <defs><marker id="mc-f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#1f4f9a" /></marker></defs>
            <line x1="20" y1="64" x2="165" y2="64" stroke="#1f4f9a" strokeWidth="1.2" markerEnd="url(#mc-f)" vectorEffect="non-scaling-stroke" />
            <line x1="4" y1="8" x2="4" y2="66" stroke="#1f4f9a" strokeWidth="1.2" markerEnd="url(#mc-f)" vectorEffect="non-scaling-stroke" />
          </svg>
        )}
      </div>
      {tend && <p className="text-center text-sm font-semibold text-[#1f4f9a]">→ {prop.derecha} · ↓ {prop.sube}</p>}
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div className="flex items-center gap-2 text-xs">
          <span>bajo</span>
          <span className="h-3 flex-1 rounded" style={{ background: `linear-gradient(90deg, ${color(0)}, ${color(0.5)}, ${color(1)})` }} />
          <span>alto</span>
        </div>
        <div className="rounded-xl border-2 border-[var(--acento)] bg-white p-3">
          <p className="text-lg font-bold">{e.z} · {e.n} ({e.s})</p>
          <p className="text-sm">{prop.nombre}: {v === undefined ? 'sin dato' : `${v} ${prop.unidad}`}{prop.id === 'afinidad' && v === 0 ? ' (no forma un anión estable)' : ''}</p>
        </div>
      </div>
      <p className="text-center text-xs opacity-70">Valores aproximados. Teclas 1–4: propiedad · T: tendencias · flechas: recorrer la tabla. Los lantánidos y actínidos no se muestran.</p>
    </div>
  )
}
