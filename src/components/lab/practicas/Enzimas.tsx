import { useEffect, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Caneca, Gotero, Reloj, Tubo, Vaso } from '../dibujos.tsx'

// Laboratorio de Biología (PLAN-LABORATORIOS.md; amilasa del manual de Bioquímica): enzimas, en mesa viva.
// A) Catalasa: la papa o el hígado se deja 10 min a una temperatura (acelerado: 1 s = 20 s), se pasa al tubo,
//    (desde 9°) gotas de vinagre o bicarbonato, y agua oxigenada: la espuma crece en tiempo real y se mide al minuto.
// B) Amilasa: el tubo de almidón va a un baño, se le echa la amilasa y, minuto a minuto (1 s = 6 s), se lleva
//    una gota a la placa de toque con lugol hasta que deje de ponerse azul-negra.

const TEMPS = [
  { t: 5, n: 'Nevera (5 °C)' },
  { t: 20, n: 'Ambiente (20 °C)' },
  { t: 37, n: 'Tibia (37 °C)' },
  { t: 60, n: 'Caliente (60 °C)' },
  { t: 100, n: 'Hervida (100 °C)' },
]
const MUESTRAS = [
  { id: 'papa', n: 'Papa cruda', k: 0.6 },
  { id: 'higado', n: 'Hígado de pollo crudo', k: 1 },
]

/** actividad relativa (0–1) por temperatura: sube hasta ≈ 37 °C y se desnaturaliza al calentar */
const porTemp = (t: number) => (t >= 60 ? (t >= 100 ? 0 : 0.08) : Math.exp(-((t - 37) ** 2) / (2 * 15 ** 2)))
const porPh = (p: number) => Math.exp(-((p - 7) ** 2) / (2 * 1.8 ** 2))
const f = (x: number, d = 1) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })

interface Ensayo { muestra: string; t: number; p: number; mm: number }
const COLOR_M = ['#efe0b0', '#7a2a2a']
const BANO = (t: number) => (t <= 5 ? 'rgba(200,230,250,0.9)' : t >= 100 ? 'rgba(169,211,245,0.9)' : t >= 37 ? 'rgba(240,200,150,0.7)' : 'rgba(169,211,245,0.6)')

/** tubo con agua oxigenada: la muestra al fondo y la espuma (mm) encima */
function TuboEspuma({ muestra, mm, ph }: { muestra: number | null; mm: number; ph: number }) {
  return (
    <g>
      <path d="M-23 -70 V60 Q-23 74 0 74 Q23 74 23 60 V-70" fill="rgba(255,255,255,0.6)" stroke="#2b2b2b" strokeWidth="2.5" />
      {muestra !== null && <rect x="-16" y="50" width="32" height="18" rx="5" fill={COLOR_M[muestra]} />}
      {ph !== 7 && <rect x="-21" y="40" width="42" height="8" fill={ph < 7 ? 'rgba(240,230,170,0.6)' : 'rgba(230,230,230,0.8)'} />}
      {mm > 0 && (
        <g>
          <rect x="-21" y={40 - mm * 1.6} width="42" height={mm * 1.6} fill="#fbfbfb" />
          {Array.from({ length: Math.round(mm / 2) }, (_, k) => <circle key={k} cx={-17 + ((k * 13) % 34)} cy={38 - ((k * 17) % Math.max(4, mm * 1.6))} r={2 + (k % 3)} fill="none" stroke="#b9c2ca" />)}
          <text x="30" y={44 - mm * 1.6} fontSize="12" fontWeight="800" fill="#3a2f22">{f(mm)} mm</text>
        </g>
      )}
      {Array.from({ length: 6 }, (_, k) => <line key={k} x1="23" x2="17" y1={40 - k * 20} y2={40 - k * 20} stroke="#2b2b2b" />)}
    </g>
  )
}

interface Prep { m: number; lugar: number | null; min: number; enTubo: boolean; tEf: number; p: number; s: number | null; anotado: boolean }

