import { useState } from 'react'

// Cuadro de Punnett para herencia no mendeliana: dominancia incompleta (flores), grupos sanguíneos (ABO)
// y herencia ligada al X (daltonismo). Se eligen los padres y el cuadro muestra hijos y proporciones.

type Modo = 'incompleta' | 'sangre' | 'ligado'
type Opcion = { nombre: string; alelos: [string, string] }
type Fenotipo = { texto: string; color: string; claro?: boolean }

const ORDEN = ['XD', 'Xd', 'Y', 'R', 'B', 'A', 'O']
const ordenar = (a: string, b: string) => (ORDEN.indexOf(a) <= ORDEN.indexOf(b) ? a + b : b + a)

const MOSTRAR: Record<string, string> = { XD: 'Xᴰ', Xd: 'Xᵈ', Y: 'Y', R: 'R', B: 'B', A: 'Iᴬ', O: 'i' }
const ver = (g: string) => g.match(/XD|Xd|Y|R|B|A|O/g)!.map((a) => MOSTRAR[a]).join('')

const MODOS: Record<Modo, { p1: string; p2: string; o1: Opcion[]; o2: Opcion[]; fen: (g: string) => Fenotipo; ayuda: string }> = {
  incompleta: {
    p1: 'Planta 1', p2: 'Planta 2',
    o1: [{ nombre: 'Roja (RR)', alelos: ['R', 'R'] }, { nombre: 'Rosada (RB)', alelos: ['R', 'B'] }, { nombre: 'Blanca (BB)', alelos: ['B', 'B'] }],
    o2: [{ nombre: 'Roja (RR)', alelos: ['R', 'R'] }, { nombre: 'Rosada (RB)', alelos: ['R', 'B'] }, { nombre: 'Blanca (BB)', alelos: ['B', 'B'] }],
    fen: (g) => (g === 'RR' ? { texto: 'roja', color: '#c8343c' } : g === 'BB' ? { texto: 'blanca', color: '#fbfaf5', claro: true } : { texto: 'rosada', color: '#ef9ab0', claro: true }),
    ayuda: 'R = rojo, B = blanco. Ninguno domina: RB es rosado.',
  },
  sangre: {
    p1: 'Madre', p2: 'Padre',
    o1: [{ nombre: 'A (IᴬIᴬ)', alelos: ['A', 'A'] }, { nombre: 'A (Iᴬi)', alelos: ['A', 'O'] }, { nombre: 'B (IᴮIᴮ)', alelos: ['B', 'B'] }, { nombre: 'B (Iᴮi)', alelos: ['B', 'O'] }, { nombre: 'AB (IᴬIᴮ)', alelos: ['A', 'B'] }, { nombre: 'O (ii)', alelos: ['O', 'O'] }],
    o2: [{ nombre: 'A (IᴬIᴬ)', alelos: ['A', 'A'] }, { nombre: 'A (Iᴬi)', alelos: ['A', 'O'] }, { nombre: 'B (IᴮIᴮ)', alelos: ['B', 'B'] }, { nombre: 'B (Iᴮi)', alelos: ['B', 'O'] }, { nombre: 'AB (IᴬIᴮ)', alelos: ['A', 'B'] }, { nombre: 'O (ii)', alelos: ['O', 'O'] }],
    fen: (g) => {
      const a = g.includes('A')
      const b = g.includes('B')
      if (a && b) return { texto: 'grupo AB', color: '#8a5aa8' }
      if (a) return { texto: 'grupo A', color: '#d9a400' }
      if (b) return { texto: 'grupo B', color: '#3a90c0' }
      return { texto: 'grupo O', color: '#8a8a8a' }
    },
    ayuda: 'Iᴬ e Iᴮ son codominantes; los dos dominan sobre i.',
  },
  ligado: {
    p1: 'Madre', p2: 'Padre',
    o1: [{ nombre: 'Ve bien (XᴰXᴰ)', alelos: ['XD', 'XD'] }, { nombre: 'Portadora (XᴰXᵈ)', alelos: ['XD', 'Xd'] }, { nombre: 'Daltónica (XᵈXᵈ)', alelos: ['Xd', 'Xd'] }],
    o2: [{ nombre: 'Ve bien (XᴰY)', alelos: ['XD', 'Y'] }, { nombre: 'Daltónico (XᵈY)', alelos: ['Xd', 'Y'] }],
    fen: (g) => {
      const hombre = g.includes('Y')
      const d = (g.match(/Xd/g) ?? []).length
      if (hombre) return d ? { texto: 'hijo daltónico', color: '#c43c3c' } : { texto: 'hijo, ve bien', color: '#3f6fb8' }
      if (d === 2) return { texto: 'hija daltónica', color: '#c43c3c' }
      if (d === 1) return { texto: 'hija portadora', color: '#e3a3c8', claro: true }
      return { texto: 'hija, ve bien', color: '#c46aa0' }
    },
    ayuda: 'El gen está en el X. Los hombres tienen un solo X.',
  },
}

