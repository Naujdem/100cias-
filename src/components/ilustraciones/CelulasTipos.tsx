import type { ReactNode } from 'react'
import { Lienzo, T, Flecha, TINTA, rad } from './Dibujo.tsx'

// Dibujos esquemáticos del subtema 2 «Tipos de células». Cada pieza se dibuja alrededor de (0,0)
// para poder colocarla con <g transform>. Esquemas no a escala.

const VERDE = '#cfe8c4'
const PARED = '#6fa05a'
const MORADO = '#7d4e9c'
const NARANJA = '#f3c897'

export interface CapasProEu {
  adn: boolean
  nucleo: boolean
  organulos: boolean
  ribosomas: boolean
}

const PUNTOS_RIBO: [number, number][] = [[-40, -10], [-22, 14], [-8, -16], [10, 12], [26, -12], [40, 8], [-30, 8], [18, -2]]

/** Procariota (bacilo con pared y flagelo). `k` es la escala. */
export function CelulaPro({ capas, k = 1 }: { capas: CapasProEu; k?: number }) {
  return (
    <g transform={`scale(${k})`}>
      <path d="M 62 8 q 30 -8 44 6 q 12 12 28 -4" fill="none" stroke="#9a7a4a" strokeWidth={3 / k} strokeLinecap="round" />
      <rect x="-66" y="-30" width="132" height="60" rx="30" fill={VERDE} stroke={PARED} strokeWidth={6} />
      <rect x="-60" y="-24" width="120" height="48" rx="24" fill="none" stroke="#b08a4a" strokeWidth={1.8} />
      {capas.ribosomas && PUNTOS_RIBO.map(([x, y], i) => <circle key={i} cx={x * 0.95} cy={y * 0.8} r="2.6" fill="#7a5a2a" />)}
      {capas.adn && <path d="M -26 0 q 6 -16 12 0 t 12 0 t 12 0 t 12 0 q 4 10 -8 12 t -22 -4 q -8 -4 -18 4" fill="none" stroke={MORADO} strokeWidth={3} strokeLinecap="round" />}
    </g>
  )
}

