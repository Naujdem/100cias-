import { useEffect, useRef, useState } from 'react'
import PantallaCompleta from '../PantallaCompleta.tsx'
import { Lienzo, T, Flecha, TINTA } from '../ilustraciones/Dibujo.tsx'
import { Pestanas, Nota } from './TiposCelulas.tsx'
import { MembranaTransporte } from './CelulaEucDiagramas.tsx'
import { useFlechas } from '../../lib/flechasDiagrama.ts'

// Actividades del paso «La membrana» (tema 3): cómo cruzan, el minijuego del portero y la ósmosis.
// Texto en borrador.

/* ── Minijuego: el portero de la membrana ─────────────────────────────────── */

type Via = 'lipidos' | 'proteina' | 'bomba' | 'vesicula'

const PUERTAS: { id: Via; nombre: string; sub: string; x: number }[] = [
  { id: 'lipidos', nombre: 'Entre los lípidos', sub: 'Difusión simple · sin energía', x: 70 },
  { id: 'proteina', nombre: 'Canal o transportadora', sub: 'Difusión facilitada · sin energía', x: 160 },
  { id: 'bomba', nombre: 'Bomba', sub: 'Transporte activo · gasta ATP', x: 250 },
  { id: 'vesicula', nombre: 'Vesícula', sub: 'Endocitosis o exocitosis', x: 335 },
]

interface Visitante {
  id: string
  nombre: string
  tam: 'pequeña' | 'mediana' | 'enorme'
  carga: string
  sentido: 'entra' | 'sale'
  /** null: es tan grande que la concentración no decide el camino */
  favor: boolean | null
  via: Via
  explica: string
}

const VISITANTES: Visitante[] = [
  { id: 'o2', nombre: 'Oxígeno (O₂)', tam: 'pequeña', carga: 'sin carga', sentido: 'entra', favor: true, via: 'lipidos', explica: 'Es pequeña y sin carga: se cuela entre los lípidos sin ayuda y sin gastar energía.' },
  { id: 'co2', nombre: 'Dióxido de carbono (CO₂)', tam: 'pequeña', carga: 'sin carga', sentido: 'sale', favor: true, via: 'lipidos', explica: 'Igual que el oxígeno: pequeña y sin carga, sale directo entre los lípidos.' },
  { id: 'esteroide', nombre: 'Hormona esteroide', tam: 'pequeña', carga: 'sin carga, parecida a las grasas', sentido: 'entra', favor: true, via: 'lipidos', explica: 'Se parece a los lípidos de la membrana: se disuelve en ellos y pasa sin ayuda.' },
  { id: 'glucosa', nombre: 'Glucosa', tam: 'mediana', carga: 'sin carga, pero amiga del agua', sentido: 'entra', favor: true, via: 'proteina', explica: 'Es demasiado grande y amiga del agua para los lípidos. Una proteína transportadora la deja pasar sin gastar energía, porque va a favor.' },
  { id: 'agua', nombre: 'Agua (mucha y rápido)', tam: 'pequeña', carga: 'sin carga, pero con polos', sentido: 'entra', favor: true, via: 'proteina', explica: 'Un poco de agua pasa entre los lípidos, pero la mayor parte cruza rápido por canales llamados acuaporinas.' },
  { id: 'na-canal', nombre: 'Ion sodio (Na⁺)', tam: 'pequeña', carga: 'con carga', sentido: 'entra', favor: true, via: 'proteina', explica: 'Tiene carga y los lípidos lo rechazan. Como va a favor, le basta un canal abierto: no gasta energía.' },
  { id: 'na-bomba', nombre: 'Ion sodio (Na⁺)', tam: 'pequeña', carga: 'con carga', sentido: 'sale', favor: false, via: 'bomba', explica: 'Va cuesta arriba, de donde hay menos a donde hay más. Solo una bomba puede sacarlo, y gasta ATP.' },
  { id: 'k-bomba', nombre: 'Ion potasio (K⁺)', tam: 'pequeña', carga: 'con carga', sentido: 'entra', favor: false, via: 'bomba', explica: 'Dentro de la célula ya hay mucho potasio. Meter más es ir cuesta arriba: lo hace la bomba, gastando ATP.' },
  { id: 'bacteria', nombre: 'Bacteria (la atrapa un glóbulo blanco)', tam: 'enorme', carga: 'no importa', sentido: 'entra', favor: null, via: 'vesicula', explica: 'Es muchísimo más grande que una molécula. La membrana la rodea y la mete en una vesícula (endocitosis).' },
  { id: 'insulina', nombre: 'Insulina recién fabricada', tam: 'enorme', carga: 'no importa', sentido: 'sale', favor: null, via: 'vesicula', explica: 'Las proteínas no caben por los canales. Viaja en una vesícula que se une a la membrana y la suelta afuera (exocitosis).' },
]

