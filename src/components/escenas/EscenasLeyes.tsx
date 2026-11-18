// Escenas vivas de Química, área 3, tema 6: leyes ponderales.

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean) => ({ transition: suave, opacity: si ? 1 : 0 })
const idx = (orden: string[], fase: string) => Math.max(0, orden.indexOf(fase))

const TINTA = '#3a3a3a'
const AZUL = '#3f6fb8'
const ROJO = '#c43c3c'
const VERDE = '#4f8a3c'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}

/* ── Lavoisier: sistema cerrado y abierto ─────────────────────────────── */

const LAV = ['antes', 'cerrado', 'abierto']

export function EscenaLavoisier({ fase }: { fase: string }) {
  const i = idx(LAV, fase)
  const masa = i === 2 ? '248,2 g' : '250,0 g'
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Conservación de la masa: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      {/* balanza */}
      <rect x="110" y="205" width="180" height="30" rx="6" fill="#6b6b6b" />
      <rect x="150" y="212" width="100" height="16" rx="3" fill="#c9e6b8" />
      <T x={200} y={225} t={masa} s={13} c={i === 2 ? ROJO : TINTA} />
      {/* botella */}
      <path d="M170 200 L170 120 Q170 105 185 100 L185 80 L215 80 L215 100 Q230 105 230 120 L230 200 Z" fill="#e6f1f8" stroke={TINTA} strokeWidth="2" />
      <rect x="172" y="160" width="56" height="38" fill={i === 0 ? '#f2eecb' : '#f6f2d8'} />
      <g style={ver(i >= 1)}>{[[185, 150], [200, 140], [215, 152], [195, 125], [210, 118]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r={4} fill="#fff" stroke="#aaa" />)}</g>
      {/* globo */}
      <g style={ver(i <= 1)}>
        <ellipse cx="200" cy={i === 1 ? 45 : 70} rx={i === 1 ? 32 : 16} ry={i === 1 ? 38 : 12} fill="#e2685c" style={{ transition: 'all 1s' }} />
      </g>
      <g style={ver(i === 2)}>
        {[[190, 60], [210, 45], [225, 65]].map(([x, y], k) => <T key={k} x={x} y={y} t="CO₂" s={11} c={ROJO} />)}
      </g>
      <T x={330} y={120} t={['Antes', 'Cerrado', 'Abierto'][i]} s={16} c={AZUL} />
      <g style={ver(i === 0)}><T x={200} y={268} t="Vinagre en la botella y bicarbonato en el globo" s={12} /></g>
      <g style={ver(i === 1)}><T x={200} y={268} t="El CO₂ infla el globo: nada sale, la masa no cambia" s={12} c={VERDE} /></g>
      <g style={ver(i === 2)}><T x={200} y={268} t="Sin globo, el gas se escapa: parece que la masa baja" s={12} c={ROJO} /></g>
    </svg>
  )
}

/* ── Proust: el agua siempre 1 : 8 ────────────────────────────────────── */

const PRO = ['rio', 'lluvia', 'razon']

export function EscenaProust({ fase }: { fase: string }) {
  const i = idx(PRO, fase)
  const barra = (x: number, h: number, o: number, et: string) => (
    <g>
      <rect x={x} y={200 - o * 7} width="50" height={o * 7} fill="#e2685c" />
      <rect x={x} y={200 - o * 7 - h * 7} width="50" height={h * 7} fill="#cfcfcf" />
      <T x={x + 25} y={200 - o * 3.5 + 4} t={`${o} g O`} s={11} c="#fff" />
      <T x={x + 25} y={200 - o * 7 - h * 3.5 + 4} t={`${h} g H`} s={9} />
      <T x={x + 25} y={218} t={et} s={11} peso={600} />
    </g>
  )
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Proporciones definidas en el agua: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#e9f2f7" />
      <line x1="40" y1="200" x2="360" y2="200" stroke={TINTA} />
      <g style={ver(i >= 0)}>{barra(80, 1, 8, '9 g · río')}</g>
      <g style={ver(i >= 1)}>{barra(175, 2, 16, '18 g · lluvia')}</g>
      <g style={ver(i === 2)}>{barra(270, 3, 24, '27 g · laboratorio')}</g>
      <g style={ver(i === 0)}><T x={200} y={255} t="9 g de agua del río: 1 g de hidrógeno y 8 g de oxígeno" s={12} /></g>
      <g style={ver(i === 1)}><T x={200} y={255} t="El doble de agua, el doble de cada elemento" s={12} /></g>
      <g style={ver(i === 2)}>
        <T x={200} y={250} t="H : O = 1 : 8 siempre" s={18} c={VERDE} />
        <T x={200} y={272} t="Un compuesto tiene una proporción fija; una mezcla, no" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── Dalton: CO y CO₂ ─────────────────────────────────────────────────── */

const DAL = ['co', 'co2', 'razon']

export function EscenaDalton({ fase }: { fase: string }) {
  const i = idx(DAL, fase)
  const at = (x: number, y: number, r: number, c: string, t: string) => <g><circle cx={x} cy={y} r={r} fill={c} stroke={TINTA} /><T x={x} y={y + 5} t={t} s={13} /></g>
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Proporciones múltiples: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <g style={{ transition: suave, opacity: i === 1 ? 0.3 : 1 }}>
        {at(80, 90, 24, '#5a5a5a', 'C')}{at(122, 90, 20, '#e2685c', 'O')}
        <T x={100} y={140} t="CO" s={18} />
        <T x={100} y={162} t="12 g C · 16 g O" s={12} c={AZUL} />
      </g>
      <g style={{ transition: suave, opacity: i === 0 ? 0 : 1 }}>
        {at(258, 90, 20, '#e2685c', 'O')}{at(300, 90, 24, '#5a5a5a', 'C')}{at(342, 90, 20, '#e2685c', 'O')}
        <T x={300} y={140} t="CO₂" s={18} />
        <T x={300} y={162} t="12 g C · 32 g O" s={12} c={AZUL} />
      </g>
      <g style={ver(i === 0)}><T x={200} y={230} t="Monóxido de carbono: un oxígeno por carbono (tóxico)" s={12} /></g>
      <g style={ver(i === 1)}><T x={200} y={230} t="Dióxido de carbono: dos oxígenos por carbono" s={12} /></g>
      <g style={ver(i === 2)}>
        <rect x="120" y="200" width="160" height="40" rx="10" fill="#fff" stroke={TINTA} />
        <T x={200} y={227} t="16 : 32 = 1 : 2" s={18} c={VERDE} />
        <T x={200} y={266} t="Los átomos se unen enteros: nunca 1,37 oxígenos" s={12} />
      </g>
    </svg>
  )
}
