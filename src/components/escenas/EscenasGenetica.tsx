// Escenas vivas de la historia de la genética (área 2, tema 1): Griffith, Avery, Hershey y Chase, Miescher.

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean, mover = 'none', quieto = 'none') => ({ transition: suave, opacity: si ? 1 : 0, transform: si ? mover : quieto })
const fondo = (color: string) => <rect x="-1500" y="-1500" width="3400" height="3300" fill={color} style={{ transition: 'fill 0.8s' }} />

const AZUL = '#3f6fb8'
const NARANJA = '#c9702f'
const ROJO = '#c43c3c'
const AMARILLO = '#d99a12'
const TINTA = '#3a3a3a'

function Texto({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}

/* ── bacterias y ratones (Griffith y Avery) ───────────────────────────── */

/** Neumococo. `s` = cepa S (con cápsula); `muerta` = muerta por calor. */
function Bact({ x, y, s, muerta = false, k = 1 }: { x: number; y: number; s: boolean; muerta?: boolean; k?: number }) {
  const cuerpo = muerta ? '#a9a9a9' : s ? AZUL : NARANJA
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      {s && <ellipse rx="14" ry="10" fill={muerta ? '#eee' : '#e3eefc'} stroke={muerta ? '#bbb' : '#8fb2e2'} strokeWidth="2" strokeDasharray="3 2" />}
      <ellipse rx="9" ry="6" fill={cuerpo} />
      {!s && <path d="M -9 0 l 2 -3 l 2 3 l 2 -3 l 2 3 l 2 -3 l 2 3 l 2 -3 l 2 3" fill="none" stroke="#fff" strokeWidth="1" opacity="0.6" />}
    </g>
  )
}

function Raton({ x, y, muerto, visible = true }: { x: number; y: number; muerto: boolean; visible?: boolean }) {
  const piel = muerto ? '#b7b2ab' : '#ddd6cb'
  return (
    <g style={{ transition: suave, opacity: visible ? 1 : 0 }} transform={`translate(${x} ${y})`}>
      <g style={{ transition: suave, transformOrigin: '0px 0px', transform: muerto ? 'scale(1, -1)' : 'none' }}>
        <path d="M -24 2 q -14 10 -26 -2" fill="none" stroke="#c9a6a0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="-12" y1="12" x2="-14" y2="20" stroke="#c9a6a0" strokeWidth="3" strokeLinecap="round" />
        <line x1="10" y1="12" x2="12" y2="20" stroke="#c9a6a0" strokeWidth="3" strokeLinecap="round" />
        <ellipse rx="25" ry="14" fill={piel} />
        <circle cx="22" cy="-6" r="10" fill={piel} />
        <circle cx="17" cy="-16" r="6" fill="#f0b9b4" stroke={piel} strokeWidth="2" />
        <circle cx="31" cy="-5" r="2" fill="#e88" />
      </g>
      {muerto
        ? <text x="24" y="10" textAnchor="middle" fontSize="9" fontWeight="900" fill={TINTA}>x</text>
        : <circle cx="25" cy="-8" r="1.8" fill={TINTA} />}
    </g>
  )
}

const GRIFFITH = ['cepas', 's-vivas', 'r-vivas', 's-muertas', 'mezcla', 'sangre']
const COLS = [
  { t: 'S vivas', muere: true },
  { t: 'R vivas', muere: false },
  { t: 'S muertas', muere: false },
  { t: 'S muertas + R', muere: true },
]

