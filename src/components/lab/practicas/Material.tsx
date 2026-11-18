import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

// Fase 0.3 de PLAN-LABORATORIOS.md: «Reconoce tu material». Galería con ficha (uso, cuidado y versión casera,
// tomada de la guía de materiales de bajo costo) y juego: ¿qué es? / ¿cuál usas para…?

const L = { fill: 'none', stroke: '#2b2b2b', strokeWidth: 3, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }
const AGUA = '#a9d3f5'

interface Item {
  id: string
  nombre: string
  uso: string
  cuidado: string
  casera: string
  para: string // «¿cuál usas para…?»
  basico?: boolean
  dibujo: ReactNode
}

const ITEMS: Item[] = [
  {
    id: 'vaso', nombre: 'Vaso de precipitado', basico: true,
    uso: 'Contener, mezclar y calentar líquidos. Sus marcas son aproximadas.',
    cuidado: 'No sirve para medir volúmenes exactos.',
    casera: 'Vaso de vidrio de cocina.',
    para: 'disolver un sólido en agua antes de pasarlo al matraz',
    dibujo: <g><rect x="32" y="72" width="36" height="28" fill={AGUA} /><path d="M26 40 L30 44 V100 H70 V44 L74 40" {...L} /></g>,
  },
  {
    id: 'erlenmeyer', nombre: 'Erlenmeyer', basico: true,
    uso: 'Mezclar agitando sin que se derrame; se usa en titulaciones.',
    cuidado: 'Sus marcas también son aproximadas.',
    casera: 'Botella de vidrio de boca angosta.',
    para: 'agitar una mezcla girándola sin que se riegue',
    dibujo: <g><path d="M32 86 L68 86 L74 100 H26 Z" fill={AGUA} /><path d="M44 30 V56 L26 100 H74 L56 56 V30" {...L} /></g>,
  },
  {
    id: 'matraz', nombre: 'Matraz aforado',
    uso: 'Preparar soluciones de volumen exacto: tiene una sola marca (el aforo).',
    cuidado: 'No se calienta. El aforo se completa gota a gota.',
    casera: 'No hay equivalente exacto: una botella marcada con jeringa da un volumen aproximado.',
    para: 'preparar exactamente 100 mL de una solución',
    dibujo: <g><circle cx="50" cy="84" r="16" fill={AGUA} /><path d="M46 14 V64 Q30 68 30 84 Q30 102 50 102 Q70 102 70 84 Q70 68 54 64 V14" {...L} /><line x1="42" y1="34" x2="58" y2="34" stroke="#c43c3c" strokeWidth="2.5" /></g>,
  },
  {
    id: 'probeta', nombre: 'Probeta', basico: true,
    uso: 'Medir volúmenes de líquidos con precisión media (±1 mL en una de 100 mL).',
    cuidado: 'Se lee a la altura de los ojos, en la parte baja del menisco.',
    casera: 'Taza o jarra medidora de cocina, o una jeringa grande.',
    para: 'medir unos 50 mL de agua para una mezcla',
    dibujo: <g><rect x="42" y="60" width="16" height="36" fill={AGUA} /><path d="M42 14 V96 H58 V14" {...L} /><path d="M32 100 H68" {...L} />{[30, 45, 60, 75].map((y) => <line key={y} x1="42" y1={y} x2="48" y2={y} stroke="#2b2b2b" strokeWidth="1.5" />)}</g>,
  },
  {
    id: 'pipeta', nombre: 'Pipeta',
    uso: 'Medir y pasar volúmenes pequeños y exactos (1, 5, 10 mL).',
    cuidado: 'Nunca se chupa con la boca: se usa una pera o pipeteador.',
    casera: 'Jeringa sin aguja.',
    para: 'tomar exactamente 10,0 mL de una solución',
    dibujo: <g><path d="M48 8 V40 Q42 44 42 52 Q42 60 48 64 V100 L50 106 L52 100 V64 Q58 60 58 52 Q58 44 52 40 V8" {...L} /><line x1="45" y1="22" x2="55" y2="22" stroke="#c43c3c" strokeWidth="2" /></g>,
  },
  {
    id: 'bureta', nombre: 'Bureta',
    uso: 'Soltar un líquido gota a gota midiendo cuánto salió (titulaciones).',
    cuidado: 'Se llena con embudo y se revisa que la llave no gotee.',
    casera: 'Jeringa grande colgada, soltando de a gota.',
    para: 'soltar un ácido gota a gota hasta que cambie el color',
    dibujo: <g><rect x="45" y="20" width="10" height="50" fill={AGUA} /><path d="M45 6 V84 L49 90 V104 M55 6 V84 L51 90 V104" {...L} /><rect x="40" y="82" width="20" height="5" fill="#2b2b2b" /></g>,
  },
  {
    id: 'tubo', nombre: 'Tubo de ensayo', basico: true,
    uso: 'Hacer reacciones con poca cantidad de sustancia.',
    cuidado: 'Al calentarlo, la boca apunta a donde no haya nadie.',
    casera: 'Frasco pequeño de vidrio (de compota o de medicina).',
    para: 'probar en pequeño si dos sustancias reaccionan',
    dibujo: <g><path d="M42 70 V88 Q42 98 50 98 Q58 98 58 88 V70 Z" fill="#f4c26b" /><path d="M42 10 V88 Q42 98 50 98 Q58 98 58 88 V10" {...L} /></g>,
  },
  {
    id: 'gradilla', nombre: 'Gradilla',
    uso: 'Sostener los tubos de ensayo de pie.',
    cuidado: 'Los tubos calientes se dejan enfriar en ella, no en la mesa.',
    casera: 'Caja de cartón o de huevos con huecos.',
    para: 'dejar parados varios tubos de ensayo',
    dibujo: <g><rect x="16" y="56" width="68" height="10" {...L} /><rect x="16" y="86" width="68" height="8" {...L} /><path d="M20 66 V94 M80 66 V94" {...L} />{[30, 50, 70].map((x) => <path key={x} d={`M${x - 5} 34 V80 Q${x - 5} 86 ${x} 86 Q${x + 5} 86 ${x + 5} 80 V34`} {...L} strokeWidth={2} />)}</g>,
  },
  {
    id: 'pinza', nombre: 'Pinza para tubos', basico: true,
    uso: 'Sostener un tubo de ensayo caliente.',
    cuidado: 'Se agarra el tubo cerca de la boca, no del fondo.',
    casera: 'Pinza de ropa de madera.',
    para: 'agarrar un tubo mientras se calienta',
    dibujo: <g><path d="M20 60 L70 48 Q84 46 86 54 L76 58 M20 64 L70 66 Q84 70 86 62" {...L} /><rect x="14" y="56" width="20" height="12" rx="3" fill="#c8a06a" stroke="#2b2b2b" strokeWidth="2" /></g>,
  },
  {
    id: 'mechero', nombre: 'Mechero', basico: true,
    uso: 'Calentar con llama.',
    cuidado: 'Cabello recogido, nada inflamable cerca y nunca se deja solo.',
    casera: 'Lámpara de alcohol o vela, siempre con un adulto.',
    para: 'calentar agua en un vaso',
    dibujo: <g><path d="M50 22 Q40 36 46 44 Q42 34 50 22 Z M50 26 Q60 38 52 46" fill="#5fa8f0" stroke="#2f6fb0" strokeWidth="2" /><path d="M44 48 V86 M56 48 V86" {...L} /><path d="M30 96 Q30 86 50 86 Q70 86 70 96 Z" {...L} /><line x1="56" y1="76" x2="74" y2="76" {...L} /></g>,
  },
  {
    id: 'balanza', nombre: 'Balanza', basico: true,
    uso: 'Medir la masa.',
    cuidado: 'Se tara (se pone en cero) con el recipiente encima; los reactivos nunca van directo al plato.',
    casera: 'Balanza digital de cocina.',
    para: 'pesar 8 g de sal',
    dibujo: <g><rect x="18" y="68" width="64" height="28" rx="4" {...L} /><rect x="28" y="76" width="30" height="12" fill="#1d2a22" /><text x="54" y="86" textAnchor="end" fontSize="9" fill="#7dfc9a" fontFamily="monospace">0.00</text><rect x="28" y="58" width="44" height="6" {...L} /></g>,
  },
  {
    id: 'vidrio', nombre: 'Vidrio de reloj',
    uso: 'Pesar sólidos, tapar un vaso o evaporar poco líquido.',
    cuidado: 'Se tara la balanza con el vidrio encima.',
    casera: 'Tapa plástica o platico pequeño.',
    para: 'poner encima de la balanza un sólido para pesarlo',
    dibujo: <g><path d="M18 62 Q50 82 82 62" {...L} /><path d="M40 70 Q50 60 60 70 Z" fill="#e4e7ea" stroke="#7a8794" /></g>,
  },
  {
    id: 'embudo', nombre: 'Embudo y papel de filtro', basico: true,
    uso: 'Pasar líquidos a recipientes de boca angosta, o filtrar con papel.',
    cuidado: 'El papel se dobla en cono y se moja para que se pegue.',
    casera: 'Botella plástica cortada y filtro de café.',
    para: 'separar la arena del agua',
    dibujo: <g><path d="M22 30 H78 L54 64 V100 H46 V64 Z" {...L} /><path d="M30 34 H70 L50 60 Z" fill="#fff" stroke="#999" strokeWidth="1.5" /></g>,
  },
  {
    id: 'mortero', nombre: 'Mortero', basico: true,
    uso: 'Moler sólidos para que se disuelvan o reaccionen más rápido.',
    cuidado: 'Se muele con movimientos circulares, sin golpear.',
    casera: 'Pilón o mortero de cocina.',
    para: 'triturar hojas o cristales',
    dibujo: <g><path d="M20 60 Q20 96 50 96 Q80 96 80 60 Z" {...L} /><path d="M54 66 L80 24" {...L} strokeWidth={8} /></g>,
  },
  {
    id: 'capsula', nombre: 'Cápsula de porcelana',
    uso: 'Evaporar líquidos calentándolos para recuperar el sólido.',
    cuidado: 'Resiste el fuego, pero se agarra con pinzas: queda muy caliente.',
    casera: 'Recipiente de aluminio (de los de horno).',
    para: 'evaporar agua salada y recuperar la sal',
    dibujo: <g><path d="M18 64 Q22 92 50 92 Q78 92 82 64 Z" {...L} fill="#f7f7f2" /><path d="M80 64 l8 -3" {...L} /></g>,
  },
  {
    id: 'varilla', nombre: 'Varilla de vidrio',
    uso: 'Agitar y mezclar; guiar un líquido al trasvasar.',
    cuidado: 'Se lava antes de pasar a otra solución.',
    casera: 'Palito de pincho o cuchara.',
    para: 'agitar para que un sólido se disuelva',
    dibujo: <line x1="30" y1="96" x2="72" y2="14" {...L} strokeWidth={5} />,
  },
  {
    id: 'lavador', nombre: 'Frasco lavador',
    uso: 'Echar agua destilada en chorro fino: enjuagar y completar volúmenes.',
    cuidado: 'Solo lleva agua destilada; se marca para no confundirlo.',
    casera: 'Botella plástica con un hueco en la tapa.',
    para: 'enjuagar un vaso y pasar esa agua al matraz',
    dibujo: <g><path d="M34 46 Q34 38 42 38 H58 Q66 38 66 46 V100 H34 Z" {...L} fill="#eef7ff" /><path d="M50 38 V22 Q50 14 60 14 L80 10" {...L} /></g>,
  },
  {
    id: 'termometro', nombre: 'Termómetro', basico: true,
    uso: 'Medir la temperatura.',
    cuidado: 'No se usa para agitar; si es de mercurio y se rompe, se avisa al docente.',
    casera: 'Termómetro de cocina.',
    para: 'saber a qué temperatura hierve el agua',
    dibujo: <g><path d="M46 12 V80 Q38 86 42 96 Q50 104 58 96 Q62 86 54 80 V12 Q50 6 46 12 Z" {...L} /><circle cx="50" cy="90" r="6" fill="#d33" /><rect x="48.5" y="40" width="3" height="46" fill="#d33" /></g>,
  },
  {
    id: 'espatula', nombre: 'Espátula',
    uso: 'Tomar pequeñas cantidades de sólido del frasco.',
    cuidado: 'Limpia y seca, para no contaminar el reactivo.',
    casera: 'Cucharita.',
    para: 'sacar un poco de sulfato de cobre del frasco',
    dibujo: <g><line x1="24" y1="84" x2="66" y2="36" {...L} strokeWidth={4} /><ellipse cx="72" cy="30" rx="9" ry="5" transform="rotate(-48 72 30)" fill="#ddd" stroke="#2b2b2b" strokeWidth="2.5" /></g>,
  },
  {
    id: 'gotero', nombre: 'Gotero', basico: true,
    uso: 'Añadir gotas, como las de un indicador.',
    cuidado: 'Un gotero por sustancia, para no mezclarlas.',
    casera: 'Gotero de un frasco de medicina.',
    para: 'echar 3 gotas de indicador',
    dibujo: <g><rect x="42" y="12" width="16" height="22" rx="8" fill="#333" /><path d="M44 34 V82 L50 96 L56 82 V34" {...L} /><path d="M50 102 q-3 4 0 6 q3 -2 0 -6" fill="#5fa8f0" /></g>,
  },
]

