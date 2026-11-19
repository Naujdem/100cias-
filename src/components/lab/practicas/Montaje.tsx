import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import MicroscopioPanel from '../MicroscopioPanel.tsx'
import { desenfoque } from './Microscopio.tsx'
import type { Est } from './Microscopio.tsx'
import { Aguja, Caneca, Cebolla, Cubreobjetos, Gotero, MicroscopioMini, PapelAbsorbente, Pinza, Portaobjetos } from '../dibujos.tsx'

// Laboratorio de Biología 2 (PLAN-LABORATORIOS.md): montaje húmedo de epidermis de cebolla, en mesa viva.
// Cada paso lo hace el estudiante con los objetos: papel (limpiar / secar), gotero, pinza → cebolla → lámina,
// aguja (extender), cubreobjetos inclinado (W/S o rueda mientras se sostiene) y la lámina al MicroscopioPanel.
// Al enfocar con 10x se ven sus errores: huellas, células secas, cubreobjetos flotando, muestra gruesa,
// pliegues y burbujas.

interface E {
  limpio: boolean
  gotas: number
  muestra: null | 'delgada' | 'gruesa'
  extendida: boolean
  cubre: boolean
  angulo: number
  burbujas: number
  seco: boolean
}
const INICIO: E = { limpio: false, gotas: 0, muestra: null, extendida: false, cubre: false, angulo: 45, burbujas: 0, seco: false }

const burbujasPor = (a: number) => (a < 15 ? 6 : a < 25 ? 3 : a <= 65 ? 0 : a <= 80 ? 2 : 4)

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

/** lo que se ve al microscopio según cómo quedó el montaje (300 × 300, para el MicroscopioPanel) */
function muestraMontaje(e: E): { dibujo: ReactNode; velo?: { color: string; opacidad: number } } {
  const sinAgua = e.gotas === 0
  const flota = e.gotas > 1 && !e.seco
  const pared = '#b07b2c'
  const celulas = Array.from({ length: 7 }, (_, f) =>
    Array.from({ length: 5 }, (_, c) => {
      const x = c * 80 - (f % 2) * 40
      const y = f * 45
      return (
        <g key={`${f}-${c}`}>
          <path d={sinAgua ? `M${x} ${y} q20 8 40 0 t40 0 v45 q-20 -8 -40 0 t-40 0 z` : `M${x} ${y} h80 v45 h-80 z`} fill="#fbf1d9" stroke={pared} strokeWidth="2.5" />
          <ellipse cx={x + 26} cy={y + 22} rx="6" ry="5" fill="#c9a06a" />
        </g>
      )
    }),
  )
  const dibujo = (
    <g>
      <defs>
        <filter id="mt-flota"><feGaussianBlur stdDeviation={flota ? 2 : 0} /></filter>
      </defs>
      {e.muestra && (
        <g filter="url(#mt-flota)">
          {flota && <animateTransform attributeName="transform" type="translate" values="0 0;6 3;-4 5;0 0" dur="2.4s" repeatCount="indefinite" />}
          {celulas}
          {e.muestra === 'delgada' && !e.extendida && (
            <g fill="#8a5a1e" opacity="0.45">
              <path d="M0 90 Q150 60 300 120 V160 Q150 100 0 130 Z" />
              <path d="M60 300 Q120 180 210 220 L240 300 Z" />
            </g>
          )}
        </g>
      )}
      {!e.limpio && (
        <g fill="none" stroke="#6f6a60" strokeWidth="2" opacity="0.5">
          {[30, 40, 50, 60].map((r) => <ellipse key={r} cx="220" cy="90" rx={r} ry={r * 0.7} />)}
        </g>
      )}
      {e.cubre &&
        Array.from({ length: e.burbujas }, (_, k) => (
          <circle key={k} cx={40 + ((k * 83) % 220)} cy={50 + ((k * 61) % 200)} r={16 + (k % 3) * 9} fill="#fafafa" stroke="#111" strokeWidth="5" />
        ))}
    </g>
  )
  const velo = e.muestra === 'gruesa' ? { color: '#2a1a08', opacidad: 0.88 } : e.muestra && sinAgua ? { color: '#7a5a2a', opacidad: 0.35 } : undefined
  return { dibujo, velo }
}

