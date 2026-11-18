import { useState } from 'react'

// Laboratorio de Biología 8 (PLAN-LABORATORIOS.md): fermentación con levadura y globo.
// El estudiante arma 4 botellas (levadura, azúcar, temperatura del agua), deja pasar el tiempo, mide los
// globos y prueba el gas con agua de cal. Diseño de experimentos: una variable a la vez y un control.

interface Botella { levadura: boolean; azucar: 0 | 1 | 2; temp: 10 | 35 | 70 }
const T: Record<Botella['temp'], { n: string; k: number }> = { 10: { n: 'Fría', k: 0.25 }, 35: { n: 'Tibia', k: 1 }, 70: { n: 'Muy caliente', k: 0 } }
const AZ = [0.04, 0.6, 1]
const COLORES = ['#e0607e', '#5fa8d3', '#f2a03d', '#7cc36e']

const tasa = (b: Botella) => (b.levadura ? AZ[b.azucar] * T[b.temp].k : 0)
/** diámetro del globo (cm) a los «min» minutos */
const diam = (b: Botella, min: number) => {
  const r = tasa(b)
  const t = Math.max(0, min - 8) // la levadura tarda en arrancar
  return 4 + 14 * (1 - Math.exp((-r * t) / 45))
}
const f = (x: number, d = 1) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })

const INICIO: Botella[] = [
  { levadura: true, azucar: 2, temp: 35 },
  { levadura: true, azucar: 0, temp: 35 },
  { levadura: true, azucar: 2, temp: 10 },
  { levadura: false, azucar: 2, temp: 35 },
]

