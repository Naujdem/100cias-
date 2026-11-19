import { useCallback, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Caneca, Piseta } from '../dibujos.tsx'

// Química 9 de PLAN-LABORATORIOS.md: «Prepara 100 mL de solución 0,5 M de sulfato de cobre», en mesa viva.
// Todo se hace a mano: cargar la espátula en el frasco, poner el vidrio de reloj en la balanza y tararla
// (tocándola), echar o quitar sólido, pasarlo al vaso, agua con la jarra, la piseta o el gotero, agitar con
// la varilla, poner el embudo, pasar al matraz, enjuagar, aforar mirando la lupa, tapar e invertir.
// En 9° se usa sulfato anhidro (159,6 g/mol) con calculadora y pistas; en 11° el frasco es el pentahidratado
// (249,7 g/mol), sin ayudas y con errores más finos.

const MM = { anhidro: 159.6, penta: 249.7 }
const META = 0.5
const VOL = 100
const VIDRIO = 25.31 // masa del vidrio de reloj
const TOL = 0.15 // mL alrededor del aforo
const INVERSIONES = 5

type Sal = 'anhidro' | 'penta'
interface Rec { soluto: number; solido: number; agua: number }
interface E {
  vidrioEn: 'mesa' | 'balanza'
  enVidrio: number
  tara: number
  tarado: boolean
  esp: number // carga de la espátula
  micro: number // carga de la microespátula
  vaso: Rec
  probeta: Rec
  matraz: Rec
  embudo: boolean
  tapado: boolean
  inversiones: number
  pasado: boolean
  residuo: boolean
  enjuague: boolean
  derrame: number
  directo: boolean // echó sólido sin pesar
}
interface Nivel { grado: number; calculadora: boolean; pistas: boolean }

const vacio = (): Rec => ({ soluto: 0, solido: 0, agua: 0 })
const inicial = (): E => ({
  vidrioEn: 'mesa', enVidrio: 0, tara: 0, tarado: false, esp: 0, micro: 0,
  vaso: vacio(), probeta: vacio(), matraz: vacio(),
  embudo: false, tapado: false, inversiones: 0, pasado: false, residuo: false, enjuague: false, derrame: 0, directo: false,
})
const f = (x: number, d = 2) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })
const r2 = (x: number) => Math.round(x * 100) / 100
const r1 = (x: number) => Math.round(x * 10) / 10
const azar = (paso: number) => r2(paso * (0.85 + Math.random() * 0.3))
const masaMeta = (sal: Sal) => META * (VOL / 1000) * MM[sal]

const RECS = ['vaso', 'probeta', 'matraz'] as const
type R = (typeof RECS)[number]
const esRec = (id: string): id is R => (RECS as readonly string[]).includes(id)
const CAP: Record<R, number> = { vaso: 150, probeta: 110, matraz: 105.3 }
const NOMBRE: Record<string, string> = { vaso: 'el vaso', probeta: 'la probeta', matraz: 'el matraz' }

// ---------- dibujos (los de la mesa vieja, centrados con translate) ----------

function azul(r: Rec, sal: Sal) {
  if (r.agua <= 0) return 'none'
  const M = r.soluto / MM[sal] / (r.agua / 1000)
  return `rgba(30, 110, 210, ${Math.min(0.92, 0.06 + M * 1.3)})`
}
const colorSolido = (sal: Sal) => (sal === 'penta' ? '#2f78c9' : '#e4e7ea')

function Cristales({ x, y, g, sal, ancho = 40 }: { x: number; y: number; g: number; sal: Sal; ancho?: number }) {
  if (g <= 0.005) return null
  const h = Math.min(26, 3 + Math.sqrt(g) * 5)
  const w = Math.min(ancho, 12 + Math.sqrt(g) * 8)
  return <path d={`M${x - w / 2} ${y} Q${x} ${y - h * 2} ${x + w / 2} ${y} Z`} fill={colorSolido(sal)} stroke="#7a8794" strokeWidth="1" />
}

function Frasco({ sal }: { sal: Sal }) {
  return (
    <g transform="translate(-70 -262)">
      <rect x="40" y="215" width="60" height="110" rx="10" fill="#fff" stroke="#3a3a3a" strokeWidth="3" />
      <rect x="48" y="200" width="44" height="18" rx="3" fill="#5a4a3a" />
      <rect x="40" y="265" width="60" height="58" rx="6" fill={colorSolido(sal)} opacity="0.85" />
      <rect x="44" y="232" width="52" height="26" fill="#fffbe8" stroke="#999" />
      <text x="70" y="245" textAnchor="middle" fontSize="10" fontWeight="800">{sal === 'penta' ? 'CuSO₄·5H₂O' : 'CuSO₄'}</text>
      <text x="70" y="255" textAnchor="middle" fontSize="8">{f(MM[sal], 1)} g/mol</text>
    </g>
  )
}

