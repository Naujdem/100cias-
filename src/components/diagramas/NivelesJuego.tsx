import { useEffect, useRef, useState } from 'react'
import PantallaCompleta from '../PantallaCompleta.tsx'
import { useFlechas } from '../../lib/flechasDiagrama.ts'

// Minijuego del subtema 1.2: «¿En qué nivel está?». Sale una tarjeta y el estudiante elige su nivel.
// Varias tarjetas son tramposas a propósito (la sangre es tejido, la piel es órgano, la ameba es célula y organismo).
// Texto en borrador.

type NivelId = 'atomos' | 'moleculas' | 'macromoleculas' | 'organulos' | 'celula' | 'tejido' | 'organo' | 'sistema' | 'organismo'

const ESCALERA: { id: NivelId; nombre: string; pista: string }[] = [
  { id: 'atomos', nombre: 'Átomo', pista: 'La partícula básica' },
  { id: 'moleculas', nombre: 'Molécula', pista: 'Pocos átomos unidos' },
  { id: 'macromoleculas', nombre: 'Macro\u00admolécula', pista: 'Molécula gigante' },
  { id: 'organulos', nombre: 'Orgánulo', pista: 'Parte de una célula' },
  { id: 'celula', nombre: 'Célula', pista: 'Unidad de la vida' },
  { id: 'tejido', nombre: 'Tejido', pista: 'Células parecidas juntas' },
  { id: 'organo', nombre: 'Órgano', pista: 'Varios tejidos juntos' },
  { id: 'sistema', nombre: 'Sistema', pista: 'Varios órganos juntos' },
  { id: 'organismo', nombre: 'Organismo', pista: 'Un ser vivo completo' },
]
/** Sin esta casilla el juego empieza en el orgánulo (perfil de 6°). */
const PEQUENOS: NivelId[] = ['atomos', 'moleculas', 'macromoleculas']

interface Tarjeta {
  id: string
  icono: string
  nombre: string
  nivel: NivelId
  /** segundo nivel que también vale (un ser de una sola célula es célula y organismo) */
  tambien?: NivelId
  /** tarjeta tramposa: la respuesta que da la intuición suele ser otra */
  trampa?: boolean
  explica: string
}

