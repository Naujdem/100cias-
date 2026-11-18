// Escenas vivas de Química, área 4, tema 7: equilibrio químico.

const suave = 'all 1.1s cubic-bezier(.45,.05,.25,1)'
const ver = (si: boolean) => ({ transition: 'opacity 0.7s ease', opacity: si ? 1 : 0 })
const idx = (orden: string[], fase: string) => Math.max(0, orden.indexOf(fase))

const TINTA = '#3a3a3a'
const AZUL = '#3f6fb8'
const ROJO = '#c43c3c'
const VERDE = '#4f8a3c'
const MANGO = '#f6b73c'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}

/* ── Ida y vuelta ─────────────────────────────────────────────────────── */

const IV = ['ida', 'vuelta', 'flecha']

export function EscenaIdaVuelta({ fase }: { fase: string }) {
  const i = idx(IV, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Reacciones reversibles: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <g style={ver(i === 0)}>
        <rect x="70" y="90" width="80" height="100" fill="#fff" stroke="#bbb" />
        <path d="M200 140 h40" stroke={TINTA} strokeWidth="3" markerEnd="url(#iv-f)" />
        <path d="M270 190 q20 -30 50 -10 q20 -20 40 10 z" fill="#555" />
        <T x={110} y={210} t="papel" s={12} /><T x={315} y={210} t="ceniza y humo" s={12} />
        <T x={200} y={250} t="Con la ceniza no se puede volver a hacer el papel" s={13} />
        <T x={200} y={272} t="reacción irreversible: va en un solo sentido →" s={11} peso={600} />
      </g>
      <g style={ver(i === 1)}>
        <rect x="160" y="50" width="80" height="160" rx="20" fill="#7b4a2a" opacity="0.85" />
        <rect x="178" y="32" width="44" height="20" fill={ROJO} />
        {Array.from({ length: 8 }, (_, k) => (
          <circle key={k} cx={175 + (k % 4) * 16} cy="190" r="3" fill="#fff">
            <animate attributeName="cy" values="195;65;195" dur={`${2 + (k % 3) * 0.4}s`} begin={`${k * 0.2}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <T x={200} y={240} t="Gaseosa tapada: el CO₂ sale del líquido y vuelve a entrar" s={13} />
        <T x={200} y={262} t="las dos cosas pasan a la vez, todo el tiempo" s={11} peso={600} />
      </g>
      <g style={ver(i === 2)}>
        <T x={200} y={120} t="CO₂ (gas) + H₂O ⇌ H₂CO₃" s={22} c={AZUL} />
        <path d="M150 155 h100" stroke={VERDE} strokeWidth="3" markerEnd="url(#iv-f)" />
        <path d="M250 175 h-100" stroke={ROJO} strokeWidth="3" markerEnd="url(#iv-f)" />
        <T x={200} y={150} t="ida (directa)" s={10} c={VERDE} /><T x={200} y={195} t="vuelta (inversa)" s={10} c={ROJO} />
        <T x={200} y={245} t="La doble flecha ⇌ dice que la reacción es reversible" s={13} />
      </g>
      <defs><marker id="iv-f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill={TINTA} /></marker></defs>
    </svg>
  )
}

/* ── Equilibrio dinámico: los canastos de mangos ──────────────────────── */

const ED = ['inicio', 'pasando', 'equilibrio']

export function EscenaEquilibrioDinamico({ fase }: { fase: string }) {
  const i = idx(ED, fase)
  const izq = [20, 14, 12][i], der = [0, 6, 8][i]
  const canasto = (x: number, n: number, c: string, et: string) => (
    <g>
      <path d={`M${x - 55} 120 h110 l-12 70 h-86 z`} fill="#c9a77a" stroke="#8a6a44" strokeWidth="2" />
      {Array.from({ length: n }, (_, k) => <ellipse key={k} cx={x - 38 + (k % 5) * 19} cy={176 - Math.floor(k / 5) * 13} rx="9" ry="7" fill={MANGO} stroke="#c98a1c" style={{ transition: suave }} />)}
      <T x={x} y={210} t={`${et}: ${n}`} s={13} c={c} />
    </g>
  )
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Equilibrio dinámico: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      {canasto(100, izq, AZUL, 'reactivos')}
      {canasto(300, der, ROJO, 'productos')}
      <g style={ver(i >= 1)}>
        <ellipse cx="200" cy="80" rx="9" ry="7" fill={MANGO}>
          <animateTransform attributeName="transform" type="translate" values="-100 40; 100 40" dur={i === 2 ? '1.2s' : '0.8s'} repeatCount="indefinite" />
        </ellipse>
        <path d="M130 70 h140" stroke={VERDE} strokeWidth="2" markerEnd="url(#ed-f)" />
        <T x={200} y={60} t={i === 2 ? 'ida: 1 por segundo' : 'ida: muchos por segundo'} s={10} c={VERDE} />
      </g>
      <g style={ver(i === 2)}>
        <ellipse cx="200" cy="100" rx="9" ry="7" fill={MANGO}>
          <animateTransform attributeName="transform" type="translate" values="100 0; -100 0" dur="1.2s" repeatCount="indefinite" />
        </ellipse>
        <path d="M270 112 h-140" stroke={ROJO} strokeWidth="2" markerEnd="url(#ed-f)" />
        <T x={200} y={128} t="vuelta: 1 por segundo" s={10} c={ROJO} />
      </g>
      <T x={200} y={248} t={['Al principio solo hay reactivos', 'La ida va rápido; la vuelta empieza despacio', 'Ida y vuelta al mismo ritmo: las cantidades ya no cambian'][i]} s={13} />
      <T x={200} y={270} t={i === 2 ? 'Equilibrio dinámico: no se detiene, pero no se nota cambio' : ' '} s={12} c={VERDE} />
      <defs><marker id="ed-f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill={TINTA} /></marker></defs>
    </svg>
  )
}

/* ── Le Chatelier en el balancín ──────────────────────────────────────── */

const LC = ['equilibrio', 'agrego', 'responde']

export function EscenaLeChatelier({ fase }: { fase: string }) {
  const i = idx(LC, fase)
  const giro = [0, -14, 0][i]
  const izq = [5, 9, 7][i], der = [5, 5, 7][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Principio de Le Chatelier: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef2f6" />
      <path d="M200 170 l-22 50 h44 z" fill="#8a6a44" />
      <g style={{ transition: suave, transformOrigin: '200px 170px', transform: `rotate(${giro}deg)` }}>
        <rect x="50" y="162" width="300" height="10" rx="4" fill="#6b4f2a" />
        {Array.from({ length: izq }, (_, k) => <circle key={`a${k}`} cx={70 + (k % 5) * 18} cy={150 - Math.floor(k / 5) * 18} r="8" fill={AZUL} style={{ transition: suave }} />)}
        {Array.from({ length: der }, (_, k) => <circle key={`b${k}`} cx={258 + (k % 5) * 18} cy={150 - Math.floor(k / 5) * 18} r="8" fill={ROJO} style={{ transition: suave }} />)}
      </g>
      <T x={110} y={60} t="reactivos" s={13} c={AZUL} /><T x={290} y={60} t="productos" s={13} c={ROJO} />
      <g style={ver(i === 1)}><T x={110} y={85} t="+ agrego reactivo" s={12} c={AZUL} /></g>
      <g style={ver(i === 2)}><path d="M150 90 h100" stroke={VERDE} strokeWidth="3" markerEnd="url(#lc-f)" /><T x={200} y={82} t="se corre hacia productos" s={11} c={VERDE} /></g>
      <T x={200} y={252} t={['En equilibrio', 'Algo lo desequilibra', 'El sistema reacciona para contrarrestar el cambio'][i]} s={14} />
      <T x={200} y={274} t="Principio de Le Chatelier" s={11} peso={600} />
      <defs><marker id="lc-f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill={VERDE} /></marker></defs>
    </svg>
  )
}

/* ── El equilibrio en la naturaleza ───────────────────────────────────── */

const EN = ['cueva', 'altura', 'haber']

export function EscenaEquilibrioNaturaleza({ fase }: { fase: string }) {
  const i = idx(EN, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Equilibrio en la naturaleza: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={i === 0 ? '#5a4a3a' : '#f4f1ea'} style={{ transition: suave }} />
      <g style={ver(i === 0)}>
        <path d="M0 0 H400 V40 Q300 60 200 45 T0 50 Z" fill="#8a7a66" />
        {[80, 150, 230, 310].map((x, k) => <path key={x} d={`M${x - 10} ${45 + (k % 2) * 4} L${x} ${110 + k * 12} L${x + 10} ${45 + (k % 2) * 4} Z`} fill="#d9cdb8" />)}
        {[100, 170, 250].map((x, k) => <path key={x} d={`M${x - 14} 230 L${x} ${170 - k * 10} L${x + 14} 230 Z`} fill="#d9cdb8" />)}
        <rect x="0" y="228" width="400" height="80" fill="#6b5a46" />
        <circle cx="150" cy="122" r="3" fill="#9cc7e6"><animate attributeName="cy" values="122;225" dur="1.8s" repeatCount="indefinite" /></circle>
        <T x={200} y={258} t="CaCO₃ + CO₂ + H₂O ⇌ Ca(HCO₃)₂" s={14} c="#fff" />
        <T x={200} y={280} t="La gota suelta CO₂, el equilibrio se corre y queda caliza: estalactitas" s={11} peso={600} c="#fff" />
      </g>
      <g style={ver(i === 1)}>
        <path d="M0 230 L120 120 L200 170 L300 60 L400 200 V300 H0 Z" fill="#8aa86b" />
        <circle cx="80" cy="100" r="18" fill="#c43c3c" /><T x={80} y={105} t="Hb" s={11} c="#fff" />
        <T x={200} y={40} t="Hb + O₂ ⇌ HbO₂" s={18} c={ROJO} />
        <T x={200} y={252} t="En la altura hay menos O₂: el equilibrio se corre a la izquierda" s={12} />
        <T x={200} y={274} t="el cuerpo responde fabricando más hemoglobina en unas semanas" s={11} peso={600} />
      </g>
      <g style={ver(i === 2)}>
        <rect x="120" y="70" width="160" height="130" rx="14" fill="#9aa1a8" stroke={TINTA} strokeWidth="3" />
        <T x={200} y={110} t="N₂ + 3 H₂ ⇌ 2 NH₃" s={16} />
        <T x={200} y={140} t="alta presión" s={11} c={AZUL} />
        <T x={200} y={160} t="catalizador de hierro" s={11} c={VERDE} />
        <T x={200} y={180} t="se retira el NH₃" s={11} c={ROJO} />
        <T x={200} y={240} t="Proceso Haber: amoníaco para los abonos" s={14} />
        <T x={200} y={262} t="Le Chatelier aplicado para sacar más producto" s={11} peso={600} />
      </g>
    </svg>
  )
}
