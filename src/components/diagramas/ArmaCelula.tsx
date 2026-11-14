import { useEffect, useRef, useState } from 'react'
import PantallaCompleta from '../PantallaCompleta.tsx'
import { Lienzo, T } from '../ilustraciones/Dibujo.tsx'
import { Nucleo, Mito, Golgi, RetRugoso, Lisosoma, Cloroplasto } from '../ilustraciones/CelulaEuc.tsx'
import { useFlechas } from '../../lib/flechasDiagrama.ts'

// Minijuego del tema 3: «Arma la célula». Se pide una célula animal o vegetal y el estudiante
// mete en ella las piezas que le corresponden (hay piezas que no van). Texto en borrador.

type Tipo = 'animal' | 'vegetal'
interface Pieza {
  id: string
  nombre: string
  en: Tipo[]
  explica: string
}

const PIEZAS: Pieza[] = [
  { id: 'membrana', nombre: 'Membrana', en: ['animal', 'vegetal'], explica: 'Toda célula tiene membrana: es su frontera.' },
  { id: 'nucleo', nombre: 'Núcleo', en: ['animal', 'vegetal'], explica: 'Las dos son eucariotas: guardan su ADN en un núcleo.' },
  { id: 'mito', nombre: 'Mitocondrias', en: ['animal', 'vegetal'], explica: 'Las plantas también tienen mitocondrias: sacan energía de la glucosa que fabrican.' },
  { id: 'ret', nombre: 'Retículo y ribosomas', en: ['animal', 'vegetal'], explica: 'Las dos fabrican proteínas.' },
  { id: 'golgi', nombre: 'Aparato de Golgi', en: ['animal', 'vegetal'], explica: 'Las dos empacan y reparten proteínas.' },
  { id: 'cloro', nombre: 'Cloroplastos', en: ['vegetal'], explica: 'Solo las células que hacen fotosíntesis, como las de la hoja.' },
  { id: 'pared', nombre: 'Pared celular', en: ['vegetal'], explica: 'La pared de celulosa es propia de las plantas; las animales tienen matriz extracelular.' },
  { id: 'vacuola', nombre: 'Vacuola central grande', en: ['vegetal'], explica: 'Una vacuola enorme llena de agua es típica de la planta; la animal tiene solo vacuolas pequeñas.' },
  { id: 'centriolos', nombre: 'Centriolos', en: ['animal'], explica: 'Típicos de la célula animal; la mayoría de las plantas con flores no los tiene.' },
  { id: 'liso', nombre: 'Lisosomas', en: ['animal'], explica: 'Son típicos de la célula animal; en las plantas, la vacuola hace buena parte de ese trabajo.' },
  { id: 'nucleoide', nombre: 'Nucleoide (ADN suelto)', en: [], explica: 'Es de las bacterias: las eucariotas tienen el ADN dentro del núcleo.' },
  { id: 'pared-bact', nombre: 'Pared de bacteria', en: [], explica: 'Las bacterias tienen una pared de otro material; la planta la tiene de celulosa.' },
]

const CLAVE = 'cien:arma-celula'

/** Dibujo de la célula con las piezas que el estudiante metió. */
function Celula({ tipo, dentro }: { tipo: Tipo; dentro: Set<string> }) {
  const veg = tipo === 'vegetal'
  const tiene = (id: string) => dentro.has(id)
  const forma = veg ? 'M 70 52 H 330 V 248 H 70 Z' : 'M 60 150 Q 58 70 130 54 Q 200 38 276 56 Q 344 76 340 154 Q 336 236 266 250 Q 190 264 124 248 Q 62 230 60 150 Z'
  return (
    <>
      {tiene('pared') && <rect x="58" y="40" width="284" height="220" fill="#cfe3a8" stroke="#5b8a3a" strokeWidth="6" />}
      {tiene('pared-bact') && <rect x="58" y="40" width="284" height="220" rx="60" fill="none" stroke="#8a6a3a" strokeWidth="6" strokeDasharray="10 6" />}
      <path d={forma} fill={tiene('membrana') ? '#f8e6dc' : '#fbf5ee'} stroke={tiene('membrana') ? '#b05a5a' : '#cbbfae'} strokeWidth={tiene('membrana') ? 4 : 2} strokeDasharray={tiene('membrana') ? undefined : '6 6'} />
      {tiene('vacuola') && <rect x="196" y="78" width="112" height="140" rx="40" fill="#cfe3f3" stroke="#5d84b8" strokeWidth="2.5" />}
      {tiene('nucleo') && (
        <g transform={veg ? 'translate(126 120)' : 'translate(180 140)'}>
          <Nucleo k={0.9} />
        </g>
      )}
      {tiene('nucleoide') && <path d="M 120 210 q 10 -16 20 0 t 20 0 t 20 0" fill="none" stroke="#7a4a8a" strokeWidth="3" />}
      {tiene('mito') && (
        <>
          <g transform="translate(110 220)"><Mito k={0.7} a={-20} /></g>
          <g transform={veg ? 'translate(170 222)' : 'translate(292 112)'}><Mito k={0.65} a={30} /></g>
        </>
      )}
      {tiene('ret') && <g transform={veg ? 'translate(120 74)' : 'translate(246 92)'}><RetRugoso k={0.7} /></g>}
      {tiene('golgi') && <g transform={veg ? 'translate(176 168)' : 'translate(264 196)'}><Golgi k={0.7} /></g>}
      {tiene('cloro') && [[232, 238], [314, 120], [96, 170]].map(([x, y]) => <g key={x} transform={`translate(${x} ${y})`}><Cloroplasto k={0.55} a={x} /></g>)}
      {tiene('liso') && [[208, 228], [120, 96]].map(([x, y]) => <g key={x} transform={`translate(${x} ${y})`}><Lisosoma k={0.9} /></g>)}
      {tiene('centriolos') && (
        <g transform="translate(228 180)" stroke="#6b4fa3" strokeWidth="6" strokeLinecap="round">
          <line x1="-10" y1="0" x2="10" y2="0" />
          <line x1="16" y1="-8" x2="16" y2="12" />
        </g>
      )}
    </>
  )
}

