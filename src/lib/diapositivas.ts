import type { Bloque, Ilustracion, Lamina } from '../data/schema.ts'
import type { Ajustes } from './ajustes.ts'
import { perfilActual } from './temas.ts'

const ORDEN = { basico: 0, intermedio: 1, avanzado: 2 } as const

// Las diapositivas no se escriben aparte: se arman a partir de la ficha de cada bloque,
// así no se pierde nada de lo que ya está y un cambio en la ficha se ve en las dos formas.

export type Diapositiva =
  | { tipo: 'portada' }
  | { tipo: 'lamina'; lamina: Lamina }
  | { tipo: 'idea' }
  | { tipo: 'ilustracion'; ilustracion: Ilustracion }
  | { tipo: 'analogia' }
  | { tipo: 'contexto'; datos: { titulo: string; texto: string }[] }
  | { tipo: 'ejemplos' }
  | { tipo: 'diagrama' }
  | { tipo: 'juego' }
  | { tipo: 'comprueba' }
  | { tipo: 'recuerda' }
  | { tipo: 'docente' }

export interface Item {
  bloque: Bloque
  d: Diapositiva
  /** «contenido» va primero para todos los bloques; las actividades quedan juntas al final */
  seccion: 'contenido' | 'actividades'
  /** posición de la diapositiva dentro de su bloque y sección (1…) y total */
  n: number
  de: number
}

/**
 * Primero el contenido de todos los bloques (portada, idea, imágenes, analogía, datos, ejemplos y límites, para recordar y,
 * en modo docente, notas); al final, las actividades (diagrama y Comprueba) de todos los bloques.
 */
export function construir(bloques: Bloque[], ajustes: Pick<Ajustes, 'analogias' | 'docente'>): Item[] {
  const contenido = bloques.flatMap((b) => {
    const f = b.ficha
    if (b.diapositivas?.length) {
      // láminas escritas a propósito: portada, láminas, para recordar y notas del docente
      // las láminas con `nivel` solo salen si el grado elegido llega a ese nivel
      const tope = ORDEN[perfilActual().nivelDibujo]
      const alcanza = (n?: Lamina['nivel']) => !n || ORDEN[n] <= tope
      const laminas = b.diapositivas
        .filter((l) => alcanza(l.nivel))
        .map((l) => (l.visual?.tipo === 'escena' ? { ...l, visual: { ...l.visual, fases: l.visual.fases.filter((f) => alcanza(f.nivel)) } } : l))
      const dl: Diapositiva[] = [{ tipo: 'portada' }, ...laminas.map((lamina): Diapositiva => ({ tipo: 'lamina', lamina }))]
      if (f.cuaderno) dl.push({ tipo: 'recuerda' })
      if (ajustes.docente && f.docente) dl.push({ tipo: 'docente' })
      return dl.map((d, k): Item => ({ bloque: b, d, seccion: 'contenido', n: k + 1, de: dl.length }))
    }
    const ds: Diapositiva[] = [{ tipo: 'portada' }, { tipo: 'idea' }]
    // la primera imagen acompaña a casi todas las diapositivas del bloque; las demás tienen su propia diapositiva
    for (const i of (b.ilustraciones ?? []).slice(1)) ds.push({ tipo: 'ilustracion', ilustracion: i })
    if (ajustes.analogias && f.analogia) ds.push({ tipo: 'analogia' })
    // los datos de contexto van de dos en dos para no alargar la presentación
    const datos = f.contexto ?? []
    for (let k = 0; k < datos.length; k += 2) ds.push({ tipo: 'contexto', datos: datos.slice(k, k + 2) })
    if ((f.evidencia && f.evidencia.length) || f.limites) ds.push({ tipo: 'ejemplos' })
    if (f.cuaderno) ds.push({ tipo: 'recuerda' })
    if (ajustes.docente && f.docente) ds.push({ tipo: 'docente' })
    return ds.map((d, k): Item => ({ bloque: b, d, seccion: 'contenido', n: k + 1, de: ds.length }))
  })
  // Lección: después del contenido de cada bloque van sus actividades (Explora, Juega, Comprueba).
  const actividadesDe = (b: Bloque): Item[] => {
    const ds: Diapositiva[] = []
    const yaEnLamina = (b.diapositivas ?? []).some((l) => l.visual?.tipo === 'diagrama' && l.visual.id === b.diagrama)
    if (b.diagrama && !yaEnLamina) ds.push({ tipo: 'diagrama' })
    if (b.juego) ds.push({ tipo: 'juego' })
    if (b.preguntas.length) ds.push({ tipo: 'comprueba' })
    return ds.map((d, k): Item => ({ bloque: b, d, seccion: 'actividades', n: k + 1, de: ds.length }))
  }
  return bloques.flatMap((b) => [...contenido.filter((x) => x.bloque.id === b.id), ...actividadesDe(b)])
}

/** Cuántas cosas se revelan con → en una diapositiva: las del visual (tarjetas o lados) y luego los puntos. */
export function pasosDe(d: Diapositiva): number {
  if (d.tipo !== 'lamina') return 0
  const v = d.lamina.visual
  const enVisual = v?.tipo === 'tarjetas' ? v.items.length : v?.tipo === 'compara' ? 2 : v?.tipo === 'escena' ? v.fases.length - 1 : 0
  return enVisual + (d.lamina.puntos?.length ?? 0)
}
