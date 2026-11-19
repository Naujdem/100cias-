import type { ReactNode } from 'react'
// Escenas vivas del área 6, tema 2 (Nutrición y digestión).

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease, fill 0.8s ease, stroke 0.8s ease'
const TINTA = '#3a3a3a'
const AZUL = '#2f7fc1'
const ROJO = '#c43c3c'
const VERDE = '#3f9a5a'
const FONDO = '#f3f0ea'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c} stroke="#fff" strokeWidth="3" paintOrder="stroke">{t}</text>
}
function Ver({ si, children }: { si: boolean; children: ReactNode }) {
  return <g style={{ transition: suave, opacity: si ? 1 : 0 }}>{children}</g>
}
const idx = (lista: string[], fase: string) => Math.max(0, lista.indexOf(fase))

/* ── 1. El recorrido del alimento ───────────────────────────────────────── */

const RECORRIDO = ['boca', 'esofago', 'estomago', 'delgado', 'grueso', 'ano']
const PARADA: Record<string, { x: number; y: number; n: string; d: string }> = {
  boca: { x: 150, y: 52, n: 'Boca', d: 'dientes y saliva' },
  esofago: { x: 150, y: 100, n: 'Esófago', d: 'empuja el bolo' },
  estomago: { x: 172, y: 150, n: 'Estómago', d: 'ácido y jugos' },
  delgado: { x: 150, y: 205, n: 'Intestino delgado', d: 'termina y absorbe' },
  grueso: { x: 112, y: 200, n: 'Intestino grueso', d: 'recupera agua' },
  ano: { x: 150, y: 262, n: 'Ano', d: 'salen las heces' },
}