const TARJETAS: Tarjeta[] = [
  { id: 'hierro', icono: '🧲', nombre: 'El hierro de tu sangre', nivel: 'atomos', explica: 'El hierro (Fe) es un átomo: una sola partícula, no varias unidas.' },
  { id: 'carbono', icono: '⚫', nombre: 'Carbono', nivel: 'atomos', explica: 'El carbono (C) es un átomo. Con él se arman las moléculas de la vida.' },
  { id: 'calcio', icono: '🦷', nombre: 'El calcio de tus dientes', nivel: 'atomos', explica: 'El calcio (Ca) es un átomo. Un diente tiene muchísimos, unidos a otros átomos.' },
  { id: 'agua', icono: '💧', nombre: 'Agua', nivel: 'moleculas', explica: 'El agua (H₂O) es una molécula: dos átomos de hidrógeno y uno de oxígeno.' },
  { id: 'o2', icono: '🌬️', nombre: 'El oxígeno que respiras', nivel: 'moleculas', trampa: true, explica: 'Lo que respiras es O₂: dos átomos de oxígeno unidos. Eso ya es una molécula, no un átomo suelto.' },
  { id: 'glucosa', icono: '🍬', nombre: 'Glucosa', nivel: 'moleculas', explica: 'La glucosa (C₆H₁₂O₆) es una molécula pequeña: 24 átomos unidos.' },
  { id: 'hemoglobina', icono: '🩸', nombre: 'Hemoglobina', nivel: 'macromoleculas', explica: 'La hemoglobina es una proteína: una macromolécula hecha de miles de átomos.' },
  { id: 'adn', icono: '🧬', nombre: 'ADN', nivel: 'macromoleculas', explica: 'El ADN es una macromolécula: una cadena larguísima de piezas repetidas.' },
  { id: 'celulosa', icono: '🪵', nombre: 'La celulosa de la madera', nivel: 'macromoleculas', explica: 'La celulosa es una macromolécula: muchísimas glucosas unidas en cadena.' },
  { id: 'mitocondria', icono: '🔋', nombre: 'Mitocondria', nivel: 'organulos', explica: 'La mitocondria es un orgánulo: una estructura dentro de la célula con su propia función.' },
  { id: 'cloroplasto', icono: '🟢', nombre: 'Cloroplasto', nivel: 'organulos', explica: 'El cloroplasto es un orgánulo de las células vegetales: allí ocurre la fotosíntesis.' },
  { id: 'nucleo', icono: '🎯', nombre: 'El núcleo de una célula', nivel: 'organulos', explica: 'El núcleo es un orgánulo: está dentro de la célula y guarda el ADN.' },
  { id: 'neurona', icono: '⚡', nombre: 'Neurona', nivel: 'celula', explica: 'La neurona es una célula, aunque algunas midan más de un metro de largo.' },
  { id: 'globulo', icono: '🔴', nombre: 'Glóbulo rojo', nivel: 'celula', explica: 'El glóbulo rojo es una célula. Muchos glóbulos y otras células forman la sangre, que ya es un tejido.' },
  { id: 'espermatozoide', icono: '🏊', nombre: 'Espermatozoide', nivel: 'celula', trampa: true, explica: 'Se mueve solo, pero es una sola célula del cuerpo, no un ser vivo completo.' },
  { id: 'ameba', icono: '🫧', nombre: 'Ameba', nivel: 'celula', tambien: 'organismo', trampa: true, explica: 'La ameba es una sola célula y, a la vez, un ser vivo completo: es célula y organismo. No tiene tejidos ni órganos.' },
  { id: 'bacteria', icono: '🦠', nombre: 'Bacteria', nivel: 'celula', tambien: 'organismo', trampa: true, explica: 'Una bacteria es una sola célula que ya es un organismo completo. Se salta los niveles de en medio.' },
  { id: 'sangre', icono: '🧪', nombre: 'Sangre', nivel: 'tejido', trampa: true, explica: 'Aunque sea líquida, la sangre es un tejido: células que viajan juntas en el plasma y cumplen una función.' },
  { id: 'cartilago', icono: '👂', nombre: 'El cartílago de la oreja', nivel: 'tejido', explica: 'El cartílago es un tejido: células parecidas con una misma función, dar forma y sostén.' },
  { id: 'musculo', icono: '💪', nombre: 'Músculo cardíaco', nivel: 'tejido', explica: 'El músculo cardíaco es un tejido. Junto con otros tejidos forma un órgano, el corazón.' },
  { id: 'epidermis', icono: '🍃', nombre: 'La capa que cubre una hoja', nivel: 'tejido', explica: 'La epidermis es un tejido: una capa de células parecidas que protege la hoja.' },
  { id: 'piel', icono: '🖐️', nombre: 'Piel', nivel: 'organo', trampa: true, explica: 'La piel es un órgano, el más grande del cuerpo: tiene varios tejidos (epitelial, conectivo, nervioso) trabajando juntos.' },
  { id: 'femur', icono: '🦴', nombre: 'Fémur', nivel: 'organo', trampa: true, explica: 'Un hueso entero es un órgano: tiene tejido óseo, médula, vasos sanguíneos y nervios.' },
  { id: 'corazon', icono: '🫀', nombre: 'Corazón', nivel: 'organo', explica: 'El corazón es un órgano: músculo, tejido conectivo y nervioso que juntos bombean la sangre.' },
  { id: 'hoja', icono: '🌿', nombre: 'Una hoja', nivel: 'organo', explica: 'La hoja es un órgano de la planta: varios tejidos que juntos hacen la fotosíntesis.' },
  { id: 'circulatorio', icono: '🔄', nombre: 'Corazón, vasos y sangre trabajando juntos', nivel: 'sistema', explica: 'Varios órganos que cooperan forman un sistema: aquí, el circulatorio.' },
  { id: 'digestivo', icono: '🍽️', nombre: 'Boca, esófago, estómago e intestinos', nivel: 'sistema', explica: 'Juntos forman el sistema digestivo: varios órganos con una función mayor.' },
  { id: 'vastago', icono: '🌱', nombre: 'El tallo y las hojas de una planta', nivel: 'sistema', explica: 'Tallo y hojas forman el sistema del vástago: varios órganos de la planta que cooperan.' },
  { id: 'mono', icono: '🐒', nombre: 'Un mono aullador', nivel: 'organismo', explica: 'Es un organismo: un ser vivo completo, con todos sus sistemas funcionando.' },
  { id: 'frijol', icono: '🫘', nombre: 'Una planta de fríjol', nivel: 'organismo', explica: 'Es un organismo: un ser vivo completo, con raíz, tallo y hojas.' },
  { id: 'hormiga', icono: '🐜', nombre: 'Una hormiga', nivel: 'organismo', explica: 'Por pequeña que sea, es un organismo completo, con órganos y sistemas.' },
]

const RONDA = 12
const CLAVE_MEJOR = 'cien:niveles-mejor'
const CLAVE_TODOS = 'cien:niveles-todos'

