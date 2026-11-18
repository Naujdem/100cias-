// Escenas vivas de Química, área 2 (átomo), tema 1: historia de los modelos atómicos.

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean, mover = 'none', quieto = 'none') => ({ transition: suave, opacity: si ? 1 : 0, transform: si ? mover : quieto })
const fondo = (color: string) => <rect x="-1500" y="-1500" width="3400" height="3300" fill={color} style={{ transition: 'fill 0.8s' }} />
const idx = (orden: string[], fase: string) => Math.max(0, orden.indexOf(fase))
const mover = (x: number, y: number) => ({ transition: suave, transform: `translate(${x}px, ${y}px)` })

const TINTA = '#3a3a3a'
const AZUL = '#3f6fb8'
const ROJO = '#c43c3c'
const GRIS = '#8c8c8c'
const ORO = '#d9a520'
const ROSA = '#f2c6cf'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}
const Flecha = ({ id, c = '#888' }: { id: string; c?: string }) => (
  <defs>
    <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill={c} /></marker>
  </defs>
)

/* ── Demócrito: dividir hasta lo indivisible ──────────────────────────── */

const DEMOCRITO = ['piedra', 'mitad', 'granos', 'atomo']

export function EscenaDemocrito({ fase }: { fase: string }) {
  const i = idx(DEMOCRITO, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Demócrito: ${fase}`} className="h-full w-full">
      {fondo('#f4efe6')}
      <g style={ver(i === 0)}>
        <path d="M 130 200 Q 120 120 190 105 Q 270 100 280 170 Q 285 215 200 222 Q 140 225 130 200 Z" fill="#a89a86" stroke="#7d705f" strokeWidth="3" />
        <T x={200} y={260} t="Una piedra: ¿qué pasa si la parto una y otra vez?" s={13} />
      </g>
      <g style={ver(i === 1)}>
        <path d="M 110 200 Q 100 125 165 110 L 180 220 Q 125 225 110 200 Z" fill="#a89a86" stroke="#7d705f" strokeWidth="3" />
        <path d="M 220 112 Q 290 108 298 170 Q 300 212 232 220 Z" fill="#a89a86" stroke="#7d705f" strokeWidth="3" />
        <T x={200} y={260} t="Dos mitades… y cada mitad se puede partir otra vez" s={13} />
      </g>
      <g style={ver(i === 2)}>
        {Array.from({ length: 40 }, (_, k) => (
          <circle key={k} cx={120 + (k % 10) * 18 + (k % 3) * 3} cy={120 + Math.floor(k / 10) * 22 + (k % 4) * 3} r={4 + (k % 3)} fill="#a89a86" />
        ))}
        <T x={200} y={260} t="Granos cada vez más pequeños, como arena" s={13} />
      </g>
      <g style={ver(i === 3, 'none', 'scale(0.7)')}>
        <circle cx="200" cy="140" r="34" fill="#7d705f" />
        <circle cx="188" cy="128" r="9" fill="#fff" opacity="0.35" />
        <T x={200} y={210} t="«átomo» = lo que no se puede cortar" s={16} c={AZUL} />
        <T x={200} y={235} t="Una idea filosófica: no hizo experimentos" s={12} peso={600} />
      </g>
    </svg>
  )
}

/* ── Dalton: esferas macizas que se combinan ──────────────────────────── */

const DALTON = ['esfera', 'elementos', 'compuesto']
const ELEM = [
  { s: 'H', c: '#f2f2f2', r: 16, x: 110 },
  { s: 'O', c: '#e06a5a', r: 26, x: 200 },
  { s: 'C', c: '#555', r: 23, x: 290 },
]

export function EscenaDalton({ fase }: { fase: string }) {
  const i = idx(DALTON, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Dalton: ${fase}`} className="h-full w-full">
      {fondo('#eef2f6')}
      <g style={ver(i === 0)}>
        <circle cx="200" cy="140" r="60" fill="#9aa7b8" stroke="#6b7a8c" strokeWidth="3" />
        <circle cx="180" cy="118" r="16" fill="#fff" opacity="0.35" />
        <T x={200} y={240} t="Una bola maciza, sin partes por dentro" s={14} />
      </g>
      <g style={ver(i === 1)}>
        {ELEM.map((e) => (
          <g key={e.s}>
            <circle cx={e.x} cy="140" r={e.r} fill={e.c} stroke={TINTA} strokeWidth="2" />
            <T x={e.x} y={145} t={e.s} c={e.s === 'H' ? TINTA : '#fff'} s={16} />
          </g>
        ))}
        <T x={200} y={220} t="Cada elemento tiene su propio tipo de átomo," s={13} />
        <T x={200} y={240} t="con su propia masa" s={13} />
      </g>
      <g style={ver(i === 2)}>
        <circle cx="200" cy="140" r="26" fill="#e06a5a" stroke={TINTA} strokeWidth="2" />
        <circle cx="166" cy="164" r="16" fill="#f2f2f2" stroke={TINTA} strokeWidth="2" />
        <circle cx="234" cy="164" r="16" fill="#f2f2f2" stroke={TINTA} strokeWidth="2" />
        <T x={200} y={145} t="O" c="#fff" s={16} />
        <T x={166} y={169} t="H" s={13} />
        <T x={234} y={169} t="H" s={13} />
        <T x={200} y={220} t="Los compuestos unen átomos en proporciones fijas" s={13} />
        <T x={200} y={240} t="(hoy sabemos que el agua es H₂O)" s={12} peso={600} />
      </g>
    </svg>
  )
}

