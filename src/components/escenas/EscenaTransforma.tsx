// Escenas que se transforman: el mismo contorno cambia de forma (animal → vegetal, procariota → eucariota)
// y las piezas propias de cada tipo aparecen o desaparecen. El contorno anima su `d` (8 curvas en ambos casos).
import type { CSSProperties } from 'react'
import { Nucleo, Mito, Golgi, RetRugoso, Lisosoma, Cloroplasto, Ribosomas } from '../ilustraciones/CelulaEuc.tsx'

const suave = 'transform 1s ease, opacity 0.7s ease'
const D = (d: string) => ({ d: `path("${d}")`, transition: 'd 1.1s ease, fill 0.8s, stroke 0.8s, stroke-width 0.8s' }) as CSSProperties
type P = [number, number]

/** rectángulo redondeado como 8 curvas (bordes rectos + esquinas) */
function rect(x: number, y: number, w: number, h: number, r: number) {
  const k = 0.5523 * r
  const L = (a: P, b: P) => `C ${a[0] + (b[0] - a[0]) / 3} ${a[1] + (b[1] - a[1]) / 3} ${a[0] + (2 * (b[0] - a[0])) / 3} ${a[1] + (2 * (b[1] - a[1])) / 3} ${b[0]} ${b[1]}`
  const p: P[] = [[x + r, y], [x + w - r, y], [x + w, y + r], [x + w, y + h - r], [x + w - r, y + h], [x + r, y + h], [x, y + h - r], [x, y + r]]
  return [
    `M ${p[0][0]} ${p[0][1]}`, L(p[0], p[1]),
    `C ${p[1][0] + k} ${p[1][1]} ${p[2][0]} ${p[2][1] - k} ${p[2][0]} ${p[2][1]}`, L(p[2], p[3]),
    `C ${p[3][0]} ${p[3][1] + k} ${p[4][0] + k} ${p[4][1]} ${p[4][0]} ${p[4][1]}`, L(p[4], p[5]),
    `C ${p[5][0] - k} ${p[5][1]} ${p[6][0]} ${p[6][1] + k} ${p[6][0]} ${p[6][1]}`, L(p[6], p[7]),
    `C ${p[7][0]} ${p[7][1] - k} ${p[0][0] - k} ${p[0][1]} ${p[0][0]} ${p[0][1]} Z`,
  ].join(' ')
}

/** contorno irregular y redondeado (célula animal) con los mismos 8 tramos */
function blob(cx: number, cy: number, rx: number, ry: number) {
  const ang = [-112.5, -67.5, -22.5, 22.5, 67.5, 112.5, 157.5, 202.5]
  const bulto = [1, 0.96, 1.04, 0.97, 1.03, 0.95, 1.02, 0.98]
  const pt = (a: number, i: number): P => [cx + rx * bulto[i] * Math.cos((a * Math.PI) / 180), cy + ry * bulto[i] * Math.sin((a * Math.PI) / 180)]
  const k = (4 / 3) * Math.tan(Math.PI / 16)
  let d = `M ${pt(ang[0], 0).join(' ')}`
  for (let i = 0; i < 8; i++) {
    const a0 = (ang[i] * Math.PI) / 180
    const a1 = (ang[(i + 1) % 8] * Math.PI) / 180 + (i === 7 ? 2 * Math.PI : 0)
    const [x0, y0] = pt(ang[i], i)
    const [x1, y1] = pt(ang[(i + 1) % 8], (i + 1) % 8)
    const r0x = rx * bulto[i], r0y = ry * bulto[i]
    const r1x = rx * bulto[(i + 1) % 8], r1y = ry * bulto[(i + 1) % 8]
    d += ` C ${x0 - k * r0x * Math.sin(a0)} ${y0 + k * r0y * Math.cos(a0)} ${x1 + k * r1x * Math.sin(a1)} ${y1 - k * r1y * Math.cos(a1)} ${x1} ${y1}`
  }
  return d + ' Z'
}

const ver = (si: boolean, extra = ''): CSSProperties => ({ transition: suave, opacity: si ? 1 : 0, transform: extra || undefined })

/* ── animal → vegetal ───────────────────────────────────────────────────── */
const ORDEN_AV = ['animal', 'pared', 'cloroplastos', 'vacuola']

