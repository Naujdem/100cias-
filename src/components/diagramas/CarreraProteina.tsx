import { useEffect, useRef, useState } from 'react'
import PantallaCompleta from '../PantallaCompleta.tsx'
import { Lienzo, T } from '../ilustraciones/Dibujo.tsx'
import { Nucleo, Golgi, RetRugoso, Lisosoma } from '../ilustraciones/CelulaEuc.tsx'
import { useFlechas } from '../../lib/flechasDiagrama.ts'

// Minijuego del tema 3: «La carrera de la proteína». Cada proteína sale del núcleo como receta
// y hay que llevarla, parada por parada, hasta su destino. Cada error suma segundos. Texto en borrador.

type Parada = 'nucleo' | 'libre' | 'reticulo' | 'golgi' | 'membrana' | 'afuera' | 'lisosoma' | 'citosol'

const PARADAS: Record<Parada, { nombre: string; x: number; y: number }> = {
  nucleo: { nombre: 'Núcleo', x: 110, y: 150 },
  libre: { nombre: 'Ribosoma libre', x: 120, y: 244 },
  reticulo: { nombre: 'Retículo rugoso', x: 200, y: 92 },
  golgi: { nombre: 'Aparato de Golgi', x: 268, y: 170 },
  membrana: { nombre: 'Membrana (se queda allí)', x: 352, y: 92 },
  afuera: { nombre: 'Fuera de la célula', x: 384, y: 210 },
  lisosoma: { nombre: 'Lisosoma', x: 236, y: 244 },
  citosol: { nombre: 'Citosol (se queda allí)', x: 170, y: 200 },
}
/** Botones de respuesta, en este orden (teclas 1–7). El núcleo es solo la salida. */
const OPCIONES: Parada[] = ['libre', 'reticulo', 'golgi', 'membrana', 'afuera', 'lisosoma', 'citosol']

interface Proteina {
  id: string
  nombre: string
  pista: string
  ruta: Parada[]
  /** explicación de cada tramo, empezando por el que sale del núcleo */
  tramos: string[]
}

const PROTEINAS: Proteina[] = [
  { id: 'insulina', nombre: 'Insulina', pista: 'Una hormona que la célula del páncreas envía a la sangre.', ruta: ['nucleo', 'reticulo', 'golgi', 'afuera'], tramos: ['Va hacia afuera: la fabrica un ribosoma pegado al retículo.', 'Del retículo pasa al Golgi, que la termina y la empaca.', 'Una vesícula se une a la membrana y la suelta afuera.'] },
  { id: 'enzima-liso', nombre: 'Enzima digestiva', pista: 'Su trabajo es desarmar lo que la célula se come.', ruta: ['nucleo', 'reticulo', 'golgi', 'lisosoma'], tramos: ['Viaja en vesícula: empieza en un ribosoma del retículo.', 'El Golgi la etiqueta con su destino.', 'La etiqueta la manda al lisosoma.'] },
  { id: 'canal', nombre: 'Canal de agua', pista: 'Una proteína que deja pasar agua de un lado a otro de la membrana.', ruta: ['nucleo', 'reticulo', 'golgi', 'membrana'], tramos: ['Terminará en la membrana: entra al retículo mientras se fabrica.', 'El Golgi la empaca en una vesícula.', 'La vesícula se une a la membrana y el canal queda clavado en ella.'] },
  { id: 'actina', nombre: 'Actina', pista: 'Una pieza del citoesqueleto, que trabaja dentro del citoplasma.', ruta: ['nucleo', 'libre', 'citosol'], tramos: ['Se queda dentro: la fabrica un ribosoma libre.', 'No necesita retículo ni Golgi: trabaja ahí mismo, en el citosol.'] },
  { id: 'anticuerpo', nombre: 'Anticuerpo', pista: 'Lo fabrica un glóbulo blanco para soltarlo en la sangre y atrapar microbios.', ruta: ['nucleo', 'reticulo', 'golgi', 'afuera'], tramos: ['Sale de la célula: empieza en el retículo rugoso.', 'Pasa por el Golgi para terminarse.', 'Una vesícula lo suelta afuera.'] },
  { id: 'enzima-glucosa', nombre: 'Enzima de la glucólisis', pista: 'Ayuda a sacar energía de la glucosa en el citosol.', ruta: ['nucleo', 'libre', 'citosol'], tramos: ['Trabaja en el citosol: la fabrica un ribosoma libre.', 'Se queda en el citosol, donde ocurre la glucólisis.'] },
]

