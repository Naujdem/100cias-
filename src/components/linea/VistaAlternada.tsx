import type { PropsVista } from './tipos.ts'
import Miniatura from './Miniatura.tsx'

// Hitos que alternan arriba y abajo de una línea central, cada uno con su tallo,
// año, texto corto e imagen enmarcada. El nodo «+» abre el detalle.
export default function VistaAlternada({ bloques, abierto, onSeleccionar, carril }: PropsVista) {
  return (
    <div
      ref={carril}
      className="overflow-x-auto rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)]"
      tabIndex={0}
      aria-label="Línea de tiempo alternada, desplazable"
    >
      <ol className="relative flex h-[34rem] min-w-max pl-6 pr-56">
        <li aria-hidden="true" className="pointer-events-none absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-[var(--tinta)]/70" />
        {bloques.map((b, i) => {
          const arriba = i % 2 === 0
          const sel = abierto === b.id
          return (
            <li key={b.id} className="relative w-36 shrink-0">
              <button
                type="button"
                aria-expanded={sel}
                aria-label={`${b.anio}: ${b.titulo}`}
                onClick={() => onSeleccionar(b.id)}
                className="absolute left-1/2 top-1/2 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-[var(--tarjeta)] bg-[var(--acento)] text-2xl font-bold leading-none text-[var(--fondo)] shadow transition hover:scale-110"
              >
                <span aria-hidden="true" className={`transition-transform ${sel ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>

              <div
                className={`absolute left-1/2 w-[17rem] border-l-2 border-[var(--tinta)]/70 pl-4 ${
                  arriba
                    ? 'bottom-1/2 flex flex-col justify-end pb-6 before:absolute before:-left-[5px] before:top-0 before:h-2 before:w-2 before:rounded-full before:bg-[var(--tinta)]'
                    : 'top-1/2 flex flex-col pt-6 after:absolute after:-left-[5px] after:bottom-0 after:h-2 after:w-2 after:rounded-full after:bg-[var(--tinta)]'
                }`}
              >
                {!arriba && (
                  <div className="mb-3">
                    <Miniatura bloque={b} />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => onSeleccionar(b.id)}
                  className="block text-left"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <span className="block font-serif text-xl font-bold">{b.anio}</span>
                  <span className="block text-sm font-semibold leading-snug">{b.titulo}</span>
                  <span className="mt-1 line-clamp-3 block text-sm text-[var(--suave)]">{b.resumen}</span>
                </button>
                {arriba && (
                  <div className="mt-3">
                    <Miniatura bloque={b} />
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