export function EscenaAnimalVegetal({ fase }: { fase: string }) {
  const i = Math.max(0, ORDEN_AV.indexOf(fase))
  const conPared = i >= 1
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`De célula animal a vegetal: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={conPared ? '#eef5e6' : '#f3e7ef'} style={{ transition: 'fill 0.8s' }} />
      {/* pared (por fuera) y membrana */}
      <path fill="none" stroke="#6fa05a" style={{ ...D(conPared ? rect(30, 38, 340, 224, 22) : blob(200, 150, 160, 108)), strokeWidth: conPared ? 13 : 0, opacity: conPared ? 1 : 0 }} />
      <path stroke="#b05a5a" strokeWidth="4" style={{ ...D(conPared ? rect(40, 48, 320, 204, 16) : blob(200, 150, 160, 108)), fill: conPared ? '#e3f1d6' : '#f8d9d4' }} />
      {/* vacuola central: crece y empuja al núcleo */}
      <path d="M 210 72 Q 344 66 344 150 Q 346 232 270 238 Q 206 242 202 170 Q 196 100 210 72 Z" fill="#cfe6f6" stroke="#3b6fb6" strokeWidth="3.5"
        style={{ transition: suave, transformOrigin: '272px 150px', transform: i >= 3 ? 'none' : 'scale(0.15)', opacity: i >= 3 ? 1 : 0 }} />
      <Ribosomas puntos={[[96, 112], [126, 196], [176, 96], [158, 220], [262, 92], [306, 210]]} />
      <g style={{ transition: suave, transform: i >= 3 ? 'translate(108px, 140px)' : 'translate(196px, 146px)' }}><Nucleo k={0.95} /></g>
      <g style={{ transition: suave, transform: i >= 3 ? 'translate(118px, 222px) rotate(15deg)' : 'translate(286px, 172px) rotate(20deg)' }}><Golgi k={0.9} /></g>
      <g style={{ transition: suave, transform: i >= 3 ? 'translate(176px, 70px)' : 'translate(122px, 100px)' }}><Mito k={0.9} a={-20} /></g>
      <g transform="translate(108 70) rotate(-20)"><RetRugoso k={0.6} /></g>
      {/* lisosomas: típicos de la animal; en la vegetal casi no se ven */}
      <g style={ver(i < 1)}>
        <g transform="translate(290 96)"><Lisosoma k={1.1} /></g>
        <g transform="translate(130 214)"><Lisosoma k={1} /></g>
      </g>
      {/* cloroplastos */}
      {[[70, 112, 10], [236, 226, -10], [330, 96, 30], [64, 196, -20], [330, 214, 15]].map(([x, y, a], k) => (
        <g key={k} style={{ transition: suave, opacity: i >= 2 ? 1 : 0, transformOrigin: `${x}px ${y}px`, transform: i >= 2 ? 'none' : 'scale(0.3)' }}>
          <g transform={`translate(${x} ${y})`}><Cloroplasto k={0.62} a={a} /></g>
        </g>
      ))}
    </svg>
  )
}

/* ── procariota → eucariota ─────────────────────────────────────────────── */
const ORDEN_PE = ['procariota', 'tamano', 'nucleo', 'organulos']

export function EscenaProEu({ fase }: { fase: string }) {
  const i = Math.max(0, ORDEN_PE.indexOf(fase))
  const grande = i >= 1
  const forma = grande ? blob(200, 150, 160, 108) : rect(150, 128, 100, 44, 22)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`De procariota a eucariota: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f3efe6" />
      {/* pared y cápsula de la bacteria */}
      <path fill="none" stroke="#6fa05a" strokeWidth="5" style={{ ...D(grande ? blob(200, 150, 168, 116) : rect(144, 122, 112, 56, 28)), opacity: grande ? 0 : 1 }} />
      <path stroke="#b05a5a" strokeWidth={grande ? 4 : 3} style={{ ...D(forma), fill: grande ? '#f8d9d4' : '#e9d7f0' }} />
      {/* flagelo */}
      <path d="M 256 150 q 16 -12 28 0 t 28 0 t 28 0" fill="none" stroke="#6b5a8a" strokeWidth="3" strokeLinecap="round" style={ver(!grande)} />
      {/* ADN: anillo suelto (nucleoide) que luego queda dentro del núcleo */}
      <g style={{ transition: suave, transformOrigin: '200px 150px', transform: grande ? 'translate(-20px, -4px) scale(1.5)' : 'none' }}>
        <path d="M 184 150 q 6 -12 16 -6 t 16 4 q -2 12 -14 8 t -18 -6 Z" fill="none" stroke="#3b6fb6" strokeWidth="2.2" />
      </g>
      {/* envoltura nuclear */}
      <circle cx="180" cy="146" r="40" fill="#ead3f2" fillOpacity="0.55" stroke="#7a4a8a" strokeWidth="3.5" strokeDasharray={i >= 2 ? undefined : '3 6'}
        style={{ transition: suave, transformOrigin: '180px 146px', transform: i >= 2 ? 'none' : 'scale(0.6)', opacity: i >= 2 ? 1 : 0 }} />
      {/* ribosomas: en las dos */}
      <g style={{ transition: suave, transformOrigin: '200px 150px', transform: grande ? 'scale(2.6)' : 'none' }}>
        <Ribosomas puntos={[[164, 140], [170, 162], [228, 140], [232, 160], [214, 166], [190, 136]]} />
      </g>
      {/* orgánulos con membrana: solo eucariota */}
      {[
        <g key="m1" transform="translate(96 104)"><Mito k={0.95} a={-25} /></g>,
        <g key="m2" transform="translate(300 206)"><Mito k={0.85} a={20} /></g>,
        <g key="g" transform="translate(294 120) rotate(20)"><Golgi k={0.95} /></g>,
        <g key="r" transform="translate(246 82) rotate(-25)"><RetRugoso k={0.85} /></g>,
        <g key="l" transform="translate(120 214)"><Lisosoma k={1.1} /></g>,
      ].map((el, k) => (
        <g key={k} style={{ transition: `opacity 0.6s ease ${k * 0.12}s`, opacity: i >= 3 ? 1 : 0 }}>{el}</g>
      ))}
    </svg>
  )
}
