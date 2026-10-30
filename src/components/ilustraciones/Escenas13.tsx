import { Ameba, Bola, Flecha, Lienzo, Paso, T, TINTA, rad } from './Dibujo.tsx'

// Ilustraciones esquemáticas (no a escala) para las láminas del subtema 1.3.

/** Una célula hace todo: alimento, energía, respuesta y división. */
export function UniFunciones() {
  return (
    <Lienzo etiqueta="Una ameba que atrapa alimento, produce energía con sus mitocondrias, se acerca a la luz y está lista para dividirse">
      <Ameba cx={205} cy={150} rx={95} ry={68} />
      <Bola x={215} y={140} r={24} fill="#c9a0dc" stroke="#7a4a8a" />
      <Bola x={215} y={140} r={7} fill="#8b5ea0" stroke="#5a3a6a" w={1.5} />
      {[[165, 185], [250, 185], [160, 120]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="14" ry="7" transform={`rotate(${i * 30 - 20} ${x} ${y})`} fill="#fbd9a8" stroke="#b3661f" strokeWidth="2" />
      ))}
      {/* 1 alimento */}
      <Bola x={52} y={112} r={11} fill="#cfe8c4" stroke="#4f8a43" />
      <Flecha x1={68} y1={118} x2={118} y2={135} />
      <Paso x={52} y={78} n={1} />
      <T x={52} y={150} s={11} b>Se alimenta</T>
      {/* 2 energía */}
      <Flecha x1={180} y1={240} x2={168} y2={196} />
      <Paso x={182} y={254} n={2} />
      <T x={182} y={284} s={11} b>Produce energía</T>
      {/* 3 respuesta */}
      <g>
        <circle cx="352" cy="50" r="17" fill="#ffe27a" stroke="#c9a227" strokeWidth="2" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <line key={a} x1={352 + 22 * Math.cos(rad(a))} y1={50 + 22 * Math.sin(rad(a))} x2={352 + 29 * Math.cos(rad(a))} y2={50 + 29 * Math.sin(rad(a))} stroke="#c9a227" strokeWidth="2.5" strokeLinecap="round" />
        ))}
      </g>
      <Flecha x1={322} y1={92} x2={285} y2={115} dash="5 4" />
      <Paso x={366} y={96} n={3} />
      <T x={352} y={125} s={11} b>Responde</T>
      <T x={352} y={138} s={10}>a la luz</T>
      {/* 4 reproducción */}
      <g transform="translate(335 205)">
        <Bola x={-14} y={0} r={13} fill="#f8d9d4" stroke="#b05a5a" />
        <Bola x={14} y={0} r={13} fill="#f8d9d4" stroke="#b05a5a" />
      </g>
      <Paso x={366} y={188} n={4} />
      <T x={335} y={240} s={11} b>Se reproduce</T>
      <T x={335} y={253} s={10}>dividiéndose</T>
    </Lienzo>
  )
}

