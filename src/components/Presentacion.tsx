import { useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent as KeyEvt, ReactNode } from 'react'
import type { Bloque } from '../data/schema.ts'
import { construir, pasosDe } from '../lib/diapositivas.ts'
import type { Item } from '../lib/diapositivas.ts'
import { usarAjustes } from '../lib/ajustes.ts'
import { useAtajos } from '../lib/atajos.ts'
import { marcarVisto } from '../lib/progreso.ts'
import { enviarFlecha, moverDeslizador } from '../lib/flechasDiagrama.ts'
import { DIAGRAMAS } from './diagramas/index.tsx'
import { Contenido } from './Ilustraciones.tsx'
import Comprueba from './Comprueba.tsx'
import LaminaVista from './LaminaVista.tsx'
import ParaDocente from './ParaDocente.tsx'
import { NivelInsignia, BorradorInsignia } from './Insignia.tsx'

const FOCALIZABLES = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

const numero = (etiqueta: string | undefined, i: number) => {
  const m = etiqueta?.match(/\d+/)
  return m ? Number(m[0]) : i + 1
}

interface Props {
  /** bloques activos, ya ordenados */
  bloques: Bloque[]
  /** id del bloque con el que empieza */
  inicio: string
  temaId: string
  unidad?: string
  onCerrar: () => void
  /** abre la ficha completa de un bloque */
  onVerFicha: (id: string) => void
}

/**
 * Presentación a pantalla completa: las fichas del subtema contadas como diapositivas.
 * Teclado: ← → (o RePág/AvPág, Espacio) cambian de diapositiva; ↑ ↓ de {unidad}; Inicio/Fin; Esc sale.
 */
