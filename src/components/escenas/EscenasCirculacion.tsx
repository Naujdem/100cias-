import type { ReactNode } from 'react'
// Escenas vivas del área 6, tema 3 (Respiración y circulación).

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease, fill 0.8s ease, stroke 0.8s ease, d 1s ease'
const TINTA = '#3a3a3a'
const AZUL = '#2f6fc1'
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

/* ── 1. Ventilación: vías respiratorias, inspiración y espiración ───────── */

const VENT = ['vias', 'inspiracion', 'espiracion']

export function EscenaRespVentilacion({ fase }: { fase: string }) {
  const i = idx(VENT, fase)
  const lleno = fase === 'inspiracion'
  const e = lleno ? 1.12 : 1
  const diaY = lleno ? 232 : 212
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`La ventilación: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <path d="M 120 70 Q 200 50 280 70 L 295 270 H 105 Z" fill="#f6e3d3" stroke="#d8b99c" strokeWidth="2" style={{ transition: suave, transform: `scaleX(${lleno ? 1.05 : 1})`, transformOrigin: '200px 160px' }} />
      {/* pulmones */}
      <g style={{ transition: suave, transform: `scale(${e})`, transformOrigin: '200px 150px' }}>
        <path d="M 190 95 C 150 90 130 130 132 190 C 134 215 175 215 190 200 Z" fill="#e8a0a8" stroke="#c46a7a" strokeWidth="2" />
        <path d="M 210 95 C 250 90 270 130 268 190 C 266 215 225 215 210 200 Z" fill="#e8a0a8" stroke="#c46a7a" strokeWidth="2" />
      </g>
      {/* tráquea y bronquios */}
      <path d="M 200 20 V 105 M 200 105 L 172 135 M 200 105 L 228 135" stroke={i === 0 ? AZUL : '#b8a090'} strokeWidth="7" fill="none" strokeLinecap="round" style={{ transition: suave }} />
      {/* diafragma */}
      <path d={`M 110 ${diaY} Q 200 ${diaY - 40} 290 ${diaY}`} fill="none" stroke="#a0522d" strokeWidth="6" style={{ transition: suave }} />
      <Ver si={i === 0}>
        <T x={330} y={30} t="nariz y boca" s={11} /><T x={330} y={60} t="tráquea" s={11} c={AZUL} />
        <T x={330} y={110} t="bronquios" s={11} c={AZUL} /><T x={330} y={160} t="pulmones" s={11} />
        <T x={330} y={210} t="diafragma" s={11} c="#a0522d" />
      </Ver>
      <Ver si={i >= 1}>
        <text x="200" y="14" textAnchor="middle" fontSize="16" fill={lleno ? AZUL : '#888'}>{lleno ? '⬇ aire con O₂' : '⬆ aire con CO₂'}</text>
        <T x={60} y={150} t={lleno ? 'el diafragma baja' : 'el diafragma sube'} c="#a0522d" s={11} />
        <T x={60} y={168} t={lleno ? 'el pecho se agranda' : 'el pecho se achica'} s={11} peso={600} />
        <T x={200} y={292} t={lleno ? 'Inspiración: entra el aire' : 'Espiración: sale el aire'} c={lleno ? AZUL : ROJO} s={13} />
      </Ver>
    </svg>
  )
}

/* ── 2. El alvéolo: intercambio de gases ────────────────────────────────── */

const ALV = ['alveolo', 'oxigeno', 'co2']

export function EscenaRespAlveolo({ fase }: { fase: string }) {
  const i = idx(ALV, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`El alvéolo: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <circle cx="200" cy="120" r="80" fill="#fbe3e6" stroke="#c46a7a" strokeWidth="3" />
      <T x={200} y={70} t="alvéolo (aire)" c="#a04a5a" s={12} />
      <path d="M 40 230 C 120 190 280 190 360 230" fill="none" stroke={i >= 1 ? ROJO : '#6a4a9a'} strokeWidth="26" strokeLinecap="round" style={{ transition: suave }} />
      <T x={200} y={268} t="capilar (sangre)" c={ROJO} s={12} />
      <T x={60} y={262} t="llega" s={10} peso={600} /><T x={340} y={262} t="sale" s={10} peso={600} />
      <Ver si={i >= 1}>
        {[160, 200, 240].map((x, k) => (
          <g key={x} style={{ transition: 'transform 1.4s ease', transform: `translateY(${i >= 1 ? 85 : 0}px)` }}>
            <circle cx={x} cy={115 + k * 5} r="9" fill={AZUL} />
            <text x={x} y={119 + k * 5} textAnchor="middle" fontSize="8" fill="#fff" fontWeight="800">O₂</text>
          </g>
        ))}
        <T x={300} y={130} t="O₂ → sangre" c={AZUL} s={12} />
      </Ver>
      <Ver si={i >= 2}>
        {[180, 225].map((x) => (
          <g key={x} style={{ transition: 'transform 1.4s ease', transform: `translateY(${i >= 2 ? -90 : 0}px)` }}>
            <circle cx={x} cy={205} r="10" fill="#888" />
            <text x={x} y={209} textAnchor="middle" fontSize="7" fill="#fff" fontWeight="800">CO₂</text>
          </g>
        ))}
        <T x={95} y={130} t="CO₂ → aire" c="#666" s={12} />
      </Ver>
      <T x={200} y={22} t="pared de una sola capa de células: los gases la cruzan" s={11} peso={600} />
    </svg>
  )
}

