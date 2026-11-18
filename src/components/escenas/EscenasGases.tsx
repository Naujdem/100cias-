// Escenas vivas de Química, área 4, tema 1: teoría cinética y propiedades de los gases.

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean) => ({ transition: suave, opacity: si ? 1 : 0 })
const idx = (orden: string[], fase: string) => Math.max(0, orden.indexOf(fase))

const TINTA = '#3a3a3a'
const AZUL = '#3f6fb8'
const ROJO = '#c43c3c'
const VERDE = '#4f8a3c'
const GAS = '#5b8fd6'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}

// Partículas que se mueven solas (SMIL), dentro de una caja de ancho w y alto h.
function Particulas({ x, y, w, h, n, dur = 2, r = 5, c = GAS, semilla = 1 }: { x: number; y: number; w: number; h: number; n: number; dur?: number; r?: number; c?: string; semilla?: number }) {
  const az = (k: number) => {
    const v = Math.sin(k * 12.9898 + semilla * 78.233) * 43758.5453
    return v - Math.floor(v)
  }
  return (
    <g>
      {Array.from({ length: n }, (_, k) => {
        const px = x + r + az(k) * (w - 2 * r)
        const py = y + r + az(k + 50) * (h - 2 * r)
        const qx = x + r + az(k + 100) * (w - 2 * r)
        const qy = y + r + az(k + 150) * (h - 2 * r)
        return (
          <circle key={k} cx={0} cy={0} r={r} fill={c}>
            <animateTransform attributeName="transform" type="translate" values={`${px} ${py};${qx} ${qy};${px} ${py}`} dur={`${dur * (0.8 + az(k + 200) * 0.5)}s`} repeatCount="indefinite" />
          </circle>
        )
      })}
    </g>
  )
}

/* ── Los gases son partículas en movimiento ───────────────────────────── */

const PART = ['cafe', 'zoom', 'choques']

export function EscenaGasParticulas({ fase }: { fase: string }) {
  const i = idx(PART, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Modelo de partículas de los gases: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <g style={ver(i === 0)}>
        <rect x="40" y="150" width="60" height="55" rx="6" fill="#fff" stroke={TINTA} strokeWidth="2" />
        <path d="M100 162 q22 0 22 18 q0 18 -22 18" fill="none" stroke={TINTA} strokeWidth="2" />
        <rect x="44" y="155" width="52" height="10" fill="#6b4226" />
        {[0, 1, 2].map((k) => <path key={k} d={`M${58 + k * 12} 145 q-8 -12 0 -24 q8 -12 0 -24`} fill="none" stroke="#bbb" strokeWidth="2" />)}
        <Particulas x={120} y={70} w={180} h={110} n={14} dur={3} r={4} c="#8a5a3b" semilla={3} />
        <circle cx="335" cy="125" r="28" fill="#f2d2b6" stroke={TINTA} />
        <path d="M310 128 l-10 6 l10 4" fill="#f2d2b6" stroke={TINTA} />
        <T x={200} y={245} t="El olor del café llega hasta la puerta" s={15} />
        <T x={200} y={268} t="sin que nadie lo lleve: el gas se esparce solo" s={12} peso={600} />
      </g>
      <g style={ver(i === 1)}>
        <circle cx="200" cy="125" r="95" fill="#fff" stroke={TINTA} strokeWidth="3" />
        <line x1="267" y1="192" x2="320" y2="245" stroke={TINTA} strokeWidth="10" strokeLinecap="round" />
        <clipPath id="gp-lupa"><circle cx="200" cy="125" r="92" /></clipPath>
        <g clipPath="url(#gp-lupa)"><Particulas x={105} y={30} w={190} h={190} n={10} dur={2.5} r={7} semilla={7} /></g>
        <T x={200} y={255} t="Partículas muy pequeñas y muy separadas" s={14} />
        <T x={200} y={275} t="entre ellas no hay nada: vacío" s={12} peso={600} />
      </g>
      <g style={ver(i === 2)}>
        <rect x="90" y="40" width="220" height="170" fill="#fff" stroke={TINTA} strokeWidth="4" />
        <Particulas x={92} y={42} w={216} h={166} n={18} dur={1.4} r={6} semilla={11} />
        {[[90, 80], [310, 150], [180, 40], [240, 210], [90, 180]].map(([x, y], k) => (
          <g key={k} transform={`translate(${x} ${y})`}>
            <path d="M-9 0 L-3 -3 L0 -10 L3 -3 L9 0 L3 3 L0 10 L-3 3 Z" fill={ROJO}>
              <animate attributeName="opacity" values="0;1;0" dur="0.9s" begin={`${k * 0.25}s`} repeatCount="indefinite" />
            </path>
          </g>
        ))}
        <T x={200} y={245} t="Chocan contra las paredes una y otra vez" s={14} />
        <T x={200} y={268} t="Esos choques son la PRESIÓN del gas" s={15} c={ROJO} />
      </g>
    </svg>
  )
}

