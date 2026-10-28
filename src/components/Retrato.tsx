import type { Autor } from '../data/schema.ts'

/**
 * Retrato enmarcado de un autor. Usa `autor.imagen` si existe; si no, una silueta
 * ilustrada genérica (no pretende parecerse al personaje).
 */
export default function Retrato({ autor }: { autor: Autor }) {
  return (
    <figure className="m-0">
      <div className="relative rounded-md bg-gradient-to-br from-[#9a7640] to-[#4a3416] p-2 shadow-lg">
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[#efe3cc]">
          {autor.imagen ? (
            <img src={`${import.meta.env.BASE_URL}${autor.imagen.replace(/^\//, '')}`} alt={`Imagen de ${autor.nombre}`} className="h-full w-full object-cover" />
          ) : (
            <svg viewBox="0 0 150 200" role="img" aria-label={`Silueta ilustrada de ${autor.nombre}`} className="h-full w-full">
              <defs>
                <radialGradient id="fondo-retrato" cx="50%" cy="38%" r="70%">
                  <stop offset="0" stopColor="#f8efd7" />
                  <stop offset="1" stopColor="#d9c39a" />
                </radialGradient>
              </defs>
              <rect width="150" height="200" fill="url(#fondo-retrato)" />
              <path d="M8 200 C8 150 42 132 75 132 C108 132 142 150 142 200 Z" fill="#5b4023" />
              <rect x="62" y="104" width="26" height="34" rx="8" fill="#8a6a3b" />
              <ellipse cx="75" cy="82" rx="30" ry="37" fill="#8a6a3b" />
              <path d="M58 134 L75 160 L92 134 L84 130 L75 142 L66 130 Z" fill="#f6efdc" />
            </svg>
          )}
          <figcaption className="absolute inset-x-2 bottom-2 rounded bg-[#c9a24b] px-2 py-1 text-center text-xs font-semibold leading-tight text-[#2b1d08] shadow">
            {autor.nombre}
            {autor.vida && <span className="block font-normal">{autor.vida}</span>}
          </figcaption>
        </div>
      </div>
    </figure>
  )
}
