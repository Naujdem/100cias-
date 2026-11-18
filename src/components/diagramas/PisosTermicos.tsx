import { useState } from 'react'

import { PISOS } from '../escenas/EscenasEcologia.tsx'
// Pisos térmicos: un control de altitud (0–5700 m) muestra la temperatura aproximada y el piso térmico.
// Se usa la regla de unos 0,6 °C menos por cada 100 m, desde unos 30 °C a nivel del mar.


export default function PisosTermicos() {
  const [alt, setAlt] = useState(500)
  const t = 30 - (alt / 100) * 0.6
  const piso = PISOS.find((p) => alt >= p.desde && alt < p.hasta) ?? PISOS[PISOS.length - 1]
  const lugares = [
    { m: 450, n: 'Neiva ≈ 450 m' }, { m: 1300, n: 'Pitalito ≈ 1300 m' }, { m: 2600, n: 'Bogotá ≈ 2600 m' },
    { m: 3700, n: 'Páramo de Las Papas ≈ 3700 m' }, { m: 5350, n: 'Nevado del Huila ≈ 5360 m' },
  ]
  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex w-full max-w-xl items-center gap-3">
        <span className="text-sm font-bold">0 m</span>
        <input type="range" min={0} max={5700} step={50} value={alt} onChange={(e) => setAlt(Number(e.target.value))}
          aria-label="Altitud en metros" className="h-3 w-full accent-[var(--acento)]" />
        <span className="text-sm font-bold">5700 m</span>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {lugares.map((l) => (
          <button key={l.n} type="button" onClick={() => setAlt(l.m)} className="min-h-10 rounded-full border px-3 text-sm font-semibold">{l.n}</button>
        ))}
      </div>
      <div className="flex flex-wrap items-stretch justify-center gap-3">
        <div className="flex min-w-36 flex-col items-center justify-center rounded-2xl border-2 p-3">
          <span className="text-sm opacity-70">Altitud</span><span className="text-3xl font-black">{alt} m</span>
        </div>
        <div className="flex min-w-36 flex-col items-center justify-center rounded-2xl border-2 p-3">
          <span className="text-sm opacity-70">Temperatura media</span><span className="text-3xl font-black">≈ {Math.round(t)} °C</span>
        </div>
        <div className="flex min-w-48 flex-col items-center justify-center rounded-2xl border-2 p-3" style={{ background: piso.c }}>
          <span className="text-sm font-bold">Piso {piso.nombre.toLowerCase()}</span>
          <span className="text-center text-sm">{piso.ej}</span>
        </div>
      </div>
      <p aria-live="polite" className="text-center text-sm opacity-80">Usa las flechas del teclado sobre el control para subir o bajar. Las temperaturas son aproximadas.</p>
    </div>
  )
}
