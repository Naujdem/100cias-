import { useEffect, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Caneca, Gotero, Reloj } from '../dibujos.tsx'

// Laboratorio de Biología (PLAN-LABORATORIOS.md): extracción de ADN de fresa, en mesa viva.
// Fresas a la bolsa, machacar, agua, jabón y sal, mezclar con cuchara (o batidora: error), filtrar la bolsa
// al vaso, alcohol frío por la pared (o de golpe en el centro: error), esperar 5 min (acelerado: 1 s = 10 s)
// y enrollar con el palillo. El rendimiento depende de lo que se hizo.

interface E {
  fresas: boolean
  machacado: boolean
  agua: boolean
  jabon: boolean
  sal: boolean
  jabonTarde: boolean // jabón o sal después de filtrar
  mezcla: null | 'suave' | 'fuerte'
  filtrado: boolean
  alcohol: null | { frio: boolean; suave: boolean }
  t: number // segundos desde el alcohol
  enrollado: boolean
}
const INICIO: E = { fresas: false, machacado: false, agua: false, jabon: false, sal: false, jabonTarde: false, mezcla: null, filtrado: false, alcohol: null, t: 0, enrollado: false }

const POR: Record<string, string> = {
  machacar: 'Romper el tejido deja expuestas muchas más células.',
  jabon: 'Las membranas son de lípidos: el jabón las disuelve, como a la grasa de los platos, y el ADN sale.',
  sal: 'La sal neutraliza las cargas del ADN y ayuda a que sus hebras se junten.',
  cuchara: 'Despacio, para no partir las hebras largas de ADN.',
  filtrar: 'Quita la pulpa y las semillas; pasa el líquido con el ADN.',
  pared: 'El ADN no se disuelve en alcohol: aparece donde se juntan las dos capas. El frío ayuda.',
  palillo: 'Las hebras se pegan al palillo como una mota blanca y babosa.',
}

function resultado(e: E) {
  let q = 1
  const l: string[] = []
  if (!e.fresas) return { q: 0, corto: false, sucio: false, lineas: ['No pusiste fresas en la bolsa: no hay de dónde sacar ADN.'] }
  if (!e.machacado) { q *= 0.35; l.push('No machacaste las fresas: pocas células se rompieron.') }
  if (!e.jabon) { q *= 0.1; l.push('Sin jabón, las membranas no se rompen y el ADN se queda dentro de las células.') }
  else if (e.jabonTarde) { q *= 0.6; l.push('Pusiste el jabón o la sal después de filtrar: actuaron sobre menos células.') }
  if (!e.sal) { q *= 0.6; l.push('Sin sal, el ADN se junta menos y se ve menos.') }
  if (!e.mezcla) { q *= 0.7; l.push('No mezclaste: el jabón no llegó a todas las células.') }
  if (!e.filtrado) l.push('No filtraste: la pulpa queda en la mezcla y ensucia el ADN.')
  if (e.alcohol && !e.alcohol.frio) { q *= 0.55; l.push('El alcohol tibio precipita menos ADN: debe estar de la nevera o el congelador.') }
  if (e.alcohol && !e.alcohol.suave) { q *= 0.3; l.push('Al echar el alcohol de golpe se mezclaron las capas: el ADN casi no se separa.') }
  if (e.t < 300) { q *= Math.max(0.15, e.t / 300); l.push(`Enrollaste a los ${Math.floor(e.t / 60)} min: el ADN no alcanzó a subir y juntarse (se esperan 5 min sin mover el vaso).`) }
  const corto = e.mezcla === 'fuerte'
  if (corto) l.push('Usaste la batidora: el ADN se partió en pedacitos y no forma hebras largas. Se mezcla suave, con cuchara.')
  if (!l.length) l.push('¡Extracción perfecta! Una mota blanca de hebras largas de ADN en la capa de alcohol.')
  return { q, corto, sucio: !e.filtrado, lineas: l }
}

function DibBolsa({ e }: { e: E }) {
  return (
    <g>
      <path d="M-50 -60 H50 L56 60 Q0 74 -56 60 Z" fill="rgba(255,255,255,0.5)" stroke="#999" strokeWidth="2" />
      <rect x="-50" y="-66" width="100" height="6" fill="#4a90d9" />
      {e.agua && <path d="M-53 10 H53 L56 60 Q0 74 -56 60 Z" fill={e.jabon ? 'rgba(230,90,120,0.55)' : 'rgba(230,90,120,0.4)'} />}
      {e.fresas && Array.from({ length: e.machacado ? 22 : 4 }, (_, k) =>
        e.machacado
          ? <circle key={k} cx={-42 + ((k * 37) % 84)} cy={24 + ((k * 23) % 34)} r={3 + (k % 3)} fill="#c8253f" />
          : <path key={k} d={`M${-36 + k * 20} 40 q10 -18 20 0 q-10 24 -20 0`} fill="#d62a46" stroke="#7a1022" />,
      )}
      {e.mezcla === 'fuerte' && Array.from({ length: 8 }, (_, k) => <circle key={k} cx={-42 + k * 12} cy="8" r="5" fill="#fff" opacity="0.85" />)}
      <text y="88" textAnchor="middle" fontSize="11" fontWeight="700" fill="#3a2f22">Bolsa</text>
    </g>
  )
}

