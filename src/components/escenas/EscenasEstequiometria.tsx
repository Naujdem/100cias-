// Escenas vivas de Química, área 3, tema 8: estequiometría.

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
const Emo = ({ x, y, e, s = 22, o = 1 }: { x: number; y: number; e: string; s?: number; o?: number }) => (
  <text x={x} y={y} textAnchor="middle" fontSize={s} opacity={o} style={{ transition: 'opacity 0.8s' }}>{e}</text>
)
const h2 = (x: number, y: number, o = 1) => <g opacity={o} style={{ transition: 'opacity 0.8s' }}><circle cx={x - 6} cy={y} r={7} fill={H} stroke="#999" /><circle cx={x + 6} cy={y} r={7} fill={H} stroke="#999" /></g>
const o2 = (x: number, y: number, o = 1) => <g opacity={o} style={{ transition: 'opacity 0.8s' }}><circle cx={x - 7} cy={y} r={8} fill={O} /><circle cx={x + 7} cy={y} r={8} fill={O} /></g>
const agua = (x: number, y: number) => <g><circle cx={x} cy={y} r={8} fill={O} /><circle cx={x - 8} cy={y + 6} r={5} fill={H} stroke="#999" /><circle cx={x + 8} cy={y + 6} r={5} fill={H} stroke="#999" /></g>

/* ── La receta ────────────────────────────────────────────────────────── */

const RECETA = ['cocina', 'ecuacion', 'doble']

export function EscenaReceta({ fase }: { fase: string }) {
  const i = idx(RECETA, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`La ecuación como receta: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <T x={200} y={120} t="→" s={30} />
      <g style={ver(i === 0)}>
        <Emo x={60} y={115} e="🌽" /><Emo x={90} y={115} e="🌽" />
        <T x={120} y={112} t="+" s={18} />
        <Emo x={150} y={115} e="💧" />
        {[250, 280, 310, 340].map((x) => <circle key={x} cx={x} cy={108} r={13} fill="#f2d68a" stroke="#c9a54a" />)}
        <T x={105} y={160} t="2 tazas de harina + 1 de agua" s={12} />
        <T x={295} y={160} t="4 arepas" s={12} />
        <T x={200} y={235} t="Una receta dice en qué proporción se mezclan las cosas" s={13} />
      </g>
      <g style={ver(i === 1)}>
        {h2(60, 100)}{h2(60, 130)}<T x={100} y={120} t="+" s={18} />{o2(140, 115)}
        {agua(270, 100)}{agua(270, 135)}
        <T x={200} y={185} t="2 H₂ + 1 O₂ → 2 H₂O" s={20} c={AZUL} />
        <T x={200} y={225} t="2 mol de hidrógeno con 1 mol de oxígeno" s={13} />
        <T x={200} y={243} t="dan 2 mol de agua" s={13} />
      </g>
      <g style={ver(i === 2)}>
        {[85, 115, 145, 175].map((y) => <g key={y}>{h2(50, y - 30)}</g>)}
        <T x={85} y={120} t="+" s={18} />{o2(125, 100)}{o2(125, 135)}
        {[70, 100, 130, 160].map((y) => <g key={y}>{agua(270, y - 20)}</g>)}
        <T x={200} y={195} t="4 mol H₂ + 2 mol O₂ → 4 mol H₂O" s={18} c={VERDE} />
        <T x={200} y={235} t="Si se duplica la receta, se duplica todo" s={13} />
      </g>
    </svg>
  )
}

/* ── Masa-masa: el propano ────────────────────────────────────────────── */

const MASA = ['gramos', 'moles', 'relacion', 'resultado']

export function EscenaMasaMasa({ fase }: { fase: string }) {
  const i = idx(MASA, fase)
  const cajas: [string, string, string][] = [
    ['44 g', 'C₃H₈', AZUL], ['1 mol', 'C₃H₈', VERDE], ['3 mol', 'CO₂', VERDE], ['132 g', 'CO₂', ROJO],
  ]
  const ops = ['÷ 44 g/mol', '× 3/1', '× 44 g/mol']
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Problema masa-masa: ${fase}`} className="h-full w-full">
      <defs><marker id="em-f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill={TINTA} /></marker></defs>
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef2f6" />
      <T x={200} y={50} t="C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O" s={17} />
      {cajas.map(([v, f, c], k) => (
        <g key={k} style={{ transition: suave, opacity: i >= k ? 1 : 0.15 }}>
          <rect x={18 + k * 96} y="100" width="80" height="62" rx="10" fill="#fff" stroke={c} strokeWidth={i === k ? 3 : 1.5} />
          <T x={58 + k * 96} y={128} t={v} s={16} c={c} />
          <T x={58 + k * 96} y={150} t={f} s={12} />
        </g>
      ))}
      {ops.map((op, k) => (
        <g key={op} style={ver(i > k)}>
          <line x1={99 + k * 96} y1="131" x2={113 + k * 96} y2="131" stroke={TINTA} strokeWidth="2" markerEnd="url(#em-f)" />
          <T x={106 + k * 96} y={90} t={op} s={10} c={k === 1 ? VERDE : AZUL} />
        </g>
      ))}
      <T x={200} y={210} t={['Dato: 44 g de gas propano', 'Paso 1: gramos a moles', 'Paso 2: la ecuación dice 1 C₃H₈ → 3 CO₂', 'Paso 3: moles a gramos'][i]} s={14} />
      <g style={ver(i === 3)}>
        <T x={200} y={245} t="Sale el triple de masa en CO₂: se le suma el oxígeno del aire" s={12} c={ROJO} />
      </g>
    </svg>
  )
}

