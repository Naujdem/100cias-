import type { ComponentType } from 'react'
import CorchoHooke from './CorchoHooke.tsx'
import TejidosCelulas from './TejidosCelulas.tsx'
import DivisionCelular from './DivisionCelular.tsx'
import ExperimentoPasteur from './ExperimentoPasteur.tsx'
import CuentaComoCelula from './CuentaComoCelula.tsx'
import Endosimbiosis from './Endosimbiosis.tsx'
import NivelesOrganizacion, { NIVELES } from './NivelesOrganizacion.tsx'
import GotaLeeuwenhoek from './GotaLeeuwenhoek.tsx'
import UniPluri from './UniPluri.tsx'

/** Registro de diagramas interactivos. La clave es el valor de `bloque.diagrama`. */
export const DIAGRAMAS: Record<string, ComponentType> = {
  'corcho-hooke': CorchoHooke,
  'gota-leeuwenhoek': GotaLeeuwenhoek,
  // un diagrama por nivel, que abre el diagrama anidado ya posicionado en ese nivel
  ...Object.fromEntries(NIVELES.map((n, i) => [`nivel-${n.id}`, () => <NivelesOrganizacion inicial={i} />])),
  // subtema 1.3: el diagrama abre ya posicionado en un paso, o en el juego de clasificar
  'uni-paso-0': () => <UniPluri paso={0} />,
  'uni-paso-1': () => <UniPluri paso={1} />,
  'uni-paso-2': () => <UniPluri paso={2} />,
  'uni-paso-3': () => <UniPluri paso={3} />,
  'uni-paso-4': () => <UniPluri paso={4} />,
  'uni-clasifica': () => <UniPluri modo="clasifica" />,
  'cuenta-celula': CuentaComoCelula,
  'endosimbiosis': Endosimbiosis,
  'experimento-pasteur': ExperimentoPasteur,
  'division-celular': DivisionCelular,
  'tejido-planta': () => <TejidosCelulas inicial="planta" />,
  'tejido-animal': () => <TejidosCelulas inicial="animal" />,
}