function diagnostico(e: E): { ok: boolean; lineas: string[] } {
  const l: string[] = []
  if (!e.muestra) return { ok: false, lineas: ['No hay muestra en la lámina.'] }
  if (!e.cubre) return { ok: false, lineas: ['Falta el cubreobjetos: sin él la muestra se seca y el objetivo se puede mojar.'] }
  if (!e.limpio) l.push('Se ven manchas: no limpiaste el portaobjetos (y las huellas de los dedos se ven al microscopio).')
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
  const [pinzaCon, setPinzaCon] = useState(false)
  const [ver, setVer] = useState(false)
  const [mano, setMano] = useState<string | null>(null)
  const [pistas, setPistas] = useState(grado < 11)
  const [est, setEst] = useState<Est | null>(null)
  const cambiar = (p: Partial<E>) => { setVer(false); setE((x) => ({ ...x, ...p })) }
  const reiniciar = () => { setE(INICIO); setPinzaCon(false); setVer(false); setEst(null) }

  // inclinación del cubreobjetos mientras se sostiene: W/S o rueda del mouse
  const conCubre = mano === 'cubre' && !e.cubre
  const girar = useCallback((d: number) => setE((x) => (x.cubre ? x : { ...x, angulo: Math.max(0, Math.min(90, x.angulo + d)) })), [])
  const caja = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!conCubre) return
    const t = (ev: KeyboardEvent) => {
      const k = ev.key.toLowerCase()
      if (k !== 'w' && k !== 's') return
      ev.preventDefault()
      girar(k === 'w' ? 5 : -5)
    }
    const r = (ev: WheelEvent) => { ev.preventDefault(); girar(ev.deltaY < 0 ? 5 : -5) }
    const el = caja.current
    document.addEventListener('keydown', t)
    el?.addEventListener('wheel', r, { passive: false })
    return () => { document.removeEventListener('keydown', t); el?.removeEventListener('wheel', r) }
  }, [conCubre, girar])

  const piezas: Pieza[] = [
    { id: 'papel', nombre: 'Papel absorbente', x: 70, y: 345, ancho: 70, alto: 40, tomable: true, dibujo: <PapelAbsorbente /> },
    { id: 'agua', nombre: 'Gotero con agua', x: 150, y: 312, ancho: 50, alto: 96, tomable: true, color: '#a9d3f5', dibujo: <Gotero color="#a9d3f5" etiqueta="AGUA" /> },
    { id: 'cebolla', nombre: 'Cebolla', x: 235, y: 335, ancho: 70, alto: 50, tomable: true, dibujo: <Cebolla /> },
    { id: 'pinza', nombre: pinzaCon ? 'Pinza con la telita' : 'Pinza', x: 315, y: 330, ancho: 50, alto: 90, tomable: true, dibujo: <Pinza telita={pinzaCon} /> },
    { id: 'aguja', nombre: 'Aguja de disección', x: 390, y: 330, ancho: 50, alto: 90, tomable: true, dibujo: <Aguja /> },
    { id: 'cubre', nombre: `Cubreobjetos (${e.angulo}°)`, x: 470, y: 350, ancho: 60, alto: 30, tomable: true, dibujo: <Cubreobjetos angulo={e.cubre ? 0 : e.angulo} /> },
    { id: 'lamina', nombre: 'Portaobjetos', x: 600, y: 345, ancho: 130, alto: 30, tomable: true, dibujo: <Portaobjetos muestra={e.muestra ? (e.muestra === 'gruesa' ? '#efe0b0' : '#f4e6c4') : undefined} charco={e.gotas ? '#a9d3f5' : undefined} cubre={e.cubre} /> },
    { id: 'micro', nombre: 'Microscopio', x: 860, y: 290, ancho: 90, alto: 140, dibujo: <MicroscopioMini lamina={ver} /> },
    { id: 'caneca', nombre: 'Residuos', x: 955, y: 325, ancho: 54, alto: 76, dibujo: <Caneca /> },
  ]
  const destinos = (de: string) => (de === 'lamina' ? ['micro', 'caneca'] : de === 'pinza' && !pinzaCon ? ['cebolla', 'lamina'] : ['lamina'])
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'lamina') {
      if (en === 'micro') return e.muestra ? { anim: 'poner', hecho: () => setVer(true) } : 'La lámina está vacía: primero ponle la muestra.'
      if (en === 'caneca') return { anim: 'poner', hecho: reiniciar }
      return 'Lleva la lámina al microscopio para observarla, o a la caneca para empezar otra.'
    }
    if (de === 'pinza' && en === 'cebolla') {
      if (pinzaCon) return 'La pinza ya tiene la telita: llévala a la lámina.'
      return { anim: 'frotar', hecho: () => setPinzaCon(true) }
    }
    if (en !== 'lamina') return de === 'pinza' ? 'Con la pinza se desprende la telita de la cara interna de la cebolla.' : 'Eso se usa sobre el portaobjetos.'
    if (de === 'papel') {
      if (e.cubre) return e.seco ? 'Ya está seco.' : { anim: 'frotar', hecho: () => cambiar({ seco: true }) }
      if (e.gotas || e.muestra) return 'Con la gota o la muestra encima, el papel se lo llevaría todo. El portaobjetos se limpia primero; después del cubreobjetos el papel sirve para secar el borde.'
      if (e.limpio) return 'Ya está limpio.'
      return { anim: 'frotar', hecho: () => cambiar({ limpio: true }) }
    }
    if (de === 'agua') return { anim: 'gotas', gotas: 1, hecho: () => cambiar(e.cubre ? { gotas: e.gotas + 1, seco: false } : { gotas: e.gotas + 1 }) }
    if (e.cubre) return 'Ya tiene el cubreobjetos. Si algo quedó mal, bota la lámina en la caneca y empieza otra.'
    if (de === 'cebolla' || de === 'pinza') {
      if (e.muestra) return 'Ya tiene muestra.'
      if (de === 'pinza' && !pinzaCon) return 'La pinza está vacía: primero desprende la telita de la cebolla.'
      return { anim: 'poner', hecho: () => { if (de === 'pinza') setPinzaCon(false); cambiar({ muestra: de === 'pinza' ? 'delgada' : 'gruesa' }) } }
    }
    if (de === 'aguja') {
      if (!e.muestra) return 'Primero pon la muestra.'
      if (e.muestra === 'gruesa') return 'Un trozo grueso no se extiende: hace falta la telita delgada.'
      if (e.extendida) return 'Ya está extendida.'
      return { anim: 'frotar', hecho: () => cambiar({ extendida: true }) }
    }
    if (de === 'cubre') {
      if (!e.muestra) return 'Primero pon la muestra: el cubreobjetos va encima.'
      return { anim: 'poner', hecho: () => cambiar({ cubre: true, burbujas: e.gotas ? burbujasPor(e.angulo) : 0 }) }
    }
    return 'No se puede.'
  }

  const listo = ver && !!est && est.obj >= 1 && !est.rota && desenfoque(est) < 1.2
  const d = diagnostico(e)
  const vista = muestraMontaje(e)
  return (
    <div className="flex flex-col gap-3" ref={caja}>
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        <b>Objetivo:</b> prepara una lámina de epidermis de cebolla limpia, extendida y sin burbujas. Toma los objetos y suéltalos sobre el portaobjetos.
        El cubreobjetos se inclina mientras lo sostienes (<b>W/S</b> o la rueda del mouse). Cuando esté lista, lleva la lámina al microscopio y enfoca con <b>10x</b>.
      </p>
      <MesaViva desde={190} piezas={piezas} destinos={destinos} soltar={soltar} alTomar={setMano} />
      <div className="grid items-start gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-2">
          <Lamina e={e} />
          {!e.cubre && <p className={`text-sm ${conCubre ? 'font-semibold' : 'text-[var(--suave)]'}`}>Inclinación del cubreobjetos: <b>{e.angulo}°</b>{conCubre ? ' — W/S o rueda para cambiarla' : ''}</p>}
        </div>
        <div className="flex flex-col gap-2">
          {pistas && (
            <ol className="list-decimal space-y-1 rounded-2xl bg-[var(--tarjeta)] p-4 pl-8 text-sm">
              <li className={e.limpio ? 'text-[#2e7d5a]' : ''}>Limpia el portaobjetos con el papel.</li>
              <li className={e.gotas === 1 ? 'text-[#2e7d5a]' : ''}>Pon una gota de agua en el centro.</li>
              <li className={e.muestra === 'delgada' ? 'text-[#2e7d5a]' : ''}>Con la pinza, saca la telita de la cebolla y ponla sobre la gota.</li>
              <li className={e.extendida ? 'text-[#2e7d5a]' : ''}>Extiéndela con la aguja.</li>
              <li className={e.cubre && e.burbujas === 0 ? 'text-[#2e7d5a]' : ''}>Toma el cubreobjetos, inclínalo unos 45° y bájalo sobre la gota.</li>
              <li className={e.seco ? 'text-[#2e7d5a]' : ''}>Si sobra agua, sécala por el borde con el papel.</li>
            </ol>
          )}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={pistas} onChange={(ev) => setPistas(ev.target.checked)} /> Pasos</label>
            <button type="button" className="min-h-10 rounded-full border border-[var(--linea)] bg-[var(--tarjeta)] px-4 font-semibold hover:border-[var(--acento)]" onClick={reiniciar}>Empezar de nuevo</button>
          </div>
        </div>
      </div>
      {ver && <MicroscopioPanel grado={grado} muestra={vista.dibujo} velo={vista.velo} onEstado={setEst} />}
      {ver && !listo && <p className="text-sm font-semibold">Enfoca la lámina con el objetivo de 10x (100x) para revisarla.</p>}
      {listo && (
        <div className={`rounded-xl border-2 p-3 text-sm ${d.ok ? 'border-[#2e7d5a] bg-[#eaf5ee]' : 'border-[#b5462c] bg-[#fbeee9]'}`}>
          <ul className="list-disc pl-5">{d.lineas.map((l) => <li key={l}>{l}</li>)}</ul>
        </div>
      )}
      <p className="text-sm text-[var(--suave)]">⚠ Los cubreobjetos son muy delgados y se rompen fácil: se toman de los bordes. El vidrio roto va a su caja.</p>
    </div>
  )
}
