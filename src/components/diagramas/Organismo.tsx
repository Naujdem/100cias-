import { useState } from 'react'
import type { ReactNode } from 'react'
import PantallaCompleta from '../PantallaCompleta.tsx'
import { Lienzo, T, Flecha } from '../ilustraciones/Dibujo.tsx'
import { Pestanas, Nota } from './TiposCelulas.tsx'

// Tema 5: diferenciación, células madre, tejidos animales y vegetales, órganos y reproducción.
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
const CEL = { fill: '#f8d9d4', stroke: '#b05a5a', strokeWidth: 2.5 }
const NUC = { fill: '#ead3f2', stroke: '#7a4a8a', strokeWidth: 2 }

/* ── Dibujos de células especializadas (centradas en 0,0, ~120 px) ────────── */

export function CelulaTipo({ id }: { id: string }) {
  switch (id) {
    case 'neurona':
      return (
        <g>
          {[0, 50, 110, 160, 220, 300].map((a) => (
            <path key={a} d={`M 0 0 L ${40 * Math.cos((a * Math.PI) / 180)} ${40 * Math.sin((a * Math.PI) / 180)} l ${10 * Math.cos(((a + 30) * Math.PI) / 180)} ${10 * Math.sin(((a + 30) * Math.PI) / 180)}`} stroke="#b05a5a" strokeWidth="4" fill="none" strokeLinecap="round" />
          ))}
          <path d="M 18 0 H 110 l 10 -8 M 110 0 l 10 8" stroke="#b05a5a" strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle r="22" {...CEL} />
          <circle r="9" {...NUC} />
        </g>
      )
    case 'musculo':
      return (
        <g>
          <rect x="-90" y="-18" width="180" height="36" rx="18" {...CEL} />
          {[-70, -50, -30, -10, 10, 30, 50, 70].map((x) => <line key={x} x1={x} y1="-16" x2={x} y2="16" stroke="#b05a5a" strokeWidth="1.5" opacity="0.6" />)}
          {[-55, 0, 55].map((x) => <ellipse key={x} cx={x} cy="0" rx="9" ry="5" {...NUC} />)}
        </g>
      )
    case 'sangre':
      return (
        <g>
          {[[-30, -10], [25, -18], [0, 22]].map(([x, y], k) => (
            <g key={k}>
              <ellipse cx={x} cy={y} rx="24" ry="22" fill="#e86a5a" stroke="#a03030" strokeWidth="2" />
              <ellipse cx={x} cy={y} rx="10" ry="8" fill="#c94a3a" />
            </g>
          ))}
        </g>
      )
    case 'piel':
      return (
        <g>
          {[-60, -20, 20, 60].map((x) => (
            <g key={x}>
              <rect x={x - 20} y="-26" width="40" height="52" {...CEL} />
              <circle cx={x} cy="4" r="7" {...NUC} />
            </g>
          ))}
          <line x1="-84" y1="30" x2="84" y2="30" stroke="#7a4a10" strokeWidth="3" />
        </g>
      )
    case 'hueso':
      return (
        <g>
          <circle r="54" fill="#efe6cf" stroke="#a08a5a" strokeWidth="2" />
          {[18, 32, 46].map((r) => <circle key={r} r={r} fill="none" stroke="#c8b78a" strokeWidth="2" />)}
          <circle r="8" fill="#d9c8a0" />
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx={32 * Math.cos((a * Math.PI) / 180)} cy={32 * Math.sin((a * Math.PI) / 180)} rx="6" ry="3.5" fill="#b05a5a" />
          ))}
        </g>
      )
    default:
      return (
        <g>
          <circle r="34" {...CEL} />
          <circle r="16" {...NUC} />
        </g>
      )
  }
}

/* ── Diferenciación: el mismo libro, distintas páginas ─────────────────────── */