export function EscenaDigRecorrido({ fase }: { fase: string }) {
  const p = PARADA[fase] ?? PARADA.boca
  const i = idx(RECORRIDO, fase)
  const on = (k: string) => fase === k
  const col = (k: string, base: string) => (on(k) ? base : '#d9cfc4')
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`El recorrido del alimento: ${p.n}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      {/* silueta */}
      <path d="M 150 10 a 28 28 0 1 1 -0.1 0 Z M 95 75 Q 150 62 205 75 L 215 280 H 85 Z" fill="#f6e3d3" stroke="#d8b99c" strokeWidth="2" />
      {/* tubo digestivo */}
      <path d="M 150 50 V 130" stroke={col('esofago', '#e08a7a')} strokeWidth="9" strokeLinecap="round" style={{ transition: suave }} />
      <ellipse cx="160" cy="45" rx="14" ry="7" fill={col('boca', '#e08a7a')} style={{ transition: suave }} />
      <path d="M 150 128 C 200 118 210 160 180 172 C 165 178 150 170 148 160 Z" fill={col('estomago', '#d4705f')} style={{ transition: suave }} />
      <path d="M 112 240 V 180 H 190 V 240" fill="none" stroke={col('grueso', '#b8865a')} strokeWidth="13" strokeLinejoin="round" style={{ transition: suave }} />
      <path d="M 165 178 C 125 190 125 200 165 205 C 185 210 175 220 135 222 C 115 225 130 235 165 232" fill="none" stroke={col('delgado', '#e7a07a')} strokeWidth="8" strokeLinecap="round" style={{ transition: suave }} />
      <path d="M 150 240 V 262" stroke={col('ano', '#b8865a')} strokeWidth="8" style={{ transition: suave }} />
      {/* glándulas anexas */}
      <Ver si={i >= 2 && i <= 3}>
        <path d="M 105 140 C 105 120 150 118 150 140 C 140 158 112 160 105 140 Z" fill="#8a3a2a" opacity="0.85" />
        <T x={92} y={128} t="hígado" c="#8a3a2a" s={10} />
        <ellipse cx="185" cy="182" rx="18" ry="5" fill="#e8c26a" />
        <T x={225} y={185} t="páncreas" c="#a07a1a" s={10} />
      </Ver>
      {/* el bolo */}
      <circle cx={p.x} cy={p.y} r="8" fill="#7a5a2a" stroke="#fff" strokeWidth="2" style={{ transition: 'cx 1.1s ease, cy 1.1s ease' }} />
      <T x={310} y={120} t={p.n} c={AZUL} s={18} />
      <T x={310} y={145} t={p.d} s={12} peso={600} />
      <T x={310} y={250} t={`${i + 1} de 6`} c="#999" s={10} peso={600} />
    </svg>
  )
}

/* ── 2. Digestión mecánica y química: las enzimas como tijeras ──────────── */

const ENZ = ['mecanica', 'quimica', 'almidon', 'proteina', 'grasa']

function Cadena({ y, n, color, cortada, forma }: { y: number; n: number; color: string; cortada: boolean; forma: 'c' | 'r' }) {
  return (
    <g>
      {Array.from({ length: n }, (_, k) => {
        const x = 90 + k * 30
        return (
          <g key={k} style={{ transition: suave, transform: `translateX(${cortada ? (k - n / 2) * 10 : 0}px)` }}>
            {forma === 'c' ? <circle cx={90 + k * 30} cy={y} r="11" fill={color} /> : <rect x={79 + k * 30} y={y - 11} width="22" height="22" rx="4" fill={color} />}
            {k < n - 1 && <line x1={x + 11} y1={y} x2={x + 19} y2={y} stroke="#555" strokeWidth="3" opacity={cortada ? 0 : 1} />}
          </g>
        )
      })}
    </g>
  )
}

export function EscenaDigEnzimas({ fase }: { fase: string }) {
  const i = idx(ENZ, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`La digestión: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <Ver si={fase === 'mecanica'}>
        <T x={200} y={40} t="Mecánica: partir en pedazos" c={AZUL} s={15} />
        <rect x="80" y="110" width="80" height="80" rx="10" fill="#c99a5a" />
        <text x="200" y="160" textAnchor="middle" fontSize="30">🦷 →</text>
        {[[260, 110], [300, 115], [270, 150], [310, 155], [285, 185]].map(([x, y]) => <rect key={x + y} x={x} y={y} width="26" height="26" rx="5" fill="#c99a5a" />)}
        <T x={200} y={250} t="dientes y estómago: más superficie, la misma sustancia" s={11} peso={600} />
      </Ver>
      <Ver si={i >= 1}>
        <T x={200} y={40} t={i === 1 ? 'Química: las enzimas cortan las moléculas' : i === 2 ? 'Almidón → azúcares (amilasa: boca y páncreas)' : i === 3 ? 'Proteínas → aminoácidos (pepsina en el estómago)' : 'Grasas → ácidos grasos (lipasa; la bilis ayuda)'} c={AZUL} s={13} />
        <g style={{ transition: suave, opacity: i === 1 || i === 2 ? 1 : 0 }}><Cadena y={120} n={7} color="#e8c26a" cortada={i >= 2} forma="c" /></g>
        <g style={{ transition: suave, opacity: i === 3 ? 1 : 0 }}><Cadena y={120} n={7} color="#c46a8a" cortada={i >= 3} forma="r" /></g>
        <Ver si={i === 4}>
          {Array.from({ length: 9 }, (_, k) => <circle key={k} cx={110 + (k % 5) * 45} cy={105 + Math.floor(k / 5) * 40} r={k === 0 ? 14 : 10} fill="#f0d27a" stroke="#c9a640" strokeWidth="2" />)}
          <T x={200} y={185} t="la bilis (del hígado) parte la grasa en gotitas" s={11} peso={600} />
        </Ver>
        <text x="200" y="215" textAnchor="middle" fontSize="30" style={{ transition: suave, opacity: i >= 1 ? 1 : 0 }}>✂️</text>
        <T x={200} y={250} t="cada enzima corta un solo tipo de molécula" s={11} peso={600} c={VERDE} />
      </Ver>
    </svg>
  )
}

/* ── 3. La absorción: del intestino a la sangre ─────────────────────────── */

const ABS = ['tubo', 'pliegues', 'vellosidad', 'sangre']