/* ── Thomson: el electrón y el budín con pasas ────────────────────────── */

const THOMSON = ['tubo', 'desvio', 'budin']
const PASAS: [number, number][] = [[-30, -25], [20, -35], [35, 5], [-10, 10], [-38, 20], [15, 32], [0, -8]]

export function EscenaThomson({ fase }: { fase: string }) {
  const i = idx(THOMSON, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Thomson: ${fase}`} className="h-full w-full">
      {fondo('#f1eef6')}
      <g style={ver(i <= 1)}>
        <rect x="50" y="90" width="300" height="80" rx="40" fill="#e3ecf5" stroke="#9bb0c6" strokeWidth="3" />
        <rect x="60" y="115" width="12" height="30" fill={TINTA} />
        <T x={66} y={190} t="cátodo (−)" s={10} />
        <path d={i === 0 ? 'M 72 130 L 340 130' : 'M 72 130 L 180 130 Q 260 128 330 100'} fill="none" stroke="#58c46a" strokeWidth="4" style={{ transition: 'd 1s' }} />
        <g style={ver(i === 1)}>
          <rect x="200" y="78" width="80" height="8" fill={ROJO} />
          <rect x="200" y="174" width="80" height="8" fill={AZUL} />
          <T x={240} y={72} t="+" c={ROJO} s={18} />
          <T x={240} y={200} t="−" c={AZUL} s={18} />
        </g>
        <T x={200} y={240} t={i === 0 ? 'Un rayo sale del metal negativo' : 'El rayo se dobla hacia la placa positiva:'} s={13} />
        <g style={ver(i === 1)}><T x={200} y={260} t="está hecho de partículas negativas → electrones" s={13} c={AZUL} /></g>
      </g>
      <g style={ver(i === 2, 'none', 'scale(0.8)')}>
        <circle cx="200" cy="130" r="70" fill={ROSA} stroke="#c48a96" strokeWidth="3" />
        <T x={200} y={70} t="+ + + +" c={ROJO} s={12} />
        {PASAS.map(([dx, dy], k) => (
          <g key={k}>
            <circle cx={200 + dx} cy={130 + dy} r="8" fill={AZUL} />
            <T x={200 + dx} y={134 + dy} t="−" c="#fff" s={12} />
          </g>
        ))}
        <T x={200} y={230} t="«Budín con pasas»: una masa positiva" s={13} />
        <T x={200} y={250} t="con electrones incrustados" s={13} />
      </g>
    </svg>
  )
}

/* ── Rutherford: la lámina de oro ─────────────────────────────────────── */

const RUTHERFORD = ['disparo', 'atraviesan', 'rebotan', 'nucleo']
const RAYOS = [70, 95, 120, 150, 175, 200, 225]

export function EscenaRutherford({ fase }: { fase: string }) {
  const i = idx(RUTHERFORD, fase)
  const lam = i < 3
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Rutherford: ${fase}`} className="h-full w-full">
      <Flecha id="fr-a" c={ROJO} />
      {fondo('#f5f1e6')}
      <g style={ver(lam)}>
        <rect x="20" y="130" width="50" height="30" rx="4" fill="#666" />
        <T x={45} y={180} t="fuente α" s={10} />
        <rect x="236" y="50" width="8" height="200" fill={ORO} />
        <T x={240} y={270} t="lámina de oro" s={11} />
        <g style={ver(i >= 1)}>
          {RAYOS.map((y) => <line key={y} x1="70" y1={145} x2="390" y2={y + (y - 145) * 0.2} stroke={ROJO} strokeWidth="1.5" opacity="0.6" markerEnd="url(#fr-a)" />)}
        </g>
        <g style={ver(i >= 2)}>
          <path d="M 70 145 L 240 145 L 330 70" fill="none" stroke={AZUL} strokeWidth="2.5" markerEnd="url(#fr-a)" />
          <path d="M 70 145 L 238 147 L 120 210" fill="none" stroke={AZUL} strokeWidth="2.5" markerEnd="url(#fr-a)" />
        </g>
        <g style={ver(i === 0)}><line x1="70" y1="145" x2="200" y2="145" stroke={ROJO} strokeWidth="3" markerEnd="url(#fr-a)" /></g>
        <T x={200} y={30} t={['Disparó partículas alfa (+) contra una lámina finísima', 'Casi todas pasaron derecho', 'Unas pocas se desviaron… ¡y alguna rebotó!', ''][i]} s={13} />
      </g>
      <g style={ver(i === 3, 'none', 'scale(0.6)')}>
        <circle cx="200" cy="145" r="95" fill="none" stroke="#ccc" strokeDasharray="4 5" />
        <circle cx="200" cy="145" r="6" fill={ROJO} />
        {[0, 1, 2, 3].map((k) => <circle key={k} cx={200 + 95 * Math.cos(k * 1.6)} cy={145 + 95 * Math.sin(k * 1.6)} r="5" fill={AZUL} />)}
        <path d="M 30 140 L 185 140 L 120 60" fill="none" stroke={ROJO} strokeWidth="2" opacity="0.7" />
        <T x={200} y={30} t="Un núcleo diminuto, denso y positivo" s={14} c={ROJO} />
        <T x={200} y={275} t="El átomo es casi todo espacio vacío" s={13} />
      </g>
    </svg>
  )
}

