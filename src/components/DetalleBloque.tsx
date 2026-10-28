import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { Bloque } from '../data/schema.ts'
import { DIAGRAMAS } from './diagramas/index.ts'
import { NivelInsignia, BorradorInsignia } from './Insignia.tsx'
import Retrato from './Retrato.tsx'
import Ilustraciones from './Ilustraciones.tsx'

type Pestana = 'historia' | 'diagrama' | 'evidencia'

const FOCALIZABLES = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Recuadro emergente con la ficha de un hito: retrato y descripción a la izquierda,
 * pestañas y contenido a la derecha. Se cierra con la X, con Esc o tocando fuera.
 */
export default function DetalleBloque({ bloque: b, onCerrar }: { bloque: Bloque; onCerrar: () => void }) {
  const idTitulo = useId()
  const caja = useRef<HTMLDivElement>(null)
  const Diagrama = b.diagrama ? DIAGRAMAS[b.diagrama] : undefined
  const pestanas: { id: Pestana; texto: string }[] = [
    { id: 'historia', texto: 'Historia' },
    ...(Diagrama ? [{ id: 'diagrama' as Pestana, texto: 'Diagrama' }] : []),
    { id: 'evidencia', texto: 'Evidencia y límites' },
  ]
  const [activa, setActiva] = useState<Pestana>('historia')
  const [principal, ...otros] = b.autores ?? []

  // Foco: entra al diálogo y, al cerrar, vuelve a donde estaba.
  useEffect(() => {
    const previo = document.activeElement as HTMLElement | null
    caja.current?.focus()
    return () => previo?.focus?.()
  }, [])

  const alTeclear = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onCerrar()
      return
    }
    if (e.key !== 'Tab' || !caja.current) return
    const lista = [...caja.current.querySelectorAll<HTMLElement>(FOCALIZABLES)].filter((x) => !x.hasAttribute('disabled'))
    if (!lista.length) return
    const primero = lista[0]
    const ultimo = lista[lista.length - 1]
    if (e.shiftKey && (document.activeElement === primero || document.activeElement === caja.current)) {
      e.preventDefault()
      ultimo.focus()
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault()
      primero.focus()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault() // evita que el clic le quite el foco al botón al que debe volver
          onCerrar()
        }
      }}
    >
      <div
        ref={caja}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        tabIndex={-1}
        onKeyDown={alTeclear}
        className="relative max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-[var(--tarjeta)] shadow-2xl outline-none"
      >
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--fondo)] text-xl shadow ring-1 ring-[var(--linea)]"
        >
          ×
        </button>

        <div className={`grid gap-5 p-4 sm:p-6 ${principal ? 'md:grid-cols-[14rem_1fr]' : ''}`}>
          {principal && (
            <aside className="flex gap-4 md:block">
              <div className="w-28 shrink-0 md:w-full">
                <Retrato autor={principal} />
              </div>
              <div className="min-w-0 text-sm md:mt-3">
                <p>{principal.aporte}</p>
                {principal.imagen ? (
                  principal.credito && <p className="mt-2 text-xs text-[var(--suave)]">{principal.credito}</p>
                ) : (
                  <p className="mt-2 text-xs text-[var(--suave)]">Silueta ilustrativa, no es un retrato.</p>
                )}
                {otros.map((a) => (
                  <p key={a.nombre} className="mt-3 border-t border-[var(--linea)] pt-3">
                    <span className="font-semibold">{a.nombre}</span>
                    {a.vida && <span className="text-[var(--suave)]"> ({a.vida})</span>}. {a.aporte}
                  </p>
                ))}
              </div>
            </aside>
          )}

          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-2 pr-12">
              <span className="text-sm font-semibold text-[var(--acento)]">{b.anio}</span>
              <NivelInsignia nivel={b.nivel} />
              {!b.revisado && <BorradorInsignia />}
            </p>
            <h3 id={idTitulo} className="mt-1 pr-12 text-xl font-bold leading-snug">
              {b.titulo}
            </h3>

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
                <div className="space-y-3">
                  {!principal && (b.ficha.quien || b.ficha.cuando) ? (
                    <p className="text-[var(--suave)]">{[b.ficha.quien, b.ficha.cuando].filter(Boolean).join(' · ')}</p>
                  ) : null}
                  <p>{b.ficha.idea}</p>
                  {b.ilustraciones && <Ilustraciones items={b.ilustraciones} />}
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
          </div>
        </div>
      </div>
    </div>
  )
}