function barajar<X>(a: X[]): X[] {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}
function leer(clave: string): string | null {
  try {
    return localStorage.getItem(clave)
  } catch {
    return null
  }
}
function guardar(clave: string, valor: string) {
  try {
    localStorage.setItem(clave, valor)
  } catch {
    /* sin almacenamiento: dura solo esta sesión */
  }
}
const pos = (id: NivelId) => ESCALERA.findIndex((n) => n.id === id)
const nombreDe = (id: NivelId) => ESCALERA[pos(id)].nombre
const acierta = (t: Tarjeta, n: NivelId) => n === t.nivel || n === t.tambien
const respuesta = (t: Tarjeta) => (t.tambien ? `${nombreDe(t.nivel)} y ${nombreDe(t.tambien).toLowerCase()}` : nombreDe(t.nivel))

export default function NivelesJuego() {
  const [fase, setFase] = useState<'inicio' | 'juego' | 'fin'>('inicio')
  const [todos, setTodos] = useState(() => leer(CLAVE_TODOS) !== '0')
  const [cola, setCola] = useState<Tarjeta[]>([])
  const [i, setI] = useState(0)
  const [elegido, setElegido] = useState<NivelId | null>(null)
  const [puntos, setPuntos] = useState(0)
  const [racha, setRacha] = useState(0)
  const [aciertos, setAciertos] = useState(0)
  const [fallos, setFallos] = useState<Tarjeta[]>([])
  const [mejor, setMejor] = useState(() => Number(leer(CLAVE_MEJOR)) || 0)
  const niveles = todos ? ESCALERA : ESCALERA.filter((n) => !PEQUENOS.includes(n.id))
  const tarjeta: Tarjeta | undefined = cola[i]
  const enJuego = fase === 'juego' && !!tarjeta

  const cambiarTodos = (v: boolean) => {
    setTodos(v)
    guardar(CLAVE_TODOS, v ? '1' : '0')
  }
  const empezar = () => {
    const disponibles = TARJETAS.filter((t) => todos || !PEQUENOS.includes(t.nivel))
    // siempre entran tres tramposas; el resto, al azar
    const trampas = barajar(disponibles.filter((t) => t.trampa)).slice(0, 3)
    const resto = barajar(disponibles.filter((t) => !trampas.includes(t))).slice(0, RONDA - trampas.length)
    setCola(barajar([...trampas, ...resto]))
    setI(0)
    setElegido(null)
    setPuntos(0)
    setRacha(0)
    setAciertos(0)
    setFallos([])
    setFase('juego')
  }
  const responder = (n: NivelId) => {
    if (!enJuego || elegido !== null) return
    setElegido(n)
    if (acierta(tarjeta, n)) {
      setPuntos((p) => p + 10 + Math.min(racha, 5) * 2)
      setRacha((r) => r + 1)
      setAciertos((a) => a + 1)
    } else {
      setRacha(0)
      setFallos((f) => [...f, tarjeta])
    }
  }
  const ultima = i >= cola.length - 1
  const siguiente = () => {
    if (!enJuego || elegido === null) return
    if (ultima) {
      setFase('fin')
      if (puntos > mejor) {
        setMejor(puntos)
        guardar(CLAVE_MEJOR, String(puntos))
      }
    } else {
      setI(i + 1)
      setElegido(null)
    }
  }

  // teclas 1–9 eligen nivel; → pasa a la siguiente tarjeta
  const responderRef = useRef(responder)
  responderRef.current = responder
  const nivelesRef = useRef(niveles)
  nivelesRef.current = niveles
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) && (t as HTMLInputElement).type !== 'checkbox') return
      const n = Number(e.key)
      if (n >= 1 && n <= nivelesRef.current.length) responderRef.current(nivelesRef.current[n - 1].id)
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])
  useFlechas((dir) => {
    if (fase === 'inicio') return false
    if (fase === 'juego' && dir === 1) siguiente()
    return true // al terminar, las flechas no cambian de ficha por accidente
  })

  const casilla = (
    <label className="mt-3 flex min-h-10 items-center gap-2 text-sm font-semibold">
      <input type="checkbox" checked={todos} onChange={(e) => cambiarTodos(e.target.checked)} className="h-5 w-5" />
      Incluir átomos, moléculas y macromoléculas
    </label>
  )

  if (fase === 'inicio' || (fase === 'juego' && !tarjeta)) {
    return (
      <PantallaCompleta conBoton>
        <h4 className="text-lg font-bold">¿En qué nivel está?</h4>
        <p className="mt-1 text-sm">
          Van a salir {RONDA} tarjetas: una neurona, la sangre, el fémur… Decide en qué nivel de organización está cada una. Ojo: algunas son tramposas.
        </p>
        <ol className="mt-3 flex flex-wrap gap-2 text-sm">
          {niveles.map((n, k) => (
            <li key={n.id} className="rounded-xl border border-[var(--linea)] px-3 py-1">
              <span className="font-bold">{k + 1} · {n.nombre}</span>
              <span className="block text-xs text-[var(--suave)]">{n.pista}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm">Cada acierto seguido suma más puntos. Teclas: 1 a {niveles.length} eligen el nivel y → pasa a la siguiente.</p>
        {casilla}
        <button type="button" data-principal onClick={empezar} className="mt-3 min-h-11 rounded-full bg-[var(--acento)] px-6 font-bold text-white">
          Empezar
        </button>
        {mejor > 0 && <p className="mt-2 text-sm text-[var(--suave)]">Tu mejor puntaje: {mejor}</p>}
      </PantallaCompleta>
    )
  }

  if (fase === 'fin') {
    return (
      <PantallaCompleta conBoton>
        <h4 className="text-lg font-bold">¡Ronda terminada!</h4>
        <p aria-live="polite" className="mt-1 text-base">
          <span className="text-2xl font-bold">{puntos}</span> puntos · {aciertos} de {cola.length} tarjetas en su nivel
          {puntos > 0 && puntos >= mejor ? ' · ¡es tu mejor puntaje!' : ` · tu mejor puntaje: ${mejor}`}
        </p>
        {fallos.length > 0 ? (
          <>
            <p className="mt-3 text-sm font-semibold">Para repasar:</p>
            <ul className="mt-1 space-y-2 text-sm">
              {fallos.map((f) => (
                <li key={f.id} className="rounded-xl bg-[var(--fondo)] p-2">
                  <span className="font-semibold">
                    {f.icono} {f.nombre} → {respuesta(f)}.
                  </span>{' '}
                  {f.explica}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-3 text-sm">Todas en su nivel, incluidas las tramposas. Juega otra vez: salen tarjetas distintas.</p>
        )}
        {casilla}
        <button type="button" data-principal onClick={empezar} className="mt-2 min-h-11 rounded-full bg-[var(--acento)] px-6 font-bold text-white">
          Jugar otra vez
        </button>
      </PantallaCompleta>
    )
  }

  const t = tarjeta!
  const acerto = elegido !== null && acierta(t, elegido)
  // si falla por un solo escalón, se dice hacia dónde estaba
  const distancia = elegido !== null && !acerto ? pos(t.nivel) - pos(elegido) : 0
  const casi = Math.abs(distancia) === 1 ? (distancia > 0 ? 'Casi: es un nivel más grande.' : 'Casi: es un nivel más pequeño.') : 'No está en ese nivel.'

  return (
    <PantallaCompleta conBoton>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold">
        <span>Tarjeta {i + 1} de {cola.length}</span>
        <span>{puntos} puntos</span>
        {racha > 1 && <span>Racha ×{racha}</span>}
      </div>
      <div className="mt-2 grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div key={t.id} className="flex min-h-36 flex-col items-center justify-center rounded-2xl border-2 border-[var(--acento)] bg-[var(--fondo)] p-4 text-center">
          <span aria-hidden="true" className="text-5xl">{t.icono}</span>
          <p className="mt-2 text-xl font-bold">{t.nombre}</p>
        </div>
        <div aria-live="polite" className="min-h-[6rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
          {elegido === null ? (
            <p className="text-[var(--suave)]">¿Átomo, célula, órgano…? Elige el nivel con un toque o con las teclas 1 a {niveles.length}.</p>
          ) : (
            <>
              <p>
                <span className="font-semibold">{acerto ? '¡Correcto!' : casi}</span>{' '}
                {!acerto && `La respuesta era «${respuesta(t)}». `}
                {t.explica}
              </p>
              <button type="button" data-principal onClick={siguiente} className="mt-2 min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-bold text-white">
                {ultima ? 'Ver resultado' : 'Siguiente ›'}
              </button>
            </>
          )}
        </div>
      </div>
      <div role="group" aria-label="Niveles, del más pequeño al más grande" className="mt-3 grid grid-cols-3 gap-2 lg:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]" style={{ ['--n' as string]: niveles.length }}>
        {niveles.map((n, k) => {
          const marca = elegido === null ? 'enabled:hover:border-[var(--acento)]' : acierta(t, n.id) ? 'border-green-700 bg-[var(--acento-suave)]/40' : n.id === elegido ? 'border-red-700' : 'opacity-60'
          return (
            <button key={n.id} type="button" disabled={elegido !== null} onClick={() => responder(n.id)} className={`min-h-14 rounded-lg border-2 border-[var(--linea)] px-2 py-1 text-left text-sm font-semibold ${marca}`}>
              {k + 1} · {n.nombre}
              <span className="block text-xs font-normal text-[var(--suave)]">{n.pista}</span>
            </button>
          )
        })}
      </div>
    </PantallaCompleta>
  )
}
