import { useEffect, useState } from 'react'
import { COLOR_REPOLLO } from '../escenas/EscenasAcidosBases.tsx'

// Explora (Química área 4, tema 8): escala de pH casera. A/D (o flechas) recorren las sustancias; se ve su lugar en
// la escala, el color del indicador de repollo, la concentración de H⁺ y cuántas veces es más ácida o básica que
// el agua pura. Valores aproximados.

const SUST: { n: string; i: string; ph: number }[] = [
  { n: 'Jugo gástrico', i: '🫃', ph: 1.5 },
  { n: 'Limón', i: '🍋', ph: 2.2 },
  { n: 'Gaseosa', i: '🥤', ph: 2.5 },
  { n: 'Vinagre', i: '🫙', ph: 2.8 },
  { n: 'Naranja', i: '🍊', ph: 3.5 },
  { n: 'Tomate', i: '🍅', ph: 4.3 },
  { n: 'Café (tinto)', i: '☕', ph: 5 },
  { n: 'Lluvia limpia', i: '🌧️', ph: 5.6 },
  { n: 'Leche', i: '🥛', ph: 6.6 },
  { n: 'Agua pura', i: '💧', ph: 7 },
  { n: 'Sangre', i: '🩸', ph: 7.4 },
  { n: 'Agua de mar', i: '🌊', ph: 8.1 },
  { n: 'Bicarbonato en agua', i: '🧂', ph: 8.3 },
  { n: 'Jabón de barra', i: '🧼', ph: 10 },
  { n: 'Leche de magnesia', i: '💊', ph: 10.5 },
  { n: 'Amoníaco de limpieza', i: '🧴', ph: 11.5 },
  { n: 'Agua de cal', i: '🪨', ph: 12.4 },
  { n: 'Soda cáustica', i: '⚠️', ph: 13.5 },
]
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'
const exp10 = (e: number) => `10${(e < 0 ? '⁻' : '') + String(Math.abs(e)).split('').map((d) => SUP[+d]).join('')}`
const veces = (x: number) => (x >= 1e6 ? `${Math.round(x / 1e6).toLocaleString('es-CO')} millones` : Math.round(x).toLocaleString('es-CO'))

export default function EscalaPh() {
  const [k, setK] = useState(1)
  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => {
      const t = ev.key.toLowerCase()
      if (t === 'a' || ev.key === 'ArrowLeft') setK((v) => Math.max(0, v - 1))
      if (t === 'd' || ev.key === 'ArrowRight') setK((v) => Math.min(SUST.length - 1, v + 1))
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])
  const S = SUST[k]
  const tipo = S.ph < 6.5 ? 'ÁCIDO' : S.ph > 7.5 ? 'BÁSICO' : 'NEUTRO (o casi)'
  const colorTipo = S.ph < 6.5 ? '#c43c3c' : S.ph > 7.5 ? '#3f6fb8' : '#4f8a3c'
  const repollo = COLOR_REPOLLO[Math.min(14, Math.round(S.ph))]
  const fac = 10 ** Math.abs(7 - S.ph)
  const W = 560

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <svg viewBox={`-10 -10 ${W + 20} 150`} className="w-full max-w-2xl" role="img" aria-label={`${S.n}: pH ${S.ph}`}>
        <defs>
          <linearGradient id="ph-grad" x1="0" x2="1">
            {COLOR_REPOLLO.map((c, j) => <stop key={j} offset={j / 14} stopColor={c} />)}
          </linearGradient>
        </defs>
        <rect x="0" y="60" width={W} height="26" rx="13" fill="url(#ph-grad)" />
        {Array.from({ length: 15 }, (_, j) => <text key={j} x={(j / 14) * W} y="104" textAnchor="middle" fontSize="12" fontWeight="700">{j}</text>)}
        <text x="0" y="128" fontSize="12" fontWeight="800" fill="#c43c3c">← más ácido</text>
        <text x={W / 2} y="128" textAnchor="middle" fontSize="12" fontWeight="800" fill="#4f8a3c">neutro</text>
        <text x={W} y="128" textAnchor="end" fontSize="12" fontWeight="800" fill="#3f6fb8">más básico →</text>
        {SUST.map((s, j) => <circle key={s.n} cx={(s.ph / 14) * W} cy="73" r={j === k ? 0 : 3} fill="#fff" opacity="0.8" onClick={() => setK(j)} style={{ cursor: 'pointer' }} />)}
        <g style={{ transition: 'transform 0.5s', transform: `translateX(${(S.ph / 14) * W}px)` }}>
          <path d="M0 58 l-9 -14 h18 z" fill="#3a3a3a" />
          <text x="0" y="36" textAnchor="middle" fontSize="26">{S.i}</text>
        </g>
      </svg>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <svg viewBox="0 0 60 150" className="h-36" role="img" aria-label="Tubo con indicador de repollo">
          <path d="M16 10 v110 a14 14 0 0 0 28 0 v-110" fill="#fff" stroke="#3a3a3a" strokeWidth="2" />
          <path d="M18 50 v70 a12 12 0 0 0 24 0 v-70 z" fill={repollo} style={{ transition: 'fill 0.5s' }} />
        </svg>
        <div className="rounded-xl border-2 bg-white px-4 py-2" style={{ borderColor: colorTipo }}>
          <p className="text-xl font-black">{S.i} {S.n}</p>
          <p className="text-lg font-bold">pH ≈ {S.ph.toLocaleString('es-CO')} · <span style={{ color: colorTipo }}>{tipo}</span></p>
          <p className="text-sm">[H⁺] ≈ {exp10(-Math.round(S.ph))} mol/L</p>
          <p className="text-sm">{Math.abs(7 - S.ph) < 0.3 ? 'Casi igual que el agua pura.' : `Unas ${veces(fac)} veces más ${S.ph < 7 ? 'ácido' : 'básico'} que el agua pura.`}</p>
          <p className="text-xs opacity-70">Con repollo morado se vería de este color.</p>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-1">
        {SUST.map((s, j) => <button key={s.n} onClick={() => setK(j)} className={`rounded-full border px-2 py-0.5 text-sm ${k === j ? 'bg-[var(--acento)] font-bold text-white' : 'bg-white'}`}>{s.i} {s.n}</button>)}
      </div>
      <p className="max-w-xl text-center text-xs opacity-70">A/D o flechas para recorrer las sustancias, o tócalas. Cada número de la escala es 10 veces más ácido o básico que el siguiente. Valores aproximados; la soda cáustica y el amoníaco son peligrosos.</p>
    </div>
  )
}
