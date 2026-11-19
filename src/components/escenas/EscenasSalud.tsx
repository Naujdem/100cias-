import type { ReactNode } from 'react'
// Escenas vivas del área 6, tema 9 (Cuerpo y salud) y tema 10 (Reproducción humana).

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease, fill 0.8s ease, stroke 0.8s ease'
const TINTA = '#3a3a3a'
const AZUL = '#2f6fc1'
const ROJO = '#c43c3c'
const VERDE = '#3f9a5a'
const MORADO = '#7a4a9a'
const ROSA = '#d87a9a'
const FONDO = '#f3f0ea'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c} stroke="#fff" strokeWidth="3" paintOrder="stroke">{t}</text>
}
function Ver({ si, children }: { si: boolean; children: ReactNode }) {
  return <g style={{ transition: suave, opacity: si ? 1 : 0 }}>{children}</g>
}
const idx = (lista: string[], fase: string) => Math.max(0, lista.indexOf(fase))

/* ── Tema 9 · El plato saludable ────────────────────────────────────────── */

const PLATO = ['vacio', 'verduras', 'cereales', 'proteinas', 'agua']

export function EscenaSaludPlato({ fase }: { fase: string }) {
  const i = idx(PLATO, fase)
  const arco = (a0: number, a1: number) => {
    const r = 95, cx = 170, cy = 155
    const p = (a: number) => `${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)}`
    return `M ${cx} ${cy} L ${p(a0)} A ${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1)} Z`
  }
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`El plato saludable: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <circle cx="170" cy="155" r="108" fill="#fff" stroke="#ccc" strokeWidth="4" />
      <g style={{ transition: suave, opacity: i >= 1 ? 1 : 0 }}><path d={arco(Math.PI / 2, Math.PI * 1.5)} fill="#8cc87a" /><text x="120" y="160" textAnchor="middle" fontSize="30">🥦🍌</text></g>
      <g style={{ transition: suave, opacity: i >= 2 ? 1 : 0 }}><path d={arco(Math.PI * 1.5, Math.PI * 2)} fill="#e8c26a" /><text x="205" y="125" textAnchor="middle" fontSize="26">🍚</text></g>
      <g style={{ transition: suave, opacity: i >= 3 ? 1 : 0 }}><path d={arco(0, Math.PI / 2)} fill="#d88a7a" /><text x="205" y="200" textAnchor="middle" fontSize="26">🫘🥚</text></g>
      <Ver si={i >= 4}><text x="320" y="130" textAnchor="middle" fontSize="44">🥛</text><T x={320} y={165} t="agua para tomar" c={AZUL} s={11} /></Ver>
      <T x={200} y={24} t={['¿Cómo armar un plato completo?', 'La mitad: verduras y frutas', 'Un cuarto: cereales, tubérculos o plátano', 'Un cuarto: proteínas (fríjol, huevo, carne)', 'Y agua en vez de bebidas azucaradas'][i]} c={VERDE} s={13} />
    </svg>
  )
}

/* ── Tema 9 · Una noche de sueño ────────────────────────────────────────── */

const SUENO = ['acostarse', 'profundo', 'rem', 'despertar']

export function EscenaSaludSueno({ fase }: { fase: string }) {
  const i = idx(SUENO, fase)
  const ys = [80, 210, 120, 70]
  const xs = [60, 150, 250, 350]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`El sueño: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={i === 3 ? '#fdf2d8' : '#1f2a44'} style={{ transition: suave }} />
      <path d="M 40 80 C 90 80 100 210 150 210 C 200 210 210 120 250 120 C 290 120 300 200 320 200 C 340 200 345 80 360 70" fill="none" stroke="#9cc8ec" strokeWidth="4" opacity="0.7" />
      <circle cx={xs[i]} cy={ys[i]} r="10" fill="#f2d47a" style={{ transition: 'cx 1.2s ease, cy 1.2s ease' }} />
      <T x={30} y={84} t="liviano" c="#9cc8ec" s={9} /><T x={30} y={214} t="profundo" c="#9cc8ec" s={9} />
      <text x="350" y="40" textAnchor="middle" fontSize="28">{i === 3 ? '☀️' : '🌙'}</text>
      <T x={200} y={268} t={['Al acostarse: el sueño empieza liviano', 'Sueño profundo: se suelta la hormona del crecimiento y el cuerpo se repara', 'Sueño REM: se sueña y el cerebro ordena lo aprendido', 'Al despertar descansado: atento y de buen ánimo'][i]} c={i === 3 ? TINTA : '#fff'} s={11} />
      <T x={200} y={288} t="los ciclos se repiten 4 o 5 veces cada noche" c={i === 3 ? '#666' : '#cfd8e8'} s={9} peso={600} />
    </svg>
  )
}

/* ── Tema 10 · Los sistemas reproductores (esquema) ─────────────────────── */