export function EscenaGriffith({ fase }: { fase: string }) {
  const i = Math.max(0, GRIFFITH.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Experimento de Griffith: ${fase}`} className="h-full w-full">
      {fondo(i === 5 ? '#f6eeee' : '#f4f1ea')}

      {/* las dos cepas */}
      <g style={ver(i === 0, 'none', 'translate(0, -30px)')}>
        <Bact x={120} y={120} s k={3.4} />
        <Bact x={280} y={120} s={false} k={3.4} />
        <Texto x={120} y={190} t="Cepa S (lisa)" c={AZUL} s={15} />
        <Texto x={120} y={208} t="con cápsula · mortal" s={11} peso={600} />
        <Texto x={280} y={190} t="Cepa R (rugosa)" c={NARANJA} s={15} />
        <Texto x={280} y={208} t="sin cápsula · inofensiva" s={11} peso={600} />
      </g>

      {/* los cuatro ratones, uno por fase */}
      {COLS.map((col, k) => {
        const cx = 55 + 97 * k
        const si = i >= k + 1
        return (
          <g key={col.t} style={ver(si, 'none', 'translate(0, 20px)')}>
            <Texto x={cx} y={30} t={col.t} s={11} />
            {k === 0 && <><Bact x={cx - 10} y={55} s /><Bact x={cx + 12} y={62} s /></>}
            {k === 1 && <><Bact x={cx - 10} y={55} s={false} /><Bact x={cx + 12} y={62} s={false} /></>}
            {k === 2 && <><Bact x={cx - 10} y={55} s muerta /><Bact x={cx + 12} y={62} s muerta /><Texto x={cx + 30} y={50} t="🔥" s={12} /></>}
            {k === 3 && <><Bact x={cx - 14} y={55} s muerta /><Bact x={cx + 14} y={55} s={false} /><Texto x={cx} y={60} t="+" s={12} /></>}
            <path d={`M ${cx} 78 v 26`} stroke="#888" strokeWidth="2.5" markerEnd="url(#gr-fl)" />
            <Raton x={cx - 4} y={128} muerto={col.muere} />
            <Texto x={cx} y={170} t={col.muere ? 'muere' : 'vive'} c={col.muere ? ROJO : '#3f7a35'} s={14} />
          </g>
        )
      })}

      {/* el cuarto ratón: en su sangre hay S vivas */}
      <g style={ver(i === 5, 'none', 'translate(0, 30px)')}>
        <rect x="20" y="188" width="360" height="104" rx="14" fill="#fff" stroke="#e2c4c4" strokeWidth="2" />
        <Texto x={200} y={207} t="En la sangre del ratón muerto hay bacterias S vivas" c={ROJO} />
        <Bact x={70} y={248} s={false} k={1.8} />
        <Texto x={110} y={253} t="+" s={18} />
        <g transform="translate(150 248)">
          <path d="M -18 -6 q 6 -8 12 0 t 12 0 t 12 0" fill="none" stroke={AZUL} strokeWidth="3" />
          <path d="M -18 4 q 6 -8 12 0 t 12 0 t 12 0" fill="none" stroke="#8fb2e2" strokeWidth="3" />
        </g>
        <Texto x={150} y={280} t="algo de las S muertas" s={10} peso={600} />
        <path d="M 192 248 h 44" stroke="#888" strokeWidth="2.5" markerEnd="url(#gr-fl)" />
        <Bact x={290} y={248} s k={1.8} />
        <Texto x={290} y={282} t="R transformada en S" c={AZUL} s={11} />
      </g>

      <defs>
        <marker id="gr-fl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#888" /></marker>
      </defs>
    </svg>
  )
}

/* ── Avery, MacLeod y McCarty: los tubos con enzimas ──────────────────── */

const AVERY = ['extracto', 'proteasa', 'rnasa', 'dnasa', 'conclusion']
const TUBOS = [
  { enzima: 'proteasa', quita: 0, transforma: true },
  { enzima: 'RNasa', quita: 1, transforma: true },
  { enzima: 'DNasa', quita: 2, transforma: false },
]

function Proteina({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} fill="#e8a24a" stroke="#b5761f" strokeWidth="1.5">
      <circle cx="-6" cy="0" r="6" /><circle cx="4" cy="-4" r="5" /><circle cx="5" cy="5" r="5" />
    </g>
  )
}
function Arn({ x, y }: { x: number; y: number }) {
  return <path transform={`translate(${x} ${y})`} d="M -14 0 q 3.5 -7 7 0 t 7 0 t 7 0 t 7 0" fill="none" stroke="#3f9a5a" strokeWidth="3" strokeLinecap="round" />
}
function Adn({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} fill="none" strokeWidth="3" strokeLinecap="round">
      <path d="M -14 -3 q 3.5 -7 7 0 t 7 0 t 7 0 t 7 0" stroke={AZUL} />
      <path d="M -14 4 q 3.5 -7 7 0 t 7 0 t 7 0 t 7 0" stroke="#8fb2e2" />
    </g>
  )
}

function Placa({ x, y, transforma, visible }: { x: number; y: number; transforma: boolean; visible: boolean }) {
  const r: [number, number][] = [[-30, -4], [-14, 8], [6, -8], [22, 6], [34, -2], [-2, 10]]
  const s: [number, number][] = [[-22, 6], [12, 2], [28, -8]]
  return (
    <g style={ver(visible, 'none', 'translate(0, 16px)')}>
      <ellipse cx={x} cy={y} rx="50" ry="20" fill="#f7ecd6" stroke="#b9a27a" strokeWidth="2.5" />
      {r.map(([dx, dy], k) => <circle key={k} cx={x + dx} cy={y + dy} r="3.2" fill={NARANJA} opacity="0.85" />)}
      {transforma && s.map(([dx, dy], k) => <g key={k}><circle cx={x + dx} cy={y + dy} r="6" fill={AZUL} /><circle cx={x + dx - 2} cy={y + dy - 2} r="1.8" fill="#fff" opacity="0.8" /></g>)}
      <Texto x={x} y={y + 38} t={transforma ? 'aparecen S' : 'solo R'} c={transforma ? AZUL : NARANJA} s={12} />
      <Texto x={x} y={y + 52} t={transforma ? 'hubo transformación' : 'no hubo transformación'} s={10} peso={600} />
    </g>
  )
}

export function EscenaAvery({ fase }: { fase: string }) {
  const i = Math.max(0, AVERY.indexOf(fase))
  const fin = i === 4
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Experimento de Avery, MacLeod y McCarty: ${fase}`} className="h-full w-full">
      {fondo('#f2f4f6')}
      <g style={ver(i === 0)}><Texto x={200} y={22} t="Extracto de bacterias S muertas, en tres tubos" /></g>
      <g style={ver(fin)}><Texto x={200} y={22} t="Sin ADN no hay transformación: el ADN es el factor" c={AZUL} /></g>
      {TUBOS.map((tb, k) => {
        const cx = 80 + 120 * k
        const activo = i >= k + 1
        const destacado = fin && !tb.transforma
        return (
          <g key={tb.enzima} style={{ transition: suave, opacity: fin && tb.transforma ? 0.45 : 1 }}>
            {/* enzima que entra */}
            <g style={ver(activo, 'none', 'translate(0, -14px)')}>
              <Texto x={cx} y={44} t={`✂ ${tb.enzima}`} c={ROJO} s={13} />
            </g>
            {/* tubo */}
            <path d={`M ${cx - 22} 54 v 92 a 22 22 0 0 0 44 0 v -92`} fill="#fff" stroke={destacado ? AZUL : '#9aa4ae'} strokeWidth={destacado ? 4 : 2.5} style={{ transition: 'stroke 0.6s' }} />
            <rect x={cx - 20} y={78} width="40" height="88" fill="#e9f0f7" opacity="0.7" />
            <g style={{ transition: suave, opacity: activo && tb.quita === 0 ? 0 : 1 }}><Proteina x={cx} y={96} /></g>
            <g style={{ transition: suave, opacity: activo && tb.quita === 1 ? 0 : 1 }}><Arn x={cx} y={122} /></g>
            <g style={{ transition: suave, opacity: activo && tb.quita === 2 ? 0 : 1 }}><Adn x={cx} y={146} /></g>
            {/* bacterias R que se agregan y resultado */}
            <g style={ver(activo)}><Texto x={cx} y={188} t="+ bacterias R vivas" c={NARANJA} s={10} /></g>
            <Placa x={cx} y={218} transforma={tb.transforma} visible={activo} />
          </g>
        )
      })}
      {/* leyenda de las moléculas */}
      <g style={ver(i === 0)} fontSize="10" fontWeight="700" fill={TINTA}>
        <text x={384} y={100} textAnchor="end">proteínas</text>
        <text x={384} y={126} textAnchor="end">ARN</text>
        <text x={384} y={150} textAnchor="end">ADN</text>
      </g>
    </svg>
  )
}

