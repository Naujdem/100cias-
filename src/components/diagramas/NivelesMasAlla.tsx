import { useEffect, useRef, useState } from 'react'
import PantallaCompleta from '../PantallaCompleta.tsx'
import { Lienzo, T, TINTA } from '../ilustraciones/Dibujo.tsx'
import { Pestanas } from './TiposCelulas.tsx'
import { useFlechas } from '../../lib/flechasDiagrama.ts'

// «Más allá del organismo» (subtema 1.2): población → comunidad → ecosistema → biosfera,
// con un mismo ejemplo: monos aulladores en un bosque. Texto y dibujos en borrador.

const ESCALONES = [
  { nombre: 'Organismo', que: 'Un ser vivo completo.', ejemplo: 'Un mono aullador rojo.', suma: 'Aquí terminan los niveles que caben dentro de un cuerpo.' },
  { nombre: 'Población', que: 'Todos los organismos de una misma especie que viven en un mismo lugar.', ejemplo: 'Todos los monos aulladores de este bosque.', suma: 'Se suman: más individuos de la misma especie.' },
  { nombre: 'Comunidad', que: 'Todas las poblaciones de distintas especies que viven juntas.', ejemplo: 'Los monos, los yarumos, las aves, las mariposas y los hongos del bosque.', suma: 'Se suman: las demás especies, que se relacionan entre sí.' },
  { nombre: 'Ecosistema', que: 'La comunidad junto con su ambiente sin vida.', ejemplo: 'El bosque entero: sus seres vivos más el agua, el suelo, la luz y el clima.', suma: 'Se suma: lo que no está vivo, como el agua, el suelo, el sol y la lluvia.' },
  { nombre: 'Biosfera', que: 'Todos los ecosistemas de la Tierra: la capa del planeta donde hay vida.', ejemplo: 'Este bosque, los páramos, los ríos, los mares… todos a la vez.', suma: 'Se suman: todos los demás ecosistemas del planeta.' },
]

const PELO = '#b5552b'
const PELO_B = '#6e2f14'