/* ── Bohr: órbitas y saltos de energía ────────────────────────────────── */

const BOHR = ['orbitas', 'salto', 'luz']
const R = [45, 80, 115]

export function EscenaBohr({ fase }: { fase: string }) {
  const i = idx(BOHR, fase)
  const r = i === 1 ? R[2] : R[0]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Bohr: ${fase}`} className="h-full w-full">
      {fondo(i === 2 ? '#1f2433' : '#eef3f7')}
      {R.map((rr, k) => (
        <g key={rr}>
          <circle cx="160" cy="150" r={rr} fill="none" stroke={i === 2 ? '#56607a' : '#9bb0c6'} strokeWidth="2" />
          <T x={160 + rr + 2} y={146} t={`n=${k + 1}`} s={9} c={i === 2 ? '#aab' : GRIS} />
        </g>
      ))}
      <circle cx="160" cy="150" r="12" fill={ROJO} />
      <g style={mover(160, 150 - r)}><circle cx="0" cy="0" r="8" fill={AZUL} stroke="#fff" strokeWidth="2" /></g>
      <g style={ver(i === 1)}>
        <path d="M 330 160 Q 300 130 250 110" fill="none" stroke={ORO} strokeWidth="3" strokeDasharray="5 4" />
        <T x={330} y={180} t="absorbe energía" s={11} />
        <T x={200} y={285} t="El electrón salta a un nivel más alto" s={13} />
      </g>
      <g style={ver(i === 2)}>
        <path d="M 160 95 q 10 -8 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0" fill="none" stroke="#57d27a" strokeWidth="3" />
        <rect x="300" y="210" width="90" height="24" fill="#000" />
        {[312, 335, 360, 378].map((x, k) => <rect key={x} x={x} y="210" width="3" height="24" fill={['#7a4cff', '#3fa0ff', '#57d27a', '#ff4b4b'][k]} />)}
        <T x={345} y={250} t="espectro: solo ciertos colores" s={9} c="#dde" />
        <T x={200} y={285} t="Al volver, suelta esa energía como luz de un color" s={13} c="#fff" />
      </g>
      <g style={ver(i === 0)}><T x={200} y={285} t="Los electrones giran en niveles fijos de energía" s={13} /></g>
    </svg>
  )
}

/* ── Schrödinger: la nube de electrones ───────────────────────────────── */

const NUBE = ['orbita', 'nube', 'orbitales']
const PUNTOS = Array.from({ length: 160 }, (_, k) => {
  const a = k * 2.399
  const d = 70 * Math.sqrt(((k * 37) % 160) / 160) * (0.4 + ((k * 13) % 10) / 16)
  return [200 + d * Math.cos(a), 140 + d * Math.sin(a)] as [number, number]
})

export function EscenaNube({ fase }: { fase: string }) {
  const i = idx(NUBE, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Modelo actual: ${fase}`} className="h-full w-full">
      {fondo('#f2f0f7')}
      <g style={ver(i === 0)}>
        <circle cx="200" cy="140" r="70" fill="none" stroke="#9bb0c6" strokeWidth="2" />
        <circle cx="270" cy="140" r="8" fill={AZUL} />
        <T x={200} y={250} t="Bohr: el electrón en un camino fijo" s={13} />
      </g>
      <g style={ver(i === 1)}>
        {PUNTOS.map(([x, y], k) => <circle key={k} cx={x} cy={y} r="2.2" fill={AZUL} opacity="0.55" />)}
        <T x={200} y={235} t="Hoy: no sabemos su camino exacto," s={13} />
        <T x={200} y={255} t="solo dónde es más probable encontrarlo" s={13} />
      </g>
      <g style={ver(i === 2)}>
        <circle cx="110" cy="140" r="40" fill={AZUL} opacity="0.35" />
        <T x={110} y={210} t="orbital s (esfera)" s={12} />
        <ellipse cx="290" cy="105" rx="22" ry="38" fill={ROJO} opacity="0.35" />
        <ellipse cx="290" cy="175" rx="22" ry="38" fill={ROJO} opacity="0.35" />
        <T x={290} y={240} t="orbital p (dos lóbulos)" s={12} />
        <T x={200} y={275} t="Orbital: zona donde es probable hallar al electrón" s={12} peso={600} />
      </g>
      <circle cx="200" cy="140" r="7" fill={ROJO} style={ver(i < 2)} />
      <circle cx="110" cy="140" r="5" fill={ROJO} style={ver(i === 2)} />
      <circle cx="290" cy="140" r="5" fill={ROJO} style={ver(i === 2)} />
    </svg>
  )
}

