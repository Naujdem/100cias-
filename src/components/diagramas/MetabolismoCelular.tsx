import { useState } from 'react'
import type { ReactNode } from 'react'
import PantallaCompleta from '../PantallaCompleta.tsx'
import { Lienzo, T, Flecha } from '../ilustraciones/Dibujo.tsx'
import { Pestanas, Nota } from './TiposCelulas.tsx'

// Subtema 4.3: enzimas, ATP, respiración y fermentación, señales entre células, uniones y muerte celular.
// Esquemas sin escala; texto en borrador.

const CAJA = 'aspect-[4/3] max-h-[var(--alto-visor,38dvh)] w-full overflow-hidden rounded-xl border border-[var(--linea)]'
const Dos = ({ children }: { children: ReactNode }) => <div className="grid gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">{children}</div>
const Texto = ({ children }: { children: ReactNode }) => (
  <div aria-live="polite" className="rounded-xl bg-[var(--fondo)] p-3 text-sm">
    {children}
  </div>
)
function Deslizador({ id, etiqueta, valor, max, onCambio, rotulo }: { id: string; etiqueta: string; valor: number; max: number; onCambio: (n: number) => void; rotulo: string }) {
  return (
    <>
      <label htmlFor={id} className="mt-3 flex items-center justify-between text-sm font-semibold">
        <span>{etiqueta}</span>
        <span className="font-normal text-[var(--suave)]">{rotulo}</span>
      </label>
      <input id={id} type="range" min="0" max={max} step="1" value={valor} onChange={(e) => onCambio(Number(e.target.value))} onPointerUp={(e) => e.currentTarget.closest<HTMLElement>('[role=dialog]')?.focus()} className="mt-1 h-8 w-full accent-[var(--acento)]" />
    </>
  )
}
const Boton = ({ onClick, children, disabled }: { onClick: () => void; children: ReactNode; disabled?: boolean }) => (
  <button type="button" disabled={disabled} onClick={onClick} className="min-h-10 rounded-full bg-[var(--acento)] px-4 text-sm font-bold text-[var(--sobre-acento)] disabled:opacity-40">
    {children}
  </button>
)
function Interruptor({ activo, onCambio, children }: { activo: boolean; onCambio: (v: boolean) => void; children: ReactNode }) {
  return (
    <button type="button" aria-pressed={activo} onClick={() => onCambio(!activo)} className="min-h-10 rounded-full border border-[var(--acento)] px-3 text-sm font-semibold text-[var(--acento)] aria-pressed:bg-[var(--acento)] aria-pressed:text-[var(--sobre-acento)]">
      {children}
    </button>
  )
}
const CELULA = { fill: '#f8d9d4', stroke: '#b05a5a', strokeWidth: 3 }

/* ── Enzimas: llave y cerradura ─────────────────────────────────────────────── */

// Formas de sustrato: solo el triángulo encaja en el sitio activo de la enzima
const SUSTRATOS = [
  { id: 'tri', nombre: 'Triángulo', encaja: true },
  { id: 'cuad', nombre: 'Cuadrado', encaja: false },
  { id: 'circ', nombre: 'Círculo', encaja: false },
] as const
function Forma({ id, x, y, color }: { id: string; x: number; y: number; color: string }) {
  if (id === 'tri') return <path d={`M ${x - 22} ${y + 18} L ${x} ${y - 20} L ${x + 22} ${y + 18} Z`} fill={color} stroke="#4a3416" strokeWidth="2" />
  if (id === 'cuad') return <rect x={x - 19} y={y - 19} width="38" height="38" fill={color} stroke="#4a3416" strokeWidth="2" />
  return <circle cx={x} cy={y} r="20" fill={color} stroke="#4a3416" strokeWidth="2" />
}

