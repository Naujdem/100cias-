// Escenas vivas de Química, área 4, tema 6: velocidad de reacción.

const suave = 'all 1.1s cubic-bezier(.45,.05,.25,1)'
const ver = (si: boolean) => ({ transition: 'opacity 0.7s ease', opacity: si ? 1 : 0 })
const idx = (orden: string[], fase: string) => Math.max(0, orden.indexOf(fase))

const TINTA = '#3a3a3a'
const AZUL = '#3f6fb8'
const ROJO = '#c43c3c'
const VERDE = '#4f8a3c'
const AGUA = '#d7eaf7'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}
function Vaso({ x, y = 90, w = 90, h = 120, color = AGUA }: { x: number; y?: number; w?: number; h?: number; color?: string }) {
  return (
    <g>
      <rect x={x} y={y + 20} width={w} height={h - 20} fill={color} />
      <path d={`M${x} ${y} V${y + h} H${x + w} V${y}`} fill="none" stroke={TINTA} strokeWidth="3" />
    </g>
  )
}
const Burbujas = ({ x, y, w, n, dur }: { x: number; y: number; w: number; n: number; dur: number }) => (
  <g>{Array.from({ length: n }, (_, k) => (
    <circle key={k} cx={x + 8 + ((k * 29) % (w - 16))} cy={y} r={2 + (k % 3)} fill="#fff" stroke="#9bb">
      <animate attributeName="cy" values={`${y};${y - 90}`} dur={`${dur * (0.8 + (k % 4) * 0.15)}s`} begin={`${(k * 0.17) % 1}s`} repeatCount="indefinite" />
    </circle>
  ))}</g>
)

/* ── Rápidas y lentas ─────────────────────────────────────────────────── */

const VR = ['rapida', 'lenta', 'medir']

