// Escenas vivas de Química, área 3, tema 7: el mol.

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean) => ({ transition: suave, opacity: si ? 1 : 0 })
const idx = (orden: string[], fase: string) => Math.max(0, orden.indexOf(fase))

const TINTA = '#3a3a3a'
const AZUL = '#3f6fb8'
const ROJO = '#c43c3c'
const VERDE = '#4f8a3c'
const O = '#e2685c', H = '#f0f0f0'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}
const agua = (x: number, y: number, k: number, r = 1) => (
  <g key={k}><circle cx={x} cy={y} r={7 * r} fill={O} /><circle cx={x - 7 * r} cy={y + 5 * r} r={4 * r} fill={H} stroke="#bbb" /><circle cx={x + 7 * r} cy={y + 5 * r} r={4 * r} fill={H} stroke="#bbb" /></g>
)

/* ── Unidades para contar ─────────────────────────────────────────────── */

const CONTAR = ['docena', 'resma', 'mol']

export function EscenaMolContar({ fase }: { fase: string }) {
  const i = idx(CONTAR, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Unidades para contar: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <g style={ver(i === 0)}>
        <rect x="110" y="80" width="180" height="90" rx="10" fill="#c9a77a" />
        {Array.from({ length: 12 }, (_, k) => <ellipse key={k} cx={135 + (k % 6) * 26} cy={k < 6 ? 108 : 145} rx="11" ry="14" fill="#f7efe1" stroke="#c9b48f" />)}
        <T x={200} y={210} t="1 docena = 12" s={22} c={AZUL} />
      </g>
      <g style={ver(i === 1)}>
        {Array.from({ length: 8 }, (_, k) => <rect key={k} x={140 + k * 3} y={70 + k * 10} width="120" height="80" fill="#fff" stroke="#bbb" />)}
        <T x={200} y={210} t="1 resma = 500 hojas" s={22} c={AZUL} />
      </g>
      <g style={ver(i === 2)}>
        <path d="M150 70 L250 70 L240 170 L160 170 Z" fill="#e6f1f8" stroke={TINTA} strokeWidth="2" />
        <rect x="163" y="130" width="74" height="38" fill="#9cc7e6" opacity="0.8" />
        {Array.from({ length: 10 }, (_, k) => agua(172 + (k % 5) * 14, 140 + Math.floor(k / 5) * 14, k, 0.6))}
        <T x={200} y={205} t="1 mol = 6,022 × 10²³" s={22} c={ROJO} />
        <T x={200} y={230} t="18 g de agua: una cucharada grande" s={13} />
        <T x={200} y={255} t="Contando uno por segundo, tardarías más de" s={11} peso={600} />
        <T x={200} y={271} t="un millón de veces la edad del universo" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── Masa molar del agua ──────────────────────────────────────────────── */

const MM = ['atomos', 'suma', 'cucharada']

export function EscenaMasaMolar({ fase }: { fase: string }) {
  const i = idx(MM, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Masa molar del agua: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef2f6" />
      <g style={ver(i <= 1)}>
        <circle cx="200" cy="100" r="34" fill={O} stroke={TINTA} /><T x={200} y={106} t="O" s={20} />
        <circle cx="152" cy="138" r="20" fill={H} stroke={TINTA} /><T x={152} y={143} t="H" s={14} />
        <circle cx="248" cy="138" r="20" fill={H} stroke={TINTA} /><T x={248} y={143} t="H" s={14} />
        <g style={ver(i >= 0)}>
          <T x={200} y={60} t="16" s={14} c={ROJO} /><T x={120} y={170} t="1" s={14} c={ROJO} /><T x={280} y={170} t="1" s={14} c={ROJO} />
        </g>
        <g style={ver(i === 0)}><T x={200} y={225} t="Masas atómicas de la tabla: H = 1, O = 16" s={13} /></g>
        <g style={ver(i === 1)}>
          <rect x="95" y="200" width="210" height="40" rx="10" fill="#fff" stroke={TINTA} />
          <T x={200} y={227} t="2 × 1 + 16 = 18 g/mol" s={18} c={VERDE} />
        </g>
      </g>
      <g style={ver(i === 2)}>
        <ellipse cx="200" cy="130" rx="70" ry="30" fill="#c0c6cc" />
        <ellipse cx="200" cy="126" rx="58" ry="22" fill="#9cc7e6" />
        <rect x="265" y="122" width="100" height="10" rx="5" fill="#c0c6cc" />
        <T x={200} y={200} t="18 g de agua = 1 mol" s={18} c={AZUL} />
        <T x={200} y={225} t="= 6,022 × 10²³ moléculas" s={14} />
        <T x={200} y={255} t="Un mol de sal pesa 58,5 g; uno de azúcar, 342 g" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── El camino del mol ────────────────────────────────────────────────── */

const CAMINO = ['gramos', 'moles', 'particulas']

export function EscenaCaminoMol({ fase }: { fase: string }) {
  const i = idx(CAMINO, fase)
  const caja = (x: number, k: number, titulo: string, valor: string, c: string) => (
    <g style={{ transition: suave, opacity: i >= k ? 1 : 0.25 }}>
      <rect x={x - 55} y="100" width="110" height="70" rx="12" fill="#fff" stroke={c} strokeWidth={i === k ? 3 : 1.5} />
      <T x={x} y={125} t={titulo} s={12} c={c} />
      <T x={x} y={152} t={valor} s={15} />
    </g>
  )
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Conversión de gramos a partículas: ${fase}`} className="h-full w-full">
      <defs><marker id="mc-f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill={TINTA} /></marker></defs>
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      {caja(70, 0, 'GRAMOS', '36 g', AZUL)}
      {caja(200, 1, 'MOLES', '2 mol', VERDE)}
      {caja(330, 2, 'PARTÍCULAS', '1,2 × 10²⁴', ROJO)}
      <g style={ver(i >= 1)}>
        <line x1="127" y1="135" x2="143" y2="135" stroke={TINTA} strokeWidth="2" markerEnd="url(#mc-f)" />
        <T x={135} y={90} t="÷ 18 g/mol" s={11} c={VERDE} />
      </g>
      <g style={ver(i >= 2)}>
        <line x1="257" y1="135" x2="273" y2="135" stroke={TINTA} strokeWidth="2" markerEnd="url(#mc-f)" />
        <T x={265} y={90} t="× 6,022 × 10²³" s={11} c={ROJO} />
      </g>
      <T x={200} y={225} t={['36 g de agua sobre la balanza', '36 g × (1 mol / 18 g) = 2 mol', '2 mol × 6,022 × 10²³ = 1,2 × 10²⁴ moléculas'][i]} s={13} />
      <T x={200} y={255} t="Para devolverse: × masa molar y ÷ 6,022 × 10²³" s={11} peso={600} />
    </svg>
  )
}
