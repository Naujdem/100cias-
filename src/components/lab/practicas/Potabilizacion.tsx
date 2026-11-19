import { useEffect, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Caneca } from '../dibujos.tsx'

// Práctica extra 10 (PLAN-LABORATORIOS.md): potabilización del agua, desde 6° (PRAE).
// Colador a la jarra → balde de la quebrada a la jarra (sin colador quedan hojas) → alumbre de a una dosis →
// varilla (1.ª vez rápida: coagula; 2.ª lenta: flocula) → sedimentar con el tiempo (1 s = 5 min) → capas al filtro
// de botella en orden (la primera queda abajo: algodón, carbón, arena fina, arena gruesa, grava) → jarra al filtro →
// desinfección del vaso: gotas de cloro (esperar 30 min) o vaso a la ventana (SODIS, 6 h). El kit mide el vaso o la jarra.
// Criterios escolares inspirados en la Resolución 2115 de 2007: turbiedad ≤ 2 NTU, 0 coliformes, cloro 0,3–2 mg/L.

const f = (x: number, d = 0) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })
type Capa = 'algodon' | 'carbon' | 'fina' | 'gruesa' | 'grava'
const CAPA: Record<Capa, { n: string; c: string }> = {
  algodon: { n: 'Algodón', c: '#fbfbfb' },
  carbon: { n: 'Carbón activado', c: '#2b2b2b' },
  fina: { n: 'Arena fina', c: '#e6cf9a' },
  gruesa: { n: 'Arena gruesa', c: '#c9a86a' },
  grava: { n: 'Grava', c: '#8d8478' },
}
const ORDEN: Capa[] = ['algodon', 'carbon', 'fina', 'gruesa', 'grava']
const T0 = 120, M0 = 1000

