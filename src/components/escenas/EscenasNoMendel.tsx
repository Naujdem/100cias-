// Escenas vivas del tema 6 del área 2 (Herencia no mendeliana): dominancia incompleta, codominancia, grupos
// sanguíneos, herencia ligada al sexo, genealogías y herencia poligénica.

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean, mover = 'none', quieto = 'none') => ({ transition: suave, opacity: si ? 1 : 0, transform: si ? mover : quieto })
const fondo = (color: string) => <rect x="-1500" y="-1500" width="3400" height="3300" fill={color} style={{ transition: 'fill 0.8s' }} />

const ROJO = '#c8343c'
const ROSA = '#ef9ab0'
const BLANCO = '#fbfaf5'
const AZUL = '#3f6fb8'
const VERDE = '#3f9a5a'
const MOR = '#8a5aa8'
const TINTA = '#3a3a3a'

function Texto({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}

/* ── Dominancia incompleta ────────────────────────────────────────────── */

function Flor({ x, y, color, k = 1, g }: { x: number; y: number; color: string; k?: number; g?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <path d="M 0 14 V 50" stroke={VERDE} strokeWidth="4" />
      <ellipse cx="9" cy="36" rx="9" ry="4" fill={VERDE} transform="rotate(-30 9 36)" />
      {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="0" cy="-12" rx="9" ry="13" fill={color} stroke="#d8c8c8" strokeWidth="1.2" transform={`rotate(${a})`} />)}
      <circle r="6" fill="#f2c94c" />
      {g && <text y="72" textAnchor="middle" fontSize="12" fontWeight="900" fill={TINTA}>{g}</text>}
    </g>
  )
}

const INC = ['padres', 'f1', 'f2', 'no-mezcla']

