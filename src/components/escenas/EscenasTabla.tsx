// Escenas vivas de Química, área 2, tema 4: la tabla periódica (historia, estructura, metales).

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean, mover = 'none', quieto = 'none') => ({ transition: suave, opacity: si ? 1 : 0, transform: si ? mover : quieto })
const fondo = (color: string) => <rect x="-1500" y="-1500" width="3400" height="3300" fill={color} style={{ transition: 'fill 0.8s' }} />
const idx = (orden: string[], fase: string) => Math.max(0, orden.indexOf(fase))

const TINTA = '#3a3a3a'
const AZUL = '#3f6fb8'
const ROJO = '#c43c3c'
const VERDE = '#4f8a3c'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}
function Ficha({ x, y, s, m, c = '#fff', borde = '#c9d2dc' }: { x: number; y: number; s: string; m?: string; c?: string; borde?: string }) {
  return (
    <g>
      <rect x={x} y={y} width="44" height="44" rx="6" fill={c} stroke={borde} strokeWidth="2" />
      <T x={x + 22} y={y + 24} t={s} s={15} />
      {m && <T x={x + 22} y={y + 38} t={m} s={9} peso={600} />}
    </g>
  )
}

/* ── Historia: tríadas, octavas, Mendeléiev, Moseley ──────────────────── */

const HISTORIA = ['triadas', 'octavas', 'mendeleiev', 'moseley']
const OCTAVA = ['Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Na']