function Catalasa({ grado }: { grado: number }) {
  const [prep, setPrep] = useState<Prep | null>(null)
  const [ensayos, setEnsayos] = useState<Ensayo[]>([])
  const [cuenta, setCuenta] = useState(0)
  const [alarma, setAlarma] = useState(false)
  const m = prep?.m ?? 0
  const corre = !!prep && ((prep.lugar !== null && !prep.enTubo) || (prep.s !== null && prep.s < 60))
  useEffect(() => {
    const id = window.setInterval(() => {
      if (corre) setPrep((x) => (!x ? x : x.enTubo ? { ...x, s: Math.min(60, (x.s ?? 0) + 4) } : { ...x, min: x.min + 1 / 3 }))
      setCuenta((c) => { if (c > 0 && c <= 20) setAlarma(true); return Math.max(0, c - 20) })
    }, 1000)
    return () => window.clearInterval(id)
  }, [corre])
  const mmFinal = prep ? Math.round(MUESTRAS[prep.m].k * porTemp(prep.tEf) * porPh(prep.p) * 60 * 10) / 10 : 0
  const mm = prep?.s != null ? mmFinal * Math.min(1, prep.s / 45) : 0
  useEffect(() => {
    // al minuto se mide y se anota
    if (prep && prep.s === 60 && !prep.anotado) {
      const t = prep.lugar === null ? 20 : prep.min >= 10 ? TEMPS[prep.lugar].t : Math.round(prep.tEf)
      setEnsayos((e) => [...e, { muestra: MUESTRAS[prep.m].n, t, p: prep.p, mm: mmFinal }])
      setPrep({ ...prep, anotado: true })
    }
  }, [prep, mmFinal])
  const piezas: Pieza[] = [
    ...MUESTRAS.map((x, k) => ({ id: x.id, nombre: x.n, x: 55 + k * 70, y: 345, ancho: 56, alto: 40, tomable: true, dibujo: <g><rect x="-22" y="-12" width="44" height="24" rx="7" fill={COLOR_M[k]} stroke="#2b2b2b" strokeWidth="2" /><text y="32" textAnchor="middle" fontSize="10" fontWeight="700" fill="#3a2f22">{k ? 'Hígado' : 'Papa'}</text></g> })),
    ...TEMPS.map((x, k) => {
      const aqui = prep && prep.lugar === k && !prep.enTubo
      return {
        id: `l${k}`, nombre: aqui ? `${x.n}: ${Math.floor(prep!.min)} min (llévala al tubo)` : x.n, x: 225 + k * 80, y: 335, ancho: 72, alto: 100, tomable: !!aqui,
        dibujo: <g><Vaso color={BANO(x.t)} etiqueta={`${x.t} °C`} minutos={aqui ? Math.floor(prep!.min) : undefined} />{aqui && <rect x="-14" y="20" width="28" height="16" rx="5" fill={COLOR_M[prep!.m]} />}</g>,
      }
    }),
    { id: 'tubo', nombre: 'Tubo de ensayo', x: 650, y: 315, ancho: 60, alto: 150, dibujo: <TuboEspuma muestra={prep?.enTubo ? prep.m : null} mm={mm} ph={prep?.p ?? 7} /> },
    ...(grado >= 9 ? [
      { id: 'vinagre', nombre: 'Vinagre (ácido)', x: 740, y: 312, ancho: 50, alto: 96, tomable: true, color: '#f0e6aa', dibujo: <Gotero color="#f0e6aa" etiqueta="VINAGRE" /> },
      { id: 'bicarb', nombre: 'Bicarbonato (básico)', x: 800, y: 312, ancho: 50, alto: 96, tomable: true, color: '#eee', dibujo: <Gotero color="#eeeeee" etiqueta="BICARB." /> },
    ] : []),
    { id: 'h2o2', nombre: 'Agua oxigenada 3 %', x: 870, y: 312, ancho: 50, alto: 96, tomable: true, color: '#e4f1fb', dibujo: <Gotero color="#e4f1fb" etiqueta="H₂O₂" oscuro /> },
    { id: 'reloj', nombre: 'Temporizador (toca: +1 min)', x: 870, y: 225, ancho: 72, alto: 72, alTocar: () => { setAlarma(false); setCuenta((c) => c + 60) }, dibujo: <Reloj s={cuenta} alarma={alarma} aviso="¡Listo!" /> },
    { id: 'caneca', nombre: 'Residuos', x: 955, y: 330, ancho: 54, alto: 76, dibujo: <Caneca /> },
  ]
  const destinos = (de: string) => (MUESTRAS.some((x) => x.id === de) ? [...TEMPS.map((_, k) => `l${k}`), 'tubo'] : de === 'tubo' ? ['caneca'] : ['tubo'])
  const soltar = (de: string, en: string): Uso | string => {
    const mi = MUESTRAS.findIndex((x) => x.id === de)
    if (mi >= 0) {
      if (prep) return 'Ya hay una muestra en uso. Cuando termine el ensayo, toca la caneca para vaciar y empezar otro.'
      if (en === 'tubo') return { anim: 'poner', hecho: () => setPrep({ m: mi, lugar: null, min: 0, enTubo: true, tEf: 20, p: 7, s: null, anotado: false }) }
      const k = parseInt(en.slice(1), 10)
      return { anim: 'poner', hecho: () => setPrep({ m: mi, lugar: k, min: 0, enTubo: false, tEf: 20, p: 7, s: null, anotado: false }) }
    }
    if (de.startsWith('l') && prep && prep.lugar !== null) {
      if (en !== 'tubo') return 'Lleva la muestra al tubo.'
      const T = TEMPS[prep.lugar].t
      const fr = Math.min(1, prep.min / 10)
      return { anim: 'poner', hecho: () => setPrep({ ...prep, enTubo: true, tEf: 20 + (T - 20) * fr }) }
    }
    if (!prep?.enTubo) return 'Primero pon la muestra en el tubo.'
    if (prep.s !== null) return 'Ya tiene agua oxigenada. Cuando se mida, bota el tubo en la caneca para el siguiente ensayo.'
    if (de === 'vinagre' || de === 'bicarb') {
      if (prep.p !== 7) return 'Ya le cambiaste el pH.'
      return { anim: 'gotas', gotas: 3, hecho: () => setPrep({ ...prep, p: de === 'vinagre' ? 3 : 10 }) }
    }
    if (de === 'h2o2') return { anim: 'verter', hecho: () => setPrep({ ...prep, s: 0 }) }
    return 'No se puede.'
  }
  const vaciar = () => { setPrep(null); setCuenta(0); setAlarma(false) }
  piezas[piezas.length - 1].alTocar = vaciar
  piezas[piezas.length - 1].nombre = 'Residuos (toca: vaciar y empezar otro ensayo)'
  // gráfica: espuma vs temperatura (solo ensayos a pH 7 de la muestra elegida)
  const puntos = ensayos.filter((e) => e.p === 7 && e.muestra === MUESTRAS[m].n)
  const X = (x: number) => 30 + (x / 100) * 250
  const Y = (y: number) => 150 - y * 2.1
  return (
    <div className="flex flex-col gap-3">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        La <b>catalasa</b> descompone el agua oxigenada: 2 H₂O₂ → 2 H₂O + O₂. El oxígeno forma espuma; <b>más espuma en 1 minuto = enzima más activa</b>.
        Deja la muestra <b>10 minutos</b> en un vaso a la temperatura que quieras probar (acelerado: 1 s = 20 s), pásala al tubo{grado >= 9 ? ', cambia el pH si quieres' : ''} y echa el agua oxigenada. La espuma se mide sola al minuto.
      </p>
      <MesaViva desde={190} piezas={piezas} destinos={destinos} soltar={soltar} />
      {prep?.enTubo && prep.lugar !== null && prep.min < 10 && <p className="text-sm font-semibold text-[#b5462c]">⚠ La muestra estuvo solo {Math.floor(prep.min)} min en el vaso: no alcanzó del todo esa temperatura.</p>}
      <div className="flex flex-col gap-3">
        {ensayos.length > 0 && (
          <div className="grid gap-3 lg:grid-cols-2">
            <table className="rounded-xl bg-[var(--tarjeta)] text-xs">
              <thead><tr className="border-b text-left"><th className="p-1.5">#</th><th className="p-1.5">Muestra</th><th className="p-1.5">°C</th><th className="p-1.5">pH</th><th className="p-1.5">Espuma</th></tr></thead>
              <tbody>
                {ensayos.slice(-8).map((e, k) => (
                  <tr key={k} className="border-b last:border-0"><td className="p-1.5">{ensayos.length - Math.min(8, ensayos.length) + k + 1}</td><td className="p-1.5">{e.muestra}</td><td className="p-1.5">{e.t}</td><td className="p-1.5">{e.p}</td><td className="p-1.5 font-bold">{f(e.mm)} mm</td></tr>
                ))}
              </tbody>
            </table>
            <svg viewBox="0 0 300 175" className="w-full rounded-xl bg-white" role="img" aria-label="Gráfica espuma contra temperatura">
              <line x1="30" y1="150" x2="285" y2="150" stroke="#333" />
              <line x1="30" y1="15" x2="30" y2="150" stroke="#333" />
              {[0, 20, 40, 60, 80, 100].map((x) => <text key={x} x={X(x)} y="164" textAnchor="middle" fontSize="9">{x}</text>)}
              <text x="285" y="145" textAnchor="end" fontSize="9">°C</text>
              <text x="34" y="14" fontSize="9">espuma (mm) · {MUESTRAS[m].n}, pH 7</text>
              {[...puntos].sort((a, b) => a.t - b.t).map((e, k, arr) => k > 0 && <line key={`l${k}`} x1={X(arr[k - 1].t)} y1={Y(arr[k - 1].mm)} x2={X(e.t)} y2={Y(e.mm)} stroke="var(--acento)" strokeWidth="2" />)}
              {puntos.map((e, k) => <circle key={k} cx={X(e.t)} cy={Y(e.mm)} r="4" fill="var(--acento)" />)}
              {puntos.length < 3 && <text x="155" y="90" textAnchor="middle" fontSize="10" fill="#888">Prueba varias temperaturas a pH 7 para ver la curva</text>}
            </svg>
          </div>
        )}
        {ensayos.some((e) => e.t === 100) && ensayos.some((e) => e.t === 37) && (
          <p className="rounded-xl bg-[#eaf5ee] p-3 text-sm">
            La enzima trabaja mejor cerca de 37 °C. En la nevera trabaja lento, pero se recupera al calentarse. Al hervirla se <b>desnaturaliza</b>: su forma cambia para siempre y ya no funciona.{grado >= 9 ? ' Con ácido o base también pierde actividad: cada enzima tiene un pH óptimo.' : ''}
          </p>
        )}
      </div>
    </div>
  )
}

