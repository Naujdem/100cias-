import type { ReactNode } from 'react'
// Escenas vivas del área 6, tema 1 (Homeostasis: el cuerpo se regula).

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease, fill 0.8s ease, stroke 0.8s ease'
const TINTA = '#3a3a3a'
const AZUL = '#2f7fc1'
const ROJO = '#c43c3c'
const VERDE = '#3f9a5a'
const FONDO = '#f3f0ea'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c} stroke="#fff" strokeWidth="3" paintOrder="stroke">{t}</text>
}
function Ver({ si, children }: { si: boolean; children: ReactNode }) {
  return <g style={{ transition: suave, opacity: si ? 1 : 0 }}>{children}</g>
}
const idx = (lista: string[], fase: string) => Math.max(0, lista.indexOf(fase))

/** Silueta sencilla de una persona; `piel` cambia con el frío o el calor. */
function Persona({ x, y, piel = '#e9b98f', esc = 1 }: { x: number; y: number; piel?: string; esc?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${esc})`}>
      <circle cx="0" cy="-95" r="20" fill={piel} style={{ transition: suave }} />
      <path d="M -26 -70 Q 0 -78 26 -70 L 30 0 H -30 Z" fill="#4f7fa8" />
      <path d="M -26 -68 L -44 -10 M 26 -68 L 44 -10" stroke={piel} strokeWidth="11" strokeLinecap="round" style={{ transition: suave }} />
      <path d="M -16 0 L -18 70 M 16 0 L 18 70" stroke="#5a5048" strokeWidth="13" strokeLinecap="round" />
    </g>
  )
}

/* ── 1. Un valor que se mantiene: temperatura alrededor de 37 °C ─────────── */

const EQUILIBRIO = ['punto', 'perturba', 'corrige', 'rango']
const yT = (t: number) => 150 - (t - 37) * 60

export function EscenaHomeoEquilibrio({ fase }: { fase: string }) {
  const i = idx(EQUILIBRIO, fase)
  const plano = `M 60 ${yT(37)} H 150`
  const baja = `M 150 ${yT(37)} C 175 ${yT(37)} 185 ${yT(36.1)} 205 ${yT(36.1)}`
  const sube = `M 205 ${yT(36.1)} C 225 ${yT(36.1)} 240 ${yT(37.1)} 270 ${yT(37)}`
  const ondas = `M 270 ${yT(37)} Q 285 ${yT(37.3)} 300 ${yT(37)} T 330 ${yT(37)} T 360 ${yT(37)}`
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`La temperatura del cuerpo: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <rect x="50" y="40" width="320" height="210" fill="#fff" stroke="#bbb" />
      <Ver si={i >= 3}><rect x="50" y={yT(37.5)} width="320" height={yT(36.5) - yT(37.5)} fill="#dcefe0" /></Ver>
      <line x1="50" y1={yT(37)} x2="370" y2={yT(37)} stroke={VERDE} strokeWidth="2" strokeDasharray="6 5" />
      <T x={30} y={yT(37) + 4} t="37 °C" c={VERDE} s={11} />
      <T x={30} y={yT(36) + 4} t="36 °C" s={10} peso={600} />
      <T x={30} y={yT(38) + 4} t="38 °C" s={10} peso={600} />
      <T x={210} y={272} t="tiempo →" s={11} peso={600} />
      <path d={plano} fill="none" stroke={ROJO} strokeWidth="4" strokeLinecap="round" />
      <Ver si={i >= 1}>
        <path d={baja} fill="none" stroke={ROJO} strokeWidth="4" strokeLinecap="round" />
        <text x="180" y="85" textAnchor="middle" fontSize="26">🥶</text>
        <T x={180} y={60} t="sale al frío" c={AZUL} s={11} />
      </Ver>
      <Ver si={i >= 2}>
        <path d={sube} fill="none" stroke={ROJO} strokeWidth="4" strokeLinecap="round" />
        <T x={250} y={225} t="el cuerpo lo corrige" c={VERDE} s={11} />
      </Ver>
      <Ver si={i >= 3}>
        <path d={ondas} fill="none" stroke={ROJO} strokeWidth="4" strokeLinecap="round" />
        <T x={315} y={yT(37.5) - 8} t="rango normal" c={VERDE} s={11} />
      </Ver>
    </svg>
  )
}

/* ── 2. El asa de control: estímulo → receptor → centro → efector → respuesta ── */

