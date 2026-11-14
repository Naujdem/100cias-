import { useEffect, useRef, useState } from 'react'
import PantallaCompleta from '../PantallaCompleta.tsx'
import CelulaDividiendo from '../ilustraciones/CelulaDividiendo.tsx'
import { Pestanas } from './TiposCelulas.tsx'
import { useFlechas } from '../../lib/flechasDiagrama.ts'

// Minijuego del 4.1: «¿En qué fase está?» (reconocer la fase en un dibujo girado al azar)
// y «Ordénalas» (tocar las cinco fases en orden). Reutiliza el dibujo de la división del 1.1.

type Etapa = 0 | 1 | 2 | 3 | 4
const FASES: { nombre: string; pista: string }[] = [
  { nombre: 'Interfase', pista: 'Núcleo entero; los cromosomas no se ven.' },
  { nombre: 'Profase', pista: 'Aparecen los cromosomas y el núcleo se deshace.' },
  { nombre: 'Metafase', pista: 'Cromosomas en fila, en el centro.' },
  { nombre: 'Anafase', pista: 'Las copias viajan a los extremos.' },
  { nombre: 'Telofase y citocinesis', pista: 'Dos núcleos y la célula se parte.' },
]
const RONDA = 10
const CLAVE = 'cien:fases-mejor'

function barajar<X>(a: X[]): X[] {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}
const nuevaCola = () =>
  Array.from({ length: RONDA }, (_, k) => ({ etapa: (k < 5 ? k : Math.floor(Math.random() * 5)) as Etapa, giro: Math.floor(Math.random() * 8) * 45, espejo: Math.random() < 0.5 })).sort(() => Math.random() - 0.5)

function Dibujo({ etapa, giro = 0, espejo = false }: { etapa: Etapa; giro?: number; espejo?: boolean }) {
  return (
    <div aria-hidden="true" className="h-full w-full bg-[#f3e7ef]">
      <div className="h-full w-full" style={{ transform: `rotate(${giro}deg) scale(${giro % 90 ? 0.82 : 1}) scaleX(${espejo ? -1 : 1})` }}>
        <CelulaDividiendo etapa={etapa} />
      </div>
    </div>
  )
}

function Reconoce() {
  const [cola, setCola] = useState(nuevaCola)
  const [i, setI] = useState(0)
  const [elegida, setElegida] = useState<number | null>(null)
  const [aciertos, setAciertos] = useState(0)
  const [fin, setFin] = useState(false)
  const [mejor, setMejor] = useState(() => {
    try {
      return Number(localStorage.getItem(CLAVE)) || 0
    } catch {
      return 0
    }
  })
  const c = cola[i]
  const responder = (n: number) => {
    if (fin || elegida !== null) return
    setElegida(n)
    if (n === c.etapa) setAciertos((a) => a + 1)
  }
  const siguiente = () => {
    if (elegida === null || fin) return
    if (i >= cola.length - 1) {
      setFin(true)
      if (aciertos > mejor) {
        setMejor(aciertos)
        try {
          localStorage.setItem(CLAVE, String(aciertos))
        } catch {
          /* sin almacenamiento */
        }
      }
    } else {
      setI(i + 1)
      setElegida(null)
    }
  }
  const otraVez = () => {
    setCola(nuevaCola())
    setI(0)
    setElegida(null)
    setAciertos(0)
    setFin(false)
  }
  const ref = useRef(responder)
  ref.current = responder
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const n = Number(e.key)
      if (n >= 1 && n <= 5) ref.current(n - 1)
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])
  useFlechas((dir) => {
    if (dir === 1) siguiente()
    return true
  })

  if (fin) {
    return (
      <div aria-live="polite">
        <p className="text-lg font-bold">
          {aciertos} de {cola.length} fases reconocidas{aciertos >= mejor && aciertos > 0 ? ' · ¡tu mejor marca!' : ` · tu mejor marca: ${mejor}`}
        </p>
        <p className="mt-1 text-sm">Al microscopio las células salen giradas y en cualquier posición, como aquí: fíjate en los cromosomas, no en hacia dónde apunta la célula.</p>
        <button type="button" data-principal onClick={otraVez} className="mt-3 min-h-11 rounded-full bg-[var(--acento)] px-6 font-bold text-[var(--sobre-acento)]">
          Jugar otra vez
        </button>
      </div>
    )
  }
  return (
    <>
      <p className="text-sm font-semibold">Célula {i + 1} de {cola.length} · {aciertos} aciertos</p>
      <div className="mt-2 grid gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="aspect-[4/3] max-h-[var(--alto-visor,38dvh)] w-full overflow-hidden rounded-xl border border-[var(--linea)]" role="img" aria-label="Una célula en alguna fase de la división">
          <Dibujo key={i} etapa={c.etapa} giro={c.giro} espejo={c.espejo} />
        </div>
        <div aria-live="polite" className="rounded-xl bg-[var(--fondo)] p-3 text-sm">
          {elegida === null ? (
            <p className="text-[var(--suave)]">¿En qué fase está esta célula? Elige con un toque o con las teclas 1 a 5.</p>
          ) : (
            <>
              <p>
                <span className="font-semibold">{elegida === c.etapa ? '¡Correcto!' : `Era ${FASES[c.etapa].nombre.toLowerCase()}.`}</span> {FASES[c.etapa].pista}
              </p>
              <button type="button" data-principal onClick={siguiente} className="mt-2 min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-bold text-[var(--sobre-acento)]">
                {i >= cola.length - 1 ? 'Ver resultado' : 'Siguiente ›'}
              </button>
            </>
          )}
        </div>
      </div>
      <div role="group" aria-label="Fases" className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-5">
        {FASES.map((f, n) => (
          <button key={f.nombre} type="button" disabled={elegida !== null} onClick={() => responder(n)} className={`min-h-11 rounded-lg border-2 px-2 text-left text-sm font-semibold ${elegida === null ? 'border-[var(--linea)] hover:border-[var(--acento)]' : n === c.etapa ? 'border-green-700 dark:border-green-400 bg-[var(--acento-suave)]/40' : n === elegida ? 'border-red-700 dark:border-red-400' : 'border-[var(--linea)] opacity-60'}`}>
            {n + 1} · {f.nombre}
          </button>
        ))}
      </div>
    </>
  )
}

