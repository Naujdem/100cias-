// Escenas vivas del área 3, tema 8 (Territorio y saberes). Contenido general: cada docente lo completa con los
// saberes de la comunidad de su colegio.

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean, mover = 'none', quieto = 'none') => ({ transition: suave, opacity: si ? 1 : 0, transform: si ? mover : quieto })
const fondo = (color: string) => <rect x="-1500" y="-1500" width="3400" height="3300" fill={color} style={{ transition: 'fill 0.8s' }} />

const VERDE = '#3f9a5a'
const AZUL = '#3f6fb8'
const TIERRA = '#8a6a42'
const MOR = '#8a5aa8'
const TINTA = '#3a3a3a'

function Texto({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}

/* ── El territorio: más que tierra ────────────────────────────────────── */

const TER = ['tierra', 'agua', 'seres', 'personas', 'memoria']

export function EscenaTerritorio({ fase }: { fase: string }) {
  const i = Math.max(0, TER.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`El territorio: ${fase}`} className="h-full w-full">
      {fondo('#f4f1ea')}
      <path d="M -10 200 L 80 110 L 150 160 L 230 80 L 320 150 L 410 120 V 310 H -10 Z" fill="#9ab07a" />
      <rect x="-10" y="250" width="420" height="60" fill={TIERRA} />
      <g style={ver(i >= 1)}><path d="M 230 80 C 220 140, 160 180, 170 250 S 120 290, 100 310" fill="none" stroke="#7fb0d8" strokeWidth="8" strokeLinecap="round" /></g>
      <g style={ver(i >= 2)}>{[['🌳', 70, 190], ['🦜', 300, 120], ['🌽', 260, 230], ['🐟', 160, 250], ['🐝', 320, 200]].map(([e, x, y]) => <text key={e as string} x={x as number} y={y as number} textAnchor="middle" fontSize="24">{e}</text>)}</g>
      <g style={ver(i >= 3)}><text x="220" y="236" textAnchor="middle" fontSize="28">🏡</text><text x="110" y="232" textAnchor="middle" fontSize="24">👩‍🌾</text></g>
      <g style={ver(i === 4)}><text x="40" y="150" fontSize="26">👵</text><path d="M 70 140 q 40 -40 100 -30" fill="none" stroke={MOR} strokeWidth="2.5" strokeDasharray="5 4" /><Texto x={190} y={104} t="historias, nombres, saberes" c={MOR} s={11} /></g>
      <rect x="10" y="10" width="380" height="48" rx="10" fill="#fff" opacity="0.92" />
      <Texto x={200} y={32} t={['El territorio empieza con la tierra…', '…el agua que lo recorre…', '…los seres vivos que lo habitan…', '…las personas que lo trabajan y cuidan…', '…y la memoria: lo que se sabe de él desde hace generaciones'][i]} s={11} />
      <Texto x={200} y={50} t={i === 4 ? 'Territorio = lugar + relaciones + memoria' : ''} c={MOR} s={11} />
    </svg>
  )
}

/* ── Leer las señales: el calendario ──────────────────────────────────── */

const CAL = ['anio', 'lluvias', 'siembra', 'senales']
const MESES = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
// en buena parte de la región andina: dos temporadas de lluvias (marzo–mayo y septiembre–noviembre)
const LLUVIA = [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0]