const VIDAS = 3
const TIEMPO = 12
const CLAVE = 'cien:portero-mejor'
const RADIO = { pequeña: 7, mediana: 10, enorme: 15 }

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

/** Membrana con las cuatro puertas numeradas. `marca` resalta la puerta correcta al responder. */
function MembranaPuertas({ marca }: { marca: Via | null }) {
  const xs = Array.from({ length: 16 }, (_, i) => 12 + i * 25)
  const aro = (v: Via) => (marca === v ? { stroke: '#2e7d32', strokeWidth: 4 } : { stroke: TINTA, strokeWidth: 1.8 })
  return (
    <>
      <T x={14} y={26} s={12} b a="start">Fuera</T>
      <T x={14} y={290} s={12} b a="start">Dentro</T>
      {xs.map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={112} r="7.5" fill="#f2c77a" stroke="#b3861f" strokeWidth="1.8" />
          <path d={`M ${cx - 2.5} 119 v 24 M ${cx + 2.5} 119 v 24`} stroke="#b3861f" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx={cx} cy={188} r="7.5" fill="#f2c77a" stroke="#b3861f" strokeWidth="1.8" />
          <path d={`M ${cx - 2.5} 181 v -24 M ${cx + 2.5} 181 v -24`} stroke="#b3861f" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      ))}
      {/* 2 · canal o transportadora */}
      <rect x="143" y="100" width="34" height="100" rx="12" fill="#9ec0e8" stroke="#5d84b8" strokeWidth="2.4" />
      <rect x="154" y="108" width="12" height="84" rx="6" fill="#f4efe4" />
      {/* 3 · bomba */}
      <rect x="231" y="98" width="38" height="104" rx="12" fill="#f0b48a" stroke="#b5622a" strokeWidth="2.4" />
      <path d="M 240 150 q 10 -16 20 0" fill="none" stroke="#b5622a" strokeWidth="2.4" />
      <rect x="235" y="207" width="30" height="15" rx="7" fill="#ffe27a" stroke="#b3861f" strokeWidth="1.5" />
      <T x={250} y={218} s={9.5} b>ATP</T>
      {/* 4 · vesícula */}
      <rect x="301" y="98" width="72" height="104" fill="#f4efe4" />
      <path d="M 305 108 C 305 196, 365 196, 365 108" fill="#f7e3b5" stroke="#b3861f" strokeWidth="6" strokeLinecap="round" />
      {PUERTAS.map((p, n) => (
        <g key={p.id}>
          <circle cx={p.x} cy={150} r="11" fill="#fff" {...aro(p.id)} />
          <T x={p.x} y={154.5} s={12.5} b>{n + 1}</T>
        </g>
      ))}
    </>
  )
}

