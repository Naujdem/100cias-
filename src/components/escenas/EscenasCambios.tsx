import type { ReactNode } from 'react'
// Escenas vivas de Química, área 1, tema 4 (Cambios físicos y químicos).

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease, fill 0.8s ease'
const TINTA = '#3a3a3a'
const ROJO = '#c43c3c'
const AZUL = '#2f6db3'
const OXIDO = '#b5531f'

function T({ x, y, t, c = TINTA, s = 11, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c} stroke="#fff" strokeWidth="3" paintOrder="stroke">{t}</text>
}
function Ver({ si, children }: { si: boolean; children: ReactNode }) {
  return <g style={{ transition: suave, opacity: si ? 1 : 0 }}>{children}</g>
}

/* ── Una hoja de papel: cambios físicos y un cambio químico ───────────── */

const PAPEL = ['hoja', 'doblar', 'cortar', 'quemar']

export function EscenaPapelCambios({ fase }: { fase: string }) {
  const i = Math.max(0, PAPEL.indexOf(fase))
  const quimico = i === 3
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Cambios del papel: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={quimico ? '#fbece4' : '#eef3f8'} style={{ transition: suave }} />
      <Ver si={i === 0}><rect x="140" y="90" width="120" height="150" fill="#fff" stroke="#aaa" strokeWidth="2" /></Ver>
      <Ver si={i === 1}>
        <polygon points="140,90 260,90 200,165" fill="#f2f2f2" stroke="#aaa" strokeWidth="2" />
        <rect x="140" y="165" width="120" height="75" fill="#fff" stroke="#aaa" strokeWidth="2" />
        <path d="M 140 90 L 260 90 L 260 165 L 140 165 Z" fill="none" stroke="#ddd" strokeDasharray="4 4" />
      </Ver>
      <Ver si={i === 2}>
        {[[110, 100, -12], [210, 95, 8], [130, 175, 6], [230, 170, -6]].map(([x, y, r], k) => <rect key={k} x={x} y={y} width="60" height="70" fill="#fff" stroke="#aaa" strokeWidth="2" transform={`rotate(${r} ${x + 30} ${y + 35})`} />)}
        <text x="330" y="140" textAnchor="middle" fontSize="34">✂️</text>
      </Ver>
      <Ver si={quimico}>
        <ellipse cx="200" cy="230" rx="70" ry="14" fill="#3b3b3b" />
        {[170, 200, 230].map((x) => <path key={x} d={`M ${x} 210 q -10 -30 5 -60 q 12 -25 -2 -50`} stroke="#999" strokeWidth="6" fill="none" opacity="0.6" />)}
        <text x="200" y="215" textAnchor="middle" fontSize="40">🔥</text>
        <T x={95} y={120} t="humo y gases" c={ROJO} />
        <T x={300} y={250} t="ceniza" c={ROJO} />
      </Ver>
      <T x={200} y={34} t={['Una hoja de papel', 'Doblada: sigue siendo papel', 'Cortada: sigue siendo papel', 'Quemada: ¡ya no es papel!'][i]} s={14} />
      <T x={200} y={280} t={quimico ? 'CAMBIO QUÍMICO: se forman sustancias nuevas' : i === 0 ? '' : 'CAMBIO FÍSICO: la sustancia es la misma'} c={quimico ? ROJO : AZUL} s={13} />
    </svg>
  )
}

/* ── Señales de un cambio químico ─────────────────────────────────────── */

const SENALES = ['gas', 'color', 'calor', 'solido', 'olor']