function Elegir({ titulo, opciones, valor, onCambio }: { titulo: string; opciones: Opcion[]; valor: number; onCambio: (i: number) => void }) {
  return (
    <fieldset className="flex flex-col items-center gap-1">
      <legend className="mb-1 text-center text-sm font-bold">{titulo}</legend>
      <div className="flex flex-wrap justify-center gap-1">
        {opciones.map((o, i) => (
          <button key={o.nombre} type="button" aria-pressed={valor === i} onClick={() => onCambio(i)}
            className="min-h-10 rounded-full border border-[var(--acento)] px-3 text-sm font-semibold text-[var(--acento)] aria-pressed:bg-[var(--acento)] aria-pressed:text-[var(--sobre-acento)]">
            {o.nombre}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export default function PunnettNoMendel({ modo }: { modo: Modo }) {
  const m = MODOS[modo]
  const [a, setA] = useState(1)
  const [b, setB] = useState(modo === 'ligado' ? 0 : 1)
  const g1 = m.o1[a].alelos
  const g2 = m.o2[b].alelos
  const hijos = g1.flatMap((x) => g2.map((y) => ordenar(x, y)))
  const cuenta = new Map<string, { f: Fenotipo; n: number }>()
  hijos.forEach((h) => {
    const f = m.fen(h)
    const prev = cuenta.get(f.texto)
    cuenta.set(f.texto, { f, n: (prev?.n ?? 0) + 1 })
  })
  const celda = 'flex h-20 w-24 flex-col items-center justify-center rounded-xl border-2 text-center sm:w-28'
  return (
    <div data-diagrama className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-6">
        <Elegir titulo={m.p1} opciones={m.o1} valor={a} onCambio={setA} />
        <Elegir titulo={m.p2} opciones={m.o2} valor={b} onCambio={setB} />
      </div>
      <div className="grid grid-cols-[auto_auto_auto] gap-2" role="table" aria-label="Cuadro de Punnett">
        <div />
        {g2.map((x, k) => <div key={k} className="flex h-10 items-center justify-center text-xl font-black">{MOSTRAR[x]}</div>)}
        {g1.map((x, i) => (
          <div key={i} className="contents">
            <div className="flex w-10 items-center justify-center text-xl font-black">{MOSTRAR[x]}</div>
            {g2.map((y, j) => {
              const h = ordenar(x, y)
              const f = m.fen(h)
              return (
                <div key={j} className={celda} style={{ background: f.color, color: f.claro ? '#3a3a3a' : '#fff', borderColor: '#d8d0c8' }}>
                  <span className="text-xl font-black">{ver(h)}</span>
                  <span className="text-xs font-bold">{f.texto}</span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
      <p aria-live="polite" className="text-center text-lg">
        {[...cuenta.values()].map(({ f, n }) => `${f.texto}: ${n} de 4 (${n * 25} %)`).join(' · ')}
      </p>
      <p className="text-center text-sm opacity-80">{m.ayuda}</p>
    </div>
  )
}
