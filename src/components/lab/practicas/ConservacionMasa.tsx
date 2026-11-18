import { useEffect, useState } from 'react'

// Laboratorio de Química 4 (PLAN-LABORATORIOS.md): conservación de la masa (Lavoisier).
// Vinagre + bicarbonato en vaso abierto, botella con globo o botella tapada, sobre la balanza.
// NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂. Errores: pesar antes sin el bicarbonato en la balanza,
// dejar escapar el gas, tapa que salta por la presión. En la botella con globo, el empuje del aire hace que
// la balanza marque un poco menos aunque no se escape nada. Modelo: vinagre al 5 %, 24,5 L/mol, aire 1,2 g/L.

const f = (x: number, d = 1) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })
const BOTON = (on: boolean) => `rounded-full border px-3 py-1 text-sm font-semibold ${on ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-white'}`

const RECIP = [
  { n: 'Vaso abierto', masa: 120 },
  { n: 'Botella con globo', masa: 28 }, // botella 25 g + globo 3 g (el bicarbonato va dentro del globo)
  { n: 'Botella tapada', masa: 27 }, // botella 25 g + tapa 2 g (el bicarbonato en un papelito que se deja caer)
]
const VM = 24.5 // L/mol a unos 20 °C
const AIRE = 1.2 // g/L
const ESPACIO = 0.6 // L de la botella

interface Ensayo { r: number; vin: number; bic: number; antes: number; despues: number; papel: boolean; salto: boolean }

