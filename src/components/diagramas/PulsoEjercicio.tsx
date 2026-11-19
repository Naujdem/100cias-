import { useEffect, useState } from 'react'

// Pulso y respiración según la actividad (A/D o 1–4). El corazón y los pulmones laten al ritmo indicado.
// Valores de referencia para un adolescente sano; aproximados, para la clase.

const NIVELES = [
  { n: 'Durmiendo', ic: '😴', pulso: 60, resp: 12, o2: 'poco', t: 'Los músculos casi no gastan oxígeno.' },
  { n: 'Sentado en clase', ic: '🧑‍🎓', pulso: 75, resp: 16, o2: 'normal', t: 'Ritmo de reposo.' },
  { n: 'Caminando rápido', ic: '🚶', pulso: 110, resp: 25, o2: 'más', t: 'Los músculos piden más oxígeno: el corazón y la respiración se aceleran.' },
  { n: 'Corriendo', ic: '🏃', pulso: 170, resp: 45, o2: 'mucho', t: 'Al máximo: más latidos y respiraciones para llevar O₂ y sacar CO₂.' },
]

export default function PulsoEjercicio() {
  const [k, setK] = useState(1)
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const t = e.key.toLowerCase()
      if (t === 'd') setK((v) => Math.min(3, v + 1))
      if (t === 'a') setK((v) => Math.max(0, v - 1))
      if (['1', '2', '3', '4'].includes(t)) setK(Number(t) - 1)
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])
  const nv = NIVELES[k]
  const latido = `${(60 / nv.pulso).toFixed(2)}s`
  const respiro = `${(60 / nv.resp).toFixed(2)}s`

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <svg key={k} viewBox="0 0 600 300" role="img" aria-label={`${nv.n}: ${nv.pulso} latidos y ${nv.resp} respiraciones por minuto`} className="mx-auto w-full max-w-3xl">
        <rect x="0" y="0" width="600" height="300" fill="#f3f0ea" />
        <text x="300" y="60" textAnchor="middle" fontSize="54">{nv.ic}</text>
        <text x="300" y="95" textAnchor="middle" fontSize="16" fontWeight="800" fill="#3a3a3a">{nv.n}</text>
        {/* corazón */}
        <g transform="translate(130 180)">
          <path d="M 0 -20 C -30 -55 -70 -15 0 40 C 70 -15 30 -55 0 -20 Z" fill="#c43c3c">
            <animateTransform attributeName="transform" type="scale" values="1;1.18;1" dur={latido} repeatCount="indefinite" />
          </path>
          <text x="0" y="80" textAnchor="middle" fontSize="26" fontWeight="900" fill="#c43c3c">{nv.pulso}</text>
          <text x="0" y="100" textAnchor="middle" fontSize="12" fill="#555">latidos por minuto</text>
        </g>
        {/* pulmones */}
        <g transform="translate(470 175)">
          <g>
            <path d="M -8 -40 C -45 -45 -55 0 -50 30 C -45 45 -15 45 -8 30 Z M 8 -40 C 45 -45 55 0 50 30 C 45 45 15 45 8 30 Z" fill="#e8a0a8" stroke="#c46a7a" strokeWidth="2" />
            <animateTransform attributeName="transform" type="scale" values="1;1.15;1" dur={respiro} repeatCount="indefinite" />
          </g>
          <text x="0" y="85" textAnchor="middle" fontSize="26" fontWeight="900" fill="#2f6fc1">{nv.resp}</text>
          <text x="0" y="105" textAnchor="middle" fontSize="12" fill="#555">respiraciones por minuto</text>
        </g>
        <text x="300" y="180" textAnchor="middle" fontSize="14" fill="#3a3a3a">Oxígeno que piden</text>
        <text x="300" y="200" textAnchor="middle" fontSize="14" fill="#3a3a3a">los músculos: <tspan fontWeight="900">{nv.o2}</tspan></text>
      </svg>
      <p aria-live="polite" className="max-w-3xl text-center text-lg">{nv.t}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {NIVELES.map((x, j) => (
          <button key={x.n} onClick={() => setK(j)} className={`rounded-xl border-2 px-3 py-1.5 font-bold ${k === j ? 'border-[#3f9a5a] bg-[#eef7f0]' : 'border-gray-300 bg-white'}`}>
            <span className="mr-1 rounded bg-gray-700 px-1.5 text-white">{j + 1}</span>{x.ic} {x.n}
          </button>
        ))}
      </div>
      <p className="max-w-3xl text-center text-sm text-gray-600">A/D o 1–4: cambiar la actividad. Valores aproximados de un adolescente sano. Para medir de verdad: dos dedos en la muñeca o el cuello, contar 15 segundos y multiplicar por 4.</p>
    </div>
  )
}