export function EscenaHistoriaTabla({ fase }: { fase: string }) {
  const i = idx(HISTORIA, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Historia de la tabla periódica: ${fase}`} className="h-full w-full">
      {fondo(['#f4efe6', '#eef3f7', '#f1eef6', '#eef4ee'][i])}
      <g style={ver(i === 0)}>
        <T x={200} y={40} t="Döbereiner (1829): tríadas" s={15} />
        <Ficha x={90} y={90} s="Ca" m="40" /><Ficha x={178} y={90} s="Sr" m="88" c="#fff3cf" borde="#d9a520" /><Ficha x={266} y={90} s="Ba" m="137" />
        <T x={200} y={175} t="(40 + 137) ÷ 2 ≈ 88" s={16} c={AZUL} />
        <T x={200} y={210} t="En grupos de tres elementos parecidos," s={12} peso={600} />
        <T x={200} y={228} t="la masa del medio es el promedio de los otros dos" s={12} peso={600} />
      </g>
      <g style={ver(i === 1)}>
        <T x={200} y={40} t="Newlands (1864): octavas" s={15} />
        {OCTAVA.map((s, k) => <Ficha key={s} x={22 + k * 46} y={90} s={s} c={k === 0 || k === 7 ? '#fde3d6' : '#fff'} borde={k === 0 || k === 7 ? ROJO : '#c9d2dc'} />)}
        {['do', 're', 'mi', 'fa', 'sol', 'la', 'si', 'do'].map((n, k) => <T key={k} x={44 + k * 46} y={160} t={n} s={11} c={k === 0 || k === 7 ? ROJO : TINTA} />)}
        <T x={200} y={205} t="Cada ocho elementos se repiten las propiedades," s={12} peso={600} />
        <T x={200} y={223} t="como las notas de la escala musical" s={12} peso={600} />
        <T x={200} y={252} t="(funcionaba solo para los más livianos)" s={11} c={ROJO} />
      </g>
      <g style={ver(i === 2)}>
        <T x={200} y={40} t="Mendeléiev (1869): dejó huecos" s={15} />
        <Ficha x={100} y={70} s="B" /><Ficha x={150} y={70} s="C" />
        <Ficha x={100} y={120} s="Al" /><Ficha x={150} y={120} s="Si" />
        <Ficha x={100} y={170} s="?" c="#fff3cf" borde="#d9a520" /><Ficha x={150} y={170} s="?" c="#fff3cf" borde="#d9a520" />
        <T x={300} y={110} t="«eka-aluminio» →" s={11} />
        <T x={300} y={128} t="galio (1875)" s={13} c={VERDE} />
        <T x={300} y={170} t="«eka-silicio» →" s={11} />
        <T x={300} y={188} t="germanio (1886)" s={13} c={VERDE} />
        <T x={200} y={250} t="Ordenó por masa y por propiedades, y predijo" s={12} peso={600} />
        <T x={200} y={268} t="elementos que aún no se conocían" s={12} peso={600} />
      </g>
      <g style={ver(i === 3)}>
        <T x={200} y={40} t="Moseley (1913): orden por número atómico" s={15} />
        <g style={{ transition: suave, transform: 'translate(0px, 0px)' }}>
          <Ficha x={110} y={90} s="Te" m="Z 52" /><Ficha x={246} y={90} s="I" m="Z 53" />
        </g>
        <T x={200} y={118} t="→" s={22} />
        <T x={132} y={160} t="masa 127,6" s={11} peso={600} /><T x={268} y={160} t="masa 126,9" s={11} peso={600} />
        <T x={200} y={205} t="Por masa, el yodo iría antes que el telurio;" s={12} peso={600} />
        <T x={200} y={223} t="por número de protones, el orden queda bien" s={12} peso={600} />
        <T x={200} y={255} t="Ley periódica: las propiedades se repiten según Z" s={13} c={AZUL} />
      </g>
    </svg>
  )
}

/* ── Estructura: periodos, grupos y configuración ─────────────────────── */

const ESTRUCTURA = ['periodos', 'grupos', 'configuracion']
const FORMA: [number, number][] = [] // [fila, columna] de las casillas de los periodos 1 a 4
for (let c = 1; c <= 18; c++) {
  FORMA.push([4, c])
  if (c <= 2 || c >= 13) { FORMA.push([2, c]); FORMA.push([3, c]) }
}
FORMA.push([1, 1], [1, 18])

export function EscenaEstructuraTabla({ fase }: { fase: string }) {
  const i = idx(ESTRUCTURA, fase)
  const x = (c: number) => 20 + (c - 1) * 20
  const y = (f: number) => 60 + (f - 1) * 26
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Estructura de la tabla: ${fase}`} className="h-full w-full">
      {fondo('#f4f0e8')}
      {FORMA.map(([f, c]) => {
        const marcado = (i === 0 && f === 3) || (i === 1 && c === 1) || (i === 2 && ((f === 3 && c === 1) || (f === 3 && c === 17)))
        return <rect key={`${f}-${c}`} x={x(c)} y={y(f)} width="18" height="24" rx="3" fill={marcado ? (i === 1 ? '#f4a07a' : '#9fc3ec') : '#fff'} stroke="#c9d2dc" style={{ transition: 'fill 0.6s' }} />
      })}
      <g style={ver(i === 0)}>
        <T x={8} y={y(3) + 17} t="3" s={11} c={AZUL} />
        <T x={200} y={200} t="Periodo = fila horizontal (hay 7)" s={14} />
        <T x={200} y={222} t="Los del periodo 3 tienen 3 niveles de electrones" s={12} peso={600} />
      </g>
      <g style={ver(i === 1)}>
        <T x={x(1) + 9} y={50} t="1" s={11} c={ROJO} />
        <T x={200} y={200} t="Grupo = columna (hay 18)" s={14} />
        <T x={200} y={222} t="Los del grupo 1 tienen 1 electrón de valencia:" s={12} peso={600} />
        <T x={200} y={240} t="por eso se parecen (H, Li, Na, K…)" s={12} peso={600} />
      </g>
      <g style={ver(i === 2)}>
        <T x={200} y={200} t="Na: 1s² 2s² 2p⁶ 3s¹ → periodo 3, grupo 1" s={13} c={AZUL} />
        <T x={200} y={222} t="Cl: … 3s² 3p⁵ → periodo 3, grupo 17" s={13} c={AZUL} />
        <T x={200} y={250} t="La configuración dice dónde está el elemento" s={12} peso={600} />
      </g>
    </svg>
  )
}

/* ── Metales, no metales y metaloides ─────────────────────────────────── */

const METALES = ['metal', 'nometal', 'metaloide']

