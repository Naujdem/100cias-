import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

// Laboratorio de Biología 3 (PLAN-LABORATORIOS.md): tinciones.
// Simples: muestra (cebolla, mucosa bucal, papa) × colorante (lugol, azul de metileno), tiempo y lavado.
// Gram (11°): cristal violeta → lugol → alcohol → safranina, con Lactobacillus (del yogur, Gram +) y E. coli (Gram −).

type Muestra = 'cebolla' | 'mucosa' | 'papa'
type Col = 'ninguno' | 'lugol' | 'azul'

const MUESTRAS: Record<Muestra, string> = { cebolla: 'Epidermis de cebolla', mucosa: 'Mucosa de la mejilla', papa: 'Raspado de papa' }
const COLORANTES: Record<Col, string> = { ninguno: 'Sin colorante', lugol: 'Lugol (yodo)', azul: 'Azul de metileno' }
/** tiempo ideal de cada colorante, en segundos */
const IDEAL: Record<Col, number> = { ninguno: 0, lugol: 30, azul: 60 }

/** qué tan bien muestra cada colorante lo importante de cada muestra (0–1) */
const AFINIDAD: Record<Muestra, Record<Col, number>> = {
  cebolla: { ninguno: 0.12, lugol: 0.9, azul: 0.9 },
  mucosa: { ninguno: 0.05, lugol: 0.35, azul: 1 },
  papa: { ninguno: 0.15, lugol: 1, azul: 0.3 },
}

interface S {
  muestra: Muestra
  col: Col
  t: number
  lavado: boolean
}

function intensidad(s: S) {
  if (s.col === 'ninguno') return 0
  const x = s.t / IDEAL[s.col]
  return Math.min(1.6, x)
}

function tono(col: Col, a: number) {
  if (col === 'azul') return `rgba(40, 80, 190, ${a})`
  if (col === 'lugol') return `rgba(150, 95, 20, ${a})`
  return `rgba(120, 120, 120, ${a})`
}

function VistaSimple({ s }: { s: S }) {
  const i = intensidad(s)
  const af = AFINIDAD[s.muestra][s.col]
  const contraste = s.col === 'ninguno' ? AFINIDAD[s.muestra].ninguno : Math.min(1, 0.15 + i * af)
  const fondo = s.col !== 'ninguno' && !s.lavado ? Math.min(0.75, 0.15 + i * 0.35) : s.col !== 'ninguno' && i > 1.3 ? 0.3 : 0
  const pared = tono(s.col === 'ninguno' ? 'ninguno' : s.col, contraste)
  const nucleo = tono(s.col === 'ninguno' ? 'ninguno' : s.col, Math.min(1, contraste * 1.2))
  let dibujo: ReactNode
  if (s.muestra === 'cebolla') {
    dibujo = (
      <g>
        {Array.from({ length: 6 }, (_, f) =>
          Array.from({ length: 4 }, (_, c) => {
            const x = c * 90 - (f % 2) * 45
            const y = f * 50
            return (
              <g key={`${f}-${c}`}>
                <rect x={x} y={y} width="90" height="50" fill="none" stroke={pared} strokeWidth="3" />
                <ellipse cx={x + 30} cy={y + 24} rx="8" ry="7" fill={nucleo} />
              </g>
            )
          }),
        )}
      </g>
    )
  } else if (s.muestra === 'mucosa') {
    const cel = [[80, 90], [200, 70], [140, 190], [240, 200], [60, 220]]
    dibujo = (
      <g>
        {cel.map(([x, y], k) => (
          <g key={k} transform={`rotate(${k * 37} ${x} ${y})`}>
            <path d={`M${x - 42} ${y - 10} L${x - 20} ${y - 40} L${x + 30} ${y - 34} L${x + 46} ${y + 4} L${x + 20} ${y + 38} L${x - 30} ${y + 32} Z`} fill={tono(s.col, contraste * 0.15)} stroke={pared} strokeWidth="2" />
            <circle cx={x} cy={y} r="7" fill={nucleo} />
          </g>
        ))}
        {s.col === 'azul' && Array.from({ length: 14 }, (_, k) => <circle key={k} cx={(k * 53) % 290} cy={(k * 31) % 290} r="1.6" fill={nucleo} />)}
      </g>
    )
  } else {
    const granos = s.col === 'lugol' ? `rgba(30, 20, 70, ${Math.min(1, contraste)})` : pared
    dibujo = (
      <g>
        {[[70, 80], [200, 90], [120, 200], [240, 210]].map(([x, y], k) => (
          <g key={k}>
            <circle cx={x} cy={y} r="62" fill="none" stroke={tono(s.col, contraste * 0.4)} strokeWidth="2" />
            {Array.from({ length: 7 }, (_, g) => (
              <ellipse key={g} cx={x - 30 + ((g * 19) % 60)} cy={y - 28 + ((g * 23) % 56)} rx="11" ry="8" fill={granos} transform={`rotate(${g * 25} ${x - 30 + ((g * 19) % 60)} ${y - 28 + ((g * 23) % 56)})`} />
            ))}
          </g>
        ))}
      </g>
    )
  }
  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[300px]" role="img" aria-label="Muestra teñida al microscopio">
      <clipPath id="ti-campo"><circle cx="150" cy="150" r="140" /></clipPath>
      <rect width="300" height="300" fill="#111" />
      <g clipPath="url(#ti-campo)">
        <rect width="300" height="300" fill="#f7f6ef" />
        {dibujo}
        <rect width="300" height="300" fill={tono(s.col, 1)} opacity={fondo} />
      </g>
      <circle cx="150" cy="150" r="140" fill="none" stroke="#000" strokeWidth="4" />
    </svg>
  )
}

