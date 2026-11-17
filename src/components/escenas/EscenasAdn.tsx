import type { ReactNode } from 'react'
// Escenas vivas del tema 2 del área 2 (ADN, genes y cromosomas): zoom del cuerpo a las bases, nucleótido,
// ADN y ARN, empaquetamiento en cromosomas y gen, alelo y genoma.

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean, mover = 'none', quieto = 'none') => ({ transition: suave, opacity: si ? 1 : 0, transform: si ? mover : quieto })
const fondo = (color: string) => <rect x="-1500" y="-1500" width="3400" height="3300" fill={color} style={{ transition: 'fill 0.8s' }} />

const AZUL = '#3f6fb8'
const CELESTE = '#8fb2e2'
const ROJO = '#c43c3c'
const MOR = '#8a5aa8'
const TINTA = '#3a3a3a'
export const COLOR_BASE: Record<string, string> = { A: '#3f9a5a', T: '#d0453a', G: '#e0a020', C: AZUL, U: '#c46aa0' }
const PAREJA: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G' }

function Texto({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}

/** Una base como rectángulo con su letra. Las purinas (A, G) son más largas que las pirimidinas (T, C, U). */
function BaseR({ x, y, b, largo, alto = 16, girar = false, opacidad = 1 }: { x: number; y: number; b: string; largo?: number; alto?: number; girar?: boolean; opacidad?: number }) {
  const l = largo ?? (b === 'A' || b === 'G' ? 34 : 24)
  return (
    <g style={{ transition: suave, opacity: opacidad }}>
      <rect x={girar ? x - l : x} y={y - alto / 2} width={l} height={alto} rx="4" fill={COLOR_BASE[b]} />
      <text x={girar ? x - l / 2 : x + l / 2} y={y + 4.5} textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff">{b}</text>
    </g>
  )
}

/* ── Zoom: del cuerpo a las bases (potencias de diez) ─────────────────── */

const ZOOM = ['cuerpo', 'celula', 'nucleo', 'cromosoma', 'collar', 'adn', 'bases']
const ESCALA = ['≈ 1,7 m', '≈ 0,02 mm', '≈ 0,006 mm', 'unas milésimas de mm', '≈ 11 millonésimas de mm', '2 millonésimas de mm de ancho', '']
const NOMBRE = ['Tu cuerpo', 'Una célula', 'El núcleo', 'Un cromosoma', 'ADN enrollado', 'La doble hélice', 'Los pares de bases']

function Nivel({ k, i, children }: { k: number; i: number; children: ReactNode }) {
  const t = i === k ? 'none' : i > k ? 'scale(6)' : 'scale(0.15)'
  return <g style={{ transition: suave, opacity: i === k ? 1 : 0, transform: t, transformOrigin: '200px 150px' }}>{children}</g>
}

/** Cromosoma en forma de X (dos cromátidas unidas por el centrómero), centrado en (x, y). */
export function CromosomaX({ x, y, k = 1, color = MOR, bandas = true }: { x: number; y: number; k?: number; color?: string; bandas?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      {[-1, 1].map((s) => (
        <g key={s} transform={`rotate(${s * 14})`}>
          <rect x={-9} y={-62} width="18" height="124" rx="9" fill={color} />
          {bandas && [-44, -24, 18, 40].map((b) => <rect key={b} x={-9} y={b} width="18" height="5" fill="#fff" opacity="0.35" />)}
        </g>
      ))}
      <circle r="7" fill="#fff" opacity="0.5" />
    </g>
  )
}

function HeliceH({ x, y, largo = 300, alto = 50, vueltas = 2.5, grosor = 5 }: { x: number; y: number; largo?: number; alto?: number; vueltas?: number; grosor?: number }) {
  const n = 80
  const p = (f: number) => Array.from({ length: n + 1 }, (_, k) => {
    const t = k / n
    return `${(x - largo / 2 + t * largo).toFixed(1)},${(y + (alto / 2) * Math.sin(t * vueltas * 2 * Math.PI + f)).toFixed(1)}`
  }).join(' ')
  const m = Math.round(vueltas * 10)
  return (
    <g>
      {Array.from({ length: m }, (_, k) => {
        const t = (k + 0.5) / m
        const a = t * vueltas * 2 * Math.PI
        const xx = x - largo / 2 + t * largo
        return <line key={k} x1={xx} x2={xx} y1={y + (alto / 2) * Math.sin(a)} y2={y + (alto / 2) * Math.sin(a + Math.PI)} stroke={['#3f9a5a', '#e0a020', '#d0453a', AZUL][k % 4]} strokeWidth="3" />
      })}
      <polyline points={p(0)} fill="none" stroke={AZUL} strokeWidth={grosor} strokeLinecap="round" />
      <polyline points={p(Math.PI)} fill="none" stroke={CELESTE} strokeWidth={grosor} strokeLinecap="round" />
    </g>
  )
}

export function EscenaZoomAdn({ fase }: { fase: string }) {
  const i = Math.max(0, ZOOM.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Zoom hacia el ADN: ${NOMBRE[i]}`} className="h-full w-full">
      {fondo(['#eef3f7', '#f6e9ef', '#efe9f6', '#efe9f6', '#eef3f7', '#eef3f7', '#f3f2ee'][i])}
      <Nivel k={0} i={i}>
        <circle cx="200" cy="58" r="26" fill="#d9b48f" />
        <path d="M 160 250 v -110 q 0 -36 40 -36 q 40 0 40 36 v 110 z" fill="#5f87c2" />
        <path d="M 160 140 l -24 80 M 240 140 l 24 80" stroke="#d9b48f" strokeWidth="14" strokeLinecap="round" />
        <circle cx="200" cy="150" r="5" fill="#fff" stroke={ROJO} strokeWidth="2" />
      </Nivel>
      <Nivel k={1} i={i}>
        <ellipse cx="200" cy="150" rx="120" ry="96" fill="#fbeef3" stroke="#d99ab4" strokeWidth="4" />
        <circle cx="140" cy="110" r="6" fill="#e8a24a" /><circle cx="270" cy="190" r="7" fill="#e8a24a" /><ellipse cx="262" cy="104" rx="16" ry="8" fill="#e6b38a" />
        <circle cx="200" cy="150" r="34" fill="#d9cfe8" stroke={MOR} strokeWidth="3" />
      </Nivel>
      <Nivel k={2} i={i}>
        <circle cx="200" cy="150" r="120" fill="#e7def2" stroke={MOR} strokeWidth="5" />
        {[[-60, -50], [50, -60], [-70, 40], [60, 50], [0, -80], [-10, 80]].map(([dx, dy], k) => (
          <path key={k} d={`M ${200 + dx - 20} ${150 + dy} q 10 -14 20 0 t 20 0 t 20 0`} fill="none" stroke="#b39bd0" strokeWidth="4" />
        ))}
        <CromosomaX x={200} y={150} k={0.35} />
      </Nivel>
      <Nivel k={3} i={i}><CromosomaX x={200} y={150} k={1.6} /></Nivel>
      <Nivel k={4} i={i}>
        <path d="M 20 150 q 30 -30 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0" fill="none" stroke={AZUL} strokeWidth="3" />
        {[80, 140, 200, 260, 320].map((x) => <g key={x}><circle cx={x} cy={150} r="20" fill="#e8c27a" stroke="#b5891f" strokeWidth="2" /><path d={`M ${x - 20} ${146} q 20 -16 40 0 M ${x - 20} ${156} q 20 16 40 0`} fill="none" stroke={AZUL} strokeWidth="3" /></g>)}
      </Nivel>
      <Nivel k={5} i={i}><HeliceH x={200} y={150} largo={340} alto={70} vueltas={2} grosor={7} /></Nivel>
      <Nivel k={6} i={i}>
        <rect x="70" y="60" width="12" height="180" rx="6" fill={AZUL} />
        <rect x="318" y="60" width="12" height="180" rx="6" fill={CELESTE} />
        {['A', 'G', 'T', 'C', 'A'].map((b, k) => {
          const y = 80 + k * 35
          const l = b === 'A' || b === 'G' ? 140 : 100
          return (
            <g key={k}>
              <BaseR x={82} y={y} b={b} largo={l} alto={22} />
              <BaseR x={318} y={y} b={PAREJA[b]} largo={236 - l} alto={22} girar />
            </g>
          )
        })}
      </Nivel>
      {/* rótulo y escala */}
      <rect x="10" y="10" width="190" height="40" rx="10" fill="#fff" opacity="0.88" />
      <text x="20" y="28" fontSize="13" fontWeight="900" fill={TINTA}>{NOMBRE[i]}</text>
      <text x="20" y="43" fontSize="10" fontWeight="600" fill={TINTA}>{ESCALA[i] || 'A con T · G con C'}</text>
      <g fontSize="9" fontWeight="700">
        {ZOOM.map((_, k) => <circle key={k} cx={300 + k * 13} cy={286} r={k === i ? 5 : 3.5} fill={k <= i ? MOR : '#c9c2d4'} style={{ transition: 'all 0.5s' }} />)}
      </g>
    </svg>
  )
}

/* ── El nucleótido ────────────────────────────────────────────────────── */

const NUCLEO = ['piezas', 'nucleotido', 'bases', 'purinas', 'cadena', 'antiparalelas']

function Fosfato({ x, y, r = 12 }: { x: number; y: number; r?: number }) {
  return <g><circle cx={x} cy={y} r={r} fill="#f2c94c" stroke="#b58a12" strokeWidth="2" /><text x={x} y={y + 4} textAnchor="middle" fontSize={r} fontWeight="900" fill="#6a4d00">P</text></g>
}
function Azucar({ x, y, k = 1, ribosa = false }: { x: number; y: number; k?: number; ribosa?: boolean }) {
  return <polygon transform={`translate(${x} ${y}) scale(${k})`} points="0,-14 13,-4 8,12 -8,12 -13,-4" fill={ribosa ? '#f4c6dd' : '#cfe3f6'} stroke={ribosa ? '#c46aa0' : AZUL} strokeWidth="2" style={{ transition: 'fill 0.8s, stroke 0.8s' }} />
}
/** Nucleótido: fosfato – azúcar – base, de izquierda a derecha (o espejado). */
function Nucleotido({ x, y, b, espejo = false, opacidad = 1 }: { x: number; y: number; b: string; espejo?: boolean; opacidad?: number }) {
  const s = espejo ? -1 : 1
  return (
    <g style={{ transition: suave, opacity: opacidad }}>
      <line x1={x} y1={y} x2={x + s * 26} y2={y} stroke="#888" strokeWidth="2" />
      <Fosfato x={x} y={y} r={9} />
      <Azucar x={x + s * 26} y={y} k={0.8} />
      <BaseR x={x + s * 36} y={y} b={b} alto={13} girar={espejo} />
    </g>
  )
}

export function EscenaNucleotido({ fase }: { fase: string }) {
  const i = Math.max(0, NUCLEO.indexOf(fase))
  const cadena = ['A', 'G', 'T', 'C', 'A', 'T']
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`El nucleótido: ${fase}`} className="h-full w-full">
      {fondo('#f3f2ee')}
      {/* las tres piezas que se juntan */}
      <g style={ver(i <= 1)}>
        <g style={{ transition: suave, transform: i === 1 ? 'translate(62px, 0)' : 'none' }}>
          <Fosfato x={90} y={140} r={22} />
          <g style={ver(i === 0)}><Texto x={90} y={186} t="fosfato" c="#9a7400" /></g>
        </g>
        <Azucar x={200} y={140} k={2} />
        <g style={ver(i === 0)}><Texto x={200} y={186} t="azúcar" c={AZUL} /><Texto x={200} y={200} t="(desoxirribosa)" s={10} peso={600} /></g>
        <g style={{ transition: suave, transform: i === 1 ? 'translate(-46px, 0)' : 'none' }}>
          <rect x="280" y="124" width="64" height="32" rx="6" fill={COLOR_BASE.A} />
          <Texto x={312} y={145} t="A" c="#fff" s={16} />
          <g style={ver(i === 0)}><Texto x={312} y={186} t="base nitrogenada" c={COLOR_BASE.A} /></g>
        </g>
        <g style={ver(i === 1)}>
          <line x1="174" y1="140" x2="176" y2="140" stroke="#888" strokeWidth="3" />
          <rect x="126" y="98" width="200" height="84" rx="16" fill="none" stroke={TINTA} strokeWidth="2" strokeDasharray="6 4" />
          <Texto x={226} y={210} t="Un nucleótido: la pieza que se repite" s={13} />
        </g>
      </g>
      {/* las cuatro bases */}
      <g style={ver(i === 2 || i === 3)}>
        <Texto x={200} y={44} t="Cuatro bases distintas" s={13} />
        {['A', 'G', 'T', 'C'].map((b, k) => (
          <g key={b}>
            <BaseR x={110} y={80 + k * 44} b={b} largo={i === 3 ? (b === 'A' || b === 'G' ? 110 : 70) : 90} alto={28} />
            <Texto x={290} y={86 + k * 44} t={{ A: 'adenina', G: 'guanina', T: 'timina', C: 'citosina' }[b] ?? ''} c={COLOR_BASE[b]} s={13} />
          </g>
        ))}
        <g style={ver(i === 3)}>
          <Texto x={200} y={264} t="A y G (purinas) son más grandes que T y C (pirimidinas)" s={11} />
        </g>
      </g>
      {/* la cadena */}
      <g style={ver(i >= 4)}>
        <line x1="100" y1="50" x2="100" y2="250" stroke="#888" strokeWidth="2" />
        {cadena.map((b, k) => <Nucleotido key={k} x={100} y={58 + k * 36} b={b} />)}
        <g style={ver(i === 4)}>
          <Texto x={290} y={120} t="Los nucleótidos se unen" s={12} />
          <Texto x={290} y={136} t="fosfato con azúcar:" s={12} />
          <Texto x={290} y={152} t="las bases quedan hacia un lado" s={12} />
        </g>
        <g style={ver(i === 5)}>
          <line x1="300" y1="50" x2="300" y2="250" stroke="#888" strokeWidth="2" />
          {cadena.map((b, k) => <Nucleotido key={k} x={300} y={58 + k * 36} b={PAREJA[b]} espejo />)}
          <Texto x={100} y={36} t="5′ ↓" c={AZUL} s={13} />
          <Texto x={300} y={36} t="↑ 3′ … 5′" c={AZUL} s={13} />
          <Texto x={200} y={278} t="Las dos cadenas van en sentidos opuestos (antiparalelas)" s={11} />
        </g>
      </g>
    </svg>
  )
}

/* ── ADN y ARN ────────────────────────────────────────────────────────── */

const ADNARN = ['adn', 'arn', 'sale']

export function EscenaAdnArn({ fase }: { fase: string }) {
  const i = Math.max(0, ADNARN.indexOf(fase))
  const sec = ['A', 'T', 'G', 'C', 'T', 'A']
  const arn = i >= 1
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`ADN y ARN: ${fase}`} className="h-full w-full">
      {fondo(i === 2 ? '#f6eef3' : '#f3f2ee')}
      {/* núcleo en la última fase */}
      <g style={ver(i === 2)}>
        <circle cx="140" cy="150" r="118" fill="#e7def2" stroke={MOR} strokeWidth="4" strokeDasharray="0" />
        <rect x="254" y="138" width="10" height="24" fill="#f6eef3" />
        <Texto x={140} y={292} t="núcleo" c={MOR} />
        {[0, 1, 2].map((k) => <g key={k}><ellipse cx={298} cy={100 + k * 50} rx="16" ry="11" fill="#e6b38a" /><ellipse cx={298} cy={92 + k * 50} rx="11" ry="7" fill="#d79d6a" /></g>)}
        <Texto x={300} y={262} t="ribosomas" c="#a86a3a" s={11} />
      </g>
      {/* cadena que se queda: ADN */}
      <g style={{ transition: suave, transform: i === 2 ? 'translate(-60px, 0)' : 'none' }}>
        <rect x="128" y="50" width="12" height="208" rx="6" fill={AZUL} />
        {sec.map((b, k) => <BaseR key={k} x={140} y={70 + k * 34} b={b} alto={18} />)}
        {/* pareja del ADN (se va en el ARN) */}
        <g style={{ transition: suave, opacity: arn ? 0 : 1 }}>
          <rect x="260" y="50" width="12" height="208" rx="6" fill={CELESTE} />
          {sec.map((b, k) => <BaseR key={k} x={260} y={70 + k * 34} b={PAREJA[b]} alto={18} girar />)}
        </g>
      </g>
      {/* el ARN: una sola cadena, con U en vez de T */}
      <g style={{ transition: suave, opacity: arn ? 1 : 0, transform: i === 2 ? 'translate(100px, 0) rotate(-6deg)' : arn ? 'translate(40px, 0)' : 'none', transformOrigin: '260px 150px' }}>
        <rect x="260" y="50" width="12" height="208" rx="6" fill="#e9a7c8" />
        {sec.map((b, k) => { const p = PAREJA[b] === 'T' ? 'U' : PAREJA[b]; return <BaseR key={k} x={260} y={70 + k * 34} b={p} alto={18} girar /> })}
      </g>
      <g style={ver(i === 0)}>
        <Texto x={200} y={30} t="ADN: dos cadenas · azúcar desoxirribosa · A, T, G, C" s={11} />
      </g>
      <g style={ver(i === 1)}>
        <Texto x={200} y={30} t="ARN: una cadena · azúcar ribosa · U en vez de T" c="#a8457a" s={11} />
        <circle cx="288" cy="70" r="15" fill="none" stroke="#c46aa0" strokeWidth="2.5" />
        <circle cx="288" cy="240" r="15" fill="none" stroke="#c46aa0" strokeWidth="2.5" />
      </g>
      <g style={ver(i === 2)}>
        <Texto x={200} y={22} t="El ADN se queda; el ARN lleva el mensaje afuera" s={11} />
      </g>
    </svg>
  )
}

/* ── Del ADN al cromosoma ─────────────────────────────────────────────── */

const EMPAQUE = ['largo', 'histonas', 'collar', 'fibra', 'cromosoma', 'cariotipo']

export function EscenaEmpaquetamiento({ fase }: { fase: string }) {
  const i = Math.max(0, EMPAQUE.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Del ADN al cromosoma: ${fase}`} className="h-full w-full">
      {fondo('#f2eff6')}
      <g style={ver(i === 0)}>
        <path d="M 30 150 C 60 40, 110 260, 150 120 S 230 40, 250 170 S 330 260, 350 90 S 300 40, 280 120 S 180 250, 120 210 S 40 240, 70 80" fill="none" stroke={AZUL} strokeWidth="3" />
        <rect x="110" y="236" width="180" height="44" rx="12" fill="#fff" opacity="0.9" />
        <Texto x={200} y={256} t="≈ 2 metros de ADN" c={AZUL} s={14} />
        <Texto x={200} y={272} t="en un núcleo de 0,006 mm" s={11} peso={600} />
      </g>
      <g style={ver(i === 1, 'none', 'scale(0.6)')}>
        {[110, 200, 290].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy={150} rx="34" ry="26" fill="#e8c27a" stroke="#b5891f" strokeWidth="2.5" />
            <path d={`M ${x - 40} 132 q 40 -26 80 0 M ${x - 40} 168 q 40 26 80 0`} fill="none" stroke={AZUL} strokeWidth="4" />
          </g>
        ))}
        <Texto x={200} y={220} t="El ADN se enrolla en proteínas: las histonas" c="#9a6a10" s={12} />
      </g>
      <g style={ver(i === 2)}>
        <path d="M 10 150 q 25 -26 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0" fill="none" stroke={AZUL} strokeWidth="3" />
        {[60, 110, 160, 210, 260, 310, 360].map((x) => <circle key={x} cx={x} cy={150} r="15" fill="#e8c27a" stroke="#b5891f" strokeWidth="2" />)}
        <Texto x={200} y={210} t="Como un collar de perlas" s={13} />
      </g>
      <g style={ver(i === 3)}>
        {Array.from({ length: 14 }, (_, k) => (
          <circle key={k} cx={60 + k * 21} cy={150 + 24 * Math.sin(k * 1.1)} r="14" fill="#e8c27a" stroke="#b5891f" strokeWidth="2" />
        ))}
        <Texto x={200} y={220} t="El collar se pliega y se enrolla más" s={13} />
      </g>
      <g style={ver(i === 4)}>
        <CromosomaX x={200} y={140} k={1.5} />
        <path d="M 168 60 L 120 46" stroke="#888" strokeWidth="2" /><Texto x={92} y={42} t="cromátida" s={11} />
        <path d="M 232 60 L 280 46" stroke="#888" strokeWidth="2" /><Texto x={312} y={42} t="cromátida" s={11} />
        <path d="M 210 140 L 290 150" stroke="#888" strokeWidth="2" /><Texto x={330} y={154} t="centrómero" s={11} />
        <Texto x={200} y={262} t="Antes de dividirse, la célula copia su ADN:" s={11} peso={600} />
        <Texto x={200} y={278} t="el cromosoma tiene dos cromátidas hermanas" s={11} peso={600} />
      </g>
      <g style={ver(i === 5)}>
        <Texto x={200} y={26} t="46 cromosomas: 23 pares" s={13} />
        {Array.from({ length: 23 }, (_, k) => {
          const col = k % 8
          const fila = Math.floor(k / 8)
          const x = 50 + col * 43
          const y = 70 + fila * 70
          const h = k === 22 ? 44 : 52 - k * 1.5
          return (
            <g key={k}>
              <rect x={x - 9} y={y - h / 2} width="7" height={h} rx="3.5" fill={k === 22 ? ROJO : MOR} />
              <rect x={x + 2} y={y - (k === 22 ? 12 : h / 2)} width="7" height={k === 22 ? 24 : h} rx="3.5" fill={k === 22 ? AZUL : MOR} />
              <text x={x} y={y + 38} textAnchor="middle" fontSize="9" fontWeight="700" fill={TINTA}>{k === 22 ? 'XY' : k + 1}</text>
            </g>
          )
        })}
        <Texto x={200} y={286} t="Cariotipo humano (esquema): el par 23 define el sexo" s={11} />
      </g>
    </svg>
  )
}

