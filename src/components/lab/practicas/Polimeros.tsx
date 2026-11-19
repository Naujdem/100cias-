import { useEffect, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Caneca } from '../dibujos.tsx'

// Práctica extra 7 (PLAN-LABORATORIOS.md): polímeros, Química área 5, desde 6°.
// Slime (SIMULACIÓN para el bórax): pegante blanco de a 10 mL, agua de a 10 mL, colorante, solución de bórax de a 2 mL,
// varilla para mezclar; la proporción bórax ÷ pegante decide líquido, slime o caucho; la mano lo estira.
// Bioplástico: fécula de a 5 g, agua de a 20 mL, vinagre de a 5 mL, glicerina de a 2 mL; estufa que se toca y varilla
// (1 s = 1 min) hasta el gel translúcido; la olla al molde; el secado corre 1 s = 2 h durante un día.
// Glicerina ÷ fécula: 0 quebradizo, 0,15–0,6 flexible, más pegajoso.

const f = (x: number, d = 0) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })

function Envase({ c, t, gotero = false }: { c: string; t: string; gotero?: boolean }) {
  return gotero
    ? <g><rect x="-10" y="-14" width="20" height="40" rx="4" fill={c} stroke="#2b2b2b" strokeWidth="2" /><path d="M-6 -14 v-14 h12 v14" fill="#333" /><text y="40" textAnchor="middle" fontSize="9" fontWeight="700">{t}</text></g>
    : <g><rect x="-18" y="-30" width="36" height="60" rx="6" fill={c} stroke="#2b2b2b" strokeWidth="2" /><rect x="-10" y="-40" width="20" height="10" fill="#555" /><text y="44" textAnchor="middle" fontSize="9" fontWeight="700">{t}</text></g>
}
const Varilla = <rect x="-46" y="-3" width="92" height="6" rx="3" fill="#dfe9ef" stroke="#2b2b2b" />

export default function Polimeros({ grado }: { grado: number }) {
  const [parte, setParte] = useState<1 | 2>(1)
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-center gap-2 text-sm">
        {([1, 2] as const).map((p) => <button key={p} type="button" onClick={() => setParte(p)} className={`min-h-10 rounded-full border px-4 ${parte === p ? 'border-[var(--acento)] font-semibold' : 'border-[var(--linea)]'}`}>{p === 1 ? '1. Slime' : '2. Bioplástico'}</button>)}
      </div>
      {parte === 1 ? <Slime grado={grado} /> : <Bioplastico grado={grado} />}
    </div>
  )
}

