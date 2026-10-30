import { useSyncExternalStore } from 'react'
import type { Bloque } from '../data/schema.ts'
import { guardar, leer } from './almacen.ts'

// Progreso del estudiante en este navegador: qué fichas abrió, cómo le fue en cada pregunta y su mejor puntaje del quiz.
// Se guarda en localStorage (todavía no hay inicio de sesión); varios componentes lo leen con `usarProgreso`.

export interface Progreso {
  /** ids de bloque que ya abrió, por subtema */
  vistos: Record<string, string[]>
  /** último resultado de cada pregunta (true = acertó) */
  respuestas: Record<string, boolean>
  /** mejor puntaje del quiz, por subtema */
  quiz: Record<string, { mejor: number; total: number }>
}

export type EstadoBloque = 'nuevo' | 'visto' | 'comprobado'

const CLAVE = 'cien:progreso'
let estado: Progreso = { vistos: {}, respuestas: {}, quiz: {}, ...leer<Partial<Progreso>>(CLAVE, {}) }
const oyentes = new Set<() => void>()

function cambiar(f: (p: Progreso) => Progreso) {
  estado = f(estado)
  guardar(CLAVE, estado)
  oyentes.forEach((o) => o())
}
const suscribir = (o: () => void) => {
  oyentes.add(o)
  return () => {
    oyentes.delete(o)
  }
}

export const usarProgreso = (): Progreso => useSyncExternalStore(suscribir, () => estado)

export function marcarVisto(temaId: string, bloqueId: string) {
  if (estado.vistos[temaId]?.includes(bloqueId)) return
  cambiar((p) => ({ ...p, vistos: { ...p.vistos, [temaId]: [...(p.vistos[temaId] ?? []), bloqueId] } }))
}

export function registrarRespuesta(preguntaId: string, acerto: boolean) {
  if (estado.respuestas[preguntaId] === acerto) return
  cambiar((p) => ({ ...p, respuestas: { ...p.respuestas, [preguntaId]: acerto } }))
}

export function guardarQuiz(temaId: string, aciertos: number, total: number) {
  const previo = estado.quiz[temaId]
  if (previo && previo.mejor / previo.total >= aciertos / total) return
  cambiar((p) => ({ ...p, quiz: { ...p.quiz, [temaId]: { mejor: aciertos, total } } }))
}

/** Borra el progreso de un subtema (fichas vistas, preguntas y puntaje del quiz). */
export function borrarProgreso(temaId: string, bloques: Bloque[]) {
  const ids = new Set(bloques.flatMap((b) => b.preguntas.map((q) => q.id)))
  cambiar((p) => {
    const vistos = { ...p.vistos }
    const quiz = { ...p.quiz }
    delete vistos[temaId]
    delete quiz[temaId]
    return { vistos, quiz, respuestas: Object.fromEntries(Object.entries(p.respuestas).filter(([k]) => !ids.has(k))) }
  })
}

/** «comprobado» = acertó todas las preguntas de la ficha; «visto» = la abrió. */
export function estadoDe(p: Progreso, temaId: string, b: Bloque): EstadoBloque {
  if (b.preguntas.length > 0 && b.preguntas.every((q) => p.respuestas[q.id] === true)) return 'comprobado'
  return p.vistos[temaId]?.includes(b.id) ? 'visto' : 'nuevo'
}