export default function Potabilizacion({ grado }: { grado: number }) {
  const [colador, setColador] = useState(false)
  const [jarra, setJarra] = useState<{ hojas: boolean; alumbre: number; agit: number; sed: number } | null>(null)
  const [capas, setCapas] = useState<Capa[]>([])
  const [vaso, setVaso] = useState<{ turb: number; mic: number; color: boolean; cloro: number; esperaCl: number; sol: number; alumbre: number } | null>(null)
  const [enSol, setEnSol] = useState(false)
  const [lectura, setLectura] = useState<string | null>(null)
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)

  const q = jarra ? [0, 0.6, 1, 0.9, 0.8, 0.75][Math.min(5, jarra.alumbre)] * (jarra.agit >= 2 ? 1 : jarra.agit === 1 ? 0.5 : 0) : 0
  const avance = jarra ? Math.min(1, jarra.sed / 30) : 0
  const turbJ = jarra ? T0 * (1 - (q > 0 ? q * 0.92 : 0.3) * avance) : 0
  const micJ = jarra ? M0 * (1 - (q > 0 ? 0.7 * q : 0.2) * avance) : 0

  useEffect(() => {
    const corre = (jarra && jarra.sed < 60) || (vaso && ((vaso.cloro > 0 && vaso.esperaCl < 30) || (enSol && vaso.sol < 360)))
    if (!corre) return
    const id = window.setTimeout(() => {
      if (jarra && jarra.sed < 60) setJarra((j) => (j ? { ...j, sed: j.sed + 5 } : j))
      if (vaso) setVaso((v) => {
        if (!v) return v
        let { mic, esperaCl, sol } = v
        if (v.cloro > 0 && esperaCl < 30) { esperaCl += 5; const efecto = v.turb > 5 ? 0.6 : 0.98; if (v.cloro >= 2) mic = mic * (1 - efecto * 0.6) }
        if (enSol && sol < 360) { sol += 30; if (v.turb < 30) mic = mic * 0.6 }
        return { ...v, mic: mic < 0.5 ? 0 : mic, esperaCl, sol }
      })
    }, 1000)
    return () => window.clearTimeout(id)
  })

  const capaOk = capas.length === 5 && capas.every((c, i) => c === ORDEN[i])
  const color = (t: number) => `rgba(${120 + Math.min(1, t / T0) * 40}, ${110 + (1 - Math.min(1, t / T0)) * 90}, ${90 + (1 - Math.min(1, t / T0)) * 150}, ${0.25 + Math.min(1, t / T0) * 0.65})`
  const piezas: Pieza[] = [
    { id: 'balde', nombre: 'Balde con agua de la quebrada (turbia)', x: 70, y: 350, ancho: 90, alto: 90, tomable: !jarra, color: color(T0),
      dibujo: <g opacity={jarra ? 0.3 : 1}><path d="M-36 -30 h72 l-8 66 h-56 z" fill="#5a7d9a" stroke="#2b2b2b" strokeWidth="2" /><rect x="-32" y="-24" width="64" height="12" fill={color(T0)} /><path d="M-36 -30 q36 -30 72 0" fill="none" stroke="#333" strokeWidth="2" /></g> },
    { id: 'colador', nombre: 'Colador (va sobre la jarra)', x: 160, y: 265, ancho: 70, alto: 30, tomable: !colador, dibujo: <g opacity={colador ? 0.3 : 1}><path d="M-26 0 a26 16 0 0 0 52 0 z" fill="#ddd" stroke="#2b2b2b" /><line x1="26" y1="0" x2="44" y2="-6" stroke="#2b2b2b" strokeWidth="3" /></g> },
    { id: 'alumbre', nombre: 'Alumbre (coagulante, de a una dosis)', x: 160, y: 370, ancho: 50, alto: 70, tomable: true, color: '#eef6ff',
      dibujo: <g><rect x="-17" y="-24" width="34" height="48" rx="5" fill="#eef6ff" stroke="#2b2b2b" strokeWidth="2" /><text y="38" textAnchor="middle" fontSize="9" fontWeight="700">Alumbre</text></g> },
    { id: 'varilla', nombre: 'Varilla (1.ª vez: rápido; después: lento)', x: 250, y: 410, ancho: 90, alto: 16, tomable: true, dibujo: <rect x="-42" y="-3" width="84" height="6" rx="3" fill="#dfe9ef" stroke="#2b2b2b" /> },
    { id: 'jarra', nombre: jarra ? `Jarra · ${jarra.hojas ? 'con hojas y palitos · ' : ''}${jarra.alumbre} dosis de alumbre · ${jarra.sed} min reposando` : 'Jarra vacía', x: 370, y: 320, ancho: 90, alto: 120, tomable: !!jarra,
      dibujo: <g>
        <path d="M-34 -50 V44 Q-34 50 -28 50 H28 Q34 50 34 44 V-50" fill="rgba(255,255,255,0.6)" stroke="#2b2b2b" strokeWidth="2" />
        {jarra && <rect x="-32" y="-30" width="64" height="78" fill={color(turbJ)} style={{ transition: 'fill 1s' }} />}
        {jarra && q > 0 && <ellipse cx="0" cy="44" rx={8 + 22 * avance} ry="4" fill="#7a6a4e" opacity="0.9" />}
        {jarra && q > 0 && avance < 0.8 && Array.from({ length: 8 }, (_, k) => <circle key={k} cx={-24 + k * 7} cy={-20 + ((k * 13) % 50) + avance * 40} r={1.5 + q * 2} fill="#8a7a5a" />)}
        {jarra?.hojas && <path d="M-20 -26 q8 -6 14 0 M6 -28 h16" stroke="#3d6b2c" strokeWidth="3" />}
        {colador && <path d="M-30 -56 a30 14 0 0 0 60 0 z" fill="#ddd" stroke="#2b2b2b" />}
      </g> },
    ...(Object.keys(CAPA) as Capa[]).map((c, k) => ({ id: c, nombre: CAPA[c].n, x: 480 + (k % 3) * 55, y: k < 3 ? 255 : 335, ancho: 46, alto: 50, tomable: !capas.includes(c), color: CAPA[c].c,
      dibujo: <g opacity={capas.includes(c) ? 0.25 : 1}><path d="M-18 -16 h36 l-4 32 h-28 z" fill={CAPA[c].c} stroke="#2b2b2b" strokeWidth="1.5" /><text y="30" textAnchor="middle" fontSize="8" fontWeight="700">{CAPA[c].n}</text></g> })),
    { id: 'filtro', nombre: `Filtro de botella (capas de abajo hacia arriba: ${capas.map((c) => CAPA[c].n.toLowerCase()).join(', ') || 'vacío'})`, x: 700, y: 270, ancho: 70, alto: 150,
      dibujo: <g>
        <path d="M-26 -70 V40 L-8 60 H8 L26 40 V-70" fill="rgba(240,248,252,0.6)" stroke="#2b2b2b" strokeWidth="2" />
        {capas.map((c, i) => <rect key={i} x="-24" y={40 - (i + 1) * 18} width="48" height="18" fill={CAPA[c].c} stroke="#999" strokeWidth="0.5" />)}
      </g> },
    { id: 'vaso', nombre: vaso ? `Vaso con agua filtrada${vaso.cloro ? ` · ${vaso.cloro} gotas de cloro, ${vaso.esperaCl} min` : ''}${enSol ? ` · al sol ${f(vaso.sol / 60, 1)} h` : ''}` : 'Vaso limpio (bajo el filtro)', x: enSol ? 880 : 700, y: enSol ? 250 : 395, ancho: 60, alto: 60, tomable: !!vaso && !enSol,
      dibujo: <g><path d="M-22 -26 V22 Q-22 26 -18 26 H18 Q22 26 22 22 V-26" fill="rgba(255,255,255,0.6)" stroke="#2b2b2b" strokeWidth="2" />{vaso && <rect x="-20" y="-10" width="40" height="34" fill={color(vaso.turb)} />}{vaso?.color && <rect x="-20" y="-10" width="40" height="34" fill="#b88a3a" opacity="0.25" />}</g> },
    { id: 'cloro', nombre: 'Gotero con cloro (hipoclorito)', x: 800, y: 370, ancho: 40, alto: 70, tomable: true, color: '#f4fbe9',
      dibujo: <g><rect x="-10" y="-14" width="20" height="40" rx="4" fill="#f4fbe9" stroke="#2b2b2b" strokeWidth="2" /><path d="M-6 -14 v-14 h12 v14" fill="#333" /><text y="40" textAnchor="middle" fontSize="9" fontWeight="700">Cloro</text></g> },
    { id: 'ventana', nombre: 'Ventana al sol (desinfección solar, 6 h)', x: 880, y: 250, ancho: 110, alto: 100, dibujo: <g><rect x="-50" y="-46" width="100" height="92" fill="#dff1fb" stroke="#7a5a3a" strokeWidth="5" /><circle cx="26" cy="-24" r="12" fill="#f7c948" /><line x1="0" y1="-46" x2="0" y2="46" stroke="#7a5a3a" strokeWidth="3" /></g> },
    { id: 'kit', nombre: lectura ? `Kit: ${lectura}` : 'Kit de análisis (suéltalo en la jarra o el vaso)', x: 260, y: 270, ancho: 60, alto: 50, tomable: true,
      dibujo: <g><rect x="-24" y="-16" width="48" height="32" rx="4" fill="#3f6fb8" stroke="#2b2b2b" strokeWidth="2" /><text y="5" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700">KIT</text></g> },
    { id: 'caneca', nombre: 'Empezar de nuevo (toca)', x: 960, y: 380, ancho: 40, alto: 60, alTocar: () => { setColador(false); setJarra(null); setCapas([]); setVaso(null); setEnSol(false); setLectura(null); setMsg({ t: 'Todo limpio. El lodo del fondo va a la tierra del jardín.' }) }, dibujo: <g transform="scale(0.7)"><Caneca /></g> },
  ]

  const analizar = (turb: number, mic: number, cloro?: number) => {
    const partes = [`turbiedad ${f(turb, turb < 10 ? 1 : 0)} NTU`, `coliformes ${f(mic)} por 100 mL`]
    if (cloro !== undefined) partes.push(`cloro libre ${f(cloro, 1)} mg/L`)
    if (grado < 9) return `${turb <= 2 ? 'agua clara' : turb < 20 ? 'algo turbia' : 'muy turbia'} · ${mic === 0 ? 'sin microbios' : 'con microbios'} (${partes.join(', ')})`
    return partes.join(' · ')
  }
  const cloroLibre = vaso ? Math.max(0, vaso.cloro * 0.5 - (vaso.turb > 5 ? 0.8 : 0.3)) : 0
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'colador') return en === 'jarra' ? (jarra ? 'Ya echaste el agua.' : { anim: 'poner', hecho: () => setColador(true) }) : 'El colador va sobre la jarra.'
    if (de === 'balde') return en === 'jarra' ? { anim: 'verter', hecho: () => { setJarra({ hojas: !colador, alumbre: 0, agit: 0, sed: 0 }); setMsg(colador ? { t: 'El colador atrapó hojas y palitos: es el cribado.' } : { t: 'Sin colador entraron hojas y palitos.', aviso: true }) } } : 'Al balde se le saca agua hacia la jarra.'
    if (de === 'alumbre') return !jarra ? 'Primero el agua en la jarra.' : en !== 'jarra' ? 'El alumbre va a la jarra.' : { anim: 'polvo', hecho: () => { setJarra({ ...jarra, alumbre: jarra.alumbre + 1, sed: 0 }); setMsg(jarra.alumbre + 1 > 3 ? { t: 'Demasiado alumbre: el agua queda ácida y con sabor.', aviso: true } : { t: `${jarra.alumbre + 1} dosis de alumbre. Revuelve.` }) } }
    if (de === 'varilla') return !jarra ? 'La jarra está vacía.' : { anim: 'frotar', hecho: () => {
      const a = jarra.agit + 1
      setJarra({ ...jarra, agit: a, sed: 0 })
      setMsg(!jarra.alumbre ? { t: 'Revolviste sin coagulante: el barro fino sigue suspendido.', aviso: true } : a === 1 ? { t: 'Agitación rápida: el alumbre se reparte y las partículas pierden su carga (coagulación). Ahora revuelve otra vez, despacio.' } : { t: 'Agitación lenta: se forman grumos (flóculos). Deja reposar.' })
    } }
    if (de === 'kit') {
      if (en === 'jarra' && jarra) return { anim: 'poner', hecho: () => setLectura(`jarra: ${analizar(turbJ, micJ)}`) }
      if (en === 'vaso' && vaso) return { anim: 'poner', hecho: () => setLectura(`vaso: ${analizar(vaso.turb, Math.round(vaso.mic), vaso.cloro ? cloroLibre : undefined)}`) }
      return 'No hay agua ahí.'
    }
    if (ORDEN.includes(de as Capa)) return en !== 'filtro' ? 'Las capas van en la botella.' : vaso ? 'El filtro ya se usó.' : { anim: 'verter', hecho: () => setCapas((c) => [...c, de as Capa]) }
    if (de === 'jarra') {
      if (en !== 'filtro') return 'Vierte la jarra en el filtro.'
      if (capas.length < 5) return 'Arma primero el filtro con sus cinco capas.'
      if (vaso) return 'Ya filtraste.'
      return { anim: 'verter', hecho: () => {
        const tapa = turbJ > 30
        const fuga = capas[0] !== 'algodon'
        const ef = capaOk ? (tapa ? 0.6 : 0.97) : fuga ? 0.3 : 0.7
        const turb = Math.max(0.4, turbJ * (1 - ef) + (fuga ? 8 : 0))
        setVaso({ turb, mic: micJ * (1 - ef * 0.9), color: !capas.slice(0, 3).includes('carbon'), cloro: 0, esperaCl: 0, sol: 0, alumbre: jarra!.alumbre })
        setMsg(fuga ? { t: 'Sin algodón abajo, la arena se salió con el agua.', aviso: true } : !capaOk ? { t: 'Las capas quedaron en desorden: el filtro trabaja mal. Lo fino va abajo y lo grueso arriba.', aviso: true } : tapa ? { t: 'El agua llegó muy turbia y el filtro se tapó rápido: faltó coagular y sedimentar.', aviso: true } : { t: 'El agua sale clara por abajo. Pero clara no es lo mismo que sin microbios.' })
        setJarra(null)
      } }
    }
    if (de === 'cloro') return en !== 'vaso' || !vaso ? 'El cloro va al agua ya filtrada.' : { anim: 'gotas', gotas: 1, hecho: () => { setVaso({ ...vaso, cloro: vaso.cloro + 1, esperaCl: 0 }); setMsg({ t: `${vaso.cloro + 1} gota${vaso.cloro ? 's' : ''} de cloro. Hay que esperar 30 min para que actúe.` }) } }
    if (de === 'vaso') return en === 'ventana' ? { anim: 'poner', hecho: () => { setEnSol(true); setMsg({ t: 'Al sol: la luz ultravioleta y el calor matan los microbios en unas 6 horas (1 s = 30 min).' }) } } : 'El vaso puede ir a la ventana.'
    return 'No se puede.'
  }
  const destinos = (de: string) => ({ colador: ['jarra'], balde: ['jarra'], alumbre: ['jarra'], varilla: ['jarra'], kit: ['jarra', 'vaso'], jarra: ['filtro'], cloro: ['vaso'], vaso: ['ventana'] } as Record<string, string[]>)[de] ?? (ORDEN.includes(de as Capa) ? ['filtro'] : [])

  const listo = vaso && ((vaso.cloro > 0 && vaso.esperaCl >= 30) || vaso.sol >= 360)
  const fallas = listo ? [
    vaso.turb > 2 && 'quedó turbia (más de 2 NTU)',
    vaso.mic >= 1 && 'todavía tiene coliformes',
    vaso.cloro > 0 && cloroLibre < 0.3 && 'le falta cloro libre',
    vaso.cloro > 0 && cloroLibre > 2 && 'tiene demasiado cloro (sabor y olor fuertes)',
    vaso.alumbre > 3 && 'se usó demasiado alumbre',
    vaso.color && 'conserva color y olor (el carbón no hizo su trabajo)',
  ].filter(Boolean) as string[] : []
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4 text-sm"><b>Del agua de la quebrada al agua para tomar.</b> Cuela el agua, agrega alumbre y revuelve (rápido y luego lento), deja reposar, arma el filtro de botella con sus capas (la primera que pongas queda abajo) y filtra. Al final, desinfecta con cloro o al sol. Usa el kit para medir en cada etapa.</p>
      <MesaViva desde={180} piezas={piezas} destinos={destinos} soltar={soltar} />
      {msg && <p className={`-mt-2 text-sm ${msg.aviso ? 'font-semibold text-[#b5462c]' : ''}`}>{msg.aviso ? '⚠ ' : '› '}{msg.t}</p>}
      {lectura && <p className="-mt-2 text-sm">🧪 {lectura}</p>}
      <p className="-mt-2 text-xs text-[var(--suave)]">Tiempo acelerado: reposo y cloro 1 s = 5 min; sol 1 s = 30 min.</p>
      {listo && (
        <p className={`rounded-lg p-2 text-sm ${fallas.length ? 'bg-[#fbeee9]' : 'bg-[#eaf5ee]'}`}><b>Resultado:</b> {fallas.length ? `Todavía no es potable: ${fallas.join('; ')}.` : '¡Agua potable! Clara, sin microbios y con la cantidad justa de cloro.'}</p>
      )}
      {listo && (
        <p className="rounded-lg bg-[var(--tarjeta)] p-2 text-sm"><b>¿Qué hace cada paso?</b> El colador quita lo grande. El alumbre hace que el barro fino se junte en grumos (coagulación y floculación) que caen al fondo (sedimentación). El filtro atrapa lo que queda: la grava y la arena las partículas, el carbón el color y el olor. La desinfección mata los microbios que no se ven: por eso el agua clara no siempre es potable.{grado >= 9 ? ' Así trabaja una planta de tratamiento; en Colombia la Resolución 2115 de 2007 fija, entre otros, turbiedad ≤ 2 NTU, cero coliformes y cloro residual entre 0,3 y 2 mg/L.' : ''}{grado >= 11 ? ' El alumbre, Al₂(SO₄)₃, forma Al(OH)₃ gelatinoso que atrapa las partículas coloidales al neutralizar sus cargas; el cloro forma ácido hipocloroso (HClO), que oxida las membranas de los microbios y actúa peor si el agua está turbia.' : ''}</p>
      )}
    </div>
  )
}
