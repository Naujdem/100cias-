import { useEffect, useState } from 'react'

// Explora (Química área 3, tema 8): la cocina del reactivo límite. Se elige una receta (N), la cantidad del
// primer reactivo (Q/A) y del segundo (W/S). Se arman tantas «recetas» como alcance el que se acaba primero.

type Receta = { nombre: string; r: [string, number, string][]; p: [string, number, string][] }
const RECETAS: Receta[] = [
  { nombre: 'Sánduches', r: [['pan', 2, '🍞'], ['queso', 1, '🧀']], p: [['sánduche', 1, '🥪']] },
  { nombre: 'Agua', r: [['H₂', 2, '⚪'], ['O₂', 1, '🔴']], p: [['H₂O', 2, '💧']] },
  { nombre: 'Amoníaco (abonos)', r: [['N₂', 1, '🔵'], ['H₂', 3, '⚪']], p: [['NH₃', 2, '🌱']] },
  { nombre: 'Sulfuro de hierro', r: [['Fe', 1, '🔩'], ['S', 1, '🟡']], p: [['FeS', 1, '⬛']] },
  { nombre: 'Gas de la estufa', r: [['CH₄', 1, '🔥'], ['O₂', 2, '🔴']], p: [['CO₂', 1, '💨'], ['H₂O', 2, '💧']] },
]

export default function ReactivoLimite() {
  const [k, setK] = useState(0)
  const [a, setA] = useState(10)
  const [b, setB] = useState(3)
  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => {
      const t = ev.key.toLowerCase()
      if (t === 'n') setK((v) => (v + 1) % RECETAS.length)
      if (t === 'q') setA((v) => Math.min(20, v + 1))
      if (t === 'a') setA((v) => Math.max(0, v - 1))
      if (t === 'w') setB((v) => Math.min(20, v + 1))
      if (t === 's') setB((v) => Math.max(0, v - 1))
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])
  const R = RECETAS[k]
  const [ra, rb] = R.r
  const nA = a / ra[1], nB = b / rb[1]
  const veces = Math.floor(Math.min(nA, nB))
  const usaA = veces * ra[1], usaB = veces * rb[1]
  const limite = nA < nB ? ra[0] : nB < nA ? rb[0] : null
  const fila = (n: number, usados: number, e: string) => (
    <div className="flex max-w-xs flex-wrap gap-0.5 text-2xl">
      {Array.from({ length: n }, (_, j) => <span key={j} style={{ opacity: j < usados ? 0.25 : 1, transition: 'opacity .5s' }}>{e}</span>)}
    </div>
  )
  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-1">
        {RECETAS.map((x, j) => <button key={x.nombre} onClick={() => setK(j)} className={`rounded-full border px-3 py-1 text-sm font-semibold ${k === j ? 'bg-[var(--acento)] text-white' : 'bg-white'}`}>{x.nombre}</button>)}
      </div>
      <p className="text-xl font-bold">
        {R.r.map(([n, c], j) => <span key={n}>{j > 0 && ' + '}{c > 1 ? c : ''} {n}</span>)} →{' '}
        {R.p.map(([n, c], j) => <span key={n}>{j > 0 && ' + '}{c > 1 ? c : ''} {n}</span>)}
      </p>
      <div className="grid w-full max-w-4xl gap-3 md:grid-cols-3">
        <div className="rounded-xl bg-white p-3">
          <p className="mb-1 text-sm font-bold">{ra[0]}: {a} <span className="font-normal opacity-60">(Q/A)</span></p>
          <input type="range" min={0} max={20} value={a} onChange={(e) => setA(+e.target.value)} className="w-full" />
          {fila(a, usaA, ra[2])}
          <p className="mt-1 text-xs">alcanza para {nA.toLocaleString('es-CO', { maximumFractionDigits: 2 })} recetas</p>
        </div>
        <div className="rounded-xl bg-white p-3">
          <p className="mb-1 text-sm font-bold">{rb[0]}: {b} <span className="font-normal opacity-60">(W/S)</span></p>
          <input type="range" min={0} max={20} value={b} onChange={(e) => setB(+e.target.value)} className="w-full" />
          {fila(b, usaB, rb[2])}
          <p className="mt-1 text-xs">alcanza para {nB.toLocaleString('es-CO', { maximumFractionDigits: 2 })} recetas</p>
        </div>
        <div className="rounded-xl bg-white p-3">
          <p className="mb-1 text-sm font-bold">Se forma ({veces} {veces === 1 ? 'receta' : 'recetas'})</p>
          {R.p.map(([n, c, e]) => <div key={n}><p className="text-xs">{veces * c} {n}</p>{fila(veces * c, 0, e)}</div>)}
        </div>
      </div>
      <div className="rounded-xl border-2 border-[var(--acento)] bg-white px-4 py-2 text-center">
        {limite
          ? <p className="text-lg">Reactivo límite: <b style={{ color: '#4f8a3c' }}>{limite}</b> · sobran <b style={{ color: '#c43c3c' }}>{a - usaA > 0 ? `${a - usaA} ${ra[0]}` : `${b - usaB} ${rb[0]}`}</b></p>
          : <p className="text-lg" style={{ color: '#4f8a3c' }}><b>Proporción exacta:</b> {a - usaA + b - usaB > 0 ? 'sobra un poco de cada uno porque no alcanza para otra receta completa' : 'no sobra nada'}</p>}
      </div>
      <p className="max-w-xl text-center text-xs opacity-70">N cambia la receta · Q/A y W/S cambian las cantidades (en moléculas o moles). Lo tenue ya se usó. El límite es el que alcanza para menos recetas: cantidad ÷ coeficiente.</p>
    </div>
  )
}