export function EscenaIncompleta({ fase }: { fase: string }) {
  const i = Math.max(0, INC.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Dominancia incompleta: ${fase}`} className="h-full w-full">
      {fondo('#f2f6ee')}
      <g style={ver(i === 0)}>
        <Flor x={110} y={110} color={ROJO} k={1.5} g="RR" />
        <Texto x={200} y={118} t="×" s={26} />
        <Flor x={290} y={110} color={BLANCO} k={1.5} g="BB" />
        <Texto x={200} y={36} t="Flor roja × flor blanca (dondiego de noche)" s={12} />
      </g>
      <g style={ver(i === 1)}>
        {[80, 160, 240, 320].map((x) => <Flor key={x} x={x} y={120} color={ROSA} k={1.2} g="RB" />)}
        <Texto x={200} y={40} t="Hijos (F1): ¡todos rosados!" c="#c0607a" s={14} />
        <Texto x={200} y={262} t="Ningún alelo domina del todo: se ve un intermedio" s={11} />
      </g>
      <g style={ver(i >= 2)}>
        {[[70, ROJO, 'RR'], [160, ROSA, 'RB'], [240, ROSA, 'RB'], [330, BLANCO, 'BB']].map(([x, c, g]) => <Flor key={x as number} x={x as number} y={120} color={c as string} k={1.2} g={g as string} />)}
        <Texto x={200} y={40} t="Nietos (F2): 1 roja : 2 rosadas : 1 blanca" s={13} />
      </g>
      <g style={ver(i === 3)}>
        <rect x="40" y="226" width="320" height="56" rx="12" fill="#fff" stroke="#d8c8c8" strokeWidth="2" />
        <Texto x={200} y={248} t="¡El blanco vuelve! Los alelos no se mezclaron:" s={11} />
        <Texto x={200} y={266} t="la pintura mezclada nunca vuelve a separarse" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── Codominancia ─────────────────────────────────────────────────────── */

function Vaca({ x, y, tipo }: { x: number; y: number; tipo: 'roja' | 'blanca' | 'ruana' }) {
  const base = tipo === 'roja' ? '#a0442a' : tipo === 'blanca' ? BLANCO : '#c9a49a'
  const id = `vc-${tipo}`
  return (
    <g transform={`translate(${x} ${y})`}>
      {tipo === 'ruana' && (
        <defs>
          <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill={BLANCO} /><rect width="3" height="3" fill="#a0442a" /><rect x="3" y="3" width="3" height="3" fill="#a0442a" />
          </pattern>
        </defs>
      )}
      {[-30, -14, 16, 30].map((lx) => <rect key={lx} x={lx - 4} y="10" width="8" height="30" fill={tipo === 'ruana' ? `url(#${id})` : base} stroke="#8a6a5a" strokeWidth="1.2" />)}
      <ellipse rx="44" ry="24" fill={tipo === 'ruana' ? `url(#${id})` : base} stroke="#8a6a5a" strokeWidth="1.5" />
      <ellipse cx="50" cy="-16" rx="16" ry="13" fill={tipo === 'ruana' ? `url(#${id})` : base} stroke="#8a6a5a" strokeWidth="1.5" />
      <path d="M 42 -28 l -6 -8 M 58 -28 l 6 -8" stroke="#8a6a5a" strokeWidth="2.5" />
      <circle cx="56" cy="-18" r="2" fill={TINTA} />
    </g>
  )
}

const COD = ['padres', 'cria', 'zoom', 'sangre']

export function EscenaCodominancia({ fase }: { fase: string }) {
  const i = Math.max(0, COD.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Codominancia: ${fase}`} className="h-full w-full">
      {fondo('#f4f1ea')}
      <g style={ver(i === 0)}>
        <Vaca x={100} y={130} tipo="roja" /><Texto x={110} y={200} t="pelo rojo" s={12} />
        <Texto x={200} y={136} t="×" s={26} />
        <Vaca x={290} y={130} tipo="blanca" /><Texto x={300} y={200} t="pelo blanco" s={12} />
      </g>
      <g style={ver(i === 1)}>
        <Vaca x={190} y={130} tipo="ruana" />
        <Texto x={200} y={40} t="La cría es «ruana»" s={14} />
        <Texto x={200} y={210} t="No es rosada: tiene pelos rojos Y pelos blancos" s={12} />
      </g>
      <g style={ver(i === 2)}>
        <circle cx="200" cy="140" r="96" fill="#f7efe6" stroke="#8a6a5a" strokeWidth="3" />
        {Array.from({ length: 22 }, (_, k) => {
          const x = 128 + (k % 11) * 14
          const y0 = 90 + Math.floor(k / 11) * 60
          return <g key={k}>{k % 3 === 0 && <path d={`M ${x} ${y0} q 6 20 0 44`} fill="none" stroke="#b9aaa0" strokeWidth="7" strokeLinecap="round" />}<path d={`M ${x} ${y0} q 6 20 0 44`} fill="none" stroke={k % 3 === 0 ? BLANCO : '#a0442a'} strokeWidth="5" strokeLinecap="round" /></g>
        })}
        <Texto x={200} y={262} t="Los dos alelos se expresan completos, cada uno en su pelo" s={11} />
      </g>
      <g style={ver(i === 3)}>
        <circle cx="200" cy="130" r="58" fill={ROJO} opacity="0.85" />
        {[0, 90, 180, 270].map((a) => <polygon key={a} points="0,-8 7,5 -7,5" fill="#f2c94c" transform={`rotate(${a} 200 130) translate(200 66)`} />)}
        {[45, 135, 225, 315].map((a) => <circle key={a} r="6" fill="#7fc3e8" transform={`rotate(${a} 200 130) translate(200 66)`} />)}
        <Texto x={200} y={222} t="También en la sangre: el grupo AB tiene" s={12} />
        <Texto x={200} y={238} t="las marcas A (triángulos) y B (círculos)" s={12} />
      </g>
    </svg>
  )
}

/* ── Grupos sanguíneos ────────────────────────────────────────────────── */

function Globulo({ x, y, a, b, r = 34 }: { x: number; y: number; a: boolean; b: boolean; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={ROJO} opacity="0.85" />
      <circle cx={x} cy={y} r={r * 0.45} fill="#b02a32" />
      {a && [0, 120, 240].map((g) => <polygon key={g} points="0,-7 6,4 -6,4" fill="#f2c94c" transform={`rotate(${g} ${x} ${y}) translate(${x} ${y - r - 4})`} />)}
      {b && [60, 180, 300].map((g) => <circle key={g} r="5" fill="#7fc3e8" transform={`rotate(${g} ${x} ${y}) translate(${x} ${y - r - 4})`} />)}
    </g>
  )
}

const ABO = ['marcas', 'alelos', 'genotipos']
const GRUPOS = [
  { g: 'A', a: true, b: false, gen: 'IᴬIᴬ o Iᴬi' },
  { g: 'B', a: false, b: true, gen: 'IᴮIᴮ o Iᴮi' },
  { g: 'AB', a: true, b: true, gen: 'IᴬIᴮ' },
  { g: 'O', a: false, b: false, gen: 'ii' },
]

export function EscenaAbo({ fase }: { fase: string }) {
  const i = Math.max(0, ABO.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Grupos sanguíneos: ${fase}`} className="h-full w-full">
      {fondo('#f8f0f0')}
      <Texto x={200} y={30} t={['Cuatro grupos según las marcas del glóbulo rojo', 'Tres alelos para un mismo gen', 'Seis genotipos, cuatro grupos'][i]} s={13} />
      {GRUPOS.map((g, k) => {
        const x = 58 + k * 95
        return (
          <g key={g.g}>
            <g style={{ transition: suave, transform: i === 1 ? 'translate(0, -20px) scale(0.85)' : 'none', transformOrigin: `${x}px 110px`, opacity: i === 1 ? 0.35 : 1 }}>
              <Globulo x={x} y={110} a={g.a} b={g.b} />
            </g>
            <Texto x={x} y={176} t={`Grupo ${g.g}`} s={13} />
            <g style={ver(i === 2)}><Texto x={x} y={198} t={g.gen} c={MOR} s={11} /></g>
          </g>
        )
      })}
      <g style={ver(i === 0)} fontSize="11" fontWeight="700">
        <polygon points="96,236 102,246 90,246" fill="#f2c94c" /><text x="110" y="246" fill={TINTA}>marca A</text>
        <circle cx="200" cy="241" r="5" fill="#7fc3e8" /><text x="210" y="246" fill={TINTA}>marca B</text>
        <Texto x={200} y={274} t="El grupo O no tiene ninguna de las dos" s={11} />
      </g>
      <g style={ver(i === 1)}>
        {[['Iᴬ', '#d9a400', 'marca A'], ['Iᴮ', '#3a90c0', 'marca B'], ['i', '#8a8a8a', 'sin marca']].map(([al, c, s], k) => (
          <g key={al}>
            <rect x={70 + k * 100} y="214" width="64" height="34" rx="8" fill={c} />
            <Texto x={102 + k * 100} y={237} t={al} c="#fff" s={16} />
            <Texto x={102 + k * 100} y={266} t={s} s={10} peso={600} />
          </g>
        ))}
        <Texto x={200} y={290} t="Iᴬ e Iᴮ son codominantes; los dos dominan sobre i" c={MOR} s={11} />
      </g>
      <g style={ver(i === 2)}>
        <Texto x={200} y={240} t="Cada persona tiene dos alelos, uno de cada padre" s={11} />
        <Texto x={200} y={258} t="El grupo O solo aparece con ii" s={11} />
      </g>
    </svg>
  )
}

