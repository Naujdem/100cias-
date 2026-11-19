import type { Efecto } from '../../data/reaccionesLibre.ts'

// Efectos animados en SVG para un vaso de la Mesa libre (PLAN-LABORATORIOS.md, Fase 1, parte 2).
// No pretenden ser realistas: muestran qué está pasando. El vaso mide 64 × 72 (de x −32 a 32, y −36 a 36).
// `clave` cambia con cada mezcla: los efectos que pasan una vez (remolino, caída del precipitado, disolución)
// se vuelven a montar y se repiten.

interface Props {
  clave: string
  efectos: Set<Efecto>
  /** color del líquido */
  color: string | null
  colorSolido?: string
  /** altura del líquido */
  h: number
  /** objetos dentro (clavo, zinc, cobre) y si quedaron cobreados */
  objetos: { id: string; color: string }[]
  /** humo tóxico (amarillo verdoso) */
  toxico?: boolean
  /** mucha espuma (pasta de dientes de elefante) */
  muchaEspuma?: boolean
  calentado: boolean
}

const R = (a: number, b: number, i: number) => a + ((i * 7919) % 97) / 97 * (b - a)

export default function EfectosVaso({ clave, efectos, color, colorSolido, h, objetos, toxico, muchaEspuma, calentado }: Props) {
  const tope = 34 - h
  return (
    <g>
      {/* halo de calor o frío, que late */}
      {efectos.has('calor') && <circle r="48" fill="rgba(230,90,40,0.22)"><animate attributeName="r" values="42;50;42" dur="1.6s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.6;1;0.6" dur="1.6s" repeatCount="indefinite" /></circle>}
      {efectos.has('frio') && <circle r="48" fill="rgba(60,130,230,0.18)"><animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" /></circle>}

      {/* líquido */}
      {color && h > 0 && <rect x="-30" y={tope} width="60" height={h} fill={color} opacity="0.85" style={{ transition: 'fill 1.2s, y 0.6s, height 0.6s' }} />}
      {/* remolino al mezclar */}
      {color && h > 0 && <g key={`m${clave}`}><ellipse cx="0" cy={tope + h / 2} rx="4" ry="2" fill="none" stroke="#fff" strokeWidth="2" opacity="0"><animate attributeName="rx" values="4;26" dur="0.9s" fill="freeze" /><animate attributeName="opacity" values="0.8;0" dur="0.9s" fill="freeze" /></ellipse></g>}

      {/* capas: aceite arriba */}
      {efectos.has('capas') && <rect x="-30" y={tope} width="60" height="9" fill={colorSolido ?? '#e9c94a'} opacity="0.95"><animate attributeName="y" values={`${tope + h - 9};${tope}`} dur="1.2s" fill="freeze" /></rect>}

      {/* sólido que se disuelve */}
      {efectos.has('disuelve') && <g key={`d${clave}`}>{[-10, 0, 10].map((x) => <rect key={x} x={x - 3} y="27" width="6" height="6" fill="#fff" stroke="#bbb"><animate attributeName="opacity" values="1;0" dur="2.5s" fill="freeze" /><animate attributeName="height" values="6;0" dur="2.5s" fill="freeze" /></rect>)}</g>}

      {/* precipitado: partículas que caen y se asientan */}
      {efectos.has('precipitado') && (
        <g key={`p${clave}`}>
          {Array.from({ length: 14 }, (_, i) => {
            const x = R(-24, 24, i), y0 = R(tope + 4, tope + h / 2, i + 3)
            return <circle key={i} cx={x} cy={y0} r={R(1.5, 3, i + 5)} fill={colorSolido ?? '#fff'} stroke="rgba(0,0,0,0.15)" strokeWidth="0.5"><animate attributeName="cy" values={`${y0};31`} dur={`${R(1.5, 3.5, i)}s`} fill="freeze" /></circle>
          })}
          <ellipse cx="0" cy="32" rx="0" ry="3.5" fill={colorSolido ?? '#fff'} stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"><animate attributeName="rx" values="0;24" begin="1.5s" dur="2s" fill="freeze" /></ellipse>
        </g>
      )}

      {/* objetos de metal en el fondo */}
      {objetos.map((o, i) => (
        <g key={o.id} transform={`rotate(${-20 + i * 30} ${-8 + i * 10} 24)`}>
          <rect x={-22 + i * 12} y="22" width={o.id === 'hierro' ? 34 : 14} height="5" rx="1.5" fill={o.color} stroke="#2b2b2b" strokeWidth="0.6" style={{ transition: 'fill 3s' }} />
        </g>
      ))}

      {/* burbujas: suben y revientan en la superficie */}
      {efectos.has('burbujas') && h > 0 && Array.from({ length: 9 }, (_, i) => {
        const x = R(-24, 24, i), r = R(1.5, 3.5, i + 2), d = R(0.6, 1.6, i + 4)
        return <circle key={i} cx={x} r={r} fill="rgba(255,255,255,0.85)" stroke="rgba(0,0,0,0.15)" strokeWidth="0.4"><animate attributeName="cy" values={`33;${tope + 2}`} dur={`${d}s`} begin={`${R(0, 1, i + 7)}s`} repeatCount="indefinite" /><animate attributeName="opacity" values="1;1;0" dur={`${d}s`} begin={`${R(0, 1, i + 7)}s`} repeatCount="indefinite" /></circle>
      })}

      {/* espuma que sube; si es mucha, se rebosa */}
      {efectos.has('espuma') && (
        <g key={`e${clave}`}>
          <path d={`M-30 ${tope} q8 -8 15 0 q8 -8 15 0 q8 -8 15 0 q8 -8 15 0 V${tope + 6} H-30 Z`} fill="#fff" stroke="#ddd">
            <animateTransform attributeName="transform" type="translate" values={`0 6;0 ${muchaEspuma ? -(tope + 40) : -4}`} dur={muchaEspuma ? '2.2s' : '1.2s'} fill="freeze" />
          </path>
          {muchaEspuma && <path d="M-14 -40 q-10 -30 6 -50 q20 -14 22 10 q4 24 -8 40 Z" fill="#fff" stroke="#ddd" opacity="0"><animate attributeName="opacity" values="0;1" begin="1.8s" dur="0.6s" fill="freeze" /><animateTransform attributeName="transform" type="scale" values="0.2;1" begin="1.8s" dur="1.4s" fill="freeze" additive="sum" /></path>}
        </g>
      )}

      {/* humo o vapor */}
      {efectos.has('humo') && Array.from({ length: 4 }, (_, i) => (
        <circle key={i} cx={R(-14, 14, i)} r="6" fill={toxico ? 'rgba(190,200,60,0.6)' : 'rgba(200,200,200,0.6)'}>
          <animate attributeName="cy" values="-36;-80" dur="2.4s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
          <animate attributeName="r" values="4;12" dur="2.4s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0" dur="2.4s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* ondas de calor sobre el vaso */}
      {(efectos.has('calor') || calentado) && [-12, 4].map((x, i) => <path key={x} d={`M${x} -42 q5 -6 0 -12 q-5 -6 0 -12`} fill="none" stroke="rgba(230,90,40,0.6)" strokeWidth="2"><animate attributeName="opacity" values="0;1;0" dur="1.4s" begin={`${i * 0.7}s`} repeatCount="indefinite" /></path>)}

      {/* escarcha por fuera cuando enfría */}
      {efectos.has('frio') && [-32, 32].map((x) => [0, 12, 24].map((y) => <circle key={`${x}${y}`} cx={x} cy={y - 8} r="1.6" fill="#dff2ff" stroke="#9cc" strokeWidth="0.4" />))}

      {/* llama sobre la boca del vaso */}
      {efectos.has('llama') && (
        <g transform="translate(0 -36)">
          <path d="M0 -48 C-14 -28 -16 -12 0 0 C16 -12 14 -28 0 -48 Z" fill="rgba(70,140,240,0.55)">
            <animateTransform attributeName="transform" type="scale" values="1 1;0.9 1.1;1 0.95;1 1" dur="0.5s" repeatCount="indefinite" additive="sum" />
          </path>
          <path d="M0 -30 C-6 -20 -6 -10 0 -4 C6 -10 6 -20 0 -30 Z" fill="rgba(255,200,80,0.7)"><animate attributeName="opacity" values="0.5;1;0.5" dur="0.4s" repeatCount="indefinite" /></path>
        </g>
      )}
    </g>
  )
}
