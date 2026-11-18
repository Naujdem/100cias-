// Escenas vivas del área 3, tema 7 (Biodiversidad).

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean, mover = 'none', quieto = 'none') => ({ transition: suave, opacity: si ? 1 : 0, transform: si ? mover : quieto })
const fondo = (color: string) => <rect x="-1500" y="-1500" width="3400" height="3300" fill={color} style={{ transition: 'fill 0.8s' }} />

const VERDE = '#3f9a5a'
const ROJO = '#c43c3c'
const MOR = '#8a5aa8'
const TINTA = '#3a3a3a'

function Texto({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}
function Tarjeta({ x, y, ic, t, s, w = 108 }: { x: number; y: number; ic: string; t: string; s?: string; w?: number }) {
  return (
    <g>
      <rect x={x - w / 2} y={y} width={w} height="104" rx="12" fill="#fff" stroke="#ddd" strokeWidth="2" />
      <text x={x} y={y + 42} textAnchor="middle" fontSize="30">{ic}</text>
      <Texto x={x} y={y + 70} t={t} s={11} />
      {s && <Texto x={x} y={y + 88} t={s} s={9} peso={600} />}
    </g>
  )
}

/* ── Tres niveles de biodiversidad ────────────────────────────────────── */

const NIV = ['genes', 'especies', 'ecosistemas']

export function EscenaBiodiversidadNiveles({ fase }: { fase: string }) {
  const i = Math.max(0, NIV.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Niveles de biodiversidad: ${fase}`} className="h-full w-full">
      {fondo('#f2f5ee')}
      <Texto x={200} y={36} t={['Diversidad genética: distintas variedades de una especie', 'Diversidad de especies: muchos tipos de seres vivos', 'Diversidad de ecosistemas: muchos tipos de lugares'][i]} s={12} />
      <g style={ver(i === 0)}>
        {['#f2c94c', '#c43c3c', '#5a3a8a', '#f4f0e6', '#e08a2e', '#3a2a1a'].map((c, k) => (
          <g key={c} transform={`translate(${60 + k * 56} 150)`}>
            <ellipse rx="16" ry="40" fill="#8ab84a" />
            {Array.from({ length: 12 }, (_, j) => <circle key={j} cx={(j % 2) * 10 - 5} cy={-30 + Math.floor(j / 2) * 11} r="5" fill={c} stroke="#00000022" />)}
          </g>
        ))}
        <Texto x={200} y={230} t="Maíces criollos: la misma especie, muchos colores y sabores" s={11} peso={600} />
      </g>
      <g style={ver(i === 1)}>
        {['🦜', '🐸', '🦋', '🐒', '🌺', '🐢', '🦎', '🍄', '🐟', '🦉', '🐜', '🌴'].map((e, k) => <text key={e} x={60 + (k % 6) * 56} y={110 + Math.floor(k / 6) * 70} textAnchor="middle" fontSize="34">{e}</text>)}
        <Texto x={200} y={256} t="Riqueza de especies: cuántas especies distintas hay" s={11} peso={600} />
      </g>
      <g style={ver(i === 2)}>
        <Tarjeta x={80} y={80} ic="🏔️" t="páramo" /><Tarjeta x={200} y={80} ic="🌳" t="selva" /><Tarjeta x={320} y={80} ic="🌊" t="manglar" />
        <Texto x={200} y={230} t="Cada ecosistema guarda especies y genes propios" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── Colombia megadiversa ─────────────────────────────────────────────── */

const MEGA = ['por-que', 'aves', 'orquideas', 'endemicas']

export function EscenaMegadiversa({ fase }: { fase: string }) {
  const i = Math.max(0, MEGA.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Colombia megadiversa: ${fase}`} className="h-full w-full">
      {fondo('#eef4ee')}
      <g style={ver(i === 0)}>
        <Texto x={200} y={36} t="¿Por qué Colombia tiene tanta vida?" s={13} />
        <Tarjeta x={80} y={80} ic="🌞" t="Trópico" s="calor y luz todo el año" />
        <Tarjeta x={200} y={80} ic="⛰️" t="Tres cordilleras" s="muchos pisos térmicos" />
        <Tarjeta x={320} y={80} ic="🌊" t="Dos océanos" s="Pacífico y Caribe" />
        <Texto x={200} y={230} t="Es uno de los países megadiversos del mundo" c={VERDE} s={12} />
      </g>
      <g style={ver(i === 1)}>
        <text x="200" y="130" textAnchor="middle" fontSize="70">🐦</text>
        <Texto x={200} y={180} t="Más de 1900 especies de aves" c={VERDE} s={18} />
        <Texto x={200} y={204} t="el país con más aves del mundo" s={12} />
      </g>
      <g style={ver(i === 2)}>
        <text x="200" y="130" textAnchor="middle" fontSize="70">🌸</text>
        <Texto x={200} y={180} t="Más de 4000 especies de orquídeas" c={MOR} s={18} />
        <Texto x={200} y={204} t="también el primer lugar del mundo" s={12} />
        <Texto x={200} y={226} t="y entre los primeros en anfibios, mariposas y plantas" s={11} peso={600} />
      </g>
      <g style={ver(i === 3)}>
        <text x="200" y="130" textAnchor="middle" fontSize="70">🐸</text>
        <Texto x={200} y={180} t="Especies endémicas" c={ROJO} s={18} />
        <Texto x={200} y={204} t="solo viven en un lugar del mundo:" s={12} />
        <Texto x={200} y={222} t="si desaparecen de allí, desaparecen para siempre" s={12} />
      </g>
    </svg>
  )
}