function Ordena() {
  const [orden, setOrden] = useState<Etapa[]>(() => barajar([0, 1, 2, 3, 4] as Etapa[]))
  const [hechas, setHechas] = useState<Etapa[]>([])
  const [error, setError] = useState<Etapa | null>(null)
  const [fallos, setFallos] = useState(0)
  const listo = hechas.length === 5
  const tocar = (e: Etapa) => {
    if (listo || hechas.includes(e)) return
    if (e === hechas.length) {
      setHechas([...hechas, e])
      setError(null)
    } else {
      setError(e)
      setFallos((f) => f + 1)
    }
  }
  const otraVez = () => {
    setOrden(barajar([0, 1, 2, 3, 4] as Etapa[]))
    setHechas([])
    setError(null)
    setFallos(0)
  }
  return (
    <>
      <p className="text-sm">Toca las células en el orden en que ocurren, de la primera a la última.</p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {orden.map((e) => {
          const pos = hechas.indexOf(e)
          return (
            <button key={e} type="button" onClick={() => tocar(e)} aria-label={pos >= 0 ? `${pos + 1}: ${FASES[e].nombre}` : 'Célula sin ordenar'} className={`relative aspect-[4/3] overflow-hidden rounded-xl border-4 ${pos >= 0 ? 'border-green-700 dark:border-green-400' : error === e ? 'border-red-700 dark:border-red-400' : 'border-[var(--linea)] hover:border-[var(--acento)]'}`}>
              <Dibujo etapa={e} />
              {pos >= 0 && <span className="absolute left-1 top-1 rounded-full bg-green-700 px-2 text-sm font-bold text-white">{pos + 1} · {FASES[e].nombre}</span>}
            </button>
          )
        })}
      </div>
      <div aria-live="polite" className="mt-3 min-h-[3rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
        {listo ? (
          <>
            <p className="font-semibold">{fallos === 0 ? '¡Perfecto, sin errores!' : `¡Ordenadas! Con ${fallos} ${fallos === 1 ? 'error' : 'errores'}.`}</p>
            <button type="button" data-principal onClick={otraVez} className="mt-2 min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-bold text-[var(--sobre-acento)]">
              Otra vez
            </button>
          </>
        ) : error !== null ? (
          <p>Esa no va todavía. Pista para la siguiente: {FASES[hechas.length].pista.toLowerCase()}</p>
        ) : (
          <p className="text-[var(--suave)]">Van {hechas.length} de 5.</p>
        )}
      </div>
    </>
  )
}

export default function FasesMitosis() {
  const [modo, setModo] = useState<'reconoce' | 'ordena'>('reconoce')
  return (
    <PantallaCompleta conBoton>
      <Pestanas valor={modo} opciones={[['reconoce', '¿En qué fase está?'], ['ordena', 'Ordénalas']]} onCambio={setModo} etiqueta="Juego de las fases" />
      <div className="mt-2">{modo === 'reconoce' ? <Reconoce /> : <Ordena />}</div>
    </PantallaCompleta>
  )
}
