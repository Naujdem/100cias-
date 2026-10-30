import type { Tema } from '../data/schema.ts'

interface Props {
  tema: Tema
  /** cuántos bloques se muestran con el perfil actual */
  visibles: number
  onEmpezar: () => void
}

/**
 * Tarjeta de orientación, justo antes del contenido: qué se va a aprender, cómo moverse y por dónde empezar.
 * Así el estudiante y el docente saben qué hacer al llegar a un subtema.
 */
export default function Guia({ tema, visibles, onEmpezar }: Props) {
  const unidad = (tema.unidad ?? 'Hito').toLowerCase()
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
      <button
        type="button"
        onClick={onEmpezar}
        disabled={visibles === 0}
        className="mt-3 min-h-11 rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-[var(--fondo)] disabled:opacity-40"
      >
        Empezar por el primer {unidad}
      </button>
    </section>
  )
}
