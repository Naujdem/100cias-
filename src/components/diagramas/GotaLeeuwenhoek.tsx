import { useEffect, useMemo, useState } from 'react'
import VisorZoom from '../VisorZoom.tsx'
import PantallaCompleta from '../PantallaCompleta.tsx'
import { useFlechas } from '../../lib/flechasDiagrama.ts'

// Ilustración (no a escala real) de una gota de agua vista con lentes cada vez más fuertes.

const W = 400
const H = 300
const CX = 200
const CY = 150
const R = 118

function generador(semilla: number) {
  let s = semilla
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

interface Protozoo {
  x: number
  y: number
  largo: number
  giro: number
  tipo: 'ovalo' | 'largo'
}

const PROTOZOOS: Protozoo[] = [
  { x: -8, y: -6, largo: 6.5, giro: -20, tipo: 'ovalo' },
  { x: 9, y: 5, largo: 5, giro: 25, tipo: 'largo' },
  { x: -3, y: 12, largo: 4, giro: 8, tipo: 'ovalo' },
]

function bacterias() {
  const azar = generador(11)
  return Array.from({ length: 60 }, (_, i) => {
    const a = azar() * Math.PI * 2
    const d = Math.sqrt(azar()) * 19
    return { x: Math.cos(a) * d, y: Math.sin(a) * d, bastón: i % 3 !== 0, giro: azar() * 180 }
  })
}

type Punto = 'animalculo' | 'bacteria'

const TEXTO: Record<Punto, { titulo: string; cuerpo: string }> = {
  animalculo: {
    titulo: 'Un «animálculo»',
    cuerpo:
      'Así llamó Leeuwenhoek a estos seres que se movían solos en el agua. Hoy los llamamos protozoos: cada uno es una sola célula viva. (Hooke había visto paredes de células muertas.)',
  },
  bacteria: {
    titulo: 'Una bacteria',
    cuerpo:
      'Son mucho más pequeñas que los animálculos, y Leeuwenhoek las vio hacia 1676 con sus mejores lentes. Tampoco sabía que eran células.',
  },
}

function etiquetaAumento(s: number): string {
  if (s < 2) return 'A simple vista: parece agua limpia'
  if (s < 4.5) return 'Con una lupa: se insinúan motitas'
  return 'Con una lente de Leeuwenhoek (unos 200 aumentos, ilustrativo)'
}

type Modo = 'gota' | 'escala'

export default function GotaLeeuwenhoek() {
  const [modo, setModo] = useState<Modo>('gota')
  return (
    <div>
      <div role="group" aria-label="Actividad" className="mb-3 flex flex-wrap gap-2">
        {([['gota', 'Mira una gota'], ['escala', '¿Qué tan pequeño?']] as [Modo, string][]).map(([id, texto]) => (
          <button
            key={id}
            type="button"
            aria-pressed={modo === id}
            onClick={() => setModo(id)}
            className="min-h-10 rounded-full border border-[var(--acento)] px-3 text-sm font-semibold text-[var(--acento)] aria-pressed:bg-[var(--acento)] aria-pressed:text-white"
          >
            {texto}
          </button>
        ))}
      </div>
      {modo === 'gota' ? (
        <PantallaCompleta>
          <Gota />
        </PantallaCompleta>
      ) : (
        <Escala />
      )}
    </div>
  )
}

function Gota() {
  const [s, setS] = useState(1)
  const [punto, setPunto] = useState<Punto | null>(null)
  const bichos = useMemo(bacterias, [])
  const [quieto, setQuieto] = useState(false)

  useEffect(() => {
    setQuieto(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)
  }, [])

  // + y − cambian el aumento (útil en el aula, sin mouse)
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const mas = e.key === '+' || e.key === '='
      const menos = e.key === '-' || e.key === '_'
      if (!mas && !menos) return
      setS((a) => Math.min(6, Math.max(1, Math.round((a + (mas ? 0.5 : -0.5)) * 100) / 100)))
      setPunto(null)
    }
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
  }, [])

  const opProtozoos = Math.min(1, Math.max(0, (s - 1.8) / 1.2))
  const opBacterias = Math.min(1, Math.max(0, (s - 3.8) / 1))
  const verPuntos = s >= 4.5
  const pantalla = (p: { x: number; y: number }) => ({ x: CX + s * p.x, y: CY + s * p.y })
  // la bacteria señalada es la más alejada de los protozoos, para que el punto no tape a otro
  const elegida = bichos.reduce((mejor, b) => {
    const lejos = (q: { x: number; y: number }) => Math.min(...PROTOZOOS.map((p) => Math.hypot(q.x - p.x, q.y - p.y) - p.largo))
    return lejos(b) > lejos(mejor) && b.bastón ? b : mejor
  }, bichos[1])
  const hot = { animalculo: pantalla(PROTOZOOS[0]), bacteria: pantalla(elegida) }

  return (
    <>
      <VisorZoom etiqueta="Gota de agua observada con distintos aumentos" alto="aspect-[4/3]">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Gota de agua observada con distintos aumentos" className="h-full w-full">
          <defs>
            <clipPath id="lente-gota">
              <circle cx={CX} cy={CY} r={R} />
            </clipPath>
          </defs>
          <rect x="-1500" y="-1500" width="3400" height="3300" fill="#d7c9ad" />
          <g clipPath="url(#lente-gota)">
            <rect x={CX - R} y={CY - R} width={2 * R} height={2 * R} fill="#d8f0f3" />
            <g transform={`translate(${CX} ${CY}) scale(${s})`}>
              <g opacity={opBacterias}>
                {bichos.map((b, i) =>
                  b.bastón ? (
                    <rect key={i} x={b.x - 0.9} y={b.y - 0.35} width="1.8" height="0.7" rx="0.35" fill="#7a4a8a" transform={`rotate(${b.giro} ${b.x} ${b.y})`} />
                  ) : (
                    <circle key={i} cx={b.x} cy={b.y} r="0.5" fill="#7a4a8a" />
                  ),
                )}
              </g>
              <g opacity={opProtozoos}>
                {PROTOZOOS.map((p, i) => (
                  <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.giro})`}>
                    {!quieto && (
                      <animateTransform attributeName="transform" type="translate" additive="sum" values="0 0; 0.8 -0.6; 0 0.4; -0.8 0; 0 0" dur={`${5 + i}s`} repeatCount="indefinite" />
                    )}
                    <ellipse rx={p.largo} ry={p.tipo === 'ovalo' ? p.largo * 0.42 : p.largo * 0.3} fill="#a7d3a0" stroke="#3f7a3a" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
                    <circle cx={-p.largo * 0.35} cy="0" r={p.largo * 0.14} fill="#3f7a3a" />
                    {[-0.5, -0.2, 0.1, 0.4].map((f, k) => (
                      <path key={k} d={`M${p.largo * f} ${-p.largo * 0.4} v-0.8 M${p.largo * f} ${p.largo * 0.4} v0.8`} stroke="#3f7a3a" strokeWidth="0.4" />
                    ))}
                  </g>
                ))}
              </g>
            </g>
          </g>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#4a3416" strokeWidth="6" />

          {verPuntos &&
            (['animalculo', 'bacteria'] as Punto[]).map((k) => {
              const p = hot[k]
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
                  <text x={p.x} y={p.y - 16} textAnchor="middle" fontSize="12" fontWeight="700" fill="#2b1d08" stroke="#d8f0f3" strokeWidth="3" paintOrder="stroke">
                    {k === 'animalculo' ? 'animálculo' : 'bacteria'}
                  </text>
                </g>
              )
            })}
        </svg>
      </VisorZoom>

      <div className="mt-3">
        <label htmlFor="aumento-gota" className="flex items-center justify-between text-sm font-semibold">
          <span>Aumento</span>
          <span className="font-normal text-[var(--suave)]">{etiquetaAumento(s)}</span>
        </label>
        <input
          id="aumento-gota"
          type="range"
          min="1"
          max="6"
          step="0.05"
          value={s}
          onChange={(e) => {
            setS(Number(e.target.value))
            setPunto(null)
          }}
          onPointerUp={(e) => e.currentTarget.closest<HTMLElement>('[role=dialog]')?.focus()}
          className="mt-1 h-8 w-full accent-[var(--acento)]"
        />
      </div>

      <div aria-live="polite" className="mt-2 min-h-[4.5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
        {punto ? (
          <>
            <p className="font-semibold">{TEXTO[punto].titulo}</p>
            <p>{TEXTO[punto].cuerpo}</p>
          </>
        ) : verPuntos ? (
          <p className="text-[var(--suave)]">Toca los puntos del dibujo para ver qué es cada cosa.</p>
        ) : (
          <p className="text-[var(--suave)]">Sube el aumento con el control de arriba. A simple vista la gota parece solo agua.</p>
        )}
      </div>
      <p className="mt-2 text-xs text-[var(--suave)]">Ilustración esquemática: no es un dibujo de Leeuwenhoek ni está a escala.</p>
    </>
  )
}

interface Cosa {
  id: string
  nombre: string
  um: number
  nota: string
}

// Tamaños aproximados, en micrómetros (µm). 1 mm = 1000 µm.
const COSAS: Cosa[] = [
  { id: 'arena', nombre: 'Grano de arena fina', um: 150, nota: 'Se ve a simple vista, como un punto.' },
  { id: 'paramecio', nombre: 'Paramecio (protozoo)', um: 200, nota: 'Uno de los «animálculos»: una sola célula, casi en el límite de lo que ve el ojo.' },
  { id: 'cabello', nombre: 'Grosor de un cabello', um: 70, nota: 'Muy fino, pero se ve.' },
  { id: 'globulo', nombre: 'Glóbulo rojo', um: 7, nota: 'Leeuwenhoek los describió. Necesita un microscopio.' },
  { id: 'bacteria', nombre: 'Bacteria', um: 2, nota: 'Lo más pequeño que alcanzó a ver con sus mejores lentes.' },
]

const OJO = 100 // límite aproximado del ojo humano (µm)
const LENTE = 1 // límite aproximado de las lentes de Leeuwenhoek (µm)

const eje = (um: number) => 20 + (Math.log10(um) / 3) * 360 // 1 µm → 20, 1000 µm → 380

function Escala() {
  const [sel, setSel] = useState<string>('bacteria')
  const c = COSAS.find((x) => x.id === sel)!
  // ← → pasan al objeto anterior o siguiente del eje
  useFlechas((dir) => {
    const i = COSAS.findIndex((x) => x.id === sel)
    setSel(COSAS[Math.max(0, Math.min(COSAS.length - 1, i + dir))].id)
    return true
  })
  return (
    <PantallaCompleta conBoton>
      <p className="text-sm">Toca cada cosa para ver su tamaño (el eje va de 1 µm a 1000 µm, 1 mm). Cada paso a la derecha es diez veces más grande.</p>
      <svg viewBox="0 0 400 130" role="img" aria-label="Eje de tamaños en escala logarítmica, de una micra a un milímetro" className="mt-3 w-full">
        <rect x="0" y="0" width="400" height="130" fill="var(--fondo)" rx="10" />
        <line x1="20" y1="80" x2="380" y2="80" stroke="#4a3416" strokeWidth="2" />
        {[1, 10, 100, 1000].map((v) => (
          <g key={v}>
            <line x1={eje(v)} y1="74" x2={eje(v)} y2="86" stroke="#4a3416" strokeWidth="2" />
            <text x={eje(v)} y="102" textAnchor="middle" fontSize="11" fill="currentColor">
              {v === 1000 ? '1 mm' : `${v} µm`}
            </text>
          </g>
        ))}
        <line x1={eje(OJO)} y1="20" x2={eje(OJO)} y2="80" stroke="#b45309" strokeWidth="2" strokeDasharray="4 3" />
        <text x={eje(OJO) + 4} y="18" fontSize="10" fill="#b45309">ojo: ≈ 0,1 mm</text>
        <line x1={eje(LENTE)} y1="40" x2={eje(LENTE)} y2="80" stroke="#7a4a8a" strokeWidth="2" strokeDasharray="4 3" />
        <text x={eje(LENTE) + 4} y="38" fontSize="10" fill="#7a4a8a">lente de Leeuwenhoek</text>
        {COSAS.map((x) => (
          <circle key={x.id} cx={eje(x.um)} cy="80" r={x.id === sel ? 8 : 5} fill={x.id === sel ? '#0f766e' : '#fff'} stroke="#0f766e" strokeWidth="3" />
        ))}
      </svg>
      <div role="group" aria-label="Elige un objeto" className="mt-3 flex flex-wrap gap-2">
        {COSAS.map((x) => (
          <button
            key={x.id}
            type="button"
            aria-pressed={sel === x.id}
            onClick={() => setSel(x.id)}
            className="min-h-10 rounded-lg border border-[var(--linea)] px-3 text-sm font-semibold aria-pressed:border-[var(--acento)] aria-pressed:bg-[var(--acento-suave)]/40"
          >
            {x.nombre}
          </button>
        ))}
      </div>
      <div aria-live="polite" className="mt-3 rounded-xl bg-[var(--fondo)] p-3 text-sm">
        <p className="font-semibold">
          {c.nombre}: ≈ {c.um} µm
        </p>
        <p>{c.nota}</p>
        <ul className="mt-1 ml-5 list-disc">
          <li>¿Lo ve el ojo sin ayuda? {c.um >= OJO ? 'Sí.' : 'No.'}</li>
          <li>¿Lo alcanzaba a ver Leeuwenhoek? {c.um >= LENTE ? 'Sí.' : 'No.'}</li>
        </ul>
      </div>
      <p className="mt-2 text-xs text-[var(--suave)]">Tamaños aproximados, para dar una idea del orden de magnitud. 1 µm es una milésima de milímetro.</p>
    </PantallaCompleta>
  )
}