const GENES = ['respirar', 'copiar ADN', 'hemoglobina', 'queratina', 'contracción', 'impulsos', 'calcio', 'insulina']
const TIPOS = [
  { id: 'neurona', nombre: 'Neurona', genes: [0, 1, 5], texto: 'Enciende los genes para transmitir impulsos nerviosos. Tiene prolongaciones largas para comunicarse.' },
  { id: 'musculo', nombre: 'Músculo', genes: [0, 1, 4], texto: 'Enciende los genes de las proteínas que se contraen. Es larga y tiene varios núcleos.' },
  { id: 'sangre', nombre: 'Glóbulo rojo', genes: [0, 2], texto: 'Se llena de hemoglobina para llevar oxígeno. Al madurar pierde el núcleo (en los mamíferos).' },
  { id: 'piel', nombre: 'Piel', genes: [0, 1, 3], texto: 'Fabrica queratina, una proteína resistente que protege. Sus células forman capas apretadas.' },
  { id: 'hueso', nombre: 'Hueso', genes: [0, 1, 6], texto: 'Las células del hueso depositan calcio a su alrededor y forman una matriz dura.' },
]

export function Diferenciacion() {
  const [i, setI] = useState(0)
  const t = TIPOS[i]
  return (
    <PantallaCompleta conBoton>
      <Pestanas valor={String(i)} opciones={TIPOS.map((x, k) => [String(k), x.nombre])} onCambio={(v) => setI(Number(v))} etiqueta="Tipo de célula" />
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta={`${t.nombre}: genes encendidos ${t.genes.map((g) => GENES[g]).join(', ')}`}>
            <g transform="translate(200 95)">
              <CelulaTipo id={t.id} />
            </g>
            <T x={200} y={190} s={12} b>El mismo ADN en todas las células:</T>
            {GENES.map((g, k) => {
              const on = t.genes.includes(k)
              const x = 14 + k * 47.5
              return (
                <g key={g}>
                  <rect x={x} y="202" width="44" height="40" rx="6" fill={on ? '#e0b040' : '#e8e2d6'} stroke={on ? '#a07a10' : '#c8bfae'} strokeWidth="2" style={{ transition: 'fill 0.4s' }} />
                  <T x={x + 22} y={262} s={8.5}>{g}</T>
                  <T x={x + 22} y={228} s={13} b c={on ? '#4a3416' : '#a89a86'}>{on ? 'ON' : 'off'}</T>
                </g>
              )
            })}
          </Lienzo>
        </div>
        <Texto>
          <p className="text-lg font-bold">{t.nombre}</p>
          <p className="mt-1">{t.texto}</p>
          <p className="mt-2 text-[var(--suave)]">Todas tienen el mismo libro de instrucciones (ADN); cada una lee solo algunas páginas. Eso es diferenciarse.</p>
        </Texto>
      </Dos>
      <Nota>Se muestran 8 genes como ejemplo; una célula humana tiene unos 20.000 genes.</Nota>
    </PantallaCompleta>
  )
}

/* ── Células madre: cuánto pueden llegar a ser ─────────────────────────────── */

const POTENCIA = [
  { nombre: 'Cigoto (totipotente)', alcanza: [0, 1, 2, 3, 4, 5], texto: 'La primera célula puede formar todo: el cuerpo entero y también la placenta.' },
  { nombre: 'Embrión temprano (pluripotente)', alcanza: [0, 1, 2, 3, 4], texto: 'Las células del interior del embrión de pocos días pueden formar cualquier tejido del cuerpo, pero no la placenta.' },
  { nombre: 'Médula ósea del adulto (multipotente)', alcanza: [2], texto: 'Las células madre adultas solo forman algunos tipos: las de la médula ósea forman las células de la sangre. Por eso sirven los trasplantes de médula.' },
  { nombre: 'Célula ya diferenciada', alcanza: [], texto: 'Una neurona o una célula de músculo ya no cambia de tipo: está especializada. (En el laboratorio se ha logrado «reprogramar» algunas.)' },
]
const DESTINOS = ['neurona', 'musculo', 'sangre', 'piel', 'hueso', 'placenta']

