// Registro de los diagramas (Explora) y juegos de Química orgánica (Química área 5).
import type { ComponentType } from 'react'
import { JUEGOS_ORGANICA } from './JuegosOrganica.tsx'
import ArmadorMoleculas from './ArmadorMoleculas.tsx'
import DetectorGrupos from './DetectorGrupos.tsx'
import { ConstructorCadenas, ConstructorAlcanos } from './ConstructorCadenas.tsx'
import FabricaOlores from './FabricaOlores.tsx'
import TorreDestilacion from './TorreDestilacion.tsx'

export const DIAGRAMAS_ORGANICA: Record<string, ComponentType> = {
  ...JUEGOS_ORGANICA,
  'armador-moleculas': ArmadorMoleculas,
  'detector-grupos': DetectorGrupos,
  'constructor-alcanos': ConstructorAlcanos,
  'constructor-cadenas': ConstructorCadenas,
  'fabrica-olores': FabricaOlores,
  'torre-destilacion': TorreDestilacion,
}
