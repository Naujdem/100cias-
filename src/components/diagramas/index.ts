import type { ComponentType } from 'react'
import CorchoHooke from './CorchoHooke.tsx'
import GotaLeeuwenhoek from './GotaLeeuwenhoek.tsx'

/** Registro de diagramas interactivos. La clave es el valor de `bloque.diagrama`. */
export const DIAGRAMAS: Record<string, ComponentType> = {
  'corcho-hooke': CorchoHooke,
  'gota-leeuwenhoek': GotaLeeuwenhoek,
}
