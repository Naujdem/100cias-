import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { Autor, Bloque } from '../data/schema.ts'
import { DIAGRAMAS } from './diagramas/index.tsx'
import { NivelInsignia, BorradorInsignia } from './Insignia.tsx'
import Retrato from './Retrato.tsx'
import Ilustraciones from './Ilustraciones.tsx'
import Acordeon from './Acordeon.tsx'
import Cuaderno from './Cuaderno.tsx'
import { enviarFlecha, moverDeslizador } from '../lib/flechasDiagrama.ts'

type Pestana = 'historia' | 'diagrama' | 'evidencia' | 'cuaderno'

/** Línea sobre la naturaleza de la imagen y, plegado, su crédito y licencia. No muestra nada si el autor no tiene imagen. */
function PieImagen({ autor }: { autor: Autor }) {
  if (!autor.imagen) return null
  return (
    <>
      {autor.pieImagen && <p className="mt-2 text-xs text-[var(--suave)]">{autor.pieImagen}</p>}
      {autor.credito && (
        <details className="mt-1 text-xs text-[var(--suave)]">
          <summary className="cursor-pointer">Crédito de la imagen</summary>
          <p className="mt-1">{autor.credito}</p>
        </details>
      )}
    </>
  )
}

const plural = (u: string) => (/[aeiou]$/i.test(u) ? `${u.toLowerCase()}s` : `${u.toLowerCase()}es`)

const FOCALIZABLES = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Recuadro emergente con la ficha de un hito: retrato y descripción a la izquierda,
 * pestañas y contenido a la derecha. Se cierra con la X, con Esc o tocando fuera.
 */
interface Props {
  bloque: Bloque
  onCerrar: () => void
  /** posición del hito en la línea de tiempo, para el contador y los botones Anterior/Siguiente */
  posicion?: { actual: number; total: number }
  onAnterior?: () => void
  onSiguiente?: () => void
  /** cómo se llama cada bloque en el contador («Hito», «Nivel») */
  unidad?: string
}