export default function Fermentacion({ grado }: { grado: number }) {
  const [bs, setBs] = useState<Botella[]>(INICIO)
  const [min, setMin] = useState(0)
  const [medidas, setMedidas] = useState<number[] | null>(null)
  const [cal, setCal] = useState<Set<number>>(new Set())
  const empezado = min > 0
  const cambiar = (k: number, p: Partial<Botella>) => setBs((x) => x.map((b, j) => (j === k ? { ...b, ...p } : b)))
  const btn = (on: boolean) => `rounded-full border px-2 py-0.5 text-xs font-semibold ${on ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-white'}`
  const control = bs.some((b) => !b.levadura)
  const max = medidas ? Math.max(...medidas) : 0
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        La levadura es un hongo que, sin oxígeno, se come el azúcar y produce <b>gas</b> y <b>alcohol</b>: la <b>fermentación</b>. Arma cuatro botellas, ponle un globo a cada una y mira cuál se infla más. Para que la comparación sirva, cambia <b>una sola cosa</b> a la vez y deja una botella de <b>control</b>.
      </p>
      <svg viewBox="0 0 640 260" className="w-full rounded-2xl border border-[var(--linea)] bg-[#f4f1ea]" role="img" aria-label="Cuatro botellas con globo">
        <rect x="0" y="240" width="640" height="20" fill="#b98d5e" />
        {bs.map((b, k) => {
          const x = 90 + k * 155
          const d = diam(b, min)
          const r = d * 2.6
          const espuma = tasa(b) > 0.1 && min > 8 ? Math.min(20, tasa(b) * (min - 8) * 0.5) : 0
          return (
            <g key={k}>
              <ellipse cx={x} cy={100 - r * 0.9} rx={r * 0.85} ry={r} fill={COLORES[k]} opacity="0.9" style={{ transition: 'all 1s' }} />
              <path d={`M${x - 8} 100 Q${x} ${100 - r * 0.2} ${x + 8} 100`} fill={COLORES[k]} />
              <path d={`M${x - 10} 100 V125 Q${x - 40} 140 ${x - 40} 170 V238 H${x + 40} V170 Q${x + 40} 140 ${x + 10} 125 V100`} fill="rgba(255,255,255,0.6)" stroke="#3a3a3a" strokeWidth="2.5" />
              <rect x={x - 38} y="185" width="76" height="52" fill={b.temp === 70 ? 'rgba(200,120,90,0.3)' : 'rgba(230,200,120,0.5)'} />
              {espuma > 0 && <rect x={x - 38} y={185 - espuma} width="76" height={espuma} fill="#fbf4e2" style={{ transition: 'all 1s' }} />}
              {b.levadura && Array.from({ length: 10 }, (_, j) => <circle key={j} cx={x - 30 + ((j * 13) % 60)} cy={228 - ((j * 7) % 14)} r="2" fill="#a07a3a" />)}
              <text x={x} y="255" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">Botella {k + 1}</text>
            </g>
          )
        })}
      </svg>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {bs.map((b, k) => (
          <div key={k} className="rounded-xl border-l-4 bg-[var(--tarjeta)] p-3 text-xs" style={{ borderColor: COLORES[k] }}>
            <p className="font-bold">Botella {k + 1}</p>
            <p className="mt-1">Levadura: <button type="button" disabled={empezado} onClick={() => cambiar(k, { levadura: true })} className={btn(b.levadura)}>sí</button> <button type="button" disabled={empezado} onClick={() => cambiar(k, { levadura: false })} className={btn(!b.levadura)}>no</button></p>
            <p className="mt-1">Azúcar: {([0, 1, 2] as const).map((a) => <button key={a} type="button" disabled={empezado} onClick={() => cambiar(k, { azucar: a })} className={`${btn(b.azucar === a)} mr-1`}>{a === 0 ? 'nada' : `${a} cda`}</button>)}</p>
            <p className="mt-1">Agua: {([10, 35, 70] as const).map((t) => <button key={t} type="button" disabled={empezado} onClick={() => cambiar(k, { temp: t })} className={`${btn(b.temp === t)} mr-1`}>{T[t].n}</button>)}</p>
          </div>
        ))}
      </div>
      {!control && !empezado && <p className="text-sm font-semibold text-[#b5462c]">⚠ No hay botella de control (sin levadura): ¿cómo sabrías que el gas lo hace la levadura?</p>}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold">{min} min</span>
        <button type="button" disabled={min >= 90} onClick={() => setMin((m) => m + 15)} className="min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-white disabled:opacity-50">Esperar 15 min</button>
        <button type="button" disabled={!empezado} onClick={() => setMedidas(bs.map((b) => Math.round(diam(b, min) * Math.PI * 10) / 10))} className="min-h-10 rounded-full border border-[var(--linea)] px-4 text-sm font-semibold">Medir el contorno de los globos</button>
        <button type="button" onClick={() => { setMin(0); setMedidas(null); setCal(new Set()) }} className="min-h-10 rounded-full border border-[var(--linea)] px-4 text-sm font-semibold">Armar de nuevo</button>
      </div>
      {medidas && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-[var(--tarjeta)] p-3">
            <p className="text-sm font-semibold">Contorno del globo a los {min} min (cm)</p>
            {medidas.map((m, k) => (
              <div key={k} className="mt-2 flex items-center gap-2 text-sm">
                <span className="w-16">Bot. {k + 1}</span>
                <div className="h-5 rounded" style={{ width: `${(m / Math.max(max, 1)) * 70}%`, background: COLORES[k] }} />
                <b>{f(m)}</b>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
            <p className="font-semibold">¿Qué gas es? Pásalo a un vaso con agua de cal:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {bs.map((b, k) => (
                <button key={k} type="button" onClick={() => setCal((c) => new Set(c).add(k))} className="flex flex-col items-center rounded-xl border border-[var(--linea)] bg-white p-2 text-xs font-semibold">
                  <svg viewBox="0 0 40 50" width="40" height="50"><path d="M5 5 V45 H35 V5" fill="none" stroke="#333" strokeWidth="2" /><rect x="6" y="15" width="28" height="29" fill={cal.has(k) && diam(b, min) > 6 ? '#e9e9e4' : '#eef7ff'} /></svg>
                  Bot. {k + 1}{cal.has(k) ? (diam(b, min) > 6 ? ': turbia' : ': clara') : ''}
                </button>
              ))}
            </div>
            {cal.size > 0 && <p className="mt-2">El agua de cal se pone <b>turbia (lechosa)</b> con dióxido de carbono (CO₂): el gas de la fermentación es CO₂.</p>}
          </div>
        </div>
      )}
      {medidas && min >= 45 && (
        <div className="rounded-xl bg-[#eaf5ee] p-3 text-sm">
          <p><b>Conclusiones:</b> sin levadura no hay gas (control). Sin azúcar casi no hay: es el alimento de la levadura. En agua fría trabaja lento, y en agua muy caliente se muere. Tibia, como la del cuerpo, es la mejor.</p>
          {grado >= 9 && <p className="mt-1">Ecuación: C₆H₁₂O₆ → 2 C₂H₅OH (alcohol) + 2 CO₂. Por eso el pan se esponja (el CO₂ queda atrapado en la masa) y la chicha y el guarapo tienen alcohol.</p>}
          {grado >= 11 && <p className="mt-1">Es respiración <b>anaerobia</b>: sin oxígeno, la levadura saca solo 2 ATP por glucosa, frente a unos 30 de la respiración aerobia.</p>}
        </div>
      )}
      <p className="text-xs text-[var(--suave)]">Versión casera: botellas plásticas, levadura de pan, azúcar o panela, agua y globos. El agua «muy caliente» la prepara un adulto.</p>
    </div>
  )
}
