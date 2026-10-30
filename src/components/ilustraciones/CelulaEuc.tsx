import type { ReactNode } from 'react'
import { Lienzo, T, Flecha, TINTA, rad } from './Dibujo.tsx'

// Célula eucariota y sus orgánulos (tema 3). Cada pieza se dibuja alrededor de (0,0).
// Esquemas no a escala.

const MORADO = '#7d4e9c'
const NAR = '#d9822b'
const AZUL = '#5d84b8'

export function Nucleo({ k = 1 }: { k?: number }) {
  return (
    <g transform={`scale(${k})`}>
      <circle r="40" fill="#e8dcf2" stroke={MORADO} strokeWidth="4" />
      <circle r="34" fill="none" stroke={MORADO} strokeWidth="1.5" />
      {[0, 50, 100, 160, 210, 270, 320].map((a) => (
        <circle key={a} cx={Math.cos(rad(a)) * 37} cy={Math.sin(rad(a)) * 37} r="3.2" fill="#fff" stroke={MORADO} strokeWidth="1.6" />
      ))}
      <circle cx="-10" cy="-8" r="11" fill="#c7a8dc" stroke={MORADO} strokeWidth="2" />
      <path d="M 6 6 q 6 -12 12 0 t 12 0 M -22 14 q 6 -10 12 0 t 12 0 t 10 -4" fill="none" stroke={MORADO} strokeWidth="2.4" strokeLinecap="round" />
    </g>
  )
}

export function Mito({ k = 1, a = 0 }: { k?: number; a?: number }) {
  return (
    <g transform={`rotate(${a}) scale(${k})`}>
      <ellipse rx="30" ry="16" fill="#f6d6b0" stroke="#b3661f" strokeWidth="3" />
      <ellipse rx="25" ry="11.5" fill="#fbeedd" stroke={NAR} strokeWidth="1.6" />
      {[-16, -8, 0, 8, 16].map((x, i) => (
        <path key={x} d={i % 2 ? `M ${x} 11 v -9` : `M ${x} -11 v 9`} stroke={NAR} strokeWidth="2.4" strokeLinecap="round" />
      ))}
    </g>
  )
}

export function Ribosomas({ puntos }: { puntos: [number, number][] }) {
  return (
    <g>
      {puntos.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.4" fill="#7a5a2a" />
      ))}
    </g>
  )
}

/** Retículo endoplasmático rugoso: sacos aplanados con ribosomas pegados. */
export function RetRugoso({ k = 1, a = 0 }: { k?: number; a?: number }) {
  return (
    <g transform={`rotate(${a}) scale(${k})`}>
      {[-12, 0, 12].map((y) => (
        <path key={y} d={`M -34 ${y} q 8 -7 18 0 t 18 0 t 18 0`} fill="none" stroke={AZUL} strokeWidth="5" strokeLinecap="round" />
      ))}
      {[-30, -14, 4, 20, 36].flatMap((x) => [-17, 17].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r="2.2" fill="#7a5a2a" />))}
    </g>
  )
}

export function RetLiso({ k = 1 }: { k?: number }) {
  return (
    <g transform={`scale(${k})`}>
      <path d="M -30 0 q 8 -14 16 0 t 16 0 t 16 0 M -26 12 q 8 -12 16 0 t 16 0 t 14 -2" fill="none" stroke="#7fb3d9" strokeWidth="5" strokeLinecap="round" />
    </g>
  )
}

