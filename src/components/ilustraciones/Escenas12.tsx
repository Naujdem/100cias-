import { Ameba, Bola, Flecha, Lienzo, T, TINTA, rad } from './Dibujo.tsx'

// Ilustraciones esquemáticas (no a escala) para las láminas del subtema 1.2.

const C = { C: '#c9c4b8', H: '#ffffff', O: '#e8806f', N: '#7aa7e0', P: '#f2a24b', Fe: '#b5503a', Ca: '#efe6cc' }
const Atomo = ({ x, y, r, e, s }: { x: number; y: number; r: number; e: keyof typeof C; s?: string }) => (
  <g>
    <Bola x={x} y={y} r={r} fill={C[e]} stroke={TINTA} w={2.5} />
    <T x={x} y={y + r * 0.32} s={r * 0.9} b>{s ?? e}</T>
  </g>
)
const Enlace = ({ x1, y1, x2, y2, doble = false }: { x1: number; y1: number; x2: number; y2: number; doble?: boolean }) => {
  const dx = y2 - y1
  const dy = x1 - x2
  const n = Math.hypot(dx, dy) || 1
  const o = doble ? 3 : 0
  return doble ? (
    <g stroke={TINTA} strokeWidth="3" strokeLinecap="round">
      <line x1={x1 + (dx / n) * o} y1={y1 + (dy / n) * o} x2={x2 + (dx / n) * o} y2={y2 + (dy / n) * o} />
      <line x1={x1 - (dx / n) * o} y1={y1 - (dy / n) * o} x2={x2 - (dx / n) * o} y2={y2 - (dy / n) * o} />
    </g>
  ) : (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={TINTA} strokeWidth="4" strokeLinecap="round" />
  )
}

/** Carbono, hidrógeno, oxígeno y nitrógeno, con cuántos enlaces suelen hacer. */
export function NivCuatroAtomos() {
  const items = [
    { e: 'C' as const, r: 34, x: 58, n: 'Carbono', b: 4 },
    { e: 'H' as const, r: 20, x: 150, n: 'Hidrógeno', b: 1 },
    { e: 'O' as const, r: 29, x: 245, n: 'Oxígeno', b: 2 },
    { e: 'N' as const, r: 30, x: 340, n: 'Nitrógeno', b: 3 },
  ]
  return (
    <Lienzo etiqueta="Cuatro átomos: carbono con cuatro enlaces, hidrógeno con uno, oxígeno con dos y nitrógeno con tres">
      <T x={200} y={30} s={14} b>Los cuatro protagonistas</T>
      {items.map((it) => (
        <g key={it.e}>
          {Array.from({ length: it.b }, (_, k) => {
            const a = -90 + (360 / it.b) * k + (it.b === 2 ? 45 : it.b === 1 ? 135 : 0)
            return <Enlace key={k} x1={it.x + it.r * Math.cos(rad(a))} y1={140 + it.r * Math.sin(rad(a))} x2={it.x + (it.r + 20) * Math.cos(rad(a))} y2={140 + (it.r + 20) * Math.sin(rad(a))} />
          })}
          <Atomo x={it.x} y={140} r={it.r} e={it.e} />
          <T x={it.x} y={222} s={12} b>{it.n}</T>
          <T x={it.x} y={238} s={11}>{it.b === 1 ? '1 enlace' : `${it.b} enlaces`}</T>
        </g>
      ))}
      <T x={200} y={274} s={11}>Juntos son cerca del 96 % de la masa del cuerpo humano</T>
    </Lienzo>
  )
}

/** Fósforo, calcio y hierro, y dónde están. */
export function NivOtrosAtomos() {
  return (
    <Lienzo etiqueta="Tres átomos importantes: el fósforo en el ADN, el calcio en los huesos y el hierro en la sangre">
      <T x={200} y={28} s={14} b>Otros átomos importantes</T>
      {/* ADN */}
      <g transform="translate(70 0)">
        {Array.from({ length: 9 }, (_, k) => {
          const y = 66 + k * 14
          const x1 = 24 * Math.sin(k * 0.8)
          const x2 = -x1
          return (
            <g key={k}>
              <line x1={x1} y1={y} x2={x2} y2={y} stroke="#b9a98a" strokeWidth="2" />
              <circle cx={x1} cy={y} r="4" fill="#7a9fd8" stroke={TINTA} strokeWidth="1" />
              <circle cx={x2} cy={y} r="4" fill="#e8806f" stroke={TINTA} strokeWidth="1" />
            </g>
          )
        })}
        <Atomo x={0} y={210} r={18} e="P" />
        <T x={0} y={245} s={12} b>Fósforo</T>
        <T x={0} y={260} s={11}>ADN y ATP</T>
      </g>
      {/* hueso */}
      <g transform="translate(200 0)">
        <g transform="translate(0 112) rotate(-32)">
          <rect x="-46" y="-9" width="92" height="18" rx="5" fill="#efe6cc" stroke="#8a6a3a" strokeWidth="3" />
          {[[-46, -9], [-46, 9], [46, -9], [46, 9]].map(([x, y], k) => <circle key={k} cx={x + (x < 0 ? -4 : 4)} cy={y} r="10" fill="#efe6cc" stroke="#8a6a3a" strokeWidth="3" />)}
          {[-46, 46].map((x, k) => <rect key={k} x={x + (x < 0 ? -2 : -14)} y={-8} width="16" height="16" fill="#efe6cc" />)}
        </g>
        <Atomo x={0} y={210} r={18} e="Ca" s="Ca" />
        <T x={0} y={245} s={12} b>Calcio</T>
        <T x={0} y={260} s={11}>huesos y dientes</T>
      </g>
      {/* sangre */}
      <g transform="translate(330 0)">
        <path d="M 0 62 C -26 98 -34 118 -34 134 a 34 34 0 0 0 68 0 C 34 118 26 98 0 62 Z" fill="#e06a5a" stroke="#9a2f22" strokeWidth="3" />
        <ellipse cx="-12" cy="130" rx="7" ry="12" fill="#fff" opacity="0.35" transform="rotate(20 -12 130)" />
        <Atomo x={0} y={210} r={18} e="Fe" s="Fe" />
        <T x={0} y={245} s={12} b>Hierro</T>
        <T x={0} y={260} s={11}>en la sangre</T>
      </g>
    </Lienzo>
  )
}

