// Escenas vivas del tema 4 del área 2 (Expresión génica): del gen a la proteína, transcripción, lectura de codones,
// traducción, regulación y procesamiento del ARN.
import { COLOR_BASE } from './EscenasAdn.tsx'
import { AMINOACIDOS, traducir } from '../../lib/codigoGenetico.ts'

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean, mover = 'none', quieto = 'none') => ({ transition: suave, opacity: si ? 1 : 0, transform: si ? mover : quieto })
const fondo = (color: string) => <rect x="-1500" y="-1500" width="3400" height="3300" fill={color} style={{ transition: 'fill 0.8s' }} />

const AZUL = '#3f6fb8'
const CELESTE = '#8fb2e2'
const ARN = '#d76aa6'
const ROJO = '#c43c3c'
const VERDE = '#3f9a5a'
const MOR = '#8a5aa8'
const RIBO = '#e2b07a'
const TINTA = '#3a3a3a'
const AA_COLOR: Record<string, string> = { M: VERDE, F: '#e0a020', G: '#5f87c2', A: '#c46a3a', K: MOR, W: '#4aa0a0', '*': ROJO }
const ANTI: Record<string, string> = { A: 'U', U: 'A', G: 'C', C: 'G' }

function Texto({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}
function Letra({ x, y, w, h, b, op = 1 }: { x: number; y: number; w: number; h: number; b: string; op?: number }) {
  return (
    <g style={{ transition: 'opacity 0.6s', opacity: op }}>
      <rect x={x} y={y} width={w} height={h} rx="3" fill={COLOR_BASE[b]} />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize="10" fontWeight="900" fill="#fff">{b}</text>
    </g>
  )
}
function Aa({ x, y, l, r = 13 }: { x: number; y: number; l: string; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={AA_COLOR[l] ?? '#9a8a6a'} stroke="#fff" strokeWidth="1.5" />
      <text x={x} y={y + 3.5} textAnchor="middle" fontSize={r * 0.72} fontWeight="900" fill="#fff">{AMINOACIDOS[l]?.abrev}</text>
    </g>
  )
}

/* ── Del gen a la proteína (dogma central) ────────────────────────────── */

const DOGMA = ['gen', 'arnm', 'ribosoma', 'proteina', 'funcion']

export function EscenaDogma({ fase }: { fase: string }) {
  const i = Math.max(0, DOGMA.indexOf(fase))
  const paso = i === 0 ? 0 : i === 1 ? 1 : 2
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Del gen a la proteína: ${fase}`} className="h-full w-full">
      {fondo('#f6f1f4')}
      {/* ADN → ARN → proteína */}
      {['ADN', 'ARN', 'proteína'].map((t, k) => (
        <g key={t}>
          <rect x={60 + k * 105} y="12" width="80" height="26" rx="13" fill={k === paso ? [AZUL, ARN, VERDE][k] : '#e4dde4'} style={{ transition: 'fill 0.6s' }} />
          <Texto x={100 + k * 105} y={30} t={t} c={k === paso ? '#fff' : '#7a6a7a'} s={12} />
          {k < 2 && <Texto x={152 + k * 105} y={30} t="→" s={14} />}
        </g>
      ))}
      <g style={ver(i <= 3)}>
        <circle cx="110" cy="160" r="88" fill="#ece4f4" stroke={MOR} strokeWidth="3" />
        <Texto x={110} y={266} t="núcleo" c={MOR} s={11} />
        <rect x="40" y="150" width="140" height="7" fill={AZUL} /><rect x="40" y="162" width="140" height="7" fill={CELESTE} />
        <rect x="88" y="146" width="48" height="27" rx="4" fill="none" stroke="#e0a020" strokeWidth="3" />
        <Texto x={112} y={140} t="un gen" c="#b07a00" s={11} />
      </g>
      {/* ARNm */}
      <g style={{ transition: suave, opacity: i >= 1 && i <= 3 ? 1 : 0, transform: i >= 2 ? 'translate(180px, 40px)' : i === 1 ? 'translate(0, -40px)' : 'none' }}>
        <rect x="88" y="150" width="48" height="7" rx="3" fill={ARN} />
        <path d="M 136 153 q 20 -8 40 0 t 40 0" fill="none" stroke={ARN} strokeWidth="7" strokeLinecap="round" style={{ transition: 'opacity 0.6s', opacity: i >= 2 ? 1 : 0 }} />
        <g style={{ transition: 'opacity 0.6s', opacity: i === 1 ? 1 : 0 }}><Texto x={112} y={140} t="ARNm: copia del gen" c={ARN} s={11} /></g>
      </g>
      {/* ribosoma y proteína */}
      <g style={ver(i === 2 || i === 3)}>
        <ellipse cx="300" cy="180" rx="30" ry="20" fill={RIBO} /><ellipse cx="300" cy="202" rx="30" ry="11" fill="#cf9a62" />
        <Texto x={300} y={240} t="ribosoma" c="#a86a3a" s={11} />
      </g>
      <g style={ver(i === 3)}>
        {['M', 'F', 'G', 'A', 'K', 'W'].map((l, k) => <Aa key={k} x={300 + 22 * Math.sin(k * 1.2)} y={150 - k * 18} l={l} r={10} />)}
        <Texto x={300} y={52} t="la proteína se pliega" c={VERDE} s={11} />
      </g>
      {/* para qué sirven */}
      <g style={ver(i === 4)}>
        <Texto x={200} y={66} t="Las proteínas hacen casi todo el trabajo" s={13} />
        {[['🧪', 'Enzimas', 'aceleran reacciones'], ['💪', 'Músculo', 'actina y miosina'], ['🩸', 'Hemoglobina', 'lleva oxígeno'], ['🛡️', 'Anticuerpos', 'defienden']].map(([ic, t, s], k) => (
          <g key={t}>
            <rect x={20 + k * 92} y="96" width="84" height="120" rx="12" fill="#fff" stroke="#d9c9d9" strokeWidth="2" />
            <text x={62 + k * 92} y="140" textAnchor="middle" fontSize="26">{ic}</text>
            <Texto x={62 + k * 92} y={172} t={t} s={11} />
            <Texto x={62 + k * 92} y={190} t={s} s={9} peso={600} />
          </g>
        ))}
        <Texto x={200} y={256} t="Cada una se fabrica con las instrucciones de un gen" s={12} />
      </g>
    </svg>
  )
}

/* ── Transcripción ────────────────────────────────────────────────────── */

const TRANS = ['gen', 'abre', 'copia', 'suelta', 'sale']
const ADN_SUP = 'GCTACGGTTAGC'.split('')

export function EscenaTranscripcion({ fase }: { fase: string }) {
  const i = Math.max(0, TRANS.indexOf(fase))
  const W = 28
  const x0 = 32
  const abierto = i >= 1 && i <= 2
  const gen = (k: number) => k >= 2 && k <= 9
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Transcripción: ${fase}`} className="h-full w-full">
      {fondo('#f3f2ee')}
      {/* envoltura nuclear con un poro */}
      <g style={ver(i === 4)}>
        <path d="M 0 96 H 250 M 300 96 H 400" stroke={MOR} strokeWidth="5" />
        <Texto x={70} y={86} t="citoplasma" c={MOR} s={11} /><Texto x={70} y={118} t="núcleo" c={MOR} s={11} />
        <Texto x={275} y={86} t="poro" c={MOR} s={10} />
      </g>
      <g style={{ transition: suave, opacity: i === 4 ? 0.35 : 1 }}>
        {ADN_SUP.map((b, k) => {
          const sube = abierto && gen(k) ? -22 : 0
          const baja = abierto && gen(k) ? 22 : 0
          const x = x0 + k * W
          return (
            <g key={k}>
              <g style={{ transition: suave, transform: `translate(0, ${sube}px)` }}>
                <rect x={x} y={140} width={W} height="6" fill={AZUL} />
                <Letra x={x + 4} y={147} w={W - 8} h={16} b={b} />
              </g>
              <g style={{ transition: suave, transform: `translate(0, ${baja}px)` }}>
                <Letra x={x + 4} y={165} w={W - 8} h={16} b={{ A: 'T', T: 'A', G: 'C', C: 'G' }[b] ?? b} />
                <rect x={x} y={182} width={W} height="6" fill={CELESTE} />
              </g>
            </g>
          )
        })}
        <g style={ver(i >= 1 && i <= 2)}>
          <Texto x={x0 + 2 * W - 6} y={226} t="hebra molde →" c={AZUL} s={10} />
        </g>
      </g>
      {/* ARN que se forma frente a la hebra de abajo (molde) */}
      <g style={{ transition: suave, opacity: i >= 2 ? 1 : 0, transform: i === 3 ? 'translate(0, -78px)' : i === 4 ? 'translate(0, -120px)' : 'none' }}>
        {ADN_SUP.map((b, k) => gen(k) && (i >= 3 || k <= 7) ? (
          <g key={k}>
            <Letra x={x0 + k * W + 4} y={170} w={W - 8} h={16} b={b === 'T' ? 'U' : b} />
          </g>
        ) : null)}
        <rect x={x0 + 2 * W} y={164} width={W * (i >= 3 ? 8 : 6)} height="5" fill={ARN} />
        <g style={{ transition: 'opacity 0.6s', opacity: i >= 3 ? 1 : 0 }}><Texto x={x0 + 6 * W} y={158} t="ARN mensajero" c={ARN} s={11} /></g>
      </g>
      {/* ARN polimerasa */}
      <g style={{ transition: suave, opacity: i >= 1 && i <= 2 ? 1 : 0, transform: `translate(${i === 2 ? 6 * W : 0}px, 0)` }}>
        <ellipse cx={x0 + 3 * W} cy={164} rx="30" ry="46" fill={VERDE} opacity="0.35" stroke={VERDE} strokeWidth="2" />
      </g>
      <g style={ver(i === 0)}>
        <rect x={x0 + 2 * W - 2} y={136} width={W * 8 + 4} height="56" rx="6" fill="none" stroke="#e0a020" strokeWidth="3" strokeDasharray="6 4" />
        <Texto x={200} y={90} t="Un gen dentro del ADN, en el núcleo" s={13} />
      </g>
      <g style={ver(i === 1)}><Texto x={200} y={70} t="La ARN polimerasa abre el gen" c={VERDE} s={13} /></g>
      <g style={ver(i === 2)}><Texto x={200} y={60} t="Lee una hebra y arma el ARN:" c={VERDE} s={12} /><Texto x={200} y={76} t="frente a A pone U; frente a T, A; G con C" s={11} peso={600} /></g>
      <g style={ver(i === 3)}><Texto x={200} y={256} t="El ADN se vuelve a cerrar; el ARN se suelta" s={12} /></g>
      <g style={ver(i === 4)}><Texto x={200} y={262} t="El ARNm sale del núcleo hacia los ribosomas" c={ARN} s={12} /></g>
    </svg>
  )
}

