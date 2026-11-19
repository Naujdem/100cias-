import { useEffect, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { AsaGradilla, BanoMaria, Caneca, Gotero, HojaPapel, Reloj, Tubo } from '../dibujos.tsx'

// Laboratorio de Biología (PLAN-LABORATORIOS.md, del manual de Bioquímica): reconocimiento de biomoléculas,
// en mesa viva («como Tinciones»). Cada reactivo se gotea tubo por tubo: lugol (almidón); Benedict y la
// gradilla al baño María 5 min (acelerado: 1 s = 10 s); Biuret = soda y luego sulfato de cobre (proteínas);
// lípidos = una gota de cada alimento en el papel y 10 min de secado (1 s = 20 s). Luego se interpreta + / −.

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

/** color del tubo según lo que se le echó; «calor» = segundos en el baño María */
function colorTubo(p: Prueba, a: Alimento, r: string[], calor: number, hidrolizado: boolean) {
  const base = 'rgb(242, 236, 217)'
  if (p === 'lugol') return r.includes('lugol') ? mezcla([217, 164, 65], [30, 25, 60], a.almidon * 1.2) : base
  if (p === 'biuret') {
    if (!r.includes('cobre')) return r.includes('soda') ? 'rgb(236, 232, 214)' : base
    return r.includes('soda') ? mezcla([111, 163, 224], [123, 63, 160], a.proteina * 1.3) : 'rgb(150, 190, 230)'
  }
  if (!r.includes('benedict')) return base
  // Benedict: azul → verde → amarillo → naranja → rojo ladrillo, solo con calor y según el tiempo
  const r0 = a.id === 'azucar' && hidrolizado ? 0.9 : a.reductor
  const x = r0 * Math.min(1, calor / 300)
  if (x < 0.1) return 'rgb(58, 123, 213)'
  if (x < 0.35) return mezcla([58, 123, 213], [110, 170, 70], x / 0.35)
  if (x < 0.65) return mezcla([110, 170, 70], [225, 170, 40], (x - 0.35) / 0.3)
  return mezcla([225, 170, 40], [181, 64, 31], (x - 0.65) / 0.35)
}

const verdad = (p: Prueba, a: Alimento, hidrolizado: boolean) => {
  if (p === 'benedict' && a.id === 'azucar' && hidrolizado) return true
  return (a[PRUEBAS[p].campo] as number) >= 0.2
}

type Marca = '?' | '+' | '−'
interface TuboE { r: string[]; t: number }
type Estado = Record<Prueba, Record<string, TuboE>>
const NUEVO: Estado = { lugol: {}, benedict: {}, biuret: {}, lipidos: {} }
const CORTO = (a: Alimento) => a.nombre.split(' (')[0].replace('Masa de ', '').replace('Jugo de ', '').replace('Clara de huevo', 'Clara').replace('Azúcar de mesa', 'Azúcar')

export default function Biomoleculas({ grado }: { grado: number }) {
  const [prueba, setPrueba] = useState<Prueba>('lugol')
  const [est, setEst] = useState<Estado>(NUEVO)
  const [enBano, setEnBano] = useState(false)
  const [cuenta, setCuenta] = useState(0)
  const [alarma, setAlarma] = useState(false)
  const [marcas, setMarcas] = useState<Record<string, Marca>>({})
  const [rev, setRev] = useState(false)
  const P = PRUEBAS[prueba]
  const lista = grado < 9 ? ALIMENTOS.filter((a) => ['agua', 'papa', 'azucar', 'miel', 'clara', 'aceite', 'leche'].includes(a.id)) : ALIMENTOS
  const pruebas = Object.keys(PRUEBAS) as Prueba[]
  const hidrolizado = !!est.benedict.azucar?.r.includes('acido')
  const T = (p: Prueba, id: string): TuboE => est[p][id] ?? { r: [], t: 0 }
  const paso = prueba === 'benedict' ? 10 : prueba === 'lipidos' ? 20 : 0
  const corre = (prueba === 'benedict' && enBano) || (prueba === 'lipidos' && Object.keys(est.lipidos).length > 0)
  useEffect(() => {
    if (!paso) return
    const id = window.setInterval(() => {
      if (corre)
        setEst((e) => ({
          ...e,
          [prueba]: Object.fromEntries(Object.entries(e[prueba]).map(([k, v]) => [k, prueba === 'benedict' && !v.r.includes('benedict') ? v : { ...v, t: v.t + paso }])),
        }))
      setCuenta((c) => { if (c > 0 && c <= paso) setAlarma(true); return Math.max(0, c - paso) })
    }, 1000)
    return () => window.clearInterval(id)
  }, [paso, corre, prueba])
  const echar = (id: string, r: string) => setEst((e) => ({ ...e, [prueba]: { ...e[prueba], [id]: { ...T(prueba, id), r: [...T(prueba, id).r, r] } } }))
  const cambiarPrueba = (p: Prueba) => { setPrueba(p); setEnBano(false); setCuenta(0); setAlarma(false) }

  // ---- mesa ----
  const paso0 = Math.min(56, 600 / lista.length)
  const xTubo = (k: number) => 50 + k * paso0
  const reactivos: { id: string; nombre: string; color: string; e: string; oscuro?: boolean }[] =
    prueba === 'lugol' ? [{ id: 'lugol', nombre: 'Lugol', color: '#a0601a', e: 'LUGOL', oscuro: true }]
    : prueba === 'biuret' ? [{ id: 'soda', nombre: 'Soda cáustica (NaOH)', color: '#eef2f4', e: 'NaOH' }, { id: 'cobre', nombre: 'Sulfato de cobre', color: '#6fa3e0', e: 'CuSO₄' }]
    : prueba === 'benedict' ? [{ id: 'benedict', nombre: 'Reactivo de Benedict', color: '#3a7bd5', e: 'BENEDICT' }, ...(grado >= 11 ? [{ id: 'acido', nombre: 'Ácido diluido (para hidrolizar)', color: '#f0f0e0', e: 'ÁCIDO' }] : [])]
    : []
  const piezas: Pieza[] = []
  if (prueba === 'lipidos') {
    lista.forEach((a, k) => piezas.push({ id: `t-${a.id}`, nombre: a.nombre, x: xTubo(k), y: 335, ancho: paso0 - 4, alto: 100, tomable: true, dibujo: <Tubo color="rgb(242, 236, 217)" etiqueta={CORTO(a)} capa={a.lipido > 0.6 ? 'rgba(240,210,90,0.8)' : undefined} /> }))
    const manchas = lista.flatMap((a, k) => {
      const t = est.lipidos[a.id]
      if (!t) return []
      const seco = Math.min(1, t.t / 600)
      const queda = a.lipido > 0.2 ? 0.15 + a.lipido * 0.6 : 0.6 * (1 - seco)
      return [{ x: -56 + (k % 6) * 22, y: -24 + Math.floor(k / 6) * 40, color: `rgba(210, 195, 140, ${queda})`, brillo: a.lipido > 0.2 || seco < 0.9 }]
    })
    piezas.push({ id: 'papel', nombre: 'Hoja de papel', x: 760, y: 345, ancho: 150, alto: 96, dibujo: <HojaPapel manchas={manchas} /> })
  } else {
    lista.forEach((a, k) => {
      const t = T(prueba, a.id)
      piezas.push({ id: `t-${a.id}`, nombre: `Tubo: ${a.nombre}`, x: xTubo(k), y: enBano ? 318 : 335, ancho: paso0 - 4, alto: 100, dibujo: <Tubo color={colorTubo(prueba, a, t.r, t.t, hidrolizado)} etiqueta={CORTO(a)} capa={a.lipido > 0.6 && t.r.length ? 'rgba(240,210,90,0.8)' : undefined} /> })
    })
    reactivos.forEach((r, k) => piezas.push({ id: r.id, nombre: r.nombre, x: 680 + k * 66, y: 312, ancho: 50, alto: 96, tomable: true, color: r.color, dibujo: <Gotero color={r.color} etiqueta={r.e} oscuro={r.oscuro} /> }))
    if (prueba === 'benedict') {
      piezas.push({ id: 'asa', nombre: enBano ? 'Gradilla (sacar del baño)' : 'Gradilla (llevar al baño)', x: 50 + ((lista.length - 1) * paso0) / 2, y: 405, ancho: 80, alto: 34, tomable: true, dibujo: <AsaGradilla /> })
      piezas.push({ id: 'bano', nombre: 'Baño María', x: 830, y: 345, ancho: 112, alto: 90, dibujo: <BanoMaria dentro={enBano} /> })
    }
  }
  if (paso) piezas.push({ id: 'reloj', nombre: 'Temporizador (toca: +1 min)', x: prueba === 'lipidos' ? 900 : 945, y: prueba === 'lipidos' ? 330 : 250, ancho: 72, alto: 72, alTocar: () => { setAlarma(false); setCuenta((c) => c + 60) }, dibujo: <Reloj s={cuenta} alarma={alarma} aviso={prueba === 'lipidos' ? '¡Mira!' : '¡Saca!'} /> })
  piezas.push({ id: 'caneca', nombre: 'Residuos (toca: vaciar y empezar esta prueba)', alTocar: () => { setEst((e) => ({ ...e, [prueba]: {} })); setEnBano(false); setCuenta(0); setAlarma(false); setRev(false) }, x: 960, y: prueba === 'lipidos' ? 430 : 360, ancho: 54, alto: 76, dibujo: <Caneca /> })

  const destinos = (de: string) => {
    if (de === 'asa') return ['bano']
    if (prueba === 'lipidos') return ['papel']
    return lista.map((a) => `t-${a.id}`)
  }
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'asa') {
      if (en !== 'bano') return 'La gradilla va al baño María (y se saca soltándola otra vez sobre él).'
      if (!enBano && !lista.some((a) => T('benedict', a.id).r.includes('benedict'))) return 'Primero echa el reactivo de Benedict en los tubos.'
      return { anim: 'poner', hecho: () => setEnBano((b) => !b) }
    }
    if (prueba === 'lipidos') {
      if (en !== 'papel') return 'Pon una gota de cada alimento en la hoja de papel.'
      const id = de.slice(2)
      if (est.lipidos[id]) return 'Ese alimento ya tiene su mancha.'
      return { anim: 'gotas', gotas: 1, hecho: () => setEst((e) => ({ ...e, lipidos: { ...e.lipidos, [id]: { r: ['gota'], t: 0 } } })) }
    }
    if (!en.startsWith('t-')) return 'El reactivo se echa en los tubos, uno por uno.'
    const id = en.slice(2)
    const t = T(prueba, id)
    if (t.r.includes(de)) return 'Ese tubo ya tiene ese reactivo.'
    if (de === 'acido') {
      if (id !== 'azucar') return 'El ácido se usa solo en el tubo del azúcar de mesa, para partir la sacarosa.'
      if (t.r.includes('benedict')) return 'Primero se hidroliza y luego se echa el Benedict.'
    }
    return { anim: 'gotas', gotas: 3, hecho: () => echar(id, de) }
  }

  // listo para interpretar: todos los tubos con su reactivo (y el Benedict calentado; las manchas secas)
  const completo = (p: Prueba) =>
    lista.every((a) => {
      const t = est[p][a.id]
      if (!t) return false
      if (p === 'lugol') return t.r.includes('lugol')
      if (p === 'biuret') return t.r.includes('soda') && t.r.includes('cobre')
      if (p === 'benedict') return t.r.includes('benedict') && t.t > 0
      return t.t >= 600
    })
  const listaPrueba = completo(prueba)
  const clave = (p: Prueba, a: Alimento) => `${p}:${a.id}`
  const ciclar = (p: Prueba, a: Alimento) => {
    setRev(false)
    setMarcas((m) => ({ ...m, [clave(p, a)]: m[clave(p, a)] === '+' ? '−' : m[clave(p, a)] === '−' ? '?' : '+' }))
  }
  const total = pruebas.length * lista.length
  const aciertos = pruebas.reduce((s, p) => s + lista.filter((a) => (marcas[clave(p, a)] === '+') === verdad(p, a, hidrolizado) && (marcas[clave(p, a)] ?? '?') !== '?').length, 0)
  const btn = 'min-h-10 rounded-full border px-3 text-sm font-semibold'
  const avisos = [
    ...(prueba === 'biuret' && lista.some((a) => { const r = T('biuret', a.id).r; return r.indexOf('cobre') >= 0 && (r.indexOf('soda') < 0 || r.indexOf('cobre') < r.indexOf('soda')) }) ? ['En algún tubo echaste el sulfato de cobre antes que la soda: el Biuret necesita medio básico primero.'] : []),
    ...(prueba === 'benedict' && listaPrueba && !enBano && lista.some((a) => T('benedict', a.id).t < 300) ? ['Algunos tubos estuvieron menos de 5 minutos en el baño María: el color puede quedarse a medio camino.'] : []),
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {pruebas.map((p) => (
          <button key={p} type="button" onClick={() => cambiarPrueba(p)} className={`${btn} ${prueba === p ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-[var(--tarjeta)]'}`}>
            {PRUEBAS[p].busca} · {PRUEBAS[p].nombre}{completo(p) ? ' ✔' : ''}
          </button>
        ))}
      </div>
      <div className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        <p><b>Busca:</b> {P.busca}. <b>Cómo:</b> {P.como}</p>
        <p className="mt-1 text-[var(--suave)]">
          {prueba === 'benedict' ? 'Echa el reactivo en cada tubo y lleva la gradilla (por el asa) al baño María. Programa 5 min en el temporizador (acelerado: 1 s = 10 s) y sácala cuando suene.'
            : prueba === 'lipidos' ? 'Toma cada tubo y pon una gota en la hoja. Programa 10 min de secado (acelerado: 1 s = 20 s) y mira qué manchas quedan.'
            : prueba === 'biuret' ? 'En cada tubo: primero la soda y después el sulfato de cobre.'
            : 'Echa el lugol en cada tubo.'}
        </p>
        {grado < 11 && <p className="mt-1"><b>Positivo:</b> {P.positivo}.</p>}
        {avisos.map((a) => <p key={a} className="mt-2 font-semibold text-[#b5462c]">⚠ {a}</p>)}
      </div>
      <MesaViva desde={190} piezas={piezas} destinos={destinos} soltar={soltar} />
      {!listaPrueba && <p className="text-sm text-[var(--suave)]">Cuando todos los tubos tengan su prueba completa, podrás interpretarlos.</p>}
      {listaPrueba && (
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
