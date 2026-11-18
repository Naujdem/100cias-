import { Particulas } from './EscenasGases.tsx'

// Escenas vivas de Química, área 4, tema 3: el agua, los líquidos y los sólidos.

const suave = 'all 1.1s cubic-bezier(.45,.05,.25,1)'
const ver = (si: boolean) => ({ transition: 'opacity 0.7s ease', opacity: si ? 1 : 0 })
const idx = (orden: string[], fase: string) => Math.max(0, orden.indexOf(fase))

const TINTA = '#3a3a3a'
const AZUL = '#3f6fb8'
const ROJO = '#c43c3c'
const VERDE = '#4f8a3c'
const O = '#e2685c', H = '#f0f0f0'
const AGUA = '#9cc7e6'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}
// Molécula de agua girada `g` grados, escala `e`.
const Mol = ({ x, y, g = 0, e = 1 }: { x: number; y: number; g?: number; e?: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${g}) scale(${e})`}>
    <circle cx="-11" cy="9" r="6" fill={H} stroke="#999" /><circle cx="11" cy="9" r="6" fill={H} stroke="#999" />
    <circle cx="0" cy="0" r="10" fill={O} stroke="#a33" />
  </g>
)

/* ── La molécula de agua y los puentes de hidrógeno ───────────────────── */

const PU = ['molecula', 'puentes', 'liquido']
const RED = [[120, 110, 0], [190, 150, 200], [260, 105, 30], [175, 70, 160], [250, 185, 250], [120, 190, 120]] as const

export function EscenaAguaPuentes({ fase }: { fase: string }) {
  const i = idx(PU, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`La molécula de agua: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef2f6" />
      <g style={ver(i === 0)}>
        <Mol x={200} y={110} e={4} />
        <T x={200} y={60} t="δ−" s={20} c={AZUL} />
        <T x={140} y={190} t="δ+" s={20} c={ROJO} /><T x={260} y={190} t="δ+" s={20} c={ROJO} />
        <T x={200} y={235} t="El oxígeno jala los electrones: el agua es polar" s={13} />
        <T x={200} y={257} t="un lado algo negativo y el otro algo positivo" s={11} peso={600} />
      </g>
      <g style={ver(i >= 1)}>
        {i >= 1 && RED.map(([x, y, g], k) => <Mol key={k} x={x} y={y} g={g} e={1.5} />)}
        {[[136, 124, 176, 140], [205, 140, 248, 115], [190, 130, 180, 86], [205, 165, 240, 180], [134, 180, 176, 160]].map(([a, b, c2, d], k) => (
          <line key={k} x1={a} y1={b} x2={c2} y2={d} stroke={VERDE} strokeWidth="3" strokeDasharray="4 4">
            {i === 2 && <animate attributeName="opacity" values="1;0.1;1" dur={`${1 + k * 0.3}s`} repeatCount="indefinite" />}
          </line>
        ))}
        <T x={200} y={245} t={i === 1 ? 'Puentes de hidrógeno: el H+ de una se pega al O− de otra' : 'En el líquido se rompen y se forman todo el tiempo'} s={13} c={VERDE} />
        <T x={200} y={267} t="De ahí salen las propiedades especiales del agua" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── Tensión superficial y capilaridad ────────────────────────────────── */

const TS = ['gota', 'zapatero', 'capilaridad']

export function EscenaTensionSuperficial({ fase }: { fase: string }) {
  const i = idx(TS, fase)
  const flecha = (x: number, y: number, dx: number, dy: number, k: number) => <line key={k} x1={x} y1={y} x2={x + dx} y2={y + dy} stroke={ROJO} strokeWidth="2.5" markerEnd="url(#ts-f)" />
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Tensión superficial: ${fase}`} className="h-full w-full">
      <defs><marker id="ts-f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill={ROJO} /></marker></defs>
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <g style={ver(i === 0)}>
        <path d="M200 40 C 250 110 300 150 290 190 C 280 235 120 235 110 190 C 100 150 150 110 200 40 Z" fill={AGUA} stroke={AZUL} strokeWidth="3" />
        <circle cx="200" cy="180" r="9" fill={O} />
        {[[22, 0], [-22, 0], [0, 22], [0, -22]].map(([dx, dy], k) => flecha(200, 180, dx, dy, k))}
        <circle cx="160" cy="112" r="9" fill={O} />
        {[[16, 14], [-14, 4], [10, 20]].map(([dx, dy], k) => flecha(160, 112, dx, dy, k + 10))}
        <T x={95} y={95} t="en la superficie:" s={10} peso={600} /><T x={95} y={108} t="la jalan hacia adentro" s={10} peso={600} />
        <T x={200} y={262} t="La superficie del agua es como una tela tensa" s={13} />
      </g>
      <g style={ver(i === 1)}>
        <rect x="0" y="160" width="400" height="140" fill={AGUA} />
        <path d="M0 160 H140 q20 10 40 0 H220 q20 10 40 0 H400" fill="none" stroke={AZUL} strokeWidth="3" />
        <ellipse cx="200" cy="140" rx="30" ry="9" fill="#6b4f2a" />
        {[[-28, 160], [-10, 168], [10, 168], [28, 160]].map(([dx, y], k) => <line key={k} x1={200} y1="142" x2={200 + dx * 2} y2={y} stroke="#6b4f2a" strokeWidth="2" />)}
        <T x={200} y={100} t="El zapatero camina sobre la quebrada" s={13} />
        <T x={200} y={230} t="sin hundirse: la superficie lo sostiene" s={12} peso={600} />
      </g>
      <g style={ver(i === 2)}>
        <rect x="0" y="200" width="400" height="100" fill={AGUA} />
        {[[100, 4, 60], [160, 8, 110], [220, 14, 160]].map(([x, w, sube], k) => (
          <g key={k}>
            <rect x={x - w / 2 - 2} y="60" width={w + 4} height="200" fill="#fff" stroke={TINTA} opacity="0.85" />
            <rect x={x - w / 2} y={200 - (180 - sube)} width={w} height={180 - sube + 60} fill={AZUL} opacity="0.7" />
          </g>
        ))}
        <path d="M290 200 q10 -90 0 -150" fill="none" stroke={VERDE} strokeWidth="8" />
        <ellipse cx="300" cy="55" rx="20" ry="9" fill={VERDE} /><ellipse cx="280" cy="80" rx="18" ry="8" fill={VERDE} />
        <T x={200} y={40} t="Capilaridad: el agua sube por tubos delgados" s={13} />
        <T x={200} y={245} t="más delgado, más sube · así sube por el papel y por las plantas" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── Calor específico ─────────────────────────────────────────────────── */

const CE = ['fogon', 'costa', 'sudor']

export function EscenaCalorEspecifico({ fase }: { fase: string }) {
  const i = idx(CE, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Calor específico del agua: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={i === 1 ? '#cfe6f7' : '#f4f1ea'} style={{ transition: suave }} />
      <g style={ver(i === 0)}>
        {[110, 290].map((x, k) => (
          <g key={x}>
            {[-20, 0, 20].map((d) => <path key={d} d={`M${x + d} 215 q-6 -10 0 -18 q6 -8 0 -16`} fill="#f6a33c" />)}
            <rect x={x - 55} y="165" width="110" height={k === 0 ? 14 : 40} rx="4" fill="#555" transform={k === 0 ? '' : 'translate(0 -26)'} />
            {k === 1 && <rect x={x - 51} y="143" width="102" height="18" fill={AGUA} />}
            <T x={x} y={110} t={k === 0 ? 'sartén vacía' : 'olla con agua'} s={12} />
            <T x={x} y={88} t={k === 0 ? '¡ya quema!' : 'apenas tibia'} s={15} c={k === 0 ? ROJO : AZUL} />
          </g>
        ))}
        <T x={200} y={255} t="Mismo fuego, mismo tiempo" s={14} />
        <T x={200} y={277} t="El agua necesita mucha energía para calentarse" s={11} peso={600} />
      </g>
      <g style={ver(i === 1)}>
        <rect x="0" y="180" width="200" height="120" fill="#3f8fd0" />
        <rect x="200" y="170" width="200" height="130" fill="#d9b779" />
        <circle cx="330" cy="55" r="24" fill="#f6b73c" />
        <T x={100} y={160} t="mar: 28 °C" s={14} c={AZUL} />
        <T x={300} y={150} t="arena: 45 °C" s={14} c={ROJO} />
        <T x={200} y={240} t="El mar se calienta y se enfría despacio" s={13} c="#fff" />
        <T x={200} y={262} t="por eso en la costa el clima es más parejo" s={11} peso={600} c="#fff" />
      </g>
      <g style={ver(i === 2)}>
        <circle cx="200" cy="80" r="30" fill="#f2d2b6" stroke={TINTA} />
        <rect x="170" y="112" width="60" height="90" rx="20" fill="#f2d2b6" stroke={TINTA} />
        {[[165, 95], [232, 100], [180, 140], [222, 160]].map(([x, y], k) => (
          <g key={k}>
            <circle cx={x} cy={y} r="4" fill={AGUA} />
            <path d={`M${x} ${y - 8} q-5 -8 0 -16`} fill="none" stroke="#bbb" strokeWidth="2">
              <animate attributeName="opacity" values="0;1;0" dur="1.6s" begin={`${k * 0.4}s`} repeatCount="indefinite" />
            </path>
          </g>
        ))}
        <T x={200} y={240} t="El sudor se evapora y se lleva el calor" s={13} />
        <T x={200} y={262} t="evaporar agua gasta muchísima energía" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── El hielo flota ───────────────────────────────────────────────────── */

const HI = ['liquido', 'hielo', 'lago']

export function EscenaHieloFlota({ fase }: { fase: string }) {
  const i = idx(HI, fase)
  const hex = (cx: number, cy: number, k: number) => (
    <g key={k}>{Array.from({ length: 6 }, (_, j) => <Mol key={j} x={cx + 34 * Math.cos(j * Math.PI / 3)} y={cy + 34 * Math.sin(j * Math.PI / 3)} g={j * 60 + 90} e={1.1} />)}</g>
  )
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`El hielo flota: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef2f6" />
      <g style={ver(i === 0)}>
        {Array.from({ length: 22 }, (_, k) => <Mol key={k} x={110 + (k % 6) * 36 + (k % 2) * 6} y={60 + Math.floor(k / 6) * 34 + (k % 3) * 5} g={k * 47} e={1.1} />)}
        <T x={200} y={225} t="Agua líquida: moléculas apretadas y desordenadas" s={13} />
        <T x={200} y={250} t="1,00 g/mL" s={16} c={AZUL} />
      </g>
      <g style={ver(i === 1)}>
        {hex(140, 110, 1)}{hex(260, 110, 2)}
        <T x={140} y={114} t="hueco" s={10} peso={600} /><T x={260} y={114} t="hueco" s={10} peso={600} />
        <T x={200} y={225} t="Hielo: los puentes forman anillos con huecos" s={13} />
        <T x={200} y={250} t="0,92 g/mL: menos denso, por eso flota" s={16} c={AZUL} />
      </g>
      <g style={ver(i === 2)}>
        <rect x="20" y="80" width="360" height="190" fill={AZUL} opacity="0.55" />
        <rect x="20" y="65" width="360" height="25" fill="#f4fbff" stroke="#9bb" />
        <path d="M150 190 q20 -14 40 0 q-20 14 -40 0 Z M150 190 l-12 -8 v16 Z" fill="#f6a33c" />
        <path d="M250 230 q16 -10 32 0 q-16 10 -32 0 Z M250 230 l-10 -6 v12 Z" fill="#f6a33c" />
        <T x={200} y={60} t="hielo arriba, 0 °C" s={11} />
        <T x={200} y={150} t="agua abajo, unos 4 °C" s={12} c="#fff" />
        <T x={200} y={290} t="El lago se congela por arriba y la vida sigue debajo" s={12} />
      </g>
    </svg>
  )
}

