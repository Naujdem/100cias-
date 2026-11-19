import { useEffect, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Caneca, Reloj } from '../dibujos.tsx'

// Laboratorio de Biología (PLAN-LABORATORIOS.md): fermentación con levadura y globo, en mesa viva.
// Cada botella se arma a mano: levadura, cucharadas de azúcar, agua (fría, tibia o muy caliente) y el globo.
// Desde que se pone el globo corre su tiempo (acelerado: 1 s = 1 min). Se mide con la cinta y el gas se
// prueba llevando la botella al vaso con agua de cal. Diseño: una variable a la vez y un control.

interface Botella { levadura: boolean; azucar: 0 | 1 | 2; temp: 10 | 35 | 70 }
const T: Record<Botella['temp'], { n: string; k: number }> = { 10: { n: 'Fría', k: 0.25 }, 35: { n: 'Tibia', k: 1 }, 70: { n: 'Muy caliente', k: 0 } }
const AZ = [0.04, 0.6, 1]
const COLORES = ['#e0607e', '#5fa8d3', '#f2a03d', '#7cc36e']

const tasa = (b: Botella) => (b.levadura ? AZ[b.azucar] * T[b.temp].k : 0)
/** diámetro del globo (cm) a los «min» minutos */
const diam = (b: Botella, min: number) => {
  const r = tasa(b)
  const t = Math.max(0, min - 8) // la levadura tarda en arrancar
  return 4 + 14 * (1 - Math.exp((-r * t) / 45))
}
const f = (x: number, d = 1) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })

interface B { levadura: boolean; azucar: number; temp: 10 | 35 | 70 | null; globo: boolean; t: number; cal: boolean; medida: { t: number; cm: number } | null }
const VACIA: B = { levadura: false, azucar: 0, temp: null, globo: false, t: 0, cal: false, medida: null }
const JARRAS: { t: 10 | 35 | 70; c: string }[] = [{ t: 10, c: 'rgba(170,210,240,0.8)' }, { t: 35, c: 'rgba(240,210,160,0.8)' }, { t: 70, c: 'rgba(230,150,120,0.8)' }]
const comoBotella = (b: B): Botella => ({ levadura: b.levadura, azucar: Math.min(2, b.azucar) as 0 | 1 | 2, temp: b.temp ?? 35 })

function DibBotella({ b, k }: { b: B; k: number }) {
  const d = b.globo ? diam(comoBotella(b), b.t) : 0
  const r = d * 1.7
  const tasaB = b.temp ? tasa(comoBotella(b)) : 0
  const espuma = b.globo && tasaB > 0.1 && b.t > 8 ? Math.min(14, tasaB * (b.t - 8) * 0.35) : 0
  return (
    <g>
      {b.globo && <ellipse cx="0" cy={-66 - r * 0.9} rx={r * 0.85} ry={r} fill={COLORES[k]} opacity="0.9" />}
      {b.globo && <path d="M-6 -66 Q0 -72 6 -66 V-58 H-6 Z" fill={COLORES[k]} />}
      <path d="M-7 -66 V-48 Q-28 -38 -28 -16 V60 H28 V-16 Q28 -38 7 -48 V-66" fill="rgba(255,255,255,0.6)" stroke="#2b2b2b" strokeWidth="2.5" />
      {b.temp && <rect x="-26" y="22" width="52" height="37" fill={b.temp === 70 ? 'rgba(200,120,90,0.35)' : b.azucar ? 'rgba(230,200,120,0.5)' : 'rgba(170,210,240,0.5)'} />}
      {espuma > 0 && <rect x="-26" y={22 - espuma} width="52" height={espuma} fill="#fbf4e2" />}
      {b.levadura && Array.from({ length: 8 }, (_, j) => <circle key={j} cx={-20 + ((j * 13) % 40)} cy={54 - ((j * 7) % 12)} r="2" fill="#a07a3a" />)}
      {b.azucar > 0 && !b.temp && Array.from({ length: b.azucar * 4 }, (_, j) => <rect key={`a${j}`} x={-18 + ((j * 11) % 36)} y={55 - ((j * 5) % 6)} width="3" height="3" fill="#fff" stroke="#bbb" strokeWidth="0.5" />)}
      <text y="76" textAnchor="middle" fontSize="11" fontWeight="800" fill="#3a2f22">Bot. {k + 1}{b.globo ? ` · ${b.t} min` : ''}</text>
    </g>
  )
}

