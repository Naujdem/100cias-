import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

// Mesa viva: los objetos de la práctica están sobre una mesa SVG y se manipulan con la mano.
// - Clic (o toque) en un objeto: se levanta y sigue al cursor; clic en el destino: se lleva y se usa ahí.
// - También se puede arrastrar y soltar.
// - Teclado: ←/→ recorren la mesa, Enter toma o suelta, Esc devuelve el objeto.
// Al soltar, el objeto viaja al destino, hace su animación (verter, gotas, polvo, poner) y vuelve a su sitio.
// Cada práctica solo da las piezas y qué pasa al soltar una sobre otra (PLAN-LABORATORIOS.md).

export type Anim = 'verter' | 'gotas' | 'polvo' | 'poner' | 'frotar'

export interface Pieza {
  id: string
  nombre: string
  /** centro del objeto en la mesa (viewBox de 1000 × alto) */
  x: number
  y: number
  /** caja para tocarlo */
  ancho: number
  alto: number
  /** dibujo centrado en (0, 0) */
  dibujo: ReactNode
  /** se puede levantar */
  tomable?: boolean
  /** acción al tocarlo sin tener nada en la mano (reloj, perilla…) */
  alTocar?: () => void
  /** color del líquido o polvo que suelta (para el chorro o las gotas) */
  color?: string
}

export interface Uso {
  anim: Anim
  /** se llama cuando termina la animación */
  hecho: () => void
  /** gotas que caen (anim «gotas») */
  gotas?: number
}

interface Props {
  piezas: Pieza[]
  alto?: number
  /** recorta el cielo vacío: la mesa se ve desde esta altura (más grande) */
  desde?: number
  /** qué pasa al soltar «de» sobre «en»: un uso, o el motivo por el que no se puede */
  soltar: (de: string, en: string) => Uso | string
  /** destinos que se iluminan cuando se tiene «de» en la mano */
  destinos: (de: string) => string[]
  fondo?: ReactNode
  /** texto bajo la mesa */
  ayuda?: string
}

const DURA: Record<Anim, number> = { verter: 1300, gotas: 1200, polvo: 1200, poner: 700, frotar: 1100 }