export function EscenaVelocidadReaccion({ fase }: { fase: string }) {
  const i = idx(VR, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Velocidad de reacción: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <g style={ver(i === 0)}>
        <rect x="120" y="150" width="160" height="8" rx="3" fill="#d9b779" transform="rotate(-20 200 154)" />
        <circle cx="128" cy="180" r="9" fill={ROJO} />
        <path d="M128 172 q-14 -26 0 -50 q14 24 0 50 z" fill="#f6a33c"><animate attributeName="opacity" values="1;0.6;1" dur="0.3s" repeatCount="indefinite" /></path>
        <T x={200} y={240} t="Un fósforo se enciende en un instante" s={14} c={ROJO} />
        <T x={200} y={262} t="rápidas: combustión, explosión, efervescencia" s={11} peso={600} />
      </g>
      <g style={ver(i === 1)}>
        <path d="M80 160 L300 120 L320 140 L100 182 Z" fill="#9aa1a8" stroke={TINTA} />
        <path d="M300 120 l40 -10 v40 l-20 0 z" fill="#6b4226" />
        {[[140, 160], [190, 150], [240, 145], [270, 135]].map(([x, y], k) => <ellipse key={k} cx={x} cy={y} rx="14" ry="6" fill="#a0522d" opacity="0.8" />)}
        <T x={200} y={240} t="Un machete se oxida en semanas" s={14} c={AZUL} />
        <T x={200} y={262} t="lentas: oxidación, fermentación, formación de petróleo" s={11} peso={600} />
      </g>
      <g style={ver(i === 2)}>
        <Vaso x={60} /><Burbujas x={60} y={200} w={90} n={10} dur={1.2} />
        <rect x="95" y="190" width="20" height="8" rx="3" fill="#fff" stroke="#bbb" />
        <line x1="200" y1="200" x2="360" y2="200" stroke={TINTA} /><line x1="200" y1="80" x2="200" y2="200" stroke={TINTA} />
        <path d="M200 200 Q240 100 360 92" fill="none" stroke={VERDE} strokeWidth="3" />
        <T x={280} y={218} t="tiempo" s={10} peso={600} />
        <text x="190" y="140" fontSize="10" fontWeight="700" transform="rotate(-90 190 140)" textAnchor="middle">gas formado</text>
        <T x={200} y={250} t="Velocidad: cuánto producto se forma en cada segundo" s={13} />
        <T x={200} y={272} t="(o cuánto reactivo se gasta)" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── Factores que cambian la velocidad ────────────────────────────────── */

const FV = ['temperatura', 'superficie', 'concentracion', 'catalizador']

export function EscenaFactoresVelocidad({ fase }: { fase: string }) {
  const i = idx(FV, fase)
  const izq = [['fría', 'agua fría'], ['entera', 'pastilla entera'], ['diluido', 'vinagre con agua'], ['sola', 'agua oxigenada sola']][i]
  const der = [['caliente', 'agua caliente'], ['molida', 'pastilla molida'], ['puro', 'vinagre puro'], ['con papa', '+ un trozo de papa']][i]
  const texto = ['Más temperatura → más rápido', 'Más superficie → más rápido', 'Más concentración → más rápido', 'Un catalizador acelera sin gastarse'][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Factores de la velocidad: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <g key={fase}>
        <Vaso x={60} color={i === 0 ? '#cfe4f4' : AGUA} /><Burbujas x={60} y={200} w={90} n={3} dur={2.4} />
        <Vaso x={250} color={i === 0 ? '#f6d1a8' : AGUA} /><Burbujas x={250} y={200} w={90} n={16} dur={0.9} />
        {i === 1 && <><rect x="95" y="190" width="22" height="8" rx="3" fill="#fff" stroke="#bbb" />{Array.from({ length: 10 }, (_, k) => <rect key={k} x={262 + (k * 7)} y={196} width="4" height="3" fill="#fff" stroke="#bbb" />)}</>}
        {i === 2 && <>{Array.from({ length: 4 }, (_, k) => <circle key={k} cx={75 + k * 18} cy={150} r="3" fill={ROJO} />)}{Array.from({ length: 14 }, (_, k) => <circle key={k} cx={262 + (k % 7) * 11} cy={140 + Math.floor(k / 7) * 20} r="3" fill={ROJO} />)}</>}
        {i === 3 && <path d="M280 186 q15 -12 30 0 q-15 14 -30 0 z" fill="#e8d7a8" stroke="#a88" />}
      </g>
      <T x={105} y={70} t={izq[0]} s={14} c={AZUL} /><T x={295} y={70} t={der[0]} s={14} c={ROJO} />
      <T x={105} y={232} t={izq[1]} s={10} peso={600} /><T x={295} y={232} t={der[1]} s={10} peso={600} />
      <T x={200} y={268} t={texto} s={15} c={VERDE} />
    </svg>
  )
}

/* ── Teoría de colisiones ─────────────────────────────────────────────── */

const CO = ['debil', 'orientacion', 'efectivo']

export function EscenaColisiones({ fase }: { fase: string }) {
  const i = idx(CO, fase)
  const anim = (desde: number, hasta: number, vuelta: number) => `${desde};${hasta};${vuelta}`
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Teoría de colisiones: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef2f6" />
      <g key={fase}>
        {i < 2 ? (
          <>
            <g>
              <circle cx="0" cy="130" r="18" fill={AZUL} /><circle cx={i === 1 ? -26 : 26} cy="130" r="12" fill="#9cc7e6" />
              <animateTransform attributeName="transform" type="translate" values={anim(80, 160, 80)} dur={i === 0 ? '3s' : '1.4s'} repeatCount="indefinite" />
            </g>
            <g>
              <circle cx="0" cy="130" r="18" fill={ROJO} />
              <animateTransform attributeName="transform" type="translate" values={anim(320, 228, 320)} dur={i === 0 ? '3s' : '1.4s'} repeatCount="indefinite" />
            </g>
          </>
        ) : (
          <>
            <g>
              <circle cx="0" cy="130" r="18" fill={AZUL} /><circle cx="26" cy="130" r="12" fill="#9cc7e6" />
              <animateTransform attributeName="transform" type="translate" values="80;170;170" keyTimes="0;0.45;1" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.45;0.5;1" dur="2.4s" repeatCount="indefinite" />
            </g>
            <g>
              <circle cx="0" cy="130" r="18" fill={ROJO} />
              <animateTransform attributeName="transform" type="translate" values="320;232;232" keyTimes="0;0.45;1" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.45;0.5;1" dur="2.4s" repeatCount="indefinite" />
            </g>
            <g opacity="0">
              <circle cx="190" cy="130" r="18" fill={AZUL} /><circle cx="226" cy="130" r="18" fill={ROJO} />
              <circle cx="120" cy="130" r="12" fill="#9cc7e6" />
              <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.45;0.5;1" dur="2.4s" repeatCount="indefinite" />
            </g>
            <path d="M208 100 l-6 -12 l10 4 l4 -12 l4 12 l10 -4 l-6 12" fill="#f6b73c" opacity="0">
              <animate attributeName="opacity" values="0;0;1;0" keyTimes="0;0.42;0.5;0.7" dur="2.4s" repeatCount="indefinite" />
            </path>
          </>
        )}
      </g>
      <T x={200} y={215} t={['Choque débil: rebotan y no pasa nada', 'Choque al revés: no se tocan las partes que reaccionan', 'Choque fuerte y bien orientado: ¡reaccionan!'][i]} s={13} c={i === 2 ? VERDE : ROJO} />
      <T x={200} y={240} t="Para reaccionar hay que chocar con energía suficiente" s={11} peso={600} />
      <T x={200} y={258} t="y con la orientación correcta" s={11} peso={600} />
    </svg>
  )
}

/* ── Energía de activación ────────────────────────────────────────────── */

const EA = ['colina', 'catalizador', 'endo']

export function EscenaEnergiaActivacion({ fase }: { fase: string }) {
  const i = idx(EA, fase)
  const fin = i === 2 ? 70 : 190
  const curva = (pico: number) => `M50 140 C 110 140 130 ${pico} 200 ${pico} C 270 ${pico} 290 ${fin} 350 ${fin}`
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Energía de activación: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#fff" />
      <line x1="40" y1="230" x2="370" y2="230" stroke={TINTA} /><line x1="40" y1="20" x2="40" y2="230" stroke={TINTA} />
      <text x="28" y="125" fontSize="10" fontWeight="700" transform="rotate(-90 28 125)" textAnchor="middle">energía</text>
      <T x={205} y={248} t="avance de la reacción" s={10} peso={600} />
      <path d={curva(40)} fill="none" stroke={ROJO} strokeWidth="3" style={{ transition: suave }} />
      <path d={curva(95)} fill="none" stroke={VERDE} strokeWidth="3" strokeDasharray="6 4" style={{ ...ver(i === 1), transition: suave }} />
      <line x1="200" y1="140" x2="200" y2="42" stroke={ROJO} strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1="50" y1="140" x2="210" y2="140" stroke="#999" strokeDasharray="3 3" />
      <T x={225} y={92} t="Ea" s={14} c={ROJO} />
      <T x={75} y={132} t="reactivos" s={10} />
      <T x={330} y={fin - 8} t="productos" s={10} />
      <circle cx="70" cy="128" r="0" />
      <g style={ver(i === 1)}><T x={260} y={115} t="con catalizador" s={11} c={VERDE} /></g>
      <T x={200} y={272} t={['Hay que subir una «colina» de energía para reaccionar', 'El catalizador abre un camino más bajito', 'Endotérmica: los productos quedan con más energía'][i]} s={13} />
      <T x={200} y={292} t={i === 2 ? 'absorbe calor (fotosíntesis, cocinar un huevo)' : 'exotérmica: los productos quedan más abajo y sale calor'} s={11} peso={600} />
    </svg>
  )
}

