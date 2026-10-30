import type { PropsVista } from './tipos.ts'

/** El número que aparece en la etiqueta («Nivel 5» → 5), para que la pila y la ficha digan lo mismo aunque haya bloques ocultos. */
const numero = (etiqueta?: string) => {
  const m = etiqueta?.match(/\d+/)
  return m ? Number(m[0]) : null
}

/**
 * Pila de niveles: el primero (el más pequeño) queda abajo y el último arriba.
 * El orden del DOM es de menor a mayor; la pila se invierte solo visualmente.
 */
export default function VistaNiveles({ bloques, abierto, onSeleccionar, carril }: PropsVista) {
  const n = bloques.length
  return (
    <div ref={carril} aria-label="Pila de elementos: el primero abajo y el último arriba">
      <ol className="flex flex-col-reverse items-center gap-2">
        {bloques.map((b, i) => {
          const sel = abierto === b.id
          const ancho = 52 + (n > 1 ? (i / (n - 1)) * 48 : 48) // % del ancho: más angosto abajo, más ancho arriba
          return (
            <li key={b.id} style={{ width: `${ancho}%` }} className="min-w-[16rem] max-w-full">
              <button
                type="button"
                data-hito={b.id}
                aria-expanded={sel}
                aria-label={`${b.etiqueta ?? b.anio}: ${b.titulo}`}
                onClick={() => onSeleccionar(b.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[var(--tinta)] ${
                  sel ? 'border-[var(--acento)] bg-[var(--acento-suave)]/50' : 'border-[var(--linea)] bg-[var(--tarjeta)] hover:border-[var(--acento)]'
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--acento)] text-sm font-bold text-[var(--fondo)]" aria-hidden="true">
                  {numero(b.etiqueta) ?? i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-snug">{b.titulo}</span>
                  <span className="block text-xs text-[var(--suave)]">{b.resumen}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
