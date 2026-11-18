import type { ReactNode } from 'react'
// Escenas vivas del área 5, tema 3 (Suelo y uso del territorio).

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
function Arbol({ x, y, k = 1, c = '#4f8f4f' }: { x: number; y: number; k?: number; c?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${k})`}><rect x="-5" y="-50" width="10" height="50" fill="#7a5a3a" /><circle cy="-64" r="26" fill={c} /><circle cx="-16" cy="-52" r="16" fill={c} /><circle cx="16" cy="-52" r="16" fill={c} /></g>
}

/* ── Formación del suelo ──────────────────────────────────────────────── */

const FORMA = ['roca', 'meteorizacion', 'pioneros', 'humus', 'capas']

export function EscenaFormacionSuelo({ fase }: { fase: string }) {
  const i = Math.max(0, FORMA.indexOf(fase))
  const capa = [0, 14, 30, 60, 90][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Formación del suelo: ${fase}`} className="h-full w-full">
      {fondo('#eaf0f4')}
      {/* roca madre */}
      <rect x="20" y="120" width="360" height="160" rx="6" fill="#9a958e" />
      <Ver si={i >= 1}>{[[80, 150, 60, 190], [180, 130, 200, 200], [290, 140, 270, 210], [340, 160, 360, 230]].map(([a, b, c, d]) => <path key={a} d={`M ${a} ${b} L ${(a + c) / 2 + 6} ${(b + d) / 2} L ${c} ${d}`} stroke="#6a655e" strokeWidth="2.5" fill="none" />)}</Ver>
      {/* suelo que crece encima de la roca */}
      <rect x="20" y={120 - capa} width="360" height={capa} fill="#7a5a3a" style={{ transition: 'all 1.1s ease' }} />
      <rect x="20" y={120 - capa} width="360" height={Math.min(capa, i >= 3 ? 30 : 6)} fill="#3a2a1a" style={{ transition: 'all 1.1s ease', opacity: i >= 2 ? 1 : 0 }} />
      <Ver si={i === 1}><text x="60" y="60" fontSize="26">☀️</text><text x="320" y="60" fontSize="26">🌧️</text></Ver>
      <Ver si={i >= 2}>{[60, 140, 220, 300].map((x) => <ellipse key={x} cx={x} cy={120 - capa} rx="20" ry="6" fill={i >= 3 ? '#6a9a4a' : '#d9c86a'} />)}</Ver>
      <Ver si={i >= 3}>
        <Arbol x={100} y={122 - capa} k={0.7} /><Arbol x={290} y={122 - capa} k={0.8} />
        <text x="190" y={160 - capa} textAnchor="middle" fontSize="16">🪱</text><text x="240" y={150 - capa} textAnchor="middle" fontSize="14">🍄</text>
      </Ver>
      <Ver si={i === 4}>
        <T x={355} y={120 - capa + 18} t="A" c="#fff" s={13} />
        <T x={355} y={120 - capa + 60} t="B" c="#fff" s={13} />
        <T x={355} y={150} t="roca" s={11} />
      </Ver>
      <T x={200} y={292} t={['solo roca', 'grietas: el agua, el sol y el frío la parten', 'líquenes y musgos: los primeros restos', 'humus: plantas, lombrices, hongos y bacterias', 'cientos de años: un suelo con capas'][i]} s={11} />
    </svg>
  )
}

/* ── Erosión en una ladera ───────────────────────────────────────────── */

const ERO = ['cubierto', 'salpicadura', 'surcos', 'carcavas']