/* ── Hershey y Chase: el fago marcado ─────────────────────────────────── */

const HERSHEY = ['fago', 'marcas', 'infeccion', 'licuadora', 'centrifuga', 'conclusion']

function Fago({ cubierta, adn, conAdn = true }: { cubierta: string; adn: string; conAdn?: boolean }) {
  return (
    <g>
      <polygon points="0,-36 15,-27 15,-9 0,0 -15,-9 -15,-27" fill="#f4f1ea" stroke={cubierta} strokeWidth="3.5" />
      <path d="M -6 -26 q 6 -4 10 2 q -8 4 -2 8 q 8 2 2 8" fill="none" stroke={adn} strokeWidth="2.5" style={{ transition: 'opacity 0.6s', opacity: conAdn ? 1 : 0 }} />
      <rect x="-3.5" y="0" width="7" height="20" fill="#f4f1ea" stroke={cubierta} strokeWidth="2.5" />
      <path d="M -3 20 l -12 12 M 3 20 l 12 12 M 0 20 v 14" stroke={cubierta} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </g>
  )
}

export function EscenaHersheyChase({ fase }: { fase: string }) {
  const i = Math.max(0, HERSHEY.indexOf(fase))
  const lados = [
    { cx: 105, titulo: 'Azufre radiactivo', sub: 'marca la proteína', color: AMARILLO, cubierta: AMARILLO, adn: '#7f8a96' },
    { cx: 295, titulo: 'Fósforo radiactivo', sub: 'marca el ADN', color: ROJO, cubierta: '#7f8a96', adn: ROJO },
  ]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Experimento de Hershey y Chase: ${fase}`} className="h-full w-full">
      {fondo('#f3f2ee')}

      {/* el fago, grande */}
      <g style={{ ...ver(i === 0, 'none', 'scale(0.6)'), transformOrigin: '200px 150px' }}>
        <g transform="translate(200 160) scale(2.6)"><Fago cubierta="#7f8a96" adn={AZUL} /></g>
        <Texto x={300} y={88} t="cubierta de proteína" s={12} />
        <path d="M 250 92 L 228 104" stroke="#888" strokeWidth="2" />
        <Texto x={95} y={112} t="ADN adentro" c={AZUL} s={12} />
        <path d="M 130 110 L 188 104" stroke="#888" strokeWidth="2" />
        <Texto x={200} y={270} t="Bacteriófago: un virus que infecta bacterias" s={12} />
      </g>

      {lados.map((l, k) => (
        <g key={l.titulo} style={ver(i >= 1)}>
          <Texto x={l.cx} y={22} t={l.titulo} c={l.color} s={13} />
          <Texto x={l.cx} y={37} t={l.sub} s={10} peso={600} />

          {/* fago y bacteria: marcas → infección → licuadora */}
          <g style={{ transition: suave, opacity: i >= 1 && i <= 3 ? 1 : 0 }}>
            <rect x={l.cx - 60} y={168} width="120" height="56" rx="28" fill="#f6e7d4" stroke="#c9a77d" strokeWidth="2.5" style={{ transition: 'opacity 0.6s', opacity: i >= 2 ? 1 : 0 }} />
            {/* ADN que entró a la bacteria */}
            <path d={`M ${l.cx - 26} 196 q 8 -12 16 0 t 16 0 t 16 0 t 16 0`} fill="none" stroke={l.adn} strokeWidth="3" strokeLinecap="round" style={{ transition: 'opacity 0.8s 0.5s', opacity: i >= 2 ? 1 : 0 }} />
            {[-28, 26].map((dx, j) => (
              <g key={dx} style={{ transition: suave, transform: i >= 3 ? `translate(${dx * 1.2}px, ${-6 - j * 10}px) rotate(${dx > 0 ? 35 : -35}deg)` : i >= 2 ? 'translate(0, 70px)' : 'none', transformBox: 'fill-box' }}>
                <g transform={`translate(${l.cx + dx} 98)`}><Fago cubierta={l.cubierta} adn={l.adn} conAdn={i < 2} /></g>
              </g>
            ))}
            {k === 0 && <g style={ver(i === 3)}><Texto x={200} y={150} t="🌀 licuadora" s={14} /></g>}
          </g>

          {/* centrífuga: fondo (bacterias) y líquido (cubiertas) */}
          <g style={ver(i >= 4, 'none', 'translate(0, 20px)')}>
            <path d={`M ${l.cx - 26} 60 v 150 a 26 26 0 0 0 52 0 v -150`} fill="#fff" stroke="#9aa4ae" strokeWidth="2.5" />
            <rect x={l.cx - 24} y={80} width="48" height="130" fill="#eef3f8" />
            {[[-10, 110], [8, 140], [-4, 170]].map(([dx, y]) => (
              <g key={y} transform={`translate(${l.cx + dx} ${y}) scale(0.45)`}><Fago cubierta={l.cubierta} adn={l.adn} conAdn={false} /></g>
            ))}
            <ellipse cx={l.cx} cy={222} rx="20" ry="11" fill="#e2c49f" stroke="#b08a5a" strokeWidth="2" />
            {/* dónde quedó la radiactividad */}
            <circle cx={l.cx} cy={k === 0 ? 140 : 222} r={k === 0 ? 36 : 22} fill="none" stroke={l.color} strokeWidth="3" strokeDasharray="5 4" />
            <Texto x={l.cx} y={268} t={k === 0 ? 'radiactividad en el líquido' : 'radiactividad en las bacterias'} c={l.color} s={11} />
            <Texto x={l.cx} y={282} t={k === 0 ? 'la proteína quedó afuera' : 'el ADN entró'} s={10} peso={600} />
          </g>
        </g>
      ))}

      <g style={ver(i === 5, 'none', 'translate(0, -10px)')}>
        <rect x="110" y="44" width="180" height="26" rx="13" fill={ROJO} />
        <Texto x={200} y={62} t="Lo que entra es el ADN" c="#fff" s={13} />
      </g>
    </svg>
  )
}

/* ── Miescher: del pus a la nucleína ──────────────────────────────────── */

const MIESCHER = ['vendajes', 'globulos', 'lavar', 'pepsina', 'nucleina', 'salmon']
const CELULAS: [number, number][] = [[150, 120], [220, 100], [260, 160], [180, 180], [120, 190]]

export function EscenaMiescher({ fase }: { fase: string }) {
  const i = Math.max(0, MIESCHER.indexOf(fase))
  const vaso = i === 2 || i === 3
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Miescher aísla la nucleína: ${fase}`} className="h-full w-full">
      {fondo(i === 5 ? '#e9f1f6' : '#f5f1ea')}

      {/* vendaje con pus */}
      <g style={ver(i === 0, 'none', 'scale(0.5)')}>
        <rect x="90" y="100" width="220" height="90" rx="10" fill="#fbfaf5" stroke="#cfc8b8" strokeWidth="3" />
        <path d="M 110 120 h 180 M 110 145 h 180 M 110 170 h 180" stroke="#e6e0d2" strokeWidth="2" />
        <path d="M 170 125 q 30 -18 60 4 q 22 22 -6 40 q -34 14 -56 -6 q -18 -20 2 -38 z" fill="#efd879" opacity="0.85" />
        <Texto x={200} y={222} t="Vendajes con pus del hospital" s={13} />
      </g>

      {/* vaso con agua salada / pepsina */}
      <g style={ver(vaso)}>
        <path d="M 80 70 v 170 q 0 20 20 20 h 200 q 20 0 20 -20 v -170" fill="#e6f0f7" stroke="#9aa4ae" strokeWidth="3" />
        <Texto x={200} y={286} t={i === 2 ? 'agua con sal' : 'pepsina, del estómago de cerdo 🐖'} c={i === 2 ? AZUL : ROJO} s={12} />
      </g>
      {/* gotas de grasa que se van al lavar */}
      {[[130, 90], [250, 80], [300, 130], [110, 150]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="6" fill="#f2d06b" style={{ transition: 'transform 1.4s ease, opacity 1.2s', opacity: i === 1 ? 1 : 0, transform: i >= 2 ? 'translate(0, -60px)' : 'none' }} />
      ))}

      {/* glóbulos blancos: la célula se deshace, el núcleo queda y luego se junta */}
      {CELULAS.map(([x, y], k) => (
        <g key={k} style={{ transition: suave, opacity: i >= 1 && i <= 4 ? 1 : 0, transform: i === 4 ? `translate(${200 - x}px, ${150 - y}px)` : 'none' }}>
          <circle cx={x} cy={y} r="26" fill="#fbf4ec" stroke="#d9c3b0" strokeWidth="2.5" style={{ transition: 'opacity 0.9s', opacity: i <= 2 ? 1 : 0 }} />
          <g style={{ transition: 'opacity 0.9s', opacity: i <= 3 ? 1 : 0 }}>
            <circle cx={x - 7} cy={y - 3} r="8" fill="#8a5aa8" /><circle cx={x + 6} cy={y - 6} r="7" fill="#8a5aa8" /><circle cx={x + 3} cy={y + 7} r="7" fill="#8a5aa8" />
          </g>
        </g>
      ))}
      <g style={ver(i === 1)}><Texto x={200} y={250} t="Glóbulos blancos: núcleo grande" c="#8a5aa8" s={13} /></g>
      <g style={ver(i === 3)}><Texto x={200} y={40} t="Las proteínas se deshacen; quedan los núcleos" c="#8a5aa8" s={12} /></g>

      {/* la nucleína */}
      <g style={{ ...ver(i === 4, 'none', 'scale(0.7)'), transformOrigin: '200px 150px' }}>
        <path d="M 176 130 q 12 -10 22 6 q 10 -16 24 -2 q -4 14 -14 18 q 14 8 0 22 q -14 -6 -20 -18 q -18 4 -12 -26 z" fill="#fffdf8" stroke="#bdb6a8" strokeWidth="2" />
        <path d="M 184 140 q 10 4 14 16 M 204 134 q -2 12 8 20" stroke="#cfc6b4" strokeWidth="2" fill="none" />
        <circle cx="244" cy="118" r="15" fill={ROJO} />
        <Texto x={244} y={123} t="P" c="#fff" s={14} />
        <Texto x={200} y={214} t="Nucleína: rica en fósforo" s={15} />
        <Texto x={200} y={232} t="no se comporta como una proteína" s={11} peso={600} />
        <Texto x={200} y={252} t="(hoy sabemos que es ADN)" c={AZUL} s={11} />
      </g>

      {/* después, el salmón */}
      <g style={ver(i === 5, 'none', 'translate(-40px, 0)')}>
        <path d="M 90 150 q 70 -60 170 -10 l 40 -30 v 80 l -40 -30 q -100 50 -170 -10 z" fill="#e88a6a" stroke="#b5583a" strokeWidth="3" />
        <circle cx="118" cy="140" r="4" fill={TINTA} />
        <path d="M 150 132 q 20 18 0 36 M 180 128 q 22 22 0 44" stroke="#c96a4a" strokeWidth="2" fill="none" />
        <Texto x={200} y={236} t="Esperma de salmón: casi todo es núcleo" s={13} />
        <Texto x={200} y={254} t="Así obtuvo mucha más nucleína, ya en Basilea" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── Franklin: la Foto 51 ─────────────────────────────────────────────── */