/** Sin núcleo (procariota) frente a con núcleo (eucariota). */
export function UniNucleo() {
  return (
    <Lienzo etiqueta="A la izquierda una bacteria con su ADN suelto y sin núcleo; a la derecha una ameba con su ADN dentro de un núcleo">
      <T x={100} y={28} s={14} b>Sin núcleo</T>
      <T x={100} y={44} s={11}>(procariota)</T>
      <T x={300} y={28} s={14} b>Con núcleo</T>
      <T x={300} y={44} s={11}>(eucariota)</T>
      <line x1="200" y1="20" x2="200" y2="270" stroke="#c9bfa8" strokeWidth="2" strokeDasharray="5 5" />
      {/* bacteria */}
      <rect x="45" y="100" width="110" height="64" rx="32" fill="#cfe8c4" stroke="#4f8a43" strokeWidth="3" />
      <path d="M 72 132 q 8 -22 18 -2 t 18 0 t 18 0 q 6 14 -4 20 q -14 6 -26 -6 q -14 -10 -26 -12" fill="none" stroke="#7a4a8a" strokeWidth="3" strokeLinecap="round" />
      {[[62, 120], [138, 148], [128, 112], [70, 152]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill="#b3661f" />
      ))}
      <Flecha x1={100} y1={218} x2={100} y2={170} />
      <T x={100} y={236} s={12} b>El ADN anda suelto</T>
      <T x={100} y={251} s={11}>por la célula</T>
      {/* ameba */}
      <Ameba cx={300} cy={135} rx={80} ry={55} />
      <circle cx="305" cy="130" r="26" fill="#e6d3f0" stroke="#7a4a8a" strokeWidth="3" />
      <path d="M 292 132 q 6 -14 12 0 t 12 0 q 2 10 -8 12 q -10 2 -16 -12" fill="none" stroke="#7a4a8a" strokeWidth="2.5" strokeLinecap="round" />
      {[[262, 150], [338, 158]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="11" ry="6" fill="#fbd9a8" stroke="#b3661f" strokeWidth="2" />
      ))}
      <Flecha x1={300} y1={218} x2={303} y2={162} />
      <T x={300} y={236} s={12} b>El ADN está dentro</T>
      <T x={300} y={251} s={11}>de un núcleo con membrana</T>
    </Lienzo>
  )
}

/** A simple vista frente a con microscopio, y la bacteria gigante. */
export function UniInvisible() {
  const celulas = [
    [88, 82, 'A'], [118, 70, 'B'], [132, 104, 'C'], [92, 116, 'A'], [64, 96, 'B'],
  ] as const
  const color = { A: ['#f8d9d4', '#b05a5a'], B: ['#cfe8c4', '#4f8a43'], C: ['#dce9f7', '#3b6fb6'] } as const
  return (
    <Lienzo etiqueta="A simple vista no se ve nada en una gota; con microscopio aparecen muchos unicelulares. Una bacteria gigante, Thiomargarita, mide más de un centímetro y sí se ve a simple vista">
      <T x={100} y={22} s={13} b>A simple vista</T>
      <circle cx="100" cy="85" r="46" fill="#fff" stroke={TINTA} strokeWidth="3" />
      <circle cx="90" cy="75" r="1.4" fill="#9a8a6a" />
      <circle cx="116" cy="96" r="1.2" fill="#9a8a6a" />
      <T x={100} y={148} s={11}>una gota: parece vacía</T>
      <T x={300} y={22} s={13} b>Con microscopio</T>
      <g transform="translate(205 0)">
        <circle cx="95" cy="90" r="46" fill="#eaf3fb" stroke={TINTA} strokeWidth="3" />
        {celulas.map(([x, y, t], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="11" fill={color[t][0]} stroke={color[t][1]} strokeWidth="2" />
            <circle cx={x + 2} cy={y - 1} r="4" fill="#c9a0dc" stroke="#7a4a8a" strokeWidth="1" />
          </g>
        ))}
      </g>
      <Flecha x1={160} y1={88} x2={250} y2={88} />
      <T x={300} y={156} s={11}>¡un mundo de unicelulares!</T>
      {/* regla */}
      <line x1="30" y1="190" x2="370" y2="190" stroke="#c9bfa8" strokeWidth="2" />
      <T x={200} y={212} s={13} b>Excepción: Thiomargarita magnifica</T>
      <rect x="50" y="228" width="190" height="22" rx="11" fill="#fbeedd" stroke="#b3661f" strokeWidth="2.5" />
      {[80, 110, 140, 170, 200].map((x) => (
        <line key={x} x1={x} y1="232" x2={x} y2="246" stroke="#b3661f" strokeWidth="1.5" opacity="0.5" />
      ))}
      <g stroke={TINTA} strokeWidth="2">
        <line x1="50" y1="262" x2="240" y2="262" />
        <line x1="50" y1="256" x2="50" y2="268" />
        <line x1="240" y1="256" x2="240" y2="268" />
      </g>
      <T x={200} y={284} s={11}>más de 1 cm: ¡una sola célula que se ve a simple vista!</T>
    </Lienzo>
  )
}