export default function Presentacion({ bloques, inicio, temaId, unidad = 'Hito', onCerrar, onVerFicha }: Props) {
  const ajustes = usarAjustes()
  const atajos = useAtajos()
  const items: Item[] = useMemo(() => construir(bloques, ajustes), [bloques, ajustes])
  const [i, setI] = useState(() => Math.max(0, items.findIndex((x) => x.bloque.id === inicio)))
  const caja = useRef<HTMLDivElement>(null)
  const iRef = useRef(i)
  iRef.current = i
  const it = items[Math.min(i, items.length - 1)]

  // `paso` = cuántas cosas de la diapositiva ya se mostraron con → (tarjetas, lados, puntos)
  const [paso, setPaso] = useState(0)
  const pasoRef = useRef(0)
  pasoRef.current = paso
  const ir = (k: number) => {
    const kk = Math.max(0, Math.min(items.length - 1, k))
    // al volver atrás, la diapositiva anterior se ve completa
    setPaso(kk < iRef.current ? pasosDe(items[kk].d) : 0)
    setI(kk)
  }
  const avanzar = () => (pasoRef.current < pasosDe(items[iRef.current].d) ? setPaso((p) => p + 1) : ir(iRef.current + 1))
  const retroceder = () => (pasoRef.current > 0 ? setPaso((p) => p - 1) : ir(iRef.current - 1))
  // ↑ ↓ saltan de bloque dentro de la misma sección (contenido o actividades)
  const irBloque = (dir: 1 | -1) => {
    const sec = items[iRef.current].seccion
    const ids = bloques.map((b) => b.id).filter((id) => items.some((x) => x.bloque.id === id && x.seccion === sec))
    const k = ids.indexOf(items[iRef.current].bloque.id) + dir
    if (k < 0 || k >= ids.length) return
    ir(items.findIndex((x) => x.bloque.id === ids[k] && x.seccion === sec))
  }
  const primeraActividad = items.findIndex((x) => x.seccion === 'actividades')

  useEffect(() => {
    if (it) marcarVisto(temaId, it.bloque.id)
  }, [temaId, it?.bloque.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const previo = document.activeElement as HTMLElement | null
    caja.current?.focus()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
      previo?.focus?.()
    }
  }, [])

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key === 'Escape') {
        if (caja.current?.querySelector('[data-fs="true"]')) return
        e.preventDefault()
        e.stopPropagation()
        onCerrar()
        return
      }
      const t = e.target as HTMLElement | null
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return
      if (t?.closest('[data-zoomed="true"]') && e.key.startsWith('Arrow')) return
      const actual = items[iRef.current]
      const enDiagrama = actual.d.tipo === 'diagrama' || (actual.d.tipo === 'lamina' && actual.d.lamina.visual?.tipo === 'diagrama')

      if (enDiagrama && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        const dir = e.key === 'ArrowRight' ? 1 : -1
        const panel = caja.current?.querySelector<HTMLElement>('[data-diagrama]')
        if (enviarFlecha(dir) || (panel && moverDeslizador(panel, dir))) {
          e.preventDefault()
          e.stopPropagation()
          return
        }
      }
      if (enDiagrama && (e.key === 'Enter' || e.key === ' ') && !(t && /^(BUTTON|A|SUMMARY)$/.test(t.tagName))) {
        const b = caja.current?.querySelector<HTMLButtonElement>('[data-principal]:not([disabled])')
        if (b) {
          e.preventDefault()
          e.stopPropagation()
          b.click()
          return
        }
      }
      let usada = true
      if (e.key === 'ArrowRight' || (e.key === ' ' && !(t && /^(BUTTON|A|SUMMARY)$/.test(t.tagName)))) avanzar()
      else if (e.key === 'PageDown') ir(iRef.current + 1)
      else if (e.key === 'ArrowLeft') retroceder()
      else if (e.key === 'PageUp') ir(iRef.current - 1)
      else if (e.key === 'ArrowDown') irBloque(1)
      else if (e.key === 'ArrowUp') irBloque(-1)
      else if (e.key === 'Home') ir(0)
      else if (e.key === 'End') ir(items.length - 1)
      else usada = false
      if (usada) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    document.addEventListener('keydown', alTeclear, true)
    return () => document.removeEventListener('keydown', alTeclear, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, onCerrar])

  const atrapar = (e: KeyEvt<HTMLDivElement>) => {
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

  if (!it) return null
  const b = it.bloque
  const idxBloque = bloques.findIndex((x) => x.id === b.id)
  const siguienteBloque = bloques[idxBloque + 1]
  const enActividades = it.seccion === 'actividades'

  return (
    <div
      ref={caja}
      role="dialog"
      aria-modal="true"
      aria-label={`Diapositivas: ${b.titulo}`}
      tabIndex={-1}
      onKeyDown={atrapar}
      className="fixed inset-0 z-50 flex flex-col bg-[var(--fondo)] outline-none"
    >
      <header className="flex items-center gap-3 border-b border-[var(--linea)] bg-[var(--tarjeta)] px-3 py-2">
        <nav aria-label={`${unidad}s`} className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
          {bloques.map((x, k) => (
            <button
              key={x.id}
              type="button"
              aria-current={x.id === b.id ? 'step' : undefined}
              aria-label={`${unidad} ${numero(x.etiqueta, k)}: ${x.titulo}`}
              title={x.titulo}
              onClick={() => ir(items.findIndex((y) => y.bloque.id === x.id && y.seccion === it.seccion))}
              className={`flex h-9 min-w-9 shrink-0 items-center justify-center rounded-full border px-2 text-sm font-bold ${
                x.id === b.id ? 'border-[var(--acento)] bg-[var(--acento)] text-[var(--fondo)]' : 'border-[var(--linea)] text-[var(--suave)]'
              }`}
            >
              {numero(x.etiqueta, k)}
            </button>
          ))}
        </nav>
        {primeraActividad >= 0 && (
          <button
            type="button"
            aria-pressed={enActividades}
            onClick={() => ir(enActividades ? 0 : primeraActividad)}
            title={enActividades ? 'Volver al contenido' : 'Ir a las actividades'}
            className={`min-h-9 shrink-0 rounded-full border px-3 text-sm font-semibold ${
              enActividades ? 'border-[var(--acento)] bg-[var(--acento)] text-[var(--fondo)]' : 'border-[var(--acento)] text-[var(--acento)]'
            }`}
          >
            {enActividades ? '‹ Contenido' : 'Actividades ›'}
          </button>
        )}
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Salir de las diapositivas"
          className="flex h-11 shrink-0 items-center gap-2 rounded-full border border-[var(--linea)] px-4 text-sm font-semibold"
        >
          <span aria-hidden="true">×</span> Salir
        </button>
      </header>
      <div
        role="progressbar"
        aria-label="Avance de la presentación"
        aria-valuemin={1}
        aria-valuemax={items.length}
        aria-valuenow={i + 1}
        className="h-1.5 bg-[var(--linea)]"
      >
        <div className="h-full bg-[var(--acento)] transition-[width]" style={{ width: `${((i + 1) / items.length) * 100}%` }} />
      </div>

      <main
        className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-8"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('button, a, input, select, textarea, summary, [data-diagrama]')) return
          if (paso < pasosDe(it.d)) setPaso((p) => p + 1)
        }}
      >
        <div key={`${b.id}-${it.n}`} className="mx-auto flex min-h-full w-full max-w-5xl flex-col justify-center">
          <Lamina
            it={it}
            onVerFicha={onVerFicha}
            siguienteBloque={siguienteBloque}
            onSiguiente={() => (siguienteBloque ? irBloque(1) : primeraActividad >= 0 && ir(primeraActividad))}
            paso={paso}
            onAtajo={(tema, bloque) => {
              onCerrar()
              atajos?.ir(tema, bloque)
            }}
          />
        </div>
      </main>

      <footer className="flex items-center justify-between gap-2 border-t border-[var(--linea)] bg-[var(--tarjeta)] px-3 py-2 sm:px-5">
        <button
          type="button"
          onClick={retroceder}
          disabled={i === 0 && paso === 0}
          className="min-h-11 shrink-0 whitespace-nowrap rounded-full border border-[var(--linea)] px-3 text-sm font-semibold disabled:opacity-40 sm:px-4"
        >
          ‹ Anterior
        </button>
        <div className="min-w-0 text-center text-xs text-[var(--suave)]">
          <p aria-live="polite" className="font-semibold">
            {enActividades ? 'Actividades · ' : ''}
            {b.etiqueta ?? b.anio} · {it.n} de {it.de} · {i + 1} de {items.length} en total
          </p>
          <p className="hidden md:block">
            {it.d.tipo === 'lamina' && paso < pasosDe(it.d)
              ? '→ o clic: mostrar lo siguiente · ← ocultar · RePág/AvPág cambian de diapositiva · Esc salir'
              : it.d.tipo === 'diagrama'
              ? '← → controles · RePág/AvPág diapositivas · ↑ ↓ ' + unidad.toLowerCase() + ' · Esc salir'
              : '← → diapositivas · ↑ ↓ ' + unidad.toLowerCase() + ' · Inicio/Fin · F pantalla completa · Esc salir'}
          </p>
        </div>
        <button
          type="button"
          onClick={avanzar}
          disabled={i === items.length - 1 && paso >= pasosDe(it.d)}
          className="min-h-11 shrink-0 whitespace-nowrap rounded-full bg-[var(--acento)] px-3 text-sm font-semibold text-[var(--fondo)] disabled:opacity-40 sm:px-4"
        >
          Siguiente ›
        </button>
      </footer>
    </div>
  )
}

