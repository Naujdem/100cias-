import { useEffect, useRef, useState } from 'react'
import PantallaCompleta from '../PantallaCompleta.tsx'
import { Lienzo } from '../ilustraciones/Dibujo.tsx'
import { Mito } from '../ilustraciones/CelulaEuc.tsx'
import { useFlechas } from '../../lib/flechasDiagrama.ts'

const boton = 'mt-3 min-h-11 rounded-full bg-[var(--acento)] px-6 font-bold text-[var(--sobre-acento)]'
function leer(clave: string): number {
  try {
    return Number(localStorage.getItem(clave)) || 0
  } catch {
    return 0
  }
}
function guardar(clave: string, v: number) {
  try {
    localStorage.setItem(clave, String(v))
  } catch {
    /* sin almacenamiento */
  }
}
function useTeclas(mapa: Record<string, () => void>) {
  const ref = useRef(mapa)
  ref.current = mapa
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return
      const g = ref.current[e.key.toLowerCase()]
      if (g) {
        e.preventDefault()
        g()
      }
    }
    document.addEventListener('keydown', f)
    return () => document.removeEventListener('keydown', f)
  }, [])
}

/* ── Mitocondria: «¡Que no se acabe la energía!» ───────────────────────── */
const DURA = 45
const MAX = 100
const ETAPAS = [
  { desde: 0, nombre: 'Descansando', gasto: 3, icono: '🧍' },
  { desde: 15, nombre: 'Caminando', gasto: 5, icono: '🚶' },
  { desde: 30, nombre: 'Corriendo', gasto: 7, icono: '🏃' },
]
const CLAVE_MITO = 'cien:mito-mejor'

function Barra({ nombre, valor, max, color, aviso }: { nombre: string; valor: number; max: number; color: string; aviso?: boolean }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-semibold"><span>{nombre}</span><span>{Math.round(valor)}</span></div>
      <div className={`mt-1 h-3 overflow-hidden rounded-full bg-[var(--linea)] ${aviso ? 'ring-2 ring-red-600' : ''}`}>
        <div className="h-full transition-[width] duration-300" style={{ width: `${Math.max(0, Math.min(100, (valor / max) * 100))}%`, background: color }} />
      </div>
    </div>
  )
}