export function EscenaRepSistemas({ fase }: { fase: string }) {
  const fem = fase !== 'masculino'
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={fem ? 'Sistema reproductor femenino (esquema)' : 'Sistema reproductor masculino (esquema)'} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <Ver si={fem}>
        <path d="M 170 110 Q 200 230 230 110 Z" fill="#f0b8c8" stroke={ROSA} strokeWidth="3" />
        <rect x="190" y="175" width="20" height="70" rx="8" fill="#f6d0dc" stroke={ROSA} strokeWidth="2" />
        <path d="M 172 115 C 140 95 120 100 100 120 M 228 115 C 260 95 280 100 300 120" fill="none" stroke={ROSA} strokeWidth="5" />
        <ellipse cx="95" cy="135" rx="16" ry="11" fill="#e8a0b8" /><ellipse cx="305" cy="135" rx="16" ry="11" fill="#e8a0b8" />
        <T x={95} y={165} t="ovario" c={MORADO} s={11} /><T x={140} y={86} t="trompa" c={MORADO} s={11} />
        <T x={200} y={150} t="útero" c={MORADO} s={11} /><T x={255} y={230} t="vagina" c={MORADO} s={11} />
        <T x={200} y={30} t="Femenino: produce óvulos y alberga el embarazo" c={AZUL} s={13} />
      </Ver>
      <Ver si={!fem}>
        <ellipse cx="170" cy="225" rx="16" ry="20" fill="#c8b0e0" /><ellipse cx="230" cy="225" rx="16" ry="20" fill="#c8b0e0" />
        <path d="M 170 205 C 150 150 180 110 200 120 M 230 205 C 250 150 220 110 200 120" fill="none" stroke={MORADO} strokeWidth="4" />
        <ellipse cx="200" cy="135" rx="16" ry="12" fill="#d8c0a0" />
        <path d="M 200 147 V 260" stroke={MORADO} strokeWidth="5" />
        <T x={110} y={232} t="testículo" c={MORADO} s={11} /><T x={120} y={150} t="conducto deferente" c={MORADO} s={10} />
        <T x={260} y={130} t="próstata" c={MORADO} s={11} /><T x={245} y={268} t="uretra" c={MORADO} s={11} />
        <T x={200} y={30} t="Masculino: produce espermatozoides" c={AZUL} s={13} />
      </Ver>
      <T x={200} y={292} t="esquema simplificado, sin escala" s={9} peso={600} />
    </svg>
  )
}

/* ── Tema 10 · Gametos y fecundación ────────────────────────────────────── */

const FEC = ['gametos', 'encuentro', 'fecundacion', 'cigoto']

export function EscenaRepFecundacion({ fase }: { fase: string }) {
  const i = idx(FEC, fase)
  const unidos = i >= 2
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Fecundación: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <circle cx={i >= 3 ? 200 : 260} cy="150" r={i >= 3 ? 50 : 60} fill="#f6e0b8" stroke="#d8a860" strokeWidth="4" style={{ transition: suave }} />
      <circle cx={i >= 3 ? 200 : 260} cy="150" r="14" fill={i >= 3 ? MORADO : '#d8a860'} style={{ transition: suave }} />
      {[0, 1, 2, 3, 4].map((k) => {
        const lejos = i === 0
        const x = lejos ? 50 + k * 8 : unidos && k === 0 ? 205 : 140 + k * 6
        const y = lejos ? 70 + k * 40 : unidos && k === 0 ? 150 : 110 + k * 22
        return (
          <g key={k} style={{ transition: 'transform 1.4s ease, opacity 0.7s ease', transform: `translate(${x}px, ${y}px)`, opacity: unidos && k > 0 ? 0.25 : 1 }}>
            <ellipse cx="0" cy="0" rx="7" ry="5" fill={AZUL} />
            <path d="M -7 0 q -10 -6 -20 0 q -10 6 -20 0" fill="none" stroke={AZUL} strokeWidth="2" />
          </g>
        )
      })}
      <T x={200} y={30} t={['Óvulo (grande) y espermatozoides (pequeños, con cola)', 'Los espermatozoides llegan a la trompa', 'Solo uno entra al óvulo: fecundación', 'Cigoto: la primera célula de un nuevo ser'][i]} c={AZUL} s={13} />
      <T x={200} y={270} t={i >= 3 ? '23 cromosomas del padre + 23 de la madre = 46' : 'cada gameto tiene 23 cromosomas (por la meiosis)'} c={MORADO} s={11} />
    </svg>
  )
}

/* ── Tema 10 · El ciclo menstrual ───────────────────────────────────────── */

const CIC = ['menstruacion', 'preparacion', 'ovulacion', 'espera']
const DIA = [3, 10, 14, 22]

