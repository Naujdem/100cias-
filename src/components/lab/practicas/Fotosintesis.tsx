import { useEffect, useRef, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Caneca, Gotero, Reloj } from '../dibujos.tsx'

// Laboratorio de Biología (PLAN-LABORATORIOS.md): fotosíntesis, en mesa viva («como Tinciones»).
// A) Elodea: la lámpara se lleva a mano a cada marca de la regla, se le pone celofán (9°+), se echa
//    bicarbonato; las burbujas salen en tiempo real y se cuentan tocando el contador 10 s (× 6 = por minuto).
// B) Cromatografía: gotas de extracto en el papel (dejando secar), alcohol en el vaso, la tira al vaso;
//    el solvente sube con el tiempo (acelerado: 1 s = 12 s) y se saca la tira a tiempo.

const DIST = [10, 20, 30, 50, 80]
const COLORES = [
  { id: 'blanca', n: 'Blanca', k: 1, c: '#fff7c2' },
  { id: 'roja', n: 'Roja', k: 0.85, c: '#ff8a7a' },
  { id: 'azul', n: 'Azul', k: 0.75, c: '#8ab4ff' },
  { id: 'verde', n: 'Verde', k: 0.15, c: '#9be58f' },
]

/** burbujas por minuto */
function tasa(d: number | null, color: number, co2: boolean) {
  if (d === null) return 0
  const luz = 100 / (d * d) // intensidad relativa (∝ 1/d²)
  const sat = luz / (luz + 0.12) // la fotosíntesis se satura con mucha luz
  return Math.round(42 * sat * COLORES[color].k * (co2 ? 1 : 0.35))
}

interface Medida { d: number | null; color: string; co2: boolean; b: number; real: number }

const TUBO_X = 700
const xLampara = (d: number) => TUBO_X - 70 - d * 6

function Lampara({ on, color, haz }: { on: boolean; color: string; haz: number }) {
  return (
    <g>
      {on && <polygon points={`20,0 ${haz},-60 ${haz},60`} fill={color} opacity={Math.min(0.45, 1500 / (haz * haz))} />}
      <path d="M-6 50 V10" stroke="#555" strokeWidth="4" />
      <rect x="-26" y="50" width="40" height="8" rx="3" fill="#555" />
      <path d="M-14 -20 L20 -14 V14 L-14 20 Z" fill="#ccc" stroke="#2b2b2b" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="20" r="9" fill={on ? color : '#eee'} stroke="#2b2b2b" strokeWidth="1.5" />
    </g>
  )
}

function TuboElodea({ co2, burbujas }: { co2: boolean; burbujas: number[] }) {
  return (
    <g>
      <style>{'@keyframes fs-sube{from{transform:translateY(0);opacity:1}to{transform:translateY(-80px);opacity:0}}'}</style>
      <rect x="-30" y="-80" width="60" height="150" fill={co2 ? 'rgba(170,210,240,0.55)' : 'rgba(170,210,240,0.35)'} stroke="#2b2b2b" strokeWidth="2.5" />
      <path d="M0 62 Q-6 30 1 0 M1 30 l-14 -10 M1 15 l14 -9 M1 45 l-14 -8 M1 5 l12 -12" stroke="#3f8f2f" strokeWidth="4" fill="none" strokeLinecap="round" />
      {burbujas.map((b) => <circle key={b} cx={1 + ((b * 7) % 5) - 2} cy="-2" r="3.5" fill="#e8f6ff" stroke="#9cc" strokeWidth="0.8" style={{ animation: 'fs-sube 2s linear forwards' }} />)}
      <text y="88" textAnchor="middle" fontSize="11" fontWeight="700" fill="#3a2f22">{co2 ? 'agua + bicarbonato' : 'agua sola'}</text>
    </g>
  )
}