export function MitocondriaJuego() {
  const [fase, setFase] = useState<'inicio' | 'juego' | 'fin'>('inicio')
  const [t, setT] = useState(0)
  const [atp, setAtp] = useState(60)
  const [glu, setGlu] = useState(2)
  const [oxi, setOxi] = useState(2)
  const [lac, setLac] = useState(0)
  const [evento, setEvento] = useState('')
  const [motivo, setMotivo] = useState('')
  const [mejor, setMejor] = useState(() => leer(CLAVE_MITO))
  const etapa = [...ETAPAS].reverse().find((e) => t >= e.desde)!

  const s = useRef({ atp, glu, oxi, lac, t })
  s.current = { atp, glu, oxi, lac, t }

  useEffect(() => {
    if (fase !== 'juego') return
    const id = setInterval(() => {
      let { atp, glu, oxi, lac, t } = s.current
      const gasto = [...ETAPAS].reverse().find((e) => t >= e.desde)!.gasto
      let ev = ''
      if (glu > 0 && oxi > 0) {
        glu--; oxi--; atp += 9; lac = Math.max(0, lac - 1); ev = 'Respiración: +9 ATP'
      } else if (glu > 0) {
        glu--; atp += 2; lac += 2; ev = 'Sin oxígeno: fermentación, +2 ATP y ácido láctico'
      } else ev = 'Sin glucosa: no hay combustible'
      atp = Math.min(MAX, atp - gasto)
      t++
      setGlu(glu); setOxi(oxi); setLac(lac); setAtp(atp); setT(t); setEvento(ev)
      const fin = atp <= 0 ? 'Se acabó el ATP: el músculo se detuvo.' : lac >= 10 ? '¡Calambre! Demasiado ácido láctico.' : t >= DURA ? '' : null
      if (fin !== null) {
        setMotivo(fin)
        setFase('fin')
        const puntos = t + Math.max(0, Math.round(atp))
        if (puntos > leer(CLAVE_MITO)) { guardar(CLAVE_MITO, puntos); setMejor(puntos) }
      }
    }, 1000)
    return () => clearInterval(id)
  }, [fase])

  const empezar = () => { setT(0); setAtp(60); setGlu(2); setOxi(2); setLac(0); setEvento(''); setMotivo(''); setFase('juego') }
  const darGlu = () => fase === 'juego' && setGlu((g) => Math.min(5, g + 1))
  const darOxi = () => fase === 'juego' && setOxi((o) => Math.min(5, o + 1))
  useTeclas({ g: darGlu, o: darOxi, '1': darGlu, '2': darOxi })
  useFlechas(() => fase === 'juego')

  if (fase === 'inicio') {
    return (
      <PantallaCompleta conBoton>
        <h4 className="text-lg font-bold">¡Que no se acabe la energía!</h4>
        <p className="mt-1 text-sm">Eres la mitocondria de una célula de músculo. Durante {DURA} segundos la persona pasa de descansar a caminar y a correr, y cada vez gasta más ATP. Dale glucosa y oxígeno para fabricar ATP.</p>
        <p className="mt-2 text-sm">Con glucosa y oxígeno: mucho ATP. Solo con glucosa: fermentación, poco ATP y ácido láctico. Si el ácido láctico llega al tope: ¡calambre! Teclas: G (o 1) glucosa, O (o 2) oxígeno.</p>
        <button type="button" data-principal onClick={empezar} className={boton}>¡Arranca!</button>
        {mejor > 0 && <p className="mt-2 text-sm text-[var(--suave)]">Tu mejor puntaje: {mejor}</p>}
      </PantallaCompleta>
    )
  }
  if (fase === 'fin') {
    const gano = motivo === ''
    const puntos = t + Math.max(0, Math.round(atp))
    return (
      <PantallaCompleta conBoton>
        <h4 className="text-lg font-bold">{gano ? '¡Terminó la carrera!' : motivo}</h4>
        <p aria-live="polite" className="mt-1"><span className="text-2xl font-bold">{puntos} puntos</span> · {t} s aguantados + {Math.max(0, Math.round(atp))} ATP de sobra{puntos >= mejor ? ' · ¡es tu mejor puntaje!' : ` · tu mejor: ${mejor}`}</p>
        <p className="mt-3 text-sm">Por eso respiramos más rápido al correr: el músculo necesita más oxígeno para que la mitocondria haga ATP. Sin oxígeno suficiente, fermenta y se acumula ácido láctico.</p>
        <button type="button" data-principal onClick={empezar} className={boton}>Jugar otra vez</button>
      </PantallaCompleta>
    )
  }
  const trabajando = evento.startsWith('Resp')
  return (
    <PantallaCompleta conBoton>
      <div className="flex flex-wrap items-center gap-x-4 text-sm font-semibold">
        <span className="text-lg">{etapa.icono} {etapa.nombre}</span>
        <span>⏱ {DURA - t} s</span>
        <span className="text-[var(--suave)]">gasta {etapa.gasto} ATP/s</span>
      </div>
      <div className="mt-3 grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="aspect-[4/3] max-h-[34dvh] w-full overflow-hidden rounded-xl border border-[var(--linea)]">
          <Lienzo etiqueta="Mitocondria">
            <rect x="0" y="0" width="400" height="300" fill={lac >= 7 ? '#f6d6cf' : '#f8efe6'} style={{ transition: 'fill 0.5s' }} />
            <g transform="translate(200 150)" style={{ transition: 'transform 0.3s' }}>
              <g style={{ transform: `scale(${trabajando ? 1.06 : 1})`, transition: 'transform 0.3s' }}><Mito k={2.6} /></g>
            </g>
            <text x="200" y="270" textAnchor="middle" fontSize="16" fontWeight="800" fill={trabajando ? '#0f6e56' : '#a33'}>{evento || 'Esperando combustible…'}</text>
          </Lienzo>
        </div>
        <div className="grid gap-3">
          <Barra nombre="⚡ ATP" valor={atp} max={MAX} color="#e0a030" aviso={atp < 20} />
          <Barra nombre="🍬 Glucosa" valor={glu} max={5} color="#c9a23a" />
          <Barra nombre="🫁 Oxígeno" valor={oxi} max={5} color="#3b6fb6" />
          <Barra nombre="🥛 Ácido láctico" valor={lac} max={10} color="#c43c3c" aviso={lac >= 7} />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" onClick={darGlu} className="min-h-14 rounded-xl border-2 border-[var(--linea)] font-bold enabled:hover:border-[var(--acento)]"><span className="text-xs text-[var(--suave)]">G · </span>🍬 Dar glucosa</button>
        <button type="button" onClick={darOxi} className="min-h-14 rounded-xl border-2 border-[var(--linea)] font-bold enabled:hover:border-[var(--acento)]"><span className="text-xs text-[var(--suave)]">O · </span>🫁 Dar oxígeno</button>
      </div>
    </PantallaCompleta>
  )
}

