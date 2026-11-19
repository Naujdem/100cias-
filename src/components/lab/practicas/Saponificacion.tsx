import { useEffect, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Caneca } from '../dibujos.tsx'

// Laboratorio de Química 14 (PLAN-LABORATORIOS.md): saponificación, SOLO SIMULACIÓN (la soda cáustica quema).
// Gafas y guantes que se tocan; aceite de a 25 g y solución de NaOH de a 2 g al vaso del baño María; estufa que se
// toca, temperatura en tiempo real (1 s = 1 min de reacción); la varilla al vaso agita 5 min; la reacción solo avanza
// caliente y agitada, hasta la «traza»; sal al vaso separa el jabón (desde 9°); el vaso al molde; tira de pH al molde.
// Proporción r = NaOH ÷ (0,136 × aceite): < 0,8 grasoso, 0,8–1 bien, 1–1,08 fuerte (curar), > 1,08 cáustico.

const f = (x: number, d = 0) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })
const MIN_TRAZA = 20

export default function Saponificacion({ grado }: { grado: number }) {
  const [epp, setEpp] = useState(false)
  const [sinEpp, setSinEpp] = useState(false)
  const [aceite, setAceite] = useState(0)
  const [naoh, setNaoh] = useState(0)
  const [estufa, setEstufa] = useState(false)
  const [T, setT] = useState(22)
  const [agit, setAgit] = useState(0) // minutos de agitación que quedan
  const [avance, setAvance] = useState(0) // minutos de reacción
  const [sal, setSal] = useState(false)
  const [molde, setMolde] = useState<{ r: number; traza: boolean; sal: boolean } | null>(null)
  const [ph, setPh] = useState<number | null>(null)
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)

  const r = aceite ? naoh / (0.136 * aceite) : 0
  const traza = avance >= MIN_TRAZA
  const reacciona = aceite > 0 && naoh > 0 && T >= 50 && agit > 0 && !traza
  useEffect(() => {
    if (!estufa && T <= 22.5 && !reacciona) return
    const id = window.setTimeout(() => {
      setT((t) => (estufa ? Math.min(80, t + 6) : Math.max(22, t - 3)))
      if (reacciona) { setAvance((a) => a + 1); setAgit((g) => g - 1) }
    }, 1000)
    return () => window.clearTimeout(id)
  })
  useEffect(() => { if (traza && !molde) setMsg({ t: '¡Traza! La mezcla espesó como una natilla y deja marca al levantar la varilla. Ya puedes pasarla al molde.' }) }, [traza])

  const fase = !aceite ? 'vacío' : !naoh ? 'aceite' : traza ? 'traza' : avance > 0 ? 'emulsion' : 'capas'
  const colorVaso = fase === 'traza' ? '#f3e7b8' : fase === 'emulsion' ? '#f0dc8a' : '#e9c94a'
  const nivel = Math.min(70, (aceite + naoh * 2.5) * 0.45)
  const piezas: Pieza[] = [
    { id: 'epp', nombre: epp ? 'Gafas y guantes puestos' : 'Gafas y guantes (toca: ponértelos)', x: 80, y: 380, ancho: 70, alto: 50, alTocar: () => { setEpp(true); setMsg({ t: 'Gafas y guantes puestos. La soda cáustica quema la piel y puede dejar ciego.' }) }, dibujo: <g opacity={epp ? 0.35 : 1}><path d="M-28 -8 h18 a6 6 0 0 1 0 12 h-18 a6 6 0 0 1 0 -12 M2 -8 h18 a6 6 0 0 1 0 12 h-18 a6 6 0 0 1 0 -12" fill="#cfe8fb" stroke="#2b2b2b" strokeWidth="2" /><path d="M-14 16 v-6 h10 v6 l4 12 h-18 Z" fill="#7fb3d5" stroke="#2b2b2b" /><path d="M10 16 v-6 h10 v6 l4 12 h-18 Z" fill="#7fb3d5" stroke="#2b2b2b" /></g> },
    { id: 'aceite', nombre: 'Aceite vegetal (de a 25 g)', x: 170, y: 360, ancho: 50, alto: 90, tomable: true, color: '#e9c94a', dibujo: <g><rect x="-16" y="-30" width="32" height="70" rx="6" fill="#e9c94a" stroke="#2b2b2b" strokeWidth="2" /><rect x="-6" y="-42" width="12" height="12" fill="#c0392b" /><text y="10" textAnchor="middle" fontSize="8" fontWeight="700">Aceite</text></g> },
    { id: 'naoh', nombre: 'Solución de NaOH (soda cáustica, de a 2 g de NaOH)', x: 250, y: 365, ancho: 50, alto: 80, tomable: true, color: '#eef3f6', dibujo: <g><rect x="-20" y="-28" width="40" height="62" rx="5" fill="#eef3f6" stroke="#2b2b2b" strokeWidth="2" /><rect x="-12" y="-14" width="24" height="18" fill="#fff" stroke="#c0392b" /><path d="M-6 -2 l6 -8 l6 8 Z" fill="none" stroke="#c0392b" strokeWidth="1.5" /><text y="20" textAnchor="middle" fontSize="8" fontWeight="700">NaOH</text></g> },
    {
      id: 'vaso', nombre: `Vaso en baño María · ${f(T)} °C${aceite ? ` · ${aceite} g de aceite, ${naoh} g de NaOH` : ''}${agit > 0 && !traza ? ' · agitándose' : ''}`, x: 430, y: 300, ancho: 100, alto: 100, tomable: traza && !molde,
      dibujo: <g>
        <rect x="-56" y="-10" width="112" height="60" rx="6" fill="#bcd9ee" stroke="#2b2b2b" strokeWidth="2" />
        <path d="M-36 -50 V38 Q-36 44 -30 44 H30 Q36 44 36 38 V-50" fill="rgba(255,255,255,0.7)" stroke="#2b2b2b" strokeWidth="2" />
        {aceite > 0 && (fase === 'capas' ? <g><rect x="-34" y={42 - nivel} width="68" height={nivel * 0.65} fill="#e9c94a" /><rect x="-34" y={42 - nivel * 0.35} width="68" height={nivel * 0.35} fill="#eef3f6" /></g> : <rect x="-34" y={42 - nivel} width="68" height={nivel} fill={colorVaso} style={{ transition: 'fill 1s' }} />)}
        {sal && traza && <ellipse cx="0" cy={44 - nivel} rx="30" ry="6" fill="#fffaf0" stroke="#d9cfa8" />}
        {T > 30 && [-30, 0, 30].map((x) => <path key={x} d={`M${x} -18 q4 -6 0 -12`} fill="none" stroke="#bbb" strokeWidth="1.5" />)}
        {agit > 0 && !traza && aceite > 0 && <path d="M-10 -60 L6 30" stroke="#888" strokeWidth="4"><animateTransform attributeName="transform" type="rotate" values="-8 0 30;8 0 30;-8 0 30" dur="0.8s" repeatCount="indefinite" /></path>}
        <text x="0" y="66" textAnchor="middle" fontSize="11" fontFamily="monospace">{f(T)} °C</text>
      </g>,
    },
    { id: 'estufa', nombre: estufa ? 'Estufa encendida (toca: apagar)' : 'Estufa (toca: encender)', x: 430, y: 378, ancho: 140, alto: 22, alTocar: () => setEstufa((v) => !v), dibujo: <g><rect x="-66" y="-6" width="132" height="20" rx="4" fill="#5d6d7e" stroke="#2b2b2b" strokeWidth="2" /><circle cx="54" cy="4" r="6" fill={estufa ? '#e74c3c' : '#999'} /></g> },
    { id: 'varilla', nombre: 'Varilla de vidrio (agita 5 min)', x: 560, y: 400, ancho: 100, alto: 14, tomable: true, dibujo: <rect x="-46" y="-3" width="92" height="6" rx="3" fill="#dfe9ef" stroke="#2b2b2b" /> },
    ...(grado >= 9 ? [{ id: 'sal', nombre: 'Salero (sal común)', x: 640, y: 380, ancho: 40, alto: 50, tomable: !sal, color: '#ffffff', dibujo: <g><rect x="-14" y="-16" width="28" height="40" rx="5" fill="#fff" stroke="#2b2b2b" strokeWidth="2" /><path d="M-14 -16 Q0 -30 14 -16" fill="#bbb" stroke="#2b2b2b" /></g> }] : []),
    {
      id: 'molde', nombre: molde ? `Molde con jabón${ph !== null ? ` · pH ${f(ph, 1)}` : ''}` : 'Molde', x: 760, y: 375, ancho: 110, alto: 60,
      dibujo: <g><path d="M-48 -20 L-42 22 H42 L48 -20" fill="#e6d7c3" stroke="#2b2b2b" strokeWidth="2" />{molde && <rect x="-44" y="-6" width="88" height="26" fill={molde.traza ? '#f6eccb' : '#e9c94a'} />}{molde && !molde.traza && <rect x="-44" y="-6" width="88" height="8" fill="#e9c94a" opacity="0.9" />}</g>,
    },
    { id: 'tira', nombre: 'Tiras de pH', x: 860, y: 400, ancho: 50, alto: 22, tomable: true, dibujo: <g>{['#d42a2a', '#f2d83a', '#4fb04a', '#2a5cb5', '#5a2f9a'].map((c, k) => <rect key={k} x={-15 + k * 6} y="-8" width="5" height="16" fill={c} />)}</g> },
    { id: 'caneca', nombre: 'Residuos (toca: empezar de nuevo)', x: 950, y: 340, ancho: 50, alto: 76, alTocar: () => { setAceite(0); setNaoh(0); setAvance(0); setAgit(0); setSal(false); setMolde(null); setPh(null); setSinEpp(false); setMsg({ t: 'Todo limpio. Empieza otra vez.' }) }, dibujo: <g transform="scale(0.85)"><Caneca /></g> },
  ]

  const destinos = (de: string) => ({ aceite: ['vaso'], naoh: ['vaso'], varilla: ['vaso'], sal: ['vaso'], vaso: ['molde'], tira: ['molde', 'vaso'] } as Record<string, string[]>)[de] ?? []
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'aceite') return en === 'vaso' ? (aceite >= 150 ? 'El vaso ya está bastante lleno.' : { anim: 'verter', hecho: () => setAceite((a) => a + 25) }) : 'El aceite va al vaso.'
    if (de === 'naoh') {
      if (en !== 'vaso') return 'La soda va al vaso.'
      return { anim: 'verter', hecho: () => {
        setNaoh((n) => n + 2)
        if (!epp) { setSinEpp(true); setMsg({ t: 'Manejaste soda cáustica sin gafas ni guantes. En la vida real te habrías quemado.', aviso: true }) }
        else if (!aceite) setMsg({ t: 'Mejor pon primero el aceite y luego la soda, despacio.', aviso: true })
      } }
    }
    if (de === 'varilla') {
      if (!aceite || !naoh) return 'Primero aceite y soda en el vaso.'
      if (traza) return 'Ya hay traza: no hace falta agitar más.'
      return { anim: 'frotar', hecho: () => { setAgit(5); setMsg(T < 50 ? { t: 'Agitas, pero en frío casi no reacciona: enciende la estufa (≈ 70 °C).', aviso: true } : { t: `Agitando 5 min. Llevas ${avance} de unos ${MIN_TRAZA} min.` }) } }
    }
    if (de === 'sal') return en === 'vaso' ? (traza ? { anim: 'polvo', hecho: () => { setSal(true); setMsg({ t: 'La sal separa el jabón (sube y flota) de la glicerina y el agua (abajo): «salado» del jabón.' }) } } : 'La sal se echa cuando ya hay traza.') : 'La sal va al vaso.'
    if (de === 'vaso') return en === 'molde' ? { anim: 'verter', hecho: () => { setMolde({ r, traza, sal }); setEstufa(false); setMsg({ t: 'Al molde. Deja que se endurezca (en la vida real, días a semanas de curado). Mide el pH con una tira.' }) } } : 'El jabón va al molde.'
    if (de === 'tira') {
      if (en === 'vaso') return 'Mejor mide el jabón ya en el molde.'
      if (!molde) return 'El molde está vacío.'
      const p = Math.min(13.5, 9.5 + Math.max(0, molde.r - 0.95) * 30)
      return { anim: 'poner', hecho: () => setPh(p) }
    }
    return 'No se puede.'
  }

  const resultado = molde && ph !== null && (() => {
    if (!molde.traza) return { bien: false, t: 'Se pasó al molde antes de la traza: el aceite y la soda se separaron; queda una capa de aceite encima y soda sin reaccionar abajo. No sirve.' }
    if (molde.r < 0.8) return { bien: false, t: `Poca soda (proporción ${f(molde.r * 100)} % de la necesaria): mucho aceite quedó sin reaccionar y el jabón es blando y grasoso.` }
    if (molde.r <= 1) return { bien: true, t: `¡Buen jabón! Proporción ${f(molde.r * 100)} %: casi toda la grasa reaccionó y sobra un poco de aceite que lo hace suave (jabón «sobreengrasado»).` }
    if (molde.r <= 1.08) return { bien: true, t: `Jabón algo fuerte (proporción ${f(molde.r * 100)} %): sobra un poco de soda; con el curado se suaviza, pero mejor para lavar ropa que para la piel.` }
    return { bien: false, t: `Demasiada soda (proporción ${f(molde.r * 100)} %): jabón cáustico que irrita y quema la piel. No se puede usar.` }
  })()

  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl border-2 border-[#c0392b] bg-[var(--tarjeta)] p-4 text-sm"><b className="text-[#c0392b]">Solo simulación.</b> La soda cáustica (NaOH) quema la piel y los ojos: esta práctica no se hace en el colegio sin un laboratorio y un docente a cargo. La <b>saponificación</b> es la reacción de una grasa o un aceite con una base fuerte: da <b>jabón</b> y <b>glicerina</b>. Ponte el equipo, echa aceite (de a 25 g) y soda (de a 2 g), calienta en el baño María y agita con la varilla hasta la <b>traza</b>. Para 100 g de aceite se necesitan unos 13,6 g de NaOH.</p>
      <MesaViva desde={180} piezas={piezas} destinos={destinos} soltar={soltar} />
      {msg && <p className={`-mt-2 text-sm ${msg.aviso ? 'font-semibold text-[#b5462c]' : ''}`}>{msg.aviso ? '⚠ ' : '› '}{msg.t}</p>}
      {aceite > 0 && !molde && <p className="-mt-2 text-xs text-[var(--suave)]">Reacción: {f(Math.min(avance, MIN_TRAZA))} de ~{MIN_TRAZA} min (1 s = 1 min){T < 50 ? ' · necesita calor' : ''}{agit === 0 && !traza ? ' · necesita agitar' : ''}</p>}
      {resultado && <p className={`rounded-lg p-2 text-sm ${resultado.bien ? 'bg-[#eaf5ee]' : 'bg-[#fbeee9]'}`}><b>{resultado.bien ? 'Resultado: ' : 'Resultado: ✘ '}</b>{resultado.t} pH ≈ {f(ph!, 1)} (un jabón para la piel queda entre 9 y 10).{sinEpp ? ' Además, trabajaste sin gafas ni guantes.' : ''}{molde!.sal ? ' Con la sal, el jabón quedó más puro y la glicerina se fue en el agua.' : ''}</p>}
      {resultado && <p className="rounded-lg bg-[var(--tarjeta)] p-2 text-sm"><b>¿Qué pasó?</b> La base rompe las grasas (triglicéridos) en sus partes: glicerina y sales de ácidos grasos, que son el jabón. Cada molécula de jabón tiene una cabeza que ama el agua y una cola que ama la grasa: por eso atrapa la mugre grasosa y el agua se la lleva.{grado >= 9 ? ' Ecuación: triglicérido + 3 NaOH → glicerina + 3 R–COO⁻Na⁺ (jabón).' : ''}{grado >= 11 ? ' El índice de saponificación dice cuánta base necesita cada gramo de grasa (≈ 0,136 g de NaOH por gramo de aceite vegetal, ≈ 190 mg de KOH/g); por eso la proporción decide si el jabón queda grasoso o cáustico. Es una hidrólisis básica de ésteres.' : ''}</p>}
      <p className="text-xs text-[var(--suave)]">Versión segura para el aula: «jabón de glicerina» que se derrite y se moldea (sin soda), y observar cómo una gota de jabón rompe la mancha de aceite en agua.</p>
    </div>
  )
}
