import { useState } from 'react'

// Rehacer la cuenta de Hooke: contar cavidades en una línea corta y proyectar a un volumen.
// Dato de partida (por verificar en el texto): unas 60 cavidades en 1/18 de pulgada.

const fmt = (n: number) => n.toLocaleString('es-CO')

export default function CalculoHooke() {
  const [n, setN] = useState(60)
  const porPulgada = n * 18
  const porPulgada2 = porPulgada ** 2
  const porPulgada3 = porPulgada ** 3
  const porCm3 = Math.round(porPulgada3 / 16.387064)

  return (
    <div>
      <p className="text-sm">
        Hooke no pudo contar mil millones de cavidades una por una. Contó las que caben en una línea muy corta y multiplicó. Rehaz su cuenta.
      </p>

      <div className="mt-3 rounded-xl bg-[var(--fondo)] p-3">
        <p className="text-sm font-semibold">1. Cuenta en una línea de 1/18 de pulgada (≈ 1,4 mm)</p>
        <svg viewBox="0 0 300 36" role="img" aria-label={`Línea con ${n} cavidades`} className="mt-2 w-full">
          <rect x="0" y="6" width="300" height="24" fill="#d9b77f" />
          {Array.from({ length: n }, (_, i) => {
            const w = 300 / n
            return <rect key={i} x={i * w + 0.4} y="8" width={Math.max(w - 0.8, 0.3)} height="20" fill="#f3e7c9" />
          })}
        </svg>
        <label htmlFor="cavidades" className="mt-2 flex items-center justify-between text-sm">
          <span>Cavidades contadas</span>
          <strong>{n}</strong>
        </label>
        <input
          id="cavidades"
          type="range"
          min="20"
          max="100"
          step="1"
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          onPointerUp={(e) => e.currentTarget.closest<HTMLElement>('[role=dialog]')?.focus()}
          className="h-8 w-full accent-[var(--acento)]"
        />
        <p className="text-xs text-[var(--suave)]">Hooke contó unas 60.</p>
      </div>

      <ol className="mt-3 space-y-2 text-sm">
        <li className="rounded-xl border border-[var(--linea)] p-3">
          <span className="font-semibold">2. En una pulgada de largo:</span> {n} × 18 = <strong>{fmt(porPulgada)}</strong>
        </li>
        <li className="rounded-xl border border-[var(--linea)] p-3">
          <span className="font-semibold">3. En una pulgada cuadrada (largo × ancho):</span> {fmt(porPulgada)}² = <strong>{fmt(porPulgada2)}</strong>
        </li>
        <li className="rounded-xl border border-[var(--linea)] p-3">
          <span className="font-semibold">4. En una pulgada cúbica (largo × ancho × alto):</span> {fmt(porPulgada)}³ = <strong>{fmt(porPulgada3)}</strong>
        </li>
      </ol>

      <div aria-live="polite" className="mt-3 rounded-xl bg-[var(--fondo)] p-3 text-sm">
        <p>
          Con tu conteo salen unos <strong>{fmt(porPulgada3)}</strong> de cavidades por pulgada cúbica, es decir, unos {fmt(porCm3)} por centímetro cúbico.
          {n === 60 && ' Es la cifra de Hooke: más de mil millones.'}
        </p>
        <p className="mt-1 text-[var(--suave)]">Una cuenta pequeña, hecha con una línea corta, le permitió estimar algo imposible de contar a mano. Además supone que las cavidades son parecidas en las tres direcciones.</p>
      </div>
    </div>
  )
}
