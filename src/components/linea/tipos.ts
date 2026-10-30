import type { RefObject } from 'react'
import type { Bloque } from '../../data/schema.ts'
import type { EstadoBloque } from '../../lib/progreso.ts'

/** Props comunes de toda vista de la línea de tiempo. */
export interface PropsVista {
  /** bloques activos, ya ordenados por año */
  bloques: Bloque[]
  abierto: string | null
  onSeleccionar: (id: string) => void
  /** true cuando la línea de tiempo está en pantalla completa */
  completa: boolean
  /** contenedor desplazable, para que los botones ‹ › funcionen con cualquier vista */
  carril: RefObject<HTMLDivElement | null>
  /** progreso de cada bloque (visto / comprobado) */
  estados?: Record<string, EstadoBloque>
}
