import { useMemo, useState } from 'react'
import VisorZoom from '../VisorZoom.tsx'
import PantallaCompleta from '../PantallaCompleta.tsx'

// Niveles de organización de la vida, de átomos a más allá del organismo, con un ejemplo seguido de punta a punta.

export interface Nivel {
  id: string
  nombre: string
  corto: string
  persona: string
  planta: string
  que: string
}

export const NIVELES: Nivel[] = [
  { id: 'atomos', nombre: 'Átomos', corto: 'Átomos', persona: 'Carbono, hidrógeno, oxígeno y nitrógeno.', planta: 'Los mismos: carbono, hidrógeno, oxígeno y nitrógeno.', que: 'Los ladrillos de toda la materia. Los seres vivos están hechos sobre todo de unos pocos tipos de átomos.' },
  { id: 'moleculas', nombre: 'Moléculas', corto: 'Moléculas', persona: 'Agua, glucosa y oxígeno (O₂).', planta: 'Agua, dióxido de carbono (CO₂) y glucosa.', que: 'Átomos unidos entre sí. Una molécula sola todavía no está viva.' },
  { id: 'macromoleculas', nombre: 'Macromoléculas', corto: 'Macromoléc.', persona: 'Miosina, una proteína del músculo, y el ADN.', planta: 'Celulosa y proteínas como la rubisco.', que: 'Moléculas muy grandes: proteínas, ácidos nucleicos, carbohidratos y lípidos.' },
  { id: 'organulos', nombre: 'Orgánulos', corto: 'Orgánulos', persona: 'Una mitocondria.', planta: 'Un cloroplasto.', que: 'Estructuras dentro de la célula, cada una con su función.' },
  { id: 'celula', nombre: 'Célula', corto: 'Célula', persona: 'Una célula del músculo del corazón.', planta: 'Una célula del parénquima de la hoja.', que: 'La unidad básica de la vida: es el primer nivel donde hay un ser vivo.' },
  { id: 'tejido', nombre: 'Tejido', corto: 'Tejido', persona: 'Tejido muscular cardíaco.', planta: 'Parénquima clorofílico, el que hace la fotosíntesis.', que: 'Células parecidas que trabajan juntas en una misma función.' },
  { id: 'organo', nombre: 'Órgano', corto: 'Órgano', persona: 'El corazón.', planta: 'Una hoja.', que: 'Varios tejidos que trabajan juntos en una función.' },
  { id: 'sistema', nombre: 'Sistema de órganos', corto: 'Sistema', persona: 'El sistema circulatorio: corazón, vasos y sangre.', planta: 'El sistema del vástago: tallo y hojas.', que: 'Varios órganos que cooperan para una función mayor.' },
  { id: 'organismo', nombre: 'Organismo', corto: 'Organismo', persona: 'Una persona.', planta: 'Una planta de fríjol.', que: 'Un ser vivo completo, con todos sus sistemas funcionando.' },
  { id: 'mas-alla', nombre: 'Más allá del organismo', corto: 'Más allá', persona: 'Población, comunidad y ecosistema donde vive.', planta: 'Un bosque y el ecosistema que forma.', que: 'Organismos que viven juntos y se relacionan entre sí y con su entorno, hasta la biosfera.' },
]

type Modo = 'zoom' | 'ordena'
type Ejemplo = 'persona' | 'planta'

export default function NivelesOrganizacion({ inicial = 4 }: { inicial?: number }) {
  const [modo, setModo] = useState<Modo>('zoom')
  return (
    <div>
      <div role="group" aria-label="Actividad" className="mb-3 flex flex-wrap gap-2">
        {([['zoom', 'Niveles anidados'], ['ordena', 'Ordénalos']] as [Modo, string][]).map(([id, texto]) => (
          <button
            key={id}
            type="button"
            aria-pressed={modo === id}
            onClick={() => setModo(id)}
            className="min-h-10 rounded-full border border-[var(--acento)] px-3 text-sm font-semibold text-[var(--acento)] aria-pressed:bg-[var(--acento)] aria-pressed:text-white"
          >
            {texto}
          </button>
        ))}
      </div>
      {modo === 'zoom' ? <Anidados inicial={inicial} /> : <Ordena />}
    </div>
  )
}

const N = NIVELES.length
const PASO = 13

