import { useEffect, useMemo, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Caneca, Gotero, Piseta } from '../dibujos.tsx'

// Laboratorio de Química 12 (PLAN-LABORATORIOS.md): titulación ácido-base en mesa viva.
// Embudo a la bureta, NaOH 0,1 M al embudo (queda en una lectura inicial que hay que leer), quitar el embudo;
// pipeta de 10 mL a la muestra (HCl desconocido o vinagre diluido 1:10) y al erlenmeyer; fenolftaleína con gotero;
// erlenmeyer bajo la bureta; la llave se toca (chorro en tiempo real, 0,5 mL/s) o se da gota a gota (0,05 mL);
// el erlenmeyer se toca para agitar. Se toca la bureta para anotar la lectura inicial y la final.
// 11°: pH-metro dentro del erlenmeyer y curva de titulación; la concentración la calcula el estudiante.

const f = (x: number, d = 2) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })
const CB = 0.1 // NaOH mol/L
const KA = 1.8e-5 // ácido acético
type Tipo = 'hcl' | 'vin'
const NOMBRE: Record<Tipo, string> = { hcl: 'HCl desconocido', vin: 'Vinagre diluido 1:10' }

interface Erl { muestra: Tipo | null; vm: number; agua: number; fenol: number; vb: number; visto: number; base: boolean; metro: boolean; curva: [number, number][] }
interface Ensayo { tipo: Tipo; v: number; real: number; final: string; errores: string[] }
const ERL0: Erl = { muestra: null, vm: 0, agua: 0, fenol: 0, vb: 0, visto: 0, base: false, metro: false, curva: [] }

function pH(e: Erl, cA: number, v: number) {
  if (!e.muestra) return 7
  const vt = (e.vm + e.agua + v) / 1000
  const nA = (cA * e.vm) / 1000
  const nB = (CB * v) / 1000
  if (nB > nA + 1e-9) return 14 + Math.log10((nB - nA) / vt)
  if (e.muestra === 'hcl') return Math.abs(nA - nB) < 1e-9 ? 7 : -Math.log10((nA - nB) / vt)
  if (nB < 1e-9) return -Math.log10(Math.sqrt((KA * nA) / vt))
  if (Math.abs(nA - nB) < 1e-9) return 14 + Math.log10(Math.sqrt((1e-14 / KA) * (nA / vt)))
  return -Math.log10(KA) + Math.log10(nB / (nA - nB))
}