/** Una bacteria se divide en dos. */
export function UniFision() {
  const bacteria = (x: number, y: number, w: number, k = 0) => (
    <g>
      <rect x={x - w / 2} y={y - 24} width={w} height="48" rx="24" fill="#cfe8c4" stroke="#4f8a43" strokeWidth="3" />
      {k === 0 && <path d={`M ${x - 14} ${y} q 7 -14 14 0 t 14 0`} fill="none" stroke="#7a4a8a" strokeWidth="3" strokeLinecap="round" />}
      {k === 1 && (
        <>
          <path d={`M ${x - w / 2 + 16} ${y} q 6 -12 12 0 t 12 0`} fill="none" stroke="#7a4a8a" strokeWidth="3" strokeLinecap="round" />
          <path d={`M ${x + w / 2 - 52} ${y} q 6 -12 12 0 t 12 0`} fill="none" stroke="#7a4a8a" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
    </g>
  )
  return (
    <Lienzo etiqueta="Una bacteria copia su ADN, se alarga, se pincha por el medio y se divide en dos bacterias iguales">
      <Paso x={34} y={52} n={1} />
      {bacteria(100, 52, 110, 0)}
      <T x={100} y={102} s={11} b>Se copia el ADN</T>
      <Flecha x1={190} y1={52} x2={236} y2={52} />
      <Paso x={34} y={150} n={2} />
      {bacteria(100, 150, 160, 1)}
      <T x={100} y={200} s={11} b>Se alarga</T>
      <Flecha x1={190} y1={150} x2={236} y2={150} />
      <Paso x={250} y={52} n={3} />
      <g>
        <rect x="270" y="26" width="86" height="48" rx="24" fill="#cfe8c4" stroke="#4f8a43" strokeWidth="3" />
        <line x1="313" y1="30" x2="313" y2="70" stroke="#4f8a43" strokeWidth="3" />
        <path d="M 288 50 q 5 -10 10 0 t 10 0 M 318 50 q 5 -10 10 0 t 10 0" fill="none" stroke="#7a4a8a" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <T x={313} y={100} s={11} b>Se forma una pared</T>
      <Flecha x1={313} y1={112} x2={313} y2={134} />
      <Paso x={250} y={168} n={4} />
      <rect x="268" y="150" width="40" height="40" rx="20" fill="#cfe8c4" stroke="#4f8a43" strokeWidth="3" />
      <rect x="326" y="150" width="40" height="40" rx="20" fill="#cfe8c4" stroke="#4f8a43" strokeWidth="3" />
      <path d="M 280 170 q 4 -8 8 0 t 8 0 M 338 170 q 4 -8 8 0 t 8 0" fill="none" stroke="#7a4a8a" strokeWidth="2" strokeLinecap="round" />
      <T x={317} y={216} s={12} b>Dos células hijas</T>
      <T x={317} y={231} s={11}>cada una, un ser nuevo</T>
      <rect x="40" y="244" width="320" height="38" rx="12" fill="#fff" stroke="#c9bfa8" strokeWidth="2" />
      <T x={200} y={268} s={12} b>Toda célula viene de otra célula</T>
    </Lienzo>
  )
}

/** Del cigoto a muchas células. */
export function PluriCigoto() {
  const c = (x: number, y: number, r: number) => <Bola key={`${x}-${y}`} x={x} y={y} r={r} fill="#f8d9d4" stroke="#b05a5a" w={2.5} />
  return (
    <Lienzo etiqueta="Un cigoto se divide en 2, luego en 4, luego en 8 células y sigue dividiéndose hasta formar un organismo con billones de células">
      {c(45, 120, 24)}
      <circle cx="47" cy="118" r="8" fill="#c9a0dc" stroke="#7a4a8a" strokeWidth="1.5" />
      <T x={45} y={168} s={12} b>1</T>
      <T x={45} y={183} s={10}>cigoto</T>
      <Flecha x1={78} y1={120} x2={98} y2={120} />
      {[[122, 120], [152, 120]].map(([x, y]) => c(x, y, 16))}
      <T x={137} y={168} s={12} b>2</T>
      <Flecha x1={178} y1={120} x2={198} y2={120} />
      {[[222, 105], [252, 105], [222, 135], [252, 135]].map(([x, y]) => c(x, y, 14))}
      <T x={237} y={168} s={12} b>4</T>
      <Flecha x1={278} y1={120} x2={298} y2={120} />
      {[[314, 100], [336, 100], [358, 100], [325, 120], [347, 120], [314, 140], [336, 140], [358, 140]].map(([x, y]) => c(x, y, 11))}
      <T x={335} y={168} s={12} b>8</T>
      <Flecha x1={200} y1={198} x2={200} y2={222} dash="5 4" />
      <rect x="60" y="226" width="280" height="50" rx="14" fill="#fff" stroke="#c9bfa8" strokeWidth="2" />
      <T x={200} y={248} s={13} b>…y siguen dividiéndose</T>
      <T x={200} y={264} s={11}>hasta formar un organismo con billones de células</T>
      <T x={200} y={52} s={14} b>Todas vienen de una sola célula</T>
    </Lienzo>
  )
}

/** Células unidas que se comunican. */
export function PluriSenales() {
  const cel = [
    [120, 95], [180, 85], [235, 115], [160, 150], [105, 160], [215, 175],
  ]
  return (
    <Lienzo etiqueta="Seis células pegadas entre sí que se mandan señales químicas">
      <T x={200} y={30} s={14} b>Células unidas y conectadas</T>
      {cel.map(([x, y], i) => (
        <g key={i}>
          <Bola x={x} y={y} r={29} fill={['#f8d9d4', '#cfe8c4', '#dce9f7'][i % 3]} stroke={['#b05a5a', '#4f8a43', '#3b6fb6'][i % 3]} w={3} />
          <Bola x={x + 3} y={y - 2} r={8} fill="#c9a0dc" stroke="#7a4a8a" w={1.5} />
        </g>
      ))}
      <Flecha x1={140} y1={92} x2={162} y2={86} c="#c9402f" w={2.5} dash="4 3" />
      <Flecha x1={198} y1={92} x2={214} y2={104} c="#c9402f" w={2.5} dash="4 3" />
      <Flecha x1={190} y1={130} x2={176} y2={142} c="#c9402f" w={2.5} dash="4 3" />
      <Flecha x1={140} y1={148} x2={124} y2={152} c="#c9402f" w={2.5} dash="4 3" />
      <g>
        <line x1="290" y1="90" x2="322" y2="90" stroke={TINTA} strokeWidth="3" />
        <T x={330} y={94} s={11} a="start">se pegan</T>
        <Flecha x1={290} y1={125} x2={322} y2={125} c="#c9402f" w={2.5} dash="4 3" />
        <T x={330} y={122} s={11} a="start">se mandan</T>
        <T x={330} y={136} s={11} a="start">señales</T>
      </g>
      <T x={200} y={250} s={12} b>Pegadas y comunicadas, funcionan como un conjunto</T>
    </Lienzo>
  )
}

/** Cinco células especializadas, cada una con su forma y su oficio. */
export function DivOficios() {
  return (
    <Lienzo etiqueta="Cinco células especializadas: muscular alargada, neurona con ramas, glóbulo rojo en forma de disco, célula de hoja con cloroplastos y pelo de raíz">
      {/* muscular */}
      <g transform="translate(70 60)">
        <path d="M -52 0 Q -30 -20 0 -20 Q 30 -20 52 0 Q 30 20 0 20 Q -30 20 -52 0 Z" fill="#f4c6c0" stroke="#b05a5a" strokeWidth="3" />
        {[-30, -15, 0, 15, 30].map((x) => (
          <line key={x} x1={x} y1="-14" x2={x} y2="14" stroke="#b05a5a" strokeWidth="2" opacity="0.6" />
        ))}
        <T x={0} y={44} s={12} b>Muscular</T>
        <T x={0} y={58} s={11}>se contrae</T>
      </g>
      {/* neurona */}
      <g transform="translate(200 60)">
        <Bola x={-12} y={-4} r={14} fill="#dce9f7" stroke="#3b6fb6" w={3} />
        <g stroke="#3b6fb6" strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M -24 -12 l -18 -14 M -24 -4 l -22 2 M -20 6 l -14 18 M -8 -16 l -2 -18" />
          <path d="M 2 -4 L 56 8" />
        </g>
        <T x={0} y={44} s={12} b>Nerviosa</T>
        <T x={0} y={58} s={11}>transmite señales</T>
      </g>
      {/* glóbulo rojo */}
      <g transform="translate(330 60)">
        <ellipse cx="0" cy="0" rx="28" ry="26" fill="#e06a5a" stroke="#9a2f22" strokeWidth="3" />
        <ellipse cx="0" cy="0" rx="12" ry="11" fill="#c9402f" opacity="0.7" />
        <T x={0} y={44} s={12} b>Glóbulo rojo</T>
        <T x={0} y={58} s={11}>lleva oxígeno</T>
      </g>
      {/* hoja */}
      <g transform="translate(115 190)">
        <rect x="-45" y="-28" width="90" height="56" rx="8" fill="#e5f3d8" stroke="#4f8a43" strokeWidth="3" />
        {[[-26, -8], [4, -14], [28, 4], [-8, 12], [18, 16]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="9" ry="5" fill="#5fa84f" stroke="#2f6a24" strokeWidth="1.5" />
        ))}
        <T x={0} y={50} s={12} b>De la hoja</T>
        <T x={0} y={64} s={11}>hace fotosíntesis</T>
      </g>
      {/* raíz */}
      <g transform="translate(285 190)">
        <rect x="-30" y="-30" width="60" height="30" rx="6" fill="#f3e3c8" stroke="#8a6a3a" strokeWidth="3" />
        <path d="M -8 0 L -8 40 Q -8 46 0 46 Q 8 46 8 40 L 8 0 Z" fill="#f3e3c8" stroke="#8a6a3a" strokeWidth="3" />
        <T x={0} y={66} s={12} b>De la raíz</T>
        <T x={0} y={80} s={11}>absorbe agua</T>
      </g>
    </Lienzo>
  )
}

/** Mismo ADN, pero cada célula usa una parte. */
export function DivMismoAdn() {
  const genes = ['#e06a5a', '#f2b84b', '#6fb06a', '#5b8fd1', '#9a6fc6', '#e08fb0']
  const barra = (x: number, y: number, usados: number[], etiqueta: string) => (
    <g>
      {genes.map((g, i) => (
        <rect key={i} x={x + i * 22} y={y} width="20" height="14" rx="3" fill={usados.includes(i) ? g : '#e4ddcc'} stroke={usados.includes(i) ? TINTA : '#c9bfa8'} strokeWidth="1.5" />
      ))}
      <T x={x + 66} y={y + 26} s={10}>{etiqueta}</T>
    </g>
  )
  return (
    <Lienzo etiqueta="Una célula con su ADN completo, representado por seis tramos de colores. Una neurona usa algunos tramos y un glóbulo rojo usa otros">
      <T x={200} y={26} s={14} b>El mismo ADN en todas</T>
      <Bola x={200} y={78} r={34} fill="#f8d9d4" stroke="#b05a5a" w={3} />
      {genes.map((g, i) => (
        <rect key={i} x={170 + i * 10} y={72} width="9" height="12" rx="2" fill={g} stroke={TINTA} strokeWidth="1" />
      ))}
      <T x={248} y={84} s={11} a="start">ADN completo</T>
      <Flecha x1={168} y1={118} x2={108} y2={148} />
      <Flecha x1={232} y1={118} x2={292} y2={148} />
      <g transform="translate(0 0)">
        <Bola x={100} y={178} r={24} fill="#dce9f7" stroke="#3b6fb6" w={3} />
        <path d="M 82 172 l -16 -10 M 82 184 l -18 4 M 122 172 l 28 6" stroke="#3b6fb6" strokeWidth="3" strokeLinecap="round" />
        {barra(34, 214, [1, 2], 'usa solo estos tramos')}
        <T x={100} y={268} s={13} b>Neurona</T>
      </g>
      <g>
        <ellipse cx="300" cy="178" rx="26" ry="24" fill="#e06a5a" stroke="#9a2f22" strokeWidth="3" />
        <ellipse cx="300" cy="178" rx="10" ry="9" fill="#c9402f" opacity="0.7" />
        {barra(234, 214, [4], 'usa solo este tramo')}
        <T x={300} y={268} s={13} b>Glóbulo rojo</T>
      </g>
    </Lienzo>
  )
}

/** Sin transporte (una bacteria en el agua) y con transporte (vasos en un tejido). */
export function VenTransporte() {
  const celdas = [] as [number, number][]
  for (let f = 0; f < 4; f++) for (let c = 0; c < 4; c++) celdas.push([240 + c * 42, 62 + f * 42])
  return (
    <Lienzo etiqueta="A la izquierda, una bacteria que intercambia sustancias directamente con el agua. A la derecha, células de un cuerpo grande que reciben sustancias por vasos que pasan entre ellas">
      <T x={100} y={26} s={13} b>Unicelular</T>
      <T x={300} y={26} s={13} b>Pluricelular grande</T>
      <line x1="200" y1="14" x2="200" y2="250" stroke="#c9bfa8" strokeWidth="2" strokeDasharray="5 5" />
      <circle cx="100" cy="125" r="78" fill="#dff0fb" stroke="#9cc3dd" strokeWidth="2" strokeDasharray="6 4" />
      <rect x="60" y="102" width="80" height="46" rx="23" fill="#cfe8c4" stroke="#4f8a43" strokeWidth="3" />
      {[[100, 60, 100, 98], [34, 125, 56, 125], [166, 125, 144, 125], [100, 190, 100, 152]].map(([a, b, c, d], i) => (
        <Flecha key={i} x1={a} y1={b} x2={c} y2={d} c="#3b6fb6" w={2.5} />
      ))}
      <T x={100} y={225} s={11} b>Intercambia directo</T>
      <T x={100} y={240} s={11}>con el agua que la rodea</T>
      {celdas.map(([x, y], i) => (
        <rect key={i} x={x - 15} y={y - 15} width="30" height="30" rx="8" fill={i % 2 ? '#f8d9d4' : '#f4c6c0'} stroke="#b05a5a" strokeWidth="2" />
      ))}
      <g stroke="#c9402f" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.9">
        <path d="M 212 125 L 372 125" />
        <path d="M 261 44 L 261 230" />
        <path d="M 345 44 L 345 230" />
      </g>
      <T x={300} y={262} s={11} b>Necesita vasos que repartan</T>
      <T x={300} y={277} s={11}>el oxígeno hasta el interior</T>
    </Lienzo>
  )
}

/** Dos formas de empezar: se quedan juntas / se juntan. */
export function OriDosFormas() {
  const c = (x: number, y: number, r = 13, t = 0) => (
    <Bola key={`${x}-${y}`} x={x} y={y} r={r} fill={['#f8d9d4', '#cfe8c4', '#dce9f7'][t]} stroke={['#b05a5a', '#4f8a43', '#3b6fb6'][t]} w={2.5} />
  )
  return (
    <Lienzo etiqueta="A la izquierda, una célula se divide y las hijas quedan pegadas formando un grupo. A la derecha, células que vivían solas se acercan y forman un grupo">
      <T x={100} y={26} s={13} b>Se quedan juntas</T>
      <T x={300} y={26} s={13} b>Se juntan</T>
      <line x1="200" y1="14" x2="200" y2="262" stroke="#c9bfa8" strokeWidth="2" strokeDasharray="5 5" />
      {c(60, 80, 16)}
      <Flecha x1={90} y1={80} x2={110} y2={80} />
      {c(126, 80)}
      {c(152, 80)}
      <T x={100} y={112} s={10}>1 se divide…</T>
      <Flecha x1={100} y1={124} x2={100} y2={146} />
      {[[78, 175], [104, 175], [130, 175], [91, 199], [117, 199]].map(([x, y]) => c(x, y, 13))}
      <T x={100} y={236} s={11}>…y las hijas no se separan</T>
      <T x={100} y={250} s={11}>(se cree en animales y plantas)</T>
      {[[250, 70, 0], [350, 82, 1], [262, 130, 2], [340, 135, 0]].map(([x, y, t]) => c(x, y, 13, t))}
      <Flecha x1={266} y1={78} x2={290} y2={106} dash="4 3" />
      <Flecha x1={336} y1={90} x2={314} y2={106} dash="4 3" />
      <Flecha x1={274} y1={126} x2={288} y2={118} dash="4 3" />
      <Flecha x1={328} y1={128} x2={314} y2={120} dash="4 3" />
      <T x={300} y={168} s={10}>cuando falta alimento…</T>
      {[[287, 200, 0], [313, 200, 1], [300, 224, 2]].map(([x, y, t]) => c(x, y, 13, t))}
      <T x={300} y={254} s={11}>…se agrupan (Dictyostelium)</T>
    </Lienzo>
  )
}

/** Experimento de las levaduras: de células sueltas a un grupo en forma de copo de nieve. */
export function OriCopoNieve() {
  const ov = (x: number, y: number, a = 0) => (
    <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="13" ry="10" transform={`rotate(${a} ${x} ${y})`} fill="#fbeedd" stroke="#b3661f" strokeWidth="2.5" />
  )
  const copo = [
    [0, 0, 0], [26, -6, 20], [-26, 6, 20], [8, 26, -30], [-8, -26, -30], [52, -12, 10], [-52, 12, 10], [24, 48, 40], [-24, -48, 40], [34, 22, -10], [-34, -22, -10], [60, 14, 30], [-60, -14, 30],
  ]
  return (
    <Lienzo etiqueta="Levaduras que viven solas, tras un tiempo de selección por tamaño, forman un grupo ramificado como un copo de nieve">
      <T x={200} y={28} s={14} b>El experimento de las levaduras</T>
      {[[50, 100, 10], [90, 130, -20], [60, 160, 30], [100, 90, 0]].map(([x, y, a]) => ov(x, y, a))}
      <T x={75} y={196} s={11} b>Levaduras sueltas</T>
      <Flecha x1={135} y1={125} x2={215} y2={125} w={3} />
      <T x={175} y={104} s={11} b>selección por tamaño</T>
      <T x={175} y={150} s={11}>(en unas semanas)</T>
      <g transform="translate(312 135)">{copo.map(([x, y, a]) => ov(x, y, a))}</g>
      <T x={305} y={230} s={11} b>Un grupo ramificado</T>
      <T x={305} y={245} s={11}>como un copo de nieve</T>
      <T x={200} y={278} s={10} i>Experimento de Ratcliff y colaboradores (2012)</T>
    </Lienzo>
  )
}

/** Del unicelular al pluricelular, como un espectro. */
export function ColEspectro() {
  const c = (x: number, y: number, r: number, t = 0) => (
    <Bola key={`${x}-${y}`} x={x} y={y} r={r} fill={['#f8d9d4', '#cfe8c4', '#dce9f7'][t]} stroke={['#b05a5a', '#4f8a43', '#3b6fb6'][t]} w={2.5} />
  )
  return (
    <Lienzo etiqueta="Un espectro con cuatro puntos: una célula sola, una cadena de células iguales, una esfera con reparto de tareas y un organismo con tejidos. Cada punto depende más del conjunto">
      <T x={200} y={26} s={14} b>No son cajas: es un espectro</T>
      <Flecha x1={30} y1={150} x2={372} y2={150} c="#9a8a6a" w={3} />
      {c(60, 100, 20)}
      <T x={60} y={190} s={11} b>Unicelular</T>
      {[[135, 100], [160, 100], [185, 100]].map(([x, y]) => c(x, y, 12, 1))}
      <T x={160} y={190} s={11} b>Colonia sencilla</T>
      <circle cx="260" cy="100" r="26" fill="#cfe8c4" stroke="#4f8a43" strokeWidth="3" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle key={a} cx={260 + 20 * Math.cos(rad(a))} cy={100 + 20 * Math.sin(rad(a))} r="4" fill="#5fa84f" />
      ))}
      <T x={260} y={190} s={11} b>Volvox</T>
      <g>
        {[0, 1, 2].flatMap((f) => [0, 1, 2, 3].map((k) => <rect key={`${f}${k}`} x={318 + k * 16} y={80 + f * 16} width="14" height="14" rx="3" fill={['#f8d9d4', '#dce9f7', '#cfe8c4'][f]} stroke={TINTA} strokeWidth="1" />))}
      </g>
      <T x={350} y={190} s={11} b>Pluricelular</T>
      <T x={60} y={206} s={10}>una sola</T>
      <T x={160} y={206} s={10}>cada una podría</T>
      <T x={160} y={219} s={10}>vivir sola</T>
      <T x={260} y={206} s={10}>unas ya no</T>
      <T x={260} y={219} s={10}>pueden</T>
      <T x={350} y={206} s={10}>ninguna puede</T>
      <T x={200} y={262} s={12} b>Cada paso depende más del conjunto →</T>
    </Lienzo>
  )
}

