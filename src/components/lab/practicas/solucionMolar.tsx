import { useState } from 'react'
import type { Boton, Hecho, Nivel, Practica } from '../Mesa.tsx'

// Práctica piloto (Química 9 en PLAN-LABORATORIOS.md): «Prepara 100 mL de solución 0,5 M de sulfato de cobre».
// En 9° se usa sulfato de cobre anhidro (159,6 g/mol) con calculadora y pistas; en 11° el frasco es el
// pentahidratado (249,7 g/mol), como en un laboratorio real, sin ayudas y con errores más finos.

const MM = { anhidro: 159.6, penta: 249.7 }
const META = 0.5
const VOL = 100
const VIDRIO = 25.31 // masa del vidrio de reloj

interface Rec {
  soluto: number // gramos de sal ya disueltos
  solido: number // gramos sin disolver
  agua: number // mL
}
interface E {
  sal: 'anhidro' | 'penta'
  tara: number
  enBalanza: number
  vaso: Rec
  probeta: Rec
  matraz: Rec
  pasado: boolean // se pasó del aforo alguna vez
  mezclado: boolean
  enjuague: boolean
  residuo: boolean // quedó soluto en el vaso tras pasarlo
  derrame: number // gramos perdidos
  tarado: boolean
}

const vacio = (): Rec => ({ soluto: 0, solido: 0, agua: 0 })
const f = (x: number, d = 2) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })
const r2 = (x: number) => Math.round(x * 100) / 100
const r1 = (x: number) => Math.round(x * 10) / 10

const masaMeta = (sal: E['sal']) => META * (VOL / 1000) * MM[sal]

// ---------- dibujos ----------

/** color del líquido según la concentración de cobre (mol/L) */
function azul(r: Rec, sal: E['sal']) {
  if (r.agua <= 0) return 'none'
  const M = r.soluto / MM[sal] / (r.agua / 1000)
  return `rgba(30, 110, 210, ${Math.min(0.92, 0.06 + M * 1.3)})`
}
const colorSolido = (sal: E['sal']) => (sal === 'penta' ? '#2f78c9' : '#e4e7ea')

function Cristales({ x, y, g, sal, ancho = 40 }: { x: number; y: number; g: number; sal: E['sal']; ancho?: number }) {
  if (g <= 0.005) return null
  const h = Math.min(26, 3 + Math.sqrt(g) * 5)
  const w = Math.min(ancho, 12 + Math.sqrt(g) * 8)
  return <path d={`M${x - w / 2} ${y} Q${x} ${y - h * 2} ${x + w / 2} ${y} Z`} fill={colorSolido(sal)} stroke="#7a8794" strokeWidth="1" />
}

function Frasco({ e }: { e: E }) {
  return (
    <g>
      <rect x="40" y="215" width="60" height="110" rx="10" fill="#fff" stroke="#3a3a3a" strokeWidth="3" />
      <rect x="48" y="200" width="44" height="18" rx="3" fill="#5a4a3a" />
      <rect x="40" y="265" width="60" height="58" rx="6" fill={colorSolido(e.sal)} opacity="0.85" />
      <rect x="44" y="232" width="52" height="26" fill="#fffbe8" stroke="#999" />
      <text x="70" y="245" textAnchor="middle" fontSize="10" fontWeight="800">{e.sal === 'penta' ? 'CuSO₄·5H₂O' : 'CuSO₄'}</text>
      <text x="70" y="255" textAnchor="middle" fontSize="8">{f(MM[e.sal], 1)} g/mol</text>
    </g>
  )
}