/* ── 3. El corazón: cuatro cámaras y dos bombas ─────────────────────────── */

const COR = ['camaras', 'derecha', 'izquierda', 'valvulas']

export function EscenaCircCorazon({ fase }: { fase: string }) {
  const i = idx(COR, fase)
  const der = i === 1 || i === 0 || i === 3
  const izq = i === 2 || i === 0 || i === 3
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`El corazón: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      {/* lado derecho de la persona (izquierda del dibujo): sangre sin oxígeno */}
      <g style={{ transition: suave, opacity: der ? 1 : 0.3 }}>
        <rect x="110" y="80" width="85" height="60" rx="18" fill="#6a7ac4" />
        <path d="M 110 150 H 195 V 240 Q 150 250 120 210 Z" fill="#5868b4" />
        <T x={152} y={115} t="aurícula der." s={10} c="#fff" />
        <T x={155} y={195} t="ventrículo der." s={10} c="#fff" />
        <T x={130} y={60} t="→ a los pulmones" c={AZUL} s={10} />
      </g>
      <g style={{ transition: suave, opacity: izq ? 1 : 0.3 }}>
        <rect x="205" y="80" width="85" height="60" rx="18" fill="#d65a5a" />
        <path d="M 205 150 H 290 Q 300 220 200 270 Z" fill="#c43c3c" />
        <T x={248} y={115} t="aurícula izq." s={10} c="#fff" />
        <T x={250} y={195} t="ventrículo izq." s={10} c="#fff" />
        <T x={270} y={60} t="→ a todo el cuerpo" c={ROJO} s={10} />
      </g>
      <line x1="200" y1="75" x2="200" y2="265" stroke="#fff" strokeWidth="5" />
      <Ver si={i === 3}>
        {[[152, 145], [248, 145]].map(([x, y]) => <path key={x} d={`M ${x - 18} ${y} L ${x} ${y + 12} L ${x + 18} ${y}`} fill="none" stroke="#f5e08a" strokeWidth="5" />)}
        <T x={200} y={290} t="las válvulas no dejan que la sangre se devuelva" c="#9a7a10" s={11} />
      </Ver>
      <Ver si={i === 1}><T x={330} y={180} t="sangre pobre" c={AZUL} s={11} /><T x={330} y={196} t="en O₂" c={AZUL} s={11} /></Ver>
      <Ver si={i === 2}><T x={70} y={180} t="sangre rica" c={ROJO} s={11} /><T x={70} y={196} t="en O₂" c={ROJO} s={11} /></Ver>
      <Ver si={i === 0}><T x={200} y={290} t="dos aurículas arriba, dos ventrículos abajo" s={11} /></Ver>
      <T x={200} y={22} t="Vista de frente: la derecha de la persona queda a tu izquierda" s={10} peso={600} />
    </svg>
  )
}

/* ── 4. La doble circulación y los vasos ────────────────────────────────── */

const DOBLE = ['menor', 'mayor', 'vasos']

export function EscenaCircDoble({ fase }: { fase: string }) {
  const i = idx(DOBLE, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`La circulación: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <g style={{ transition: suave, opacity: i === 2 ? 0.15 : 1 }}>
        {/* pulmones arriba, cuerpo abajo, corazón al centro */}
        <rect x="140" y="20" width="120" height="40" rx="14" fill="#e8a0a8" /><T x={200} y={45} t="pulmones" s={11} />
        <rect x="140" y="235" width="120" height="45" rx="14" fill="#e9b98f" /><T x={200} y={262} t="resto del cuerpo" s={11} />
        <path d="M 200 120 C 170 95 160 135 200 165 C 240 135 230 95 200 120 Z" fill="#c43c3c" />
        <g style={{ transition: suave, opacity: i === 0 ? 1 : 0.2 }}>
          <path d="M 185 120 C 120 110 120 50 150 45" fill="none" stroke={AZUL} strokeWidth="6" />
          <path d="M 250 45 C 280 50 280 110 215 120" fill="none" stroke={ROJO} strokeWidth="6" />
          <T x={90} y={90} t="circulación menor" c={AZUL} s={12} />
          <T x={90} y={106} t="corazón → pulmones → corazón" s={10} peso={600} />
        </g>
        <g style={{ transition: suave, opacity: i === 1 ? 1 : 0.2 }}>
          <path d="M 215 155 C 300 170 300 230 250 250" fill="none" stroke={ROJO} strokeWidth="6" />
          <path d="M 150 250 C 100 230 100 170 185 155" fill="none" stroke={AZUL} strokeWidth="6" />
          <T x={320} y={200} t="circulación mayor" c={ROJO} s={12} />
          <T x={320} y={216} t="corazón → cuerpo → corazón" s={10} peso={600} />
        </g>
      </g>
      <Ver si={i === 2}>
        <circle cx="90" cy="140" r="34" fill="#fff" stroke={ROJO} strokeWidth="10" /><T x={90} y={200} t="arteria" c={ROJO} s={12} /><T x={90} y={216} t="pared gruesa; sale del corazón" s={9} peso={600} />
        <circle cx="200" cy="140" r="34" fill="#fff" stroke={AZUL} strokeWidth="4" /><T x={200} y={200} t="vena" c={AZUL} s={12} /><T x={200} y={216} t="pared delgada; vuelve al corazón" s={9} peso={600} />
        <circle cx="310" cy="140" r="8" fill="#fff" stroke="#8a4a9a" strokeWidth="2" /><T x={310} y={200} t="capilar" c="#8a4a9a" s={12} /><T x={310} y={216} t="una capa: intercambio" s={9} peso={600} />
      </Ver>
    </svg>
  )
}