/** Agua, oxígeno, dióxido de carbono y glucosa. */
export function NivMoleculasEjemplos() {
  const a = (x: number, y: number, e: keyof typeof C, r = 15) => <Atomo key={`${x}${y}`} x={x} y={y} r={r} e={e} />
  const hex = Array.from({ length: 6 }, (_, k) => [320 + 34 * Math.cos(rad(k * 60 - 90)), 110 + 34 * Math.sin(rad(k * 60 - 90))])
  return (
    <Lienzo etiqueta="Cuatro moléculas: agua con dos hidrógenos y un oxígeno, oxígeno con dos átomos unidos, dióxido de carbono con un carbono entre dos oxígenos y glucosa con un anillo de carbonos">
      <T x={200} y={28} s={14} b>Moléculas pequeñas de la vida</T>
      <Enlace x1={62} y1={100} x2={38} y2={124} /><Enlace x1={62} y1={100} x2={86} y2={124} />
      {a(62, 100, 'O', 18)}{a(36, 128, 'H', 11)}{a(88, 128, 'H', 11)}
      <T x={62} y={172} s={13} b>Agua</T><T x={62} y={188} s={11}>H₂O</T>
      <Enlace x1={150} y1={110} x2={186} y2={110} doble />
      {a(148, 110, 'O', 18)}{a(188, 110, 'O', 18)}
      <T x={168} y={172} s={13} b>Oxígeno</T><T x={168} y={188} s={11}>O₂</T>
      <Enlace x1={64} y1={230} x2={112} y2={230} doble />
      <Enlace x1={112} y1={230} x2={160} y2={230} doble />
      {a(62, 230, 'O', 16)}{a(112, 230, 'C', 19)}{a(162, 230, 'O', 16)}
      <T x={112} y={270} s={13} b>Dióxido de carbono</T><T x={112} y={286} s={11}>CO₂</T>
      {hex.map(([x, y], k) => {
        const [x2, y2] = hex[(k + 1) % 6]
        return <Enlace key={k} x1={x} y1={y} x2={x2} y2={y2} />
      })}
      {hex.map(([x, y], k) => a(x, y, k === 5 ? 'O' : 'C', 11))}
      <T x={320} y={172} s={13} b>Glucosa</T><T x={320} y={188} s={11}>C₆H₁₂O₆</T>
      <T x={320} y={236} s={11}>un anillo de carbonos</T>
      <T x={320} y={250} s={11}>que guarda energía</T>
    </Lienzo>
  )
}

/** Silueta llena de agua hasta más de la mitad. */
export function NivAguaCuerpo() {
  const cuerpo = 'M 150 30 a 24 24 0 1 1 -0.1 0 Z M 112 92 Q 150 78 188 92 L 198 180 L 176 180 L 172 262 L 154 262 L 150 196 L 146 196 L 142 262 L 124 262 L 120 180 L 102 180 Z'
  return (
    <Lienzo etiqueta="Una silueta humana llena de agua hasta más de la mitad: el cuerpo adulto es entre la mitad y dos tercios de agua">
      <defs>
        <clipPath id="clip-agua-cuerpo">
          <path d={cuerpo} />
        </clipPath>
      </defs>
      <path d={cuerpo} fill="#fff" stroke={TINTA} strokeWidth="3" strokeLinejoin="round" />
      <g clipPath="url(#clip-agua-cuerpo)">
        <path d="M 90 116 q 15 -8 30 0 t 30 0 t 30 0 t 30 0 V 270 H 90 Z" fill="#7fb8e6" opacity="0.9" />
      </g>
      <path d={cuerpo} fill="none" stroke={TINTA} strokeWidth="3" strokeLinejoin="round" />
      <T x={290} y={72} s={30} b c="#2f6f9f">½ a ⅔</T>
      <T x={290} y={96} s={13}>del cuerpo adulto</T>
      <T x={290} y={112} s={13}>es agua</T>
      <path d="M 250 150 C 238 168 234 176 234 184 a 16 16 0 0 0 32 0 C 266 176 262 168 250 150 Z" fill="#7fb8e6" stroke="#2f6f9f" strokeWidth="2.5" />
      <path d="M 318 170 C 309 184 306 190 306 196 a 12 12 0 0 0 24 0 C 330 190 327 184 318 170 Z" fill="#7fb8e6" stroke="#2f6f9f" strokeWidth="2.5" />
      <T x={290} y={238} s={12} b>Las reacciones de la célula</T>
      <T x={290} y={254} s={12}>ocurren disueltas en agua</T>
    </Lienzo>
  )
}