export function CelulasMadre() {
  const [i, setI] = useState(0)
  const p = POTENCIA[i]
  return (
    <PantallaCompleta conBoton>
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta={`${p.nombre}: puede formar ${p.alcanza.length} de 6 tipos`}>
            <circle cx="200" cy="150" r="34" fill={i === 3 ? '#e8e2d6' : '#cfe8c4'} stroke="#3f7a2a" strokeWidth="3" />
            <T x={200} y={155} s={11} b>{['cigoto', 'embrión', 'médula', 'neurona'][i]}</T>
            {DESTINOS.map((d, k) => {
              const a = (k / 6) * Math.PI * 2 - Math.PI / 2
              const x = 200 + 125 * Math.cos(a)
              const y = 150 + 105 * Math.sin(a)
              const ok = p.alcanza.includes(k)
              return (
                <g key={d} opacity={ok ? 1 : 0.22} style={{ transition: 'opacity 0.4s' }}>
                  {ok && <Flecha x1={200 + 40 * Math.cos(a)} y1={150 + 40 * Math.sin(a)} x2={200 + 92 * Math.cos(a)} y2={150 + 76 * Math.sin(a)} c="#3f7a2a" w={2} />}
                  <g transform={`translate(${x} ${y}) scale(0.3)`}>
                    {d === 'placenta' ? <ellipse rx="70" ry="50" fill="#d98aa0" stroke="#a04a60" strokeWidth="5" /> : <CelulaTipo id={d} />}
                  </g>
                </g>
              )
            })}
          </Lienzo>
        </div>
        <Texto>
          <p className="text-lg font-bold">{p.nombre}</p>
          <p className="mt-1">{p.texto}</p>
          <p className="mt-2 font-semibold">Puede formar {p.alcanza.length} de 6 tipos del dibujo.</p>
        </Texto>
      </Dos>
      <Deslizador id="madre-paso" etiqueta="Del cigoto al adulto" valor={i} max={3} onCambio={setI} rotulo={`${i + 1} de 4`} />
    </PantallaCompleta>
  )
}

/* ── Tejidos animales ──────────────────────────────────────────────────────── */

const TEJIDOS_A = {
  epitelial: { nombre: 'Epitelial', accion: '', texto: 'Cubre y protege: la piel, el interior del intestino, los vasos. Sus células están muy pegadas, sin espacio entre ellas, sobre una capa de apoyo.' },
  conectivo: { nombre: 'Conectivo', accion: '', texto: 'Une y sostiene. Tiene pocas células y mucha matriz con fibras. Son conectivos el hueso, el cartílago, la grasa, los tendones y hasta la sangre.' },
  muscular: { nombre: 'Muscular', accion: 'Contraer', texto: 'Se contrae para producir movimiento. Hay músculo esquelético (voluntario), liso (en órganos) y cardíaco (corazón).' },
  nervioso: { nombre: 'Nervioso', accion: 'Enviar impulso', texto: 'Recibe y transmite información con impulsos eléctricos. Las neuronas se acompañan de células de sostén llamadas glía.' },
}

export function TejidosAnimales() {
  const [t, setT] = useState<keyof typeof TEJIDOS_A>('epitelial')
  const [act, setAct] = useState(false)
  const x = TEJIDOS_A[t]
  return (
    <PantallaCompleta conBoton>
      <Pestanas valor={t} opciones={Object.entries(TEJIDOS_A).map(([k, v]) => [k as keyof typeof TEJIDOS_A, v.nombre])} onCambio={(v) => { setT(v); setAct(false) }} etiqueta="Tejido" />
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta={`Tejido ${x.nombre.toLowerCase()}`}>
            {t === 'epitelial' && (
              <>
                {Array.from({ length: 8 }, (_, k) => (
                  <g key={k}>
                    <rect x={30 + k * 43} y="90" width="43" height="90" {...CEL} />
                    <circle cx={51 + k * 43} cy="145" r="9" {...NUC} />
                  </g>
                ))}
                <rect x="30" y="180" width="344" height="10" fill="#c8b78a" />
                <T x={200} y={78} s={12}>superficie (exterior o interior de un órgano)</T>
                <T x={200} y={210} s={11}>capa de apoyo</T>
              </>
            )}
            {t === 'conectivo' && (
              <>
                <rect x="30" y="40" width="340" height="220" rx="12" fill="#f6ecd8" stroke="#c8b78a" strokeWidth="2" />
                {Array.from({ length: 9 }, (_, k) => <path key={k} d={`M ${30} ${60 + k * 22} q 85 ${k % 2 ? 20 : -20} 170 0 t 170 0`} fill="none" stroke="#d9a0a0" strokeWidth="2" />)}
                {[[90, 90], [250, 120], [160, 200], [310, 220], [80, 230]].map(([cx, cy], k) => (
                  <g key={k}>
                    <ellipse cx={cx} cy={cy} rx="20" ry="12" {...CEL} />
                    <circle cx={cx} cy={cy} r="5" {...NUC} />
                  </g>
                ))}
                <T x={200} y={285} s={11}>pocas células, mucha matriz y fibras</T>
              </>
            )}
            {t === 'muscular' && (
              <g transform={`translate(200 150) scale(${act ? 0.72 : 1} ${act ? 1.25 : 1})`} style={{ transition: 'transform 0.6s ease' }}>
                {[-60, 0, 60].map((y) => (
                  <g key={y} transform={`translate(0 ${y})`}>
                    <CelulaTipo id="musculo" />
                  </g>
                ))}
              </g>
            )}
            {t === 'nervioso' && (
              <>
                <g transform="translate(100 150) scale(1.3)">
                  <CelulaTipo id="neurona" />
                </g>
                <g transform="translate(290 150) scale(0.8)">
                  <CelulaTipo id="neurona" />
                </g>
                <circle cx={act ? 252 : 125} cy="150" r="7" fill="#e0b040" stroke="#7a4a10" strokeWidth="2" style={{ transition: 'cx 0.9s ease' }} />
              </>
            )}
          </Lienzo>
        </div>
        <Texto>
          <p className="text-lg font-bold">Tejido {x.nombre.toLowerCase()}</p>
          <p className="mt-1">{x.texto}</p>
          {x.accion && (
            <div className="mt-2">
              <Boton onClick={() => setAct(!act)}>{act ? 'Volver' : x.accion}</Boton>
            </div>
          )}
        </Texto>
      </Dos>
    </PantallaCompleta>
  )
}

