import { useEffect, useMemo, useState } from 'react'
import { ELEMENTOS, periodo, grupo, type Categoria, type Elemento } from '../../lib/elementos.ts'

// Explora (Química área 2, tema 4): la tabla periódica con vistas (teclas 1–5) y casillas para mostrar u
// ocultar cada grupo de colores. Las flechas mueven la selección; la ficha muestra los datos del elemento.

type Vista = 'familias' | 'metales' | 'estado' | 'bloques' | 'colombia'
const VISTAS: { id: Vista; nombre: string }[] = [
  { id: 'familias', nombre: 'Familias' },
  { id: 'metales', nombre: 'Metales y no metales' },
  { id: 'estado', nombre: 'Estado a 25 °C' },
  { id: 'bloques', nombre: 'Bloques s, p, d, f' },
  { id: 'colombia', nombre: 'Elementos de Colombia' },
]

const FAMILIA: Record<Categoria, [string, string]> = {
  alcalino: ['Metales alcalinos', '#f4a07a'],
  alcalinoterreo: ['Alcalinotérreos', '#f6cf7a'],
  transicion: ['Metales de transición', '#f2b8c6'],
  otrometal: ['Otros metales', '#b9d3a5'],
  metaloide: ['Metaloides', '#a8d8c8'],
  nometal: ['No metales', '#9fc3ec'],
  halogeno: ['Halógenos', '#c7b3ea'],
  noble: ['Gases nobles', '#e3a6e0'],
  lantanido: ['Lantánidos', '#d9c7a6'],
  actinido: ['Actínidos', '#cdb79a'],
}
const clase = (c: Categoria) => (c === 'metaloide' ? 'metaloide' : ['nometal', 'halogeno', 'noble'].includes(c) ? 'nometal' : 'metal')

const COLOMBIA: Record<string, string> = {
  Au: 'Oro: Antioquia, Chocó, Bolívar… La orfebrería precolombina (Museo del Oro) lo trabajó hace siglos.',
  Pt: 'Platino: los ríos del Chocó. Los europeos lo conocieron por el «platina del Pinto», de la Nueva Granada (siglo XVIII).',
  Ag: 'Plata: sale junto con el oro en muchas minas.',
  Ni: 'Níquel: Cerro Matoso (Córdoba), una de las minas de ferroníquel más grandes de América.',
  Fe: 'Hierro: Paz de Río (Boyacá), base de la siderurgia colombiana.',
  C: 'Carbón: el Cerrejón (La Guajira) y minas de Boyacá y Cundinamarca.',
  Be: 'Berilio: está en las esmeraldas (Muzo, Chivor), un silicato de berilio y aluminio.',
  Cr: 'Cromo: unas trazas de cromo le dan el verde a la esmeralda colombiana.',
  Na: 'Sodio: con el cloro forma la sal de las minas de Zipaquirá, Nemocón y Manaure.',
  Cl: 'Cloro: la sal de Zipaquirá y las salinas de Manaure es cloruro de sodio.',
  Ca: 'Calcio: la cal y el yeso que se usan en el campo para corregir suelos ácidos.',
}

const colorDe = (e: Elemento, v: Vista): [string, string] => {
  if (v === 'familias') return [e.cat, FAMILIA[e.cat][1]]
  if (v === 'metales') return [clase(e.cat), { metal: '#f2b8c6', metaloide: '#a8d8c8', nometal: '#9fc3ec' }[clase(e.cat)]]
  if (v === 'estado') return [e.est, { solido: '#d9c7a6', liquido: '#7fb2e8', gas: '#f6e08a', desconocido: '#e4e4e4' }[e.est]]
  if (v === 'bloques') return [e.bloque, { s: '#f4a07a', p: '#9fc3ec', d: '#f6cf7a', f: '#b9d3a5' }[e.bloque]]
  return COLOMBIA[e.s] ? ['col', '#f6cf7a'] : ['no', '#f1f1f1']
}
const LEYENDA: Record<Vista, [string, string, string][]> = {
  familias: (Object.keys(FAMILIA) as Categoria[]).map((k) => [k, FAMILIA[k][0], FAMILIA[k][1]]),
  metales: [['metal', 'Metales', '#f2b8c6'], ['metaloide', 'Metaloides', '#a8d8c8'], ['nometal', 'No metales', '#9fc3ec']],
  estado: [['solido', 'Sólido', '#d9c7a6'], ['liquido', 'Líquido', '#7fb2e8'], ['gas', 'Gas', '#f6e08a'], ['desconocido', 'Sin datos (sintéticos)', '#e4e4e4']],
  bloques: [['s', 'Bloque s', '#f4a07a'], ['p', 'Bloque p', '#9fc3ec'], ['d', 'Bloque d', '#f6cf7a'], ['f', 'Bloque f', '#b9d3a5']],
  colombia: [['col', 'Se extrae o se usa en Colombia', '#f6cf7a']],
}
const NOMBRE_EST = { solido: 'sólido', liquido: 'líquido', gas: 'gas', desconocido: 'no se sabe (dura muy poco)' }