/* ── Herencia ligada al sexo ──────────────────────────────────────────── */

function Persona({ x, y, mujer, color, rotulo, sub }: { x: number; y: number; mujer: boolean; color: string; rotulo: string; sub?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="13" fill="#e8c3a0" />
      {mujer ? <path d={`M ${x - 18} ${y + 52} L ${x} ${y + 14} L ${x + 18} ${y + 52} z`} fill={color} /> : <rect x={x - 14} y={y + 15} width="28" height="38" rx="6" fill={color} />}
      <Texto x={x} y={y + 70} t={rotulo} s={11} />
      {sub && <Texto x={x} y={y + 84} t={sub} s={9} peso={600} />}
    </g>
  )
}
function CromX({ x, y, gen }: { x: number; y: number; gen: 'D' | 'd' }) {
  return (
    <g>
      <rect x={x - 8} y={y} width="16" height="70" rx="8" fill={MOR} />
      <rect x={x - 8} y={y + 20} width="16" height="12" fill={gen === 'D' ? VERDE : ROJO} />
      <Texto x={x} y={y + 30} t={gen} c="#fff" s={10} />
    </g>
  )
}

const LIG = ['cromosomas', 'gen-x', 'padres', 'hijos']

export function EscenaLigada({ fase }: { fase: string }) {
  const i = Math.max(0, LIG.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Herencia ligada al sexo: ${fase}`} className="h-full w-full">
      {fondo('#f3f2ee')}
      <g style={ver(i <= 1)}>
        <Texto x={110} y={36} t="Mujer: XX" s={13} /><Texto x={290} y={36} t="Hombre: XY" s={13} />
        <rect x="82" y="60" width="18" height="120" rx="9" fill={MOR} /><rect x="120" y="60" width="18" height="120" rx="9" fill={MOR} />
        <rect x="262" y="60" width="18" height="120" rx="9" fill={MOR} /><rect x="300" y="60" width="18" height="56" rx="9" fill="#9aa4ae" />
        <g style={ver(i === 1)}>
          {[91, 129, 271].map((x) => <g key={x}><rect x={x - 9} y={92} width="18" height="14" fill={VERDE} /><Texto x={x} y={103} t="D" c="#fff" s={10} /></g>)}
          <Texto x={200} y={214} t="El gen de la visión de colores está en el X;" s={11} />
          <Texto x={200} y={230} t="el Y, más pequeño, no lo tiene" s={11} />
          <Texto x={200} y={256} t="El hombre tiene un solo alelo: si es d, es daltónico" c={ROJO} s={11} />
        </g>
      </g>
      <g style={ver(i >= 2)}>
        <Persona x={130} y={36} mujer color="#c46aa0" rotulo="Madre portadora" sub="XᴰXᵈ (ve bien)" />
        <Texto x={200} y={66} t="×" s={22} />
        <Persona x={270} y={36} mujer={false} color={AZUL} rotulo="Padre" sub="XᴰY (ve bien)" />
      </g>
      <g style={ver(i === 2)}>
        <CromX x={110} y={160} gen="D" /><CromX x={150} y={160} gen="d" />
        <CromX x={260} y={160} gen="D" /><rect x={282} y={160} width="16" height="34" rx="8" fill="#9aa4ae" />
        <Texto x={200} y={256} t="La madre tiene el alelo d, pero el D la protege" s={11} />
      </g>
      <g style={ver(i === 3)}>
        {[
          { x: 55, m: true, c: '#c46aa0', r: 'Hija', s: 'XᴰXᴰ sana' },
          { x: 150, m: true, c: '#c46aa0', r: 'Hija', s: 'XᴰXᵈ portadora' },
          { x: 250, m: false, c: AZUL, r: 'Hijo', s: 'XᴰY sano' },
          { x: 345, m: false, c: ROJO, r: 'Hijo', s: 'XᵈY daltónico' },
        ].map((h) => <Persona key={h.x} x={h.x} y={160} mujer={h.m} color={h.c} rotulo={h.r} sub={h.s} />)}
        <path d="M 200 120 V 140 M 55 140 H 345 M 55 140 v 6 M 150 140 v 6 M 250 140 v 6 M 345 140 v 6" stroke="#888" strokeWidth="2" fill="none" />
      </g>
    </svg>
  )
}

/* ── Genealogías ──────────────────────────────────────────────────────── */

function Simbolo({ x, y, mujer, lleno = 0, op = 1 }: { x: number; y: number; mujer: boolean; lleno?: 0 | 0.5 | 1; op?: number }) {
  const fill = lleno === 1 ? TINTA : '#fff'
  return (
    <g style={{ transition: 'opacity 0.6s', opacity: op }}>
      {mujer ? <circle cx={x} cy={y} r="14" fill={fill} stroke={TINTA} strokeWidth="2.5" /> : <rect x={x - 14} y={y - 14} width="28" height="28" fill={fill} stroke={TINTA} strokeWidth="2.5" />}
      {lleno === 0.5 && (mujer ? <path d={`M ${x} ${y - 14} a 14 14 0 0 1 0 28 z`} fill={TINTA} /> : <rect x={x} y={y - 14} width="14" height="28" fill={TINTA} />)}
    </g>
  )
}

const GEN = ['simbolos', 'familia', 'afectado', 'portadores']

export function EscenaGenealogia({ fase }: { fase: string }) {
  const i = Math.max(0, GEN.indexOf(fase))
  const port = i === 3 ? 0.5 : 0
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Genealogía: ${fase}`} className="h-full w-full">
      {fondo('#f6f4ee')}
      <g style={ver(i === 0)}>
        {[[70, false, 0, 'hombre'], [150, true, 0, 'mujer'], [230, false, 1, 'afectado'], [320, true, 0.5, 'portadora']].map(([x, m, l, t]) => (
          <g key={t as string}><Simbolo x={x as number} y={110} mujer={m as boolean} lleno={l as 0 | 0.5 | 1} /><Texto x={x as number} y={146} t={t as string} s={11} /></g>
        ))}
        <path d="M 110 200 H 190" stroke={TINTA} strokeWidth="2.5" /><Texto x={150} y={224} t="pareja" s={11} />
        <path d="M 270 190 V 214 M 250 214 H 290" stroke={TINTA} strokeWidth="2.5" /><Texto x={270} y={236} t="hijos" s={11} />
        <Texto x={200} y={40} t="Los símbolos de una genealogía" s={13} />
      </g>
      <g style={ver(i >= 1)}>
        <Texto x={24} y={64} t="I" s={13} /><Texto x={24} y={144} t="II" s={13} /><Texto x={24} y={234} t="III" s={13} />
        {/* generación I */}
        <Simbolo x={150} y={60} mujer={false} lleno={port} /><Simbolo x={250} y={60} mujer lleno={0} />
        <path d="M 164 60 H 236 M 200 60 V 100 M 110 100 H 290 M 110 100 V 126 M 200 100 V 126 M 290 100 V 126" stroke={TINTA} strokeWidth="2" fill="none" />
        {/* generación II */}
        <Simbolo x={110} y={140} mujer lleno={port} /><Simbolo x={200} y={140} mujer={false} /><Simbolo x={290} y={140} mujer lleno={0} />
        <Simbolo x={60} y={140} mujer={false} lleno={port} />
        <path d="M 74 140 H 96 M 85 140 V 190 M 40 190 H 130 M 40 190 V 216 M 85 190 V 216 M 130 190 V 216" stroke={TINTA} strokeWidth="2" fill="none" />
        {/* generación III */}
        <Simbolo x={40} y={230} mujer={false} /><Simbolo x={85} y={230} mujer lleno={i >= 2 ? 1 : 0} /><Simbolo x={130} y={230} mujer={false} />
      </g>
      <g style={ver(i === 2)}>
        <circle cx="85" cy="230" r="24" fill="none" stroke={ROJO} strokeWidth="3" strokeDasharray="5 4" />
        <Texto x={280} y={210} t="Nace una niña afectada" c={ROJO} s={12} />
        <Texto x={280} y={226} t="de padres que no lo están:" c={ROJO} s={12} />
        <Texto x={280} y={242} t="el rasgo es recesivo" c={ROJO} s={12} />
      </g>
      <g style={ver(i === 3)}>
        <Texto x={290} y={206} t="Sus padres son portadores (Aa)" s={12} />
        <Texto x={290} y={222} t="y uno de los abuelos también" s={12} />
        <Texto x={290} y={244} t="El alelo «saltó» una generación" c={MOR} s={11} />
      </g>
    </svg>
  )
}