const FOTO51 = ['fibra', 'rayos', 'foto', 'lectura', 'helice', 'polemica']

/** Hélice doble dibujada en vertical, centrada en (x, y). */
function Helice({ x, y, alto = 160, ancho = 46, vueltas = 2 }: { x: number; y: number; alto?: number; ancho?: number; vueltas?: number }) {
  const n = 48
  const pts = (fase: number) =>
    Array.from({ length: n + 1 }, (_, k) => {
      const t = k / n
      return `${(x + (ancho / 2) * Math.sin(t * vueltas * 2 * Math.PI + fase)).toFixed(1)},${(y - alto / 2 + t * alto).toFixed(1)}`
    }).join(' ')
  const peldanos = Array.from({ length: vueltas * 8 }, (_, k) => {
    const t = (k + 0.5) / (vueltas * 8)
    const a = t * vueltas * 2 * Math.PI
    const yy = y - alto / 2 + t * alto
    return <line key={k} x1={x + (ancho / 2) * Math.sin(a)} y1={yy} x2={x + (ancho / 2) * Math.sin(a + Math.PI)} y2={yy} stroke={k % 2 ? '#e0a020' : '#3f9a5a'} strokeWidth="3" />
  })
  return (
    <g>
      {peldanos}
      <polyline points={pts(0)} fill="none" stroke={AZUL} strokeWidth="4" strokeLinecap="round" />
      <polyline points={pts(Math.PI)} fill="none" stroke="#8fb2e2" strokeWidth="4" strokeLinecap="round" />
    </g>
  )
}