export function EscenaMetales({ fase }: { fase: string }) {
  const i = idx(METALES, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Metales y no metales: ${fase}`} className="h-full w-full">
      {fondo(['#f3eef0', '#eef3f7', '#eef4ee'][i])}
      <g style={ver(i === 0)}>
        <rect x="60" y="70" width="120" height="40" rx="6" fill="#c9ccd1" stroke="#8d939b" strokeWidth="2" />
        <rect x="70" y="76" width="40" height="8" fill="#fff" opacity="0.7" />
        <T x={120} y={135} t="brillo" s={12} />
        <circle cx="285" cy="80" r="14" fill="#f6e08a" stroke="#d9a520" />
        <path d="M 230 105 L 340 105" stroke="#b87333" strokeWidth="6" />
        <T x={285} y={135} t="conduce electricidad y calor" s={12} />
        <path d="M 80 175 Q 120 155 160 175" stroke="#8d939b" strokeWidth="8" fill="none" />
        <T x={120} y={205} t="se dobla y se estira" s={12} />
        <T x={285} y={185} t="sólidos (menos el mercurio)" s={12} />
        <T x={200} y={260} t="Metales: a la izquierda; ceden electrones" s={14} c={ROJO} />
      </g>
      <g style={ver(i === 1)}>
        <T x={110} y={90} t="💨 O₂, N₂, Cl₂" s={16} />
        <T x={110} y={112} t="muchos son gases" s={11} peso={600} />
        <rect x="245" y="70" width="70" height="40" rx="4" fill="#f2d84b" />
        <T x={280} y={95} t="azufre" s={12} />
        <T x={280} y={128} t="opacos y quebradizos" s={11} peso={600} />
        <T x={200} y={180} t="no conducen bien la electricidad" s={13} />
        <T x={200} y={260} t="No metales: a la derecha; ganan o comparten electrones" s={13} c={AZUL} />
      </g>
      <g style={ver(i === 2)}>
        <rect x="150" y="70" width="100" height="60" rx="6" fill="#7d8796" />
        <rect x="160" y="78" width="30" height="10" fill="#fff" opacity="0.5" />
        <T x={200} y={150} t="silicio: brilla como un metal" s={12} />
        <T x={200} y={170} t="pero es quebradizo" s={12} />
        <T x={200} y={205} t="Semiconductores: base de los chips y los paneles solares" s={12} peso={600} />
        <T x={200} y={260} t="Metaloides: en la escalera entre los dos (B, Si, Ge, As…)" s={13} c={VERDE} />
      </g>
    </svg>
  )
}

/* ── Tema 5: propiedades periódicas ───────────────────────────────────── */

const RADIO_F = ['abajo', 'derecha', 'porque']
const GRUPO1: [string, number][] = [['Li', 26], ['Na', 34], ['K', 42]]
const PERIODO3: [string, number][] = [['Na', 34], ['Mg', 29], ['Al', 25], ['Si', 22], ['P', 20], ['S', 19], ['Cl', 18]]

function Atomo({ x, y, r, s, capas = 0, nucleo = 0 }: { x: number; y: number; r: number; s: string; capas?: number; nucleo?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#dfe9f5" stroke={AZUL} strokeWidth="1.5" />
      {Array.from({ length: capas }, (_, k) => <circle key={k} cx={x} cy={y} r={(r * (k + 1)) / (capas + 0.4)} fill="none" stroke="#9bb0c6" strokeDasharray="2 3" />)}
      <circle cx={x} cy={y} r={4 + nucleo} fill={ROJO} />
      <T x={x} y={y + r + 14} t={s} s={11} />
    </g>
  )
}

export function EscenaRadio({ fase }: { fase: string }) {
  const i = idx(RADIO_F, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Radio atómico: ${fase}`} className="h-full w-full">
      {fondo('#eef3f7')}
      <g style={ver(i === 0)}>
        {GRUPO1.map(([s, r], k) => <Atomo key={s} x={70 + k * 110} y={120} r={r} s={s} capas={k + 2} />)}
        <T x={200} y={225} t="Hacia abajo en un grupo: más niveles de electrones" s={13} />
        <T x={200} y={247} t="→ el átomo es más grande" s={13} c={AZUL} />
      </g>
      <g style={ver(i === 1)}>
        {PERIODO3.map(([s, r], k) => <Atomo key={s} x={35 + k * 55} y={120} r={r} s={s} nucleo={k * 0.6} />)}
        <T x={200} y={225} t="Hacia la derecha en un periodo: más protones," s={13} />
        <T x={200} y={247} t="que jalan más fuerte → el átomo se encoge" s={13} c={ROJO} />
      </g>
      <g style={ver(i === 2)}>
        <circle cx="120" cy="120" r="60" fill="#dfe9f5" stroke={AZUL} strokeWidth="2" />
        <circle cx="120" cy="120" r="8" fill={ROJO} />
        <circle cx="180" cy="120" r="6" fill={AZUL} />
        <T x={120} y={205} t="Na: 11 protones" s={12} />
        <circle cx="290" cy="120" r="34" fill="#dfe9f5" stroke={AZUL} strokeWidth="2" />
        <circle cx="290" cy="120" r="12" fill={ROJO} />
        <circle cx="324" cy="120" r="6" fill={AZUL} />
        <path d="M 316 120 L 302 120" stroke={ROJO} strokeWidth="3" />
        <T x={290} y={205} t="Cl: 17 protones" s={12} />
        <T x={200} y={250} t="Mismos niveles, pero el cloro jala más a sus electrones" s={12} peso={600} />
      </g>
    </svg>
  )
}