/* ── Tejidos vegetales ─────────────────────────────────────────────────────── */

const TEJIDOS_V = {
  meristemo: { nombre: 'Meristemos', texto: 'Células que se dividen sin parar en las puntas de la raíz y del tallo. Gracias a ellos la planta crece toda la vida.' },
  proteccion: { nombre: 'Protección', texto: 'La epidermis cubre la planta como una piel, a veces con cera. En los troncos viejos se forma corteza (como el corcho de Hooke).' },
  conduccion: { nombre: 'Conducción', texto: 'Dos «tuberías»: el xilema sube agua y sales desde la raíz (azul) y el floema reparte los azúcares hechos en las hojas (naranja).' },
  fundamental: { nombre: 'Fundamental', texto: 'El parénquima rellena la planta: en las hojas hace fotosíntesis y en la papa guarda almidón. También hay tejidos de sostén.' },
}

export function TejidosVegetales() {
  const [t, setT] = useState<keyof typeof TEJIDOS_V>('meristemo')
  const o = (k: string) => (t === k ? 1 : 0.18)
  return (
    <PantallaCompleta conBoton>
      <Pestanas valor={t} opciones={Object.entries(TEJIDOS_V).map(([k, v]) => [k as keyof typeof TEJIDOS_V, v.nombre])} onCambio={setT} etiqueta="Tejido vegetal" />
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta={`Planta: tejido ${TEJIDOS_V[t].nombre.toLowerCase()}`}>
            <rect x="-50" y="210" width="500" height="120" fill="#e8d6b8" />
            {/* raíces y tallo */}
            <path d="M 200 210 q -10 40 -40 70 M 200 210 q 5 45 0 80 M 200 210 q 15 35 45 60" stroke="#c8a878" strokeWidth="6" fill="none" strokeLinecap="round" />
            <rect x="190" y="70" width="20" height="142" rx="6" fill={t === 'fundamental' ? '#9ccf86' : '#bcdca8'} stroke={t === 'proteccion' ? '#2f6a1a' : '#6a9a52'} strokeWidth={t === 'proteccion' ? 5 : 2} />
            {/* hojas */}
            {[[150, 120, -30], [250, 100, 30], [160, 170, -20]].map(([x, y, g], k) => (
              <ellipse key={k} cx={x} cy={y} rx="44" ry="16" transform={`rotate(${g} ${x} ${y})`} fill={t === 'fundamental' ? '#5fae45' : '#9ccf86'} stroke={t === 'proteccion' ? '#2f6a1a' : '#6a9a52'} strokeWidth={t === 'proteccion' ? 4 : 2} />
            ))}
            <g opacity={o('conduccion')}>
              <line x1="196" y1="290" x2="196" y2="80" stroke="#3b6fb6" strokeWidth="4" />
              <line x1="204" y1="80" x2="204" y2="290" stroke="#d9822b" strokeWidth="4" />
              <Flecha x1={180} y1={250} x2={180} y2={150} c="#3b6fb6" w={2.4} />
              <Flecha x1={222} y1={140} x2={222} y2={250} c="#d9822b" w={2.4} />
              <T x={150} y={240} s={11} c="#3b6fb6" b>xilema: agua ↑</T>
              <T x={262} y={240} s={11} c="#b3661f" b>floema: azúcar</T>
            </g>
            <g opacity={o('meristemo')}>
              {[[200, 66], [160, 280], [200, 292], [245, 270]].map(([x, y], k) => (
                <circle key={k} cx={x} cy={y} r="11" fill="#e0b040" stroke="#a07a10" strokeWidth="2" />
              ))}
              <T x={250} y={60} s={11} b>punta del tallo</T>
              <T x={110} y={292} s={11} b>puntas de la raíz</T>
            </g>
          </Lienzo>
        </div>
        <Texto>
          <p className="text-lg font-bold">{TEJIDOS_V[t].nombre}</p>
          <p className="mt-1">{TEJIDOS_V[t].texto}</p>
        </Texto>
      </Dos>
    </PantallaCompleta>
  )
}

