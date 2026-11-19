import type { ReactNode } from 'react'
// Escenas vivas del área 6, tema 7 (Sistema endocrino).

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease, fill 0.8s ease, stroke 0.8s ease'
const TINTA = '#3a3a3a'
const AZUL = '#2f6fc1'
const ROJO = '#c43c3c'
const VERDE = '#3f9a5a'
const MORADO = '#7a4a9a'
const NARANJA = '#e08a2e'
const FONDO = '#f3f0ea'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c} stroke="#fff" strokeWidth="3" paintOrder="stroke">{t}</text>
}
function Ver({ si, children }: { si: boolean; children: ReactNode }) {
  return <g style={{ transition: suave, opacity: si ? 1 : 0 }}>{children}</g>
}
const idx = (lista: string[], fase: string) => Math.max(0, lista.indexOf(fase))

/* ── 1. La hormona: glándula → sangre → célula diana ────────────────────── */

const HOR = ['glandula', 'sangre', 'diana']

export function EscenaEndHormona({ fase }: { fase: string }) {
  const i = idx(HOR, fase)
  const pos = [[70, 120], [200, 150], [320, 95]]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`La hormona: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <ellipse cx="70" cy="120" rx="40" ry="30" fill="#f2c26a" stroke="#b08020" strokeWidth="2" />
      <T x={70} y={170} t="glándula" c="#a07010" s={12} />
      <path d="M 20 210 C 120 180 280 240 390 200" fill="none" stroke={ROJO} strokeWidth="30" strokeLinecap="round" opacity="0.85" />
      <T x={200} y={255} t="vaso sanguíneo" c={ROJO} s={11} />
      {/* células: dos sin receptor y una diana */}
      {[[300, 95, true], [360, 160, false], [250, 70, false]].map(([x, y, d], k) => (
        <g key={k}>
          <circle cx={x as number} cy={y as number} r="24" fill={d && i >= 2 ? '#c8e8c8' : '#eee'} stroke="#999" strokeWidth="2" style={{ transition: suave }} />
          {d && <path d={`M ${(x as number) - 24} ${(y as number) + 2} h -8 v -8 h 8`} fill="none" stroke={VERDE} strokeWidth="3" />}
        </g>
      ))}
      {Array.from({ length: 6 }, (_, k) => {
        const [x, y] = pos[Math.min(i, 2)]
        const dx = i === 2 && k === 0 ? 271 : x + (k % 3) * 12 - 12
        const dy = i === 2 && k === 0 ? 93 : y + Math.floor(k / 3) * 12 + (i === 1 ? 50 : 0)
        return <circle key={k} cx={dx} cy={dy} r="5" fill={MORADO} style={{ transition: 'cx 1.2s ease, cy 1.2s ease', opacity: i === 0 && k > 2 ? 0 : 1 }} />
      })}
      <T x={200} y={28} t={['La glándula fabrica una hormona', 'La hormona viaja por la sangre a todo el cuerpo', 'Solo responde la célula que tiene su receptor'][i]} c={AZUL} s={13} />
      <Ver si={i === 2}><T x={300} y={140} t="célula diana" c={VERDE} s={11} /></Ver>
    </svg>
  )
}

/* ── 2. Las glándulas ───────────────────────────────────────────────────── */

const GLA = ['todas', 'hipofisis', 'tiroides', 'suprarrenales', 'pancreas', 'gonadas']
const GL: Record<string, { x: number; y: number; r: number; n: string; d: string }> = {
  hipofisis: { x: 150, y: 38, r: 6, n: 'Hipotálamo e hipófisis', d: 'dirigen a las demás glándulas' },
  tiroides: { x: 150, y: 80, r: 9, n: 'Tiroides', d: 'ritmo del metabolismo' },
  suprarrenales: { x: 150, y: 168, r: 8, n: 'Suprarrenales', d: 'adrenalina y cortisol: estrés' },
  pancreas: { x: 162, y: 150, r: 9, n: 'Páncreas', d: 'insulina y glucagón: azúcar' },
  gonadas: { x: 150, y: 228, r: 9, n: 'Ovarios y testículos', d: 'hormonas sexuales: pubertad' },
}

export function EscenaEndGlandulas({ fase }: { fase: string }) {
  const f = GLA.includes(fase) ? fase : 'todas'
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Glándulas: ${f}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <path d="M 150 10 a 26 26 0 1 1 -0.1 0 Z M 100 70 Q 150 58 200 70 L 210 290 H 90 Z" fill="#f6e3d3" stroke="#d8b99c" strokeWidth="2" />
      {Object.entries(GL).map(([k, g]) => {
        const on = f === 'todas' || f === k
        return (
          <g key={k} style={{ transition: suave, opacity: on ? 1 : 0.2 }}>
            {k === 'suprarrenales'
              ? [130, 170].map((x) => <path key={x} d={`M ${x - 9} 172 Q ${x} 158 ${x + 9} 172 Z`} fill={NARANJA} />)
              : k === 'pancreas'
                ? <ellipse cx="160" cy="150" rx="26" ry="7" fill="#e8c26a" />
                : k === 'tiroides'
                  ? <path d="M 138 80 q 12 -14 24 0 q -12 10 -24 0" fill="#d06a6a" />
                  : k === 'gonadas'
                    ? [130, 170].map((x) => <circle key={x} cx={x} cy={228} r="7" fill="#c070c0" />)
                    : <circle cx={g.x} cy={g.y} r={g.r} fill={MORADO} />}
          </g>
        )
      })}
      {f === 'todas' ? (
        <>
          <T x={300} y={120} t="Glándulas endocrinas" c={AZUL} s={16} />
          <T x={300} y={142} t="sueltan hormonas a la sangre" s={11} peso={600} />
        </>
      ) : (
        <>
          <T x={300} y={120} t={GL[f].n} c={AZUL} s={15} />
          <T x={300} y={142} t={GL[f].d} s={11} peso={600} />
        </>
      )}
    </svg>
  )
}

/* ── 3. Diabetes: llave y cerradura ─────────────────────────────────────── */

const DIA = ['normal', 'tipo1', 'tipo2']

export function EscenaEndDiabetes({ fase }: { fase: string }) {
  const f = DIA.includes(fase) ? fase : 'normal'
  const entra = f === 'normal'
  const llave = f !== 'tipo1'
  const cerraduraMala = f === 'tipo2'
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Insulina y diabetes: ${f}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      {/* célula */}
      <path d="M 230 40 H 380 V 260 H 230 Z" fill="#e6f2e6" stroke={VERDE} strokeWidth="4" />
      <T x={305} y={30} t="célula" c={VERDE} s={12} />
      {/* receptor = cerradura */}
      <rect x="222" y="130" width="16" height="40" rx="4" fill={cerraduraMala ? '#999' : AZUL} style={{ transition: suave }} />
      {cerraduraMala && <path d="M 222 140 l 16 20" stroke={ROJO} strokeWidth="3" />}
      {/* insulina = llave */}
      <g style={{ transition: suave, opacity: llave ? 1 : 0, transform: `translateX(${llave ? 0 : -40}px)` }}>
        <circle cx="190" cy="150" r="10" fill="none" stroke={MORADO} strokeWidth="4" />
        <path d="M 200 150 H 220 M 212 150 v 6 M 217 150 v 6" stroke={MORADO} strokeWidth="4" />
        <T x={190} y={130} t="insulina" c={MORADO} s={10} />
      </g>
      {/* glucosa */}
      {Array.from({ length: 8 }, (_, k) => {
        const fuera = [[60 + (k % 4) * 30, 90 + Math.floor(k / 4) * 120]]
        const dentro = [[260 + (k % 4) * 30, 80 + Math.floor(k / 4) * 130]]
        const [x, y] = entra && k < 6 ? dentro[0] : fuera[0]
        return <polygon key={k} points={`${x},${y - 8} ${x + 8},${y} ${x},${y + 8} ${x - 8},${y}`} fill="#e8a020" style={{ transition: 'all 1.2s ease' }} />
      })}
      <T x={110} y={60} t="sangre" c={ROJO} s={12} />
      <T x={200} y={290} t={entra ? 'La insulina abre la puerta: la glucosa entra a la célula' : f === 'tipo1' ? 'Tipo 1: no hay insulina; la glucosa se queda en la sangre' : 'Tipo 2: hay insulina, pero la célula no le responde bien'} c={entra ? VERDE : ROJO} s={11} />
    </svg>
  )
}

/* ── 4. El estrés: adrenalina ───────────────────────────────────────────── */

const EST = ['susto', 'adrenalina', 'efectos', 'calma']

export function EscenaEndEstres({ fase }: { fase: string }) {
  const i = idx(EST, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`El estrés: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={i === 3 ? '#e6f2ea' : FONDO} style={{ transition: suave }} />
      <text x="70" y="130" textAnchor="middle" fontSize="60" style={{ transition: suave, opacity: i <= 2 ? 1 : 0.2 }}>🐕</text>
      <T x={70} y={160} t="¡GUAU!" c={ROJO} s={14} />
      <text x="230" y="150" textAnchor="middle" fontSize="70">{i === 0 ? '😨' : i === 3 ? '😌' : '😳'}</text>
      <Ver si={i >= 1 && i <= 2}>
        <T x={230} y={190} t="suprarrenales → ADRENALINA" c={NARANJA} s={12} />
      </Ver>
      <Ver si={i === 2}>
        {['💓 corazón más rápido', '🫁 respira más rápido', '🍬 más azúcar en la sangre', '👁️ pupilas grandes'].map((t, k) => (
          <T key={k} x={330} y={80 + k * 30} t={t} s={11} c={ROJO} peso={700} />
        ))}
      </Ver>
      <T x={200} y={30} t={['Un perro te ladra de repente', 'El cerebro avisa y las suprarrenales sueltan adrenalina', 'El cuerpo se prepara para pelear o huir', 'Pasado el peligro, todo vuelve a la calma'][i]} c={AZUL} s={13} />
      <Ver si={i === 3}><T x={200} y={260} t="si el estrés no para (cortisol), el cuerpo se agota" c={MORADO} s={11} /></Ver>
    </svg>
  )
}
