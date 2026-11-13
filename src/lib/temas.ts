import perfilesJson from '../data/perfiles.json'
import type { Bloque, Perfil, Tema } from '../data/schema.ts'
import { normalizar } from './seleccion.ts'
import { guardar, leer } from './almacen.ts'

// Todos los subtemas del contenido, ordenados. Para agregar uno basta con crear su JSON en data/materias.
export const TEMAS = Object.values(import.meta.glob('../data/materias/**/*.json', { eager: true, import: 'default' }))
  .map((t) => t as unknown as Tema)
  .sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99))
export const PERFILES = perfilesJson as unknown as Perfil[]
export const CLAVE_TEMA = 'cien:tema-activo'
export const CLAVE_PERFIL = 'cien:perfil' // el último perfil elegido: vale para todos los subtemas

export interface Guardado {
  perfil: string
  activos: string[]
}

export const perfilActual = (): Perfil => PERFILES.find((x) => x.id === leer<string>(CLAVE_PERFIL, PERFILES[0].id)) ?? PERFILES[0]

/** Lo guardado para un subtema; sin guardado propio, hereda el último perfil elegido. */
export function guardadoDe(t: Tema): Guardado {
  const g = leer<Guardado | null>(`cien:${t.id}`, null)
  if (g) return g
  const p = perfilActual()
  return { perfil: p.id, activos: p.bloques[t.id] ?? t.bloques.map((b) => b.id) }
}

/** Los bloques que el perfil (o la personalización) muestra en un subtema. */
export function visiblesDe(t: Tema): Bloque[] {
  const activos = normalizar(t.bloques, guardadoDe(t).activos)
  return t.bloques.filter((b) => activos.has(b.id))
}

/** Un solo perfil para todos los subtemas: se guarda en cada uno. */
export function aplicarPerfil(p: Perfil): void {
  guardar(CLAVE_PERFIL, p.id)
  for (const t of TEMAS) {
    const activos = normalizar(t.bloques, p.bloques[t.id] ?? t.bloques.map((b) => b.id))
    guardar(`cien:${t.id}`, { perfil: p.id, activos: [...activos] })
  }
}