const ASA = ['estimulo', 'receptor', 'control', 'efector', 'respuesta', 'negativa', 'positiva']
const NODOS: { x: number; y: number; ic: string; n: string; d: string }[] = [
  { x: 200, y: 52, ic: '🥶', n: 'Estímulo', d: 'baja la temperatura' },
  { x: 330, y: 120, ic: '🖐️', n: 'Receptor', d: 'la piel lo detecta' },
  { x: 285, y: 240, ic: '🧠', n: 'Centro de control', d: 'el hipotálamo decide' },
  { x: 115, y: 240, ic: '💪', n: 'Efector', d: 'los músculos tiemblan' },
  { x: 70, y: 120, ic: '🔥', n: 'Respuesta', d: 'se produce calor' },
]

export function EscenaHomeoAsa({ fase }: { fase: string }) {
  const i = idx(ASA, fase)
  const pos = fase === 'positiva'
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`El asa de control: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <defs>
        <marker id="hasa" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#777" /></marker>
      </defs>
      {NODOS.slice(0, 4).map((a, k) => {
        const b = NODOS[k + 1]
        return (
          <Ver key={k} si={i > k}>
            <line x1={a.x + (b.x - a.x) * 0.25} y1={a.y + (b.y - a.y) * 0.25} x2={a.x + (b.x - a.x) * 0.72} y2={a.y + (b.y - a.y) * 0.72} stroke="#777" strokeWidth="3" markerEnd="url(#hasa)" />
          </Ver>
        )
      })}
      {/* la respuesta vuelve sobre el estímulo */}
      <Ver si={i >= 5}>
        <path d="M 85 90 Q 110 45 160 48" fill="none" stroke={pos ? ROJO : VERDE} strokeWidth="5" markerEnd="url(#hasa)" style={{ transition: suave }} />
        <T x={200} y={140} t={pos ? 'Retroalimentación positiva' : 'Retroalimentación negativa'} c={pos ? ROJO : VERDE} s={14} />
        <T x={200} y={160} t={pos ? 'la respuesta AUMENTA el estímulo' : 'la respuesta APAGA el estímulo'} s={11} peso={700} />
        <T x={200} y={180} t={pos ? 'ej.: contracciones del parto' : 'la temperatura vuelve a 37 °C'} s={11} peso={600} />
      </Ver>
      {NODOS.map((n, k) => {
        const on = i >= k
        const ic = pos && k === 0 ? '🤰' : n.ic
        return (
          <g key={k} style={{ transition: suave, opacity: on ? 1 : 0.25 }}>
            <circle cx={n.x} cy={n.y} r="26" fill="#fff" stroke={on ? AZUL : '#bbb'} strokeWidth="3" />
            <text x={n.x} y={n.y + 9} textAnchor="middle" fontSize="24">{ic}</text>
            <T x={n.x} y={n.y - 32} t={n.n} s={11} />
            {!pos && i === k && <T x={n.x} y={n.y + 44} t={n.d} c={AZUL} s={10} peso={700} />}
          </g>
        )
      })}
    </svg>
  )
}

/* ── 3. La temperatura: calor, frío y animales de sangre «fría» ───────────── */

const TEMP = ['normal', 'calor', 'frio', 'ectotermo']

export function EscenaHomeoTemperatura({ fase }: { fase: string }) {
  const i = idx(TEMP, fase)
  const piel = fase === 'calor' ? '#e8957a' : fase === 'frio' ? '#d9c3b6' : '#e9b98f'
  const fondo = fase === 'calor' ? '#fbe6cf' : fase === 'frio' ? '#dfeaf4' : FONDO
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`La temperatura del cuerpo: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={fondo} style={{ transition: suave }} />
      <g style={{ transition: suave, opacity: i === 3 ? 0.25 : 1 }}>
        <Persona x={150} y={200} piel={piel} />
        <g className={fase === 'frio' ? 'animate-pulse' : ''}>
          <Ver si={fase === 'frio'}>
            <path d="M 95 110 l -8 6 l 8 6 l -8 6 M 205 110 l 8 6 l -8 6 l 8 6" fill="none" stroke={AZUL} strokeWidth="3" />
            <T x={150} y={40} t="tiembla · piel pálida · piel de gallina" c={AZUL} s={12} />
          </Ver>
        </g>
        <Ver si={fase === 'calor'}>
          {[[135, 115], [168, 128], [118, 150], [182, 160]].map(([x, y]) => (
            <path key={x} d={`M ${x} ${y} q -5 9 0 12 q 5 -3 0 -12`} fill={AZUL} />
          ))}
          <T x={150} y={40} t="suda · piel roja (los vasos se abren)" c={ROJO} s={12} />
        </Ver>
        <Ver si={fase === 'normal'}><T x={150} y={40} t="adentro, siempre cerca de 37 °C" c={VERDE} s={12} /></Ver>
      </g>
      {/* termómetro interno */}
      <g style={{ transition: suave, opacity: i === 3 ? 0 : 1 }}>
        <rect x="300" y="70" width="24" height="150" rx="12" fill="#fff" stroke="#888" strokeWidth="2" />
        <rect x="306" y="110" width="12" height="110" rx="6" fill={ROJO} />
        <circle cx="312" cy="228" r="16" fill={ROJO} />
        <T x={312} y={60} t="37 °C" c={ROJO} s={13} />
      </g>
      <Ver si={i === 3}>
        <text x="300" y="80" textAnchor="middle" fontSize="40">☀️</text>
        <ellipse cx="280" cy="235" rx="70" ry="18" fill="#9a8f80" />
        <text x="280" y="225" textAnchor="middle" fontSize="44">🦎</text>
        <T x={280} y={270} t="la lagartija se calienta con el sol" c={TINTA} s={12} />
        <T x={200} y={40} t="ectotermo: su temperatura depende del ambiente" c={AZUL} s={12} />
      </Ver>
    </svg>
  )
}

