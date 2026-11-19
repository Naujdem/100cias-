import { useEffect, useState } from 'react'

// El cuerpo como termostato: se cambia la temperatura del ambiente (A/D o la barra) y se prende o apaga el ejercicio
// (E). El cuerpo responde (sudor, vasos abiertos, temblor, vasos cerrados) y la temperatura interna se queda cerca de
// 37 °C mientras las respuestas alcanzan. Modelo de clase, no fisiológico: los límites (0 °C y 40 °C) son aproximados.

const MIN = -10
const MAX = 50

function cuerpo(amb: number, ejercicio: boolean) {
  const calorExtra = ejercicio ? 8 : 0 // el ejercicio produce calor: es como si el ambiente estuviera más caliente
  const efectivo = amb + calorExtra
  let interna = 37
  if (efectivo > 40) interna = 37 + (efectivo - 40) * 0.3
  if (efectivo < 0) interna = 37 + efectivo * 0.2
  const sudor = Math.max(0, Math.min(1, (efectivo - 28) / 12))
  const temblor = Math.max(0, Math.min(1, (18 - efectivo) / 18))
  return { interna, sudor, temblor, efectivo }
}

export default function TermostatoCuerpo() {
  const [amb, setAmb] = useState(22)
  const [ejercicio, setEjercicio] = useState(false)
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const t = e.key.toLowerCase()
      if (t === 'd') setAmb((v) => Math.min(MAX, v + 2))
      if (t === 'a') setAmb((v) => Math.max(MIN, v - 2))
      if (t === 'e') setEjercicio((v) => !v)
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])

  const { interna, sudor, temblor } = cuerpo(amb, ejercicio)
  const tt = 'all 0.6s ease'
  const piel = sudor > 0.2 ? '#e8957a' : temblor > 0.3 ? '#d9c3b6' : '#e9b98f'
  const fondo = amb >= 32 ? '#fbe2c8' : amb <= 10 ? '#dce8f3' : '#eef3ea'
  const fuera = interna > 38 ? 'calor' : interna < 36 ? 'frio' : 'bien'
  const fmt = (n: number) => `${n.toFixed(1).replace('.', ',')} °C`
  const mensaje =
    fuera === 'calor'
      ? '⚠️ El sudor ya no alcanza: la temperatura interna sube (golpe de calor). Hay que buscar sombra, agua y descanso.'
      : fuera === 'frio'
        ? '⚠️ El temblor ya no alcanza: la temperatura interna baja (hipotermia). Hay que abrigarse y buscar calor.'
        : sudor > 0.05
          ? '💧 Hace calor: el cuerpo suda y abre los vasos de la piel para soltar calor. Por dentro sigue cerca de 37 °C.'
          : temblor > 0.05
            ? '🥶 Hace frío: el cuerpo cierra los vasos de la piel y tiembla para producir calor. Por dentro sigue cerca de 37 °C.'
            : '🙂 Ambiente cómodo: el cuerpo casi no tiene que hacer nada.'
  const nivel = Math.max(0, Math.min(1, (interna - 33) / 9))

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 600 320" role="img" aria-label={`Ambiente ${amb} °C, temperatura interna ${fmt(interna)}`} className="mx-auto w-full max-w-3xl">
        <rect x="0" y="0" width="600" height="320" fill={fondo} style={{ transition: tt }} />
        <text x="140" y="40" textAnchor="middle" fontSize="18" fontWeight="800" fill="#3a3a3a">Ambiente: {amb} °C</text>
        <text x="140" y="70" textAnchor="middle" fontSize="30">{amb >= 32 ? '☀️' : amb <= 10 ? '❄️' : '⛅'}</text>
        {/* persona */}
        <g transform="translate(300 230)" className={temblor > 0.5 ? 'animate-pulse' : ''}>
          <circle cx="0" cy="-120" r="24" fill={piel} style={{ transition: tt }} />
          <path d="M -32 -90 Q 0 -100 32 -90 L 36 0 H -36 Z" fill={ejercicio ? '#3f9a5a' : '#4f7fa8'} style={{ transition: tt }} />
          <path d={ejercicio ? 'M -32 -88 L -58 -40 M 32 -88 L 58 -130' : 'M -32 -88 L -52 -14 M 32 -88 L 52 -14'} stroke={piel} strokeWidth="13" strokeLinecap="round" style={{ transition: tt }} />
          <path d={ejercicio ? 'M -18 0 L -40 75 M 18 0 L 30 75' : 'M -18 0 L -20 80 M 18 0 L 20 80'} stroke="#5a5048" strokeWidth="15" strokeLinecap="round" style={{ transition: tt }} />
          {[[-12, -70], [14, -55], [-20, -35], [18, -25], [0, -108]].map(([x, y], k) => (
            <path key={k} d={`M ${x} ${y} q -5 9 0 12 q 5 -3 0 -12`} fill="#2f7fc1" style={{ transition: tt, opacity: sudor > k * 0.18 ? 1 : 0 }} />
          ))}
          {temblor > 0.05 && (
            <path d="M -62 -80 l -9 7 l 9 7 l -9 7 M 62 -80 l 9 7 l -9 7 l 9 7" fill="none" stroke="#2f7fc1" strokeWidth="3" opacity={0.3 + temblor * 0.7} />
          )}
        </g>
        {/* termómetro interno */}
        <rect x="480" y="50" width="34" height="210" rx="17" fill="#fff" stroke="#888" strokeWidth="3" />
        <rect x="488" y={250 - 190 * nivel} width="18" height={190 * nivel + 10} rx="9" fill={fuera === 'bien' ? '#3f9a5a' : fuera === 'calor' ? '#c43c3c' : '#2f7fc1'} style={{ transition: tt }} />
        <circle cx="497" cy="270" r="22" fill={fuera === 'bien' ? '#3f9a5a' : fuera === 'calor' ? '#c43c3c' : '#2f7fc1'} style={{ transition: tt }} />
        <text x="497" y="38" textAnchor="middle" fontSize="13" fontWeight="800" fill="#3a3a3a">Por dentro</text>
        <text x="497" y="312" textAnchor="middle" fontSize="18" fontWeight="900" fill="#3a3a3a">{fmt(interna)}</text>
        {/* respuestas */}
        <text x="140" y="140" textAnchor="middle" fontSize="14" fontWeight="800" fill="#3a3a3a">Respuestas</text>
        <text x="140" y="170" textAnchor="middle" fontSize="13" fill="#2f7fc1" opacity={sudor > 0.05 ? 1 : 0.25}>💧 sudor {Math.round(sudor * 100)} %</text>
        <text x="140" y="195" textAnchor="middle" fontSize="13" fill="#c43c3c" opacity={sudor > 0.05 ? 1 : 0.25}>🔴 vasos de la piel abiertos</text>
        <text x="140" y="220" textAnchor="middle" fontSize="13" fill="#2f7fc1" opacity={temblor > 0.05 ? 1 : 0.25}>🥶 temblor {Math.round(temblor * 100)} %</text>
        <text x="140" y="245" textAnchor="middle" fontSize="13" fill="#555" opacity={temblor > 0.05 ? 1 : 0.25}>⚪ vasos de la piel cerrados</text>
        <text x="140" y="270" textAnchor="middle" fontSize="13" fill="#3f9a5a" opacity={ejercicio ? 1 : 0.25}>🏃 ejercicio: más calor por dentro</text>
      </svg>
      <input type="range" min={MIN} max={MAX} step={1} value={amb} onChange={(e) => setAmb(Number(e.target.value))} aria-label="Temperatura del ambiente" className="w-full max-w-xl" />
      <p aria-live="polite" className="max-w-3xl text-center text-lg">{mensaje}</p>
      <div className="flex flex-wrap justify-center gap-2">
        <button onClick={() => setEjercicio((v) => !v)} className={`rounded-xl border-2 px-3 py-1.5 font-bold ${ejercicio ? 'border-[#3f9a5a] bg-[#eef7f0]' : 'border-gray-300 bg-white'}`}>
          <span className="mr-1 rounded bg-gray-700 px-1.5 text-white">E</span>Ejercicio: {ejercicio ? 'sí' : 'no'}
        </button>
      </div>
      <p className="max-w-3xl text-center text-sm text-gray-600">A/D: bajar o subir la temperatura del ambiente. Prueba con mucho calor y ejercicio a la vez. Modelo sencillo para la clase: los límites son aproximados.</p>
    </div>
  )
}
