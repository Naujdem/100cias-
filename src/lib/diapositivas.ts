import type { Bloque, Ilustracion } from '../data/schema.ts'
import type { Ajustes } from './ajustes.ts'

// Las diapositivas no se escriben aparte: se arman a partir de la ficha de cada bloque,
// así no se pierde nada de lo que ya está y un cambio en la ficha se ve en las dos formas.

export type Diapositiva =
  | { tipo: 'portada' }
  | { tipo: 'idea' }
  | { tipo: 'ilustracion'; ilustracion: Ilustracion }
  | { tipo: 'analogia' }
  | { tipo: 'contexto'; titulo: string; texto: string }
  | { tipo: 'ejemplos' }
  | { tipo: 'diagrama' }
  | { tipo: 'comprueba' }
  | { tipo: 'recuerda' }
  | { tipo: 'docente' }

export interface Item {
  bloque: Bloque
  d: Diapositiva
  /** posición de la diapositiva dentro de su bloque (1…) y total del bloque */
  n: number
  de: number
}

/** Orden: portada, idea, imágenes, analogía, datos de contexto, ejemplos y límites, diagrama, comprueba, para recordar y, en modo docente, notas. */
export function construir(bloques: Bloque[], ajustes: Pick<Ajustes, 'analogias' | 'docente'>): Item[] {
  return bloques.flatMap((b) => {
    const f = b.ficha
    const ds: Diapositiva[] = [{ tipo: 'portada' }, { tipo: 'idea' }]
    // la primera imagen ya está en la portada
    for (const i of (b.ilustraciones ?? []).slice(1)) ds.push({ tipo: 'ilustracion', ilustracion: i })
    if (ajustes.analogias && f.analogia) ds.push({ tipo: 'analogia' })
    for (const c of f.contexto ?? []) ds.push({ tipo: 'contexto', titulo: c.titulo, texto: c.texto })
    if ((f.evidencia && f.evidencia.length) || f.limites) ds.push({ tipo: 'ejemplos' })
    if (b.diagrama) ds.push({ tipo: 'diagrama' })
    if (b.preguntas.length) ds.push({ tipo: 'comprueba' })
    if (f.cuaderno) ds.push({ tipo: 'recuerda' })
    if (ajustes.docente && f.docente) ds.push({ tipo: 'docente' })
    return ds.map((d, k) => ({ bloque: b, d, n: k + 1, de: ds.length }))
  })
}
