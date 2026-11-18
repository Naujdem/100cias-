// Escenas vivas de Química, área 3, tema 5: balanceo de ecuaciones.

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
const B = ({ x, y, r, c, t }: { x: number; y: number; r: number; c: string; t: string }) => (
  <g><circle cx={x} cy={y} r={r} fill={c} stroke={TINTA} strokeWidth="1.2" /><T x={x} y={y + 4} t={t} s={10} /></g>
)
const h2 = (x: number, y: number) => <g><B x={x - 8} y={y} r={9} c={H} t="H" /><B x={x + 8} y={y} r={9} c={H} t="H" /></g>
const o2 = (x: number, y: number) => <g><B x={x - 10} y={y} r={11} c={O} t="O" /><B x={x + 10} y={y} r={11} c={O} t="O" /></g>
const agua = (x: number, y: number) => <g><B x={x} y={y} r={11} c={O} t="O" /><B x={x - 13} y={y + 10} r={8} c={H} t="H" /><B x={x + 13} y={y + 10} r={8} c={H} t="H" /></g>

/* ── ¿Sobra algo? ─────────────────────────────────────────────────────── */

const CONS = ['sin', 'con', 'subindice']

export function EscenaConservacion({ fase }: { fase: string }) {
  const i = idx(CONS, fase)
  const conteo = (x: number, h: number, o: number, ok: boolean) => (
    <g><T x={x} y={190} t={`H: ${h}   O: ${o}`} s={14} c={ok ? VERDE : ROJO} /></g>
  )
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Conservación de los átomos: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <T x={200} y={120} t="→" s={30} />
      <g style={ver(i === 0)}>
        {h2(70, 110)}<T x={105} y={116} t="+" s={18} />{o2(145, 110)}
        {agua(290, 105)}
        <circle cx="330" cy="105" r="11" fill={O} opacity="0.3" stroke={ROJO} strokeDasharray="3 2" />
        <T x={330} y={80} t="¿y este?" s={10} c={ROJO} />
        {conteo(100, 2, 2, false)}{conteo(290, 2, 1, false)}
        <T x={200} y={245} t="H₂ + O₂ → H₂O" s={18} />
        <T x={200} y={270} t="A la izquierda hay 2 oxígenos y a la derecha solo 1" s={12} c={ROJO} />
      </g>
      <g style={ver(i === 1)}>
        {h2(60, 90)}{h2(60, 130)}<T x={95} y={116} t="+" s={18} />{o2(140, 110)}
        {agua(275, 90)}{agua(275, 135)}
        {conteo(100, 4, 2, true)}{conteo(290, 4, 2, true)}
        <T x={200} y={245} t="2 H₂ + O₂ → 2 H₂O" s={18} c={VERDE} />
        <T x={200} y={270} t="Se agregaron moléculas completas (coeficientes)" s={12} />
      </g>
      <g style={ver(i === 2)}>
        {h2(70, 110)}<T x={105} y={116} t="+" s={18} />{o2(145, 110)}
        <B x={280} y={100} r={11} c={O} t="O" /><B x={302} y={100} r={11} c={O} t="O" /><B x={266} y={112} r={8} c={H} t="H" /><B x={316} y={112} r={8} c={H} t="H" />
        <line x1="250" y1="80" x2="335" y2="135" stroke={ROJO} strokeWidth="4" />
        <T x={290} y={160} t="H₂O₂" s={16} c={ROJO} />
        <T x={200} y={235} t="«Cuadra», pero ya no es agua: es agua oxigenada" s={13} c={ROJO} />
        <T x={200} y={260} t="Los subíndices dicen qué sustancia es: no se tocan" s={12} />
      </g>
    </svg>
  )
}

/* ── El tanteo del metano ─────────────────────────────────────────────── */

const TANTEO = ['contar', 'hidrogeno', 'oxigeno', 'revisar']