/* ── Presión de vapor y ebullición ────────────────────────────────────── */

const PV = ['frasco', 'calentar', 'hervir']

export function EscenaPresionVapor({ fase }: { fase: string }) {
  const i = idx(PV, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Presión de vapor: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <g style={ver(i <= 1)}>
        <rect x="120" y="50" width="160" height="170" rx="12" fill="#fff" stroke={TINTA} strokeWidth="3" />
        <rect x="123" y="150" width="154" height="67" fill={AGUA} />
        <g key={fase}><Particulas x={125} y={55} w={150} h={90} n={i === 0 ? 5 : 14} dur={i === 0 ? 2 : 1} r={4} c={AZUL} semilla={31} /></g>
        <circle cx="320" cy="80" r="24" fill="#fff" stroke={TINTA} strokeWidth="2" />
        <line x1="320" y1="80" x2="320" y2="62" stroke={ROJO} strokeWidth="3" style={{ transition: suave, transformOrigin: '320px 80px', transform: `rotate(${i === 0 ? -50 : 40}deg)` }} />
        <line x1="296" y1="80" x2="280" y2="80" stroke={TINTA} strokeWidth="3" />
        <g style={ver(i === 1)}>{[-20, 0, 20].map((d) => <path key={d} d={`M${200 + d} 250 q-6 -10 0 -18 q6 -8 0 -16`} fill="#f6a33c" />)}</g>
        <T x={200} y={275} t={i === 0 ? 'Frasco cerrado: unas moléculas escapan y otras vuelven' : 'Más caliente → más vapor → más presión de vapor'} s={12} />
      </g>
      <g style={ver(i === 2)}>
        <rect x="110" y="110" width="180" height="110" rx="6" fill="#888" />
        <rect x="114" y="120" width="172" height="96" fill={AGUA} />
        {Array.from({ length: 9 }, (_, k) => (
          <circle key={k} cx={130 + k * 18} cy="210" r={3 + (k % 3)} fill="#fff" opacity="0.9">
            <animate attributeName="cy" values="210;124" dur={`${0.8 + (k % 4) * 0.25}s`} repeatCount="indefinite" />
          </circle>
        ))}
        {[-30, 0, 30].map((d) => <path key={d} d={`M${200 + d} 250 q-6 -10 0 -18 q6 -8 0 -16`} fill="#f6a33c" />)}
        <T x={200} y={60} t="presión de vapor = presión del aire" s={14} c={ROJO} />
        <T x={200} y={82} t="→ salen burbujas de vapor: ¡hierve!" s={13} />
        <T x={200} y={280} t="Menos presión del aire (montaña) → hierve antes" s={12} peso={600} />
      </g>
    </svg>
  )
}