export default function Fermentacion({ grado }: { grado: number }) {
  const [bs, setBs] = useState<B[]>([VACIA, VACIA, VACIA, VACIA])
  const [cuenta, setCuenta] = useState(0)
  const [alarma, setAlarma] = useState(false)
  const corre = bs.some((b) => b.globo && b.t < 120)
  useEffect(() => {
    const id = window.setInterval(() => {
      if (corre) setBs((x) => x.map((b) => (b.globo && b.t < 120 ? { ...b, t: b.t + 1 } : b)))
      setCuenta((c) => { if (c > 0 && c <= 60) setAlarma(true); return Math.max(0, c - 60) })
    }, 1000)
    return () => window.clearInterval(id)
  }, [corre])
  const cambiar = (k: number, p: Partial<B>) => setBs((x) => x.map((b, j) => (j === k ? { ...b, ...p } : b)))
  const piezas: Pieza[] = [
    { id: 'levadura', nombre: 'Levadura (cucharita)', x: 60, y: 345, ancho: 60, alto: 50, tomable: true, color: '#c8a06a', dibujo: <g><rect x="-22" y="-18" width="44" height="36" rx="4" fill="#f3e3b8" stroke="#2b2b2b" strokeWidth="2" /><text y="4" textAnchor="middle" fontSize="9" fontWeight="800">LEVADURA</text></g> },
    { id: 'azucar', nombre: 'Azúcar (1 cucharada)', x: 130, y: 345, ancho: 60, alto: 50, tomable: true, color: '#ffffff', dibujo: <g><rect x="-22" y="-18" width="44" height="36" rx="4" fill="#fff" stroke="#2b2b2b" strokeWidth="2" /><text y="4" textAnchor="middle" fontSize="9" fontWeight="800">AZÚCAR</text></g> },
    ...JARRAS.map((j, k) => ({ id: `agua${j.t}`, nombre: `Agua ${T[j.t].n.toLowerCase()}`, x: 205 + k * 62, y: 335, ancho: 54, alto: 70, tomable: true, color: j.c, dibujo: <g><path d="M-20 -26 H20 V26 Q20 32 14 32 H-14 Q-20 32 -20 26 Z" fill={j.c} stroke="#2b2b2b" strokeWidth="2" /><path d="M20 -16 Q32 -10 20 10" fill="none" stroke="#2b2b2b" strokeWidth="2" /><text y="48" textAnchor="middle" fontSize="9" fontWeight="700">{T[j.t].n}</text></g> })),
    { id: 'globos', nombre: 'Globos', x: 410, y: 350, ancho: 50, alto: 40, tomable: true, dibujo: <g>{COLORES.map((c, k) => <ellipse key={k} cx={-12 + k * 8} cy={-4 + (k % 2) * 6} rx="9" ry="12" fill={c} stroke="#2b2b2b" strokeWidth="1" />)}</g> },
    ...bs.map((b, k) => ({ id: `b${k}`, nombre: `Botella ${k + 1}`, x: 500 + k * 95, y: 320, ancho: 70, alto: 150, tomable: b.globo, dibujo: <DibBotella b={b} k={k} /> })),
    { id: 'cinta', nombre: 'Cinta métrica (mide el globo)', x: 885, y: 370, ancho: 56, alto: 40, tomable: true, dibujo: <g><circle r="16" fill="#f2c94c" stroke="#2b2b2b" strokeWidth="2" /><circle r="5" fill="#555" /><path d="M16 4 H34" stroke="#f2c94c" strokeWidth="6" /></g> },
    { id: 'cal', nombre: 'Vaso con agua de cal', x: 950, y: 355, ancho: 50, alto: 60, dibujo: <g><path d="M-20 -24 V24 H20 V-24" fill="#eef7ff" stroke="#2b2b2b" strokeWidth="2" /><text y="40" textAnchor="middle" fontSize="9" fontWeight="700">Agua de cal</text></g> },
    { id: 'reloj', nombre: 'Temporizador (toca: +15 min)', x: 885, y: 240, ancho: 72, alto: 72, alTocar: () => { setAlarma(false); setCuenta((c) => c + 900) }, dibujo: <Reloj s={cuenta} alarma={alarma} aviso="¡Mide!" /> },
    { id: 'caneca', nombre: 'Residuos (toca: armar de nuevo)', x: 960, y: 245, ancho: 54, alto: 76, alTocar: () => { setBs([VACIA, VACIA, VACIA, VACIA]); setCuenta(0); setAlarma(false) }, dibujo: <Caneca /> },
  ]
  const botellas = bs.map((_, k) => `b${k}`)
  const destinos = (de: string) => (de.startsWith('b') ? ['cal'] : botellas)
  const soltar = (de: string, en: string): Uso | string => {
    if (de.startsWith('b')) {
      if (en !== 'cal') return 'Para probar el gas, lleva la botella al vaso con agua de cal.'
      const k = parseInt(de.slice(1), 10)
      if (bs[k].cal) return 'Ya probaste el gas de esa botella.'
      return { anim: 'verter', hecho: () => cambiar(k, { cal: true }) }
    }
    if (!en.startsWith('b')) return 'Eso va en una botella.'
    const k = parseInt(en.slice(1), 10)
    const b = bs[k]
    if (de === 'cinta') {
      if (!b.globo) return 'Esa botella no tiene globo que medir.'
      return { anim: 'frotar', hecho: () => setBs((x) => x.map((y, j) => (j === k ? { ...y, medida: { t: y.t, cm: Math.round(diam(comoBotella(y), y.t) * Math.PI * 10) / 10 } } : y))) }
    }
    if (b.globo) return 'Ya tiene el globo puesto: si la abres se escapa el gas.'
    if (de === 'levadura') return b.levadura ? 'Ya tiene levadura.' : { anim: 'polvo', hecho: () => cambiar(k, { levadura: true }) }
    if (de === 'azucar') return b.azucar >= 2 ? 'Con dos cucharadas basta.' : { anim: 'polvo', hecho: () => cambiar(k, { azucar: b.azucar + 1 }) }
    if (de.startsWith('agua')) return b.temp ? 'Ya tiene agua.' : { anim: 'verter', hecho: () => cambiar(k, { temp: parseInt(de.slice(4), 10) as 10 | 35 | 70 }) }
    if (de === 'globos') return b.temp ? { anim: 'poner', hecho: () => cambiar(k, { globo: true, t: 0 }) } : 'Primero el agua: el globo se pone de último.'
    return 'No se puede.'
  }
  const armadas = bs.every((b) => b.globo)
  const control = bs.some((b) => b.globo && !b.levadura)
  const todasMedidas = bs.every((b) => b.medida && b.medida.t >= 45)
  const max = Math.max(1, ...bs.map((b) => b.medida?.cm ?? 0))
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        La levadura es un hongo que, sin oxígeno, se come el azúcar y produce <b>gas</b> y <b>alcohol</b>: la <b>fermentación</b>. Arma cuatro botellas con levadura, azúcar y agua, y ponle un globo a cada una: desde ese momento corre su tiempo (acelerado: 1 s = 1 min). Mide los globos con la cinta y prueba el gas en el agua de cal. Para que la comparación sirva, cambia <b>una sola cosa</b> a la vez y deja una botella de <b>control</b>.
      </p>
      <MesaViva desde={190} piezas={piezas} destinos={destinos} soltar={soltar} />
      {armadas && !control && <p className="text-sm font-semibold text-[#b5462c]">⚠ No hay botella de control (sin levadura): ¿cómo sabrías que el gas lo hace la levadura?</p>}
      {bs.some((b) => b.medida || b.cal) && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-[var(--tarjeta)] p-3">
            <p className="text-sm font-semibold">Contorno del globo (cm)</p>
            {bs.map((b, k) => (
              <div key={k} className="mt-2 flex items-center gap-2 text-sm">
                <span className="w-16">Bot. {k + 1}</span>
                {b.medida ? <><div className="h-5 rounded" style={{ width: `${(b.medida.cm / max) * 60}%`, background: COLORES[k] }} /><b>{f(b.medida.cm)}</b><span className="text-xs text-[var(--suave)]">a los {b.medida.t} min</span></> : <span className="text-xs text-[var(--suave)]">sin medir</span>}
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
            <p className="font-semibold">Agua de cal</p>
            {bs.map((b, k) => b.cal && <p key={k}>Bot. {k + 1}: <b>{b.globo && diam(comoBotella(b), b.t) > 6 ? 'turbia (lechosa)' : 'clara'}</b></p>)}
            {bs.some((b) => b.cal) && <p className="mt-2">El agua de cal se pone <b>turbia (lechosa)</b> con dióxido de carbono (CO₂): el gas de la fermentación es CO₂.</p>}
          </div>
        </div>
      )}
      {todasMedidas && (
        <div className="rounded-xl bg-[#eaf5ee] p-3 text-sm">
          <p><b>Conclusiones:</b> sin levadura no hay gas (control). Sin azúcar casi no hay: es el alimento de la levadura. En agua fría trabaja lento, y en agua muy caliente se muere. Tibia, como la del cuerpo, es la mejor.</p>
          {grado >= 9 && <p className="mt-1">Ecuación: C₆H₁₂O₆ → 2 C₂H₅OH (alcohol) + 2 CO₂. Por eso el pan se esponja (el CO₂ queda atrapado en la masa) y la chicha y el guarapo tienen alcohol.</p>}
          {grado >= 11 && <p className="mt-1">Es respiración <b>anaerobia</b>: sin oxígeno, la levadura saca solo 2 ATP por glucosa, frente a unos 30 de la respiración aerobia.</p>}
        </div>
      )}
      <p className="text-xs text-[var(--suave)]">Versión casera: botellas plásticas, levadura de pan, azúcar o panela, agua y globos. El agua «muy caliente» la prepara un adulto.</p>
    </div>
  )
}