/* ── Reactivo límite: sánduches y moléculas ───────────────────────────── */

const LIM = ['receta', 'sanduches', 'moleculas']

export function EscenaLimite({ fase }: { fase: string }) {
  const i = idx(LIM, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Reactivo límite: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <g style={ver(i === 0)}>
        <Emo x={80} y={130} e="🍞" s={40} /><Emo x={130} y={130} e="🍞" s={40} />
        <T x={165} y={124} t="+" s={22} /><Emo x={200} y={130} e="🧀" s={40} />
        <T x={245} y={124} t="→" s={26} /><Emo x={300} y={130} e="🥪" s={44} />
        <T x={200} y={210} t="2 panes + 1 queso → 1 sánduche" s={16} c={AZUL} />
      </g>
      <g style={ver(i === 1)}>
        {Array.from({ length: 10 }, (_, k) => <Emo key={k} x={40 + (k % 5) * 34} y={k < 5 ? 80 : 120} e="🍞" o={k < 6 ? 0.25 : 1} />)}
        {Array.from({ length: 3 }, (_, k) => <Emo key={k} x={60 + k * 50} y={165} e="🧀" o={0.25} />)}
        <T x={225} y={120} t="→" s={26} />
        {Array.from({ length: 3 }, (_, k) => <Emo key={k} x={280 + k * 36} y={110} e="🥪" s={30} />)}
        <T x={315} y={160} t="+ sobran 4 panes" s={12} c={ROJO} />
        <T x={200} y={220} t="El queso se acabó primero: es el reactivo límite" s={13} c={VERDE} />
        <T x={200} y={240} t="El pan sobra: es el reactivo en exceso" s={13} c={ROJO} />
      </g>
      <g style={ver(i === 2)}>
        {[0, 1, 2, 3].map((k) => <g key={k}>{h2(50 + (k % 2) * 34, 80 + Math.floor(k / 2) * 30, 0.3)}</g>)}
        {[0, 1, 2].map((k) => <g key={k}>{o2(50 + k * 38, 160, k < 2 ? 0.3 : 1)}</g>)}
        <T x={200} y={130} t="→" s={26} />
        {[0, 1, 2, 3].map((k) => <g key={k}>{agua(270 + (k % 2) * 40, 90 + Math.floor(k / 2) * 40)}</g>)}
        {o2(330, 175)}<T x={330} y={200} t="sobra" s={10} c={ROJO} />
        <T x={200} y={230} t="4 H₂ + 3 O₂ → 4 H₂O + 1 O₂ que sobra" s={14} />
        <T x={200} y={252} t="H₂: 4 ÷ 2 = 2 recetas · O₂: 3 ÷ 1 = 3 recetas → el H₂ limita" s={11} peso={600} c={VERDE} />
      </g>
    </svg>
  )
}
