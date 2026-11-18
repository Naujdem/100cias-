import { useEffect, useState } from 'react'

// Laboratorio de Biología 2 (PLAN-LABORATORIOS.md): montaje húmedo de epidermis de cebolla.
// El estudiante hace los pasos en el orden que quiera; al observar, la imagen muestra sus errores:
// huellas (no limpió), células secas (sin agua), cubreobjetos flotando (mucha agua sin secar),
// muestra gruesa (no pasa la luz), pliegues (no la extendió) y burbujas (bajó mal el cubreobjetos).

interface E {
  limpio: boolean
  gotas: number
  muestra: null | 'delgada' | 'gruesa'
  extendida: boolean
  cubre: boolean
  angulo: number
  burbujas: number
  seco: boolean
  pasos: string[]
}
const INICIO: E = { limpio: false, gotas: 0, muestra: null, extendida: false, cubre: false, angulo: 45, burbujas: 0, seco: false, pasos: [] }

const burbujasPor = (a: number) => (a < 15 ? 6 : a < 25 ? 3 : a <= 65 ? 0 : a <= 80 ? 2 : 4)

interface Accion {
  t: string
  hacer: (e: E) => { e: E; msg: string; aviso?: boolean }
}

function acciones(e: E): Accion[] {
  const paso = (x: E, p: string): E => ({ ...x, pasos: [...x.pasos, p] })
  const a: Accion[] = []
  if (!e.cubre) {
    a.push({ t: 'Limpiar el portaobjetos', hacer: (x) => ({ e: paso({ ...x, limpio: true }, 'limpiar'), msg: 'Lo limpias con papel y lo tomas de los bordes, sin dejar huellas.' }) })
    a.push({ t: 'Poner una gota de agua', hacer: (x) => ({ e: paso({ ...x, gotas: x.gotas + 1 }, 'agua'), msg: x.gotas >= 1 ? `Ya van ${x.gotas + 1} gotas: con una basta.` : 'Pones una gota de agua en el centro.', aviso: x.gotas >= 1 }) })
    if (!e.muestra) {
      a.push({ t: 'Tomar la telita delgada de la cebolla (con pinza)', hacer: (x) => ({ e: paso({ ...x, muestra: 'delgada' }, 'muestra'), msg: 'Con la pinza desprendes la epidermis: una telita casi transparente de la cara interna.' }) })
      a.push({ t: 'Cortar un trocito de cebolla', hacer: (x) => ({ e: paso({ ...x, muestra: 'gruesa' }, 'muestra'), msg: 'Pones un trocito de cebolla: es grueso, la luz no lo atraviesa.', aviso: true }) })
    } else if (!e.extendida) {
      a.push({ t: 'Extender la muestra con la aguja', hacer: (x) => ({ e: paso({ ...x, extendida: true }, 'extender'), msg: x.gotas ? 'La extiendes sobre la gota, sin pliegues.' : 'La extiendes, pero sin agua se pega y se seca.', aviso: !x.gotas }) })
    }
    if (e.muestra) {
      a.push({
        t: `Bajar el cubreobjetos a ${e.angulo}°`,
        hacer: (x) => {
          const b = burbujasPor(x.angulo)
          return {
            e: paso({ ...x, cubre: true, burbujas: x.gotas ? b : 0 }, 'cubre'),
            msg: b === 0 ? 'Apoyas un borde en la gota y lo bajas despacio: el agua empuja el aire hacia afuera.' : x.angulo < 15 ? 'Lo dejas caer plano: queda aire atrapado.' : 'Muy parado: al soltarlo cae de golpe y atrapa aire.',
            aviso: b > 0,
          }
        },
      })
    }
  } else {
    a.push({ t: 'Secar el exceso con papel absorbente', hacer: (x) => ({ e: paso({ ...x, seco: true }, 'secar'), msg: 'Acercas el papel al borde: chupa el agua que sobra.' }) })
    a.push({ t: 'Agregar una gota por el borde', hacer: (x) => ({ e: paso({ ...x, gotas: x.gotas + 1, seco: false }, 'agua-borde'), msg: 'La gota entra sola por debajo del cubreobjetos (capilaridad).' }) })
  }
  return a
}