/* ── Presión, volumen y temperatura ───────────────────────────────────── */

const VAR = ['presion', 'volumen', 'temperatura']

export function EscenaGasVariables({ fase }: { fase: string }) {
  const i = idx(VAR, fase)
  const ancho = i === 1 ? 240 : 160
  const x0 = 200 - ancho / 2
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Variables de un gas: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef2f6" />
      <rect x={x0} y="50" width={ancho} height="140" fill="#fff" stroke={TINTA} strokeWidth="4" style={{ transition: suave }} />
      <g key={fase}>
        <Particulas x={x0 + 2} y={52} w={ancho - 4} h={136} n={14} dur={i === 2 ? 0.7 : 2} r={6} c={i === 2 ? ROJO : GAS} semilla={5} />
      </g>
      <g style={ver(i === 0)}>
        <circle cx="330" cy="70" r="26" fill="#fff" stroke={TINTA} strokeWidth="2" />
        <line x1="330" y1="70" x2="345" y2="55" stroke={ROJO} strokeWidth="3" />
        <line x1="304" y1="70" x2="282" y2="70" stroke={TINTA} strokeWidth="4" />
        <T x={330} y={112} t="manómetro" s={10} peso={600} />
        <T x={200} y={230} t="P · PRESIÓN: la fuerza de los choques" s={15} c={ROJO} />
        <T x={200} y={252} t="contra las paredes (manómetro, barómetro)" s={12} peso={600} />
      </g>
      <g style={ver(i === 1)}>
        <line x1={x0} y1="205" x2={x0 + ancho} y2="205" stroke={AZUL} strokeWidth="2" style={{ transition: suave }} />
        <T x={200} y={230} t="V · VOLUMEN: el espacio que ocupa" s={15} c={AZUL} />
        <T x={200} y={252} t="un gas llena todo el recipiente que lo contiene" s={12} peso={600} />
      </g>
      <g style={ver(i === 2)}>
        <rect x="335" y="60" width="12" height="100" rx="6" fill="#fff" stroke={TINTA} />
        <rect x="338" y="80" width="6" height="80" fill={ROJO} />
        <circle cx="341" cy="168" r="11" fill={ROJO} />
        <T x={200} y={230} t="T · TEMPERATURA: qué tan rápido se mueven" s={15} c={VERDE} />
        <T x={200} y={252} t="más calor → partículas más rápidas" s={12} peso={600} />
      </g>
      <T x={200} y={282} t="Para describir un gas se dan las tres: P, V y T (y cuánto gas hay)" s={11} peso={600} />
    </svg>
  )
}

/* ── La escala Kelvin ─────────────────────────────────────────────────── */

const KEL = ['celsius', 'cero', 'kelvin']

