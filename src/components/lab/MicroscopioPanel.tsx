import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { OBJETIVOS, desenfoque, useEnfoque } from './practicas/Microscopio.tsx'
import type { Est } from './practicas/Microscopio.tsx'

// Microscopio que se maneja tocándolo, para las prácticas que llevan una lámina a observar.
// Usa el mismo motor de enfoque de la práctica «El microscopio» (objetivos, macro/micrométrico, luz, lámina rota).
// La práctica da el dibujo de la muestra (300 × 300, se repite en mosaico) y recibe el estado para revisar.
// Teclado: 1–4 objetivo, ↑/↓ macrométrico, W/S micrométrico, L/K luz.

interface Props {
  grado: number
  /** hasta qué objetivo se puede llegar (índice en OBJETIVOS: 2 = 40x, 3 = 100x) */
  maxObj?: number
  /** dibujo de la muestra a 400x, en 300 × 300 */
  muestra: ReactNode
  /** capa de color sobre todo el campo (fondo teñido) */
  velo?: { color: string; opacidad: number }
  onEstado?: (e: Est) => void
}

export default function MicroscopioPanel({ grado, maxObj = 2, muestra, velo, onEstado }: Props) {
  const m = useEnfoque(grado >= 11 ? 11 : 9)
  const { e } = m
  const tope = Math.min(maxObj, m.maxObj)
  useEffect(() => { onEstado?.(e) }, [e, onEstado])
  const o = OBJETIVOS[e.obj]
  const b = desenfoque(e)
  const s = o.x / 40
  const oscuro = Math.max(0, o.luz - e.luz) * 1.3
  const claro = Math.max(0, e.luz - o.luz) * 0.9
  const yPlatina = 176 - e.z * 0.3
  const sig = () => m.objetivo(e.obj >= tope ? 0 : e.obj + 1)
  const flecha = (x: number, y: number, arriba: boolean, f: () => void, nombre: string) => (
    <g onClick={f} style={{ cursor: 'pointer' }} role="button" aria-label={nombre}>
      <circle cx={x} cy={y} r="11" fill="#fff" stroke="#2e86c1" strokeWidth="2" />
      <path d={arriba ? `M${x - 5} ${y + 3} L${x} ${y - 4} L${x + 5} ${y + 3}` : `M${x - 5} ${y - 3} L${x} ${y + 4} L${x + 5} ${y - 3}`} fill="none" stroke="#2e86c1" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  )
  return (
    <div className="grid items-start gap-4 rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-3 md:grid-cols-[minmax(0,340px)_minmax(0,300px)_1fr]">
      {/* lo que se ve por el ocular */}
      <svg viewBox="0 0 300 300" className="w-full" role="img" aria-label="Lo que se ve por el ocular">
        <defs>
          <filter id="mp-blur"><feGaussianBlur stdDeviation={b} /></filter>
          <pattern id="mp-muestra" width="300" height="300" patternUnits="userSpaceOnUse" patternTransform={`translate(150 150) scale(${s}) translate(-150 -150)`}>
            <rect width="300" height="300" fill="#f7f6ef" />
            {muestra}
          </pattern>
          <clipPath id="mp-campo"><circle cx="150" cy="150" r="140" /></clipPath>
        </defs>
        <rect width="300" height="300" fill="#111" />
        <g clipPath="url(#mp-campo)">
          {e.rota ? (
            <g><rect width="300" height="300" fill="#ddd" /><path d="M40 60 L150 150 L260 40 M150 150 L120 290 M150 150 L290 200 M150 150 L10 210" stroke="#555" strokeWidth="3" fill="none" /></g>
          ) : (
            <g filter="url(#mp-blur)">
              <rect width="300" height="300" fill="url(#mp-muestra)" />
              {velo && <rect width="300" height="300" fill={velo.color} opacity={velo.opacidad} />}
            </g>
          )}
          <rect width="300" height="300" fill="#000" opacity={Math.min(0.9, oscuro)} />
          <rect width="300" height="300" fill="#fff" opacity={Math.min(0.85, claro)} />
        </g>
        <circle cx="150" cy="150" r="140" fill="none" stroke="#000" strokeWidth="4" />
        <text x="290" y="292" textAnchor="end" fontSize="16" fontWeight="800" fill="#fff">{o.x * 10}x</text>
      </svg>

      {/* el microscopio que se toca */}
      <svg viewBox="0 0 280 300" className="w-full rounded-xl bg-[#efe8da]" role="application" aria-label="Microscopio: toca sus partes">
        <rect x="40" y="272" width="170" height="16" rx="5" fill="#3d4f63" />
        <path d="M150 272 V150 Q150 80 110 60" fill="none" stroke="#3d4f63" strokeWidth="22" strokeLinecap="round" />
        {/* tubo y ocular */}
        <rect x="70" y="20" width="26" height="70" rx="4" fill="#5d7287" stroke="#2b2b2b" strokeWidth="2" transform="rotate(-18 83 55)" />
        <rect x="58" y="6" width="22" height="20" rx="3" fill="#2b3a4a" transform="rotate(-18 69 16)" />
        {/* revólver con los objetivos */}
        <g onClick={sig} style={{ cursor: 'pointer' }} role="button" aria-label="Revólver: cambiar de objetivo">
          <ellipse cx="100" cy="118" rx="34" ry="12" fill="#8aa0b4" stroke="#2b2b2b" strokeWidth="2" />
          <rect x="91" y="124" width="18" height={47 - OBJETIVOS[e.obj].tope * 0.3} fill={['#c0392b', '#e6b800', '#2e86c1', '#fff'][e.obj]} stroke="#2b2b2b" strokeWidth="2" />
          <rect x="70" y="122" width="12" height="16" fill="#8aa0b4" stroke="#2b2b2b" strokeWidth="1.5" transform="rotate(25 76 130)" />
          <rect x="118" y="122" width="12" height="16" fill="#8aa0b4" stroke="#2b2b2b" strokeWidth="1.5" transform="rotate(-25 124 130)" />
          <text x="100" y="104" textAnchor="middle" fontSize="12" fontWeight="800" fill="#1d2726">{o.x}x ⟳</text>
        </g>
        {/* platina que sube y baja con la lámina */}
        <g style={{ transition: 'transform 0.2s' }} transform={`translate(0 ${yPlatina - 176})`}>
          <rect x="44" y="176" width="112" height="8" fill="#2b3a4a" />
          <rect x="66" y="171" width="68" height="5" fill={e.rota ? '#bbb' : 'rgba(200,230,245,0.95)'} stroke="#567" strokeWidth="1" />
          {e.aceite && <ellipse cx="100" cy="170" rx="5" ry="2" fill="#f2d24b" />}
        </g>
        {/* luz */}
        <circle cx="100" cy="246" r="10" fill={`rgba(255, 230, 120, ${0.25 + e.luz * 0.75})`} stroke="#8a7a2a" strokeWidth="1.5" />
        {e.luz > 0.05 && <path d={`M100 236 L92 ${196} H108 Z`} fill={`rgba(255,240,170,${e.luz * 0.6})`} />}
        {/* tornillos */}
        <circle cx="168" cy="214" r="17" fill="#5d7287" stroke="#2b2b2b" strokeWidth="2" />
        <circle cx="168" cy="214" r="8" fill="#8aa0b4" stroke="#2b2b2b" strokeWidth="1.5" />
        <text x="168" y="248" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1d2726">macro</text>
        {flecha(205, 196, true, () => m.mover(4, true), 'Macrométrico: subir platina')}
        {flecha(205, 228, false, () => m.mover(-4, true), 'Macrométrico: bajar platina')}
        <text x="244" y="200" fontSize="10" fontWeight="700" fill="#1d2726">micro</text>
        {flecha(252, 214, true, () => m.mover(0.4, false), 'Micrométrico: subir')}
        {flecha(252, 244, false, () => m.mover(-0.4, false), 'Micrométrico: bajar')}
        <text x="40" y="250" fontSize="10" fontWeight="700" fill="#1d2726">luz</text>
        {flecha(30, 226, true, () => m.luz(0.05), 'Más luz')}
        {flecha(56, 226, false, () => m.luz(-0.05), 'Menos luz')}
        {tope >= 3 && o.x === 100 && !e.aceite && (
          <g onClick={m.aceite} style={{ cursor: 'pointer' }} role="button" aria-label="Poner una gota de aceite de inmersión">
            <rect x="180" y="120" width="88" height="26" rx="13" fill="#f2d24b" stroke="#8a7a2a" />
            <text x="224" y="137" textAnchor="middle" fontSize="11" fontWeight="800" fill="#3a2f22">+ aceite</text>
          </g>
        )}
      </svg>

      <div className="flex flex-col gap-2 text-sm">
        <p className="font-semibold">Objetivo {o.x}x · aumento total {o.x * 10}x</p>
        <div className="flex flex-wrap gap-1">
          {OBJETIVOS.slice(0, tope + 1).map((x, k) => (
            <button key={x.x} type="button" onClick={() => m.objetivo(k)} className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${k === e.obj ? 'border-[var(--acento)] bg-[var(--acento)] text-[var(--sobre-acento)]' : 'border-[var(--linea)]'}`}>{x.x}x</button>
          ))}
        </div>
        {m.msg && <p className={m.msg.aviso ? 'font-semibold text-[#e0604a]' : ''}>{m.msg.aviso ? '⚠ ' : ''}{m.msg.t}</p>}
        {e.rota && <p>La lámina se rompió: llévala a la caneca y prepara otra.</p>}
        {grado < 11 && !e.rota && <p className="text-[var(--suave)]">Empieza con 4x: sube la platina con el macro hasta ver algo, afina con el micro y cambia al siguiente objetivo. Con 40x, solo el micro.</p>}
        <p className="text-xs text-[var(--suave)]">Toca el revólver, las flechas de los tornillos y de la luz. Teclado: 1–{tope + 1} objetivo · ↑/↓ macro · W/S micro · L/K luz.</p>
      </div>
    </div>
  )
}