/** vista lateral y desde arriba del portaobjetos */
function Lamina({ e }: { e: E }) {
  const agua = Math.min(e.gotas, 4)
  return (
    <svg viewBox="0 0 400 220" className="w-full max-w-lg rounded-2xl border border-[var(--linea)] bg-[#f4f1ea]" role="img" aria-label="Portaobjetos">
      <text x="10" y="18" fontSize="11" fontWeight="700" fill="#555">DESDE ARRIBA</text>
      <rect x="40" y="28" width="320" height="100" rx="4" fill="#e8f3fb" stroke="#7a8794" strokeWidth="2" />
      {!e.limpio && (
        <g fill="#b9b2a5" opacity="0.6">
          <ellipse cx="90" cy="60" rx="14" ry="10" />
          <ellipse cx="300" cy="100" rx="12" ry="9" />
          <ellipse cx="250" cy="45" rx="10" ry="7" />
        </g>
      )}
      {agua > 0 && <ellipse cx="200" cy="78" rx={18 + agua * 10} ry={14 + agua * 7} fill="#a9d3f5" opacity="0.8" />}
      {e.muestra === 'delgada' && (
        <path d={e.extendida ? 'M175 62 h50 v32 h-50 z' : 'M180 66 q12 -10 22 4 q10 -12 18 2 l-4 22 q-14 6 -30 -2 z'} fill="#f4e6c4" opacity="0.85" stroke="#b07b2c" strokeWidth="1" />
      )}
      {e.muestra === 'gruesa' && <rect x="180" y="64" width="40" height="28" rx="6" fill="#efe0b0" stroke="#b07b2c" strokeWidth="2" />}
      {e.cubre && (
        <g>
          <rect x="160" y="40" width="80" height="76" fill="rgba(255,255,255,0.35)" stroke="#5a6a78" strokeWidth="1.5" />
          {Array.from({ length: e.burbujas }, (_, k) => (
            <circle key={k} cx={175 + ((k * 37) % 55)} cy={55 + ((k * 23) % 50)} r={4 + (k % 3) * 2} fill="none" stroke="#333" strokeWidth="1.5" />
          ))}
        </g>
      )}
      <text x="10" y="150" fontSize="11" fontWeight="700" fill="#555">DE LADO</text>
      <rect x="40" y="190" width="320" height="10" fill="#e8f3fb" stroke="#7a8794" strokeWidth="2" />
      {agua > 0 && <path d={`M${200 - 20 - agua * 10} 190 Q200 ${190 - (e.cubre ? 4 + (e.seco ? 0 : agua * 3) : 6 + agua * 4)} ${200 + 20 + agua * 10} 190 Z`} fill="#a9d3f5" />}
      {e.muestra && <rect x="180" y={e.muestra === 'gruesa' ? 176 : 187} width="40" height={e.muestra === 'gruesa' ? 14 : 3} fill="#efe0b0" stroke="#b07b2c" />}
      {e.cubre ? (
        <rect x="160" y={e.muestra === 'gruesa' ? 172 : 184 - (e.gotas > 1 && !e.seco ? (e.gotas - 1) * 3 : 0)} width="80" height="3" fill="#5a6a78" />
      ) : e.muestra ? (
        <g transform={`rotate(${-e.angulo} 160 186)`}>
          <rect x="160" y="184" width="80" height="3" fill="#5a6a78" />
        </g>
      ) : null}
      {!e.cubre && e.muestra && <text x="250" y="170" fontSize="11" fontWeight="700">{e.angulo}°</text>}
    </svg>
  )
}