export function EscenaCalendario({ fase }: { fase: string }) {
  const i = Math.max(0, CAL.indexOf(fase))
  const cx = 200, cy = 158, r = 92
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Calendario ecológico: ${fase}`} className="h-full w-full">
      {fondo('#eef2e8')}
      {MESES.map((m, k) => {
        const a0 = (k / 12) * 2 * Math.PI - Math.PI / 2
        const a1 = ((k + 1) / 12) * 2 * Math.PI - Math.PI / 2
        const p = (rr: number, a: number) => `${cx + rr * Math.cos(a)} ${cy + rr * Math.sin(a)}`
        const color = i >= 1 ? (LLUVIA[k] ? '#9cc4e0' : '#f2dca0') : '#f4f0e6'
        const am = (a0 + a1) / 2
        return (
          <g key={k}>
            <path d={`M ${p(40, a0)} L ${p(r, a0)} A ${r} ${r} 0 0 1 ${p(r, a1)} L ${p(40, a1)} A 40 40 0 0 0 ${p(40, a0)} Z`} fill={color} stroke="#fff" strokeWidth="2" style={{ transition: 'fill 0.8s' }} />
            <text x={cx + (r + 14) * Math.cos(am)} y={cy + (r + 14) * Math.sin(am) + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill={TINTA}>{m}</text>
            {i >= 2 && (k === 2 || k === 8) && <text x={cx + 66 * Math.cos(am)} y={cy + 66 * Math.sin(am) + 7} textAnchor="middle" fontSize="18">🌱</text>}
            {i >= 2 && (k === 6 || k === 11) && <text x={cx + 66 * Math.cos(am)} y={cy + 66 * Math.sin(am) + 7} textAnchor="middle" fontSize="18">🌽</text>}
          </g>
        )
      })}
      <Texto x={cx} y={cy + 4} t="año" s={11} />
      <rect x="10" y="10" width="380" height="40" rx="10" fill="#fff" opacity="0.92" />
      <Texto x={200} y={35} t={['El año de una comunidad que vive del campo', 'Temporadas de lluvia (azul) y de verano (amarillo)', 'Se siembra al llegar las lluvias y se cosecha después', 'Señales: floraciones, aves, hormigas, nubes, la luna'][i]} s={12} />
      <g style={ver(i === 3)}>{['🌸', '🐦', '🐜', '☁️', '🌙'].map((e, k) => <text key={e} x={30} y={90 + k * 38} fontSize="22">{e}</text>)}<Texto x={340} y={150} t="cada comunidad" c={MOR} s={10} /><Texto x={340} y={164} t="tiene las suyas" c={MOR} s={10} /></g>
      <Texto x={200} y={290} t="(ejemplo general; las fechas cambian según la región)" s={9} peso={600} />
    </svg>
  )
}

/* ── Chagra, tul o huerta: policultivo ────────────────────────────────── */

const POL = ['mono', 'poli', 'por-que']

export function EscenaPolicultivo({ fase }: { fase: string }) {
  const i = Math.max(0, POL.indexOf(fase))
  const mono = Array.from({ length: 24 }, (_, k) => [40 + (k % 8) * 42, 120 + Math.floor(k / 8) * 50])
  const poli = ['🌽', '🫘', '🎃', '🍌', '🌿', '🥔', '🌶️', '🍠', '🌽', '🍍', '🫘', '🌳']
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Policultivo: ${fase}`} className="h-full w-full">
      {fondo('#f2f5ee')}
      <rect x="20" y="90" width="360" height="170" rx="10" fill="#c9a87a" />
      <g style={ver(i === 0)}>{mono.map(([x, y], k) => <text key={k} x={x} y={y + 20} textAnchor="middle" fontSize="24">🌽</text>)}</g>
      <g style={ver(i >= 1)}>{poli.map((e, k) => <text key={k} x={60 + (k % 6) * 56} y={145 + Math.floor(k / 6) * 70} textAnchor="middle" fontSize="30">{e}</text>)}</g>
      <rect x="10" y="10" width="380" height="64" rx="10" fill="#fff" opacity="0.92" />
      <g style={ver(i === 0)}><Texto x={200} y={36} t="Monocultivo: una sola especie en todo el terreno" s={12} /><Texto x={200} y={56} t="una plaga encuentra comida de sobra" s={11} peso={600} /></g>
      <g style={ver(i === 1)}><Texto x={200} y={34} t="Policultivo: muchas especies juntas" c={VERDE} s={12} /><Texto x={200} y={52} t="la chagra amazónica, el tul nasa," s={11} peso={600} /><Texto x={200} y={66} t="la huerta campesina" s={11} peso={600} /></g>
      <g style={ver(i === 2)}><Texto x={200} y={32} t="El fríjol aporta nitrógeno al suelo, el maíz le da apoyo," c={VERDE} s={11} /><Texto x={200} y={48} t="la ahuyama cubre el suelo y guarda humedad;" c={VERDE} s={11} /><Texto x={200} y={64} t="las plagas se propagan menos" c={VERDE} s={11} /></g>
    </svg>
  )
}

/* ── Diálogo de saberes ───────────────────────────────────────────────── */

const DIA = ['dos-formas', 'puente', 'respeto']

export function EscenaDialogo({ fase }: { fase: string }) {
  const i = Math.max(0, DIA.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Diálogo de saberes: ${fase}`} className="h-full w-full">
      {fondo('#f4f1ea')}
      <g style={ver(i <= 1)}>
        <circle cx="110" cy="140" r="70" fill="#e6eef8" stroke={AZUL} strokeWidth="3" />
        <text x="110" y="132" textAnchor="middle" fontSize="34">🔬</text>
        <Texto x={110} y={168} t="ciencia" c={AZUL} s={13} />
        <Texto x={110} y={184} t="mide, experimenta" s={9} peso={600} />
        <circle cx="290" cy="140" r="70" fill="#f2ead8" stroke={TIERRA} strokeWidth="3" />
        <text x="290" y="132" textAnchor="middle" fontSize="34">👵</text>
        <Texto x={290} y={168} t="saberes" c={TIERRA} s={13} />
        <Texto x={290} y={184} t="observa por generaciones" s={9} peso={600} />
      </g>
      <g style={ver(i === 1)}>
        <path d="M 180 140 H 220" stroke={MOR} strokeWidth="6" />
        <Texto x={200} y={244} t="Pueden conversar: cada una ve cosas que la otra no" c={MOR} s={12} />
      </g>
      <g style={ver(i === 2)}>
        <Texto x={200} y={36} t="Investigar con respeto" c={MOR} s={13} />
        {[['🙏', 'pedir permiso'], ['👂', 'escuchar a los mayores'], ['✍️', 'reconocer quién lo enseñó'], ['🔁', 'devolver lo aprendido']].map(([ic, t], k) => (
          <g key={t}><rect x="60" y={56 + k * 52} width="280" height="44" rx="10" fill="#fff" stroke="#ddd" strokeWidth="2" /><text x="84" y={85 + k * 52} textAnchor="middle" fontSize="22">{ic}</text><text x="108" y={83 + k * 52} fontSize="13" fontWeight="800" fill={TINTA}>{t}</text></g>
        ))}
      </g>
      <g style={ver(i === 0)}><Texto x={200} y={36} t="Dos formas de conocer la naturaleza" s={13} /></g>
    </svg>
  )
}
