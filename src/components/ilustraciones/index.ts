import type { ComponentType } from 'react'
import CorchoLamina from './CorchoLamina.tsx'
import MicroscopioLeeuwenhoek from './MicroscopioLeeuwenhoek.tsx'
import GotaAnimalculos from './GotaAnimalculos.tsx'
import MicroscopioHooke from './MicroscopioHooke.tsx'

/** Registro de ilustraciones SVG. La clave es el `recurso` de una ilustración de tipo «svg». */
export const ILUSTRACIONES_SVG: Record<string, ComponentType> = {
  'corcho-lamina': CorchoLamina,
  'microscopio-hooke': MicroscopioHooke,
  'microscopio-leeuwenhoek': MicroscopioLeeuwenhoek,
  'gota-animalculos': GotaAnimalculos,
}