/** Patrón de difracción de la Foto 51 (simplificado): una X de manchas y un rombo. */
function Patron({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  const manchas: [number, number][] = []
  for (let j = 1; j <= 5; j++) for (const s of [-1, 1]) { manchas.push([s * j * 9, j * 11]); manchas.push([s * j * 9, -j * 11]) }
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <circle r="78" fill="#1d1d22" />
      <circle r="78" fill="url(#f51-halo)" />
      {manchas.map(([a, b], i) => <ellipse key={i} cx={a} cy={b} rx="5" ry="2.6" fill="#f2efe6" opacity={Math.abs(b) === 44 ? 0.25 : 0.85} />)}
      <ellipse cx="0" cy="-70" rx="16" ry="4" fill="#f2efe6" /><ellipse cx="0" cy="70" rx="16" ry="4" fill="#f2efe6" />
      <circle r="5" fill="#f2efe6" opacity="0.5" />
    </g>
  )
}

export function EscenaFoto51({ fase }: { fase: string }) {
  const i = Math.max(0, FOTO51.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`La Foto 51: ${fase}`} className="h-full w-full">
      {fondo(i >= 2 && i <= 4 ? '#e9e7e2' : '#f3f1ec')}
      <defs>
        <radialGradient id="f51-halo"><stop offset="0" stopColor="#555" stopOpacity="0.7" /><stop offset="1" stopColor="#1d1d22" stopOpacity="0" /></radialGradient>
      </defs>

      {/* montaje: tubo de rayos X → fibra de ADN → placa */}
      <g style={ver(i <= 1, 'none', 'translate(0, -20px)')}>
        <rect x="16" y="128" width="56" height="44" rx="8" fill="#6c7480" />
        <Texto x={44} y={192} t="rayos X" s={11} />
        <line x1="72" y1="150" x2="182" y2="150" stroke="#9b6ad8" strokeWidth="5" strokeDasharray="10 6" />
        <rect x="186" y="100" width="12" height="100" rx="6" fill="#dfe8f3" stroke={AZUL} strokeWidth="2" />
        <path d="M 192 104 v 92" stroke={AZUL} strokeWidth="2" strokeDasharray="2 3" />
        <Texto x={192} y={92} t="fibra de ADN" c={AZUL} s={11} />
        <rect x="330" y="70" width="22" height="160" fill="#2a2a30" />
        <Texto x={341} y={248} t="placa" s={11} />
        <g style={{ transition: 'opacity 0.8s', opacity: i === 1 ? 1 : 0 }} stroke="#9b6ad8" strokeWidth="2.5" strokeDasharray="6 5">
          <line x1="198" y1="150" x2="330" y2="88" /><line x1="198" y1="150" x2="330" y2="212" />
          <line x1="198" y1="150" x2="330" y2="120" /><line x1="198" y1="150" x2="330" y2="180" />
          <line x1="198" y1="150" x2="330" y2="150" />
        </g>
        <g style={{ transition: 'opacity 0.8s', opacity: i === 1 ? 1 : 0 }}><Texto x={262} y={258} t="los átomos desvían los rayos" c="#7b4ab8" s={11} /></g>
      </g>

      {/* la foto */}
      <g style={{ transition: suave, opacity: i >= 2 && i <= 4 ? 1 : 0, transform: i >= 3 ? 'translate(-90px, 0)' : 'none' }}>
        <Patron x={200} y={146} />
        <Texto x={200} y={246} t="Foto 51 · mayo de 1952" s={12} />
        <Texto x={200} y={262} t="(dibujo simplificado)" s={10} peso={500} />
      </g>
      {/* lectura de la foto */}
      <g style={ver(i === 3)}>
        <path d="M 65 101 L 155 191 M 155 101 L 65 191" stroke="#ffd34d" strokeWidth="3" strokeDasharray="6 4" opacity="0.9" />
        <Texto x={300} y={100} t="La X: es una hélice" c="#b07a00" s={12} />
        <Texto x={300} y={134} t="Las rayas: distancia" c="#b07a00" s={12} />
        <Texto x={300} y={150} t="entre vueltas" c="#b07a00" s={12} />
        <Texto x={300} y={184} t="Arriba y abajo: las" c="#b07a00" s={12} />
        <Texto x={300} y={200} t="bases, apiladas" c="#b07a00" s={12} />
      </g>
      {/* de la foto a la hélice */}
      <g style={ver(i === 4, 'none', 'translate(30px, 0)')}>
        <path d="M 196 146 h 60" stroke="#888" strokeWidth="3" markerEnd="url(#f51-fl)" />
        <Helice x={300} y={146} />
        <Texto x={300} y={250} t="dos cadenas en hélice" c={AZUL} s={12} />
      </g>
      {/* la polémica (11°) */}
      <g style={ver(i === 5)}>
        <Patron x={200} y={70} k={0.5} />
        {[{ x: 70, n: 'Franklin', c: '#8a5aa8', s: 'no lo supo' }, { x: 200, n: 'Wilkins', c: TINTA, s: 'enero de 1953' }, { x: 330, n: 'Watson', c: AZUL, s: '«se me abrió la boca»' }].map((p) => (
          <g key={p.n}>
            <circle cx={p.x} cy={160} r="16" fill={p.c} opacity="0.85" />
            <path d={`M ${p.x - 26} 210 q 26 -46 52 0 z`} fill={p.c} opacity="0.85" />
            <Texto x={p.x} y={232} t={p.n} c={p.c} s={13} />
            <Texto x={p.x} y={248} t={p.s} s={10} peso={600} />
          </g>
        ))}
        <path d="M 96 180 h 74" stroke="#888" strokeWidth="2.5" markerEnd="url(#f51-fl)" />
        <path d="M 226 180 h 74" stroke="#888" strokeWidth="2.5" markerEnd="url(#f51-fl)" />
        <Texto x={200} y={284} t="La foto llegó a Watson sin permiso de Franklin" c={ROJO} s={12} />
      </g>
      <defs>
        <marker id="f51-fl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#888" /></marker>
      </defs>
    </svg>
  )
}