function Slime({ grado }: { grado: number }) {
  const [peg, setPeg] = useState(0)
  const [agua, setAgua] = useState(0)
  const [col, setCol] = useState(false)
  const [borax, setBorax] = useState(0)
  const [mezcla, setMezcla] = useState(0) // veces que se mezcló desde el último bórax
  const [prueba, setPrueba] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const R = peg ? (borax / peg) * (1 + Math.min(1, agua / Math.max(peg, 1)) * -0.3) : 0
  const estado = !peg ? 'vacío' : !borax || mezcla === 0 ? 'líquido' : R < 0.1 ? 'pegajoso' : R <= 0.3 ? 'slime' : 'caucho'
  const color = col ? '#6cc36c' : '#f4f4f0'
  const piezas: Pieza[] = [
    { id: 'peg', nombre: 'Pegante blanco escolar (PVA, de a 10 mL)', x: 70, y: 340, ancho: 50, alto: 90, tomable: true, color: '#f4f4f0', dibujo: <Envase c="#f4f4f0" t="Pegante" /> },
    { id: 'agua', nombre: 'Agua (de a 10 mL)', x: 140, y: 340, ancho: 50, alto: 90, tomable: true, color: '#a9d3f5', dibujo: <Envase c="#a9d3f5" t="Agua" /> },
    { id: 'col', nombre: 'Colorante', x: 205, y: 350, ancho: 40, alto: 80, tomable: !col, color: '#3fa34d', dibujo: <Envase c="#3fa34d" t="Color" gotero /> },
    { id: 'borax', nombre: 'Solución de bórax (activador, de a 2 mL)', x: 270, y: 340, ancho: 50, alto: 90, tomable: true, color: '#eef3f6', dibujo: <Envase c="#eef3f6" t="Bórax" /> },
    { id: 'varilla', nombre: 'Palito para mezclar', x: 170, y: 255, ancho: 100, alto: 16, tomable: true, dibujo: Varilla },
    { id: 'vaso', nombre: `Vaso · ${peg} mL de pegante, ${agua} mL de agua, ${borax} mL de bórax · ${estado}`, x: 480, y: 320, ancho: 100, alto: 110, tomable: estado !== 'vacío' && estado !== 'líquido',
      dibujo: <g>
        <path d="M-40 -44 L-32 44 H32 L40 -44" fill="rgba(255,255,255,0.6)" stroke="#2b2b2b" strokeWidth="2" />
        {peg > 0 && (estado === 'líquido' || estado === 'vacío'
          ? <rect x="-34" y={40 - Math.min(70, (peg + agua + borax) * 0.9)} width="68" height={Math.min(70, (peg + agua + borax) * 0.9)} fill={color} opacity="0.9" />
          : <path d={estado === 'caucho' ? 'M-20 40 q-8 -26 10 -30 q24 -6 26 16 q2 18 -36 14' : 'M-30 42 q-6 -30 16 -34 q30 -6 40 18 q6 18 -56 16'} fill={color} stroke="#2b2b2b" strokeWidth="1" opacity={estado === 'pegajoso' ? 0.75 : 1} />)}
      </g> },
    { id: 'mano', nombre: prueba ? `Prueba: ${prueba}` : 'Mano (lleva el contenido para estirarlo)', x: 720, y: 320, ancho: 120, alto: 110,
      dibujo: <g><path d="M-40 30 q-6 -40 10 -50 l4 -26 q6 -6 10 0 l2 22 l4 -32 q6 -6 10 0 l0 32 l6 -28 q6 -6 10 0 l-2 32 l8 -18 q8 -4 8 6 l-10 40 q-6 22 -30 22 z" fill="#e8b98c" stroke="#7a4e2c" strokeWidth="2" />
        {prueba && <path d={estado === 'slime' ? 'M-30 30 q20 40 60 0' : estado === 'caucho' ? 'M-10 30 l8 -6 l8 6' : 'M-10 30 v30 M6 30 v24'} stroke={color} strokeWidth={estado === 'slime' ? 10 : 6} fill="none" strokeLinecap="round" />}</g> },
    { id: 'caneca', nombre: 'Botar y empezar de nuevo (toca)', x: 940, y: 370, ancho: 50, alto: 70, alTocar: () => { setPeg(0); setAgua(0); setCol(false); setBorax(0); setMezcla(0); setPrueba(null); setMsg('Vaso limpio. El slime va a la caneca, nunca al desagüe: lo tapa.') }, dibujo: <g transform="scale(0.8)"><Caneca /></g> },
  ]
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'vaso') {
      if (en !== 'mano') return 'Llévalo a la mano para probarlo.'
      const t = estado === 'slime' ? 'se estira despacio y no se pega: ¡slime!' : estado === 'caucho' ? 'duro como caucho: rebota pero se rompe al estirarlo' : 'chorrea y se pega a los dedos: le falta activador'
      return { anim: 'poner', hecho: () => { setPrueba(t); setMsg(`En la mano ${t}.`) } }
    }
    if (en !== 'vaso') return 'Va al vaso.'
    if (de === 'peg') return peg >= 60 ? 'Con 60 mL basta.' : { anim: 'verter', hecho: () => setPeg((x) => x + 10) }
    if (de === 'agua') return !peg ? 'Primero el pegante.' : { anim: 'verter', hecho: () => setAgua((x) => x + 10) }
    if (de === 'col') return { anim: 'gotas', gotas: 3, hecho: () => setCol(true) }
    if (de === 'borax') return !peg ? 'Primero el pegante.' : { anim: 'verter', hecho: () => { setBorax((x) => x + 2); setMezcla(0); setMsg('Activador agregado. Mezcla con el palito.') } }
    if (de === 'varilla') return !peg ? 'No hay nada que mezclar.' : { anim: 'frotar', hecho: () => {
      setMezcla((m) => m + 1)
      setMsg(!borax ? 'Solo se mezcla el pegante: sigue líquido. Falta el activador.' : 'Al mezclar, la mezcla se espesa de golpe. Llévala a la mano para probarla.')
    } }
    return 'No se puede.'
  }
  const destinos = (de: string) => (de === 'vaso' ? ['mano'] : ['vaso'])
  return (
    <>
      <p className="rounded-2xl border-2 border-[#c0392b] bg-[var(--tarjeta)] p-4 text-sm"><b className="text-[#c0392b]">El bórax es solo simulación:</b> irrita la piel y es tóxico si se traga. En el aula se usa solución para lentes de contacto con bicarbonato (trae poquito borato) y siempre con guantes. Mezcla pegante, agua y activador, revuelve y prueba en la mano. ¿Qué proporción da un slime que se estira sin pegarse?</p>
      <MesaViva desde={190} piezas={piezas} destinos={destinos} soltar={soltar} />
      {msg && <p className="-mt-2 text-sm">› {msg}</p>}
      {grado >= 9 && peg > 0 && <p className="-mt-2 text-xs text-[var(--suave)]">Proporción activador ÷ pegante ≈ {f(R * 100)} % (agua aparte).</p>}
      {prueba && (
        <p className="rounded-lg bg-[var(--tarjeta)] p-2 text-sm"><b>¿Por qué?</b> El pegante es un polímero: cadenas larguísimas de alcohol polivinílico (PVA) que se deslizan unas sobre otras, por eso es líquido. El activador une las cadenas entre sí como puentes (entrecruzamiento) y forma una red: con pocos puentes queda pegajoso, con los justos se estira (slime) y con demasiados queda rígido y se rompe.{grado >= 9 ? ' Es un fluido no newtoniano: fluye despacio, pero si lo jalas de golpe se rompe.' : ''}{grado >= 11 ? ' El ion borato B(OH)₄⁻ forma enlaces reversibles con los grupos –OH de dos cadenas de PVA; como se rompen y se rehacen, el slime fluye.' : ''}</p>
      )}
    </>
  )
}

