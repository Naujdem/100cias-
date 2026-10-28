import type { Bloque } from '../../data/schema.ts'

function MiniCorcho() {
  return (
    <svg viewBox="0 0 160 100" className="h-full w-full" aria-hidden="true">
      <defs>
        <pattern id="mini-celdas" width="22" height="12" patternUnits="userSpaceOnUse">
          <rect width="22" height="12" fill="#f3e7c9" />
          <path d="M0 0h22M0 6h22M11 0v6M0 6v6" stroke="#6b4a1f" strokeWidth="1.4" fill="none" />
        </pattern>
        <clipPath id="mini-lente">
          <circle cx="80" cy="50" r="38" />
        </clipPath>
      </defs>
      <rect width="160" height="100" fill="#d9b77f" />
      <g clipPath="url(#mini-lente)">
        <rect x="42" y="12" width="76" height="76" fill="url(#mini-celdas)" />
      </g>
      <circle cx="80" cy="50" r="38" fill="none" stroke="#4a3416" strokeWidth="5" />
      <line x1="108" y1="78" x2="124" y2="94" stroke="#4a3416" strokeWidth="8" strokeLinecap="round" />
    </svg>
  )
}

const MINIATURAS: Record<string, () => React.JSX.Element> = {
  'corcho-hooke': MiniCorcho,
}

function iniciales(nombre: string): string {
  return nombre
    .split(/\s+/)
    .filter((p) => /^[A-ZÁÉÍÓÚ]/.test(p))
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
}

/** Imagen enmarcada del hito: ilustración propia si existe, y si no, iniciales del autor. */
export default function Miniatura({ bloque }: { bloque: Bloque }) {
  const Ilustracion = bloque.diagrama ? MINIATURAS[bloque.diagrama] : undefined
  return (
    <div className="inline-block bg-white p-1.5 shadow-md ring-1 ring-black/5">
      <div className="h-24 w-36 overflow-hidden">
        {Ilustracion ? (
          <Ilustracion />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#cfe9e4] font-serif text-3xl font-bold text-[#134e4a]">
            {bloque.autores?.[0] ? iniciales(bloque.autores[0].nombre) : bloque.anio}
          </div>
        )}
      </div>
    </div>
  )
}