export function EnzimaLlave() {
  const [modo, setModo] = useState<'rompe' | 'une'>('rompe')
  const [s, setS] = useState(0)
  const [calor, setCalor] = useState(false)
  const [paso, setPaso] = useState(0)
  const sus = SUSTRATOS[s]
  const funciona = sus.encaja && !calor
  const cambiar = (n: number) => {
    setS(n)
    setPaso(0)
  }
  const y = paso === 0 ? 70 : 172
  return (
    <PantallaCompleta conBoton>
      <Pestanas valor={modo} opciones={[['rompe', 'Romper (catabolismo)'], ['une', 'Unir (anabolismo)']]} onCambio={(m) => { setModo(m); setPaso(0) }} etiqueta="Qué hace la enzima" />
      <div className="mb-3 flex flex-wrap gap-2">
        {SUSTRATOS.map((x, n) => (
          <Interruptor key={x.id} activo={s === n} onCambio={() => cambiar(n)}>{x.nombre}</Interruptor>
        ))}
        <Interruptor activo={calor} onCambio={(v) => { setCalor(v); setPaso(0) }}>🔥 Fiebre muy alta</Interruptor>
      </div>
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta="Una enzima y su sustrato">
            {/* enzima con sitio activo en forma de triángulo; con calor se deforma */}
            <path d={calor ? 'M 90 280 Q 80 200 140 196 L 176 214 L 200 178 L 230 222 L 262 190 Q 330 200 310 280 Z' : 'M 90 280 Q 80 200 140 196 L 176 196 L 200 158 L 224 196 L 260 196 Q 320 200 310 280 Z'} fill="#9ccf86" stroke="#3f7a2a" strokeWidth="3" style={{ transition: 'd 0.5s ease' }} />
            <T x={200} y={262} s={13} b>enzima</T>
            {modo === 'rompe' ? (
              paso < 2 || !funciona ? (
                <Forma id={sus.id} x={200} y={y} color="#7fb2e5" />
              ) : (
                <>
                  <path d="M 108 92 L 126 54 L 144 92 Z" fill="#7fb2e5" stroke="#4a3416" strokeWidth="2" />
                  <path d="M 256 92 L 274 54 L 292 92 Z" fill="#7fb2e5" stroke="#4a3416" strokeWidth="2" />
                  <T x={200} y={70} s={12}>¡partido en dos!</T>
                </>
              )
            ) : paso < 2 || !funciona ? (
              <>
                <Forma id={sus.id} x={paso === 0 ? 150 : 192} y={y} color="#e0b040" />
                <Forma id={sus.id} x={paso === 0 ? 250 : 208} y={y} color="#e8806f" />
              </>
            ) : (
              <>
                <Forma id={sus.id} x={190} y={70} color="#e0b040" />
                <Forma id={sus.id} x={210} y={70} color="#e8806f" />
                <T x={200} y={30} s={12}>¡unidos en una molécula!</T>
              </>
            )}
            {paso === 1 && !funciona && <T x={200} y={130} s={13} b c="#b03030">No encaja</T>}
          </Lienzo>
        </div>
        <Texto>
          {paso === 0 && <p>La enzima tiene un hueco con forma precisa: el sitio activo. Elige una molécula y acércala.</p>}
          {paso >= 1 && funciona && <p>{paso === 1 ? 'Encaja como una llave en su cerradura.' : modo === 'rompe' ? 'La enzima rompe la molécula y queda libre para trabajar otra vez.' : 'La enzima une las dos piezas y queda libre para trabajar otra vez.'}</p>}
          {paso >= 1 && !funciona && <p>{calor ? 'Con demasiado calor la enzima se deforma: el sitio activo pierde su forma y ya no funciona. Por eso una fiebre muy alta es peligrosa.' : 'Cada enzima trabaja solo con su sustrato: esta forma no entra en el sitio activo.'}</p>}
          <div className="mt-2 flex gap-2">
            <Boton onClick={() => setPaso((p) => Math.min(2, p + 1))} disabled={paso >= 2 || (paso === 1 && !funciona)}>{paso === 0 ? 'Acercar' : 'Que actúe'}</Boton>
            <button type="button" onClick={() => setPaso(0)} className="min-h-10 rounded-full border border-[var(--linea)] px-4 text-sm font-semibold">Reiniciar</button>
          </div>
        </Texto>
      </Dos>
      <Nota>Modelo simplificado: en realidad la enzima también cambia un poco de forma al recibir el sustrato (encaje inducido).</Nota>
    </PantallaCompleta>
  )
}