export function EscenaTanteo({ fase }: { fase: string }) {
  const i = idx(TANTEO, fase)
  const co = [i >= 2 ? 2 : 1, i >= 1 ? 2 : 1] // coeficientes de O₂ y H₂O
  const filas: [string, number, number][] = [
    ['C', 1, 1],
    ['H', 4, 2 * co[1]],
    ['O', 2 * co[0], 2 + co[1]],
  ]
  const destaca = ['', 'H', 'O', ''][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Balanceo por tanteo: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef2f6" />
      <text x="200" y="60" textAnchor="middle" fontSize="22" fontWeight="800" fill={TINTA}>
        <tspan>CH₄ + </tspan><tspan fill={ROJO}>{co[0] > 1 ? '2 ' : ''}</tspan><tspan>O₂ → CO₂ + </tspan><tspan fill={ROJO}>{co[1] > 1 ? '2 ' : ''}</tspan><tspan>H₂O</tspan>
      </text>
      <T x={130} y={100} t="izquierda" s={11} peso={600} /><T x={270} y={100} t="derecha" s={11} peso={600} />
      {filas.map(([el, a, b], k) => {
        const ok = a === b
        return (
          <g key={el}>
            <rect x="60" y={112 + k * 42} width="280" height="34" rx="8" fill={destaca === el ? '#fff6d6' : '#fff'} stroke={ok ? VERDE : ROJO} strokeWidth="2" style={{ transition: 'stroke 0.6s, fill 0.6s' }} />
            <T x={200} y={135 + k * 42} t={el} s={16} />
            <T x={130} y={135 + k * 42} t={String(a)} s={16} c={ok ? VERDE : ROJO} />
            <T x={270} y={135 + k * 42} t={String(b)} s={16} c={ok ? VERDE : ROJO} />
          </g>
        )
      })}
      <T x={200} y={268} t={['El carbono ya está; el hidrógeno y el oxígeno no', '4 H a la izquierda → 2 H₂O a la derecha', 'Ahora hay 4 O a la derecha → 2 O₂ a la izquierda', '¡Todo cuadra! CH₄ + 2 O₂ → CO₂ + 2 H₂O'][i]} s={13} c={i === 3 ? VERDE : TINTA} />
    </svg>
  )
}

/* ── Redox: el clavo y el cobre ───────────────────────────────────────── */

const REDOX = ['estados', 'electrones', 'agentes']

export function EscenaRedox({ fase }: { fase: string }) {
  const i = idx(REDOX, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Reacción redox del clavo: ${fase}`} className="h-full w-full">
      <defs><marker id="br-f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#d9a520" /></marker></defs>
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <text x="200" y="60" textAnchor="middle" fontSize="20" fontWeight="800" fill={TINTA}>Fe + CuSO₄ → FeSO₄ + Cu</text>
      <g style={ver(i >= 0)}>
        <T x={92} y={35} t="0" s={14} c={AZUL} />
        <T x={152} y={35} t="+2" s={14} c={ROJO} />
        <T x={252} y={35} t="+2" s={14} c={ROJO} />
        <T x={330} y={35} t="0" s={14} c={AZUL} />
      </g>
      <circle cx="120" cy="150" r="34" fill="#9aa3ad" stroke={TINTA} strokeWidth="1.5" /><T x={120} y={156} t="Fe" s={18} />
      <circle cx="280" cy="150" r="30" fill="#d8875a" stroke={TINTA} strokeWidth="1.5" /><T x={280} y={156} t="Cu²⁺" s={16} />
      <g style={ver(i >= 1)}>
        <path d="M155 135 Q200 100 247 135" fill="none" stroke="#d9a520" strokeWidth="3" markerEnd="url(#br-f)" />
        <circle cx="190" cy="112" r="6" fill="#f2c94c" stroke={TINTA} /><circle cx="210" cy="112" r="6" fill="#f2c94c" stroke={TINTA} />
        <T x={200} y={95} t="2 e⁻" s={13} c="#a07a10" />
      </g>
      <g style={ver(i === 0 || i === 1)}>
        <T x={120} y={215} t="0 → +2: sube" s={13} c={ROJO} />
        <T x={280} y={215} t="+2 → 0: baja" s={13} c={AZUL} />
        <T x={200} y={260} t={i === 0 ? 'Mira cómo cambian los estados de oxidación' : 'El hierro pierde 2 electrones y el cobre los gana'} s={13} />
      </g>
      <g style={ver(i === 2)}>
        <T x={120} y={208} t="se OXIDA" s={14} c={ROJO} />
        <T x={120} y={226} t="agente reductor" s={11} peso={600} />
        <T x={280} y={208} t="se REDUCE" s={14} c={AZUL} />
        <T x={280} y={226} t="agente oxidante" s={11} peso={600} />
        <T x={200} y={268} t="OP-RG: Oxidación Pierde, Reducción Gana" s={14} c={VERDE} />
      </g>
    </svg>
  )
}