/* ── Un órgano: tejidos que trabajan juntos (el estómago) ──────────────────── */

const CAPAS = [
  { id: 'epitelial', nombre: 'Epitelial (mucosa)', color: '#f2a0a0', r: 70, hace: 'Recubre el interior y fabrica el jugo gástrico y el moco.', falta: 'Sin ella, el ácido dañaría la pared: algo así pasa en una úlcera.' },
  { id: 'conectivo', nombre: 'Conectivo', color: '#f6dcb0', r: 90, hace: 'Une las capas y lleva los vasos sanguíneos que alimentan el órgano.', falta: 'Sin él, las capas se separarían y no llegaría sangre.' },
  { id: 'muscular', nombre: 'Muscular', color: '#d97060', r: 112, hace: 'Se contrae para mezclar y empujar la comida.', falta: 'Sin él, la comida no se mezclaría ni avanzaría.' },
  { id: 'nervioso', nombre: 'Nervioso', color: '#7a4a8a', r: 0, hace: 'Coordina cuándo contraerse y cuándo soltar jugos.', falta: 'Sin él, las otras capas no sabrían cuándo actuar.' },
]

export function OrganoTejidos() {
  const [i, setI] = useState(0)
  const [quitar, setQuitar] = useState(false)
  const c = CAPAS[i]
  return (
    <PantallaCompleta conBoton>
      <Pestanas valor={String(i)} opciones={CAPAS.map((x, k) => [String(k), x.nombre])} onCambio={(v) => { setI(Number(v)); setQuitar(false) }} etiqueta="Tejido del estómago" />
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta={`Corte del estómago: tejido ${c.nombre}`}>
            {[...CAPAS].filter((x) => x.r > 0).reverse().map((x) => (
              <circle key={x.id} cx="200" cy="150" r={x.r} fill={quitar && x.id === c.id ? '#f4efe4' : x.color} stroke={x.id === c.id ? '#2b1d08' : '#fff'} strokeWidth={x.id === c.id ? 4 : 2} strokeDasharray={quitar && x.id === c.id ? '6 5' : undefined} opacity={x.id === c.id || c.id === 'nervioso' ? 1 : 0.55} />
            ))}
            <circle cx="200" cy="150" r="48" fill="#f4efe4" />
            <T x={200} y={154} s={11} i>interior</T>
            {/* nervios */}
            <g opacity={c.id === 'nervioso' ? (quitar ? 0.1 : 1) : 0.35}>
              {[20, 110, 200, 290].map((a) => {
                const r = (a * Math.PI) / 180
                return <path key={a} d={`M ${200 + 100 * Math.cos(r)} ${150 + 100 * Math.sin(r)} q 6 6 0 14 t 0 14`} transform={`rotate(${a} ${200 + 100 * Math.cos(r)} ${150 + 100 * Math.sin(r)})`} stroke="#7a4a8a" strokeWidth="3" fill="none" />
              })}
            </g>
          </Lienzo>
        </div>
        <Texto>
          <p className="text-lg font-bold">{c.nombre}</p>
          <p className="mt-1">{c.hace}</p>
          {quitar && <p className="mt-2 font-semibold">{c.falta}</p>}
          <div className="mt-2">
            <Boton onClick={() => setQuitar(!quitar)}>{quitar ? 'Devolver el tejido' : 'Quitar este tejido'}</Boton>
          </div>
          <p className="mt-2 text-[var(--suave)]">Un órgano es un equipo de tejidos. El estómago, con otros órganos, forma el sistema digestivo.</p>
        </Texto>
      </Dos>
    </PantallaCompleta>
  )
}