/* ── ATP: la batería de la célula ──────────────────────────────────────────── */

const GASTOS = [
  { id: 'musculo', texto: 'Contraer un músculo', costo: 2 },
  { id: 'bomba', texto: 'Bombear sustancias por la membrana', costo: 1 },
  { id: 'proteina', texto: 'Fabricar una proteína', costo: 3 },
]

export function AtpPila() {
  const [cargadas, setCargadas] = useState(4)
  const [msg, setMsg] = useState('Cada pila llena es una molécula de ATP: tiene tres fosfatos. Al soltar uno, libera energía y queda ADP.')
  const gastar = (g: (typeof GASTOS)[number]) => {
    if (cargadas < g.costo) {
      setMsg(`No alcanza: «${g.texto.toLowerCase()}» necesita ${g.costo} ATP. Hay que recargar con glucosa.`)
      return
    }
    setCargadas(cargadas - g.costo)
    setMsg(`${g.texto}: se usaron ${g.costo} ATP. Cada uno soltó un fosfato y quedó como ADP, una pila descargada.`)
  }
  const recargar = () => {
    setCargadas(Math.min(10, cargadas + 4))
    setMsg('La mitocondria «quema» glucosa y usa esa energía para volver a pegar el fosfato: ADP + P → ATP. La pila se recarga.')
  }
  return (
    <PantallaCompleta conBoton>
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta={`${cargadas} de 10 moléculas de ATP cargadas`}>
            {Array.from({ length: 10 }, (_, k) => {
              const x = 30 + (k % 5) * 72
              const y = k < 5 ? 26 : 162
              const lleno = k < cargadas
              return (
                <g key={k} style={{ transition: 'opacity 0.3s' }}>
                  <rect x={x} y={y} width="56" height="84" rx="8" fill="#fbf5ee" stroke="#4a3416" strokeWidth="2" />
                  <rect x={x + 18} y={y - 8} width="20" height="8" rx="2" fill="#4a3416" />
                  {[0, 1, 2].map((f) => (
                    <rect key={f} x={x + 6} y={y + 58 - f * 26} width="44" height="21" rx="4" fill={f < 2 || lleno ? '#e0b040' : '#eee6d4'} stroke={f < 2 || lleno ? '#a07a10' : '#cbbfae'} />
                  ))}
                  <T x={x + 28} y={y + 100} s={11} b>{lleno ? 'ATP' : 'ADP'}</T>
                </g>
              )
            })}
          </Lienzo>
        </div>
        <Texto>
          <p className="font-semibold">{cargadas} ATP listos para usar</p>
          <p className="mt-1">{msg}</p>
        </Texto>
      </Dos>
      <div className="mt-3 flex flex-wrap gap-2">
        {GASTOS.map((g) => (
          <button key={g.id} type="button" onClick={() => gastar(g)} className="min-h-10 rounded-full border-2 border-[var(--acento)] px-3 text-sm font-semibold">
            {g.texto} (−{g.costo})
          </button>
        ))}
        <Boton onClick={recargar} disabled={cargadas >= 10}>⚡ Recargar con glucosa (+4)</Boton>
      </div>
      <Nota>Los costos son ilustrativos. Una célula gasta y recarga millones de ATP por segundo.</Nota>
    </PantallaCompleta>
  )
}

/* ── Respiración y fermentación ───────────────────────────────────────────── */

