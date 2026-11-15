import { useState } from 'react'
import { Semilla, AMARILLA, VERDE } from '../ilustraciones/Semilla.tsx'

// Tercera ley, dibujada: «Dos caracteres a la vez» (P → F1 con sus cromosomas) y
// «Cuatro gametos» (los dos pares se acomodan al azar y salen AB, Ab, aB y ab).
// Gen del color (A/a) en cromosomas largos morados; gen de la forma (B/b) en cromosomas cortos rosados.

const LISA = '#5b8fd6'
const RUGOSA = '#c9dcf3'
const T = '#2a2a2a'

/** Cromosoma con la banda del alelo. */
export function Crom({ x, y, alelo, s = 1 }: { x: number; y: number; alelo: string; s?: number }) {
  const color = alelo.toUpperCase() === 'A'
  const h = (color ? 70 : 46) * s
  const w = 16 * s
  const fill = color ? '#d9cfe8' : '#f4d3da'
  const borde = color ? '#6b5a8a' : '#a0566a'
  const banda = alelo === 'A' ? AMARILLA : alelo === 'a' ? VERDE : alelo === 'B' ? LISA : RUGOSA
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={w / 2} fill={fill} stroke={borde} strokeWidth={1.6} />
      <rect x={x - w / 2} y={y - h / 2 + 8 * s} width={w} height={15 * s} fill={banda} stroke={borde} strokeWidth={1.2} />
      <text x={x} y={y - h / 2 + 20 * s} textAnchor="middle" fontSize={12 * s} fontWeight="900" fill={T}>{alelo}</text>
    </g>
  )
}

function Boton({ activo, onClick, children }: { activo?: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      onClick={onClick}
      className="min-h-11 rounded-full border border-[var(--acento)] px-5 text-base font-semibold text-[var(--acento)] aria-pressed:bg-[var(--acento)] aria-pressed:text-[var(--sobre-acento)]"
    >
      {children}
    </button>
  )
}

const suave = { transition: 'opacity .6s ease, transform .6s ease' }

/** Una columna: semilla arriba, sus cuatro cromosomas abajo. */
function Individuo({ cx, g, rotulo }: { cx: number; g: string; rotulo: string }) {
  return (
    <g>
      <Semilla x={cx} y={70} r={34} amarilla={g.includes('A')} rugosa={!g.includes('B')} />
      <text x={cx} y={124} textAnchor="middle" fontSize="14" fontWeight="800" fill={T}>{rotulo}</text>
      <Crom x={cx - 39} y={196} alelo={g[0]} />
      <Crom x={cx - 15} y={196} alelo={g[1]} />
      <Crom x={cx + 15} y={208} alelo={g[2]} />
      <Crom x={cx + 39} y={208} alelo={g[3]} />
      <text x={cx} y={258} textAnchor="middle" fontSize="18" fontWeight="900" fill={T}>{g}</text>
    </g>
  )
}

export function DosCaracteres() {
  const [cruzado, setCruzado] = useState(false)
  return (
    <div data-diagrama>
      <div className="mb-3 flex justify-center">
        <Boton activo={cruzado} onClick={() => setCruzado((c) => !c)}>{cruzado ? '↺ Ver solo los padres' : '✖️ Cruzarlos'}</Boton>
      </div>
      <svg viewBox="0 0 640 280" role="img" aria-label="Amarilla lisa AABB por verde rugosa aabb da una F1 amarilla lisa AaBb" className="mx-auto w-full max-w-3xl">
        <rect x="8" y="10" width="404" height="262" rx="16" fill="#f4eedf" />
        <text x="24" y="34" fontSize="14" fontWeight="900" fill="#7a5a2a">P</text>
        <Individuo cx={110} g="AABB" rotulo="amarilla y lisa" />
        <text x="210" y="84" textAnchor="middle" fontSize="34" fontWeight="900" fill={T}>×</text>
        <Individuo cx={310} g="aabb" rotulo="verde y rugosa" />
        <g style={{ ...suave, opacity: cruzado ? 1 : 0, transform: cruzado ? 'none' : 'translateX(-14px)' }}>
          <text x="448" y="84" textAnchor="middle" fontSize="30" fontWeight="900" fill={T}>→</text>
          <rect x="476" y="10" width="156" height="262" rx="16" fill="#eaf3df" />
          <text x="492" y="34" fontSize="14" fontWeight="900" fill="#0f6b5c">F1</text>
          <Individuo cx={554} g="AaBb" rotulo="amarilla y lisa" />
        </g>
      </svg>
      <p aria-live="polite" className="mt-2 text-center text-lg">
        {cruzado
          ? 'Toda la F1 es AaBb: amarilla y lisa, porque A y B son dominantes. Cada hijo recibió A y B de un padre, a y b del otro.'
          : 'Dos líneas puras que difieren en dos caracteres: el color (A/a) y la forma (B/b). ¿Cómo saldrán sus hijos?'}
      </p>
      <p className="mt-1 text-center text-xs text-[var(--suave)]">Cromosomas largos: gen del color · cortos: gen de la forma</p>
    </div>
  )
}

