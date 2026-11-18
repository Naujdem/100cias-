import { useEffect, useState } from 'react'

// Explora (Química área 4, tema 5): preparador de soluciones. Se elige el soluto (Q), los gramos (W/S) y el
// volumen final del matraz (A/D), y se ven todas las concentraciones a la vez.

const SOLUTOS = [
  { nombre: 'Sal', f: 'NaCl', M: 58.5, eq: 1, color: [235, 240, 245] },
  { nombre: 'Azúcar', f: 'C₁₂H₂₂O₁₁', M: 342, eq: 0, color: [245, 238, 220] },
  { nombre: 'Soda cáustica', f: 'NaOH', M: 40, eq: 1, color: [235, 240, 245] },
  { nombre: 'Sulfato de cobre', f: 'CuSO₄', M: 159.6, eq: 2, color: [40, 110, 200] },
]
const GRAMOS = [0.5, 1, 2, 4, 5, 10, 20, 29.25, 40, 58.5, 100]
const VOLS = [50, 100, 250, 500, 1000]
const f = (x: number, d = 2) => x.toLocaleString('es-CO', { maximumFractionDigits: d })

export default function PreparadorSoluciones() {
  const [si, setSi] = useState(0)
  const [gi, setGi] = useState(5)
  const [vi, setVi] = useState(4)
  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => {
      const k = ev.key.toLowerCase()
      if (k === 'q') setSi((v) => (v + 1) % SOLUTOS.length)
      if (k === 'w') setGi((v) => Math.min(GRAMOS.length - 1, v + 1))
      if (k === 's') setGi((v) => Math.max(0, v - 1))
      if (k === 'd') setVi((v) => Math.min(VOLS.length - 1, v + 1))
      if (k === 'a') setVi((v) => Math.max(0, v - 1))
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])
  const S = SOLUTOS[si], g = GRAMOS[gi], mL = VOLS[vi], L = mL / 1000
  const mol = g / S.M
  const M = mol / L
  const mv = (g / mL) * 100
  const ppm = (g * 1000) / L
  // molalidad aproximada: se supone que la solución pesa casi lo mismo que su volumen en agua
  const kgSolvente = Math.max(0.001, (mL - g * 0.6) / 1000)
  const molal = mol / kgSolvente
  const N = S.eq ? M * S.eq : null
  const opac = S.f === 'CuSO₄' ? Math.min(0.9, 0.08 + M * 0.9) : 0.15
  const [r, gg, b] = S.color
  const alto = 40 + (vi / (VOLS.length - 1)) * 110

  const filas: [string, string, string][] = [
    ['%m/V', `${f(mv)} %`, `${f(g)} g en ${mL} mL × 100`],
    ['ppm (mg/L)', f(ppm, 0), `${f(g * 1000, 0)} mg en ${f(L, 3)} L`],
    ['Moles de soluto', `${f(mol, 4)} mol`, `${f(g)} g ÷ ${f(S.M, 1)} g/mol`],
    ['Molaridad (M)', `${f(M, 3)} M`, `${f(mol, 4)} mol ÷ ${f(L, 3)} L`],
    ['Molalidad (m) ≈', `${f(molal, 3)} m`, 'mol ÷ kg de agua (aprox.)'],
  ]
  if (N !== null) filas.push(['Normalidad (N)', `${f(N, 3)} N`, `M × ${S.eq} equivalentes`])

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-1">
        {SOLUTOS.map((x, j) => <button key={x.f} onClick={() => setSi(j)} className={`rounded-full border px-3 py-1 text-sm font-semibold ${si === j ? 'bg-[var(--acento)] text-white' : 'bg-white'}`}>{x.nombre} · {x.f}</button>)}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <svg viewBox="0 0 160 220" className="w-40" role="img" aria-label={`${f(g)} g de ${S.nombre} en ${mL} mL`}>
          <path d="M65 10 h30 v50 l50 80 q8 30 -20 32 h-90 q-28 -2 -20 -32 l50 -80 z" fill="#fff" stroke="#3a3a3a" strokeWidth="3" />
          <clipPath id="ps-matraz"><path d="M65 10 h30 v50 l50 80 q8 30 -20 32 h-90 q-28 -2 -20 -32 l50 -80 z" /></clipPath>
          <rect x="0" y={172 - alto} width="160" height={alto} fill={`rgba(${r}, ${gg}, ${b}, ${opac})`} clipPath="url(#ps-matraz)" style={{ transition: 'all 0.6s' }} />
          <line x1="60" y1={172 - alto} x2="100" y2={172 - alto} stroke="#c43c3c" strokeWidth="2" style={{ transition: 'all 0.6s' }} />
          <text x="80" y="200" textAnchor="middle" fontSize="14" fontWeight="900">{mL} mL</text>
          <text x="80" y="216" textAnchor="middle" fontSize="11" fontWeight="700">{f(g)} g de {S.f}</text>
        </svg>
        <table className="rounded-xl bg-white text-sm">
          <tbody>
            {filas.map(([n, v, c]) => (
              <tr key={n} className="border-b last:border-0">
                <td className="px-2 py-1 font-semibold">{n}</td>
                <td className="px-2 py-1 text-right font-black">{v}</td>
                <td className="px-2 py-1 text-xs opacity-70">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <button onClick={() => setGi((v) => Math.max(0, v - 1))} className="rounded-full border bg-white px-3 py-1 text-sm font-semibold">Menos gramos (S)</button>
        <button onClick={() => setGi((v) => Math.min(GRAMOS.length - 1, v + 1))} className="rounded-full border bg-white px-3 py-1 text-sm font-semibold">Más gramos (W)</button>
        <button onClick={() => setVi((v) => Math.max(0, v - 1))} className="rounded-full border bg-white px-3 py-1 text-sm font-semibold">Matraz menor (A)</button>
        <button onClick={() => setVi((v) => Math.min(VOLS.length - 1, v + 1))} className="rounded-full border bg-white px-3 py-1 text-sm font-semibold">Matraz mayor (D)</button>
      </div>
      <p className="max-w-xl text-center text-xs opacity-70">Q soluto · W/S gramos · A/D volumen final del matraz. La misma cantidad de soluto en más volumen da menos concentración. Con el sulfato de cobre, el color muestra la concentración. La soda cáustica es corrosiva: en la vida real se maneja con guantes y gafas.</p>
    </div>
  )
}
