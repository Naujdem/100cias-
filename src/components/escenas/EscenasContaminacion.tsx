import type { ReactNode } from 'react'
// Escenas vivas del área 5, tema 5 (Contaminación).

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease, fill 0.8s ease'
const TINTA = '#3a3a3a'
const ROJO = '#c43c3c'
const fondo = (c: string) => <rect x="-1500" y="-1500" width="3400" height="3300" fill={c} style={{ transition: 'fill 0.8s' }} />

function T({ x, y, t, c = TINTA, s = 11, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c} stroke="#fff" strokeWidth="3" paintOrder="stroke">{t}</text>
}
function Ver({ si, children }: { si: boolean; children: ReactNode }) {
  return <g style={{ transition: suave, opacity: si ? 1 : 0 }}>{children}</g>
}
const humo = (x: number, y: number, k = 1) => <g>{[0, 1, 2].map((n) => <circle key={n} cx={x + n * 10 * k} cy={y - n * 16 * k} r={(8 + n * 5) * k} fill="#777" opacity={0.5 - n * 0.1} />)}</g>

/* ── Contaminación del aire ───────────────────────────────────────────── */

const AIRE = ['fuentes', 'particulas', 'cocina', 'acida']

export function EscenaAireContaminado({ fase }: { fase: string }) {
  const i = Math.max(0, AIRE.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Contaminación del aire: ${fase}`} className="h-full w-full">
      {fondo(i === 3 ? '#d8dcd0' : '#dfe6ea')}
      <Ver si={i === 0}>
        <rect x="-10" y="230" width="420" height="80" fill="#8a8a7a" />
        <text x="70" y="226" textAnchor="middle" fontSize="40">🚌</text>{humo(30, 200)}
        <text x="200" y="226" textAnchor="middle" fontSize="46">🏭</text>{humo(214, 170, 1.3)}
        <text x="330" y="226" textAnchor="middle" fontSize="36">🔥</text>{humo(330, 180, 1.2)}
        <T x={200} y={40} t="vehículos, fábricas y quemas" s={13} />
      </Ver>
      <Ver si={i === 1}>
        {/* comparación de tamaño: un pelo y una PM2.5 */}
        <rect x="40" y="90" width="320" height="40" rx="20" fill="#b89a6a" />
        <T x={200} y={80} t="un pelo humano (unos 70 micras de grueso)" s={11} />
        <circle cx="200" cy="190" r="6" fill="#444" />
        <T x={200} y={220} t="PM2.5: más de 25 veces más delgada" c={ROJO} s={12} />
        <T x={200} y={260} t="pasa la nariz y llega al fondo de los pulmones" s={11} />
      </Ver>
      <Ver si={i === 2}>
        <polygon points="80,140 200,70 320,140" fill="#a0603a" />
        <rect x="100" y="140" width="200" height="120" fill="#e8d8b8" />
        <rect x="150" y="215" width="50" height="45" fill="#7a5a3a" />
        <text x="250" y="250" textAnchor="middle" fontSize="28">🔥</text>
        <ellipse cx="220" cy="175" rx="70" ry="25" fill="#666" opacity="0.55" />
        <T x={200} y={40} t="fogón sin chimenea: el humo se queda en la casa" c={ROJO} s={12} />
      </Ver>
      <Ver si={i === 3}>
        <text x="80" y="230" textAnchor="middle" fontSize="44">🏭</text>{humo(94, 175, 1.3)}
        <ellipse cx="260" cy="70" rx="90" ry="28" fill="#8a8a7a" />
        {Array.from({ length: 8 }, (_, k) => <line key={k} x1={190 + k * 18} y1="100" x2={184 + k * 18} y2="125" stroke="#9aaa3a" strokeWidth="3" />)}
        <rect x="-10" y="240" width="420" height="70" fill="#8a7a5a" />
        <g transform="translate(300 240)"><rect x="-4" y="-50" width="8" height="50" fill="#5a4a3a" /><circle cy="-60" r="20" fill="#a8a06a" /></g>
        <T x={200} y={30} t="gases de azufre y nitrógeno + agua = lluvia ácida" s={11} />
      </Ver>
    </svg>
  )
}

/* ── Biomagnificación del mercurio ────────────────────────────────────── */

const BIO = ['agua', 'plancton', 'pez-pequeno', 'pez-grande', 'persona']
const NIVELES = [
  { ic: '💧', n: 'agua', hg: 1 },
  { ic: '🦠', n: 'plancton', hg: 3 },
  { ic: '🐟', n: 'pez pequeño', hg: 8 },
  { ic: '🐠', n: 'bagre', hg: 16 },
  { ic: '🧍', n: 'persona', hg: 24 },
]

export function EscenaBiomagnificacion({ fase }: { fase: string }) {
  const i = Math.max(0, BIO.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Biomagnificación del mercurio: ${fase}`} className="h-full w-full">
      {fondo('#e4eef4')}
      {NIVELES.map((n, k) => {
        const x = 40 + k * 80
        const si = k <= i
        return (
          <g key={n.n} style={{ transition: suave, opacity: si ? 1 : 0.15 }}>
            <text x={x} y="250" textAnchor="middle" fontSize={22 + k * 4}>{n.ic}</text>
            <T x={x} y={275} t={n.n} s={10} />
            {/* puntos de mercurio que se acumulan */}
            {Array.from({ length: n.hg }, (_, j) => <circle key={j} cx={x - 12 + (j % 4) * 8} cy={210 - Math.floor(j / 4) * 9} r="3.2" fill={ROJO} />)}
            {k < NIVELES.length - 1 && <path d={`M ${x + 22} 240 h 30`} stroke="#999" strokeWidth="2.5" markerEnd="url(#bio-f)" />}
          </g>
        )
      })}
      <defs><marker id="bio-f" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#999" /></marker></defs>
      <T x={200} y={36} t={['un poquito de mercurio en el agua', 'el plancton lo absorbe y no lo elimina', 'cada pez pequeño come mucho plancton', 'el bagre come muchos peces: muchísimo mercurio', 'quien come esos peces seguido se intoxica'][i]} c={i >= 3 ? ROJO : TINTA} s={12} />
      <T x={200} y={58} t="● = mercurio acumulado" c={ROJO} s={10} peso={600} />
    </svg>
  )
}

