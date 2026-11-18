import { useState } from 'react'

// Laboratorio de Biología 4 (PLAN-LABORATORIOS.md): ósmosis.
// A) Elodea al microscopio en distintos medios: plasmólisis y vuelta a la turgencia.
// B) Tiras de papa en agua con sal: masa antes y después, % de cambio, gráfica y punto isotónico.

const MEDIOS = [
  { c: 0, t: 'Agua destilada' },
  { c: 0.9, t: 'Sal 0,9 % (como el suero)' },
  { c: 3, t: 'Sal 3 % (como el mar)' },
  { c: 10, t: 'Sal 10 %' },
]

/** tamaño al que tiende el protoplasto en cada medio (1 = pegado a la pared) */
const meta = (c: number) => (c <= 0.9 ? 1 : Math.max(0.45, 1 - 0.065 * (c - 0.9)))

function Elodea() {
  const [c, setC] = useState(0)
  const [s, setS] = useState(1)
  const [min, setMin] = useState(0)
  const esperar = (m: number) => {
    setS((x) => x + (meta(c) - x) * Math.min(1, m / 6))
    setMin((x) => x + m)
  }
  const celdas = []
  for (let f = 0; f < 3; f++)
    for (let k = 0; k < 3; k++) {
      const x = 20 + k * 90 - (f % 2) * 30
      const y = 30 + f * 80
      const w = 84
      const h = 74
      const pw = w * s - 6
      const ph = h * (0.55 + 0.45 * s) - 6
      const px = x + (w - pw) / 2
      const py = y + (h - ph) / 2
      const n = 12
      celdas.push(
        <g key={`${f}-${k}`}>
          <rect x={x} y={y} width={w} height={h} fill="#eef6e4" stroke="#6e8f45" strokeWidth="4" />
          <rect x={px} y={py} width={pw} height={ph} rx={s < 0.98 ? 16 : 2} fill="#dcefc4" stroke="#7aa84a" strokeWidth="1" style={{ transition: 'all 0.8s' }} />
          {Array.from({ length: n }, (_, j) => {
            const t = j / n
            const per = 2 * (pw + ph)
            let d = t * per
            let cx = px, cy = py
            if (d < pw) cx = px + d
            else if ((d -= pw) < ph) { cx = px + pw; cy = py + d }
            else if ((d -= ph) < pw) { cx = px + pw - d; cy = py + ph }
            else { d -= pw; cy = py + ph - d }
            const ix = cx + (cx < px + pw / 2 ? 5 : -5)
            const iy = cy + (cy < py + ph / 2 ? 5 : -5)
            return <ellipse key={j} cx={ix} cy={iy} rx="4.5" ry="3" fill="#3f8f2f" style={{ transition: 'all 0.8s' }} />
          })}
        </g>,
      )
    }
  const estado = s > 0.97 ? 'turgentes: el protoplasto llena la célula y empuja la pared' : s > 0.8 ? 'empezando la plasmólisis: la membrana se despega de la pared' : 'plasmolizadas: el protoplasto se encogió y se separó de la pared'
  return (
    <div className="grid items-start gap-4 md:grid-cols-[300px_1fr]">
      <svg viewBox="0 0 300 300" className="w-full max-w-[300px]" role="img" aria-label="Células de elodea al microscopio">
        <clipPath id="os-campo"><circle cx="150" cy="150" r="140" /></clipPath>
        <rect width="300" height="300" fill="#111" />
        <g clipPath="url(#os-campo)">
          <rect width="300" height="300" fill={`rgba(220,235,250,${Math.min(0.6, c / 15)})`} />
          {celdas}
        </g>
        <circle cx="150" cy="150" r="140" fill="none" stroke="#000" strokeWidth="4" />
      </svg>
      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4">
        <p className="text-sm">Una hoja de elodea (planta acuática) montada en el medio que elijas. Cambia el medio por el borde del cubreobjetos y espera.</p>
        <div className="flex flex-wrap gap-2">
          {MEDIOS.map((m) => (
            <button key={m.c} type="button" onClick={() => { setC(m.c); setMin(0) }} className={`min-h-10 rounded-full border px-3 text-sm font-semibold ${c === m.c ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)]'}`}>{m.t}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => esperar(2)} className="min-h-10 rounded-full border border-[var(--linea)] px-3 text-sm font-semibold">Esperar 2 min</button>
          <button type="button" onClick={() => esperar(5)} className="min-h-10 rounded-full border border-[var(--linea)] px-3 text-sm font-semibold">Esperar 5 min</button>
        </div>
        <p className="text-sm"><b>{min} min en este medio.</b> Las células están {estado}.</p>
        <p className="text-sm text-[var(--suave)]">
          {c === 0 ? 'Agua destilada: medio hipotónico, el agua entra a la célula. La pared evita que la célula vegetal reviente.' : c <= 0.9 ? 'Para una célula vegetal, este medio todavía tiene menos sal que su interior: casi no cambia.' : 'Medio hipertónico: el agua sale de la vacuola por ósmosis y el protoplasto se encoge. ¿Qué pasa si vuelves al agua destilada?'}
        </p>
      </div>
    </div>
  )
}

// ---------- papa ----------

const CONC = [0, 1, 2, 5, 10]
/** cambio de masa (%) de una tira de papa en sal al c %, en 30 min; punto isotónico ≈ 0,9 % */
const cambio = (c: number) => (15 * (0.9 - c)) / (0.9 + c)
const RUIDO = [0.6, -0.4, 0.3, -0.5, 0.4]
const MASA0 = [5.12, 4.98, 5.07, 5.21, 4.93]
const f = (x: number, d = 2) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })

function Papa({ grado }: { grado: number }) {
  const [esperado, setEsperado] = useState(false)
  const [pesadas, setPesadas] = useState<Set<number>>(new Set())
  const [resp, setResp] = useState('')
  const [rev, setRev] = useState(false)
  const final = CONC.map((c, k) => MASA0[k] * (1 + (cambio(c) + RUIDO[k]) / 100))
  const pct = CONC.map((_, k) => ((final[k] - MASA0[k]) / MASA0[k]) * 100)
  const todas = pesadas.size === CONC.length
  const ayudas = grado < 11
  const num = parseFloat(resp.replace(',', '.'))
  // gráfica
  const X = (c: number) => 40 + (c / 10) * 240
  const Y = (p: number) => 100 - p * 4.5
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        Cinco tiras de papa del mismo tamaño se pesan y se ponen en vasos con agua y distinta cantidad de sal. Después de 30 minutos se secan con papel y se vuelven a pesar. <b>¿En qué concentración la papa no gana ni pierde agua?</b>
      </p>
      <svg viewBox="0 0 600 170" className="w-full rounded-2xl border border-[var(--linea)] bg-[#f4f1ea]" role="img" aria-label="Vasos con tiras de papa">
        <rect x="0" y="150" width="600" height="20" fill="#b98d5e" />
        {CONC.map((c, k) => {
          const x = 60 + k * 120
          const largo = esperado ? 70 * (1 + pct[k] / 100 / 2) : 70
          const curva = esperado && pct[k] < -4 ? 10 : 0
          return (
            <g key={c}>
              <rect x={x - 38} y="72" width="76" height="76" fill={`rgba(169,211,245,${0.5 + c / 25})`} />
              <path d={`M${x - 42} 40 V148 H${x + 42} V40`} fill="none" stroke="#3a3a3a" strokeWidth="3" />
              <path d={`M${x - 4} ${146 - largo} q${curva} ${largo / 2} 0 ${largo}`} stroke="#e9d9a0" strokeWidth="10" fill="none" strokeLinecap="round" style={{ transition: 'all 1s' }} />
              <text x={x} y="30" textAnchor="middle" fontSize="14" fontWeight="800">{c} % sal</text>
            </g>
          )
        })}
      </svg>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={esperado} onClick={() => setEsperado(true)} className="min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-white disabled:opacity-50">Esperar 30 minutos</button>
        {esperado && !todas && <span className="self-center text-sm">Ahora pesa cada tira (toca «Pesar»).</span>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full max-w-2xl rounded-xl bg-[var(--tarjeta)] text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">Sal</th><th className="p-2">Masa inicial</th><th className="p-2">Masa final</th>{(ayudas || rev) && <th className="p-2">Cambio</th>}<th className="p-2">Al tacto</th>
            </tr>
          </thead>
          <tbody>
            {CONC.map((c, k) => (
              <tr key={c} className="border-b last:border-0">
                <td className="p-2 font-semibold">{c} %</td>
                <td className="p-2">{f(MASA0[k])} g</td>
                <td className="p-2">
                  {pesadas.has(k) ? `${f(final[k])} g` : (
                    <button type="button" disabled={!esperado} onClick={() => setPesadas((p) => new Set(p).add(k))} className="rounded-full border border-[var(--linea)] px-3 py-0.5 text-xs font-semibold disabled:opacity-40">Pesar</button>
                  )}
                </td>
                {(ayudas || rev) && <td className="p-2 font-bold">{pesadas.has(k) ? `${pct[k] >= 0 ? '+' : ''}${f(pct[k], 1)} %` : ''}</td>}
                <td className="p-2">{pesadas.has(k) ? (pct[k] > 3 ? 'dura, crujiente' : pct[k] < -3 ? 'blanda, se dobla' : 'casi igual') : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {ayudas && <p className="mt-1 text-xs text-[var(--suave)]">Cambio (%) = (masa final − masa inicial) ÷ masa inicial × 100</p>}
      </div>
      {todas && (
        <div className="grid items-start gap-4 md:grid-cols-[320px_1fr]">
          <svg viewBox="0 0 300 200" className="w-full rounded-xl bg-white" role="img" aria-label="Gráfica de cambio de masa">
            <line x1="40" y1={Y(0)} x2="285" y2={Y(0)} stroke="#333" />
            <line x1="40" y1="20" x2="40" y2="180" stroke="#333" />
            {[-15, -10, -5, 5, 10, 15].map((p) => <text key={p} x="34" y={Y(p) + 4} textAnchor="end" fontSize="9">{p}</text>)}
            {CONC.map((c) => <text key={c} x={X(c)} y="195" textAnchor="middle" fontSize="9">{c}</text>)}
            <text x="285" y={Y(0) - 4} textAnchor="end" fontSize="9">% sal</text>
            <text x="44" y="16" fontSize="9">% cambio de masa</text>
            {(ayudas || rev) && <polyline points={CONC.map((c, k) => `${X(c)},${Y(pct[k])}`).join(' ')} fill="none" stroke="var(--acento)" strokeWidth="2" />}
            {CONC.map((c, k) => <circle key={c} cx={X(c)} cy={Y(pct[k])} r="4" fill="var(--acento)" />)}
            {rev && <line x1={X(0.9)} x2={X(0.9)} y1="20" y2="180" stroke="#2e7d5a" strokeDasharray="4 3" />}
          </svg>
          <div className="flex flex-col gap-2 text-sm">
            <label className="font-semibold">
              ¿En qué % de sal la papa no cambiaría su masa? (lee dónde la línea cruza el 0)
              <span className="mt-1 flex items-center gap-1"><input value={resp} onChange={(e) => setResp(e.target.value)} className="w-20 rounded-lg border border-[var(--linea)] bg-white px-2 py-1 text-right" /> %</span>
            </label>
            <button type="button" onClick={() => setRev(true)} className="w-fit min-h-10 rounded-full bg-[var(--acento)] px-5 font-semibold text-white">Comprobar</button>
            {rev && (
              <div className={`rounded-xl border-2 p-3 ${Math.abs(num - 0.9) <= 0.5 ? 'border-[#2e7d5a] bg-[#eaf5ee]' : 'border-[#b5462c] bg-[#fbeee9]'}`}>
                <p><b>{Math.abs(num - 0.9) <= 0.5 ? '¡Bien leído!' : 'No exactamente.'}</b> La línea cruza el cero cerca de 0,9 % de sal: ahí el medio es <b>isotónico</b> con las células de la papa.</p>
                <p className="mt-1">Por debajo (hipotónico) el agua entra y la papa gana masa y se pone dura; por encima (hipertónico) el agua sale, pierde masa y se ablanda.{grado >= 9 ? ' Por eso el suero que va a la sangre tiene 0,9 % de sal: no hincha ni encoge los glóbulos rojos.' : ''}</p>
              </div>
            )}
          </div>
        </div>
      )}
      <p className="text-xs text-[var(--suave)]">Versión casera: tiras de papa, vasos, sal de cocina y balanza de cocina; también se puede medir el largo con una regla.</p>
    </div>
  )
}

export default function Osmosis({ grado }: { grado: number }) {
  const [modo, setModo] = useState<'elodea' | 'papa'>('elodea')
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {(['elodea', 'papa'] as const).map((m) => (
          <button key={m} type="button" onClick={() => setModo(m)} className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${modo === m ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-[var(--tarjeta)]'}`}>
            {m === 'elodea' ? '1. Plasmólisis en elodea' : '2. Papa en agua con sal'}
          </button>
        ))}
      </div>
      {modo === 'elodea' ? <Elodea /> : <Papa grado={grado} />}
    </div>
  )
}