function ElodeaLab({ grado }: { grado: number }) {
  const [d, setD] = useState(30)
  const [on, setOn] = useState(false)
  const [color, setColor] = useState(0)
  const [co2, setCo2] = useState(false)
  const [medidas, setMedidas] = useState<Medida[]>([])
  const [conteo, setConteo] = useState<{ s: number; n: number } | null>(null)
  const r = tasa(on ? d : null, color, co2)
  const [burbujas, setBurbujas] = useState<number[]>([])
  const id = useRef(0)
  const reales = useRef(0)
  useEffect(() => {
    if (!r) return
    const iv = setInterval(() => {
      id.current += 1
      reales.current += 1
      const n = id.current
      setBurbujas((b) => [...b.slice(-14), n])
    }, 60000 / r) // tiempo real
    return () => clearInterval(iv)
  }, [r])
  useEffect(() => {
    if (!conteo || conteo.s <= 0) return
    const t = setTimeout(() => setConteo((c) => (c ? { ...c, s: c.s - 1 } : c)), 1000)
    return () => clearTimeout(t)
  }, [conteo])
  useEffect(() => {
    if (conteo && conteo.s === 0) {
      setMedidas((m) => [...m, { d: on ? d : null, color: COLORES[color].n, co2, b: conteo.n * 6, real: reales.current * 6 }])
      setConteo(null)
    }
  }, [conteo, on, d, color, co2])
  const tocarContador = () => {
    if (!conteo) { reales.current = 0; setConteo({ s: 10, n: 0 }) }
    else setConteo({ ...conteo, n: conteo.n + 1 })
  }
  const piezas: Pieza[] = [
    ...DIST.map((x) => ({ id: `d${x}`, nombre: `Marca de ${x} cm`, x: xLampara(x), y: 412, ancho: 36, alto: 22, dibujo: <g><rect x="-16" y="-8" width="32" height="16" rx="3" fill="#f2e6c4" stroke="#8a6a3a" /><text y="4" textAnchor="middle" fontSize="10" fontWeight="700">{x} cm</text></g> })),
    { id: 'lampara', nombre: `Lámpara (${d} cm)`, x: xLampara(d), y: 330, ancho: 50, alto: 80, tomable: true, dibujo: <Lampara on={on} color={COLORES[color].c} haz={TUBO_X - 30 - xLampara(d)} /> },
    { id: 'interruptor', nombre: on ? 'Apagar la lámpara' : 'Encender la lámpara', x: 60, y: 405, ancho: 44, alto: 34, alTocar: () => setOn((o) => !o), dibujo: <g><rect x="-18" y="-14" width="36" height="28" rx="5" fill="#fff" stroke="#2b2b2b" strokeWidth="2" /><rect x="-6" y={on ? -10 : -2} width="12" height="12" rx="2" fill={on ? '#2e7d5a' : '#999'} /></g> },
    ...(grado >= 9 ? COLORES.map((x, k) => ({ id: `c${k}`, nombre: `Celofán ${x.n.toLowerCase()}`, x: 60 + k * 55, y: 240, ancho: 46, alto: 40, tomable: true, dibujo: <g><rect x="-18" y="-16" width="36" height="32" fill={x.c} opacity="0.75" stroke="#777" /><text y="28" textAnchor="middle" fontSize="9" fontWeight="700">{x.n}</text></g> })) : []),
    { id: 'tubo', nombre: 'Tubo con elodea', x: TUBO_X, y: 320, ancho: 64, alto: 160, dibujo: <TuboElodea co2={co2} burbujas={on ? burbujas : []} /> },
    { id: 'bicarb', nombre: 'Bicarbonato (CO₂)', x: 800, y: 312, ancho: 50, alto: 96, tomable: true, color: '#eeeeee', dibujo: <Gotero color="#eeeeee" etiqueta="BICARB." /> },
    { id: 'agua', nombre: 'Agua nueva (sin bicarbonato)', x: 860, y: 312, ancho: 50, alto: 96, tomable: true, color: '#a9d3f5', dibujo: <Gotero color="#a9d3f5" etiqueta="AGUA" /> },
    { id: 'contador', nombre: conteo ? `Contador: toca por cada burbuja (${conteo.s} s)` : 'Contador (toca para empezar a contar 10 s)', x: 940, y: 250, ancho: 70, alto: 70, alTocar: tocarContador, dibujo: <g><rect x="-30" y="-30" width="60" height="60" rx="10" fill={conteo ? '#ffd27a' : '#fff'} stroke="#2b2b2b" strokeWidth="2.5" /><text y="2" textAnchor="middle" fontSize="20" fontWeight="800">{conteo ? conteo.n : '▶'}</text><text y="22" textAnchor="middle" fontSize="10" fontWeight="700">{conteo ? `${conteo.s} s` : 'contar'}</text></g> },
  ]
  const destinos = (de: string) => (de === 'lampara' ? DIST.map((x) => `d${x}`) : ['tubo', ...(de.startsWith('c') ? ['lampara'] : [])])
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'lampara') {
      if (!en.startsWith('d')) return 'Pon la lámpara en una marca de la regla.'
      return { anim: 'poner', hecho: () => setD(parseInt(en.slice(1), 10)) }
    }
    if (de.startsWith('c')) {
      if (en !== 'lampara') return 'El celofán se pone delante de la lámpara.'
      return { anim: 'poner', hecho: () => setColor(parseInt(de.slice(1), 10)) }
    }
    if (en !== 'tubo') return 'Eso va en el tubo.'
    if (de === 'bicarb') return co2 ? 'Ya tiene bicarbonato.' : { anim: 'polvo', hecho: () => setCo2(true) }
    if (de === 'agua') return { anim: 'verter', hecho: () => setCo2(false) }
    return 'No se puede.'
  }
  const pts = medidas.filter((m) => m.d !== null && m.color === 'Blanca' && m.co2)
  const X = (x: number) => 30 + (x / 80) * 250
  const Y = (y: number) => 150 - y * 3.2
  const ultima = medidas[medidas.length - 1]
  return (
    <div className="flex flex-col gap-3">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        Una rama de elodea cortada bajo el agua suelta burbujas de <b>oxígeno</b> mientras hace fotosíntesis. Lleva la lámpara a una marca de la regla, enciéndela{grado >= 9 ? ', ponle un celofán de color si quieres' : ''} y echa bicarbonato al agua. Para medir, toca el <b>contador</b>: durante 10 s tócalo una vez por cada burbuja que suba; se multiplica por 6 para tener las burbujas por minuto.
      </p>
      <MesaViva desde={190} piezas={piezas} destinos={destinos} soltar={soltar} />
      {ultima && Math.abs(ultima.b - ultima.real) > 6 && <p className="text-sm font-semibold text-[#b5462c]">⚠ Contaste {ultima.b / 6} burbujas en 10 s, pero salieron {ultima.real / 6}. Vuelve a contar con calma.</p>}
      <div className="flex flex-col gap-3">
        {medidas.length > 0 && (
          <div className="grid gap-3 lg:grid-cols-2">
            <table className="rounded-xl bg-[var(--tarjeta)] text-xs">
              <thead><tr className="border-b text-left"><th className="p-1.5">Lámpara</th><th className="p-1.5">Luz</th><th className="p-1.5">CO₂</th><th className="p-1.5">Burbujas/min</th></tr></thead>
              <tbody>{medidas.slice(-8).map((m, k) => <tr key={k} className="border-b last:border-0"><td className="p-1.5">{m.d === null ? 'apagada' : `${m.d} cm`}</td><td className="p-1.5">{m.color}</td><td className="p-1.5">{m.co2 ? 'sí' : 'no'}</td><td className="p-1.5 font-bold">{m.b}</td></tr>)}</tbody>
            </table>
            <svg viewBox="0 0 300 175" className="w-full rounded-xl bg-white" role="img" aria-label="Gráfica burbujas contra distancia">
              <line x1="30" y1="150" x2="285" y2="150" stroke="#333" />
              <line x1="30" y1="10" x2="30" y2="150" stroke="#333" />
              {[0, 20, 40, 60, 80].map((x) => <text key={x} x={X(x)} y="164" textAnchor="middle" fontSize="9">{x}</text>)}
              <text x="285" y="145" textAnchor="end" fontSize="9">cm</text>
              <text x="34" y="12" fontSize="9">burbujas/min (luz blanca, con CO₂)</text>
              {[...pts].sort((a, b) => a.d! - b.d!).map((e, k, arr) => k > 0 && <line key={`l${k}`} x1={X(arr[k - 1].d!)} y1={Y(arr[k - 1].b)} x2={X(e.d!)} y2={Y(e.b)} stroke="var(--acento)" strokeWidth="2" />)}
              {pts.map((e, k) => <circle key={k} cx={X(e.d!)} cy={Y(e.b)} r="4" fill="var(--acento)" />)}
            </svg>
          </div>
        )}
        {medidas.length >= 3 && (
          <p className="rounded-xl bg-[#eaf5ee] p-3 text-sm">
            Más cerca la lámpara, más luz y más oxígeno, hasta que la planta ya no puede ir más rápido (se satura). Sin luz no hay burbujas. Sin bicarbonato falta CO₂, la materia prima del azúcar.{grado >= 9 ? ' La luz verde casi no sirve: la clorofila la refleja, por eso vemos verdes las hojas.' : ''}
          </p>
        )}
      </div>
    </div>
  )
}