/** lo que se ve al microscopio (10x) según cómo quedó el montaje */
function Observacion({ e }: { e: E }) {
  const sinAgua = e.gotas === 0
  const flota = e.gotas > 1 && !e.seco
  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[300px]" role="img" aria-label="Observación al microscopio">
      <defs>
        <pattern id="mt-cel" width="140" height="70" patternUnits="userSpaceOnUse" patternTransform="translate(150 150) scale(0.3) translate(-150 -150)">
          <rect width="140" height="70" fill="#fbf1d9" />
          <path d={sinAgua ? 'M0 0 Q35 10 70 0 T140 0 M0 35 Q35 45 70 35 T140 35 M0 0 V35 M70 35 V70 M140 0 V35' : 'M0 0 H140 M0 35 H140 M0 70 H140 M0 0 V35 M70 35 V70 M140 0 V35'} stroke="#b07b2c" strokeWidth="4" fill="none" />
          <ellipse cx="44" cy="17" rx="7" ry="6" fill="#8a5a1e" />
          <ellipse cx="112" cy="52" rx="7" ry="6" fill="#8a5a1e" />
        </pattern>
        <filter id="mt-blur"><feGaussianBlur stdDeviation={flota ? 2.5 : 0} /></filter>
        <clipPath id="mt-campo"><circle cx="150" cy="150" r="140" /></clipPath>
      </defs>
      <rect width="300" height="300" fill="#111" />
      <g clipPath="url(#mt-campo)">
        {e.muestra ? (
          <g filter="url(#mt-blur)">
            <rect width="300" height="300" fill="url(#mt-cel)" />
            {sinAgua && <rect width="300" height="300" fill="#7a5a2a" opacity="0.35" />}
            {e.muestra === 'delgada' && !e.extendida && (
              <g fill="#8a5a1e" opacity="0.45">
                <path d="M0 90 Q150 60 300 120 V160 Q150 100 0 130 Z" />
                <path d="M60 300 Q120 180 210 220 L240 300 Z" />
              </g>
            )}
            {e.muestra === 'gruesa' && <rect width="300" height="300" fill="#2a1a08" opacity="0.88" />}
          </g>
        ) : (
          <rect width="300" height="300" fill="#f6f6f0" />
        )}
        {!e.limpio && (
          <g fill="none" stroke="#6f6a60" strokeWidth="2" opacity="0.5">
            {[30, 40, 50, 60].map((r) => <ellipse key={r} cx="220" cy="90" rx={r} ry={r * 0.7} />)}
          </g>
        )}
        {e.cubre &&
          Array.from({ length: e.burbujas }, (_, k) => (
            <g key={k}>
              <circle cx={40 + ((k * 83) % 220)} cy={50 + ((k * 61) % 200)} r={16 + (k % 3) * 9} fill="#fafafa" stroke="#111" strokeWidth="5" />
            </g>
          ))}
      </g>
      <circle cx="150" cy="150" r="140" fill="none" stroke="#000" strokeWidth="4" />
    </svg>
  )
}

function diagnostico(e: E): { ok: boolean; lineas: string[] } {
  const l: string[] = []
  if (!e.muestra) return { ok: false, lineas: ['No hay muestra en la lámina.'] }
  if (!e.cubre) return { ok: false, lineas: ['Falta el cubreobjetos: sin él la muestra se seca y el objetivo se puede mojar.'] }
  if (!e.limpio) l.push('Se ven manchas: no limpiaste el portaobjetos (y las huellas de los dedos se ven al microscopio).')
  else if (e.pasos.indexOf('limpiar') > e.pasos.indexOf('agua') && e.pasos.includes('agua')) l.push('Limpiaste después de poner el agua: el portaobjetos se limpia primero.')
  if (e.gotas === 0) l.push('Sin agua, las células se secan y se arrugan, y quedó aire entre las capas.')
  if (e.gotas > 1 && !e.seco) l.push('Sobra agua: el cubreobjetos flota y la imagen se mueve. Seca el exceso con papel absorbente por el borde.')
  if (e.muestra === 'gruesa') l.push('La muestra es muy gruesa: la luz no la atraviesa. Se usa solo la telita (epidermis) de la cara interna.')
  if (e.muestra === 'delgada' && !e.extendida) l.push('La telita quedó doblada: las células se montan unas sobre otras. Extiéndela con la aguja antes de tapar.')
  if (e.burbujas > 0) l.push(`Hay ${e.burbujas} burbujas de aire (círculos de borde negro grueso). Baja el cubreobjetos inclinado (unos 45°), apoyando primero un borde en la gota.`)
  const ok = l.length === 0
  if (ok) l.push('¡Montaje perfecto! Células limpias, extendidas, sin burbujas y sin agua de más. Ahora se puede llevar a 40x.')
  return { ok, lineas: l }
}