/* ── Leer el ARNm de a tres ───────────────────────────────────────────── */

const LECT = ['letras', 'tripletes', 'traduce', 'inicio-fin']
const ARNM = ['AUG', 'GCU', 'UUC', 'GGA', 'UAA']

export function EscenaLecturaCodones({ fase }: { fase: string }) {
  const i = Math.max(0, LECT.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Lectura de codones: ${fase}`} className="h-full w-full">
      {fondo('#f6f1f4')}
      <Texto x={200} y={40} t={['Un ARNm: una fila de letras', 'Se lee de a tres: cada grupo es un codón', 'Cada codón indica un aminoácido', 'Empieza en AUG y termina en un codón de parada'][i]} s={13} />
      <rect x="22" y="96" width="356" height="6" fill={ARN} />
      {ARNM.map((cod, k) => {
        const x = 30 + k * 70 + (i >= 1 ? 0 : 4)
        const aa = traducir(cod)
        return (
          <g key={k}>
            {cod.split('').map((b, j) => <Letra key={j} x={x + j * 20 + (i >= 1 ? 0 : -k * 2)} y={104} w={18} h={22} b={b} />)}
            <g style={ver(i >= 1)}>
              <path d={`M ${x} 134 v 6 h 58 v -6`} fill="none" stroke={TINTA} strokeWidth="2" />
              <Texto x={x + 29} y={156} t="codón" s={9} peso={600} />
            </g>
            <g style={ver(i >= 2, 'none', 'translate(0, -16px)')}>
              <path d={`M ${x + 29} 162 v 18`} stroke="#999" strokeWidth="2" />
              <Aa x={x + 29} y={200} l={aa} r={18} />
              <Texto x={x + 29} y={234} t={aa === '*' ? 'parada' : AMINOACIDOS[aa].nombre.replace(' (inicio)', '')} s={9} peso={700} />
            </g>
            {i === 3 && (k === 0 || k === 4) && (
              <rect x={x - 4} y={98} width="66" height="34" rx="6" fill="none" stroke={k === 0 ? VERDE : ROJO} strokeWidth="3" />
            )}
          </g>
        )
      })}
      <g style={ver(i === 3)}>
        <Texto x={59} y={86} t="inicio" c={VERDE} s={11} /><Texto x={339} y={86} t="parada" c={ROJO} s={11} />
        <Texto x={200} y={270} t="64 codones para 20 aminoácidos: varios codones dan el mismo" s={11} />
      </g>
    </svg>
  )
}

/* ── Traducción ───────────────────────────────────────────────────────── */

const TRAD = ['llega', 'inicio', 'arnt', 'enlace', 'avanza', 'fin']
const CODS = ['AUG', 'UUC', 'GGA', 'UAA']
const CW = 78
const CX0 = 44

function Arnt({ x, codon, aas, visible, salir = false }: { x: number; codon: string; aas: string[]; visible: boolean; salir?: boolean }) {
  const anti = codon.split('').map((b) => ANTI[b])
  return (
    <g style={{ transition: suave, opacity: visible ? 1 : 0, transform: salir ? 'translate(-60px, -70px)' : visible ? 'none' : 'translate(30px, -60px)' }}>
      <path d={`M ${x - 22} 172 q -8 -26 22 -38 q 30 12 22 38 z`} fill="#b9d6a8" stroke="#6a9a5a" strokeWidth="2" />
      <rect x={x - 4} y={112} width="8" height="24" fill="#6a9a5a" />
      {anti.map((b, j) => <Letra key={j} x={x - 27 + j * 18} y={174} w={17} h={18} b={b} />)}
      {aas.map((l, k) => <Aa key={k} x={x - k * 22} y={100 - k * 6} l={l} r={12} />)}
    </g>
  )
}

export function EscenaTraduccion({ fase }: { fase: string }) {
  const i = Math.max(0, TRAD.indexOf(fase))
  const pos = i === 5 ? 2 : i === 4 ? 1 : 0 // codón en el sitio P
  const ribX = CX0 + (pos + 1) * CW
  const cadenaLibre = i === 5
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Traducción: ${fase}`} className="h-full w-full">
      {fondo('#f6f1f4')}
      {/* ribosoma */}
      <g style={{ transition: suave, opacity: i >= 1 ? 1 : 0, transform: `translate(${ribX - 200}px, 0)` }}>
        <ellipse cx="200" cy="150" rx="86" ry="58" fill={RIBO} opacity="0.55" />
        <rect x="122" y="112" width="74" height="76" rx="8" fill="#fff" opacity="0.35" /><rect x="204" y="112" width="74" height="76" rx="8" fill="#fff" opacity="0.35" />
        <Texto x={159} y={128} t="P" c="#a86a3a" s={11} /><Texto x={241} y={128} t="A" c="#a86a3a" s={11} />
      </g>
      {/* ARNm */}
      <rect x="20" y="196" width="360" height="6" fill={ARN} />
      {CODS.map((cod, k) => cod.split('').map((b, j) => <Letra key={`${k}${j}`} x={CX0 + k * CW + j * 22} y={203} w={20} h={20} b={b} />))}
      <g style={{ transition: suave, opacity: i >= 1 ? 1 : 0, transform: `translate(${ribX - 200}px, 0)` }}>
        <ellipse cx="200" cy="240" rx="86" ry="22" fill="#cf9a62" opacity="0.85" />
      </g>
      <g style={ver(i === 0, 'none', 'translate(0, 30px)')}>
        <ellipse cx="122" cy="252" rx="60" ry="18" fill="#cf9a62" opacity="0.6" />
        <Texto x={200} y={50} t="El ARNm llega al ribosoma, en el citoplasma" s={12} />
      </g>
      {/* ARNt 1: Met */}
      <Arnt x={CX0 + 33} codon="AUG" aas={i === 1 || i === 2 ? ['M'] : []} visible={i >= 1 && i <= 4} salir={i === 4} />
      {/* ARNt 2: Phe */}
      <Arnt x={CX0 + CW + 33} codon="UUC" aas={i === 2 ? ['F'] : i >= 3 && i <= 4 ? ['F', 'M'] : []} visible={i >= 2 && i <= 4} />
      {/* ARNt 3: Gly */}
      <Arnt x={CX0 + 2 * CW + 33} codon="GGA" aas={i === 4 ? ['G'] : []} visible={i === 4} />
      {/* cadena liberada */}
      <g style={ver(cadenaLibre, 'none', 'translate(0, 20px)')}>
        {['M', 'F', 'G'].map((l, k) => <Aa key={k} x={176 + k * 24} y={70 + 10 * Math.sin(k)} l={l} r={12} />)}
        <Texto x={200} y={40} t="Codón de parada: la proteína se suelta" c={ROJO} s={12} />
      </g>
      <g fontWeight="800" fontSize="12" fill={TINTA}>
        <g style={ver(i === 1)}><Texto x={200} y={36} t="Empieza en AUG: llega el ARNt de la metionina" c={VERDE} s={12} /></g>
        <g style={ver(i === 2)}><Texto x={200} y={36} t="Llega el ARNt cuyo anticodón encaja con UUC" s={12} /></g>
        <g style={ver(i === 3)}><Texto x={200} y={36} t="Se unen los aminoácidos (enlace peptídico)" s={12} /></g>
        <g style={ver(i === 4)}><Texto x={200} y={30} t="El ribosoma avanza un codón;" s={12} /><Texto x={200} y={46} t="sale un ARNt y entra otro" s={12} /></g>
      </g>
      <g style={ver(i >= 2 && i <= 4)}><Texto x={360} y={270} t="ARNt" c="#6a9a5a" s={11} /><Texto x={44} y={270} t="ARNm" c={ARN} s={11} /></g>
    </svg>
  )
}