/* ── 4. El agua: lo que entra y lo que sale ──────────────────────────────── */

const AGUA = ['entradas', 'salidas', 'sed', 'rinon', 'equilibrio']

export function EscenaHomeoAgua({ fase }: { fase: string }) {
  const i = idx(AGUA, fase)
  const nivel = fase === 'sed' || fase === 'rinon' ? 0.45 : 0.7
  const alto = 150 * nivel
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`El agua del cuerpo: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      {/* el cuerpo como un tanque */}
      <path d="M 160 70 Q 200 55 240 70 L 250 240 H 150 Z" fill="#fff" stroke="#888" strokeWidth="3" />
      <clipPath id="htanque"><path d="M 160 70 Q 200 55 240 70 L 250 240 H 150 Z" /></clipPath>
      <rect x="140" y={240 - alto} width="120" height={alto} fill="#7fb8e0" clipPath="url(#htanque)" style={{ transition: 'y 1s ease, height 1s ease' }} />
      <circle cx="200" cy="45" r="18" fill="#e9b98f" />
      <T x={200} y={265} t={nivel > 0.6 ? 'agua del cuerpo: estable' : 'falta agua'} c={nivel > 0.6 ? VERDE : ROJO} s={12} />
      <Ver si={i >= 0}>
        <T x={70} y={90} t="ENTRA" c={AZUL} s={13} />
        <text x="70" y="130" textAnchor="middle" fontSize="26">🥤</text>
        <text x="70" y="170" textAnchor="middle" fontSize="26">🍉</text>
        <T x={70} y={195} t="bebidas y comida" s={10} peso={600} />
        <line x1="100" y1="150" x2="145" y2="150" stroke={AZUL} strokeWidth="4" />
      </Ver>
      <Ver si={i >= 1}>
        <T x={330} y={90} t="SALE" c={ROJO} s={13} />
        <text x="310" y="125" textAnchor="middle" fontSize="22">💧</text><T x={350} y={122} t="sudor" s={10} peso={600} />
        <text x="310" y="160" textAnchor="middle" fontSize="22">🌬️</text><T x={350} y={157} t="aliento" s={10} peso={600} />
        <text x="310" y="195" textAnchor="middle" fontSize="22">🚽</text><T x={350} y={192} t="orina" s={10} peso={600} />
        <line x1="255" y1="150" x2="290" y2="150" stroke={ROJO} strokeWidth="4" />
      </Ver>
      <Ver si={fase === 'sed'}>
        <T x={200} y={18} t="el cerebro lo nota: ¡SED!" c={ROJO} s={13} />
      </Ver>
      <Ver si={fase === 'rinon'}>
        <ellipse cx="200" cy="200" rx="14" ry="20" fill="#a8504a" />
        <T x={200} y={18} t="los riñones ahorran agua: orina poca y oscura" c={AZUL} s={12} />
      </Ver>
      <Ver si={fase === 'equilibrio'}>
        <T x={200} y={18} t="lo que entra = lo que sale" c={VERDE} s={14} />
      </Ver>
    </svg>
  )
}

/* ── 5. El azúcar en la sangre: insulina y glucagón ──────────────────────── */

const GLU = ['ayuno', 'comida', 'insulina', 'glucagon']
const yG = (g: number) => 230 - (g - 50) * 1.4

export function EscenaHomeoGlucosa({ fase }: { fase: string }) {
  const i = idx(GLU, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`El azúcar en la sangre: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <rect x="50" y="60" width="320" height="185" fill="#fff" stroke="#bbb" />
      <rect x="50" y={yG(110)} width="320" height={yG(70) - yG(110)} fill="#dcefe0" />
      <T x={28} y={yG(90) + 4} t="normal" c={VERDE} s={10} />
      <T x={210} y={265} t="un día →" s={11} peso={600} />
      <path d={`M 60 ${yG(90)} H 110`} fill="none" stroke="#b5651d" strokeWidth="4" strokeLinecap="round" />
      <Ver si={i >= 1}>
        <path d={`M 110 ${yG(90)} C 130 ${yG(90)} 140 ${yG(150)} 160 ${yG(150)}`} fill="none" stroke="#b5651d" strokeWidth="4" strokeLinecap="round" />
        <text x="125" y="50" textAnchor="middle" fontSize="24">🍚</text>
        <T x={160} y={yG(150) - 10} t="sube después de comer" c={ROJO} s={10} />
      </Ver>
      <Ver si={i >= 2}>
        <path d={`M 160 ${yG(150)} C 185 ${yG(150)} 195 ${yG(92)} 230 ${yG(90)}`} fill="none" stroke="#b5651d" strokeWidth="4" strokeLinecap="round" />
        <T x={215} y={yG(140)} t="páncreas → INSULINA" c={AZUL} s={11} />
        <T x={215} y={yG(128)} t="las células toman el azúcar" s={10} peso={600} />
      </Ver>
      <Ver si={i >= 3}>
        <path d={`M 230 ${yG(90)} C 260 ${yG(90)} 270 ${yG(65)} 295 ${yG(65)} C 315 ${yG(65)} 325 ${yG(88)} 360 ${yG(90)}`} fill="none" stroke="#b5651d" strokeWidth="4" strokeLinecap="round" />
        <T x={310} y={yG(135)} t="páncreas → GLUCAGÓN" c={ROJO} s={11} />
        <T x={310} y={yG(123)} t="el hígado suelta azúcar" s={10} peso={600} />
      </Ver>
    </svg>
  )
}