function Balanza({ e }: { e: E }) {
  const lectura = VIDRIO + e.enBalanza - e.tara
  return (
    <g>
      <rect x="150" y="285" width="120" height="42" rx="6" fill="#d9dde2" stroke="#3a3a3a" strokeWidth="3" />
      <rect x="165" y="296" width="62" height="22" rx="3" fill="#1d2a22" />
      <text x="222" y="312" textAnchor="end" fontSize="14" fontFamily="monospace" fontWeight="700" fill="#7dfc9a">{f(lectura)}</text>
      <text x="245" y="312" fontSize="11" fontWeight="700">g</text>
      <rect x="170" y="270" width="80" height="8" fill="#9aa3ad" />
      <rect x="205" y="278" width="10" height="8" fill="#9aa3ad" />
      <path d="M178 268 Q210 256 242 268 Z" fill="#e8f2fa" stroke="#6b7a88" strokeWidth="2" />
      <Cristales x={210} y={264} g={e.enBalanza} sal={e.sal} />
    </g>
  )
}

function Vaso({ e }: { e: E }) {
  const c = 380
  const y = 325 - e.vaso.agua * 0.7
  return (
    <g>
      <clipPath id="lab-vaso"><path d={`M${c - 45} 215 V325 H${c + 45} V215 Z`} /></clipPath>
      <rect x={c - 45} y={y} width="90" height={325 - y} fill={azul(e.vaso, e.sal)} clipPath="url(#lab-vaso)" />
      <Cristales x={c} y={324} g={e.vaso.solido} sal={e.sal} ancho={70} />
      <path d={`M${c - 52} 210 L${c - 45} 216 V325 H${c + 45} V216 L${c + 50} 210`} fill="none" stroke="#3a3a3a" strokeWidth="3" />
      {[50, 100].map((m) => (
        <g key={m}>
          <line x1={c - 45} x2={c - 30} y1={325 - m * 0.7} y2={325 - m * 0.7} stroke="#3a3a3a" strokeWidth="1.5" />
          <text x={c - 28} y={329 - m * 0.7} fontSize="9">{m}</text>
        </g>
      ))}
      <text x={c} y="205" textAnchor="middle" fontSize="11" fontWeight="700">{f(e.vaso.agua, 0)} mL</text>
    </g>
  )
}

function Lavador() {
  return (
    <g>
      <path d="M505 235 Q505 220 520 220 H540 Q555 220 555 235 V325 H505 Z" fill="#eef7ff" stroke="#3a3a3a" strokeWidth="3" />
      <rect x="505" y="262" width="50" height="63" fill="#cfe6fb" />
      <path d="M525 220 V195 Q525 180 545 180 L580 170" fill="none" stroke="#3a3a3a" strokeWidth="4" />
      <text x="530" y="300" textAnchor="middle" fontSize="10" fontWeight="800">H₂O</text>
    </g>
  )
}

function Probeta({ e }: { e: E }) {
  const c = 660
  const y = 325 - e.probeta.agua * 1.5
  return (
    <g>
      <rect x={c - 16} y={y} width="32" height={325 - y} fill={azul(e.probeta, e.sal)} />
      <path d={`M${c - 16} 140 V325 H${c + 16} V140`} fill="none" stroke="#3a3a3a" strokeWidth="3" />
      <rect x={c - 32} y="325" width="64" height="5" fill="#3a3a3a" />
      {[20, 40, 60, 80, 100].map((m) => (
        <g key={m}>
          <line x1={c - 16} x2={c - 6} y1={325 - m * 1.5} y2={325 - m * 1.5} stroke="#3a3a3a" strokeWidth="1.5" />
          <text x={c + 20} y={329 - m * 1.5} fontSize="9">{m}</text>
        </g>
      ))}
    </g>
  )
}

/** altura del líquido en el matraz aforado: bulbo hasta 92 mL, luego el cuello (aforo en y = 170) */
const nivelMatraz = (v: number) => (v <= 92 ? 325 - (v / 92) * 80 : 245 - (v - 92) * 9.375)