function Etiqueta({ children }: { children: string }) {
  return <p className="text-sm font-bold uppercase tracking-wide text-[var(--acento)]">{children}</p>
}

/** Imagen del bloque, siempre en el mismo sitio: así el estudiante la reconoce y el texto cambia a su lado. */
function Figura({ b, children }: { b: Bloque; children: ReactNode }) {
  const img = b.ilustraciones?.[0]
  if (!img) return <div className="mx-auto w-full max-w-3xl">{children}</div>
  return (
    <div className="grid items-center gap-5 md:grid-cols-[1.05fr_1fr] md:gap-8">
      <div className="order-2 min-w-0 md:order-1">{children}</div>
      <figure className="order-1 min-w-0 md:order-2">
        <div className="mx-auto aspect-[4/3] max-h-[30dvh] w-full overflow-hidden rounded-2xl bg-[#efe3cc] shadow md:max-h-[55dvh]">
          <Contenido i={img} />
        </div>
        <figcaption className="mt-2 hidden text-sm text-[var(--suave)] md:block">{img.pie}</figcaption>
      </figure>
    </div>
  )
}

/** Divide una idea en la frase principal y el resto, para leerla de un vistazo. */
function frases(texto: string): string[] {
  return texto.split(/(?<=[.!?])\s+/).filter(Boolean)
}