export default function MesaViva({ piezas, alto = 420, desde = 0, soltar, destinos, fondo, ayuda }: Props) {
  const svg = useRef<SVGSVGElement>(null)
  const [mano, setMano] = useState<string | null>(null)
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null)
  const [foco, setFoco] = useState(0)
  const [teclado, setTeclado] = useState(false) // el recuadro de foco solo aparece si se usa el teclado
  const [aviso, setAviso] = useState('')
  const [sobre, setSobre] = useState<string | null>(null) // nombre del objeto bajo el cursor
  const [anim, setAnim] = useState<{ de: string; en: string; uso: Uso } | null>(null)
  const arrastre = useRef<{ id: string; x0: number; y0: number; movido: boolean } | null>(null)
  const soltado = useRef(false) // evita que el clic que sigue a un arrastre vuelva a tomar el objeto

  const P = (id: string | null) => piezas.find((p) => p.id === id)
  const validos = mano ? destinos(mano) : []

  const punto = (e: { clientX: number; clientY: number }) => {
    const s = svg.current
    const m = s?.getScreenCTM()
    if (!s || !m) return null
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse())
    return { x: pt.x, y: pt.y }
  }
  const enPunto = (x: number, y: number, sin?: string) =>
    [...piezas].reverse().find((p) => p.id !== sin && Math.abs(x - p.x) <= p.ancho / 2 + 8 && Math.abs(y - p.y) <= p.alto / 2 + 8)

  const usar = (de: string, en: string) => {
    const r = soltar(de, en)
    if (typeof r === 'string') { setAviso(r); setMano(null); return }
    setAviso('')
    setMano(null)
    setAnim({ de, en, uso: r })
    window.setTimeout(() => { setAnim(null); r.hecho() }, DURA[r.anim])
  }
  const tocar = (p: Pieza) => {
    if (anim) return
    if (mano) {
      if (p.id === mano) { setMano(null); return }
      usar(mano, p.id)
    } else if (p.tomable) { setMano(p.id); setAviso('') }
    else p.alTocar?.()
  }

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return
      if (e.key === 'ArrowRight') { setTeclado(true); setFoco((f) => (f + 1) % piezas.length) }
      else if (e.key === 'ArrowLeft') { setTeclado(true); setFoco((f) => (f - 1 + piezas.length) % piezas.length) }
      else if (e.key === 'Enter' || e.key === ' ') tocar(piezas[foco])
      else if (e.key === 'Escape') setMano(null)
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })

  const enMano = P(mano)
  const A = anim ? { de: P(anim.de)!, en: P(anim.en)! } : null
  return (
    <div className="flex flex-col gap-2">
      <svg
        ref={svg}
        viewBox={`0 ${desde} 1000 ${alto - desde}`}
        className="w-full touch-none select-none rounded-2xl border border-[var(--linea)] bg-[#efe8da]"
        role="application"
        aria-label="Mesa de laboratorio"
        onPointerMove={(e) => {
          const pt = punto(e)
          if (!pt) return
          setCursor(pt)
          setSobre(enPunto(pt.x, pt.y)?.id ?? null)
          const a = arrastre.current
          if (a && !a.movido && Math.hypot(pt.x - a.x0, pt.y - a.y0) > 10) { a.movido = true; setMano(a.id) }
        }}
        onPointerUp={(e) => {
          const a = arrastre.current
          arrastre.current = null
          const pt = punto(e)
          if (!a || !pt) return
          if (a.movido) {
            soltado.current = true
            window.setTimeout(() => { soltado.current = false }, 0)
            const d = enPunto(pt.x, pt.y, a.id)
            if (d) usar(a.id, d.id)
            else setMano(null)
          }
        }}
        onPointerLeave={() => setCursor(null)}
      >
        <rect x="0" y={alto - 60} width="1000" height="60" fill="#c9a77c" />
        <rect x="0" y={alto - 60} width="1000" height="6" fill="#b48f62" />
        {fondo}
        {piezas.map((p, k) => {
          const oculto = p.id === mano || (A && p.id === anim!.de)
          const destino = validos.includes(p.id)
          return (
            <g
              key={p.id}
              transform={`translate(${p.x} ${p.y})`}
              style={{ cursor: anim ? 'default' : 'pointer', opacity: oculto ? 0.18 : 1 }}
              onPointerDown={(e) => {
                if (anim) return
                const pt = punto(e)
                if (!mano && p.tomable && pt) arrastre.current = { id: p.id, x0: pt.x, y0: pt.y, movido: false }
              }}
              onClick={() => { if (!soltado.current) tocar(p) }}
            >
              <rect x={-p.ancho / 2} y={-p.alto / 2} width={p.ancho} height={p.alto} fill="transparent" />
              {destino && <rect x={-p.ancho / 2 - 6} y={-p.alto / 2 - 6} width={p.ancho + 12} height={p.alto + 12} rx="12" fill="rgba(46,134,193,0.12)" stroke="#2e86c1" strokeWidth="2.5" strokeDasharray="7 5" />}
              {teclado && k === foco && <rect x={-p.ancho / 2 - 9} y={-p.alto / 2 - 9} width={p.ancho + 18} height={p.alto + 18} rx="14" fill="none" stroke="#e67e22" strokeWidth="2" />}
              {p.dibujo}
            </g>
          )
        })}
        {/* objeto en la mano */}
        {enMano && !anim && (
          <g transform={`translate(${cursor?.x ?? enMano.x} ${(cursor?.y ?? enMano.y) - (cursor ? 10 : 30)}) rotate(-8)`} style={{ pointerEvents: 'none', filter: 'drop-shadow(0 8px 6px rgba(0,0,0,0.25))' }}>
            {enMano.dibujo}
          </g>
        )}
        {/* animación de uso */}
        {A && <Animacion de={A.de} en={A.en} uso={anim!.uso} />}
        {piezas.map((p, k) => ((teclado && k === foco) || validos.includes(p.id) || p.id === sobre) && (
          <text key={`n${p.id}`} x={p.x} y={p.y + p.alto / 2 + 22} textAnchor="middle" fontSize="15" fontWeight="700" fill="#3a2f22" style={{ pointerEvents: 'none' }}>{p.nombre}</text>
        ))}
      </svg>
      <p className="min-h-6 text-sm">
        {aviso ? <span className="font-semibold text-[#b5462c]">✘ {aviso}</span>
          : enMano ? <span>Tienes en la mano: <b>{enMano.nombre}</b>. Toca dónde usarlo (o Esc para devolverlo).</span>
          : <span className="text-[var(--suave)]">{ayuda ?? 'Toca un objeto para tomarlo y luego toca dónde usarlo. También puedes arrastrar.'} Teclado: ←/→, Enter, Esc.</span>}
      </p>
    </div>
  )
}