export function EscenaRepCiclo({ fase }: { fase: string }) {
  const i = idx(CIC, fase)
  const a = (d: number) => (d / 28) * Math.PI * 2 - Math.PI / 2
  const sector = (d0: number, d1: number) => {
    const r = 100, cx = 150, cy = 155
    const p = (d: number) => `${cx + r * Math.cos(a(d))} ${cy + r * Math.sin(a(d))}`
    return `M ${cx} ${cy} L ${p(d0)} A ${r} ${r} 0 ${d1 - d0 > 14 ? 1 : 0} 1 ${p(d1)} Z`
  }
  const grosor = [8, 16, 22, 28][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`El ciclo menstrual: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <path d={sector(0, 5)} fill="#e88a8a" opacity={i === 0 ? 1 : 0.35} style={{ transition: suave }} />
      <path d={sector(5, 13)} fill="#f2d47a" opacity={i === 1 ? 1 : 0.35} style={{ transition: suave }} />
      <path d={sector(13, 15)} fill="#8cc87a" opacity={i === 2 ? 1 : 0.35} style={{ transition: suave }} />
      <path d={sector(15, 28)} fill="#c8b0e0" opacity={i === 3 ? 1 : 0.35} style={{ transition: suave }} />
      <circle cx="150" cy="155" r="40" fill="#fff" />
      <T x={150} y={152} t={`día ${DIA[i]}`} c={TINTA} s={14} />
      <T x={150} y={170} t="de ≈ 28" s={9} peso={600} />
      <line x1="150" y1="155" x2={150 + 100 * Math.cos(a(DIA[i]))} y2={155 + 100 * Math.sin(a(DIA[i]))} stroke={TINTA} strokeWidth="3" style={{ transition: 'all 1s ease' }} />
      {/* el endometrio */}
      <path d="M 280 120 Q 320 230 360 120 Z" fill="#f6d0dc" stroke={ROSA} strokeWidth="2" />
      <path d="M 280 120 Q 320 230 360 120" fill="none" stroke={ROJO} strokeWidth={grosor / 3} opacity="0.6" style={{ transition: suave }} />
      <Ver si={i === 2}><circle cx="370" cy="105" r="8" fill="#f6e0b8" stroke="#d8a860" strokeWidth="2" /></Ver>
      <T x={320} y={245} t="pared del útero" c={ROSA} s={10} />
      <T x={200} y={26} t={['Menstruación: sale la capa del útero que no se usó', 'El útero prepara una capa nueva; madura un óvulo', 'Ovulación: el ovario suelta un óvulo', 'Si no hay fecundación, la capa se desprende y empieza otro ciclo'][i]} c={AZUL} s={12} />
      <T x={200} y={290} t="cada ciclo dura entre 21 y 35 días; es normal que varíe" s={9} peso={600} />
    </svg>
  )
}

/* ── Tema 10 · El embarazo ──────────────────────────────────────────────── */

const EMB = ['implantacion', 'primer', 'segundo', 'tercero', 'parto']

export function EscenaRepEmbarazo({ fase }: { fase: string }) {
  const i = idx(EMB, fase)
  const tam = [6, 25, 45, 70, 70][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`El embarazo: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <ellipse cx="160" cy="160" rx={60 + tam * 0.6} ry={70 + tam * 0.5} fill="#f6d0dc" stroke={ROSA} strokeWidth="4" style={{ transition: 'all 1.2s ease' }} />
      <ellipse cx="160" cy="160" rx={tam * 0.7 + 8} ry={tam + 8} fill="#e6f0f8" opacity={i >= 1 ? 0.9 : 0} style={{ transition: 'all 1.2s ease' }} />
      <circle cx="160" cy={160 - tam * 0.45} r={Math.max(4, tam * 0.35)} fill="#f0c8a8" style={{ transition: 'all 1.2s ease', transform: i === 4 ? 'translateY(70px)' : 'none' }} />
      <ellipse cx="160" cy={160 + tam * 0.25} rx={Math.max(3, tam * 0.3)} ry={Math.max(4, tam * 0.5)} fill="#f0c8a8" style={{ transition: 'all 1.2s ease', transform: i === 4 ? 'translateY(70px)' : 'none' }} />
      <Ver si={i >= 1}><ellipse cx={160 + 55 + tam * 0.4} cy="120" rx="18" ry="10" fill="#c45a6a" /><T x={300} y={110} t="placenta" c={ROJO} s={11} /></Ver>
      <T x={300} y={170} t={['semana 1', 'semanas 1 a 12', 'semanas 13 a 27', 'semanas 28 a 40', 'semana ≈ 40'][i]} c={MORADO} s={13} />
      <T x={200} y={28} t={['El embrión se pega a la pared del útero', 'Se forman todos los órganos; late el corazón', 'Crece y se mueve; ya se siente', 'Gana peso y madura los pulmones', 'Parto: las contracciones lo empujan al exterior'][i]} c={AZUL} s={13} />
    </svg>
  )
}
