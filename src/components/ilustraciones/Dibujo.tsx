import type { ReactNode } from 'react'

// Piezas comunes de las ilustraciones esquemáticas (400×300, fondo crema, trazo oscuro, colores suaves).

export const TINTA = '#4a3416'
export const FONDO = '#f4efe4'
export const rad = (g: number) => (g * Math.PI) / 180

/** Lienzo de 400×300 con fondo crema. `etiqueta` es el texto alternativo. */
export function Lienzo({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={etiqueta} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      {children}
    </svg>
  )
}

interface TProps {
  x: number
  y: number
  children: ReactNode
  s?: number
  b?: boolean
  a?: 'start' | 'middle' | 'end'
  c?: string
  i?: boolean
}
/** Texto. */
export function T({ x, y, children, s = 12, b = false, a = 'middle', c = TINTA, i = false }: TProps) {
  return (
    <text x={x} y={y} textAnchor={a} fontSize={s} fontWeight={b ? 700 : 400} fill={c} fontStyle={i ? 'italic' : undefined}>
      {children}
    </text>
  )
}

/** Flecha de (x1,y1) a (x2,y2) con punta rellena. */
export function Flecha({ x1, y1, x2, y2, c = TINTA, w = 2, dash }: { x1: number; y1: number; x2: number; y2: number; c?: string; w?: number; dash?: string }) {
  const a = Math.atan2(y2 - y1, x2 - x1)
  const L = 4 + w * 2.2
  const p = (g: number) => `${x2 - L * Math.cos(a + g)},${y2 - L * Math.sin(a + g)}`
  const fx = x2 - L * 0.6 * Math.cos(a)
  const fy = y2 - L * 0.6 * Math.sin(a)
  return (
    <g>
      <line x1={x1} y1={y1} x2={fx} y2={fy} stroke={c} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash} />
      <polygon points={`${x2},${y2} ${p(0.45)} ${p(-0.45)}`} fill={c} />
    </g>
  )
}

/** Círculo con borde. */
export function Bola({ x, y, r, fill, stroke = TINTA, w = 2 }: { x: number; y: number; r: number; fill: string; stroke?: string; w?: number }) {
  return <circle cx={x} cy={y} r={r} fill={fill} stroke={stroke} strokeWidth={w} />
}

/** Número en un círculo, para marcar pasos. */
export function Paso({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="10" fill={TINTA} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">
        {n}
      </text>
    </g>
  )
}

/** Contorno irregular tipo ameba centrado en (cx,cy). */
export function Ameba({ cx, cy, rx = 80, ry = 60, fill = '#f8d9d4', stroke = '#b05a5a' }: { cx: number; cy: number; rx?: number; ry?: number; fill?: string; stroke?: string }) {
  const p = [
    [-1, 0.1], [-0.8, -0.55], [-0.25, -0.95], [0.4, -0.8], [0.95, -0.35], [0.9, 0.35], [0.45, 0.85], [-0.2, 0.95], [-0.75, 0.6],
  ]
  const pts = p.map(([x, y]) => [cx + x * rx, cy + y * ry])
  let d = `M ${(pts[0][0] + pts[1][0]) / 2} ${(pts[0][1] + pts[1][1]) / 2}`
  for (let i = 1; i <= pts.length; i++) {
    const a = pts[i % pts.length]
    const b = pts[(i + 1) % pts.length]
    d += ` Q ${a[0]} ${a[1]} ${(a[0] + b[0]) / 2} ${(a[1] + b[1]) / 2}`
  }
  return <path d={`${d} Z`} fill={fill} stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
}
