import { useCallback, useEffect, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Caneca } from '../dibujos.tsx'

// Laboratorio de Química 4 (PLAN-LABORATORIOS.md): conservación de la masa (Lavoisier), en mesa viva.
// Se arma a mano: vinagre al vaso o a la botella (de a 25 mL), bicarbonato al papelito o al globo (de a 1 g),
// recipiente y papelito a la balanza, globo o tapa a la botella. Se toca la balanza para anotar «antes» y
// «después». Para mezclar: el papelito al recipiente, o levantar el globo (soltarlo otra vez en la botella).
// Con la tapa, el tiempo corre: si se tapa tarde, ya se escapó parte del gas.
// NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂. Errores: pesar antes sin el bicarbonato en la balanza, dejar escapar
// el gas, tapa que salta por la presión. En la botella con globo, el empuje del aire hace que la balanza marque un
// poco menos aunque no se escape nada. Modelo: vinagre al 5 %, 24,5 L/mol, aire 1,2 g/L.

const f = (x: number, d = 1) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })
const NOMBRE = { vaso: 'Vaso abierto', botella: 'Botella sin cerrar', globo: 'Botella con globo', tapa: 'Botella tapada' }
const MASA = { vaso: 120, botella: 25 }
const VM = 24.5 // L/mol a unos 20 °C
const AIRE = 1.2 // g/L
const ESPACIO = 0.6 // L de la botella
const TAPAR = 4000 // ms: si se tapa más tarde, ya escapó todo el gas

type Rec = 'vaso' | 'botella'
interface E {
  rec: Rec | null // recipiente del ensayo (donde se echó el vinagre)
  vin: number
  vasoEnB: boolean
  botEnB: boolean
  papel: number // g de bicarbonato en el papelito
  papelEnB: boolean
  globo: number // g de bicarbonato dentro del globo
  globoPuesto: boolean
  tapa: boolean
  dentro: number // g de bicarbonato que cayó en el vinagre
  fase: 'armar' | 'burbujas' | 'fin'
  t0: number // cuándo empezó la reacción
  escapa: number // fracción del gas que se fue antes de tapar
  sinPesar: boolean // echó bicarbonato al recipiente sin pasar por la balanza
  antes: number | null
  antesTodo: boolean // al pesar antes, todo estaba sobre la balanza
  despues: number | null
}
const INICIAL: E = { rec: null, vin: 0, vasoEnB: false, botEnB: false, papel: 0, papelEnB: false, globo: 0, globoPuesto: false, tapa: false, dentro: 0, fase: 'armar', t0: 0, escapa: 1, sinPesar: false, antes: null, antesTodo: false, despues: null }
interface Ensayo { tipo: keyof typeof NOMBRE; vin: number; bic: number; antes: number; despues: number; todo: boolean; salto: boolean }

function quimica(vin: number, bic: number, tapa: boolean) {
  const nAc = (vin * 1.01 * 0.05) / 60
  const nBic = bic / 84
  const n = Math.min(nAc, nBic)
  const vCO2 = n * VM
  const presion = tapa ? vCO2 / (ESPACIO - vin / 1000) : 0
  return { nAc, nBic, n, mCO2: n * 44, vCO2, sobra: nBic > nAc ? (nBic - nAc) * 84 : 0, presion, salta: tapa && presion > 1.2 }
}

