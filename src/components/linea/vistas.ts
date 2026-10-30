import type { ComponentType } from 'react'
import type { PropsVista } from './tipos.ts'
import VistaTarjetas from './VistaTarjetas.tsx'
import VistaAlternada from './VistaAlternada.tsx'
import VistaNiveles from './VistaNiveles.tsx'
import VistaRuta from './VistaRuta.tsx'
import VistaMapa from './VistaMapa.tsx'
import VistaCelula from './VistaCelula.tsx'

export interface Vista {
  id: string
  nombre: string
  descripcion: string
  Componente: ComponentType<PropsVista>
  /** false si la vista no se desplaza en horizontal (se ocultan los botones ‹ ›) */
  desplazable?: boolean
  /** texto de ayuda de teclado */
  ayuda?: string
}

/**
 * Registro de vistas de la línea de tiempo. Para agregar una plantilla nueva:
 * 1) crear un componente que reciba PropsVista, 2) añadirlo a esta lista.
 * El selector, el guardado de la preferencia y el panel de detalle ya funcionan con cualquier vista.
 */
export const VISTAS: Vista[] = [
  { id: 'alternada', nombre: 'Alternada', descripcion: 'Hitos arriba y abajo de una línea, con imagen', Componente: VistaAlternada },
  { id: 'tarjetas', nombre: 'Tarjetas', descripcion: 'Línea con tarjetas compactas', Componente: VistaTarjetas },
  { id: 'niveles', nombre: 'Niveles', descripcion: 'Pila de niveles, de lo más pequeño (abajo) a lo más grande (arriba)', Componente: VistaNiveles, desplazable: false, ayuda: '↑ ↓ moverse · Enter abrir · F pantalla completa' },
  { id: 'ruta', nombre: 'Ruta', descripcion: 'Pasos en vertical, de arriba hacia abajo', Componente: VistaRuta, desplazable: false, ayuda: '↑ ↓ moverse · Enter abrir · F pantalla completa' },
  { id: 'mapa', nombre: 'Mapa', descripcion: 'Árbol de tipos de células que se toca para abrir cada uno', Componente: VistaMapa, desplazable: false, ayuda: 'Tab para moverse · Enter abrir · F pantalla completa' },
  { id: 'celula', nombre: 'Célula', descripcion: 'Una célula grande: toca un orgánulo para abrir su paso', Componente: VistaCelula, desplazable: false, ayuda: 'Tab para moverse · Enter abrir · F pantalla completa' },
]

export const VISTAS_LINEA = ['alternada', 'tarjetas']

/** Vistas permitidas para un tema (por defecto, las de línea de tiempo). */
export const vistasDe = (ids?: string[]) => {
  const lista = VISTAS.filter((v) => (ids ?? VISTAS_LINEA).includes(v.id))
  return lista.length ? lista : VISTAS.filter((v) => VISTAS_LINEA.includes(v.id))
}

