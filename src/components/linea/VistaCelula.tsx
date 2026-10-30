import { useState } from 'react'
import type { PropsVista } from './tipos.ts'
import { Lienzo } from '../ilustraciones/Dibujo.tsx'
import { CelulaAnimalCompleta, CelulaVegetalCompleta, PUNTOS_ANIMAL, PUNTOS_VEGETAL } from '../ilustraciones/CelulaEuc.tsx'
import InsigniaProgreso from '../InsigniaProgreso.tsx'

// Vista «Célula»: una célula grande que se toca. Cada orgánulo abre su paso; los que el perfil
// no tiene activos se ven apagados. Debajo, la lista de pasos como respaldo para teclado y lectores.

export default function VistaCelula({ bloques, abierto, onSeleccionar, carril, estados }: PropsVista) {
  const [tipo, setTipo] = useState<'animal' | 'vegetal'>('animal')
  const [hover, setHover] = useState<string | null>(null)
  const activos = new Set(bloques.map((b) => b.id))
  const puntos = tipo === 'animal' ? PUNTOS_ANIMAL : PUNTOS_VEGETAL
  const actual = puntos.find((p) => p.bloque === abierto)
  return (
    <div ref={carril} aria-label="Célula eucariota que se toca" className="mx-auto max-w-2xl">
      <div role="group" aria-label="Tipo de célula" className="mb-2 flex gap-2">
        {([['animal', 'Célula animal'], ['vegetal', 'Célula vegetal']] as const).map(([id, texto]) => (
          <button
            key={id}
            type="button"
            aria-pressed={tipo === id}
            onClick={() => setTipo(id)}
            className="min-h-10 rounded-full border border-[var(--acento)] px-3 text-sm font-semibold text-[var(--acento)] aria-pressed:bg-[var(--acento)] aria-pressed:text-white"
          >
            {texto}
          </button>
        ))}
      </div>
      <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--linea)]">
        <Lienzo etiqueta={`Célula ${tipo}: toca un orgánulo para abrir su paso`}>
          {tipo === 'animal' ? <CelulaAnimalCompleta resalta={hover ?? actual?.id} /> : <CelulaVegetalCompleta resalta={hover ?? actual?.id} />}
          {puntos.map((p) => {
            const on = activos.has(p.bloque)
            return (
              <g key={p.id}>
                {p.id === 'citoplasma' && <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fontStyle="italic" fill="#8a7a5a" pointerEvents="none">citoplasma</text>}
                {!on && <circle cx={p.x} cy={p.y} r={p.r} fill="#f4efe4" opacity="0.65" pointerEvents="none" />}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={p.r}
                  fill="transparent"
                  stroke="transparent"
                  strokeDasharray="4 4"
                  strokeWidth="2"
                  tabIndex={on ? 0 : -1}
                  role="button"
                  aria-label={on ? p.nombre : `${p.nombre}: oculto en tu perfil`}
                  aria-disabled={!on}
                  style={{ cursor: on ? 'pointer' : 'not-allowed', outlineOffset: 2 }}
                  onMouseEnter={() => on && setHover(p.id)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => on && setHover(p.id)}
                  onBlur={() => setHover(null)}
                  onClick={() => on && onSeleccionar(p.bloque)}
                  onKeyDown={(e) => {
                    if (on && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault()
                      onSeleccionar(p.bloque)
                    }
                  }}
                />
              </g>
            )
          })}
        </Lienzo>
      </div>
      <p className="mt-1 text-xs text-[var(--suave)]">Toca un orgánulo, o elige un paso de la lista. {hover ? `· ${puntos.find((p) => p.id === hover)?.nombre}` : ''}</p>
      <ol className="mt-3 grid gap-2 sm:grid-cols-2">
        {bloques.map((b, i) => (
          <li key={b.id}>
            <button
              type="button"
              data-hito={b.id}
              aria-expanded={abierto === b.id}
              onClick={() => onSeleccionar(b.id)}
              className={`flex w-full items-start justify-between gap-2 rounded-xl border-2 px-3 py-2 text-left transition focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[var(--tinta)] ${
                abierto === b.id ? 'border-[var(--acento)] bg-[var(--acento-suave)]/50' : 'border-[var(--linea)] bg-[var(--tarjeta)] hover:border-[var(--acento)]'
              }`}
            >
              <span className="min-w-0">
                <span className="block text-sm font-semibold leading-snug">
                  {b.etiqueta ?? i + 1} · {b.titulo}
                </span>
                <span className="block text-xs text-[var(--suave)]">{b.resumen}</span>
              </span>
              <InsigniaProgreso estado={estados?.[b.id]} />
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