/* ── Amenazas ─────────────────────────────────────────────────────────── */

const AME = ['habitat', 'invasoras', 'trafico', 'clima']

export function EscenaAmenazas({ fase }: { fase: string }) {
  const i = Math.max(0, AME.indexOf(fase))
  const datos = [
    ['🪓', 'Pérdida de hábitat', 'deforestación para potreros, cultivos ilícitos, minería'],
    ['🐟', 'Especies invasoras', 'el pez león en el Caribe, el caracol africano'],
    ['🦜', 'Sobreexplotación y tráfico', 'cazar o vender loros, tortugas, monos'],
    ['🌡️', 'Contaminación y cambio climático', 'glaciares que se derriten, ríos contaminados'],
  ]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Amenazas a la biodiversidad: ${fase}`} className="h-full w-full">
      {fondo('#f6f1ec')}
      <Texto x={200} y={36} t="Lo que amenaza la biodiversidad" c={ROJO} s={13} />
      {datos.map(([ic, t, s], k) => (
        <g key={t} style={{ transition: suave, opacity: k <= i ? (k === i ? 1 : 0.45) : 0.1 }}>
          <rect x="30" y={56 + k * 56} width="340" height="48" rx="10" fill="#fff" stroke={k === i ? ROJO : '#ddd'} strokeWidth="2" />
          <text x="56" y={88 + k * 56} textAnchor="middle" fontSize="24">{ic}</text>
          <text x="84" y={78 + k * 56} fontSize="12" fontWeight="900" fill={TINTA}>{t}</text>
          <text x="84" y={94 + k * 56} fontSize="10" fontWeight="600" fill={TINTA}>{s}</text>
        </g>
      ))}
    </svg>
  )
}

/* ── Conservar ────────────────────────────────────────────────────────── */

const CON = ['areas', 'corredores', 'semillas', 'local']

export function EscenaConservar({ fase }: { fase: string }) {
  const i = Math.max(0, CON.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Conservar la biodiversidad: ${fase}`} className="h-full w-full">
      {fondo('#eef4ee')}
      <g style={ver(i === 0)}>
        <Texto x={200} y={36} t="Áreas protegidas" c={VERDE} s={13} />
        <text x="200" y="130" textAnchor="middle" fontSize="64">🏞️</text>
        <Texto x={200} y={176} t="Colombia tiene más de 60 parques nacionales y otras áreas" s={11} />
        <Texto x={200} y={196} t="El primero (1960): Cueva de los Guácharos, en el Huila" c={MOR} s={11} />
      </g>
      <g style={ver(i === 1)}>
        <Texto x={200} y={36} t="Corredores biológicos" c={VERDE} s={13} />
        <circle cx="90" cy="150" r="50" fill="#6aa864" /><circle cx="310" cy="150" r="50" fill="#6aa864" />
        <rect x="136" y="138" width="128" height="24" fill="#8ab878" />
        <text x="200" y="156" textAnchor="middle" fontSize="18">🐆➡️</text>
        <Texto x={200} y={236} t="Franjas de bosque que unen parches para que los animales pasen" s={11} />
      </g>
      <g style={ver(i === 2)}>
        <Texto x={200} y={36} t="Guardar semillas y saberes" c={VERDE} s={13} />
        <text x="200" y="130" textAnchor="middle" fontSize="64">🌽</text>
        <Texto x={200} y={176} t="Bancos de semillas y casas de semillas campesinas" s={11} />
        <Texto x={200} y={194} t="conservan la diversidad genética de los cultivos" s={11} />
      </g>
      <g style={ver(i === 3)}>
        <Texto x={200} y={36} t="Lo que podemos hacer" c={VERDE} s={13} />
        {[['🌱', 'sembrar nativas'], ['🚫', 'no comprar fauna'], ['💧', 'cuidar quebradas'], ['🔍', 'registrar especies']].map(([ic, t], k) => (
          <g key={t}><rect x={22 + k * 92} y="80" width="84" height="100" rx="12" fill="#fff" stroke="#ddd" strokeWidth="2" /><text x={64 + k * 92} y="124" textAnchor="middle" fontSize="28">{ic}</text><Texto x={64 + k * 92} y={160} t={t} s={9} /></g>
        ))}
      </g>
    </svg>
  )
}
