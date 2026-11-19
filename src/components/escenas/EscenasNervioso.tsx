import type { ReactNode } from 'react'
// Escenas vivas del área 6, tema 6 (Sistema nervioso).

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease, fill 0.8s ease, stroke 0.8s ease'
const TINTA = '#3a3a3a'
const AZUL = '#2f6fc1'
const ROJO = '#c43c3c'
const VERDE = '#3f9a5a'
const MORADO = '#7a4a9a'
const AMARILLO = '#e0a020'
const FONDO = '#f3f0ea'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c} stroke="#fff" strokeWidth="3" paintOrder="stroke">{t}</text>
}
function Ver({ si, children }: { si: boolean; children: ReactNode }) {
  return <g style={{ transition: suave, opacity: si ? 1 : 0 }}>{children}</g>
}
const idx = (lista: string[], fase: string) => Math.max(0, lista.indexOf(fase))

/* ── 1. El mapa: central y periférico ───────────────────────────────────── */

const MAPA = ['todo', 'central', 'periferico', 'recibe']

export function EscenaNerMapa({ fase }: { fase: string }) {
  const i = idx(MAPA, fase)
  const cen = i === 0 || i === 1 || i === 3
  const per = i === 0 || i === 2 || i === 3
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`El sistema nervioso: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <path d="M 150 10 a 28 28 0 1 1 -0.1 0 Z M 95 75 Q 150 62 205 75 L 230 160 L 215 165 L 200 110 L 205 290 H 160 L 150 200 L 140 290 H 95 L 100 110 L 85 165 L 70 160 Z" fill="#f6e3d3" stroke="#d8b99c" strokeWidth="2" />
      <g style={{ transition: suave, opacity: per ? 1 : 0.15 }}>
        <path d="M 150 90 L 90 155 M 150 90 L 210 155 M 150 180 L 120 285 M 150 180 L 180 285 M 150 110 L 110 110 M 150 140 L 190 140" stroke={AMARILLO} strokeWidth="3" fill="none" />
      </g>
      <g style={{ transition: suave, opacity: cen ? 1 : 0.15 }}>
        <ellipse cx="150" cy="36" rx="22" ry="17" fill="#e8b0c0" stroke={MORADO} strokeWidth="2" />
        <line x1="150" y1="52" x2="150" y2="185" stroke={MORADO} strokeWidth="6" strokeLinecap="round" />
      </g>
      <Ver si={i === 0}><T x={300} y={140} t="Sistema nervioso" c={AZUL} s={16} /><T x={300} y={160} t="una red que lo conecta todo" s={11} peso={600} /></Ver>
      <Ver si={i === 1}><T x={300} y={130} t="Central (SNC)" c={MORADO} s={16} /><T x={300} y={150} t="encéfalo y médula espinal" s={11} peso={600} /><T x={300} y={166} t="procesan y deciden" s={11} peso={600} /></Ver>
      <Ver si={i === 2}><T x={300} y={130} t="Periférico (SNP)" c="#a07010" s={16} /><T x={300} y={150} t="los nervios" s={11} peso={600} /><T x={300} y={166} t="llevan y traen mensajes" s={11} peso={600} /></Ver>
      <Ver si={i === 3}>
        <T x={300} y={110} t="1. Recibe 👁️" c={VERDE} s={14} />
        <T x={300} y={140} t="2. Procesa 🧠" c={MORADO} s={14} />
        <T x={300} y={170} t="3. Responde 💪" c={ROJO} s={14} />
      </Ver>
    </svg>
  )
}

/* ── 2. La neurona y el impulso ─────────────────────────────────────────── */

const NEU = ['partes', 'impulso', 'mielina']

export function EscenaNerNeurona({ fase }: { fase: string }) {
  const i = idx(NEU, fase)
  const viaja = i >= 1
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`La neurona: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      {/* dendritas y cuerpo */}
      {[[-40, -30], [-45, 10], [-30, 40], [-10, -45], [5, 45]].map(([dx, dy], k) => (
        <line key={k} x1="80" y1="150" x2={80 + dx} y2={150 + dy} stroke={MORADO} strokeWidth="4" strokeLinecap="round" />
      ))}
      <circle cx="80" cy="150" r="24" fill="#d8c0e8" stroke={MORADO} strokeWidth="3" />
      <circle cx="80" cy="150" r="8" fill={MORADO} />
      {/* axón */}
      <line x1="104" y1="150" x2="330" y2="150" stroke={MORADO} strokeWidth="5" />
      <g style={{ transition: suave, opacity: i >= 2 ? 1 : 0 }}>
        {[130, 175, 220, 265].map((x) => <rect key={x} x={x} y="140" width="36" height="20" rx="10" fill="#f6ecc8" stroke="#c9a640" strokeWidth="2" />)}
      </g>
      {[[0, -25], [12, 0], [0, 25]].map(([dx, dy], k) => (
        <g key={k}><line x1="330" y1="150" x2={355 + dx} y2={150 + dy} stroke={MORADO} strokeWidth="3" /><circle cx={355 + dx} cy={150 + dy} r="6" fill={MORADO} /></g>
      ))}
      <Ver si={i === 0}>
        <T x={45} y={95} t="dendritas" c={MORADO} s={11} /><T x={80} y={205} t="cuerpo" s={11} /><T x={215} y={135} t="axón" c={MORADO} s={11} /><T x={360} y={205} t="terminales" s={11} />
        <T x={200} y={30} t="Recibe por las dendritas y envía por el axón" c={AZUL} s={13} />
      </Ver>
      {/* el impulso */}
      <circle cx={viaja ? 330 : 104} cy="150" r="9" fill={AMARILLO} stroke="#fff" strokeWidth="2" style={{ transition: `cx ${i >= 2 ? 0.5 : 1.6}s linear`, opacity: viaja ? 1 : 0 }} />
      <Ver si={i === 1}><T x={200} y={30} t="El impulso nervioso es una señal eléctrica" c={AMARILLO} s={13} /><T x={200} y={250} t="viaja en una sola dirección: hacia las terminales" s={11} peso={600} /></Ver>
      <Ver si={i === 2}><T x={200} y={30} t="La mielina aísla el axón: el impulso va a saltos, más rápido" c="#a07010" s={12} /><T x={200} y={250} t="hasta ≈ 120 m/s, más rápido que un carro de carreras" s={11} peso={600} /></Ver>
    </svg>
  )
}