const ION_F = ['arrancar', 'comparar', 'gases']

export function EscenaIonizacion({ fase }: { fase: string }) {
  const i = idx(ION_F, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Energía de ionización: ${fase}`} className="h-full w-full">
      {fondo('#f4f0e8')}
      <g style={ver(i === 0)}>
        <circle cx="150" cy="140" r="60" fill="#dfe9f5" stroke={AZUL} strokeWidth="2" />
        <circle cx="150" cy="140" r="10" fill={ROJO} />
        <circle cx="290" cy="140" r="7" fill={AZUL} />
        <path d="M 215 140 L 280 140" stroke={ORO2} strokeWidth="4" strokeDasharray="6 4" />
        <T x={248} y={125} t="⚡ energía" s={12} />
        <T x={200} y={235} t="Energía para arrancarle un electrón a un átomo" s={13} />
        <T x={200} y={255} t="(en estado gaseoso): energía de ionización" s={12} peso={600} />
      </g>
      <g style={ver(i === 1)}>
        <rect x="60" y={200 - 50} width="70" height="50" fill="#f6cf7a" />
        <T x={95} y={140} t="496" s={13} /><T x={95} y={220} t="Na" s={14} />
        <rect x="270" y={200 - 126} width="70" height="126" fill="#c43c3c" />
        <T x={305} y={64} t="1251" s={13} /><T x={305} y={220} t="Cl" s={14} />
        <T x={200} y={255} t="El sodio suelta su electrón fácil; al cloro cuesta mucho" s={12} peso={600} />
        <T x={200} y={275} t="(kJ/mol)" s={10} peso={600} />
      </g>
      <g style={ver(i === 2)}>
        {[['He', 2372], ['Ne', 2081], ['Ar', 1521], ['Kr', 1351]].map(([s, v], k) => (
          <g key={s as string}>
            <rect x={60 + k * 75} y={200 - (v as number) / 15} width="50" height={(v as number) / 15} fill="#e3a6e0" />
            <T x={85 + k * 75} y={194 - (v as number) / 15} t={String(v)} s={11} />
            <T x={85 + k * 75} y={220} t={s as string} s={13} />
          </g>
        ))}
        <T x={200} y={255} t="Los gases nobles son los que más cuesta ionizar:" s={12} peso={600} />
        <T x={200} y={273} t="por eso casi no reaccionan" s={12} peso={600} />
      </g>
    </svg>
  )
}
const ORO2 = '#d9a520'

const EN_F = ['cuerda', 'polar', 'escala']

export function EscenaElectronegatividad({ fase }: { fase: string }) {
  const i = idx(EN_F, fase)
  const corr = i === 0 ? 0 : 28
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Electronegatividad: ${fase}`} className="h-full w-full">
      {fondo('#f1eef6')}
      <g style={ver(i < 2)}>
        <circle cx="110" cy="130" r={i === 0 ? 34 : 28} fill="#f2f2f2" stroke={TINTA} strokeWidth="2" style={{ transition: suave }} />
        <T x={110} y={135} t={i === 0 ? 'H' : 'H'} s={16} />
        <circle cx="290" cy="130" r={i === 0 ? 34 : 44} fill="#b6e3a6" stroke={TINTA} strokeWidth="2" style={{ transition: suave }} />
        <T x={290} y={135} t={i === 0 ? 'H' : 'Cl'} s={16} />
        <g style={{ transition: suave, transform: `translate(${corr}px, 0px)` }}>
          <circle cx="195" cy="122" r="6" fill={AZUL} /><circle cx="207" cy="138" r="6" fill={AZUL} />
        </g>
        <T x={200} y={210} t={i === 0 ? 'H–H: iguales, comparten el par por igual' : 'H–Cl: el cloro jala más el par de electrones'} s={13} />
        <g style={ver(i === 1)}>
          <T x={110} y={85} t="δ+" s={15} c={ROJO} /><T x={290} y={75} t="δ−" s={15} c={AZUL} />
          <T x={200} y={235} t="H: 2,2 · Cl: 3,2 → enlace polar" s={12} peso={600} />
        </g>
      </g>
      <g style={ver(i === 2)}>
        <rect x="40" y="110" width="320" height="24" rx="12" fill="url(#en-g)" />
        <defs><linearGradient id="en-g"><stop offset="0" stopColor="#fff4c8" /><stop offset="1" stopColor="#b22234" /></linearGradient></defs>
        {[['Cs', 0.79], ['Na', 0.93], ['H', 2.2], ['C', 2.55], ['O', 3.44], ['F', 3.98]].map(([s, v]) => {
          const x = 40 + (((v as number) - 0.7) / 3.3) * 320
          return <g key={s as string}><line x1={x} y1="104" x2={x} y2="140" stroke={TINTA} /><T x={x} y={98} t={s as string} s={12} /><T x={x} y={156} t={String(v)} s={10} peso={600} /></g>
        })}
        <T x={200} y={210} t="Escala de Pauling: el flúor (3,98) es el más electronegativo" s={12} />
        <T x={200} y={230} t="Los metales alcalinos son los menos" s={12} peso={600} />
      </g>
    </svg>
  )
}

