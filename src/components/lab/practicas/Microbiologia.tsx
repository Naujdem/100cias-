import { useMemo, useState } from 'react'

// Laboratorio de Biología 10 (PLAN-LABORATORIOS.md): microbiología.
// 1) ¿Dónde hay más microbios? Técnica aséptica, siembra de 6 cajas (con control), incubación por días y conteo.
// 2) ¿Qué los detiene? Discos sobre un césped de bacterias y medida del halo de inhibición.

const FUENTES = [
  { id: 'sucias', n: 'Manos sin lavar', b: 42, h: 2 },
  { id: 'limpias', n: 'Manos lavadas con jabón', b: 7, h: 0 },
  { id: 'celular', n: 'Pantalla del celular', b: 24, h: 1 },
  { id: 'moneda', n: 'Moneda', b: 11, h: 1 },
  { id: 'aire', n: 'Aire (caja abierta 10 min)', b: 5, h: 2 },
  { id: 'control', n: 'Control (sin abrir)', b: 0, h: 0 },
]

const ASEPSIA = [
  { id: 'mesa', t: 'Limpiar la mesa con alcohol' },
  { id: 'manos', t: 'Lavarse las manos (y guantes)' },
  { id: 'mechero', t: 'Trabajar cerca del mechero encendido' },
  { id: 'tapa', t: 'Abrir la tapa poco y sin hablar encima' },
  { id: 'hisopo', t: 'Usar un hisopo estéril para cada caja' },
  { id: 'sellar', t: 'Sellar con cinta y rotular la base' },
  { id: 'reves', t: 'Incubar boca abajo' },
] as const
type Paso = (typeof ASEPSIA)[number]['id']

