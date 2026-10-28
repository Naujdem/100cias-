import type { ComponentType } from 'react'
import CorchoLamina from './CorchoLamina.tsx'
import MicroscopioLeeuwenhoek from './MicroscopioLeeuwenhoek.tsx'
import TejidoVegetal from './TejidoVegetal.tsx'
import TejidoAnimal from './TejidoAnimal.tsx'
import CelulaDividiendo from './CelulaDividiendo.tsx'
import Matraz from './Matraz.tsx'
import FrascosRedi from './FrascosRedi.tsx'
import EscenaEndosimbiosis from './EscenaEndosimbiosis.tsx'
import GotaAnimalculos from './GotaAnimalculos.tsx'
import MicroscopioHooke from './MicroscopioHooke.tsx'

/** Registro de ilustraciones SVG. La clave es el `recurso` de una ilustración de tipo «svg». */
export const ILUSTRACIONES_SVG: Record<string, ComponentType> = {
  'corcho-lamina': CorchoLamina,
  'microscopio-hooke': MicroscopioHooke,
  'microscopio-leeuwenhoek': MicroscopioLeeuwenhoek,
  'gota-animalculos': GotaAnimalculos,
  'endosimbiosis-mito': () => EscenaEndosimbiosis({ paso: 4 }),
  'matraz-cisne': () => Matraz({ tipo: 'cisne' }),
  'frascos-redi': () => FrascosRedi({ dia: 5 }),
  'celula-anafase': () => CelulaDividiendo({ etapa: 3 }),
  'tejido-vegetal': TejidoVegetal,
  'tejido-animal': TejidoAnimal,
}