const mezclar = <T,>(a: T[]) => a.map((x) => [Math.random(), x] as const).sort((p, q) => p[0] - q[0]).map((p) => p[1])

function Dibujo({ it, tam = 90 }: { it: Item; tam?: number }) {
  return (
    <svg viewBox="0 0 100 110" width={tam} height={tam * 1.1} role="img" aria-label={it.nombre}>
      {it.dibujo}
    </svg>
  )
}

export default function Material({ grado }: { grado: number }) {
  const items = ITEMS.filter((i) => grado >= 9 || i.basico)
  const [modo, setModo] = useState<'galeria' | 'juego'>('galeria')
  const [sel, setSel] = useState(0)
  useEffect(() => {
    if (modo !== 'galeria') return
    const t = (ev: KeyboardEvent) => {
      if (ev.key === 'ArrowRight') setSel((s) => (s + 1) % items.length)
      if (ev.key === 'ArrowLeft') setSel((s) => (s + items.length - 1) % items.length)
    }
    document.addEventListener('keydown', t)
    return () => document.removeEventListener('keydown', t)
  }, [modo, items.length])
  const it = items[Math.min(sel, items.length - 1)]
  const pesta = (m: typeof modo, t: string) => (
    <button type="button" onClick={() => setModo(m)} className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${modo === m ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-[var(--tarjeta)]'}`}>
      {t}
    </button>
  )
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {pesta('galeria', 'Conoce el material')}
        {pesta('juego', '¿Qué es? ¿Cuál uso?')}
      </div>
      {modo === 'galeria' ? (
        <div className="grid gap-4 md:grid-cols-[1fr_320px]">
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
            {items.map((x, k) => (
              <li key={x.id}>
                <button type="button" onClick={() => setSel(k)} className={`flex w-full flex-col items-center rounded-xl border bg-[var(--tarjeta)] p-2 text-xs font-semibold ${k === sel ? 'border-[var(--acento)]' : 'border-[var(--linea)]'}`}>
                  <Dibujo it={x} tam={60} />
                  {x.nombre}
                </button>
              </li>
            ))}
          </ul>
          <div className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4 md:sticky md:top-4 md:self-start">
            <div className="flex justify-center"><Dibujo it={it} tam={130} /></div>
            <h3 className="mt-2 text-xl font-bold">{it.nombre}</h3>
            <p className="mt-2 text-sm"><b>Para qué sirve:</b> {it.uso}</p>
            <p className="mt-2 text-sm"><b>Cuidado:</b> {it.cuidado}</p>
            <p className="mt-2 text-sm"><b>En casa:</b> {it.casera}</p>
            <p className="mt-3 text-xs text-[var(--suave)]">←/→ para recorrer.</p>
          </div>
        </div>
      ) : (
        <Juego items={items} />
      )}
    </div>
  )
}