/* ── 6. Los sistemas trabajan en equipo (mapa del área) ──────────────────── */

const SISTEMAS: { x: number; y: number; ic: string; n: string; g: string }[] = [
  { x: 60, y: 55, ic: '🧠', n: 'Nervioso', g: 'mandan' },
  { x: 60, y: 120, ic: '🧪', n: 'Endocrino', g: 'mandan' },
  { x: 60, y: 185, ic: '❤️', n: 'Circulatorio', g: 'transportan' },
  { x: 60, y: 245, ic: '🫁', n: 'Respiratorio', g: 'entran' },
  { x: 340, y: 55, ic: '🍽️', n: 'Digestivo', g: 'entran' },
  { x: 340, y: 120, ic: '🫘', n: 'Excretor', g: 'salen' },
  { x: 340, y: 185, ic: '🛡️', n: 'Inmune', g: 'defienden' },
  { x: 340, y: 245, ic: '🦴', n: 'Huesos y músculos', g: 'mueven' },
]
const LEMA: Record<string, string> = {
  equipo: 'Ningún sistema trabaja solo',
  mandan: 'Coordinan: dan las órdenes',
  transportan: 'Reparte a todo el cuerpo',
  entran: 'Hacen entrar alimento y oxígeno',
  salen: 'Sacan los desechos y el agua de más',
  defienden: 'Defiende de los microbios',
  mueven: 'Sostienen y mueven el cuerpo',
}

export function EscenaHomeoSistemas({ fase }: { fase: string }) {
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Los sistemas del cuerpo: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <Persona x={200} y={195} esc={1.2} />
      <T x={200} y={28} t={LEMA[fase] ?? LEMA.equipo} c={AZUL} s={14} />
      {SISTEMAS.map((s) => {
        const on = fase === 'equipo' || s.g === fase
        return (
          <g key={s.n} style={{ transition: suave, opacity: on ? 1 : 0.25 }}>
            <line x1={s.x < 200 ? s.x + 28 : s.x - 28} y1={s.y} x2={s.x < 200 ? 165 : 235} y2={Math.min(240, Math.max(90, s.y + 20))} stroke={on ? AZUL : '#ccc'} strokeWidth="2" strokeDasharray="4 4" />
            <circle cx={s.x} cy={s.y} r="24" fill="#fff" stroke={on ? AZUL : '#ccc'} strokeWidth="3" />
            <text x={s.x} y={s.y + 8} textAnchor="middle" fontSize="22">{s.ic}</text>
            <T x={s.x} y={s.y + 38} t={s.n} s={10} />
          </g>
        )
      })}
    </svg>
  )
}