export function Golgi({ k = 1, a = 0 }: { k?: number; a?: number }) {
  return (
    <g transform={`rotate(${a}) scale(${k})`}>
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M -28 ${-15 + i * 10} q 28 ${-10 + i * 2} 56 0`} fill="none" stroke="#c9a23a" strokeWidth="5" strokeLinecap="round" />
      ))}
      {[[-36, -20], [38, 20], [40, -8]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="4.5" fill="#fbe19a" stroke="#c9a23a" strokeWidth="1.8" />
      ))}
    </g>
  )
}

export function Lisosoma({ k = 1 }: { k?: number }) {
  return (
    <g transform={`scale(${k})`}>
      <circle r="12" fill="#f5c6d6" stroke="#b05a7a" strokeWidth="2.6" />
      {[[-4, -3], [4, 2], [-1, 5], [5, -5]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="1.8" fill="#b05a7a" />
      ))}
    </g>
  )
}

export function Cloroplasto({ k = 1, a = 0 }: { k?: number; a?: number }) {
  return (
    <g transform={`rotate(${a}) scale(${k})`}>
      <ellipse rx="30" ry="17" fill="#cfe8c4" stroke="#3f7d37" strokeWidth="3" />
      {[-15, 0, 15].map((x) => (
        <g key={x}>
          {[-6, -2, 2, 6].map((y) => (
            <rect key={y} x={x - 5.5} y={y - 1.3} width="11" height="2.6" rx="1.3" fill="#5fa84d" stroke="#3f7d37" strokeWidth="0.8" />
          ))}
        </g>
      ))}
    </g>
  )
}

export function Citoesqueleto() {
  return (
    <g stroke="#b9a98a" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.9">
      <path d="M 120 120 L 80 70 M 120 130 L 70 140 M 125 150 L 85 205 M 150 165 L 140 225 M 200 100 L 190 52" />
    </g>
  )
}

/* ── puntos tocables de la célula completa ────────────────────────────────── */

export interface Punto {
  id: string
  /** id del bloque del tema 3 que abre */
  bloque: string
  nombre: string
  x: number
  y: number
  r: number
}

export const PUNTOS_ANIMAL: Punto[] = [
  { id: 'membrana', bloque: 'membrana', nombre: 'Membrana', x: 52, y: 150, r: 24 },
  { id: 'citoplasma', bloque: 'citoplasma', nombre: 'Citoplasma y citoesqueleto', x: 118, y: 232, r: 28 },
  { id: 'nucleo', bloque: 'nucleo', nombre: 'Núcleo', x: 168, y: 138, r: 44 },
  { id: 'ret', bloque: 'ruta-proteinas', nombre: 'Retículo y ribosomas', x: 238, y: 112, r: 36 },
  { id: 'golgi', bloque: 'ruta-proteinas', nombre: 'Aparato de Golgi', x: 288, y: 172, r: 34 },
  { id: 'mito', bloque: 'mitocondrias', nombre: 'Mitocondria', x: 112, y: 96, r: 30 },
  { id: 'mito2', bloque: 'mitocondrias', nombre: 'Mitocondria', x: 282, y: 76, r: 28 },
  { id: 'liso', bloque: 'lisosomas', nombre: 'Lisosoma', x: 218, y: 214, r: 20 },
]

export const PUNTOS_VEGETAL: Punto[] = [
  { id: 'membrana', bloque: 'membrana', nombre: 'Membrana y pared', x: 44, y: 150, r: 24 },
  { id: 'citoplasma', bloque: 'citoplasma', nombre: 'Citoplasma y citoesqueleto', x: 120, y: 236, r: 26 },
  { id: 'nucleo', bloque: 'nucleo', nombre: 'Núcleo', x: 104, y: 132, r: 40 },
  { id: 'ret', bloque: 'ruta-proteinas', nombre: 'Retículo y ribosomas', x: 150, y: 70, r: 28 },
  { id: 'golgi', bloque: 'ruta-proteinas', nombre: 'Aparato de Golgi', x: 108, y: 205, r: 28 },
  { id: 'mito', bloque: 'mitocondrias', nombre: 'Mitocondria', x: 58, y: 62, r: 26 },
  { id: 'cloro', bloque: 'cloroplastos', nombre: 'Cloroplasto', x: 162, y: 238, r: 28 },
  { id: 'cloro2', bloque: 'cloroplastos', nombre: 'Cloroplasto', x: 340, y: 238, r: 28 },
  { id: 'vacuola', bloque: 'cloroplastos', nombre: 'Vacuola central', x: 262, y: 150, r: 60 },
]

/** Célula animal completa. `resalta` es el id de un punto que se ilumina. */
export function CelulaAnimalCompleta({ resalta }: { resalta?: string }) {
  const luz = (id: string) => (resalta === id ? { filter: 'drop-shadow(0 0 5px #e8a33a)' } : undefined)
  return (
    <g>
      <path
        d="M 40 150 Q 38 66 110 46 Q 190 22 280 44 Q 372 70 362 160 Q 354 246 270 262 Q 190 280 110 262 Q 44 244 40 150 Z"
        fill="#f8d9d4"
        stroke="#b05a5a"
        strokeWidth="6"
        style={luz('membrana')}
      />
      <Citoesqueleto />
      <Ribosomas puntos={[[84, 160], [96, 180], [74, 118], [240, 150], [218, 82], [330, 140], [320, 218], [160, 220], [190, 245], [248, 238]]} />
      <g transform="translate(168 138)" style={luz('nucleo')}><Nucleo k={1.05} /></g>
      <g transform="translate(238 112) rotate(-35)" style={luz('ret')}><RetRugoso k={1.1} /></g>
      <g transform="translate(288 172) rotate(20)" style={luz('golgi')}><Golgi k={1.1} /></g>
      <g transform="translate(112 96)" style={luz('mito')}><Mito k={1.1} a={-25} /></g>
      <g transform="translate(282 76)" style={luz('mito2')}><Mito k={1} a={20} /></g>
      <g transform="translate(218 214)" style={luz('liso')}><Lisosoma k={1.2} /></g>
      <g transform="translate(336 214)"><Lisosoma k={1} /></g>
    </g>
  )
}

/** Célula vegetal completa. */
export function CelulaVegetalCompleta({ resalta }: { resalta?: string }) {
  const luz = (id: string) => (resalta === id ? { filter: 'drop-shadow(0 0 5px #e8a33a)' } : undefined)
  return (
    <g>
      <rect x="20" y="30" width="360" height="240" rx="26" fill="#e3f1d6" stroke="#6fa05a" strokeWidth="11" style={luz('membrana')} />
      <rect x="29" y="39" width="342" height="222" rx="20" fill="none" stroke="#b08a4a" strokeWidth="2" />
      <g style={luz('vacuola')}>
        <path d="M 200 60 Q 340 52 358 140 Q 360 232 270 246 Q 200 252 196 170 Q 188 96 200 60 Z" fill="#cfe6f6" stroke={AZUL} strokeWidth="3.5" />
      </g>
      <Ribosomas puntos={[[60, 120], [70, 190], [180, 110], [150, 160], [60, 230], [190, 230]]} />
      <g transform="translate(104 132)" style={luz('nucleo')}><Nucleo /></g>
      <g transform="translate(150 70)" style={luz('ret')}><RetRugoso k={0.9} /></g>
      <g transform="translate(108 205)" style={luz('golgi')}><Golgi /></g>
      <g transform="translate(58 62)" style={luz('mito')}><Mito k={0.9} a={20} /></g>
      <g transform="translate(162 238)" style={luz('cloro')}><Cloroplasto k={0.9} a={-10} /></g>
      <g transform="translate(340 238)" style={luz('cloro2')}><Cloroplasto k={0.9} a={10} /></g>
      <g transform="translate(60 245)"><Cloroplasto k={0.7} a={5} /></g>
    </g>
  )
}

/* ── escenas para láminas ─────────────────────────────────────────────────── */

function Rotulo({ x, y, x2, y2, t, s, a = 'start' }: { x: number; y: number; x2: number; y2: number; t: string; s?: string; a?: 'start' | 'end' }) {
  return (
    <g>
      <line x1={x2} y1={y2} x2={x + (a === 'start' ? -4 : 4)} y2={y - 4} stroke={TINTA} strokeWidth="1.4" />
      <T x={x} y={y} s={12} b a={a}>{t}</T>
      {s && <T x={x} y={y + 13} s={10.5} a={a}>{s}</T>}
    </g>
  )
}

export function EscenaCelulaRotulada() {
  return (
    <Lienzo etiqueta="Una célula eucariota animal con núcleo, retículo, Golgi, mitocondrias y lisosomas rotulados">
      <g transform="translate(70 50) scale(0.62)">
        <CelulaAnimalCompleta />
      </g>
      <Rotulo x={304} y={62} x2={218} y2={119} t="Retículo" s="fabrica proteínas" />
      <Rotulo x={304} y={150} x2={249} y2={157} t="Golgi" s="empaca y reparte" />
      <Rotulo x={304} y={236} x2={205} y2={183} t="Lisosoma" s="digiere y recicla" />
      <Rotulo x={84} y={62} x2={139} y2={110} t="Mitocondria" s="libera energía" a="end" />
      <Rotulo x={84} y={196} x2={174} y2={136} t="Núcleo" s="guarda el ADN" a="end" />
    </Lienzo>
  )
}

export function EscenaMembrana() {
  const x = Array.from({ length: 14 }, (_, i) => 30 + i * 26)
  const cabeza = (cx: number, cy: number, i: number) => (
    <circle key={`${cx}${cy}${i}`} cx={cx} cy={cy} r="8.5" fill="#f2c77a" stroke="#b3861f" strokeWidth="2" />
  )
  return (
    <Lienzo etiqueta="La membrana: dos capas de lípidos con proteínas que forman canales">
      <T x={200} y={24} s={15} b>La membrana celular</T>
      <T x={22} y={52} s={12} b a="start">Fuera de la célula</T>
      <T x={22} y={228} s={12} b a="start">Dentro de la célula</T>
      {x.map((cx, i) => (
        <g key={cx}>
          {cabeza(cx, 104, i)}
          <path d={`M ${cx - 3} 112 v 30 M ${cx + 3} 112 v 30`} stroke="#b3861f" strokeWidth="2" strokeLinecap="round" />
          {cabeza(cx, 196, i)}
          <path d={`M ${cx - 3} 188 v -30 M ${cx + 3} 188 v -30`} stroke="#b3861f" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
      <rect x="146" y="92" width="38" height="116" rx="14" fill="#9ec0e8" stroke={AZUL} strokeWidth="3" />
      <rect x="156" y="104" width="18" height="92" rx="9" fill="#f4efe4" stroke={AZUL} strokeWidth="1.6" />
      <rect x="276" y="92" width="34" height="116" rx="14" fill="#b9d9a8" stroke="#3f7d37" strokeWidth="3" />
      <circle cx="165" cy="70" r="7" fill="#e8806f" stroke={TINTA} strokeWidth="1.6" />
      <Flecha x1={165} y1={78} x2={165} y2={150} c="#4a3416" w={2} />
      <circle cx="293" cy="64" r="9" fill="#9a6fc6" stroke={TINTA} strokeWidth="1.6" />
      <Flecha x1={293} y1={74} x2={293} y2={92} c="#4a3416" w={2} />
      <T x={165} y={254} s={11} b>Canal</T>
      <T x={165} y={268} s={10.5}>deja pasar solo lo suyo</T>
      <T x={293} y={254} s={11} b>Receptor</T>
      <T x={293} y={268} s={10.5}>recibe señales</T>
      <T x={200} y={294} s={11} i>cabezas: aman el agua · colas: la rechazan</T>
    </Lienzo>
  )
}

export function EscenaNucleo() {
  return (
    <Lienzo etiqueta="El núcleo: envoltura con poros, nucleolo y cromatina">
      <T x={200} y={26} s={15} b>El núcleo</T>
      <g transform="translate(130 160) scale(2.2)"><Nucleo /></g>
      <Rotulo x={252} y={72} x2={186} y2={104} t="Envoltura" s="doble membrana" />
      <Rotulo x={252} y={136} x2={211} y2={160} t="Poro" s="deja pasar mensajes" />
      <Rotulo x={252} y={200} x2={118} y2={142} t="Nucleolo" s="arma ribosomas" />
      <Rotulo x={252} y={258} x2={150} y2={183} t="Cromatina" s="ADN con proteínas" />
    </Lienzo>
  )
}

export function EscenaRutaProteina() {
  const pasos: [string, string, number][] = [
    ['1', 'ADN', 40],
    ['2', 'Ribosoma', 120],
    ['3', 'Retículo', 200],
    ['4', 'Golgi', 280],
    ['5', 'Afuera', 360],
  ]
  return (
    <Lienzo etiqueta="La ruta de una proteína: ADN en el núcleo, ribosoma, retículo, Golgi y salida de la célula">
      <T x={200} y={26} s={15} b>De la receta a la proteína</T>
      <g transform="translate(40 120) scale(0.5)"><Nucleo /></g>
      <g transform="translate(120 120)"><circle r="17" fill="#f2b84b" stroke={TINTA} strokeWidth="2" /><circle r="9" cx="-6" cy="-6" fill="#e8806f" stroke={TINTA} strokeWidth="1.4" /></g>
      <g transform="translate(200 120)"><RetRugoso k={0.8} /></g>
      <g transform="translate(280 120)"><Golgi k={0.8} /></g>
      <g transform="translate(360 120)"><path d="M -10 -30 v 60" stroke="#b05a5a" strokeWidth="7" strokeLinecap="round" /><circle cx="-18" cy="-6" r="6" fill="#fbe19a" stroke="#c9a23a" strokeWidth="2" /><circle cx="16" cy="-12" r="6" fill="#fbe19a" stroke="#c9a23a" strokeWidth="2" /><circle cx="22" cy="12" r="6" fill="#fbe19a" stroke="#c9a23a" strokeWidth="2" /></g>
      {[60, 140, 220, 300].map((x) => <Flecha key={x} x1={x} y1={120} x2={x + 22} y2={120} c="#8a7a5a" w={2} />)}
      {pasos.map(([n, t, x]) => (
        <g key={n}>
          <circle cx={x} cy={188} r="10" fill={TINTA} />
          <T x={x} y={192} s={11} b c="#fff">{n}</T>
          <T x={x} y={216} s={12} b>{t}</T>
        </g>
      ))}
      <T x={200} y={252} s={12}>El núcleo da la receta, los ribosomas arman,</T>
      <T x={200} y={268} s={12}>el retículo y el Golgi pulen y reparten.</T>
    </Lienzo>
  )
}

export function EscenaEnergia() {
  return (
    <Lienzo etiqueta="Cloroplasto y mitocondria: el cloroplasto fabrica glucosa con luz y la mitocondria la usa para liberar energía">
      <line x1="200" y1="20" x2="200" y2="280" stroke="#d6cdb8" strokeWidth="2" strokeDasharray="5 5" />
      <T x={100} y={28} s={15} b>Cloroplasto</T>
      <T x={300} y={28} s={15} b>Mitocondria</T>
      <g transform="translate(100 120) scale(1.7)"><Cloroplasto /></g>
      <g transform="translate(300 120) scale(1.7)"><Mito /></g>
      <T x={100} y={196} s={12} b>luz + CO₂ + agua</T>
      <T x={100} y={214} s={12}>→ glucosa + oxígeno</T>
      <T x={300} y={196} s={12} b>glucosa + oxígeno</T>
      <T x={300} y={214} s={12}>→ energía (ATP) + CO₂</T>
      <T x={100} y={250} s={11}>solo en plantas y algas</T>
      <T x={300} y={250} s={11}>en casi todas las eucariotas</T>
    </Lienzo>
  )
}

export function EscenaLisosoma() {
  return (
    <Lienzo etiqueta="Un lisosoma digiere una partícula de alimento y devuelve piezas reutilizables">
      <T x={200} y={26} s={15} b>El lisosoma: digestión y reciclaje</T>
      <circle cx="70" cy="140" r="22" fill="#fbe19a" stroke="#c9a23a" strokeWidth="3" />
      <T x={70} y={190} s={12} b>1 Entra</T>
      <T x={70} y={206} s={11}>un alimento</T>
      <Flecha x1={100} y1={140} x2={140} y2={140} c="#8a7a5a" w={2.5} />
      <g transform="translate(200 140) scale(3.2)"><Lisosoma /></g>
      <T x={200} y={206} s={12} b>2 Digiere</T>
      <T x={200} y={222} s={11}>con enzimas</T>
      <Flecha x1={262} y1={140} x2={302} y2={140} c="#8a7a5a" w={2.5} />
      {[[330, 122], [350, 150], [326, 160]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="8" fill="#e8806f" stroke={TINTA} strokeWidth="1.6" />)}
      <T x={338} y={206} s={12} b>3 Reutiliza</T>
      <T x={338} y={222} s={11}>las piezas</T>
    </Lienzo>
  )
}

export function EscenaCitoplasma() {
  return (
    <Lienzo etiqueta="El citoplasma con su citoesqueleto: filamentos que sostienen la célula y llevan cargas">
      <T x={200} y={26} s={15} b>Citoplasma y citoesqueleto</T>
      <g transform="translate(10 20) scale(0.78)">
        <path d="M 40 150 Q 38 66 110 56 Q 190 36 280 58 Q 366 80 360 160 Q 352 240 270 258 Q 190 274 110 258 Q 44 240 40 150 Z" fill="#fbe7e3" stroke="#b05a5a" strokeWidth="6" />
        <g stroke="#9a8a6a" strokeWidth="3.5" fill="none" strokeLinecap="round">
          <path d="M 150 150 L 80 90 M 150 150 L 70 160 M 150 150 L 90 220 M 150 150 L 200 70 M 150 150 L 230 220 M 150 150 L 300 130" />
        </g>
        <g transform="translate(150 150) scale(0.9)"><Nucleo /></g>
        <circle cx="226" cy="108" r="8" fill="#fbe19a" stroke="#c9a23a" strokeWidth="2.4" />
        <Flecha x1={216} y1={113} x2={192} y2={128} c={AZUL} w={2.4} />
      </g>
      <Rotulo x={300} y={50} x2={192} y2={104} t="Vesícula" s="transporte interno" />
      <Rotulo x={300} y={226} x2={190} y2={190} t="Filamentos" s="forma y movimiento" />
      <T x={200} y={292} s={11} i>el citoplasma es el gel donde está todo</T>
    </Lienzo>
  )
}

export function EscenaCiudad() {
  const f: [string, string, () => ReactNode][] = [
    ['Núcleo', 'Ayuntamiento', () => <Nucleo k={0.42} />],
    ['Mitocondria', 'Central eléctrica', () => <Mito k={0.72} />],
    ['Membrana', 'Aduana y muros', () => <path d="M -20 -14 v 28 M -8 -14 v 28 M 4 -14 v 28 M 16 -14 v 28" stroke="#b3861f" strokeWidth="5" strokeLinecap="round" />],
    ['Retículo y Golgi', 'Fábrica y correos', () => <Golgi k={0.6} />],
    ['Lisosoma', 'Reciclaje', () => <Lisosoma k={1.3} />],
    ['Cloroplasto', 'Paneles solares', () => <Cloroplasto k={0.7} />],
  ]
  return (
    <Lienzo etiqueta="La célula como una ciudad: cada orgánulo con su equivalente">
      <T x={200} y={26} s={15} b>La célula, como una ciudad</T>
      {f.map(([o, c, D], i) => (
        <g key={o} transform={`translate(${i % 2 ? 300 : 100} ${72 + Math.floor(i / 2) * 78})`}>
          <rect x="-90" y="-30" width="180" height="62" rx="12" fill="#fff" stroke="#d6cdb8" strokeWidth="2.5" />
          <g transform="translate(-62 2)"><D /></g>
          <T x={24} y={-2} s={12} b>{o}</T>
          <T x={24} y={16} s={11}>{c}</T>
        </g>
      ))}
    </Lienzo>
  )
}

export function EscenaVegetalRotulada() {
  return (
    <Lienzo etiqueta="Una célula vegetal con pared, cloroplastos y vacuola central">
      <g transform="translate(24 38) scale(0.86)"><CelulaVegetalCompleta /></g>
      <Rotulo x={100} y={22} x2={62} y2={68} t="Pared celular" s="rígida, de celulosa" />
      <Rotulo x={250} y={22} x2={262} y2={110} t="Vacuola central" s="agua y reservas" />
      <Rotulo x={250} y={280} x2={316} y2={246} t="Cloroplastos" s="hacen fotosíntesis" />
    </Lienzo>
  )
}

/** Mapa de memoria: quién hace qué. */
export function EscenaResumenOrganulos() {
  const l: [() => ReactNode, string, string][] = [
    [() => <Nucleo k={0.5} />, 'Núcleo', 'guarda el ADN'],
    [() => <Mito k={0.9} />, 'Mitocondria', 'da energía'],
    [() => <RetRugoso k={0.7} />, 'Retículo', 'fabrica y transporta'],
    [() => <Golgi k={0.75} />, 'Golgi', 'empaca y reparte'],
    [() => <Lisosoma k={1.4} />, 'Lisosoma', 'digiere'],
    [() => <Cloroplasto k={0.8} />, 'Cloroplasto', 'hace fotosíntesis'],
  ]
  return (
    <Lienzo etiqueta="Seis orgánulos con su función en una palabra">
      <T x={200} y={24} s={15} b>Cada orgánulo, un oficio</T>
      {l.map(([D, n, f], i) => (
        <g key={n} transform={`translate(${i % 3 === 0 ? 70 : i % 3 === 1 ? 200 : 330} ${i < 3 ? 100 : 214})`}>
          <D />
          <T x={0} y={48} s={12} b>{n}</T>
          <T x={0} y={63} s={10.5}>{f}</T>
        </g>
      ))}
    </Lienzo>
  )
}
