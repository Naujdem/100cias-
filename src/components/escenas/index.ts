import type { ComponentType } from 'react'
import EscenaMitosis from './EscenaMitosis.tsx'

/** Escenas vivas: un dibujo que se transforma según la fase (`fase` = id de la fase en el JSON). */
export const ESCENAS: Record<string, ComponentType<{ fase: string }>> = {
  mitosis: EscenaMitosis,
}
