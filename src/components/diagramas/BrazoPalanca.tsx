import { useEffect, useState } from 'react'

// El brazo como palanca: A/D cambia el peso en la mano (0–10 kg) y W/S dónde se pega el músculo (más cerca o más
// lejos del codo). La fuerza del bíceps sale de la ley de la palanca: F × brazo de la fuerza = peso × brazo de la carga.
// Brazo de la carga fijo de 35 cm (codo a la mano); inserción del bíceps 3 a 8 cm (real ≈ 4 cm). Modelo de clase.

const CARGA_CM = 35

export default function BrazoPalanca() {
  const [kg, setKg] = useState(2)
  const [ins, setIns] = useState(4)
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const t = e.key.toLowerCase()
      if (t === 'd') setKg((v) => Math.min(10, v + 1))
      if (t === 'a') setKg((v) => Math.max(0, v - 1))
      if (t === 'w') setIns((v) => Math.min(8, v + 1))
      if (t === 's') setIns((v) => Math.max(3, v - 1))
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])

  const fuerzaKg = (kg * CARGA_CM) / ins
  const veces = CARGA_CM / ins
  const escala = 7 // px por cm
  const codo = 150
  const xIns = codo + ins * escala
  const xMano = codo + CARGA_CM * escala
  const grosor = 10 + Math.min(40, fuerzaKg / 2)

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 600 300" role="img" aria-label={`Peso ${kg} kg, el bíceps hace ${Math.round(fuerzaKg)} kg de fuerza`} className="mx-auto w-full max-w-3xl">
        <rect x="0" y="0" width="600" height="300" fill="#f3f0ea" />
        {/* húmero vertical y antebrazo horizontal */}
        <rect x={codo - 8} y="30" width="16" height="140" rx="8" fill="#efe6d0" stroke="#a89870" strokeWidth="2" />
        <rect x={codo} y="165" width={CARGA_CM * escala} height="16" rx="8" fill="#efe6d0" stroke="#a89870" strokeWidth="2" />
        {/* bíceps */}
        <path d={`M ${codo - 4} 40 Q ${codo + 30 + grosor / 2} ${100} ${xIns} 166`} fill="none" stroke="#c43c3c" strokeWidth={grosor} strokeLinecap="round" opacity="0.85" style={{ transition: 'all 0.5s ease' }} />
        <circle cx={codo} cy="173" r="10" fill="#9cc8ec" stroke="#2f6fc1" strokeWidth="2" />
        <text x={codo} y="205" textAnchor="middle" fontSize="12" fontWeight="800" fill="#2f6fc1">codo (punto de apoyo)</text>
        {/* peso */}
        <line x1={xMano} y1="181" x2={xMano} y2="215" stroke="#555" strokeWidth="3" />
        <rect x={xMano - 15 - kg * 2} y="215" width={30 + kg * 4} height={20 + kg * 3} rx="5" fill="#666" style={{ transition: 'all 0.4s ease' }} />
        <text x={xMano} y={232 + kg * 1.5} textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff">{kg} kg</text>
        {/* cotas */}
        <line x1={codo} y1="150" x2={xIns} y2="150" stroke="#c43c3c" strokeWidth="2" />
        <text x={(codo + xIns) / 2 + 12} y="145" textAnchor="middle" fontSize="11" fill="#c43c3c" fontWeight="800">{ins} cm</text>
        <line x1={codo} y1="275" x2={xMano} y2="275" stroke="#555" strokeWidth="2" />
        <text x={(codo + xMano) / 2} y="292" textAnchor="middle" fontSize="11" fill="#555" fontWeight="800">{CARGA_CM} cm</text>
        <text x="520" y="60" textAnchor="middle" fontSize="14" fontWeight="800" fill="#3a3a3a">El bíceps hace</text>
        <text x="520" y="92" textAnchor="middle" fontSize="28" fontWeight="900" fill="#c43c3c">{Math.round(fuerzaKg)} kg</text>
        <text x="520" y="114" textAnchor="middle" fontSize="12" fill="#555">de fuerza ({veces.toFixed(1).replace('.', ',')} veces el peso)</text>
      </svg>
      <p aria-live="polite" className="max-w-3xl text-center text-lg">
        Fuerza × {ins} cm = peso × {CARGA_CM} cm. El músculo se pega muy cerca del codo: hace mucha fuerza, pero a cambio la mano se mueve rápido y lejos con un pequeño acortamiento del músculo.
      </p>
      <p className="max-w-3xl text-center text-sm text-gray-600">A/D: menos o más peso en la mano · W/S: pegar el músculo más lejos o más cerca del codo (en una persona, unos 4 cm). Modelo de clase; no cuenta el peso del propio brazo.</p>
    </div>
  )
}