export function EscenaSenalesQuimicas({ fase }: { fase: string }) {
  const i = Math.max(0, SENALES.indexOf(fase))
  const datos = [
    { e: '🫧', t: 'Sale un gas', ej: 'vinagre + bicarbonato: burbujas de CO₂' },
    { e: '🎨', t: 'Cambia el color', ej: 'el hierro se pone rojizo al oxidarse' },
    { e: '🔥', t: 'Libera luz o calor', ej: 'la leña que arde en el fogón' },
    { e: '🧀', t: 'Aparece un sólido', ej: 'la leche se corta con limón' },
    { e: '👃', t: 'Cambia el olor', ej: 'la comida que se descompone' },
  ][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Señal de cambio químico: ${datos.t}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#fbf6ec" />
      {/* vaso con vinagre y burbujas */}
      <Ver si={i === 0}>
        <path d="M 160 120 H 240 L 232 240 H 168 Z" fill="#eaf4fb" stroke="#999" strokeWidth="2" />
        <rect x="166" y="160" width="68" height="78" fill="#f5efc8" />
        {[[180, 150], [200, 130], [220, 140], [190, 110], [212, 100], [198, 80]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r={6 + (k % 3) * 2} fill="#fff" stroke="#aac" />)}
      </Ver>
      {/* clavo que se oxida */}
      <Ver si={i === 1}>
        <rect x="120" y="150" width="70" height="12" fill="#8b9097" /><rect x="110" y="140" width="10" height="32" fill="#8b9097" />
        <rect x="230" y="150" width="70" height="12" fill={OXIDO} /><rect x="220" y="140" width="10" height="32" fill={OXIDO} />
        <T x={155} y={200} t="nuevo" s={11} /><T x={265} y={200} t="oxidado" c={OXIDO} s={11} />
      </Ver>
      <Ver si={i === 2}><text x="200" y="210" textAnchor="middle" fontSize="80">🔥</text></Ver>
      {/* leche cortada: grumos */}
      <Ver si={i === 3}>
        <path d="M 150 120 H 250 L 240 240 H 160 Z" fill="#fffdf6" stroke="#999" strokeWidth="2" />
        {[[180, 200], [205, 215], [225, 195], [195, 180], [215, 225]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="9" fill="#f1e7c7" stroke="#cdb980" />)}
        <text x="270" y="140" textAnchor="middle" fontSize="30">🍋</text>
      </Ver>
      <Ver si={i === 4}>
        <text x="200" y="200" textAnchor="middle" fontSize="70">🍌</text>
        {[170, 200, 230].map((x) => <path key={x} d={`M ${x} 130 q 8 -15 0 -30 q -8 -15 0 -30`} stroke="#8a9a3a" strokeWidth="4" fill="none" />)}
      </Ver>
      <text x="60" y="80" textAnchor="middle" fontSize="40">{datos.e}</text>
      <T x={220} y={60} t={datos.t} c={ROJO} s={16} />
      <T x={200} y={278} t={datos.ej} s={12} />
    </svg>
  )
}

/* ── El machete que se oxida (propiedad química) ──────────────────────── */

const MACHETE = ['nuevo', 'humedad', 'oxido', 'proteger']

export function EscenaMacheteOxido({ fase }: { fase: string }) {
  const i = Math.max(0, MACHETE.indexOf(fase))
  const hoja = ['#aeb4bb', '#aeb4bb', OXIDO, '#9aa1a8'][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Oxidación del machete: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef0e6" />
      <path d="M 70 170 Q 230 120 340 135 Q 330 165 300 175 Q 200 190 70 190 Z" fill={hoja} stroke="#555" strokeWidth="2" style={{ transition: suave }} />
      {i === 2 && [[150, 170], [220, 160], [280, 160], [190, 180]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="7" fill="#8a3a12" opacity="0.7" />)}
      <rect x="20" y="168" width="55" height="24" rx="6" fill="#6b4226" />
      <Ver si={i === 1}>
        {[[140, 120], [200, 110], [260, 115], [170, 95], [230, 90]].map(([x, y], k) => <text key={k} x={x} y={y} fontSize="18">💧</text>)}
        <T x={200} y={235} t="hierro + oxígeno + agua" c={AZUL} s={13} />
      </Ver>
      <Ver si={i === 2}><T x={200} y={235} t="→ óxido de hierro: una sustancia nueva" c={OXIDO} s={13} /></Ver>
      <Ver si={i === 3}>
        <path d="M 70 168 Q 230 118 340 133" stroke="#e8c84a" strokeWidth="5" fill="none" opacity="0.8" />
        <T x={200} y={235} t="seco y aceitado: el oxígeno y el agua no llegan" c="#2e7d32" s={12} />
      </Ver>
      <T x={200} y={40} t={['Un machete nuevo', 'Queda mojado en el potrero', 'Aparece el óxido: cambio químico', 'Cómo protegerlo'][i]} s={14} />
    </svg>
  )
}