/* ── Watson y Crick: de las piezas a la doble hélice ──────────────────── */

const DOBLE = ['piezas', 'triple', 'bases', 'escalera', 'helice', 'copia']
const VERDE = '#3f9a5a'
const BASES = { A: VERDE, T: '#d0453a', G: '#e0a020', C: AZUL } as const
type Base = keyof typeof BASES

/** Par de bases: a la izquierda una, a la derecha su pareja, con sus puentes. */
function Par({ x, y, izq, ancho = 70 }: { x: number; y: number; izq: Base; ancho?: number }) {
  const der: Base = ({ A: 'T', T: 'A', G: 'C', C: 'G' } as const)[izq]
  const puentes = izq === 'G' || izq === 'C' ? 3 : 2
  const m = ancho / 2
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-m} y="-8" width={m - 5} height="16" rx="4" fill={BASES[izq]} />
      <rect x="5" y="-8" width={m - 5} height="16" rx="4" fill={BASES[der]} />
      {Array.from({ length: puentes }, (_, k) => <line key={k} x1="-5" x2="5" y1={-5 + (k * 10) / Math.max(1, puentes - 1)} y2={-5 + (k * 10) / Math.max(1, puentes - 1)} stroke="#555" strokeWidth="1.5" strokeDasharray="2 1.5" />)}
      <text x={-m / 2 - 2} y="4.5" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff">{izq}</text>
      <text x={m / 2 + 2} y="4.5" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff">{der}</text>
    </g>
  )
}

