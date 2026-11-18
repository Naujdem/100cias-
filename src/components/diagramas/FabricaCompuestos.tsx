import { useEffect, useState } from 'react'

// Explora (Química área 3, tema 3): fábrica de compuestos. Catión (Q/A) + anión (W/S) → fórmula equilibrando
// cargas y nombre (stock y tradicional), con el uso de las sales conocidas.

type Ion = { f: string; q: number; poli: boolean; nombre: string; trad?: string }
const CAT: Ion[] = [
  { f: 'Na', q: 1, poli: false, nombre: 'sodio' },
  { f: 'K', q: 1, poli: false, nombre: 'potasio' },
  { f: 'NH₄', q: 1, poli: true, nombre: 'amonio' },
  { f: 'Ca', q: 2, poli: false, nombre: 'calcio' },
  { f: 'Mg', q: 2, poli: false, nombre: 'magnesio' },
  { f: 'Cu', q: 2, poli: false, nombre: 'cobre (II)', trad: 'cúprico' },
  { f: 'Fe', q: 2, poli: false, nombre: 'hierro (II)', trad: 'ferroso' },
  { f: 'Fe', q: 3, poli: false, nombre: 'hierro (III)', trad: 'férrico' },
  { f: 'Al', q: 3, poli: false, nombre: 'aluminio' },
]
const AN: Ion[] = [
  { f: 'Cl', q: 1, poli: false, nombre: 'cloruro' },
  { f: 'F', q: 1, poli: false, nombre: 'fluoruro' },
  { f: 'S', q: 2, poli: false, nombre: 'sulfuro' },
  { f: 'NO₃', q: 1, poli: true, nombre: 'nitrato' },
  { f: 'NO₂', q: 1, poli: true, nombre: 'nitrito' },
  { f: 'SO₄', q: 2, poli: true, nombre: 'sulfato' },
  { f: 'SO₃', q: 2, poli: true, nombre: 'sulfito' },
  { f: 'CO₃', q: 2, poli: true, nombre: 'carbonato' },
  { f: 'PO₄', q: 3, poli: true, nombre: 'fosfato' },
  { f: 'ClO', q: 1, poli: true, nombre: 'hipoclorito' },
  { f: 'HCO₃', q: 1, poli: true, nombre: 'bicarbonato' },
]
const USOS: Record<string, string> = {
  'NaCl': 'sal de cocina', 'KCl': 'abono potásico', 'NaF': 'crema dental', 'CaF₂': 'mineral fluorita',
  'KNO₃': 'abono y pólvora', 'NH₄NO₃': 'abono nitrogenado', '(NH₄)₂SO₄': 'abono (nitrógeno y azufre)', 'CaSO₄': 'yeso',
  'MgSO₄': 'sal de Epsom; abono con magnesio', 'CuSO₄': 'caldo bordelés contra hongos', 'FeSO₄': 'abono contra la clorosis',
  'CaCO₃': 'cal agrícola, tiza y cáscara de huevo', 'Na₂CO₃': 'soda para lavar', 'Ca₃(PO₄)₂': 'roca fosfórica y huesos',
  'NaClO': 'blanqueador', 'NaHCO₃': 'bicarbonato de cocina', 'Al₂(SO₄)₃': 'potabilizar el agua (alumbre)', 'NaNO₂': 'conservante de embutidos',
  '(NH₄)₃PO₄': 'abono (nitrógeno y fósforo)', 'Ca(ClO)₂': 'cloro granulado para tanques',
}
const SUB = '₀₁₂₃₄₅₆₇₈₉'
const sub = (n: number) => (n === 1 ? '' : String(n).split('').map((d) => SUB[+d]).join(''))
const mcd = (a: number, b: number): number => (b ? mcd(b, a % b) : a)
const carga = (q: number, signo: string) => `${q > 1 ? '⁰¹²³'[q] : ''}${signo}`
const parte = (i: Ion, n: number) => (n > 1 && i.poli ? `(${i.f})${sub(n)}` : `${i.f}${sub(n)}`)

export default function FabricaCompuestos() {
  const [c, setC] = useState(0)
  const [a, setA] = useState(0)
  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => {
      const t = ev.key.toLowerCase()
      if (t === 'q') setC((v) => (v + 1) % CAT.length)
      if (t === 'a') setC((v) => (v + CAT.length - 1) % CAT.length)
      if (t === 'w') setA((v) => (v + 1) % AN.length)
      if (t === 's') setA((v) => (v + AN.length - 1) % AN.length)
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])
  const K = CAT[c], A = AN[a]
  const m = (K.q * A.q) / mcd(K.q, A.q)
  const nK = m / K.q, nA = m / A.q
  const formula = parte(K, nK) + parte(A, nA)
  const binaria = !A.f.includes('O')
  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="grid w-full max-w-4xl gap-3 md:grid-cols-2">
        <div>
          <p className="mb-1 text-center text-xs font-bold opacity-60">CATIÓN (Q/A)</p>
          <div className="flex flex-wrap justify-center gap-1">
            {CAT.map((x, j) => <button key={j} onClick={() => setC(j)} className={`rounded-lg border px-2 py-1 text-sm font-bold ${c === j ? 'bg-[var(--acento)] text-white' : 'bg-[#ece7f8]'}`}>{x.f}<sup>{carga(x.q, '+')}</sup></button>)}
          </div>
        </div>
        <div>
          <p className="mb-1 text-center text-xs font-bold opacity-60">ANIÓN (W/S)</p>
          <div className="flex flex-wrap justify-center gap-1">
            {AN.map((x, j) => <button key={j} onClick={() => setA(j)} className={`rounded-lg border px-2 py-1 text-sm font-bold ${a === j ? 'bg-[var(--acento)] text-white' : 'bg-[#e3f0d6]'}`}>{x.f}<sup>{carga(x.q, '−')}</sup></button>)}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 text-lg">
        {Array.from({ length: nK }, (_, k) => <span key={'k' + k} className="rounded-full bg-[#ece7f8] px-3 py-1 font-bold">{K.f}<sup>{carga(K.q, '+')}</sup></span>)}
        <span className="opacity-50">+</span>
        {Array.from({ length: nA }, (_, k) => <span key={'a' + k} className="rounded-full bg-[#e3f0d6] px-3 py-1 font-bold">{A.f}<sup>{carga(A.q, '−')}</sup></span>)}
      </div>
      <p className="text-sm opacity-70">Cargas: {nK} × (+{K.q}) + {nA} × (−{A.q}) = 0</p>
      <div className="rounded-xl border-2 border-[var(--acento)] bg-white px-6 py-3 text-center">
        <p className="text-5xl font-black">{formula}</p>
        <p className="mt-1 text-xl font-semibold">{A.nombre} de {K.nombre}</p>
        {K.trad && <p className="text-sm opacity-70">tradicional: {A.nombre} {K.trad}</p>}
        <p className="text-sm opacity-70">{binaria ? 'Sal binaria (el anión no tiene oxígeno)' : A.f.startsWith('H') ? 'Sal ácida (conserva un H)' : 'Oxisal (el anión tiene oxígeno)'}</p>
        {USOS[formula] && <p className="mt-1 font-semibold" style={{ color: '#4f8a3c' }}>Uso: {USOS[formula]}</p>}
      </div>
      <p className="max-w-xl text-center text-xs opacity-70">Q/A cambia el catión, W/S el anión. Se busca el mínimo de cada ion para que las cargas sumen cero; si un ion poliatómico se repite, va entre paréntesis.</p>
    </div>
  )
}