export default function Montaje({ grado }: { grado: number }) {
  const [e, setE] = useState<E>(INICIO)
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)
  const [ver, setVer] = useState(false)
  const [pistas, setPistas] = useState(grado < 11)
  const lista = acciones(e)
  const hacer = (a: Accion) => {
    const r = a.hacer(e)
    setE(r.e)
    setMsg({ t: r.msg, aviso: r.aviso })
    setVer(false)
  }
  const angulo = (d: number) => setE((x) => (x.cubre ? x : { ...x, angulo: Math.max(0, Math.min(90, x.angulo + d)) }))
  useEffect(() => {
    const t = (ev: KeyboardEvent) => {
      const k = ev.key.toLowerCase()
      if (k === 'w') angulo(5)
      else if (k === 's') angulo(-5)
      else if (k === 'o') setVer(true)
      else if (/^[1-9]$/.test(k) && lista[+k - 1]) hacer(lista[+k - 1])
      else return
      ev.preventDefault()
    }
    document.addEventListener('keydown', t)
    return () => document.removeEventListener('keydown', t)
  })
  const d = diagnostico(e)
  const btn = 'min-h-10 rounded-full border border-[var(--linea)] bg-[var(--tarjeta)] px-4 text-sm font-semibold hover:border-[var(--acento)]'
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4">
        <b>Objetivo:</b> prepara una lámina de epidermis de cebolla para verla al microscopio: limpia, extendida y sin burbujas. Cuando creas que está lista, pulsa «Observar».
      </p>
      <div className="grid items-start gap-4 md:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-3">
          <Lamina e={e} />
          <div className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4">
            <div className="flex flex-wrap gap-2">
              {lista.map((a, k) => (
                <button key={a.t} type="button" onClick={() => hacer(a)} className={btn}>
                  <span className="mr-1 opacity-50">{k + 1}</span> {a.t}
                </button>
              ))}
            </div>
            {!e.cubre && e.muestra && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold">Inclinación del cubreobjetos (W/S):</span>
                <button type="button" className={btn} onClick={() => angulo(-5)}>−5°</button>
                <span className="w-10 text-center font-bold">{e.angulo}°</span>
                <button type="button" className={btn} onClick={() => angulo(5)}>+5°</button>
              </div>
            )}
            {msg && <p className={`mt-3 text-sm ${msg.aviso ? 'font-semibold text-[#b5462c]' : ''}`}>{msg.aviso ? '⚠ ' : '• '}{msg.t}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className={btn} onClick={() => { setE(INICIO); setMsg(null); setVer(false) }}>Empezar de nuevo</button>
              <button type="button" className={`${btn} !border-[var(--acento)] !bg-[var(--acento)] !text-white`} onClick={() => setVer(true)}>Observar (O)</button>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={pistas} onChange={(ev) => setPistas(ev.target.checked)} /> Pasos</label>
            </div>
          </div>
          {pistas && (
            <ol className="list-decimal space-y-1 rounded-2xl bg-[var(--tarjeta)] p-4 pl-8 text-sm">
              <li className={e.limpio ? 'text-[#2e7d5a]' : ''}>Limpia el portaobjetos y tómalo por los bordes.</li>
              <li className={e.gotas === 1 ? 'text-[#2e7d5a]' : ''}>Pon una gota de agua en el centro.</li>
              <li className={e.muestra === 'delgada' ? 'text-[#2e7d5a]' : ''}>Con la pinza, saca la telita delgada de la cara interna de una capa de cebolla.</li>
              <li className={e.extendida ? 'text-[#2e7d5a]' : ''}>Ponla sobre la gota y extiéndela con la aguja.</li>
              <li className={e.cubre && e.burbujas === 0 ? 'text-[#2e7d5a]' : ''}>Apoya un borde del cubreobjetos en la gota, inclinado unos 45°, y bájalo despacio.</li>
              <li className={e.seco ? 'text-[#2e7d5a]' : ''}>Si sobra agua, sécala por el borde con papel absorbente.</li>
            </ol>
          )}
        </div>
        <div className="flex flex-col items-center gap-2">
          {ver ? (
            <>
              <Observacion e={e} />
              <p className="text-sm font-semibold">Al microscopio, 100x</p>
              <div className={`w-full rounded-xl border-2 p-3 text-sm ${d.ok ? 'border-[#2e7d5a] bg-[#eaf5ee]' : 'border-[#b5462c] bg-[#fbeee9]'}`}>
                <ul className="list-disc pl-5">{d.lineas.map((l) => <li key={l}>{l}</li>)}</ul>
              </div>
            </>
          ) : (
            <p className="rounded-2xl border border-dashed border-[var(--linea)] p-6 text-center text-sm text-[var(--suave)]">Aquí verás tu lámina al microscopio cuando pulses «Observar».</p>
          )}
        </div>
      </div>
      <p className="text-sm text-[var(--suave)]">⚠ Los cubreobjetos son muy delgados y se rompen fácil: se toman de los bordes. El vidrio roto va a su caja.</p>
    </div>
  )
}
