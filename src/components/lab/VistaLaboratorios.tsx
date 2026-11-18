import { useState } from 'react'
import type { ReactNode } from 'react'
import { enlace } from '../../lib/ruta.ts'
import { Migas } from '../Biblioteca.tsx'
import Mesa from './Mesa.tsx'
import type { Nivel, Practica } from './Mesa.tsx'
import solucionMolar from './practicas/solucionMolar.tsx'
import Seguridad from './practicas/Seguridad.tsx'
import Material from './practicas/Material.tsx'
import Microscopio from './practicas/Microscopio.tsx'
import Montaje from './practicas/Montaje.tsx'
import Tinciones from './practicas/Tinciones.tsx'

// Laboratorios virtuales (PLAN-LABORATORIOS.md). Las prácticas listas van en PRACTICAS; las demás de la
// ruta salen como «próximamente».

// Dos tipos: prácticas de mesa (Practica, con el motor Mesa) y minijuegos con su propio componente.
interface Entrada {
  id: string
  titulo: string
  resumen: string
  grupo: string
  desdeGrado: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mesa?: Practica<any>
  Juego?: (p: { grado: number }) => ReactNode
}

const PRACTICAS: Entrada[] = [
  { id: 'seguridad', titulo: 'Práctica cero: seguridad en el laboratorio', resumen: 'Vístete, reconoce los pictogramas, decide qué está bien y a dónde va cada residuo.', grupo: 'Para empezar', desdeGrado: 6, Juego: Seguridad },
  { id: 'material', titulo: 'Reconoce tu material', resumen: 'Cada instrumento con su uso, su cuidado y su versión casera; luego, ¿qué es? y ¿cuál uso?', grupo: 'Para empezar', desdeGrado: 6, Juego: Material },
  { id: 'microscopio', titulo: 'El microscopio', resumen: 'Sus partes, cómo enfocar sin romper la lámina y el reto de ver células a 400x.', grupo: 'Biología', desdeGrado: 6, Juego: Microscopio },
  { id: 'montaje', titulo: 'Montaje húmedo', resumen: 'Prepara una lámina de cebolla: limpia, extendida y sin burbujas. Al observarla se ven tus errores.', grupo: 'Biología', desdeGrado: 6, Juego: Montaje },
  { id: 'tinciones', titulo: 'Tinciones', resumen: 'Lugol y azul de metileno en cebolla, mejilla y papa; en 11°, la tinción de Gram.', grupo: 'Biología', desdeGrado: 6, Juego: Tinciones },
  { id: solucionMolar.id, titulo: solucionMolar.titulo, resumen: solucionMolar.resumen, grupo: 'Química', desdeGrado: solucionMolar.desdeGrado, mesa: solucionMolar },
]

const PROXIMAS: { lab: string; items: string[] }[] = [
  {
    lab: 'Química',
    items: ['Medición: precisión y exactitud', 'Densidades', 'Mezclas y técnicas de separación', 'Conservación de la masa', 'Ensayo a la llama', 'Tipos de reacción', 'Reactivo límite con globos', 'Gases', 'Dilución y solubilidad', 'Ácidos, bases y pH', 'Titulación ácido-base', 'Velocidad de reacción', 'Saponificación', 'Combustión'],
  },
  {
    lab: 'Biología',
    items: ['Ósmosis', 'Biomoléculas', 'Enzimas', 'Fotosíntesis', 'Fermentación', 'Extracción de ADN', 'Microbiología', 'Calidad del agua y del suelo'],
  },
]

const TARJETA = 'flex h-full flex-col gap-1 rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-5 text-[var(--tinta)] no-underline hover:border-[var(--acento)]'

export default function VistaLaboratorios({ practica, perfilId }: { practica?: string; perfilId: string }) {
  const grado = parseInt(perfilId.replace(/\D/g, ''), 10) || 9
  const P = PRACTICAS.find((p) => p.id === practica)
  if (P) return <VistaPractica P={P} grado={grado} />
  return (
    <div>
      <Migas pasos={[{ texto: 'Inicio', a: enlace.inicio }, { texto: 'Laboratorios' }]} />
      <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">Laboratorios</h1>
      <p className="mt-1 text-[var(--suave)]">Prácticas en una mesa virtual donde te puedes equivocar: el resultado se calcula con lo que hiciste.</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PRACTICAS.map((p) => (
          <li key={p.id}>
            <a href={enlace.lab(p.id)} className={TARJETA}>
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--acento)]">{p.grupo} · desde {p.desdeGrado}°</span>
              <span className="font-semibold">{p.titulo}</span>
              <span className="text-sm text-[var(--suave)]">{p.resumen}</span>
            </a>
          </li>
        ))}
      </ul>
      {PROXIMAS.map((g) => (
        <section key={g.lab} className="mt-7">
          <h2 className="text-xl font-semibold">{g.lab} <span className="text-sm font-normal text-[var(--suave)]">· próximamente</span></h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {g.items.map((t) => (
              <li key={t} className="rounded-full border border-dashed border-[var(--linea)] px-3 py-1 text-sm text-[var(--suave)]">{t}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function VistaPractica({ P, grado }: { P: Entrada; grado: number }) {
  const [calc, setCalc] = useState(grado < 11)
  const [pistas, setPistas] = useState(grado < 11)
  const nivel: Nivel = { grado, calculadora: calc, pistas }
  return (
    <div>
      <Migas pasos={[{ texto: 'Inicio', a: enlace.inicio }, { texto: 'Laboratorios', a: enlace.lab() }, { texto: P.titulo }]} />
      <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">{P.titulo}</h1>
      {P.mesa && <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={calc} onChange={(e) => setCalc(e.target.checked)} /> Calculadora</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={pistas} onChange={(e) => setPistas(e.target.checked)} /> Pasos y pistas</label>
        {grado < P.desdeGrado && <span className="text-[var(--suave)]">Esta práctica es desde {P.desdeGrado}°.</span>}
      </div>}
      <div className="mt-4">
        {P.mesa ? <Mesa P={P.mesa} nivel={nivel} /> : P.Juego ? <P.Juego grado={grado} /> : null}
      </div>
    </div>
  )
}
