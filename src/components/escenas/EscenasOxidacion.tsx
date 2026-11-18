// Escenas vivas de Química, área 3, tema 1: estados de oxidación.

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean) => ({ transition: suave, opacity: si ? 1 : 0 })
const idx = (orden: string[], fase: string) => Math.max(0, orden.indexOf(fase))

const TINTA = '#3a3a3a'
const AZUL = '#3f6fb8'
const ROJO = '#c43c3c'
const VERDE = '#4f8a3c'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}
/** átomo con su estado de oxidación en una etiqueta */
function Atomo({ x, y, r, sim, color, ox, verOx }: { x: number; y: number; r: number; sim: string; color: string; ox: string; verOx: boolean }) {
  const pos = ox.startsWith('+')
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={color} stroke={TINTA} strokeWidth="1.5" />
      <T x={x} y={y + 6} t={sim} s={r > 25 ? 18 : 14} />
      <g style={ver(verOx)}>
        <rect x={x - 18} y={y - r - 26} width="36" height="20" rx="10" fill={pos ? ROJO : AZUL} />
        <T x={x} y={y - r - 11} t={ox} c="#fff" s={12} />
      </g>
    </g>
  )
}
const e = (x: number, y: number, k: number) => <circle key={k} cx={x} cy={y} r="4" fill="#f2c94c" stroke={TINTA} strokeWidth="0.8" />

/* ── Idea: contar «como si» fuera iónico ─────────────────────────────── */

const IDEA = ['ionico', 'covalente', 'suma']