function Termometro({ x, titulo, marcas, c }: { x: number; titulo: string; marcas: string[]; c: string }) {
  const ys = [60, 105, 225]
  return (
    <g>
      <rect x={x - 9} y="45" width="18" height="190" rx="9" fill="#fff" stroke={TINTA} strokeWidth="2" />
      <circle cx={x} cy="245" r="15" fill={c} stroke={TINTA} strokeWidth="2" />
      {ys.map((y, k) => (
        <g key={k}>
          <line x1={x - 14} y1={y} x2={x + 14} y2={y} stroke={TINTA} strokeWidth="2" />
          <text x={x + 20} y={y + 4} fontSize="12" fontWeight="800" fill={c}>{marcas[k]}</text>
        </g>
      ))}
      <T x={x} y={30} t={titulo} s={13} c={c} />
    </g>
  )
}

export function EscenaKelvin({ fase }: { fase: string }) {
  const i = idx(KEL, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Escala Kelvin: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <g style={{ transition: suave, transform: `translateX(${i === 2 ? -40 : 30}px)` }}>
        <Termometro x={120} titulo="Celsius" marcas={['100 °C', '0 °C', '−273 °C']} c={AZUL} />
        <rect x="114" y={i === 1 ? 222 : 108} width="12" height={i === 1 ? 13 : 127} fill={AZUL} opacity="0.7" style={{ transition: 'all 1.1s' }} />
      </g>
      <g style={{ ...ver(i === 0), transform: 'translateX(30px)' }}>
        <T x={290} y={66} t="el agua hierve" s={11} peso={600} />
        <T x={290} y={111} t="el agua se congela" s={11} peso={600} />
        <T x={290} y={231} t="¿y más abajo?" s={11} peso={600} />
      </g>
      <g style={ver(i === 1)}>
        <rect x="245" y="170" width="110" height="80" fill="#fff" stroke={TINTA} strokeWidth="2" />
        {Array.from({ length: 8 }, (_, k) => <circle key={k} cx={260 + (k % 4) * 27} cy={k < 4 ? 192 : 228} r="6" fill={GAS} />)}
        <T x={300} y={150} t="cero absoluto" s={14} c={ROJO} />
        <T x={300} y={268} t="las partículas casi no se mueven" s={11} peso={600} />
        <T x={300} y={100} t="No se puede enfriar más" s={12} />
      </g>
      <g style={ver(i === 2)}>
        <Termometro x={250} titulo="Kelvin" marcas={['373 K', '273 K', '0 K']} c={ROJO} />
        <rect x="320" y="120" width="70" height="56" rx="8" fill="#fff" stroke={VERDE} strokeWidth="2" />
        <T x={355} y={143} t="K =" s={13} c={VERDE} />
        <T x={355} y={163} t="°C + 273" s={13} c={VERDE} />
      </g>
    </svg>
  )
}

/* ── El barómetro de Torricelli ───────────────────────────────────────── */

const TORR = ['tubo', 'columna', 'unidades']