/** Coanoflagelados formando una roseta. */
export function ColCoanoflagelado() {
  return (
    <Lienzo etiqueta="Una colonia en roseta de coanoflagelados: seis células alargadas con un collar de filamentos y un flagelo apuntando hacia afuera">
      <T x={200} y={26} s={14} b>Coanoflagelados en roseta</T>
      {[0, 60, 120, 180, 240, 300].map((a) => {
        const u = (d: number, g = 0) => [200 + d * Math.cos(rad(a + g)), 150 + d * Math.sin(rad(a + g))]
        const [cx, cy] = u(52)
        const [ex, ey] = u(86)
        const [fx, fy] = u(118, 8)
        const [mx, my] = u(104, -6)
        return (
          <g key={a}>
            <path d={`M ${ex} ${ey} Q ${mx} ${my} ${fx} ${fy}`} fill="none" stroke="#4f8a43" strokeWidth="2.5" strokeLinecap="round" />
            {[-40, -20, 0, 20, 40].map((g) => {
              const [x1, y1] = u(86, 0)
              return <line key={g} x1={x1} y1={y1} x2={ex + 16 * Math.cos(rad(a + g))} y2={ey + 16 * Math.sin(rad(a + g))} stroke="#3b6fb6" strokeWidth="1.8" strokeLinecap="round" />
            })}
            <ellipse cx={cx} cy={cy} rx="36" ry="14" transform={`rotate(${a} ${cx} ${cy})`} fill="#dce9f7" stroke="#3b6fb6" strokeWidth="2.5" />
            <circle cx={u(40)[0]} cy={u(40)[1]} r="6" fill="#c9a0dc" stroke="#7a4a8a" strokeWidth="1.5" />
          </g>
        )
      })}
      <g>
        <line x1="346" y1="196" x2="318" y2="170" stroke={TINTA} strokeWidth="1.5" />
        <T x={352} y={206} s={11} b>flagelo</T>
        <line x1="344" y1="118" x2="296" y2="144" stroke={TINTA} strokeWidth="1.5" />
        <T x={350} y={112} s={11} b>collar</T>
      </g>
      <T x={200} y={284} s={11}>Unicelulares que a veces forman colonias: parientes de los animales</T>
    </Lienzo>
  )
}