export function EscenaOxIdea({ fase }: { fase: string }) {
  const i = idx(IDEA, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Estado de oxidación: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f3f0e8" />
      <g style={ver(i === 0)}>
        <Atomo x={120} y={140} r={30} sim="Na" color="#d9d2f0" ox="+1" verOx />
        <Atomo x={280} y={140} r={36} sim="Cl" color="#c9e6b8" ox="−1" verOx />
        <path d="M150 140 Q200 100 244 135" fill="none" stroke={TINTA} strokeDasharray="4 3" />
        <circle cx="246" cy="128" r="4" fill="#f2c94c" stroke={TINTA} />
        <T x={200} y={105} t="cede 1 electrón" s={11} peso={600} />
        <T x={200} y={225} t="El sodio pierde un electrón (+1) y el cloro lo gana (−1)" s={12} />
        <T x={200} y={245} t="Aquí el estado de oxidación es la carga real del ion" s={11} peso={600} c={VERDE} />
      </g>
      <g style={ver(i >= 1)}>
        <line x1="200" y1="135" x2="130" y2="185" stroke={TINTA} strokeWidth="3" />
        <line x1="200" y1="135" x2="270" y2="185" stroke={TINTA} strokeWidth="3" />
        {/* electrones de los enlaces corridos hacia el oxígeno */}
        {[e(180, 146, 0), e(186, 154, 1), e(220, 146, 2), e(214, 154, 3)]}
        <Atomo x={200} y={130} r={36} sim="O" color="#f4b8b0" ox="−2" verOx={i >= 1} />
        <Atomo x={125} y={195} r={22} sim="H" color="#eeeeee" ox="+1" verOx={i >= 1} />
        <Atomo x={275} y={195} r={22} sim="H" color="#eeeeee" ox="+1" verOx={i >= 1} />
      </g>
      <g style={ver(i === 1)}>
        <T x={200} y={250} t="No hay iones, pero el oxígeno jala los electrones de los enlaces:" s={11} />
        <T x={200} y={267} t="se le cuentan «como si» fueran suyos" s={12} />
      </g>
      <g style={ver(i === 2)}>
        <rect x="90" y="236" width="220" height="36" rx="10" fill="#fff" stroke={TINTA} />
        <T x={200} y={260} t="(+1) + (+1) + (−2) = 0" s={16} c={VERDE} />
        <T x={200} y={290} t="El agua es neutra: los estados suman cero" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── La tabla ayuda ───────────────────────────────────────────────────── */

const TABLA = ['grupos', 'transicion']
const GRUPOS = [
  { g: '1', ox: '+1', ej: 'Na' }, { g: '2', ox: '+2', ej: 'Ca' }, { g: '13', ox: '+3', ej: 'Al' }, { g: '14', ox: '±4', ej: 'C' },
  { g: '15', ox: '−3', ej: 'N' }, { g: '16', ox: '−2', ej: 'O' }, { g: '17', ox: '−1', ej: 'Cl' }, { g: '18', ox: '0', ej: 'Ne' },
]
const TRANS = [{ s: 'Fe', ox: '+2 · +3' }, { s: 'Cu', ox: '+1 · +2' }, { s: 'Mn', ox: '+2 … +7' }, { s: 'Cr', ox: '+3 · +6' }]

export function EscenaOxTabla({ fase }: { fase: string }) {
  const i = idx(TABLA, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Estados de oxidación en la tabla: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef2f6" />
      {GRUPOS.map((x, k) => {
        const cx = 39 + k * 46
        return (
          <g key={x.g} style={{ transition: suave, opacity: i === 1 ? 0.35 : 1 }}>
            <rect x={cx - 20} y={60} width="40" height="70" rx="6" fill={k < 2 ? '#d9d2f0' : k === 7 ? '#e6e6e6' : '#c9e6b8'} stroke={TINTA} />
            <T x={cx} y={78} t={`G${x.g}`} s={10} peso={600} />
            <T x={cx} y={100} t={x.ej} s={15} />
            <T x={cx} y={122} t={x.ox} s={13} c={x.ox.startsWith('+') ? ROJO : x.ox === '0' ? TINTA : AZUL} />
          </g>
        )
      })}
      <g style={ver(i === 0)}>
        <T x={200} y={170} t="Metales (izquierda): estados positivos, ceden electrones" s={12} c={ROJO} />
        <T x={200} y={190} t="No metales (derecha): negativos cuando son el más electronegativo" s={12} c={AZUL} />
        <T x={200} y={225} t="Los no metales también pueden ser positivos con el oxígeno:" s={11} peso={600} />
        <T x={200} y={242} t="el azufre es −2 en el H₂S, pero +6 en el H₂SO₄" s={11} peso={600} />
      </g>
      <g style={ver(i === 1)}>
        {TRANS.map((x, k) => (
          <g key={x.s}>
            <rect x={40 + k * 85} y={160} width="70" height="70" rx="8" fill="#f6dcb4" stroke={TINTA} />
            <T x={75 + k * 85} y={192} t={x.s} s={18} />
            <T x={75 + k * 85} y={216} t={x.ox} s={11} c={ROJO} />
          </g>
        ))}
        <T x={200} y={262} t="Los metales de transición tienen varios estados:" s={12} />
        <T x={200} y={280} t="por eso su nombre dice cuál usa: hierro (II) o hierro (III)" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── Cálculo en el H₂SO₄ ──────────────────────────────────────────────── */

const CALC = ['formula', 'conocidos', 'despeja']

export function EscenaOxCalculo({ fase }: { fase: string }) {
  const i = idx(CALC, fase)
  const caja = (x: number, sim: string, sub: string, color: string, ox: string, total: string) => (
    <g>
      <rect x={x - 45} y={60} width="90" height="70" rx="10" fill={color} stroke={TINTA} />
      <T x={x} y={105} t={sim + sub} s={24} />
      <g style={ver(i >= 1)}>
        <T x={x} y={152} t={ox} s={13} c={ox === 'x' ? VERDE : ox.startsWith('+') ? ROJO : AZUL} />
        <T x={x} y={172} t={total} s={15} c={total === 'x' ? VERDE : total.startsWith('+') ? ROJO : AZUL} />
      </g>
    </g>
  )
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Cálculo del estado de oxidación del azufre: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      {caja(90, 'H', '₂', '#eeeeee', '2 × (+1)', '+2')}
      {caja(200, 'S', '', '#f2e39b', 'x', 'x')}
      {caja(310, 'O', '₄', '#f4b8b0', '4 × (−2)', '−8')}
      <g style={ver(i === 0)}>
        <T x={200} y={170} t="?" s={34} c={VERDE} />
        <T x={200} y={225} t="Ácido sulfúrico: el hidrógeno y el oxígeno tienen regla," s={12} />
        <T x={200} y={243} t="el azufre no. Su estado es la incógnita x" s={12} />
      </g>
      <g style={ver(i === 1)}>
        <T x={200} y={225} t="Cada estado se multiplica por su subíndice" s={12} />
      </g>
      <g style={ver(i === 2)}>
        <rect x="70" y="200" width="260" height="40" rx="10" fill="#fff" stroke={TINTA} />
        <T x={200} y={227} t="+2 + x − 8 = 0" s={18} />
        <T x={200} y={275} t="x = +6" s={24} c={VERDE} />
      </g>
    </svg>
  )
}

/* ── Iones y estados variables ────────────────────────────────────────── */

const ION = ['sulfato', 'amonio', 'hierro']

function Ion({ centro, cc, fuera, fc, ox, oxf, carga, ecuacion }: { centro: string; cc: string; fuera: string; fc: string; ox: string; oxf: string; carga: string; ecuacion: string }) {
  const pos = [[0, -62], [62, 0], [0, 62], [-62, 0]]
  return (
    <g>
      {pos.map(([dx, dy], k) => <line key={k} x1={200} y1={125} x2={200 + dx} y2={125 + dy} stroke={TINTA} strokeWidth="3" />)}
      {pos.map(([dx, dy], k) => <Atomo key={k} x={200 + dx} y={125 + dy} r={18} sim={fuera} color={fc} ox={oxf} verOx={false} />)}
      <Atomo x={200} y={125} r={26} sim={centro} color={cc} ox={ox} verOx />
      <rect x="40" y="58" width="96" height="34" rx="8" fill="#fff" stroke={TINTA} />
      <T x={88} y={81} t={`carga ${carga}`} s={13} c={carga.endsWith('−') ? AZUL : ROJO} />
      <T x={200} y={240} t={ecuacion} s={15} />
    </g>
  )
}

export function EscenaOxIon({ fase }: { fase: string }) {
  const i = idx(ION, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Estados de oxidación en iones: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef4ee" />
      <g style={ver(i === 0)}>
        <Ion centro="S" cc="#f2e39b" fuera="O" fc="#f4b8b0" ox="+6" oxf="−2" carga="2−" ecuacion="x + 4 × (−2) = −2  →  x = +6" />
        <T x={200} y={272} t="En un ion, la suma da la carga del ion (no cero)" s={11} peso={600} />
      </g>
      <g style={ver(i === 1)}>
        <Ion centro="N" cc="#b8cdf0" fuera="H" fc="#eeeeee" ox="−3" oxf="+1" carga="1+" ecuacion="x + 4 × (+1) = +1  →  x = −3" />
        <T x={200} y={272} t="Amonio: viene en abonos como el sulfato de amonio" s={11} peso={600} />
      </g>
      <g style={ver(i === 2)}>
        <rect x="45" y="60" width="140" height="110" rx="12" fill="#3b3330" />
        <T x={115} y={110} t="FeO" s={22} c="#fff" />
        <T x={115} y={140} t="Fe: +2" s={14} c="#f2c94c" />
        <rect x="215" y="60" width="140" height="110" rx="12" fill="#a8432a" />
        <T x={285} y={110} t="Fe₂O₃" s={22} c="#fff" />
        <T x={285} y={140} t="Fe: +3" s={14} c="#f2c94c" />
        <T x={115} y={190} t="óxido de hierro (II)" s={11} peso={600} />
        <T x={115} y={206} t="óxido ferroso" s={11} peso={600} c={AZUL} />
        <T x={285} y={190} t="óxido de hierro (III)" s={11} peso={600} />
        <T x={285} y={206} t="óxido férrico (el óxido rojo)" s={11} peso={600} c={AZUL} />
        <T x={200} y={250} t="El mismo elemento con dos estados: el nombre dice cuál" s={12} />
        <T x={200} y={268} t="-oso: el menor · -ico: el mayor" s={12} c={VERDE} />
      </g>
    </svg>
  )
}