/* ── Chadwick: el neutrón ─────────────────────────────────────────────── */

const CHADWICK = ['masa', 'neutron', 'nucleo']
const NUC: [number, number, boolean][] = [[-10, -8, true], [10, -8, false], [-10, 10, false], [10, 10, true], [0, 0, true], [0, -18, false]]

export function EscenaChadwick({ fase }: { fase: string }) {
  const i = idx(CHADWICK, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Chadwick: ${fase}`} className="h-full w-full">
      <Flecha id="fc-a" />
      {fondo('#eef4ee')}
      <g style={ver(i === 0)}>
        <line x1="100" y1="150" x2="300" y2="150" stroke={TINTA} strokeWidth="4" />
        <path d="M 200 150 L 185 190 L 215 190 Z" fill={TINTA} />
        <circle cx="130" cy="125" r="11" fill={ROJO} /><circle cx="155" cy="125" r="11" fill={ROJO} />
        <T x={142} y={100} t="2 protones" s={11} />
        <rect x="245" y="105" width="40" height="40" fill={GRIS} />
        <T x={265} y={100} t="masa real: 4" s={11} />
        <T x={200} y={235} t="El helio pesa el doble de lo que dan sus protones:" s={13} />
        <T x={200} y={255} t="¿qué más hay en el núcleo?" s={13} c={ROJO} />
      </g>
      <g style={ver(i === 1)}>
        <rect x="60" y="120" width="60" height="50" rx="6" fill="#b9c2b0" />
        <T x={90} y={190} t="berilio" s={11} />
        <line x1="20" y1="145" x2="58" y2="145" stroke={ROJO} strokeWidth="3" markerEnd="url(#fc-a)" />
        <T x={30} y={135} t="α" c={ROJO} s={14} />
        <line x1="125" y1="145" x2="260" y2="145" stroke={GRIS} strokeWidth="3" strokeDasharray="6 4" markerEnd="url(#fc-a)" />
        <circle cx="200" cy="145" r="11" fill={GRIS} />
        <rect x="270" y="110" width="20" height="70" fill="#f3e3b3" stroke="#c9b27a" />
        <T x={280} y={200} t="parafina" s={11} />
        <line x1="295" y1="140" x2="370" y2="120" stroke={ROJO} strokeWidth="2" markerEnd="url(#fc-a)" />
        <T x={360} y={110} t="protones" s={10} />
        <T x={200} y={245} t="Una partícula sin carga que empuja protones:" s={13} />
        <T x={200} y={265} t="el neutrón (1932)" s={13} c={AZUL} />
      </g>
      <g style={ver(i === 2, 'translate(200px, 135px) scale(3)', 'translate(200px, 135px) scale(1)')}>
        {NUC.map(([x, y, p], k) => <circle key={k} cx={x} cy={y} r="8" fill={p ? ROJO : GRIS} stroke="#fff" strokeWidth="1" />)}
      </g>
      <g style={ver(i === 2)}>
        <T x={200} y={250} t="Núcleo = protones (+) y neutrones (sin carga)" s={13} />
        <T x={200} y={270} t="Los neutrones también aportan masa" s={12} peso={600} />
      </g>
    </svg>
  )
}

/* ── Tema 2: el átomo por dentro ──────────────────────────────────────── */

const PART = ['atomo', 'nucleo', 'electrones', 'masa']
const NUC_C: [number, number, boolean][] = [[-9, -9, true], [9, -9, false], [-9, 9, false], [9, 9, true], [0, -16, true], [0, 16, false], [-17, 0, true], [17, 0, false], [0, 0, true], [-6, 4, false], [6, -3, true], [5, 6, false]]

/** Átomo de carbono-12: 6 protones, 6 neutrones, 6 electrones (2 + 4). */
export function EscenaParticulas({ fase }: { fase: string }) {
  const i = idx(PART, fase)
  const zoomN = i === 1
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Partículas del átomo: ${fase}`} className="h-full w-full">
      {fondo('#eef3f7')}
      <g style={ver(i !== 3)}>
        <g style={{ transition: suave, transform: zoomN ? 'translate(200px, 140px) scale(3.2)' : 'translate(200px, 140px) scale(1)' }}>
          {NUC_C.map(([x, y, p], k) => <circle key={k} cx={x} cy={y} r="7" fill={p ? ROJO : GRIS} stroke="#fff" strokeWidth="1" />)}
        </g>
        <g style={ver(!zoomN)}>
          <circle cx="200" cy="140" r="55" fill="none" stroke="#9bb0c6" strokeWidth="2" />
          <circle cx="200" cy="140" r="100" fill="none" stroke="#9bb0c6" strokeWidth="2" />
          {[[200, 85], [200, 195], [100, 140], [300, 140], [271, 69], [129, 211]].map(([x, y], k) => (
            <g key={k} style={ver(i >= 2 || i === 0)}><circle cx={x} cy={y} r="7" fill={AZUL} /><T x={x} y={y + 4} t="−" c="#fff" s={11} /></g>
          ))}
        </g>
        <g style={ver(zoomN)}>
          <T x={95} y={60} t="● protón (+)" c={ROJO} s={13} />
          <T x={305} y={60} t="● neutrón (sin carga)" c={GRIS} s={13} />
        </g>
        <T x={200} y={278} t={['Un átomo de carbono', 'El núcleo: 6 protones y 6 neutrones', 'Alrededor: 6 electrones (−)', ''][i]} s={14} />
      </g>
      <g style={ver(i === 3)}>
        <line x1="60" y1="170" x2="340" y2="170" stroke={TINTA} strokeWidth="4" />
        <path d="M 200 170 L 186 205 L 214 205 Z" fill={TINTA} />
        <circle cx="110" cy="150" r="18" fill={ROJO} /><T x={110} y={115} t="1 protón" s={12} />
        {Array.from({ length: 12 }, (_, k) => <circle key={k} cx={255 + (k % 6) * 12} cy={160 - Math.floor(k / 6) * 12} r="5" fill={AZUL} />)}
        <T x={290} y={115} t="1800 electrones" s={12} />
        <T x={290} y={190} t="(dibujo a escala reducida)" s={9} peso={600} />
        <T x={200} y={245} t="Un protón pesa casi como 1800 electrones:" s={13} />
        <T x={200} y={265} t="la masa del átomo está en el núcleo" s={13} c={ROJO} />
      </g>
    </svg>
  )
}

