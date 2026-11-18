// Escenas vivas del tema 8 del área 2 (Biotecnología).

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean, mover = 'none', quieto = 'none') => ({ transition: suave, opacity: si ? 1 : 0, transform: si ? mover : quieto })
const fondo = (color: string) => <rect x="-1500" y="-1500" width="3400" height="3300" fill={color} style={{ transition: 'fill 0.8s' }} />

const AZUL = '#3f6fb8'
const CELESTE = '#8fb2e2'
const ROJO = '#c43c3c'
const VERDE = '#3f9a5a'
const NARANJA = '#e08a2e'
const MOR = '#8a5aa8'
const TINTA = '#3a3a3a'

function Texto({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}
function Tarjeta({ x, y, ic, t, s, w = 84 }: { x: number; y: number; ic: string; t: string; s?: string; w?: number }) {
  return (
    <g>
      <rect x={x - w / 2} y={y} width={w} height="100" rx="12" fill="#fff" stroke="#ddd" strokeWidth="2" />
      <text x={x} y={y + 40} textAnchor="middle" fontSize="26">{ic}</text>
      <Texto x={x} y={y + 66} t={t} s={10} />
      {s && <Texto x={x} y={y + 82} t={s} s={9} peso={600} />}
    </g>
  )
}

/* ── ¿Qué es la biotecnología? ────────────────────────────────────────── */

const QUE = ['tradicional', 'microbios', 'moderna']

export function EscenaBiotecQue({ fase }: { fase: string }) {
  const i = Math.max(0, QUE.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Qué es la biotecnología: ${fase}`} className="h-full w-full">
      {fondo('#f6f1e8')}
      <g style={ver(i === 0)}>
        <Texto x={200} y={36} t="Hace miles de años ya usábamos seres vivos" s={13} />
        <Tarjeta x={70} y={70} ic="🍞" t="Pan" s="levadura" />
        <Tarjeta x={160} y={70} ic="🥛" t="Yogur y queso" s="bacterias" />
        <Tarjeta x={250} y={70} ic="🌽" t="Chicha" s="fermentación" />
        <Tarjeta x={340} y={70} ic="🐄" t="Cruces" s="razas y semillas" />
        <Texto x={200} y={214} t="Biotecnología: usar seres vivos para obtener productos" c={MOR} s={12} />
      </g>
      <g style={ver(i === 1)}>
        <Texto x={200} y={36} t="La levadura hace subir el pan" s={13} />
        {[[120, 120], [150, 100], [170, 140], [140, 150], [190, 110]].map(([x, y], k) => <ellipse key={k} cx={x} cy={y} rx="12" ry="9" fill="#e8c27a" stroke="#b5891f" strokeWidth="2" />)}
        <Texto x={155} y={190} t="levaduras" c="#9a6a10" s={11} />
        <path d="M 210 128 H 250" stroke="#888" strokeWidth="2.5" />
        {[[280, 100], [300, 130], [320, 105], [290, 150], [330, 145]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="8" fill="none" stroke={AZUL} strokeWidth="2" />)}
        <Texto x={305} y={190} t="gas (CO₂)" c={AZUL} s={11} />
        <Texto x={200} y={236} t="Comen azúcar y sueltan gas: la masa se infla" s={11} peso={600} />
      </g>
      <g style={ver(i === 2)}>
        <Texto x={200} y={36} t="Biotecnología moderna: cambiar el ADN" s={13} />
        <rect x="70" y="110" width="260" height="10" fill={AZUL} /><rect x="70" y="124" width="260" height="10" fill={CELESTE} />
        <rect x="170" y="104" width="60" height="36" rx="4" fill="none" stroke={NARANJA} strokeWidth="3" />
        <Texto x={200} y={96} t="un gen" c={NARANJA} s={11} />
        <Texto x={200} y={182} t="Ingeniería genética: cortar, copiar, pasar" s={12} />
        <Texto x={200} y={200} t="o editar genes a propósito" s={12} />
      </g>
    </svg>
  )
}

/* ── ADN recombinante: insulina en bacterias ──────────────────────────── */

const INS = ['gen', 'cortar', 'plasmido', 'bacteria', 'multiplicar', 'insulina']

function Plasmido({ x, y, r = 34, gen = false }: { x: number; y: number; r?: number; gen?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="none" stroke={MOR} strokeWidth="6" />
      {gen && <path d={`M ${x - r * 0.5} ${y - r * 0.87} A ${r} ${r} 0 0 1 ${x + r * 0.5} ${y - r * 0.87}`} fill="none" stroke={NARANJA} strokeWidth="7" />}
    </g>
  )
}
function Bacteria({ x, y, k = 1, gen = true }: { x: number; y: number; k?: number; gen?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <rect x="-40" y="-20" width="80" height="40" rx="20" fill="#e3efe0" stroke="#7aa070" strokeWidth="2.5" />
      <circle cx="10" cy="0" r="9" fill="none" stroke={MOR} strokeWidth="3" />
      {gen && <path d="M 5.5 -7.8 A 9 9 0 0 1 14.5 -7.8" fill="none" stroke={NARANJA} strokeWidth="3.5" />}
    </g>
  )
}

export function EscenaInsulina({ fase }: { fase: string }) {
  const i = Math.max(0, INS.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`ADN recombinante: ${fase}`} className="h-full w-full">
      {fondo('#f2f5f0')}
      <g style={ver(i <= 1)}>
        <Texto x={200} y={36} t={i === 0 ? 'El gen humano de la insulina' : 'Una enzima de restricción lo corta'} s={13} />
        <rect x="40" y="90" width="320" height="10" fill={AZUL} /><rect x="40" y="104" width="320" height="10" fill={CELESTE} />
        <g style={{ transition: suave, transform: i === 1 ? 'translate(0, 50px)' : 'none' }}>
          <rect x="160" y="86" width="80" height="32" rx="3" fill={NARANJA} opacity="0.9" />
          <Texto x={200} y={107} t="insulina" c="#fff" s={11} />
        </g>
        <g style={ver(i === 1)}><Texto x={150} y={80} t="✂" c={ROJO} s={20} /><Texto x={250} y={80} t="✂" c={ROJO} s={20} /></g>
      </g>
      <g style={ver(i === 2)}>
        <Texto x={200} y={36} t="Se pega en un plásmido (ADN circular de bacteria)" s={12} />
        <Plasmido x={200} y={140} r={60} gen />
        <Texto x={200} y={70} t="gen de la insulina" c={NARANJA} s={11} />
        <Texto x={200} y={232} t="La ligasa lo pega: ADN recombinante" c={MOR} s={12} />
      </g>
      <g style={ver(i === 3)}>
        <Texto x={200} y={36} t="El plásmido entra en una bacteria" s={13} />
        <Bacteria x={200} y={140} k={2} />
      </g>
      <g style={ver(i === 4)}>
        <Texto x={200} y={36} t="Las bacterias se multiplican, y con ellas el gen" s={12} />
        {Array.from({ length: 8 }, (_, k) => <Bacteria key={k} x={70 + (k % 4) * 86} y={110 + Math.floor(k / 4) * 70} k={0.8} />)}
      </g>
      <g style={ver(i === 5)}>
        <rect x="150" y="70" width="100" height="140" rx="14" fill="#eef4f8" stroke="#9aa4ae" strokeWidth="3" />
        <rect x="150" y="120" width="100" height="90" rx="10" fill="#cfe3f6" />
        <Texto x={200} y={170} t="insulina" c={AZUL} s={14} />
        <Texto x={200} y={244} t="Las bacterias fabrican insulina humana para" s={11} />
        <Texto x={200} y={260} t="las personas con diabetes (desde 1982)" s={11} />
      </g>
    </svg>
  )
}

/* ── PCR ──────────────────────────────────────────────────────────────── */

const PCR = ['separar', 'cebadores', 'copiar', 'ciclos']

export function EscenaPcr({ fase }: { fase: string }) {
  const i = Math.max(0, PCR.indexOf(fase))
  const abierto = i >= 0 && i <= 2
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`PCR: ${fase}`} className="h-full w-full">
      {fondo(i === 0 ? '#fbeee8' : i === 1 ? '#eef3fb' : '#f3f2ee')}
      <g style={ver(i <= 2)}>
        <Texto x={200} y={30} t={['1. Calentar (≈ 95 °C): las hebras se separan', '2. Enfriar (≈ 55 °C): se pegan los cebadores', '3. Entibiar (≈ 72 °C): la polimerasa copia'][Math.min(i, 2)]} s={12} />
        <rect x="60" y={abierto ? 100 : 130} width="280" height="10" fill={AZUL} style={{ transition: suave }} />
        <rect x="60" y={abierto ? 190 : 144} width="280" height="10" fill={CELESTE} style={{ transition: suave }} />
        <g style={ver(i >= 1)}>
          <rect x="300" y="113" width="36" height="8" fill={ROJO} /><rect x="64" y="179" width="36" height="8" fill={ROJO} />
        </g>
        <g style={ver(i === 2)}>
          <rect x="120" y="113" width="180" height="8" fill={NARANJA} /><rect x="100" y="179" width="180" height="8" fill={NARANJA} />
          <circle cx="120" cy="117" r="10" fill={VERDE} opacity="0.8" /><circle cx="280" cy="183" r="10" fill={VERDE} opacity="0.8" />
          <Texto x={200} y={240} t="Polimerasa resistente al calor (de bacterias de aguas termales)" s={10} peso={600} />
        </g>
      </g>
      <g style={ver(i === 3)}>
        <Texto x={200} y={30} t="Cada ciclo duplica las copias" s={13} />
        {[1, 2, 4, 8, 16].map((n, k) => (
          <g key={n}>
            <Texto x={40} y={70 + k * 40} t={`${k}`} c={MOR} s={11} />
            {Array.from({ length: n }, (_, j) => <rect key={j} x={60 + j * 20} y={60 + k * 40} width="16" height="10" rx="2" fill={k === 0 ? AZUL : NARANJA} />)}
          </g>
        ))}
        <Texto x={40} y={50} t="ciclo" c={MOR} s={9} />
        <Texto x={200} y={278} t="Tras 30 ciclos: más de 1000 millones de copias" c={ROJO} s={12} />
      </g>
    </svg>
  )
}

/* ── Transgénicos ─────────────────────────────────────────────────────── */

const TRA = ['problema', 'gen-bt', 'planta', 'resultado']

function Mazorca({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <path d="M 0 60 V -10" stroke={VERDE} strokeWidth="5" />
      <path d="M 0 30 q -30 -10 -40 -40 M 0 20 q 30 -10 40 -40" stroke={VERDE} strokeWidth="5" fill="none" />
      <ellipse cx="10" cy="0" rx="10" ry="26" fill="#f2c94c" stroke="#c99a12" strokeWidth="2" />
      <path d="M 2 18 q 8 -30 0 -40" stroke="#7aa070" strokeWidth="5" fill="none" />
    </g>
  )
}
function Oruga({ x, y, viva = true }: { x: number; y: number; viva?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`} style={{ transition: 'opacity 0.6s', opacity: viva ? 1 : 0.35 }}>
      {[0, 10, 20, 30].map((d) => <circle key={d} cx={d} cy="0" r="7" fill={viva ? '#8ab84a' : '#aaa'} />)}
      <circle cx="38" cy="-2" r="7" fill={viva ? '#6a983a' : '#999'} />
    </g>
  )
}

