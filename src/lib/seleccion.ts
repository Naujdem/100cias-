// Lógica pura (sin React) para activar y desactivar bloques respetando
// el núcleo y las dependencias. Sin imports de runtime para poder probarla con Node.
import type { Bloque } from '../data/schema.ts'

type Mapa = Map<string, Bloque>

const mapa = (bloques: Bloque[]): Mapa => new Map(bloques.map((b) => [b.id, b]))

/** Todos los bloques requeridos (de forma transitiva) por `id`. */
function requisitos(m: Mapa, id: string, vistos = new Set<string>()): Set<string> {
  for (const r of m.get(id)?.requiere ?? []) {
    if (!vistos.has(r)) {
      vistos.add(r)
      requisitos(m, r, vistos)
    }
  }
  return vistos
}

/** Bloques que dependen (transitivamente) de `id`. */
function dependientes(m: Mapa, id: string): Set<string> {
  const out = new Set<string>()
  let cambio = true
  while (cambio) {
    cambio = false
    for (const b of m.values()) {
      if (out.has(b.id)) continue
      const depende = (b.requiere ?? []).some((r) => r === id || out.has(r))
      if (depende) {
        out.add(b.id)
        cambio = true
      }
    }
  }
  return out
}

/** Asegura que el núcleo esté activo y que no falte ningún requisito. */
export function normalizar(bloques: Bloque[], activos: Iterable<string>): Set<string> {
  const m = mapa(bloques)
  const out = new Set<string>()
  for (const id of activos) if (m.has(id)) out.add(id)
  for (const b of bloques) if (b.nucleo) out.add(b.id)
  for (const id of [...out]) for (const r of requisitos(m, id)) out.add(r)
  return out
}

export interface Resultado {
  activos: Set<string>
  /** ids que se activaron o desactivaron además del pedido, para avisar al usuario */
  arrastrados: string[]
}

export function alternar(bloques: Bloque[], activos: Set<string>, id: string): Resultado {
  const m = mapa(bloques)
  const b = m.get(id)
  if (!b) return { activos, arrastrados: [] }
  const sig = new Set(activos)
  const arrastrados: string[] = []

  if (sig.has(id)) {
    if (b.nucleo) return { activos, arrastrados: [] }
    sig.delete(id)
    for (const d of dependientes(m, id)) {
      if (sig.delete(d)) arrastrados.push(d)
    }
  } else {
    sig.add(id)
    for (const r of requisitos(m, id)) {
      if (!sig.has(r)) {
        sig.add(r)
        arrastrados.push(r)
      }
    }
  }
  return { activos: sig, arrastrados }
}