/* ── 3. La sinapsis ─────────────────────────────────────────────────────── */

const SIN = ['llega', 'suelta', 'recibe', 'sustancias']

export function EscenaNerSinapsis({ fase }: { fase: string }) {
  const i = idx(SIN, fase)
  const libres = i >= 1
  const psi = i === 3
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`La sinapsis: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <path d="M 40 60 H 170 Q 200 150 170 240 H 40 Z" fill="#e6d4f0" stroke={MORADO} strokeWidth="3" />
      <path d="M 360 60 H 245 Q 215 150 245 240 H 360 Z" fill="#d4e4f4" stroke={AZUL} strokeWidth="3" />
      <T x={95} y={50} t="neurona que envía" c={MORADO} s={11} /><T x={305} y={50} t="neurona que recibe" c={AZUL} s={11} />
      <T x={207} y={270} t="espacio sináptico" s={10} peso={600} />
      {/* vesículas */}
      {[[120, 110], [140, 150], [115, 190]].map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r="14" fill="#fff" stroke={MORADO} strokeWidth="2" style={{ transition: suave, opacity: libres ? 0.3 : 1 }} />
      ))}
      {/* receptores */}
      {[110, 150, 190].map((y) => <rect key={y} x="238" y={y - 8} width="10" height="16" rx="3" fill={AZUL} />)}
      {/* neurotransmisores */}
      {Array.from({ length: 9 }, (_, k) => {
        const y0 = 110 + (k % 3) * 40, x0 = 120 + (k % 2) * 10
        const x1 = 222 + (k % 2) * 6, y1 = 105 + (k % 3) * 40 + Math.floor(k / 3) * 4
        return <circle key={k} cx={libres ? x1 : x0} cy={libres ? y1 : y0} r="4" fill={ROJO} style={{ transition: 'cx 1.2s ease, cy 1.2s ease' }} />
      })}
      <Ver si={psi}>
        {[[215, 125], [225, 165], [215, 185]].map(([x, y], k) => <rect key={k} x={x - 5} y={y - 5} width="10" height="10" fill="#333" transform={`rotate(45 ${x} ${y})`} />)}
      </Ver>
      <Ver si={i === 0}><T x={200} y={22} t="El impulso llega al final del axón" c={AMARILLO} s={13} /><circle cx="160" cy="150" r="8" fill={AMARILLO} /></Ver>
      <Ver si={i === 1}><T x={200} y={22} t="Suelta neurotransmisores al espacio" c={ROJO} s={13} /></Ver>
      <Ver si={i === 2}><T x={200} y={22} t="Se unen a los receptores: nace un nuevo impulso" c={AZUL} s={13} /><circle cx="290" cy="150" r="8" fill={AMARILLO} /></Ver>
      <Ver si={psi}><T x={200} y={22} t="Las sustancias psicoactivas alteran este paso" c={TINTA} s={13} /><T x={200} y={292} t="imitan, bloquean o aumentan a los neurotransmisores" s={10} peso={600} /></Ver>
    </svg>
  )
}

/* ── 4. El arco reflejo ─────────────────────────────────────────────────── */

const REF = ['receptor', 'sensitiva', 'medula', 'motora', 'musculo']
const RPUNTO: [number, number][] = [[330, 90], [250, 120], [150, 170], [230, 210], [300, 200]]

export function EscenaNerReflejo({ fase }: { fase: string }) {
  const i = idx(REF, fase)
  const [x, y] = RPUNTO[i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`El arco reflejo: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      {/* médula en corte */}
      <ellipse cx="140" cy="180" rx="45" ry="38" fill="#f0e2ea" stroke={MORADO} strokeWidth="3" />
      <path d="M 120 165 Q 140 195 160 165 Q 150 200 140 210 Q 130 200 120 165 Z" fill="#c8a0d8" />
      <T x={140} y={240} t="médula espinal" c={MORADO} s={11} />
      {/* mano y fogón */}
      <text x="345" y="85" textAnchor="middle" fontSize="28">🔥</text>
      <text x="320" y="110" textAnchor="middle" fontSize="34" style={{ transition: suave, transform: i >= 4 ? 'translate(-10px, 50px)' : 'none' }}>✋</text>
      {/* neuronas */}
      <path d="M 320 100 C 280 110 220 120 160 170" fill="none" stroke={VERDE} strokeWidth="4" style={{ transition: suave, opacity: i >= 1 ? 1 : 0.3 }} />
      <path d="M 145 185 C 200 210 250 215 300 205" fill="none" stroke={ROJO} strokeWidth="4" style={{ transition: suave, opacity: i >= 3 ? 1 : 0.3 }} />
      <path d="M 280 190 q 20 -15 40 0 q -20 25 -40 0" fill="#d47a6a" style={{ transition: suave, opacity: i >= 4 ? 1 : 0.4 }} />
      <circle cx={x} cy={y} r="9" fill={AMARILLO} stroke="#fff" strokeWidth="2" style={{ transition: 'cx 1s ease, cy 1s ease' }} />
      <T x={200} y={24} t={['El receptor de la piel siente el calor', 'La neurona sensitiva lleva el aviso', 'La médula responde sola, sin esperar al cerebro', 'La neurona motora lleva la orden', 'El músculo se contrae: la mano se retira'][i]} c={AZUL} s={13} />
      <Ver si={i >= 2}><T x={200} y={290} t="el cerebro se entera después: por eso el dolor llega tarde" s={10} peso={600} /></Ver>
    </svg>
  )
}