export function EscenaTorricelli({ fase }: { fase: string }) {
  const i = idx(TORR, fase)
  const alto = i === 0 ? 170 : 130
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Barómetro de Torricelli: ${fase}`} className="h-full w-full">
      <defs><marker id="tr-f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill={AZUL} /></marker></defs>
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef2f6" />
      <g style={{ transition: suave, transform: `translateX(${i === 2 ? -70 : 0}px)` }}>
        <path d="M110 230 L110 265 L290 265 L290 230" fill="none" stroke={TINTA} strokeWidth="3" />
        <rect x="112" y="240" width="176" height="24" fill="#b9bec4" />
        <rect x="185" y="40" width="30" height="215" fill="#fff" stroke={TINTA} strokeWidth="2" opacity="0.9" />
        <rect x="187" y={255 - alto} width="26" height={alto} fill="#9aa1a8" style={{ transition: 'all 1.2s' }} />
        <g style={ver(i >= 1)}>
          {[130, 160, 240, 270].map((x) => <line key={x} x1={x} y1="195" x2={x} y2="232" stroke={AZUL} strokeWidth="3" markerEnd="url(#tr-f)" />)}
          <T x={200} y={22} t="el aire empuja el mercurio" s={12} c={AZUL} />
          <line x1="230" y1="125" x2="230" y2="240" stroke={ROJO} strokeWidth="1.5" />
          <text x="236" y="185" fontSize="13" fontWeight="800" fill={ROJO}>760 mm</text>
        </g>
        <g style={ver(i === 0)}><T x={200} y={290} t="Tubo lleno de mercurio, boca abajo en una cubeta" s={12} /></g>
        <g style={ver(i === 1)}><T x={200} y={290} t="Baja hasta 760 mm y ahí se queda (a nivel del mar)" s={12} /></g>
      </g>
      <g style={ver(i === 2)}>
        <rect x="255" y="70" width="135" height="150" rx="12" fill="#fff" stroke={TINTA} strokeWidth="2" />
        <T x={322} y={98} t="1 atm" s={18} c={ROJO} />
        <T x={322} y={128} t="= 760 mmHg" s={14} />
        <T x={322} y={156} t="= 101,3 kPa" s={14} />
        <T x={322} y={184} t="≈ 14,7 psi" s={14} />
        <T x={322} y={208} t="(llantas)" s={10} peso={600} />
      </g>
    </svg>
  )
}

/* ── La presión atmosférica según la altura ───────────────────────────── */

const ALT = ['columna', 'lugares', 'papas']
const SITIOS = [
  { x: 70, y: 245, nombre: 'Neiva', m: '≈ 440 m', p: '≈ 720 mmHg' },
  { x: 200, y: 165, nombre: 'Bogotá', m: '≈ 2600 m', p: '≈ 560 mmHg' },
  { x: 320, y: 70, nombre: 'Nevado del Huila', m: '≈ 5360 m', p: '≈ 400 mmHg' },
]

export function EscenaPresionAltura({ fase }: { fase: string }) {
  const i = idx(ALT, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Presión atmosférica y altura: ${fase}`} className="h-full w-full">
      <defs>
        <linearGradient id="pa-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e8f1fa" /><stop offset="1" stopColor="#a9cbe8" /></linearGradient>
      </defs>
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="url(#pa-cielo)" />
      <path d="M0 260 L60 250 L140 215 L200 170 L260 120 L320 72 L360 110 L400 130 L400 300 L0 300 Z" fill="#8aa86b" stroke="#5f7d47" strokeWidth="2" />
      <path d="M300 88 L320 72 L340 92 L330 95 L320 88 L310 96 Z" fill="#fff" />
      <g style={ver(i === 0)}>
        {SITIOS.map((s) => <rect key={s.nombre} x={s.x - 12} y="10" width="24" height={s.y - 14} fill={AZUL} opacity="0.3" />)}
        <T x={200} y={290} t="Encima de cada lugar hay una columna de aire que pesa" s={12} c="#fff" />
      </g>
      {SITIOS.map((s) => <circle key={s.nombre} cx={s.x} cy={s.y} r="6" fill={ROJO} stroke="#fff" strokeWidth="2" />)}
      <g style={ver(i === 1)}>
        {SITIOS.map((s, k) => (
          <g key={s.nombre}>
            <rect x={s.x - 58} y={s.y - (k === 2 ? -14 : 62)} width="116" height="50" rx="8" fill="#fff" stroke={TINTA} />
            <T x={s.x} y={s.y - (k === 2 ? -30 : 46)} t={s.nombre} s={11} />
            <T x={s.x} y={s.y - (k === 2 ? -44 : 32)} t={s.m} s={10} peso={600} />
            <T x={s.x} y={s.y - (k === 2 ? -58 : 18)} t={s.p} s={11} c={ROJO} />
          </g>
        ))}
      </g>
      <g style={ver(i === 2)}>
        <rect x="35" y="185" width="60" height="50" rx="10" fill="#f1c232" stroke={TINTA} />
        <T x={65} y={215} t="papas" s={10} />
        <ellipse cx="290" cy="150" rx="42" ry="34" fill="#f1c232" stroke={TINTA} />
        <T x={290} y={154} t="papas" s={10} />
        <T x={200} y={290} t="Arriba hay menos aire empujando: el paquete se infla" s={12} c="#fff" />
      </g>
    </svg>
  )
}
