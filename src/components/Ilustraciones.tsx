import { useState } from 'react'
import type { Ilustracion } from '../data/schema.ts'
import { ILUSTRACIONES_SVG } from './ilustraciones/index.ts'
import VisorZoom from './VisorZoom.tsx'
import PantallaCompleta from './PantallaCompleta.tsx'

const ruta = (r: string) => `${import.meta.env.BASE_URL}${r.replace(/^\//, '')}`

export function Contenido({ i }: { i: Ilustracion }) {
  if (i.tipo === 'imagen') {
    return <img src={ruta(i.recurso)} alt={i.alt ?? i.titulo} draggable={false} className="h-full w-full object-contain" />
  }
  const Svg = ILUSTRACIONES_SVG[i.recurso]
  return Svg ? <Svg /> : null
}

/** Tira de imágenes del hito. Al tocar una se abre en un visor donde se puede acercar. */
export default function Ilustraciones({ items }: { items: Ilustracion[] }) {
  const [sel, setSel] = useState<string | null>(null)
  const actual = items.find((i) => i.id === sel)

  return (
    <section aria-label="Imágenes del hito" className="mt-4">
      <p className="mb-2 text-sm font-semibold">Mira de cerca</p>
      <ul className="grid grid-cols-3 gap-2">
        {items.map((i) => {
          const activa = i.id === sel
          return (
            <li key={i.id}>
              <button
                type="button"
                aria-pressed={activa}
                onClick={() => setSel(activa ? null : i.id)}
                className={`block w-full rounded-xl border-2 p-1 text-left transition ${
                  activa ? 'border-[var(--acento)] bg-[var(--acento-suave)]/40' : 'border-[var(--linea)] hover:border-[var(--acento)]'
                }`}
              >
                <span className="block aspect-[4/3] overflow-hidden rounded-lg bg-[#efe3cc]">
                  <Contenido i={i} />
                </span>
                <span className="mt-1 block px-1 text-xs font-semibold leading-tight">{i.titulo}</span>
              </button>
            </li>
          )
        })}
      </ul>

      {actual && (
        <PantallaCompleta className="mt-3">
          <VisorZoom etiqueta={actual.titulo}>
            <Contenido i={actual} />
          </VisorZoom>
          <div className="mt-2 text-sm">
            <p>{actual.pie}</p>
            {actual.credito && <p className="mt-1 text-xs text-[var(--suave)]">{actual.credito}</p>}
            {actual.tipo === 'svg' && <p className="mt-1 text-xs text-[var(--suave)]">Ilustración esquemática, no está a escala.</p>}
          </div>
        </PantallaCompleta>
      )}
    </section>
  )
}
