import type { PropsVista } from './tipos.ts'
import type { Bloque } from '../../data/schema.ts'
import InsigniaProgreso from '../InsigniaProgreso.tsx'

// Mapa de tipos de células: un árbol tocable. Cada nodo abre un bloque; si el perfil no lo
// tiene activo, el nodo se ve apagado. Los virus quedan aparte, con borde punteado.
// Los ids de bloque de este mapa pertenecen al subtema «Tipos de células».

interface Nodo {
  bloque: string
  texto: string
  sub: string
  color: string
}

const RAIZ: Nodo = { bloque: 'pro-eu', texto: 'Células', sub: 'la gran división: ¿con o sin núcleo?', color: 'bg-[var(--tarjeta)]' }
const PRO: Nodo = { bloque: 'bacterias-arqueas', texto: 'Procariotas', sub: 'bacterias y arqueas · sin núcleo', color: 'bg-green-100' }
const EU: Nodo = { bloque: 'eucariotas', texto: 'Eucariotas', sub: 'con núcleo', color: 'bg-red-100' }
const RAMAS: Nodo[] = [
  { bloque: 'eucariotas', texto: 'Protistas', sub: 'algas, amebas…', color: 'bg-pink-100' },
  { bloque: 'eucariotas', texto: 'Hongos', sub: 'levaduras, setas…', color: 'bg-amber-100' },
  { bloque: 'animal-vegetal', texto: 'Plantas', sub: 'con pared y cloroplastos', color: 'bg-lime-100' },
  { bloque: 'animal-vegetal', texto: 'Animales', sub: 'sin pared', color: 'bg-orange-100' },
]
const ESPECIAL: Nodo = { bloque: 'especializadas', texto: 'Células especializadas', sub: 'dentro de un organismo: neuronas, glóbulos…', color: 'bg-[var(--acento-suave)]/40' }
const VIRUS: Nodo = { bloque: 'virus', texto: 'Virus', sub: 'no son células', color: 'bg-white' }

export default function VistaMapa({ bloques, abierto, onSeleccionar, carril, estados }: PropsVista) {
  const por = new Map<string, Bloque>(bloques.map((b) => [b.id, b]))
  const nodo = (n: Nodo, extra = '') => {
    const b = por.get(n.bloque)
    const sel = abierto === n.bloque
    return (
      <button
        type="button"
        disabled={!b}
        data-hito={b ? n.bloque : undefined}
        aria-expanded={b ? sel : undefined}
        aria-label={b ? `${n.texto}: ${n.sub}` : `${n.texto}: oculto en tu perfil`}
        onClick={() => b && onSeleccionar(n.bloque)}
        className={`relative min-h-12 w-full rounded-2xl border-2 px-3 py-2 text-left transition focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[var(--tinta)] ${n.color} ${
          sel ? 'border-[var(--acento)] ring-2 ring-[var(--acento)]' : 'border-[var(--tinta)]/70 hover:border-[var(--acento)]'
        } ${b ? '' : 'cursor-not-allowed opacity-40'} ${extra}`}
      >
        <span className="block text-sm font-bold leading-tight">{n.texto}</span>
        <span className="block text-xs text-[var(--suave)]">{n.sub}</span>
        {b && (
          <span className="absolute right-2 top-2">
            <InsigniaProgreso estado={estados?.[n.bloque]} />
          </span>
        )}
      </button>
    )
  }
  return (
    <div ref={carril} aria-label="Mapa de tipos de células" className="mx-auto max-w-2xl">
      <div className="mx-auto w-2/3 max-w-xs">{nodo(RAIZ)}</div>
      <div aria-hidden="true" className="mx-auto h-4 w-0.5 bg-[var(--tinta)]/60" />
      <div className="grid grid-cols-2 gap-3 border-t-2 border-[var(--tinta)]/60 pt-4">
        <div>{nodo(PRO)}</div>
        <div>{nodo(EU)}</div>
      </div>
      <div aria-hidden="true" className="ml-[75%] h-4 w-0.5 bg-[var(--tinta)]/60" />
      <div className="mt-0 grid grid-cols-2 gap-2 border-t-2 border-[var(--tinta)]/60 pt-3 sm:grid-cols-4">
        {RAMAS.map((r) => (
          <div key={r.texto}>{nodo(r)}</div>
        ))}
      </div>
      <div className="mt-4">{nodo(ESPECIAL)}</div>
      <div className="mt-4 rounded-2xl border-2 border-dashed border-[var(--suave)] p-3">
        <p className="mb-2 text-xs font-semibold text-[var(--suave)]">Fuera del árbol</p>
        <div className="max-w-xs">{nodo(VIRUS, 'border-dashed')}</div>
      </div>
    </div>
  )
}