function Matraz({ e }: { e: E }) {
  const c = 820
  const v = e.matraz.agua
  const y = Math.max(115, nivelMatraz(v))
  const forma = `M${c - 7} 115 V248 Q${c - 48} 255 ${c - 48} 290 Q${c - 48} 325 ${c} 325 Q${c + 48} 325 ${c + 48} 290 Q${c + 48} 255 ${c + 7} 248 V115`
  const cerca = v > 96 && v < 104
  const desfase = Math.max(-30, Math.min(30, (v - VOL) * 9.375 * 4))
  return (
    <g>
      <clipPath id="lab-matraz"><path d={`${forma} Z`} /></clipPath>
      <rect x={c - 50} y={y} width="100" height={330 - y} fill={azul(e.matraz, e.sal)} clipPath="url(#lab-matraz)" />
      <Cristales x={c} y={323} g={e.matraz.solido} sal={e.sal} ancho={60} />
      <path d={forma} fill="none" stroke="#3a3a3a" strokeWidth="3" />
      <line x1={c - 11} x2={c + 11} y1="170" y2="170" stroke="#c43c3c" strokeWidth="2" />
      {e.mezclado && <rect x={c - 9} y="104" width="18" height="12" rx="3" fill="#5a4a3a" />}
      <text x={c - 52} y="174" textAnchor="end" fontSize="9" fill="#c43c3c" fontWeight="700">aforo 100 mL</text>
      {cerca && (
        <g>
          <circle cx={c + 72} cy="170" r="36" fill="#fff" stroke="#3a3a3a" strokeWidth="2" />
          <clipPath id="lab-lupa"><circle cx={c + 72} cy="170" r="35" /></clipPath>
          <g clipPath="url(#lab-lupa)">
            <rect x={c + 50} y="120" width="44" height="100" fill="#f6f9fc" />
            <path d={`M${c + 50} ${170 - desfase} Q${c + 72} ${178 - desfase} ${c + 94} ${170 - desfase} V230 H${c + 50} Z`} fill={azul(e.matraz, e.sal)} />
            <line x1={c + 36} x2={c + 108} y1="170" y2="170" stroke="#c43c3c" strokeWidth="2" />
          </g>
          <text x={c + 72} y="220" textAnchor="middle" fontSize="9" fontWeight="700">lupa: menisco</text>
        </g>
      )}
    </g>
  )
}

// ---------- reglas ----------

const RECIPIENTES = ['vaso', 'probeta', 'matraz'] as const
type R = (typeof RECIPIENTES)[number]
const esRec = (id: string): id is R => (RECIPIENTES as readonly string[]).includes(id)
const CAPACIDAD: Record<R, number> = { vaso: 150, probeta: 110, matraz: 105.3 }

function conRec(e: E, id: R, r: Rec): E {
  return { ...e, [id]: r }
}

function echarAgua(e: E, id: R, mL: number): Hecho<E> {
  const r = e[id]
  let agua = r1(r.agua + mL)
  let msg = `Agregas ${f(mL, mL < 1 ? 1 : 0)} mL de agua (${f(agua, 1)} mL en ${nombre(id)}).`
  let aviso = false
  let n: E = e
  if (agua > CAPACIDAD[id]) {
    agua = CAPACIDAD[id]
    msg = `¡Se rebosó ${nombre(id)}! Se perdió líquido con sulfato de cobre.`
    aviso = true
    const perdida = r.agua > 0 ? r.soluto * (mL / (r.agua + mL)) : 0
    n = { ...n, derrame: n.derrame + perdida }
    n = conRec(n, id, { ...r, soluto: r.soluto - perdida, agua })
    return { e: n, msg, aviso }
  }
  n = conRec(n, id, { ...r, agua })
  if (id === 'matraz' && agua > VOL + 0.05 && !e.pasado) {
    n = { ...n, pasado: true }
    msg = `Te pasaste del aforo (${f(agua, 1)} mL). El agua ya no se puede sacar sin cambiar la concentración.`
    aviso = true
  }
  if (id === 'vaso' && e.residuo) n = { ...n, enjuague: true }
  return { e: n, msg, aviso }
}

function nombre(id: string) {
  return { frasco: 'el frasco', balanza: 'la balanza', vaso: 'el vaso', lavador: 'el frasco lavador', probeta: 'la probeta', matraz: 'el matraz' }[id] ?? id
}

