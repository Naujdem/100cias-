import { useState } from 'react'

// Laboratorio de Biología 5 (PLAN-LABORATORIOS.md, del manual de Bioquímica): reconocimiento de biomoléculas.
// Cuatro pruebas sobre una gradilla de alimentos: lugol (almidón), Benedict con baño María (azúcares
// reductores), Biuret (proteínas) y mancha en papel (lípidos). El estudiante interpreta + / − y comprueba.

type Prueba = 'lugol' | 'benedict' | 'biuret' | 'lipidos'
interface Alimento {
  id: string
  nombre: string
  almidon: number
  reductor: number
  proteina: number
  lipido: number
  nota?: string
}

const ALIMENTOS: Alimento[] = [
  { id: 'agua', nombre: 'Agua (control)', almidon: 0, reductor: 0, proteina: 0, lipido: 0, nota: 'El tubo de control muestra el color del reactivo solo: con él se comparan los demás.' },
  { id: 'papa', nombre: 'Papa', almidon: 1, reductor: 0.05, proteina: 0.1, lipido: 0 },
  { id: 'arepa', nombre: 'Masa de arepa', almidon: 0.9, reductor: 0.05, proteina: 0.15, lipido: 0.05 },
  { id: 'azucar', nombre: 'Azúcar de mesa', almidon: 0, reductor: 0, proteina: 0, lipido: 0, nota: 'El azúcar de mesa es sacarosa: no es reductora, por eso da negativo con Benedict aunque sea dulce.' },
  { id: 'miel', nombre: 'Miel', almidon: 0, reductor: 1, proteina: 0, lipido: 0, nota: 'La miel es sobre todo glucosa y fructosa, azúcares reductores.' },
  { id: 'naranja', nombre: 'Jugo de naranja', almidon: 0, reductor: 0.55, proteina: 0.05, lipido: 0 },
  { id: 'leche', nombre: 'Leche', almidon: 0, reductor: 0.5, proteina: 0.7, lipido: 0.5, nota: 'La leche tiene lactosa (reductora), caseína (proteína) y grasa.' },
  { id: 'clara', nombre: 'Clara de huevo', almidon: 0, reductor: 0, proteina: 1, lipido: 0 },
  { id: 'queso', nombre: 'Queso', almidon: 0, reductor: 0.05, proteina: 0.8, lipido: 0.7 },
  { id: 'aceite', nombre: 'Aceite', almidon: 0, reductor: 0, proteina: 0, lipido: 1 },
  { id: 'aguacate', nombre: 'Aguacate', almidon: 0, reductor: 0.05, proteina: 0.1, lipido: 0.85 },
]

const PRUEBAS: Record<Prueba, { nombre: string; busca: string; campo: keyof Alimento; como: string; positivo: string }> = {
  lugol: { nombre: 'Lugol', busca: 'Almidón', campo: 'almidon', como: 'Tres gotas de lugol en cada tubo.', positivo: 'azul oscuro o negro' },
  benedict: { nombre: 'Benedict', busca: 'Azúcares reductores', campo: 'reductor', como: '2 mL de reactivo de Benedict y baño María (agua hirviendo) 5 minutos.', positivo: 'verde, amarillo, naranja o rojo ladrillo (según cuánto azúcar haya)' },
  biuret: { nombre: 'Biuret', busca: 'Proteínas', campo: 'proteina', como: 'Unas gotas de soda cáustica y luego unas gotas de sulfato de cobre (reactivo de Biuret).', positivo: 'violeta o lila' },
  lipidos: { nombre: 'Mancha en papel', busca: 'Lípidos', campo: 'lipido', como: 'Una gota de cada alimento en papel y dejar secar 10 minutos.', positivo: 'mancha translúcida que no se seca' },
}