const NUMS = ['z', 'a', 'notacion']

export function EscenaNumeros({ fase }: { fase: string }) {
  const i = idx(NUMS, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Números del átomo: ${fase}`} className="h-full w-full">
      {fondo('#f4f0e8')}
      <g style={mover(i === 2 ? 70 : 110, 120)}>
        {NUC_C.map(([x, y, p], k) => <circle key={k} cx={x} cy={y} r="7" fill={p ? ROJO : GRIS} stroke="#fff" strokeWidth="1" opacity={i === 0 && !p ? 0.25 : 1} />)}
      </g>
      <g style={ver(i === 0)}>
        <T x={270} y={100} t="Z = número de protones" s={15} c={ROJO} />
        <T x={270} y={125} t="Z = 6 → carbono" s={14} />
        <T x={270} y={160} t="Z es la cédula del elemento:" s={12} peso={600} />
        <T x={270} y={178} t="si cambia, cambia el elemento" s={12} peso={600} />
      </g>
      <g style={ver(i === 1)}>
        <T x={270} y={100} t="A = protones + neutrones" s={15} />
        <T x={270} y={125} t="A = 6 + 6 = 12" s={14} />
        <T x={270} y={160} t="neutrones = A − Z" s={14} c={GRIS} />
        <T x={270} y={185} t="12 − 6 = 6" s={13} peso={600} />
      </g>
      <g style={ver(i === 2)}>
        <text x="215" y="150" textAnchor="end" fontSize="26" fontWeight="800" fill={TINTA}>12</text>
        <text x="215" y="190" textAnchor="end" fontSize="26" fontWeight="800" fill={ROJO}>6</text>
        <text x="222" y="180" fontSize="64" fontWeight="800" fill={AZUL}>C</text>
        <T x={300} y={130} t="← A (arriba)" s={12} />
        <T x={300} y={195} t="← Z (abajo)" s={12} c={ROJO} />
        <T x={200} y={260} t="Se lee «carbono-12»" s={14} />
      </g>
    </svg>
  )
}

const IONES = ['neutros', 'cede', 'iones']

export function EscenaIones({ fase }: { fase: string }) {
  const i = idx(IONES, fase)
  const pasa = i >= 1
  const capa = (cx: number, n: number, r: number, c: string, o = 0) =>
    Array.from({ length: n }, (_, k) => {
      const a = (k / n) * Math.PI * 2 + o
      return <circle key={`${cx}-${r}-${k}`} cx={cx + r * Math.cos(a)} cy={140 + r * Math.sin(a)} r="4.5" fill={c} />
    })
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Iones: ${fase}`} className="h-full w-full">
      {fondo('#f1f4ee')}
      {[[110, 'Na', 11], [290, 'Cl', 17]].map(([x, s, z]) => (
        <g key={s as string}>
          <circle cx={x as number} cy="140" r="16" fill={ROJO} />
          <T x={x as number} y={145} t={s as string} c="#fff" s={12} />
          {[32, 52, 72].map((r) => <circle key={r} cx={x as number} cy="140" r={r} fill="none" stroke="#c9d2dc" />)}
          <T x={x as number} y={40} t={`${z} protones`} s={11} peso={600} />
        </g>
      ))}
      {capa(110, 2, 32, AZUL)}{capa(110, 8, 52, AZUL)}
      {capa(290, 2, 32, AZUL)}{capa(290, 8, 52, AZUL)}{capa(290, 7, 72, AZUL, 0.3)}
      <g style={mover(pasa ? 218 : 182, 140)}><circle cx="0" cy="0" r="5.5" fill={ORO} stroke={TINTA} /></g>
      <g style={ver(i === 0)}>
        <T x={200} y={250} t="Átomos neutros: tantos electrones como protones" s={13} />
        <T x={110} y={235} t="11 e⁻" s={11} c={AZUL} /><T x={290} y={235} t="17 e⁻" s={11} c={AZUL} />
      </g>
      <g style={ver(i === 1)}><T x={200} y={250} t="El sodio cede un electrón; el cloro lo recibe" s={13} /></g>
      <g style={ver(i === 2)}>
        <T x={110} y={235} t="Na⁺ · catión" s={14} c={ROJO} />
        <T x={110} y={255} t="11 p, 10 e⁻ → carga +1" s={11} peso={600} />
        <T x={290} y={235} t="Cl⁻ · anión" s={14} c={AZUL} />
        <T x={290} y={255} t="17 p, 18 e⁻ → carga −1" s={11} peso={600} />
        <T x={200} y={285} t="Los protones no cambian: sigue siendo el mismo elemento" s={12} />
      </g>
    </svg>
  )
}

