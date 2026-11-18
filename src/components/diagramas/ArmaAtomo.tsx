import { useEffect, useState } from 'react'

// Explora (Química área 2, tema 2): armar átomos. El estudiante agrega o quita protones, neutrones y
// electrones; la app dice qué elemento es, su carga, su notación y si el núcleo es estable (Z de 1 a 20).

const ELEMENTOS = ['', 'Hidrógeno', 'Helio', 'Litio', 'Berilio', 'Boro', 'Carbono', 'Nitrógeno', 'Oxígeno', 'Flúor', 'Neón',
  'Sodio', 'Magnesio', 'Aluminio', 'Silicio', 'Fósforo', 'Azufre', 'Cloro', 'Argón', 'Potasio', 'Calcio']
const SIMBOLOS = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca']
/** Números de neutrones de los isótopos estables (o casi) de cada elemento. */
const ESTABLES: number[][] = [[], [0, 1], [1, 2], [3, 4], [5], [5, 6], [6, 7], [7, 8], [8, 9, 10], [10], [10, 11, 12],
  [12], [12, 13, 14], [14], [14, 15, 16], [16], [16, 17, 18, 20], [18, 20], [18, 20, 22], [20, 22], [20, 22, 23, 24, 26, 28]]
const CAPAS = [2, 8, 8, 8]
const MAX = { p: 20, n: 30, e: 22 }

function nucleo(p: number, n: number) {
  // intercala protones y neutrones para que se vean mezclados
  const tipos: boolean[] = []
  for (let k = 0; k < Math.max(p, n); k++) {
    if (k < p) tipos.push(true)
    if (k < n) tipos.push(false)
  }
  return tipos.map((esP, k) => {
    const a = k * 2.399
    const r = 5.5 * Math.sqrt(k)
    return { x: r * Math.cos(a), y: r * Math.sin(a), esP }
  })
}

export default function ArmaAtomo() {
  const [c, setC] = useState({ p: 6, n: 6, e: 6 })
  const cambia = (k: 'p' | 'n' | 'e', d: number) => setC((v) => ({ ...v, [k]: Math.max(0, Math.min(MAX[k], v[k] + d)) }))

  useEffect(() => {
    const teclas: Record<string, ['p' | 'n' | 'e', number]> = { q: ['p', 1], a: ['p', -1], w: ['n', 1], s: ['n', -1], e: ['e', 1], d: ['e', -1] }
    const alTeclear = (ev: KeyboardEvent) => {
      const t = teclas[ev.key.toLowerCase()]
      if (t) cambia(t[0], t[1])
      if (ev.key.toLowerCase() === 'r') setC({ p: 6, n: 6, e: 6 })
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])

  const { p, n, e } = c
  const carga = p - e
  const A = p + n
  const sim = SIMBOLOS[p] ?? ''
  const nombre = p === 0 ? 'Sin protones no hay elemento' : ELEMENTOS[p]
  const estable = p > 0 && ESTABLES[p].includes(n)
  const signo = carga === 0 ? '' : `${Math.abs(carga) > 1 ? Math.abs(carga) : ''}${carga > 0 ? '+' : '−'}`
  const tipo = p === 0 ? '' : carga === 0 ? 'átomo neutro' : carga > 0 ? `catión (perdió ${carga} e⁻)` : `anión (ganó ${-carga} e⁻)`

  // electrones repartidos en capas 2, 8, 8…
  const puntos: { x: number; y: number }[] = []
  let quedan = e
  CAPAS.forEach((cap, ci) => {
    const m = Math.min(cap, quedan)
    quedan -= m
    for (let k = 0; k < m; k++) {
      const ang = (k / cap) * Math.PI * 2 - Math.PI / 2 + ci * 0.3
      puntos.push({ x: (52 + ci * 30) * Math.cos(ang), y: (52 + ci * 30) * Math.sin(ang) })
    }
  })

  const fila = (k: 'p' | 'n' | 'e', nombreP: string, color: string, mas: string, menos: string) => (
    <div className="flex items-center justify-between gap-2 rounded-xl border bg-white px-3 py-2">
      <span className="text-sm font-semibold" style={{ color }}>● {nombreP}: {c[k]}</span>
      <span className="flex gap-1">
        <button onClick={() => cambia(k, -1)} className="h-9 w-12 rounded-full border text-sm font-bold" title={`tecla ${menos}`}>− {menos}</button>
        <button onClick={() => cambia(k, 1)} className="h-9 w-12 rounded-full bg-[var(--acento)] text-sm font-bold text-white" title={`tecla ${mas}`}>+ {mas}</button>
      </span>
    </div>
  )

  return (
    <div data-diagrama className="grid items-center gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <svg viewBox="-160 -160 320 320" role="img" aria-label={`${nombre}: ${p} protones, ${n} neutrones, ${e} electrones`} className="mx-auto w-full max-w-md">
        <rect x="-160" y="-160" width="320" height="320" rx="16" fill="#eef3f7" />
        {CAPAS.map((_, ci) => <circle key={ci} r={52 + ci * 30} fill="none" stroke="#c9d2dc" strokeDasharray="3 4" />)}
        {nucleo(p, n).map((b, k) => <circle key={k} cx={b.x} cy={b.y} r="5.5" fill={b.esP ? '#c43c3c' : '#8c8c8c'} stroke="#fff" strokeWidth="0.8" />)}
        {puntos.map((q, k) => <circle key={k} cx={q.x} cy={q.y} r="5" fill="#3f6fb8" />)}
      </svg>
      <div className="flex flex-col gap-2">
        {fila('p', 'Protones', '#c43c3c', 'Q', 'A')}
        {fila('n', 'Neutrones', '#666', 'W', 'S')}
        {fila('e', 'Electrones', '#3f6fb8', 'E', 'D')}
        <div className="rounded-xl border-2 border-[var(--acento)] bg-white p-3 text-center">
          <p className="text-xl font-bold">{nombre}</p>
          {p > 0 && (
            <>
              <p className="my-1 font-mono text-2xl">
                <sup>{A}</sup><sub className="text-[#c43c3c]">{p}</sub>{sim}<sup>{signo}</sup>
              </p>
              <p className="text-sm">Z = {p} · A = {A} · carga {carga > 0 ? '+' : ''}{carga} · {tipo}</p>
              <p className={`mt-1 text-sm font-semibold ${estable ? 'text-[#4f8a3c]' : 'text-[#c43c3c]'}`}>
                {estable ? '✔ Núcleo estable' : n === 0 && p > 1 ? '✘ Sin neutrones, los protones se repelen: no existe' : '✘ Núcleo inestable: sería radiactivo o no existe'}
              </p>
            </>
          )}
        </div>
        <p className="text-xs opacity-70">Reto: arma el oxígeno-16, luego un ion O²⁻ y después el carbono-14. R vuelve al carbono-12.</p>
      </div>
    </div>
  )
}