export default function Titulacion({ grado }: { grado: number }) {
  const cHCl = useMemo(() => [0.08, 0.12, 0.15][Math.floor(Math.random() * 3)], [])
  const conc = (t: Tipo) => (t === 'hcl' ? cHCl : 0.083)
  const [embudo, setEmbudo] = useState(false)
  const [lleno, setLleno] = useState(false)
  const [nivel, setNivel] = useState(0) // lectura de la bureta (mL desde el 0 de arriba)
  const [derrameNaOH, setDerrameNaOH] = useState(false)
  const [llave, setLlave] = useState(false)
  const [pipeta, setPipeta] = useState<Tipo | null>(null)
  const [erl, setErl] = useState<Erl>(ERL0)
  const [lecIni, setLecIni] = useState<number | null>(null)
  const [conEmbudo, setConEmbudo] = useState(false) // se tituló con el embudo puesto
  const [ensayos, setEnsayos] = useState<Ensayo[]>([])
  const [resp, setResp] = useState<Record<number, string>>({})
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)

  const echar = (mL: number) => {
    if (!erl.base) { setLlave(false); setMsg({ t: 'No hay erlenmeyer bajo la bureta: el NaOH cayó a la mesa. Ponlo debajo antes de abrir la llave.', aviso: true }); setNivel((n) => n + mL); return }
    if (embudo) setConEmbudo(true)
    setNivel((n) => n + mL)
    setErl((e) => ({ ...e, vb: e.vb + mL }))
  }
  useEffect(() => {
    if (!llave) return
    if (nivel >= 50) { setLlave(false); setMsg({ t: 'La bureta se vació: llénala otra vez.', aviso: true }); return }
    const id = window.setTimeout(() => echar(0.1), 200)
    return () => window.clearTimeout(id)
  })

  const veq = erl.muestra ? (conc(erl.muestra) * erl.vm) / CB : Infinity
  const exceso = erl.visto - veq
  const rosa = erl.fenol > 0 && exceso >= -0.02 ? Math.min(1, 0.18 + exceso * 1.4) : 0
  const nube = erl.fenol > 0 && erl.vb > erl.visto + 0.01 && erl.vb > veq * 0.85
  const lectura = Math.round(nivel * 20) / 20

  const agitar = () => {
    if (!erl.muestra) return setMsg({ t: 'El erlenmeyer está vacío.' })
    setErl((e) => {
      const curva = e.metro ? [...e.curva, [e.vb, pH(e, conc(e.muestra!), e.vb)] as [number, number]] : e.curva
      return { ...e, visto: e.vb, curva }
    })
    const ex = erl.vb - veq
    setMsg(erl.fenol === 0 ? { t: 'Agitas. Sin indicador no vas a ver cuándo termina la reacción.', aviso: true } : ex < -0.02 ? { t: 'Agitas: el rosado desaparece. Todavía queda ácido.' } : ex <= 0.15 ? { t: '¡Rosado pálido que no se va al agitar: punto final! Cierra y anota la lectura final.' } : { t: 'Rosado fuerte: te pasaste del punto final.', aviso: true })
  }

  const anotar = () => {
    if (!lleno) return setMsg({ t: 'Primero llena la bureta.' })
    if (llave) return setMsg({ t: 'Cierra la llave antes de leer.', aviso: true })
    if (lecIni === null) { setLecIni(lectura); setMsg({ t: `Lectura inicial: ${f(lectura)} mL (se lee la parte de abajo del menisco).` }); return }
    if (!erl.muestra) return setMsg({ t: 'Pon la muestra en el erlenmeyer y titúlala antes de la lectura final.' })
    const v = lectura - lecIni
    const ex = erl.vb - veq
    const errores = [
      erl.fenol === 0 && 'sin fenolftaleína',
      conEmbudo && 'el embudo quedó puesto (gotas extra)',
      derrameNaOH && 'se derramó NaOH al llenar sin embudo',
      erl.vb > erl.visto + 0.01 && 'no agitaste al final',
    ].filter(Boolean) as string[]
    const final = erl.fenol === 0 ? 'incoloro' : ex < -0.02 ? 'incoloro: no llegaste' : ex <= 0.15 ? 'rosado pálido' : ex <= 0.5 ? 'rosado: un poco pasado' : 'fucsia: muy pasado'
    setEnsayos((es) => [...es, { tipo: erl.muestra!, v, real: veq, final, errores }])
    setLecIni(lectura)
    setMsg({ t: `Lectura final: ${f(lectura)} mL → gastaste ${f(v)} mL de NaOH. Bota el contenido del erlenmeyer y repite para comparar.` })
  }

  const SOP_X = 500
  const altoNaOH = lleno ? Math.max(0, 1 - nivel / 52) : 0
  const colorErl = rosa > 0 ? `rgba(230,60,150,${0.15 + 0.75 * rosa})` : erl.muestra ? '#eef6fb' : 'transparent'
  const piezas: Pieza[] = [
    {
      id: 'soporte', nombre: 'Soporte universal', x: SOP_X - 60, y: 250, ancho: 0, alto: 0,
      dibujo: <g><rect x="-40" y="140" width="140" height="10" rx="3" fill="#555" /><rect x="-4" y="-150" width="8" height="292" fill="#777" /><rect x="0" y="-80" width="64" height="8" fill="#777" /></g>,
    },
    {
      id: 'bureta', nombre: lleno ? `Bureta con NaOH 0,1 M (toca: anotar lectura${lecIni === null ? ' inicial' : ' final'})` : 'Bureta de 50 mL (vacía)', x: SOP_X, y: 210, ancho: 40, alto: 200, alTocar: anotar,
      dibujo: <g><rect x="-7" y="-95" width="14" height="190" fill="rgba(255,255,255,0.7)" stroke="#2b2b2b" strokeWidth="1.5" />{lleno && <rect x="-6" y={95 - 188 * altoNaOH} width="12" height={188 * altoNaOH} fill="#dbe9f6" />}{[0, 10, 20, 30, 40, 50].map((m) => <g key={m}><path d={`M-7 ${-92 + m * 3.6} h6`} stroke="#2b2b2b" /><text x="-10" y={-89 + m * 3.6} fontSize="8" textAnchor="end">{m}</text></g>)}{embudo && <path d="M-22 -118 H22 L4 -96 H-4 Z" fill="rgba(255,255,255,0.8)" stroke="#2b2b2b" strokeWidth="1.5" />}<path d="M-3 95 V112 L0 120 L3 112 V95" fill="#dbe9f6" stroke="#2b2b2b" />{llave && erl.base && <path d="M0 120 V160" stroke="#cfe3f5" strokeWidth="2" strokeDasharray="4 3"><animate attributeName="stroke-dashoffset" from="0" to="-14" dur="0.3s" repeatCount="indefinite" /></path>}</g>,
    },
    { id: 'llave', nombre: llave ? 'Llave abierta: chorro (toca: cerrar)' : 'Llave de la bureta (toca: abrir chorro)', x: SOP_X + 40, y: 312, ancho: 48, alto: 26, alTocar: () => { if (!lleno) return setMsg({ t: 'La bureta está vacía.' }); setLlave((v) => !v) }, dibujo: <g><rect x="-50" y="-4" width="34" height="8" rx="3" fill={llave ? '#2e86c1' : '#34495e'} transform={llave ? 'rotate(90 -33 0)' : undefined} /><text x="-6" y="4" fontSize="10">{llave ? 'abierta' : 'cerrada'}</text></g> },
    { id: 'gota', nombre: 'Una gota (≈ 0,05 mL)', x: SOP_X + 95, y: 312, ancho: 50, alto: 26, alTocar: () => { if (!lleno) return setMsg({ t: 'La bureta está vacía.' }); if (llave) return setMsg({ t: 'Cierra el chorro para ir gota a gota.' }); echar(0.05) }, dibujo: <g><rect x="-24" y="-12" width="48" height="24" rx="12" fill="#fff" stroke="#2b2b2b" /><path d="M-10 -5 q4 6 0 10 q-4 -4 0 -10" fill="#9cc7ea" /><text x="-2" y="4" fontSize="9">gota</text></g> },
    {
      id: 'erl', nombre: erl.muestra ? `Erlenmeyer: ${NOMBRE[erl.muestra]}${erl.fenol ? ` + ${erl.fenol} gotas de fenolftaleína` : ''}${erl.base ? ' (toca: agitar)' : ''}` : 'Erlenmeyer de 250 mL', ...(erl.base ? { x: SOP_X, y: 368 } : { x: 360, y: 368 }), ancho: 70, alto: 70, tomable: !erl.base, alTocar: erl.base ? agitar : undefined,
      dibujo: <g><path d="M-10 -32 V-12 L-30 26 Q-31 30 -26 30 H26 Q31 30 30 26 L10 -12 V-32" fill="rgba(255,255,255,0.6)" stroke="#2b2b2b" strokeWidth="2" />{erl.muestra && <path d="M-22 10 L-30 26 Q-31 30 -26 30 H26 Q31 30 30 26 L22 10 Z" fill={colorErl} style={{ transition: 'fill 0.6s' }} />}{nube && <ellipse cx="0" cy="12" rx="9" ry="4" fill="rgba(230,60,150,0.7)" />}{erl.metro && <rect x="14" y="-50" width="5" height="72" fill="#34495e" />}</g>,
    },
    { id: 'embudo', nombre: embudo ? 'Embudo (puesto en la bureta)' : 'Embudo', x: 250, y: 395, ancho: 40, alto: 30, tomable: !embudo, dibujo: embudo ? <g /> : <path d="M-18 -12 H18 L4 6 V14 H-4 V6 Z" fill="rgba(255,255,255,0.8)" stroke="#2b2b2b" strokeWidth="1.5" /> },
    ...(embudo ? [{ id: 'quitar', nombre: 'Quitar el embudo de la bureta', x: SOP_X, y: 92, ancho: 44, alto: 26, alTocar: () => { setEmbudo(false); setMsg({ t: 'Embudo fuera: así no caen gotas que cambien la lectura.' }) }, dibujo: <g /> }] : []),
    { id: 'naoh', nombre: 'Frasco de NaOH 0,1 M (estandarizado)', x: 150, y: 370, ancho: 56, alto: 76, tomable: true, color: '#dbe9f6', dibujo: <g><rect x="-22" y="-32" width="44" height="64" rx="6" fill="#dbe9f6" stroke="#2b2b2b" strokeWidth="2" /><rect x="-10" y="-42" width="20" height="10" fill="#555" /><text y="4" textAnchor="middle" fontSize="9" fontWeight="700">NaOH</text><text y="16" textAnchor="middle" fontSize="8">0,1 M</text></g> },
    ...(['hcl', 'vin'] as Tipo[]).map((t, k) => ({ id: t, nombre: `Frasco: ${NOMBRE[t]}`, x: 660 + k * 75, y: 370, ancho: 56, alto: 76, dibujo: <g><rect x="-22" y="-32" width="44" height="64" rx="6" fill={t === 'hcl' ? '#f3f7e6' : '#f6f0dc'} stroke="#2b2b2b" strokeWidth="2" /><text y="2" textAnchor="middle" fontSize="9" fontWeight="700">{t === 'hcl' ? 'HCl' : 'Vinagre'}</text><text y="14" textAnchor="middle" fontSize="8">{t === 'hcl' ? '¿M?' : '1:10'}</text></g> })),
    { id: 'pipeta', nombre: pipeta ? `Pipeta aforada de 10 mL con ${NOMBRE[pipeta]}` : 'Pipeta aforada de 10 mL', x: 830, y: 395, ancho: 90, alto: 18, tomable: true, color: '#f3f7e6', dibujo: <g><path d="M-44 0 H-12 M12 0 H44" stroke="#2b2b2b" strokeWidth="3" /><ellipse cx="0" cy="0" rx="12" ry="6" fill={pipeta ? '#eef3d8' : 'rgba(255,255,255,0.7)'} stroke="#2b2b2b" strokeWidth="1.5" /><path d="M-30 -4 v8" stroke="#c0392b" /></g> },
    { id: 'fenol', nombre: 'Gotero de fenolftaleína', x: 270, y: 330, ancho: 30, alto: 60, tomable: true, color: '#f4f4f4', dibujo: <Gotero color="#f4f4f4" etiqueta="Fenolft." /> },
    { id: 'piseta', nombre: 'Piseta con agua destilada', x: 905, y: 330, ancho: 50, alto: 90, tomable: true, color: '#a9d3f5', dibujo: <Piseta /> },
    ...(grado >= 11 ? [{ id: 'metro', nombre: erl.metro ? 'pH-metro (dentro del erlenmeyer: mide al agitar)' : 'pH-metro', x: 620, y: 260, ancho: 60, alto: 40, tomable: !erl.metro, dibujo: <g><rect x="-22" y="-16" width="44" height="30" rx="4" fill="#34495e" /><rect x="-16" y="-10" width="32" height="13" fill="#1f2d24" /><text y="0" textAnchor="middle" fontSize="8" fill="#7dff9a" fontFamily="monospace">{erl.metro && erl.muestra ? f(pH(erl, conc(erl.muestra), erl.visto)) : 'pH'}</text></g> }] : []),
    { id: 'caneca', nombre: erl.base ? 'Residuos (toca: botar el erlenmeyer y lavarlo)' : 'Residuos', x: 965, y: 360, ancho: 50, alto: 76, alTocar: erl.base ? () => { if (llave) return setMsg({ t: 'Cierra la llave primero.' }); setErl(ERL0); setConEmbudo(false); setMsg({ t: 'Erlenmeyer lavado. Carga otra muestra con la pipeta.' }) } : undefined, dibujo: <g transform="scale(0.85)"><Caneca /></g> },
  ]

  const destinos = (de: string) => ({ embudo: ['bureta'], naoh: ['bureta'], pipeta: pipeta ? ['erl'] : ['hcl', 'vin'], fenol: ['erl'], piseta: ['erl'], erl: erl.base ? ['caneca'] : ['bureta', 'caneca'], metro: ['erl'] } as Record<string, string[]>)[de] ?? []
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'embudo') return en === 'bureta' ? { anim: 'poner', hecho: () => setEmbudo(true) } : 'El embudo va arriba de la bureta.'
    if (de === 'naoh') {
      if (en !== 'bureta') return 'El NaOH va a la bureta.'
      if (llave) return 'Cierra la llave antes de llenar.'
      return { anim: 'verter', hecho: () => {
        const ini = Math.round(Math.random() * 30) / 20 // entre 0 y 1,5 mL
        setLleno(true); setNivel(ini); setLecIni(null)
        if (!embudo) { setDerrameNaOH(true); setMsg({ t: 'Sin embudo se derramó NaOH por fuera de la bureta. Usa el embudo.', aviso: true }) }
        else setMsg({ t: 'Bureta llena. Quita el embudo y anota la lectura inicial tocando la bureta (no tiene que estar en 0).' })
      } }
    }
    if (de === 'pipeta') {
      if (!pipeta) return en === 'hcl' || en === 'vin' ? { anim: 'poner', hecho: () => { setPipeta(en as Tipo); setMsg({ t: `Pipeta llena hasta el aforo con ${NOMBRE[en as Tipo]}.` }) } } : 'Primero carga la pipeta en una muestra.'
      if (en !== 'erl') return 'La muestra va al erlenmeyer.'
      if (erl.muestra) return 'El erlenmeyer ya tiene muestra: bótala en residuos para empezar otra.'
      return { anim: 'verter', hecho: () => { setErl((e) => ({ ...e, muestra: pipeta, vm: 10 })); setPipeta(null); setMsg({ t: '10,00 mL de muestra en el erlenmeyer. Agrega 2 o 3 gotas de fenolftaleína.' }) } }
    }
    if (de === 'fenol') return en === 'erl' ? (erl.muestra ? { anim: 'gotas', gotas: 3, hecho: () => setErl((e) => ({ ...e, fenol: e.fenol + 3 })) } : 'Primero la muestra.') : 'El indicador va al erlenmeyer.'
    if (de === 'piseta') return en === 'erl' ? (erl.muestra ? { anim: 'verter', hecho: () => { setErl((e) => ({ ...e, agua: e.agua + 20 })); setMsg({ t: 'Agregaste 20 mL de agua. Ojo: ¿cambia los moles de ácido?' }) } } : 'Primero la muestra.') : 'El agua va al erlenmeyer.'
    if (de === 'metro') return en === 'erl' ? { anim: 'poner', hecho: () => setErl((e) => ({ ...e, metro: true, curva: e.muestra ? [[e.vb, pH(e, conc(e.muestra), e.vb)]] : [] })) } : 'El electrodo va dentro del erlenmeyer.'
    if (de === 'erl') {
      if (en === 'bureta') return { anim: 'poner', hecho: () => { setErl((e) => ({ ...e, base: true })); setMsg({ t: 'Erlenmeyer bajo la bureta. Abre la llave o da gotas; toca el erlenmeyer para agitar.' }) } }
      if (en === 'caneca') return llave ? 'Cierra la llave primero.' : { anim: 'verter', hecho: () => { setErl(ERL0); setConEmbudo(false); setMsg({ t: 'Erlenmeyer lavado. Carga otra muestra con la pipeta.' }) } }
    }
    return 'No se puede.'
  }

  const curva = erl.curva
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">En una <b>titulación</b> se agrega una base de concentración conocida (NaOH 0,1 M) a un ácido hasta neutralizarlo. La <b>fenolftaleína</b> es incolora en ácido y se pone rosada apenas sobra base: ese es el <b>punto final</b>. Llena la bureta con el embudo, quítalo, anota la lectura inicial, mide 10 mL de muestra con la pipeta, agrega el indicador y titula agitando. Cerca del final, gota a gota.</p>
      <MesaViva desde={60} piezas={piezas} destinos={destinos} soltar={soltar} />
      {msg && <p className={`-mt-2 text-sm ${msg.aviso ? 'font-semibold text-[#b5462c]' : ''}`}>{msg.aviso ? '⚠ ' : '› '}{msg.t}</p>}
      {lleno && <p className="-mt-2 text-xs text-[var(--suave)]">Bureta: {f(lectura)} mL{lecIni !== null ? ` · lectura inicial anotada: ${f(lecIni)} mL` : ''}</p>}
      {grado >= 11 && curva.length > 1 && (
        <svg viewBox="0 0 320 180" className="w-full max-w-md rounded-xl bg-white" role="img" aria-label="Curva de titulación">
          <path d="M30 10 V160 H310" fill="none" stroke="#2b2b2b" />
          {[0, 7, 14].map((p) => <text key={p} x="24" y={163 - p * 10.5} fontSize="8" textAnchor="end">{p}</text>)}
          <text x="170" y="176" fontSize="8" textAnchor="middle">mL de NaOH</text><text x="8" y="90" fontSize="8" transform="rotate(-90 8 90)">pH</text>
          <polyline fill="none" stroke="#c0392b" strokeWidth="2" points={curva.map(([v, p]) => `${30 + v * 10},${160 - Math.max(0, Math.min(14, p)) * 10.5}`).join(' ')} />
          {curva.map(([v, p], k) => <circle key={k} cx={30 + v * 10} cy={160 - Math.max(0, Math.min(14, p)) * 10.5} r="2" fill="#c0392b" />)}
        </svg>
      )}
      {ensayos.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
          <table className="w-full">
            <thead><tr className="text-left"><th className="p-1">#</th><th className="p-1">Muestra</th><th className="p-1">V NaOH (mL)</th><th className="p-1">Color final</th><th className="p-1">Concentración del ácido</th></tr></thead>
            <tbody>{ensayos.map((e, k) => {
              const c = (CB * e.v) / 10
              const real = conc(e.tipo)
              const r = parseFloat((resp[k] ?? '').replace(',', '.'))
              return (
                <tr key={k} className="border-t border-[var(--linea)] align-top">
                  <td className="p-1">{k + 1}</td>
                  <td className="p-1">{NOMBRE[e.tipo]}</td>
                  <td className="p-1">{f(e.v)}</td>
                  <td className="p-1">{e.final}{e.errores.length > 0 && <span className="block text-xs text-[#b5462c]">⚠ {e.errores.join('; ')}</span>}</td>
                  <td className="p-1">{grado >= 11
                    ? <span><input value={resp[k] ?? ''} onChange={(ev) => setResp((x) => ({ ...x, [k]: ev.target.value }))} placeholder="mol/L" className="w-20 rounded border border-[var(--linea)] bg-white px-1" />{!isNaN(r) && <span className={Math.abs(r - c) <= 0.002 ? ' text-[#1e8449]' : ' text-[#b5462c]'}>{Math.abs(r - c) <= 0.002 ? ' ✔' : ` ✘ con tus datos: ${f(c, 3)}`}</span>}</span>
                    : <span>C = 0,1 × {f(e.v)} ÷ 10 = <b>{f(c, 3)} M</b></span>}
                    {e.errores.length === 0 && e.final === 'rosado pálido' && <span className="block text-xs text-[#1e8449]">Valor real: {f(real, 3)} M (error {f((Math.abs(c - real) / real) * 100, 1)} %)</span>}
                    {e.tipo === 'vin' && grado >= 10 && <span className="block text-xs">Vinagre sin diluir: {f(c * 10, 2)} M ≈ {f(c * 10 * 6.005, 1)} g de ácido acético por 100 mL</span>}
                  </td>
                </tr>
              )
            })}</tbody>
          </table>
        </div>
      )}
      {ensayos.length > 0 && <p className="rounded-lg bg-[#eaf5ee] p-2 text-sm"><b>En el punto de equivalencia</b> los moles de base igualan a los de ácido: C<sub>ácido</sub> × V<sub>ácido</sub> = C<sub>base</sub> × V<sub>base</sub>. Por eso el agua que agregues al erlenmeyer no cambia el resultado: no cambia los moles de ácido. Si te pasas, el volumen gastado sale mayor y la concentración calculada también.{grado >= 11 ? ' En la curva, el HCl (ácido fuerte) salta de pH ≈ 3 a 11 justo en la equivalencia (pH 7); el vinagre (ácido débil) empieza más arriba, tiene una zona plana (buffer, pH ≈ pKa = 4,7 a mitad de camino) y su equivalencia queda en pH ≈ 8,7: por eso la fenolftaleína sirve para los dos.' : ''}</p>}
      <p className="text-xs text-[var(--suave)]">Seguridad: el NaOH y el HCl irritan la piel y los ojos: gafas y guantes; nunca pipetear con la boca (se usa la pera). Versión casera: vinagre con bicarbonato disuelto y repollo morado como indicador, contando gotas con un gotero en lugar de la bureta.</p>
    </div>
  )
}
