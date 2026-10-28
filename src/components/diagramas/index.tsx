import type { ComponentType } from 'react'
import CorchoHooke from './CorchoHooke.tsx'
import TejidosCelulas from './TejidosCelulas.tsx'
import GotaLeeuwenhoek from './GotaLeeuwenhoek.tsx'

/** Registro de diagramas interactivos. La clave es el valor de `bloque.diagrama`. */
export const DIAGRAMAS: Record<string, ComponentType> = {
  'corcho-hooke': CorchoHooke,
  'gota-leeuwenhoek': GotaLeeuwenhoek,
  'tejido-planta': () => <TejidosCelulas inicial="planta" />,
  'tejido-animal': () => <TejidosCelulas inicial="animal" />,
}
