// Escenas vivas de Química, área 2, tema 6: enlace químico.

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean, mover = 'none', quieto = 'none') => ({ transition: suave, opacity: si ? 1 : 0, transform: si ? mover : quieto })
const fondo = (color: string) => <rect x="-1500" y="-1500" width="3400" height="3300" fill={color} style={{ transition: 'fill 0.8s' }} />
const idx = (orden: string[], fase: string) => Math.max(0, orden.indexOf(fase))
const mover = (x: number, y: number) => ({ transition: suave, transform: `translate(${x}px, ${y}px)` })

const TINTA = '#3a3a3a'
const AZUL = '#3f6fb8'
const ROJO = '#c43c3c'
const VERDE = '#4f8a3c'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}
/** Símbolo con sus electrones de valencia como puntos (notación de Lewis). */
function Lewis({ x, y, s, n, c = AZUL }: { x: number; y: number; s: string; n: number; c?: string }) {
  const pos: [number, number][] = [[0, -1], [1, 0], [0, 1], [-1, 0]]
  return (
    <g>
      <T x={x} y={y + 7} t={s} s={22} />
      {Array.from({ length: n }, (_, k) => {
        const [dx, dy] = pos[k % 4]
        const segundo = k >= 4
        const off = n > 4 || k >= 4 ? (segundo ? 4 : -4) : 0
        return <circle key={k} cx={x + dx * 22 + (dy !== 0 ? off : 0)} cy={y + dy * 22 + (dx !== 0 ? off : 0)} r="3" fill={c} />
      })}
    </g>
  )
}

/* ── Valencia y octeto ───────────────────────────────────────────────── */

const OCTETO = ['valencia', 'octeto', 'meta']