const RONDA = 4
const CASTIGO = 3
const CLAVE = 'cien:carrera-mejor'

function barajar<X>(a: X[]): X[] {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}
function leerMejor(): number | null {
  try {
    const v = Number(localStorage.getItem(CLAVE))
    return v > 0 ? v : null
  } catch {
    return null
  }
}

function Mapa({ hecho, actual, error }: { hecho: Parada[]; actual: Parada; error: Parada | null }) {
  const p = PARADAS[actual]
  return (
    <Lienzo etiqueta={`La proteína está en: ${PARADAS[actual].nombre}`}>
      <path d="M 40 150 Q 38 66 110 46 Q 190 22 280 44 Q 350 64 352 150 Q 350 240 270 258 Q 190 278 110 260 Q 44 244 40 150 Z" fill="#f8e6dc" stroke="#b05a5a" strokeWidth="5" />
      <g transform="translate(110 150)"><Nucleo k={0.9} /></g>
      <g transform="translate(200 92)"><RetRugoso k={0.9} /></g>
      <g transform="translate(268 170)"><Golgi k={0.85} /></g>
      <g transform="translate(236 244)"><Lisosoma k={1.1} /></g>
      <circle cx="120" cy="244" r="7" fill="#8a5a2b" />
      <circle cx="126" cy="238" r="5" fill="#b07a45" />
      {hecho.slice(1).map((h, k) => {
        const a = PARADAS[hecho[k]]
        const b = PARADAS[h]
        return <line key={k} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#0f766e" strokeWidth="3" strokeDasharray="6 4" />
      })}
      {error && <circle cx={PARADAS[error].x} cy={PARADAS[error].y} r="18" fill="none" stroke="#b3261e" strokeWidth="4" />}
      <g style={{ transform: `translate(${p.x}px, ${p.y}px)`, transition: 'transform 0.6s ease' }} className="motion-reduce:!transition-none">
        <circle r="11" fill="#e0a030" stroke="#7a4a10" strokeWidth="2.5" />
        <T x={0} y={4} s={10} b>P</T>
      </g>
      <T x={384} y={238} s={10.5}>afuera</T>
    </Lienzo>
  )
}

