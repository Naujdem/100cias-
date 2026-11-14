import { useEffect, useRef, useState } from 'react'
import PantallaCompleta from '../PantallaCompleta.tsx'
import { useFlechas } from '../../lib/flechasDiagrama.ts'

// Motor de minijuego «decide rápido»: sale una tarjeta y hay que elegir la opción correcta antes
// de que se acabe el tiempo. 3 vidas, racha y mejor puntaje. Teclas 1–4 responden, → sigue.
// Cada juego concreto solo aporta datos (ver JuegosDecide.tsx).

export interface OpcionDecide {
  id: string
  nombre: string
  icono: string
}
export interface CartaDecide {
  icono: string
  nombre: string
  pista?: string
  correcta: string
  explica: string
}
export interface JuegoDecideProps {
  titulo: string
  pregunta: string
  instrucciones: string
  opciones: OpcionDecide[]
  cartas: CartaDecide[]
  clave: string
  ronda?: number
  tiempo?: number
  cierre: string
}

const VIDAS = 3

function barajar<X>(a: X[]): X[] {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}
function leer(clave: string): number {
  try {
    return Number(localStorage.getItem(clave)) || 0
  } catch {
    return 0
  }
}

export default function JuegoDecide({ titulo, pregunta, instrucciones, opciones, cartas, clave, ronda = 8, tiempo = 10, cierre }: JuegoDecideProps) {
  const [fase, setFase] = useState<'inicio' | 'juego' | 'fin'>('inicio')
  const [cola, setCola] = useState<CartaDecide[]>([])
  const [i, setI] = useState(0)
  const [elegida, setElegida] = useState<string | null>(null) // '' = se acabó el tiempo
  const [resta, setResta] = useState(tiempo)
  const [vidas, setVidas] = useState(VIDAS)
  const [puntos, setPuntos] = useState(0)
  const [racha, setRacha] = useState(0)
  const [mejor, setMejor] = useState(() => leer(clave))
  const carta = cola[i]
  const respondida = elegida !== null
  const acierto = respondida && carta && elegida === carta.correcta

  useEffect(() => {
    if (fase !== 'juego' || respondida) return
    if (resta <= 0) {
      setElegida('')
      setVidas((v) => v - 1)
      setRacha(0)
      return
    }
    const t = setTimeout(() => setResta((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [fase, respondida, resta])

  const empezar = () => {
    setCola(barajar(cartas).slice(0, ronda))
    setI(0)
    setElegida(null)
    setResta(tiempo)
    setVidas(VIDAS)
    setPuntos(0)
    setRacha(0)
    setFase('juego')
  }
  const responder = (id: string) => {
    if (fase !== 'juego' || respondida || !carta) return
    setElegida(id)
    if (id === carta.correcta) {
      setPuntos((p) => p + 1 + Math.min(racha, 3))
      setRacha((r) => r + 1)
    } else {
      setVidas((v) => v - 1)
      setRacha(0)
    }
  }
  const terminar = () => {
    setFase('fin')
    if (puntos > mejor) {
      setMejor(puntos)
      try {
        localStorage.setItem(clave, String(puntos))
      } catch {
        /* sin almacenamiento */
      }
    }
  }
  const seguir = () => {
    if (fase !== 'juego' || !respondida) return
    if (vidas <= 0 || i >= cola.length - 1) return terminar()
    setI(i + 1)
    setElegida(null)
    setResta(tiempo)
  }

  const ref = useRef(responder)
  ref.current = responder
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const n = Number(e.key)
      if (n >= 1 && n <= opciones.length) ref.current(opciones[n - 1].id)
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [opciones])
  useFlechas((dir) => {
    if (fase !== 'juego') return false
    if (dir === 1) seguir()
    return true
  })

  const boton = 'mt-3 min-h-11 rounded-full bg-[var(--acento)] px-6 font-bold text-[var(--sobre-acento)]'
  if (fase === 'inicio' || !carta) {
    return (
      <PantallaCompleta conBoton>
        <h4 className="text-lg font-bold">{titulo}</h4>
        <p className="mt-1 text-sm">{instrucciones}</p>
        <p className="mt-2 text-sm">{ronda} tarjetas · {tiempo} s cada una · {VIDAS} vidas · las rachas dan puntos extra. Teclas 1 a {opciones.length} para responder y → para seguir.</p>
        <button type="button" data-principal onClick={empezar} className={boton}>¡Arranca!</button>
        {mejor > 0 && <p className="mt-2 text-sm text-[var(--suave)]">Tu mejor puntaje: {mejor}</p>}
      </PantallaCompleta>
    )
  }
  if (fase === 'fin') {
    return (
      <PantallaCompleta conBoton>
        <h4 className="text-lg font-bold">{vidas <= 0 ? 'Sin vidas' : '¡Ronda completa!'}</h4>
        <p aria-live="polite" className="mt-1 text-base">
          <span className="text-2xl font-bold">{puntos} puntos</span>
          {puntos >= mejor && puntos > 0 ? ' · ¡es tu mejor puntaje!' : mejor > 0 ? ` · tu mejor: ${mejor}` : ''}
        </p>
        <p className="mt-3 text-sm">{cierre}</p>
        <button type="button" data-principal onClick={empezar} className={boton}>Jugar otra vez</button>
      </PantallaCompleta>
    )
  }

  return (
    <PantallaCompleta conBoton>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold">
        <span>Tarjeta {i + 1} de {cola.length}</span>
        <span aria-label={`${vidas} vidas`}>{'❤️'.repeat(Math.max(vidas, 0))}{'🤍'.repeat(VIDAS - Math.max(vidas, 0))}</span>
        <span>{puntos} pts</span>
        {racha >= 2 && <span className="text-[var(--acento)]">racha ×{racha}</span>}
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--linea)]">
        <div className="h-full bg-[var(--acento)] transition-[width] duration-1000 ease-linear" style={{ width: `${respondida ? 0 : (resta / tiempo) * 100}%` }} />
      </div>
      <div className="mt-3 grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div className={`rounded-2xl border-2 p-5 text-center transition-colors ${!respondida ? 'border-[var(--linea)]' : acierto ? 'border-green-700 dark:border-green-400' : 'border-red-700 dark:border-red-400'}`}>
          <p className="text-6xl" aria-hidden>{carta.icono}</p>
          <p className="mt-2 text-xl font-bold">{carta.nombre}</p>
          {carta.pista && <p className="mt-1 text-sm text-[var(--suave)]">{carta.pista}</p>}
        </div>
        <div aria-live="polite">
          <p className="font-semibold">{pregunta}</p>
          {respondida && (
            <div className="mt-2 rounded-xl bg-[var(--fondo)] p-3 text-sm">
              <p className="font-bold">{acierto ? '¡Bien!' : elegida === '' ? '¡Se acabó el tiempo!' : 'No era esa.'} {!acierto && `Era: ${opciones.find((o) => o.id === carta.correcta)?.nombre}.`}</p>
              <p className="mt-1">{carta.explica}</p>
              <button type="button" data-principal onClick={seguir} className="mt-2 min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-bold text-[var(--sobre-acento)]">
                {vidas <= 0 || i >= cola.length - 1 ? 'Ver puntaje' : 'Siguiente ›'}
              </button>
            </div>
          )}
        </div>
      </div>
      <div role="group" aria-label="Respuestas" className={`mt-3 grid gap-2 ${opciones.length === 2 ? 'grid-cols-2' : opciones.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {opciones.map((o, k) => (
          <button key={o.id} type="button" disabled={respondida} onClick={() => responder(o.id)}
            className={`min-h-14 rounded-xl border-2 px-3 text-left font-semibold disabled:opacity-60 ${respondida && o.id === carta.correcta ? 'border-green-700 bg-[var(--acento-suave)]/40 dark:border-green-400' : respondida && o.id === elegida ? 'border-red-700 dark:border-red-400' : 'border-[var(--linea)] enabled:hover:border-[var(--acento)]'}`}>
            <span className="text-xs text-[var(--suave)]">{k + 1} · </span>
            <span aria-hidden>{o.icono} </span>
            {o.nombre}
          </button>
        ))}
      </div>
    </PantallaCompleta>
  )
}