/* ── Eutrofización ───────────────────────────────────────────────────── */

const EUT = ['sano', 'nutrientes', 'algas', 'sin-oxigeno']

export function EscenaEutrofizacion({ fase }: { fase: string }) {
  const i = Math.max(0, EUT.indexOf(fase))
  const agua = ['#5aa0d6', '#5aa0b6', '#4a8a5a', '#5a6a4a'][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Eutrofización: ${fase}`} className="h-full w-full">
      {fondo('#e7efe4')}
      <rect x="-10" y="70" width="420" height="40" fill="#8ab06a" />
      <path d="M -10 110 H 410 V 300 H -10 Z" fill={agua} style={{ transition: suave }} />
      {/* luz */}
      <g style={{ transition: suave, opacity: i <= 1 ? 0.5 : 0.08 }}>{[80, 200, 320].map((x) => <path key={x} d={`M ${x} 110 L ${x - 20} 290`} stroke="#fff6c8" strokeWidth="10" />)}</g>
      <Ver si={i === 1}><text x="60" y="95" textAnchor="middle" fontSize="24">🧪</text><text x="200" y="95" textAnchor="middle" fontSize="24">🧴</text><text x="340" y="95" textAnchor="middle" fontSize="24">🚽</text>
        {[60, 200, 340].map((x) => <path key={x} d={`M ${x} 102 v 30`} stroke="#9a6a2a" strokeWidth="3" strokeDasharray="4 3" />)}
        <T x={200} y={40} t="llegan nitrógeno y fósforo" s={12} /></Ver>
      {/* algas en la superficie */}
      <g style={{ transition: suave, opacity: i >= 2 ? 1 : i === 0 ? 0.3 : 0.5 }}>
        {Array.from({ length: i >= 2 ? 22 : 4 }, (_, k) => <ellipse key={k} cx={10 + k * (i >= 2 ? 18 : 100)} cy="114" rx="12" ry="6" fill={i === 3 ? '#6a6a3a' : '#3f9a3a'} />)}
      </g>
      {/* peces */}
      {[[100, 190], [250, 230], [320, 170]].map(([x, y], k) => (
        <text key={k} x={x} y={i === 3 ? 135 : y} textAnchor="middle" fontSize="24" style={{ transition: suave, transform: i === 3 ? `rotate(180deg)` : 'none', transformOrigin: `${x}px ${i === 3 ? 128 : y - 8}px`, opacity: i === 3 ? 0.6 : 1 }}>🐟</text>
      ))}
      <Ver si={i === 3}>{[60, 160, 260, 360].map((x) => <text key={x} x={x} y="280" textAnchor="middle" fontSize="14">🦠</text>)}<T x={200} y={40} t="las bacterias gastan el oxígeno: zona muerta" c={ROJO} s={12} /></Ver>
      <Ver si={i === 0}><T x={200} y={40} t="pocas algas, luz y oxígeno" c="#2f7fc1" s={12} /></Ver>
      <Ver si={i === 2}><T x={200} y={40} t="las algas tapan la luz" c="#3f7f3a" s={12} /></Ver>
    </svg>
  )
}