function Juego({ items }: { items: Item[] }) {
  // mitad de preguntas «¿qué es?» (dibujo → nombre) y mitad «¿cuál usas para…?» (tarea → dibujo)
  const [preguntas] = useState(() => mezclar(items).slice(0, 10).map((it, k) => ({ it, tipo: k % 2 === 0 ? 'que' : 'cual' })))
  const [i, setI] = useState(0)
  const [p, setP] = useState(0)
  const [elegido, setElegido] = useState<number | null>(null)
  const [opciones, setOpciones] = useState<Item[]>([])
  const q = preguntas[i]
  useEffect(() => {
    if (!q) return
    setOpciones(mezclar([q.it, ...mezclar(items.filter((x) => x.id !== q.it.id)).slice(0, 3)]))
    setElegido(null)
  }, [q, items])
  useEffect(() => {
    const t = (ev: KeyboardEvent) => {
      const k = parseInt(ev.key, 10) - 1
      if (k >= 0 && k < opciones.length && elegido === null) elegir(k)
    }
    document.addEventListener('keydown', t)
    return () => document.removeEventListener('keydown', t)
  })
  if (!q)
    return (
      <div className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-5 text-center">
        <h3 className="text-xl font-bold">{p === preguntas.length ? '¡Conoces todo el material! 🧪' : 'Resultado'}</h3>
        <p className="mt-2">Acertaste <b>{p} de {preguntas.length}</b>.</p>
      </div>
    )
  function elegir(k: number) {
    if (elegido !== null) return
    setElegido(k)
    if (opciones[k].id === q.it.id) setP((x) => x + 1)
  }
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-5 text-center">
      <p className="text-sm text-[var(--suave)]">Pregunta {i + 1} de {preguntas.length}</p>
      {q.tipo === 'que' ? (
        <>
          <Dibujo it={q.it} tam={120} />
          <p className="font-semibold">¿Cómo se llama?</p>
        </>
      ) : (
        <p className="max-w-lg text-lg font-semibold">¿Qué usas para {q.it.para}?</p>
      )}
      <div className={`grid w-full max-w-2xl gap-2 ${q.tipo === 'que' ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {opciones.map((o, k) => {
          const c = elegido === null ? '' : o.id === q.it.id ? 'border-[#2e7d5a] bg-[#eaf5ee]' : k === elegido ? 'border-[#b5462c] bg-[#fbeee9]' : 'opacity-50'
          return (
            <button key={o.id} type="button" onClick={() => elegir(k)} className={`flex min-h-11 flex-col items-center justify-center rounded-xl border border-[var(--linea)] px-3 py-2 text-sm font-semibold ${c}`}>
              {q.tipo === 'cual' && <Dibujo it={o} tam={60} />}
              <span><span className="mr-1 opacity-50">{k + 1}</span> {q.tipo === 'que' || elegido !== null ? o.nombre : ''}</span>
            </button>
          )
        })}
      </div>
      {elegido !== null && (
        <>
          <p className="max-w-lg text-sm"><b>{q.it.nombre}:</b> {q.it.uso}</p>
          <button type="button" onClick={() => setI(i + 1)} className="min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-white">
            {i === preguntas.length - 1 ? 'Ver resultado' : 'Siguiente'}
          </button>
        </>
      )}
    </div>
  )
}