export function EscenaDigAbsorcion({ fase }: { fase: string }) {
  const i = idx(ABS, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`La absorción: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <Ver si={i === 0}>
        <path d="M 60 150 C 120 80 160 220 220 150 S 320 80 350 150" fill="none" stroke="#e7a07a" strokeWidth="28" strokeLinecap="round" />
        <T x={200} y={60} t="Intestino delgado: unos 6 metros" c={AZUL} s={14} />
      </Ver>
      <Ver si={i === 1}>
        <path d={'M 40 200 ' + Array.from({ length: 8 }, () => 'q 20 -90 40 0').join(' ')} fill="#f2c3a8" stroke="#c97a5a" strokeWidth="3" />
        <T x={200} y={60} t="Por dentro tiene pliegues…" c={AZUL} s={14} />
      </Ver>
      <Ver si={i >= 2}>
        <path d="M 160 260 V 110 Q 200 60 240 110 V 260" fill="#f2c3a8" stroke="#c97a5a" strokeWidth="3" />
        <path d="M 185 255 V 115 Q 200 95 215 115 V 255" fill="none" stroke={ROJO} strokeWidth="5" />
        <path d="M 200 250 V 110" stroke="#e8e0a0" strokeWidth="4" />
        <T x={200} y={40} t={i === 2 ? '…y los pliegues, vellosidades' : 'Los nutrientes pasan a la sangre'} c={AZUL} s={14} />
        <T x={300} y={170} t="capilar" c={ROJO} s={11} />
        <T x={300} y={200} t="vaso linfático (grasas)" c="#a09a40" s={10} />
        {[[110, 100], [100, 150], [120, 200], [290, 100]].map(([x, y], k) => (
          <circle key={k} cx={i >= 3 ? 188 + (k % 2) * 24 : x} cy={i >= 3 ? 130 + k * 30 : y} r="6" fill={k === 3 ? '#f0d27a' : '#e8c26a'} style={{ transition: 'cx 1.2s ease, cy 1.2s ease' }} />
        ))}
      </Ver>
    </svg>
  )
}

/* ── 4. Otros animales: vaca y gallina ──────────────────────────────────── */

const ANIM = ['humano', 'vaca', 'gallina']
const CAMARAS: Record<string, { n: string; x: number; y: number; r: number; c: string }[]> = {
  humano: [{ n: 'estómago', x: 200, y: 150, r: 40, c: '#d4705f' }],
  vaca: [
    { n: 'rumen', x: 150, y: 160, r: 55, c: '#b8865a' },
    { n: 'retículo', x: 235, y: 110, r: 25, c: '#c99a5a' },
    { n: 'omaso', x: 260, y: 175, r: 22, c: '#d8b07a' },
    { n: 'abomaso', x: 310, y: 205, r: 28, c: '#d4705f' },
  ],
  gallina: [
    { n: 'buche', x: 140, y: 100, r: 28, c: '#e7a07a' },
    { n: 'proventrículo', x: 200, y: 150, r: 20, c: '#d4705f' },
    { n: 'molleja', x: 270, y: 185, r: 38, c: '#8a5a3a' },
  ],
}
const LEMA: Record<string, string> = {
  humano: 'Persona: un estómago simple',
  vaca: 'Vaca: cuatro cámaras y rumia',
  gallina: 'Gallina: sin dientes, con molleja',
}

export function EscenaDigAnimales({ fase }: { fase: string }) {
  const f = ANIM.includes(fase) ? fase : 'humano'
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={LEMA[f]} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <T x={200} y={36} t={LEMA[f]} c={AZUL} s={15} />
      <text x="60" y="95" textAnchor="middle" fontSize="40">{f === 'vaca' ? '🐄' : f === 'gallina' ? '🐔' : '🧍'}</text>
      {ANIM.map((a) => (
        <g key={a} style={{ transition: suave, opacity: a === f ? 1 : 0 }}>
          {CAMARAS[a].map((k) => (
            <g key={k.n}>
              <circle cx={k.x} cy={k.y} r={k.r} fill={k.c} opacity="0.9" />
              <T x={k.x} y={k.y + 4} t={k.n} s={11} />
            </g>
          ))}
        </g>
      ))}
      <Ver si={f === 'vaca'}>
        <T x={200} y={268} t="en el rumen, bacterias digieren la celulosa del pasto" c={VERDE} s={11} />
      </Ver>
      <Ver si={f === 'gallina'}>
        {[[262, 180], [278, 192], [270, 172]].map(([x, y]) => <circle key={x + y} cx={x} cy={y} r="4" fill="#ccc" />)}
        <T x={200} y={268} t="la molleja muele el grano con piedritas" c={VERDE} s={11} />
      </Ver>
      <Ver si={f === 'humano'}>
        <T x={200} y={268} t="no digerimos la celulosa: es la fibra" c={VERDE} s={11} />
      </Ver>
    </svg>
  )
}