/* ── Gen, alelo y genoma ──────────────────────────────────────────────── */

const GEN = ['cromosoma', 'gen', 'secuencia', 'alelos', 'genoma']

function CromosomaI({ x, y, gen = '#e0a020', resalta = false }: { x: number; y: number; gen?: string; resalta?: boolean }) {
  return (
    <g>
      <rect x={x - 14} y={y - 110} width="28" height="220" rx="14" fill={MOR} />
      {[-90, -60, -10, 30, 70, 92].map((b) => <rect key={b} x={x - 14} y={y + b} width="28" height="6" fill="#fff" opacity="0.3" />)}
      <rect x={x - 14} y={y - 40} width="28" height="20" fill={gen} style={{ transition: 'fill 0.6s' }} />
      {resalta && <rect x={x - 20} y={y - 46} width="40" height="32" rx="6" fill="none" stroke={ROJO} strokeWidth="3" />}
    </g>
  )
}

export function EscenaGen({ fase }: { fase: string }) {
  const i = Math.max(0, GEN.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Gen, alelo y genoma: ${fase}`} className="h-full w-full">
      {fondo('#f3f1f6')}
      <g style={{ transition: suave, opacity: i <= 2 ? 1 : 0, transform: i === 2 ? 'translate(-110px, 0)' : 'none' }}>
        <CromosomaI x={200} y={150} gen={i >= 1 ? '#e0a020' : MOR} resalta={i >= 1} />
      </g>
      <g style={ver(i === 0)}><Texto x={300} y={150} t="Un cromosoma:" s={12} /><Texto x={300} y={166} t="una molécula de ADN" s={12} /><Texto x={300} y={182} t="muy larga" s={12} /></g>
      <g style={ver(i === 1)}>
        <Texto x={312} y={110} t="Un gen:" c="#b07a00" s={14} />
        <Texto x={312} y={128} t="un tramo de ADN con" s={11} peso={600} />
        <Texto x={312} y={142} t="la instrucción para" s={11} peso={600} />
        <Texto x={312} y={156} t="fabricar una proteína" s={11} peso={600} />
      </g>
      <g style={ver(i === 2, 'none', 'translate(-30px, 0)')}>
        <path d="M 112 94 L 170 70 M 112 126 L 170 230" stroke="#888" strokeWidth="1.5" strokeDasharray="4 3" />
        <rect x="170" y="70" width="210" height="160" rx="12" fill="#fff" stroke="#e0a020" strokeWidth="2.5" />
        {['ATGGCT', 'TACCGA', 'GGATCA', 'TTGCAA', 'CGTAGC'].map((s, k) => (
          <text key={s} x="275" y={102 + k * 26} textAnchor="middle" fontSize="16" fontFamily="monospace" fontWeight="700" letterSpacing="2">
            {s.split('').map((b, j) => <tspan key={j} fill={COLOR_BASE[b]}>{b}</tspan>)}
          </text>
        ))}
        <Texto x={275} y={252} t="El gen es un orden de bases" s={12} />
      </g>
      <g style={ver(i === 3)}>
        <CromosomaI x={140} y={150} gen="#7a4a2a" />
        <CromosomaI x={260} y={150} gen={CELESTE} />
        <Texto x={140} y={284} t="alelo «ojos cafés»" c="#7a4a2a" s={11} />
        <Texto x={260} y={284} t="alelo «ojos azules»" c={AZUL} s={11} />
        <Texto x={200} y={22} t="Mismo gen, mismo lugar, distinta versión" s={12} />
      </g>
      <g style={ver(i === 4)}>
        <Texto x={200} y={30} t="El genoma: todo el ADN de un ser vivo" s={13} />
        {Array.from({ length: 23 }, (_, k) => {
          const x = 30 + k * 15.5
          const h = 80 - k * 2.2
          return <g key={k}><rect x={x} y={150 - h / 2} width="5" height={h} rx="2.5" fill={MOR} /><rect x={x + 6} y={150 - h / 2} width="5" height={h} rx="2.5" fill={MOR} opacity="0.7" /></g>
        })}
        <Texto x={200} y={232} t="≈ 3000 millones de pares de bases" s={12} />
        <Texto x={200} y={250} t="≈ 20 000 genes" s={12} />
        <Texto x={200} y={268} t="(casi todo el ADN no son genes)" s={10} peso={600} />
      </g>
    </svg>
  )
}