function revisarSimple(s: S): { ok: boolean; lineas: string[] } {
  const l: string[] = []
  const i = intensidad(s)
  const af = AFINIDAD[s.muestra][s.col]
  if (s.col === 'ninguno') return { ok: false, lineas: ['Sin colorante casi no se ve nada: las células son transparentes. Por eso se tiñen.'] }
  if (i < 0.6) l.push(`Muy pálido: deja actuar el colorante más tiempo (unos ${IDEAL[s.col]} s).`)
  if (i > 1.3) l.push('Lo dejaste demasiado tiempo: todo quedó oscuro y se pierden los detalles.')
  if (!s.lavado) l.push('No lavaste el exceso: el fondo quedó teñido. Pasa agua por un borde y absorbe por el otro.')
  if (af < 0.5) l.push(s.muestra === 'mucosa' ? 'El lugol tiñe poco las células de la mejilla: el azul de metileno resalta mejor sus núcleos.' : 'El azul de metileno no muestra el almidón de la papa: el lugol lo tiñe de azul oscuro casi negro.')
  const ok = l.length === 0
  if (ok)
    l.push(
      s.muestra === 'cebolla'
        ? `Se ven las paredes celulares y los núcleos (${s.col === 'lugol' ? 'café' : 'azules'}).`
        : s.muestra === 'mucosa'
          ? 'Se ven las células planas e irregulares de la mejilla con su núcleo azul (y puntitos: bacterias de la boca).'
          : 'Los granos de almidón (amiloplastos) se ven azul-negro: el lugol es la prueba del almidón.',
    )
  return { ok, lineas: l }
}