/** Eucariota animal (con núcleo, mitocondrias y otros orgánulos). */
export function CelulaEu({ capas, k = 1 }: { capas: CapasProEu; k?: number }) {
  return (
    <g transform={`scale(${k})`}>
      <path
        d="M -72 -6 Q -76 -48 -26 -58 Q 20 -68 56 -42 Q 82 -16 70 24 Q 56 58 8 62 Q -44 66 -66 34 Q -76 18 -72 -6 Z"
        fill="#f8d9d4"
        stroke="#b05a5a"
        strokeWidth={3}
      />
      {capas.ribosomas && [[-50, -20], [-52, 18], [-30, 40], [34, 44], [52, 6], [44, -30], [-10, -46]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.6" fill="#7a5a2a" />)}
      {capas.organulos && (
        <g>
          {[[-44, -30, -25], [38, 28, 30], [-34, 34, 15]].map(([x, y, a], i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(${a})`}>
              <ellipse rx="15" ry="8" fill={NARANJA} stroke="#c07a2a" strokeWidth="2" />
              <path d="M -9 0 q 3 -5 6 0 t 6 0 t 6 0" fill="none" stroke="#c07a2a" strokeWidth="1.6" />
            </g>
          ))}
          <path d="M 28 -32 q 12 -10 22 0 q -4 8 -14 4 q -8 4 -8 -4 Z" fill="#cfe0f5" stroke="#5d84b8" strokeWidth="2" />
        </g>
      )}
      {capas.nucleo && <circle cx="0" cy="0" r="25" fill="#e8dcf2" stroke={MORADO} strokeWidth={3} />}
      {capas.nucleo && <circle cx="-26" cy="-8" r="1.8" fill={MORADO} />}
      {capas.adn && <path d="M -14 2 q 5 -14 10 0 t 10 0 t 10 0 q -2 10 -12 10 t -18 -10" fill="none" stroke={MORADO} strokeWidth={2.6} strokeLinecap="round" />}
    </g>
  )
}

/** Eucariota vegetal (pared, vacuola grande y cloroplastos). */
export function CelulaVegetal({ pared = true, cloroplastos = true, vacuola = true, k = 1 }: { pared?: boolean; cloroplastos?: boolean; vacuola?: boolean; k?: number }) {
  return (
    <g transform={`scale(${k})`}>
      <rect x="-70" y="-58" width="140" height="116" rx="12" fill="#e3f1d6" stroke={pared ? PARED : '#b08a4a'} strokeWidth={pared ? 8 : 2.2} />
      {pared && <rect x="-65" y="-53" width="130" height="106" rx="8" fill="none" stroke="#b08a4a" strokeWidth="1.6" />}
      {vacuola && <path d="M -20 -46 Q 36 -52 46 -10 Q 52 38 8 46 Q -34 50 -30 6 Q -34 -26 -20 -46 Z" fill="#cfe6f6" stroke="#5d84b8" strokeWidth="2.2" />}
      <circle cx="-42" cy="-6" r="15" fill="#e8dcf2" stroke={MORADO} strokeWidth={2.6} />
      <circle cx="-42" cy="-6" r="5" fill="#c7a8dc" />
      {cloroplastos && [[-46, -40, 20], [-52, 32, -15], [20, -42, 0], [54, 8, 70], [24, 42, 10]].map(([x, y, a], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${a})`}>
          <ellipse rx="11" ry="6" fill="#7fc36a" stroke="#3f7d37" strokeWidth="1.8" />
          <path d="M -6 0 h 12" stroke="#3f7d37" strokeWidth="1.4" />
        </g>
      ))}
    </g>
  )
}

/** Bacteria en distintas formas. */
export function FormaBacteria({ forma }: { forma: 'coco' | 'bacilo' | 'espirilo' | 'vibrio' }) {
  const rel = { fill: VERDE, stroke: PARED, strokeWidth: 3 }
  if (forma === 'coco') return <g>{[[-34, -22], [0, -22], [34, -22], [-17, 12], [17, 12], [-50, 12]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="15" {...rel} />)}</g>
  if (forma === 'bacilo')
    return (
      <g>
        {[[-30, -34, 0], [20, -14, 20], [-26, 6, -15], [30, 30, 5], [-50, 40, 40]].map(([x, y, a], i) => (
          <rect key={i} x={x - 24} y={y - 9} width="48" height="18" rx="9" transform={`rotate(${a} ${x} ${y})`} {...rel} />
        ))}
      </g>
    )
  if (forma === 'espirilo') return <path d="M -70 20 q 14 -44 28 0 t 28 0 t 28 0 t 28 0 t 28 0" fill="none" stroke={PARED} strokeWidth="11" strokeLinecap="round" />
  return (
    <g>
      {[[-30, -10, 10], [32, 6, -15]].map(([x, y, a], i) => (
        <path key={i} d="M -30 6 Q 0 -24 30 6" transform={`translate(${x} ${y}) rotate(${a})`} fill="none" stroke={PARED} strokeWidth="14" strokeLinecap="round" />
      ))}
    </g>
  )
}

/** Virus: cápside con material genético, sin orgánulos. */
export function Virus({ k = 1 }: { k?: number }) {
  const puas = Array.from({ length: 12 }, (_, i) => rad(i * 30))
  return (
    <g transform={`scale(${k})`}>
      {puas.map((a, i) => (
        <g key={i}>
          <line x1={Math.cos(a) * 26} y1={Math.sin(a) * 26} x2={Math.cos(a) * 38} y2={Math.sin(a) * 38} stroke="#b05a5a" strokeWidth="3" strokeLinecap="round" />
          <circle cx={Math.cos(a) * 40} cy={Math.sin(a) * 40} r="3.6" fill="#e8806f" stroke="#b05a5a" strokeWidth="1.4" />
        </g>
      ))}
      <polygon points="0,-28 24,-14 24,14 0,28 -24,14 -24,-14" fill="#f3d4d0" stroke="#b05a5a" strokeWidth="3" />
      <path d="M -12 4 q 4 -14 8 0 t 8 0 t 8 0" fill="none" stroke={MORADO} strokeWidth="3" strokeLinecap="round" />
    </g>
  )
}

/* ── células especializadas ───────────────────────────────────────────────── */

export type Especializada = 'neurona' | 'globulo' | 'muscular' | 'espermatozoide' | 'epitelial' | 'pelo'

export function CelulaEspecial({ id }: { id: Especializada }) {
  const rojo = { fill: '#f8d9d4', stroke: '#b05a5a', strokeWidth: 3 }
  switch (id) {
    case 'neurona':
      return (
        <g>
          {[[-30, -22, -62, -52], [-30, -2, -66, -8], [-26, 18, -56, 48], [-20, -28, -30, -62]].map(([a, b, c, d], i) => (
            <g key={i}>
              <line x1={a} y1={b} x2={c} y2={d} stroke="#b05a5a" strokeWidth="4" strokeLinecap="round" />
              <line x1={c} y1={d} x2={c - 8} y2={d - 8} stroke="#b05a5a" strokeWidth="3" strokeLinecap="round" />
              <line x1={c} y1={d} x2={c - 10} y2={d + 6} stroke="#b05a5a" strokeWidth="3" strokeLinecap="round" />
            </g>
          ))}
          <path d="M -8 0 L 70 0" stroke="#b05a5a" strokeWidth="5" strokeLinecap="round" />
          {[[78, -12], [82, 0], [78, 12]].map(([x, y], i) => <line key={i} x1="70" y1="0" x2={x + 8} y2={y} stroke="#b05a5a" strokeWidth="3" strokeLinecap="round" />)}
          <circle cx="-14" cy="0" r="22" {...rojo} />
          <circle cx="-14" cy="0" r="8" fill="#e8dcf2" stroke={MORADO} strokeWidth="2" />
        </g>
      )
    case 'globulo':
      return (
        <g>
          <ellipse cx="0" cy="0" rx="56" ry="50" fill="#e0594f" stroke="#a02e28" strokeWidth="3.5" />
          <ellipse cx="0" cy="0" rx="22" ry="18" fill="#ec8a80" stroke="#a02e28" strokeWidth="2" />
        </g>
      )
    case 'muscular':
      return (
        <g>
          <rect x="-84" y="-20" width="168" height="40" rx="14" {...rojo} />
          {Array.from({ length: 14 }, (_, i) => <line key={i} x1={-72 + i * 11} y1="-14" x2={-72 + i * 11} y2="14" stroke="#c98a84" strokeWidth="2" />)}
          {[-56, -18, 20, 58].map((x, i) => <ellipse key={i} cx={x} cy={i % 2 ? 15 : -15} rx="7" ry="4" fill="#e8dcf2" stroke={MORADO} strokeWidth="2" />)}
        </g>
      )
    case 'espermatozoide':
      return (
        <g>
          <path d="M 20 0 q 22 -16 44 0 t 44 0 t 40 0" transform="translate(-60 0)" fill="none" stroke="#9a7a4a" strokeWidth="3.5" strokeLinecap="round" />
          <rect x="-24" y="-5" width="40" height="10" rx="5" fill={NARANJA} stroke="#c07a2a" strokeWidth="2" />
          <ellipse cx="-44" cy="0" rx="22" ry="14" fill="#e8dcf2" stroke={MORADO} strokeWidth="3" />
        </g>
      )
    case 'epitelial':
      return (
        <g>
          {Array.from({ length: 11 }, (_, i) => <line key={i} x1={-40 + i * 8} y1="-54" x2={-40 + i * 8} y2="-36" stroke="#b05a5a" strokeWidth="3" strokeLinecap="round" />)}
          <rect x="-44" y="-38" width="88" height="94" rx="10" {...rojo} />
          <ellipse cx="0" cy="26" rx="20" ry="14" fill="#e8dcf2" stroke={MORADO} strokeWidth="2.6" />
        </g>
      )
    default:
      return (
        <g>
          <path d="M -50 -52 L 50 -52 L 50 -16 L 8 -16 L 5 60 L -5 60 L -8 -16 L -50 -16 Z" fill="#e3f1d6" stroke={PARED} strokeWidth="4" strokeLinejoin="round" />
          <circle cx="-24" cy="-38" r="12" fill="#e8dcf2" stroke={MORADO} strokeWidth="2.4" />
        </g>
      )
  }
}

/* ── escenas completas (ilustraciones de las láminas) ─────────────────────── */

const TODAS: CapasProEu = { adn: true, nucleo: true, organulos: true, ribosomas: true }

export function EscenaProEuLado() {
  return (
    <Lienzo etiqueta="Una célula procariota sin núcleo junto a una eucariota con núcleo">
      <line x1="200" y1="20" x2="200" y2="280" stroke="#d6cdb8" strokeWidth="2" strokeDasharray="5 5" />
      <T x={100} y={30} s={16} b>Procariota</T>
      <T x={300} y={30} s={16} b>Eucariota</T>
      <g transform="translate(88 140)"><CelulaPro capas={{ ...TODAS, nucleo: false, organulos: false }} k={0.68} /></g>
      <g transform="translate(300 140)"><CelulaEu capas={TODAS} k={1.05} /></g>
      <T x={100} y={222} s={13} b>Sin núcleo</T>
      <T x={100} y={242} s={12}>el ADN anda suelto</T>
      <T x={300} y={222} s={13} b>Con núcleo</T>
      <T x={300} y={242} s={12}>el ADN está guardado</T>
      <T x={200} y={286} s={11} i>esquemas no a escala</T>
    </Lienzo>
  )
}

export function EscenaAnimalVegetalLado() {
  return (
    <Lienzo etiqueta="Una célula animal junto a una célula vegetal con pared, cloroplastos y vacuola grande">
      <line x1="200" y1="20" x2="200" y2="280" stroke="#d6cdb8" strokeWidth="2" strokeDasharray="5 5" />
      <T x={100} y={30} s={16} b>Animal</T>
      <T x={300} y={30} s={16} b>Vegetal</T>
      <g transform="translate(100 140)"><CelulaEu capas={TODAS} k={1.05} /></g>
      <g transform="translate(300 140)"><CelulaVegetal k={1.1} /></g>
      <T x={100} y={236} s={12}>sin pared · sin cloroplastos</T>
      <T x={100} y={254} s={12}>vacuolas pequeñas</T>
      <T x={300} y={236} s={12}>con pared · con cloroplastos</T>
      <T x={300} y={254} s={12}>una vacuola grande</T>
    </Lienzo>
  )
}

export function EscenaBacteriasFormas() {
  const formas: ['coco' | 'bacilo' | 'espirilo' | 'vibrio', string, string][] = [['coco', 'Cocos', 'redondas'], ['bacilo', 'Bacilos', 'alargadas'], ['espirilo', 'Espirilos', 'en espiral'], ['vibrio', 'Vibrios', 'en coma']]
  return (
    <Lienzo etiqueta="Cuatro formas de bacterias: cocos, bacilos, espirilos y vibrios">
      <T x={200} y={28} s={16} b>Formas de bacterias</T>
      {formas.map(([f, n, d], i) => (
        <g key={f} transform={`translate(${i % 2 ? 300 : 100} ${i < 2 ? 100 : 215})`}>
          <g transform="scale(0.68) translate(0 -8)"><FormaBacteria forma={f} /></g>
          <T x={0} y={50} s={13} b>{n}</T>
          <T x={0} y={66} s={11}>{d}</T>
        </g>
      ))}
    </Lienzo>
  )
}

function Mini({ x, y, children, nombre, sub }: { x: number; y: number; children: ReactNode; nombre: string; sub: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-44" y="-44" width="88" height="88" rx="14" fill="#fff" stroke="#d6cdb8" strokeWidth="2.5" />
      <g transform="scale(0.5)">{children}</g>
      <T x={0} y={62} s={12} b>{nombre}</T>
      <T x={0} y={77} s={10.5}>{sub}</T>
    </g>
  )
}

export function EscenaEucariotas() {
  return (
    <Lienzo etiqueta="Cuatro grupos de eucariotas: protistas, hongos, plantas y animales">
      <T x={200} y={26} s={16} b>Cuatro grupos de eucariotas</T>
      <Mini x={55} y={110} nombre="Protistas" sub="algas y amebas">
        <g>
          <ellipse rx="64" ry="36" fill="#f8d9d4" stroke="#b05a5a" strokeWidth="5" />
          {Array.from({ length: 12 }, (_, i) => <line key={i} x1={-56 + i * 10} y1="-34" x2={-56 + i * 10} y2="-48" stroke="#b05a5a" strokeWidth="3" />)}
          <circle r="14" fill="#e8dcf2" stroke={MORADO} strokeWidth="4" />
        </g>
      </Mini>
      <Mini x={150} y={110} nombre="Hongos" sub="pared de quitina">
        <g>
          <path d="M -60 6 Q -56 -50 0 -52 Q 56 -50 60 6 Z" fill="#e8c9a0" stroke="#9a6a3a" strokeWidth="5" />
          <rect x="-16" y="6" width="32" height="46" rx="8" fill="#f1e2c6" stroke="#9a6a3a" strokeWidth="5" />
        </g>
      </Mini>
      <Mini x={250} y={110} nombre="Plantas" sub="pared de celulosa">
        <g>
          <path d="M 0 52 L 0 -4" stroke="#4a8a3a" strokeWidth="8" strokeLinecap="round" />
          <path d="M 0 10 Q -50 -6 -46 -46 Q 0 -40 0 10 Z" fill="#7fc36a" stroke="#3f7d37" strokeWidth="4" />
          <path d="M 0 -2 Q 52 -14 48 -52 Q 0 -44 0 -2 Z" fill="#7fc36a" stroke="#3f7d37" strokeWidth="4" />
        </g>
      </Mini>
      <Mini x={345} y={110} nombre="Animales" sub="sin pared">
        <g>
          <ellipse rx="52" ry="30" fill="#f1c27d" stroke="#a06a2a" strokeWidth="5" />
          <path d="M 52 0 L 78 -22 L 78 22 Z" fill="#f1c27d" stroke="#a06a2a" strokeWidth="5" strokeLinejoin="round" />
          <circle cx="-28" cy="-6" r="6" fill="#fff" stroke="#4a3416" strokeWidth="3" />
        </g>
      </Mini>
      <T x={200} y={222} s={13}>Todos tienen núcleo y orgánulos con membrana.</T>
      <T x={200} y={244} s={13}>Se diferencian en la pared, en cómo obtienen</T>
      <T x={200} y={262} s={13}>su alimento y en cuántas células tienen.</T>
    </Lienzo>
  )
}

export function EscenaEspecializadas() {
  const l: [Especializada, string, number, number, number][] = [
    ['neurona', 'Neurona', 82, 100, 0.55],
    ['globulo', 'Glóbulo rojo', 200, 100, 0.62],
    ['muscular', 'Célula muscular', 330, 100, 0.55],
    ['espermatozoide', 'Espermatozoide', 82, 215, 0.55],
    ['epitelial', 'Epitelial intestinal', 200, 215, 0.55],
    ['pelo', 'Pelo de raíz', 330, 215, 0.55],
  ]
  return (
    <Lienzo etiqueta="Seis células especializadas con formas distintas">
      <T x={200} y={22} s={15} b>La forma habla de la función</T>
      {l.map(([id, n, x, y, k]) => (
        <g key={id}>
          <g transform={`translate(${x} ${y}) scale(${k})`}><CelulaEspecial id={id} /></g>
          <T x={x} y={y + 52} s={11} b>{n}</T>
        </g>
      ))}
    </Lienzo>
  )
}

export function EscenaVirusCelula() {
  return (
    <Lienzo etiqueta="Un virus comparado con una bacteria: el virus es mucho más pequeño y no tiene estructura celular">
      <T x={110} y={28} s={15} b>Virus</T>
      <T x={290} y={28} s={15} b>Bacteria</T>
      <g transform="translate(110 130)"><Virus k={1.25} /></g>
      <g transform="translate(290 130)"><CelulaPro capas={{ ...TODAS, nucleo: false, organulos: false }} k={0.8} /></g>
      <T x={110} y={222} s={12} b>No es una célula</T>
      <T x={110} y={240} s={11}>material genético + cubierta</T>
      <T x={290} y={222} s={12} b>Es una célula</T>
      <T x={290} y={240} s={11}>membrana, citoplasma y ADN</T>
      <Flecha x1={188} y1={130} x2={208} y2={130} c="#b3a58a" w={2} />
      <T x={200} y={280} s={11} i>el virus es unas 10–100 veces más pequeño (a verificar)</T>
    </Lienzo>
  )
}

/** Árbol de tipos: lo que se ve en la vista «mapa», en versión ilustración. */
export function EscenaArbol() {
  const nodo = (x: number, y: number, t: string, c: string, dash?: boolean, w = 96) => (
    <g>
      <rect x={x - w / 2} y={y - 15} width={w} height="30" rx="15" fill={c} stroke={TINTA} strokeWidth="2" strokeDasharray={dash ? '5 4' : undefined} />
      <T x={x} y={y + 4} s={12} b>{t}</T>
    </g>
  )
  return (
    <Lienzo etiqueta="Árbol de tipos de células: procariotas y eucariotas; los virus quedan aparte">
      <g stroke={TINTA} strokeWidth="2" fill="none">
        <path d="M 200 53 V 70 H 110 V 90 M 200 70 H 290 V 90" />
        <path d="M 290 120 V 150 H 55 V 160 M 290 150 H 150 V 160 M 290 150 H 245 V 160 M 290 150 H 340 V 160" />
      </g>
      {nodo(200, 38, 'Células', '#fff')}
      {nodo(110, 105, 'Procariotas', '#cfe8c4')}
      {nodo(290, 105, 'Eucariotas', '#f8d9d4')}
      <T x={110} y={136} s={11}>bacterias y arqueas</T>
      {nodo(55, 175, 'Protistas', '#f3dfe8', false, 80)}
      {nodo(150, 175, 'Hongos', '#efe2cc', false, 80)}
      {nodo(245, 175, 'Plantas', '#dcefd0', false, 80)}
      {nodo(340, 175, 'Animales', '#fbe3b6', false, 80)}
      <rect x="40" y="228" width="320" height="52" rx="14" fill="none" stroke="#9a8a6a" strokeWidth="2" strokeDasharray="6 5" />
      {nodo(120, 254, 'Virus', '#fff', true, 90)}
      <T x={262} y={258} s={12}>no son células</T>
    </Lienzo>
  )
}