function Balanza({ lectura }: { lectura: number }) {
  return (
    <g>
      <rect x="-60" y="-10" width="120" height="42" rx="6" fill="#d9dde2" stroke="#3a3a3a" strokeWidth="3" />
      <rect x="-50" y="0" width="64" height="22" rx="3" fill="#1d2a22" />
      <text x="10" y="16" textAnchor="end" fontSize="14" fontFamily="monospace" fontWeight="700" fill="#7dfc9a">{f(lectura)}</text>
      <text x="18" y="16" fontSize="11" fontWeight="700">g</text>
      <rect x="28" y="2" width="26" height="18" rx="4" fill="#e67e22" stroke="#3a3a3a" strokeWidth="1.5" />
      <text x="41" y="14" textAnchor="middle" fontSize="8" fontWeight="800" fill="#fff">TARA</text>
      <rect x="-40" y="-26" width="80" height="8" fill="#9aa3ad" />
      <rect x="-5" y="-18" width="10" height="8" fill="#9aa3ad" />
    </g>
  )
}

function VidrioReloj({ g, sal }: { g: number; sal: Sal }) {
  return (
    <g>
      <path d="M-32 6 Q0 -6 32 6 Z" fill="#e8f2fa" stroke="#6b7a88" strokeWidth="2" />
      <Cristales x={0} y={2} g={g} sal={sal} />
    </g>
  )
}

function Espatula({ carga, sal, fina }: { carga: number; sal: Sal; fina?: boolean }) {
  return (
    <g>
      <rect x="-34" y="-3" width="46" height="6" rx="2" fill="#8a6a45" />
      <path d={fina ? 'M12 -2 H34 Q36 0 34 2 H12 Z' : 'M12 -3 H30 Q40 0 30 3 H12 Z'} fill="#b8c2cc" stroke="#555" strokeWidth="1" />
      {carga > 0 && <ellipse cx={fina ? 28 : 27} cy="-3" rx={fina ? 4 : 8} ry={fina ? 2 : 4} fill={colorSolido(sal)} stroke="#7a8794" strokeWidth="0.8" />}
    </g>
  )
}

function Vaso({ r, sal, residuo }: { r: Rec; sal: Sal; residuo: boolean }) {
  const c = 380
  const y = 325 - r.agua * 0.7
  return (
    <g transform="translate(-380 -265)">
      <clipPath id="sm-vaso"><path d={`M${c - 45} 215 V325 H${c + 45} V215 Z`} /></clipPath>
      <rect x={c - 45} y={y} width="90" height={325 - y} fill={azul(r, sal)} clipPath="url(#sm-vaso)" />
      {residuo && r.soluto > 0.01 && r.agua < 3 && [0, 1, 2, 3].map((k) => <circle key={k} cx={c - 35 + k * 22} cy={290 + (k % 2) * 14} r="3" fill="rgba(30,110,210,0.7)" />)}
      <Cristales x={c} y={324} g={r.solido} sal={sal} ancho={70} />
      <path d={`M${c - 52} 210 L${c - 45} 216 V325 H${c + 45} V216 L${c + 50} 210`} fill="none" stroke="#3a3a3a" strokeWidth="3" />
      {[50, 100].map((m) => (
        <g key={m}>
          <line x1={c - 45} x2={c - 30} y1={325 - m * 0.7} y2={325 - m * 0.7} stroke="#3a3a3a" strokeWidth="1.5" />
          <text x={c - 28} y={329 - m * 0.7} fontSize="9">{m}</text>
        </g>
      ))}
      <text x={c} y="205" textAnchor="middle" fontSize="11" fontWeight="700">≈ {f(r.agua, 0)} mL</text>
    </g>
  )
}

function Probeta({ r, sal }: { r: Rec; sal: Sal }) {
  const c = 660
  const y = 325 - r.agua * 1.5
  return (
    <g transform="translate(-660 -235)">
      <rect x={c - 16} y={y} width="32" height={325 - y} fill={azul(r, sal)} />
      <Cristales x={c} y={324} g={r.solido} sal={sal} ancho={28} />
      <path d={`M${c - 16} 140 V325 H${c + 16} V140`} fill="none" stroke="#3a3a3a" strokeWidth="3" />
      <rect x={c - 32} y="325" width="64" height="5" fill="#3a3a3a" />
      {[20, 40, 60, 80, 100].map((m) => (
        <g key={m}>
          <line x1={c - 16} x2={c - 6} y1={325 - m * 1.5} y2={325 - m * 1.5} stroke="#3a3a3a" strokeWidth="1.5" />
          <text x={c + 20} y={329 - m * 1.5} fontSize="9">{m}</text>
        </g>
      ))}
    </g>
  )
}

/** altura del líquido en el matraz aforado: bulbo hasta 92 mL, luego el cuello (aforo en y = 170) */
const nivelMatraz = (v: number) => (v <= 92 ? 325 - (v / 92) * 80 : 245 - (v - 92) * 9.375)

