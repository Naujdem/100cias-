import { useState } from 'react'
import VisorZoom from '../VisorZoom.tsx'
import PantallaCompleta from '../PantallaCompleta.tsx'
import { PasoCelulas, PASOS_CELULAS } from '../ilustraciones/UniPluri.tsx'
import { useFlechas } from '../../lib/flechasDiagrama.ts'

// «De una célula a muchas»: cinco pasos con deslizador y un juego para clasificar seres vivos.

interface InfoPaso {
  nombre: string
  que: string
  ejemplo: string
  tipos: string
  sola: string
}

const PASOS: InfoPaso[] = [
  { nombre: 'Una sola célula', que: 'Una única célula es el organismo completo y hace todo lo que necesita para vivir.', ejemplo: 'Bacteria, ameba, levadura', tipos: '1', sola: 'Sí: ella es todo el organismo.' },
  { nombre: 'Células iguales que quedan juntas', que: 'Tras dividirse, las células se quedan pegadas formando una cadena o un grupo. Todas son iguales.', ejemplo: 'Cadenas o grupos de algunas bacterias y algas', tipos: '1 (todas iguales)', sola: 'Sí: separada, sigue viviendo.' },
  { nombre: 'Colonia con reparto de tareas', que: 'Una esfera de células donde unas nadan con sus flagelos y unas pocas se encargan de reproducirse.', ejemplo: 'Volvox', tipos: '2', sola: 'Las que nadan, ya no.' },
  { nombre: 'Pluricelular con células especializadas', que: 'Hay varios tipos de células, cada uno con su tarea, pero todavía sin tejidos verdaderos ni órganos.', ejemplo: 'Esponja', tipos: 'Varios', sola: 'No: depende del conjunto.' },
  { nombre: 'Pluricelular con tejidos y órganos', que: 'Las células especializadas se agrupan en tejidos, los tejidos en órganos y los órganos en sistemas.', ejemplo: 'Persona, roble, pez', tipos: 'Muchos', sola: 'No: depende por completo del organismo.' },
]

type Modo = 'pasos' | 'clasifica'

interface Props {
  paso?: number
  modo?: Modo
}

export default function UniPluri({ paso = 0, modo = 'pasos' }: Props) {
  const [m, setM] = useState<Modo>(modo)
  return (
    <div>
      <div role="group" aria-label="Actividad" className="mb-3 flex flex-wrap gap-2">
        {([['pasos', 'De una a muchas'], ['clasifica', 'Clasifícalos']] as [Modo, string][]).map(([id, texto]) => (
          <button
            key={id}
            type="button"
            aria-pressed={m === id}
            onClick={() => setM(id)}
            className="min-h-10 rounded-full border border-[var(--acento)] px-3 text-sm font-semibold text-[var(--acento)] aria-pressed:bg-[var(--acento)] aria-pressed:text-white"
          >
            {texto}
          </button>
        ))}
      </div>
      {m === 'pasos' ? <Pasos inicial={paso} /> : <Clasifica />}
    </div>
  )
}

function Pasos({ inicial }: { inicial: number }) {
  const [sel, setSel] = useState(Math.max(0, Math.min(PASOS_CELULAS - 1, inicial)))
  const p = PASOS[sel]
  return (
    <PantallaCompleta>
      <VisorZoom etiqueta="De una célula a un organismo con tejidos" alto="aspect-[4/3]">
        <PasoCelulas paso={sel} />
      </VisorZoom>
      <div className="mt-3">
        <label htmlFor="paso-uni" className="flex items-center justify-between text-sm font-semibold">
          <span>Paso {sel + 1} de {PASOS_CELULAS}</span>
          <span className="font-normal text-[var(--suave)]">{p.nombre}</span>
        </label>
        <input
          id="paso-uni"
          type="range"
          min="0"
          max={PASOS_CELULAS - 1}
          step="1"
          value={sel}
          onChange={(e) => setSel(Number(e.target.value))}
          onPointerUp={(e) => e.currentTarget.closest<HTMLElement>('[role=dialog]')?.focus()}
          className="mt-1 h-8 w-full accent-[var(--acento)]"
        />
      </div>
      <div aria-live="polite" className="mt-2 min-h-[6.5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
        <p className="font-semibold">{p.nombre}</p>
        <p>{p.que}</p>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
          <dt className="font-semibold">Ejemplo</dt>
          <dd>{p.ejemplo}</dd>
          <dt className="font-semibold">Tipos de células</dt>
          <dd>{p.tipos}</dd>
          <dt className="font-semibold">¿Una célula sola puede vivir?</dt>
          <dd>{p.sola}</dd>
        </dl>
      </div>
      <p className="mt-2 text-xs text-[var(--suave)]">Esquemas: los tamaños y las formas están simplificados. Los pasos no son una escalera obligatoria: la pluricelularidad apareció varias veces por caminos distintos.</p>
    </PantallaCompleta>
  )
}

