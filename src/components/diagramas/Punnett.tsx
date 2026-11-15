import { useState } from 'react'
import type { ReactNode } from 'react'
import PantallaCompleta from '../PantallaCompleta.tsx'
import { SemillaDe } from '../ilustraciones/Semilla.tsx'

// Cuadro de Punnett interactivo (área 2, herencia mendeliana).
// A = amarilla, a = verde (color de la semilla); B = lisa, b = rugosa (forma).
// modo «mono»: un carácter; «prueba»: cruce de prueba con una planta amarilla misteriosa; «di»: dos caracteres.

type Modo = 'mono' | 'prueba' | 'di'

const MONO = ['AA', 'Aa', 'aa']
const DI = ['AABB', 'AaBb', 'aabb', 'AaBB', 'AABb', 'Aabb', 'aaBb', 'AAbb', 'aaBB']

/** Une dos alelos o pares de alelos con la mayúscula delante: «aA» → «Aa». */
const ordenar = (x: string, y: string) => [x, y].sort((p, q) => (p === q.toUpperCase() ? -1 : q === p.toUpperCase() ? 1 : p.localeCompare(q))).join('')
const genotipo = (g1: string, g2: string) => (g1.length === 1 ? ordenar(g1, g2) : ordenar(g1[0], g2[0]) + ordenar(g1[1], g2[1]))
const gametos = (g: string) => (g.length === 2 ? [g[0], g[1]] : [g[0], g[1]].flatMap((a) => [g[2], g[3]].map((b) => a + b)))

function fenotipo(g: string): string {
  const color = g.includes('A') ? 'amarilla' : 'verde'
  if (g.length === 2) return color
  return `${color} y ${g.includes('B') ? 'lisa' : 'rugosa'}`
}
const mcd = (a: number, b: number): number => (b ? mcd(b, a % b) : a)

function Elegir({ titulo, opciones, valor, onCambio }: { titulo: string; opciones: string[]; valor: string; onCambio: (v: string) => void }) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[var(--suave)]">{titulo}</p>
      <div className="flex flex-wrap gap-1.5">
        {opciones.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={o === valor}
            onClick={() => onCambio(o)}
            className="min-h-10 rounded-full border border-[var(--acento)] px-3 font-mono text-sm font-bold text-[var(--acento)] aria-pressed:bg-[var(--acento)] aria-pressed:text-[var(--sobre-acento)]"
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

function Celda({ g, chica }: { g: string; chica: boolean }) {
  const r = chica ? 11 : 18
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--linea)] bg-[var(--fondo)] p-1">
      <svg viewBox={`0 0 ${r * 2 + 6} ${r * 2 + 6}`} width={r * 2 + 6} height={r * 2 + 6} aria-hidden="true">
        <SemillaDe genotipo={g} x={r + 3} y={r + 3} r={r} />
      </svg>
      <span className={`font-mono font-bold ${chica ? 'text-xs' : 'text-base'}`}>{g}</span>
    </div>
  )
}

function Cuadro({ p1, p2 }: { p1: string; p2: string }) {
  const g1 = gametos(p1)
  const g2 = gametos(p2)
  const chica = g1.length > 2
  const Cab = ({ children }: { children: ReactNode }) => (
    <div className="flex items-center justify-center rounded-lg bg-[var(--acento)] font-mono text-sm font-bold text-[var(--sobre-acento)]">{children}</div>
  )
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `2.5rem repeat(${g2.length}, minmax(0, 1fr))` }}>
      <div className="text-center text-[10px] leading-tight text-[var(--suave)]">gametos</div>
      {g2.map((b, k) => (
        <Cab key={k}>{b}</Cab>
      ))}
      {g1.map((a, f) => [
        <Cab key={`c${f}`}>{a}</Cab>,
        ...g2.map((b, k) => <Celda key={`${f}-${k}`} g={genotipo(a, b)} chica={chica} />),
      ])}
    </div>
  )
}

function Resumen({ p1, p2 }: { p1: string; p2: string }) {
  const hijos = gametos(p1).flatMap((a) => gametos(p2).map((b) => genotipo(a, b)))
  const total = hijos.length
  const contar = (xs: string[]) => [...xs.reduce((m, x) => m.set(x, (m.get(x) ?? 0) + 1), new Map<string, number>())].sort((x, y) => y[1] - x[1])
  const genos = contar(hijos)
  const fenos = contar(hijos.map(fenotipo))
  const d = fenos.reduce((m, [, n]) => mcd(m, n), total)
  return (
    <div aria-live="polite" className="rounded-xl bg-[var(--fondo)] p-3 text-sm">
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--acento)]">Lo que se espera en {total} hijos</p>
      <p className="mt-1">
        <strong>Fenotipos: </strong>
        {fenos.map(([f, n]) => `${n} ${f}`).join(' · ')}
        {fenos.length > 1 && <span className="text-[var(--suave)]"> → proporción {fenos.map(([, n]) => n / d).join(' : ')}</span>}
      </p>
      {total <= 4 && (
        <p className="mt-1">
          <strong>Genotipos: </strong>
          {genos.map(([g, n]) => `${n} ${g}`).join(' · ')}
        </p>
      )}
      <p className="mt-1 text-[var(--suave)]">Cada casilla es una probabilidad, no un hijo seguro: con muchos hijos los números se acercan a estas proporciones.</p>
    </div>
  )
}

export default function Punnett({ modo = 'mono' }: { modo?: Modo }) {
  const [p1, setP1] = useState(modo === 'di' ? 'AaBb' : 'Aa')
  const [p2, setP2] = useState(modo === 'di' ? 'AaBb' : modo === 'prueba' ? 'aa' : 'Aa')
  const [hipotesis, setHipotesis] = useState('AA')
  const madre = modo === 'prueba' ? hipotesis : p1
  return (
    <PantallaCompleta conBoton>
      <div className="mb-3 flex flex-wrap gap-4">
        {modo === 'prueba' ? (
          <>
            <Elegir titulo="Planta amarilla misteriosa: si fuera…" opciones={['AA', 'Aa']} valor={hipotesis} onCambio={setHipotesis} />
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[var(--suave)]">Se cruza con una verde</p>
              <span className="inline-flex min-h-10 items-center rounded-full bg-[var(--fondo)] px-3 font-mono text-sm font-bold">aa</span>
            </div>
          </>
        ) : (
          <>
            <Elegir titulo="Planta 1" opciones={modo === 'di' ? DI : MONO} valor={p1} onCambio={setP1} />
            <Elegir titulo="Planta 2" opciones={modo === 'di' ? DI : MONO} valor={p2} onCambio={setP2} />
          </>
        )}
      </div>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="mx-auto w-full max-w-md">
          <Cuadro p1={madre} p2={p2} />
        </div>
        <div className="space-y-2">
          <Resumen p1={madre} p2={p2} />
          {modo === 'prueba' && (
            <p className="rounded-xl border border-[var(--linea)] p-3 text-sm">
              {hipotesis === 'AA'
                ? 'Si todos los hijos salen amarillos, la planta misteriosa era pura (AA).'
                : 'Si aparece aunque sea una verde, la planta misteriosa era híbrida (Aa): escondía un alelo a.'}
            </p>
          )}
          <p className="text-xs text-[var(--suave)]">
            {modo === 'di' ? 'A amarilla, a verde · B lisa, b rugosa. Mayúscula = dominante.' : 'A amarilla (dominante), a verde (recesivo).'}
          </p>
        </div>
      </div>
    </PantallaCompleta>
  )
}
