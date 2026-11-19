import type { ReactNode } from 'react'
// Escenas vivas del área 6, tema 4 (Excreción).

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease, fill 0.8s ease, stroke 0.8s ease'
const TINTA = '#3a3a3a'
const AZUL = '#2f6fc1'
const ROJO = '#c43c3c'
const VERDE = '#3f9a5a'
const AMARILLO = '#d9b030'
const FONDO = '#f3f0ea'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c} stroke="#fff" strokeWidth="3" paintOrder="stroke">{t}</text>
}
function Ver({ si, children }: { si: boolean; children: ReactNode }) {
  return <g style={{ transition: suave, opacity: si ? 1 : 0 }}>{children}</g>
}
const idx = (lista: string[], fase: string) => Math.max(0, lista.indexOf(fase))

function Silueta() {
  return <path d="M 150 10 a 28 28 0 1 1 -0.1 0 Z M 95 75 Q 150 62 205 75 L 215 285 H 85 Z" fill="#f6e3d3" stroke="#d8b99c" strokeWidth="2" />
}

/* ── 1. Los órganos que excretan ────────────────────────────────────────── */

const ORG = ['todos', 'pulmones', 'rinones', 'piel', 'higado']
const INFO: Record<string, [string, string]> = {
  todos: ['Cuatro órganos sacan desechos', 'excretar: eliminar lo que hicieron las células'],
  pulmones: ['Pulmones', 'sacan el CO₂ de la respiración celular'],
  rinones: ['Riñones', 'filtran la sangre: urea, sales y agua de más'],
  piel: ['Piel', 'el sudor saca agua, sales y un poco de urea'],
  higado: ['Hígado', 'convierte el amoníaco en urea y desarma sustancias'],
}

export function EscenaExcOrganos({ fase }: { fase: string }) {
  const f = ORG.includes(fase) ? fase : 'todos'
  const on = (k: string) => f === 'todos' || f === k
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={INFO[f][0]} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <g style={{ transition: suave }}><Silueta /></g>
      <g style={{ transition: suave, opacity: on('piel') ? 1 : 0 }}>
        <path d="M 150 10 a 28 28 0 1 1 -0.1 0 Z M 95 75 Q 150 62 205 75 L 215 285 H 85 Z" fill="none" stroke={AMARILLO} strokeWidth="5" />
      </g>
      <g style={{ transition: suave, opacity: on('pulmones') ? 1 : 0.2 }}>
        <ellipse cx="128" cy="115" rx="20" ry="32" fill="#e8a0a8" /><ellipse cx="172" cy="115" rx="20" ry="32" fill="#e8a0a8" />
      </g>
      <g style={{ transition: suave, opacity: on('higado') ? 1 : 0.2 }}>
        <path d="M 108 160 C 108 142 160 140 168 158 C 155 175 115 178 108 160 Z" fill="#8a3a2a" />
      </g>
      <g style={{ transition: suave, opacity: on('rinones') ? 1 : 0.2 }}>
        <ellipse cx="130" cy="195" rx="10" ry="16" fill="#a8504a" /><ellipse cx="170" cy="195" rx="10" ry="16" fill="#a8504a" />
      </g>
      <T x={300} y={130} t={INFO[f][0]} c={AZUL} s={16} />
      <T x={300} y={155} t={INFO[f][1]} s={10} peso={600} />
      <Ver si={f === 'todos'}><T x={300} y={200} t="las heces NO son excreción:" c={ROJO} s={10} /><T x={300} y={215} t="es comida que nunca entró a las células" s={10} peso={600} /></Ver>
    </svg>
  )
}

/* ── 2. El sistema urinario ─────────────────────────────────────────────── */

const URI = ['rinones', 'ureteres', 'vejiga', 'uretra']
const URI_TXT: Record<string, string> = {
  rinones: 'Riñones: filtran la sangre y hacen la orina',
  ureteres: 'Uréteres: llevan la orina a la vejiga',
  vejiga: 'Vejiga: la guarda',
  uretra: 'Uretra: la saca del cuerpo',
}

export function EscenaExcUrinario({ fase }: { fase: string }) {
  const i = idx(URI, fase)
  const c = (k: number, base: string) => (i === k ? base : '#d9cfc4')
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={URI_TXT[URI[i]]} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      {/* aorta y vena cava */}
      <line x1="190" y1="20" x2="190" y2="200" stroke={ROJO} strokeWidth="8" /><line x1="210" y1="20" x2="210" y2="200" stroke={AZUL} strokeWidth="8" />
      <path d="M 190 85 H 150 M 210 95 H 250" stroke={ROJO} strokeWidth="4" />
      <path d="M 120 60 C 95 60 90 120 120 125 C 140 128 145 110 140 92 C 145 75 140 60 120 60 Z" fill={c(0, '#a8504a')} style={{ transition: suave }} />
      <path d="M 280 60 C 305 60 310 120 280 125 C 260 128 255 110 260 92 C 255 75 260 60 280 60 Z" fill={c(0, '#a8504a')} style={{ transition: suave }} />
      <path d="M 135 115 C 150 160 170 190 185 215 M 265 115 C 250 160 230 190 215 215" fill="none" stroke={c(1, AMARILLO)} strokeWidth="5" style={{ transition: suave }} />
      <path d="M 170 210 Q 200 195 230 210 Q 245 250 200 258 Q 155 250 170 210 Z" fill={c(2, '#f2d47a')} stroke="#c9a640" strokeWidth="2" style={{ transition: suave }} />
      <line x1="200" y1="258" x2="200" y2="290" stroke={c(3, AMARILLO)} strokeWidth="5" style={{ transition: suave }} />
      <T x={200} y={14} t={URI_TXT[URI[i]]} c={AZUL} s={13} />
      <T x={340} y={40} t="sangre que llega" c={ROJO} s={9} peso={600} />
      <T x={340} y={52} t="y sangre limpia" c={AZUL} s={9} peso={600} />
    </svg>
  )
}