const GAMETOS = ['AB', 'Ab', 'aB', 'ab']

function Gameto({ cx, cy, g, r = 34, apagado = false }: { cx: number; cy: number; g: string; r?: number; apagado?: boolean }) {
  return (
    <g opacity={apagado ? 0.25 : 1} style={suave}>
      <circle cx={cx} cy={cy} r={r} fill="#fffaf0" stroke="#b08a5a" strokeWidth={2} strokeDasharray={apagado ? '4 4' : undefined} />
      <Crom x={cx - 10} y={cy - 2} alelo={g[0]} s={0.6} />
      <Crom x={cx + 10} y={cy + 4} alelo={g[1]} s={0.6} />
      <text x={cx} y={cy + r + 16} textAnchor="middle" fontSize="15" fontWeight="900" fill={T}>{g}</text>
    </g>
  )
}

export function CuatroGametos() {
  const [cruzada, setCruzada] = useState(false) // forma en que se acomoda el par B/b
  const [vistos, setVistos] = useState<Set<string>>(new Set(['AB', 'ab']))
  const salen = cruzada ? ['Ab', 'aB'] : ['AB', 'ab']
  const cambiar = () => {
    const nueva = !cruzada
    setCruzada(nueva)
    setVistos((v) => new Set([...v, ...(nueva ? ['Ab', 'aB'] : ['AB', 'ab'])]))
  }
  const dx = cruzada ? 40 : 0
  return (
    <div data-diagrama>
      <div className="mb-3 flex justify-center">
        <Boton onClick={cambiar}>🔄 Otra forma de acomodarse</Boton>
      </div>
      <svg viewBox="0 0 640 300" role="img" aria-label="Una célula AaBb forma cuatro tipos de gametos: AB, Ab, aB y ab" className="mx-auto w-full max-w-3xl">
        {/* célula AaBb con los pares en el centro */}
        <circle cx="130" cy="140" r="104" fill="#fbf3e4" stroke="#b08a5a" strokeWidth={3} />
        <path d="M 130 42 V 238" stroke="#b08a5a" strokeWidth={1.5} strokeDasharray="5 6" />
        <text x="130" y="272" textAnchor="middle" fontSize="15" fontWeight="900" fill={T}>célula AaBb</text>
        <Crom x={110} y={98} alelo="A" />
        <Crom x={150} y={98} alelo="a" />
        <g style={{ ...suave, transform: `translateX(${dx}px)` }}>
          <Crom x={110} y={186} alelo="B" />
        </g>
        <g style={{ ...suave, transform: `translateX(${-dx}px)` }}>
          <Crom x={150} y={186} alelo="b" />
        </g>
        <text x="60" y="146" textAnchor="middle" fontSize="20" fill="#b08a5a">◀</text>
        <text x="200" y="146" textAnchor="middle" fontSize="20" fill="#b08a5a">▶</text>
        {/* los dos gametos que salen de esta forma */}
        <text x="262" y="146" textAnchor="middle" fontSize="28" fontWeight="900" fill={T}>→</text>
        <Gameto cx={330} cy={80} g={salen[0]} />
        <Gameto cx={330} cy={200} g={salen[1]} />
        {/* colección de los cuatro */}
        <rect x="408" y="10" width="224" height="280" rx="16" fill="#eaf3df" />
        <text x="520" y="34" textAnchor="middle" fontSize="13" fontWeight="900" fill="#0f6b5c">Gametos posibles</text>
        {GAMETOS.map((g, k) => (
          <Gameto key={g} cx={468 + (k % 2) * 104} cy={88 + Math.floor(k / 2) * 120} g={g} r={30} apagado={!vistos.has(g)} />
        ))}
      </svg>
      <p aria-live="polite" className="mt-2 text-center text-lg">
        {vistos.size < 4
          ? 'Cada par se separa hacia un lado. Así salen AB y ab… ¿hay otra forma de acomodarse?'
          : 'El par del color y el de la forma se acomodan al azar, cada uno por su cuenta: por eso salen los cuatro gametos, en igual proporción.'}
      </p>
    </div>
  )
}