/* ── Núcleo: «Copia la receta» ──────────────────────────────────────────── */
const PAR: Record<string, string> = { A: 'U', T: 'A', G: 'C', C: 'G' }
const BASES_ARN = ['A', 'U', 'G', 'C']
const COLOR: Record<string, string> = { A: '#d9822b', T: '#3b6fb6', U: '#7a4ab0', G: '#2f8a4f', C: '#c43c3c' }
const HEBRAS = 3
const LARGO = 8
const CLAVE_NUC = 'cien:nucleo-mejor'

const hebra = () => Array.from({ length: LARGO }, () => 'ATGC'[Math.floor(Math.random() * 4)])

export function NucleoJuego() {
  const [fase, setFase] = useState<'inicio' | 'juego' | 'fin'>('inicio')
  const [adn, setAdn] = useState<string[]>([])
  const [arn, setArn] = useState<string[]>([])
  const [n, setN] = useState(0)
  const [errores, setErrores] = useState(0)
  const [fallo, setFallo] = useState<string | null>(null)
  const [inicio, setInicio] = useState(0)
  const [seg, setSeg] = useState(0)
  const [mejor, setMejor] = useState(() => leer(CLAVE_NUC))
  const lista = arn.length === LARGO

  const empezar = () => { setAdn(hebra()); setArn([]); setN(0); setErrores(0); setFallo(null); setInicio(Date.now()); setFase('juego') }
  const poner = (b: string) => {
    if (fase !== 'juego' || lista) return
    const bien = PAR[adn[arn.length]]
    if (b === bien) { setArn((a) => [...a, b]); setFallo(null) } else { setErrores((e) => e + 1); setFallo(b) }
  }
  const siguiente = () => {
    if (!lista) return
    if (n >= HEBRAS - 1) {
      const s = Math.round((Date.now() - inicio) / 1000) + errores * 2
      setSeg(s); setFase('fin')
      if (!mejor || s < mejor) { guardar(CLAVE_NUC, s); setMejor(s) }
    } else { setN(n + 1); setAdn(hebra()); setArn([]); setFallo(null) }
  }
  useTeclas({ '1': () => poner('A'), '2': () => poner('U'), '3': () => poner('G'), '4': () => poner('C'), a: () => poner('A'), u: () => poner('U'), g: () => poner('G'), c: () => poner('C'), enter: siguiente })
  useFlechas((dir) => {
    if (fase !== 'juego') return false
    if (dir === 1) siguiente()
    return true
  })

  if (fase === 'inicio') {
    return (
      <PantallaCompleta conBoton>
        <h4 className="text-lg font-bold">Copia la receta</h4>
        <p className="mt-1 text-sm">El ADN no sale del núcleo: se copia en ARN mensajero. Arma la copia de {HEBRAS} hebras de ADN, base por base, lo más rápido que puedas. Cada error suma 2 segundos.</p>
        <p className="mt-2 text-sm font-semibold">Reglas de pareja: A → U · T → A · G → C · C → G</p>
        <p className="mt-1 text-sm">Teclas: A, U, G, C (o 1 a 4). Enter o → para la siguiente hebra.</p>
        <button type="button" data-principal onClick={empezar} className={boton}>¡Arranca!</button>
        {mejor > 0 && <p className="mt-2 text-sm text-[var(--suave)]">Tu mejor tiempo: {mejor} s</p>}
      </PantallaCompleta>
    )
  }
  if (fase === 'fin') {
    return (
      <PantallaCompleta conBoton>
        <h4 className="text-lg font-bold">¡Recetas copiadas!</h4>
        <p aria-live="polite" className="mt-1"><span className="text-2xl font-bold">{seg} s</span> · {errores} {errores === 1 ? 'error' : 'errores'}{seg <= mejor ? ' · ¡es tu mejor tiempo!' : ` · tu mejor: ${mejor} s`}</p>
        <p className="mt-3 text-sm">El ARN usa U (uracilo) donde el ADN tendría T. Esta copia sale del núcleo y un ribosoma la lee para armar la proteína.</p>
        <button type="button" data-principal onClick={empezar} className={boton}>Jugar otra vez</button>
      </PantallaCompleta>
    )
  }
  const Ficha = ({ b, vacia, activa }: { b?: string; vacia?: boolean; activa?: boolean }) => (
    <div className={`flex h-12 w-10 items-center justify-center rounded-lg text-xl font-extrabold text-white sm:h-14 sm:w-12 ${vacia ? 'border-2 border-dashed bg-transparent' : ''} ${activa ? 'border-[var(--acento)] ring-2 ring-[var(--acento)]' : 'border-[var(--linea)]'}`} style={b ? { background: COLOR[b] } : undefined}>
      {b}
    </div>
  )
  return (
    <PantallaCompleta conBoton>
      <div className="flex flex-wrap items-center gap-x-4 text-sm font-semibold">
        <span>Hebra {n + 1} de {HEBRAS}</span>
        {errores > 0 && <span className="text-red-800 dark:text-red-300">{errores} {errores === 1 ? 'error' : 'errores'}</span>}
      </div>
      <div className="mt-4 overflow-x-auto">
        <p className="text-sm font-bold text-[var(--suave)]">ADN (se queda en el núcleo)</p>
        <div className="mt-1 flex gap-1.5">{adn.map((b, k) => <Ficha key={k} b={b} />)}</div>
        <div className="my-1 flex gap-1.5">{adn.map((_, k) => <div key={k} className="w-10 text-center text-[var(--suave)] sm:w-12">{k < arn.length ? '┃' : '┊'}</div>)}</div>
        <div className={`flex gap-1.5 transition-transform duration-700 ${lista ? 'translate-x-6' : ''}`}>{adn.map((_, k) => <Ficha key={k} b={arn[k]} vacia={!arn[k]} activa={k === arn.length} />)}</div>
        <p className="mt-1 text-sm font-bold text-[var(--suave)]">ARN mensajero (sale del núcleo)</p>
      </div>
      <p aria-live="polite" className="mt-3 min-h-6 text-sm font-semibold">
        {lista ? '¡Copia lista! El ARN sale hacia el ribosoma.' : fallo ? `${fallo} no se empareja con ${adn[arn.length]}. Recuerda: A→U, T→A, G→C, C→G.` : `¿Qué base va frente a ${adn[arn.length]}?`}
      </p>
      {lista ? (
        <button type="button" data-principal onClick={siguiente} className={boton}>{n >= HEBRAS - 1 ? 'Ver tiempo' : 'Siguiente hebra ›'}</button>
      ) : (
        <div role="group" aria-label="Bases del ARN" className="mt-2 grid grid-cols-4 gap-2">
          {BASES_ARN.map((b, k) => (
            <button key={b} type="button" onClick={() => poner(b)} className={`min-h-14 rounded-xl border-2 text-xl font-extrabold ${fallo === b ? 'border-red-700' : 'border-[var(--linea)] hover:border-[var(--acento)]'}`}>
              <span className="text-xs text-[var(--suave)]">{k + 1} · </span><span style={{ color: COLOR[b] }}>{b}</span>
            </button>
          ))}
        </div>
      )}
    </PantallaCompleta>
  )
}