/** La glucosa se «quema» con oxígeno y libera energía. */
export function NivGlucosaEnergia() {
  const hex = Array.from({ length: 6 }, (_, k) => [62 + 22 * Math.cos(rad(k * 60 - 90)), 100 + 22 * Math.sin(rad(k * 60 - 90))])
  return (
    <Lienzo etiqueta="Glucosa más oxígeno se transforman en dióxido de carbono y agua, y se libera energía">
      <T x={200} y={28} s={14} b>La célula «quema» la glucosa</T>
      {hex.map(([x, y], k) => {
        const [x2, y2] = hex[(k + 1) % 6]
        return <Enlace key={k} x1={x} y1={y} x2={x2} y2={y2} />
      })}
      {hex.map(([x, y], k) => <Atomo key={k} x={x} y={y} r={8} e={k === 5 ? 'O' : 'C'} s="" />)}
      <T x={62} y={150} s={12} b>Glucosa</T>
      <T x={104} y={104} s={22} b>+</T>
      <Enlace x1={135} y1={100} x2={162} y2={100} doble />
      <Atomo x={133} y={100} r={12} e="O" s="O" />
      <Atomo x={164} y={100} r={12} e="O" s="O" />
      <T x={148} y={150} s={12} b>Oxígeno</T>
      <Flecha x1={188} y1={100} x2={226} y2={100} w={3} />
      <Enlace x1={236} y1={100} x2={262} y2={100} doble />
      <Enlace x1={262} y1={100} x2={288} y2={100} doble />
      <Atomo x={234} y={100} r={11} e="O" s="O" /><Atomo x={262} y={100} r={12} e="C" s="C" /><Atomo x={290} y={100} r={11} e="O" s="O" />
      <T x={262} y={140} s={11} b>Dióxido de carbono</T>
      <T x={320} y={104} s={18} b>+</T>
      <Atomo x={356} y={96} r={12} e="O" s="O" />
      <Atomo x={342} y={112} r={7} e="H" s="" /><Atomo x={370} y={112} r={7} e="H" s="" />
      <T x={356} y={140} s={11} b>Agua</T>
      <path d="M 120 176 L 98 222 L 118 222 L 108 264 L 152 208 L 130 208 L 144 176 Z" fill="#ffd54a" stroke="#c9a227" strokeWidth="3" strokeLinejoin="round" />
      <T x={270} y={208} s={15} b>Energía</T>
      <T x={270} y={228} s={12}>que la célula usa para vivir</T>
      <T x={270} y={252} s={11}>(sobre todo en las mitocondrias)</T>
    </Lienzo>
  )
}

/** Cuatro tipos de macromoléculas. */
export function NivMacroCuatro() {
  const helix = Array.from({ length: 8 }, (_, k) => {
    const y = 8 + k * 9
    const x = 22 * Math.sin(k * 0.9)
    return { y, x }
  })
  return (
    <Lienzo etiqueta="Cuatro macromoléculas: una proteína plegada, el ADN en doble hélice, un carbohidrato ramificado y una membrana de lípidos">
      <line x1="200" y1="20" x2="200" y2="285" stroke="#d6cdb8" strokeWidth="2" strokeDasharray="5 5" />
      <line x1="20" y1="150" x2="380" y2="150" stroke="#d6cdb8" strokeWidth="2" strokeDasharray="5 5" />
      {/* proteína */}
      <g transform="translate(100 62)">
        <path d="M -50 10 q 10 -40 30 -20 t 30 10 q 20 20 0 30 t -30 -6 q -22 -2 -10 -22" fill="none" stroke="#7a9fd8" strokeWidth="9" strokeLinecap="round" />
        <path d="M 6 8 q 20 -30 40 -10 q 12 20 -10 28" fill="none" stroke="#e8806f" strokeWidth="9" strokeLinecap="round" />
        <T x={0} y={50} s={12} b>Proteína</T>
      </g>
      <T x={100} y={126} s={11}>construye y hace funcionar</T>
      {/* ADN */}
      <g transform="translate(300 28)">
        {helix.map(({ y, x }, k) => (
          <g key={k}>
            <line x1={x} y1={y} x2={-x} y2={y} stroke="#b9a98a" strokeWidth="2" />
            <circle cx={x} cy={y} r="4.5" fill="#7a9fd8" stroke={TINTA} strokeWidth="1" />
            <circle cx={-x} cy={y} r="4.5" fill="#e8806f" stroke={TINTA} strokeWidth="1" />
          </g>
        ))}
        <T x={0} y={88} s={12} b>Ácido nucleico (ADN)</T>
      </g>
      <T x={300} y={137} s={11}>guarda la información</T>
      {/* carbohidrato */}
      <g transform="translate(100 176)">
        {[[-50, 0], [-30, 0], [-10, 0], [10, 0], [30, 0], [50, 0], [-10, -20], [30, 20]].map(([x, y], k) => (
          <circle key={k} cx={x} cy={y + 10} r="8.5" fill="#fbe19a" stroke="#b3861f" strokeWidth="2" />
        ))}
        <T x={0} y={62} s={12} b>Carbohidrato (almidón)</T>
      </g>
      <T x={100} y={256} s={11}>energía y estructura</T>
      {/* lípido */}
      <g transform="translate(300 174)">
        {Array.from({ length: 5 }, (_, k) => {
          const x = -44 + k * 22
          return (
            <g key={k}>
              <circle cx={x} cy={-2} r="8" fill="#f2c77a" stroke="#b3861f" strokeWidth="2" />
              <path d={`M ${x - 3} 6 v 22 M ${x + 3} 6 v 22`} stroke="#b3861f" strokeWidth="2" strokeLinecap="round" />
              <circle cx={x} cy={66} r="8" fill="#f2c77a" stroke="#b3861f" strokeWidth="2" />
              <path d={`M ${x - 3} 58 v -22 M ${x + 3} 58 v -22`} stroke="#b3861f" strokeWidth="2" strokeLinecap="round" />
            </g>
          )
        })}
        <T x={0} y={100} s={12} b>Lípido (membrana)</T>
      </g>
      <T x={300} y={288} s={11}>reserva y membranas</T>
    </Lienzo>
  )
}

