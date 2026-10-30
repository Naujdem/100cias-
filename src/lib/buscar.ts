import type { Tema } from '../data/schema.ts'

// Búsqueda de texto en todo el contenido (sin distinguir mayúsculas ni tildes). Todas las palabras deben aparecer.

export interface Resultado {
  temaId: string
  temaEtiqueta: string
  bloqueId: string
  titulo: string
  /** fragmento donde aparece la búsqueda */
  extracto: string
  puntos: number
}

/** minúsculas y sin tildes, carácter por carácter para no desalinear posiciones */
export function normalizarTexto(s: string): string {
  let r = ''
  for (const c of s) r += c.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  return r
}

export function palabras(consulta: string): string[] {
  return normalizarTexto(consulta).split(/\s+/).filter((p) => p.length >= 2)
}

interface Campo {
  texto: string
  peso: number
}

function camposDe(b: Tema['bloques'][number]): Campo[] {
  const f = b.ficha
  return [
    { texto: b.titulo, peso: 6 },
    ...(b.autores ?? []).map((a) => ({ texto: a.nombre, peso: 5 })),
    { texto: b.resumen, peso: 3 },
    { texto: f.idea, peso: 2 },
    ...(f.contexto ?? []).flatMap((c) => [{ texto: c.titulo, peso: 2 }, { texto: c.texto, peso: 1 }]),
    ...(f.evidencia ?? []).map((texto) => ({ texto, peso: 1 })),
    ...(f.limites ? [{ texto: f.limites, peso: 1 }] : []),
    ...(f.cuaderno ? [...f.cuaderno.facil, ...f.cuaderno.media, ...f.cuaderno.avanzada].map((texto) => ({ texto, peso: 1 })) : []),
    ...(b.autores ?? []).map((a) => ({ texto: a.aporte, peso: 1 })),
    ...b.preguntas.map((p) => ({ texto: p.enunciado, peso: 1 })),
  ]
}

function fragmento(texto: string, ini: number, largo: number): string {
  const desde = Math.max(0, ini - 40)
  const hasta = Math.min(texto.length, ini + largo + 70)
  return `${desde > 0 ? '…' : ''}${texto.slice(desde, hasta).trim()}${hasta < texto.length ? '…' : ''}`
}

export function buscar(temas: Tema[], consulta: string, max = 8): Resultado[] {
  const ps = palabras(consulta)
  if (!ps.length) return []
  const salida: Resultado[] = []
  for (const t of temas) {
    for (const b of t.bloques) {
      const campos = camposDe(b).map((c) => ({ ...c, norm: normalizarTexto(c.texto) }))
      let puntos = 0
      let ok = true
      for (const p of ps) {
        const pesos = campos.filter((c) => c.norm.includes(p)).map((c) => c.peso)
        if (!pesos.length) {
          ok = false
          break
        }
        puntos += Math.max(...pesos)
      }
      if (!ok) continue
      // el fragmento sale del campo más importante donde aparece la primera palabra
      const mejor = campos.filter((c) => c.norm.includes(ps[0])).sort((a, b2) => b2.peso - a.peso)[0]
      salida.push({
        temaId: t.id,
        temaEtiqueta: t.etiqueta ?? '',
        bloqueId: b.id,
        titulo: b.titulo,
        extracto: mejor.peso >= 6 ? b.resumen : fragmento(mejor.texto, mejor.norm.indexOf(ps[0]), ps[0].length),
        puntos,
      })
    }
  }
  return salida.sort((a, b) => b.puntos - a.puntos).slice(0, max)
}
