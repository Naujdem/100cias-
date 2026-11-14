import Resguardo from './Resguardo.tsx'
import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import type { Autor, Bloque } from '../data/schema.ts'
import { DIAGRAMAS } from './diagramas/index.tsx'
import { NivelInsignia, BorradorInsignia } from './Insignia.tsx'
import Retrato from './Retrato.tsx'
import Ilustraciones from './Ilustraciones.tsx'
import Acordeon from './Acordeon.tsx'
import Cuaderno from './Cuaderno.tsx'
import Comprueba from './Comprueba.tsx'
import ParaDocente from './ParaDocente.tsx'
import { enviarFlecha, moverDeslizador } from '../lib/flechasDiagrama.ts'
import { marcarVisto } from '../lib/progreso.ts'
import { usarAjustes } from '../lib/ajustes.ts'
import { useAtajos } from '../lib/atajos.ts'

type Pestana = 'historia' | 'diagrama' | 'juego' | 'evidencia' | 'cuaderno' | 'comprueba' | 'docente'

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
  /** id del subtema, para guardar el progreso */
  temaId: string
  /** si existe, ofrece pasar a las diapositivas desde este bloque */
  onDiapositivas?: () => void
  /** pestaña en la que se abre (si la ficha la tiene) */
  inicial?: 'diagrama' | 'juego'
  /** página completa (temas que no son línea de tiempo), con las migas que se muestran arriba */
  pagina?: { migas: string[] }
  /** texto del botón que lleva a las diapositivas (por defecto «Proyectar en clase») */
  textoDiapositivas?: string
  tituloAnterior?: string
  tituloSiguiente?: string
}

