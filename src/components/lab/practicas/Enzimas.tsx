import { useState } from 'react'

// Laboratorio de Biología 6 (PLAN-LABORATORIOS.md; amilasa del manual de Bioquímica): enzimas.
// A) Catalasa: papa o hígado + agua oxigenada; la espuma mide la actividad según temperatura y pH.
// B) Amilasa + almidón a distintas temperaturas: gotas con lugol cada minuto hasta que ya no haya almidón.

const TEMPS = [
  { t: 5, n: 'Nevera (5 °C)' },
  { t: 20, n: 'Ambiente (20 °C)' },
  { t: 37, n: 'Tibia (37 °C)' },
  { t: 60, n: 'Caliente (60 °C)' },
  { t: 100, n: 'Hervida (100 °C)' },
]
const PHS = [
  { p: 3, n: 'Con vinagre (pH 3)' },
  { p: 7, n: 'Neutra (pH 7)' },
  { p: 10, n: 'Con bicarbonato (pH 9–10)' },
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

function Catalasa({ grado }: { grado: number }) {
  const [m, setM] = useState(0)
  const [t, setT] = useState(20)
  const [p, setP] = useState(7)
  const [espuma, setEspuma] = useState<number | null>(null)
  const [ensayos, setEnsayos] = useState<Ensayo[]>([])
  const probar = () => {
    const mm = Math.round(MUESTRAS[m].k * porTemp(t) * porPh(p) * 60 * 10) / 10
    setEspuma(mm)
    setEnsayos((e) => [...e, { muestra: MUESTRAS[m].n, t, p, mm }])
  }
  const cambiar = (fn: () => void) => { fn(); setEspuma(null) }
  const btn = (on: boolean) => `min-h-9 rounded-full border px-3 text-xs font-semibold ${on ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-white'}`
  // gráfica: espuma vs temperatura (solo ensayos a pH 7 de la muestra elegida)
  const puntos = ensayos.filter((e) => e.p === 7 && e.muestra === MUESTRAS[m].n)
  const X = (x: number) => 30 + (x / 100) * 250
  const Y = (y: number) => 150 - y * 2.1
  return (
    <div className="grid items-start gap-4 md:grid-cols-[220px_1fr]">
      <svg viewBox="0 0 200 260" className="w-full max-w-[220px] rounded-2xl border border-[var(--linea)] bg-[#f4f1ea]" role="img" aria-label="Tubo con agua oxigenada">
        <path d="M75 30 V220 Q75 240 100 240 Q125 240 125 220 V30" fill="#fff" stroke="#3a3a3a" strokeWidth="3" />
        <rect x="77" y="180" width="46" height="40" fill="#e4f1fb" />
        <rect x="82" y="205" width="36" height="22" rx="6" fill={MUESTRAS[m].id === 'papa' ? '#efe0b0' : '#7a2a2a'} />
        {espuma !== null && (
          <g>
            <rect x="77" y={180 - espuma * 2.4} width="46" height={espuma * 2.4} fill="#fbfbfb" style={{ transition: 'all 1.2s' }} />
            {Array.from({ length: Math.round(espuma / 2) }, (_, k) => (
              <circle key={k} cx={82 + ((k * 13) % 36)} cy={178 - ((k * 17) % Math.max(4, espuma * 2.4))} r={2 + (k % 3)} fill="none" stroke="#b9c2ca" />
            ))}
            {espuma > 0 && <text x="135" y={182 - espuma * 2.4} fontSize="12" fontWeight="800">{f(espuma)} mm</text>}
          </g>
        )}
        {Array.from({ length: 8 }, (_, k) => <line key={k} x1="125" x2="118" y1={180 - k * 20} y2={180 - k * 20} stroke="#3a3a3a" />)}
        <text x="100" y="20" textAnchor="middle" fontSize="11" fontWeight="700">H₂O₂ 3 %</text>
      </svg>
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4 text-sm">
          <p>La <b>catalasa</b> descompone el agua oxigenada: 2 H₂O₂ → 2 H₂O + O₂. El oxígeno forma espuma; <b>más espuma en 1 minuto = enzima más activa</b>.</p>
          <p className="mt-2 font-semibold">Muestra</p>
          <div className="mt-1 flex flex-wrap gap-1">{MUESTRAS.map((x, k) => <button key={x.id} type="button" onClick={() => cambiar(() => setM(k))} className={btn(m === k)}>{x.n}</button>)}</div>
          <p className="mt-2 font-semibold">Temperatura a la que se dejó la muestra 10 min</p>
          <div className="mt-1 flex flex-wrap gap-1">{TEMPS.map((x) => <button key={x.t} type="button" onClick={() => cambiar(() => setT(x.t))} className={btn(t === x.t)}>{x.n}</button>)}</div>
          {grado >= 9 && (
            <>
              <p className="mt-2 font-semibold">pH (gotas sobre la muestra)</p>
              <div className="mt-1 flex flex-wrap gap-1">{PHS.map((x) => <button key={x.p} type="button" onClick={() => cambiar(() => setP(x.p))} className={btn(p === x.p)}>{x.n}</button>)}</div>
            </>
          )}
          <button type="button" onClick={probar} className="mt-3 min-h-10 rounded-full bg-[var(--acento)] px-5 font-semibold text-white">Agregar agua oxigenada y esperar 1 min</button>
        </div>
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

function Amilasa() {
  const [t, setT] = useState(37)
  const [min, setMin] = useState<Record<number, number>>({})
  const [resp, setResp] = useState('')
  const [rev, setRev] = useState(false)
  const n = min[t] ?? -1
  const queda = (k: number) => (TIEMPO[t] === Infinity ? 1 : Math.max(0, 1 - k / TIEMPO[t]))
  const fin = TIEMPO[t] === Infinity ? null : Math.ceil(TIEMPO[t])
  const btn = (on: boolean) => `min-h-9 rounded-full border px-3 text-xs font-semibold ${on ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-white'}`
  const num = parseInt(resp, 10)
  return (
    <div className="flex flex-col gap-3">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        En un tubo hay almidón con <b>amilasa</b> (la enzima de la saliva). Cada minuto se pone una gota de la mezcla en la placa con lugol: mientras haya almidón se pone azul-negro; cuando la amilasa lo convirtió todo en azúcar, la gota queda del color del lugol (amarillo-café).
      </p>
      <div className="flex flex-wrap gap-1">
        {TEMPS.map((x) => <button key={x.t} type="button" onClick={() => { setT(x.t); setRev(false); setResp('') }} className={btn(t === x.t)}>{x.n}{(min[x.t] ?? -1) >= 0 ? ' ·' : ''}</button>)}
      </div>
      <svg viewBox="0 0 640 120" className="w-full rounded-2xl border border-[var(--linea)] bg-white" role="img" aria-label="Placa de toque con gotas de lugol">
        <rect x="5" y="10" width="630" height="90" rx="12" fill="#f4f4f0" stroke="#ccc" />
        {Array.from({ length: MAXMIN + 1 }, (_, k) => (
          <g key={k}>
            <circle cx={30 + k * 48} cy="50" r="18" fill={k <= n ? colorLugol(queda(k)) : '#fff'} stroke="#bbb" style={{ transition: 'fill 0.6s' }} />
            <text x={30 + k * 48} y="88" textAnchor="middle" fontSize="11">{k} min</text>
          </g>
        ))}
      </svg>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" disabled={n >= MAXMIN} onClick={() => setMin((x) => ({ ...x, [t]: n + 1 }))} className="min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-white disabled:opacity-50">
          {n < 0 ? 'Mezclar y tomar la primera gota' : 'Esperar 1 min y tomar otra gota'}
        </button>
        <button type="button" onClick={() => setMin((x) => ({ ...x, [t]: -1 }))} className="min-h-10 rounded-full border border-[var(--linea)] px-4 text-sm font-semibold">Repetir</button>
      </div>
      {n >= 3 && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <label className="font-semibold">¿A los cuántos minutos ya no quedaba almidón? <input value={resp} onChange={(e) => setResp(e.target.value.replace(/\D/g, ''))} placeholder="o «nunca»" className="w-24 rounded-lg border border-[var(--linea)] bg-white px-2 py-1" /></label>
          <button type="button" onClick={() => setRev(true)} className="min-h-9 rounded-full border border-[var(--acento)] px-3 text-xs font-semibold">Comprobar</button>
          <button type="button" onClick={() => setResp('nunca')} className="min-h-9 rounded-full border border-[var(--linea)] px-3 text-xs font-semibold">Nunca</button>
        </div>
      )}
      {rev && (
        <p className={`rounded-xl border-2 p-3 text-sm ${(fin === null || fin > MAXMIN ? resp === 'nunca' : num === fin) ? 'border-[#2e7d5a] bg-[#eaf5ee]' : 'border-[#b5462c] bg-[#fbeee9]'}`}>
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
