import { useState } from 'react'
import VisorZoom from '../VisorZoom.tsx'
import PantallaCompleta from '../PantallaCompleta.tsx'
import Matraz, { type TipoMatraz } from '../ilustraciones/Matraz.tsx'
import FrascosRedi from '../ilustraciones/FrascosRedi.tsx'

// Los experimentos que refutaron la generación espontánea: Redi (1668) y Pasteur (1861-1862).

type Modo = 'redi' | 'pasteur'

export default function ExperimentoPasteur() {
  const [modo, setModo] = useState<Modo>('redi')
  return (
    <div>
      <div role="group" aria-label="Actividad" className="mb-3 flex flex-wrap gap-2">
        {([['redi', 'Redi, 1668'], ['pasteur', 'Pasteur, 1861']] as [Modo, string][]).map(([id, texto]) => (
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
      {modo === 'redi' ? <Redi /> : <Pasteur />}
    </div>
  )
}

function Redi() {
  const [dia, setDia] = useState(0)
  const texto =
    dia === 0
      ? 'Redi puso carne en dos frascos: uno abierto y otro cubierto con gasa. La idea de la época era que la carne podrida producía moscas por sí sola.'
      : dia < 4
        ? 'Las moscas rondan los dos frascos. Al abierto entran y se posan en la carne; en el cubierto solo pueden posarse sobre la gasa.'
        : 'En el frasco abierto aparecen larvas en la carne (las moscas pusieron huevos). En el cubierto no hay larvas en la carne, aunque la carne también se pudrió. Conclusión: las larvas vienen de huevos de moscas, no de la carne.'
  return (
    <PantallaCompleta>
      <VisorZoom etiqueta="Frascos del experimento de Redi" alto="aspect-[4/3]">
        <FrascosRedi dia={dia} />
      </VisorZoom>
      <div className="mt-3">
        <label htmlFor="dias-redi" className="flex items-center justify-between text-sm font-semibold">
          <span>Tiempo</span>
          <span className="font-normal text-[var(--suave)]">Día {dia}</span>
        </label>
        <input
          id="dias-redi"
          type="range"
          min="0"
          max="6"
          step="1"
          value={dia}
          onChange={(e) => setDia(Number(e.target.value))}
          onPointerUp={(e) => e.currentTarget.closest<HTMLElement>('[role=dialog]')?.focus()}
          className="mt-1 h-8 w-full accent-[var(--acento)]"
        />
      </div>
      <div aria-live="polite" className="mt-2 min-h-[4.5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
        <p>{texto}</p>
      </div>
      <p className="mt-2 text-xs text-[var(--suave)]">Ilustración esquemática, no está a escala. Los días son ilustrativos.</p>
    </PantallaCompleta>
  )
}

function Pasteur() {
  const [tipo, setTipo] = useState<TipoMatraz>('cisne')
  const [dias, setDias] = useState(0)
  const [rotoEn, setRotoEn] = useState<number | null>(null)

  const roto = tipo === 'cisne' && rotoEn !== null && dias >= rotoEn
  const turbio = tipo === 'recto' ? dias >= 3 : roto && dias >= (rotoEn ?? 0) + 3

  let texto: string
  if (tipo === 'recto') {
    texto = turbio
      ? 'El caldo se ve turbio: los microorganismos que traía el aire llegaron al caldo y se multiplicaron.'
      : 'El caldo se hirvió y está limpio. Pero el cuello recto deja entrar el aire con polvo y microorganismos: avanza los días.'
  } else if (roto) {
    texto = turbio
      ? 'Con el cuello roto, el aire entra directo. El caldo se enturbió: los microorganismos venían de afuera, no del caldo.'
      : 'Acabas de romper el cuello. Avanza unos días y mira qué pasa.'
  } else {
    texto =
      dias === 0
        ? 'Pasteur hirvió el caldo para matar lo que había y estiró el cuello del matraz en forma de «S». El aire puede entrar y salir.'
        : `El aire entra y sale, pero el polvo y los microorganismos quedan atrapados en la curva. Al día ${dias} el caldo sigue limpio. Ahora prueba romper el cuello.`
  }

  const cambiar = (t: TipoMatraz) => {
    setTipo(t)
    setRotoEn(null)
    setDias(0)
  }

  return (
    <PantallaCompleta>
      <div className="mb-2 flex flex-wrap gap-2">
        {([['cisne', 'Cuello de cisne'], ['recto', 'Cuello recto']] as [TipoMatraz, string][]).map(([id, t]) => (
          <button
            key={id}
            type="button"
            aria-pressed={tipo === id}
            onClick={() => cambiar(id)}
            className="min-h-10 rounded-lg border border-[var(--linea)] px-3 text-sm font-semibold aria-pressed:border-[var(--acento)] aria-pressed:bg-[var(--acento-suave)]/40"
          >
            {t}
          </button>
        ))}
        {tipo === 'cisne' && (
          <button
            type="button"
            data-principal
            onClick={() => setRotoEn(rotoEn === null ? dias : null)}
            className="min-h-10 rounded-lg border border-[var(--acento)] px-3 text-sm font-semibold text-[var(--acento)]"
          >
            {rotoEn === null ? 'Romper el cuello' : 'Volver a poner el cuello'}
          </button>
        )}
      </div>
      <VisorZoom etiqueta="Matraz de Pasteur" alto="aspect-[4/3]">
        <Matraz tipo={tipo} turbio={turbio} roto={roto} />
      </VisorZoom>
      <div className="mt-3">
        <label htmlFor="dias-pasteur" className="flex items-center justify-between text-sm font-semibold">
          <span>Tiempo</span>
          <span className="font-normal text-[var(--suave)]">Día {dias}</span>
        </label>
        <input
          id="dias-pasteur"
          type="range"
          min="0"
          max="14"
          step="1"
          value={dias}
          onChange={(e) => setDias(Number(e.target.value))}
          onPointerUp={(e) => e.currentTarget.closest<HTMLElement>('[role=dialog]')?.focus()}
          className="mt-1 h-8 w-full accent-[var(--acento)]"
        />
      </div>
      <div aria-live="polite" className="mt-2 min-h-[4.5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
        <p>{texto}</p>
      </div>
      <p className="mt-2 text-xs text-[var(--suave)]">Ilustración esquemática, no está a escala. Los tiempos son ilustrativos.</p>
    </PantallaCompleta>
  )
}
