// Escenas vivas de Química, área 3, tema 3: nomenclatura de ácidos y sales.

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean, mover = 'none', quieto = 'none') => ({ transition: suave, opacity: si ? 1 : 0, transform: si ? mover : quieto })
const idx = (orden: string[], fase: string) => Math.max(0, orden.indexOf(fase))

const TINTA = '#3a3a3a'
const AZUL = '#3f6fb8'
const ROJO = '#c43c3c'
const VERDE = '#4f8a3c'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}
function Bola({ x, y, r, t, c }: { x: number; y: number; r: number; t: string; c: string }) {
  return <g><circle cx={x} cy={y} r={r} fill={c} stroke={TINTA} strokeWidth="1.5" /><T x={x} y={y + 5} t={t} s={r > 20 ? 14 : 11} /></g>
}
const mover = (x: number, y: number) => ({ transition: suave, transform: `translate(${x}px, ${y}px)` })

/* ── Hidrácidos ───────────────────────────────────────────────────────── */

const HIDRA = ['gas', 'agua', 'estomago']

export function EscenaHidracido({ fase }: { fase: string }) {
  const i = idx(HIDRA, fase)
  const pares = [[150, 120], [230, 150], [190, 190], [270, 110]]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Hidrácido: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={i === 1 ? '#e6f0f8' : '#f4f1ea'} style={{ transition: 'fill 0.8s' }} />
      <g style={ver(i <= 1)}>
        {pares.map(([x, y], k) => (
          <g key={k}>
            <g style={mover(i === 1 ? -18 : 0, i === 1 ? -14 : 0)}><Bola x={x - 14} y={y} r={11} t={i === 1 ? 'H⁺' : 'H'} c="#eeeeee" /></g>
            <g style={mover(i === 1 ? 12 : 0, i === 1 ? 10 : 0)}><Bola x={x + 12} y={y} r={18} t={i === 1 ? 'Cl⁻' : 'Cl'} c="#c9e6b8" /></g>
          </g>
        ))}
        <g style={ver(i === 0)}>
          <T x={200} y={250} t="HCl como gas: cloruro de hidrógeno" s={14} />
          <T x={200} y={270} t="(el no metal termina en -uro)" s={11} peso={600} />
        </g>
        <g style={ver(i === 1)}>
          <T x={200} y={250} t="En agua se separa en H⁺ y Cl⁻: ácido clorhídrico" s={14} c={ROJO} />
          <T x={200} y={270} t="(ácido + no metal + -hídrico)" s={11} peso={600} />
        </g>
      </g>
      <g style={ver(i === 2)}>
        <path d="M150 60 Q120 120 160 190 Q220 250 280 190 Q300 150 260 120 Q230 90 190 100 Q180 70 175 60" fill="#f2b5a8" stroke={TINTA} strokeWidth="2" />
        <path d="M168 180 Q220 225 268 180 Q270 165 255 150" fill="#e6e08a" opacity="0.8" />
        <T x={220} y={190} t="HCl" s={14} c={ROJO} />
        <T x={200} y={250} t="El jugo gástrico tiene ácido clorhídrico" s={14} />
        <T x={200} y={270} t="ayuda a digerir proteínas y mata bacterias" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── Oxácidos ─────────────────────────────────────────────────────────── */

const OXA = ['oxido', 'agua', 'lluvia']

export function EscenaOxacido({ fase }: { fase: string }) {
  const i = idx(OXA, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Formación de un oxácido: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef2f6" />
      <g style={ver(i <= 1)}>
        <g style={mover(i === 1 ? 40 : 90, 0)}>
          <Bola x={60} y={120} r={22} t="S" c="#f2e39b" />
          {[[60, 78], [24, 142], [96, 142]].map(([x, y], k) => <Bola key={k} x={x} y={y} r={14} t="O" c="#f4b8b0" />)}
          <T x={60} y={190} t="SO₃" s={16} />
        </g>
        <g style={ver(i === 1)}>
          <T x={170} y={128} t="+" s={26} />
          <Bola x={220} y={120} r={16} t="O" c="#f4b8b0" />
          <Bola x={200} y={142} r={10} t="H" c="#eeeeee" />
          <Bola x={240} y={142} r={10} t="H" c="#eeeeee" />
          <T x={220} y={190} t="H₂O" s={16} />
          <T x={285} y={128} t="→" s={26} />
          <T x={345} y={130} t="H₂SO₄" s={22} c={ROJO} />
          <T x={345} y={155} t="ácido sulfúrico" s={11} peso={600} />
        </g>
        <g style={ver(i === 0)}><T x={200} y={250} t="Un óxido ácido: el azufre está en +6" s={13} /></g>
        <g style={ver(i === 1)}><T x={200} y={250} t="Óxido ácido + agua → oxácido (H + no metal + O)" s={13} /></g>
      </g>
      <g style={ver(i === 2)}>
        <rect x="50" y="150" width="40" height="100" fill="#8a8a8a" />
        <path d="M70 140 q-20 -30 10 -50 q30 -20 60 0 q20 -25 50 -5" fill="none" stroke="#999" strokeWidth="10" strokeLinecap="round" opacity="0.6" />
        <ellipse cx="260" cy="80" rx="80" ry="30" fill="#c7ccd4" />
        {[220, 245, 270, 295].map((x, k) => <line key={k} x1={x} y1={115} x2={x - 8} y2={160} stroke={AZUL} strokeWidth="2" />)}
        <T x={150} y={80} t="SO₂, NOₓ" s={12} c={ROJO} />
        <T x={260} y={85} t="+ agua → ácidos" s={11} />
        <rect x="200" y="220" width="120" height="30" fill={VERDE} opacity="0.5" />
        <T x={200} y={280} t="Lluvia ácida: daña bosques, suelos y monumentos" s={12} />
      </g>
    </svg>
  )
}

/* ── De ácido a anión ─────────────────────────────────────────────────── */

const ANION = ['acido', 'suelta', 'nombre']

export function EscenaAniones({ fase }: { fase: string }) {
  const i = idx(ANION, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Del ácido al anión: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <g style={mover(i >= 1 ? 30 : 0, 0)}>
        <Bola x={200} y={130} r={24} t="S" c="#f2e39b" />
        {[[200, 82], [248, 130], [200, 178], [152, 130]].map(([x, y], k) => <g key={k}><line x1={200} y1={130} x2={x} y2={y} stroke={TINTA} strokeWidth="2" /><Bola x={x} y={y} r={15} t="O" c="#f4b8b0" /></g>)}
        <g style={ver(i >= 1)}><T x={200} y={225} t="SO₄²⁻" s={20} c={AZUL} /></g>
      </g>
      {[[128, 108], [128, 152]].map(([x, y], k) => (
        <g key={k} style={mover(i >= 1 ? -60 : 0, i >= 1 ? (k ? 30 : -30) : 0)}><Bola x={x} y={y} r={10} t={i >= 1 ? 'H⁺' : 'H'} c="#eeeeee" /></g>
      ))}
      <g style={ver(i === 0)}><T x={200} y={260} t="H₂SO₄: ácido sulfúrico, con 2 hidrógenos" s={13} /></g>
      <g style={ver(i === 1)}><T x={200} y={260} t="Suelta 2 H⁺: el anión queda con carga 2−" s={13} /></g>
      <g style={ver(i === 2)}>
        <rect x="70" y="240" width="260" height="40" rx="10" fill="#fff" stroke={TINTA} />
        <T x={200} y={266} t="sulfúrICO → sulfATO" s={18} c={VERDE} />
      </g>
    </svg>
  )
}

/* ── Neutralización ───────────────────────────────────────────────────── */

const SAL = ['reactivos', 'intercambio', 'producto']

export function EscenaSal({ fase }: { fase: string }) {
  const i = idx(SAL, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Neutralización: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef4ee" />
      {/* H⁺ y Cl⁻ */}
      <g style={mover(i >= 1 ? 80 : 0, i >= 1 ? 80 : 0)}><Bola x={70} y={90} r={12} t="H⁺" c="#eeeeee" /></g>
      <g style={mover(i >= 1 ? 120 : 0, 0)}><Bola x={110} y={90} r={20} t="Cl⁻" c="#c9e6b8" /></g>
      {/* Na⁺ y OH⁻ */}
      <g style={mover(i >= 1 ? -80 : 0, 0)}><Bola x={290} y={90} r={18} t="Na⁺" c="#d9d2f0" /></g>
      <g style={mover(i >= 1 ? -150 : 0, i >= 1 ? 80 : 0)}><Bola x={330} y={90} r={16} t="OH⁻" c="#f4b8b0" /></g>
      <g style={ver(i === 0)}>
        <T x={90} y={140} t="HCl" s={16} c={ROJO} /><T x={90} y={158} t="ácido" s={11} peso={600} />
        <T x={310} y={140} t="NaOH" s={16} c={AZUL} /><T x={310} y={158} t="hidróxido (base)" s={11} peso={600} />
        <T x={200} y={96} t="+" s={26} />
      </g>
      <g style={ver(i >= 1)}>
        <T x={165} y={210} t="H₂O" s={16} c={AZUL} />
        <T x={165} y={228} t="H⁺ + OH⁻" s={11} peso={600} />
      </g>
      <g style={ver(i === 2)}>
        <rect x="190" y="60" width="80" height="60" rx="10" fill="none" stroke={VERDE} strokeWidth="2.5" strokeDasharray="5 3" />
        <T x={230} y={140} t="NaCl" s={18} c={VERDE} />
        <T x={200} y={268} t="HCl + NaOH → NaCl + H₂O" s={16} />
        <T x={200} y={288} t="La sal: primero el anión (cloruro), luego el catión (de sodio)" s={10} peso={600} />
      </g>
    </svg>
  )
}