/* ── Sólidos cristalinos y amorfos ────────────────────────────────────── */

const SO = ['cristalino', 'amorfo', 'fundir']

export function EscenaSolidos({ fase }: { fase: string }) {
  const i = idx(SO, fase)
  const az = (k: number) => { const v = Math.sin(k * 91.7) * 1000; return v - Math.floor(v) }
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Sólidos cristalinos y amorfos: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef2f6" />
      <g style={ver(i === 0)}>
        {Array.from({ length: 30 }, (_, k) => <circle key={k} cx={110 + (k % 6) * 36} cy={50 + Math.floor(k / 6) * 34} r={(k + Math.floor(k / 6)) % 2 ? 9 : 13} fill={(k + Math.floor(k / 6)) % 2 ? '#a17fd1' : '#7dc47d'} />)}
        <T x={200} y={235} t="Cristalino: partículas en orden que se repite" s={13} />
        <T x={200} y={257} t="sal, azúcar, hielo, cuarzo, metales" s={11} peso={600} />
      </g>
      <g style={ver(i === 1)}>
        {Array.from({ length: 30 }, (_, k) => <circle key={k} cx={110 + az(k) * 180} cy={50 + az(k + 40) * 140} r="10" fill="#8fb3d9" stroke={AZUL} />)}
        <T x={200} y={235} t="Amorfo: partículas sin orden, como un líquido congelado" s={13} />
        <T x={200} y={257} t="vidrio, plástico, cera, caucho" s={11} peso={600} />
      </g>
      <g style={ver(i === 2)}>
        {[[40, 'Cristalino (hielo)', true], [220, 'Amorfo (vidrio, cera)', false]].map(([x, t, plano]) => (
          <g key={String(t)} transform={`translate(${x} 40)`}>
            <line x1="0" y1="150" x2="140" y2="150" stroke={TINTA} /><line x1="0" y1="0" x2="0" y2="150" stroke={TINTA} />
            <path d={plano ? 'M0 140 L40 90 L100 90 L140 30' : 'M0 140 C 50 110 90 70 140 30'} fill="none" stroke={ROJO} strokeWidth="3" />
            <T x={70} y={172} t={String(t)} s={11} />
            <T x={-10} y={70} t="T" s={11} />
          </g>
        ))}
        <T x={110} y={120} t="se funde a una T fija" s={10} peso={600} />
        <T x={200} y={260} t="El cristal se funde de golpe; el amorfo se ablanda poco a poco" s={12} />
      </g>
    </svg>
  )
}