function Animacion({ de, en, uso }: { de: Pieza; en: Pieza; uso: Uso }) {
  const [t, setT] = useState(false)
  useEffect(() => { const id = requestAnimationFrame(() => setT(true)); return () => cancelAnimationFrame(id) }, [])
  const dura = DURA[uso.anim]
  const arriba = en.y - en.alto / 2 - de.alto / 2 - 12
  const inclina = uso.anim === 'verter' ? -70 : uso.anim === 'gotas' || uso.anim === 'polvo' ? -40 : 0
  const xFin = uso.anim === 'poner' ? en.x : en.x + de.alto * 0.35
  const yFin = uso.anim === 'poner' ? en.y - en.alto / 2 + 4 : uso.anim === 'frotar' ? en.y - 10 : arriba
  const color = de.color ?? '#8ec5e8'
  const caida = en.y - en.alto / 2 + 6
  return (
    <g style={{ pointerEvents: 'none' }}>
      <g style={{ transform: `translate(${t ? xFin : de.x}px, ${t ? yFin : de.y}px)`, transition: `transform ${Math.min(450, dura / 2)}ms ease-out` }}>
        <g style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: `rotate(${t ? inclina : 0}deg)`, transition: 'transform 300ms 300ms', animation: uso.anim === 'frotar' ? 'mv-frotar 0.3s 0.4s 3 alternate' : undefined }}>
          {de.dibujo}
        </g>
      </g>
      {uso.anim === 'verter' && <rect x={en.x - 3} y={yFin} width="6" height={Math.max(0, caida - yFin)} fill={color} opacity="0.8" style={{ transformOrigin: `${en.x}px ${yFin}px`, animation: `mv-chorro ${dura - 450}ms 450ms both` }} />}
      {(uso.anim === 'gotas' || uso.anim === 'polvo') && Array.from({ length: uso.anim === 'polvo' ? 10 : Math.min(5, uso.gotas ?? 2) }, (_, k) => (
        <circle key={k} cx={en.x + (uso.anim === 'polvo' ? ((k * 7) % 14) - 7 : 0)} cy={yFin + 10} r={uso.anim === 'polvo' ? 2.5 : 5} fill={color} style={{ animation: `mv-gota 420ms ${500 + k * 140}ms both ease-in`, ['--caida' as string]: `${caida - yFin - 10}px` }} />
      ))}
      <style>{`
        @keyframes mv-chorro { 0% { transform: scaleY(0) } 20% { transform: scaleY(1) } 85% { transform: scaleY(1); opacity: .8 } 100% { transform: scaleY(1); opacity: 0 } }
        @keyframes mv-gota { 0% { transform: translateY(0); opacity: 1 } 90% { opacity: 1 } 100% { transform: translateY(var(--caida)); opacity: 0 } }
        @keyframes mv-frotar { from { transform: translateX(-14px) } to { transform: translateX(14px) } }
      `}</style>
    </g>
  )
}
