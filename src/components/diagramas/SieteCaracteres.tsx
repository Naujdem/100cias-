import { useState } from 'react'
import type { ReactElement } from 'react'
import { Semilla } from '../ilustraciones/Semilla.tsx'

// Los siete caracteres de las arvejas de Mendel: arriba la forma dominante, abajo la recesiva.
// Tocar una columna (o usar ← →) la resalta y muestra su explicación.

const TALLO = '#5c8a2e'
const HOJA = '#8bbf4a'

function Flor({ x, y, color, s = 1 }: { x: number; y: number; color: 'purpura' | 'blanca'; s?: number }) {
  const [a, b, borde] = color === 'purpura' ? ['#9b59c6', '#7d3fa8', '#5a2a7e'] : ['#ffffff', '#efeaf4', '#9a93a6']
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={-8} rx={16} ry={14} fill={a} stroke={borde} strokeWidth={1.5} />
      <ellipse cx={-11} cy={5} rx={8} ry={7} fill={b} stroke={borde} strokeWidth={1.2} />
      <ellipse cx={11} cy={5} rx={8} ry={7} fill={b} stroke={borde} strokeWidth={1.2} />
      <path d="M -4 9 q 4 7 8 0" fill={b} stroke={borde} strokeWidth={1} />
      <path d="M 0 12 v 8" stroke={TALLO} strokeWidth={2} />
    </g>
  )
}

function Vaina({ x, y, color, estrangulada = false }: { x: number; y: number; color: 'verde' | 'amarilla'; estrangulada?: boolean }) {
  const [fill, borde] = color === 'verde' ? ['#8cc152', '#4f7d23'] : ['#f2d64b', '#a88a12']
  const xs = [-36, -18, 0, 18]
  const d = estrangulada
    ? 'M -36 0 ' + xs.map((a) => `L ${a} -3 Q ${a + 9} -16 ${a + 18} -3`).join(' ') + ' L 36 0 ' + [...xs].reverse().map((a) => `L ${a + 18} 3 Q ${a + 9} 14 ${a} 3`).join(' ') + ' Z'
    : 'M -38 0 C -38 -22 38 -22 38 0 C 38 18 -38 18 -38 0 Z'
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={d} fill={fill} stroke={borde} strokeWidth={2} strokeLinejoin="round" />
      {!estrangulada && <path d="M -28 -1 Q 0 -6 28 -1" fill="none" stroke={borde} strokeWidth={1} opacity={0.5} />}
      <path d="M 36 2 q 8 -2 8 -10" fill="none" stroke={TALLO} strokeWidth={2} strokeLinecap="round" />
    </g>
  )
}

/** Tallo con flores a lo largo (axiales) o solo en la punta (terminales). */
function Posicion({ x, y, terminal }: { x: number; y: number; terminal: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M 0 44 V -24" stroke={TALLO} strokeWidth={3} strokeLinecap="round" />
      <ellipse cx={-10} cy={28} rx={9} ry={4} fill={HOJA} transform="rotate(-25 -10 28)" />
      <ellipse cx={10} cy={8} rx={9} ry={4} fill={HOJA} transform="rotate(25 10 8)" />
      {terminal ? (
        <>
          <Flor x={-8} y={-30} color="purpura" s={0.45} />
          <Flor x={8} y={-32} color="purpura" s={0.45} />
          <Flor x={0} y={-22} color="purpura" s={0.45} />
        </>
      ) : (
        <>
          <Flor x={12} y={18} color="purpura" s={0.45} />
          <Flor x={-12} y={-2} color="purpura" s={0.45} />
          <Flor x={12} y={-22} color="purpura" s={0.45} />
        </>
      )}
    </g>
  )
}

function Planta({ x, base, alto }: { x: number; base: number; alto: number }) {
  const hojas = Math.max(1, Math.round(alto / 22))
  return (
    <g>
      <path d={`M ${x} ${base} V ${base - alto}`} stroke={TALLO} strokeWidth={3} strokeLinecap="round" />
      {Array.from({ length: hojas }, (_, k) => {
        const yy = base - 10 - k * (alto / (hojas + 0.5))
        const lado = k % 2 ? 1 : -1
        return <ellipse key={k} cx={x + lado * 9} cy={yy} rx={9} ry={4} fill={HOJA} transform={`rotate(${lado * 25} ${x + lado * 9} ${yy})`} />
      })}
      <path d={`M ${x - 18} ${base} h 36`} stroke="#8a6a3a" strokeWidth={3} strokeLinecap="round" />
    </g>
  )
}

interface Caracter {
  nombre: string[]
  dom: string
  rec: string
  explica: string
  dibujo: (cx: number, cy: number, dominante: boolean) => ReactElement
}