export function RespiracionFermentacion() {
  const [oxigeno, setOxigeno] = useState(true)
  const [ser, setSer] = useState<'musculo' | 'levadura'>('musculo')
  const atp = oxigeno ? 30 : 2
  const producto = oxigeno ? 'CO₂ + agua' : ser === 'musculo' ? 'ácido láctico' : 'alcohol + CO₂'
  return (
    <PantallaCompleta conBoton>
      <div className="mb-3 flex flex-wrap gap-2">
        <Interruptor activo={oxigeno} onCambio={setOxigeno}>Hay oxígeno</Interruptor>
        <Interruptor activo={!oxigeno} onCambio={(v) => setOxigeno(!v)}>Sin oxígeno</Interruptor>
        <span className="mx-1 self-center text-sm text-[var(--suave)]">·</span>
        <Interruptor activo={ser === 'musculo'} onCambio={() => setSer('musculo')}>Célula de músculo</Interruptor>
        <Interruptor activo={ser === 'levadura'} onCambio={() => setSer('levadura')}>Levadura</Interruptor>
      </div>
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta={`Con una glucosa la célula obtiene unos ${atp} ATP y produce ${producto}`}>
            <ellipse cx="170" cy="150" rx="160" ry="125" {...CELULA} />
            <T x={170} y={42} s={12} i>citoplasma</T>
            <rect x="40" y="70" width="90" height="34" rx="8" fill="#fbf5ee" stroke="#4a3416" strokeWidth="2" />
            <T x={85} y={92} s={13} b>glucosa</T>
            <Flecha x1={85} y1={106} x2={85} y2={146} c="#4a3416" w={2.4} />
            <T x={92} y={130} s={11} a="start">glucólisis: +2 ATP</T>
            <rect x="40" y="150" width="90" height="34" rx="8" fill="#fbf5ee" stroke="#4a3416" strokeWidth="2" />
            <T x={85} y={172} s={13} b>piruvato</T>
            {oxigeno ? (
              <>
                <Flecha x1={132} y1={167} x2={178} y2={167} c="#b3661f" w={2.4} />
                <ellipse cx="240" cy="170" rx="60" ry="36" fill="#f2c77a" stroke="#b3661f" strokeWidth="3" />
                <path d="M 196 170 q 10 -18 20 0 t 20 0 t 20 0 t 20 0" fill="none" stroke="#b3661f" strokeWidth="2" />
                <T x={240} y={226} s={11.5}>mitocondria: +28 ATP</T>
                <T x={240} y={248} s={12} b>sale: CO₂ + agua</T>
              </>
            ) : (
              <>
                <Flecha x1={85} y1={186} x2={85} y2={222} c="#7a4a8a" w={2.4} />
                <rect x="20" y="224" width="140" height="34" rx="8" fill="#ead3f2" stroke="#7a4a8a" strokeWidth="2" />
                <T x={90} y={246} s={12.5} b>{ser === 'musculo' ? 'ácido láctico' : 'alcohol + CO₂'}</T>
                <T x={250} y={172} s={11} c="#8a7a6a">la mitocondria</T>
                <T x={250} y={188} s={11} c="#8a7a6a">no trabaja sin O₂</T>
              </>
            )}
            {/* barra de ATP */}
            <rect x="350" y="40" width="30" height="220" rx="6" fill="#fbf5ee" stroke="#4a3416" strokeWidth="2" />
            <rect x="350" y={260 - (220 * atp) / 32} width="30" height={(220 * atp) / 32} rx="6" fill="#e0b040" style={{ transition: 'all 0.5s ease' }} />
            <T x={365} y={30} s={12} b>~{atp} ATP</T>
          </Lienzo>
        </div>
        <Texto>
          <p className="text-lg font-bold">{oxigeno ? 'Respiración celular' : 'Fermentación'}</p>
          {oxigeno ? (
            <p className="mt-1">Con oxígeno, el piruvato entra a la mitocondria y se «quema» del todo. Se obtienen unos 30 ATP por cada glucosa y sale CO₂ (el que exhalas) y agua.</p>
          ) : ser === 'musculo' ? (
            <p className="mt-1">Cuando corres muy rápido y no llega suficiente oxígeno, el músculo fermenta: solo saca 2 ATP por glucosa y produce ácido láctico.</p>
          ) : (
            <p className="mt-1">La levadura sin oxígeno fermenta y produce alcohol y CO₂. Las burbujas de CO₂ hacen crecer el pan; el alcohol se evapora al hornearlo.</p>
          )}
        </Texto>
      </Dos>
      <Nota>Valores aproximados: la cifra de ATP de la respiración se discute entre 30 y 36 según el libro.</Nota>
    </PantallaCompleta>
  )
}