// ---------- amilasa ----------

/** minutos que tarda la amilasa en digerir todo el almidón a cada temperatura (Infinity = nunca) */
const TIEMPO: Record<number, number> = { 5: 22, 20: 8, 37: 3, 60: Infinity, 100: Infinity }
const MAXMIN = 12

function colorLugol(s: number) {
  if (s > 0.6) return '#1e1a3c'
  if (s > 0.3) return '#5b2a5e'
  if (s > 0.06) return '#9a4a2a'
  return '#d9a441'
}

/** placa de toque con lugol: cada pozo con la gota tomada en un minuto */
function Placa({ gotas }: { gotas: { min: number; s: number }[] }) {
  return (
    <g>
      <rect x="-150" y="-36" width="300" height="72" rx="10" fill="#f4f4f0" stroke="#999" strokeWidth="2" />
      {Array.from({ length: 13 }, (_, k) => {
        const g = gotas[k]
        return (
          <g key={k}>
            <circle cx={-132 + (k % 7) * 44} cy={k < 7 ? -14 : 18} r="12" fill={g ? colorLugol(g.s) : '#e8cf8a'} stroke="#bbb" />
            {g && <text x={-132 + (k % 7) * 44} y={(k < 7 ? -14 : 18) + 4} textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff">{g.min}′</text>}
          </g>
        )
      })}
    </g>
  )
}

interface Am { lugar: number | null; s: number | null; gotas: { min: number; s: number }[] }

function Amilasa() {
  const [a, setA] = useState<Am>({ lugar: null, s: null, gotas: [] })
  const [cuenta, setCuenta] = useState(0)
  const [alarma, setAlarma] = useState(false)
  const [resp, setResp] = useState('')
  const [rev, setRev] = useState(false)
  useEffect(() => {
    const id = window.setInterval(() => {
      setA((x) => (x.s === null ? x : { ...x, s: x.s + 6 }))
      setCuenta((c) => { if (c > 0 && c <= 6) setAlarma(true); return Math.max(0, c - 6) })
    }, 1000)
    return () => window.clearInterval(id)
  }, [])
  const t = a.lugar === null ? 20 : TEMPS[a.lugar].t
  const minAhora = a.s === null ? 0 : Math.floor(a.s / 60)
  const queda = (k: number) => (TIEMPO[t] === Infinity ? 1 : Math.max(0, 1 - k / TIEMPO[t]))
  const fin = TIEMPO[t] === Infinity ? null : Math.ceil(TIEMPO[t])
  const n = a.gotas.length - 1
  const num = parseInt(resp, 10)
  const xTubo = a.lugar === null ? 80 : 200 + a.lugar * 80
  const piezas: Pieza[] = [
    ...TEMPS.map((x, k) => ({ id: `l${k}`, nombre: x.n, x: 200 + k * 80, y: 340, ancho: 72, alto: 100, dibujo: <Vaso color={BANO(x.t)} etiqueta={`${x.t} °C`} /> })),
    { id: 'tubo', nombre: a.s === null ? 'Tubo con almidón' : `Tubo con almidón y amilasa (${minAhora} min)`, x: xTubo, y: a.lugar === null ? 335 : 318, ancho: 34, alto: 100, tomable: true, dibujo: <Tubo color="rgba(245,245,235,0.95)" etiqueta={a.s === null ? 'Almidón' : `${minAhora} min`} /> },
    { id: 'amilasa', nombre: 'Amilasa (saliva diluida)', x: 640, y: 312, ancho: 50, alto: 96, tomable: true, color: '#f4f0dc', dibujo: <Gotero color="#f4f0dc" etiqueta="AMILASA" /> },
    { id: 'placa', nombre: 'Placa de toque con lugol', x: 810, y: 345, ancho: 300, alto: 76, dibujo: <Placa gotas={a.gotas} /> },
    { id: 'reloj', nombre: 'Temporizador (toca: +1 min)', x: 740, y: 230, ancho: 72, alto: 72, alTocar: () => { setAlarma(false); setCuenta((c) => c + 60) }, dibujo: <Reloj s={cuenta} alarma={alarma} aviso="¡Gota!" /> },
    { id: 'caneca', nombre: 'Residuos (toca: empezar de nuevo)', x: 960, y: 250, ancho: 54, alto: 76, alTocar: () => { setA({ lugar: null, s: null, gotas: [] }); setRev(false); setResp(''); setCuenta(0); setAlarma(false) }, dibujo: <Caneca /> },
  ]
  const destinos = (de: string) => (de === 'tubo' ? (a.s === null ? TEMPS.map((_, k) => `l${k}`) : ['placa']) : ['tubo'])
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'tubo') {
      if (en.startsWith('l')) {
        if (a.s !== null) return 'La reacción ya empezó: el tubo se queda en su baño. Toma gotas para la placa.'
        const k = parseInt(en.slice(1), 10)
        return { anim: 'poner', hecho: () => setA({ ...a, lugar: k }) }
      }
      if (en === 'placa') {
        if (a.s === null) return 'Todavía no tiene amilasa: echa la enzima primero.'
        if (a.gotas.length >= 13) return 'La placa está llena.'
        const k = minAhora
        if (a.gotas.some((g) => g.min === k)) return `Ya tomaste la gota del minuto ${k}. Espera al siguiente minuto (usa el temporizador).`
        return { anim: 'gotas', gotas: 1, hecho: () => setA((x) => ({ ...x, gotas: [...x.gotas, { min: k, s: queda(k) }] })) }
      }
      return 'El tubo va a un baño (vaso) o, con la enzima, a la placa.'
    }
    if (de === 'amilasa') {
      if (a.lugar === null) return 'Primero pon el tubo en el baño de la temperatura que quieres probar.'
      if (a.s !== null) return 'Ya tiene amilasa.'
      return { anim: 'gotas', gotas: 3, hecho: () => setA({ ...a, s: 0, gotas: [] }) }
    }
    return 'No se puede.'
  }
  return (
    <div className="flex flex-col gap-3">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        Pon el tubo de almidón en el baño de la temperatura que quieras probar y échale la <b>amilasa</b> (la enzima de la saliva). Cada minuto (acelerado: 1 s = 6 s; el temporizador avisa) lleva una gota del tubo a la placa con lugol: mientras haya almidón se pone azul-negra; cuando la amilasa lo convirtió todo en azúcar, queda del color del lugol (amarillo-café).
      </p>
      <MesaViva desde={190} piezas={piezas} destinos={destinos} soltar={soltar} />
      {n >= 3 && a.s !== null && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <label className="font-semibold">¿A los cuántos minutos ya no quedaba almidón? <input value={resp} onChange={(e) => setResp(e.target.value.replace(/\D/g, ''))} placeholder="o «nunca»" className="w-24 rounded-lg border border-[var(--linea)] bg-white px-2 py-1" /></label>
          <button type="button" onClick={() => setRev(true)} className="min-h-9 rounded-full border border-[var(--acento)] px-3 text-xs font-semibold">Comprobar</button>
          <button type="button" onClick={() => setResp('nunca')} className="min-h-9 rounded-full border border-[var(--linea)] px-3 text-xs font-semibold">Nunca</button>
        </div>
      )}
      {rev && (
        <p className={`rounded-xl border-2 p-3 text-sm ${(fin === null || fin > MAXMIN ? resp === 'nunca' : Math.abs(num - fin) <= 1) ? 'border-[#2e7d5a] bg-[#eaf5ee]' : 'border-[#b5462c] bg-[#fbeee9]'}`}>
          {fin === null
            ? `A ${t} °C la amilasa se desnaturaliza: el almidón nunca desaparece.`
            : fin > MAXMIN
              ? `A ${t} °C la enzima trabaja tan lento que en ${MAXMIN} minutos no alcanza a digerirlo todo (tardaría unos ${fin}).`
              : `A ${t} °C el almidón desapareció a los ${fin} minutos.`}{' '}
          Compara: a 37 °C, la temperatura del cuerpo, es donde más rápido trabaja.
        </p>
      )}
    </div>
  )
}

export default function Enzimas({ grado }: { grado: number }) {
  const [modo, setModo] = useState<'catalasa' | 'amilasa'>('catalasa')
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {(['catalasa', 'amilasa'] as const).map((x) => (
          <button key={x} type="button" onClick={() => setModo(x)} className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${modo === x ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-[var(--tarjeta)]'}`}>
            {x === 'catalasa' ? '1. Catalasa y agua oxigenada' : '2. Amilasa y almidón'}
          </button>
        ))}
      </div>
      {modo === 'catalasa' ? <Catalasa grado={grado} /> : <Amilasa />}
      <p className="text-xs text-[var(--suave)]">⚠ El agua oxigenada irrita los ojos: gafas. El hígado crudo se maneja con guantes y se bota en bolsa cerrada. Si se usa saliva para la amilasa, cada quien usa la suya y en un vaso propio.</p>
    </div>
  )
}
