import { useState } from 'react'
import { enlace } from '../../lib/ruta.ts'
import { Migas } from '../Biblioteca.tsx'
import Mesa from './Mesa.tsx'
import type { Nivel, Practica } from './Mesa.tsx'
import solucionMolar from './practicas/solucionMolar.tsx'

// Laboratorios virtuales (PLAN-LABORATORIOS.md). Las prácticas listas van en PRACTICAS; las demás de la
// ruta salen como «próximamente».

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PRACTICAS: Practica<any>[] = [solucionMolar]

const PROXIMAS: { lab: string; items: string[] }[] = [
  { lab: 'Para empezar', items: ['Práctica cero: seguridad en el laboratorio', 'Reconoce tu material'] },
  {
    lab: 'Química',
    items: ['Medición: precisión y exactitud', 'Densidades', 'Mezclas y técnicas de separación', 'Conservación de la masa', 'Ensayo a la llama', 'Tipos de reacción', 'Reactivo límite con globos', 'Gases', 'Dilución y solubilidad', 'Ácidos, bases y pH', 'Titulación ácido-base', 'Velocidad de reacción', 'Saponificación', 'Combustión'],
  },
  {
    lab: 'Biología',
    items: ['El microscopio', 'Montaje húmedo', 'Tinciones', 'Ósmosis', 'Biomoléculas', 'Enzimas', 'Fotosíntesis', 'Fermentación', 'Extracción de ADN', 'Microbiología', 'Calidad del agua y del suelo'],
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
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--acento)]">Química · desde {p.desdeGrado}°</span>
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function VistaPractica({ P, grado }: { P: Practica<any>; grado: number }) {
  const [calc, setCalc] = useState(grado < 11)
  const [pistas, setPistas] = useState(grado < 11)
  const nivel: Nivel = { grado, calculadora: calc, pistas }
  return (
    <div>
      <Migas pasos={[{ texto: 'Inicio', a: enlace.inicio }, { texto: 'Laboratorios', a: enlace.lab() }, { texto: P.titulo }]} />
      <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">{P.titulo}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={calc} onChange={(e) => setCalc(e.target.checked)} /> Calculadora</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={pistas} onChange={(e) => setPistas(e.target.checked)} /> Pasos y pistas</label>
        {grado < P.desdeGrado && <span className="text-[var(--suave)]">Esta práctica es desde {P.desdeGrado}°.</span>}
      </div>
      <div className="mt-4">
        <Mesa P={P} nivel={nivel} />
      </div>
    </div>
  )
}
