import { useEffect, useRef, useState } from 'react'
import PantallaCompleta from '../PantallaCompleta.tsx'
import { Lienzo } from '../ilustraciones/Dibujo.tsx'
import { CelulaAnimalCompleta, CelulaVegetalCompleta, PUNTOS_ANIMAL, PUNTOS_VEGETAL } from '../ilustraciones/CelulaEuc.tsx'
import { useFlechas } from '../../lib/flechasDiagrama.ts'

// Minijuego del tema 3: «Urgencias en la célula». Llega un caso (algo dejó de funcionar)
// y el estudiante toca en el dibujo el orgánulo que está fallando. Texto en borrador.

type Tipo = 'animal' | 'vegetal'
interface Caso {
  id: string
  tipo: Tipo
  sintoma: string
  falla: string
  explica: string
}

const CASOS: Caso[] = [
  { id: 'a-mito', tipo: 'animal', sintoma: 'Tiene glucosa y oxígeno de sobra, pero se quedó sin energía para trabajar.', falla: 'mito', explica: 'La mitocondria es la que saca la energía de la glucosa. Sin ella, el alimento no sirve de nada.' },
  { id: 'a-golgi', tipo: 'animal', sintoma: 'Fabrica proteínas, pero se quedan amontonadas: nadie las empaca ni las envía.', falla: 'golgi', explica: 'El aparato de Golgi termina, empaca y reparte las proteínas en vesículas.' },
  { id: 'a-ret', tipo: 'animal', sintoma: 'El núcleo manda las recetas, pero no se fabrica ninguna proteína nueva.', falla: 'ret', explica: 'Las proteínas se arman en los ribosomas, muchos de ellos pegados al retículo rugoso.' },
  { id: 'a-liso', tipo: 'animal', sintoma: 'Se llena de orgánulos viejos y restos que nadie digiere ni recicla.', falla: 'liso', explica: 'Los lisosomas digieren lo que sobra y devuelven las piezas para reutilizarlas.' },
  { id: 'a-membrana', tipo: 'animal', sintoma: 'Entra y sale cualquier cosa: ya no controla lo que pasa.', falla: 'membrana', explica: 'La membrana es la frontera: decide qué entra y qué sale.' },
  { id: 'a-nucleo', tipo: 'animal', sintoma: 'Perdió las instrucciones: no sabe qué proteínas fabricar y no puede dividirse.', falla: 'nucleo', explica: 'El núcleo guarda el ADN, donde están las instrucciones de la célula.' },
  { id: 'a-cito', tipo: 'animal', sintoma: 'Perdió su forma y los orgánulos ya no se mueven de un lado a otro.', falla: 'citoplasma', explica: 'El citoesqueleto, que está en el citoplasma, da forma a la célula y sirve de riel para mover cosas.' },
  { id: 'v-cloro', tipo: 'vegetal', sintoma: 'Tiene luz, agua y dióxido de carbono, pero no fabrica azúcar.', falla: 'cloro', explica: 'La fotosíntesis ocurre en los cloroplastos.' },
  { id: 'v-vacuola', tipo: 'vegetal', sintoma: 'Quedó floja, sin presión por dentro: la planta se marchita.', falla: 'vacuola', explica: 'La vacuola central llena de agua empuja hacia afuera y mantiene firme la célula.' },
  { id: 'v-pared', tipo: 'vegetal', sintoma: 'Perdió su caja rígida: se deforma y puede reventar si entra mucha agua.', falla: 'membrana', explica: 'La pared celular, por fuera de la membrana, da rigidez y protege a la célula vegetal.' },
  { id: 'v-mito', tipo: 'vegetal', sintoma: 'Es de noche. Tiene azúcar guardado, pero no logra sacarle la energía.', falla: 'mito', explica: 'Las plantas también tienen mitocondrias: el cloroplasto fabrica el azúcar y la mitocondria le saca la energía.' },
]

const RONDA = 8
const VIDAS = 3
const CLAVE = 'cien:urgencias-mejor'
/** «mito2» y «cloro2» son el mismo orgánulo que «mito» y «cloro» */
const llave = (id: string) => id.replace(/\d+$/, '')

function barajar<X>(a: X[]): X[] {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}
function leerMejor(): number {
  try {
    return Number(localStorage.getItem(CLAVE)) || 0
  } catch {
    return 0
  }
}