const CARACTERES: Caracter[] = [
  { nombre: ['Color de', 'la semilla'], dom: 'amarilla', rec: 'verde', explica: 'Amarilla domina sobre verde. Es el carácter de la escena de la F2.', dibujo: (x, y, d) => <Semilla x={x} y={y} r={20} amarilla={d} /> },
  { nombre: ['Forma de', 'la semilla'], dom: 'lisa', rec: 'rugosa', explica: 'Lisa domina sobre rugosa. Las rugosas tienen menos almidón y se arrugan al secarse.', dibujo: (x, y, d) => <Semilla x={x} y={y} r={20} rugosa={!d} /> },
  { nombre: ['Color de', 'la flor'], dom: 'púrpura', rec: 'blanca', explica: 'Púrpura domina sobre blanca.', dibujo: (x, y, d) => <Flor x={x} y={y + 2} color={d ? 'purpura' : 'blanca'} s={1.3} /> },
  { nombre: ['Forma de', 'la vaina'], dom: 'inflada', rec: 'estrangulada', explica: 'Inflada domina sobre estrangulada (apretada entre semilla y semilla).', dibujo: (x, y, d) => <Vaina x={x - 4} y={y} color="verde" estrangulada={!d} /> },
  { nombre: ['Color de', 'la vaina'], dom: 'verde', rec: 'amarilla', explica: 'Vaina verde domina sobre vaina amarilla. ¡Al revés que en la semilla!', dibujo: (x, y, d) => <Vaina x={x - 4} y={y} color={d ? 'verde' : 'amarilla'} /> },
  { nombre: ['Posición de', 'las flores'], dom: 'a lo largo', rec: 'en la punta', explica: 'Flores a lo largo del tallo (axiales) dominan sobre flores solo en la punta (terminales).', dibujo: (x, y, d) => <Posicion x={x} y={y} terminal={!d} /> },
  { nombre: ['Altura del', 'tallo'], dom: 'alto', rec: 'enano', explica: 'Tallo alto (unos 2 m) domina sobre enano (menos de medio metro).', dibujo: (x, y, d) => <Planta x={x} base={y + 46} alto={d ? 92 : 30} /> },
]

const COL = 110

export default function SieteCaracteres() {
  const [sel, setSel] = useState<number | null>(null)
  const c = sel === null ? null : CARACTERES[sel]
  return (
    <div
      data-diagrama
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); setSel((s) => (s === null ? 0 : Math.min(6, s + 1))) }
        if (e.key === 'ArrowLeft') { e.preventDefault(); setSel((s) => (s === null ? 0 : Math.max(0, s - 1))) }
      }}
      className="rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--acento)]"
    >
      <svg viewBox={`0 0 ${COL * 7 + 70} 320`} role="img" aria-label="Los siete caracteres de las arvejas de Mendel, forma dominante y recesiva" className="w-full">
        <style>{`.sc-col { animation: sc-entra .5s ease both } @keyframes sc-entra { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } } @media (prefers-reduced-motion: reduce) { .sc-col { animation: none } }`}</style>
        <rect x="70" y="52" width={COL * 7} height="124" rx="14" fill="#eaf3df" />
        <rect x="70" y="184" width={COL * 7} height="124" rx="14" fill="#f3ece0" />
        <text x="34" y="118" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f6b5c" transform="rotate(-90 34 118)">Dominante</text>
        <text x="34" y="250" textAnchor="middle" fontSize="13" fontWeight="800" fill="#8a5a2a" transform="rotate(-90 34 250)">Recesivo</text>
        {CARACTERES.map((k, i) => {
          const cx = 70 + COL * i + COL / 2
          const activo = sel === i
          return (
            <g key={i} className="sc-col" style={{ animationDelay: `${i * 0.12}s`, cursor: 'pointer' }} onClick={() => setSel(activo ? null : i)} opacity={sel === null || activo ? 1 : 0.35}>
              <rect x={cx - COL / 2 + 3} y={4} width={COL - 6} height={308} rx={12} fill={activo ? '#ffffff' : 'transparent'} stroke={activo ? '#0f6b5c' : 'none'} strokeWidth={2} />
              {k.nombre.map((t, j) => (
                <text key={j} x={cx} y={22 + j * 15} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#2a2a2a">{t}</text>
              ))}
              {k.dibujo(cx, 104, true)}
              <text x={cx} y={168} textAnchor="middle" fontSize="12" fill="#0f6b5c" fontWeight="700">{k.dom}</text>
              {k.dibujo(cx, 236, false)}
              <text x={cx} y={300} textAnchor="middle" fontSize="12" fill="#8a5a2a" fontWeight="700">{k.rec}</text>
            </g>
          )
        })}
      </svg>
      <p aria-live="polite" className="mt-2 min-h-[2.5rem] text-center text-base sm:text-lg">
        {c ? (
          <>
            <strong>{c.nombre.join(' ')}:</strong> {c.explica}
          </>
        ) : (
          <span className="text-[var(--suave)]">Toca un carácter (o usa ← →) para ver más. Arriba, la forma que se ve en la F1.</span>
        )}
      </p>
    </div>
  )
}