const SECUENCIA: Base[] = ['A', 'G', 'T', 'C', 'C', 'A', 'G', 'T']

export function EscenaDobleHelice({ fase }: { fase: string }) {
  const i = Math.max(0, DOBLE.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`El modelo de la doble hélice: ${fase}`} className="h-full w-full">
      {fondo('#f3f2ee')}

      {/* las piezas del rompecabezas */}
      <g style={ver(i === 0, 'none', 'scale(0.9)')}>
        {[
          { x: 70, t: 'Franklin', s: 'es una hélice', c: '#8a5aa8' },
          { x: 200, t: 'Chargaff', s: 'A = T y G = C', c: '#b07a00' },
          { x: 330, t: 'Donohue', s: 'forma de las bases', c: VERDE },
        ].map((p) => (
          <g key={p.t}>
            <path d={`M ${p.x - 50} 80 h 34 q 0 -14 16 -14 q 16 0 16 14 h 34 v 100 h -100 z`} fill="#fff" stroke={p.c} strokeWidth="3" />
            <Texto x={p.x} y={120} t={p.t} c={p.c} s={14} />
            <Texto x={p.x} y={142} t={p.s} s={11} peso={600} />
          </g>
        ))}
        <Texto x={200} y={226} t="Watson y Crick no hicieron experimentos:" s={12} />
        <Texto x={200} y={244} t="armaron modelos hasta que todo encajó" s={12} />
      </g>

      {/* el intento fallido de 1951 */}
      <g style={ver(i === 1)}>
        <Texto x={200} y={30} t="1951: tres cadenas, con los fosfatos por dentro" s={12} />
        {[0, 1, 2].map((k) => <circle key={k} cx={200} cy={150} r={30 + k * 22} fill="none" stroke="#9aa4ae" strokeWidth="3" />)}
        {Array.from({ length: 8 }, (_, k) => <circle key={k} cx={200 + 14 * Math.cos(k * 0.785)} cy={150 + 14 * Math.sin(k * 0.785)} r="5" fill="#e0a020" />)}
        <path d="M 120 70 L 280 230 M 280 70 L 120 230" stroke={ROJO} strokeWidth="8" strokeLinecap="round" opacity="0.8" />
        <Texto x={200} y={268} t="Franklin les mostró que estaba mal" c={ROJO} s={12} />
      </g>

      {/* los pares de bases */}
      <g style={ver(i === 2)}>
        <Par x={120} y={110} izq="A" ancho={110} />
        <Par x={280} y={110} izq="G" ancho={110} />
        <Texto x={120} y={146} t="A con T: 2 puentes" s={12} />
        <Texto x={280} y={146} t="G con C: 3 puentes" s={12} />
        <Texto x={200} y={220} t="Los dos pares miden lo mismo:" s={12} />
        <Texto x={200} y={238} t="los peldaños quedan parejos" s={12} />
        <Texto x={200} y={268} t="(y por eso A = T y G = C, como vio Chargaff)" c="#b07a00" s={11} />
      </g>

      {/* la escalera */}
      <g style={ver(i === 3)}>
        <rect x="152" y="40" width="10" height="226" rx="5" fill={AZUL} />
        <rect x="238" y="40" width="10" height="226" rx="5" fill="#8fb2e2" />
        {SECUENCIA.map((b, k) => <Par key={k} x={200} y={56 + k * 28} izq={b} />)}
        <Texto x={90} y={150} t="pasamanos:" c={AZUL} s={11} />
        <Texto x={90} y={164} t="azúcar y fosfato" c={AZUL} s={11} />
        <Texto x={316} y={150} t="peldaños:" s={11} />
        <Texto x={316} y={164} t="pares de bases" s={11} />
      </g>

      {/* la hélice */}
      <g style={ver(i === 4, 'none', 'scale(0.8)')}>
        <Helice x={200} y={150} alto={230} ancho={70} vueltas={2} />
        <Texto x={86} y={140} t="dos cadenas" s={12} />
        <Texto x={86} y={156} t="enrolladas" s={12} />
        <Texto x={318} y={140} t="como una escalera" s={12} />
        <Texto x={318} y={156} t="de caracol" s={12} />
      </g>

      {/* cómo se copia: cada cadena vieja con su nueva pareja */}
      <g style={ver(i === 5)}>
        <rect x="66" y="40" width="8" height="196" rx="4" fill={AZUL} />
        <rect x="132" y="40" width="8" height="196" rx="4" fill="none" stroke="#8fb2e2" strokeWidth="2" strokeDasharray="4 3" />
        <rect x="260" y="40" width="8" height="196" rx="4" fill="none" stroke={AZUL} strokeWidth="2" strokeDasharray="4 3" />
        <rect x="326" y="40" width="8" height="196" rx="4" fill="#8fb2e2" />
        {SECUENCIA.slice(0, 7).map((b, k) => {
          const par: Base = ({ A: 'T', T: 'A', G: 'C', C: 'G' } as const)[b]
          const y = 50 + k * 26
          const caja = (x: number, base: Base, nueva: boolean) => (
            <g key={x}>
              <rect x={x} y={y} width="26" height="16" rx="4" fill={BASES[base]} opacity={nueva ? 0.55 : 1} />
              <text x={x + 13} y={y + 12} textAnchor="middle" fontSize="10" fontWeight="900" fill="#fff">{base}</text>
            </g>
          )
          return <g key={k}>{caja(76, b, false)}{caja(104, par, true)}{caja(270, b, true)}{caja(298, par, false)}</g>
        })}
        <Texto x={200} y={130} t="se separan" s={11} />
        <path d="M 176 142 h -22" stroke="#888" strokeWidth="2.5" markerEnd="url(#dh-fl)" /><path d="M 224 142 h 22" stroke="#888" strokeWidth="2.5" markerEnd="url(#dh-fl)" />
        <Texto x={103} y={32} t="vieja + nueva" s={10} />
        <Texto x={297} y={32} t="nueva + vieja" s={10} />
        <Texto x={200} y={262} t="Cada cadena sirve de molde para una nueva" s={12} />
        <Texto x={200} y={280} t="«No ha escapado a nuestra atención…» (Nature, 1953)" c={AZUL} s={10} peso={600} />
      </g>
      <defs>
        <marker id="dh-fl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#888" /></marker>
      </defs>
    </svg>
  )
}