function Matraz({ r, sal, gira }: { r: Rec; sal: Sal; gira: boolean }) {
  const c = 820
  const v = r.agua
  const y = Math.max(115, nivelMatraz(v))
  const forma = `M${c - 7} 115 V248 Q${c - 48} 255 ${c - 48} 290 Q${c - 48} 325 ${c} 325 Q${c + 48} 325 ${c + 48} 290 Q${c + 48} 255 ${c + 7} 248 V115`
  const cerca = v > 96 && v < 104
  const desfase = Math.max(-30, Math.min(30, (v - VOL) * 9.375 * 4))
  return (
    <g transform="translate(-820 -215)">
      <g style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: `rotate(${gira ? 180 : 0}deg)`, transition: 'transform 350ms ease-in-out' }}>
        <clipPath id="sm-matraz"><path d={`${forma} Z`} /></clipPath>
        <rect x={c - 50} y={y} width="100" height={330 - y} fill={azul(r, sal)} clipPath="url(#sm-matraz)" />
        <Cristales x={c} y={323} g={r.solido} sal={sal} ancho={60} />
        <path d={forma} fill="none" stroke="#3a3a3a" strokeWidth="3" />
        <line x1={c - 11} x2={c + 11} y1="170" y2="170" stroke="#c43c3c" strokeWidth="2" />
      </g>
      <text x={c - 14} y="174" textAnchor="end" fontSize="9" fill="#c43c3c" fontWeight="700">aforo</text>
      {cerca && !gira && (
        <g>
          <circle cx={c + 72} cy="170" r="36" fill="#fff" stroke="#3a3a3a" strokeWidth="2" />
          <clipPath id="sm-lupa"><circle cx={c + 72} cy="170" r="35" /></clipPath>
          <g clipPath="url(#sm-lupa)">
            <rect x={c + 50} y="120" width="44" height="100" fill="#f6f9fc" />
            <path d={`M${c + 50} ${170 - desfase} Q${c + 72} ${178 - desfase} ${c + 94} ${170 - desfase} V230 H${c + 50} Z`} fill={azul(r, sal)} />
            <line x1={c + 36} x2={c + 108} y1="170" y2="170" stroke="#c43c3c" strokeWidth="2" />
          </g>
          <text x={c + 72} y="220" textAnchor="middle" fontSize="9" fontWeight="700">lupa: menisco</text>
        </g>
      )}
    </g>
  )
}

const Jarra = () => (
  <g>
    <path d="M-24 -30 H24 V28 Q24 34 18 34 H-18 Q-24 34 -24 28 Z" fill="rgba(255,255,255,0.7)" stroke="#2b2b2b" strokeWidth="2" />
    <rect x="-22" y="-8" width="44" height="40" rx="4" fill="#a9d3f5" opacity="0.8" />
    <path d="M24 -20 Q38 -12 24 8" fill="none" stroke="#2b2b2b" strokeWidth="2" />
    <text y="16" textAnchor="middle" fontSize="8" fontWeight="800" fill="#1d4e74">H₂O dest.</text>
  </g>
)
const Gotero = () => (
  <g transform="rotate(-90)">
    <rect x="-6" y="-26" width="12" height="12" rx="5" fill="#333" />
    <path d="M-5 -14 H5 V14 L1 24 H-1 L-5 14 Z" fill="#dff0fb" stroke="#2b2b2b" strokeWidth="1.5" />
  </g>
)
const Varilla = () => <rect x="-45" y="-2.5" width="90" height="5" rx="2.5" fill="#dfeaf3" stroke="#6b7a88" strokeWidth="1.2" />
const Embudo = () => (
  <g>
    <path d="M-20 -16 H20 L4 4 V22 H-4 V4 Z" fill="rgba(240,248,255,0.85)" stroke="#2b2b2b" strokeWidth="2" />
  </g>
)
const Tapon = () => <path d="M-9 -7 H9 L7 7 H-7 Z" fill="#5a4a3a" />

// ---------- práctica ----------

