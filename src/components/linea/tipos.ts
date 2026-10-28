import type { RefObject } from 'react'
import type { Bloque } from '../../data/schema.ts'

/** Props comunes de toda vista de la línea de tiempo. */
export interface PropsVista {
  /** bloques activos, ya ordenados por año */
  bloques: Bloque[]
  abierto: string | null
  onSeleccionar: (id: string) => void
  /** contenedor desplazable, para que los botones ‹ › funcionen con cualquier vista */
  carril: RefObject<HTMLDivElement | null>
}
