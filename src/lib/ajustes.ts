import { useSyncExternalStore } from 'react'
import { guardar, leer } from './almacen.ts'

// Ajustes de visualización que no dependen del subtema.

export interface Ajustes {
  /** muestra la pestaña «Para el docente» */
  docente: boolean
  /** muestra las analogías (p. ej. la célula como ciudad) */
  analogias: boolean
}

const CLAVE = 'cien:ajustes'
let estado: Ajustes = { docente: false, analogias: false, ...leer<Partial<Ajustes>>(CLAVE, {}) }
const oyentes = new Set<() => void>()
const suscribir = (o: () => void) => {
  oyentes.add(o)
  return () => {
    oyentes.delete(o)
  }
}

export const usarAjustes = (): Ajustes => useSyncExternalStore(suscribir, () => estado)

export function cambiarAjuste(clave: keyof Ajustes, valor: boolean) {
  estado = { ...estado, [clave]: valor }
  guardar(CLAVE, estado)
  oyentes.forEach((o) => o())
}
