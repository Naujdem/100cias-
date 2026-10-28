import type { ComponentType } from 'react'
import CorchoHooke from './CorchoHooke.tsx'
import TejidosCelulas from './TejidosCelulas.tsx'
import DivisionCelular from './DivisionCelular.tsx'
import ExperimentoPasteur from './ExperimentoPasteur.tsx'
import CuentaComoCelula from './CuentaComoCelula.tsx'
import Endosimbiosis from './Endosimbiosis.tsx'
import GotaLeeuwenhoek from './GotaLeeuwenhoek.tsx'

/** Registro de diagramas interactivos. La clave es el valor de `bloque.diagrama`. */
export const DIAGRAMAS: Record<string, ComponentType> = {
  'corcho-hooke': CorchoHooke,
  'gota-leeuwenhoek': GotaLeeuwenhoek,
  'cuenta-celula': CuentaComoCelula,
  'endosimbiosis': Endosimbiosis,
  'experimento-pasteur': ExperimentoPasteur,
  'division-celular': DivisionCelular,
  'tejido-planta': () => <TejidosCelulas inicial="planta" />,
  'tejido-animal': () => <TejidosCelulas inicial="animal" />,
}