function Mono({ x, y, s = 1, v = false }: { x: number; y: number; s?: number; v?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${v ? -s : s} ${s})`}>
      <path d="M -9 6 q -16 6 -12 22" fill="none" stroke={PELO_B} strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="0" cy="2" rx="10" ry="12" fill={PELO} stroke={PELO_B} strokeWidth="1.5" />
      <path d="M 6 -2 l 9 7 M -4 12 l -2 8 M 5 12 l 3 8" stroke={PELO_B} strokeWidth="3" strokeLinecap="round" />
      <circle cx="4" cy="-13" r="7.5" fill={PELO} stroke={PELO_B} strokeWidth="1.5" />
      <ellipse cx="6.5" cy="-11.5" rx="4" ry="4.2" fill="#3a2418" />
    </g>
  )
}
function Arbol({ x, r, copa, alto = 80 }: { x: number; r: number; copa: string; alto?: number }) {
  const y = 240 - alto
  return (
    <g>
      <rect x={x - 6} y={y} width="12" height={alto} fill="#8a623a" stroke="#5b3d1f" strokeWidth="1.5" />
      <circle cx={x - r * 0.5} cy={y} r={r * 0.75} fill={copa} stroke="#3f6b3a" strokeWidth="1.5" />
      <circle cx={x + r * 0.5} cy={y - 4} r={r * 0.75} fill={copa} stroke="#3f6b3a" strokeWidth="1.5" />
      <circle cx={x} cy={y - r * 0.6} r={r * 0.8} fill={copa} stroke="#3f6b3a" strokeWidth="1.5" />
    </g>
  )
}

/** Cada escalón deja ver más cosas; los dos primeros miran de cerca el árbol de los monos. */
const VISTA = ['translate(-376px, -181px) scale(2.4)', 'translate(-119px, -34px) scale(1.6)', 'none', 'none']

function Escena({ paso }: { paso: number }) {
  if (paso === 4) {
    return (
      <>
        <circle cx="200" cy="150" r="112" fill="none" stroke="#7cc08a" strokeWidth="10" opacity="0.55" />
        <circle cx="200" cy="150" r="100" fill="#6aa9de" stroke="#2f5f9a" strokeWidth="2.5" />
        <path d="M 150 80 q 30 -14 48 8 q 10 26 -6 52 q 6 34 -10 62 q -22 -24 -22 -56 q -22 -26 -10 -66 Z" fill="#7cc08a" stroke="#3f6b3a" strokeWidth="1.8" />
        <path d="M 236 96 q 30 -10 42 14 q -4 28 -26 30 q -20 -14 -16 -44 Z M 232 176 q 24 -6 30 18 q -8 22 -26 18 Z" fill="#7cc08a" stroke="#3f6b3a" strokeWidth="1.8" />
        <circle cx="172" cy="150" r="5" fill="#b3261e" stroke="#fff" strokeWidth="1.5" />
        <path d="M 168 148 L 70 60" stroke={TINTA} strokeWidth="1.4" />
        <T x={66} y={50} s={11.5} b>el bosque está aquí</T>
        <T x={336} y={40} s={11.5} b c="#3f6b3a">capa con vida</T>
        <path d="M 330 46 L 292 78" stroke="#3f6b3a" strokeWidth="1.4" />
      </>
    )
  }
  return (
    <g style={{ transform: VISTA[paso], transition: 'transform 0.6s ease' }} className="motion-reduce:!transition-none">
      <rect x="-200" y="-200" width="800" height="440" fill="#dff0f5" />
      {paso >= 3 && (
        <>
          <circle cx="356" cy="38" r="20" fill="#ffd257" stroke="#b3861f" strokeWidth="2" />
          <path d="M 44 50 a 16 16 0 0 1 22 -18 a 18 18 0 0 1 34 4 a 14 14 0 0 1 2 28 h -52 a 12 12 0 0 1 -6 -14 Z" fill="#fff" stroke="#8aa0ad" strokeWidth="1.8" />
          <path d="M 56 72 l -4 14 M 74 72 l -4 14 M 92 72 l -4 14" stroke="#5d9be0" strokeWidth="2.2" strokeLinecap="round" />
        </>
      )}
      <rect x="-200" y="240" width="800" height="200" fill={paso >= 3 ? '#a47a4c' : '#cfe3c0'} />
      {paso >= 3 && <path d="M -10 276 q 60 -16 120 0 t 120 0 t 120 0 t 60 -4 v 40 h -420 Z" fill="#6aa9de" stroke="#2f5f9a" strokeWidth="1.5" />}
      {paso >= 2 && (
        <>
          <Arbol x={66} r={40} copa="#9fd08a" alto={70} />
          <Arbol x={336} r={42} copa="#b9dd8f" alto={92} />
          <path d="M 292 62 q 8 -10 16 0 q 8 -10 16 0" fill="none" stroke={TINTA} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 112 196 q -12 -14 -2 -16 q 6 2 2 16 q 12 -14 2 -16" fill="#f2a341" stroke="#8a4a22" strokeWidth="1.3" />
          <path d="M 274 240 v -10 M 262 230 q 12 -16 24 0 Z" fill="#e8806f" stroke="#8f2f29" strokeWidth="1.5" />
        </>
      )}
      <Arbol x={198} r={56} copa="#7cc08a" alto={110} />
      <path d="M 200 152 H 266" stroke="#5b3d1f" strokeWidth="6" strokeLinecap="round" />
      <Mono x={240} y={132} />
      {paso >= 1 && (
        <>
          <Mono x={168} y={98} s={0.9} v />
          <Mono x={214} y={72} s={0.85} />
          <Mono x={150} y={136} s={0.7} />
        </>
      )}
      {paso >= 3 && (
        <>
          <T x={356} y={74} s={10.5}>luz</T>
          <T x={74} y={102} s={10.5}>lluvia</T>
          <T x={60} y={258} s={10.5} c="#fff">suelo</T>
          <T x={330} y={294} s={10.5} c="#fff">agua</T>
        </>
      )}
    </g>
  )
}

function Sube() {
  const [paso, setPaso] = useState(1)
  const e = ESCALONES[paso]
  return (
    <>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="aspect-[4/3] max-h-[var(--alto-visor,38dvh)] w-full overflow-hidden rounded-xl border border-[var(--linea)]">
          <Lienzo etiqueta={`${e.nombre}: ${e.ejemplo}`}>
            <Escena paso={paso} />
          </Lienzo>
        </div>
        <div aria-live="polite" className="rounded-xl bg-[var(--fondo)] p-3 text-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--acento)]">Escalón {paso + 1} de {ESCALONES.length}</p>
          <p className="text-xl font-bold">{e.nombre}</p>
          <p className="mt-1">{e.que}</p>
          <p className="mt-2">
            <span className="font-semibold">En el bosque:</span> {e.ejemplo}
          </p>
          <p className="mt-2 font-semibold text-[var(--acento)]">{e.suma}</p>
        </div>
      </div>
      <label htmlFor="escalon-mas-alla" className="mt-3 flex items-center justify-between text-sm font-semibold">
        <span>Sube de nivel</span>
        <span className="font-normal text-[var(--suave)]">{ESCALONES.map((x) => x.nombre).join(' → ')}</span>
      </label>
      <input
        id="escalon-mas-alla"
        type="range"
        min="0"
        max={ESCALONES.length - 1}
        step="1"
        value={paso}
        onChange={(ev) => setPaso(Number(ev.target.value))}
        onPointerUp={(ev) => ev.currentTarget.closest<HTMLElement>('[role=dialog]')?.focus()}
        className="mt-1 h-8 w-full accent-[var(--acento)]"
      />
      <p className="mt-1 text-xs text-[var(--suave)]">Dibujo esquemático. Estos niveles se trabajan a fondo en el área de relaciones ecosistémicas.</p>
    </>
  )
}

const NOMBRES = ['Población', 'Comunidad', 'Ecosistema', 'Biosfera']
const CASOS: { texto: string; es: number; explica: string }[] = [
  { texto: 'Todos los monos aulladores de un bosque', es: 0, explica: 'Una sola especie en un mismo lugar: población.' },
  { texto: 'Las truchas de una quebrada', es: 0, explica: 'Solo truchas, una sola especie: población.' },
  { texto: 'Los monos, los árboles, las aves y los hongos de un bosque', es: 1, explica: 'Varias especies juntas, pero solo seres vivos: comunidad.' },
  { texto: 'Las plantas, los insectos y las aves de un cafetal', es: 1, explica: 'Varias especies y nada sin vida: comunidad.' },
  { texto: 'Una laguna con sus peces, sus plantas, su agua y su fondo de lodo', es: 2, explica: 'Seres vivos más agua y lodo: ecosistema.' },
  { texto: 'Un páramo con sus frailejones, su neblina, su suelo y su frío', es: 2, explica: 'Incluye el clima y el suelo: ecosistema.' },
  { texto: 'Todos los lugares de la Tierra donde hay vida', es: 3, explica: 'Todos los ecosistemas a la vez: biosfera.' },
]

function Cual() {
  const [i, setI] = useState(0)
  const [resp, setResp] = useState<(number | null)[]>(CASOS.map(() => null))
  const c = CASOS[i]
  const elegida = resp[i]
  const aciertos = resp.filter((r, k) => r === CASOS[k].es).length
  const responder = (n: number) => {
    if (elegida !== null) return
    setResp((r) => r.map((v, k) => (k === i ? n : v)))
  }
  useFlechas((dir) => {
    setI((x) => Math.max(0, Math.min(CASOS.length - 1, x + dir)))
    return true
  })
  const ref = useRef(responder)
  ref.current = responder
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const n = Number(e.key)
      if (n >= 1 && n <= NOMBRES.length) ref.current(n - 1)
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])
  return (
    <>
      <p className="text-sm">¿Población, comunidad, ecosistema o biosfera? Teclas 1 a 4 responden y ← → cambian de caso.</p>
      <p className="mt-3 text-sm font-semibold">Caso {i + 1} de {CASOS.length} · {aciertos} aciertos</p>
      <p className="mt-2 rounded-2xl border-2 border-[var(--acento)] bg-[var(--fondo)] p-4 text-center text-lg font-bold">{c.texto}</p>
      <div role="group" aria-label="Opciones" className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
        {NOMBRES.map((n, k) => {
          const marca = elegida === null ? 'enabled:hover:border-[var(--acento)]' : k === c.es ? 'border-green-700 dark:border-green-400 bg-[var(--acento-suave)]/40' : k === elegida ? 'border-red-700 dark:border-red-400' : 'opacity-60'
          return (
            <button key={n} type="button" disabled={elegida !== null} onClick={() => responder(k)} className={`min-h-12 rounded-lg border-2 border-[var(--linea)] px-3 text-left text-sm font-semibold ${marca}`}>
              {k + 1} · {n}
            </button>
          )
        })}
      </div>
      <div aria-live="polite" className="mt-3 min-h-[4.5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
        {elegida === null ? (
          <p className="text-[var(--suave)]">Pista: ¿hay una sola especie o varias? ¿Se nombra algo sin vida?</p>
        ) : (
          <>
            <p>
              <span className="font-semibold">{elegida === c.es ? '¡Correcto!' : `Era «${NOMBRES[c.es]}».`}</span> {c.explica}
            </p>
            {i < CASOS.length - 1 ? (
              <button type="button" data-principal onClick={() => setI(i + 1)} className="mt-2 min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-bold text-[var(--sobre-acento)]">
                Siguiente ›
              </button>
            ) : (
              <button
                type="button"
                data-principal
                onClick={() => {
                  setResp(CASOS.map(() => null))
                  setI(0)
                }}
                className="mt-2 min-h-10 rounded-full border border-[var(--acento)] px-5 text-sm font-bold text-[var(--acento)]"
              >
                Empezar de nuevo
              </button>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default function NivelesMasAlla() {
  const [act, setAct] = useState<'sube' | 'cual'>('sube')
  return (
    <PantallaCompleta conBoton>
      <Pestanas valor={act} opciones={[['sube', 'Sube de nivel'], ['cual', '¿Cuál es?']]} onCambio={setAct} etiqueta="Actividad de más allá del organismo" />
      <div className="mt-3">{act === 'sube' ? <Sube /> : <Cual />}</div>
    </PantallaCompleta>
  )
}