/** Una cadena de piezas que se pliega en una forma. */
export function NivProteinaForma() {
  const col = ['#7a9fd8', '#e8806f', '#6fb06a', '#f2b84b', '#9a6fc6', '#e08fb0']
  const cadena = Array.from({ length: 12 }, (_, k) => [44 + k * 28, 70])
  const plegada = Array.from({ length: 12 }, (_, k) => {
    const t = (k / 11) * Math.PI * 3.2
    const r = 1 - k / 26
    return [200 + 72 * r * Math.cos(t), 205 + 34 * r * Math.sin(t) + (k - 5) * 2]
  })
  return (
    <Lienzo etiqueta="Una cadena de aminoácidos de colores se pliega hasta formar una proteína con una forma única">
      <T x={200} y={28} s={14} b>Una proteína: una cadena que se pliega</T>
      {cadena.slice(1).map(([x, y], k) => (
        <line key={k} x1={cadena[k][0]} y1={cadena[k][1]} x2={x} y2={y} stroke="#9a8a6a" strokeWidth="3" />
      ))}
      {cadena.map(([x, y], k) => <Bola key={k} x={x} y={y} r={11} fill={col[k % 6]} stroke={TINTA} w={2} />)}
      <T x={200} y={106} s={11}>aminoácidos (las piezas)</T>
      <Flecha x1={200} y1={118} x2={200} y2={146} w={3} />
      <T x={216} y={140} s={12} b a="start">se pliega</T>
      {plegada.slice(1).map(([x, y], k) => (
        <line key={k} x1={plegada[k][0]} y1={plegada[k][1]} x2={x} y2={y} stroke="#9a8a6a" strokeWidth="3" />
      ))}
      {plegada.map(([x, y], k) => <Bola key={k} x={x} y={y} r={11} fill={col[k % 6]} stroke={TINTA} w={2} />)}
      <T x={200} y={266} s={12} b>La forma decide lo que hace</T>
      <T x={200} y={283} s={11}>si cambia una pieza, puede cambiar la forma</T>
    </Lienzo>
  )
}

/** Mitocondria, cloroplasto y núcleo. */
export function NivOrganulosTres() {
  return (
    <Lienzo etiqueta="Tres orgánulos: una mitocondria con pliegues internos, un cloroplasto verde con pilas de discos y un núcleo con poros y nucléolo">
      <T x={200} y={28} s={14} b>Tres orgánulos clave</T>
      <g transform="translate(70 120)">
        <ellipse rx="52" ry="34" fill="#f6d3a8" stroke="#b3661f" strokeWidth="3.5" />
        <path d="M -40 0 q 6 -22 12 0 t 12 0 t 12 0 t 12 0 t 12 0" fill="none" stroke="#e0883a" strokeWidth="4" strokeLinecap="round" />
        <T x={0} y={72} s={13} b>Mitocondria</T>
        <T x={0} y={88} s={11}>libera energía</T>
        <T x={0} y={102} s={11}>de los alimentos</T>
      </g>
      <g transform="translate(200 120)">
        <ellipse rx="54" ry="34" fill="#cfe8c4" stroke="#4f8a43" strokeWidth="3.5" />
        {[-26, 0, 26].map((x) => (
          <g key={x}>
            {[-12, -4, 4, 12].map((y) => <rect key={y} x={x - 9} y={y - 2.2} width="18" height="4.4" rx="2.2" fill="#5fa84f" stroke="#2f6a24" strokeWidth="1" />)}
          </g>
        ))}
        <T x={0} y={72} s={13} b>Cloroplasto</T>
        <T x={0} y={88} s={11}>hace la fotosíntesis</T>
        <T x={0} y={102} s={11}>(en las plantas)</T>
      </g>
      <g transform="translate(330 120)">
        <circle r="40" fill="#e6d3f0" stroke="#7a4a8a" strokeWidth="3.5" />
        <circle cx="-6" cy="-4" r="13" fill="#b78bd0" stroke="#5a3a6a" strokeWidth="2" />
        {[0, 70, 140, 210, 290].map((a) => <circle key={a} cx={40 * Math.cos(rad(a))} cy={40 * Math.sin(rad(a))} r="4" fill="#f4efe4" stroke="#7a4a8a" strokeWidth="2" />)}
        <T x={0} y={72} s={13} b>Núcleo</T>
        <T x={0} y={88} s={11}>guarda el ADN</T>
      </g>
      <T x={200} y={268} s={11}>Cada uno hace una tarea, como si fueran los «órganos» de la célula</T>
    </Lienzo>
  )
}

