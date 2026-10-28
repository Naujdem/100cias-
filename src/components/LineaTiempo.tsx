import { useEffect, useRef, useState } from 'react'
import type { Bloque } from '../data/schema.ts'
import DetalleBloque from './DetalleBloque.tsx'

export default function LineaTiempo({ bloques }: { bloques: Bloque[] }) {
  const [abierto, setAbierto] = useState<string | null>(null)
  const carril = useRef<HTMLDivElement>(null)
  const ordenados = [...bloques].sort((a, b) => a.anio - b.anio)

  // Si el bloque abierto se desactiva, se cierra el detalle.
  useEffect(() => {
    if (abierto && !bloques.some((b) => b.id === abierto)) setAbierto(null)
  }, [bloques, abierto])

  const mover = (dir: 1 | -1) => carril.current?.scrollBy({ left: dir * 260, behavior: 'smooth' })
  const seleccionado = ordenados.find((b) => b.id === abierto)

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm text-[var(--suave)]">Toca un hito para ver más.</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => mover(-1)}
            aria-label="Desplazar a la izquierda"
            className="h-11 w-11 rounded-full border border-[var(--linea)] bg-[var(--tarjeta)]"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => mover(1)}
            aria-label="Desplazar a la derecha"
            className="h-11 w-11 rounded-full border border-[var(--linea)] bg-[var(--tarjeta)]"
          >
            ›
          </button>
        </div>
      </div>

      <div ref={carril} className="snap-x snap-proximity overflow-x-auto pb-3" tabIndex={0} aria-label="Línea de tiempo, desplazable">
        <ol className="flex min-w-max">
          {ordenados.map((b) => {
            const sel = abierto === b.id
            return (
              <li
                key={b.id}
                className="relative w-52 shrink-0 snap-center px-2 before:absolute before:left-0 before:right-0 before:top-[3.25rem] before:h-0.5 before:bg-[var(--linea)] first:before:left-1/2 last:before:right-1/2"
              >
                <p className="text-center text-sm font-bold text-[var(--acento)]">{b.anio}</p>
                <button
                  type="button"
                  aria-expanded={sel}
                  aria-label={`${b.anio}: ${b.titulo}`}
                  onClick={() => setAbierto(sel ? null : b.id)}
                  className="relative z-10 mx-auto mt-2 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-[var(--acento)] transition"
                  style={{ background: sel ? 'var(--acento)' : 'var(--fondo)' }}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${sel ? 'bg-[var(--fondo)]' : 'bg-[var(--acento)]'}`} />
                </button>
                <button
                  type="button"
                  tabIndex={-1}
                  aria-hidden="true"
                  onClick={() => setAbierto(sel ? null : b.id)}
                  className={`mt-3 block w-full rounded-2xl border p-3 text-left transition ${
                    sel ? 'border-[var(--acento)] bg-[var(--acento-suave)]/40' : 'border-[var(--linea)] bg-[var(--tarjeta)]'
                  }`}
                >
                  <span className="block text-sm font-semibold leading-snug">{b.titulo}</span>
                  <span className="mt-1 block text-xs text-[var(--suave)]">{b.resumen}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      {seleccionado && (
        <DetalleBloque key={seleccionado.id} bloque={seleccionado} onCerrar={() => setAbierto(null)} />
      )}
    </div>
  )
}
