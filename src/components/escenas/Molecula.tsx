import type React from 'react'
// Dibujo de moléculas para Química orgánica (área 5): bolas y palos en SVG.
// `construir` recibe los átomos pesados con su posición y los enlaces, y pone los hidrógenos que faltan
// para completar la valencia (C 4, N 3, O 2, halógenos 1), en los huecos que dejan los demás enlaces.

export type Atomo = [string, number, number]
export type Enlace = [number, number, number?]
export interface Mol { at: Atomo[]; en: Enlace[] }

export const VALENCIA: Record<string, number> = { C: 4, N: 3, O: 2, S: 2, H: 1, Cl: 1, F: 1, Br: 1, I: 1 }
export const COLOR_ATOMO: Record<string, string> = {
  C: '#3a3a3a', H: '#ffffff', O: '#e2685c', N: '#4a74c9', Cl: '#5aa84a', F: '#9fd47a', Br: '#a0522d', I: '#7b4fa0', S: '#e8c23a',
}

const ang = (a: Atomo, b: Atomo) => Math.atan2(b[2] - a[2], b[1] - a[1])
const dist = (x: number, y: number) => { const d = Math.abs(x - y) % (2 * Math.PI); return Math.min(d, 2 * Math.PI - d) }

/** hidrogenos: 'todos' (fórmula desarrollada), 'hetero' (solo en O y N, para anillos y esqueletos) o 'no'. */
export function construir(pesados: Atomo[], enlaces: Enlace[], hidrogenos: 'todos' | 'hetero' | 'no' = 'todos', largo = 26): Mol {
  const at = [...pesados]
  const en = [...enlaces]
  if (hidrogenos === 'no') return { at, en }
  const candidatos = [0, 90, 180, 270, 45, 135, 225, 315, 30, 150, 210, 330, 60, 120, 240, 300].map((g) => (g * Math.PI) / 180)
  pesados.forEach((a, i) => {
    if (hidrogenos === 'hetero' && a[0] === 'C') return
    const vecinos = en.filter((e) => e[0] === i || e[1] === i)
    const usados = vecinos.reduce((s, e) => s + (e[2] ?? 1), 0)
    const libres = (VALENCIA[a[0]] ?? 0) - usados
    const angs = vecinos.map((e) => ang(a, pesados[e[0] === i ? e[1] : e[0]]))
    for (let k = 0; k < libres; k++) {
      let mejor = candidatos[0], puntaje = -1
      for (const c of candidatos) {
        const m = angs.length ? Math.min(...angs.map((x) => dist(x, c))) : 10
        if (m > puntaje + 0.01) { puntaje = m; mejor = c }
      }
      angs.push(mejor)
      at.push(['H', a[1] + Math.cos(mejor) * largo, a[2] + Math.sin(mejor) * largo])
      en.push([i, at.length - 1, 1])
    }
  })
  return { at, en }
}

/** Seis puntos de un hexágono (anillo de benceno), con un vértice arriba. */
export function hexagono(cx: number, cy: number, r = 26): [number, number][] {
  return Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 3) * k - Math.PI / 2
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  })
}

/** Cadena recta horizontal de carbonos (fórmula desarrollada de libro). */
export function cadena(n: number, x0: number, y: number, paso = 40, ordenes: number[] = []): Mol {
  const at: Atomo[] = Array.from({ length: n }, (_, k) => ['C', x0 + k * paso, y])
  const en: Enlace[] = Array.from({ length: n - 1 }, (_, k) => [k, k + 1, ordenes[k] ?? 1])
  return { at, en }
}

export function Molecula({ mol, s = 1, resalta = [], letras = true, opacidad = 1 }: {
  mol: Mol; s?: number; resalta?: number[]; letras?: boolean; opacidad?: number
}) {
  const { at, en } = mol
  return (
    <g opacity={opacidad} style={{ transition: 'opacity 0.7s ease' }}>
      {resalta.map((i) => at[i] && <circle key={`r${i}`} cx={at[i][1]} cy={at[i][2]} r={(at[i][0] === 'H' ? 13 : 18) * s} fill="#f6d55c" opacity="0.75" />)}
      {en.map(([a, b, o = 1], k) => {
        const A = at[a], B = at[b]
        if (!A || !B) return null
        const dx = B[1] - A[1], dy = B[2] - A[2], L = Math.hypot(dx, dy) || 1
        const px = (-dy / L) * 3.5 * s, py = (dx / L) * 3.5 * s
        const des = o === 1 ? [0] : o === 2 ? [-1, 1] : [-1.5, 0, 1.5]
        return des.map((d) => (
          <line key={`${k}-${d}`} x1={A[1] + px * d} y1={A[2] + py * d} x2={B[1] + px * d} y2={B[2] + py * d} stroke="#3a3a3a" strokeWidth={2.4 * s} strokeLinecap="round" />
        ))
      })}
      {at.map(([e, x, y], i) => {
        const r = (e === 'H' ? 7 : 11) * s
        const claro = e === 'H' || e === 'F' || e === 'S'
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill={COLOR_ATOMO[e] ?? '#bbb'} stroke="#3a3a3a" strokeWidth={1.4 * s} />
            {letras && <text x={x} y={y + 3.6 * s} textAnchor="middle" fontSize={(e === 'H' ? 8 : 10) * s} fontWeight="800" fill={claro ? '#3a3a3a' : '#fff'}>{e}</text>}
          </g>
        )
      })}
    </g>
  )
}

