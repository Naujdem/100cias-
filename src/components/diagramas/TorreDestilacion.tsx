import { useEffect, useState } from 'react'

// Explora (Química orgánica, tema 9): torre de destilación fraccionada.
// Flechas arriba/abajo (o W/S) recorren las salidas; cada una muestra su temperatura, sus carbonos y sus usos.
// Rangos aproximados: verificar con un texto de química.

const FR = [
  { n: 'Gases', t: '< 20 °C', c: 'C₁–C₄', u: 'Gas de cilindro (propano, butano) y materia prima para plásticos.', col: '#d9ecf7' },
  { n: 'Gasolina y nafta', t: '20–150 °C', c: 'C₅–C₁₀', u: 'Combustible de carros y motos; la nafta va a la petroquímica.', col: '#f7e7a8' },
  { n: 'Queroseno', t: '150–250 °C', c: 'C₁₀–C₁₆', u: 'Combustible de avión (jet) y de lámparas y estufas antiguas.', col: '#f2cf7a' },
  { n: 'Diésel (ACPM)', t: '250–350 °C', c: 'C₁₄–C₂₀', u: 'Camiones, buses, tractores y plantas eléctricas.', col: '#e3a85a' },
  { n: 'Aceites y parafinas', t: '350–400 °C', c: 'C₂₀–C₅₀', u: 'Lubricantes de motor, vaselina y velas.', col: '#b77a3e' },
  { n: 'Residuo (asfalto)', t: '> 400 °C', c: '> C₅₀', u: 'Asfalto de las carreteras e impermeabilizantes; combustóleo de barcos.', col: '#5a4030' },
]

export default function TorreDestilacion() {
  const [s, setS] = useState(1)
  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => {
      const k = ev.key.toLowerCase()
      if (k === 'arrowup' || k === 'w') setS((v) => Math.max(0, v - 1))
      else if (k === 'arrowdown' || k === 's') setS((v) => Math.min(FR.length - 1, v + 1))
      else return
      ev.preventDefault()
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])
  const F = FR[s]
  return (
    <div data-diagrama className="flex flex-col items-center gap-3 md:flex-row md:items-start md:justify-center">
      <svg viewBox="0 0 300 330" className="w-full max-w-sm rounded-xl bg-white" role="img" aria-label="Torre de destilación del petróleo">
        <defs><linearGradient id="torre-t" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#e2685c" /><stop offset="1" stopColor="#9ec1e8" /></linearGradient></defs>
        <rect x="90" y="20" width="80" height="290" rx="14" fill="url(#torre-t)" stroke="#3a3a3a" strokeWidth="2" />
        <rect x="20" y="280" width="60" height="30" rx="6" fill="#3a3a3a" /><text x="50" y="299" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="700">crudo 400 °C</text>
        <path d="M80 295 h10" stroke="#3a3a3a" strokeWidth="4" />
        {Array.from({ length: 8 }, (_, k) => <circle key={k} cx={105 + (k % 4) * 17} cy="290" r="4" fill="#fff" opacity="0.8"><animate attributeName="cy" values={`290;${40 + (k % 5) * 40}`} dur={`${2.5 + (k % 3)}s`} repeatCount="indefinite" /><animate attributeName="opacity" values="0.8;0" dur={`${2.5 + (k % 3)}s`} repeatCount="indefinite" /></circle>)}
        {FR.map((f, k) => {
          const y = 40 + k * 46
          return (
            <g key={f.n} className="cursor-pointer" onClick={() => setS(k)}>
              <line x1="92" y1={y + 10} x2="168" y2={y + 10} stroke="#3a3a3a" strokeWidth="2" strokeDasharray="5 4" />
              <path d={`M170 ${y} h30`} stroke="#3a3a3a" strokeWidth="5" />
              <rect x="200" y={y - 12} width="90" height="24" rx="8" fill={f.col} stroke={s === k ? '#d9a400' : '#3a3a3a'} strokeWidth={s === k ? 3 : 1} />
              <text x="245" y={y + 4} textAnchor="middle" fontSize="9" fontWeight="800" fill={k >= 4 ? '#fff' : '#3a3a3a'}>{f.n}</text>
            </g>
          )
        })}
        <text x="130" y="14" textAnchor="middle" fontSize="10" fontWeight="700">frío</text>
        <text x="130" y="325" textAnchor="middle" fontSize="10" fontWeight="700">caliente</text>
      </svg>
      <div className="max-w-xs rounded-xl bg-white p-4">
        <p className="text-xl font-black">{F.n}</p>
        <p className="text-sm font-bold">Sale a {F.t} · {F.c}</p>
        <p className="mt-2 text-sm">{F.u}</p>
        <p className="mt-3 text-xs opacity-70">↑/↓ o W/S: otra salida. Cada vapor se condensa a la altura donde la torre está más fría que su punto de ebullición: menos carbonos, más arriba.</p>
      </div>
    </div>
  )
}
