// Escenas vivas de Química, área 3, tema 2: nomenclatura de óxidos e hidróxidos.

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean) => ({ transition: suave, opacity: si ? 1 : 0 })
const tenue = (si: boolean) => ({ transition: suave, opacity: si ? 1 : 0.25 })
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
function Caja({ x, y, t, sub, c }: { x: number; y: number; t: string; sub: string; c: string }) {
  return (
    <g>
      <rect x={x - 55} y={y - 24} width="110" height="48" rx="10" fill={c} stroke={TINTA} />
      <T x={x} y={y - 3} t={t} s={13} />
      <T x={x} y={y + 14} t={sub} s={10} peso={600} />
    </g>
  )
}

/* ── El mapa de las funciones ─────────────────────────────────────────── */

const MAPA = ['metal', 'nometal', 'sal']

export function EscenaNomMapa({ fase }: { fase: string }) {
  const i = idx(MAPA, fase)
  const fl = (x1: number, y1: number, x2: number, y2: number, c: string, id: string, txt: string) => (
    <g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth="2.5" markerEnd={`url(#${id})`} />
      <T x={(x1 + x2) / 2 + 30} y={(y1 + y2) / 2 + 4} t={txt} s={10} c={c} /></g>
  )
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Mapa de las funciones químicas: ${fase}`} className="h-full w-full">
      <Flecha id="nm-r" c={ROJO} /><Flecha id="nm-a" c={AZUL} /><Flecha id="nm-v" c={VERDE} />
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <g style={tenue(i === 0 || i === 2)}>
        <Caja x={90} y={40} t="Metal" sub="Ca, Fe, Na" c="#d9d2f0" />
        {fl(90, 64, 90, 104, ROJO, 'nm-r', '+ O₂')}
        <Caja x={90} y={130} t="Óxido básico" sub="CaO (cal viva)" c="#f6dcb4" />
        {fl(90, 154, 90, 194, ROJO, 'nm-r', '+ H₂O')}
        <Caja x={90} y={220} t="Hidróxido" sub="Ca(OH)₂" c="#f6dcb4" />
      </g>
      <g style={tenue(i >= 1)}>
        <Caja x={310} y={40} t="No metal" sub="C, S, N" c="#c9e6b8" />
        {fl(310, 64, 310, 104, AZUL, 'nm-a', '+ O₂')}
        <Caja x={310} y={130} t="Óxido ácido" sub="CO₂, SO₃" c="#cfe0f4" />
        {fl(310, 154, 310, 194, AZUL, 'nm-a', '+ H₂O')}
        <Caja x={310} y={220} t="Oxácido" sub="H₂SO₄" c="#cfe0f4" />
      </g>
      <g style={ver(i === 2)}>
        <line x1="145" y1="226" x2="178" y2="252" stroke={VERDE} strokeWidth="2.5" markerEnd="url(#nm-v)" />
        <line x1="255" y1="226" x2="222" y2="252" stroke={VERDE} strokeWidth="2.5" markerEnd="url(#nm-v)" />
        <rect x="150" y="256" width="100" height="38" rx="10" fill="#e3f0d6" stroke={TINTA} />
        <T x={200} y={280} t="Sal + agua" s={14} c={VERDE} />
      </g>
    </svg>
  )
}

/* ── Cruzar las cargas ────────────────────────────────────────────────── */

const CRUCE = ['cargas', 'cruce', 'simplifica']

export function EscenaNomCruce({ fase }: { fase: string }) {
  const i = idx(CRUCE, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Formular un óxido cruzando cargas: ${fase}`} className="h-full w-full">
      <Flecha id="nc-r" c={ROJO} />
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef2f6" />
      <g style={ver(i <= 1)}>
        <T x={140} y={140} t="Fe" s={56} />
        <T x={260} y={140} t="O" s={56} />
        <T x={178} y={88} t="+3" s={20} c={ROJO} />
        <T x={292} y={88} t="−2" s={20} c={AZUL} />
        <g style={ver(i === 1)}>
          <path d="M178 96 Q240 150 282 158" fill="none" stroke={ROJO} strokeWidth="2.5" markerEnd="url(#nc-r)" />
          <path d="M292 96 Q220 150 172 158" fill="none" stroke={ROJO} strokeWidth="2.5" markerEnd="url(#nc-r)" />
          <T x={170} y={172} t="2" s={22} c={ROJO} />
          <T x={288} y={172} t="3" s={22} c={ROJO} />
          <rect x="120" y="200" width="160" height="44" rx="10" fill="#fff" stroke={TINTA} />
          <T x={200} y={230} t="Fe₂O₃" s={24} c={VERDE} />
          <T x={200} y={268} t="Comprueba: 2 × (+3) + 3 × (−2) = 0" s={12} peso={600} />
        </g>
        <g style={ver(i === 0)}>
          <T x={200} y={220} t="Primero el elemento, después el oxígeno;" s={12} />
          <T x={200} y={238} t="encima, sus estados de oxidación" s={12} />
        </g>
      </g>
      <g style={ver(i === 2)}>
        <T x={200} y={70} t="Calcio +2 y oxígeno −2" s={14} />
        <T x={120} y={140} t="Ca₂O₂" s={40} c="#888" />
        <T x={200} y={140} t="→" s={36} />
        <T x={285} y={140} t="CaO" s={40} c={VERDE} />
        <T x={200} y={190} t="Si los dos subíndices se pueden dividir, se simplifica" s={12} />
        <T x={200} y={225} t="Pero N₂O₅ queda igual: 2 y 5 no tienen divisor común" s={11} peso={600} c={AZUL} />
      </g>
    </svg>
  )
}