/* ── Señales entre células ─────────────────────────────────────────────────── */

const TIPOS_SENAL = {
  contacto: { nombre: 'Por contacto', texto: 'Las células se tocan: una molécula de la membrana de una se une al receptor de la vecina. Así se reconocen las células del sistema inmune.' },
  cercana: { nombre: 'A células cercanas', texto: 'La célula suelta una señal que viaja poco. Así actúan las neuronas: liberan neurotransmisores que llegan a la célula de al lado.' },
  hormona: { nombre: 'Hormona a distancia', texto: 'La señal viaja por la sangre a todo el cuerpo, como la insulina que fabrica el páncreas. Solo responden las células que tienen el receptor.' },
}
const PASOS_SENAL = ['Se envía la señal', 'Llega al receptor', 'La célula responde']

export function SenalesCelulares() {
  const [tipo, setTipo] = useState<keyof typeof TIPOS_SENAL>('hormona')
  const [p, setP] = useState(0)
  const t = TIPOS_SENAL[tipo]
  // tres células blanco: solo la del medio tiene el receptor que encaja (forma de triángulo)
  const blancos = tipo === 'hormona' ? [[300, 70, false], [320, 160, true], [300, 250, false]] : [[tipo === 'contacto' ? 214 : 290, 150, true]]
  const sx = p === 0 ? 120 : tipo === 'hormona' ? 280 : tipo === 'contacto' ? 186 : 250
  return (
    <PantallaCompleta conBoton>
      <Pestanas valor={tipo} opciones={Object.entries(TIPOS_SENAL).map(([k, v]) => [k as keyof typeof TIPOS_SENAL, v.nombre])} onCambio={(v) => { setTipo(v); setP(0) }} etiqueta="Tipo de señal" />
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta={`${t.nombre}: ${PASOS_SENAL[p]}`}>
            <circle cx={tipo === 'contacto' ? 130 : 80} cy="150" r="56" {...CELULA} />
            <T x={tipo === 'contacto' ? 130 : 80} y={154} s={12} b>emisora</T>
            {tipo === 'hormona' && <path d="M 150 20 C 230 60 170 240 250 290" fill="none" stroke="#c96a6a" strokeWidth="22" opacity="0.25" strokeLinecap="round" />}
            {tipo === 'hormona' && <T x={176} y={286} s={11} c="#a05050">sangre</T>}
            {blancos.map(([x, y, ok], k) => (
              <g key={k}>
                <circle cx={x as number} cy={y as number} r={tipo === 'hormona' ? 40 : 56} fill={p === 2 && ok ? '#cfe8c4' : '#f8d9d4'} stroke={p === 2 && ok ? '#3f7a2a' : '#b05a5a'} strokeWidth="3" style={{ transition: 'fill 0.4s' }} />
                {/* receptor en el borde izquierdo */}
                <g transform={`translate(${(x as number) - (tipo === 'hormona' ? 40 : 56)} ${y})`}>
                  {ok ? <path d="M -2 -12 L -14 -12 L -8 0 L -14 12 L -2 12" fill="none" stroke="#3f7a2a" strokeWidth="4" /> : <rect x="-12" y="-9" width="12" height="18" fill="none" stroke="#8a7a6a" strokeWidth="4" />}
                </g>
                {p === 2 && ok && <T x={x as number} y={(y as number) + 5} s={11} b>¡responde!</T>}
                {p === 2 && !ok && <T x={x as number} y={(y as number) + 5} s={10} c="#8a7a6a">sin receptor</T>}
              </g>
            ))}
            {tipo === 'contacto' ? (
              <path d={`M ${sx - 14} 138 L ${sx} 150 L ${sx - 14} 162 Z`} fill="#e0b040" stroke="#7a4a10" strokeWidth="2" style={{ transition: 'all 0.6s ease' }} />
            ) : (
              <path d={`M ${sx - 10} ${p === 0 ? 140 : 150} l 12 10 l -12 10 Z`} transform={tipo === 'hormona' && p > 0 ? 'translate(0 10)' : undefined} fill="#e0b040" stroke="#7a4a10" strokeWidth="2" style={{ transition: 'all 0.6s ease' }} />
            )}
          </Lienzo>
        </div>
        <Texto>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--acento)]">{PASOS_SENAL[p]}</p>
          <p className="mt-1">{t.texto}</p>
          {p === 2 && <p className="mt-2 text-[var(--suave)]">La señal y su receptor encajan como llave y cerradura. La respuesta puede ser dividirse, fabricar algo, moverse… o morir.</p>}
        </Texto>
      </Dos>
      <Deslizador id="senal-paso" etiqueta="Avanza" valor={p} max={2} onCambio={setP} rotulo={PASOS_SENAL[p]} />
    </PantallaCompleta>
  )
}