function Simples({ grado }: { grado: number }) {
  const [s, setS] = useState<S>({ muestra: 'cebolla', col: 'ninguno', t: 0, lavado: false })
  const [ver, setVer] = useState(false)
  const r = revisarSimple(s)
  const btn = 'min-h-10 rounded-full border px-3 text-sm font-semibold'
  const on = (b: boolean) => (b ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-[var(--tarjeta)]')
  const cambiar = (p: Partial<S>) => { setS((x) => ({ ...x, ...p })); setVer(false) }
  return (
    <div className="grid items-start gap-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4">
        <div>
          <p className="text-sm font-semibold">1. Muestra (ya montada con agua y cubreobjetos)</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {(Object.keys(MUESTRAS) as Muestra[]).map((m) => <button key={m} type="button" onClick={() => cambiar({ muestra: m, col: 'ninguno', t: 0, lavado: false })} className={`${btn} ${on(s.muestra === m)}`}>{MUESTRAS[m]}</button>)}
          </div>
          {s.muestra === 'mucosa' && <p className="mt-1 text-xs text-[var(--suave)]">Se raspa suavemente el interior de la mejilla con un palillo limpio, que luego se bota.</p>}
        </div>
        <div>
          <p className="text-sm font-semibold">2. Colorante: una gota por un borde del cubreobjetos y papel absorbente por el otro</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {(['lugol', 'azul'] as Col[]).map((c) => <button key={c} type="button" onClick={() => cambiar({ col: c, t: 0, lavado: false })} className={`${btn} ${on(s.col === c)}`}>{COLORANTES[c]}</button>)}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">3. Dejar actuar: {s.t} s</p>
          <div className="mt-1 flex gap-2">
            <button type="button" disabled={s.col === 'ninguno' || s.lavado} onClick={() => cambiar({ t: s.t + 15 })} className={`${btn} ${on(false)}`}>Esperar 15 s</button>
            <button type="button" disabled={s.col === 'ninguno' || s.lavado} onClick={() => cambiar({ t: s.t + 60 })} className={`${btn} ${on(false)}`}>Esperar 1 min</button>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">4. Lavar el exceso</p>
          <button type="button" disabled={s.col === 'ninguno' || s.lavado} onClick={() => cambiar({ lavado: true })} className={`${btn} ${on(s.lavado)} mt-1`}>{s.lavado ? 'Lavado ✔' : 'Pasar agua y absorber'}</button>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setVer(true)} className={`${btn} border-[var(--acento)] bg-[var(--acento)] text-white`}>Observar</button>
          <button type="button" onClick={() => cambiar({ col: 'ninguno', t: 0, lavado: false })} className={`${btn} ${on(false)}`}>Nueva lámina</button>
        </div>
        {grado < 11 && <p className="text-xs text-[var(--suave)]">Pista: el lugol actúa en unos 30 s y el azul de metileno en cerca de 1 minuto.</p>}
      </div>
      <div className="flex flex-col items-center gap-2">
        <VistaSimple s={ver ? s : { ...s, col: 'ninguno', t: 0 }} />
        <p className="text-sm font-semibold">{ver ? `${MUESTRAS[s.muestra]} · ${COLORANTES[s.col]} · 400x` : 'Sin teñir · 400x'}</p>
        {ver && (
          <div className={`w-full rounded-xl border-2 p-3 text-sm ${r.ok ? 'border-[#2e7d5a] bg-[#eaf5ee]' : 'border-[#b5462c] bg-[#fbeee9]'}`}>
            <ul className="list-disc pl-5">{r.lineas.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------- Gram ----------

type Paso = { p: 'cv' | 'lugol' | 'alcohol' | 'safranina' | 'lavar'; s: number }
const NOMBRE: Record<Paso['p'], string> = { cv: 'Cristal violeta', lugol: 'Lugol', alcohol: 'Alcohol', safranina: 'Safranina', lavar: 'Lavar con agua' }

interface Bact { cv: boolean; complejo: boolean; safra: boolean }

function aplicar(pasos: Paso[], gramPos: boolean): Bact {
  let b: Bact = { cv: false, complejo: false, safra: false }
  for (const { p, s } of pasos) {
    if (p === 'cv') b = { ...b, cv: true }
    if (p === 'lugol' && b.cv) b = { ...b, complejo: true }
    if (p === 'alcohol') {
      const pierde = gramPos ? (!b.complejo && s >= 5) || s > 30 : s >= 5
      if (pierde) b = { ...b, cv: false, complejo: false }
    }
    if (p === 'safranina') b = { ...b, safra: true }
  }
  return b
}
const colorDe = (b: Bact) => (b.cv ? '#5b2a8c' : b.safra ? '#e0607e' : 'rgba(150,150,150,0.25)')
const nombreColor = (b: Bact) => (b.cv ? 'moradas' : b.safra ? 'rosadas' : 'casi invisibles')

function Gram() {
  const [pasos, setPasos] = useState<Paso[]>([])
  const [ver, setVer] = useState(false)
  const agregar = (p: Paso['p']) => {
    setVer(false)
    setPasos((x) => {
      const u = x[x.length - 1]
      if (p === 'alcohol' && u?.p === 'alcohol') return [...x.slice(0, -1), { p, s: u.s + 5 }]
      return [...x, { p, s: p === 'alcohol' ? 5 : 60 }]
    })
  }
  useEffect(() => {
    const t = (ev: KeyboardEvent) => {
      const m: Record<string, Paso['p']> = { '1': 'cv', '2': 'lugol', '3': 'alcohol', '4': 'safranina', '5': 'lavar' }
      if (m[ev.key]) agregar(m[ev.key])
      else if (ev.key.toLowerCase() === 'o') setVer(true)
    }
    document.addEventListener('keydown', t)
    return () => document.removeEventListener('keydown', t)
  }, [])
  const pos = aplicar(pasos, true)
  const neg = aplicar(pasos, false)
  const lineas: string[] = []
  const tipos = pasos.filter((p) => p.p !== 'lavar').map((p) => p.p)
  const orden = ['cv', 'lugol', 'alcohol', 'safranina']
  if (JSON.stringify(tipos) !== JSON.stringify(orden)) lineas.push('El orden correcto es: cristal violeta → lugol → alcohol → safranina, lavando con agua entre cada paso.')
  const sinLavar = pasos.some((p, k) => p.p !== 'lavar' && k < pasos.length - 1 && pasos[k + 1].p !== 'lavar')
  if (sinLavar) lineas.push('Faltó lavar entre algunos pasos: los colorantes se mezclan.')
  const alc = pasos.find((p) => p.p === 'alcohol')
  if (alc && alc.s > 30) lineas.push(`Decoloraste ${alc.s} s: demasiado. Hasta las Gram + perdieron el violeta (falso Gram −).`)
  if (alc && alc.s < 5) lineas.push('Casi no decoloraste.')
  if (!alc && pasos.length) lineas.push('Sin alcohol, todas quedan moradas: no se distingue nada (falso Gram +).')
  if (!pasos.some((p) => p.p === 'lugol') && pasos.length) lineas.push('Sin lugol, el cristal violeta no se fija y las Gram + también se decoloran.')
  const ok = pos.cv && !neg.cv && neg.safra && !lineas.length
  if (ok) lineas.push('¡Tinción correcta! Lactobacillus (Gram +) morados: su pared gruesa de peptidoglicano retiene el violeta. E. coli (Gram −) rosados: su pared delgada lo pierde con el alcohol y toma la safranina.')

  return (
    <div className="grid items-start gap-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4">
        <p className="text-sm">
          <b>Muestra:</b> frotis ya fijado con calor de <i>Lactobacillus</i> (del yogur) y <i>Escherichia coli</i>. Agrega los reactivos en orden; cada clic en alcohol son 5 s más.
        </p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(NOMBRE) as Paso['p'][]).map((p, k) => (
            <button key={p} type="button" onClick={() => agregar(p)} className="min-h-10 rounded-full border border-[var(--linea)] bg-white px-3 text-sm font-semibold hover:border-[var(--acento)]">
              <span className="mr-1 opacity-50">{k + 1}</span> {NOMBRE[p]}
            </button>
          ))}
        </div>
        <ol className="flex flex-wrap gap-1 text-xs">
          {pasos.map((p, k) => (
            <li key={k} className="rounded-full bg-[var(--fondo)] px-2 py-1">{NOMBRE[p.p]}{p.p === 'alcohol' ? ` ${p.s} s` : ''}</li>
          ))}
        </ol>
        <div className="flex gap-2">
          <button type="button" onClick={() => setVer(true)} className="min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-white">Observar a 1000x (O)</button>
          <button type="button" onClick={() => { setPasos([]); setVer(false) }} className="min-h-10 rounded-full border border-[var(--linea)] px-4 text-sm font-semibold">Nuevo frotis</button>
        </div>
        <p className="text-xs text-[var(--suave)]">⚠ El cristal violeta y la safranina manchan la piel y la ropa; el alcohol es inflamable: lejos del mechero.</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <svg viewBox="0 0 300 300" className="w-full max-w-[300px]" role="img" aria-label="Frotis al microscopio">
          <clipPath id="gr-campo"><circle cx="150" cy="150" r="140" /></clipPath>
          <rect width="300" height="300" fill="#111" />
          <g clipPath="url(#gr-campo)">
            <rect width="300" height="300" fill="#f7f6ef" />
            {Array.from({ length: 9 }, (_, k) => {
              const x = 30 + ((k * 71) % 230)
              const y = 30 + ((k * 47) % 230)
              return (
                <g key={`p${k}`} transform={`rotate(${k * 40} ${x} ${y})`}>
                  {[0, 1, 2].map((j) => <rect key={j} x={x + j * 24} y={y} width="22" height="7" rx="3.5" fill={ver ? colorDe(pos) : 'rgba(150,150,150,0.25)'} />)}
                </g>
              )
            })}
            {Array.from({ length: 16 }, (_, k) => {
              const x = 20 + ((k * 89) % 260)
              const y = 15 + ((k * 59) % 270)
              return <rect key={`n${k}`} x={x} y={y} width="13" height="6" rx="3" transform={`rotate(${k * 67} ${x} ${y})`} fill={ver ? colorDe(neg) : 'rgba(150,150,150,0.25)'} />
            })}
          </g>
          <circle cx="150" cy="150" r="140" fill="none" stroke="#000" strokeWidth="4" />
        </svg>
        {ver && (
          <>
            <p className="text-sm">Lactobacillus (cadenas largas): <b>{nombreColor(pos)}</b> · E. coli (bastoncitos cortos): <b>{nombreColor(neg)}</b></p>
            <div className={`w-full rounded-xl border-2 p-3 text-sm ${ok ? 'border-[#2e7d5a] bg-[#eaf5ee]' : 'border-[#b5462c] bg-[#fbeee9]'}`}>
              <ul className="list-disc pl-5">{lineas.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function Tinciones({ grado }: { grado: number }) {
  const [modo, setModo] = useState<'simple' | 'gram'>('simple')
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {(['simple', 'gram'] as const).map((m) => (
          <button key={m} type="button" onClick={() => setModo(m)} className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${modo === m ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-[var(--tarjeta)]'}`}>
            {m === 'simple' ? 'Tinciones simples' : 'Tinción de Gram (11°)'}
          </button>
        ))}
      </div>
      {modo === 'simple' ? <Simples grado={grado} /> : grado >= 11 ? <Gram /> : <p className="rounded-2xl bg-[var(--tarjeta)] p-4">La tinción de Gram es para 11°. Cambia el grado arriba para verla.</p>}
      <p className="text-sm text-[var(--suave)]">⚠ El lugol y el azul de metileno manchan: guantes y bata. Los restos van al frasco de residuos.</p>
    </div>
  )
}
