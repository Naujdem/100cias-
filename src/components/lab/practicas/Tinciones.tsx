import { useEffect, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import MicroscopioPanel from '../MicroscopioPanel.tsx'
import { desenfoque } from './Microscopio.tsx'
import type { Est } from './Microscopio.tsx'
import { Caneca, Cebolla, Gotero, MicroscopioMini, Palillo, Papa, Piseta, Portaobjetos, Reloj } from '../dibujos.tsx'
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

/** dibujo de la muestra teñida (300 × 300) y el velo del fondo, para el microscopio */
function muestraSimple(s: S): { dibujo: ReactNode; velo: { color: string; opacidad: number } } {
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
  return { dibujo, velo: { color: tono(s.col, 1), opacidad: fondo } }
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

const MUESTRA_COLOR: Record<Muestra, string> = { cebolla: '#f1e6cf', mucosa: '#f2d5d0', papa: '#f4e2a8' }
const GOTERO_COLOR: Record<Col, string> = { ninguno: '#ccc', lugol: '#a0601a', azul: '#2a55c4' }

interface SM { muestra: Muestra | null; col: Col; t: number; lavado: boolean; ver: boolean }
const VACIA: SM = { muestra: null, col: 'ninguno', t: 0, lavado: false, ver: false }

function Simples({ grado }: { grado: number }) {
  const [s, setS] = useState<SM>(VACIA)
  const cambiar = (p: Partial<SM>) => setS((x) => ({ ...x, ver: false, ...p }))
  // temporizador: cada toque suma 15 s a la cuenta regresiva; al llegar a 0 suena
  const [cuenta, setCuenta] = useState(0)
  const [alarma, setAlarma] = useState(false)
  const actuando = s.col !== 'ninguno' && !s.lavado
  useEffect(() => {
    const id = window.setInterval(() => {
      if (actuando) setS((x) => ({ ...x, t: x.t + 1 })) // el colorante actúa en tiempo real hasta lavar
      setCuenta((c) => {
        if (c === 1) setAlarma(true)
        return Math.max(0, c - 1)
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [actuando])
  const sv: S = { muestra: s.muestra ?? 'cebolla', col: s.col, t: s.t, lavado: s.lavado }
  const r = revisarSimple(sv)
  const vista = muestraSimple(sv)
  const [est, setEst] = useState<Est | null>(null)
  const listo = !!est && est.obj >= 2 && !est.rota && desenfoque(est) < 1.2
  const tinte = s.col !== 'ninguno' ? tono(s.col, Math.min(0.85, 0.2 + intensidad(sv) * 0.4)) : undefined
  const piezas: Pieza[] = [
    { id: 'cebolla', nombre: 'Cebolla', x: 70, y: 330, ancho: 70, alto: 50, tomable: true, dibujo: <Cebolla /> },
    { id: 'mucosa', nombre: 'Palillo (mejilla)', x: 150, y: 320, ancho: 50, alto: 80, tomable: true, dibujo: <Palillo /> },
    { id: 'papa', nombre: 'Papa', x: 230, y: 335, ancho: 70, alto: 40, tomable: true, dibujo: <Papa /> },
    { id: 'lugol', nombre: 'Lugol', x: 335, y: 312, ancho: 50, alto: 96, tomable: true, color: GOTERO_COLOR.lugol, dibujo: <Gotero color={GOTERO_COLOR.lugol} etiqueta="LUGOL" oscuro /> },
    { id: 'azul', nombre: 'Azul de metileno', x: 415, y: 312, ancho: 50, alto: 96, tomable: true, color: GOTERO_COLOR.azul, dibujo: <Gotero color={GOTERO_COLOR.azul} etiqueta="AZUL" /> },
    { id: 'lamina', nombre: 'Lámina', x: 550, y: 345, ancho: 130, alto: 30, tomable: true, dibujo: <Portaobjetos muestra={s.muestra ? MUESTRA_COLOR[s.muestra] : undefined} tinte={tinte} charco={s.col !== 'ninguno' && !s.lavado ? tono(s.col, 0.8) : undefined} /> },
    { id: 'piseta', nombre: 'Piseta con agua', x: 680, y: 305, ancho: 60, alto: 106, tomable: true, color: '#a9d3f5', dibujo: <Piseta /> },
    { id: 'reloj', nombre: 'Temporizador (toca: +15 s)', x: 780, y: 300, ancho: 72, alto: 72, alTocar: () => { setAlarma(false); setCuenta((c) => c + 15) }, dibujo: <Reloj s={cuenta} alarma={alarma} /> },
    { id: 'micro', nombre: 'Microscopio', x: 880, y: 290, ancho: 90, alto: 140, dibujo: <MicroscopioMini lamina={s.ver} /> },
    { id: 'caneca', nombre: 'Residuos', x: 960, y: 325, ancho: 54, alto: 76, dibujo: <Caneca /> },
  ]
  const destinos = (de: string) => (de === 'lamina' ? ['micro', 'caneca'] : ['lamina'])
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'lamina') {
      if (en === 'micro') return s.muestra ? { anim: 'poner', hecho: () => setS((x) => ({ ...x, ver: true })) } : 'La lámina está vacía: primero ponle una muestra.'
      if (en === 'caneca') return { anim: 'poner', hecho: () => { setS(VACIA); setCuenta(0); setAlarma(false) } }
      return 'Lleva la lámina al microscopio para observarla, o a la caneca para empezar otra.'
    }
    if (en !== 'lamina') return 'Eso va sobre la lámina.'
    if (de === 'cebolla' || de === 'mucosa' || de === 'papa') {
      if (s.muestra) return 'La lámina ya tiene muestra. Bótala en la caneca para empezar otra.'
      return { anim: de === 'mucosa' ? 'frotar' : 'poner', hecho: () => cambiar({ muestra: de }) }
    }
    if (!s.muestra) return 'Primero pon una muestra en la lámina.'
    if (de === 'lugol' || de === 'azul') {
      if (s.col !== 'ninguno' && s.col !== de) return `Ya tiene ${COLORANTES[s.col].toLowerCase()}. Para probar otro colorante, empieza una lámina nueva.`
      if (s.col === de) return 'Ya tiene ese colorante. Toca el reloj para dejarlo actuar.'
      return { anim: 'gotas', gotas: 2, hecho: () => cambiar({ col: de, t: 0, lavado: false }) }
    }
    if (de === 'piseta') {
      if (s.col === 'ninguno') return 'No hay colorante que lavar.'
      if (s.lavado) return 'Ya está lavada.'
      return { anim: 'verter', hecho: () => cambiar({ lavado: true }) }
    }
    return 'No se puede.'
  }
  return (
    <div className="flex flex-col gap-3">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        Pon una muestra en la lámina y échale el colorante: empieza a actuar enseguida. Programa el temporizador (cada toque, 15 s), lava el exceso cuando suene con la piseta y lleva la lámina al microscopio. {s.muestra === 'mucosa' ? 'La mejilla se raspa suavemente con un palillo limpio, que luego se bota.' : ''}
      </p>
      <MesaViva desde={190} piezas={piezas} destinos={destinos} soltar={soltar} />
      {s.col !== 'ninguno' && <p className="text-sm">{COLORANTES[s.col]} en contacto: <b>{s.t} s</b>{s.lavado ? ' (lavado: ya no actúa)' : ' y contando…'}{alarma ? <b className="ml-2 text-[#e0604a]">⏰ ¡Tiempo! Lava con la piseta.</b> : null}</p>}
      {s.ver && <MicroscopioPanel grado={grado} muestra={vista.dibujo} velo={vista.velo} onEstado={setEst} />}
      <div className="flex flex-col gap-2">
          {s.ver && !listo && <p className="text-sm font-semibold">Enfoca la muestra con el objetivo de 40x (400x) para revisar la tinción.</p>}
          {s.ver && listo && (
            <div className={`w-full rounded-xl border-2 p-3 text-sm ${r.ok ? 'border-[#2e7d5a] bg-[#eaf5ee]' : 'border-[#b5462c] bg-[#fbeee9]'}`}>
              <p className="font-semibold">{MUESTRAS[s.muestra ?? 'cebolla']} · {COLORANTES[s.col]} · 400x</p>
              <ul className="list-disc pl-5">{r.lineas.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          )}
          {grado < 11 && <p className="text-xs text-[var(--suave)]">Pista: el lugol actúa en unos 30 s y el azul de metileno en cerca de 1 minuto.</p>}
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

const GRAM_COLOR: Record<Paso['p'], string> = { cv: '#5b2a8c', lugol: '#a0601a', alcohol: '#e8eef2', safranina: '#d9406a', lavar: '#a9d3f5' }
const ETIQ: Record<Paso['p'], string> = { cv: 'CRISTAL V.', lugol: 'LUGOL', alcohol: 'ALCOHOL', safranina: 'SAFRANINA', lavar: 'AGUA' }

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

  const bacterias = (<g>
            
            {Array.from({ length: 9 }, (_, k) => {
              const x = 30 + ((k * 71) % 230)
              const y = 30 + ((k * 47) % 230)
              return (
                <g key={`p${k}`} transform={`rotate(${k * 40} ${x} ${y})`}>
                  {[0, 1, 2].map((j) => <rect key={j} x={x + j * 24} y={y} width="22" height="7" rx="3.5" fill={colorDe(pos)} />)}
                </g>
              )
            })}
            {Array.from({ length: 16 }, (_, k) => {
              const x = 20 + ((k * 89) % 260)
              const y = 15 + ((k * 59) % 270)
              return <rect key={`n${k}`} x={x} y={y} width="13" height="6" rx="3" transform={`rotate(${k * 67} ${x} ${y})`} fill={colorDe(neg)} />
            })}
</g>)
  const [est, setEst] = useState<Est | null>(null)
  const listo = !!est && est.obj === 3 && est.aceite && !est.rota && desenfoque(est) < 1.2
  const ultimo = [...pasos].reverse().find((p) => p.p !== 'lavar')
  const charco = pasos.length && pasos[pasos.length - 1].p !== 'lavar' ? GRAM_COLOR[pasos[pasos.length - 1].p] : undefined
  const piezas: Pieza[] = [
    ...(['cv', 'lugol', 'alcohol', 'safranina'] as const).map((p, k): Pieza => ({ id: p, nombre: NOMBRE[p] + (p === 'alcohol' ? ' (cada gota: 5 s)' : ''), x: 70 + k * 85, y: 312, ancho: 50, alto: 96, tomable: true, color: GRAM_COLOR[p], dibujo: <Gotero color={GRAM_COLOR[p]} etiqueta={ETIQ[p]} oscuro={p === 'lugol'} /> })),
    { id: 'lamina', nombre: 'Frotis', x: 520, y: 345, ancho: 130, alto: 30, tomable: true, dibujo: <Portaobjetos muestra="#e9e2d6" tinte={ultimo ? GRAM_COLOR[ultimo.p] + '88' : undefined} charco={charco} cubre={false} /> },
    { id: 'piseta', nombre: 'Lavar con agua', x: 660, y: 305, ancho: 60, alto: 106, tomable: true, color: '#a9d3f5', dibujo: <Piseta /> },
    { id: 'micro', nombre: 'Microscopio (1000x)', x: 800, y: 290, ancho: 90, alto: 140, dibujo: <MicroscopioMini lamina={ver} /> },
    { id: 'caneca', nombre: 'Residuos (nuevo frotis)', x: 930, y: 325, ancho: 54, alto: 76, dibujo: <Caneca /> },
  ]
  const destinos = (de: string) => (de === 'lamina' ? ['micro', 'caneca'] : ['lamina'])
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'lamina') {
      if (en === 'micro') return { anim: 'poner', hecho: () => setVer(true) }
      if (en === 'caneca') return { anim: 'poner', hecho: () => { setPasos([]); setVer(false) } }
      return 'Lleva el frotis al microscopio o a la caneca.'
    }
    if (en !== 'lamina') return 'Eso va sobre el frotis.'
    if (de === 'piseta') return { anim: 'verter', hecho: () => agregar('lavar') }
    return { anim: 'gotas', gotas: de === 'alcohol' ? 1 : 3, hecho: () => agregar(de as Paso['p']) }
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
          <b>Muestra:</b> frotis ya fijado con calor de <i>Lactobacillus</i> (del yogur) y <i>Escherichia coli</i>. Echa los reactivos sobre el frotis en el orden que creas y lava con la piseta. Cada gota de alcohol son 5 s de decoloración.
        </p>
        <MesaViva desde={190} piezas={piezas} destinos={destinos} soltar={soltar} />
        <ol className="flex flex-wrap gap-1 text-xs">
          {pasos.map((p, k) => <li key={k} className="rounded-full bg-[var(--tarjeta)] px-2 py-1">{NOMBRE[p.p]}{p.p === 'alcohol' ? ` ${p.s} s` : ''}</li>)}
        </ol>
        <p className="text-xs text-[var(--suave)]">⚠ El cristal violeta y la safranina manchan la piel y la ropa; el alcohol es inflamable: lejos del mechero.</p>
      </div>
      <div className="flex flex-col gap-2 lg:col-span-2">
        {ver && <MicroscopioPanel grado={11} maxObj={3} muestra={bacterias} onEstado={setEst} />}
        {ver && !listo && <p className="text-sm font-semibold">Enfoca a 1000x: objetivo de 100x con una gota de aceite de inmersión.</p>}
        {ver && listo && (
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
