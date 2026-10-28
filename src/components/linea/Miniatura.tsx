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

function MiniGota() {
  return (
    <svg viewBox="0 0 160 100" className="h-full w-full" aria-hidden="true">
      <rect width="160" height="100" fill="#d8f0f3" />
      <circle cx="80" cy="50" r="38" fill="#e9f8fa" stroke="#3c7f8a" strokeWidth="4" />
      <ellipse cx="70" cy="44" rx="15" ry="6" fill="#a7d3a0" stroke="#3f7a3a" strokeWidth="1.5" transform="rotate(-20 70 44)" />
      <ellipse cx="96" cy="62" rx="10" ry="4.5" fill="#a7d3a0" stroke="#3f7a3a" strokeWidth="1.5" transform="rotate(25 96 62)" />
      {[[58,62],[72,70],[88,40],[100,50],[64,52],[80,64]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="1.6" fill="#7a4a8a" />)}
    </svg>
  )
}

function MiniPlanta() {
  return (
    <svg viewBox="0 0 160 100" className="h-full w-full" aria-hidden="true">
      <rect width="160" height="100" fill="#f1f7df" />
      {[0, 1, 2, 3].map((f) => [0, 1, 2, 3, 4].map((c) => (
        <g key={`${f}${c}`}>
          <rect x={10 + c * 28} y={8 + f * 22} width="28" height="22" fill="#cfe8f2" stroke="#6b8a2f" strokeWidth="3" />
          <circle cx={(f + c) % 2 ? 32 + c * 28 : 16 + c * 28} cy={14 + f * 22} r="2.6" fill="#c9a0dc" stroke="#7a4a8a" />
        </g>
      )))}
    </svg>
  )
}

function MiniAnimal() {
  return (
    <svg viewBox="0 0 160 100" className="h-full w-full" aria-hidden="true">
      <rect width="160" height="100" fill="#f6e3e3" />
      {[0, 1, 2, 3].map((f) => [0, 1, 2, 3, 4].map((c) => {
        const x = 14 + c * 32 + (f % 2 ? 16 : 0)
        const y = 12 + f * 25
        return (
          <g key={`${f}${c}`}>
            <circle cx={x} cy={y} r="14" fill="#f8d9d4" stroke="#b05a5a" strokeWidth="1.5" />
            <circle cx={x} cy={y} r="4.2" fill="#c9a0dc" stroke="#7a4a8a" />
          </g>
        )
      }))}
    </svg>
  )
}

function MiniDivision() {
  return (
    <svg viewBox="0 0 160 100" className="h-full w-full" aria-hidden="true">
      <rect width="160" height="100" fill="#f3e7ef" />
      <circle cx="56" cy="50" r="30" fill="#f8d9d4" stroke="#b05a5a" strokeWidth="3" />
      <circle cx="104" cy="50" r="30" fill="#f8d9d4" stroke="#b05a5a" strokeWidth="3" />
      <circle cx="56" cy="50" r="12" fill="#ead3f2" stroke="#7a4a8a" strokeWidth="2" />
      <circle cx="104" cy="50" r="12" fill="#ead3f2" stroke="#7a4a8a" strokeWidth="2" />
    </svg>
  )
}

function MiniMatraz() {
  return (
    <svg viewBox="0 0 160 100" className="h-full w-full" aria-hidden="true">
      <rect width="160" height="100" fill="#eef4f3" />
      <circle cx="80" cy="64" r="26" fill="#f6e7a8" stroke="#3c7f8a" strokeWidth="3" />
      <path d="M80 40 V26 Q80 14 92 14 Q104 14 104 26 V34" fill="none" stroke="#3c7f8a" strokeWidth="6" />
    </svg>
  )
}

const MINIATURAS: Record<string, () => React.JSX.Element> = {
  'corcho-hooke': MiniCorcho,
  'gota-leeuwenhoek': MiniGota,
  'experimento-pasteur': MiniMatraz,
  'division-celular': MiniDivision,
  'tejido-planta': MiniPlanta,
  'tejido-animal': MiniAnimal,
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