const ISOS = ['protio', 'deuterio', 'tritio', 'carbono']

export function EscenaIsotopos({ fase }: { fase: string }) {
  const i = idx(ISOS, fase)
  const nn = [0, 1, 2][Math.min(i, 2)]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Isótopos: ${fase}`} className="h-full w-full">
      {fondo(i === 3 ? '#f4efe6' : '#eef3f7')}
      <g style={ver(i < 3)}>
        <circle cx="200" cy="130" r="80" fill="none" stroke="#9bb0c6" strokeWidth="2" />
        <circle cx="280" cy="130" r="7" fill={AZUL} />
        <circle cx="200" cy="130" r="9" fill={ROJO} />
        <circle cx="185" cy="122" r="9" fill={GRIS} style={ver(nn >= 1, 'none', 'scale(0)')} />
        <circle cx="214" cy="140" r="9" fill={GRIS} style={ver(nn >= 2, 'none', 'scale(0)')} />
        <T x={200} y={240} t={['Hidrógeno-1 (protio): 1 p, 0 n', 'Hidrógeno-2 (deuterio): 1 p, 1 n', 'Hidrógeno-3 (tritio): 1 p, 2 n', ''][i]} s={14} />
        <T x={200} y={262} t={['El más común: 99,98 % del hidrógeno', 'Más pesado; forma el «agua pesada»', 'Inestable: es radiactivo', ''][i]} s={12} peso={600} />
        <T x={200} y={30} t="Mismo elemento (1 protón), distinta masa" s={13} c={ROJO} />
      </g>
      <g style={ver(i === 3)}>
        <rect x="40" y="70" width="140" height="110" rx="12" fill="#fff" stroke="#c9d2dc" />
        <T x={110} y={100} t="carbono-12" s={15} />
        <T x={110} y={125} t="6 p · 6 n" s={13} peso={600} />
        <T x={110} y={155} t="estable · ≈ 99 %" s={12} c="#4f8a3c" />
        <rect x="220" y="70" width="140" height="110" rx="12" fill="#fff" stroke={ORO} strokeWidth="2" />
        <T x={290} y={100} t="carbono-14" s={15} />
        <T x={290} y={125} t="6 p · 8 n" s={13} peso={600} />
        <T x={290} y={155} t="radiactivo" s={12} c={ROJO} />
        <T x={200} y={225} t="Los seres vivos tienen un poco de carbono-14;" s={13} />
        <T x={200} y={245} t="al morir se va perdiendo: sirve para fechar restos" s={13} />
      </g>
    </svg>
  )
}

/* ── Tema 3: los electrones en el átomo ───────────────────────────────── */

const NIVELES_E = ['niveles', 'llenar', 'ultima']
const CAP_N = [2, 8, 8]

/** Sodio: 2, 8, 1. Los niveles se llenan de adentro hacia afuera. */
export function EscenaNivelesE({ fase }: { fase: string }) {
  const i = idx(NIVELES_E, fase)
  const lleno = i === 0 ? [0, 0, 0] : [2, 8, 1]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Niveles de energía: ${fase}`} className="h-full w-full">
      {fondo('#eef3f7')}
      <circle cx="150" cy="145" r="14" fill={ROJO} />
      <T x={150} y={150} t="Na" c="#fff" s={10} />
      {CAP_N.map((cap, k) => {
        const r = 40 + k * 32
        return (
          <g key={k}>
            <circle cx="150" cy="145" r={r} fill="none" stroke={i === 2 && k === 2 ? ORO : '#9bb0c6'} strokeWidth={i === 2 && k === 2 ? 4 : 2} style={{ transition: 'stroke 0.6s' }} />
            {Array.from({ length: cap }, (_, j) => {
              const a = (j / cap) * Math.PI * 2 - Math.PI / 2
              return <circle key={j} cx={150 + r * Math.cos(a)} cy={145 + r * Math.sin(a)} r="5" fill={AZUL} style={{ transition: suave, opacity: j < lleno[k] ? 1 : 0.08 }} />
            })}
          </g>
        )
      })}
      <g style={ver(i === 0)}>
        <T x={315} y={90} t="nivel 1: hasta 2" s={12} />
        <T x={315} y={115} t="nivel 2: hasta 8" s={12} />
        <T x={315} y={140} t="nivel 3: hasta 8*" s={12} />
        <T x={315} y={175} t="*en los primeros 20 elementos" s={9} peso={600} />
      </g>
      <g style={ver(i === 1)}>
        <T x={315} y={110} t="Sodio: 11 electrones" s={13} />
        <T x={315} y={135} t="2 · 8 · 1" s={18} c={AZUL} />
        <T x={315} y={160} t="de adentro hacia afuera" s={11} peso={600} />
      </g>
      <g style={ver(i === 2)}>
        <T x={315} y={110} t="Última capa: 1 electrón" s={13} c="#a8822f" />
        <T x={315} y={135} t="electrones de valencia" s={12} />
        <T x={315} y={160} t="son los que reaccionan" s={11} peso={600} />
      </g>
      <T x={200} y={285} t={['Cada nivel tiene un cupo de electrones', 'Se llenan primero los niveles de menor energía', 'La última capa decide cómo se comporta el átomo'][i]} s={13} />
    </svg>
  )
}