const P: Practica<E> = {
  id: 'solucion-molar',
  titulo: 'Prepara 100 mL de solución 0,5 M de sulfato de cobre',
  resumen: 'Calcula, pesa, disuelve y afora. El color muestra la concentración.',
  desdeGrado: 9,
  seguridad:
    'El sulfato de cobre es tóxico si se ingiere e irrita la piel y los ojos: en la vida real se usan guantes y gafas, y los restos van al frasco de residuos, nunca al desagüe (es dañino para el medio ambiente).',
  objetivo: (n) =>
    `Prepara exactamente ${VOL} mL de solución ${f(META, 1)} M de sulfato de cobre${n.grado >= 11 ? ' usando la sal pentahidratada (CuSO₄·5H₂O) del frasco' : ''}. Cuando creas que está lista, pulsa «Comprobar».`,
  inicial: (n) => ({
    sal: n.grado >= 11 ? 'penta' : 'anhidro',
    tara: 0,
    enBalanza: 0,
    vaso: vacio(),
    probeta: vacio(),
    matraz: vacio(),
    pasado: false,
    mezclado: false,
    enjuague: false,
    residuo: false,
    derrame: 0,
    tarado: false,
  }),
  instrumentos: [
    { id: 'frasco', nombre: 'Reactivo', x: 70, ancho: 110, dibujo: (e) => <Frasco e={e} /> },
    {
      id: 'balanza',
      nombre: 'Balanza',
      x: 210,
      ancho: 150,
      dibujo: (e) => <Balanza e={e} />,
      propias: (e) => [
        {
          etiqueta: 'Tarar (poner en cero)',
          aplicar: (x) => ({ e: { ...x, tara: VIDRIO + x.enBalanza, tarado: true }, msg: 'La balanza queda en 0,00 g con el vidrio de reloj encima.' }),
        },
        ...(e.enBalanza > 0
          ? [{ etiqueta: 'Devolver el sólido al frasco', aplicar: (x: E) => ({ e: { ...x, enBalanza: 0 }, msg: 'Devuelves el sólido. (En un laboratorio real, lo pesado de más no se devuelve al frasco para no contaminarlo.)' }) }]
          : []),
      ],
    },
    {
      id: 'vaso',
      nombre: 'Vaso de precipitado',
      x: 380,
      ancho: 150,
      dibujo: (e) => <Vaso e={e} />,
      propias: (e) => [
        {
          etiqueta: 'Agitar con la varilla',
          aplicar: (x) => {
            const v = x.vaso
            if (v.solido <= 0) return { e: x, msg: 'No hay sólido por disolver.' }
            if (v.agua <= 0) return { e: x, msg: 'Primero agrega agua al vaso.', aviso: true }
            const max = v.agua * 0.3 - v.soluto // ≈ 30 g por 100 mL
            const d = Math.max(0, Math.min(v.solido, max))
            const n = { ...v, soluto: v.soluto + d, solido: r2(v.solido - d) }
            return {
              e: { ...x, vaso: n },
              msg: n.solido > 0 ? 'Parte del sólido no se disuelve: agrega un poco más de agua y vuelve a agitar.' : 'El sólido se disolvió por completo.',
              aviso: n.solido > 0,
            }
          },
        },
        ...(e.vaso.agua > 0 || e.vaso.solido > 0 ? [vaciar('vaso')] : []),
      ],
    },
    { id: 'lavador', nombre: 'Agua destilada', x: 535, ancho: 110, dibujo: () => <Lavador /> },
    { id: 'probeta', nombre: 'Probeta 100 mL', x: 660, ancho: 100, dibujo: (e) => <Probeta e={e} />, propias: (e) => (e.probeta.agua > 0 ? [vaciar('probeta')] : []) },
    {
      id: 'matraz',
      nombre: 'Matraz aforado 100 mL',
      x: 840,
      ancho: 210,
      dibujo: (e) => <Matraz e={e} />,
      propias: (e) => [
        {
          etiqueta: 'Tapar e invertir varias veces',
          aplicar: (x) =>
            x.matraz.agua <= 0
              ? { e: x, msg: 'El matraz está vacío.' }
              : { e: { ...x, mezclado: true }, msg: 'Tapas el matraz y lo inviertes varias veces: la solución queda homogénea.' },
        },
        ...(e.matraz.agua > 0 || e.matraz.solido > 0 ? [vaciar('matraz')] : []),
      ],
    },
  ],
  pasar: (e, desde, hacia) => {
    if (desde === hacia) return 'Elige otro instrumento.'
    if (desde === 'frasco') {
      if (hacia !== 'balanza') return 'El reactivo se pesa primero en la balanza, sobre el vidrio de reloj.'
      const mas = (g: number): Boton<E> => ({
        etiqueta: `+${f(g, g < 0.1 ? 2 : g < 1 ? 1 : 0)} g con la espátula`,
        aplicar: (x) => ({ e: { ...x, enBalanza: r2(x.enBalanza + g) }, msg: `La balanza marca ${f(VIDRIO + r2(x.enBalanza + g) - x.tara)} g.` }),
      })
      return [mas(1), mas(0.1), mas(0.01), { etiqueta: '−0,1 g', aplicar: (x) => ({ e: { ...x, enBalanza: Math.max(0, r2(x.enBalanza - 0.1)) } }) }]
    }
    if (desde === 'balanza') {
      if (e.enBalanza <= 0) return 'No hay sólido en la balanza.'
      if (!esRec(hacia)) return 'Pasa el sólido a un recipiente.'
      return [
        {
          etiqueta: `Pasar los ${f(e.enBalanza)} g`,
          aplicar: (x) => {
            const r = x[hacia]
            const n = conRec({ ...x, enBalanza: 0 }, hacia, { ...r, solido: r2(r.solido + x.enBalanza) })
            return {
              e: n,
              msg: hacia === 'vaso' ? 'El sólido queda en el vaso.' : `Echas el sólido directo en ${nombre(hacia)}: es mejor disolverlo antes en un vaso.`,
              aviso: hacia !== 'vaso',
            }
          },
        },
      ]
    }
    if (desde === 'lavador') {
      if (!esRec(hacia)) return 'El agua se agrega a un recipiente.'
      return [10, 1, 0.1].map((mL) => ({ etiqueta: mL === 0.1 ? '+1 gota (0,1 mL)' : `+${mL} mL`, aplicar: (x: E) => echarAgua(x, hacia, mL) }))
    }
    if (esRec(desde)) {
      const r = e[desde]
      if (r.agua <= 0 && r.solido <= 0) return `${nombre(desde)} está vacío.`
      if (!esRec(hacia)) return 'Solo se puede pasar a otro recipiente.'
      return [
        {
          etiqueta: `Pasar todo a ${nombre(hacia)}`,
          aplicar: (x) => {
            const a = x[desde]
            const b = x[hacia]
            // al trasvasar, una película de solución queda pegada a las paredes (≈ 2 %) si hay líquido
            const queda = a.agua > 1 ? 0.02 : 0
            const sol = a.soluto * (1 - queda)
            const agua = r1(a.agua * (1 - queda))
            let nb: Rec = { soluto: b.soluto + sol, solido: r2(b.solido + a.solido), agua: r1(b.agua + agua) }
            let n = conRec(x, desde, { soluto: a.soluto - sol, solido: 0, agua: r1(a.agua - agua) })
            let msg = `Pasas el contenido a ${nombre(hacia)}.`
            let aviso = false
            if (nb.agua > CAPACIDAD[hacia]) {
              const perdida = nb.soluto * ((nb.agua - CAPACIDAD[hacia]) / nb.agua)
              nb = { ...nb, soluto: nb.soluto - perdida, agua: CAPACIDAD[hacia] }
              n = { ...n, derrame: n.derrame + perdida }
              msg = `¡Se rebosó ${nombre(hacia)}!`
              aviso = true
            }
            n = conRec(n, hacia, nb)
            if (desde === 'vaso' && queda) {
              n = { ...n, residuo: true, enjuague: x.residuo && x.enjuague }
              if (!x.residuo) msg += ' Quedaron gotas azules en las paredes del vaso.'
            }
            if (hacia === 'matraz' && nb.agua > VOL + 0.05 && !x.pasado) {
              n = { ...n, pasado: true }
              msg = 'Te pasaste del aforo.'
              aviso = true
            }
            if (a.solido > 0) {
              msg += ' Pasaste sólido sin disolver.'
              aviso = true
            }
            return { e: n, msg, aviso }
          },
        },
      ]
    }
    return 'Desde aquí no se puede pasar nada.'
  },
  pistas: (e, n) => {
    const m = masaMeta(e.sal)
    return [
      { texto: `Calcula la masa: m = M × V × masa molar${n.calculadora ? ' (usa la calculadora)' : ''}.`, hecho: e.tarado || e.enBalanza > 0 || e.vaso.solido + e.vaso.soluto > 0 },
      { texto: 'Pon la balanza en cero con el vidrio de reloj encima (Tarar).', hecho: e.tarado },
      { texto: `Pesa ${n.grado < 11 ? `${f(m)} g de ` : 'la masa calculada de '}sulfato de cobre.`, hecho: e.vaso.solido + e.vaso.soluto > 0 },
      { texto: 'Pasa el sólido al vaso y agrega unos 50 mL de agua.', hecho: e.vaso.agua >= 30 || e.matraz.agua > 0 },
      { texto: 'Agita con la varilla hasta que no quede sólido.', hecho: e.vaso.soluto > 0 && e.vaso.solido === 0 },
      { texto: 'Pasa la solución al matraz aforado (no a la probeta).', hecho: e.matraz.soluto > 0 },
      { texto: 'Enjuaga el vaso con un poco de agua y pásala también al matraz.', hecho: e.residuo && e.enjuague && e.vaso.agua < 1 },
      { texto: 'Completa con agua hasta el aforo: al final, gota a gota, mirando la lupa.', hecho: e.matraz.agua >= VOL - 0.05 },
      { texto: 'Tapa e invierte el matraz para mezclar. Luego, «Comprobar».', hecho: e.mezclado },
    ]
  },
  Calculadora,
  comprobar: (e, n) => {
    const enMatraz = e.matraz.agua > 0
    const r = enMatraz ? e.matraz : e.probeta
    const lineas: string[] = []
    const mm = MM[e.sal]
    const meta = masaMeta(e.sal)
    const total = e.matraz.soluto + e.matraz.solido + e.probeta.soluto + e.probeta.solido + e.vaso.soluto + e.vaso.solido + e.derrame
    if (r.agua <= 0) {
      return { ok: false, titulo: 'Todavía no hay solución', lineas: ['Prepárala en el matraz aforado y vuelve a comprobar.'], datos: [] }
    }
    // la probeta mide con ±1 mL: el volumen real no es exactamente el que se lee
    const vReal = enMatraz ? r.agua : r.agua + 0.9
    const M = (r.soluto + r.solido) / mm / (vReal / 1000)
    const err = ((M - META) / META) * 100
    const tol = n.grado >= 11 ? 1 : 2
    let ok = Math.abs(err) <= tol

    if (!enMatraz) {
      ok = false
      lineas.push('Usaste la probeta: mide con un error de ±1 mL, no sirve para preparar soluciones exactas. Usa el matraz aforado.')
    }
    if (Math.abs(total - meta) / meta > 0.02) {
      if (Math.abs(total - META * 1 * mm) / (META * mm) < 0.05)
        lineas.push(`Pesaste ${f(total)} g: calculaste con 1 L en vez de 0,1 L. Recuerda pasar los mL a litros (100 mL = 0,1 L).`)
      else if (e.sal === 'penta' && Math.abs(total - masaMeta('anhidro')) / masaMeta('anhidro') < 0.03)
        lineas.push(`Pesaste ${f(total)} g: usaste la masa molar del sulfato anhidro (159,6 g/mol), pero tu frasco es el pentahidratado (249,7 g/mol). El agua de cristalización también pesa.`)
      else lineas.push(`Pesaste ${f(total)} g de sulfato de cobre y se necesitaban ${f(meta)} g.`)
    }
    if (!e.tarado) lineas.push(`No taraste la balanza: la lectura incluía los ${f(VIDRIO)} g del vidrio de reloj.`)
    if (r.solido > 0) {
      ok = false
      lineas.push('Quedó sólido sin disolver: hay que disolverlo en el vaso antes de pasarlo al matraz.')
    }
    if (e.derrame > 0) lineas.push(`Se derramaron unos ${f(e.derrame)} g de soluto al rebosarse un recipiente.`)
    if (e.residuo && !e.enjuague && e.vaso.soluto > 0.01)
      lineas.push(`Quedaron ${f(e.vaso.soluto)} g de soluto pegados al vaso: enjuágalo y pasa ese agua al matraz.`)
    if (enMatraz) {
      if (e.pasado) {
        ok = false
        lineas.push(`Te pasaste del aforo (${f(r.agua, 1)} mL). Cuando eso pasa, toca empezar de nuevo.`)
      } else if (r.agua < VOL - 0.05) {
        ok = false
        lineas.push(`Falta agua: el líquido está en ${f(r.agua, 1)} mL, por debajo del aforo. La parte de abajo del menisco debe tocar la línea.`)
      }
      if (!e.mezclado) {
        if (n.grado >= 11) ok = false
        lineas.push('No mezclaste: tapa el matraz e inviértelo varias veces para que la concentración sea igual en toda la solución.')
      }
    }
    if (ok && !lineas.length) lineas.push('Masa correcta, todo el soluto disuelto y trasvasado, aforo exacto y solución homogénea.')

    return {
      ok,
      titulo: ok ? `¡Bien hecho! Tu solución es ${f(M, 3)} M` : `Tu solución es ${f(M, 3)} M (se buscaba ${f(META, 3)} M)`,
      lineas,
      datos: [
        ['Sustancia', e.sal === 'penta' ? 'CuSO₄·5H₂O (249,7 g/mol)' : 'CuSO₄ (159,6 g/mol)'],
        ['Masa necesaria', `${f(meta)} g`],
        ['Masa usada', `${f(total)} g`],
        ['Volumen final', `${f(r.agua, 1)} mL en ${enMatraz ? 'matraz aforado' : 'probeta'}`],
        ['Molaridad obtenida', `${f(M, 3)} M`],
        ['Error', `${err >= 0 ? '+' : ''}${f(err, 1)} %`],
      ],
    }
  },
}

