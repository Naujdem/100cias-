// Escena de zoom por los niveles de organización («potencias de diez»).
// Cada nivel es su dibujo de siempre; `ancla` dice dónde cabe el nivel anterior dentro de este:
// centro (x, y) y escala s del dibujo anterior (400×300) dentro del actual.
import type { ComponentType } from 'react'
import { ILUSTRACIONES_SVG } from '../ilustraciones/index.ts'

const NIVELES: { id: string; recurso: string; ancla: [number, number, number] }[] = [
  { id: 'atomos', recurso: 'nivel-atomos', ancla: [200, 150, 1] },
  { id: 'moleculas', recurso: 'nivel-moleculas', ancla: [100, 115, 0.15] },
  { id: 'macromoleculas', recurso: 'nivel-macromoleculas', ancla: [110, 120, 0.06] },
  { id: 'organulos', recurso: 'nivel-organulos', ancla: [150, 112, 0.08] },
  { id: 'celula', recurso: 'nivel-celula', ancla: [205, 120, 0.12] },
  { id: 'tejido', recurso: 'nivel-tejido', ancla: [187, 203, 0.22] },
  { id: 'organo', recurso: 'nivel-organo', ancla: [110, 170, 0.12] },
  { id: 'sistema', recurso: 'nivel-sistema', ancla: [200, 155, 0.5] },
  { id: 'organismo', recurso: 'nivel-organismo', ancla: [125, 125, 0.1] },
  { id: 'mas-alla', recurso: 'nivel-mas-alla', ancla: [52, 118, 0.1] },
]

type Af = [number, number, number] // p → s·p + (tx, ty)
const comp = (a: Af, b: Af): Af => [a[0] * b[0], a[0] * b[1] + a[1], a[0] * b[2] + a[2]]
const inv = (a: Af): Af => [1 / a[0], -a[1] / a[0], -a[2] / a[0]]
/** lleva coordenadas del nivel k-1 al nivel k */
const M = (k: number): Af => {
  const [x, y, s] = NIVELES[k].ancla
  return [s, x - 200 * s, y - 150 * s]
}

/** dónde se dibuja el nivel j visto desde el nivel actual i */
function camara(j: number, i: number): Af {
  let a: Af = [1, 0, 0]
  if (j < i) for (let k = i; k > j; k--) a = comp(a, M(k))
  if (j > i) {
    let b: Af = [1, 0, 0]
    for (let k = j; k > i; k--) b = comp(b, M(k))
    a = inv(b)
  }
  return a
}

export default function EscenaNiveles({ fase }: { fase: string }) {
  const i = Math.max(0, NIVELES.findIndex((n) => n.id === fase))
  const [ax, ay, as] = NIVELES[i].ancla
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Nivel de organización: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f5efe4" />
      {NIVELES.map((n, j) => {
        const D: ComponentType | undefined = ILUSTRACIONES_SVG[n.recurso]
        if (!D || Math.abs(j - i) > 1) return null
        const [s, tx, ty] = camara(j, i)
        return (
          <g
            key={n.id}
            style={{
              transition: 'transform 1.2s cubic-bezier(.45,.05,.25,1), opacity 0.9s ease',
              transformOrigin: '0px 0px',
              transform: `translate(${tx}px, ${ty}px) scale(${s})`,
              opacity: j === i ? 1 : 0,
            }}
          >
            <svg x="0" y="0" width="400" height="300" viewBox="0 0 400 300">
              <D />
            </svg>
          </g>
        )
      })}
      {/* aquí se esconde el nivel anterior */}
      {i > 0 && (
        <circle key={`marca-${i}`} cx={ax} cy={ay} r={Math.max(10, 70 * as)} fill="none" stroke="#0f6e56" strokeWidth="2.5" strokeDasharray="5 4" className="animate-[aparecer_0.6s_ease-out_0.9s_both]" />
      )}
    </svg>
  )
}