function Lamina({
  it,
  onVerFicha,
  siguienteBloque,
  onSiguiente,
  paso,
  onAtajo,
}: {
  it: Item
  onVerFicha: (id: string) => void
  siguienteBloque?: Bloque
  onSiguiente: () => void
  paso: number
  onAtajo: (tema: string, bloque?: string) => void
}) {
  const { bloque: b, d } = it
  if (d.tipo === 'lamina') return <LaminaVista lamina={d.lamina} paso={paso} onAtajo={onAtajo} />
  const Diagrama = b.diagrama ? DIAGRAMAS[b.diagrama] : undefined

  if (d.tipo === 'portada') {
    return (
      <Figura b={b}>
        <p className="flex flex-wrap items-center gap-2">
          <span className="text-lg font-bold text-[var(--acento)]">{b.etiqueta ?? b.anio}</span>
          <NivelInsignia nivel={b.nivel} />
          {!b.revisado && <BorradorInsignia />}
        </p>
        <h2 className="mt-2 text-3xl font-extrabold leading-tight sm:text-5xl">{b.titulo}</h2>
        <p className="mt-4 text-lg text-[var(--suave)] sm:text-2xl">{b.resumen}</p>
      </Figura>
    )
  }

  if (d.tipo === 'idea') {
    const [principal, ...resto] = frases(b.ficha.idea)
    return (
      <Figura b={b}>
        <Etiqueta>La idea</Etiqueta>
        <h2 className="mt-1 text-lg font-bold text-[var(--suave)] sm:text-xl">{b.titulo}</h2>
        {b.ficha.quien || b.ficha.cuando ? <p className="mt-1 text-sm text-[var(--suave)]">{[b.ficha.quien, b.ficha.cuando].filter(Boolean).join(' · ')}</p> : null}
        <p className="mt-3 text-2xl font-bold leading-snug sm:text-4xl">{principal}</p>
        {resto.length > 0 && (
          <ul className="mt-4 space-y-2 text-lg sm:text-xl">
            {resto.map((r) => (
              <li key={r} className="flex gap-3">
                <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--acento)]" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        )}
      </Figura>
    )
  }

  if (d.tipo === 'ilustracion') {
    return (
      <figure>
        <Etiqueta>Mira de cerca</Etiqueta>
        <h2 className="mt-1 text-2xl font-bold sm:text-3xl">{d.ilustracion.titulo}</h2>
        <div className="mx-auto mt-4 aspect-[4/3] max-h-[55dvh] w-full overflow-hidden rounded-2xl bg-[#efe3cc] shadow">
          <Contenido i={d.ilustracion} />
        </div>
        <figcaption className="mt-3 text-base sm:text-lg">{d.ilustracion.pie}</figcaption>
        {d.ilustracion.credito && <p className="mt-1 text-xs text-[var(--suave)]">{d.ilustracion.credito}</p>}
        {d.ilustracion.tipo === 'svg' && <p className="mt-1 text-xs text-[var(--suave)]">Ilustración esquemática, no está a escala.</p>}
      </figure>
    )
  }

  if (d.tipo === 'analogia' && b.ficha.analogia) {
    return (
      <Figura b={b}>
        <div className="rounded-3xl border-2 border-dashed border-[var(--acento)] bg-[var(--acento-suave)]/30 p-5 sm:p-8">
          <Etiqueta>Analogía</Etiqueta>
          <h2 className="mt-1 text-2xl font-bold sm:text-3xl">{b.ficha.analogia.titulo}</h2>
          <p className="mt-3 text-lg leading-snug sm:text-xl">{b.ficha.analogia.texto}</p>
        </div>
      </Figura>
    )
  }

  if (d.tipo === 'contexto') {
    return (
      <Figura b={b}>
        <Etiqueta>Para saber más</Etiqueta>
        <div className="mt-2 space-y-4">
          {d.datos.map((c) => (
            <section key={c.titulo} className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4">
              <h2 className="text-lg font-bold sm:text-2xl">{c.titulo}</h2>
              <p className="mt-1 text-base leading-snug sm:text-xl">{c.texto}</p>
            </section>
          ))}
        </div>
      </Figura>
    )
  }

  if (d.tipo === 'ejemplos') {
    return (
      <Figura b={b}>
        {b.ficha.evidencia && b.ficha.evidencia.length > 0 && (
          <div>
            <Etiqueta>{b.etiqueta ? 'Ejemplos' : 'Evidencia'}</Etiqueta>
            <ul className="mt-2 space-y-2 text-lg sm:text-xl">
              {b.ficha.evidencia.map((e) => (
                <li key={e} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--acento)]" />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {b.ficha.limites && (
          <div className="mt-4 rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4">
            <Etiqueta>Ojo con esto</Etiqueta>
            <p className="mt-1 text-base sm:text-lg">{b.ficha.limites}</p>
          </div>
        )}
      </Figura>
    )
  }

  if (d.tipo === 'diagrama' && Diagrama) {
    return (
      <div>
        <Etiqueta>{`Actividad · ${b.etiqueta ?? b.anio} ${b.titulo}`}</Etiqueta>
        <div data-diagrama className="mt-2 rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-3 sm:p-4">
          <Diagrama />
        </div>
      </div>
    )
  }

  if (d.tipo === 'comprueba') {
    return (
      <div>
        <Etiqueta>{`Comprueba · ${b.etiqueta ?? b.anio} ${b.titulo}`}</Etiqueta>
        <div className="mt-2 text-base">
          <Comprueba key={b.id} bloque={b} />
        </div>
      </div>
    )
  }

  if (d.tipo === 'recuerda' && b.ficha.cuaderno) {
    return (
      <Figura b={b}>
        <Etiqueta>Para recordar</Etiqueta>
        <h2 className="mt-1 text-lg font-bold text-[var(--suave)] sm:text-xl">{b.titulo}</h2>
        <ul className="mt-3 space-y-3 text-xl sm:text-2xl">
          {b.ficha.cuaderno.facil.map((f) => (
            <li key={f} className="flex gap-3">
              <span aria-hidden="true" className="mt-2.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--acento)]" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onVerFicha(b.id)}
            className="min-h-11 rounded-full border border-[var(--acento)] px-5 text-sm font-semibold text-[var(--acento)]"
          >
            Ver la ficha completa
          </button>
          <button type="button" onClick={onSiguiente} className="min-h-11 rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-[var(--fondo)]">
            {siguienteBloque ? `Seguir con: ${siguienteBloque.titulo} ›` : 'Ir a las actividades ›'}
          </button>
        </div>
      </Figura>
    )
  }

  if (d.tipo === 'docente' && b.ficha.docente) {
    return (
      <div>
        <Etiqueta>Para el docente</Etiqueta>
        <div className="mt-2 text-base">
          <ParaDocente docente={b.ficha.docente} revisado={b.revisado} />
        </div>
      </div>
    )
  }

  return null
}