export default function CarreraProteina() {
  const [fase, setFase] = useState<'inicio' | 'juego' | 'fin'>('inicio')
  const [cola, setCola] = useState<Proteina[]>([])
  const [i, setI] = useState(0)
  const [hecho, setHecho] = useState<Parada[]>(['nucleo'])
  const [error, setError] = useState<Parada | null>(null)
  const [nota, setNota] = useState('')
  const [seg, setSeg] = useState(0)
  const [errores, setErrores] = useState(0)
  const [mejor, setMejor] = useState(leerMejor)
  const prot: Proteina | undefined = cola[i]
  const llego = !!prot && hecho.length === prot.ruta.length
  const corriendo = fase === 'juego' && !!prot && !llego
  const total = seg + errores * CASTIGO

  useEffect(() => {
    if (!corriendo) return
    const t = setInterval(() => setSeg((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [corriendo])

  const empezar = () => {
    setCola(barajar(PROTEINAS).slice(0, RONDA))
    setI(0)
    setHecho(['nucleo'])
    setError(null)
    setNota('')
    setSeg(0)
    setErrores(0)
    setFase('juego')
  }
  const elegir = (p: Parada) => {
    if (!corriendo || !prot) return
    const siguiente = prot.ruta[hecho.length]
    if (p === siguiente) {
      setNota(prot.tramos[hecho.length - 1])
      setHecho((h) => [...h, p])
      setError(null)
    } else {
      setErrores((e) => e + 1)
      setError(p)
      setNota(`Por ahí no: +${CASTIGO} segundos. Piensa adónde tiene que llegar al final.`)
    }
  }
  const pasar = () => {
    if (fase !== 'juego' || !llego) return
    if (i >= cola.length - 1) {
      setFase('fin')
      if (mejor === null || total < mejor) {
        setMejor(total)
        try {
          localStorage.setItem(CLAVE, String(total))
        } catch {
          /* sin almacenamiento */
        }
      }
    } else {
      setI(i + 1)
      setHecho(['nucleo'])
      setError(null)
      setNota('')
    }
  }

  const ref = useRef(elegir)
  ref.current = elegir
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return
      const n = Number(e.key)
      if (n >= 1 && n <= OPCIONES.length) ref.current(OPCIONES[n - 1])
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])
  useFlechas((dir) => {
    if (fase === 'inicio') return false
    if (dir === 1) pasar()
    return true
  })

  if (fase === 'inicio' || (fase === 'juego' && !prot)) {
    return (
      <PantallaCompleta conBoton>
        <h4 className="text-lg font-bold">La carrera de la proteína</h4>
        <p className="mt-1 text-sm">
          Van a salir {RONDA} proteínas del núcleo, cada una con un destino distinto. Llévalas parada por parada lo más rápido que puedas. Cada parada equivocada suma {CASTIGO} segundos.
        </p>
        <p className="mt-3 text-sm">Teclas: 1 a {OPCIONES.length} eligen la siguiente parada y → pasa a la siguiente proteína.</p>
        <button type="button" data-principal onClick={empezar} className="mt-3 min-h-11 rounded-full bg-[var(--acento)] px-6 font-bold text-white">
          ¡Arranca!
        </button>
        {mejor !== null && <p className="mt-2 text-sm text-[var(--suave)]">Tu mejor tiempo: {mejor} s</p>}
      </PantallaCompleta>
    )
  }

  if (fase === 'fin') {
    return (
      <PantallaCompleta conBoton>
        <h4 className="text-lg font-bold">¡Todas entregadas!</h4>
        <p aria-live="polite" className="mt-1 text-base">
          <span className="text-2xl font-bold">{total} s</span> · {seg} s de carrera + {errores} {errores === 1 ? 'error' : 'errores'} × {CASTIGO} s
          {mejor !== null && total <= mejor ? ' · ¡es tu mejor tiempo!' : mejor !== null ? ` · tu mejor tiempo: ${mejor} s` : ''}
        </p>
        <p className="mt-3 text-sm">Regla para recordar: si la proteína se queda en el citosol, la hace un ribosoma libre. Si va a la membrana, al lisosoma o hacia afuera, pasa por el retículo y el Golgi.</p>
        <button type="button" data-principal onClick={empezar} className="mt-3 min-h-11 rounded-full bg-[var(--acento)] px-6 font-bold text-white">
          Correr otra vez
        </button>
      </PantallaCompleta>
    )
  }

  const p = prot!
  return (
    <PantallaCompleta conBoton>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold">
        <span>Proteína {i + 1} de {cola.length}</span>
        <span>⏱ {total} s</span>
        {errores > 0 && <span className="text-red-800">{errores} {errores === 1 ? 'error' : 'errores'}</span>}
      </div>
      <div className="mt-2 grid gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="aspect-[4/3] max-h-[var(--alto-visor,38dvh)] w-full overflow-hidden rounded-xl border border-[var(--linea)]">
          <Mapa hecho={hecho} actual={hecho[hecho.length - 1]} error={error} />
        </div>
        <div aria-live="polite" className="rounded-xl bg-[var(--fondo)] p-3 text-sm">
          <p className="text-lg font-bold">{p.nombre}</p>
          <p className="mt-1">{p.pista}</p>
          <p className="mt-2 font-semibold">{llego ? '¡Llegó a su destino!' : `Está en: ${PARADAS[hecho[hecho.length - 1]].nombre}. ¿Adónde va ahora?`}</p>
          {nota && <p className={`mt-1 ${error ? 'text-red-800' : ''}`}>{nota}</p>}
          {llego && (
            <button type="button" data-principal onClick={pasar} className="mt-2 min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-bold text-white">
              {i >= cola.length - 1 ? 'Ver tiempo' : 'Siguiente proteína ›'}
            </button>
          )}
        </div>
      </div>
      <div role="group" aria-label="Siguiente parada" className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {OPCIONES.map((o, k) => (
          <button key={o} type="button" disabled={llego} onClick={() => elegir(o)} className={`min-h-12 rounded-lg border-2 px-2 text-left text-sm font-semibold disabled:opacity-50 ${error === o ? 'border-red-700' : hecho.includes(o) ? 'border-green-700 bg-[var(--acento-suave)]/40' : 'border-[var(--linea)] enabled:hover:border-[var(--acento)]'}`}>
            <span className="text-xs text-[var(--suave)]">{k + 1} · </span>
            {PARADAS[o].nombre}
          </button>
        ))}
      </div>
    </PantallaCompleta>
  )
}
