// Escenas vivas de Química, área 2, tema 8 (opcional, 11°): radiactividad.

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean, mover = 'none', quieto = 'none') => ({ transition: suave, opacity: si ? 1 : 0, transform: si ? mover : quieto })
const fondo = (color: string) => <rect x="-1500" y="-1500" width="3400" height="3300" fill={color} style={{ transition: 'fill 0.8s' }} />
const idx = (orden: string[], fase: string) => Math.max(0, orden.indexOf(fase))

const TINTA = '#3a3a3a'
const AZUL = '#3f6fb8'
const ROJO = '#c43c3c'
const VERDE = '#4f8a3c'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}
const Flecha = ({ id, c }: { id: string; c: string }) => (
  <defs><marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill={c} /></marker></defs>
)

/* ── El descubrimiento ────────────────────────────────────────────────── */

const DESC = ['cajon', 'placa', 'curie']

export function EscenaDescubrimiento({ fase }: { fase: string }) {
  const i = idx(DESC, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Descubrimiento de la radiactividad: ${fase}`} className="h-full w-full">
      {fondo(i === 1 ? '#2a2a30' : '#f4efe6')}
      <g style={ver(i === 0)}>
        <rect x="90" y="90" width="220" height="110" fill="#8a5a34" />
        <rect x="120" y="110" width="160" height="60" fill="#1f1f24" />
        <rect x="170" y="95" width="60" height="22" rx="4" fill="#f2d84b" />
        <T x={200} y={110} t="sal de uranio" s={9} />
        <T x={200} y={235} t="Becquerel (1896) guardó sales de uranio sobre una placa" s={12} />
        <T x={200} y={253} t="fotográfica envuelta en papel negro, dentro de un cajón" s={12} />
      </g>
      <g style={ver(i === 1)}>
        <rect x="120" y="80" width="160" height="110" fill="#111" stroke="#555" />
        <ellipse cx="200" cy="135" rx="45" ry="28" fill="#eee" opacity="0.75" />
        <T x={200} y={235} t="La placa salió velada sin luz: el uranio emitía" s={12} c="#fff" />
        <T x={200} y={253} t="una radiación invisible que atravesaba el papel" s={12} c="#fff" />
      </g>
      <g style={ver(i === 2)}>
        <circle cx="140" cy="110" r="32" fill="#e8d6b0" stroke={TINTA} />
        <T x={140} y={117} t="Po" s={18} />
        <circle cx="260" cy="110" r="32" fill="#e8d6b0" stroke={TINTA} />
        <T x={260} y={117} t="Ra" s={18} />
        <T x={200} y={185} t="Marie y Pierre Curie (1898) hallaron dos elementos nuevos" s={12} />
        <T x={200} y={203} t="mucho más radiactivos: el polonio y el radio" s={12} />
        <T x={200} y={235} t="Marie Curie inventó la palabra «radiactividad»" s={12} c={AZUL} />
        <T x={200} y={253} t="y ganó dos premios Nobel (Física 1903, Química 1911)" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── Alfa, beta y gamma ───────────────────────────────────────────────── */

const TIPOS = ['alfa', 'beta', 'gamma', 'barreras']

export function EscenaTiposRadiacion({ fase }: { fase: string }) {
  const i = idx(TIPOS, fase)
  const muro = (x: number, c: string, n: string, w: number) => (
    <g><rect x={x} y="60" width={w} height="150" fill={c} /><T x={x + w / 2} y={228} t={n} s={10} /></g>
  )
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Tipos de radiación: ${fase}`} className="h-full w-full">
      <Flecha id="rt-a" c={ROJO} /><Flecha id="rt-b" c={AZUL} /><Flecha id="rt-g" c={VERDE} />
      {fondo('#f1eef6')}
      <g style={ver(i === 0)}>
        <circle cx="90" cy="120" r="34" fill="#e8d6b0" stroke={TINTA} /><T x={90} y={126} t="²³⁸U" s={14} />
        {[[-7, -7, ROJO], [7, -7, '#8c8c8c'], [-7, 7, '#8c8c8c'], [7, 7, ROJO]].map(([x, y, c], k) => <circle key={k} cx={230 + (x as number)} cy={120 + (y as number)} r="8" fill={c as string} stroke="#fff" />)}
        <line x1="130" y1="120" x2="205" y2="120" stroke={ROJO} strokeWidth="3" markerEnd="url(#rt-a)" />
        <T x={300} y={110} t="α = 2 protones" s={12} /><T x={300} y={128} t="+ 2 neutrones" s={12} />
        <T x={200} y={200} t="²³⁸U → ²³⁴Th + α" s={16} c={ROJO} />
        <T x={200} y={235} t="Alfa: un núcleo de helio. Pesada y lenta; la frena una hoja de papel" s={11} peso={600} />
      </g>
      <g style={ver(i === 1)}>
        <circle cx="90" cy="120" r="30" fill="#e8d6b0" stroke={TINTA} /><T x={90} y={126} t="¹⁴C" s={14} />
        <line x1="125" y1="120" x2="225" y2="120" stroke={AZUL} strokeWidth="2" markerEnd="url(#rt-b)" />
        <circle cx="235" cy="120" r="5" fill={AZUL} />
        <T x={300} y={115} t="β = un electrón" s={12} /><T x={300} y={133} t="que sale del núcleo" s={11} peso={600} />
        <T x={200} y={200} t="¹⁴C → ¹⁴N + β" s={16} c={AZUL} />
        <T x={200} y={235} t="Un neutrón se vuelve protón: cambia el elemento (C → N)" s={11} peso={600} />
      </g>
      <g style={ver(i === 2)}>
        <circle cx="90" cy="120" r="30" fill="#e8d6b0" stroke={TINTA} />
        <path d="M 125 120 q 8 -12 16 0 t 16 0 t 16 0 t 16 0 t 16 0 t 16 0 t 16 0" fill="none" stroke={VERDE} strokeWidth="3" markerEnd="url(#rt-g)" />
        <T x={300} y={115} t="γ = energía pura" s={12} /><T x={300} y={133} t="(como la luz, sin masa)" s={11} peso={600} />
        <T x={200} y={200} t="El núcleo suelta energía sobrante" s={14} c={VERDE} />
        <T x={200} y={235} t="Gamma: no cambia el elemento; es la más penetrante" s={11} peso={600} />
      </g>
      <g style={ver(i === 3)}>
        <circle cx="40" cy="135" r="20" fill="#e8d6b0" stroke={TINTA} />
        {muro(130, '#f5f5f5', 'papel', 6)}{muro(210, '#c9ccd1', 'aluminio', 14)}{muro(300, '#6b6f78', 'plomo', 30)}
        <line x1="60" y1="100" x2="128" y2="100" stroke={ROJO} strokeWidth="3" markerEnd="url(#rt-a)" />
        <line x1="60" y1="135" x2="208" y2="135" stroke={AZUL} strokeWidth="3" markerEnd="url(#rt-b)" />
        <line x1="60" y1="170" x2="298" y2="170" stroke={VERDE} strokeWidth="3" markerEnd="url(#rt-g)" />
        <line x1="330" y1="170" x2="385" y2="170" stroke={VERDE} strokeWidth="1.5" strokeDasharray="3 3" />
        <T x={200} y={260} t="α se queda en el papel · β en el aluminio · γ casi solo con plomo" s={12} />
      </g>
    </svg>
  )
}

