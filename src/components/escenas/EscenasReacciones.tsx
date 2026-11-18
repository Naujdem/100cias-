// Escenas vivas de Química, área 3, tema 4: reacciones y ecuaciones químicas.

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean) => ({ transition: suave, opacity: si ? 1 : 0 })
const tenue = (si: boolean) => ({ transition: suave, opacity: si ? 1 : 0.25 })
const mover = (x: number, y: number) => ({ transition: suave, transform: `translate(${x}px, ${y}px)` })
const idx = (orden: string[], fase: string) => Math.max(0, orden.indexOf(fase))

const TINTA = '#3a3a3a'
const AZUL = '#3f6fb8'
const ROJO = '#c43c3c'
const VERDE = '#4f8a3c'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}
const B = ({ x, y, r, c, t }: { x: number; y: number; r: number; c: string; t: string }) => (
  <g><circle cx={x} cy={y} r={r} fill={c} stroke={TINTA} strokeWidth="1.2" /><T x={x} y={y + 4} t={t} s={r > 12 ? 12 : 9} /></g>
)
const C = '#5a5a5a', O = '#e2685c', H = '#f0f0f0'

/* ── Las partes de la ecuación ────────────────────────────────────────── */

const ECU = ['reactivos', 'productos', 'numeros', 'estados']

export function EscenaEcuacion({ fase }: { fase: string }) {
  const i = idx(ECU, fase)
  const metano = (x: number, y: number) => (
    <g><B x={x} y={y} r={14} c={C} t="C" />{[[-16, -12], [16, -12], [-16, 12], [16, 12]].map(([a, b], k) => <B key={k} x={x + a} y={y + b} r={8} c={H} t="H" />)}</g>
  )
  const o2 = (x: number, y: number) => <g><B x={x - 9} y={y} r={11} c={O} t="O" /><B x={x + 9} y={y} r={11} c={O} t="O" /></g>
  const co2 = (x: number, y: number) => <g><B x={x - 20} y={y} r={11} c={O} t="O" /><B x={x} y={y} r={13} c={C} t="C" /><B x={x + 20} y={y} r={11} c={O} t="O" /></g>
  const agua = (x: number, y: number) => <g><B x={x} y={y} r={12} c={O} t="O" /><B x={x - 14} y={y + 11} r={8} c={H} t="H" /><B x={x + 14} y={y + 11} r={8} c={H} t="H" /></g>
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Partes de una ecuación química: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <g style={tenue(i !== 1)}>
        {metano(45, 90)}
        <T x={80} y={95} t="+" s={20} />
        {o2(115, 75)}{o2(115, 108)}
        <rect x="10" y="40" width="140" height="100" rx="12" fill="none" stroke={AZUL} strokeWidth="2" strokeDasharray="5 3" style={ver(i === 0)} />
        <T x={80} y={160} t="reactivos" s={12} c={AZUL} />
      </g>
      <T x={180} y={98} t="→" s={30} />
      <g style={tenue(i !== 0)}>
        {co2(245, 90)}
        <T x={285} y={95} t="+" s={20} />
        {agua(330, 70)}{agua(330, 110)}
        <rect x="210" y="40" width="160" height="100" rx="12" fill="none" stroke={ROJO} strokeWidth="2" strokeDasharray="5 3" style={ver(i === 1)} />
        <T x={290} y={160} t="productos" s={12} c={ROJO} />
      </g>
      <g>
        <text x="200" y="215" textAnchor="middle" fontSize="22" fontWeight="800" fill={TINTA}>
          <tspan>CH</tspan><tspan fill={i === 2 ? VERDE : TINTA} fontSize="15" dy="5">4</tspan>
          <tspan dy="-5">{i === 3 ? '(g) + ' : ' + '}</tspan><tspan fill={i === 2 ? ROJO : TINTA}>2</tspan><tspan> O</tspan><tspan fontSize="15" dy="5">2</tspan>
          <tspan dy="-5">{i === 3 ? '(g) → CO' : ' → CO'}</tspan><tspan fontSize="15" dy="5">2</tspan>
          <tspan dy="-5">{i === 3 ? '(g) + ' : ' + '}</tspan><tspan fill={i === 2 ? ROJO : TINTA}>2</tspan><tspan> H</tspan><tspan fontSize="15" dy="5">2</tspan><tspan dy="-5">O{i === 3 ? '(l)' : ''}</tspan>
        </text>
      </g>
      <g style={ver(i <= 1)}><T x={200} y={260} t="La flecha se lee «produce»: los átomos se reorganizan" s={12} /></g>
      <g style={ver(i === 2)}>
        <T x={200} y={252} t="Coeficiente (rojo): cuántas moléculas. Se puede cambiar al balancear" s={11} c={ROJO} />
        <T x={200} y={270} t="Subíndice (verde): cuántos átomos en la molécula. ¡No se toca!" s={11} c={VERDE} />
      </g>
      <g style={ver(i === 3)}><T x={200} y={260} t="(g) gas · (l) líquido · (s) sólido · (ac) disuelto en agua" s={12} c={AZUL} /></g>
    </svg>
  )
}

/* ── Tipos de reacción con fichas A, B, C, D ──────────────────────────── */

const TIPOS = ['sintesis', 'descomposicion', 'simple', 'doble']
const COL: Record<string, string> = { A: '#7d6bc4', B: '#e2a23c', C: '#4f9a8a', D: '#d0607a' }
const F = ({ l, x, y }: { l: string; x: number; y: number }) => (
  <g style={mover(x, y)}><circle cx={0} cy={0} r={18} fill={COL[l]} stroke={TINTA} /><T x={0} y={5} t={l} c="#fff" s={14} /></g>
)

