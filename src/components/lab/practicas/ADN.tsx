import { useState } from 'react'

// Laboratorio de Biología 9 (PLAN-LABORATORIOS.md): extracción de ADN de fresa.
// Pasos en el orden que el estudiante quiera; la cantidad y el aspecto del ADN dependen de lo que hizo.

interface E {
  machacado: boolean
  agua: boolean
  jabon: boolean
  sal: boolean
  jabonTarde: boolean // jabón o sal después de filtrar
  mezcla: null | 'suave' | 'fuerte'
  filtrado: boolean
  alcohol: null | { frio: boolean; suave: boolean }
  espera: boolean
  enrollado: boolean
}
const INICIO: E = { machacado: false, agua: false, jabon: false, sal: false, jabonTarde: false, mezcla: null, filtrado: false, alcohol: null, espera: false, enrollado: false }

interface Acc { t: string; por: string; hacer: (e: E) => E }

function acciones(e: E): Acc[] {
  const a: Acc[] = []
  if (!e.alcohol) {
    if (!e.filtrado && !e.machacado) a.push({ t: 'Machacar las fresas en una bolsa', por: 'Romper el tejido deja expuestas muchas más células.', hacer: (x) => ({ ...x, machacado: true }) })
    if (!e.agua) a.push({ t: 'Agregar agua', por: 'Es la base de la mezcla de extracción.', hacer: (x) => ({ ...x, agua: true }) })
    if (!e.jabon) a.push({ t: 'Agregar jabón lavaplatos', por: 'Las membranas son de lípidos: el jabón las disuelve, como a la grasa de los platos, y el ADN sale.', hacer: (x) => ({ ...x, jabon: true, jabonTarde: x.jabonTarde || x.filtrado }) })
    if (!e.sal) a.push({ t: 'Agregar una pizca de sal', por: 'La sal neutraliza las cargas del ADN y ayuda a que sus hebras se junten.', hacer: (x) => ({ ...x, sal: true, jabonTarde: x.jabonTarde || x.filtrado }) })
    if (!e.mezcla && e.agua) {
      a.push({ t: 'Mezclar suave, sin hacer espuma', por: 'Despacio, para no partir las hebras largas de ADN.', hacer: (x) => ({ ...x, mezcla: 'suave' }) })
      a.push({ t: 'Agitar fuerte', por: '', hacer: (x) => ({ ...x, mezcla: 'fuerte' }) })
    }
    if (!e.filtrado && e.agua) a.push({ t: 'Filtrar a un vaso con colador o filtro de café', por: 'Quita la pulpa y las semillas; pasa el líquido con el ADN.', hacer: (x) => ({ ...x, filtrado: true }) })
    if (e.agua) {
      a.push({ t: 'Echar alcohol muy frío por la pared del vaso', por: 'El ADN no se disuelve en alcohol: aparece donde se juntan las dos capas. El frío ayuda.', hacer: (x) => ({ ...x, alcohol: { frio: true, suave: true } }) })
      a.push({ t: 'Echar alcohol frío de golpe', por: '', hacer: (x) => ({ ...x, alcohol: { frio: true, suave: false } }) })
      a.push({ t: 'Echar alcohol a temperatura ambiente', por: '', hacer: (x) => ({ ...x, alcohol: { frio: false, suave: true } }) })
    }
  } else if (!e.espera) a.push({ t: 'Esperar 5 minutos sin mover el vaso', por: 'Las hebras de ADN suben y se juntan en la capa de alcohol.', hacer: (x) => ({ ...x, espera: true }) })
  else if (!e.enrollado) a.push({ t: 'Enrollar con un palillo', por: 'Las hebras se pegan al palillo como una mota blanca y babosa.', hacer: (x) => ({ ...x, enrollado: true }) })
  return a
}

function resultado(e: E) {
  let q = 1
  const l: string[] = []
  if (!e.machacado) { q *= 0.35; l.push('No machacaste las fresas: pocas células se rompieron.') }
  if (!e.jabon) { q *= 0.1; l.push('Sin jabón, las membranas no se rompen y el ADN se queda dentro de las células.') }
  else if (e.jabonTarde) { q *= 0.6; l.push('Pusiste el jabón o la sal después de filtrar: actuaron sobre menos células.') }
  if (!e.sal) { q *= 0.6; l.push('Sin sal, el ADN se junta menos y se ve menos.') }
  if (!e.mezcla) { q *= 0.7; l.push('No mezclaste: el jabón no llegó a todas las células.') }
  if (!e.filtrado) l.push('No filtraste: la pulpa queda en la mezcla y ensucia el ADN.')
  if (e.alcohol && !e.alcohol.frio) { q *= 0.55; l.push('El alcohol tibio precipita menos ADN: debe estar de la nevera o el congelador.') }
  if (e.alcohol && !e.alcohol.suave) { q *= 0.3; l.push('Al echar el alcohol de golpe se mezclaron las capas: el ADN casi no se separa.') }
  const corto = e.mezcla === 'fuerte'
  if (corto) l.push('Agitaste fuerte: el ADN se partió en pedacitos y no forma hebras largas.')
  if (!l.length) l.push('¡Extracción perfecta! Una mota blanca de hebras largas de ADN en la capa de alcohol.')
  return { q, corto, sucio: !e.filtrado, lineas: l }
}