type Respuesta = 'uni' | 'col' | 'plu'

const ITEMS: { nombre: string; r: Respuesta; explica: string }[] = [
  { nombre: 'Bacteria', r: 'uni', explica: 'Una sola célula, sin núcleo, que es todo el organismo.' },
  { nombre: 'Roble', r: 'plu', explica: 'Planta pluricelular, con tejidos, órganos y sistemas.' },
  { nombre: 'Volvox', r: 'col', explica: 'Una colonia: esfera de cientos o miles de células con tareas sencillas repartidas.' },
  { nombre: 'Ameba', r: 'uni', explica: 'Una sola célula que se desplaza y atrapa su alimento.' },
  { nombre: 'Esponja', r: 'plu', explica: 'Animal pluricelular, con varios tipos de células pero sin tejidos verdaderos.' },
  { nombre: 'Levadura', r: 'uni', explica: 'Es un hongo unicelular: cada célula es un organismo completo.' },
  { nombre: 'Persona', r: 'plu', explica: 'Pluricelular, con muchos tipos de células, tejidos, órganos y sistemas.' },
  { nombre: 'Champiñón', r: 'plu', explica: 'Hongo pluricelular: sus células forman filamentos entrelazados.' },
]
const OPCIONES: [Respuesta, string][] = [['uni', 'Unicelular'], ['col', 'Colonia'], ['plu', 'Pluricelular']]

function Clasifica() {
  const [i, setI] = useState(0)
  const [resp, setResp] = useState<(Respuesta | null)[]>(ITEMS.map(() => null))
  const it = ITEMS[i]
  const elegida = resp[i]
  const aciertos = resp.filter((r, k) => r === ITEMS[k].r).length

  useFlechas((dir) => {
    setI((x) => Math.max(0, Math.min(ITEMS.length - 1, x + dir)))
    return true
  })

  return (
    <PantallaCompleta conBoton>
      <p className="text-sm">¿Es unicelular, una colonia o pluricelular? Con ← → cambias de ser vivo.</p>
      <div role="group" aria-label="Seres vivos" className="mt-3 flex flex-wrap gap-2">
        {ITEMS.map((x, k) => (
          <button
            key={x.nombre}
            type="button"
            aria-pressed={i === k}
            aria-label={`${x.nombre}${resp[k] === null ? '' : resp[k] === x.r ? ', acertado' : ', por repasar'}`}
            onClick={() => setI(k)}
            className="min-h-10 rounded-full border border-[var(--linea)] px-3 text-sm font-semibold aria-pressed:border-[var(--acento)] aria-pressed:bg-[var(--acento-suave)]/50"
          >
            {x.nombre}
            {resp[k] !== null && <span aria-hidden="true">{resp[k] === x.r ? ' ✓' : ' ✗'}</span>}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm font-semibold">{it.nombre}: ¿qué es?</p>
      <div role="group" aria-label="Opciones" className="mt-2 flex flex-wrap gap-2">
        {OPCIONES.map(([id, texto]) => {
          const marca = elegida === null ? '' : id === it.r ? 'border-green-700 bg-[var(--acento-suave)]/40' : id === elegida ? 'border-red-700' : 'opacity-60'
          return (
            <button
              key={id}
              type="button"
              disabled={elegida === it.r}
              onClick={() => setResp((r) => r.map((v, k) => (k === i ? id : v)))}
              className={`min-h-10 rounded-lg border-2 border-[var(--linea)] px-4 text-sm font-semibold enabled:hover:border-[var(--acento)] ${marca}`}
            >
              {texto}
            </button>
          )
        })}
      </div>
      <div aria-live="polite" className="mt-3 min-h-[3.5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
        {elegida === null ? (
          <p className="text-[var(--suave)]">Elige una opción. Llevas {aciertos} de {ITEMS.length} acertados.</p>
        ) : elegida === it.r ? (
          <p>
            <span className="font-semibold">¡Eso es!</span> {it.explica}
          </p>
        ) : (
          <p>
            <span className="font-semibold">Todavía no.</span> Piensa cuántas células tiene y si cada una podría vivir sola. Inténtalo otra vez.
          </p>
        )}
      </div>
    </PantallaCompleta>
  )
}