/* ── Frenar y acelerar en la cocina ───────────────────────────────────── */

const CA = ['nevera', 'sal', 'papaya']

export function EscenaConservarAlimentos({ fase }: { fase: string }) {
  const i = idx(CA, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Conservar alimentos: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <g style={ver(i === 0)}>
        <rect x="60" y="40" width="120" height="180" rx="8" fill="#eef6fb" stroke={TINTA} strokeWidth="2" />
        <circle cx="120" cy="150" r="22" fill="#e9c46a" /><T x={120} y={30} t="nevera 4 °C" s={11} c={AZUL} />
        <circle cx="290" cy="150" r="22" fill="#8a7a3a" />
        {[[275, 140], [300, 160], [295, 138]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="5" fill="#4f5a2a" />)}
        <T x={290} y={110} t="afuera 28 °C" s={11} c={ROJO} />
        <T x={200} y={255} t="El frío frena las reacciones que dañan la comida" s={13} />
      </g>
      <g style={ver(i === 1)}>
        <rect x="90" y="110" width="220" height="70" rx="8" fill="#c96a5a" />
        {Array.from({ length: 30 }, (_, k) => <rect key={k} x={95 + ((k * 37) % 210)} y={112 + ((k * 13) % 64)} width="4" height="4" fill="#fff" />)}
        <T x={200} y={90} t="carne salada al sol" s={12} />
        <T x={200} y={225} t="La sal y el secado le quitan el agua a los microbios" s={13} />
        <T x={200} y={247} t="sin agua, sus reacciones van lentísimo" s={11} peso={600} />
      </g>
      <g style={ver(i === 2)}>
        <ellipse cx="130" cy="140" rx="55" ry="38" fill="#f4a259" stroke="#d07a2c" strokeWidth="3" />
        {Array.from({ length: 8 }, (_, k) => <circle key={k} cx={110 + (k % 4) * 14} cy={132 + Math.floor(k / 4) * 16} r="4" fill="#222" />)}
        <rect x="230" y="115" width="110" height="50" rx="8" fill="#c96a5a" />
        <T x={130} y={80} t="papaya: papaína" s={12} c={VERDE} />
        <T x={285} y={100} t="carne más blanda" s={12} />
        <T x={200} y={225} t="Las enzimas de la papaya aceleran la ruptura de proteínas" s={13} />
        <T x={200} y={247} t="son catalizadores biológicos" s={11} peso={600} />
      </g>
    </svg>
  )
}