/* ── Uniones entre células ─────────────────────────────────────────────────── */

const UNIONES = {
  estrecha: { nombre: 'Estrechas (sellan)', accion: 'Echar un colorante', texto: 'Cosen las membranas como una cremallera. Nada pasa entre las células: así el intestino no deja escapar su contenido.' },
  anclaje: { nombre: 'De anclaje (sujetan)', accion: 'Estirar el tejido', texto: 'Como remaches unidos al citoesqueleto: mantienen la piel unida aunque la estires o la frotes.' },
  comunicante: { nombre: 'Comunicantes (canales)', accion: 'Enviar una señal', texto: 'Pequeños canales que conectan el citoplasma de dos vecinas. En el corazón dejan pasar la señal para que todas las células se contraigan juntas.' },
}

export function UnionesCelulares() {
  const [u, setU] = useState<keyof typeof UNIONES>('estrecha')
  const [activa, setActiva] = useState(false)
  const [con, setCon] = useState(true)
  const x = UNIONES[u]
  const separa = u === 'anclaje' && activa && !con ? 22 : u === 'anclaje' && activa ? 6 : 0
  return (
    <PantallaCompleta conBoton>
      <Pestanas valor={u} opciones={Object.entries(UNIONES).map(([k, v]) => [k as keyof typeof UNIONES, v.nombre])} onCambio={(v) => { setU(v); setActiva(false) }} etiqueta="Tipo de unión" />
      <div className="mb-3 flex flex-wrap gap-2">
        <Boton onClick={() => setActiva(!activa)}>{activa ? 'Reiniciar' : x.accion}</Boton>
        <Interruptor activo={con} onCambio={(v) => { setCon(v); setActiva(false) }}>Con uniones</Interruptor>
      </div>
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta={`Uniones ${x.nombre}`}>
            {u === 'estrecha' && <rect x="20" y="30" width="360" height="50" fill={activa ? '#7fb2e5' : '#fbf5ee'} opacity="0.6" style={{ transition: 'fill 0.4s' }} />}
            {u === 'estrecha' && <T x={200} y={60} s={12}>interior del intestino</T>}
            {[0, 1, 2, 3].map((k) => {
              const cx = 65 + k * 90 + (k - 1.5) * separa * 2
              return (
                <g key={k} style={{ transition: 'all 0.5s ease' }}>
                  <rect x={cx - 42} y="84" width="84" height="150" rx="10" {...CELULA} />
                  <circle cx={cx} cy="170" r="16" fill="#ead3f2" stroke="#7a4a8a" strokeWidth="2" />
                  {u === 'comunicante' && activa && (con || k === 0) && <rect x={cx - 42} y="84" width="84" height="150" rx="10" fill="#e0b040" opacity={0.5 - k * 0.08} />}
                </g>
              )
            })}
            {con &&
              [0, 1, 2].map((k) => {
                const mx = 110 + k * 90 + (k - 1) * separa * 2
                if (u === 'estrecha') return <path key={k} d={`M ${mx} 86 v 18`} stroke="#3f7a2a" strokeWidth="6" strokeDasharray="3 2" />
                if (u === 'anclaje') return <g key={k}>{[140, 200].map((y) => <rect key={y} x={mx - 6 - separa} y={y - 6} width={12 + separa * 2} height="12" rx="3" fill="#7a4a10" />)}</g>
                return <g key={k}>{[130, 170, 210].map((y) => <rect key={y} x={mx - 5} y={y - 4} width="10" height="8" fill="#fbf5ee" stroke="#3b6fb6" strokeWidth="2" />)}</g>
              })}
            {u === 'estrecha' && activa && !con && [0, 1, 2].map((k) => <path key={k} d={`M ${110 + k * 90} 84 V 230`} stroke="#7fb2e5" strokeWidth="5" opacity="0.8" />)}
            {u === 'anclaje' && activa && (
              <>
                <Flecha x1={40} y1={270} x2={8} y2={270} c="#4a3416" w={2.4} />
                <Flecha x1={360} y1={270} x2={392} y2={270} c="#4a3416" w={2.4} />
              </>
            )}
          </Lienzo>
        </div>
        <Texto>
          <p className="text-lg font-bold">{x.nombre}</p>
          <p className="mt-1">{x.texto}</p>
          {activa && (
            <p className="mt-2 font-semibold">
              {u === 'estrecha' && (con ? 'El colorante se queda arriba: no se cuela entre las células.' : 'Sin uniones, el colorante se cuela entre las células.')}
              {u === 'anclaje' && (con ? 'El tejido se estira, pero no se separa.' : 'Sin uniones, las células se separan: así se forman algunas ampollas.')}
              {u === 'comunicante' && (con ? 'La señal pasa de una célula a la siguiente.' : 'Sin canales, la señal se queda en la primera célula.')}
            </p>
          )}
        </Texto>
      </Dos>
    </PantallaCompleta>
  )
}