function DibVaso({ e, r }: { e: E; r: ReturnType<typeof resultado> }) {
  const mezclado = e.alcohol && !e.alcohol.suave
  const ver = e.alcohol ? Math.round(r.q * 14) : 0
  return (
    <g>
      <path d="M-50 -70 V70 H50 V-70" fill="none" stroke="#2b2b2b" strokeWidth="2.5" />
      {e.filtrado && <rect x="-48" y="10" width="96" height="58" fill={r.sucio ? 'rgba(200,60,90,0.75)' : 'rgba(230,90,120,0.6)'} />}
      {e.alcohol && <rect x="-48" y="-36" width="96" height="46" fill={mezclado ? 'rgba(230,140,160,0.45)' : 'rgba(225,240,250,0.7)'} />}
      {Array.from({ length: e.enrollado ? 0 : ver }, (_, k) => {
        const x = -38 + ((k * 23) % 76)
        const largo = r.corto ? 6 : 16 + (k % 4) * 6
        return <path key={k} d={`M${x} 8 q${k % 2 ? 5 : -5} ${-largo / 2} 0 ${-largo}`} stroke="#fdfdfd" strokeWidth={r.corto ? 3 : 2.2} fill="none" strokeLinecap="round" />
      })}
      {e.enrollado && ver > 0 && <g><line x1="0" y1="-110" x2="0" y2="-20" stroke="#c8a06a" strokeWidth="4" /><ellipse cx="0" cy="-22" rx={3 + ver * 0.8} ry={3 + ver * 0.6} fill="#f6f6f2" stroke="#ddd" /></g>}
      <text y="88" textAnchor="middle" fontSize="11" fontWeight="700" fill="#3a2f22">Vaso{e.alcohol ? ` · ${Math.floor(e.t / 60)} min` : ''}</text>
    </g>
  )
}

const Frasco = ({ c, t }: { c: string; t: string }) => (
  <g><rect x="-20" y="-28" width="40" height="56" rx="6" fill={c} stroke="#2b2b2b" strokeWidth="2" /><rect x="-12" y="-38" width="24" height="10" fill="#555" /><text y="4" textAnchor="middle" fontSize="8" fontWeight="800">{t}</text></g>
)

