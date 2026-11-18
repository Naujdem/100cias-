import type { ReactNode } from 'react'
// Escenas vivas de Química, área 1, tema 2 (Propiedades de la materia).

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease, fill 0.8s ease, y 1.1s ease, height 1.1s ease'
const TINTA = '#3a3a3a'
const AZUL = '#2f6db3'
const ROJO = '#c43c3c'

function T({ x, y, t, c = TINTA, s = 11, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c} stroke="#fff" strokeWidth="3" paintOrder="stroke">{t}</text>
}
function Ver({ si, children }: { si: boolean; children: ReactNode }) {
  return <g style={{ transition: suave, opacity: si ? 1 : 0 }}>{children}</g>
}

/* ── Medir la materia: masa con la balanza, volumen con la probeta ────── */

const MEDIR = ['balanza', 'probeta', 'piedra']

export function EscenaMedirMateria({ fase }: { fase: string }) {
  const i = Math.max(0, MEDIR.indexOf(fase))
  const agua = i === 2 ? 130 : 160 // nivel del agua (y): sube al meter la piedra
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Medir la materia: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f3f1ea" />
      <rect x="-10" y="255" width="420" height="50" fill="#c9b99a" />
      {/* balanza digital */}
      <Ver si={i === 0}>
        <rect x="110" y="215" width="180" height="40" rx="6" fill="#5c6670" />
        <rect x="130" y="205" width="140" height="10" rx="3" fill="#9aa4ad" />
        <rect x="175" y="226" width="50" height="18" rx="3" fill="#cfe8c8" />
        <T x={200} y={240} t="150 g" s={12} />
        <ellipse cx="200" cy="190" rx="30" ry="16" fill="#8a8a8a" />
        <T x={200} y={120} t="masa: cuánta materia tiene (g, kg)" c={AZUL} s={12} />
      </Ver>
      {/* probeta */}
      <Ver si={i >= 1}>
        <rect x="170" y="70" width="60" height="185" fill="#fff" stroke="#888" strokeWidth="2" opacity="0.9" />
        <rect x="171" y={agua} width="58" height={255 - agua} fill="#9cc7ea" style={{ transition: suave }} />
        {[100, 130, 160, 190, 220].map((y, k) => <g key={y}><path d={`M 230 ${y} h -12`} stroke="#666" /><text x="236" y={y + 4} fontSize="9" fill="#555">{[100, 80, 60, 40, 20][k]}</text></g>)}
        <T x={290} y={agua + 4} t={i === 2 ? '80 mL' : '60 mL'} c={AZUL} s={12} />
        <T x={100} y={120} t="volumen: cuánto espacio ocupa" c={AZUL} s={11} />
        <T x={100} y={136} t="(mL, L, cm³)" c={AZUL} s={11} />
      </Ver>
      <Ver si={i === 2}>
        <ellipse cx="200" cy="232" rx="20" ry="13" fill="#8a8a8a" />
        <T x={100} y={200} t="80 − 60 = 20 mL" c={ROJO} s={12} />
        <T x={100} y={216} t="volumen de la piedra" c={ROJO} s={11} />
      </Ver>
      <T x={200} y={34} t={['La balanza mide la masa', 'La probeta mide el volumen de un líquido', 'Una piedra desplaza agua: así se mide su volumen'][i]} s={13} />
    </svg>
  )
}

/* ── Columna de densidades: líquidos que no se mezclan ────────────────── */

const COL = ['vacio', 'liquidos', 'objetos']

export function EscenaColumnaDensidad({ fase }: { fase: string }) {
  const i = Math.max(0, COL.indexOf(fase))
  const capas = [
    { y: 200, h: 50, c: '#e0a42b', n: 'miel 1,4 g/mL' },
    { y: 150, h: 50, c: '#9cc7ea', n: 'agua 1,0 g/mL' },
    { y: 100, h: 50, c: '#f0dc7a', n: 'aceite 0,9 g/mL' },
  ]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Columna de densidades: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef3f8" />
      {capas.map((k, n) => (
        <g key={n} style={{ transition: suave, opacity: i >= 1 ? 1 : 0 }}>
          <rect x="140" y={k.y} width="120" height={k.h} fill={k.c} />
          <T x={330} y={k.y + 30} t={k.n} s={11} />
        </g>
      ))}
      <path d="M 140 70 V 250 H 260 V 70" fill="none" stroke="#888" strokeWidth="3" />
      <Ver si={i === 2}>
        <text x="175" y="104" textAnchor="middle" fontSize="20">🍾</text>
        <T x={70} y={100} t="corcho: flota en todo" s={10} />
        <circle cx="225" cy="196" r="9" fill="#d8b56a" stroke="#8a6a2a" />
        <T x={70} y={196} t="uva: entre agua y miel" s={10} />
        <rect x="190" y="236" width="20" height="12" fill="#777" />
        <T x={70} y={244} t="tuerca: al fondo" s={10} />
      </Ver>
      <T x={200} y={34} t={['Un recipiente vacío…', 'El más denso queda abajo, el menos denso arriba', 'Cada objeto se queda donde su densidad lo deja'][i]} s={13} />
      <Ver si={i >= 1}><T x={200} y={280} t="densidad = masa ÷ volumen" c={ROJO} s={13} /></Ver>
    </svg>
  )
}

/* ── El agua hierve a menos temperatura en la montaña ─────────────────── */

const ALT = ['mar', 'neiva', 'bogota', 'nevado']

export function EscenaHervirAltura({ fase }: { fase: string }) {
  const i = Math.max(0, ALT.indexOf(fase))
  const datos = [
    { lugar: 'Nivel del mar', alt: '0 m', t: '100 °C', x: 50, y: 250 },
    { lugar: 'Neiva', alt: '≈ 440 m', t: '≈ 98 °C', x: 120, y: 230 },
    { lugar: 'Bogotá', alt: '≈ 2600 m', t: '≈ 91 °C', x: 220, y: 160 },
    { lugar: 'Nevado del Huila', alt: '≈ 5000 m', t: '≈ 83 °C', x: 300, y: 80 },
  ][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Punto de ebullición y altura: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#dfeefa" />
      <path d="M -10 260 L 120 235 L 300 70 L 410 200 L 410 310 L -10 310 Z" fill="#8fae6a" />
      <path d="M 270 98 L 300 70 L 330 106 Q 300 96 270 98 Z" fill="#fff" />
      <rect x="-10" y="258" width="60" height="50" fill="#5b9bd5" />
      <g style={{ transition: suave, transform: `translate(${datos.x}px, ${datos.y - 30}px)` }}>
        <text x="0" y="0" textAnchor="middle" fontSize="28">♨️</text>
      </g>
      <rect x="20" y="52" width="170" height="62" rx="8" fill="#fff" opacity="0.92" />
      <T x={105} y={72} t={`${datos.lugar} (${datos.alt})`} s={11} />
      <T x={105} y={98} t={`el agua hierve a ${datos.t}`} c={ROJO} s={13} />
      <T x={200} y={28} t="Más altura → menos presión del aire → hierve antes" c={AZUL} s={12} />
    </svg>
  )
}