function Bioplastico({ grado }: { grado: number }) {
  const [fec, setFec] = useState(0)
  const [agua, setAgua] = useState(0)
  const [vin, setVin] = useState(0)
  const [gli, setGli] = useState(0)
  const [estufa, setEstufa] = useState(false)
  const [T, setT] = useState(22)
  const [agit, setAgit] = useState(0)
  const [gel, setGel] = useState(0) // minutos de cocción caliente y agitada
  const [molde, setMolde] = useState<{ fec: number; gli: number; vin: number; gel: number; agua: number } | null>(null)
  const [h, setH] = useState(0)
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)

  useEffect(() => {
    const activo = (estufa && T < 90) || (!estufa && T > 22.5) || (agit > 0 && T >= 70)
    if (!activo || molde) return
    const id = window.setTimeout(() => {
      setT((t) => (estufa ? Math.min(90, t + 8) : Math.max(22, t - 4)))
      if (agit > 0) { setAgit((a) => a - 1); if (T >= 70 && fec) setGel((g) => g + 1) }
      if (estufa && T >= 88 && agit === 0 && fec) setMsg({ t: 'Sin revolver se pega al fondo y se forman grumos. Usa la varilla.', aviso: true })
    }, 1000)
    return () => window.clearTimeout(id)
  })
  useEffect(() => {
    if (!molde || h >= 24) return
    const id = window.setTimeout(() => setH((x) => x + 2), 1000)
    return () => window.clearTimeout(id)
  }, [molde, h])

  const listo = gel >= 4
  const piezas: Pieza[] = [
    { id: 'fec', nombre: 'Fécula de maíz (de a 5 g)', x: 50, y: 360, ancho: 50, alto: 80, tomable: true, color: '#fffdf4', dibujo: <Envase c="#fffdf4" t="Fécula" /> },
    { id: 'agua', nombre: 'Agua (de a 20 mL)', x: 115, y: 360, ancho: 50, alto: 80, tomable: true, color: '#a9d3f5', dibujo: <Envase c="#a9d3f5" t="Agua" /> },
    { id: 'vin', nombre: 'Vinagre (de a 5 mL)', x: 180, y: 360, ancho: 50, alto: 80, tomable: true, color: '#efe7c4', dibujo: <Envase c="#efe7c4" t="Vinagre" /> },
    { id: 'gli', nombre: 'Glicerina (de a 2 mL)', x: 245, y: 360, ancho: 40, alto: 80, tomable: true, color: '#f6f9fb', dibujo: <Envase c="#f6f9fb" t="Glicerina" gotero /> },
    { id: 'varilla', nombre: 'Cuchara de palo (revuelve 2 min)', x: 150, y: 260, ancho: 100, alto: 16, tomable: true, dibujo: Varilla },
    { id: 'olla', nombre: `Olla · ${f(T)} °C · ${fec} g de fécula, ${agua} mL de agua, ${vin} mL de vinagre, ${gli} mL de glicerina${listo ? ' · gel translúcido' : gel ? ' · espesando' : ''}`, x: 440, y: 320, ancho: 120, alto: 90, tomable: fec > 0 && !molde,
      dibujo: <g><path d="M-50 -24 h100 v44 q0 14 -14 14 h-72 q-14 0 -14 -14 z" fill="#8a96a3" stroke="#2b2b2b" strokeWidth="2" /><rect x="-70" y="-22" width="20" height="6" fill="#333" />{fec > 0 && <rect x="-46" y="-18" width="92" height="12" rx="4" fill={listo ? 'rgba(240,240,225,0.75)' : '#fbf8ee'} />}{agit > 0 && <path d="M-10 -50 L6 -10" stroke="#a5743f" strokeWidth="5"><animateTransform attributeName="transform" type="rotate" values="-10 0 -10;10 0 -10;-10 0 -10" dur="0.8s" repeatCount="indefinite" /></path>}{T > 50 && [-20, 10].map((x) => <path key={x} d={`M${x} -30 q4 -6 0 -12`} fill="none" stroke="#bbb" />)}</g> },
    { id: 'estufa', nombre: estufa ? 'Estufa encendida (toca: apagar)' : 'Estufa (toca: encender)', x: 440, y: 390, ancho: 140, alto: 22, alTocar: () => setEstufa((v) => !v), dibujo: <g><rect x="-66" y="-6" width="132" height="18" rx="4" fill="#5d6d7e" stroke="#2b2b2b" strokeWidth="2" /><circle cx="54" cy="3" r="5" fill={estufa ? '#e74c3c' : '#999'} /></g> },
    { id: 'molde', nombre: molde ? `Molde · secando ${h} de 24 h` : 'Molde (lámina engrasada)', x: 720, y: 360, ancho: 160, alto: 50,
      dibujo: <g><rect x="-70" y="-12" width="140" height="24" rx="4" fill="#d8dde2" stroke="#2b2b2b" strokeWidth="2" />{molde && <rect x="-62" y="-6" width="124" height="12" rx="3" fill={h >= 24 ? (molde.gli ? '#efe9d2' : '#f3f1ea') : 'rgba(240,240,225,0.85)'} />}{molde && h >= 24 && !molde.gli && <path d="M-40 -6 l10 12 M10 -6 l-6 12 M40 -6 l8 12" stroke="#999" />}</g> },
    { id: 'caneca', nombre: 'Empezar de nuevo (toca)', x: 940, y: 370, ancho: 50, alto: 70, alTocar: () => { setFec(0); setAgua(0); setVin(0); setGli(0); setEstufa(false); setT(22); setAgit(0); setGel(0); setMolde(null); setH(0); setMsg({ t: 'Todo lavado.' }) }, dibujo: <g transform="scale(0.8)"><Caneca /></g> },
  ]
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'olla') return en === 'molde' ? { anim: 'verter', hecho: () => { setMolde({ fec, gli, vin, gel, agua }); setEstufa(false); setMsg({ t: 'Extendido en el molde. Ahora a secar: 1 s = 2 h.' }) } } : 'Viértelo al molde.'
    if (en !== 'olla') return 'Va a la olla.'
    if (molde) return 'Ya pasaste la mezcla al molde: empieza de nuevo para otra.'
    if (de === 'fec') return { anim: 'polvo', hecho: () => setFec((x) => x + 5) }
    if (de === 'agua') return { anim: 'verter', hecho: () => setAgua((x) => x + 20) }
    if (de === 'vin') return { anim: 'verter', hecho: () => setVin((x) => x + 5) }
    if (de === 'gli') return { anim: 'gotas', gotas: 4, hecho: () => setGli((x) => x + 2) }
    if (de === 'varilla') return !fec ? 'No hay nada que revolver.' : { anim: 'frotar', hecho: () => { setAgit(2); setMsg(T < 70 ? { t: 'Revuelves, pero en frío la fécula no se transforma: enciende la estufa.', aviso: true } : { t: `Revolviendo en caliente: ${gel} de ~4 min hasta el gel.` }) } }
    return 'No se puede.'
  }
  const destinos = (de: string) => (de === 'olla' ? ['molde'] : ['olla'])
  const res = molde && h >= 24 && (() => {
    if (molde.gel < 4) return { ok: false, t: 'Quedó un polvo blanco que se desmorona: la fécula no se cocinó lo suficiente (necesita calor y revolver hasta volverse un gel translúcido).' }
    if (molde.agua < molde.fec * 3) return { ok: false, t: 'Muy poca agua: quedó una masa gruesa con grumos que se agrietó.' }
    const r = molde.gli / molde.fec
    if (r === 0) return { ok: true, t: 'Lámina dura y quebradiza: se parte como vidrio al doblarla. Sin glicerina, las cadenas quedan muy pegadas.' }
    if (r <= 0.6) return { ok: true, t: `Lámina flexible: se dobla sin romperse. La glicerina (${molde.gli} mL para ${molde.fec} g) hizo de plastificante.` }
    return { ok: false, t: 'Lámina blanda y pegajosa: demasiada glicerina.' }
  })()
  return (
    <>
      <p className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4 text-sm"><b>Bioplástico de fécula.</b> Una receta que funciona: 10 g de fécula, 60 mL de agua, 5 mL de vinagre y algo de glicerina. Mezcla en la olla, calienta revolviendo hasta que se vuelva un gel transparente, extiéndelo en el molde y déjalo secar. Haz una lámina sin glicerina y otra con glicerina y compáralas.</p>
      <MesaViva desde={190} piezas={piezas} destinos={destinos} soltar={soltar} />
      {msg && <p className={`-mt-2 text-sm ${msg.aviso ? 'font-semibold text-[#b5462c]' : ''}`}>{msg.aviso ? '⚠ ' : '› '}{msg.t}</p>}
      {res && <p className={`rounded-lg p-2 text-sm ${res.ok ? 'bg-[#eaf5ee]' : 'bg-[#fbeee9]'}`}><b>Resultado:</b> {res.t}</p>}
      {res && <p className="rounded-lg bg-[var(--tarjeta)] p-2 text-sm"><b>¿Por qué?</b> El almidón de la fécula es un polímero natural: cadenas de glucosa. Con agua caliente los granos se hinchan y las cadenas se sueltan (gelatinización); al secarse se vuelven a juntar formando una lámina. La glicerina se mete entre las cadenas y las deja deslizarse: es un plastificante.{grado >= 9 ? ' A diferencia del polietileno, que viene del petróleo y dura cientos de años, este plástico es biodegradable: los microorganismos se lo comen en semanas.' : ''}{grado >= 11 ? ' El almidón tiene amilosa (cadenas lineales) y amilopectina (ramificadas); el vinagre ayuda a romper parte de la amilopectina y la lámina queda más uniforme.' : ''}</p>}
      <p className="text-xs text-[var(--suave)]">Tiempos acelerados: cocción 1 s = 1 min, secado 1 s = 2 h (en la vida real, 1 o 2 días).</p>
    </>
  )
}