/* ── Moléculas de uso frecuente (coordenadas para un dibujo de 400×300) ── */

export const MOLS = {
  metano: (x = 200, y = 150) => construir([['C', x, y]], []),
  etano: (x = 180, y = 150) => construir(cadena(2, x, y).at, cadena(2, x, y).en),
  eteno: (x = 180, y = 150) => construir(cadena(2, x, y, 40, [2]).at, cadena(2, x, y, 40, [2]).en),
  etino: (x = 180, y = 150) => construir(cadena(2, x, y, 40, [3]).at, cadena(2, x, y, 40, [3]).en),
  etanol: (x = 160, y = 150) => construir([['C', x, y], ['C', x + 40, y], ['O', x + 80, y]], [[0, 1], [1, 2]]),
  acetico: (x = 160, y = 150) => construir([['C', x, y], ['C', x + 40, y], ['O', x + 40, y - 38], ['O', x + 80, y]], [[0, 1], [1, 2, 2], [1, 3]]),
}

/* ── Utilidades comunes de las escenas del área ── */

export const suave = 'all 1.1s cubic-bezier(.45,.05,.25,1)'
export const ver = (si: boolean) => ({ transition: 'opacity 0.7s ease', opacity: si ? 1 : 0 })
export const idx = (orden: string[], fase: string) => Math.max(0, orden.indexOf(fase))
export const TINTA = '#3a3a3a'
export const ROJO = '#c43c3c'
export const AZUL = '#3f6fb8'
export const VERDE = '#4f8a3c'

export function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}

/** Lienzo 400×300 con el fondo de siempre. */
export function Lienzo({ etiqueta, children, fondo = '#f4f1ea' }: { etiqueta: string; children: React.ReactNode; fondo?: string }) {
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={etiqueta} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={fondo} style={{ transition: suave }} />
      {children}
    </svg>
  )
}

/** Fórmula de esqueleto: zigzag de n carbonos (cada punta es un C). */
export function Zigzag({ n, x, y, paso = 30, alto = 18, color = TINTA, dobles = [] as number[] }: { n: number; x: number; y: number; paso?: number; alto?: number; color?: string; dobles?: number[] }) {
  const pts = Array.from({ length: n }, (_, k) => [x + k * paso, y + (k % 2 ? -alto / 2 : alto / 2)])
  return (
    <g>
      {pts.slice(1).map((p, k) => {
        const a = pts[k]
        return (
          <g key={k}>
            <line x1={a[0]} y1={a[1]} x2={p[0]} y2={p[1]} stroke={color} strokeWidth="3" strokeLinecap="round" />
            {dobles.includes(k) && <line x1={a[0]} y1={a[1] + 6} x2={p[0]} y2={p[1] + 6} stroke={color} strokeWidth="3" strokeLinecap="round" />}
          </g>
        )
      })}
    </g>
  )
}

/** Índices para resaltar un grupo: los átomos dados más los H unidos a los que no son carbono. */
export function grupo(mol: Mol, idxs: number[]): number[] {
  const extra = mol.en.filter(([a, b]) => (idxs.includes(a) && mol.at[a][0] !== 'C' && mol.at[b][0] === 'H') || (idxs.includes(b) && mol.at[b][0] !== 'C' && mol.at[a][0] === 'H')).map(([a, b]) => (idxs.includes(a) ? b : a))
  return [...idxs, ...extra]
}

/** Punto fuera de un anillo, en la dirección del vértice k (para colgar sustituyentes). */
export function fuera(cx: number, cy: number, k: number, d: number): [number, number] {
  const a = (Math.PI / 3) * k - Math.PI / 2
  return [cx + d * Math.cos(a), cy + d * Math.sin(a)]
}
