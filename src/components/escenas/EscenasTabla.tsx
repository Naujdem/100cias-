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
