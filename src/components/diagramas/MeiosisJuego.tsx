import { useEffect, useRef, useState } from 'react'
import PantallaCompleta from '../PantallaCompleta.tsx'
import CelulaMeiosis, { ETAPAS_MEIOSIS } from '../ilustraciones/CelulaMeiosis.tsx'
import type { EtapaMeiosis } from '../ilustraciones/CelulaMeiosis.tsx'
import { Pestanas } from './TiposCelulas.tsx'
import { useFlechas } from '../../lib/flechasDiagrama.ts'

// Minijuego del 4.2: «¿Mitosis o meiosis?» (clasificar casos, teclas 1–3) y «Ordena la meiosis» (tocar las 8 etapas en orden).

type Resp = 0 | 1 | 2
const OPC = ['Mitosis', 'Meiosis', 'Las dos']
const CASOS: { texto: string; r: Resp; por: string }[] = [
  { texto: 'Se te cierra una herida en la rodilla.', r: 0, por: 'Reparar tejidos necesita células iguales: mitosis.' },
  { texto: 'Se forman espermatozoides en los testículos.', r: 1, por: 'Los gametos se forman por meiosis.' },
  { texto: 'Se forman óvulos en los ovarios.', r: 1, por: 'Los gametos se forman por meiosis.' },
  { texto: 'Un bebé crece de 3 a 10 kilos.', r: 0, por: 'Crecer es sumar células iguales: mitosis.' },
  { texto: 'Resultan cuatro células con la mitad de los cromosomas.', r: 1, por: 'Dos divisiones seguidas, de 2n a n.' },
  { texto: 'Resultan dos células idénticas a la madre.', r: 0, por: 'La mitosis hace copias.' },
  { texto: 'Los cromosomas homólogos se aparean e intercambian trozos.', r: 1, por: 'Ocurre en la profase I de la meiosis.' },
  { texto: 'Antes de empezar, la célula copia su ADN.', r: 2, por: 'Las dos empiezan con el ADN ya copiado (fase S).' },
  { texto: 'En algún momento se separan las cromátidas hermanas.', r: 2, por: 'En la anafase de la mitosis y en la anafase II de la meiosis.' },
  { texto: 'La punta de una raíz de cebolla se alarga.', r: 0, por: 'Las raíces crecen por mitosis en su punta.' },
  { texto: 'Una flor forma los granos de polen.', r: 1, por: 'En las plantas también hay meiosis antes de formar polen y óvulos.' },
  { texto: 'Los cromosomas se alinean en el centro sobre las fibras del huso.', r: 2, por: 'En ambas hay metafase y huso.' },
  { texto: 'Hay dos divisiones seguidas sin copiar el ADN entre ellas.', r: 1, por: 'Meiosis I y meiosis II.' },
  { texto: 'Cada día se renueva la piel que se desprende.', r: 0, por: 'Reemplazar células es trabajo de la mitosis.' },
]
const RONDA = 10
const CLAVE = 'cien:meiosis-mejor'

function barajar<X>(a: X[]): X[] {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}

