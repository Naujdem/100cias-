import { useState } from 'react'
import PantallaCompleta from '../PantallaCompleta.tsx'
import { Nucleo, Mito, Golgi, RetRugoso, RetLiso, Lisosoma, Cloroplasto } from '../ilustraciones/CelulaEuc.tsx'
import { useFlechas } from '../../lib/flechasDiagrama.ts'

// Comparador rotulado: célula vegetal (izquierda) y animal (derecha) con los nombres en el centro.
// Al elegir un nombre, la estructura se ilumina en las dos células y salen líneas hasta ella. Esquema, no a escala.

type En = 'ambas' | 'vegetal' | 'animal'
interface Parte {
  id: string
  nombre: string
  en: En
  texto: string
  /** dónde apuntan las líneas en cada célula */
  veg?: [number, number][]
  ani?: [number, number][]
}

const PARTES: Parte[] = [
  { id: 'pared', nombre: 'Pared celular', en: 'vegetal', texto: 'Capa rígida de celulosa por fuera de la membrana. Da forma y sostén.', veg: [[34, 200]] },
  { id: 'membrana', nombre: 'Membrana celular', en: 'ambas', texto: 'La frontera de toda célula: controla qué entra y qué sale.', veg: [[58, 140]], ani: [[474, 200]] },
  { id: 'citoplasma', nombre: 'Citoplasma', en: 'ambas', texto: 'El interior, entre la membrana y el núcleo, donde flotan los orgánulos.', veg: [[100, 300]], ani: [[700, 310]] },
  { id: 'nucleo', nombre: 'Núcleo', en: 'ambas', texto: 'Guarda el ADN: las instrucciones de la célula.', veg: [[140, 118]], ani: [[600, 140]] },
  { id: 'nucleolo', nombre: 'Nucléolo', en: 'ambas', texto: 'Dentro del núcleo: ahí se arman las piezas de los ribosomas.', veg: [[131, 111]], ani: [[591, 133]] },
  { id: 'ribosomas', nombre: 'Ribosomas', en: 'ambas', texto: 'Diminutos, fabrican proteínas. Libres o pegados al retículo rugoso.', veg: [[108, 196]], ani: [[650, 74]] },
  { id: 'rer', nombre: 'Retículo rugoso', en: 'ambas', texto: 'Membranas con ribosomas: fabrica y transporta proteínas.', veg: [[214, 104]], ani: [[672, 118]] },
  { id: 'rel', nombre: 'Retículo liso', en: 'ambas', texto: 'Sin ribosomas: fabrica lípidos y ayuda a eliminar tóxicos.', veg: [[236, 166]], ani: [[704, 178]] },
  { id: 'golgi', nombre: 'Aparato de Golgi', en: 'ambas', texto: 'Empaca las proteínas en vesículas y las envía.', veg: [[92, 286]], ani: [[612, 290]] },
  { id: 'mito', nombre: 'Mitocondria', en: 'ambas', texto: 'Saca la energía de la glucosa (ATP). Las plantas también la tienen.', veg: [[94, 108], [126, 250]], ani: [[522, 140], [722, 244]] },
  { id: 'perox', nombre: 'Peroxisoma', en: 'ambas', texto: 'Desactiva sustancias peligrosas, como el agua oxigenada.', veg: [[282, 150]], ani: [[662, 222]] },
  { id: 'vacuola', nombre: 'Vacuola', en: 'ambas', texto: 'En la vegetal es enorme y mantiene la célula firme; en la animal son pequeñas y pocas.', veg: [[222, 244]], ani: [[522, 262]] },
  { id: 'citoesq', nombre: 'Microtúbulos', en: 'ambas', texto: 'Parte del citoesqueleto: rieles y andamio de la célula.', veg: [[246, 84]], ani: [[748, 206]] },
  { id: 'cloro', nombre: 'Cloroplasto', en: 'vegetal', texto: 'Captura la luz y hace la fotosíntesis.', veg: [[78, 168], [176, 322]] },
  { id: 'amilo', nombre: 'Amiloplasto', en: 'vegetal', texto: 'Guarda almidón como reserva, por ejemplo en la papa.', veg: [[248, 316]] },
  { id: 'liso', nombre: 'Lisosoma', en: 'animal', texto: 'Digiere y recicla. En la vegetal, la vacuola cumple buena parte de ese trabajo.', ani: [[544, 210], [692, 300]] },
  { id: 'centriolos', nombre: 'Centríolos', en: 'animal', texto: 'Organizan el huso al dividirse. Las plantas con flor no los tienen.', ani: [[724, 140]] },
]