export default function ConservacionMasa({ grado }: { grado: number }) {
  const [r, setR] = useState(0)
  const [vin, setVin] = useState(50)
  const [bic, setBic] = useState(2)
  const [papel, setPapel] = useState(false) // el bicarbonato está sobre la balanza antes de mezclar
  const [fase, setFase] = useState<'armar' | 'pesado' | 'reaccion' | 'listo'>('armar')
  const [antes, setAntes] = useState<number | null>(null)
  const [despues, setDespues] = useState<number | null>(null)
  const [ensayos, setEnsayos] = useState<Ensayo[]>([])
  const dec = grado >= 11 ? 2 : 1
  const redondeo = (x: number) => Math.round(x * 10 ** dec) / 10 ** dec

  // química
  const nAc = (vin * 1.01 * 0.05) / 60
  const nBic = bic / 84
  const n = Math.min(nAc, nBic)
  const mCO2 = n * 44
  const vCO2 = n * VM // L
  const sobra = nBic > nAc ? (nBic - nAc) * 84 : 0
  const libreBot = ESPACIO - vin / 1000
  const presionExtra = r === 2 ? vCO2 / libreBot : 0 // atm, aproximado
  const salta = r === 2 && presionExtra > 1.2
  const enBalanza = r === 1 || papel // en el globo el bicarbonato siempre está sobre la balanza
  const base = RECIP[r].masa + vin * 1.01
  const lecturaAntes = base + (enBalanza ? bic : 0)
  const escapa = r === 0 || salta ? mCO2 : 0
  const empuje = r === 1 ? vCO2 * AIRE : 0
  const lecturaDespues = base + bic - escapa - empuje

  const reiniciar = () => { setFase('armar'); setAntes(null); setDespues(null) }
  const pesarAntes = () => { if (fase === 'armar') { setAntes(redondeo(lecturaAntes)); setFase('pesado') } }
  const mezclar = () => {
    if (fase === 'armar' || fase === 'pesado') { setFase('reaccion'); window.setTimeout(() => setFase('listo'), 1800) }
  }
  const pesarDespues = () => {
    if (fase !== 'listo' || despues !== null) return
    const d = redondeo(lecturaDespues)
    setDespues(d)
    if (antes !== null) setEnsayos((e) => [...e, { r, vin, bic, antes, despues: d, papel: enBalanza, salto: salta }])
  }
  const armando = fase === 'armar'

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      const num = parseInt(k, 10)
      if (num >= 1 && num <= 3 && armando) setR(num - 1)
      else if (k === 'w' && armando) setVin((v) => Math.min(100, v + 10))
      else if (k === 's' && armando) setVin((v) => Math.max(20, v - 10))
      else if (k === 'd' && armando) setBic((b) => Math.min(6, +(b + 0.5).toFixed(1)))
      else if (k === 'a' && armando) setBic((b) => Math.max(0.5, +(b - 0.5).toFixed(1)))
      else if (k === 'p' && armando) setPapel((p) => !p)
      else if (k === 'b') { if (fase === 'listo') pesarDespues(); else pesarAntes() }
      else if (k === 'm') mezclar()
      else if (k === 'r') reiniciar()
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })

  const hecho = fase === 'listo' || fase === 'reaccion'
  const lecturaVisible = fase === 'listo' ? lecturaDespues : lecturaAntes
  const radioGlobo = r === 1 ? (hecho ? 10 + Math.cbrt(vCO2 * 1000) * 3.2 : 9) : 0
  const yLiq = 196 - Math.min(80, vin * 0.7)
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        Lavoisier: <b>en una reacción la masa no se crea ni se destruye</b>. Pésalo tú: vinagre y bicarbonato reaccionan y sueltan un gas. Pesa antes y después, con todo sobre la balanza. ¿Cambió la masa? ¿Por qué?
      </p>
      <div className="flex flex-wrap gap-2">
        {RECIP.map((x, k) => <button key={x.n} type="button" disabled={!armando} onClick={() => setR(k)} className={BOTON(k === r)}>{k + 1} · {x.n}</button>)}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_330px]">
        <svg viewBox="0 0 520 280" className="w-full rounded-2xl border border-[var(--linea)] bg-[#f4f1ea]" role="img" aria-label="Recipiente sobre la balanza">
          <rect x="0" y="262" width="520" height="18" fill="#b98d5e" />
          <rect x="90" y="222" width="300" height="40" rx="6" fill="#dfe3e6" stroke="#555" strokeWidth="2" />
          <rect x="100" y="206" width="280" height="12" rx="3" fill="#aab3ba" />
          <rect x="200" y="232" width="90" height="22" rx="3" fill="#1f2d24" />
          <text x="245" y="248" textAnchor="middle" fontSize="14" fontFamily="monospace" fill="#7dff9a">{f(redondeo(lecturaVisible), dec)} g</text>
          {r === 0 ? (
            <g>
              <path d="M170 110 V204 H250 V110" fill="rgba(255,255,255,0.55)" stroke="#555" strokeWidth="2.5" />
              <rect x="172" y={yLiq + 8} width="76" height={196 - yLiq} fill="#f3e7c9" opacity="0.8" />
              {fase === 'reaccion' && <rect x="172" y={yLiq - 22} width="76" height="30" fill="#fffaf0" opacity="0.9" />}
            </g>
          ) : (
            <g>
              <path d="M180 204 V120 Q180 100 200 92 V70 H220 V92 Q240 100 240 120 V204 Z" fill="rgba(255,255,255,0.55)" stroke="#555" strokeWidth="2.5" />
              <rect x="182" y={yLiq + 8} width="56" height={196 - yLiq} fill="#f3e7c9" opacity="0.8" />
              {fase === 'reaccion' && <rect x="182" y={yLiq - 18} width="56" height="26" fill="#fffaf0" opacity="0.9" />}
              {r === 1 && <g style={{ transition: 'all 1.2s' }}>
                <ellipse cx="210" cy={66 - radioGlobo} rx={radioGlobo * 0.85} ry={radioGlobo} fill="#e0607e" opacity="0.9" style={{ transition: 'all 1.2s' }} />
                {!hecho && <circle cx="210" cy="56" r="4" fill="#fff" />}
              </g>}
              {r === 2 && (salta && hecho
                ? <g><rect x="230" y="20" width="24" height="10" rx="2" fill="#2e86c1" transform="rotate(30 242 25)" /><text x="270" y="30" fontSize="13" fill="#b5462c" fontWeight="700">¡Pum! Saltó la tapa</text></g>
                : <rect x="197" y="62" width="26" height="10" rx="2" fill="#2e86c1" />)}
            </g>
          )}
          {/* bicarbonato en papelito sobre la balanza o fuera de ella */}
          {r !== 1 && !hecho && <g transform={`translate(${papel ? 300 : 430} ${papel ? 196 : 250})`}><rect x="-22" y="0" width="44" height="8" fill="#fff" stroke="#999" /><ellipse cx="0" cy="0" rx="14" ry="6" fill="#fafafa" stroke="#bbb" /></g>}
          {hecho && sobra > 0 && <ellipse cx={r === 0 ? 210 : 210} cy="198" rx={Math.min(30, 8 + sobra * 6)} ry="5" fill="#fafafa" stroke="#bbb" />}
          {fase === 'reaccion' && Array.from({ length: 10 }, (_, k) => <circle key={k} cx={190 + ((k * 23) % 40)} cy={yLiq + 20 + ((k * 13) % 40)} r="3" fill="#fff" stroke="#bbb"><animate attributeName="cy" from={yLiq + 60} to={yLiq} dur={`${0.5 + (k % 3) * 0.2}s`} repeatCount="indefinite" /></circle>)}
          {r === 0 && hecho && <text x="210" y="96" textAnchor="middle" fontSize="12" fill="#555">CO₂ ↑ al aire</text>}
        </svg>
        <div className="flex flex-col gap-2 text-sm">
          <p>Vinagre: <button type="button" disabled={!armando} onClick={() => setVin((v) => Math.max(20, v - 10))} className="rounded-full border border-[var(--linea)] px-2">−</button> <b>{vin} mL</b> <button type="button" disabled={!armando} onClick={() => setVin((v) => Math.min(100, v + 10))} className="rounded-full border border-[var(--linea)] px-2">+</button> <span className="text-xs text-[var(--suave)]">(W/S)</span></p>
          <p>Bicarbonato: <button type="button" disabled={!armando} onClick={() => setBic((b) => Math.max(0.5, +(b - 0.5).toFixed(1)))} className="rounded-full border border-[var(--linea)] px-2">−</button> <b>{f(bic)} g</b> <button type="button" disabled={!armando} onClick={() => setBic((b) => Math.min(6, +(b + 0.5).toFixed(1)))} className="rounded-full border border-[var(--linea)] px-2">+</button> <span className="text-xs text-[var(--suave)]">(A/D)</span></p>
          {r === 1 ? <p className="text-[var(--suave)]">El bicarbonato va dentro del globo; al levantarlo cae en el vinagre.</p>
            : <label className="flex items-center gap-2"><input type="checkbox" disabled={!armando} checked={papel} onChange={() => setPapel((p) => !p)} /> Papelito con bicarbonato sobre la balanza (P)</label>}
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={fase !== 'armar'} onClick={pesarAntes} className={BOTON(false) + ' disabled:opacity-40'}>Pesar antes (B)</button>
            <button type="button" disabled={hecho} onClick={mezclar} className={BOTON(false) + ' disabled:opacity-40'}>Mezclar (M)</button>
            <button type="button" disabled={fase !== 'listo' || despues !== null} onClick={pesarDespues} className={BOTON(false) + ' disabled:opacity-40'}>Pesar después (B)</button>
            <button type="button" onClick={reiniciar} className={BOTON(false)}>Otra vez (R)</button>
          </div>
          <div className="rounded-xl bg-[var(--tarjeta)] p-3">
            <p>Antes: <b>{antes !== null ? `${f(antes, dec)} g` : '—'}</b> · Después: <b>{despues !== null ? `${f(despues, dec)} g` : '—'}</b></p>
            {antes !== null && despues !== null && <p>Diferencia: <b>{f(despues - antes, dec)} g</b></p>}
            {fase === 'listo' && antes === null && <p className="text-[#b5462c]">No pesaste antes de mezclar: no hay con qué comparar.</p>}
          </div>
          <p className="text-xs text-[var(--suave)]">Teclas: 1–3 recipiente · W/S vinagre · A/D bicarbonato · P papelito · B pesar · M mezclar · R otra vez.</p>
        </div>
      </div>
      {antes !== null && despues !== null && (
        <div className="rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
          {!enBalanza && r !== 1 && <p className="text-[#b5462c]">✘ Pesaste antes sin el bicarbonato sobre la balanza: la masa «aumentó» porque después sí estaba. Todo lo que va a reaccionar tiene que estar en la balanza desde el principio.</p>}
          {r === 0 && <p>El vaso estaba abierto: el gas (CO₂) se fue al aire y se llevó {f(mCO2, dec)} g. La masa no desapareció: está en el aire.</p>}
          {salta && <p className="text-[#b5462c]">✘ Se produjo tanto gas ({f(vCO2 * 1000, 0)} mL) que la presión hizo saltar la tapa y el CO₂ escapó. Usa menos bicarbonato o un globo.</p>}
          {r === 2 && !salta && <p>Botella tapada: nada entró ni salió. La masa es la misma: <b>se conserva</b>.{grado >= 9 ? ` La presión adentro subió ≈ ${f(presionExtra, 1)} atm.` : ''}</p>}
          {r === 1 && <p>Botella con globo: el gas quedó atrapado. La balanza marca {f(empuje, dec)} g menos porque el globo inflado <b>empuja el aire</b> y el aire lo empuja hacia arriba, como al agua un flotador. No se perdió materia: si se pesara en el vacío, daría lo mismo.</p>}
          {sobra > 0.05 && <p>Quedó bicarbonato sin reaccionar en el fondo (≈ {f(sobra, 1)} g): se acabó el ácido del vinagre primero.{grado >= 9 ? ' El vinagre fue el reactivo límite.' : ''}</p>}
          {grado >= 9 && <p className="mt-1">NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂</p>}
          {grado >= 11 && <p className="mt-1">Ácido acético: {f(nAc * 1000, 1)} mmol · bicarbonato: {f(nBic * 1000, 1)} mmol → CO₂: {f(n * 1000, 1)} mmol = {f(mCO2, 2)} g ≈ {f(vCO2 * 1000, 0)} mL.</p>}
        </div>
      )}
      {ensayos.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
          <p className="font-semibold">Tus ensayos</p>
          <table className="mt-1 w-full">
            <thead><tr className="text-left"><th className="p-1">Recipiente</th><th className="p-1">Vinagre</th><th className="p-1">Bicarb.</th><th className="p-1">Antes</th><th className="p-1">Después</th><th className="p-1">Diferencia</th></tr></thead>
            <tbody>{ensayos.map((x, k) => <tr key={k} className="border-t border-[var(--linea)]"><td className="p-1">{RECIP[x.r].n}{x.salto ? ' (saltó)' : ''}{!x.papel ? ' *' : ''}</td><td className="p-1">{x.vin} mL</td><td className="p-1">{f(x.bic)} g</td><td className="p-1">{f(x.antes, dec)}</td><td className="p-1">{f(x.despues, dec)}</td><td className="p-1">{f(x.despues - x.antes, dec)}</td></tr>)}</tbody>
          </table>
          <p className="mt-1 text-xs text-[var(--suave)]">* sin el bicarbonato en la balanza al pesar antes.</p>
          {new Set(ensayos.map((x) => x.r)).size >= 2 && <p className="mt-2 rounded-lg bg-[#eaf5ee] p-2"><b>Conclusión:</b> en un sistema cerrado la masa se conserva; en uno abierto parece que se pierde porque un producto es un gas que se escapa. La ley de Lavoisier se cumple siempre: hay que contar todo, también el gas.</p>}
        </div>
      )}
      <p className="text-xs text-[var(--suave)]">Versión casera: gramera de cocina, botella plástica, globo, vinagre y bicarbonato. No tapes la botella con mucho bicarbonato: la tapa puede salir disparada. Datos de modelo (vinagre al 5 %).</p>
    </div>
  )
}
