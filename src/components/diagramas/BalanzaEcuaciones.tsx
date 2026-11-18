import { useCallback, useEffect, useState } from 'react'

// Explora (Química área 3, tema 5): balanza de ecuaciones. Se ajustan los coeficientes y la app cuenta los átomos
// de cada elemento a cada lado. A/D elige la fórmula, W/S sube o baja su coeficiente, N pasa a otra ecuación,
// R vuelve todo a 1.

type Sp = { f: string; at: Record<string, number> }
type Ecu = { nombre: string; r: Sp[]; p: Sp[] }
const S = (f: string, at: Record<string, number>): Sp => ({ f, at })

const ECUS: Ecu[] = [
  { nombre: 'Formación del agua', r: [S('H₂', { H: 2 }), S('O₂', { O: 2 })], p: [S('H₂O', { H: 2, O: 1 })] },
  { nombre: 'Amoníaco para abonos', r: [S('N₂', { N: 2 }), S('H₂', { H: 2 })], p: [S('NH₃', { N: 1, H: 3 })] },
  { nombre: 'Sal de cocina', r: [S('Na', { Na: 1 }), S('Cl₂', { Cl: 2 })], p: [S('NaCl', { Na: 1, Cl: 1 })] },
  { nombre: 'El machete se oxida', r: [S('Fe', { Fe: 1 }), S('O₂', { O: 2 })], p: [S('Fe₂O₃', { Fe: 2, O: 3 })] },
  { nombre: 'El gas de la estufa', r: [S('CH₄', { C: 1, H: 4 }), S('O₂', { O: 2 })], p: [S('CO₂', { C: 1, O: 2 }), S('H₂O', { H: 2, O: 1 })] },
  { nombre: 'El agua oxigenada', r: [S('H₂O₂', { H: 2, O: 2 })], p: [S('H₂O', { H: 2, O: 1 }), S('O₂', { O: 2 })] },
  { nombre: 'Gas propano (pipeta)', r: [S('C₃H₈', { C: 3, H: 8 }), S('O₂', { O: 2 })], p: [S('CO₂', { C: 1, O: 2 }), S('H₂O', { H: 2, O: 1 })] },
  { nombre: 'Aluminio en ácido', r: [S('Al', { Al: 1 }), S('HCl', { H: 1, Cl: 1 })], p: [S('AlCl₃', { Al: 1, Cl: 3 }), S('H₂', { H: 2 })] },
  { nombre: 'Óxido de aluminio', r: [S('Al', { Al: 1 }), S('O₂', { O: 2 })], p: [S('Al₂O₃', { Al: 2, O: 3 })] },
  { nombre: 'Respiración celular', r: [S('C₆H₁₂O₆', { C: 6, H: 12, O: 6 }), S('O₂', { O: 2 })], p: [S('CO₂', { C: 1, O: 2 }), S('H₂O', { H: 2, O: 1 })] },
  { nombre: 'Alto horno', r: [S('Fe₂O₃', { Fe: 2, O: 3 }), S('CO', { C: 1, O: 1 })], p: [S('Fe', { Fe: 1 }), S('CO₂', { C: 1, O: 2 })] },
  { nombre: 'Bicarbonato al calentarlo', r: [S('NaHCO₃', { Na: 1, H: 1, C: 1, O: 3 })], p: [S('Na₂CO₃', { Na: 2, C: 1, O: 3 }), S('H₂O', { H: 2, O: 1 }), S('CO₂', { C: 1, O: 2 })] },
]
const mcd = (a: number, b: number): number => (b ? mcd(b, a % b) : a)