function Anidados({ inicial }: { inicial: number }) {
  const [sel, setSel] = useState(inicial)
  const [ejemplo, setEjemplo] = useState<Ejemplo>('persona')
  const n = NIVELES[sel]
  return (
    <PantallaCompleta>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold">Ejemplo:</span>
        {([['persona', 'Una persona'], ['planta', 'Una planta']] as [Ejemplo, string][]).map(([id, t]) => (
          <button
            key={id}
            type="button"
            aria-pressed={ejemplo === id}
            onClick={() => setEjemplo(id)}
            className="min-h-10 rounded-lg border border-[var(--linea)] px-3 text-sm font-semibold aria-pressed:border-[var(--acento)] aria-pressed:bg-[var(--acento-suave)]/40"
          >
            {t}
          </button>
        ))}
      </div>
      <VisorZoom etiqueta="Niveles de organización anidados" alto="aspect-[4/3]">
        <svg viewBox="0 0 400 300" role="img" aria-label="Niveles de organización, uno dentro de otro: de los átomos al ecosistema" className="h-full w-full">
          <rect x="-1500" y="-1500" width="3400" height="3300" fill="var(--fondo)" />
          {[...NIVELES].reverse().map((_, k) => {
            const i = N - 1 - k // k=0 es el nivel más grande
            const inset = k * PASO
            const activo = i === sel
            return (
              <g key={NIVELES[i].id}>
                <rect
                  x={inset + 3}
                  y={inset + 3}
                  width={400 - 2 * (inset + 3)}
                  height={300 - 2 * (inset + 3)}
                  rx={16}
                  fill={activo ? '#bfe6df' : i % 2 ? '#f1e9db' : '#f8f3e8'}
                  stroke={activo ? '#0f766e' : '#b8a98a'}
                  strokeWidth={activo ? 3 : 1.2}
                  className="cursor-pointer"
                  onClick={() => setSel(i)}
                />
                <text x={inset + 12} y={inset + 14.5} fontSize="9.5" fontWeight={activo ? 700 : 500} fill="#2b1d08" pointerEvents="none">
                  {NIVELES[i].corto}
                </text>
              </g>
            )
          })}
        </svg>
      </VisorZoom>
      <div className="mt-3">
        <label htmlFor="nivel-org" className="flex items-center justify-between text-sm font-semibold">
          <span>Nivel {sel + 1} de {N}</span>
          <span className="font-normal text-[var(--suave)]">{n.nombre}</span>
        </label>
        <input
          id="nivel-org"
          type="range"
          min="0"
          max={N - 1}
          step="1"
          value={sel}
          onChange={(e) => setSel(Number(e.target.value))}
          onPointerUp={(e) => e.currentTarget.closest<HTMLElement>('[role=dialog]')?.focus()}
          className="mt-1 h-8 w-full accent-[var(--acento)]"
        />
      </div>
      <div aria-live="polite" className="mt-2 min-h-[5.5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
        <p className="font-semibold">{n.nombre}</p>
        <p>{n.que}</p>
        <p className="mt-1">
          <span className="font-semibold">{ejemplo === 'persona' ? 'En una persona' : 'En una planta'}:</span> {n[ejemplo]}
        </p>
        {sel < N - 1 && <p className="mt-1 text-[var(--suave)]">Está dentro de: {NIVELES[sel + 1].nombre.toLowerCase()}.</p>}
      </div>
      <p className="mt-2 text-xs text-[var(--suave)]">Ilustración esquemática: los tamaños de los recuadros no representan los tamaños reales.</p>
    </PantallaCompleta>
  )
}

function barajar(semilla: number) {
  let s = semilla
  const a = NIVELES.map((n) => n.id)
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) % 4294967296
    const j = s % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function Ordena() {
  const [ronda, setRonda] = useState(1)
  const orden = useMemo(() => barajar(ronda * 7919), [ronda])
  const [elegidos, setElegidos] = useState<string[]>([])
  const [errores, setErrores] = useState(0)
  const [aviso, setAviso] = useState('')
  const hecho = elegidos.length === N

  const tocar = (id: string) => {
    if (hecho || elegidos.includes(id)) return
    const siguiente = NIVELES[elegidos.length]
    if (id === siguiente.id) {
      setElegidos([...elegidos, id])
      setAviso('')
    } else {
      setErrores((e) => e + 1)
      setAviso(
        elegidos.length === 0
          ? 'Ese no es el más pequeño. Empieza por lo más pequeño de todos.'
          : `Ese no es el siguiente. Busca el nivel que contiene justo a: ${NIVELES[elegidos.length - 1].nombre.toLowerCase()}.`,
      )
    }
  }
  const reiniciar = () => {
    setRonda((r) => r + 1)
    setElegidos([])
    setErrores(0)
    setAviso('')
  }

  return (
    <div>
      <p className="text-sm">Toca los niveles en orden, del más pequeño al más grande. Cada uno contiene al anterior.</p>
      <div role="group" aria-label="Niveles por ordenar" className="mt-3 flex flex-wrap gap-2">
        {orden.map((id) => {
          const n = NIVELES.find((x) => x.id === id)!
          const usado = elegidos.includes(id)
          return (
            <button
              key={id}
              type="button"
              disabled={usado}
              onClick={() => tocar(id)}
              className="min-h-10 rounded-lg border border-[var(--linea)] px-3 text-sm font-semibold enabled:hover:border-[var(--acento)] disabled:opacity-35"
            >
              {n.nombre}
            </button>
          )
        })}
      </div>
      <ol className="mt-3 flex flex-wrap gap-1 text-sm" aria-label="Tu orden">
        {elegidos.map((id, i) => (
          <li key={id} className="rounded-full bg-[var(--acento-suave)]/50 px-3 py-1">
            {i + 1}. {NIVELES.find((x) => x.id === id)!.nombre}
          </li>
        ))}
      </ol>
      <div aria-live="polite" className="mt-3 min-h-[3.5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
        {hecho ? (
          <p className="font-semibold">
            ¡Listo! {errores === 0 ? 'Sin errores.' : `Con ${errores} ${errores === 1 ? 'error' : 'errores'}.`} Así se arma un ser vivo: cada nivel está dentro del siguiente.
          </p>
        ) : aviso ? (
          <p>{aviso}</p>
        ) : (
          <p className="text-[var(--suave)]">Llevas {elegidos.length} de {N}.</p>
        )}
      </div>
      <button type="button" onClick={reiniciar} className="mt-2 min-h-10 rounded-lg border border-[var(--linea)] px-4 text-sm font-semibold">
        Mezclar y empezar de nuevo
      </button>
    </div>
  )
}