/* ── Reproducción asexual y sexual ─────────────────────────────────────────── */

const PALETA = ['#3b6fb6', '#d9822b', '#5fae45', '#a04a8a', '#e0b040']

export function ReproduccionTipos() {
  const [modo, setModo] = useState<'asexual' | 'sexual'>('asexual')
  const [plaga, setPlaga] = useState(false)
  const [semilla, setSemilla] = useState(1)
  // población de 20: asexual = copias de la madre (azul); sexual = mezcla de colores
  const pob = Array.from({ length: 20 }, (_, k) => (modo === 'asexual' ? 0 : (k * 7 + semilla * 3 + Math.floor(k / 3)) % PALETA.length))
  const muere = (c: number) => plaga && c === 0
  const vivos = pob.filter((c) => !muere(c)).length
  return (
    <PantallaCompleta conBoton>
      <Pestanas valor={modo} opciones={[['asexual', 'Asexual (un progenitor)'], ['sexual', 'Sexual (dos progenitores)']]} onCambio={(m) => { setModo(m); setPlaga(false) }} etiqueta="Tipo de reproducción" />
      <div className="mb-3 flex flex-wrap gap-2">
        <Boton onClick={() => setPlaga(!plaga)}>{plaga ? 'Quitar la plaga' : '🦠 Llega una plaga que ataca a las azules'}</Boton>
        {modo === 'sexual' && <button type="button" onClick={() => { setSemilla(semilla + 1); setPlaga(false) }} className="min-h-10 rounded-full border border-[var(--linea)] px-4 text-sm font-semibold">Nueva generación</button>}
      </div>
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta={`${vivos} de 20 individuos sobreviven`}>
            {pob.map((c, k) => {
              const x = 50 + (k % 5) * 75
              const y = 50 + Math.floor(k / 5) * 62
              return (
                <g key={k} opacity={muere(c) ? 0.2 : 1} style={{ transition: 'opacity 0.5s' }}>
                  <ellipse cx={x} cy={y + 4} rx="18" ry="22" fill={PALETA[c]} stroke="#2b1d08" strokeWidth="1.5" />
                  <circle cx={x} cy={y - 22} r="9" fill={PALETA[c]} stroke="#2b1d08" strokeWidth="1.5" />
                  <path d={`M ${x - 4} ${y - 30} l -6 -8 M ${x + 4} ${y - 30} l 6 -8`} stroke="#2b1d08" strokeWidth="1.5" />
                  {muere(c) && <T x={x} y={y + 4} s={16} b c="#b03030">✕</T>}
                </g>
              )
            })}
          </Lienzo>
        </div>
        <Texto>
          {modo === 'asexual' ? (
            <p>Un solo progenitor produce copias de sí mismo, por mitosis: bacterias que se parten, la hidra que forma yemas, una papa que retoña. Es rápido y no necesita pareja, pero todos los hijos son iguales.</p>
          ) : (
            <p>Dos progenitores aportan gametos hechos por meiosis. Cada hijo es una mezcla distinta: es más lento, pero da variedad.</p>
          )}
          <p className="mt-2 font-semibold">Sobreviven {vivos} de 20.</p>
          {plaga && <p className="mt-1">{modo === 'asexual' ? 'Como todos son iguales, la plaga los ataca a todos.' : 'Gracias a la variedad, una parte de la población resiste y sigue adelante.'}</p>}
        </Texto>
      </Dos>
      <Nota>Modelo simplificado: el color representa la variedad genética de cada individuo.</Nota>
    </PantallaCompleta>
  )
}
