import { useEffect, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Caneca } from '../dibujos.tsx'

// Laboratorio de Química 7 (PLAN-LABORATORIOS.md): reactivo límite con globos, en mesa viva.
// Cinco botellas con vinagre (de a 25 mL) y cinco globos con bicarbonato (de a 1 g). Se pone cada globo en una
// botella y se levanta (soltándolo otra vez en ella): el globo se infla en tiempo real. Se mide el contorno con la
// cinta. Los globos crecen hasta que el ácido se acaba; desde ahí sobra bicarbonato.
// Modelo: vinagre al 5 % (densidad 1,01), 24,5 L/mol, globo esférico.

const f = (x: number, d = 1) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })
const VM = 24.5
const COLORES = ['#e0607e', '#5fa8d3', '#f2a03d', '#7cc36e', '#a678d6']
const N = 5

interface Bot { vin: number; globo: number | null; levantado: boolean; t: number; medida: number | null }
const nueva = (): Bot => ({ vin: 0, globo: null, levantado: false, t: 0, medida: null })

function reaccion(vin: number, bic: number) {
  const nAc = (vin * 1.01 * 0.05) / 60
  const nBic = bic / 84
  const n = Math.min(nAc, nBic)
  const V = n * VM // L
  const r = Math.cbrt((3 * V * 1000) / (4 * Math.PI)) // cm
  return { nAc, nBic, n, V, C: 2 * Math.PI * r, sobra: nBic > nAc ? (nBic - nAc) * 84 : 0, limite: nBic > nAc ? 'vinagre' : nBic < nAc ? 'bicarbonato' : 'ninguno' }
}