export default function SolucionMolar({ grado }: { grado: number }) {
  const sal: Sal = grado >= 11 ? 'penta' : 'anhidro'
  const [e, setE] = useState<E>(inicial)
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)
  const [gira, setGira] = useState(false)
  const [calc, setCalc] = useState(grado < 11)
  const [pistas, setPistas] = useState(grado < 11)
  const [res, setRes] = useState<ReturnType<typeof comprobar> | null>(null)
  const nivel: Nivel = { grado, calculadora: calc, pistas }
  const di = (t: string, aviso = false) => setMsg({ t, aviso })
  const lectura = (e.vidrioEn === 'balanza' ? VIDRIO + e.enVidrio : 0) - e.tara

  // tomar el embudo o el tapón que están en el matraz es quitarlos
  const alTomar = useCallback((id: string | null) => {
    setE((x) => (id === 'embudo' && x.embudo ? { ...x, embudo: false } : id === 'tapon' && x.tapado ? { ...x, tapado: false } : x))
  }, [])

  const piezas: Pieza[] = [
    { id: 'frasco', nombre: `Frasco de ${sal === 'penta' ? 'CuSO₄·5H₂O' : 'CuSO₄'}`, x: 60, y: 317, ancho: 70, alto: 130, dibujo: <Frasco sal={sal} /> },
    {
      id: 'balanza', nombre: 'Balanza (toca: TARA)', x: 200, y: 348, ancho: 130, alto: 60, dibujo: <Balanza lectura={lectura} />,
      alTocar: () => {
        setE((x) => ({ ...x, tara: x.vidrioEn === 'balanza' ? VIDRIO + x.enVidrio : 0, tarado: x.vidrioEn === 'balanza' && x.enVidrio === 0 }))
        di(e.vidrioEn === 'balanza' ? 'Taras: la balanza queda en 0,00 g con el vidrio de reloj encima.' : 'Taras la balanza vacía: marca 0,00 g. Ojo: al poner el vidrio, sumará su masa.', e.vidrioEn !== 'balanza')
      },
    },
    { id: 'vaso', nombre: 'Vaso de precipitado', x: 350, y: 320, ancho: 110, alto: 125, tomable: e.vaso.agua > 0 || e.vaso.solido > 0, color: azul(e.vaso, sal), dibujo: <Vaso r={e.vaso} sal={sal} residuo={e.residuo && !e.enjuague} /> },
    { id: 'jarra', nombre: 'Agua destilada (≈25 mL)', x: 470, y: 346, ancho: 70, alto: 70, tomable: true, color: '#a9d3f5', dibujo: <Jarra /> },
    { id: 'piseta', nombre: 'Piseta (≈5 mL)', x: 560, y: 332, ancho: 60, alto: 100, tomable: true, color: '#a9d3f5', dibujo: <Piseta /> },
    { id: 'probeta', nombre: 'Probeta 100 mL', x: 655, y: 290, ancho: 70, alto: 195, tomable: e.probeta.agua > 0 || e.probeta.solido > 0, color: azul(e.probeta, sal), dibujo: <Probeta r={e.probeta} sal={sal} /> },
    {
      id: 'matraz', nombre: e.tapado ? 'Matraz aforado (toca: invertir)' : 'Matraz aforado 100 mL', x: 790, y: 270, ancho: 110, alto: 225, dibujo: <Matraz r={e.matraz} sal={sal} gira={gira} />,
      alTocar: () => {
        if (!e.tapado) return di('Para mezclar, primero pon el tapón en el matraz.', true)
        if (e.matraz.agua <= 0) return di('El matraz está vacío.')
        setGira(true)
        window.setTimeout(() => setGira(false), 700)
        const n = e.inversiones + 1
        setE((x) => ({ ...x, inversiones: n }))
        di(n >= INVERSIONES ? `Inversión ${n}: la solución ya quedó homogénea.` : `Inversión ${n} de al menos ${INVERSIONES}.`)
      },
    },
    { id: 'caneca', nombre: 'Residuos (toca: empezar de nuevo)', x: 955, y: 344, ancho: 54, alto: 76, dibujo: <Caneca />, alTocar: () => { setE(inicial()); setRes(null); di('Todo va al frasco de residuos (el cobre no va al desagüe). Empiezas de nuevo.') } },
    // en el frente de la mesa
    { id: 'esp', nombre: 'Espátula (≈1 g)', x: 130, y: 410, ancho: 80, alto: 22, tomable: true, color: colorSolido(sal), dibujo: <Espatula carga={e.esp} sal={sal} /> },
    { id: 'micro', nombre: 'Microespátula (≈0,1 g)', x: 225, y: 410, ancho: 80, alto: 22, tomable: true, color: colorSolido(sal), dibujo: <Espatula carga={e.micro} sal={sal} fina /> },
    {
      id: 'vidrio', nombre: 'Vidrio de reloj', ...(e.vidrioEn === 'balanza' ? { x: 200, y: 316 } : { x: 310, y: 410 }), ancho: 72, alto: 22, tomable: true, color: colorSolido(sal),
      dibujo: <VidrioReloj g={e.enVidrio} sal={sal} />,
    },
    { id: 'varilla', nombre: 'Varilla de vidrio', x: 410, y: 412, ancho: 96, alto: 16, tomable: true, dibujo: <Varilla /> },
    { id: 'embudo', nombre: e.embudo ? 'Embudo (tómalo para quitarlo)' : 'Embudo', ...(e.embudo ? { x: 790, y: 152 } : { x: 510, y: 408 }), ancho: 44, alto: 40, tomable: true, dibujo: <Embudo /> },
    { id: 'gotero', nombre: 'Gotero (2 gotas ≈ 0,2 mL)', x: 600, y: 412, ancho: 56, alto: 18, tomable: true, color: '#a9d3f5', dibujo: <Gotero /> },
    { id: 'tapon', nombre: e.tapado ? 'Tapón (tómalo para quitarlo)' : 'Tapón', ...(e.tapado ? { x: 790, y: 163 } : { x: 690, y: 412 }), ancho: 30, alto: 20, tomable: true, dibujo: <Tapon /> },
  ]

  const destinos = (de: string): string[] => {
    if (de === 'esp' || de === 'micro') return e[de] > 0 ? ['vidrio', 'vaso', 'probeta', 'matraz'] : ['frasco', ...(e.enVidrio > 0 ? ['vidrio'] : [])]
    if (de === 'vidrio') return e.vidrioEn === 'balanza' ? [...RECS] : ['balanza', ...RECS]
    if (de === 'jarra' || de === 'piseta' || de === 'gotero') return [...RECS]
    if (de === 'varilla') return ['vaso']
    if (de === 'vaso') return ['matraz', 'probeta']
    if (de === 'probeta') return ['matraz', 'vaso']
    if (de === 'embudo' || de === 'tapon') return ['matraz']
    return []
  }

  const soltar = (de: string, en: string): Uso | string => {
    setRes(null)
    if (de === 'esp' || de === 'micro') {
      const paso = de === 'esp' ? 1 : 0.1
      const carga = e[de]
      if (en === 'frasco') {
        if (carga > 0) return 'La espátula ya está cargada: lleva el sólido al vidrio de reloj.'
        const g = azar(paso)
        return { anim: 'poner', hecho: () => { setE((x) => ({ ...x, [de]: g })); di('Cargas la espátula con sulfato de cobre. Llévala al vidrio de reloj.') } }
      }
      if (en === 'vidrio') {
        if (carga > 0) return { anim: 'polvo', hecho: () => { setE((x) => ({ ...x, enVidrio: r2(x.enVidrio + carga), [de]: 0 })); if (e.vidrioEn !== 'balanza') di('Echas el sólido en el vidrio, pero no está sobre la balanza: así no sabes cuánto pesaste.', true) } }
        if (e.enVidrio <= 0) return 'El vidrio está vacío.'
        const q = Math.min(e.enVidrio, azar(paso))
        return { anim: 'poner', hecho: () => { setE((x) => ({ ...x, enVidrio: r2(x.enVidrio - q) })); di(`Quitas unos ${f(q)} g y los echas a residuos (lo pesado de más no se devuelve al frasco: lo contaminarías).`) } }
      }
      if (esRec(en)) {
        if (carga <= 0) return 'La espátula está vacía: cárgala en el frasco.'
        return { anim: 'polvo', hecho: () => { setE((x) => ({ ...x, [de]: 0, directo: true, [en]: { ...x[en], solido: r2(x[en].solido + carga) } })); di(`Echas el sólido directo en ${NOMBRE[en]} sin pesarlo: no sabrás cuánto usaste.`, true) } }
      }
      return 'Eso no se puede hacer con la espátula.'
    }
    if (de === 'vidrio') {
      if (en === 'balanza') return { anim: 'poner', hecho: () => { setE((x) => ({ ...x, vidrioEn: 'balanza' })); di(e.tara === 0 ? 'Pones el vidrio de reloj en la balanza: marca su masa. Toca la balanza (TARA) para ponerla en cero.' : 'Pones el vidrio en la balanza.') } }
      if (!esRec(en)) return 'El sólido se pasa a un recipiente.'
      if (e.enVidrio <= 0) return 'El vidrio de reloj está vacío.'
      return {
        anim: 'polvo',
        hecho: () => {
          setE((x) => ({ ...x, vidrioEn: 'mesa', enVidrio: 0, [en]: { ...x[en], solido: r2(x[en].solido + x.enVidrio) } }))
          di(en === 'vaso' ? 'El sólido queda en el vaso. Ahora, agua y a disolver.' : `Echas el sólido directo en ${NOMBRE[en]}: es mejor disolverlo antes en un vaso.`, en !== 'vaso')
        },
      }
    }
    if (de === 'jarra' || de === 'piseta' || de === 'gotero') {
      if (!esRec(en)) return 'El agua se agrega a un recipiente.'
      if (en === 'matraz' && e.tapado) return 'Quita primero el tapón.'
      if (en === 'matraz' && e.embudo && de === 'gotero') return 'Quita el embudo antes de aforar: tapa la vista del menisco y el agua pegada en él cambia el volumen.'
      const mL = de === 'jarra' ? 25 : de === 'piseta' ? 5 : 0.2
      return de === 'gotero'
        ? { anim: 'gotas', gotas: 2, hecho: () => agua(en, mL) }
        : { anim: 'verter', hecho: () => agua(en, mL) }
    }
    if (de === 'varilla') {
      const v = e.vaso
      if (v.solido <= 0) return 'No hay sólido por disolver en el vaso.'
      if (v.agua <= 0) return 'Primero agrega agua al vaso.'
      return {
        anim: 'frotar',
        hecho: () => {
          const max = v.agua * 0.3 - v.soluto // ≈ 30 g por 100 mL
          const d = Math.max(0, Math.min(v.solido, max, Math.max(1, v.solido * 0.5)))
          const n = { ...v, soluto: v.soluto + d, solido: r2(v.solido - d) }
          setE((x) => ({ ...x, vaso: n }))
          di(n.solido <= 0 ? 'El sólido se disolvió por completo.' : d < Math.min(v.solido, Math.max(1, v.solido * 0.5)) ? 'Ya no se disuelve más: agrega un poco de agua y vuelve a agitar.' : 'Se disuelve una parte: sigue agitando.', n.solido > 0 && d < 1)
        },
      }
    }
    if (de === 'vaso' || de === 'probeta') {
      if (!esRec(en) || en === de) return 'Solo se puede pasar a otro recipiente.'
      if (en === 'matraz' && e.tapado) return 'Quita primero el tapón.'
      return { anim: 'verter', hecho: () => pasar(de, en) }
    }
    if (de === 'embudo') return e.tapado ? 'Quita primero el tapón.' : { anim: 'poner', hecho: () => setE((x) => ({ ...x, embudo: true })) }
    if (de === 'tapon') {
      if (e.embudo) return 'Quita primero el embudo (tómalo y suéltalo en la mesa).'
      return { anim: 'poner', hecho: () => { setE((x) => ({ ...x, tapado: true })); di('Matraz tapado. Tócalo para invertirlo (al menos 5 veces).') } }
    }
    return 'No se puede.'
  }

  function agua(id: R, mL: number) {
    const r = e[id]
    let a = r1(r.agua + mL)
    if (a > CAP[id]) {
      const perdida = r.agua > 0 ? r.soluto * (mL / (r.agua + mL)) : 0
      setE((x) => ({ ...x, derrame: x.derrame + perdida, [id]: { ...r, soluto: r.soluto - perdida, agua: CAP[id] } }))
      return di(`¡Se rebosó ${NOMBRE[id]}! Se perdió líquido con sulfato de cobre.`, true)
    }
    a = Math.round(a * 100) / 100
    let n: E = { ...e, [id]: { ...r, agua: a } }
    let t = `${NOMBRE[id][0].toUpperCase()}${NOMBRE[id].slice(1)} tiene unos ${f(a, 1)} mL.`
    let aviso = false
    if (id === 'matraz') {
      n = { ...n, inversiones: 0 }
      if (a > VOL + TOL && !e.pasado) { n = { ...n, pasado: true }; t = 'Te pasaste del aforo. El agua ya no se puede sacar sin cambiar la concentración.'; aviso = true }
      else if (a > 96 && a < VOL - TOL) t = 'Ya vas cerca del aforo: sigue con el gotero, mirando la lupa.'
      else if (Math.abs(a - VOL) <= TOL) t = 'La parte de abajo del menisco toca la línea: ¡aforado!'
    }
    if (id === 'vaso' && e.residuo) n = { ...n, enjuague: true }
    setE(n)
    di(t, aviso)
  }

  function pasar(de: R, en: R) {
    const a = e[de]
    const b = e[en]
    if (a.agua <= 0 && a.solido <= 0) return di(`${NOMBRE[de]} está vacío.`)
    const queda = a.agua > 1 ? 0.02 : 0 // una película queda pegada a las paredes
    let sol = a.soluto * (1 - queda)
    let ag = r1(a.agua * (1 - queda))
    let sd = a.solido
    let n: E = { ...e, [de]: { soluto: a.soluto - sol, solido: 0, agua: r1(a.agua - ag) } }
    const t: string[] = [`Pasas el contenido a ${NOMBRE[en]}.`]
    let aviso = false
    if (en === 'matraz' && !e.embudo) { // sin embudo, por el cuello angosto se derrama una parte
      const p = 0.06
      n = { ...n, derrame: n.derrame + (sol + sd) * p }
      sol *= 1 - p; sd = r2(sd * (1 - p)); ag = r1(ag * (1 - p))
      t.push('Sin embudo, parte se derramó por fuera del cuello.'); aviso = true
    }
    let nb: Rec = { soluto: b.soluto + sol, solido: r2(b.solido + sd), agua: r1(b.agua + ag) }
    if (nb.agua > CAP[en]) {
      const p = nb.soluto * ((nb.agua - CAP[en]) / nb.agua)
      nb = { ...nb, soluto: nb.soluto - p, agua: CAP[en] }
      n = { ...n, derrame: n.derrame + p }
      t.push(`¡Se rebosó ${NOMBRE[en]}!`); aviso = true
    }
    n = { ...n, [en]: nb }
    if (de === 'vaso' && queda) {
      n = { ...n, residuo: true, enjuague: e.residuo && e.enjuague }
      if (!e.residuo) t.push('Quedaron gotas azules en las paredes del vaso.')
    }
    if (en === 'matraz') {
      n = { ...n, inversiones: 0 }
      if (nb.agua > VOL + TOL && !e.pasado) { n = { ...n, pasado: true }; t.push('Te pasaste del aforo.'); aviso = true }
    }
    if (a.solido > 0) { t.push('Pasaste sólido sin disolver.'); aviso = true }
    setE(n)
    di(t.join(' '), aviso)
  }

  const m = masaMeta(sal)
  const PISTAS = [
    { texto: `Calcula la masa: m = M × V × masa molar${calc ? ' (usa la calculadora)' : ''}.`, hecho: e.tarado || e.enVidrio > 0 || e.vaso.solido + e.vaso.soluto > 0 },
    { texto: 'Pon el vidrio de reloj en la balanza y tócala para tarar (0,00 g).', hecho: e.tarado },
    { texto: `Carga la espátula en el frasco y pesa ${grado < 11 ? `${f(m)} g` : 'la masa calculada'}; afina con la microespátula (vacía, quita sólido).`, hecho: e.vaso.solido + e.vaso.soluto > 0 },
    { texto: 'Lleva el vidrio de reloj al vaso y agrega unos 50 mL de agua (dos jarras).', hecho: e.vaso.agua >= 30 || e.matraz.agua > 0 },
    { texto: 'Agita con la varilla hasta que no quede sólido.', hecho: e.vaso.soluto > 0 && e.vaso.solido === 0 },
    { texto: 'Pon el embudo en el matraz aforado y pasa la solución (no a la probeta).', hecho: e.matraz.soluto > 0 },
    { texto: 'Enjuaga el vaso con la piseta y pasa ese agua también al matraz.', hecho: e.residuo && e.enjuague && e.vaso.agua < 1 },
    { texto: 'Quita el embudo y completa hasta el aforo: piseta y, al final, gotero mirando la lupa.', hecho: Math.abs(e.matraz.agua - VOL) <= TOL },
    { texto: `Pon el tapón e invierte el matraz (tócalo) al menos ${INVERSIONES} veces. Luego, «Comprobar».`, hecho: e.inversiones >= INVERSIONES },
  ]
  const siguiente = PISTAS.findIndex((p) => !p.hecho)

  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        Prepara exactamente <b>{VOL} mL de solución {f(META, 1)} M</b> de sulfato de cobre{sal === 'penta' ? <> usando la sal <b>pentahidratada</b> (CuSO₄·5H₂O) del frasco</> : ''}. Todo se hace a mano: toma cada objeto y llévalo a donde se usa. El color muestra la concentración. Cuando creas que está lista, pulsa «Comprobar».
      </p>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={calc} onChange={(ev) => setCalc(ev.target.checked)} /> Calculadora</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={pistas} onChange={(ev) => setPistas(ev.target.checked)} /> Pasos y pistas</label>
        {grado < 9 && <span className="text-[var(--suave)]">Esta práctica es desde 9°.</span>}
      </div>
      <MesaViva desde={110} alto={440} piezas={piezas} destinos={destinos} soltar={soltar} alTomar={alTomar} />
      {msg && <p className={`-mt-2 text-sm ${msg.aviso ? 'font-semibold text-[#b5462c]' : ''}`}>{msg.aviso ? '⚠ ' : '› '}{msg.t}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {pistas && (
          <ol className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
            {PISTAS.map((p, k) => (
              <li key={k} className={`py-0.5 ${p.hecho ? 'text-[var(--suave)] line-through' : k === siguiente ? 'font-semibold' : ''}`}>{p.hecho ? '✔' : k === siguiente ? '➜' : '○'} {p.texto}</li>
            ))}
          </ol>
        )}
        {calc && <Calculadora n={nivel} />}
      </div>
      <div>
        <button className="rounded-xl bg-[var(--acento)] px-5 py-2 font-semibold text-white" onClick={() => setRes(comprobar(e, sal, nivel))}>Comprobar</button>
      </div>
      {res && (
        <div className={`rounded-2xl p-4 text-sm ${res.ok ? 'bg-[#eaf5ee]' : 'bg-[#fbeee9]'}`}>
          <p className="text-base font-semibold">{res.ok ? '✔ ' : '✘ '}{res.titulo}</p>
          <ul className="mt-2 list-disc pl-5">{res.lineas.map((l, k) => <li key={k}>{l}</li>)}</ul>
          {res.datos.length > 0 && (
            <table className="mt-3 text-sm"><tbody>{res.datos.map(([a, b]) => <tr key={a}><td className="pr-4 text-[var(--suave)]">{a}</td><td className="font-semibold">{b}</td></tr>)}</tbody></table>
          )}
        </div>
      )}
      <p className="text-xs text-[var(--suave)]">Seguridad: el sulfato de cobre es tóxico si se ingiere e irrita la piel y los ojos. En la vida real se usan guantes y gafas, y los restos van al frasco de residuos, nunca al desagüe.</p>
    </div>
  )
}