export default function ADN({ grado }: { grado: number }) {
  const [e, setE] = useState<E>(INICIO)
  const [por, setPor] = useState('')
  const [cuenta, setCuenta] = useState(0)
  const [alarma, setAlarma] = useState(false)
  const corre = !!e.alcohol && !e.enrollado
  useEffect(() => {
    const id = window.setInterval(() => {
      if (corre) setE((x) => ({ ...x, t: x.t + 10 }))
      setCuenta((c) => { if (c > 0 && c <= 10) setAlarma(true); return Math.max(0, c - 10) })
    }, 1000)
    return () => window.clearInterval(id)
  }, [corre])
  const r = resultado(e)
  const hacer = (p: Partial<E>, motivo?: string): Uso => ({ anim: 'poner', hecho: () => { setE((x) => ({ ...x, ...p })); setPor(motivo ? POR[motivo] : '') } })
  const piezas: Pieza[] = [
    { id: 'fresas', nombre: 'Fresas', x: 55, y: 345, ancho: 60, alto: 40, tomable: true, dibujo: <g>{[-16, 0, 16].map((x) => <path key={x} d={`M${x - 8} -4 q8 -16 16 0 q-8 22 -16 0`} fill="#d62a46" stroke="#7a1022" />)}</g> },
    { id: 'mano', nombre: 'Machacar (con la mano)', x: 120, y: 345, ancho: 50, alto: 50, tomable: true, dibujo: <g><rect x="-16" y="-14" width="32" height="28" rx="12" fill="#e8b48a" stroke="#2b2b2b" strokeWidth="2" /><path d="M-10 -14 V-22 M-3 -14 V-24 M4 -14 V-23 M11 -14 V-20" stroke="#2b2b2b" strokeWidth="2" /></g> },
    { id: 'agua', nombre: 'Agua', x: 185, y: 312, ancho: 50, alto: 96, tomable: true, color: '#a9d3f5', dibujo: <Gotero color="#a9d3f5" etiqueta="AGUA" /> },
    { id: 'jabon', nombre: 'Jabón lavaplatos', x: 245, y: 340, ancho: 50, alto: 70, tomable: true, color: '#7cc36e', dibujo: <Frasco c="#9be58f" t="JABÓN" /> },
    { id: 'sal', nombre: 'Sal (una pizca)', x: 305, y: 340, ancho: 50, alto: 70, tomable: true, color: '#ffffff', dibujo: <Frasco c="#fff" t="SAL" /> },
    { id: 'cuchara', nombre: 'Cuchara (mezclar suave)', x: 360, y: 345, ancho: 40, alto: 70, tomable: true, dibujo: <g transform="rotate(25)"><ellipse cy="-24" rx="8" ry="11" fill="#bbb" stroke="#2b2b2b" strokeWidth="1.5" /><rect x="-2" y="-14" width="4" height="44" fill="#bbb" stroke="#2b2b2b" strokeWidth="1" /></g> },
    { id: 'batidora', nombre: 'Batidora', x: 415, y: 345, ancho: 44, alto: 76, tomable: true, dibujo: <g><rect x="-12" y="-36" width="24" height="34" rx="6" fill="#e74c3c" stroke="#2b2b2b" strokeWidth="2" /><path d="M-5 -2 V26 M5 -2 V26" stroke="#888" strokeWidth="3" /></g> },
    { id: 'bolsa', nombre: 'Bolsa con cierre', x: 510, y: 320, ancho: 120, alto: 140, tomable: e.agua && !e.filtrado, dibujo: <DibBolsa e={e} /> },
    { id: 'colador', nombre: 'Colador sobre el vaso', x: 680, y: 228, ancho: 90, alto: 30, dibujo: <g><path d="M-40 -6 Q0 30 40 -6 Z" fill="#ddd" stroke="#2b2b2b" strokeWidth="2" /><path d="M40 -6 H60" stroke="#2b2b2b" strokeWidth="4" /></g> },
    { id: 'vaso', nombre: 'Vaso (echar de golpe)', x: 680, y: 330, ancho: 104, alto: 150, dibujo: <DibVaso e={e} r={r} /> },
    { id: 'pared', nombre: 'Pared del vaso (echar despacio)', x: 742, y: 290, ancho: 18, alto: 80, dibujo: <rect x="-5" y="-38" width="10" height="76" rx="4" fill="rgba(46,134,193,0.15)" stroke="#2e86c1" strokeDasharray="3 3" /> },
    { id: 'frio', nombre: 'Alcohol del congelador', x: 815, y: 340, ancho: 50, alto: 70, tomable: true, color: '#e1f0fa', dibujo: <Frasco c="#cfe8f8" t="ALC. ❄" /> },
    { id: 'tibio', nombre: 'Alcohol a temperatura ambiente', x: 870, y: 340, ancho: 50, alto: 70, tomable: true, color: '#e1f0fa', dibujo: <Frasco c="#f2efe2" t="ALCOHOL" /> },
    { id: 'palillo', nombre: 'Palillo', x: 930, y: 345, ancho: 30, alto: 80, tomable: true, dibujo: <rect x="-3" y="-36" width="6" height="72" rx="3" fill="#e2c28f" stroke="#2b2b2b" strokeWidth="1.5" transform="rotate(20)" /> },
    { id: 'reloj', nombre: 'Temporizador (toca: +1 min)', x: 870, y: 240, ancho: 72, alto: 72, alTocar: () => { setAlarma(false); setCuenta((c) => c + 60) }, dibujo: <Reloj s={cuenta} alarma={alarma} aviso="¡Enrolla!" /> },
    { id: 'caneca', nombre: 'Residuos (toca: empezar de nuevo)', x: 960, y: 240, ancho: 54, alto: 76, alTocar: () => { setE(INICIO); setPor(''); setCuenta(0); setAlarma(false) }, dibujo: <Caneca /> },
  ]
  const destinos = (de: string) => {
    if (de === 'bolsa') return ['colador']
    if (de === 'frio' || de === 'tibio') return ['pared', 'vaso']
    if (de === 'palillo') return ['vaso']
    if (de === 'jabon' || de === 'sal') return e.filtrado ? ['vaso'] : ['bolsa']
    return ['bolsa']
  }
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'bolsa') return en === 'colador' ? hacer({ filtrado: true }, 'filtrar') : 'La bolsa se vacía en el colador, sobre el vaso.'
    if (de === 'frio' || de === 'tibio') {
      if (!e.filtrado) return 'Primero filtra el extracto al vaso.'
      if (e.alcohol) return 'Ya tiene alcohol.'
      if (en !== 'pared' && en !== 'vaso') return 'El alcohol va en el vaso.'
      return { anim: 'verter', hecho: () => { setE((x) => ({ ...x, alcohol: { frio: de === 'frio', suave: en === 'pared' }, t: 0 })); setPor(en === 'pared' ? POR.pared : '') } }
    }
    if (de === 'palillo') {
      if (en !== 'vaso') return 'El palillo va en el vaso.'
      if (!e.alcohol) return 'Todavía no hay ADN que enrollar: falta el alcohol.'
      if (e.enrollado) return 'Ya lo enrollaste.'
      return { anim: 'frotar', hecho: () => { setE((x) => ({ ...x, enrollado: true })); setPor(POR.palillo) } }
    }
    if ((de === 'jabon' || de === 'sal') && en === 'vaso') {
      if (e.alcohol) return 'Ya tiene alcohol: es tarde para eso.'
      return { anim: 'gotas', gotas: 2, hecho: () => setE((x) => ({ ...x, [de]: true, jabonTarde: true })) }
    }
    if (en !== 'bolsa') return 'Eso va en la bolsa.'
    if (e.filtrado) return 'La bolsa ya se filtró.'
    if (de === 'fresas') return e.fresas ? 'Ya tiene fresas.' : hacer({ fresas: true })
    if (de === 'mano') return !e.fresas ? 'La bolsa está vacía.' : e.machacado ? 'Ya están machacadas.' : { anim: 'frotar', hecho: () => { setE((x) => ({ ...x, machacado: true })); setPor(POR.machacar) } }
    if (de === 'agua') return e.agua ? 'Ya tiene agua.' : { anim: 'verter', hecho: () => setE((x) => ({ ...x, agua: true })) }
    if (de === 'jabon' || de === 'sal') return e[de] ? 'Ya tiene.' : { anim: 'gotas', gotas: 2, hecho: () => { setE((x) => ({ ...x, [de]: true })); setPor(POR[de]) } }
    if (de === 'cuchara' || de === 'batidora') {
      if (!e.agua) return 'Primero el agua.'
      if (e.mezcla) return 'Ya está mezclado.'
      return { anim: 'frotar', hecho: () => { setE((x) => ({ ...x, mezcla: de === 'cuchara' ? 'suave' : 'fuerte' })); setPor(de === 'cuchara' ? POR.cuchara : '') } }
    }
    return 'No se puede.'
  }
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        <b>Objetivo:</b> sacar ADN de fresas con cosas de la cocina y verlo a simple vista. Las fresas son ideales: cada célula tiene 8 copias de sus cromosomas. Prepara la bolsa, fíltrala al vaso, echa el alcohol y espera <b>5 minutos sin mover el vaso</b> (acelerado: 1 s = 10 s) antes de enrollar con el palillo.
      </p>
      <MesaViva desde={190} piezas={piezas} destinos={destinos} soltar={soltar} />
      {por && grado < 11 && <p className="text-sm"><b>¿Por qué?</b> {por}</p>}
      {e.enrollado && (
        <div className={`rounded-xl border-2 p-3 text-sm ${r.lineas[0].startsWith('¡') ? 'border-[#2e7d5a] bg-[#eaf5ee]' : 'border-[#b5462c] bg-[#fbeee9]'}`}>
          <p className="font-bold">Rendimiento: {r.q > 0.8 ? 'mucho ADN' : r.q > 0.4 ? 'algo de ADN' : r.q > 0.1 ? 'muy poco ADN' : 'casi nada'}</p>
          <ul className="mt-1 list-disc pl-5">{r.lineas.map((x) => <li key={x}>{x}</li>)}</ul>
          <p className="mt-2">Eso blanco no es una sola molécula: son miles de hebras de ADN enredadas. Para ver la doble hélice se necesitarían técnicas como la difracción de rayos X.{grado >= 9 ? ' Lo que sale también lleva algo de ARN y proteínas: en un laboratorio se purifica con enzimas.' : ''}</p>
        </div>
      )}
      <p className="text-xs text-[var(--suave)]">Versión casera: fresas, bolsa con cierre, jabón lavaplatos, sal, colador o filtro de café, vaso y alcohol antiséptico guardado en el congelador. ⚠ El alcohol es inflamable y no se bebe.</p>
    </div>
  )
}
