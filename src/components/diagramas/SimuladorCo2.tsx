import { useEffect, useState } from 'react'

// Simulador sencillo: se sube o baja el CO₂ del aire (A/D o los botones; 1, 2 y 3 son atajos a 1750, hoy y el doble)
// y se ve el calentamiento al que tiende el planeta, con una sensibilidad de 3 °C por cada vez que se duplica el CO₂
// (valor central del IPCC). Es el calentamiento «a la larga», cuando el clima se equilibra; hoy vamos en algo más
// de 1 °C porque el océano tarda en calentarse.

const MIN = 180
const MAX = 840
const HOY = 425
const calentamiento = (ppm: number) => 3 * Math.log2(ppm / 280)

const EFECTOS: { desde: number; ic: string; t: string }[] = [
  { desde: -9, ic: '🧊', t: 'Más frío que antes de la industria: así eran las glaciaciones (unos 180 ppm).' },
  { desde: -0.3, ic: '🌍', t: 'El clima de antes de la Revolución Industrial.' },
  { desde: 0.6, ic: '🏔️', t: 'Los glaciares de montaña retroceden y hay más olas de calor.' },
  { desde: 1.5, ic: '🌊', t: 'Desaparecen casi todos los nevados tropicales; más sequías y lluvias extremas; sube el mar.' },
  { desde: 2.5, ic: '🔥', t: 'Muchos arrecifes de coral mueren; las cosechas sufren; el mar sube más.' },
  { desde: 3.5, ic: '⚠️', t: 'Cambios muy graves: muchas especies no alcanzan a adaptarse.' },
]

export default function SimuladorCo2() {
  const [ppm, setPpm] = useState(HOY)
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const t = e.key.toLowerCase()
      if (t === 'd') setPpm((v) => Math.min(MAX, v + 20))
      if (t === 'a') setPpm((v) => Math.max(MIN, v - 20))
      if (t === '1') setPpm(280)
      if (t === '2') setPpm(HOY)
      if (t === '3') setPpm(560)
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])

  const dT = calentamiento(ppm)
  const efecto = [...EFECTOS].reverse().find((e) => dT >= e.desde)!
  const tt = 'all 0.6s ease'
  const nivel = Math.max(0, Math.min(1, (dT + 3) / 9)) // 0 a 1 para el termómetro
  const nieve = Math.max(0, Math.min(1, 1 - (dT + 1) / 3.5))
  const tierra = dT > 2.5 ? '#c8a060' : dT > 1 ? '#a8a85a' : '#6a9a4a'
  const fmt = (n: number) => `${n >= 0 ? '+' : '−'}${Math.abs(n).toFixed(1).replace('.', ',')} °C`

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 600 320" role="img" aria-label={`CO₂ ${ppm} ppm, calentamiento ${fmt(dT)}`} className="mx-auto w-full max-w-3xl">
        <rect x="0" y="0" width="600" height="320" fill="#e7f1f8" />
        {/* cobija de gases */}
        <path d="M 0 80 Q 220 40 440 80" fill="none" stroke="#9aa8b4" strokeWidth={4 + (ppm / MAX) * 30} opacity="0.5" style={{ transition: tt }} />
        <text x="220" y="40" textAnchor="middle" fontSize="15" fontWeight="800" fill="#3a3a3a">{ppm} ppm de CO₂</text>
        {/* montaña con nieve */}
        <polygon points="40,260 220,90 400,260" fill="#7a746c" />
        <polygon points={`${220 - 70 * nieve},${90 + 74 * nieve} 220,90 ${220 + 70 * nieve},${90 + 74 * nieve}`} fill="#fff" style={{ transition: tt }} />
        <rect x="0" y="255" width="440" height="65" fill={tierra} style={{ transition: tt }} />
        {/* termómetro */}
        <rect x="490" y="40" width="34" height="220" rx="17" fill="#fff" stroke="#888" strokeWidth="3" />
        <rect x="498" y={250 - 200 * nivel} width="18" height={200 * nivel + 10} rx="9" fill={dT > 1.5 ? '#c43c3c' : dT > 0.3 ? '#e08a2e' : '#2f7fc1'} style={{ transition: tt }} />
        <circle cx="507" cy="268" r="22" fill={dT > 1.5 ? '#c43c3c' : dT > 0.3 ? '#e08a2e' : '#2f7fc1'} style={{ transition: tt }} />
        <text x="507" y="306" textAnchor="middle" fontSize="18" fontWeight="900" fill="#3a3a3a">{fmt(dT)}</text>
      </svg>
      <input type="range" min={MIN} max={MAX} step={5} value={ppm} onChange={(e) => setPpm(Number(e.target.value))} aria-label="CO₂ en partes por millón" className="w-full max-w-xl" />
      <p aria-live="polite" className="max-w-3xl text-center text-lg"><span className="mr-2 text-2xl">{efecto.ic}</span>{efecto.t}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {[[280, '1', 'Antes de la industria (1750)'], [HOY, '2', 'Hoy'], [560, '3', 'El doble']].map(([v, k, n]) => (
          <button key={k} onClick={() => setPpm(Number(v))} className={`rounded-xl border-2 px-3 py-1.5 font-bold ${ppm === v ? 'border-[#3f9a5a] bg-[#eef7f0]' : 'border-gray-300 bg-white'}`}>
            <span className="mr-1 rounded bg-gray-700 px-1.5 text-white">{k}</span>{n} · {v} ppm
          </button>
        ))}
      </div>
      <p className="max-w-3xl text-center text-sm text-gray-600">A/D: bajar o subir el CO₂. El número es el calentamiento al que tiende el planeta a la larga; hoy ya vamos en algo más de 1 °C y el resto viene en camino.</p>
    </div>
  )
}
