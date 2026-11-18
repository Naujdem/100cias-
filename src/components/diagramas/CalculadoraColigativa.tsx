import { useEffect, useState } from 'react'

// Explora (Química área 4, tema 9): calculadora coligativa para 1 kg de agua. Q cambia el soluto (con su factor i
// de van 't Hoff), W/S los gramos. Muestra la molalidad, cuántas partículas hay, y cuánto suben la ebullición y bajan
// la congelación, más la presión osmótica aproximada (solución diluida, 25 °C).

const SOLUTOS = [
  { nombre: 'Azúcar', f: 'C₁₂H₂₂O₁₁', M: 342, i: 1, nota: 'no se separa: 1 partícula' },
  { nombre: 'Sal', f: 'NaCl', M: 58.5, i: 2, nota: 'Na⁺ + Cl⁻: 2 partículas' },
  { nombre: 'Cloruro de calcio', f: 'CaCl₂', M: 111, i: 3, nota: 'Ca²⁺ + 2 Cl⁻: 3 partículas' },
  { nombre: 'Etilenglicol (anticongelante)', f: 'C₂H₆O₂', M: 62, i: 1, nota: 'no se separa: 1 partícula' },
]
const GRAMOS = [0, 10, 30, 60, 100, 150, 200, 300]
const KE = 0.512, KC = 1.86, R = 0.082
const f = (x: number, d = 2) => x.toLocaleString('es-CO', { maximumFractionDigits: d })

function Termo({ x, valor, min, max, color, titulo }: { x: number; valor: number; min: number; max: number; color: string; titulo: string }) {
  const y = Math.max(25, Math.min(155, 150 - ((valor - min) / (max - min)) * 120))
  return (
    <g>
      <rect x={x - 8} y="25" width="16" height="130" rx="8" fill="#fff" stroke="#3a3a3a" strokeWidth="2" />
      <circle cx={x} cy="165" r="13" fill={color} stroke="#3a3a3a" strokeWidth="2" />
      <rect x={x - 4} y={y} width="8" height={160 - y} fill={color} style={{ transition: 'all 0.5s' }} />
      <text x={x} y="16" textAnchor="middle" fontSize="11" fontWeight="800">{titulo}</text>
      <text x={x + 14} y={y + 4} fontSize="12" fontWeight="900" fill={color} style={{ transition: 'all 0.5s' }}>{f(valor)} °C</text>
    </g>
  )
}

export default function CalculadoraColigativa() {
  const [si, setSi] = useState(1)
  const [gi, setGi] = useState(3)
  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => {
      const k = ev.key.toLowerCase()
      if (k === 'q') setSi((v) => (v + 1) % SOLUTOS.length)
      if (k === 'w') setGi((v) => Math.min(GRAMOS.length - 1, v + 1))
      if (k === 's') setGi((v) => Math.max(0, v - 1))
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])
  const S = SOLUTOS[si], g = GRAMOS[gi]
  const mol = g / S.M
  const m = mol // en 1 kg de agua
  const part = S.i * m
  const dTe = KE * part, dTc = KC * part
  const pi = part * R * 298 // atm, aproximando molaridad ≈ molalidad
  const puntos = Math.min(60, Math.round(part * 12))

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-1">
        {SOLUTOS.map((x, j) => <button key={x.f} onClick={() => setSi(j)} className={`rounded-full border px-3 py-1 text-sm font-semibold ${si === j ? 'bg-[var(--acento)] text-white' : 'bg-white'}`}>{x.nombre}</button>)}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <svg viewBox="0 0 150 170" className="w-36" role="img" aria-label={`${g} g de ${S.nombre} en 1 kg de agua`}>
          <path d="M15 20 V150 H135 V20" fill="none" stroke="#3a3a3a" strokeWidth="3" />
          <rect x="17" y="40" width="116" height="108" fill="#d7eaf7" />
          {Array.from({ length: puntos }, (_, k) => <circle key={k} cx={25 + ((k * 37) % 100)} cy={48 + ((k * 23) % 92)} r="3" fill="#7b5ab8" />)}
          <text x="75" y="166" textAnchor="middle" fontSize="11" fontWeight="700">1 kg de agua + {g} g</text>
        </svg>
        <svg viewBox="0 0 230 190" className="w-60" role="img" aria-label="Puntos de ebullición y congelación">
          <Termo x={50} valor={100 + dTe} min={99} max={106} color="#c43c3c" titulo="hierve a" />
          <Termo x={160} valor={-dTc} min={-25} max={1} color="#3f6fb8" titulo="se congela a" />
        </svg>
        <table className="rounded-xl bg-white text-sm">
          <tbody>
            <tr><td className="px-2 font-semibold">Moles de {S.f}</td><td className="px-2 text-right font-black">{f(mol, 3)}</td></tr>
            <tr><td className="px-2 font-semibold">Molalidad</td><td className="px-2 text-right font-black">{f(m, 3)} m</td></tr>
            <tr><td className="px-2 font-semibold">Factor i</td><td className="px-2 text-right font-black">{S.i}</td></tr>
            <tr><td className="px-2 font-semibold">ΔTe = 0,512 · i · m</td><td className="px-2 text-right font-black">+{f(dTe)} °C</td></tr>
            <tr><td className="px-2 font-semibold">ΔTc = 1,86 · i · m</td><td className="px-2 text-right font-black">−{f(dTc)} °C</td></tr>
            <tr><td className="px-2 font-semibold">π ≈ i · M · R · T</td><td className="px-2 text-right font-black">{f(pi, 1)} atm</td></tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm font-semibold">{S.nombre}: {S.nota}</p>
      <div className="flex gap-2">
        <button onClick={() => setGi((v) => Math.max(0, v - 1))} className="rounded-full border bg-white px-4 py-1 text-sm font-semibold">Menos (S)</button>
        <button onClick={() => setGi((v) => Math.min(GRAMOS.length - 1, v + 1))} className="rounded-full border bg-white px-4 py-1 text-sm font-semibold">Más (W)</button>
      </div>
      <p className="max-w-xl text-center text-xs opacity-70">Q soluto · W/S gramos en 1 kg de agua. Compara la misma masa de azúcar y de sal: la sal da muchas más partículas. Fórmulas para soluciones diluidas; con mucho soluto los valores reales se apartan un poco.</p>
    </div>
  )
}