/* ── 3. La nefrona: filtrar, recuperar, orina ───────────────────────────── */

const NEF = ['nefrona', 'filtracion', 'reabsorcion', 'secrecion', 'orina']

export function EscenaExcNefrona({ fase }: { fase: string }) {
  const i = idx(NEF, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`La nefrona: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      {/* glomérulo y cápsula */}
      <circle cx="80" cy="80" r="34" fill="#fff" stroke="#c9a640" strokeWidth="4" />
      <circle cx="80" cy="80" r="20" fill="none" stroke={ROJO} strokeWidth="6" strokeDasharray="8 3" />
      <T x={80} y={35} t="glomérulo" c={ROJO} s={10} />
      {/* túbulo */}
      <path d="M 112 90 C 160 100 150 60 200 70 C 240 78 240 110 230 130 L 225 250 Q 250 275 275 250 L 280 130 C 290 100 320 90 340 110 L 345 290" fill="none" stroke="#e8d8a0" strokeWidth="14" strokeLinecap="round" />
      <path d="M 112 90 C 160 100 150 60 200 70 C 240 78 240 110 230 130 L 225 250 Q 250 275 275 250 L 280 130 C 290 100 320 90 340 110 L 345 290" fill="none" stroke="#c9a640" strokeWidth="2" />
      {/* capilar alrededor */}
      <Ver si={i >= 2}>
        <path d="M 150 120 C 180 130 200 120 205 140 L 205 240 Q 250 290 295 240 L 300 140 C 310 120 330 130 360 140" fill="none" stroke={ROJO} strokeWidth="4" strokeDasharray="10 4" opacity="0.7" />
      </Ver>
      <Ver si={i === 1}>
        {[[95, 70], [100, 92], [118, 90]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="5" fill={k === 2 ? AMARILLO : AZUL} />)}
        <T x={200} y={30} t="Filtración: el agua y lo pequeño salen de la sangre" c={AZUL} s={12} />
        <T x={200} y={46} t="las células y las proteínas se quedan" s={10} peso={600} />
      </Ver>
      <Ver si={i === 2}>
        {[[205, 160, '🍬'], [215, 200, '💧'], [290, 170, '🧂'], [285, 210, '💧']].map(([x, y, e], k) => (
          <text key={k} x={x as number} y={y as number} fontSize="14" textAnchor="middle">{e}</text>
        ))}
        <T x={200} y={30} t="Reabsorción: vuelve a la sangre lo que sirve" c={VERDE} s={12} />
        <T x={200} y={46} t="toda la glucosa, casi toda el agua y muchas sales" s={10} peso={600} />
      </Ver>
      <Ver si={i === 3}>
        <T x={200} y={30} t="Secreción: la sangre suelta más desechos al túbulo" c="#8a4a9a" s={12} />
        <T x={200} y={46} t="algunos medicamentos, exceso de sales" s={10} peso={600} />
      </Ver>
      <Ver si={i === 4}>
        <circle cx="345" cy="270" r="8" fill={AMARILLO} />
        <T x={200} y={30} t="Queda la orina: agua, urea y sales" c={AMARILLO} s={13} />
        <T x={200} y={46} t="de ≈ 180 L filtrados, sale ≈ 1,5 L al día" s={10} peso={600} />
      </Ver>
      <Ver si={i === 0}><T x={200} y={30} t="Cada riñón tiene ≈ 1 millón de nefronas" c={AZUL} s={13} /></Ver>
    </svg>
  )
}

/* ── 4. Peces de río y de mar ───────────────────────────────────────────── */

export function EscenaExcPeces({ fase }: { fase: string }) {
  const mar = fase === 'mar'
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={mar ? 'Pez de mar' : 'Pez de río'} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={mar ? '#b9d4ea' : '#d8ecdc'} style={{ transition: suave }} />
      <T x={200} y={30} t={mar ? 'Pez de mar: el agua de afuera es más salada' : 'Pez de río: su cuerpo es más salado que el agua'} c={AZUL} s={13} />
      <ellipse cx="200" cy="150" rx="90" ry="45" fill={mar ? '#5a8ab0' : '#7aa86a'} style={{ transition: suave }} />
      <path d="M 290 150 L 330 120 V 180 Z" fill={mar ? '#5a8ab0' : '#7aa86a'} style={{ transition: suave }} />
      <circle cx="140" cy="140" r="6" fill="#fff" />
      {/* flechas de agua */}
      <g style={{ transition: suave, transform: mar ? 'rotate(180deg)' : 'none', transformOrigin: '200px 80px' }}>
        <path d="M 200 60 V 95" stroke={AZUL} strokeWidth="4" markerEnd="url(#hpez)" />
      </g>
      <defs><marker id="hpez" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill={AZUL} /></marker></defs>
      <T x={250} y={80} t={mar ? 'pierde agua' : 'le entra agua'} c={AZUL} s={11} />
      <T x={200} y={225} t={mar ? '🥤 toma agua de mar' : '🚫 no toma agua'} s={12} peso={700} />
      <T x={200} y={248} t={mar ? '🚽 orina poca y concentrada' : '🚽 orina mucha y diluida'} s={12} peso={700} />
      <T x={200} y={271} t={mar ? '🧂 saca la sal por las branquias' : '🧂 toma sales por las branquias'} s={12} peso={700} />
    </svg>
  )
}
