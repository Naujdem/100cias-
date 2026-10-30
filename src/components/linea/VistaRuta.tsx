import type { PropsVista } from './tipos.ts'
import InsigniaProgreso from '../InsigniaProgreso.tsx'

const numero = (etiqueta?: string) => {
  const m = etiqueta?.match(/\d+/)
  return m ? Number(m[0]) : null
}

/** Ruta vertical: paso 1 arriba, una línea que baja hasta el último. Pensada para secuencias (1.3). */
export default function VistaRuta({ bloques, abierto, onSeleccionar, carril, estados }: PropsVista) {
  return (
    <div ref={carril} aria-label="Ruta de pasos, de arriba hacia abajo">
      <ol className="relative mx-auto max-w-2xl">
        {bloques.map((b, i) => {
          const sel = abierto === b.id
          const ultimo = i === bloques.length - 1
          return (
            <li key={b.id} className="relative flex gap-3 pb-3">
              {!ultimo && <span aria-hidden="true" className="absolute left-[1.15rem] top-10 bottom-0 w-0.5 bg-[var(--linea)]" />}
              <span
                aria-hidden="true"
                className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--acento)] text-sm font-bold text-[var(--fondo)]"
              >
                {numero(b.etiqueta) ?? i + 1}
              </span>
              <button
                type="button"
                data-hito={b.id}
                aria-expanded={sel}
                aria-label={`${b.etiqueta ?? i + 1}: ${b.titulo}`}
                onClick={() => onSeleccionar(b.id)}
                className={`flex min-w-0 flex-1 items-start justify-between gap-2 rounded-2xl border-2 px-4 py-3 text-left transition focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[var(--tinta)] ${
                  sel ? 'border-[var(--acento)] bg-[var(--acento-suave)]/50' : 'border-[var(--linea)] bg-[var(--tarjeta)] hover:border-[var(--acento)]'
                }`}
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-snug">{b.titulo}</span>
                  <span className="block text-xs text-[var(--suave)]">{b.resumen}</span>
                </span>
                <InsigniaProgreso estado={estados?.[b.id]} />
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