export default function ArmaCelula() {
  const [tipo, setTipo] = useState<Tipo>('animal')
  const [dentro, setDentro] = useState<Set<string>>(new Set())
  const [revisado, setRevisado] = useState(false)
  const [logros, setLogros] = useState<Record<Tipo, boolean>>(() => {
    try {
      return { animal: false, vegetal: false, ...JSON.parse(localStorage.getItem(CLAVE) ?? '{}') }
    } catch {
      return { animal: false, vegetal: false }
    }
  })
  const bien = (p: Pieza) => dentro.has(p.id) === p.en.includes(tipo)
  const malas = PIEZAS.filter((p) => !bien(p))
  const perfecta = malas.length === 0

  const cambiarTipo = (t: Tipo) => {
    setTipo(t)
    setDentro(new Set())
    setRevisado(false)
  }
  const alternar = (id: string) => {
    setDentro((d) => {
      const n = new Set(d)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
    setRevisado(false)
  }
  const comprobar = () => {
    setRevisado(true)
    if (perfecta && !logros[tipo]) {
      const n = { ...logros, [tipo]: true }
      setLogros(n)
      try {
        localStorage.setItem(CLAVE, JSON.stringify(n))
      } catch {
        /* sin almacenamiento */
      }
    }
  }

  // teclas 1–9 y 0, -, = alternan piezas; ← → cambian de célula
  const ref = useRef(alternar)
  ref.current = alternar
  useEffect(() => {
    const teclas = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=']
    const alTeclear = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return
      const k = teclas.indexOf(e.key)
      if (k >= 0 && k < PIEZAS.length) ref.current(PIEZAS[k].id)
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])
  useFlechas((dir) => {
    cambiarTipo(dir > 0 ? 'vegetal' : 'animal')
    return true
  })

  return (
    <PantallaCompleta conBoton>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold">Arma una célula:</span>
        {(['animal', 'vegetal'] as Tipo[]).map((t) => (
          <button key={t} type="button" aria-pressed={tipo === t} onClick={() => cambiarTipo(t)} className="min-h-10 rounded-full border border-[var(--acento)] px-4 text-sm font-semibold text-[var(--acento)] aria-pressed:bg-[var(--acento)] aria-pressed:text-[var(--sobre-acento)]">
            {t === 'animal' ? 'Animal' : 'Vegetal'} {logros[t] && '⭐'}
          </button>
        ))}
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="aspect-[4/3] max-h-[var(--alto-visor,38dvh)] w-full overflow-hidden rounded-xl border border-[var(--linea)]">
          <Lienzo etiqueta={`Célula ${tipo} con ${dentro.size} piezas`}>
            <Celula tipo={tipo} dentro={dentro} />
            {dentro.size === 0 && <T x={200} y={154} s={13}>Toca las piezas para meterlas en la célula</T>}
          </Lienzo>
        </div>
        <div aria-live="polite" className="rounded-xl bg-[var(--fondo)] p-3 text-sm">
          {!revisado ? (
            <>
              <p className="text-base font-bold">Célula {tipo}: {dentro.size} piezas</p>
              <p className="mt-1 text-[var(--suave)]">Mete solo lo que una célula {tipo} tiene. Ojo: hay piezas que no son de ninguna de las dos. Cuando creas que está lista, comprueba.</p>
            </>
          ) : perfecta ? (
            <>
              <p className="text-base font-bold">⭐ ¡Célula {tipo} completa!</p>
              <p className="mt-1">{tipo === 'animal' ? 'Ahora prueba con la vegetal: ¿qué cambia?' : 'Pared, cloroplastos y vacuola grande: lo propio de las plantas. Y también tiene mitocondrias.'}</p>
            </>
          ) : (
            <>
              <p className="font-semibold">{malas.length === 1 ? 'Hay 1 pieza por corregir:' : `Hay ${malas.length} piezas por corregir:`}</p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {malas.map((p) => (
                  <li key={p.id}>
                    <span className="font-semibold">{p.nombre} {dentro.has(p.id) ? 'sobra' : 'falta'}.</span> {p.explica}
                  </li>
                ))}
              </ul>
            </>
          )}
          <button type="button" data-principal onClick={comprobar} className="mt-3 min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-bold text-[var(--sobre-acento)]">
            Comprobar
          </button>
        </div>
      </div>
      <div role="group" aria-label="Piezas" className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {PIEZAS.map((p, k) => {
          const marca = revisado ? (bien(p) ? (dentro.has(p.id) ? 'border-green-700 dark:border-green-400' : '') : 'border-red-700 dark:border-red-400') : ''
          return (
            <button key={p.id} type="button" aria-pressed={dentro.has(p.id)} onClick={() => alternar(p.id)} className={`min-h-11 rounded-lg border-2 border-[var(--linea)] px-2 text-left text-sm font-semibold aria-pressed:bg-[var(--acento-suave)]/50 ${marca}`}>
              <span className="text-xs text-[var(--suave)]">{['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='][k]} · </span>
              {p.nombre}
            </button>
          )
        })}
      </div>
    </PantallaCompleta>
  )
}
