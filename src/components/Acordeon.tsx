import { useId, useState } from 'react'
import type { ReactNode } from 'react'

export interface ItemAcordeon {
  id: string
  titulo: string
  contenido: ReactNode
}

interface Props {
  items: ItemAcordeon[]
  /** ids de los items abiertos al empezar (por defecto, solo el primero) */
  abiertosAlInicio?: string[]
  /** si es true, abrir uno cierra los demás */
  soloUno?: boolean
}

/**
 * Lista de bloques plegables: solo el título está siempre visible y el texto se despliega al tocar.
 * Sirve para datos de contexto o curiosidades que enriquecen sin recargar la pantalla.
 * Los botones funcionan con Enter o Espacio; el contenido cerrado queda fuera del foco y de los lectores de pantalla.
 */
export default function Acordeon({ items, abiertosAlInicio, soloUno = false }: Props) {
  const base = useId()
  const [abiertos, setAbiertos] = useState<Set<string>>(
    () => new Set(abiertosAlInicio ?? (items[0] ? [items[0].id] : [])),
  )

  const alternar = (id: string) =>
    setAbiertos((prev) => {
      const sig = new Set(soloUno ? [...prev].filter((x) => x === id) : prev)
      if (sig.has(id)) sig.delete(id)
      else sig.add(id)
      return sig
    })

  return (
    <div className="divide-y divide-[var(--linea)] rounded-xl bg-[var(--fondo)]">
      {items.map((it, i) => {
        const abierto = abiertos.has(it.id)
        const idBoton = `${base}-b${i}`
        const idPanel = `${base}-p${i}`
        return (
          <div key={it.id}>
            <button
              type="button"
              id={idBoton}
              aria-expanded={abierto}
              aria-controls={idPanel}
              onClick={() => alternar(it.id)}
              className="flex min-h-11 w-full items-center justify-between gap-3 px-3 py-2 text-left font-semibold"
            >
              <span>{it.titulo}</span>
              <span
                aria-hidden="true"
                className={`shrink-0 text-[var(--suave)] transition-transform duration-200 motion-reduce:transition-none ${
                  abierto ? 'rotate-180' : ''
                }`}
              >
                ▾
              </span>
            </button>
            <div
              id={idPanel}
              role="region"
              aria-labelledby={idBoton}
              inert={!abierto}
              className={`grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none ${
                abierto ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-3 pb-3">{it.contenido}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
