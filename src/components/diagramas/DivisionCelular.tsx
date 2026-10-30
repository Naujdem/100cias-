import { useState } from 'react'
import VisorZoom from '../VisorZoom.tsx'
import PantallaCompleta from '../PantallaCompleta.tsx'
import { useFlechas } from '../../lib/flechasDiagrama.ts'
import CelulaDividiendo, { ETAPAS } from '../ilustraciones/CelulaDividiendo.tsx'

// «Toda célula proviene de otra célula»: cómo se divide una célula y cómo se multiplican las generaciones.

type Modo = 'division' | 'generaciones'

const TEXTOS = [
  'La célula se prepara para dividirse: copia su material genético. Todavía no se distinguen los cromosomas, el material está como hebras sueltas dentro del núcleo.',
  'El material genético se enrolla y se vuelve visible como cromosomas. Cada uno está duplicado (tiene dos copias unidas) y el núcleo se deshace.',
  'Los cromosomas se alinean en el centro de la célula, enganchados a fibras que los sujetan desde los dos extremos.',
  'Las dos copias de cada cromosoma se separan y viajan hacia extremos opuestos. La célula se alarga.',
  'En cada extremo se forma un núcleo nuevo y la célula se estrecha hasta partirse en dos. Resultado: dos células, con el mismo material genético que la primera.',
]

export default function DivisionCelular() {
  const [modo, setModo] = useState<Modo>('division')
  return (
    <div>
      <div role="group" aria-label="Actividad" className="mb-3 flex flex-wrap gap-2">
        {([['division', 'Una célula se divide'], ['generaciones', 'Generaciones']] as [Modo, string][]).map(([id, texto]) => (
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
      {modo === 'division' ? <Division /> : <Generaciones />}
    </div>
  )
}

function Division() {
  const [e, setE] = useState<0 | 1 | 2 | 3 | 4>(0)
  return (
    <PantallaCompleta>
      <VisorZoom etiqueta="División de una célula" alto="aspect-[4/3]">
        <CelulaDividiendo etapa={e} />
      </VisorZoom>
      <div className="mt-3">
        <label htmlFor="etapa" className="flex items-center justify-between text-sm font-semibold">
          <span>Paso {e + 1} de 5</span>
          <span className="font-normal text-[var(--suave)]">{ETAPAS[e]}</span>
        </label>
        <input
          id="etapa"
          type="range"
          min="0"
          max="4"
          step="1"
          value={e}
          onChange={(ev) => setE(Number(ev.target.value) as 0 | 1 | 2 | 3 | 4)}
          onPointerUp={(ev) => ev.currentTarget.closest<HTMLElement>('[role=dialog]')?.focus()}
          className="mt-1 h-8 w-full accent-[var(--acento)]"
        />
      </div>
      <div aria-live="polite" className="mt-2 min-h-[4.5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
        <p className="font-semibold">{ETAPAS[e]}</p>
        <p>{TEXTOS[e]}</p>
      </div>
      <p className="mt-2 text-xs text-[var(--suave)]">Ilustración esquemática: se dibujan solo 4 cromosomas por claridad (una persona tiene 46) y no está a escala.</p>
    </PantallaCompleta>
  )
}

function Generaciones() {
  const [g, setG] = useState(0)
  // → divide una vez más y ← deshace una generación
  useFlechas((dir) => {
    setG((v) => Math.max(0, Math.min(6, v + dir)))
    return true
  })
  const total = 2 ** g
  const lado = Math.min(8, Math.ceil(Math.sqrt(total)))
  return (
    <PantallaCompleta conBoton>
      <p className="text-sm">Empieza con una sola célula. Cada vez que pulsas «Dividir», todas las células se dividen en dos.</p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          data-principal
          disabled={g >= 6}
          onClick={() => setG((v) => Math.min(6, v + 1))}
          className="min-h-10 rounded-lg bg-[var(--acento)] px-4 text-sm font-semibold text-white disabled:opacity-40"
        >
          Dividir
        </button>
        <button type="button" onClick={() => setG(0)} className="min-h-10 rounded-lg border border-[var(--linea)] px-4 text-sm font-semibold">
          Volver a una
        </button>
      </div>
      <div className="mt-3 rounded-xl bg-[var(--fondo)] p-3">
        <svg viewBox="0 0 200 120" role="img" aria-label={`${total} células`} className="mx-auto max-h-[38dvh] w-full">
          {Array.from({ length: total }, (_, i) => {
            const col = i % lado
            const fila = Math.floor(i / lado)
            const t = 180 / lado
            const r = Math.min(t * 0.42, 16)
            return (
              <g key={i}>
                <circle cx={10 + t * (col + 0.5)} cy={8 + t * (fila + 0.5) * (110 / 180)} r={r * 0.8} fill="#f8d9d4" stroke="#b05a5a" strokeWidth="1.2" />
                <circle cx={10 + t * (col + 0.5)} cy={8 + t * (fila + 0.5) * (110 / 180)} r={r * 0.32} fill="#c9a0dc" />
              </g>
            )
          })}
        </svg>
        <p className="mt-1 text-sm">
          Generación {g}: <strong>{total}</strong> {total === 1 ? 'célula' : 'células'}
        </p>
      </div>
      <div aria-live="polite" className="mt-3 rounded-xl bg-[var(--fondo)] p-3 text-sm">
        <p>
          Todas las células de este dibujo vienen de la primera: nadie apareció de la nada. Mira hacia atrás: tu cuerpo empezó como una sola célula, el óvulo fecundado, que vino de células de tus padres.
        </p>
        {g >= 6 && <p className="mt-1 text-[var(--suave)]">Tras 6 divisiones ya hay 64 células. Un cuerpo humano adulto tiene billones de células.</p>}
      </div>
    </PantallaCompleta>
  )
}