const HEX = 'M 30 200 L 100 52 L 260 52 L 330 200 L 260 348 L 100 348 Z'
const HEX_IN = 'M 46 200 L 108 66 L 252 66 L 314 200 L 252 334 L 108 334 Z'
const ETIQ: Record<En, string> = { ambas: 'Las dos', vegetal: 'Solo vegetal', animal: 'Solo animal' }
type Filtro = 'todas' | En

function Peroxisoma({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="7" fill="#e9b3d6" stroke="#a04a7a" strokeWidth="2" />
      <circle cx={x} cy={y} r="2.5" fill="#a04a7a" />
    </g>
  )
}

export default function ComparadorRotulado() {
  const [sel, setSel] = useState<string>('nucleo')
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const visibles = PARTES.filter((p) => filtro === 'todas' || p.en === filtro)
  const p = PARTES.find((x) => x.id === sel) ?? PARTES[0]
  // los contenedores grandes (pared, membrana, citoplasma) no se apagan: si no, toda la célula se vería borrosa
  const FONDO = ['pared', 'membrana', 'citoplasma']
  const ver = (id: string) => {
    const vis = visibles.some((x) => x.id === id)
    if (FONDO.includes(id)) return { opacity: vis ? 1 : 0.35, transition: 'opacity 0.4s' }
    return { opacity: !vis ? 0.12 : id === sel ? 1 : 0.5, transition: 'opacity 0.4s' }
  }
  const luz = (id: string) => (id === sel ? { filter: 'drop-shadow(0 0 5px #f0a020)' } : undefined)
  const g = (id: string) => ({ style: { ...ver(id), ...luz(id) } })

  useFlechas((dir) => {
    const k = visibles.findIndex((x) => x.id === sel)
    const n = visibles[(k + dir + visibles.length) % visibles.length]
    if (n) setSel(n.id)
    return true
  })

  const yEtiq = (k: number) => 30 + k * (340 / Math.max(1, PARTES.length - 1))

  return (
    <PantallaCompleta>
      <div role="group" aria-label="Mostrar" className="mb-2 flex flex-wrap gap-2">
        {(['todas', 'ambas', 'vegetal', 'animal'] as Filtro[]).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filtro === f}
            onClick={() => {
              setFiltro(f)
              const pr = PARTES.find((x) => f === 'todas' || x.en === f)
              if (pr && !(f === 'todas' || p.en === f)) setSel(pr.id)
            }}
            className="min-h-10 rounded-full border border-[var(--acento)] px-3 text-sm font-semibold text-[var(--acento)] aria-pressed:bg-[var(--acento)] aria-pressed:text-[var(--sobre-acento)]"
          >
            {f === 'todas' ? 'Todas' : f === 'ambas' ? 'Compartidas' : ETIQ[f]}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--linea)] bg-[#fbf8f1]">
        <svg viewBox="0 0 800 400" role="img" aria-label={`Célula vegetal y animal: ${p.nombre}`} className="block h-auto w-full">
          <text x="180" y="22" textAnchor="middle" fontSize="16" fontWeight="800" fill="#3f7a35">Célula vegetal</text>
          <text x="620" y="22" textAnchor="middle" fontSize="16" fontWeight="800" fill="#3b6fb6">Célula animal</text>

          {/* ── vegetal ── */}
          <path d={HEX} fill="#5c9e48" stroke="#3f7a35" strokeWidth="3" {...g('pared')} />
          <path d={HEX_IN} fill="#cfe7b8" stroke="#2f6b2a" strokeWidth="3" {...g('membrana')} />
          <path d={HEX_IN} fill="#cfe7b8" stroke="none" transform="translate(180 200) scale(0.97) translate(-180 -200)" {...g('citoplasma')} />
          <g {...g('vacuola')}><path d="M 176 210 Q 184 170 240 176 Q 300 186 292 248 Q 282 300 226 296 Q 170 290 176 210 Z" fill="#bfe0f5" stroke="#3b6fb6" strokeWidth="3" /></g>
          <g {...g('nucleo')}><g transform="translate(140 118) scale(0.85)"><Nucleo /></g></g>
          <circle cx="131" cy="111" r="9" fill="#9a6fc6" {...g('nucleolo')} />
          <g {...g('rer')}><g transform="translate(214 104) rotate(-15) scale(0.75)"><RetRugoso /></g></g>
          <g {...g('rel')}><g transform="translate(236 166) scale(0.7)"><RetLiso /></g></g>
          <g {...g('golgi')}><g transform="translate(92 286) scale(0.8)"><Golgi /></g></g>
          <g {...g('mito')}><g transform="translate(94 108) scale(0.7)"><Mito a={20} /></g><g transform="translate(126 250) scale(0.7)"><Mito a={-30} /></g></g>
          <g {...g('cloro')}><g transform="translate(78 168) scale(0.6)"><Cloroplasto a={70} /></g><g transform="translate(176 322) scale(0.6)"><Cloroplasto a={0} /></g><g transform="translate(286 220) scale(0.5)"><Cloroplasto a={80} /></g></g>
          <g {...g('amilo')}>
            <ellipse cx="248" cy="316" rx="14" ry="10" fill="#efe2f6" stroke="#8a5aa8" strokeWidth="2" />
            <path d="M 240 316 a 8 6 0 0 1 16 0 M 244 316 a 4 3 0 0 1 8 0" fill="none" stroke="#8a5aa8" strokeWidth="1.5" />
          </g>
          <g {...g('perox')}><Peroxisoma x={282} y={150} /></g>
          <g {...g('citoesq')} stroke="#5aa05a" strokeWidth="2.5" strokeLinecap="round"><line x1="232" y1="78" x2="262" y2="92" /><line x1="236" y1="90" x2="258" y2="78" /></g>
          <g {...g('ribosomas')} fill="#6b4a2a">{[[108, 196], [70, 220], [200, 140], [160, 190], [210, 300], [70, 120]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="2.6" />)}</g>

          {/* ── animal ── */}
          <circle cx="620" cy="200" r="150" fill="#d8ecfa" stroke="#3b6fb6" strokeWidth="4" {...g('membrana')} />
          <circle cx="620" cy="200" r="144" fill="#d8ecfa" {...g('citoplasma')} />
          <g {...g('vacuola')}><ellipse cx="522" cy="262" rx="16" ry="11" fill="#bfe0f5" stroke="#3b6fb6" strokeWidth="2" /></g>
          <g {...g('nucleo')}><g transform="translate(600 140) scale(0.95)"><Nucleo /></g></g>
          <circle cx="591" cy="133" r="10" fill="#9a6fc6" {...g('nucleolo')} />
          <g {...g('rer')}><g transform="translate(672 118) rotate(20) scale(0.8)"><RetRugoso /></g></g>
          <g {...g('rel')}><g transform="translate(704 178) scale(0.7)"><RetLiso /></g></g>
          <g {...g('golgi')}><g transform="translate(612 290) scale(0.85)"><Golgi /></g></g>
          <g {...g('mito')}><g transform="translate(522 140) scale(0.75)"><Mito a={-40} /></g><g transform="translate(722 244) scale(0.75)"><Mito a={25} /></g><g transform="translate(566 300) scale(0.65)"><Mito a={10} /></g></g>
          <g {...g('liso')}><g transform="translate(544 210)"><Lisosoma /></g><g transform="translate(692 300)"><Lisosoma /></g></g>
          <g {...g('perox')}><Peroxisoma x={662} y={222} /></g>
          <g {...g('centriolos')}>
            <rect x="712" y="134" width="20" height="8" rx="2" fill="#2f8a6a" />
            <rect x="726" y="130" width="8" height="20" rx="2" fill="#2f8a6a" />
          </g>
          <g {...g('citoesq')} stroke="#5aa05a" strokeWidth="2.5" strokeLinecap="round"><line x1="740" y1="190" x2="756" y2="226" /><line x1="748" y1="186" x2="742" y2="226" /><line x1="500" y1="96" x2="520" y2="112" /></g>
          <g {...g('ribosomas')} fill="#6b4a2a">{[[650, 74], [560, 200], [700, 140], [640, 250], [520, 180], [750, 280]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="2.6" />)}</g>

          {/* líneas desde el nombre elegido */}
          {(() => {
            const k = PARTES.findIndex((x) => x.id === sel)
            const y = yEtiq(k)
            return (
              <g stroke="#e08a00" strokeWidth="2" fill="none" key={sel} className="animate-[aparecer_0.4s_ease-out]">
                {(p.veg ?? []).map(([x2, y2], j) => <polyline key={`v${j}`} points={`340,${y} ${x2},${y2}`} />)}
                {(p.ani ?? []).map(([x2, y2], j) => <polyline key={`a${j}`} points={`460,${y} ${x2},${y2}`} />)}
                {[...(p.veg ?? []), ...(p.ani ?? [])].map(([x2, y2], j) => <circle key={`c${j}`} cx={x2} cy={y2} r="5" fill="#e08a00" stroke="none" />)}
              </g>
            )
          })()}

          {/* nombres en el centro */}
          {PARTES.map((x, k) => {
            const y = yEtiq(k)
            const activa = x.id === sel
            const vis = visibles.some((v) => v.id === x.id)
            return (
              <g key={x.id} role="button" tabIndex={vis ? 0 : -1} aria-pressed={activa} aria-label={x.nombre}
                onClick={() => vis && setSel(x.id)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && vis && setSel(x.id)}
                style={{ cursor: vis ? 'pointer' : 'default', opacity: vis ? 1 : 0.25, transition: 'opacity 0.3s' }}>
                <rect x="342" y={y - 9} width="116" height="18" rx="9" fill={activa ? '#0f6e56' : '#ffffff'} stroke={activa ? '#0f6e56' : '#d6cdb8'} />
                <text x="400" y={y + 4} textAnchor="middle" fontSize="11" fontWeight={activa ? 800 : 600} fill={activa ? '#ffffff' : '#2b2b2b'}>{x.nombre}</text>
                {x.en !== 'animal' && <circle cx="336" cy={y} r="3" fill="#3f7a35" />}
                {x.en !== 'vegetal' && <circle cx="464" cy={y} r="3" fill="#3b6fb6" />}
              </g>
            )
          })}
        </svg>
      </div>

      <div aria-live="polite" className="mt-3 flex flex-wrap items-start gap-3 rounded-xl bg-[var(--fondo)] p-3">
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold">{p.nombre}</p>
          <p className="mt-1">{p.texto}</p>
        </div>
        <div className="flex gap-2 text-sm font-semibold">
          <span className={`rounded-full px-3 py-1 ${p.en !== 'animal' ? 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100' : 'bg-[var(--linea)] text-[var(--suave)] line-through'}`}>Vegetal</span>
          <span className={`rounded-full px-3 py-1 ${p.en !== 'vegetal' ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100' : 'bg-[var(--linea)] text-[var(--suave)] line-through'}`}>Animal</span>
        </div>
      </div>
      <p className="mt-2 text-xs text-[var(--suave)]">Toca un nombre o usa ← → · los puntos verde y azul junto a cada nombre dicen en qué célula está · esquema, no a escala.</p>
    </PantallaCompleta>
  )
}