const MOELLER = ['subniveles', 'diagonales', 'ejemplo']
const FILAS = [['1s'], ['2s', '2p'], ['3s', '3p', '3d'], ['4s', '4p', '4d', '4f'], ['5s', '5p', '5d', '5f'], ['6s', '6p', '6d'], ['7s', '7p']]

export function EscenaMoeller({ fase }: { fase: string }) {
  const i = idx(MOELLER, fase)
  const x0 = 60, y0 = 40, dx = 52, dy = 32
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Diagrama de Moeller: ${fase}`} className="h-full w-full">
      <Flecha id="fm-a" c={ROJO} />
      {fondo('#f4f0e8')}
      {FILAS.map((f, r) => f.map((s, c) => (
        <T key={s} x={x0 + c * dx} y={y0 + r * dy} t={s} s={14} c={i === 2 && ['1s', '2s', '2p', '3s', '3p', '4s', '3d'].includes(s) ? AZUL : TINTA} />
      )))}
      <g style={ver(i >= 1)}>
        {Array.from({ length: 8 }, (_, d) => {
          // diagonal d: empieza en la casilla (fila, col) con fila + col = d… recorrida de arriba-derecha a abajo-izquierda
          const c1 = Math.min(Math.floor(d / 2), 3), r1 = d - c1
          const r2 = Math.min(d, 6), c2 = d - r2
          if (r1 > 6 || c2 < 0) return null
          return <line key={d} x1={x0 + c1 * dx + 18} y1={y0 + r1 * dy - 16} x2={x0 + c2 * dx - 14} y2={y0 + r2 * dy + 6} stroke={ROJO} strokeWidth="1.8" opacity="0.75" markerEnd="url(#fm-a)" />
        })}
      </g>
      <g style={ver(i === 0)}>
        <T x={305} y={130} t="s: 2 e⁻ · p: 6 e⁻" s={13} />
        <T x={305} y={155} t="d: 10 e⁻ · f: 14 e⁻" s={13} />
      </g>
      <g style={ver(i === 1)}>
        <T x={300} y={140} t="Se siguen las flechas:" s={12} />
        <T x={300} y={162} t="1s 2s 2p 3s 3p 4s 3d…" s={12} c={ROJO} />
      </g>
      <g style={ver(i === 2)}>
        <T x={300} y={125} t="Hierro (26 e⁻):" s={13} />
        <T x={300} y={150} t="1s² 2s² 2p⁶ 3s²" s={13} c={AZUL} />
        <T x={300} y={172} t="3p⁶ 4s² 3d⁶" s={13} c={AZUL} />
        <T x={300} y={195} t="2+2+6+2+6+2+6 = 26" s={11} peso={600} />
      </g>
      <T x={200} y={285} t={['Cada nivel se divide en subniveles: s, p, d, f', 'El 4s se llena antes que el 3d', 'El exponente dice cuántos electrones hay'][i]} s={13} />
    </svg>
  )
}

const CAJAS = ['caja', 'pauli', 'hund']

function Caja({ x, y, f }: { x: number; y: number; f: ('u' | 'd')[] }) {
  return (
    <g>
      <rect x={x} y={y} width="34" height="34" fill="#fff" stroke={TINTA} strokeWidth="2" />
      {f.includes('u') && <path d={`M ${x + 11} ${y + 28} L ${x + 11} ${y + 6} M ${x + 6} ${y + 12} L ${x + 11} ${y + 6} L ${x + 16} ${y + 12}`} stroke={AZUL} strokeWidth="2.5" fill="none" />}
      {f.includes('d') && <path d={`M ${x + 23} ${y + 6} L ${x + 23} ${y + 28} M ${x + 18} ${y + 22} L ${x + 23} ${y + 28} L ${x + 28} ${y + 22}`} stroke={ROJO} strokeWidth="2.5" fill="none" />}
    </g>
  )
}

export function EscenaCajas({ fase }: { fase: string }) {
  const i = idx(CAJAS, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Diagrama de orbitales: ${fase}`} className="h-full w-full">
      {fondo('#eef3f7')}
      <g style={ver(i === 0)}>
        <Caja x={183} y={90} f={[]} />
        <T x={200} y={150} t="cada caja = 1 orbital" s={13} />
        <T x={200} y={172} t="cabe un máximo de 2 electrones" s={12} peso={600} />
        <T x={200} y={215} t="s: 1 caja · p: 3 · d: 5 · f: 7" s={13} c={AZUL} />
      </g>
      <g style={ver(i === 1)}>
        <Caja x={110} y={90} f={['u', 'd']} />
        <T x={127} y={150} t="✔ giros opuestos" s={12} c="#4f8a3c" />
        <rect x="256" y="90" width="34" height="34" fill="#fff" stroke={TINTA} strokeWidth="2" />
        <path d="M 267 118 L 267 96 M 262 102 L 267 96 L 272 102 M 279 118 L 279 96 M 274 102 L 279 96 L 284 102" stroke={AZUL} strokeWidth="2.5" fill="none" />
        <T x={273} y={150} t="✘ mismo giro" s={12} c={ROJO} />
        <T x={200} y={215} t="Pauli: en un orbital, dos electrones" s={13} />
        <T x={200} y={235} t="con giros (espín) opuestos" s={13} />
      </g>
      <g style={ver(i === 2)}>
        <T x={200} y={50} t="Nitrógeno: 2p³" s={14} />
        {[0, 1, 2].map((k) => <Caja key={k} x={70 + k * 36} y={80} f={['u']} />)}
        <T x={123} y={140} t="✔ uno en cada caja" s={12} c="#4f8a3c" />
        <Caja x={230} y={80} f={['u', 'd']} /><Caja x={266} y={80} f={['u']} /><Caja x={302} y={80} f={[]} />
        <T x={285} y={140} t="✘ se aparean antes" s={12} c={ROJO} />
        <T x={200} y={210} t="Hund: primero uno en cada orbital," s={13} />
        <T x={200} y={230} t="todos con el mismo giro; luego se aparean" s={13} />
        <T x={200} y={260} t="(como los pasajeros que eligen silla sola en el bus)" s={11} peso={600} />
      </g>
    </svg>
  )
}