function Clasifica() {
  const [cola, setCola] = useState(() => barajar(CASOS).slice(0, RONDA))
  const [i, setI] = useState(0)
  const [elegida, setElegida] = useState<Resp | null>(null)
  const [aciertos, setAciertos] = useState(0)
  const [fallados, setFallados] = useState<string[]>([])
  const [fin, setFin] = useState(false)
  const [mejor, setMejor] = useState(() => {
    try {
      return Number(localStorage.getItem(CLAVE)) || 0
    } catch {
      return 0
    }
  })
  const c = cola[i]
  const responder = (n: Resp) => {
    if (fin || elegida !== null) return
    setElegida(n)
    if (n === c.r) setAciertos((a) => a + 1)
    else setFallados((f) => [...f, c.texto])
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
    setCola(barajar(CASOS).slice(0, RONDA))
    setI(0)
    setElegida(null)
    setAciertos(0)
    setFallados([])
    setFin(false)
  }
  const ref = useRef(responder)
  ref.current = responder
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const n = Number(e.key)
      if (n >= 1 && n <= 3) ref.current((n - 1) as Resp)
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
          {aciertos} de {cola.length}
          {aciertos >= mejor && aciertos > 0 ? ' · ¡tu mejor marca!' : ` · tu mejor marca: ${mejor}`}
        </p>
        {fallados.length > 0 && (
          <div className="mt-2 text-sm">
            <p className="font-semibold">Para repasar:</p>
            <ul className="list-disc pl-5">
              {fallados.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        )}
        <p className="mt-2 text-sm">Pista general: si el resultado son células iguales para crecer o reparar, es mitosis; si son gametos con la mitad de cromosomas, es meiosis.</p>
        <button type="button" data-principal onClick={otraVez} className="mt-3 min-h-11 rounded-full bg-[var(--acento)] px-6 font-bold text-[var(--sobre-acento)]">
          Jugar otra vez
        </button>
      </div>
    )
  }
  return (
    <>
      <p className="text-sm font-semibold">
        Caso {i + 1} de {cola.length} · {aciertos} aciertos
      </p>
      <div className="mt-2 rounded-xl border-2 border-[var(--linea)] p-4 text-center text-xl font-semibold">{c.texto}</div>
      <div role="group" aria-label="Respuestas" className="mt-3 grid grid-cols-3 gap-2">
        {OPC.map((o, n) => (
          <button key={o} type="button" disabled={elegida !== null} onClick={() => responder(n as Resp)} className={`min-h-12 rounded-lg border-2 px-2 text-base font-semibold ${elegida === null ? 'border-[var(--linea)] hover:border-[var(--acento)]' : n === c.r ? 'border-green-700 bg-[var(--acento-suave)]/40 dark:border-green-400' : n === elegida ? 'border-red-700 dark:border-red-400' : 'border-[var(--linea)] opacity-60'}`}>
            {n + 1} · {o}
          </button>
        ))}
      </div>
      <div aria-live="polite" className="mt-3 min-h-[3.5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
        {elegida === null ? (
          <p className="text-[var(--suave)]">¿Qué división es? Elige con un toque o con las teclas 1 a 3.</p>
        ) : (
          <>
            <p>
              <span className="font-semibold">{elegida === c.r ? '¡Correcto!' : `Era: ${OPC[c.r].toLowerCase()}.`}</span> {c.por}
            </p>
            <button type="button" data-principal onClick={siguiente} className="mt-2 min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-bold text-[var(--sobre-acento)]">
              {i >= cola.length - 1 ? 'Ver resultado' : 'Siguiente ›'}
            </button>
          </>
        )}
      </div>
    </>
  )
}

const TODAS = [0, 1, 2, 3, 4, 5, 6, 7] as EtapaMeiosis[]
const PISTAS = [
  'el núcleo está entero y no se ven cromosomas',
  'los homólogos se juntan en pares',
  'los pares se alinean en el centro, uno a cada lado',
  'los homólogos, todavía en X, viajan a los extremos',
  'quedan dos células con cromosomas en X',
  'en cada célula los cromosomas se alinean otra vez',
  'las cromátidas sueltas viajan a los extremos',
  'cuatro células pequeñas',
]

function Ordena() {
  const [orden, setOrden] = useState(() => barajar(TODAS))
  const [hechas, setHechas] = useState<EtapaMeiosis[]>([])
  const [error, setError] = useState<EtapaMeiosis | null>(null)
  const [fallos, setFallos] = useState(0)
  const listo = hechas.length === 8
  const tocar = (e: EtapaMeiosis) => {
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
    setOrden(barajar(TODAS))
    setHechas([])
    setError(null)
    setFallos(0)
  }
  return (
    <>
      <p className="text-sm">Toca los dibujos en el orden en que ocurren, de la primera etapa a la última.</p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {orden.map((e) => {
          const pos = hechas.indexOf(e)
          return (
            <button key={e} type="button" onClick={() => tocar(e)} aria-label={pos >= 0 ? `${pos + 1}: ${ETAPAS_MEIOSIS[e]}` : 'Dibujo sin ordenar'} className={`relative aspect-[4/3] overflow-hidden rounded-xl border-4 ${pos >= 0 ? 'border-green-700 dark:border-green-400' : error === e ? 'border-red-700 dark:border-red-400' : 'border-[var(--linea)] hover:border-[var(--acento)]'}`}>
              <CelulaMeiosis etapa={e} />
              {pos >= 0 && <span className="absolute left-1 top-1 rounded-full bg-green-700 px-2 text-xs font-bold text-white">{pos + 1} · {ETAPAS_MEIOSIS[e]}</span>}
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
          <p>Esa no va todavía. Pista para la siguiente: {PISTAS[hechas.length]}.</p>
        ) : (
          <p className="text-[var(--suave)]">Van {hechas.length} de 8.</p>
        )}
      </div>
    </>
  )
}

export default function MeiosisJuego({ inicial = 'clasifica' }: { inicial?: 'clasifica' | 'ordena' }) {
  const [modo, setModo] = useState<'clasifica' | 'ordena'>(inicial)
  return (
    <PantallaCompleta conBoton>
      <Pestanas valor={modo} opciones={[['clasifica', '¿Mitosis o meiosis?'], ['ordena', 'Ordena la meiosis']]} onCambio={setModo} etiqueta="Juego de la meiosis" />
      <div className="mt-2">{modo === 'clasifica' ? <Clasifica /> : <Ordena />}</div>
    </PantallaCompleta>
  )
}