export default function ConservacionMasa({ grado }: { grado: number }) {
  const [e, setE] = useState<E>(INICIAL)
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)
  const [ensayos, setEnsayos] = useState<Ensayo[]>([])
  const dec = grado >= 11 ? 2 : 1
  const red = (x: number) => Math.round(x * 10 ** dec) / 10 ** dec
  const di = (t: string, aviso = false) => setMsg({ t, aviso })

  useEffect(() => {
    if (e.fase !== 'burbujas') return
    const id = window.setTimeout(() => setE((x) => ({ ...x, fase: 'fin' })), 2200)
    return () => window.clearTimeout(id)
  }, [e.fase])

  const tipo: keyof typeof NOMBRE = e.rec === 'vaso' ? 'vaso' : e.globoPuesto ? 'globo' : e.tapa ? 'tapa' : 'botella'
  const Q = quimica(e.vin, e.dentro, tipo === 'tapa')
  const hecho = e.fase === 'fin'
  const gasFuera = !hecho ? 0 : tipo === 'vaso' || tipo === 'botella' || Q.salta ? Q.mCO2 : tipo === 'tapa' ? Q.mCO2 * e.escapa : 0
  const empuje = hecho && tipo === 'globo' ? Q.vCO2 * AIRE : 0
  const enB = e.rec === 'vaso' ? e.vasoEnB : e.rec === 'botella' ? e.botEnB : false
  const recMasa = (r: Rec) => MASA[r] + (r === 'botella' ? (e.globoPuesto ? 3 + e.globo : 0) + (e.tapa ? 2 : 0) : 0) + (e.rec === r ? e.vin * 1.01 + e.dentro : 0)
  const lectura = (e.vasoEnB ? recMasa('vaso') : 0) + (e.botEnB ? recMasa('botella') : 0) + (e.papelEnB ? e.papel : 0) - (enB ? gasFuera + empuje : 0)

  const empezar = (x: E): E => ({ ...x, fase: x.vin > 0 && x.dentro > 0 ? 'burbujas' : x.fase, t0: Date.now(), escapa: 1 })
  // tomar el recipiente o el papelito que están en la balanza es quitarlos de ella
  const alTomar = useCallback((id: string | null) => {
    setE((x) => (id === 'vaso' && x.vasoEnB ? { ...x, vasoEnB: false } : id === 'botella' && x.botEnB ? { ...x, botEnB: false } : id === 'papel' && x.papelEnB ? { ...x, papelEnB: false } : x))
  }, [])

  const anotar = () => {
    if (e.fase === 'burbujas') return di('Espera a que termine la reacción para pesar.')
    if (!e.vasoEnB && !e.botEnB) return di('No hay ningún recipiente sobre la balanza.', true)
    const L = red(lectura)
    if (!hecho) {
      const todo = enB && ((e.globoPuesto && e.globo > 0) || (e.papelEnB && e.papel > 0))
      setE((x) => ({ ...x, antes: L, antesTodo: todo }))
      return di(`Anotas «antes»: ${f(L, dec)} g.${todo ? '' : ' Ojo: ¿está todo lo que va a reaccionar sobre la balanza?'}`, !todo)
    }
    if (e.despues !== null) return di('Ya anotaste «después». Empieza otro ensayo en la caneca.')
    setE((x) => ({ ...x, despues: L }))
    if (e.antes !== null) setEnsayos((s) => [...s, { tipo, vin: e.vin, bic: e.dentro, antes: e.antes!, despues: L, todo: e.antesTodo && !e.sinPesar, salto: Q.salta }])
    di(`Anotas «después»: ${f(L, dec)} g.${e.antes === null ? ' No pesaste antes: no hay con qué comparar.' : ''}`, e.antes === null)
  }

  // posiciones: balanza en x 560 con el plato arriba en y 306
  const posVaso = e.vasoEnB ? { x: 520, y: 259 } : { x: 300, y: 313 }
  const posBot = e.botEnB ? { x: 520, y: 239 } : { x: 400, y: 293 }
  const boca = { x: posBot.x, y: posBot.y - 67 }
  const yLiq = (r: Rec) => 196 - Math.min(80, (e.rec === r ? e.vin : 0) * 0.7)
  const burb = (x0: number, ancho: number, y0: number) => e.fase === 'burbujas' && Array.from({ length: 10 }, (_, k) => <circle key={k} cx={x0 + ((k * 23) % ancho)} cy={y0 + 20} r="3" fill="#fff" stroke="#bbb"><animate attributeName="cy" from={y0 + 60} to={y0} dur={`${0.5 + (k % 3) * 0.2}s`} repeatCount="indefinite" /></circle>)
  const radioGlobo = e.globoPuesto ? (hecho || e.fase === 'burbujas' ? 10 + Math.cbrt(Q.vCO2 * 1000) * 3.2 : 9) : 9
  const sobra = hecho && Q.sobra > 0 ? <ellipse cx="210" cy="198" rx={Math.min(26, 8 + Q.sobra * 6)} ry="5" fill="#fafafa" stroke="#bbb" /> : null

  const piezas: Pieza[] = [
    {
      id: 'balanza', nombre: 'Balanza (toca: anotar la lectura)', x: 560, y: 330, ancho: 270, alto: 60, alTocar: anotar,
      dibujo: <g><rect x="-130" y="-10" width="260" height="40" rx="6" fill="#dfe3e6" stroke="#555" strokeWidth="2" /><rect x="-120" y="-24" width="240" height="12" rx="3" fill="#aab3ba" /><rect x="-45" y="0" width="90" height="22" rx="3" fill="#1f2d24" /><text y="16" textAnchor="middle" fontSize="14" fontFamily="monospace" fill="#7dff9a">{f(red(Math.max(0, lectura)), dec)} g</text><rect x="62" y="2" width="52" height="18" rx="4" fill="#e67e22" /><text x="88" y="15" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff">ANOTAR</text></g>,
    },
    {
      id: 'vaso', nombre: 'Vaso', ...posVaso, ancho: 90, alto: 100, tomable: e.fase !== 'burbujas', color: '#f3e7c9',
      dibujo: <g transform="translate(-210 -157)"><path d="M170 110 V204 H250 V110" fill="rgba(255,255,255,0.55)" stroke="#555" strokeWidth="2.5" />{e.rec === 'vaso' && <rect x="172" y={yLiq('vaso') + 8} width="76" height={196 - yLiq('vaso')} fill="#f3e7c9" opacity="0.8" />}{e.rec === 'vaso' && burb(180, 60, yLiq('vaso'))}{e.rec === 'vaso' && sobra}{e.rec === 'vaso' && hecho && <text x="210" y="98" textAnchor="middle" fontSize="12" fill="#555">CO₂ ↑ al aire</text>}</g>,
    },
    {
      id: 'botella', nombre: 'Botella', ...posBot, ancho: 70, alto: 140, tomable: e.fase !== 'burbujas', color: '#f3e7c9',
      dibujo: <g transform="translate(-210 -137)"><path d="M180 204 V120 Q180 100 200 92 V70 H220 V92 Q240 100 240 120 V204 Z" fill="rgba(255,255,255,0.55)" stroke="#555" strokeWidth="2.5" />{e.rec === 'botella' && <rect x="182" y={yLiq('botella') + 8} width="56" height={196 - yLiq('botella')} fill="#f3e7c9" opacity="0.8" />}{e.rec === 'botella' && burb(186, 48, yLiq('botella'))}{e.rec === 'botella' && sobra}{e.tapa && Q.salta && hecho && <text x="246" y="70" fontSize="13" fill="#b5462c" fontWeight="700">¡Pum! Saltó la tapa</text>}</g>,
    },
    { id: 'vinagre', nombre: 'Vinagre (25 mL)', x: 70, y: 318, ancho: 60, alto: 84, tomable: true, color: '#f3e7c9', dibujo: <g><rect x="-8" y="-42" width="16" height="12" fill="#c0392b" /><path d="M-8 -30 Q-22 -26 -22 -12 V40 H22 V-12 Q22 -26 8 -30 Z" fill="rgba(255,255,255,0.7)" stroke="#2b2b2b" strokeWidth="2" /><rect x="-20" y="-6" width="40" height="44" fill="#f3e7c9" /><text y="18" textAnchor="middle" fontSize="8" fontWeight="800">VINAGRE</text></g> },
    { id: 'bicarbonato', nombre: 'Bicarbonato (1 g por vez)', x: 150, y: 330, ancho: 56, alto: 60, tomable: true, color: '#fafafa', dibujo: <g><rect x="-22" y="-26" width="44" height="56" rx="4" fill="#fff" stroke="#2b2b2b" strokeWidth="2" /><text y="2" textAnchor="middle" fontSize="7" fontWeight="800">BICARBONATO</text><text y="12" textAnchor="middle" fontSize="7">NaHCO₃</text></g> },
    { id: 'papel', nombre: `Papelito${e.papel ? ` con ${e.papel} g` : ''}`, ...(e.papelEnB ? { x: 630, y: 300 } : { x: 220, y: 352 }), ancho: 54, alto: 20, tomable: true, color: '#fafafa', dibujo: <g><rect x="-22" y="-3" width="44" height="7" fill="#fff" stroke="#999" />{e.papel > 0 && <ellipse cy="-4" rx={6 + e.papel * 2} ry="5" fill="#fafafa" stroke="#bbb" />}</g> },
    {
      id: 'globo', nombre: e.globoPuesto ? (hecho || e.fase === 'burbujas' ? 'Globo' : 'Globo (suéltalo otra vez en la botella para levantarlo)') : `Globo${e.globo ? ` con ${e.globo} g` : ''}`,
      ...(e.globoPuesto ? { x: boca.x, y: boca.y - radioGlobo } : { x: 700, y: 348 }), ancho: 40, alto: 40, tomable: !e.globoPuesto || e.fase === 'armar',
      dibujo: e.globoPuesto ? <g><ellipse rx={radioGlobo * 0.85} ry={radioGlobo} fill="#e0607e" opacity="0.9" style={{ transition: 'all 1.2s' }} />{!hecho && e.fase === 'armar' && <circle cy="10" r="4" fill="#fff" />}</g>
        : <g><ellipse rx="10" ry="13" fill="#e0607e" />{e.globo > 0 && <circle cy="4" r="4" fill="#fff" />}<path d="M-3 12 h6 v6 h-6 z" fill="#e0607e" /></g>,
    },
    { id: 'tapa', nombre: 'Tapa', ...(e.tapa ? { x: boca.x, y: boca.y - 4 } : { x: 760, y: 352 }), ancho: 30, alto: 16, tomable: !e.tapa, dibujo: e.tapa && Q.salta && hecho ? <rect x="20" y="-60" width="24" height="10" rx="2" fill="#2e86c1" transform="rotate(30 32 -55)" /> : <rect x="-13" y="-5" width="26" height="10" rx="2" fill="#2e86c1" /> },
    { id: 'caneca', nombre: 'Residuos (toca: otro ensayo)', x: 950, y: 324, ancho: 54, alto: 76, alTocar: () => { setE(INICIAL); di('Lavas todo: armas otro ensayo.') }, dibujo: <Caneca /> },
  ]

  const destinos = (de: string): string[] => {
    if (de === 'vaso' || de === 'botella') return ['balanza']
    if (de === 'vinagre') return ['vaso', 'botella']
    if (de === 'bicarbonato') return ['papel', 'globo', 'vaso', 'botella']
    if (de === 'papel') return ['balanza', 'vaso', 'botella']
    if (de === 'globo' || de === 'tapa') return ['botella']
    return []
  }
  const soltar = (de: string, en: string): Uso | string => {
    const otro = (r: Rec) => e.rec !== null && e.rec !== r
    if (de === 'vaso' || de === 'botella') {
      if (en !== 'balanza') return 'El recipiente va sobre la balanza.'
      if ((de === 'vaso' && e.botEnB) || (de === 'botella' && e.vasoEnB)) return 'Ya hay otro recipiente en la balanza: quítalo primero (tómalo y suéltalo en la mesa).'
      return { anim: 'poner', hecho: () => setE((x) => (de === 'vaso' ? { ...x, vasoEnB: true } : { ...x, botEnB: true })) }
    }
    if (de === 'vinagre') {
      const r = en as Rec
      if (otro(r)) return 'Usa un solo recipiente por ensayo (la caneca empieza otro).'
      if (r === 'botella' && (e.tapa || e.globoPuesto)) return 'La botella ya está cerrada.'
      if (e.vin >= 100) return 'Con 100 mL basta.'
      if (hecho) return 'Este ensayo ya terminó: empieza otro en la caneca.'
      return { anim: 'verter', hecho: () => setE((x) => empezar({ ...x, rec: r, vin: x.vin + 25 })) }
    }
    if (de === 'bicarbonato') {
      if (en === 'papel') return e.papelEnB ? 'Saca primero el papelito de la balanza, o pon el bicarbonato estando el papelito en la mesa.' : e.papel >= 6 ? 'Con 6 g basta.' : { anim: 'polvo', hecho: () => setE((x) => ({ ...x, papel: x.papel + 1 })) }
      if (en === 'globo') return e.globoPuesto ? 'El globo ya está puesto en la botella.' : e.globo >= 6 ? 'Con 6 g basta.' : { anim: 'polvo', hecho: () => setE((x) => ({ ...x, globo: x.globo + 1 })) }
      const r = en as Rec
      if (otro(r)) return 'Usa un solo recipiente por ensayo.'
      if (r === 'botella' && (e.tapa || e.globoPuesto)) return 'La botella ya está cerrada.'
      return { anim: 'polvo', hecho: () => { setE((x) => empezar({ ...x, rec: r, dentro: x.dentro + 1, sinPesar: true })); di('Echas el bicarbonato directo: así no lo pesaste antes de que reaccionara.', true) } }
    }
    if (de === 'papel') {
      if (en === 'balanza') return { anim: 'poner', hecho: () => setE((x) => ({ ...x, papelEnB: true })) }
      if (e.papel <= 0) return 'El papelito está vacío: échale bicarbonato.'
      const r = en as Rec
      if (otro(r)) return 'Usa un solo recipiente por ensayo.'
      if (r === 'botella' && (e.tapa || e.globoPuesto)) return 'La botella ya está cerrada.'
      return { anim: 'polvo', hecho: () => { setE((x) => empezar({ ...x, rec: r, dentro: x.dentro + x.papel, papel: 0 })); if (r === 'botella' && e.vin > 0) di('¡Empieza a burbujear! Si quieres atrapar el gas, tapa la botella ya.') } }
    }
    if (de === 'globo') {
      if (otro('botella')) return 'El ensayo es con el vaso: el globo no cabe en el vaso.'
      if (e.tapa) return 'La botella ya está tapada.'
      if (!e.globoPuesto) return e.vin <= 0 ? 'Primero echa el vinagre en la botella.' : { anim: 'poner', hecho: () => { setE((x) => ({ ...x, rec: 'botella', globoPuesto: true })); di(e.globo > 0 ? 'Globo puesto, con el bicarbonato adentro. Pesa antes y luego levántalo (suéltalo otra vez en la botella).' : 'Pusiste el globo vacío: no hay bicarbonato que caiga.', e.globo <= 0) } }
      if (e.globo <= 0) return 'El globo no tiene bicarbonato.'
      return { anim: 'poner', hecho: () => setE((x) => empezar({ ...x, dentro: x.dentro + x.globo, globo: 0 })) }
    }
    if (de === 'tapa') {
      if (otro('botella')) return 'El ensayo es con el vaso: la tapa es de la botella.'
      if (e.globoPuesto) return 'La botella ya tiene el globo.'
      return {
        anim: 'poner',
        hecho: () => {
          const tarde = e.dentro > 0 && e.vin > 0 ? Math.min(1, (Date.now() - e.t0) / TAPAR) : 0
          setE((x) => ({ ...x, rec: 'botella', tapa: true, escapa: tarde }))
          if (tarde > 0.05) di(`Tapaste tarde: ya se había escapado ${tarde >= 1 ? 'todo' : `cerca del ${Math.round(tarde * 100)} %`} del gas.`, true)
        },
      }
    }
    return 'No se puede.'
  }

  const ult = ensayos.length ? ensayos[ensayos.length - 1] : null
  const ver = hecho && e.antes !== null && e.despues !== null
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        Lavoisier: <b>en una reacción la masa no se crea ni se destruye</b>. Pésalo tú: vinagre y bicarbonato reaccionan y sueltan un gas. Arma el ensayo (vaso abierto, botella con el bicarbonato en el globo, o botella que tapas apenas caiga el papelito), ponlo en la balanza con todo lo que va a reaccionar y toca la balanza para anotar <b>antes</b> y <b>después</b>.
      </p>
      <MesaViva desde={120} piezas={piezas} destinos={destinos} soltar={soltar} alTomar={alTomar} />
      {msg && <p className={`-mt-2 text-sm ${msg.aviso ? 'font-semibold text-[#b5462c]' : ''}`}>{msg.aviso ? '⚠ ' : '› '}{msg.t}</p>}
      <div className="rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
        <p>Vinagre: <b>{e.vin} mL</b> · Bicarbonato que reaccionó: <b>{e.dentro} g</b> · Antes: <b>{e.antes !== null ? `${f(e.antes, dec)} g` : '—'}</b> · Después: <b>{e.despues !== null ? `${f(e.despues, dec)} g` : '—'}</b>{e.antes !== null && e.despues !== null && <> · Diferencia: <b>{f(e.despues - e.antes, dec)} g</b></>}</p>
      </div>
      {ver && ult && (
        <div className="rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
          {!ult.todo && <p className="text-[#b5462c]">✘ Al pesar antes no estaba todo sobre la balanza (el bicarbonato o el recipiente): la comparación no sirve. Todo lo que va a reaccionar tiene que estar en la balanza desde el principio.</p>}
          {(tipo === 'vaso' || tipo === 'botella') && <p>El recipiente estaba abierto: el gas (CO₂) se fue al aire y se llevó {f(Q.mCO2, dec)} g. La masa no desapareció: está en el aire.</p>}
          {tipo === 'tapa' && Q.salta && <p className="text-[#b5462c]">✘ Se produjo tanto gas ({f(Q.vCO2 * 1000, 0)} mL) que la presión hizo saltar la tapa y el CO₂ escapó. Usa menos bicarbonato o un globo.</p>}
          {tipo === 'tapa' && !Q.salta && e.escapa > 0.05 && <p className="text-[#b5462c]">✘ Tapaste tarde: antes de cerrar ya se había escapado parte del gas.</p>}
          {tipo === 'tapa' && !Q.salta && e.escapa <= 0.05 && <p>Botella tapada: nada entró ni salió. La masa es la misma: <b>se conserva</b>.{grado >= 9 ? ` La presión adentro subió ≈ ${f(Q.presion, 1)} atm.` : ''}</p>}
          {tipo === 'globo' && <p>Botella con globo: el gas quedó atrapado. La balanza marca {f(empuje, dec)} g menos porque el globo inflado <b>empuja el aire</b> y el aire lo empuja hacia arriba, como al agua un flotador. No se perdió materia: si se pesara en el vacío, daría lo mismo.</p>}
          {Q.sobra > 0.05 && <p>Quedó bicarbonato sin reaccionar en el fondo (≈ {f(Q.sobra, 1)} g): se acabó el ácido del vinagre primero.{grado >= 9 ? ' El vinagre fue el reactivo límite.' : ''}</p>}
          {grado >= 9 && <p className="mt-1">NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂</p>}
          {grado >= 11 && <p className="mt-1">Ácido acético: {f(Q.nAc * 1000, 1)} mmol · bicarbonato: {f(Q.nBic * 1000, 1)} mmol → CO₂: {f(Q.n * 1000, 1)} mmol = {f(Q.mCO2, 2)} g ≈ {f(Q.vCO2 * 1000, 0)} mL.</p>}
        </div>
      )}
      {ensayos.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
          <p className="font-semibold">Tus ensayos</p>
          <table className="mt-1 w-full">
            <thead><tr className="text-left"><th className="p-1">Recipiente</th><th className="p-1">Vinagre</th><th className="p-1">Bicarb.</th><th className="p-1">Antes</th><th className="p-1">Después</th><th className="p-1">Diferencia</th></tr></thead>
            <tbody>{ensayos.map((x, k) => <tr key={k} className="border-t border-[var(--linea)]"><td className="p-1">{NOMBRE[x.tipo]}{x.salto ? ' (saltó)' : ''}{!x.todo ? ' *' : ''}</td><td className="p-1">{x.vin} mL</td><td className="p-1">{x.bic} g</td><td className="p-1">{f(x.antes, dec)}</td><td className="p-1">{f(x.despues, dec)}</td><td className="p-1">{f(x.despues - x.antes, dec)}</td></tr>)}</tbody>
          </table>
          <p className="mt-1 text-xs text-[var(--suave)]">* sin todo sobre la balanza al pesar antes.</p>
          {new Set(ensayos.map((x) => x.tipo)).size >= 2 && <p className="mt-2 rounded-lg bg-[#eaf5ee] p-2"><b>Conclusión:</b> en un sistema cerrado la masa se conserva; en uno abierto parece que se pierde porque un producto es un gas que se escapa. La ley de Lavoisier se cumple siempre: hay que contar todo, también el gas.</p>}
        </div>
      )}
      <p className="text-xs text-[var(--suave)]">Versión casera: gramera de cocina, botella plástica, globo, vinagre y bicarbonato. No tapes la botella con mucho bicarbonato: la tapa puede salir disparada. Datos de modelo (vinagre al 5 %).</p>
    </div>
  )
}