/* ── Fisión nuclear ───────────────────────────────────────────────────── */

const FISION = ['neutron', 'rompe', 'cadena']

export function EscenaFision({ fase }: { fase: string }) {
  const i = idx(FISION, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Fisión nuclear: ${fase}`} className="h-full w-full">
      <Flecha id="fi-n" c="#666" />
      {fondo(i === 2 ? '#fdf1e6' : '#eef3f7')}
      <g style={ver(i < 2)}>
        <circle cx="60" cy="130" r="7" fill="#8c8c8c" />
        <line x1="70" y1="130" x2="140" y2="130" stroke="#666" strokeWidth="2" markerEnd="url(#fi-n)" />
        <g style={ver(i === 0)}><circle cx="190" cy="130" r="42" fill="#e8d6b0" stroke={TINTA} /><T x={190} y={136} t="²³⁵U" s={16} /></g>
        <g style={ver(i === 1)}>
          <circle cx="210" cy="90" r="28" fill="#e8d6b0" stroke={TINTA} /><T x={210} y={95} t="Ba" s={14} />
          <circle cx="215" cy="175" r="26" fill="#e8d6b0" stroke={TINTA} /><T x={215} y={180} t="Kr" s={14} />
          {[[300, 80], [320, 130], [300, 185]].map(([x, y], k) => <g key={k}><line x1="240" y1="130" x2={x - 10} y2={y} stroke="#666" strokeWidth="1.5" markerEnd="url(#fi-n)" /><circle cx={x} cy={y} r="6" fill="#8c8c8c" /></g>)}
          <T x={150} y={60} t="💥 energía" s={13} c={ROJO} />
        </g>
        <T x={200} y={250} t={i === 0 ? 'Un neutrón golpea un núcleo de uranio-235' : 'Se parte en dos núcleos medianos, suelta energía y 2–3 neutrones'} s={12} />
      </g>
      <g style={ver(i === 2)}>
        {[[60, 140, 0], [150, 90, 1], [150, 190, 1], [250, 60, 2], [250, 120, 2], [250, 170, 2], [250, 225, 2]].map(([x, y, n], k) => (
          <circle key={k} cx={x} cy={y} r={18 - n * 3} fill={['#f6cf7a', '#f4a07a', ROJO][n]} opacity="0.85" />
        ))}
        <T x={330} y={145} t="…" s={30} />
        <T x={200} y={260} t="Reacción en cadena: en un reactor se controla para dar electricidad;" s={11} />
        <T x={200} y={278} t="sin control, es una bomba atómica" s={11} c={ROJO} />
      </g>
    </svg>
  )
}