// ---------- cromatografía ----------

const PIGMENTOS = [
  { n: 'Carotenos', rf: 0.94, c: '#f08a1c' },
  { n: 'Xantofilas', rf: 0.72, c: '#e8c51e' },
  { n: 'Clorofila a', rf: 0.5, c: '#1f8a5a' },
  { n: 'Clorofila b', rf: 0.34, c: '#7fae2a' },
]
const LARGO = 100 // mm de papel útil, desde la línea de origen

const Yt = (mm: number) => 90 - mm * 1.5

/** tira de papel (centrada): línea de origen, mancha o bandas, frente del solvente y regla (11°) */
function Tira({ frente, intens, ancha, corrida, pasado, regla }: { frente: number; intens: number; ancha: boolean; corrida: boolean; pasado: boolean; regla: boolean }) {
  return (
    <g>
      <rect x="-12" y="-90" width="24" height="196" fill="#fdfcf6" stroke="#bbb" />
      <line x1="-12" x2="12" y1={Yt(0)} y2={Yt(0)} stroke="#999" strokeDasharray="2 2" />
      {frente > 0 && <rect x="-12" y={Yt(frente)} width="24" height={frente * 1.5} fill="rgba(170,210,240,0.25)" />}
      {frente > 0 && <line x1="-12" x2="12" y1={Yt(frente)} y2={Yt(frente)} stroke="#6aa0c8" strokeWidth="1.5" />}
      {!corrida ? (
        intens > 0 && <ellipse cx="0" cy={Yt(0)} rx={ancha ? 9 : 4} ry={ancha ? 5 : 4} fill="#1f6a3a" opacity={0.3 + intens * 0.7} />
      ) : (
        PIGMENTOS.map((p) => {
          const y = frente * p.rf * (pasado && p.rf > 0.6 ? 1.04 : 1)
          return <rect key={p.n} x="-11" y={Yt(y) - (ancha ? 5 : 3)} width="22" height={pasado && p.rf > 0.6 ? 4 : ancha ? 10 : 6} rx="2" fill={p.c} opacity={0.25 + intens * 0.75} />
        })
      )}
      {regla && (
        <g fontSize="7" fill="#555">
          {[0, 20, 40, 60, 80, 100].map((mm) => <g key={mm}><line x1="14" x2="20" y1={Yt(mm)} y2={Yt(mm)} stroke="#555" /><text x="22" y={Yt(mm) + 3}>{mm}</text></g>)}
        </g>
      )}
    </g>
  )
}