/* ── Muerte celular: apoptosis y necrosis ─────────────────────────────────── */

const PASOS_MUERTE = [
  ['Célula sana', 'Célula sana'],
  ['Recibe la orden y se encoge', 'Un golpe, quemadura o falta de sangre la daña: se hincha'],
  ['Se parte en pedacitos envueltos en membrana', 'La membrana revienta y el contenido se derrama'],
  ['Un macrófago se los come: limpio, sin inflamación', 'Llegan defensas y el tejido se inflama'],
]

export function MuerteCelular() {
  const [modo, setModo] = useState<'compara' | 'dedos'>('compara')
  const [p, setP] = useState(0)
  return (
    <PantallaCompleta conBoton>
      <Pestanas valor={modo} opciones={[['compara', 'Apoptosis vs necrosis'], ['dedos', 'Los dedos del embrión']]} onCambio={(m) => { setModo(m); setP(0) }} etiqueta="Qué ver" />
      {modo === 'compara' ? (
        <>
          <div className="grid gap-3 lg:grid-cols-2">
            {[0, 1].map((lado) => (
              <div key={lado}>
                <p className="mb-1 text-sm font-semibold">{lado === 0 ? 'Apoptosis (muerte programada)' : 'Necrosis (muerte por daño)'}</p>
                <div className={CAJA}>
                  <Lienzo etiqueta={PASOS_MUERTE[p][lado]}>
                    {lado === 0 ? <Apoptosis p={p} /> : <Necrosis p={p} />}
                  </Lienzo>
                </div>
                <p className="mt-1 text-sm">{PASOS_MUERTE[p][lado]}</p>
              </div>
            ))}
          </div>
          <Deslizador id="muerte-paso" etiqueta="Avanza" valor={p} max={3} onCambio={setP} rotulo={`${p + 1} de 4`} />
        </>
      ) : (
        <>
          <Dos>
            <div className={CAJA}>
              <Lienzo etiqueta="Mano del embrión">
                <path d="M 140 290 L 140 200 Q 100 190 100 120 Q 100 40 200 40 Q 300 40 300 120 Q 300 190 260 200 L 260 290 Z" fill="#f2c4a8" opacity={1 - p / 3} stroke="#b07a5a" strokeWidth="2" />
                {[[120, 60], [160, 40], [200, 34], [240, 40], [280, 70]].map(([x, y], k) => (
                  <rect key={k} x={x - 14} y={y} width="28" height={190 - y} rx="14" fill="#e8a888" stroke="#b07a5a" strokeWidth="2" transform={k === 4 ? `rotate(25 ${x} 200)` : k === 0 ? `rotate(-12 ${x} 200)` : undefined} />
                ))}
                <rect x="140" y="190" width="120" height="100" rx="10" fill="#e8a888" />
                {p > 0 && p < 3 && [140, 180, 220, 260].map((x) => <circle key={x} cx={x} cy={90} r="4" fill="#7a4a8a" opacity="0.7" />)}
              </Lienzo>
            </div>
            <Texto>
              <p>{['Al principio, la mano del embrión es una paleta: los dedos están unidos por tejido.', 'Las células entre los dedos reciben la orden de morir por apoptosis (puntos morados).', 'Esas células se desarman sin hacer daño y los macrófagos las limpian.', '¡Dedos separados! La apoptosis también da forma al cuerpo.'][p]}</p>
            </Texto>
          </Dos>
          <Deslizador id="dedos-paso" etiqueta="Semanas de desarrollo" valor={p} max={3} onCambio={setP} rotulo={`${p + 1} de 4`} />
        </>
      )}
    </PantallaCompleta>
  )
}