/* ── De la cal viva a la cal apagada ──────────────────────────────────── */

const HIDROX = ['calviva', 'agua', 'indicador']

export function EscenaNomHidroxido({ fase }: { fase: string }) {
  const i = idx(HIDROX, fase)
  const liquido = i === 0 ? 'transparent' : i === 1 ? '#e8eef2' : '#e04f9c'
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Formación de un hidróxido: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      {/* vaso */}
      <path d="M140 70 L150 220 Q200 232 250 220 L260 70" fill="none" stroke={TINTA} strokeWidth="3" />
      <path d="M146 120 L150 220 Q200 232 250 220 L254 120 Z" fill={liquido} opacity={i === 0 ? 0 : 0.85} style={{ transition: 'fill 0.9s, opacity 0.9s' }} />
      <g style={ver(i === 0)}>
        {[[175, 205], [195, 210], [215, 204], [230, 210], [185, 196], [207, 194]].map(([x, y], k) => <rect key={k} x={x - 8} y={y - 8} width="16" height="14" rx="3" fill="#f5f5f0" stroke="#999" />)}
        <T x={200} y={260} t="CaO: cal viva, un óxido básico" s={13} />
      </g>
      <g style={ver(i === 1)}>
        {[[170, 100], [200, 88], [230, 102]].map(([x, y], k) => <path key={k} d={`M${x} ${y} q-6 -10 0 -20 q6 -10 0 -20`} fill="none" stroke="#d07a3a" strokeWidth="2" />)}
        <T x={200} y={260} t="CaO + H₂O → Ca(OH)₂ + calor" s={15} c={ROJO} />
        <T x={200} y={280} t="cal apagada: un hidróxido" s={11} peso={600} />
      </g>
      <g style={ver(i === 2)}>
        <path d="M300 40 L300 80" stroke={TINTA} strokeWidth="6" />
        <circle cx="300" cy="96" r="5" fill="#e04f9c" />
        <T x={330} y={40} t="fenolftaleína" s={10} peso={600} />
        <T x={200} y={260} t="Fucsia: hay grupos OH⁻, es una base" s={14} c="#b0307a" />
        <T x={200} y={280} t="(el repollo morado se pone verde)" s={11} peso={600} />
      </g>
    </svg>
  )
}