const mezcla = (a: [number, number, number], b: [number, number, number], t: number) => {
  const c = a.map((x, k) => Math.round(x + (b[k] - x) * Math.min(1, Math.max(0, t))))
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`
}

function colorTubo(p: Prueba, a: Alimento, calor: boolean, hidrolizado: boolean) {
  if (p === 'lugol') return mezcla([217, 164, 65], [30, 25, 60], a.almidon * 1.2)
  if (p === 'biuret') return mezcla([111, 163, 224], [123, 63, 160], a.proteina * 1.3)
  // Benedict: azul → verde → amarillo → naranja → rojo ladrillo, solo con calor
  const r = a.id === 'azucar' && hidrolizado ? 0.9 : a.reductor
  if (!calor || r < 0.1) return 'rgb(58, 123, 213)'
  if (r < 0.35) return mezcla([58, 123, 213], [110, 170, 70], r / 0.35)
  if (r < 0.65) return mezcla([110, 170, 70], [225, 170, 40], (r - 0.35) / 0.3)
  return mezcla([225, 170, 40], [181, 64, 31], (r - 0.65) / 0.35)
}

const verdad = (p: Prueba, a: Alimento, hidrolizado: boolean) => {
  if (p === 'benedict' && a.id === 'azucar' && hidrolizado) return true
  return (a[PRUEBAS[p].campo] as number) >= 0.2
}

type Marca = '?' | '+' | '−'

export default function Biomoleculas({ grado }: { grado: number }) {
  const [prueba, setPrueba] = useState<Prueba>('lugol')
  const [hecha, setHecha] = useState<Set<Prueba>>(new Set())
  const [calor, setCalor] = useState(false)
  const [hidrolizado, setHidrolizado] = useState(false)
  const [marcas, setMarcas] = useState<Record<string, Marca>>({})
  const [rev, setRev] = useState(false)
  const P = PRUEBAS[prueba]
  const lista = grado < 9 ? ALIMENTOS.filter((a) => ['agua', 'papa', 'azucar', 'miel', 'clara', 'aceite', 'leche'].includes(a.id)) : ALIMENTOS
  const pruebas = Object.keys(PRUEBAS) as Prueba[]
  const clave = (p: Prueba, a: Alimento) => `${p}:${a.id}`
  const ciclar = (p: Prueba, a: Alimento) => {
    setRev(false)
    setMarcas((m) => ({ ...m, [clave(p, a)]: m[clave(p, a)] === '+' ? '−' : m[clave(p, a)] === '−' ? '?' : '+' }))
  }
  const hacer = () => setHecha((h) => new Set(h).add(prueba))
  const total = pruebas.length * lista.length
  const aciertos = pruebas.reduce((s, p) => s + lista.filter((a) => (marcas[clave(p, a)] === '+') === verdad(p, a, hidrolizado) && (marcas[clave(p, a)] ?? '?') !== '?').length, 0)
  const btn = 'min-h-10 rounded-full border px-3 text-sm font-semibold'

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {pruebas.map((p) => (
          <button key={p} type="button" onClick={() => setPrueba(p)} className={`${btn} ${prueba === p ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-[var(--tarjeta)]'}`}>
            {PRUEBAS[p].busca} · {PRUEBAS[p].nombre}{hecha.has(p) ? ' ✔' : ''}
          </button>
        ))}
      </div>
      <div className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        <p><b>Busca:</b> {P.busca}. <b>Cómo:</b> {P.como}</p>
        {grado < 11 && <p className="mt-1"><b>Positivo:</b> {P.positivo}.</p>}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" onClick={hacer} className={`${btn} border-[var(--acento)] bg-[var(--acento)] text-white`}>{hecha.has(prueba) ? 'Prueba hecha' : 'Hacer la prueba'}</button>
          {prueba === 'benedict' && (
            <button type="button" onClick={() => setCalor((c) => !c)} className={`${btn} ${calor ? 'border-[#c8781e] bg-[#fff1df]' : 'border-[var(--linea)]'}`}>{calor ? '🔥 En baño María' : 'Poner en baño María'}</button>
          )}
          {prueba === 'benedict' && grado >= 11 && (
            <button type="button" disabled={hidrolizado} onClick={() => setHidrolizado(true)} className={`${btn} border-[var(--linea)]`}>{hidrolizado ? 'Azúcar hidrolizado ✔' : 'Hidrolizar el azúcar (hervir con ácido y neutralizar)'}</button>
          )}
        </div>
        {prueba === 'benedict' && hecha.has('benedict') && !calor && <p className="mt-2 font-semibold text-[#b5462c]">⚠ Todos siguen azules: el reactivo de Benedict solo reacciona con calor.</p>}
      </div>

      <svg viewBox={`0 0 ${lista.length * 80 + 20} 230`} className="w-full rounded-2xl border border-[var(--linea)] bg-[#f4f1ea]" role="img" aria-label="Gradilla con los tubos">
        {prueba !== 'lipidos' && <rect x="5" y="150" width={lista.length * 80 + 10} height="14" fill="#c8a06a" stroke="#7a5a2a" />}
        {lista.map((a, k) => {
          const x = 50 + k * 80
          const hecho = hecha.has(prueba)
          if (prueba === 'lipidos') {
            const l = hecho ? a.lipido : 0.8
            return (
              <g key={a.id}>
                <rect x={x - 34} y="40" width="68" height="90" fill="#fdfcf6" stroke="#bbb" />
                <circle cx={x} cy="85" r="18" fill={hecho ? `rgba(220, 205, 150, ${0.15 + l * 0.6})` : 'rgba(200, 190, 150, 0.6)'} stroke={hecho && a.lipido > 0.2 ? '#b8a050' : 'none'} style={{ transition: 'all 1s' }} />
                {hecho && a.lipido > 0.2 && <circle cx={x - 6} cy="80" r="5" fill="rgba(255,255,255,0.6)" />}
                <text x={x} y="148" textAnchor="middle" fontSize="11" fontWeight="700">{a.nombre}</text>
              </g>
            )
          }
          return (
            <g key={a.id}>
              <path d={`M${x - 12} 40 V140 Q${x - 12} 152 ${x} 152 Q${x + 12} 152 ${x + 12} 140 V40`} fill="#fff" stroke="#3a3a3a" strokeWidth="2.5" />
              <path d={`M${x - 11} 95 V140 Q${x - 11} 151 ${x} 151 Q${x + 11} 151 ${x + 11} 140 V95 Z`} fill={hecho ? colorTubo(prueba, a, calor, hidrolizado) : '#f2ecd9'} style={{ transition: 'fill 1.2s' }} />
              {a.lipido > 0.6 && hecho && <rect x={x - 11} y="92" width="22" height="6" fill="rgba(240, 210, 90, 0.8)" />}
              <text x={x} y="180" textAnchor="middle" fontSize="11" fontWeight="700">{a.nombre.split(' (')[0]}</text>
            </g>
          )
        })}
      </svg>

      {hecha.has(prueba) && (
        <div className="flex flex-wrap gap-2">
          <span className="self-center text-sm font-semibold">Interpreta cada tubo (toca para cambiar ? → + → −):</span>
          {lista.map((a) => {
            const m = marcas[clave(prueba, a)] ?? '?'
            const ok = rev && m !== '?' ? (m === '+') === verdad(prueba, a, hidrolizado) : null
            return (
              <button key={a.id} type="button" onClick={() => ciclar(prueba, a)} className={`min-h-9 rounded-full border px-3 text-xs font-semibold ${ok === true ? 'border-[#2e7d5a] bg-[#eaf5ee]' : ok === false ? 'border-[#b5462c] bg-[#fbeee9]' : 'border-[var(--linea)] bg-white'}`}>
                {a.nombre.split(' (')[0]}: {m}
              </button>
            )
          })}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full rounded-xl bg-[var(--tarjeta)] text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">Alimento</th>
              {pruebas.map((p) => <th key={p} className="p-2">{PRUEBAS[p].busca}</th>)}
            </tr>
          </thead>
          <tbody>
            {lista.map((a) => (
              <tr key={a.id} className="border-b last:border-0">
                <td className="p-2 font-semibold">{a.nombre}</td>
                {pruebas.map((p) => {
                  const m = marcas[clave(p, a)] ?? ''
                  const bien = rev && m && m !== '?' ? (m === '+') === verdad(p, a, hidrolizado) : null
                  return <td key={p} className={`p-2 text-center font-bold ${bien === true ? 'text-[#2e7d5a]' : bien === false ? 'text-[#b5462c]' : ''}`}>{m === '?' ? '' : m}</td>
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setRev(true)} className={`${btn} border-[var(--acento)] bg-[var(--acento)] text-white`}>Comprobar la tabla</button>
        {rev && <span className="text-sm font-semibold">{aciertos} de {total} bien interpretados{aciertos === total ? ' 🧪' : ''}</span>}
      </div>
      {rev && (
        <ul className="list-disc space-y-1 rounded-2xl bg-[var(--tarjeta)] p-4 pl-8 text-sm">
          {lista.filter((a) => a.nota).map((a) => <li key={a.id}><b>{a.nombre}:</b> {a.nota}</li>)}
          {hidrolizado && <li><b>Azúcar hidrolizado:</b> al hervirla con ácido, la sacarosa se parte en glucosa y fructosa, que sí son reductoras.</li>}
        </ul>
      )}
      <p className="text-xs text-[var(--suave)]">⚠ El reactivo de Biuret lleva soda cáustica (corrosiva): gafas y guantes. Los tubos calientes se toman con pinza. La prueba de la mancha en papel se puede hacer en casa con papel de cuaderno o de pan.</p>
    </div>
  )
}