const MET_F = ['tendencia', 'agua']

export function EscenaCaracterMetalico({ fase }: { fase: string }) {
  const i = idx(MET_F, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Carácter metálico: ${fase}`} className="h-full w-full">
      <defs><marker id="cm-f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill={ROJO} /></marker></defs>
      {fondo('#f3eef0')}
      <g style={ver(i === 0)}>
        <rect x="60" y="50" width="280" height="150" fill="url(#cm-g)" stroke="#c9d2dc" />
        <defs><linearGradient id="cm-g" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9fc3ec" /><stop offset="1" stopColor="#f2b8c6" /></linearGradient></defs>
        <line x1="320" y1="70" x2="80" y2="185" stroke={ROJO} strokeWidth="3" markerEnd="url(#cm-f)" />
        <T x={80} y={215} t="Fr, Cs: los más metálicos" s={12} c={ROJO} />
        <T x={320} y={40} t="F, O: los menos" s={12} c={AZUL} />
        <T x={200} y={255} t="Más metálico = suelta electrones con más facilidad" s={13} />
      </g>
      <g style={ver(i === 1)}>
        {[['Li', 1], ['Na', 2], ['K', 3]].map(([s, n], k) => (
          <g key={s as string}>
            <rect x={45 + k * 115} y="110" width="90" height="80" rx="6" fill="#d7ecf8" stroke="#9bb0c6" />
            <rect x={75 + k * 115} y="100" width="30" height="16" fill="#c9ccd1" />
            {Array.from({ length: (n as number) * 3 }, (_, j) => <circle key={j} cx={70 + k * 115 + (j % 5) * 10} cy={130 + Math.floor(j / 5) * 12} r="3" fill="#fff" stroke="#9bb0c6" />)}
            {(n as number) === 3 && <T x={90 + k * 115} y={92} t="🔥" s={18} />}
            <T x={90 + k * 115} y={210} t={s as string} s={14} />
          </g>
        ))}
        <T x={200} y={250} t="Litio, sodio y potasio en agua: cuanto más abajo," s={12} />
        <T x={200} y={268} t="más violenta la reacción" s={12} />
      </g>
    </svg>
  )
}