/** generador pseudoaleatorio con semilla, para que cada caja salga igual cada vez */
function azar(semilla: number) {
  let s = semilla
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

interface Colonia { x: number; y: number; hongo: boolean; color: string; corrida: boolean }

function colonias(k: number, nb: number, nh: number, corridas: boolean): Colonia[] {
  const r = azar(k * 977 + 13)
  const out: Colonia[] = []
  const col = ['#f4ecd2', '#f2e2a0', '#fbfbf5', '#f0c86a', '#e9d8c0']
  for (let i = 0; i < nb + nh; i++) {
    const a = r() * Math.PI * 2
    const d = Math.sqrt(r()) * 40
    out.push({ x: 50 + Math.cos(a) * d, y: 50 + Math.sin(a) * d, hongo: i >= nb, color: col[Math.floor(r() * col.length)], corrida: corridas && r() < 0.3 })
  }
  return out
}

function Caja({ cols, dia, temp, onTocar, marcadas, tam = 150 }: { cols: Colonia[]; dia: number; temp: number; onTocar?: (i: number) => void; marcadas?: Set<number>; tam?: number }) {
  const v = temp >= 37 ? 1.5 : 1
  const rb = Math.max(0, Math.min(3.2, ((dia - 0.6) / 2.4) * 3.2 * v))
  const rh = Math.max(0, Math.min(9, ((dia - 1.8) / 2.5) * 9 * v))
  return (
    <svg viewBox="0 0 100 100" width={tam} height={tam} role="img" aria-label="Caja de Petri">
      <circle cx="50" cy="50" r="47" fill="#f3e3b3" stroke="#9aa" strokeWidth="2" />
      <circle cx="50" cy="50" r="44" fill="none" stroke="#fff" strokeOpacity="0.6" />
      {cols.map((c, i) => {
        const r = c.hongo ? rh : rb * (0.7 + (i % 3) * 0.2)
        if (r <= 0.2) return null
        return (
          <g key={i} onClick={() => onTocar?.(i)} className={onTocar ? 'cursor-pointer' : ''}>
            {c.hongo ? (
              <g>
                <circle cx={c.x} cy={c.y} r={r} fill="#e9eee6" opacity="0.9" />
                <circle cx={c.x} cy={c.y} r={r * 0.45} fill="#5c7a4a" opacity="0.8" />
              </g>
            ) : c.corrida ? (
              <ellipse cx={c.x} cy={c.y + r} rx={r} ry={r * 2.4} fill={c.color} stroke="#c8b27a" strokeWidth="0.4" />
            ) : (
              <circle cx={c.x} cy={c.y} r={r} fill={c.color} stroke="#c8b27a" strokeWidth="0.4" />
            )}
            {marcadas?.has(i) && <circle cx={c.x} cy={c.y} r={Math.max(2, r * 0.5)} fill="#d0573a" />}
          </g>
        )
      })}
    </svg>
  )
}

function Donde({ grado }: { grado: number }) {
  const [hecho, setHecho] = useState<Set<Paso>>(new Set())
  const [sembrado, setSembrado] = useState(false)
  const [dia, setDia] = useState(0)
  const [temp, setTemp] = useState(25)
  const [contando, setContando] = useState<number | null>(null)
  const [marcadas, setMarcadas] = useState<Set<number>>(new Set())
  const [conteos, setConteos] = useState<Record<number, number>>({})
  const fallas = ASEPSIA.filter((p) => !hecho.has(p.id) && p.id !== 'reves' && p.id !== 'sellar').length
  const corridas = !hecho.has('reves')
  const cajas = useMemo(
    () => FUENTES.map((f, k) => colonias(k + 1, f.b + fallas * 2 + (f.id === 'control' ? fallas : 0), f.h + (fallas > 2 ? 1 : 0), corridas)),
    [fallas, corridas],
  )
  const real = (k: number) => cajas[k].filter((c) => !c.hongo).length
  const btn = 'min-h-10 rounded-full border border-[var(--linea)] bg-white px-3 text-sm font-semibold hover:border-[var(--acento)]'
  return (
    <div className="flex flex-col gap-4">
      {!sembrado ? (
        <div className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4">
          <p className="text-sm">Vas a sembrar 6 cajas de Petri con agar nutritivo. Primero, la <b>técnica aséptica</b>: marca lo que vas a hacer (lo que olvides contamina las cajas).</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {ASEPSIA.map((p) => (
              <button key={p.id} type="button" onClick={() => setHecho((h) => { const n = new Set(h); if (n.has(p.id)) n.delete(p.id); else n.add(p.id); return n })} className={`${btn} ${hecho.has(p.id) ? '!border-[#2e7d5a] !bg-[#eaf5ee]' : ''}`}>
                {hecho.has(p.id) ? '✔ ' : ''}{p.t}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm font-semibold">Temperatura de incubación</p>
          <div className="mt-1 flex gap-2">
            {[25, 37].map((t) => <button key={t} type="button" onClick={() => setTemp(t)} className={`${btn} ${temp === t ? '!border-[var(--acento)] !bg-[var(--acento)] !text-white' : ''}`}>{t === 25 ? 'Ambiente (25–30 °C)' : '37 °C'}</button>)}
          </div>
          {temp === 37 && <p className="mt-1 text-sm font-semibold text-[#b5462c]">⚠ A 37 °C (la temperatura del cuerpo) crecen más rápido los microbios que pueden enfermarnos: en el colegio se incuba a temperatura ambiente.</p>}
          <button type="button" onClick={() => setSembrado(true)} className="mt-4 min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-white">Sembrar las 6 cajas</button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">Día {dia}</span>
            <button type="button" disabled={dia >= 5} onClick={() => setDia((d) => d + 1)} className="min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-white disabled:opacity-50">Pasar un día</button>
            <button type="button" onClick={() => { setSembrado(false); setDia(0); setConteos({}); setContando(null) }} className={btn}>Volver a sembrar</button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {FUENTES.map((f, k) => (
              <div key={f.id} className="flex flex-col items-center rounded-xl bg-[var(--tarjeta)] p-2 text-center text-xs">
                <Caja cols={cajas[k]} dia={dia} temp={temp} />
                <b>{f.n}</b>
                {dia >= 2 && (
                  conteos[k] !== undefined
                    ? <span>Contaste {conteos[k]} · hay {real(k)} colonias de bacterias</span>
                    : <button type="button" onClick={() => { setContando(k); setMarcadas(new Set()) }} className="mt-1 rounded-full border border-[var(--linea)] px-3 py-0.5 font-semibold">Contar colonias</button>
                )}
              </div>
            ))}
          </div>
          {contando !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setContando(null)}>
              <div className="rounded-2xl bg-[var(--tarjeta)] p-4 text-center" onClick={(e) => e.stopPropagation()}>
                <p className="font-semibold">{FUENTES[contando].n}: toca cada colonia de bacterias (las redondas) para marcarla</p>
                <div className="mt-2 flex justify-center"><Caja cols={cajas[contando]} dia={dia} temp={temp} tam={360} marcadas={marcadas} onTocar={(i) => !cajas[contando][i].hongo && setMarcadas((m) => { const n = new Set(m); if (n.has(i)) n.delete(i); else n.add(i); return n })} /></div>
                <p className="mt-2 text-sm">Marcadas: <b>{marcadas.size}</b></p>
                <button type="button" onClick={() => { setConteos((c) => ({ ...c, [contando]: marcadas.size })); setContando(null) }} className="mt-2 min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-white">Anotar el conteo</button>
              </div>
            </div>
          )}
          {dia >= 3 && (
            <div className="rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
              {real(5) > 0 ? (
                <p className="font-semibold text-[#b5462c]">⚠ La caja de control tiene colonias: hubo contaminación por fallas en la técnica aséptica ({ASEPSIA.filter((p) => !hecho.has(p.id) && p.id !== 'reves' && p.id !== 'sellar').map((p) => p.t.toLowerCase()).join('; ')}). Así no se puede saber qué colonias venían de cada fuente.</p>
              ) : (
                <p><b>El control quedó limpio:</b> la técnica funcionó y lo que creció viene de cada fuente.</p>
              )}
              {corridas && <p className="mt-1">Incubaste boca arriba: gotas de agua cayeron de la tapa y algunas colonias se corrieron.</p>}
              <p className="mt-1">Las colonias redondas y brillantes son de <b>bacterias</b> (cada una salió de una sola célula); las algodonosas son de <b>hongos</b>. Las manos sin lavar tienen muchas más que las lavadas: por eso el jabón importa.{grado >= 9 ? ' Cada colonia es una UFC (unidad formadora de colonia): sirve para estimar cuántos microbios había.' : ''}</p>
            </div>
          )}
          <p className="text-xs text-[var(--suave)]">⚠ Las cajas incubadas no se abren: lo que crece puede incluir microbios dañinos. Al terminar, se desechan selladas después de tratarlas con cloro (o en autoclave).</p>
        </>
      )}
    </div>
  )
}

const DISCOS = [
  { n: 'Agua (control)', halo: 6 },
  { n: 'Jabón antibacterial', halo: 15 },
  { n: 'Ajo machacado', halo: 12 },
  { n: 'Alcohol', halo: 9 },
  { n: 'Enjuague bucal', halo: 13 },
  { n: 'Antibiótico (disco comercial)', halo: 24, avanzado: true },
]

function Detiene({ grado }: { grado: number }) {
  const lista = DISCOS.filter((d) => !d.avanzado || grado >= 11)
  const [dia, setDia] = useState(0)
  const [medidos, setMedidos] = useState(false)
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        Se extiende una capa pareja de bacterias sobre el agar (un «césped») y se ponen discos de papel de 6 mm empapados en distintas sustancias. Donde la sustancia frena a las bacterias queda un <b>halo</b> transparente: más grande el halo, más efectiva.
      </p>
      <div className="flex flex-wrap items-start gap-4">
        <svg viewBox="0 0 220 220" className="w-full max-w-[360px]" role="img" aria-label="Caja con discos y halos">
          <circle cx="110" cy="110" r="104" fill="#f3e3b3" stroke="#9aa" strokeWidth="3" />
          {dia > 0 && <circle cx="110" cy="110" r="100" fill={`rgba(236, 222, 170, ${Math.min(1, dia / 2)})`} />}
          {dia > 0 && Array.from({ length: 140 }, (_, k) => <circle key={k} cx={110 + Math.cos(k * 2.4) * Math.sqrt(k) * 8.3} cy={110 + Math.sin(k * 2.4) * Math.sqrt(k) * 8.3} r={Math.min(1.6, dia * 0.8)} fill="#e8cf8a" />)}
          {lista.map((d, k) => {
            const a = (k / lista.length) * Math.PI * 2 - Math.PI / 2
            const x = 110 + Math.cos(a) * 60
            const y = 110 + Math.sin(a) * 60
            return (
              <g key={d.n}>
                {dia > 0 && <circle cx={x} cy={y} r={(d.halo / 2) * 1.6 * Math.min(1, dia / 2)} fill="#f6f1df" />}
                <circle cx={x} cy={y} r="4.8" fill="#fff" stroke="#999" />
                <text x={x} y={y + 2} textAnchor="middle" fontSize="6" fontWeight="800">{k + 1}</text>
              </g>
            )
          })}
        </svg>
        <div className="flex min-w-60 flex-1 flex-col gap-2 text-sm">
          <div className="flex gap-2">
            <button type="button" disabled={dia >= 2} onClick={() => setDia((x) => x + 1)} className="min-h-10 rounded-full bg-[var(--acento)] px-5 font-semibold text-white disabled:opacity-50">Pasar un día ({dia})</button>
            <button type="button" disabled={dia < 2} onClick={() => setMedidos(true)} className="min-h-10 rounded-full border border-[var(--linea)] px-4 font-semibold">Medir halos con regla</button>
          </div>
          <ol className="list-decimal space-y-1 pl-5">
            {lista.map((d) => <li key={d.n}>{d.n}{medidos ? <b> — halo de {d.halo} mm{d.halo <= 6 ? ' (no hay halo)' : ''}</b> : ''}</li>)}
          </ol>
          {medidos && (
            <p className="rounded-xl bg-[#eaf5ee] p-3">
              El agua no frena nada: es el control. El alcohol se evapora rápido y deja un halo pequeño.{grado >= 11 ? ' El antibiótico deja el halo más grande: así se mide en los hospitales si una bacteria es sensible o resistente. Usar antibióticos sin necesidad selecciona bacterias resistentes.' : ' El jabón y el enjuague bucal sí frenan a las bacterias.'} Valores de ejemplo: en una práctica real cambian según la bacteria y la concentración.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Microbiologia({ grado }: { grado: number }) {
  const [modo, setModo] = useState<'donde' | 'detiene'>('donde')
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {(['donde', 'detiene'] as const).map((x) => (
          <button key={x} type="button" onClick={() => setModo(x)} className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${modo === x ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-[var(--tarjeta)]'}`}>
            {x === 'donde' ? '1. ¿Dónde hay más microbios?' : '2. ¿Qué los detiene?'}
          </button>
        ))}
      </div>
      {modo === 'donde' ? <Donde grado={grado} /> : <Detiene grado={grado} />}
    </div>
  )
}