function comprobar(e: E, sal: Sal, n: Nivel) {
  const enMatraz = e.matraz.agua > 0
  const r = enMatraz ? e.matraz : e.probeta
  const lineas: string[] = []
  const mm = MM[sal]
  const meta = masaMeta(sal)
  const total = e.matraz.soluto + e.matraz.solido + e.probeta.soluto + e.probeta.solido + e.vaso.soluto + e.vaso.solido + e.derrame
  if (r.agua <= 0) return { ok: false, titulo: 'Todavía no hay solución', lineas: ['Prepárala en el matraz aforado y vuelve a comprobar.'], datos: [] as [string, string][] }
  const vReal = enMatraz ? r.agua : r.agua + 0.9 // la probeta mide con ±1 mL
  const M = (r.soluto + r.solido) / mm / (vReal / 1000)
  const err = ((M - META) / META) * 100
  let ok = Math.abs(err) <= (n.grado >= 11 ? 1 : 2)

  if (!enMatraz) { ok = false; lineas.push('Usaste la probeta: mide con un error de ±1 mL, no sirve para preparar soluciones exactas. Usa el matraz aforado.') }
  if (e.directo) lineas.push('Echaste sólido con la espátula directo en un recipiente, sin pesarlo.')
  if (Math.abs(total - meta) / meta > 0.02) {
    if (Math.abs(total - META * mm) / (META * mm) < 0.05) lineas.push(`Pesaste ${f(total)} g: calculaste con 1 L en vez de 0,1 L. Recuerda pasar los mL a litros (100 mL = 0,1 L).`)
    else if (sal === 'penta' && Math.abs(total - masaMeta('anhidro')) / masaMeta('anhidro') < 0.03) lineas.push(`Pesaste ${f(total)} g: usaste la masa molar del sulfato anhidro (159,6 g/mol), pero tu frasco es el pentahidratado (249,7 g/mol). El agua de cristalización también pesa.`)
    else lineas.push(`Pesaste ${f(total)} g de sulfato de cobre y se necesitaban ${f(meta)} g.`)
    if (!e.tarado) lineas.push(`No taraste con el vidrio encima: la lectura incluía los ${f(VIDRIO)} g del vidrio de reloj.`)
  }
  if (r.solido > 0) { ok = false; lineas.push('Quedó sólido sin disolver: hay que disolverlo en el vaso antes de pasarlo al matraz.') }
  if (e.derrame > 0.005) lineas.push(`Se perdieron unos ${f(e.derrame)} g de soluto (se derramó o se rebosó un recipiente). Usa el embudo para pasar al matraz.`)
  if (e.residuo && !e.enjuague && e.vaso.soluto > 0.01) lineas.push(`Quedaron ${f(e.vaso.soluto)} g de soluto pegados al vaso: enjuágalo con la piseta y pasa ese agua al matraz.`)
  if (enMatraz) {
    if (e.pasado) { ok = false; lineas.push(`Te pasaste del aforo (${f(r.agua, 1)} mL). Cuando eso pasa, toca empezar de nuevo.`) }
    else if (r.agua < VOL - TOL) { ok = false; lineas.push(`Falta agua: el líquido está en ${f(r.agua, 1)} mL, por debajo del aforo. La parte de abajo del menisco debe tocar la línea.`) }
    if (e.inversiones < INVERSIONES) {
      if (n.grado >= 11) ok = false
      lineas.push(`No mezclaste bien (${e.inversiones} inversiones): tapa el matraz e inviértelo al menos ${INVERSIONES} veces para que la concentración sea igual en toda la solución.`)
    }
  }
  if (ok && !lineas.length) lineas.push('Masa correcta, todo el soluto disuelto y trasvasado, aforo exacto y solución homogénea.')
  return {
    ok,
    titulo: ok ? `¡Bien hecho! Tu solución es ${f(M, 3)} M` : `Tu solución es ${f(M, 3)} M (se buscaba ${f(META, 3)} M)`,
    lineas,
    datos: [
      ['Sustancia', sal === 'penta' ? 'CuSO₄·5H₂O (249,7 g/mol)' : 'CuSO₄ (159,6 g/mol)'],
      ['Masa necesaria', `${f(meta)} g`],
      ['Masa usada', `${f(total)} g`],
      ['Volumen final', `${f(r.agua, 1)} mL en ${enMatraz ? 'matraz aforado' : 'probeta'}`],
      ['Molaridad obtenida', `${f(M, 3)} M`],
      ['Error', `${err >= 0 ? '+' : ''}${f(err, 1)} %`],
    ] as [string, string][],
  }
}