export default function ADN({ grado }: { grado: number }) {
  const [e, setE] = useState<E>(INICIO)
  const [ultimo, setUltimo] = useState<Acc | null>(null)
  const lista = acciones(e)
  const r = resultado(e)
  const listo = e.espera
  const mezclado = e.alcohol && !e.alcohol.suave
  const hebras = listo ? Math.round(r.q * 14) : 0
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        <b>Objetivo:</b> sacar ADN de fresas con cosas de la cocina y verlo a simple vista. Las fresas son ideales: cada célula tiene 8 copias de sus cromosomas.
      </p>
      <div className="grid items-start gap-4 md:grid-cols-[280px_1fr]">
        <svg viewBox="0 0 260 300" className="w-full rounded-2xl border border-[var(--linea)] bg-[#f4f1ea]" role="img" aria-label="Vaso con el extracto de fresa">
          {!e.filtrado && !e.alcohol ? (
            <g>
              <path d="M60 40 L200 40 L210 260 Q130 280 50 260 Z" fill="rgba(255,255,255,0.5)" stroke="#999" strokeWidth="2" />
              {e.agua && <path d="M54 170 L206 170 L210 260 Q130 280 50 260 Z" fill={e.jabon ? 'rgba(230,90,120,0.55)' : 'rgba(230,90,120,0.4)'} />}
              {Array.from({ length: e.machacado ? 26 : 5 }, (_, k) => (
                e.machacado
                  ? <circle key={k} cx={70 + ((k * 37) % 120)} cy={200 + ((k * 23) % 50)} r={3 + (k % 3)} fill="#c8253f" />
                  : <path key={k} d={`M${80 + k * 22} 225 q12 -22 24 0 q-12 30 -24 0`} fill="#d62a46" stroke="#7a1022" />
              ))}
              {e.mezcla === 'fuerte' && Array.from({ length: 10 }, (_, k) => <circle key={k} cx={65 + k * 14} cy="166" r="6" fill="#fff" opacity="0.85" />)}
              <text x="130" y="30" textAnchor="middle" fontSize="12" fontWeight="700">Bolsa con fresas</text>
            </g>
          ) : (
            <g>
              <path d="M60 40 V270 H200 V40" fill="none" stroke="#3a3a3a" strokeWidth="3" />
              <rect x="62" y="180" width="136" height="88" fill={r.sucio ? 'rgba(200,60,90,0.75)' : 'rgba(230,90,120,0.6)'} />
              {r.sucio && Array.from({ length: 12 }, (_, k) => <circle key={k} cx={70 + ((k * 31) % 120)} cy={195 + ((k * 17) % 60)} r="3" fill="#a01a33" />)}
              {e.alcohol && (
                <rect x="62" y="110" width="136" height="70" fill={mezclado ? 'rgba(230,140,160,0.45)' : 'rgba(225,240,250,0.6)'} />
              )}
              {listo &&
                Array.from({ length: hebras }, (_, k) => {
                  const x = 80 + ((k * 29) % 100)
                  const largo = r.corto ? 8 : 26 + (k % 4) * 8
                  return <path key={k} d={`M${x} 178 q${k % 2 ? 6 : -6} ${-largo / 2} 0 ${-largo}`} stroke="#fdfdfd" strokeWidth={r.corto ? 3 : 2.5} fill="none" opacity="0.95" strokeLinecap="round" />
                })}
              {e.enrollado && hebras > 0 && (
                <g>
                  <line x1="130" y1="20" x2="130" y2="150" stroke="#c8a06a" strokeWidth="4" />
                  <ellipse cx="130" cy="145" rx={4 + hebras} ry={4 + hebras * 0.7} fill="#f6f6f2" stroke="#ddd" />
                </g>
              )}
              <text x="208" y="146" fontSize="10">{e.alcohol ? 'alcohol' : ''}</text>
              <text x="208" y="226" fontSize="10">extracto</text>
            </g>
          )}
        </svg>
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4">
            <div className="flex flex-wrap gap-2">
              {lista.map((a) => (
                <button key={a.t} type="button" onClick={() => { setE(a.hacer(e)); setUltimo(a) }} className="min-h-10 rounded-full border border-[var(--linea)] bg-white px-3 text-sm font-semibold hover:border-[var(--acento)]">{a.t}</button>
              ))}
              <button type="button" onClick={() => { setE(INICIO); setUltimo(null) }} className="min-h-10 rounded-full border border-[var(--linea)] px-3 text-sm font-semibold">Empezar de nuevo</button>
            </div>
            {ultimo && grado < 11 && ultimo.por && <p className="mt-3 text-sm"><b>¿Por qué?</b> {ultimo.por}</p>}
            {e.filtrado && !e.alcohol && <p className="mt-2 text-sm text-[var(--suave)]">Filtrado: el líquido rosado ya está en el vaso.</p>}
          </div>
          {e.enrollado && (
            <div className={`rounded-xl border-2 p-3 text-sm ${r.lineas[0].startsWith('¡') ? 'border-[#2e7d5a] bg-[#eaf5ee]' : 'border-[#b5462c] bg-[#fbeee9]'}`}>
              <p className="font-bold">Rendimiento: {r.q > 0.8 ? 'mucho ADN' : r.q > 0.4 ? 'algo de ADN' : r.q > 0.1 ? 'muy poco ADN' : 'casi nada'}</p>
              <ul className="mt-1 list-disc pl-5">{r.lineas.map((x) => <li key={x}>{x}</li>)}</ul>
              <p className="mt-2">Eso blanco no es una sola molécula: son miles de hebras de ADN enredadas. Para ver la doble hélice se necesitarían técnicas como la difracción de rayos X.{grado >= 9 ? ' Lo que sale también lleva algo de ARN y proteínas: en un laboratorio se purifica con enzimas.' : ''}</p>
            </div>
          )}
        </div>
      </div>
      <p className="text-xs text-[var(--suave)]">Versión casera: fresas, bolsa con cierre, jabón lavaplatos, sal, colador o filtro de café, vaso y alcohol antiséptico guardado en el congelador. ⚠ El alcohol es inflamable y no se bebe.</p>
    </div>
  )
}