export function EscenaOcteto({ fase }: { fase: string }) {
  const i = idx(OCTETO, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Regla del octeto: ${fase}`} className="h-full w-full">
      {fondo('#eef3f7')}
      <Lewis x={80} y={120} s="Na" n={1} />
      <Lewis x={200} y={120} s="Cl" n={7} />
      <Lewis x={320} y={120} s="Ne" n={8} c={VERDE} />
      <g style={ver(i === 0)}>
        <T x={80} y={175} t="1 e⁻ de valencia" s={11} peso={600} /><T x={200} y={175} t="7 e⁻" s={11} peso={600} /><T x={320} y={175} t="8 e⁻" s={11} peso={600} />
        <T x={200} y={240} t="Notación de Lewis: un punto por cada electrón de valencia" s={13} />
      </g>
      <g style={ver(i === 1)}>
        <circle cx="320" cy="120" r="38" fill="none" stroke={VERDE} strokeWidth="3" />
        <T x={320} y={185} t="¡capa llena!" s={12} c={VERDE} />
        <T x={200} y={240} t="Los gases nobles tienen 8 electrones en la última capa" s={13} />
        <T x={200} y={260} t="y casi no reaccionan: son estables" s={13} />
      </g>
      <g style={ver(i === 2)}>
        <T x={80} y={175} t="pierde 1 → 8" s={12} c={ROJO} />
        <T x={200} y={175} t="gana 1 → 8" s={12} c={AZUL} />
        <T x={200} y={240} t="Regla del octeto: los átomos ganan, pierden o comparten" s={13} />
        <T x={200} y={260} t="electrones para quedar con 8 (el hidrógeno, con 2)" s={13} />
      </g>
    </svg>
  )
}

/* ── Enlace iónico ────────────────────────────────────────────────────── */

const IONICO = ['transfiere', 'atraccion', 'cristal']

export function EscenaIonico({ fase }: { fase: string }) {
  const i = idx(IONICO, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Enlace iónico: ${fase}`} className="h-full w-full">
      {fondo('#f1f4ee')}
      <g style={ver(i < 2)}>
        <g style={mover(i === 0 ? 110 : 160, 120)}>
          <circle r="34" fill="#fde3d6" stroke={ROJO} strokeWidth="2" />
          <T x={0} y={7} t={i === 0 ? 'Na' : 'Na⁺'} s={18} />
        </g>
        <g style={mover(i === 0 ? 290 : 235, 120)}>
          <circle r="44" fill="#dfe9f5" stroke={AZUL} strokeWidth="2" />
          <T x={0} y={7} t={i === 0 ? 'Cl' : 'Cl⁻'} s={18} />
        </g>
        <g style={{ ...ver(i === 0), }}>
          <circle cx="200" cy="105" r="6" fill="#d9a520" stroke={TINTA} />
          <path d="M 150 95 Q 200 60 245 95" fill="none" stroke="#d9a520" strokeWidth="2" strokeDasharray="5 4" />
          <T x={200} y={225} t="El sodio le entrega su electrón al cloro" s={13} />
          <T x={200} y={245} t="(gran diferencia de electronegatividad)" s={11} peso={600} />
        </g>
        <g style={ver(i === 1)}>
          <T x={200} y={225} t="Quedan dos iones de carga opuesta que se atraen:" s={13} />
          <T x={200} y={245} t="eso es el enlace iónico" s={13} c={ROJO} />
        </g>
      </g>
      <g style={ver(i === 2)}>
        {Array.from({ length: 25 }, (_, k) => {
          const f = Math.floor(k / 5), c = k % 5, na = (f + c) % 2 === 0
          return (
            <g key={k}>
              <circle cx={120 + c * 40} cy={50 + f * 36} r={na ? 11 : 16} fill={na ? '#fde3d6' : '#dfe9f5'} stroke={na ? ROJO : AZUL} />
              <T x={120 + c * 40} y={54 + f * 36} t={na ? '+' : '−'} s={11} />
            </g>
          )
        })}
        <T x={200} y={255} t="Millones de iones en una red ordenada: un cristal de sal" s={13} />
        <T x={200} y={275} t="Sólidos duros, de alto punto de fusión; disueltos conducen" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── Enlace covalente ─────────────────────────────────────────────────── */

const COVALENTE = ['hidrogeno', 'agua', 'multiples']

export function EscenaCovalente({ fase }: { fase: string }) {
  const i = idx(COVALENTE, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Enlace covalente: ${fase}`} className="h-full w-full">
      {fondo('#f1eef6')}
      <g style={ver(i === 0)}>
        <circle cx="165" cy="110" r="45" fill="#dfe9f5" opacity="0.8" />
        <circle cx="235" cy="110" r="45" fill="#dfe9f5" opacity="0.8" />
        <T x={165} y={116} t="H" s={18} /><T x={235} y={116} t="H" s={18} />
        <circle cx="200" cy="100" r="5" fill={AZUL} /><circle cx="200" cy="120" r="5" fill={AZUL} />
        <T x={200} y={195} t="H : H   →   H–H" s={18} />
        <T x={200} y={240} t="Cada hidrógeno pone un electrón y los dos comparten el par:" s={12} />
        <T x={200} y={258} t="enlace covalente (entre no metales)" s={13} c={AZUL} />
      </g>
      <g style={ver(i === 1)}>
        <T x={200} y={100} t="O" s={26} />
        <T x={130} y={150} t="H" s={22} /><T x={270} y={150} t="H" s={22} />
        <line x1="185" y1="105" x2="145" y2="135" stroke={TINTA} strokeWidth="3" />
        <line x1="215" y1="105" x2="255" y2="135" stroke={TINTA} strokeWidth="3" />
        {[[190, 62], [210, 62], [176, 76], [224, 76]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="3.5" fill={AZUL} />)}
        <T x={200} y={210} t="Agua: el oxígeno comparte un par con cada hidrógeno" s={12} />
        <T x={200} y={230} t="y le quedan dos pares libres → 8 electrones" s={12} />
      </g>
      <g style={ver(i === 2)}>
        <T x={100} y={70} t="H–H" s={20} /><T x={100} y={95} t="sencillo" s={11} peso={600} />
        <T x={200} y={70} t="O=O" s={20} /><T x={200} y={95} t="doble" s={11} peso={600} />
        <T x={300} y={70} t="N≡N" s={20} /><T x={300} y={95} t="triple" s={11} peso={600} />
        <T x={200} y={160} t="Se pueden compartir 1, 2 o 3 pares" s={14} />
        <T x={200} y={185} t="El triple del nitrógeno es tan fuerte que el N₂ del aire casi no reacciona" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── Enlace metálico ──────────────────────────────────────────────────── */

const METALICO = ['cationes', 'mar', 'propiedades']
const RED: [number, number][] = Array.from({ length: 20 }, (_, k) => [80 + (k % 5) * 60, 60 + Math.floor(k / 5) * 45])
const ELEC: [number, number][] = Array.from({ length: 22 }, (_, k) => [70 + ((k * 53) % 260), 50 + ((k * 37) % 150)])

export function EscenaEnlaceMetalico({ fase }: { fase: string }) {
  const i = idx(METALICO, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Enlace metálico: ${fase}`} className="h-full w-full">
      {fondo(i === 2 ? '#f6f1e4' : '#eef0f3')}
      {RED.map(([x, y], k) => (
        <g key={k} style={{ transition: suave, transform: i === 2 && k >= 10 ? 'translate(30px, 0px)' : 'none' }}>
          <circle cx={x} cy={y} r="15" fill="#c9ccd1" stroke="#8d939b" strokeWidth="1.5" />
          <T x={x} y={y + 4} t="+" s={12} />
        </g>
      ))}
      <g style={ver(i >= 1)}>
        {ELEC.map(([x, y], k) => <circle key={k} cx={x} cy={y} r="3.5" fill={AZUL} />)}
      </g>
      <T x={200} y={255} t={['Los átomos del metal sueltan sus electrones de valencia', 'Cationes en un «mar» de electrones que se mueven libres', 'Por eso conducen la corriente y se pueden doblar sin romperse'][i]} s={13} />
      <g style={ver(i === 2)}><T x={200} y={275} t="(las capas de cationes se deslizan; el mar de electrones las mantiene unidas)" s={10} peso={600} /></g>
    </svg>
  )
}