function vaciar(id: R): Boton<E> {
  return {
    etiqueta: 'Vaciar al frasco de residuos',
    aplicar: (x) => ({ e: { ...conRec(x, id, vacio()), ...(id === 'matraz' ? { pasado: false, mezclado: false } : {}) }, msg: `Vacías ${nombre(id)} en el frasco de residuos (el cobre no va al desagüe).` }),
  }
}

function Calculadora({ n }: { n: Nivel }) {
  const [M, setM] = useState('0,5')
  const [V, setV] = useState('')
  const [mm, setMm] = useState('')
  const num = (s: string) => parseFloat(s.replace(',', '.'))
  const m = num(M) * num(V) * num(mm)
  const campo = 'w-24 rounded-lg border border-[var(--linea)] bg-white px-2 py-1 text-right'
  return (
    <div className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
      <h3 className="font-semibold">Calculadora</h3>
      <p className="mt-1 text-[var(--suave)]">m = M × V × masa molar{n.grado < 11 ? ' (el volumen va en litros)' : ''}</p>
      <div className="mt-2 grid grid-cols-[auto_auto] items-center gap-2">
        <span>M (mol/L)</span>
        <input className={campo} value={M} onChange={(ev) => setM(ev.target.value)} />
        <span>V (L)</span>
        <input className={campo} value={V} placeholder="¿?" onChange={(ev) => setV(ev.target.value)} />
        <span>Masa molar (g/mol)</span>
        <input className={campo} value={mm} placeholder="¿?" onChange={(ev) => setMm(ev.target.value)} />
      </div>
      <p className="mt-2 text-base font-bold">m = {Number.isFinite(m) ? `${f(m)} g` : '…'}</p>
    </div>
  )
}

export default P