/* ── Genes encendidos y apagados ──────────────────────────────────────── */

const REGU = ['mismo', 'encendidos', 'interruptor']
const GENES = ['#e0a020', ROJO, VERDE, MOR, '#4aa0a0']
const CELULAS = [
  { t: 'Neurona', on: [0, 3], forma: 'M -30 0 q 0 -26 30 -26 q 30 0 30 26 q 0 26 -30 26 q -30 0 -30 -26 M 30 0 h 30 M -30 -6 l -26 -18 M -30 8 l -26 18 M 0 -26 l 0 -22' },
  { t: 'Músculo', on: [1, 3], forma: 'M -60 -14 q 60 -20 120 0 v 28 q -60 20 -120 0 z' },
  { t: 'Glóbulo rojo', on: [2, 3], forma: 'M -32 0 a 32 24 0 1 0 64 0 a 32 24 0 1 0 -64 0' },
]

export function EscenaRegulacion({ fase }: { fase: string }) {
  const i = Math.max(0, REGU.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Regulación de genes: ${fase}`} className="h-full w-full">
      {fondo('#f3f2ee')}
      <g style={ver(i <= 1)}>
        <Texto x={200} y={28} t={i === 0 ? 'Todas tus células tienen el mismo ADN…' : '…pero cada tipo enciende genes distintos'} s={13} />
        {CELULAS.map((c, k) => {
          const x = 70 + k * 130
          return (
            <g key={c.t}>
              <path d={c.forma} transform={`translate(${x} 90)`} fill="#fbeef3" stroke="#d99ab4" strokeWidth="3" />
              <Texto x={x} y={150} t={c.t} s={12} />
              {GENES.map((g, j) => {
                const on = i === 1 && c.on.includes(j)
                return <rect key={j} x={x - 52 + j * 21} y={170} width="18" height="26" rx="3" fill={on ? g : '#d6d1cc'} stroke={on ? '#fff' : 'none'} style={{ transition: 'fill 0.6s' }} />
              })}
              <g style={ver(i === 1)}>
                <Texto x={x} y={220} t={['neurotransmisores', 'actina y miosina', 'hemoglobina'][k]} c={GENES[k === 2 ? 2 : k]} s={10} />
                <Texto x={x} y={236} t="(y genes «de base»)" s={9} peso={600} />
              </g>
            </g>
          )
        })}
        <g style={ver(i === 1)}><Texto x={200} y={276} t="Gen encendido = se transcribe y se fabrica su proteína" s={11} /></g>
      </g>
      <g style={ver(i === 2)}>
        <Texto x={200} y={30} t="¿Qué enciende un gen?" s={13} />
        <rect x="40" y="150" width="320" height="8" fill={AZUL} /><rect x="40" y="162" width="320" height="8" fill={CELESTE} />
        <rect x="80" y="144" width="60" height="32" rx="4" fill="none" stroke={TINTA} strokeWidth="2" strokeDasharray="4 3" />
        <Texto x={110} y={196} t="promotor" s={10} />
        <rect x="160" y="144" width="180" height="32" rx="4" fill="none" stroke="#e0a020" strokeWidth="3" />
        <Texto x={250} y={196} t="gen" c="#b07a00" s={11} />
        <path d="M 96 120 l 14 -12 l 14 12 v 22 h -28 z" fill={MOR} />
        <Texto x={110} y={96} t="factor de transcripción" c={MOR} s={10} />
        <ellipse cx="170" cy="160" rx="22" ry="30" fill={VERDE} opacity="0.4" stroke={VERDE} strokeWidth="2" />
        <Texto x={210} y={240} t="El factor se pega al promotor y deja entrar a la ARN polimerasa" s={10} />
        <Texto x={200} y={258} t="Sin él, el gen queda apagado" s={11} />
      </g>
    </svg>
  )
}

/* ── Intrones y exones (11°) ──────────────────────────────────────────── */

const PROC = ['pre', 'corta', 'une', 'protege', 'alternativo']
const TROZOS = [
  { t: 'exón 1', w: 70, c: AZUL, ex: true },
  { t: 'intrón', w: 50, c: '#b9b4ad', ex: false },
  { t: 'exón 2', w: 60, c: VERDE, ex: true },
  { t: 'intrón', w: 60, c: '#b9b4ad', ex: false },
  { t: 'exón 3', w: 70, c: '#e08a2e', ex: true },
]

export function EscenaSplicing({ fase }: { fase: string }) {
  const i = Math.max(0, PROC.indexOf(fase))
  let xa = 45
  let xe = 95
  const alt = i === 4
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Procesamiento del ARN: ${fase}`} className="h-full w-full">
      {fondo('#f6f1f4')}
      <Texto x={200} y={36} t={['El ARN recién copiado (pre-ARNm)', 'Los intrones se cortan', 'Los exones se unen', 'Se le pone una caperuza y una cola', 'Otra forma de unir: otra proteína'][i]} s={13} />
      {TROZOS.map((z, k) => {
        const x = xa
        xa += z.w
        let destino = x
        if (z.ex) { destino = xe; if (!(alt && k === 2)) xe += z.w }
        const quitado = !z.ex && i >= 1
        const fuera = alt && k === 2
        const mover = !z.ex
          ? (quitado ? 'translate(0, 70px)' : 'none')
          : i >= 2 ? `translate(${(fuera ? x : destino) - x}px, ${fuera ? 70 : 0}px)` : 'none'
        return (
          <g key={k} style={{ transition: suave, transform: mover, opacity: (quitado && i >= 2) || (fuera) ? 0.25 : 1 }}>
            <rect x={x} y={130} width={z.w} height="28" rx="5" fill={z.c} />
            <Texto x={x + z.w / 2} y={149} t={z.t} c="#fff" s={10} />
          </g>
        )
      })}
      <g style={ver(i >= 3)}>
        <circle cx={83} cy={144} r="12" fill={MOR} /><Texto x={83} y={120} t="caperuza" c={MOR} s={10} />
        <text x={alt ? 238 : 297} y={150} fontSize="12" fontWeight="900" fill={ARN} style={{ transition: suave }}>AAAAAA</text>
        <Texto x={alt ? 262 : 322} y={120} t="cola poli-A" c={ARN} s={10} />
      </g>
      <g style={ver(i === 2 || i === 3)}><Texto x={200} y={220} t="Solo los exones forman el ARNm maduro" s={11} /></g>
      <g style={ver(i === 4)}><Texto x={200} y={220} t="Con los mismos genes se fabrican más proteínas" s={11} /><Texto x={200} y={236} t="(empalme alternativo)" s={10} peso={600} /></g>
    </svg>
  )
}
