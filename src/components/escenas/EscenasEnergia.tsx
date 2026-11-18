// Escenas vivas del área 3, tema 3 (Flujo de energía): productores y consumidores, cadena trófica y pirámide.

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean, mover = 'none', quieto = 'none') => ({ transition: suave, opacity: si ? 1 : 0, transform: si ? mover : quieto })
const fondo = (color: string) => <rect x="-1500" y="-1500" width="3400" height="3300" fill={color} style={{ transition: 'fill 0.8s' }} />

const VERDE = '#3f9a5a'
const NARANJA = '#e08a2e'
const ROJO = '#c43c3c'
const MOR = '#8a5aa8'
const TINTA = '#3a3a3a'

function Texto({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}
function Ser({ x, y, ic, t, c, s = 30 }: { x: number; y: number; ic: string; t: string; c: string; s?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={s} fill="#fff" stroke={c} strokeWidth="3" />
      <text x={x} y={y + s * 0.33} textAnchor="middle" fontSize={s}>{ic}</text>
      <Texto x={x} y={y + s + 16} t={t} c={c} s={11} />
    </g>
  )
}
function Flecha({ x1, y1, x2, y2, id }: { x1: number; y1: number; x2: number; y2: number; id: string }) {
  return <path d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke="#888" strokeWidth="3" markerEnd={`url(#${id})`} />
}
function Punta({ id }: { id: string }) {
  return <defs><marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#888" /></marker></defs>
}

/* ── Productores, consumidores y descomponedores ──────────────────────── */

const PC = ['sol', 'productores', 'herbivoros', 'carnivoros', 'descomponedores']

export function EscenaProductores({ fase }: { fase: string }) {
  const i = Math.max(0, PC.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Productores y consumidores: ${fase}`} className="h-full w-full">
      {fondo('#f2f5ee')}
      <Punta id="pc-fl" />
      <circle cx="50" cy="60" r="28" fill="#f2c94c" />
      <Texto x={50} y={108} t="luz del sol" c="#b07a00" s={10} />
      <g style={ver(i >= 1)}><Ser x={130} y={150} ic="🌾" t="Productor" c={VERDE} /><Flecha x1={70} y1={80} x2={110} y2={124} id="pc-fl" /></g>
      <g style={ver(i >= 2)}><Ser x={220} y={150} ic="🦫" t="Herbívoro" c={NARANJA} /><Flecha x1={162} y1={150} x2={186} y2={150} id="pc-fl" /></g>
      <g style={ver(i >= 3)}><Ser x={310} y={150} ic="🐆" t="Carnívoro" c={ROJO} /><Flecha x1={252} y1={150} x2={276} y2={150} id="pc-fl" /></g>
      <g style={ver(i === 4)}>
        <Ser x={220} y={250} ic="🍄" t="" c={MOR} s={24} />
        <Texto x={300} y={256} t="Descomponedores" c={MOR} s={11} />
        <path d="M 130 186 Q 150 240 192 248 M 220 186 V 222 M 310 186 Q 290 240 246 248" stroke={MOR} strokeWidth="2" strokeDasharray="4 3" fill="none" />
      </g>
      <rect x="140" y="10" width="250" height="56" rx="10" fill="#fff" opacity="0.92" />
      <g style={ver(i === 0)}><Texto x={265} y={34} t="Casi toda la energía viene del sol" s={12} /></g>
      <g style={ver(i === 1)}><Texto x={265} y={32} t="Productores: fabrican su alimento" c={VERDE} s={12} /><Texto x={265} y={50} t="con la luz (fotosíntesis)" s={11} peso={600} /></g>
      <g style={ver(i === 2)}><Texto x={265} y={32} t="Consumidores primarios: herbívoros" c={NARANJA} s={12} /><Texto x={265} y={50} t="el chigüiro come pasto" s={11} peso={600} /></g>
      <g style={ver(i === 3)}><Texto x={265} y={32} t="Consumidores secundarios: carnívoros" c={ROJO} s={12} /><Texto x={265} y={50} t="el jaguar caza al chigüiro" s={11} peso={600} /></g>
      <g style={ver(i === 4)}><Texto x={265} y={32} t="Descomponedores: hongos y bacterias" c={MOR} s={12} /><Texto x={265} y={50} t="devuelven los nutrientes al suelo" s={11} peso={600} /></g>
    </svg>
  )
}

/* ── Cadena trófica ───────────────────────────────────────────────────── */

const CAD = ['eslabones', 'flechas', 'niveles']
const ESLABONES = [
  { ic: '🌿', t: 'hierba', n: 'Productor' },
  { ic: '🦗', t: 'saltamontes', n: 'Consumidor 1.°' },
  { ic: '🐸', t: 'rana', n: 'Consumidor 2.°' },
  { ic: '🐍', t: 'serpiente', n: 'Consumidor 3.°' },
  { ic: '🦅', t: 'águila', n: 'Consumidor 4.°' },
]

export function EscenaCadena({ fase }: { fase: string }) {
  const i = Math.max(0, CAD.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Cadena trófica: ${fase}`} className="h-full w-full">
      {fondo('#f2f5ee')}
      <Punta id="ca-fl" />
      <Texto x={200} y={36} t={['Una cadena trófica: quién se come a quién', 'La flecha va hacia quien come: así fluye la energía', 'Cada eslabón es un nivel trófico'][i]} s={12} />
      {ESLABONES.map((e, k) => {
        const x = 44 + k * 78
        return (
          <g key={e.t}>
            <Ser x={x} y={140} ic={e.ic} t={e.t} c={k === 0 ? VERDE : k === 4 ? ROJO : NARANJA} s={26} />
            {k < 4 && <g style={ver(i >= 1)}><Flecha x1={x + 28} y1={140} x2={x + 48} y2={140} id="ca-fl" /></g>}
            <g style={ver(i === 2)}><Texto x={x} y={214} t={e.n} c={MOR} s={9} /></g>
          </g>
        )
      })}
      <g style={ver(i === 1)}><Texto x={200} y={240} t="«La rana es comida por la serpiente»" s={11} peso={600} /></g>
      <g style={ver(i === 2)}><Texto x={200} y={256} t="Rara vez hay más de 4 o 5 eslabones" s={11} /></g>
    </svg>
  )
}