const CUANT = ['n', 'l', 'm', 's']

export function EscenaCuanticos({ fase }: { fase: string }) {
  const i = idx(CUANT, fase)
  const filas = [
    ['n', 'principal', 'nivel: 1, 2, 3…', 'el piso del edificio'],
    ['ℓ', 'secundario', 'forma: 0 = s, 1 = p, 2 = d, 3 = f', 'el tipo de apartamento'],
    ['mℓ', 'magnético', 'orientación: de −ℓ a +ℓ', 'la puerta'],
    ['s', 'espín', 'giro: +½ o −½', 'quién de los dos inquilinos'],
  ]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Números cuánticos: ${fase}`} className="h-full w-full">
      {fondo('#f2f0f7')}
      <T x={200} y={34} t="La «dirección» de un electrón" s={15} />
      {filas.map(([sim, nom, val, ana], k) => (
        <g key={sim} style={{ transition: suave, opacity: k <= i ? 1 : 0.15 }}>
          <rect x="20" y={52 + k * 52} width="360" height="44" rx="10" fill={k === i ? '#fff' : '#ebe8f2'} stroke={k === i ? AZUL : '#d4cfe0'} strokeWidth="2" />
          <text x="48" y={81 + k * 52} textAnchor="middle" fontSize="20" fontWeight="800" fill={AZUL}>{sim}</text>
          <text x="80" y={72 + k * 52} fontSize="12" fontWeight="800" fill={TINTA}>{nom} · {val}</text>
          <text x="80" y={88 + k * 52} fontSize="11" fontWeight="600" fill={GRIS}>como {ana}</text>
        </g>
      ))}
      <g style={ver(i === 3)}><T x={200} y={280} t="Ej.: el electrón del hidrógeno → n = 1, ℓ = 0, mℓ = 0, s = +½" s={12} /></g>
    </svg>
  )
}
