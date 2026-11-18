import { useCallback, useEffect, useState } from 'react'

// Explora (Química área 3, tema 1): calculadora de oxidación. Despeja el estado desconocido átomo por átomo.
// A/D cambian el compuesto, espacio muestra el paso siguiente, R vuelve a empezar.

type Parte = { sim: string; n: number; ox: number | null }
type Compuesto = { formula: string; nombre: string; partes: Parte[]; carga: number }

const C = (formula: string, nombre: string, carga: number, ...partes: Parte[]): Compuesto => ({ formula, nombre, partes, carga })
const P = (sim: string, n: number, ox: number | null): Parte => ({ sim, n, ox })

const LISTA: Compuesto[] = [
  C('H₂SO₄', 'ácido sulfúrico', 0, P('H', 2, 1), P('S', 1, null), P('O', 4, -2)),
  C('CO₂', 'dióxido de carbono', 0, P('C', 1, null), P('O', 2, -2)),
  C('HNO₃', 'ácido nítrico', 0, P('H', 1, 1), P('N', 1, null), P('O', 3, -2)),
  C('Fe₂O₃', 'óxido de hierro (III)', 0, P('Fe', 2, null), P('O', 3, -2)),
  C('NH₃', 'amoníaco', 0, P('N', 1, null), P('H', 3, 1)),
  C('CaCO₃', 'carbonato de calcio (cal)', 0, P('Ca', 1, 2), P('C', 1, null), P('O', 3, -2)),
  C('KMnO₄', 'permanganato de potasio', 0, P('K', 1, 1), P('Mn', 1, null), P('O', 4, -2)),
  C('K₂Cr₂O₇', 'dicromato de potasio', 0, P('K', 2, 1), P('Cr', 2, null), P('O', 7, -2)),
  C('SO₄²⁻', 'ion sulfato', -2, P('S', 1, null), P('O', 4, -2)),
  C('NH₄⁺', 'ion amonio', 1, P('N', 1, null), P('H', 4, 1)),
  C('NO₃⁻', 'ion nitrato', -1, P('N', 1, null), P('O', 3, -2)),
  C('PO₄³⁻', 'ion fosfato', -3, P('P', 1, null), P('O', 4, -2)),
]

const fmt = (v: number) => (v > 0 ? `+${v}` : v < 0 ? `−${-v}` : '0')
const COLOR: Record<string, string> = { H: '#eeeeee', O: '#f4b8b0', N: '#b8cdf0', C: '#cfcfcf', S: '#f2e39b', P: '#f6c89a', K: '#d9d2f0', Ca: '#d9d2f0', Fe: '#f6dcb4', Mn: '#f6dcb4', Cr: '#f6dcb4' }

export default function CalculadoraOxidacion() {
  const [k, setK] = useState(0)
  const [paso, setPaso] = useState(0)
  const c = LISTA[k]
  const conocidos = c.partes.filter((p) => p.ox !== null)
  const x = c.partes.find((p) => p.ox === null)!
  const suma = conocidos.reduce((s, p) => s + p.n * (p.ox as number), 0)
  const resultado = (c.carga - suma) / x.n
  const ultimo = conocidos.length + 2 // conocidos uno a uno, ecuación, resultado

  const cambiar = useCallback((d: number) => { setK((v) => (v + d + LISTA.length) % LISTA.length); setPaso(0) }, [])
  const avanzar = useCallback(() => setPaso((p) => Math.min(p + 1, ultimo)), [ultimo])

  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => {
      const t = ev.key.toLowerCase()
      if (t === 'a') cambiar(-1)
      if (t === 'd') cambiar(1)
      if (t === 'r') setPaso(0)
      if (ev.key === ' ') { ev.preventDefault(); avanzar() }
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [cambiar, avanzar])

  const visto = (p: Parte) => p.ox !== null && conocidos.indexOf(p) < paso
  const terminos = [...conocidos.map((p) => fmt(p.n * (p.ox as number))), x.n > 1 ? `${x.n}x` : 'x']
  const ecuacion = `${terminos.join(' + ').replace(/\+ −/g, '− ')} = ${fmt(c.carga)}`

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <button onClick={() => cambiar(-1)} className="rounded-full border bg-white px-3 py-1 text-sm font-semibold">← A</button>
        <div className="min-w-56 text-center"><p className="text-3xl font-black">{c.formula}</p><p className="text-sm opacity-70">{c.nombre} · {k + 1} de {LISTA.length}</p></div>
        <button onClick={() => cambiar(1)} className="rounded-full border bg-white px-3 py-1 text-sm font-semibold">D →</button>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {c.partes.map((p) => {
          const esX = p.ox === null
          return (
            <div key={p.sim} className={`w-32 rounded-xl border-2 p-2 text-center ${esX ? 'border-[var(--acento)]' : 'border-transparent'}`} style={{ background: COLOR[p.sim] ?? '#eee' }}>
              <p className="text-2xl font-black">{p.sim}{p.n > 1 && <sub>{p.n}</sub>}</p>
              {esX ? (
                <p className="text-lg font-bold" style={{ color: '#4f8a3c' }}>{paso >= ultimo ? fmt(resultado) : 'x = ?'}</p>
              ) : visto(p) ? (
                <p className="text-sm font-semibold">{p.n} × ({fmt(p.ox as number)}) = <b>{fmt(p.n * (p.ox as number))}</b></p>
              ) : <p className="text-lg font-bold opacity-40">?</p>}
            </div>
          )
        })}
      </div>
      <div className="min-h-16 rounded-xl border-2 border-[var(--acento)] bg-white px-4 py-2 text-center">
        {paso < conocidos.length && <p>Toca espacio para poner el estado de <b>{conocidos[paso].sim}</b> (tiene regla).</p>}
        {paso >= conocidos.length + 1 && <p className="text-xl font-bold">{ecuacion}</p>}
        {paso === conocidos.length && <p>Ya están los conocidos. Espacio: plantear que todo suma {c.carga === 0 ? 'cero (es neutro)' : `la carga del ion (${fmt(c.carga)})`}.</p>}
        {paso === conocidos.length + 1 && <p className="text-sm">Despeja x en tu cuaderno y luego toca espacio para comprobar.</p>}
        {paso >= ultimo && <p className="text-lg">El estado de oxidación de <b>{x.sim}</b> es <b style={{ color: '#4f8a3c' }}>{fmt(resultado)}</b>{x.n > 1 && ` (se dividió entre ${x.n})`}.</p>}
      </div>
      <div className="flex gap-2">
        <button onClick={avanzar} className="rounded-full bg-[var(--acento)] px-4 py-1 text-sm font-semibold text-white">Siguiente paso (espacio)</button>
        <button onClick={() => setPaso(0)} className="rounded-full border bg-white px-4 py-1 text-sm font-semibold">Reiniciar (R)</button>
      </div>
    </div>
  )
}
