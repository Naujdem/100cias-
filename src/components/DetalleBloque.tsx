import { useState } from 'react'
import type { Bloque } from '../data/schema.ts'
import { DIAGRAMAS } from './diagramas/index.ts'
import { NivelInsignia, BorradorInsignia } from './Insignia.tsx'

type Pestana = 'historia' | 'diagrama' | 'evidencia'

function iniciales(nombre: string): string {
  return nombre
    .split(/\s+/)
    .filter((p) => /^[A-ZÁÉÍÓÚ]/.test(p))
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
}

export default function DetalleBloque({ bloque: b, onCerrar }: { bloque: Bloque; onCerrar: () => void }) {
  const Diagrama = b.diagrama ? DIAGRAMAS[b.diagrama] : undefined
  const pestanas: { id: Pestana; texto: string }[] = [
    { id: 'historia', texto: 'Historia' },
    ...(Diagrama ? [{ id: 'diagrama' as Pestana, texto: 'Diagrama' }] : []),
    { id: 'evidencia', texto: 'Evidencia y límites' },
  ]
  const [activa, setActiva] = useState<Pestana>('historia')

  return (
    <article
      aria-label={b.titulo}
      className="mt-2 rounded-2xl border border-[var(--acento)] bg-[var(--tarjeta)] p-4 sm:p-5"
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-[var(--acento)]">{b.anio}</span>
            <NivelInsignia nivel={b.nivel} />
            {!b.revisado && <BorradorInsignia />}
          </p>
          <h3 className="mt-1 text-lg font-bold leading-snug">{b.titulo}</h3>
        </div>
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar detalle"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--linea)] text-lg"
        >
          ×
        </button>
      </header>

      <div role="tablist" aria-label="Secciones" className="mt-3 flex gap-1 overflow-x-auto border-b border-[var(--linea)]">
        {pestanas.map((p) => (
          <button
            key={p.id}
            role="tab"
            type="button"
            aria-selected={activa === p.id}
            onClick={() => setActiva(p.id)}
            className={`min-h-11 shrink-0 border-b-2 px-4 text-sm font-semibold ${
              activa === p.id ? 'border-[var(--acento)] text-[var(--acento)]' : 'border-transparent text-[var(--suave)]'
            }`}
          >
            {p.texto}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="mt-4 text-sm">
        {activa === 'historia' && (
          <div className="space-y-4">
            <p>{b.ficha.idea}</p>
            {b.autores?.map((a) => (
              <div key={a.nombre} className="flex gap-3 rounded-xl bg-[var(--fondo)] p-3">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--acento)] font-bold text-[var(--fondo)]"
                >
                  {iniciales(a.nombre)}
                </span>
                <div>
                  <p className="font-semibold">
                    {a.nombre} {a.vida && <span className="font-normal text-[var(--suave)]">({a.vida})</span>}
                  </p>
                  <p>{a.aporte}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activa === 'diagrama' && Diagrama && <Diagrama />}

        {activa === 'evidencia' && (
          <div className="space-y-3">
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
              <div>
                <p className="font-semibold">Límites</p>
                <p>{b.ficha.limites}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