export function EscenaTiposReaccion({ fase }: { fase: string }) {
  const i = idx(TIPOS, fase)
  // posiciones antes (izquierda) y después (derecha) para cada tipo
  const pos: Record<string, [number, number][]> = {
    sintesis: [[70, 120], [140, 120], [270, 120], [306, 120]],
    descomposicion: [[90, 120], [126, 120], [270, 120], [340, 120]],
    simple: [[60, 120], [120, 120], [156, 120], [0, 0]],
    doble: [[60, 100], [96, 100], [60, 150], [96, 150]],
  }
  const desp: Record<string, [number, number][]> = {
    simple: [[270, 120], [306, 120], [350, 120]],
    doble: [[270, 100], [306, 150], [270, 150], [306, 100]],
  }
  const textos: Record<string, [string, string]> = {
    sintesis: ['A + B → AB', 'Ej.: CaO + H₂O → Ca(OH)₂'],
    descomposicion: ['AB → A + B', 'Ej.: CaCO₃ → CaO + CO₂ (con calor)'],
    simple: ['A + BC → AC + B', 'Ej.: Fe + CuSO₄ → FeSO₄ + Cu'],
    doble: ['AB + CD → AD + CB', 'Ej.: AgNO₃ + NaCl → AgCl + NaNO₃'],
  }
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Tipo de reacción: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef2f6" />
      <T x={200} y={128} t="→" s={30} />
      {TIPOS.map((t, k) => {
        const p = pos[t]
        const activo = k === i
        return (
          <g key={t} style={ver(activo)}>
            {t === 'sintesis' && <><F l="A" x={p[0][0]} y={p[0][1]} /><T x={105} y={126} t="+" s={20} /><F l="B" x={p[1][0]} y={p[1][1]} /><F l="A" x={p[2][0]} y={p[2][1]} /><F l="B" x={p[3][0]} y={p[3][1]} /></>}
            {t === 'descomposicion' && <><F l="A" x={p[0][0]} y={p[0][1]} /><F l="B" x={p[1][0]} y={p[1][1]} /><F l="A" x={p[2][0]} y={p[2][1]} /><T x={305} y={126} t="+" s={20} /><F l="B" x={p[3][0]} y={p[3][1]} /></>}
            {t === 'simple' && <><F l="A" x={p[0][0]} y={p[0][1]} /><T x={90} y={126} t="+" s={20} /><F l="B" x={p[1][0]} y={p[1][1]} /><F l="C" x={p[2][0]} y={p[2][1]} />
              <F l="A" x={desp.simple[0][0]} y={desp.simple[0][1]} /><F l="C" x={desp.simple[1][0]} y={desp.simple[1][1]} /><T x={330} y={126} t="+" s={18} /><F l="B" x={desp.simple[2][0]} y={desp.simple[2][1]} /></>}
            {t === 'doble' && <><F l="A" x={p[0][0]} y={p[0][1]} /><F l="B" x={p[1][0]} y={p[1][1]} /><F l="C" x={p[2][0]} y={p[2][1]} /><F l="D" x={p[3][0]} y={p[3][1]} />
              <F l="A" x={desp.doble[0][0]} y={desp.doble[0][1]} /><F l="D" x={desp.doble[3][0]} y={desp.doble[3][1]} /><F l="C" x={desp.doble[2][0]} y={desp.doble[2][1]} /><F l="B" x={desp.doble[1][0]} y={desp.doble[1][1]} /></>}
            <T x={200} y={220} t={textos[t][0]} s={20} c={AZUL} />
            <T x={200} y={252} t={textos[t][1]} s={13} peso={600} />
          </g>
        )
      })}
    </svg>
  )
}

/* ── El fogón: combustión completa e incompleta ──────────────────────── */

const COMB = ['completa', 'incompleta']

export function EscenaCombustion({ fase }: { fase: string }) {
  const i = idx(COMB, fase)
  const llama = i === 0 ? '#4a7de0' : '#f2a53a'
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Combustión: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={i === 0 ? '#f4f1ea' : '#e7e2d8'} style={{ transition: 'fill 0.8s' }} />
      {/* fogón */}
      <rect x="130" y="190" width="140" height="40" rx="6" fill="#8a8a8a" />
      <rect x="150" y="178" width="100" height="12" fill="#5a5a5a" />
      <path d="M200 175 C170 150 185 120 200 90 C215 120 230 150 200 175 Z" fill={llama} style={{ transition: 'fill 0.8s' }} />
      <path d="M200 172 C188 155 193 135 200 120 C207 135 212 155 200 172 Z" fill="#fff" opacity="0.5" />
      <g style={ver(i === 0)}>
        <T x={95} y={120} t="O₂ suficiente" s={12} c={AZUL} />
        <T x={310} y={70} t="CO₂ + H₂O" s={14} c={VERDE} />
        <T x={200} y={260} t="C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O + energía" s={14} />
        <T x={200} y={280} t="Llama azul: el gas se quema por completo" s={11} peso={600} />
      </g>
      <g style={ver(i === 1)}>
        {[[180, 60], [210, 45], [235, 65], [195, 30]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r={8 + k} fill="#333" opacity="0.6" />)}
        <T x={300} y={60} t="CO (tóxico)" s={14} c={ROJO} />
        <T x={300} y={80} t="+ hollín (C)" s={12} />
        <T x={95} y={120} t="poco O₂" s={12} c={ROJO} />
        <T x={200} y={260} t="Falta oxígeno: llama amarilla, humo y monóxido de carbono" s={12} />
        <T x={200} y={280} t="Ventila siempre la cocina" s={12} c={ROJO} />
      </g>
    </svg>
  )
}