export default function DetalleBloque({ bloque: b, onCerrar, posicion, onAnterior, onSiguiente, unidad = 'Hito', temaId, onDiapositivas, inicial, pagina, tituloAnterior, tituloSiguiente, textoDiapositivas = 'Proyectar en clase' }: Props) {
  const ajustes = usarAjustes()
  const atajos = useAtajos()
  /** tarjeta de «Saber más» abierta en la página */
  const [mas, setMas] = useState<Pestana | 'conexiones' | null>(null)
  const idTitulo = useId()
  const caja = useRef<HTMLDivElement>(null)
  const Diagrama = b.diagrama ? DIAGRAMAS[b.diagrama] : undefined
  const Juego = b.juego ? DIAGRAMAS[b.juego] : undefined
  // Con minijuego, la ficha es un recorrido de tres momentos y el resto queda en «Saber más».
  // En página completa siempre hay recorrido: «Explora» existe aunque el bloque no tenga diagrama ni juego.
  const recorrido = !!pagina || !!(Diagrama && Juego)
  const pasos: { id: Pestana; texto: string }[] = recorrido
    ? [
        { id: 'diagrama', texto: 'Explora' },
        ...(Juego ? [{ id: 'juego' as Pestana, texto: 'Juega' }] : []),
        ...(b.preguntas.length ? [{ id: 'comprueba' as Pestana, texto: 'Comprueba' }] : []),
      ]
    : []
  const todas: { id: Pestana; texto: string }[] = [
    { id: 'historia', texto: recorrido ? 'La idea completa' : b.etiqueta ? 'Idea' : 'Historia' },
    ...(Diagrama ? [{ id: 'diagrama' as Pestana, texto: 'Diagrama' }] : []),
    { id: 'evidencia', texto: b.etiqueta ? 'Ejemplos y límites' : 'Evidencia y límites' },
    ...(b.ficha.cuaderno ? [{ id: 'cuaderno' as Pestana, texto: 'Para el cuaderno' }] : []),
    ...(b.preguntas.length ? [{ id: 'comprueba' as Pestana, texto: 'Comprueba' }] : []),
    ...(ajustes.docente && b.ficha.docente ? [{ id: 'docente' as Pestana, texto: 'Para el docente' }] : []),
  ]
  // en el recorrido, las pestañas de abajo son solo las de «Saber más»
  const extras = recorrido ? todas.filter((p) => !pasos.some((x) => x.id === p.id)) : todas
  const pestanas = recorrido ? [...pasos, ...extras] : todas
  const [activa, setActiva] = useState<Pestana>(inicial && pestanas.some((p) => p.id === inicial) ? inicial : recorrido ? 'diagrama' : 'historia')
  const enExtras = recorrido && extras.some((p) => p.id === activa)
  const [masAbierto, setMasAbierto] = useState(false)
  const pasoActual = pasos.findIndex((p) => p.id === activa)
  const pasoSiguiente = pasoActual >= 0 ? pasos[pasoActual + 1] : undefined
  // primera frase de la idea, para acompañar al dibujo en «Explora»
  const ideaCorta = b.ficha.idea.match(/^.*?[.!?](\s|$)/)?.[0].trim() ?? b.ficha.idea
  const activaRef = useRef(activa)
  activaRef.current = activa
  const [principal, ...otros] = b.autores ?? []

  // Al abrir la ficha queda marcada como vista.
  useEffect(() => marcarVisto(temaId, b.id), [temaId, b.id])

  // Foco: entra al diálogo y, al cerrar, vuelve a donde estaba.
  useEffect(() => {
    const previo = document.activeElement as HTMLElement | null
    caja.current?.focus()
    return () => previo?.focus?.()
  }, [])

  // Teclado (pensado para el aula, sin mouse). Se escucha en todo el documento para que funcione
  // aunque el foco esté en el fondo del recuadro. Se ejecuta en la fase de captura.
  useEffect(() => {
    const ids = (recorrido ? pasos : pestanas).map((p) => p.id)
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
      const enDiagrama = activaRef.current === 'diagrama' || activaRef.current === 'juego'
      const enControles = enDiagrama || activaRef.current === 'cuaderno'
      if (enControles && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        const dir = e.key === 'ArrowRight' ? 1 : -1
        const panel = caja.current?.querySelector<HTMLElement>('[data-diagrama]')
        if (enviarFlecha(dir) || (enDiagrama && panel && moverDeslizador(panel, dir))) {
          e.preventDefault()
          e.stopPropagation()
          return
        }
      }
      // Espacio o Enter pulsan el botón principal del diagrama (Dividir, Romper el cuello…) si el foco no está en un control
      if (enDiagrama && (e.key === 'Enter' || e.key === ' ') && !(t && /^(BUTTON|A|SUMMARY)$/.test(t.tagName))) {
        const principalBtn = caja.current?.querySelector<HTMLButtonElement>('[data-principal]:not([disabled])')
        if (principalBtn) {
          e.preventDefault()
          e.stopPropagation()
          principalBtn.click()
          return
        }
      }

      if (onDiapositivas && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        e.stopPropagation()
        onDiapositivas()
        return
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
  }, [onCerrar, onSiguiente, onAnterior, onDiapositivas, Diagrama, Juego, ajustes.docente])

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


  if (pagina) {
    const conexiones = (b.diapositivas ?? []).flatMap((l) => (l.atajo ? [l.atajo] : [])).filter((a, i, t) => t.findIndex((x) => x.tema === a.tema && x.bloque === a.bloque) === i)
    const tarjetas: { id: Pestana | 'conexiones'; titulo: string; texto: string }[] = [
      { id: 'historia', titulo: 'La idea completa', texto: 'La explicación entera, con imágenes y más detalles.' },
      ...(b.ficha.evidencia || b.ficha.limites ? [{ id: 'evidencia' as const, titulo: 'Ejemplos y límites', texto: 'Cómo lo sabemos y hasta dónde llega la idea.' }] : []),
      ...(b.ficha.cuaderno ? [{ id: 'cuaderno' as const, titulo: 'Para el cuaderno', texto: 'Frases cortas para copiar, en tres niveles.' }] : []),
      ...(conexiones.length ? [{ id: 'conexiones' as const, titulo: 'Conexiones', texto: conexiones.map((c) => c.texto).join(' · ') }] : []),
      ...(ajustes.docente && b.ficha.docente ? [{ id: 'docente' as const, titulo: 'Para el docente', texto: 'Cómo abrir la clase, actividad y errores frecuentes.' }] : []),
    ]
    const caja2 = 'rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-5'
    const rotulo = 'text-xs font-bold uppercase tracking-widest'
    return (
      <div
        ref={caja}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        tabIndex={-1}
        onKeyDown={alTeclear}
        style={{ '--alto-visor': '42dvh' } as CSSProperties}
        className="fixed inset-0 z-50 overflow-y-auto bg-[var(--fondo)] outline-none"
      >
        <header className="sticky top-0 z-20 border-b border-[var(--linea)] bg-[var(--tarjeta)]">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-2.5">
            <button type="button" onClick={onCerrar} aria-label="Volver al tema" title="Volver (Esc)" className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--linea)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <p className="min-w-0 flex-1 truncate text-sm font-semibold text-[var(--acento)]">{pagina.migas.join(' › ')}</p>
            {posicion && (
              <p aria-live="polite" className="text-sm font-semibold text-[var(--suave)]">
                {unidad} {posicion.actual} de {posicion.total}
              </p>
            )}
            {onDiapositivas && (
              <button type="button" onClick={onDiapositivas} title="Ver como diapositivas (D)" className="min-h-11 rounded-full border border-[var(--linea)] px-4 text-sm font-semibold">
                {textoDiapositivas}
              </button>
            )}
          </div>
        </header>

        <div className="mx-auto max-w-6xl space-y-6 px-4 pb-10 pt-6">
          <div>
            <p className={`${rotulo} flex flex-wrap items-center gap-2 text-[var(--acento)]`}>
              {pagina.migas[1]} · {b.etiqueta ?? b.anio}
              <NivelInsignia nivel={b.nivel} />
              {ajustes.docente && !b.revisado && <BorradorInsignia />}
            </p>
            <h3 id={idTitulo} className="titulo mt-1 text-4xl font-semibold leading-tight">
              {b.titulo}
            </h3>
            <p className="titulo mt-1 text-xl text-[var(--suave)]">{b.ficha.docente?.abrir ?? b.resumen}</p>
          </div>

          <ol role="tablist" aria-label="Recorrido" className="grid gap-2" style={{ gridTemplateColumns: `repeat(${pasos.length}, minmax(0, 1fr))` }}>
            {pasos.map((p, n) => (
              <li key={p.id}>
                <button
                  role="tab"
                  type="button"
                  aria-selected={activa === p.id}
                  onClick={() => setActiva(p.id)}
                  className={`flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 px-2 text-base font-bold ${
                    activa === p.id ? 'border-[var(--acento)] bg-[var(--acento)] text-[var(--fondo)]' : 'border-[var(--linea)] bg-[var(--tarjeta)] text-[var(--suave)] hover:border-[var(--acento)]'
                  }`}
                >
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-sm ${activa === p.id ? 'bg-[var(--fondo)] text-[var(--acento)]' : 'bg-[var(--fondo)]'}`}>{n + 1}</span>
                  {p.texto}
                </button>
              </li>
            ))}
          </ol>

          <div role="tabpanel" className="text-sm">
            {activa === 'diagrama' && (
              <div className="grid items-stretch gap-5 lg:grid-cols-[3fr_2fr]">
                <div data-diagrama className={`${caja2} min-w-0`}>
                  {Diagrama ? (
                    <Resguardo titulo="No se pudo mostrar el diagrama."><Diagrama /></Resguardo>
                  ) : (
                    b.ilustraciones && <Ilustraciones items={b.ilustraciones} />
                  )}
                </div>
                <div className="flex min-w-0 flex-col gap-4">
                  <div className="rounded-2xl bg-[var(--acento)] p-5 text-[var(--fondo)]">
                    <p className={`${rotulo} opacity-80`}>Idea clave</p>
                    <p className="titulo mt-2 text-xl leading-snug">{ideaCorta}</p>
                  </div>
                  {b.ficha.cuaderno?.facil.length ? (
                    <div className={caja2}>
                      <p className={`${rotulo} text-[var(--suave)]`}>Para recordar</p>
                      <ul className="ml-5 mt-2 list-disc space-y-1 text-base">
                        {b.ficha.cuaderno.facil.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {ajustes.analogias && b.ficha.analogia && (
                    <div className={caja2}>
                      <p className={`${rotulo} text-[var(--suave)]`}>Como en la vida diaria · {b.ficha.analogia.titulo}</p>
                      <p className="mt-2 text-base">{b.ficha.analogia.texto}</p>
                    </div>
                  )}
                  {pasoSiguiente && (
                    <button type="button" onClick={() => setActiva(pasoSiguiente.id)} className="mt-auto min-h-13 rounded-full bg-[var(--tinta)] px-6 py-3 text-base font-bold text-[var(--fondo)]">
                      Ahora: {pasoSiguiente.texto} ›
                    </button>
                  )}
                </div>
              </div>
            )}

            {activa === 'juego' && Juego && (
              <div data-diagrama className={caja2}>
                <Resguardo titulo="No se pudo mostrar el juego."><Juego /></Resguardo>
                {pasoSiguiente && (
                  <p className="mt-4 text-right">
                    <button type="button" onClick={() => setActiva(pasoSiguiente.id)} className="min-h-11 rounded-full border-2 border-[var(--acento)] px-5 text-sm font-bold text-[var(--acento)]">
                      Ahora: {pasoSiguiente.texto} ›
                    </button>
                  </p>
                )}
              </div>
            )}

            {activa === 'comprueba' && (
              <div className={`${caja2} mx-auto max-w-3xl`}>
                <Comprueba key={b.id} bloque={b} />
              </div>
            )}
          </div>

          <section aria-label="Saber más">
            <h4 className="titulo text-2xl font-semibold">Saber más</h4>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {tarjetas.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-expanded={mas === t.id}
                  onClick={() => setMas(mas === t.id ? null : t.id)}
                  className="flex flex-col gap-1 rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4 text-left hover:border-[var(--acento)] aria-expanded:border-2 aria-expanded:border-[var(--acento)]"
                >
                  <span className="text-base font-bold">{t.titulo}</span>
                  <span className="text-sm text-[var(--suave)]">{t.texto}</span>
                </button>
              ))}
            </div>
            {mas && (
              <div className={`${caja2} mt-3 text-base`}>
                {mas === 'historia' && (
                  <div className="space-y-3">
                    <p>{b.ficha.idea}</p>
                    {Diagrama && b.ilustraciones && <Ilustraciones items={b.ilustraciones} />}
                    {b.ficha.contexto && <Acordeon key={b.id} items={b.ficha.contexto.map((c) => ({ id: c.titulo, titulo: c.titulo, contenido: <p>{c.texto}</p> }))} />}
                  </div>
                )}
                {mas === 'evidencia' && (
                  <div className="space-y-3">
                    {b.ficha.evidencia && (
                      <div>
                        <p className="font-semibold">Ejemplos</p>
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
                {mas === 'cuaderno' && b.ficha.cuaderno && <Cuaderno cuaderno={b.ficha.cuaderno} titulo={b.titulo} />}
                {mas === 'docente' && b.ficha.docente && <ParaDocente docente={b.ficha.docente} revisado={b.revisado} />}
                {mas === 'conexiones' && (
                  <ul className="flex flex-wrap gap-2">
                    {conexiones.map((c) => (
                      <li key={`${c.tema}-${c.bloque}`}>
                        {atajos?.existe(c.tema) ? (
                          <button type="button" onClick={() => atajos.ir(c.tema, c.bloque)} className="min-h-11 rounded-full border border-[var(--acento)] px-4 text-sm font-semibold text-[var(--acento)]">
                            {c.texto} ›
                          </button>
                        ) : (
                          <span className="inline-flex min-h-11 items-center rounded-full border border-dashed border-[var(--linea)] px-4 text-sm text-[var(--suave)]">{c.texto} · próximamente</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </section>

          <nav aria-label={`${unidad} anterior y siguiente`} className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--linea)] pt-5">
            <button type="button" onClick={onAnterior} disabled={!onAnterior} className="min-h-12 max-w-[40%] truncate rounded-full border border-[var(--linea)] bg-[var(--tarjeta)] px-5 text-sm font-bold disabled:opacity-40">
              ‹ {tituloAnterior ?? 'Es el primero'}
            </button>
            {posicion && (
              <span aria-hidden="true" className="hidden gap-1.5 md:flex">
                {Array.from({ length: posicion.total }, (_, i) => (
                  <span key={i} className={`h-2 w-7 rounded-full ${i === posicion.actual - 1 ? 'bg-[var(--acento)]' : 'bg-[var(--linea)]'}`} />
                ))}
              </span>
            )}
            <button type="button" onClick={onSiguiente} disabled={!onSiguiente} className="min-h-12 max-w-[40%] truncate rounded-full border border-[var(--linea)] bg-[var(--tarjeta)] px-5 text-sm font-bold disabled:opacity-40">
              {tituloSiguiente ? `Siguiente: ${tituloSiguiente}` : 'Es el último'} ›
            </button>
          </nav>
          <p className="hidden text-center text-xs text-[var(--suave)] lg:block">← → controles del dibujo · RePág/AvPág cambian de {unidad.toLowerCase()} · ↑ ↓ cambian de paso · F pantalla completa · Esc volver</p>
        </div>
      </div>
    )
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
              {onDiapositivas && (
                <button
                  type="button"
                  onClick={onDiapositivas}
                  title="Ver como diapositivas (D)"
                  className="ml-auto min-h-9 rounded-full border border-[var(--acento)] px-3 text-xs font-semibold text-[var(--acento)]"
                >
                  ▶ Ver como diapositivas
                </button>
              )}
            </p>
            <h3 id={idTitulo} className="mt-1 pr-12 text-xl font-bold leading-snug">
              {b.titulo}
            </h3>

            {recorrido && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <ol role="tablist" aria-label="Recorrido" className="flex min-w-0 flex-1 items-center gap-1">
                  {pasos.map((p, n) => (
                    <li key={p.id} className="flex min-w-0 flex-1 items-center gap-1">
                      <button
                        role="tab"
                        type="button"
                        aria-selected={activa === p.id}
                        onClick={() => setActiva(p.id)}
                        className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 px-2 text-sm font-bold sm:text-base ${
                          activa === p.id ? 'border-[var(--acento)] bg-[var(--acento)] text-[var(--sobre-acento)]' : 'border-[var(--linea)] text-[var(--suave)] hover:border-[var(--acento)]'
                        }`}
                      >
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${activa === p.id ? 'bg-white text-[var(--acento)]' : 'bg-[var(--fondo)]'}`}>{n + 1}</span>
                        <span className="truncate">{p.texto}</span>
                      </button>
                      {n < pasos.length - 1 && <span aria-hidden="true" className="text-[var(--suave)]">›</span>}
                    </li>
                  ))}
                </ol>
                <button
                  type="button"
                  aria-expanded={masAbierto || enExtras}
                  onClick={() => {
                    if (masAbierto || enExtras) {
                      setMasAbierto(false)
                      if (enExtras) setActiva('diagrama')
                    } else {
                      setMasAbierto(true)
                      setActiva(extras[0].id)
                    }
                  }}
                  className="min-h-12 rounded-xl border border-[var(--linea)] px-3 text-sm font-semibold text-[var(--suave)] aria-expanded:border-[var(--acento)] aria-expanded:text-[var(--acento)]"
                >
                  Saber más {masAbierto || enExtras ? '▴' : '▾'}
                </button>
              </div>
            )}

            <div role="tablist" aria-label="Secciones" hidden={recorrido && !(masAbierto || enExtras)} className="mt-3 flex gap-1 overflow-x-auto border-b border-[var(--linea)]">
              {extras.map((p) => (
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
                  {(b.ficha.contexto || (ajustes.analogias && b.ficha.analogia)) && (
                    <Acordeon
                      key={`${b.id}-${ajustes.analogias}`}
                      items={[
                        ...(b.ficha.contexto ?? []).map((c) => ({ id: c.titulo, titulo: c.titulo, contenido: <p>{c.texto}</p> })),
                        ...(ajustes.analogias && b.ficha.analogia
                          ? [{ id: 'analogia', titulo: `Analogía: ${b.ficha.analogia.titulo}`, contenido: <p>{b.ficha.analogia.texto}</p> }]
                          : []),
                      ]}
                    />
                  )}
                </div>
              )}

              {activa === 'diagrama' && Diagrama && (
                <div data-diagrama>
                  {recorrido && <p className="mb-3 text-base font-semibold">{ideaCorta}</p>}
                  <Resguardo titulo="No se pudo mostrar el diagrama."><Diagrama /></Resguardo>
                </div>
              )}

              {activa === 'juego' && Juego && (
                <div data-diagrama>
                  <Resguardo titulo="No se pudo mostrar el juego."><Juego /></Resguardo>
                </div>
              )}

              {pasoSiguiente && (
                <p className="mt-4 text-right">
                  <button type="button" onClick={() => setActiva(pasoSiguiente.id)} className="min-h-11 rounded-full border-2 border-[var(--acento)] px-5 text-sm font-bold text-[var(--acento)]">
                    Ahora: {pasoSiguiente.texto} ›
                  </button>
                </p>
              )}

              {activa === 'cuaderno' && b.ficha.cuaderno && <Cuaderno cuaderno={b.ficha.cuaderno} titulo={b.titulo} />}

              {activa === 'comprueba' && <Comprueba key={b.id} bloque={b} />}

              {activa === 'docente' && b.ficha.docente && <ParaDocente docente={b.ficha.docente} revisado={b.revisado} />}

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
                {b.etiqueta ? `${b.etiqueta} · ${posicion.actual} de ${posicion.total} en tu perfil` : `${unidad} ${posicion.actual} de ${posicion.total}`}
              </p>
            )}
            <p className="hidden md:block">
              {activa === 'diagrama' || activa === 'juego' || activa === 'cuaderno'
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
