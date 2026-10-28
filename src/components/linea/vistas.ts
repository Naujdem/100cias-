import type { ComponentType } from 'react'
import type { PropsVista } from './tipos.ts'
import VistaTarjetas from './VistaTarjetas.tsx'
import VistaAlternada from './VistaAlternada.tsx'

export interface Vista {
  id: string
  nombre: string
  descripcion: string
  Componente: ComponentType<PropsVista>
}

/**
 * Registro de vistas de la línea de tiempo. Para agregar una plantilla nueva:
 * 1) crear un componente que reciba PropsVista, 2) añadirlo a esta lista.
 * El selector, el guardado de la preferencia y el panel de detalle ya funcionan con cualquier vista.
 */
export const VISTAS: Vista[] = [
  { id: 'alternada', nombre: 'Alternada', descripcion: 'Hitos arriba y abajo de una línea, con imagen', Componente: VistaAlternada },
  { id: 'tarjetas', nombre: 'Tarjetas', descripcion: 'Línea con tarjetas compactas', Componente: VistaTarjetas },
]

export const VISTA_INICIAL = VISTAS[0].id