/* ── Pirámide de energía (regla del 10 %) ─────────────────────────────── */

const PIR = ['base', 'pasa', 'pierde', 'corta']
const NIVELES = [
  { e: '10 000', t: 'productores', c: VERDE },
  { e: '1000', t: 'herbívoros', c: '#e0a020' },
  { e: '100', t: 'carnívoros', c: NARANJA },
  { e: '10', t: 'superdepredadores', c: ROJO },
]

export function EscenaPiramide({ fase }: { fase: string }) {
  const i = Math.max(0, PIR.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Pirámide de energía: ${fase}`} className="h-full w-full">
      {fondo('#f6f3ec')}
      {NIVELES.map((n, k) => {
        const w = 330 - k * 60
        const y = 230 - k * 46
        const vis = i === 0 ? k === 0 : i === 1 ? k <= 1 : true
        return (
          <g key={n.t} style={ver(vis, 'none', 'translate(0, 10px)')}>
            <rect x={200 - w / 2} y={y} width={w} height="42" rx="4" fill={n.c} />
            <Texto x={200} y={y + 19} t={`${n.e} unidades de energía`} c="#fff" s={11} />
            <Texto x={200} y={y + 34} t={n.t} c="#fff" s={9} peso={600} />
          </g>
        )
      })}
      <rect x="10" y="10" width="380" height="40" rx="10" fill="#fff" opacity="0.92" />
      <Texto x={200} y={35} t={['Los productores captan la energía del sol', 'Al nivel siguiente pasa solo cerca del 10 %', 'El resto se gasta en vivir y se pierde como calor', 'Por eso las cadenas son cortas y hay pocos jaguares'][i]} s={12} />
      <g style={ver(i === 2)}>{[60, 340].map((x) => <text key={x} x={x} y="160" textAnchor="middle" fontSize="22">🔥</text>)}</g>
    </svg>
  )
}
