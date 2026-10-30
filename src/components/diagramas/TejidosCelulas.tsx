import { useState } from 'react'
import VisorZoom from '../VisorZoom.tsx'
import PantallaCompleta from '../PantallaCompleta.tsx'
import { useFlechas } from '../../lib/flechasDiagrama.ts'
import TejidoVegetal, { type ParteVegetal } from '../ilustraciones/TejidoVegetal.tsx'
import TejidoAnimal, { type ParteAnimal } from '../ilustraciones/TejidoAnimal.tsx'

// Tejido vegetal (Schleiden, 1838) frente a tejido animal (Schwann, 1839).

type Modo = 'planta' | 'animal' | 'compara'

const PLANTA: { id: ParteVegetal; nombre: string; texto: string }[] = [
  { id: 'pared', nombre: 'Pared', texto: 'Una capa rígida alrededor de cada célula vegetal. Es lo que Hooke vio en el corcho, y hace que las células de una planta parezcan cajitas bien ordenadas.' },
  { id: 'nucleo', nombre: 'Núcleo', texto: 'Guarda el material genético y dirige la célula. Robert Brown lo había descrito en 1831, y Schleiden lo consideró clave para que nacieran células nuevas.' },
  { id: 'vacuola', nombre: 'Vacuola', texto: 'Un gran espacio lleno de agua y sustancias disueltas que ocupa buena parte de la célula vegetal.' },
  { id: 'cloroplastos', nombre: 'Cloroplastos', texto: 'Pequeños orgánulos verdes donde la planta hace la fotosíntesis. Las células animales no los tienen.' },
]

const ANIMAL: { id: ParteAnimal; nombre: string; texto: string }[] = [
  { id: 'membrana', nombre: 'Membrana', texto: 'El borde de la célula animal. Es delgada y flexible, y no hay pared por fuera, por eso las células tienen formas más irregulares y blandas.' },
  { id: 'nucleo', nombre: 'Núcleo', texto: 'También guarda el material genético y dirige la célula. Fue lo que Schwann reconoció como parecido a lo que Schleiden describía en las plantas.' },
  { id: 'citoplasma', nombre: 'Citoplasma', texto: 'El interior de la célula, donde ocurren sus procesos. Es un medio gelatinoso que rodea al núcleo.' },
]

const COMUN = ['Están formadas por células.', 'Cada célula tiene núcleo.', 'Cada célula está limitada por una membrana.']
const DIFERENCIAS = [
  ['Pared rígida por fuera de la membrana', 'Sin pared'],
  ['Cloroplastos para la fotosíntesis', 'Sin cloroplastos'],
  ['Gran vacuola central', 'Vacuolas pequeñas o ninguna'],
  ['Forma regular, como cajitas', 'Forma más irregular'],
]

export default function TejidosCelulas({ inicial }: { inicial: Modo }) {
  const [modo, setModo] = useState<Modo>(inicial)
  const [parte, setParte] = useState<string | null>(null)

  const cambiar = (m: Modo) => {
    setModo(m)
    setParte(null)
  }
  const lista = modo === 'planta' ? PLANTA : ANIMAL
  const actual = lista.find((p) => p.id === parte)

  // ← → recorren las partes de la célula (ninguna, la primera, la siguiente…); en «Compara» no hay nada que mover
  useFlechas((dir) => {
    if (modo === 'compara') return false
    const i = lista.findIndex((p) => p.id === parte)
    const n = Math.max(-1, Math.min(lista.length - 1, i + dir))
    setParte(n < 0 ? null : lista[n].id)
    return true
  })

  return (
    <div>
      <div role="group" aria-label="Actividad" className="mb-3 flex flex-wrap gap-2">
        {([['planta', 'Tejido vegetal'], ['animal', 'Tejido animal'], ['compara', 'Compara']] as [Modo, string][]).map(([id, texto]) => (
          <button
            key={id}
            type="button"
            aria-pressed={modo === id}
            onClick={() => cambiar(id)}
            className="min-h-10 rounded-full border border-[var(--acento)] px-3 text-sm font-semibold text-[var(--acento)] aria-pressed:bg-[var(--acento)] aria-pressed:text-white"
          >
            {texto}
          </button>
        ))}
      </div>

      {modo !== 'compara' ? (
        <PantallaCompleta>
          <VisorZoom etiqueta={modo === 'planta' ? 'Tejido vegetal' : 'Tejido animal'} alto="aspect-[4/3]">
            {modo === 'planta' ? <TejidoVegetal resaltar={parte as ParteVegetal | null} /> : <TejidoAnimal resaltar={parte as ParteAnimal | null} />}
          </VisorZoom>
          <div role="group" aria-label="Partes de la célula" className="mt-2 flex flex-wrap gap-2">
            {lista.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={parte === p.id}
                onClick={() => setParte(parte === p.id ? null : p.id)}
                className="min-h-10 rounded-lg border border-[var(--linea)] px-3 text-sm font-semibold aria-pressed:border-[var(--acento)] aria-pressed:bg-[var(--acento-suave)]/40"
              >
                {p.nombre}
              </button>
            ))}
          </div>
          <div aria-live="polite" className="mt-2 min-h-[4.5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
            {actual ? (
              <>
                <p className="font-semibold">{actual.nombre}</p>
                <p>{actual.texto}</p>
              </>
            ) : (
              <p className="text-[var(--suave)]">Toca una parte para resaltarla en el dibujo. Con los botones + y − del visor puedes acercar.</p>
            )}
          </div>
          <p className="mt-2 text-xs text-[var(--suave)]">Ilustración esquemática, no es un dibujo de Schleiden ni de Schwann ni está a escala.</p>
        </PantallaCompleta>
      ) : (
        <PantallaCompleta conBoton>
          <div className="grid grid-cols-2 gap-2">
            <figure>
              <div className="aspect-[4/3] overflow-hidden rounded-lg"><TejidoVegetal /></div>
              <figcaption className="mt-1 text-center text-xs font-semibold">Planta (Schleiden, 1838)</figcaption>
            </figure>
            <figure>
              <div className="aspect-[4/3] overflow-hidden rounded-lg"><TejidoAnimal /></div>
              <figcaption className="mt-1 text-center text-xs font-semibold">Animal (Schwann, 1839)</figcaption>
            </figure>
          </div>
          <div className="mt-3 rounded-xl bg-[var(--fondo)] p-3 text-sm">
            <p className="font-semibold">Lo que tienen en común</p>
            <ul className="ml-5 list-disc">
              {COMUN.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="mt-2 font-semibold">Lo que cambia</p>
            <ul className="ml-5 list-disc">
              {DIFERENCIAS.map(([a, b]) => (
                <li key={a}>
                  <span className="font-semibold">Planta:</span> {a}. <span className="font-semibold">Animal:</span> {b}.
                </li>
              ))}
            </ul>
            <p className="mt-2">Plantas y animales se ven muy distintos, pero comparten lo esencial. Esa semejanza fue lo que vieron Schleiden y Schwann.</p>
          </div>
        </PantallaCompleta>
      )}
    </div>
  )
}
