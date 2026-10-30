import type { PropsVista } from './tipos.ts'
import InsigniaProgreso from '../InsigniaProgreso.tsx'

export default function VistaTarjetas({ bloques, abierto, onSeleccionar, carril, estados }: PropsVista) {
  return (
    <div ref={carril} className="snap-x snap-proximity overflow-x-auto pb-3" tabIndex={0} aria-label="Línea de tiempo, desplazable">
      <ol className="flex min-w-max">
        {bloques.map((b) => {
          const sel = abierto === b.id
          return (
            <li
              key={b.id}
              className="relative w-52 shrink-0 snap-center px-2 before:absolute before:left-0 before:right-0 before:top-[3.25rem] before:h-0.5 before:bg-[var(--linea)] first:before:left-1/2 last:before:right-1/2"
            >
              <p className="text-center text-sm font-bold text-[var(--acento)]">{b.anio}</p>
              <button
                type="button"
                data-hito={b.id}
                aria-expanded={sel}
                aria-label={`${b.anio}: ${b.titulo}`}
                onClick={() => onSeleccionar(b.id)}
                className="relative z-10 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[var(--tinta)] mx-auto mt-2 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-[var(--acento)] transition"
                style={{ background: sel ? 'var(--acento)' : 'var(--fondo)' }}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${sel ? 'bg-[var(--fondo)]' : 'bg-[var(--acento)]'}`} />
              </button>
              <button
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                onClick={() => onSeleccionar(b.id)}
                className={`mt-3 block w-full rounded-2xl border p-3 text-left transition ${
                  sel ? 'border-[var(--acento)] bg-[var(--acento-suave)]/40' : 'border-[var(--linea)] bg-[var(--tarjeta)]'
                }`}
              >
                <span className="block text-sm font-semibold leading-snug">{b.titulo}</span>
                <span className="mt-1 block text-xs text-[var(--suave)]">{b.resumen}</span>
                <span className="mt-1 block">
                  <InsigniaProgreso estado={estados?.[b.id]} />
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