export default function BalanzaEcuaciones() {
  const [e, setE] = useState(0)
  const ec = ECUS[e]
  const todas = [...ec.r, ...ec.p]
  const [co, setCo] = useState<number[]>(() => todas.map(() => 1))
  const [sel, setSel] = useState(0)

  const otra = useCallback((d: number) => {
    setE((v) => {
      const n = (v + d + ECUS.length) % ECUS.length
      setCo([...ECUS[n].r, ...ECUS[n].p].map(() => 1)); setSel(0)
      return n
    })
  }, [])
  const cambiar = useCallback((k: number, d: number) => setCo((c) => c.map((x, j) => (j === k ? Math.min(12, Math.max(1, x + d)) : x))), [])

  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => {
      const t = ev.key.toLowerCase()
      if (t === 'a') setSel((s) => (s + todas.length - 1) % todas.length)
      if (t === 'd') setSel((s) => (s + 1) % todas.length)
      if (t === 'w') cambiar(sel, 1)
      if (t === 's') cambiar(sel, -1)
      if (t === 'n') otra(1)
      if (t === 'r') setCo(todas.map(() => 1))
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [sel, todas, cambiar, otra])

  const elementos = [...new Set(todas.flatMap((s) => Object.keys(s.at)))]
  const contar = (lado: Sp[], off: number, el: string) => lado.reduce((s, sp, k) => s + (sp.at[el] ?? 0) * co[k + off], 0)
  const filas = elementos.map((el) => ({ el, i: contar(ec.r, 0, el), d: contar(ec.p, ec.r.length, el) }))
  const ok = filas.every((f) => f.i === f.d)
  const totalI = filas.reduce((s, f) => s + f.i, 0), totalD = filas.reduce((s, f) => s + f.d, 0)
  const ang = ok ? 0 : Math.max(-14, Math.min(14, (totalD - totalI) * 2))
  const simplificable = ok && co.reduce(mcd) > 1

  const Formula = ({ sp, k }: { sp: Sp; k: number }) => (
    <button onClick={() => setSel(k)} className={`flex flex-col items-center rounded-xl border-2 px-2 py-1 ${sel === k ? 'border-[var(--acento)] bg-white' : 'border-transparent'}`}>
      <span className="flex items-center gap-1">
        <span onClick={(ev) => { ev.stopPropagation(); cambiar(k, -1) }} className="cursor-pointer rounded-full border px-2 text-sm">−</span>
        <span className="text-2xl font-black" style={{ color: '#c43c3c' }}>{co[k] > 1 ? co[k] : ''}</span>
        <span className="text-2xl font-black">{sp.f}</span>
        <span onClick={(ev) => { ev.stopPropagation(); cambiar(k, 1) }} className="cursor-pointer rounded-full border px-2 text-sm">+</span>
      </span>
    </button>
  )

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <button onClick={() => otra(-1)} className="rounded-full border bg-white px-3 py-1 text-sm font-semibold">←</button>
        <p className="min-w-56 text-center font-semibold">{ec.nombre} · {e + 1} de {ECUS.length}</p>
        <button onClick={() => otra(1)} className="rounded-full border bg-white px-3 py-1 text-sm font-semibold">N →</button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1">
        {ec.r.map((sp, k) => <span key={'r' + k} className="flex items-center">{k > 0 && <span className="px-1 text-xl">+</span>}<Formula sp={sp} k={k} /></span>)}
        <span className="px-2 text-2xl">→</span>
        {ec.p.map((sp, k) => <span key={'p' + k} className="flex items-center">{k > 0 && <span className="px-1 text-xl">+</span>}<Formula sp={sp} k={k + ec.r.length} /></span>)}
      </div>
      <div className="grid w-full max-w-3xl items-center gap-4 md:grid-cols-2">
        <svg viewBox="0 0 240 150" role="img" aria-label="Balanza de átomos" className="w-full">
          <polygon points="120,140 105,150 135,150" fill="#777" />
          <line x1="120" y1="140" x2="120" y2="60" stroke="#777" strokeWidth="5" />
          <g style={{ transform: `rotate(${ang}deg)`, transformOrigin: '120px 60px', transition: 'transform 0.6s' }}>
            <line x1="30" y1="60" x2="210" y2="60" stroke="#555" strokeWidth="5" />
            <line x1="40" y1="60" x2="40" y2="95" stroke="#555" /><rect x="10" y="95" width="60" height="10" rx="4" fill="#6b8fc6" />
            <line x1="200" y1="60" x2="200" y2="95" stroke="#555" /><rect x="170" y="95" width="60" height="10" rx="4" fill="#c87a6a" />
            <text x="40" y="90" textAnchor="middle" fontSize="11" fontWeight="700">{totalI} átomos</text>
            <text x="200" y="90" textAnchor="middle" fontSize="11" fontWeight="700">{totalD} átomos</text>
          </g>
          <text x="120" y="30" textAnchor="middle" fontSize="13" fontWeight="800" fill={ok ? '#4f8a3c' : '#c43c3c'}>{ok ? '¡Balanceada!' : 'Todavía no cuadra'}</text>
        </svg>
        <table className="w-full rounded-xl bg-white text-center">
          <thead><tr className="text-xs opacity-60"><th>Elemento</th><th>Izquierda</th><th>Derecha</th></tr></thead>
          <tbody>
            {filas.map((f) => (
              <tr key={f.el} className="text-lg font-bold" style={{ color: f.i === f.d ? '#4f8a3c' : '#c43c3c' }}>
                <td>{f.el}</td><td>{f.i}</td><td>{f.d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {simplificable && <p className="text-sm font-semibold">Cuadra, pero todos los coeficientes se pueden dividir entre {co.reduce(mcd)}: usa los más pequeños.</p>}
      <p className="max-w-xl text-center text-xs opacity-70">A/D elige la fórmula · W/S sube o baja el coeficiente (o los botones − y +) · N otra ecuación · R vuelve a empezar. Solo cambian los coeficientes: los subíndices no se tocan.</p>
    </div>
  )
}
