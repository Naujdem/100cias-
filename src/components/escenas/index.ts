import type { ComponentType } from 'react'
import EscenaMitosis from './EscenaMitosis.tsx'
import EscenaMeiosis from './EscenaMeiosis.tsx'
import EscenaZoomCelula from './EscenaZoomCelula.tsx'
import EscenaNiveles from './EscenaNiveles.tsx'

/** Escenas vivas: un dibujo que se transforma según la fase (`fase` = id de la fase en el JSON). */
export const ESCENAS: Record<string, ComponentType<{ fase: string }>> = {
  mitosis: EscenaMitosis,
  meiosis: EscenaMeiosis,
  niveles: EscenaNiveles,
  'celula-animal': EscenaZoomCelula,
  'celula-vegetal': ({ fase }) => EscenaZoomCelula({ fase, vegetal: true }),
}