function VasoCroma({ nivel, children, verdoso }: { nivel: number; children?: React.ReactNode; verdoso: boolean }) {
  // nivel 0: vacío; 1: por debajo de la línea de origen; 2+: por encima
  const h = nivel === 0 ? 0 : nivel === 1 ? 10 : 28
  return (
    <g>
      {children && <g><rect x="-36" y="-118" width="72" height="5" fill="#8a6a3a" /><g transform="translate(0 -14)">{children}</g></g>}
      <rect x="-48" y={96 - h} width="96" height={h} fill={verdoso ? 'rgba(31,138,90,0.4)' : 'rgba(170,210,240,0.5)'} />
      <path d="M-50 -40 V96 H50 V-40" fill="none" stroke="#2b2b2b" strokeWidth="2.5" />
    </g>
  )
}

interface Cr { apl: number; ultima: number; ancha: boolean; nivel: number; donde: 'mesa' | 'vaso' | 'bandeja'; min: number }
const CR0: Cr = { apl: 0, ultima: 0, ancha: false, nivel: 0, donde: 'mesa', min: 0 }

function Cromatografia({ grado }: { grado: number }) {
  const [c, setC] = useState<Cr>(CR0)
  const [rf, setRf] = useState('')
  const [rev, setRev] = useState(false)
  const [cuenta, setCuenta] = useState(0)
  const [alarma, setAlarma] = useState(false)
  const [ahora, setAhora] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => {
      setAhora((a) => a + 1)
      setC((x) => (x.donde === 'vaso' ? { ...x, min: x.min + 0.2 } : x))
      setCuenta((k) => { if (k > 0 && k <= 12) setAlarma(true); return Math.max(0, k - 12) })
    }, 1000)
    return () => window.clearInterval(id)
  }, [])
  const alto = c.nivel >= 2
  const min = Math.floor(c.min)
  const corrida = c.min > 0
  const frente = alto ? 0 : Math.min(LARGO, c.min * 7)
  const intens = Math.min(1, c.apl / 4)
  const pasado = c.min * 7 > LARGO + 10
  const regla = grado >= 11
  const tira = <Tira frente={frente} intens={alto && corrida ? 0 : intens} ancha={c.ancha} corrida={corrida && !alto} pasado={pasado} regla={regla} />
  const piezas: Pieza[] = [
    { id: 'extracto', nombre: 'Capilar con extracto de hojas', x: 70, y: 335, ancho: 60, alto: 70, tomable: true, color: '#1f6a3a', dibujo: <g><path d="M-26 10 Q-26 34 0 34 Q26 34 26 10 Z" fill="#8a8a8a" stroke="#2b2b2b" strokeWidth="2" /><ellipse cy="10" rx="24" ry="6" fill="#2f7a3a" /><path d="M10 6 L30 -40" stroke="#555" strokeWidth="3" strokeLinecap="round" /><text y="52" textAnchor="middle" fontSize="10" fontWeight="700">Extracto</text></g> },
    ...(c.donde === 'mesa' ? [{ id: 'tira', nombre: 'Tira de papel', x: 230, y: 320, ancho: 40, alto: 200, tomable: true, dibujo: tira }] : []),
    { id: 'alcohol', nombre: 'Alcohol (solvente)', x: 380, y: 312, ancho: 50, alto: 96, tomable: true, color: '#d8ecf8', dibujo: <Gotero color="#d8ecf8" etiqueta="ALCOHOL" /> },
    { id: 'vaso', nombre: c.donde === 'vaso' ? `Vaso con la tira (${min} min)` : 'Vaso', x: 550, y: 330, ancho: 104, alto: 150, tomable: c.donde === 'vaso', dibujo: <VasoCroma nivel={c.nivel} verdoso={alto && corrida}>{c.donde === 'vaso' ? tira : undefined}</VasoCroma> },
    { id: 'bandeja', nombre: 'Bandeja para secar', x: 740, y: 330, ancho: 90, alto: 200, dibujo: <g><rect x="-40" y="90" width="80" height="12" rx="3" fill="#c8b48a" stroke="#2b2b2b" strokeWidth="2" />{c.donde === 'bandeja' && <g transform="translate(0 -6)">{tira}</g>}</g> },
    { id: 'reloj', nombre: 'Temporizador (toca: +1 min)', x: 880, y: 250, ancho: 72, alto: 72, alTocar: () => { setAlarma(false); setCuenta((k) => k + 60) }, dibujo: <Reloj s={cuenta} alarma={alarma} aviso="¡Mira!" /> },
    { id: 'caneca', nombre: 'Residuos (toca: nueva tira)', x: 955, y: 380, ancho: 54, alto: 76, alTocar: () => { setC(CR0); setRev(false); setRf(''); setCuenta(0); setAlarma(false) }, dibujo: <Caneca /> },
  ]
  const destinos = (de: string) => (de === 'extracto' ? ['tira'] : de === 'alcohol' ? ['vaso'] : de === 'tira' ? ['vaso'] : de === 'vaso' ? ['bandeja'] : [])
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'extracto') {
      if (en !== 'tira') return 'El extracto se pone con el capilar sobre la línea de la tira.'
      const mojada = c.apl > 0 && ahora - c.ultima < 3
      return { anim: 'gotas', gotas: 1, hecho: () => setC((x) => ({ ...x, apl: Math.min(6, x.apl + 1), ultima: ahora, ancha: x.ancha || mojada })) }
    }
    if (de === 'alcohol') {
      if (en !== 'vaso') return 'El alcohol va en el vaso.'
      if (c.donde === 'vaso') return 'No eches alcohol con la tira adentro: sube de golpe y tapa la mancha.'
      if (c.nivel >= 3) return 'El vaso ya tiene bastante.'
      return { anim: 'verter', hecho: () => setC((x) => ({ ...x, nivel: x.nivel + 1 })) }
    }
    if (de === 'tira') {
      if (en !== 'vaso') return 'Cuelga la tira dentro del vaso.'
      if (c.apl === 0) return 'Primero pon el extracto en la línea de la tira.'
      if (c.nivel === 0) return 'El vaso está vacío: echa un poco de alcohol primero.'
      return { anim: 'poner', hecho: () => setC((x) => ({ ...x, donde: 'vaso' })) }
    }
    if (de === 'vaso') return en === 'bandeja' ? { anim: 'poner', hecho: () => setC((x) => ({ ...x, donde: 'bandeja' })) } : 'Saca la tira a la bandeja para que se seque.'
    return 'No se puede.'
  }
  const btn = 'min-h-9 rounded-full border border-[var(--linea)] bg-white px-3 text-xs font-semibold'
  const num = parseFloat(rf.replace(',', '.'))
  const obs: string[] = []
  if (c.donde === 'bandeja') {
    if (alto) obs.push('El alcohol tapó la mancha: los pigmentos se disolvieron en el vaso y en el papel no se separó nada. El solvente debe quedar por debajo de la línea (echa menos alcohol).')
    else {
      if (c.apl < 3) obs.push('Las bandas salen pálidas: aplica el extracto varias veces en el mismo punto, dejando secar entre una y otra.')
      if (c.ancha) obs.push('Pusiste gotas sin dejar secar la anterior: la mancha se regó y las bandas salieron anchas y borrosas.')
      if (frente < 60) obs.push('Sacaste la tira muy pronto: el solvente no subió lo suficiente para separar bien las bandas.')
      if (pasado) obs.push('Dejaste el papel demasiado tiempo: el solvente llegó al borde y las bandas de arriba se juntan.')
      if (!obs.length) obs.push('¡Buena separación! De arriba hacia abajo: carotenos (naranja), xantofilas (amarillo), clorofila a (verde azulado) y clorofila b (verde amarillento).')
    }
  }
  return (
    <div className="flex flex-col gap-3">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        Hojas verdes molidas con alcohol dan un extracto verde. Con el capilar pon gotas en la línea de la tira, <b>dejando secar entre una y otra</b> (unos segundos). Echa un poco de alcohol en el vaso, cuelga la tira y espera: el alcohol sube (acelerado: 1 s = 12 s) y separa los <b>pigmentos</b>. Cuando el frente esté cerca de arriba (unos 12–14 min), saca la tira a la bandeja.
      </p>
      <MesaViva desde={190} piezas={piezas} destinos={destinos} soltar={soltar} />
      <p className="text-sm">Gotas de extracto: <b>{c.apl}</b> · Alcohol: <b>{c.nivel === 0 ? 'vacío' : c.nivel === 1 ? 'por debajo de la línea' : 'por encima de la línea'}</b>{c.donde !== 'mesa' ? <> · Tiempo en el vaso: <b>{min} min</b></> : null}</p>
      {obs.length > 0 && <ul className="list-disc rounded-xl bg-[var(--tarjeta)] p-3 pl-8 text-sm">{obs.map((o) => <li key={o}>{o}</li>)}</ul>}
      {grado >= 11 && c.donde === 'bandeja' && !alto && frente >= 60 && !pasado && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <label className="font-semibold">Rf de la clorofila a = distancia de la banda ÷ distancia del frente: <input value={rf} onChange={(e) => setRf(e.target.value)} className="w-20 rounded-lg border border-[var(--linea)] bg-white px-2 py-1 text-right" /></label>
          <button type="button" onClick={() => setRev(true)} className={btn}>Comprobar</button>
          {rev && <span className={Math.abs(num - 0.5) <= 0.05 ? 'font-bold text-[#2e7d5a]' : 'font-bold text-[#b5462c]'}>{Math.abs(num - 0.5) <= 0.05 ? '¡Correcto!' : 'Revisa:'} la banda está a {Math.round(frente * 0.5)} mm y el frente a {Math.round(frente)} mm → Rf ≈ 0,50.</span>}
        </div>
      )}
      <p className="text-xs text-[var(--suave)]">⚠ El alcohol es inflamable: lejos de llamas. Versión casera: hojas de espinaca, alcohol antiséptico, filtro de café y un vaso; también sirve una tiza blanca. Los Rf son aproximados y cambian con el solvente.</p>
    </div>
  )
}

export default function Fotosintesis({ grado }: { grado: number }) {
  const [modo, setModo] = useState<'elodea' | 'pigmentos'>('elodea')
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {(['elodea', 'pigmentos'] as const).map((x) => (
          <button key={x} type="button" onClick={() => setModo(x)} className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${modo === x ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-[var(--tarjeta)]'}`}>
            {x === 'elodea' ? '1. Burbujas de oxígeno' : '2. Pigmentos de las hojas'}
          </button>
        ))}
      </div>
      {modo === 'elodea' ? <ElodeaLab grado={grado} /> : <Cromatografia grado={grado} />}
    </div>
  )
}