export default function DetalleBloque({ bloque: b, onCerrar, posicion, onAnterior, onSiguiente, unidad = 'Hito' }: Props) {
  const idTitulo = useId()
  const caja = useRef<HTMLDivElement>(null)
  const Diagrama = b.diagrama ? DIAGRAMAS[b.diagrama] : undefined
  const pestanas: { id: Pestana; texto: string }[] = [
    { id: 'historia', texto: b.etiqueta ? 'Idea' : 'Historia' },
    ...(Diagrama ? [{ id: 'diagrama' as Pestana, texto: 'Diagrama' }] : []),
    { id: 'evidencia', texto: b.etiqueta ? 'Ejemplos y límites' : 'Evidencia y límites' },
    ...(b.ficha.cuaderno ? [{ id: 'cuaderno' as Pestana, texto: 'Para el cuaderno' }] : []),
  ]
  const [activa, setActiva] = useState<Pestana>('historia')
  const activaRef = useRef(activa)
  activaRef.current = activa
  const [principal, ...otros] = b.autores ?? []

  // Foco: entra al diálogo y, al cerrar, vuelve a donde estaba.
  useEffect(() => {
    const previo = document.activeElement as HTMLElement | null
    caja.current?.focus()
    return () => previo?.focus?.()
  }, [])

  // Teclado (pensado para el aula, sin mouse). Se escucha en todo el documento para que funcione
  // aunque el foco esté en el fondo del recuadro. Se ejecuta en la fase de captura.
  useEffect(() => {
    const ids = pestanas.map((p) => p.id)
    const alTeclear = (e: globalThis.KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key === 'Escape') {
        // si hay un diagrama en pantalla completa de respaldo, Esc sale de él primero
        if (caja.current?.querySelector('[data-fs="true"]')) return
        e.preventDefault()
        e.stopPropagation()
        onCerrar()
        return
      }
      const t = e.target as HTMLElement | null
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return
      // con zoom, las flechas mueven la imagen (las maneja el visor)
      if (t?.closest('[data-zoomed="true"]') && e.key.startsWith('Arrow')) return

      // En Diagrama y Para el cuaderno, ← → son de la pestaña: cambian el control principal
      // (paso, días, aumento, caso, nivel). Los hitos se cambian con RePág/AvPág o con los botones.
      const enControles = activaRef.current === 'diagrama' || activaRef.current === 'cuaderno'
      if (enControles && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        const dir = e.key === 'ArrowRight' ? 1 : -1
        const panel = caja.current?.querySelector<HTMLElement>('[data-diagrama]')
        if (enviarFlecha(dir) || (activaRef.current === 'diagrama' && panel && moverDeslizador(panel, dir))) {
          e.preventDefault()
          e.stopPropagation()
          return
        }
      }
      // Espacio o Enter pulsan el botón principal del diagrama (Dividir, Romper el cuello…) si el foco no está en un control
      if (activaRef.current === 'diagrama' && (e.key === 'Enter' || e.key === ' ') && !(t && /^(BUTTON|A|SUMMARY)$/.test(t.tagName))) {
        const principalBtn = caja.current?.querySelector<HTMLButtonElement>('[data-principal]:not([disabled])')
        if (principalBtn) {
          e.preventDefault()
          e.stopPropagation()
          principalBtn.click()
          return
        }
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        const siguiente = e.key === 'ArrowRight' || e.key === 'PageDown'
        const ir = siguiente ? onSiguiente : onAnterior
        if (ir) {
          e.preventDefault()
          e.stopPropagation()
          ir()
        }
        return
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        e.stopPropagation()
        const d = e.key === 'ArrowDown' ? 1 : -1
        setActiva((a) => ids[(ids.indexOf(a) + d + ids.length) % ids.length])
      }
    }
    document.addEventListener('keydown', alTeclear, true)
    return () => document.removeEventListener('keydown', alTeclear, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onCerrar, onSiguiente, onAnterior, Diagrama])

  const alTeclear = (e: KeyboardEvent<HTMLDivElement>) => {
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
                {principal.imagen ? <PieImagen autor={principal} /> : <p className="mt-2 text-xs text-[var(--suave)]">Silueta ilustrativa, no es un retrato.</p>}
                {otros.map((a) => (
                  <div key={a.nombre} className="mt-3 border-t border-[var(--linea)] pt-3">
                    {a.imagen && (
                      <div className="mb-2 w-24 md:w-32">
                        <Retrato autor={a} />
                      </div>
                    )}
                    <p>
                      <span className="font-semibold">{a.nombre}</span>
                      {a.vida && <span className="text-[var(--suave)]"> ({a.vida})</span>}. {a.aporte}
                    </p>
                    <PieImagen autor={a} />
                  </div>
                ))}
              </div>
            </aside>
          )}

          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-2 pr-12">
              <span className="text-sm font-semibold text-[var(--acento)]">{b.etiqueta ?? b.anio}</span>
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
                  {b.ficha.contexto && (
                    <Acordeon
                      key={b.id}
                      items={b.ficha.contexto.map((c) => ({ id: c.titulo, titulo: c.titulo, contenido: <p>{c.texto}</p> }))}
                    />
                  )}
                </div>
              )}

              {activa === 'diagrama' && Diagrama && (
                <div data-diagrama>
                  <Diagrama />
                </div>
              )}

              {activa === 'cuaderno' && b.ficha.cuaderno && <Cuaderno cuaderno={b.ficha.cuaderno} titulo={b.titulo} />}

              {activa === 'evidencia' && (
                <div className="space-y-3">
                  {b.ficha.evidencia && (
                    <div>
                      <p className="font-semibold">{b.etiqueta ? 'Ejemplos' : 'Evidencia'}</p>
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

        <footer className="sticky bottom-0 flex items-center justify-between gap-2 border-t border-[var(--linea)] bg-[var(--tarjeta)] px-3 py-2 sm:px-5">
          <button
            type="button"
            onClick={onAnterior}
            disabled={!onAnterior}
            className="min-h-11 rounded-full border border-[var(--linea)] px-4 text-sm font-semibold disabled:opacity-40"
          >
            ‹ Anterior
          </button>
          <div className="min-w-0 text-center text-xs text-[var(--suave)]">
            {posicion && (
              <p aria-live="polite" className="font-semibold">
                {unidad} {posicion.actual} de {posicion.total}
              </p>
            )}
            <p className="hidden md:block">
              {activa === 'diagrama' || activa === 'cuaderno'
                ? `← → controles · RePág/AvPág ${plural(unidad)} · ↑ ↓ pestañas · F pantalla completa · Esc cerrar`
                : `← → ${plural(unidad)} · ↑ ↓ pestañas · + − aumento · F pantalla completa · Esc cerrar`}
            </p>
          </div>
          <button
            type="button"
            onClick={onSiguiente}
            disabled={!onSiguiente}
            className="min-h-11 rounded-full border border-[var(--linea)] px-4 text-sm font-semibold disabled:opacity-40"
          >
            Siguiente ›
          </button>
        </footer>
      </div>
    </div>
  )
}
