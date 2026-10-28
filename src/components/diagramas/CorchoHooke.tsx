import { useEffect, useMemo, useState } from 'react'
import VisorZoom from '../VisorZoom.tsx'
import PantallaCompleta from '../PantallaCompleta.tsx'

// Ilustración (no a escala real) de lo que Hooke observó en 1665:
// una lámina de corcho vista a simple vista, con lupa y con su microscopio.

const W = 400
const H = 300
const CX = 200
const CY = 150
const R = 118

interface Celda {
  x: number
  y: number
  w: number
  h: number
}

function generador(semilla: number) {
  let s = semilla
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

const FILA = 6

function generarCeldas(): Celda[] {
  const azar = generador(7)
  const celdas: Celda[] = []
  for (let fila = -22; fila < 22; fila++) {
    let x = -140 - azar() * 10
    while (x < 140) {
      const w = 8 + azar() * 5
      celdas.push({ x, y: fila * FILA, w, h: FILA })
      x += w
    }
  }
  return celdas
}

function motas(): { x: number; y: number; r: number }[] {
  const azar = generador(21)
  return Array.from({ length: 90 }, () => ({ x: azar() * W, y: azar() * H, r: 0.8 + azar() * 1.6 }))
}

type Punto = 'pared' | 'cavidad'

const TEXTO: Record<Punto, { titulo: string; cuerpo: string }> = {
  pared: {
    titulo: 'La pared',
    cuerpo:
      'Esto es lo que Hooke realmente vio: las paredes que rodeaban cada espacio. El corcho es tejido muerto, y de cada célula solo queda su pared gruesa.',
  },
  cavidad: {
    titulo: 'La cavidad',
    cuerpo:
      'Un espacio vacío, parecido a una habitación pequeña. Por eso las llamó «células» (del latín cellula, «celdilla»): le recordaron a las celdas de un monasterio.',
  },
}

function etiquetaAumento(s: number): string {
  if (s < 2) return 'A simple vista'
  if (s < 4) return 'Con una lupa'
  return 'Con el microscopio de Hooke (unos 30 aumentos, ilustrativo)'
}

export default function CorchoHooke() {
  return (
    <PantallaCompleta>
      <Contenido />
    </PantallaCompleta>
  )
}

function Contenido() {
  const [s, setS] = useState(1)
  const [punto, setPunto] = useState<Punto | null>(null)
  const [comparar, setComparar] = useState(false)
  const celdas = useMemo(generarCeldas, [])
  const puntos = useMemo(motas, [])

  const c0 = useMemo(() => celdas.find((c) => c.y === 0 && c.x <= 0 && c.x + c.w > 0) ?? celdas[0], [celdas])
  const hot = {
    pared: { x: c0.x + c0.w, y: c0.y + c0.h / 2 },
    cavidad: { x: c0.x + c0.w / 2, y: c0.y + c0.h / 2 },
  }
  const pantalla = (p: { x: number; y: number }) => ({ x: CX + s * p.x, y: CY + s * p.y })

  // Teclas + y − cambian el aumento (útil en el aula, sin mouse).
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if ((e.key === 'c' || e.key === 'C') && !(e.target instanceof HTMLInputElement)) {
        setS((a) => {
          if (a >= 4.5) setComparar((v) => !v)
          return a
        })
        return
      }
      const mas = e.key === '+' || e.key === '='
      const menos = e.key === '-' || e.key === '_'
      if (!mas && !menos) return
      setS((a) => Math.min(6, Math.max(1, Math.round((a + (mas ? 0.5 : -0.5)) * 100) / 100)))
      setPunto(null)
    }
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
  }, [])

  const opacidadParedes = Math.min(1, Math.max(0, (s - 1.6) / 2))
  const verPuntos = s >= 4.5
  const verComparar = comparar && verPuntos

  const d = celdas.map((c) => `M${c.x} ${c.y}h${c.w}v${c.h}h${-c.w}z`).join('')

  return (
    <>
      <VisorZoom etiqueta="Corcho observado con distintos aumentos" alto="aspect-[4/3]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Lámina de corcho observada con distintos aumentos"
        className="h-full w-full"
      >
        <defs>
          <clipPath id="lente">
            <circle cx={CX} cy={CY} r={R} />
          </clipPath>
        </defs>

        {/* lámina de corcho a simple vista */}
        <rect x="-1500" y="-1500" width="3400" height="3300" fill="#d9b77f" />
        {puntos.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#a27d45" opacity="0.55" />
        ))}

        {/* lente */}
        <g clipPath="url(#lente)">
          <rect x={CX - R} y={CY - R} width={2 * R} height={2 * R} fill="#d9b77f" />
          {s < 2.4 &&
            puntos.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#a27d45" opacity="0.55" />
            ))}
          <g transform={`translate(${CX} ${CY}) scale(${s})`} opacity={opacidadParedes}>
            <path d={d} fill="#f3e7c9" stroke="#6b4a1f" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
          </g>
        </g>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#4a3416" strokeWidth="6" />
        <line x1={CX + R * 0.72} y1={CY + R * 0.72} x2={CX + R * 1.02} y2={CY + R * 1.02} stroke="#4a3416" strokeWidth="14" strokeLinecap="round" />

        {/* puntos tocables */}
        {verPuntos &&
          (['pared', 'cavidad'] as Punto[]).map((k) => {
            const p = pantalla(hot[k])
            const activo = punto === k
            return (
              <g
                key={k}
                role="button"
                tabIndex={0}
                aria-label={TEXTO[k].titulo}
                className="cursor-pointer outline-none"
                onClick={() => setPunto(k)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setPunto(k)
                  }
                }}
              >
                <circle cx={p.x} cy={p.y} r="16" fill="transparent" />
                <circle cx={p.x} cy={p.y} r={activo ? 10 : 8} fill={activo ? '#0f766e' : '#fff'} stroke="#0f766e" strokeWidth="3" />
                <text x={p.x} y={k === 'cavidad' ? p.y - 16 : p.y + 26} textAnchor="middle" fontSize="12" fontWeight="700" fill="#2b1d08" stroke="#f3e7c9" strokeWidth="3" paintOrder="stroke">
                  {k === 'pared' ? 'pared' : 'cavidad'}
                </text>
              </g>
            )
          })}
      </svg>
      </VisorZoom>

      <div className="mt-3">
        <label htmlFor="aumento" className="flex items-center justify-between text-sm font-semibold">
          <span>Aumento</span>
          <span className="font-normal text-[var(--suave)]">{etiquetaAumento(s)}</span>
        </label>
        <input
          id="aumento"
          type="range"
          min="1"
          max="6"
          step="0.05"
          value={s}
          onChange={(e) => {
            setS(Number(e.target.value))
            setPunto(null)
          }}
          // al soltar, el control devuelve el foco al recuadro para que las flechas sigan cambiando de hito
          onPointerUp={(e) => e.currentTarget.closest<HTMLElement>('[role=dialog]')?.focus()}
          className="mt-1 h-8 w-full accent-[var(--acento)]"
        />
      </div>

      {verPuntos && (
        <button
          type="button"
          aria-pressed={comparar}
          onClick={() => setComparar((v) => !v)}
          className="mt-2 rounded-xl border border-[var(--acento)] px-3 py-2 text-sm font-semibold text-[var(--acento)] aria-pressed:bg-[var(--acento)] aria-pressed:text-white"
        >
          {comparar ? 'Ocultar comparación' : 'Comparar con celdas de monasterio'} <span className="font-normal opacity-70">(C)</span>
        </button>
      )}

      {verComparar ? (
        <div className="mt-2 rounded-xl bg-[var(--fondo)] p-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <figure>
              <svg viewBox="0 0 120 90" role="img" aria-label="Cavidades del corcho: cuartitos pequeños en filas" className="w-full rounded-lg">
                <rect width="120" height="90" fill="#d9b77f" />
                <path d={Array.from({ length: 6 }, (_, f) => Array.from({ length: 8 }, (_, k) => `M${6 + k * 13 + (f % 2) * 4} ${6 + f * 13}h11v11h-11z`).join('')).join('')} fill="#f3e7c9" stroke="#6b4a1f" strokeWidth="1.5" />
              </svg>
              <figcaption className="mt-1 text-center text-xs font-semibold">Cavidades del corcho</figcaption>
            </figure>
            <figure>
              <svg viewBox="0 0 120 90" role="img" aria-label="Celdas de un monasterio: cuartos pequeños a lo largo de un pasillo" className="w-full rounded-lg">
                <rect width="120" height="90" fill="#cfc7b8" />
                <rect x="4" y="34" width="112" height="22" fill="#ece6d8" />
                {Array.from({ length: 8 }, (_, k) => (
                  <g key={k}>
                    <rect x={4 + k * 14} y="6" width="14" height="28" fill="#f3e7c9" stroke="#5b4a32" strokeWidth="1.5" />
                    <rect x={4 + k * 14} y="56" width="14" height="28" fill="#f3e7c9" stroke="#5b4a32" strokeWidth="1.5" />
                  </g>
                ))}
                <text x="60" y="49" textAnchor="middle" fontSize="7" fill="#5b4a32">pasillo</text>
              </svg>
              <figcaption className="mt-1 text-center text-xs font-semibold">Celdas de un monasterio</figcaption>
            </figure>
          </div>
          <p className="mt-2 font-semibold">¿Qué se parecen?</p>
          <ul className="list-disc pl-5">
            <li>Son espacios pequeños y casi iguales.</li>
            <li>Están ordenados en filas, uno junto a otro.</li>
            <li>Cada uno está separado del siguiente por una pared.</li>
          </ul>
          <p className="mt-2">
            Por eso Hooke las llamó <em>cellulae</em> (en latín, «celdillas»), de donde viene la palabra «célula». Ojo: en el corcho solo se ven las paredes de células que ya murieron.
          </p>
        </div>
      ) : (
        <div aria-live="polite" className="mt-2 min-h-[4.5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
          {punto ? (
            <>
              <p className="font-semibold">{TEXTO[punto].titulo}</p>
              <p>{TEXTO[punto].cuerpo}</p>
            </>
          ) : verPuntos ? (
            <p className="text-[var(--suave)]">Toca los puntos del dibujo para ver qué es cada cosa.</p>
          ) : (
            <p className="text-[var(--suave)]">
              Sube el aumento con el control de arriba. A simple vista el corcho parece una superficie continua.
            </p>
          )}
        </div>
      )}
      <p className="mt-2 text-xs text-[var(--suave)]">Ilustración esquemática, no es el dibujo original de Hooke ni está a escala.</p>
    </>
  )
}