export function EscenaTransgenico({ fase }: { fase: string }) {
  const i = Math.max(0, TRA.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Transgénicos: ${fase}`} className="h-full w-full">
      {fondo('#f2f5ee')}
      <g style={ver(i === 0)}>
        <Mazorca x={200} y={140} k={1.4} />
        <Oruga x={180} y={160} />
        <Texto x={200} y={40} t="Una oruga se come las plantas de maíz" s={13} />
        <Texto x={200} y={260} t="Los agricultores usan insecticidas para controlarla" s={11} peso={600} />
      </g>
      <g style={ver(i === 1)}>
        <Texto x={200} y={40} t="Una bacteria del suelo (Bt) tiene un gen" s={13} />
        <Texto x={200} y={58} t="que fabrica una proteína tóxica para esas orugas" s={12} />
        <rect x="120" y="110" width="160" height="70" rx="35" fill="#e3efe0" stroke="#7aa070" strokeWidth="3" />
        <rect x="170" y="136" width="60" height="18" rx="3" fill={NARANJA} />
        <Texto x={200} y={150} t="gen Bt" c="#fff" s={11} />
      </g>
      <g style={ver(i === 2)}>
        <Texto x={200} y={40} t="Se pasa ese gen al ADN del maíz" s={13} />
        <rect x="120" y="140" width="40" height="18" rx="3" fill={NARANJA} />
        <path d="M 168 148 H 220" stroke="#888" strokeWidth="2.5" />
        <Mazorca x={270} y={130} k={1.2} />
        <Texto x={200} y={250} t="Un organismo con un gen de otra especie es transgénico" c={MOR} s={11} />
      </g>
      <g style={ver(i === 3)}>
        <Mazorca x={200} y={130} k={1.4} />
        <Oruga x={180} y={160} viva={false} />
        <Texto x={200} y={40} t="La oruga que lo come se muere" s={13} />
        <Texto x={200} y={250} t="Se usan menos insecticidas. Pero hay debate:" s={11} peso={600} />
        <Texto x={200} y={266} t="insectos resistentes, semillas patentadas, maíces nativos" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── Editar un gen con CRISPR ─────────────────────────────────────────── */

const EDI = ['guia', 'corta', 'repara', 'terapia']

export function EscenaEdicion({ fase }: { fase: string }) {
  const i = Math.max(0, EDI.indexOf(fase))
  const corte = i >= 1 && i <= 1
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Edición génica: ${fase}`} className="h-full w-full">
      {fondo('#f3f2ee')}
      <g style={ver(i <= 2)}>
        <Texto x={200} y={36} t={['La guía de ARN busca el gen', 'Cas9 corta las dos hebras', 'La célula repara el corte: el gen cambia'][Math.min(i, 2)]} s={13} />
        <g style={{ transition: suave, transform: corte ? 'translate(-10px, 0)' : 'none' }}>
          <rect x="30" y="150" width="170" height="9" fill={AZUL} /><rect x="30" y="163" width="170" height="9" fill={CELESTE} />
        </g>
        <g style={{ transition: suave, transform: corte ? 'translate(10px, 0)' : 'none' }}>
          <rect x="200" y="150" width="170" height="9" fill={AZUL} /><rect x="200" y="163" width="170" height="9" fill={CELESTE} />
        </g>
        <rect x="170" y="146" width="60" height="30" rx="3" fill="none" stroke={i === 2 ? VERDE : ROJO} strokeWidth="3" style={{ transition: 'stroke 0.6s' }} />
        <Texto x={200} y={196} t={i === 2 ? 'gen corregido' : 'gen con la mutación'} c={i === 2 ? VERDE : ROJO} s={11} />
        <g style={ver(i <= 1)}>
          <ellipse cx="200" cy="120" rx="34" ry="22" fill={VERDE} opacity="0.85" />
          <Texto x={200} y={124} t="Cas9" c="#fff" s={12} />
          <rect x="176" y="94" width="48" height="7" rx="3" fill="#e0a020" />
          <Texto x={268} y={98} t="guía" c="#b07a00" s={11} />
        </g>
      </g>
      <g style={ver(i === 3)}>
        <Texto x={200} y={60} t="Primeras terapias aprobadas (2023):" s={13} />
        <Texto x={200} y={80} t="anemia falciforme y talasemia" s={13} />
        <ellipse cx="120" cy="160" rx="44" ry="32" fill={ROJO} /><path d="M 236 140 q 50 -20 96 24 q -36 -8 -78 24 q -8 -26 -18 -48 z" fill="#d88" opacity="0.6" />
        <path d="M 300 120 L 340 200 M 340 120 L 300 200" stroke={TINTA} strokeWidth="4" opacity="0.6" />
        <Texto x={200} y={240} t="Se editan células de la médula del propio paciente" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── El debate ────────────────────────────────────────────────────────── */

const DEB = ['balanza', 'beneficios', 'preocupaciones', 'decidir']

export function EscenaDebate({ fase }: { fase: string }) {
  const i = Math.max(0, DEB.indexOf(fase))
  const giro = i === 1 ? 8 : i === 2 ? -8 : 0
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Debate sobre la biotecnología: ${fase}`} className="h-full w-full">
      {fondo('#f4f1ea')}
      <path d="M 200 70 V 230 M 160 230 H 240" stroke={TINTA} strokeWidth="5" />
      <g style={{ transition: suave, transform: `rotate(${giro}deg)`, transformOrigin: '200px 80px' }}>
        <rect x="70" y="76" width="260" height="8" rx="4" fill={TINTA} />
        <path d="M 100 84 L 70 140 H 130 Z" fill="none" stroke="#888" strokeWidth="2" /><ellipse cx="100" cy="142" rx="34" ry="8" fill={VERDE} />
        <path d="M 300 84 L 270 140 H 330 Z" fill="none" stroke="#888" strokeWidth="2" /><ellipse cx="300" cy="142" rx="34" ry="8" fill={ROJO} />
      </g>
      <Texto x={100} y={176} t="beneficios" c={VERDE} s={12} /><Texto x={300} y={176} t="preocupaciones" c={ROJO} s={12} />
      <g style={ver(i === 0)}><Texto x={200} y={40} t="La biotecnología trae beneficios y preguntas" s={13} /></g>
      <g style={ver(i === 1)}>
        <Texto x={200} y={30} t="Medicinas (insulina, vacunas), diagnóstico (PCR)," c={VERDE} s={11} />
        <Texto x={200} y={46} t="cultivos que resisten plagas, menos insecticida" c={VERDE} s={11} />
      </g>
      <g style={ver(i === 2)}>
        <Texto x={200} y={30} t="Efectos en el ambiente, semillas patentadas, maíces" c={ROJO} s={11} />
        <Texto x={200} y={46} t="nativos, editar embriones humanos" c={ROJO} s={11} />
      </g>
      <g style={ver(i === 3)}>
        <Texto x={200} y={262} t="Decidir con evidencia, escuchando a quienes se ven afectados:" s={11} />
        <Texto x={200} y={278} t="científicos, agricultores, comunidades y pacientes" c={MOR} s={11} />
      </g>
    </svg>
  )
}
