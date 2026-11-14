import type { ComponentType } from 'react'
import EscenaMitosis from './EscenaMitosis.tsx'
import EscenaMeiosis from './EscenaMeiosis.tsx'
import EscenaZoomCelula from './EscenaZoomCelula.tsx'
import EscenaNiveles from './EscenaNiveles.tsx'
import EscenaCiclo from './EscenaCiclo.tsx'
import EscenaCitocinesis from './EscenaCitocinesis.tsx'
import { EscenaAnimalVegetal, EscenaProEu } from './EscenaTransforma.tsx'

/** Escenas vivas: un dibujo que se transforma según la fase (`fase` = id de la fase en el JSON). */
export const ESCENAS: Record<string, ComponentType<{ fase: string }>> = {
  mitosis: EscenaMitosis,
  meiosis: EscenaMeiosis,
  niveles: EscenaNiveles,
  ciclo: EscenaCiclo,
  citocinesis: EscenaCitocinesis,
  'animal-vegetal': EscenaAnimalVegetal,
  'pro-eu': EscenaProEu,
  'celula-animal': EscenaZoomCelula,
  'celula-vegetal': ({ fase }) => EscenaZoomCelula({ fase, vegetal: true }),
}