function Calculadora({ n }: { n: Nivel }) {
  const [M, setM] = useState('0,5')
  const [V, setV] = useState('')
  const [mm, setMm] = useState('')
  const num = (s: string) => parseFloat(s.replace(',', '.'))
  const m = num(M) * num(V) * num(mm)
  const campo = 'w-24 rounded-lg border border-[var(--linea)] bg-white px-2 py-1 text-right'
  return (
    <div className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
      <h3 className="font-semibold">Calculadora</h3>
      <p className="mt-1 text-[var(--suave)]">m = M × V × masa molar{n.grado < 11 ? ' (el volumen va en litros)' : ''}</p>
      <div className="mt-2 grid grid-cols-[auto_auto] items-center gap-2">
        <span>M (mol/L)</span>
        <input className={campo} value={M} onChange={(ev) => setM(ev.target.value)} />
        <span>V (L)</span>
        <input className={campo} value={V} placeholder="¿?" onChange={(ev) => setV(ev.target.value)} />
        <span>Masa molar (g/mol)</span>
        <input className={campo} value={mm} placeholder="¿?" onChange={(ev) => setMm(ev.target.value)} />
      </div>
      <p className="mt-2 text-base font-bold">m = {Number.isFinite(m) ? `${f(m)} g` : '…'}</p>
    </div>
  )
}