/* ── 5. La sangre en un tubo ────────────────────────────────────────────── */

const SANGRE = ['tubo', 'plasma', 'rojos', 'blancos']

export function EscenaCircSangre({ fase }: { fase: string }) {
  const i = idx(SANGRE, fase)
  const sep = i >= 1
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`La sangre: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <rect x="80" y="40" width="60" height="220" rx="28" fill="#fff" stroke="#999" strokeWidth="3" />
      <rect x="86" y="60" width="48" height="194" rx="22" fill={sep ? '#f2d47a' : '#b02a2a'} style={{ transition: suave }} />
      <rect x="86" y="165" width="48" height="89" rx="22" fill="#b02a2a" style={{ transition: suave, opacity: sep ? 1 : 0 }} />
      <rect x="86" y="160" width="48" height="6" fill="#f5f5f5" style={{ transition: suave, opacity: sep ? 1 : 0 }} />
      <Ver si={i === 0}><T x={260} y={150} t="Sangre recién sacada" s={14} /><T x={260} y={170} t="(la centrifugamos…)" s={11} peso={600} /></Ver>
      <Ver si={i >= 1}>
        <line x1="140" y1="100" x2="190" y2="100" stroke="#999" /><T x={280} y={95} t="Plasma ≈ 55 %" c="#a07a1a" s={13} /><T x={280} y={112} t="agua, nutrientes, hormonas" s={10} peso={600} />
      </Ver>
      <Ver si={i >= 2}>
        <line x1="140" y1="210" x2="190" y2="210" stroke="#999" /><T x={280} y={205} t="Glóbulos rojos ≈ 45 %" c={ROJO} s={13} /><T x={280} y={222} t="hemoglobina: llevan el O₂" s={10} peso={600} />
      </Ver>
      <Ver si={i >= 3}>
        <line x1="140" y1="163" x2="190" y2="160" stroke="#999" /><T x={280} y={155} t="Blancos y plaquetas < 1 %" c="#555" s={13} /><T x={280} y={172} t="defienden y coagulan" s={10} peso={600} />
      </Ver>
    </svg>
  )
}

/* ── 6. Otros animales ──────────────────────────────────────────────────── */

const ANIM = ['pez', 'insecto', 'rana']
const LEMA: Record<string, [string, string, string]> = {
  pez: ['🐟', 'Branquias', 'toman el O₂ disuelto en el agua; corazón de 2 cámaras'],
  insecto: ['🦗', 'Tráqueas', 'tubitos que llevan el aire directo a las células'],
  rana: ['🐸', 'Pulmones y piel', 'la piel húmeda también respira; corazón de 3 cámaras'],
}

export function EscenaRespAnimales({ fase }: { fase: string }) {
  const f = ANIM.includes(fase) ? fase : 'pez'
  const [ic, n, d] = LEMA[f]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`${n}: ${d}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={f === 'pez' ? '#dbeaf5' : FONDO} style={{ transition: suave }} />
      <text x="200" y="130" textAnchor="middle" fontSize="90">{ic}</text>
      <Ver si={f === 'pez'}>
        {[0, 1, 2, 3].map((k) => <path key={k} d={`M ${150 + k * 6} ${110 + k * 3} q 8 12 0 24`} fill="none" stroke={ROJO} strokeWidth="3" />)}
        {[0, 1, 2].map((k) => <circle key={k} cx={290 + k * 22} cy={90 - k * 18} r="6" fill="none" stroke={AZUL} strokeWidth="2" />)}
      </Ver>
      <Ver si={f === 'insecto'}>
        <path d="M 140 150 H 260 M 170 150 V 180 M 200 150 V 185 M 230 150 V 180" stroke={AZUL} strokeWidth="3" fill="none" strokeDasharray="5 3" />
      </Ver>
      <T x={200} y={210} t={n} c={VERDE} s={18} />
      <T x={200} y={235} t={d} s={11} peso={600} />
    </svg>
  )
}