export default function CelulaUrgencias() {
  const [fase, setFase] = useState<'inicio' | 'juego' | 'fin'>('inicio')
  const [cola, setCola] = useState<Caso[]>([])
  const [i, setI] = useState(0)
  const [elegido, setElegido] = useState<string | null>(null)
  const [puntos, setPuntos] = useState(0)
  const [racha, setRacha] = useState(0)
  const [aciertos, setAciertos] = useState(0)
  const [vidas, setVidas] = useState(VIDAS)
  const [fallos, setFallos] = useState<Caso[]>([])
  const [mejor, setMejor] = useState(leerMejor)
  const caso: Caso | undefined = cola[i]
  const enJuego = fase === 'juego' && !!caso
  const puntosDibujo = caso?.tipo === 'vegetal' ? PUNTOS_VEGETAL : PUNTOS_ANIMAL
  const opciones = puntosDibujo.filter((p, k, a) => a.findIndex((q) => llave(q.id) === llave(p.id)) === k)
  const nombreDe = (c: Caso) => (c.tipo === 'vegetal' ? PUNTOS_VEGETAL : PUNTOS_ANIMAL).find((p) => p.id === c.falla)!.nombre

  const empezar = () => {
    setCola(barajar(CASOS).slice(0, RONDA))
    setI(0)
    setElegido(null)
    setPuntos(0)
    setRacha(0)
    setAciertos(0)
    setVidas(VIDAS)
    setFallos([])
    setFase('juego')
  }
  const responder = (id: string) => {
    if (!enJuego || elegido !== null) return
    const k = llave(id)
    setElegido(k)
    if (k === caso.falla) {
      setPuntos((p) => p + 10 + Math.min(racha, 5) * 2)
      setRacha((r) => r + 1)
      setAciertos((a) => a + 1)
    } else {
      setVidas((v) => v - 1)
      setRacha(0)
      setFallos((f) => [...f, caso])
    }
  }
  const ultimo = vidas <= 0 || i >= cola.length - 1
  const siguiente = () => {
    if (!enJuego || elegido === null) return
    if (ultimo) {
      setFase('fin')
      if (puntos > mejor) {
        setMejor(puntos)
        try {
          localStorage.setItem(CLAVE, String(puntos))
        } catch {
          /* sin almacenamiento: el récord dura solo esta sesión */
        }
      }
    } else {
      setI(i + 1)
      setElegido(null)
    }
  }

  // teclas 1–9 eligen el orgánulo de la lista; → pasa al siguiente caso
  const responderRef = useRef(responder)
  responderRef.current = responder
  const opcionesRef = useRef(opciones)
  opcionesRef.current = opciones
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return
      const n = Number(e.key)
      if (n >= 1 && n <= opcionesRef.current.length) responderRef.current(opcionesRef.current[n - 1].id)
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])
  useFlechas((dir) => {
    if (fase === 'inicio') return false
    if (fase === 'juego' && dir === 1) siguiente()
    return true
  })

  if (fase === 'inicio' || (fase === 'juego' && !caso)) {
    return (
      <PantallaCompleta conBoton>
        <h4 className="text-lg font-bold">Urgencias en la célula</h4>
        <p className="mt-1 text-sm">
          Van a llegar {RONDA} células con un problema. Lee qué les pasa y toca en el dibujo el orgánulo que está fallando. Algunas son animales y otras vegetales.
        </p>
        <p className="mt-3 text-sm">Tienes {VIDAS} vidas y cada acierto seguido suma más puntos. También puedes responder con las teclas 1 a 9 y pasar al siguiente caso con →.</p>
        <button type="button" data-principal onClick={empezar} className="mt-3 min-h-11 rounded-full bg-[var(--acento)] px-6 font-bold text-[var(--sobre-acento)]">
          Empezar
        </button>
        {mejor > 0 && <p className="mt-2 text-sm text-[var(--suave)]">Tu mejor puntaje: {mejor}</p>}
      </PantallaCompleta>
    )
  }

  if (fase === 'fin') {
    const total = aciertos + fallos.length
    return (
      <PantallaCompleta conBoton>
        <h4 className="text-lg font-bold">{vidas <= 0 ? 'Se acabaron las vidas' : '¡Turno terminado!'}</h4>
        <p aria-live="polite" className="mt-1 text-base">
          <span className="text-2xl font-bold">{puntos}</span> puntos · {aciertos} de {total} casos resueltos
          {puntos > 0 && puntos >= mejor ? ' · ¡es tu mejor puntaje!' : ` · tu mejor puntaje: ${mejor}`}
        </p>
        {fallos.length > 0 ? (
          <>
            <p className="mt-3 text-sm font-semibold">Para repasar:</p>
            <ul className="mt-1 space-y-2 text-sm">
              {fallos.map((f) => (
                <li key={f.id} className="rounded-xl bg-[var(--fondo)] p-2">
                  <span className="font-semibold">
                    «{f.sintoma}» → {nombreDe(f)}.
                  </span>{' '}
                  {f.explica}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-3 text-sm">Todos los casos resueltos. Juega otra vez: salen casos distintos.</p>
        )}
        <button type="button" data-principal onClick={empezar} className="mt-3 min-h-11 rounded-full bg-[var(--acento)] px-6 font-bold text-[var(--sobre-acento)]">
          Jugar otra vez
        </button>
      </PantallaCompleta>
    )
  }

  const c = caso!
  const acerto = elegido === c.falla
  const resalta = elegido !== null ? c.falla : undefined
  return (
    <PantallaCompleta conBoton>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold">
        <span>Caso {i + 1} de {cola.length}</span>
        <span>{puntos} puntos</span>
        {racha > 1 && <span>Racha ×{racha}</span>}
        <span aria-label={`${vidas} vidas`}>{'❤️'.repeat(Math.max(0, vidas))}{'🤍'.repeat(VIDAS - Math.max(0, vidas))}</span>
      </div>
      <div className="mt-2 grid gap-3 lg:grid-cols-2">
        <div className="aspect-[4/3] max-h-[var(--alto-visor,38dvh)] w-full overflow-hidden rounded-xl border border-[var(--linea)]">
          <Lienzo etiqueta={`Célula ${c.tipo}: toca el orgánulo que está fallando`}>
            {c.tipo === 'animal' ? <CelulaAnimalCompleta resalta={resalta} /> : <CelulaVegetalCompleta resalta={resalta} />}
            {puntosDibujo.map((p) => {
              const k = llave(p.id)
              const color = elegido === null ? 'transparent' : k === c.falla ? '#2e7d32' : k === elegido ? '#b3261e' : 'transparent'
              return (
                <circle
                  key={p.id}
                  cx={p.x}
                  cy={p.y}
                  r={p.r}
                  fill="transparent"
                  stroke={color}
                  strokeWidth="4"
                  aria-hidden="true"
                  style={{ cursor: elegido === null ? 'pointer' : 'default' }}
                  onClick={() => responder(p.id)}
                />
              )
            })}
          </Lienzo>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-red-800 dark:text-red-300">Urgencia · célula {c.tipo}</p>
          <p className="mt-1 text-lg font-bold">{c.sintoma}</p>
          <div aria-live="polite" className="mt-2 min-h-[5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
            {elegido === null ? (
              <p className="text-[var(--suave)]">¿Qué orgánulo está fallando? Tócalo en el dibujo o elígelo en la lista.</p>
            ) : (
              <>
                <p>
                  <span className="font-semibold">{acerto ? '¡Diagnóstico correcto!' : `Era: ${nombreDe(c)}.`}</span> {c.explica}
                </p>
                <button type="button" data-principal onClick={siguiente} className="mt-2 min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-bold text-[var(--sobre-acento)]">
                  {ultimo ? 'Ver resultado' : 'Siguiente caso ›'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <div role="group" aria-label="Orgánulos" className="mt-2 grid grid-cols-2 gap-2 lg:grid-cols-4">
        {opciones.map((p, n) => {
          const k = llave(p.id)
          const marca = elegido === null ? 'enabled:hover:border-[var(--acento)]' : k === c.falla ? 'border-green-700 dark:border-green-400 bg-[var(--acento-suave)]/40' : k === elegido ? 'border-red-700 dark:border-red-400' : 'opacity-60'
          return (
            <button key={p.id} type="button" disabled={elegido !== null} onClick={() => responder(p.id)} className={`min-h-10 rounded-lg border-2 border-[var(--linea)] px-2 py-1 text-left text-sm font-semibold ${marca}`}>
              {n + 1} · {p.nombre}
            </button>
          )
        })}
      </div>
    </PantallaCompleta>
  )
}