/* ── 5. El encéfalo ─────────────────────────────────────────────────────── */

const ENC = ['encefalo', 'cerebro', 'cerebelo', 'tronco', 'lobulos']

export function EscenaNerEncefalo({ fase }: { fase: string }) {
  const f = ENC.includes(fase) ? fase : 'encefalo'
  const on = (k: string) => f === 'encefalo' || f === k || (f === 'lobulos' && k === 'cerebro')
  const lob = f === 'lobulos'
  const TXT: Record<string, [string, string]> = {
    encefalo: ['El encéfalo', 'cerebro, cerebelo y tronco encefálico'],
    cerebro: ['Cerebro', 'pensar, recordar, sentir, mover a voluntad'],
    cerebelo: ['Cerebelo', 'equilibrio y coordinación de movimientos'],
    tronco: ['Tronco encefálico', 'respirar, latido, tragar: lo automático'],
    lobulos: ['Lóbulos del cerebro', 'cada zona tiene sus tareas'],
  }
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={TXT[f][0]} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <g style={{ transition: suave, opacity: on('cerebro') ? 1 : 0.2 }}>
        <path d="M 60 170 C 40 90 120 40 200 50 C 290 55 320 120 300 170 C 260 185 230 175 200 180 C 150 190 90 195 60 170 Z" fill="#e8b0c0" stroke="#b07088" strokeWidth="3" />
        <path d="M 100 90 q 20 20 0 40 M 150 70 q 20 30 -5 60 M 210 65 q -15 30 10 60 M 260 90 q -20 25 5 50" fill="none" stroke="#b07088" strokeWidth="2" />
      </g>
      <g style={{ transition: suave, opacity: lob ? 0.85 : 0 }}>
        <path d="M 200 50 C 120 45 50 90 60 165 L 150 150 L 170 52 Z" fill="#5aa0d6" />
        <path d="M 170 52 L 150 150 L 240 140 L 250 60 C 230 52 215 50 200 50 Z" fill="#7ac07a" />
        <path d="M 250 60 C 290 70 315 120 300 170 L 240 140 Z" fill="#e0a040" />
        <path d="M 60 165 L 150 150 L 240 140 L 230 178 C 160 190 90 195 60 170 Z" fill="#c070c0" />
        <T x={105} y={115} t="frontal" s={10} /><T x={205} y={100} t="parietal" s={10} /><T x={285} y={130} t="occipital" s={10} /><T x={150} y={175} t="temporal" s={10} />
      </g>
      <g style={{ transition: suave, opacity: on('cerebelo') ? 1 : 0.2 }}>
        <ellipse cx="270" cy="200" rx="42" ry="26" fill="#d890a8" stroke="#a06078" strokeWidth="2" />
        <path d="M 240 195 h 60 M 238 205 h 62 M 245 215 h 50" stroke="#a06078" strokeWidth="1.5" />
      </g>
      <g style={{ transition: suave, opacity: on('tronco') ? 1 : 0.2 }}>
        <path d="M 200 175 C 205 210 210 240 205 290 H 225 C 228 240 225 205 230 172 Z" fill="#c890a0" stroke="#a06078" strokeWidth="2" />
      </g>
      <T x={120} y={240} t={TXT[f][0]} c={AZUL} s={16} />
      <T x={120} y={262} t={TXT[f][1]} s={11} peso={600} />
    </svg>
  )
}
