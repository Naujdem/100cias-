import { useState } from 'react'
import type { Bloque, Tema } from '../data/schema.ts'
import { borrarProgreso, estadoDe, usarProgreso } from '../lib/progreso.ts'

interface Props {
  tema: Tema
  /** bloques que se muestran con el perfil actual, ordenados */
  visibles: Bloque[]
  onIr: (id: string) => void
}

/**
 * Tarjeta de orientación, justo antes del contenido: qué se va a aprender, cómo moverse y por dónde empezar.
 * Así el estudiante y el docente saben qué hacer al llegar a un subtema.
 */
export default function Guia({ tema, visibles, onIr }: Props) {
  const unidad = (tema.unidad ?? 'Hito').toLowerCase()
  const progreso = usarProgreso()
  const [seguro, setSeguro] = useState(false)
  const estados = visibles.map((b) => estadoDe(progreso, tema.id, b))
  const vistos = estados.filter((e) => e !== 'nuevo').length
  const comprobados = estados.filter((e) => e === 'comprobado').length
  const siguiente = visibles.find((_, k) => estados[k] === 'nuevo')
  const quiz = progreso.quiz[tema.id]
  const hayProgreso = vistos > 0 || !!quiz
  return (
    <section aria-label="Guía del subtema" className="mt-5 rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4">
      <p className="text-sm font-semibold text-[var(--acento)]">{tema.etiqueta} {tema.subtema}</p>
      {tema.objetivos && tema.objetivos.length > 0 && (
        <>
          <p className="mt-2 text-sm font-semibold">Al terminar podrás:</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
            {tema.objetivos.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </>
      )}
      <p className="mt-3 text-sm text-[var(--suave)]">
        Toca un {unidad} para abrirlo. Adentro: ← → cambian de {unidad}, ↑ ↓ cambian de pestaña y Esc cierra.
      </p>
      {hayProgreso && visibles.length > 0 && (
        <p className="mt-3 text-sm font-semibold" aria-live="polite">
          Llevas {vistos} de {visibles.length} {unidad}s vistos
          {comprobados > 0 && `, ${comprobados} comprobados`}
          {quiz && ` · Mejor quiz: ${quiz.mejor} de ${quiz.total}`}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            const b = siguiente ?? visibles[0]
            if (b) onIr(b.id)
          }}
          disabled={visibles.length === 0}
          className="min-h-11 rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-[var(--fondo)] disabled:opacity-40"
        >
          {!hayProgreso ? `Empezar por el primer ${unidad}` : siguiente ? `Seguir con: ${siguiente.titulo}` : 'Repasar desde el principio'}
        </button>
        {hayProgreso && !seguro && (
          <button type="button" onClick={() => setSeguro(true)} className="min-h-11 rounded-full px-3 text-sm text-[var(--suave)] underline">
            Borrar mi progreso
          </button>
        )}
        {seguro && (
          <>
            <button
              type="button"
              onClick={() => {
                borrarProgreso(tema.id, tema.bloques)
                setSeguro(false)
              }}
              className="min-h-11 rounded-full border border-rose-600 px-4 text-sm font-semibold text-rose-700 dark:text-rose-300"
            >
              Sí, borrar
            </button>
            <button type="button" onClick={() => setSeguro(false)} className="min-h-11 rounded-full px-3 text-sm underline">
              Cancelar
            </button>
          </>
        )}
      </div>
    </section>
  )
}