export default function TablaPeriodica() {
  const [vista, setVista] = useState<Vista>('familias')
  const [ocultos, setOcultos] = useState<Set<string>>(new Set())
  const [sel, setSel] = useState(6)
  const porPos = useMemo(() => new Map(ELEMENTOS.map((e) => [`${e.fila}-${e.col}`, e])), [])

  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => {
      const n = Number(ev.key)
      if (n >= 1 && n <= 5) { setVista(VISTAS[n - 1].id); setOcultos(new Set()); return }
      const d = { ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowDown: [1, 0], ArrowUp: [-1, 0] }[ev.key]
      if (!d) return
      ev.preventDefault()
      setSel((z) => {
        const e = ELEMENTOS[z - 1]
        let [f, c] = [e.fila, e.col]
        for (let paso = 0; paso < 20; paso++) {
          f += d[0]; c += d[1]
          if (f === 8) f += d[0]
          if (f < 1 || f > 10 || c < 1 || c > 18) return z
          const otro = porPos.get(`${f}-${c}`)
          if (otro) return otro.z
          if (d[0] !== 0) { // al subir o bajar, buscar la celda más cercana en la fila
            for (let k = 1; k < 18; k++) {
              const o = porPos.get(`${f}-${c - k}`) ?? porPos.get(`${f}-${c + k}`)
              if (o) return o.z
            }
          }
        }
        return z
      })
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [porPos])

  const e = ELEMENTOS[sel - 1]
  const alternar = (k: string) => setOcultos((s) => { const t = new Set(s); if (t.has(k)) t.delete(k); else t.add(k); return t })
  const g = grupo(e)

  return (
    <div data-diagrama className="flex flex-col gap-3">
      <div className="flex flex-wrap justify-center gap-2">
        {VISTAS.map((v, k) => (
          <button key={v.id} onClick={() => { setVista(v.id); setOcultos(new Set()) }}
            className={`rounded-full border px-3 py-1 text-sm font-semibold ${vista === v.id ? 'bg-[var(--acento)] text-white' : 'bg-white'}`}>
            {k + 1} · {v.nombre}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <div className="mx-auto grid min-w-[760px] max-w-5xl gap-[3px]" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
          {Array.from({ length: 18 }, (_, k) => (
            <div key={`g${k}`} className="text-center text-[10px] font-semibold opacity-60" style={{ gridRow: 1, gridColumn: k + 1 }}>{k + 1}</div>
          ))}
          {ELEMENTOS.map((el) => {
            const [clave, color] = colorDe(el, vista)
            const apagado = ocultos.has(clave) || (vista === 'colombia' && clave === 'no')
            return (
              <button key={el.z} onClick={() => setSel(el.z)} title={el.n}
                className={`flex aspect-square flex-col items-center justify-center rounded border text-center leading-none ${el.z === sel ? 'ring-2 ring-[#3a3a3a]' : ''}`}
                style={{ gridRow: el.fila + 1, gridColumn: el.col, background: apagado ? '#fafafa' : color, opacity: apagado ? 0.45 : 1, borderColor: '#0002', marginTop: el.fila === 9 ? 10 : 0 }}>
                <span className="text-[9px] opacity-70">{el.z}</span>
                <span className="text-sm font-bold">{el.s}</span>
              </button>
            )
          })}
          <div className="flex items-center justify-center rounded border border-dashed text-[9px]" style={{ gridRow: 7, gridColumn: 3, background: FAMILIA.lantanido[1] + '66' }}>57–71</div>
          <div className="flex items-center justify-center rounded border border-dashed text-[9px]" style={{ gridRow: 8, gridColumn: 3, background: FAMILIA.actinido[1] + '66' }}>89–103</div>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div className="flex flex-wrap content-start gap-2">
          {LEYENDA[vista].map(([k, nombre, color]) => (
            <label key={k} className="flex cursor-pointer items-center gap-1 rounded-full border bg-white px-2 py-1 text-xs">
              <input type="checkbox" checked={!ocultos.has(k)} onChange={() => alternar(k)} />
              <span className="inline-block h-3 w-3 rounded-sm" style={{ background: color }} /> {nombre}
            </label>
          ))}
        </div>
        <div className="rounded-xl border-2 border-[var(--acento)] bg-white p-3">
          <p className="text-lg font-bold">{e.z} · {e.n} ({e.s})</p>
          <p className="text-sm">
            Periodo {periodo(e)} · {g ? `grupo ${g}` : e.cat === 'lantanido' ? 'lantánido' : 'actínido'} · bloque {e.bloque} · {FAMILIA[e.cat][0].toLowerCase()} · {NOMBRE_EST[e.est]} a 25 °C
          </p>
          {COLOMBIA[e.s] && <p className="mt-1 text-sm">🇨🇴 {COLOMBIA[e.s]}</p>}
          {e.z >= 104 && <p className="mt-1 text-xs opacity-70">Elemento sintético: solo se han hecho unos pocos átomos y sus propiedades se predicen.</p>}
        </div>
      </div>
      <p className="text-center text-xs opacity-70">Teclas 1–5 cambian la vista; las flechas recorren la tabla. Las casillas apagan o encienden cada color.</p>
    </div>
  )
}