export default function ReactivoLimite({ grado }: { grado: number }) {
  const [bots, setBots] = useState<Bot[]>(() => Array.from({ length: N }, nueva))
  const [bic, setBic] = useState<number[]>(() => Array(N).fill(0))
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)
  const inflando = bots.some((b) => b.levantado && b.t < 5)
  useEffect(() => {
    if (!inflando) return
    const id = window.setTimeout(() => setBots((bs) => bs.map((b) => (b.levantado && b.t < 5 ? { ...b, t: b.t + 1 } : b))), 1000)
    return () => window.clearTimeout(id)
  }, [inflando, bots])
  const cambiar = (j: number, p: Partial<Bot>) => setBots((bs) => bs.map((b, k) => (k === j ? { ...b, ...p } : b)))
  const enBot = (g: number) => bots.findIndex((b) => b.globo === g)
  const R = (b: Bot) => reaccion(b.vin, b.globo !== null ? bic[b.globo] : 0)

  const piezas: Pieza[] = [
    { id: 'vinagre', nombre: 'Vinagre (25 mL)', x: 60, y: 318, ancho: 60, alto: 84, tomable: true, color: '#f3e7c9', dibujo: <g><rect x="-8" y="-42" width="16" height="12" fill="#c0392b" /><path d="M-8 -30 Q-22 -26 -22 -12 V40 H22 V-12 Q22 -26 8 -30 Z" fill="rgba(255,255,255,0.7)" stroke="#2b2b2b" strokeWidth="2" /><rect x="-20" y="-6" width="40" height="44" fill="#f3e7c9" /><text y="18" textAnchor="middle" fontSize="8" fontWeight="800">VINAGRE</text></g> },
    { id: 'bicarbonato', nombre: 'Bicarbonato (1 g por vez)', x: 140, y: 330, ancho: 56, alto: 60, tomable: true, color: '#fafafa', dibujo: <g><rect x="-22" y="-26" width="44" height="56" rx="4" fill="#fff" stroke="#2b2b2b" strokeWidth="2" /><text y="2" textAnchor="middle" fontSize="7" fontWeight="800">BICARBONATO</text></g> },
    { id: 'cinta', nombre: 'Cinta métrica (mide el globo)', x: 60, y: 395, ancho: 50, alto: 30, tomable: true, dibujo: <g><circle r="13" fill="#f2c94c" stroke="#2b2b2b" strokeWidth="2" /><circle r="4" fill="#555" /><path d="M13 4 H30" stroke="#f2c94c" strokeWidth="5" /></g> },
    ...bic.map((g, k) => {
      const j = enBot(k)
      if (j >= 0) {
        const b = bots[j]
        const r = b.levantado ? 9 + Math.min(1, b.t / 5) * R(b).C * 1.25 : 9
        return { id: `g${k}`, nombre: b.levantado ? `Globo ${k + 1}` : `Globo ${k + 1} (suéltalo otra vez en la botella para levantarlo)`, x: 480 + j * 100, y: 222 - r, ancho: 40, alto: 40, tomable: !b.levantado, dibujo: <g><ellipse rx={r * 0.85} ry={r} fill={COLORES[k]} opacity="0.9" style={{ transition: 'all 1s' }} />{!b.levantado && g > 0 && <circle cy="10" r="4" fill="#fff" />}</g> }
      }
      return { id: `g${k}`, nombre: `Globo ${k + 1} · ${g} g de bicarbonato`, x: 200 + k * 50, y: 392, ancho: 40, alto: 40, tomable: true, dibujo: <g><ellipse rx="11" ry="14" fill={COLORES[k]} />{g > 0 && <circle cy="4" r={2 + g} fill="#fff" />}<text y="30" textAnchor="middle" fontSize="10" fontWeight="800">{g} g</text></g> }
    }),
    ...bots.map((b, j) => ({
      id: `b${j}`, nombre: `Botella ${j + 1} · ${b.vin} mL de vinagre`, x: 480 + j * 100, y: 290, ancho: 70, alto: 140,
      dibujo: <g><path d="M-30 67 V-17 Q-30 -37 -10 -45 V-67 H10 V-45 Q30 -37 30 -17 V67 Z" fill="rgba(255,255,255,0.55)" stroke="#555" strokeWidth="2.5" />{b.vin > 0 && <rect x="-28" y={65 - b.vin * 0.7} width="56" height={b.vin * 0.7} fill="#f3e7c9" opacity="0.85" />}{b.levantado && b.t < 5 && Array.from({ length: 6 }, (_, k) => <circle key={k} cx={-20 + k * 8} cy="40" r="2.5" fill="#fff" stroke="#bbb"><animate attributeName="cy" from="60" to={65 - b.vin * 0.7} dur={`${0.5 + (k % 3) * 0.2}s`} repeatCount="indefinite" /></circle>)}{b.levantado && b.t >= 5 && R(b).sobra > 0.05 && <ellipse cy="62" rx={Math.min(24, 6 + R(b).sobra * 6)} ry="4" fill="#fafafa" stroke="#bbb" />}<text y="84" textAnchor="middle" fontSize="11" fontWeight="700">{j + 1}{b.medida !== null ? ` · ${f(b.medida)} cm` : ''}</text></g>,
    })),
    { id: 'caneca', nombre: 'Residuos (toca: empezar de nuevo)', x: 960, y: 324, ancho: 40, alto: 76, alTocar: () => { setBots(Array.from({ length: N }, nueva)); setBic(Array(N).fill(0)); setMsg(null) }, dibujo: <g transform="scale(0.8)"><Caneca /></g> },
  ]
  const botellas = bots.map((_, j) => `b${j}`)
  const destinos = (de: string) => (de === 'bicarbonato' ? bic.map((_, k) => `g${k}`).filter((_, k) => enBot(k) < 0) : de.startsWith('g') && enBot(+de.slice(1)) >= 0 ? [`b${enBot(+de.slice(1))}`] : botellas)
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'vinagre') {
      if (!en.startsWith('b')) return 'El vinagre va en una botella.'
      const b = bots[+en.slice(1)]
      if (b.globo !== null) return 'Esa botella ya tiene el globo puesto.'
      if (b.vin >= 100) return 'Con 100 mL basta.'
      return { anim: 'verter', hecho: () => cambiar(+en.slice(1), { vin: b.vin + 25 }) }
    }
    if (de === 'bicarbonato') {
      if (!en.startsWith('g')) return 'El bicarbonato va dentro de un globo.'
      const k = +en.slice(1)
      if (enBot(k) >= 0) return 'Ese globo ya está puesto.'
      if (bic[k] >= 6) return 'Con 6 g basta.'
      return { anim: 'polvo', hecho: () => setBic((x) => x.map((v, i) => (i === k ? v + 1 : v))) }
    }
    if (de === 'cinta') {
      if (!en.startsWith('b')) return 'La cinta se usa en el globo de una botella.'
      const j = +en.slice(1)
      const b = bots[j]
      if (!b.levantado) return 'Ese globo todavía no se ha inflado.'
      if (b.t < 5) return 'Espera a que deje de burbujear.'
      return { anim: 'frotar', hecho: () => { cambiar(j, { medida: Math.round(R(b).C * 10) / 10 }); setMsg({ t: `Botella ${j + 1}: el contorno del globo mide ${f(R(b).C)} cm.` }) } }
    }
    if (de.startsWith('g')) {
      const k = +de.slice(1)
      if (!en.startsWith('b')) return 'El globo se pone en la boca de una botella.'
      const j = +en.slice(1)
      const b = bots[j]
      const ya = enBot(k)
      if (ya >= 0) {
        if (ya !== j) return 'Ese globo está en otra botella.'
        if (bic[k] <= 0) return 'El globo está vacío: no hay bicarbonato que caiga.'
        return { anim: 'poner', hecho: () => { cambiar(j, { levantado: true, t: 0 }); setMsg({ t: '¡Cae el bicarbonato y empieza a burbujear!' }) } }
      }
      if (b.globo !== null) return 'Esa botella ya tiene globo.'
      if (b.vin <= 0) return 'Primero echa el vinagre en la botella.'
      return { anim: 'poner', hecho: () => { cambiar(j, { globo: k }); setMsg(bic[k] > 0 ? { t: 'Globo puesto sin dejar caer el polvo. Para levantarlo, suéltalo otra vez en la botella.' } : { t: 'Pusiste un globo vacío.', aviso: true }) } }
    }
    return 'No se puede.'
  }

  const medidas = bots.map((b, j) => ({ b, j })).filter(({ b }) => b.medida !== null && b.globo !== null)
  const vinIgual = new Set(bots.filter((b) => b.globo !== null).map((b) => b.vin)).size <= 1
  const maxC = Math.max(1, ...medidas.map(({ b }) => b.medida!))
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        Pon <b>el mismo vinagre</b> en las cinco botellas (por ejemplo, 50 mL) y en los globos <b>cantidades distintas de bicarbonato</b> (1, 2, 3, 4 y 5 g). Pon cada globo en su botella sin que caiga el polvo, levántalos y mide los globos con la cinta. ¿Siempre que echas más bicarbonato sale más gas?
      </p>
      <MesaViva desde={80} piezas={piezas} destinos={destinos} soltar={soltar} />
      {msg && <p className={`-mt-2 text-sm ${msg.aviso ? 'font-semibold text-[#b5462c]' : ''}`}>{msg.aviso ? '⚠ ' : '› '}{msg.t}</p>}
      {!vinIgual && <p className="text-sm font-semibold text-[#b5462c]">⚠ Las botellas no tienen el mismo vinagre: así no puedes saber si el globo cambia por el bicarbonato o por el vinagre.</p>}
      {medidas.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
            <p className="font-semibold">Contorno del globo según el bicarbonato</p>
            {[...medidas].sort((a, z) => bic[a.b.globo!] - bic[z.b.globo!]).map(({ b, j }) => (
              <div key={j} className="mt-2 flex items-center gap-2">
                <span className="w-24">{bic[b.globo!]} g · {b.vin} mL</span>
                <div className="h-5 rounded" style={{ width: `${(b.medida! / maxC) * 55}%`, background: COLORES[b.globo!] }} />
                <b>{f(b.medida!)} cm</b>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
            {medidas.map(({ b, j }) => { const r = R(b); return <p key={j}>Botella {j + 1}: {r.sobra > 0.05 ? <>sobró bicarbonato (≈ {f(r.sobra)} g en el fondo) → se acabó el <b>vinagre</b>.</> : <>no sobró bicarbonato → se acabó el <b>bicarbonato</b>.</>}{grado >= 11 ? ` (ácido ${f(r.nAc * 1000, 1)} mmol, bicarbonato ${f(r.nBic * 1000, 1)} mmol, CO₂ ${f(r.V * 1000, 0)} mL)` : ''}</p> })}
          </div>
        </div>
      )}
      {medidas.length >= 4 && vinIgual && (
        <div className="rounded-xl bg-[#eaf5ee] p-3 text-sm">
          <b>Conclusión:</b> al principio, más bicarbonato da más gas. Pero llega un punto en que los globos dejan de crecer: el ácido del vinagre ya se gastó todo y el bicarbonato que sobra se queda en el fondo sin reaccionar. El reactivo que se acaba primero y pone el límite a lo que se produce es el <b>reactivo límite</b>; el que sobra es el <b>reactivo en exceso</b>.
          {grado >= 9 && <><br />NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂ (1 mol de bicarbonato reacciona con 1 mol de ácido).</>}
          {grado >= 11 && <><br />Con 50 mL de vinagre al 5 % hay ≈ 42 mmol de ácido: alcanzan para ≈ 3,5 g de bicarbonato (84 g/mol). Desde ahí, el CO₂ queda en ≈ 1 L.</>}
        </div>
      )}
      <p className="text-xs text-[var(--suave)]">Versión casera: botellas plásticas iguales, vinagre, bicarbonato, globos (un embudo de papel ayuda a llenarlos) y una cinta métrica de costura. Datos de modelo (vinagre al 5 %).</p>
    </div>
  )
}
