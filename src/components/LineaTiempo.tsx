import { useState } from 'react'
import type { Bloque } from '../data/schema.ts'
import { NivelInsignia, BorradorInsignia } from './Insignia.tsx'

export default function LineaTiempo({ bloques }: { bloques: Bloque[] }) {
  const [abierto, setAbierto] = useState<string | null>(null)
  const ordenados = [...bloques].sort((a, b) => a.anio - b.anio)

  return (
    <ol className="relative ml-3 border-l-2 border-[var(--linea)]">
      {ordenados.map((b) => {
        const open = abierto === b.id
        return (
          <li key={b.id} className="mb-5 ml-6">
            <span className="absolute -left-[9px] mt-2 h-4 w-4 rounded-full border-2 border-[var(--acento)] bg-[var(--fondo)]" />
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setAbierto(open ? null : b.id)}
              className="w-full rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4 text-left transition hover:border-[var(--acento)]"
            >
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-[var(--acento)]">{b.anio}</span>
                <NivelInsignia nivel={b.nivel} />
                {!b.revisado && <BorradorInsignia />}
              </span>
              <span className="mt-1 block text-base font-semibold">{b.titulo}</span>
              <span className="mt-1 block text-sm text-[var(--suave)]">{b.resumen}</span>
            </button>

            {open && (
              <div className="mt-2 space-y-3 rounded-2xl bg-[var(--acento-suave)]/40 p-4 text-sm">
                {(b.ficha.quien || b.ficha.cuando) && (
                  <p className="text-[var(--suave)]">
                    {[b.ficha.quien, b.ficha.cuando].filter(Boolean).join(' · ')}
                  </p>
                )}
                <p>{b.ficha.idea}</p>
                {b.ficha.evidencia && (
                  <div>
                    <p className="font-semibold">Evidencia</p>
                    <ul className="ml-5 list-disc">
                      {b.ficha.evidencia.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {b.ficha.limites && (
                  <p>
                    <span className="font-semibold">Límites: </span>
                    {b.ficha.limites}
                  </p>
                )}
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}