/* ── Muchos genes y el ambiente (11°) ─────────────────────────────────── */

const POLI = ['un-gen', 'dos-genes', 'muchos', 'ambiente']
const TONOS = ['#f3dcc4', '#e6c19c', '#d4a276', '#b98457', '#9a6a42', '#7a5232']
const FILAS = [[1, 2, 1], [1, 4, 6, 4, 1], [1, 3, 8, 16, 26, 32, 26, 16, 8, 3, 1]]

export function EscenaPoligenica({ fase }: { fase: string }) {
  const i = Math.max(0, POLI.indexOf(fase))
  const datos = FILAS[Math.min(i, 2)]
  const max = Math.max(...datos)
  const w = 300 / datos.length
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Herencia poligénica: ${fase}`} className="h-full w-full">
      {fondo('#f3f2ee')}
      <g style={ver(i <= 2)}>
        <Texto x={200} y={34} t={['Un gen con dos alelos: 3 clases', 'Dos genes: 5 clases', 'Muchos genes: una curva de campana'][Math.min(i, 2)]} s={13} />
        <line x1="50" y1="230" x2="350" y2="230" stroke="#888" strokeWidth="2" />
        {datos.map((v, k) => <rect key={`${i}-${k}`} x={50 + k * w + 3} y={230 - (v / max) * 160} width={w - 6} height={(v / max) * 160} rx="3" fill={TONOS[Math.round((k / Math.max(1, datos.length - 1)) * (TONOS.length - 1))]} />)}
        <Texto x={60} y={252} t="más bajo" s={10} peso={600} /><Texto x={340} y={252} t="más alto" s={10} peso={600} />
        <Texto x={200} y={280} t="Estatura, color de piel o de ojos: dependen de muchos genes" s={11} />
      </g>
      <g style={ver(i === 3)}>
        <Texto x={200} y={34} t="El ambiente también cuenta" s={13} />
        {[[110, '#5f87c2', 'suelo ácido'], [290, '#e58fb0', 'suelo alcalino']].map(([x, c, t]) => (
          <g key={t as string}>
            {[[-16, -6], [14, -10], [0, 12], [-10, 14], [16, 12], [0, -18]].map(([dx, dy], k) => <circle key={k} cx={(x as number) + dx} cy={110 + dy} r="13" fill={c as string} opacity="0.85" />)}
            <path d={`M ${x} 130 V 190`} stroke={VERDE} strokeWidth="4" />
            <Texto x={x as number} y={212} t={t as string} s={11} />
          </g>
        ))}
        <Texto x={200} y={248} t="Hortensias con los mismos genes: azules o rosadas según el suelo" s={11} />
        <Texto x={200} y={266} t="Fenotipo = genotipo + ambiente" c={MOR} s={12} />
      </g>
    </svg>
  )
}