export function EscenaErosion({ fase }: { fase: string }) {
  const i = Math.max(0, ERO.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Erosión: ${fase}`} className="h-full w-full">
      {fondo('#e4ebef')}
      {Array.from({ length: 12 }, (_, k) => <line key={k} x1={30 + k * 30} y1={20 + (k % 3) * 8} x2={24 + k * 30} y2={40 + (k % 3) * 8} stroke="#2f7fc1" strokeWidth="2.5" />)}
      <polygon points="0,90 400,230 400,300 0,300" fill="#9a958e" />
      <polygon points="0,90 400,230 400,262 0,124" fill={i === 0 ? '#3a2a1a' : '#7a5a3a'} style={{ transition: suave }} />
      <Ver si={i === 0}>{[30, 90, 150, 210, 270, 330].map((x) => <g key={x}><path d={`M ${x - 12} ${90 + x * 0.35} q 12 -26 24 0`} fill="#6a9a4a" /><path d={`M ${x} ${90 + x * 0.35} v 22`} stroke="#c8b07a" strokeWidth="2" /></g>)}</Ver>
      <Ver si={i === 1}>
        {[80, 180, 280].map((x) => <g key={x}><circle cx={x} cy={84 + x * 0.35} r="5" fill="#2f7fc1" />{[-12, 0, 12].map((d) => <circle key={d} cx={x + d} cy={78 + x * 0.35 - Math.abs(d) / 2} r="2.5" fill="#7a5a3a" />)}</g>)}
        <T x={200} y={70} t="las gotas golpean el suelo desnudo" c={ROJO} />
      </Ver>
      <Ver si={i >= 2}>
        {[60, 160, 260].map((x) => <path key={x} d={`M ${x} ${92 + x * 0.35} L ${x + 120} ${134 + x * 0.35}`} stroke="#5a3a20" strokeWidth={i === 3 ? 12 : 4} strokeLinecap="round" style={{ transition: 'stroke-width 1s' }} />)}
      </Ver>
      <Ver si={i === 2}><T x={200} y={70} t="el agua se junta y abre surcos" c={ROJO} /></Ver>
      <Ver si={i === 3}><T x={200} y={70} t="cárcavas: zanjas que ya no se cierran" c={ROJO} /></Ver>
      <rect x="330" y="250" width="80" height="50" fill={i === 0 ? '#5aa0d6' : '#a07a50'} style={{ transition: suave }} />
      <T x={360} y={244} t={i === 0 ? 'río claro' : 'río con barro'} s={10} />
    </svg>
  )
}

/* ── Del bosque a la tierra degradada ─────────────────────────────────── */

const DEF = ['bosque', 'tala', 'potrero', 'degradado']

export function EscenaDeforestacion({ fase }: { fase: string }) {
  const i = Math.max(0, DEF.indexOf(fase))
  const suelo = ['#3a2a1a', '#4a3a2a', '#7a5a3a', '#c8a878'][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Deforestación: ${fase}`} className="h-full w-full">
      {fondo(i === 3 ? '#f4ead8' : '#e7f0e4')}
      {i === 3 && <circle cx="340" cy="50" r="24" fill="#f4c542" />}
      <rect x="-10" y="230" width="420" height="80" fill={suelo} style={{ transition: suave }} />
      <Ver si={i === 0}>{[40, 100, 160, 220, 280, 340].map((x, k) => <Arbol key={x} x={x} y={232} k={1 + (k % 2) * 0.3} c={k % 2 ? '#3f7f4a' : '#4f8f4f'} />)}<text x="200" y="150" textAnchor="middle" fontSize="20">🦜</text></Ver>
      <Ver si={i === 1}>
        {[40, 100, 160, 220, 280, 340].map((x) => <rect key={x} x={x - 5} y="215" width="10" height="16" fill="#5a3a20" />)}
        {[70, 190, 310].map((x) => <path key={x} d={`M ${x - 18} 230 q 18 -60 36 0`} fill="#e08a2e" opacity="0.75" />)}
        <ellipse cx="200" cy="90" rx="160" ry="30" fill="#888" opacity="0.4" />
      </Ver>
      <Ver si={i === 2}>
        {Array.from({ length: 18 }, (_, k) => <path key={k} d={`M ${12 + k * 22} 232 l -4 -12 M ${12 + k * 22} 232 l 4 -12`} stroke="#9ab84a" strokeWidth="2" />)}
        <text x="120" y="226" textAnchor="middle" fontSize="30">🐄</text><text x="270" y="226" textAnchor="middle" fontSize="30">🐄</text>
      </Ver>
      <Ver si={i === 3}>
        {[60, 160, 280].map((x) => <path key={x} d={`M ${x} 232 l 14 30 l -8 20`} stroke="#8a6a48" strokeWidth="5" fill="none" />)}
        <text x="200" y="224" textAnchor="middle" fontSize="22">🌵</text>
      </Ver>
      <T x={200} y={30} t={['agua que se infiltra, mucha vida', 'tala y quema: humo y carbono al aire', 'potrero: suelo compactado y erosión', 'sin capa fértil ni agua: la tierra deja de producir'][i]} c={i === 0 ? '#3f7f4a' : ROJO} s={12} />
    </svg>
  )
}