export function PorteroMembrana() {
  const [fase, setFase] = useState<'inicio' | 'juego' | 'fin'>('inicio')
  const [cola, setCola] = useState<Visitante[]>([])
  const [i, setI] = useState(0)
  const [elegida, setElegida] = useState<Via | 'tiempo' | null>(null)
  const [puntos, setPuntos] = useState(0)
  const [racha, setRacha] = useState(0)
  const [aciertos, setAciertos] = useState(0)
  const [vidas, setVidas] = useState(VIDAS)
  const [fallos, setFallos] = useState<Visitante[]>([])
  const [reloj, setReloj] = useState(false)
  const [seg, setSeg] = useState(TIEMPO)
  const [mejor, setMejor] = useState(leerMejor)
  const vis: Visitante | undefined = cola[i]
  const enJuego = fase === 'juego' && !!vis

  const empezar = () => {
    setCola(barajar(VISITANTES))
    setI(0)
    setElegida(null)
    setPuntos(0)
    setRacha(0)
    setAciertos(0)
    setVidas(VIDAS)
    setFallos([])
    setSeg(TIEMPO)
    setFase('juego')
  }
  const responder = (v: Via | 'tiempo') => {
    if (!enJuego || elegida !== null) return
    setElegida(v)
    if (v === vis.via) {
      setPuntos((p) => p + 10 + Math.min(racha, 5) * 2)
      setRacha((r) => r + 1)
      setAciertos((a) => a + 1)
    } else {
      setVidas((x) => x - 1)
      setRacha(0)
      setFallos((f) => [...f, vis])
    }
  }
  const ultimo = vidas <= 0 || i >= cola.length - 1
  const siguiente = () => {
    if (!enJuego || elegida === null) return
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
      setElegida(null)
      setSeg(TIEMPO)
    }
  }

  // teclas 1–4 eligen puerta; ← → se quedan en el juego (→ pasa al siguiente visitante)
  const responderRef = useRef(responder)
  responderRef.current = responder
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) && (t as HTMLInputElement).type !== 'checkbox') return
      const n = Number(e.key)
      if (n >= 1 && n <= PUERTAS.length) responderRef.current(PUERTAS[n - 1].id)
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])
  useFlechas((dir) => {
    if (fase === 'inicio') return false
    if (fase === 'juego' && dir === 1) siguiente()
    return true // al terminar, las flechas no cambian de ficha por accidente
  })

  // contrarreloj (opcional)
  const corriendo = enJuego && reloj && elegida === null
  useEffect(() => {
    if (!corriendo) return
    const t = setInterval(() => setSeg((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [corriendo, i])
  useEffect(() => {
    if (corriendo && seg <= 0) responderRef.current('tiempo')
  }, [corriendo, seg])

  if (fase === 'inicio' || (fase === 'juego' && !vis)) {
    return (
      <PantallaCompleta conBoton>
        <h4 className="text-lg font-bold">El portero de la membrana</h4>
        <p className="mt-1 text-sm">
          Eres la membrana. Van a llegar {VISITANTES.length} visitantes que quieren entrar o salir de la célula. Lee sus pistas (tamaño, carga y hacia dónde van) y decide por qué puerta pasa cada uno.
        </p>
        <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          {PUERTAS.map((p, n) => (
            <li key={p.id} className="rounded-xl border border-[var(--linea)] p-2">
              <span className="font-bold">{n + 1} · {p.nombre}</span>
              <br />
              <span className="text-[var(--suave)]">{p.sub}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm">Tienes {VIDAS} vidas. Cada acierto seguido suma más puntos. Teclas: 1 a 4 eligen la puerta y → pasa al siguiente.</p>
        <label className="mt-3 flex min-h-10 items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={reloj} onChange={(e) => setReloj(e.target.checked)} className="h-5 w-5" />
          Contrarreloj ({TIEMPO} segundos por visitante)
        </label>
        <button type="button" data-principal onClick={empezar} className="mt-3 min-h-11 rounded-full bg-[var(--acento)] px-6 font-bold text-white">
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
          <span className="text-2xl font-bold">{puntos}</span> puntos · {aciertos} de {total} visitantes por la puerta correcta
          {puntos > 0 && puntos >= mejor ? ' · ¡es tu mejor puntaje!' : ` · tu mejor puntaje: ${mejor}`}
        </p>
        {fallos.length > 0 ? (
          <>
            <p className="mt-3 text-sm font-semibold">Para repasar:</p>
            <ul className="mt-1 space-y-2 text-sm">
              {fallos.map((f) => (
                <li key={f.id} className="rounded-xl bg-[var(--fondo)] p-2">
                  <span className="font-semibold">
                    {f.nombre} ({f.sentido}) → {PUERTAS.find((p) => p.id === f.via)!.nombre}.
                  </span>{' '}
                  {f.explica}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-3 text-sm">Ningún visitante se equivocó de puerta. Prueba ahora con el contrarreloj.</p>
        )}
        <label className="mt-3 flex min-h-10 items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={reloj} onChange={(e) => setReloj(e.target.checked)} className="h-5 w-5" />
          Contrarreloj ({TIEMPO} segundos por visitante)
        </label>
        <button type="button" data-principal onClick={empezar} className="mt-2 min-h-11 rounded-full bg-[var(--acento)] px-6 font-bold text-white">
          Jugar otra vez
        </button>
      </PantallaCompleta>
    )
  }

  const v = vis!
  const entra = v.sentido === 'entra'
  const acerto = elegida === v.via
  const puerta = elegida && elegida !== 'tiempo' ? PUERTAS.find((p) => p.id === elegida)! : null
  // posición de la partícula: espera en su lado, cruza por la puerta si acierta o rebota si falla
  const px = puerta ? puerta.x : 200
  const py = puerta ? (acerto ? (entra ? 252 : 48) : entra ? 84 : 216) : entra ? 48 : 252
  const pistaSentido = v.favor === null ? 'Es tan grande que no cabe por ninguna proteína' : v.favor ? 'De donde hay más a donde hay menos (a favor)' : 'De donde hay menos a donde hay más (cuesta arriba)'

  return (
    <PantallaCompleta conBoton>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold">
        <span>Visitante {i + 1} de {cola.length}</span>
        <span>{puntos} puntos</span>
        {racha > 1 && <span>Racha ×{racha}</span>}
        <span aria-label={`${vidas} vidas`}>{'❤️'.repeat(Math.max(0, vidas))}{'🤍'.repeat(VIDAS - Math.max(0, vidas))}</span>
        {reloj && <span className={seg <= 4 && elegida === null ? 'text-red-700' : ''}>⏱ {Math.max(0, seg)} s</span>}
      </div>
      <div className="mt-2 grid gap-3 lg:grid-cols-2">
      <div className="aspect-[4/3] max-h-[38dvh] w-full overflow-hidden rounded-xl border border-[var(--linea)]">
        <Lienzo etiqueta={`Membrana con cuatro puertas. ${v.nombre} quiere ${entra ? 'entrar' : 'salir'}.`}>
          <MembranaPuertas marca={elegida !== null ? v.via : null} />
          <Flecha x1={386} y1={entra ? 40 : 260} x2={386} y2={entra ? 80 : 220} c={TINTA} w={2.2} />
          <g key={v.id} style={{ transform: `translate(${px}px, ${py}px)`, transition: 'transform 0.7s ease' }} className="motion-reduce:!transition-none">
            <circle r={RADIO[v.tam]} fill="#e8806f" stroke={TINTA} strokeWidth="1.8" />
            {elegida !== null && !acerto && puerta && <text x={RADIO[v.tam] + 4} y="5" fontSize="16" fontWeight="700" fill="#b3261e">✗</text>}
          </g>
        </Lienzo>
      </div>
        <div>
      <p className="text-base font-bold">
        {v.nombre} quiere {entra ? 'entrar' : 'salir'}
      </p>
      <ul className="mt-1 flex flex-wrap gap-2 text-sm">
        <li className="rounded-full border border-[var(--linea)] px-3 py-1">Tamaño: {v.tam}</li>
        <li className="rounded-full border border-[var(--linea)] px-3 py-1">Carga: {v.carga}</li>
        <li className="rounded-full border border-[var(--linea)] px-3 py-1">{pistaSentido}</li>
      </ul>
      <div aria-live="polite" className="mt-2 min-h-[4.5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
        {elegida === null ? (
          <p className="text-[var(--suave)]">Elige la puerta con un toque o con las teclas 1 a 4.</p>
        ) : (
          <>
            <p>
              <span className="font-semibold">{acerto ? '¡Pasa!' : elegida === 'tiempo' ? 'Se acabó el tiempo.' : 'Por ahí no puede.'}</span>{' '}
              {!acerto && `La puerta era «${PUERTAS.find((p) => p.id === v.via)!.nombre}». `}
              {v.explica}
            </p>
            <button type="button" data-principal onClick={siguiente} className="mt-2 min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-bold text-white">
              {ultimo ? 'Ver resultado' : 'Siguiente ›'}
            </button>
          </>
        )}
      </div>
        </div>
      </div>
      <div role="group" aria-label="Puertas" className="mt-2 grid grid-cols-2 gap-2 lg:grid-cols-4">
        {PUERTAS.map((p, n) => {
          const marca = elegida === null ? 'enabled:hover:border-[var(--acento)]' : p.id === v.via ? 'border-green-700 bg-[var(--acento-suave)]/40' : p.id === elegida ? 'border-red-700' : 'opacity-60'
          return (
            <button key={p.id} type="button" disabled={elegida !== null} onClick={() => responder(p.id)} className={`min-h-12 rounded-lg border-2 border-[var(--linea)] px-2 py-1 text-left text-sm font-semibold ${marca}`}>
              {n + 1} · {p.nombre}
              <span className="block text-xs font-normal text-[var(--suave)]">{p.sub}</span>
            </button>
          )
        })}
      </div>
    </PantallaCompleta>
  )
}

/* ── Ósmosis: la célula en agua con más o menos sal ───────────────────────── */

const SOLUCION = ['Agua pura', 'Poca sal', 'Igual que adentro', 'Salada', 'Muy salada']
const TIPO_SOL = ['hipotónica', 'hipotónica', 'isotónica', 'hipertónica', 'hipertónica']
const TEXTO_OSM: Record<'animal' | 'vegetal', string[]> = {
  animal: [
    'Afuera casi no hay sal y adentro sí: entra mucha agua. La célula se hincha y, como no tiene pared, puede reventar.',
    'Entra más agua de la que sale: la célula se hincha un poco.',
    'Entra y sale la misma cantidad de agua: la célula conserva su forma. Así está un glóbulo rojo en la sangre.',
    'Afuera hay más sal: sale más agua de la que entra y la célula se encoge.',
    'Sale mucha agua: la célula queda arrugada y deja de funcionar bien.',
  ],
  vegetal: [
    'Entra mucha agua, pero la pared aguanta: la célula queda hinchada y firme (turgente). Así se sostienen las hojas.',
    'Entra agua y la vacuola se llena: la célula está firme.',
    'Entra y sale la misma cantidad de agua: la célula pierde firmeza y la planta se ve algo floja.',
    'Sale agua: la vacuola se achica y la membrana empieza a despegarse de la pared.',
    'Sale mucha agua: la membrana se separa de la pared (plasmólisis). La planta se marchita.',
  ],
}

// puntos de sal de afuera: posiciones fijas en el margen del dibujo
const SAL_FUERA: [number, number][] = (() => {
  const pts: [number, number][] = []
  let s = 7
  const azar = () => ((s = (s * 1103515245 + 12345) % 2147483648), s / 2147483648)
  while (pts.length < 32) {
    const x = 12 + azar() * 376
    const y = 40 + azar() * 226
    if (x < 86 || x > 314 || y < 62 || y > 238) pts.push([x, y])
  }
  return pts
})()
const SAL_DENTRO: [number, number][] = [[188, 138], [212, 142], [200, 160], [184, 158], [216, 162], [200, 132], [194, 148], [208, 152]]

export function OsmosisCelula() {
  const [tipo, setTipo] = useState<'animal' | 'vegetal'>('animal')
  const [n, setN] = useState(2)
  const r = [80, 68, 56, 46, 38][n]
  const hueco = [0, 3, 8, 24, 40][n]
  // contorno arrugado para la célula animal que perdió agua
  const picos = Array.from({ length: 24 }, (_, k) => {
    const a = (k / 24) * Math.PI * 2
    const d = k % 2 ? r * 0.8 : r * 1.08
    return `${200 + Math.cos(a) * d},${150 + Math.sin(a) * d}`
  }).join(' ')
  const flechas = n < 2 ? 'entra' : n > 2 ? 'sale' : 'igual'
  const lado = tipo === 'animal' ? r + 6 : 106
  return (
    <PantallaCompleta conBoton>
      <div className="grid gap-3 lg:grid-cols-2">
      <div className="aspect-[4/3] max-h-[40dvh] w-full overflow-hidden rounded-xl border border-[var(--linea)]">
        <Lienzo etiqueta={`Célula ${tipo} en ${SOLUCION[n].toLowerCase()}: ${TEXTO_OSM[tipo][n]}`}>
          <rect x="-1500" y="-1500" width="3400" height="3300" fill="#dcecf7" />
          <T x={200} y={24} s={13} b>{SOLUCION[n]} · solución {TIPO_SOL[n]}</T>
          {SAL_FUERA.slice(0, n * 8).map(([x, y], k) => (
            <rect key={k} x={x - 3} y={y - 3} width="6" height="6" fill="#fff" stroke="#6b7f90" strokeWidth="1.2" />
          ))}
          {tipo === 'animal' ? (
            n >= 3 ? (
              <polygon points={picos} fill="#f4b8b0" stroke="#b05a5a" strokeWidth="2.5" strokeLinejoin="round" />
            ) : (
              <circle cx="200" cy="150" r={r} fill="#f8cfc8" stroke="#b05a5a" strokeWidth="2.5" strokeDasharray={n === 0 ? '7 5' : undefined} />
            )
          ) : (
            <>
              <rect x="104" y="72" width="192" height="156" rx="10" fill="#dcecf7" stroke="#3f7d37" strokeWidth="6" />
              <rect x={110 + hueco} y={78 + hueco * 0.8} width={180 - hueco * 2} height={144 - hueco * 1.6} rx="12" fill="#cfe8bf" stroke="#b3861f" strokeWidth="2.2" />
              <rect x={128 + hueco} y={94 + hueco * 0.8} width={144 - hueco * 2} height={112 - hueco * 1.6} rx="12" fill="#bfe0f2" stroke="#5d84b8" strokeWidth="1.8" />
            </>
          )}
          {SAL_DENTRO.map(([x, y], k) => (
            <rect key={k} x={x - 3} y={y - 3} width="6" height="6" fill="#fff" stroke="#6b7f90" strokeWidth="1.2" />
          ))}
          {flechas !== 'sale' && (
            <>
              <Flecha x1={200 - lado - 44} y1={150} x2={200 - lado - 6} y2={150} c="#2f6fa8" w={n === 0 ? 4 : 2.6} />
              <Flecha x1={200 + lado + 44} y1={150} x2={200 + lado + 6} y2={150} c="#2f6fa8" w={n === 0 ? 4 : 2.6} />
            </>
          )}
          {flechas !== 'entra' && (
            <>
              <Flecha x1={200 - lado - 6} y1={flechas === 'igual' ? 168 : 150} x2={200 - lado - 44} y2={flechas === 'igual' ? 168 : 150} c="#2f6fa8" w={n === 4 ? 4 : 2.6} />
              <Flecha x1={200 + lado + 6} y1={flechas === 'igual' ? 168 : 150} x2={200 + lado + 44} y2={flechas === 'igual' ? 168 : 150} c="#2f6fa8" w={n === 4 ? 4 : 2.6} />
            </>
          )}
          <T x={200} y={286} s={11}>□ sal · flechas azules: agua</T>
        </Lienzo>
      </div>
        <div>
      <Pestanas valor={tipo} opciones={[['animal', 'Célula animal'], ['vegetal', 'Célula vegetal']]} onCambio={setTipo} etiqueta="Tipo de célula" />
      <label className="block text-sm font-semibold">
        Sal en el agua de afuera: {SOLUCION[n]}
        <input type="range" min={0} max={4} step={1} value={n} onChange={(e) => setN(Number(e.target.value))} className="mt-1 block w-full" />
      </label>
      <p aria-live="polite" className="mt-2 min-h-[4.5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">{TEXTO_OSM[tipo][n]}</p>
        </div>
      </div>
      <Nota>El agua cruza la membrana hacia donde hay más sal. Por eso la lechuga se pone tiesa en agua y se marchita si le echas sal. Esquema simplificado.</Nota>
    </PantallaCompleta>
  )
}

/* ── Las tres actividades de la membrana ──────────────────────────────────── */

type Act = 'cruzan' | 'portero' | 'osmosis'

export default function MembranaActividades({ inicial = 'cruzan', sinJuego = false }: { inicial?: Act; /** en el recorrido de la ficha, el juego va aparte */ sinJuego?: boolean }) {
  const [act, setAct] = useState<Act>(inicial)
  return (
    <div>
      <Pestanas valor={act} opciones={sinJuego ? [['cruzan', 'Cómo cruzan'], ['osmosis', 'Ósmosis']] : [['cruzan', 'Cómo cruzan'], ['portero', 'Juego: el portero'], ['osmosis', 'Ósmosis']]} onCambio={setAct} etiqueta="Actividad" />
      {act === 'cruzan' ? <MembranaTransporte /> : act === 'portero' ? <PorteroMembrana /> : <OsmosisCelula />}
    </div>
  )
}