function Apoptosis({ p }: { p: number }) {
  if (p <= 1)
    return (
      <>
        <circle cx="200" cy="150" r={p === 0 ? 90 : 62} {...CELULA} style={{ transition: 'r 0.5s ease' }} />
        <circle cx="200" cy="150" r={p === 0 ? 32 : 22} fill={p === 0 ? '#ead3f2' : '#7a4a8a'} stroke="#7a4a8a" strokeWidth="2" />
      </>
    )
  const trozos = [[170, 120], [230, 125], [190, 180], [245, 175], [150, 165]]
  return (
    <>
      {p === 3 && (
        <>
          <path d="M 60 220 Q 40 140 120 110 Q 200 90 280 120 Q 360 150 330 230 Q 300 280 200 270 Q 90 270 60 220 Z" fill="#cfe0f2" stroke="#3b6fb6" strokeWidth="3" />
          <T x={200} y={255} s={12} b>macrófago</T>
        </>
      )}
      {trozos.map(([x, y], k) => (
        <circle key={k} cx={p === 3 ? 160 + (k % 3) * 35 : x} cy={p === 3 ? 160 + Math.floor(k / 3) * 30 : y} r="20" {...CELULA} />
      ))}
    </>
  )
}

function Necrosis({ p }: { p: number }) {
  return (
    <>
      {p <= 1 && <circle cx="200" cy="150" r={p === 0 ? 90 : 112} {...CELULA} style={{ transition: 'r 0.5s ease' }} />}
      {p <= 1 && <circle cx="200" cy="150" r="32" fill="#ead3f2" stroke="#7a4a8a" strokeWidth="2" />}
      {p >= 2 && (
        <>
          <path d="M 110 150 A 90 90 0 0 1 270 90 M 290 130 A 90 90 0 0 1 200 240 M 170 236 A 90 90 0 0 1 112 186" fill="none" stroke="#b05a5a" strokeWidth="4" />
          {Array.from({ length: 16 }, (_, k) => {
            const a = (k / 16) * Math.PI * 2
            const r = 120 + (k % 3) * 22
            return <circle key={k} cx={200 + r * Math.cos(a)} cy={150 + r * Math.sin(a) * 0.8} r="5" fill="#c96a6a" />
          })}
        </>
      )}
      {p === 3 && (
        <>
          <rect x="-50" y="-50" width="500" height="400" fill="#e86a4a" opacity="0.15" />
          {[[60, 60], [340, 70], [70, 250], [330, 240]].map(([x, y], k) => (
            <circle key={k} cx={x} cy={y} r="18" fill="#cfe0f2" stroke="#3b6fb6" strokeWidth="2" />
          ))}
          <T x={200} y={290} s={12} b c="#b03030">inflamación</T>
        </>
      )}
    </>
  )
}