/** Procariota frente a eucariota. */
export function NivProEuc() {
  return (
    <Lienzo etiqueta="A la izquierda una célula procariota pequeña sin orgánulos con membrana; a la derecha una eucariota más grande con núcleo y otros orgánulos">
      <T x={95} y={28} s={14} b>Procariota</T>
      <T x={290} y={28} s={14} b>Eucariota</T>
      <line x1="190" y1="16" x2="190" y2="262" stroke="#d6cdb8" strokeWidth="2" strokeDasharray="5 5" />
      <rect x="40" y="95" width="110" height="64" rx="32" fill="#cfe8c4" stroke="#4f8a43" strokeWidth="3.5" />
      <path d="M 66 128 q 8 -22 18 -2 t 18 0 t 18 0 q 6 14 -4 20 q -14 6 -26 -6" fill="none" stroke="#7a4a8a" strokeWidth="3" strokeLinecap="round" />
      {[[56, 112], [136, 146], [128, 108], [64, 148], [100, 150]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.5" fill="#b3661f" />)}
      <T x={95} y={190} s={12} b>Sin orgánulos con membrana</T>
      <T x={95} y={206} s={11}>ADN suelto, ribosomas</T>
      <T x={95} y={238} s={11}>pequeña: bacterias y arqueas</T>
      <Ameba cx={290} cy={125} rx={86} ry={62} />
      <circle cx="285" cy="118" r="26" fill="#e6d3f0" stroke="#7a4a8a" strokeWidth="3" />
      <circle cx="281" cy="115" r="8" fill="#b78bd0" stroke="#5a3a6a" strokeWidth="1.5" />
      {[[240, 150, 30], [330, 150, -20], [250, 90, 60]].map(([x, y, a], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx="15" ry="8" transform={`rotate(${a} ${x} ${y})`} fill="#f6d3a8" stroke="#b3661f" strokeWidth="2" />
          <path d={`M ${x - 8} ${y} q 3 -5 5 0 t 5 0`} transform={`rotate(${a} ${x} ${y})`} fill="none" stroke="#e0883a" strokeWidth="1.5" />
        </g>
      ))}
      {[[332, 100], [315, 168], [262, 172]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="#b3661f" />)}
      <T x={290} y={206} s={12} b>Con núcleo y otros orgánulos</T>
      <T x={290} y={222} s={11}>más grande: animales, plantas,</T>
      <T x={290} y={236} s={11}>hongos y protistas</T>
    </Lienzo>
  )
}

/** Un organismo de una célula frente a uno de billones de células. */
export function NivUnoMuchas() {
  const silueta = 'M 300 38 a 22 22 0 1 1 -0.1 0 Z M 264 96 Q 300 82 336 96 L 346 184 L 324 184 L 320 262 L 302 262 L 300 198 L 298 198 L 296 262 L 278 262 L 274 184 L 254 184 Z'
  const puntos = Array.from({ length: 140 }, (_, k) => [250 + ((k * 37) % 100), 40 + ((k * 53) % 222)])
  return (
    <Lienzo etiqueta="A la izquierda, una bacteria: una célula es un organismo. A la derecha, una persona formada por billones de células">
      <T x={90} y={28} s={14} b>Unicelular</T>
      <T x={300} y={28} s={14} b>Pluricelular</T>
      <rect x="35" y="104" width="110" height="64" rx="32" fill="#cfe8c4" stroke="#4f8a43" strokeWidth="3.5" />
      <path d="M 62 136 q 8 -22 18 -2 t 18 0 t 18 0" fill="none" stroke="#7a4a8a" strokeWidth="3" strokeLinecap="round" />
      <T x={90} y={200} s={13} b>1 célula</T>
      <T x={90} y={218} s={13} b>= 1 organismo</T>
      <defs>
        <clipPath id="clip-persona-celulas"><path d={silueta} /></clipPath>
      </defs>
      <path d={silueta} fill="#fbe7e3" />
      <g clipPath="url(#clip-persona-celulas)">
        {puntos.map(([x, y], k) => <circle key={k} cx={x} cy={y} r="3.2" fill={['#e8806f', '#7a9fd8', '#6fb06a', '#f2b84b'][k % 4]} opacity="0.85" />)}
      </g>
      <path d={silueta} fill="none" stroke={TINTA} strokeWidth="3" strokeLinejoin="round" />
      <T x={300} y={278} s={12} b>billones de células</T>
      <T x={300} y={293} s={12} b>= 1 organismo</T>
    </Lienzo>
  )
}

/** Cuatro tejidos de las plantas. */
export function NivTejidosPlantas() {
  return (
    <Lienzo etiqueta="Cuatro tejidos vegetales: meristemático con células pequeñas que se dividen, epidermis que protege, parénquima con cloroplastos y tubos que transportan agua y azúcares">
      <T x={200} y={26} s={14} b>Tejidos de las plantas</T>
      <g transform="translate(28 40) scale(0.88)">
        <rect width="170" height="94" rx="10" fill="#fff" stroke="#d6cdb8" strokeWidth="2" />
        {Array.from({ length: 4 }, (_, f) => Array.from({ length: 6 }, (_, c) => (
          <g key={`${f}${c}`}>
            <rect x={14 + c * 25} y={12 + f * 18} width="23" height="16" rx="3" fill="#e5f3d8" stroke="#4f8a43" strokeWidth="1.5" />
            <circle cx={25 + c * 25} cy={20 + f * 18} r="4.5" fill="#c9a0dc" stroke="#7a4a8a" strokeWidth="1" />
          </g>
        )))}
        <T x={85} y={112} s={12} b>Meristemático</T>
        <T x={85} y={127} s={11}>células pequeñas que crecen</T>
      </g>
      <g transform="translate(222 40) scale(0.88)">
        <rect width="170" height="94" rx="10" fill="#fff" stroke="#d6cdb8" strokeWidth="2" />
        <rect x="10" y="22" width="150" height="6" rx="3" fill="#d9c8a0" stroke="#8a6a3a" strokeWidth="1.5" />
        {Array.from({ length: 6 }, (_, c) => <rect key={c} x={12 + c * 25} y="30" width="23" height="18" rx="3" fill="#f3ead2" stroke="#8a6a3a" strokeWidth="1.5" />)}
        {Array.from({ length: 5 }, (_, c) => <ellipse key={c} cx={26 + c * 30} cy="68" rx="14" ry="12" fill="#e5f3d8" stroke="#4f8a43" strokeWidth="1.5" />)}
        <T x={85} y={112} s={12} b>Epidermis</T>
        <T x={85} y={127} s={11}>protege la superficie</T>
      </g>
      <g transform="translate(28 158) scale(0.88)">
        <rect width="170" height="94" rx="10" fill="#fff" stroke="#d6cdb8" strokeWidth="2" />
        {[[34, 28], [86, 24], [138, 30], [58, 66], [112, 66]].map(([x, y], k) => (
          <g key={k}>
            <circle cx={x} cy={y} r="22" fill="#e5f3d8" stroke="#4f8a43" strokeWidth="2" />
            {[[-8, -4], [6, 3], [-3, 9]].map(([dx, dy], j) => <ellipse key={j} cx={x + dx} cy={y + dy} rx="5" ry="3" fill="#5fa84f" stroke="#2f6a24" strokeWidth="1" />)}
          </g>
        ))}
        <T x={85} y={112} s={12} b>Parénquima</T>
        <T x={85} y={127} s={11}>fotosíntesis y reserva</T>
      </g>
      <g transform="translate(222 158) scale(0.88)">
        <rect width="170" height="94" rx="10" fill="#fff" stroke="#d6cdb8" strokeWidth="2" />
        <rect x="34" y="8" width="26" height="80" rx="13" fill="#dff0fb" stroke="#3b6fb6" strokeWidth="2.5" />
        <rect x="76" y="8" width="26" height="80" rx="13" fill="#dff0fb" stroke="#3b6fb6" strokeWidth="2.5" />
        <rect x="118" y="8" width="18" height="80" rx="9" fill="#fbe19a" stroke="#b3861f" strokeWidth="2.5" />
        <Flecha x1={47} y1={78} x2={47} y2={22} c="#3b6fb6" w={2} />
        <Flecha x1={89} y1={78} x2={89} y2={22} c="#3b6fb6" w={2} />
        <Flecha x1={127} y1={20} x2={127} y2={76} c="#b3861f" w={2} />
        <T x={85} y={112} s={12} b>Xilema y floema</T>
        <T x={85} y={127} s={11}>agua sube · azúcares bajan</T>
      </g>
    </Lienzo>
  )
}

/** El corazón y los cuatro tejidos que lo forman. */
export function NivCorazon() {
  const corazon = 'M 200 252 C 96 180 96 96 160 96 C 184 96 196 112 200 124 C 204 112 216 96 240 96 C 304 96 304 180 200 252 Z'
  return (
    <Lienzo etiqueta="Un corazón con cuatro tejidos señalados: muscular que bombea, conectivo que sostiene, epitelial que reviste y nervioso que coordina los latidos">
      <T x={200} y={26} s={14} b>El corazón: cuatro tejidos en un órgano</T>
      <g transform="translate(50 42) scale(0.75)">
        <path d={corazon} fill="#e68a7e" stroke="#9a2f22" strokeWidth="4" strokeLinejoin="round" />
        <path d="M 150 130 q 20 -16 40 4 M 160 160 q 28 -10 44 14 M 190 190 q 20 4 30 24 M 230 134 q 20 -6 34 14" fill="none" stroke="#b3483a" strokeWidth="5" strokeLinecap="round" />
        <path d="M 172 110 l -2 -40 M 232 110 l 4 -40" stroke="#c9402f" strokeWidth="14" strokeLinecap="round" opacity="0.75" />
      </g>
      <Flecha x1={104} y1={74} x2={168} y2={138} />
      <T x={100} y={58} s={12} b a="end">Muscular</T><T x={100} y={72} s={11} a="end">bombea la sangre</T>
      <Flecha x1={104} y1={218} x2={176} y2={190} />
      <T x={100} y={216} s={12} b a="end">Conectivo</T><T x={100} y={230} s={11} a="end">sostiene y une</T>
      <Flecha x1={296} y1={74} x2={236} y2={138} />
      <T x={300} y={58} s={12} b a="start">Epitelial</T><T x={300} y={72} s={11} a="start">reviste por dentro</T>
      <Flecha x1={296} y1={218} x2={240} y2={186} />
      <T x={300} y={216} s={12} b a="start">Nervioso</T><T x={300} y={230} s={11} a="start">coordina los latidos</T>
    </Lienzo>
  )
}

/** Oxígeno: pulmones → corazón → células. */
export function NivSistemaCadena() {
  return (
    <Lienzo etiqueta="Tres sistemas en cadena: el respiratorio recibe el oxígeno, el circulatorio lo lleva y las células lo usan">
      <T x={200} y={28} s={14} b>Los sistemas trabajan en cadena</T>
      <g transform="translate(66 110)">
        <path d="M -8 -40 q -40 4 -42 52 q 0 30 22 30 q 24 0 20 -34 z" fill="#f4b6ae" stroke="#b05a5a" strokeWidth="3" />
        <path d="M 8 -40 q 40 4 42 52 q 0 30 -22 30 q -24 0 -20 -34 z" fill="#f4b6ae" stroke="#b05a5a" strokeWidth="3" />
        <line x1="0" y1="-56" x2="0" y2="-18" stroke="#b05a5a" strokeWidth="5" />
        <T x={0} y={76} s={12} b>Respiratorio</T>
        <T x={0} y={91} s={11}>el oxígeno entra</T>
      </g>
      <Flecha x1={112} y1={110} x2={150} y2={110} w={3} />
      <g transform="translate(200 110)">
        <path d="M 0 40 C -52 4 -52 -36 -20 -36 C -8 -36 -2 -28 0 -22 C 2 -28 8 -36 20 -36 C 52 -36 52 4 0 40 Z" fill="#e68a7e" stroke="#9a2f22" strokeWidth="3.5" />
        <T x={0} y={76} s={12} b>Circulatorio</T>
        <T x={0} y={91} s={11}>lo lleva por la sangre</T>
      </g>
      <Flecha x1={252} y1={110} x2={290} y2={110} w={3} />
      <g transform="translate(335 110)">
        {[[-16, -14], [14, -10], [-4, 14], [22, 20], [-26, 18]].map(([x, y], k) => <Bola key={k} x={x} y={y} r={13} fill={['#f8d9d4', '#cfe8c4', '#dce9f7'][k % 3]} stroke={['#b05a5a', '#4f8a43', '#3b6fb6'][k % 3]} w={2.5} />)}
        <T x={0} y={76} s={12} b>Las células</T>
        <T x={0} y={91} s={11}>lo usan</T>
      </g>
      {[131, 271].map((x) => (
        <g key={x}>
          <Bola x={x} y={96} r={11} fill="#7fb8e6" stroke="#2f6f9f" w={2} />
          <T x={x} y={100} s={9} b>O₂</T>
        </g>
      ))}
      <T x={200} y={266} s={12} b>El oxígeno (O₂) viaja de un sistema a otro</T>
    </Lienzo>
  )
}

/** Población, comunidad, ecosistema y biosfera. */
export function NivEcologia() {
  const pez = (x: number, y: number, c = '#f2b84b') => (
    <g key={`${x}${y}`} transform={`translate(${x} ${y})`}>
      <ellipse rx="13" ry="7" fill={c} stroke="#8a5a1a" strokeWidth="1.8" />
      <path d="M 12 0 l 9 -7 v 14 Z" fill={c} stroke="#8a5a1a" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="-6" cy="-1.5" r="1.5" fill="#4a3416" />
    </g>
  )
  const planta = (x: number, y: number) => <path key={`p${x}${y}`} d={`M ${x} ${y} q -8 -16 0 -30 q 8 14 0 30 M ${x} ${y} q -14 -6 -16 -18 M ${x} ${y} q 14 -6 16 -18`} fill="none" stroke="#4f8a43" strokeWidth="3" strokeLinecap="round" />
  return (
    <Lienzo etiqueta="Cuatro niveles ecológicos: una población de peces, una comunidad de peces plantas y aves, un ecosistema con agua y sol, y la biosfera como un planeta">
      <T x={200} y={26} s={14} b>Más allá del organismo</T>
      {[0, 1, 2, 3].map((k) => <rect key={k} x={14 + k * 94} y="46" width="88" height="130" rx="12" fill="#fff" stroke="#d6cdb8" strokeWidth="2" />)}
      <g>{pez(40, 84)}{pez(66, 104)}{pez(44, 134)}{pez(76, 142)}</g>
      <g>
        {pez(122, 82, '#f2b84b')}
        {planta(138, 160)}{planta(154, 162)}
        <path d="M 140 100 q 6 -8 12 0 q 6 -8 12 0" fill="none" stroke="#3b6fb6" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="126" cy="130" r="8" fill="#fbd9a8" stroke="#b3661f" strokeWidth="1.8" />
        {pez(140, 124, '#7aa7e0')}
      </g>
      <g>
        <circle cx="222" cy="72" r="9" fill="#ffe27a" stroke="#c9a227" strokeWidth="2" />
        <ellipse cx="246" cy="128" rx="34" ry="24" fill="#bfe0f5" stroke="#3b6fb6" strokeWidth="2.5" />
        {pez(240, 126, '#f2b84b')}
        {planta(222, 168)}{planta(270, 168)}
        <rect x="208" y="156" width="76" height="10" rx="4" fill="#d9c8a0" stroke="#8a6a3a" strokeWidth="1.5" />
      </g>
      <g>
        <circle cx="340" cy="111" r="34" fill="#8fc7ef" stroke="#3b6fb6" strokeWidth="3" />
        <path d="M 322 98 q 8 -12 18 -4 q 6 8 -3 13 q -11 5 -15 -9 M 344 124 q 10 -5 16 5 q -3 11 -13 6" fill="#7fc67a" stroke="#4f8a43" strokeWidth="2" />
      </g>
      {['Población', 'Comunidad', 'Ecosistema', 'Biosfera'].map((n, k) => <T key={n} x={58 + k * 94} y={198} s={12} b>{n}</T>)}
      {['misma especie', 'varias especies', 'vivos + ambiente', 'todo el planeta'].map((n, k) => <T key={n} x={58 + k * 94} y={214} s={10}>{n}</T>)}
      <Flecha x1={60} y1={250} x2={340} y2={250} c="#9a8a6a" w={3} />
      <T x={200} y={278} s={11}>cada nivel incluye al anterior</T>
    </Lienzo>
  )
}

/** Una gota de sangre vista de cerca. */
export function NivSangre() {
  const rojo = (x: number, y: number, a = 0) => (
    <g key={`${x}${y}`} transform={`translate(${x} ${y}) rotate(${a})`}>
      <ellipse rx="22" ry="21" fill="#e06a5a" stroke="#9a2f22" strokeWidth="2.5" />
      <ellipse rx="9" ry="8" fill="#c9402f" opacity="0.7" />
    </g>
  )
  return (
    <Lienzo etiqueta="Una gota de sangre ampliada con glóbulos rojos, un glóbulo blanco con núcleo, plaquetas pequeñas y el plasma, que es un líquido amarillento">
      <T x={200} y={24} s={14} b>Una gota de sangre, de cerca</T>
      <circle cx="140" cy="158" r="112" fill="#fbe9b0" stroke="#c9a227" strokeWidth="3" />
      {rojo(92, 120, 0)}{rojo(150, 100, 20)}{rojo(120, 168, 40)}{rojo(190, 150, 10)}{rojo(80, 190, 30)}{rojo(168, 208, 0)}{rojo(112, 222, 20)}{rojo(214, 196, 50)}
      <circle cx="158" cy="152" r="26" fill="#f4efe4" stroke="#7a4a8a" strokeWidth="3" />
      <path d="M 148 148 q 6 -10 14 0 q 6 10 -2 14 q -12 4 -12 -14" fill="#b78bd0" stroke="#5a3a6a" strokeWidth="2" />
      {[[206, 128], [64, 152], [140, 250], [190, 232], [230, 158]].map(([x, y], k) => <ellipse key={k} cx={x} cy={y} rx="6" ry="4" fill="#d9a0c8" stroke="#8a4a7a" strokeWidth="1.5" />)}
      <Flecha x1={300} y1={64} x2={244} y2={120} />
      <T x={302} y={60} s={12} b a="start">Glóbulos rojos</T><T x={302} y={75} s={11} a="start">llevan oxígeno</T>
      <Flecha x1={300} y1={130} x2={190} y2={148} />
      <T x={302} y={126} s={12} b a="start">Glóbulo blanco</T><T x={302} y={141} s={11} a="start">defiende</T>
      <Flecha x1={300} y1={196} x2={236} y2={162} />
      <T x={302} y={196} s={12} b a="start">Plaquetas</T><T x={302} y={211} s={11} a="start">cierran heridas</T>
      <Flecha x1={300} y1={256} x2={252} y2={236} />
      <T x={302} y={256} s={12} b a="start">Plasma</T><T x={302} y={271} s={11} a="start">casi todo agua</T>
    </Lienzo>
  )
}

/** Los órganos de una planta. */
export function NivPlantaOrganos() {
  return (
    <Lienzo etiqueta="Una planta con sus cinco órganos señalados: raíz, tallo, hoja, flor y fruto">
      <rect x="0" y="196" width="400" height="104" fill="#e6d3b0" />
      <path d="M 200 200 L 200 90" stroke="#4f8a43" strokeWidth="9" strokeLinecap="round" />
      <path d="M 200 150 q -50 -10 -62 -50 q 44 0 62 50 Z" fill="#7fc67a" stroke="#2f6a24" strokeWidth="3" strokeLinejoin="round" />
      <path d="M 200 130 q 50 -10 62 -50 q -44 0 -62 50 Z" fill="#7fc67a" stroke="#2f6a24" strokeWidth="3" strokeLinejoin="round" />
      {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={200 + 20 * Math.cos(rad(a - 90))} cy={72 + 20 * Math.sin(rad(a - 90))} rx="12" ry="8" transform={`rotate(${a} ${200 + 20 * Math.cos(rad(a - 90))} ${72 + 20 * Math.sin(rad(a - 90))})`} fill="#f6a8c4" stroke="#b05a7a" strokeWidth="2" />)}
      <circle cx="200" cy="72" r="9" fill="#ffd54a" stroke="#c9a227" strokeWidth="2" />
      <circle cx="262" cy="170" r="14" fill="#e8806f" stroke="#9a2f22" strokeWidth="3" />
      <path d="M 262 156 q 2 -8 8 -10" fill="none" stroke="#4f8a43" strokeWidth="3" strokeLinecap="round" />
      <path d="M 200 200 q -20 20 -44 44 M 200 200 q 0 30 -6 56 M 200 200 q 24 20 46 40 M 190 226 q -20 4 -34 20 M 214 224 q 20 0 32 18" fill="none" stroke="#8a6a3a" strokeWidth="5" strokeLinecap="round" />
      <T x={200} y={22} s={14} b>Los órganos de una planta</T>
      <Flecha x1={96} y1={60} x2={188} y2={70} /><T x={90} y={58} s={12} b a="end">Flor</T>
      <Flecha x1={100} y1={112} x2={152} y2={108} /><T x={94} y={116} s={12} b a="end">Hoja</T>
      <Flecha x1={318} y1={150} x2={282} y2={166} /><T x={324} y={152} s={12} b a="start">Fruto</T>
      <Flecha x1={316} y1={104} x2={206} y2={118} /><T x={322} y={106} s={12} b a="start">Tallo</T>
      <Flecha x1={316} y1={252} x2={240} y2={244} /><T x={322} y={256} s={12} b a="start">Raíz</T>
    </Lienzo>
  )
}
