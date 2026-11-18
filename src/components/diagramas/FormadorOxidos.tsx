import { useEffect, useState } from 'react'

// Explora (Química área 3, tema 2): fábrica de óxidos e hidróxidos. Se elige el elemento (A/D) y su estado
// (W/S); la app cruza las cargas, simplifica y da los tres nombres. H cambia a hidróxido (solo metales).

type El = { sim: string; nombre: string; metal: boolean; estados: number[]; trad: string[] }
const EL: El[] = [
  { sim: 'Na', nombre: 'sodio', metal: true, estados: [1], trad: ['de sodio'] },
  { sim: 'K', nombre: 'potasio', metal: true, estados: [1], trad: ['de potasio'] },
  { sim: 'Ca', nombre: 'calcio', metal: true, estados: [2], trad: ['de calcio'] },
  { sim: 'Mg', nombre: 'magnesio', metal: true, estados: [2], trad: ['de magnesio'] },
  { sim: 'Al', nombre: 'aluminio', metal: true, estados: [3], trad: ['de aluminio'] },
  { sim: 'Fe', nombre: 'hierro', metal: true, estados: [2, 3], trad: ['ferroso', 'férrico'] },
  { sim: 'Cu', nombre: 'cobre', metal: true, estados: [1, 2], trad: ['cuproso', 'cúprico'] },
  { sim: 'Pb', nombre: 'plomo', metal: true, estados: [2, 4], trad: ['plumboso', 'plúmbico'] },
  { sim: 'C', nombre: 'carbono', metal: false, estados: [2, 4], trad: ['carbonoso', 'carbónico'] },
  { sim: 'S', nombre: 'azufre', metal: false, estados: [4, 6], trad: ['sulfuroso', 'sulfúrico'] },
  { sim: 'N', nombre: 'nitrógeno', metal: false, estados: [3, 5], trad: ['nitroso', 'nítrico'] },
  { sim: 'P', nombre: 'fósforo', metal: false, estados: [3, 5], trad: ['fosforoso', 'fosfórico'] },
  { sim: 'Cl', nombre: 'cloro', metal: false, estados: [1, 3, 5, 7], trad: ['hipocloroso', 'cloroso', 'clórico', 'perclórico'] },
]
const ROMANO = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
const PRE = ['', 'mono', 'di', 'tri', 'tetra', 'penta', 'hexa', 'hepta']
const OXIDO = ['', 'monóxido', 'dióxido', 'trióxido', 'tetróxido', 'pentóxido', 'hexóxido', 'heptóxido']
const SUB = '₀₁₂₃₄₅₆₇₈₉'
const sub = (n: number) => (n === 1 ? '' : String(n).split('').map((d) => SUB[+d]).join(''))
const mcd = (a: number, b: number): number => (b ? mcd(b, a % b) : a)

export default function FormadorOxidos() {
  const [k, setK] = useState(5)
  const [e, setE] = useState(1)
  const [hidro, setHidro] = useState(false)
  const el = EL[k]
  const est = Math.min(e, el.estados.length - 1)
  const ox = el.estados[est]
  const esHidro = hidro && el.metal

  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => {
      const t = ev.key.toLowerCase()
      if (t === 'a') { setK((v) => (v + EL.length - 1) % EL.length); setE(0) }
      if (t === 'd') { setK((v) => (v + 1) % EL.length); setE(0) }
      if (t === 'w') setE((v) => v + 1)
      if (t === 's') setE((v) => Math.max(0, v - 1))
      if (t === 'h') setHidro((v) => !v)
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])

  // fórmula: cruzar y simplificar
  const d = esHidro ? 1 : mcd(ox, 2)
  const nEl = esHidro ? 1 : 2 / d
  const nO = esHidro ? ox : ox / d
  const formula = esHidro ? `${el.sim}${ox === 1 ? 'OH' : `(OH)${sub(ox)}`}` : `${el.sim}${sub(nEl)}O${sub(nO)}`
  const varios = el.estados.length > 1
  const palabra = esHidro ? 'hidróxido' : el.metal ? 'óxido' : 'anhídrido'
  const sistematico = esHidro
    ? `${ox > 1 ? PRE[ox] : ''}hidróxido de ${el.nombre}`
    : `${OXIDO[nO]} de ${nEl > 1 ? PRE[nEl] : ''}${el.nombre}`
  const stock = `${esHidro ? 'hidróxido' : 'óxido'} de ${el.nombre}${varios ? ` (${ROMANO[ox]})` : ''}`
  const tradicional = `${palabra} ${el.trad[est]}`

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-1">
        {EL.map((x, j) => (
          <button key={x.sim} onClick={() => { setK(j); setE(0) }} className={`w-11 rounded-lg border py-1 text-sm font-bold ${k === j ? 'bg-[var(--acento)] text-white' : x.metal ? 'bg-[#ece7f8]' : 'bg-[#e3f0d6]'}`}>{x.sim}</button>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
        <span className="opacity-70">Estado (W/S):</span>
        {el.estados.map((s, j) => (
          <button key={s} onClick={() => setE(j)} className={`rounded-full border px-3 py-1 font-semibold ${est === j ? 'bg-[var(--acento)] text-white' : 'bg-white'}`}>+{s}</button>
        ))}
        <button onClick={() => setHidro((v) => !v)} disabled={!el.metal} className={`rounded-full border px-3 py-1 font-semibold disabled:opacity-40 ${esHidro ? 'bg-[var(--acento)] text-white' : 'bg-white'}`}>
          {esHidro ? 'Hidróxido (H)' : 'Óxido (H cambia)'}
        </button>
      </div>
      <div className="grid w-full max-w-3xl items-center gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-white p-4 text-center">
          <p className="text-lg"><b>{el.sim}</b><sup className="text-[var(--acento)]">+{ox}</sup> + {esHidro ? <>OH<sup>−</sup></> : <>O<sup>2−</sup></>}</p>
          <p className="my-2 text-5xl font-black">{formula}</p>
          <p className="text-sm opacity-70">
            {esHidro ? `Un OH por cada carga del metal: ${ox}.` : `Cruzar: ${el.sim}${sub(2)}O${sub(ox)}${d > 1 ? ` → se simplifica entre ${d}` : ''}.`}
          </p>
          <p className="text-sm opacity-70">{el.metal ? (esHidro ? 'Es una base.' : 'Metal → óxido básico.') : 'No metal → óxido ácido.'}</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="rounded-xl border-2 bg-white px-3 py-2"><p className="text-xs font-bold opacity-60">SISTEMÁTICO</p><p className="text-lg font-semibold">{sistematico}</p></div>
          <div className="rounded-xl border-2 bg-white px-3 py-2"><p className="text-xs font-bold opacity-60">STOCK</p><p className="text-lg font-semibold">{stock}</p></div>
          <div className="rounded-xl border-2 bg-white px-3 py-2"><p className="text-xs font-bold opacity-60">TRADICIONAL</p><p className="text-lg font-semibold">{tradicional}</p></div>
        </div>
      </div>
      <p className="max-w-xl text-center text-xs opacity-70">A/D: elemento · W/S: estado de oxidación · H: óxido o hidróxido. A los óxidos de no metales, en el sistema tradicional, se les dice anhídridos.</p>
    </div>
  )
}
