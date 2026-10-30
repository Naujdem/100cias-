import Resguardo from './Resguardo.tsx'
import { useEffect, useState } from 'react'
import type { Lamina, Visual } from '../data/schema.ts'
import { ILUSTRACIONES_SVG } from './ilustraciones/index.ts'
import { DIAGRAMAS } from './diagramas/index.tsx'
import { useAtajos } from '../lib/atajos.ts'

// Una lámina de la presentación: una idea, poco texto, siempre algo para mirar o hacer.
// `paso` es cuántas cosas ya se revelaron con → (primero las del visual, luego los puntos).

const pasosVisual = (v?: Visual) => (v?.tipo === 'tarjetas' ? v.items.length : v?.tipo === 'compara' ? 2 : 0)

/** Aparece con una pequeña animación cuando le toca; mientras tanto ocupa su sitio para que nada salte. */
const aparece = (visible: boolean) =>
  `transition duration-500 ease-out ${visible ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-3 scale-95 opacity-0'}`

export default function LaminaVista({ lamina: l, paso, onAtajo }: { lamina: Lamina; paso: number; onAtajo: (tema: string, bloque?: string) => void }) {
  const v = l.visual
  const nv = pasosVisual(v)
  const visibleVisual = Math.min(paso, nv)
  const puntosVisibles = Math.max(0, paso - nv)
  const ancho = v?.tipo === 'tarjetas' || v?.tipo === 'compara' || v?.tipo === 'diagrama'
  const lado = v?.tipo === 'ilustracion' || v?.tipo === 'cifra'

  const textos = (
    <>
      <h2 className="text-3xl font-extrabold leading-tight sm:text-5xl">{l.titulo}</h2>
      {l.puntos && l.puntos.length > 0 && (
        <ul className={`${ancho ? 'mt-5 sm:grid-cols-2' : 'mt-5'} grid gap-3 text-xl sm:text-2xl`}>
          {l.puntos.map((p, k) => (
            <li key={p} aria-hidden={k >= puntosVisibles} className={`flex gap-3 ${aparece(k < puntosVisibles)}`}>
              <span aria-hidden="true" className="mt-2.5 h-3 w-3 shrink-0 rounded-full bg-[var(--acento)]" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}
      {l.nota && <p className="mt-4 text-sm text-[var(--suave)] sm:text-base">{l.nota}</p>}
      {l.atajo && <Atajo atajo={l.atajo} onIr={onAtajo} />}
    </>
  )

  if (ancho) {
    return (
      <div>
        <h2 className="text-3xl font-extrabold leading-tight sm:text-5xl">{l.titulo}</h2>
        <div className="mt-5">{v && <VisualVista v={v} visibles={visibleVisual} />}</div>
        {l.puntos && l.puntos.length > 0 && (
          <ul className="mt-5 grid gap-3 text-xl sm:grid-cols-2 sm:text-2xl">
            {l.puntos.map((p, k) => (
              <li key={p} aria-hidden={k >= puntosVisibles} className={`flex gap-3 ${aparece(k < puntosVisibles)}`}>
                <span aria-hidden="true" className="mt-2.5 h-3 w-3 shrink-0 rounded-full bg-[var(--acento)]" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        )}
        {l.nota && <p className="mt-4 text-sm text-[var(--suave)] sm:text-base">{l.nota}</p>}
        {l.atajo && <Atajo atajo={l.atajo} onIr={onAtajo} />}
      </div>
    )
  }

  if (lado && v) {
    return (
      <div className="grid items-center gap-5 md:grid-cols-[1.05fr_1fr] md:gap-8">
        <div className="order-2 min-w-0 md:order-1">{textos}</div>
        <div className="order-1 min-w-0 md:order-2">
          <VisualVista v={v} visibles={visibleVisual} />
        </div>
      </div>
    )
  }

  // pregunta o lámina sin visual
  return (
    <div className="mx-auto w-full max-w-3xl">
      {v?.tipo === 'pregunta' ? (
        <>
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--acento)]">{l.titulo}</p>
          <VisualVista v={v} visibles={0} />
          {l.atajo && <Atajo atajo={l.atajo} onIr={onAtajo} />}
        </>
      ) : (
        textos
      )}
    </div>
  )
}

function Atajo({ atajo, onIr }: { atajo: NonNullable<Lamina['atajo']>; onIr: (tema: string, bloque?: string) => void }) {
  const nav = useAtajos()
  const existe = !!nav?.existe(atajo.tema)
  return existe ? (
    <button
      type="button"
      onClick={() => onIr(atajo.tema, atajo.bloque)}
      className="mt-5 min-h-11 rounded-full border border-[var(--acento)] px-5 text-sm font-semibold text-[var(--acento)] hover:bg-[var(--acento-suave)]/40"
    >
      Más sobre esto: {atajo.texto} →
    </button>
  ) : (
    <p className="mt-5 inline-flex min-h-11 items-center rounded-full border border-dashed border-[var(--linea)] px-5 text-sm text-[var(--suave)]">
      Más sobre esto en «{atajo.texto}» · próximamente
    </p>
  )
}

function VisualVista({ v, visibles }: { v: Visual; visibles: number }) {
  if (v.tipo === 'ilustracion') {
    const Svg = ILUSTRACIONES_SVG[v.recurso]
    if (!Svg) return null
    return (
      <figure>
        <div className="mx-auto aspect-[4/3] max-h-[34dvh] w-full overflow-hidden rounded-2xl bg-[#efe3cc] shadow md:max-h-[52dvh]">
          <Svg />
        </div>
        {v.pie && <figcaption className="mt-2 text-sm text-[var(--suave)]">{v.pie}</figcaption>}
      </figure>
    )
  }

  if (v.tipo === 'cifra') {
    return (
      <div className="flex flex-col items-center rounded-3xl border-2 border-[var(--acento)] bg-[var(--acento-suave)]/30 p-6 text-center sm:p-10">
        {v.icono && (
          <span aria-hidden="true" className="text-6xl sm:text-8xl">
            {v.icono}
          </span>
        )}
        <p className="mt-3 text-3xl font-extrabold leading-tight text-[var(--acento)] sm:text-5xl">{v.valor}</p>
        <p className="mt-3 max-w-md text-lg sm:text-xl">{v.texto}</p>
      </div>
    )
  }

  if (v.tipo === 'tarjetas') {
    const cols = v.items.length >= 5 ? 'sm:grid-cols-3 lg:grid-cols-5' : v.items.length === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : v.items.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
    return (
      <ul className={`grid grid-cols-2 gap-3 ${cols}`}>
        {v.items.map((it, k) => (
          <li
            key={it.titulo}
            aria-hidden={k >= visibles}
            className={`flex flex-col items-center rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4 text-center shadow-sm ${aparece(k < visibles)}`}
          >
            {it.icono && (
              <span aria-hidden="true" className="text-4xl sm:text-5xl">
                {it.icono}
              </span>
            )}
            <p className="mt-2 text-lg font-bold leading-tight sm:text-xl">{it.titulo}</p>
            {it.texto && <p className="mt-1 text-sm text-[var(--suave)] sm:text-base">{it.texto}</p>}
          </li>
        ))}
      </ul>
    )
  }

  if (v.tipo === 'compara') {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[v.izq, v.der].map((lado, k) => (
          <section
            key={lado.titulo}
            aria-hidden={k >= visibles}
            className={`rounded-2xl border-2 p-5 ${k === 0 ? 'border-[var(--acento)]' : 'border-[var(--tinta)]/40'} bg-[var(--tarjeta)] ${aparece(k < visibles)}`}
          >
            <p className="flex items-center gap-3 text-xl font-bold sm:text-2xl">
              {lado.icono && (
                <span aria-hidden="true" className="text-4xl">
                  {lado.icono}
                </span>
              )}
              {lado.titulo}
            </p>
            <ul className="mt-3 space-y-2 text-lg sm:text-xl">
              {lado.puntos.map((p) => (
                <li key={p} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--acento)]" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    )
  }

  if (v.tipo === 'pregunta') return <PreguntaRapida v={v} />

  if (v.tipo === 'diagrama') {
    const D = DIAGRAMAS[v.id]
    return D ? (
      <div data-diagrama className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-3 sm:p-4">
        <Resguardo titulo="No se pudo mostrar el diagrama."><D /></Resguardo>
      </div>
    ) : null
  }
  return null
}

function PreguntaRapida({ v }: { v: Extract<Visual, { tipo: 'pregunta' }> }) {
  const [e, setE] = useState<number | null>(null)

  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => {
      if (ev.ctrlKey || ev.metaKey || ev.altKey || !/^[1-9]$/.test(ev.key) || e !== null) return
      const k = Number(ev.key) - 1
      if (k >= v.opciones.length) return
      ev.preventDefault()
      setE(k)
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [e, v.opciones.length])

  return (
    <div>
      <p className="mt-2 text-2xl font-bold leading-snug sm:text-4xl">{v.enunciado}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {v.opciones.map((o, k) => {
          let estilo = 'border-[var(--linea)] enabled:hover:border-[var(--acento)]'
          if (e !== null && k === v.correcta) estilo = 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30'
          else if (e === k) estilo = 'border-rose-600 bg-rose-50 dark:bg-rose-900/30'
          return (
            <button
              key={o}
              type="button"
              disabled={e !== null}
              onClick={() => setE(k)}
              className={`min-h-14 rounded-2xl border-2 bg-[var(--tarjeta)] px-4 py-3 text-left text-xl font-semibold sm:text-2xl ${estilo}`}
            >
              <span className="mr-3 text-[var(--suave)]">{k + 1}</span>
              {o}
            </button>
          )
        })}
      </div>
      <div role="status" className="mt-5 min-h-16 text-lg sm:text-xl">
        {e === null ? (
          <p className="text-[var(--suave)]">¿Qué crees? Elige una opción (o pulsa su número).</p>
        ) : (
          <p>
            <span className="font-bold">{e === v.correcta ? '¡Eso es! ' : 'Casi. '}</span>
            {v.explicacion}
          </p>
        )}
      </div>
    </div>
  )
}
