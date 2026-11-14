// Escenas del tema «Técnicas de estudio»: partes del microscopio (zoom), aumentos y óptico vs electrónico.
import { CelulaVegetalCompleta } from '../ilustraciones/CelulaEuc.tsx'

const camara = 'transform 1.1s cubic-bezier(.45,.05,.25,1)'

/* ── el microscopio óptico ──────────────────────────────────────────────── */
type ParteM = 'ocular' | 'tubo' | 'revolver' | 'objetivos' | 'platina' | 'pinzas' | 'diafragma' | 'luz' | 'macro' | 'micro' | 'brazo' | 'base'

export function Microscopio({ resalta = [] }: { resalta?: ParteM[] }) {
  const on = (p: ParteM) => resalta.length === 0 || resalta.includes(p)
  const st = (p: ParteM) => ({ transition: 'opacity 0.5s', opacity: on(p) ? 1 : 0.35, filter: resalta.includes(p) ? 'drop-shadow(0 0 4px #f0a020)' : undefined })
  const GRIS = '#5f6b7a'
  return (
    <g strokeLinejoin="round">
      <g style={st('base')}><rect x="120" y="266" width="170" height="20" rx="6" fill={GRIS} /></g>
      <g style={st('brazo')}><path d="M 250 268 C 290 230 286 120 236 78 L 214 92 C 252 128 254 214 228 262 Z" fill={GRIS} /></g>
      <g style={st('luz')}>
        <rect x="182" y="232" width="22" height="16" rx="4" fill="#ffd34d" stroke="#b8860b" strokeWidth="2" />
        <path d="M 193 230 V 192" stroke="#ffd34d" strokeWidth="3" strokeDasharray="3 3" />
      </g>
      <g style={st('diafragma')}><rect x="178" y="182" width="30" height="8" rx="3" fill="#8a96a6" stroke="#3a4450" strokeWidth="1.5" /></g>
      <g style={st('platina')}>
        <rect x="138" y="170" width="120" height="10" rx="2" fill="#3a4450" />
        <rect x="170" y="165" width="46" height="5" fill="#cfe6f6" stroke="#3b6fb6" strokeWidth="1" />
      </g>
      <g style={st('pinzas')}><path d="M 150 166 h 20 M 226 166 h 20" stroke="#b0b8c4" strokeWidth="4" strokeLinecap="round" /></g>
      <g style={st('objetivos')}>
        <rect x="178" y="132" width="10" height="26" rx="2" fill="#c9cfd8" stroke="#3a4450" strokeWidth="1.5" />
        <rect x="191" y="132" width="10" height="20" rx="2" fill="#c9cfd8" stroke="#3a4450" strokeWidth="1.5" />
        <rect x="204" y="132" width="10" height="14" rx="2" fill="#c9cfd8" stroke="#3a4450" strokeWidth="1.5" />
      </g>
      <g style={st('revolver')}><rect x="172" y="120" width="46" height="13" rx="6" fill="#3a4450" /></g>
      <g style={st('tubo')}><rect x="182" y="44" width="26" height="78" rx="3" fill="#8a96a6" stroke="#3a4450" strokeWidth="1.5" /></g>
      <g style={st('ocular')}><rect x="186" y="18" width="18" height="28" rx="3" fill="#3a4450" /></g>
      <g style={st('macro')}><circle cx="266" cy="196" r="12" fill="#3a4450" stroke="#b0b8c4" strokeWidth="2" /></g>
      <g style={st('micro')}><circle cx="268" cy="222" r="7" fill="#3a4450" stroke="#b0b8c4" strokeWidth="2" /></g>
    </g>
  )
}

const FASES_M: Record<string, { partes: ParteM[]; x: number; y: number; k: number }> = {
  completo: { partes: [], x: 200, y: 150, k: 1 },
  ocular: { partes: ['ocular', 'tubo'], x: 196, y: 60, k: 2.2 },
  objetivos: { partes: ['revolver', 'objetivos'], x: 196, y: 140, k: 2.8 },
  platina: { partes: ['platina', 'pinzas'], x: 198, y: 170, k: 2.2 },
  luz: { partes: ['luz', 'diafragma'], x: 194, y: 212, k: 2.4 },
  tornillos: { partes: ['macro', 'micro'], x: 262, y: 208, k: 2.6 },
  soporte: { partes: ['brazo', 'base'], x: 220, y: 190, k: 1.3 },
  // agrupado como se enseña en el colegio
  mecanica: { partes: ['tubo', 'revolver', 'platina', 'pinzas', 'macro', 'micro', 'brazo', 'base'], x: 200, y: 150, k: 1 },
  optica: { partes: ['ocular', 'objetivos'], x: 196, y: 100, k: 1.5 },
  iluminacion: { partes: ['luz', 'diafragma'], x: 194, y: 212, k: 2.2 },
}

export function EscenaMicroscopio({ fase }: { fase: string }) {
  const f = FASES_M[fase] ?? FASES_M.completo
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Microscopio óptico: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef1f5" />
      <g style={{ transition: camara, transform: `translate(200px, 150px) scale(${f.k}) translate(${-f.x}px, ${-f.y}px)` }}>
        <Microscopio resalta={f.partes} />
      </g>
    </svg>
  )
}

/* ── muestra de cebolla (para aumentos y enfoque) ───────────────────────── */
export function Cebolla({ escala, cx = 200, cy = 150 }: { escala: number; cx?: number; cy?: number }) {
  const W = 46
  const H = 22
  const celdas: [number, number][] = []
  for (let f = -7; f <= 7; f++) for (let c = -5; c <= 5; c++) celdas.push([c * W + (f % 2 ? W / 2 : 0), f * H])
  return (
    <g style={{ transition: camara, transform: `translate(${cx}px, ${cy}px) scale(${escala})` }}>
      {celdas.map(([x, y], k) => (
        <g key={k}>
          <rect x={x - W / 2} y={y - H / 2} width={W} height={H} fill="#f6efe0" stroke="#a88a5a" strokeWidth={1.5} />
          <ellipse cx={x + ((k * 7) % 11) - 5} cy={y} rx="4" ry="3" fill="#b07a9a" />
        </g>
      ))}
    </g>
  )
}

const AUMENTOS: Record<string, number> = { ojo: 0.12, x40: 0.4, x100: 1, x400: 3.6, x1000: 8 }
export function EscenaAumento({ fase }: { fase: string }) {
  const k = AUMENTOS[fase] ?? 1
  const etiqueta = fase === 'ojo' ? 'a simple vista' : fase.replace('x', '') + ' ×'
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Piel de cebolla vista ${etiqueta}`} className="h-full w-full">
      <defs><clipPath id="campo"><circle cx="200" cy="150" r="128" /></clipPath></defs>
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#1f2328" />
      <circle cx="200" cy="150" r="128" fill="#fffbea" />
      <g clipPath="url(#campo)"><Cebolla escala={k} /></g>
      <circle cx="200" cy="150" r="128" fill="none" stroke="#3a4450" strokeWidth="6" />
      <rect x="292" y="18" width="96" height="30" rx="15" fill="#ffd34d" />
      <text x="340" y="38" textAnchor="middle" fontSize="15" fontWeight="800" fill="#3a2a00">{etiqueta}</text>
    </svg>
  )
}

/* ── óptico vs electrónico ──────────────────────────────────────────────── */
const OE: Record<string, { x: number; y: number; k: number; borroso: number; gris: boolean; titulo: string }> = {
  optico: { x: 200, y: 150, k: 1, borroso: 0.8, gris: false, titulo: 'Microscopio óptico · hasta ~1 000×' },
  limite: { x: 150, y: 74, k: 4, borroso: 3.5, gris: false, titulo: 'Más aumento no ayuda: se ve borroso' },
  electronico: { x: 150, y: 74, k: 4, borroso: 0, gris: true, titulo: 'Electrónico · hasta ~1 000 000×' },
}
export function EscenaOpticoElectronico({ fase }: { fase: string }) {
  const f = OE[fase] ?? OE.optico
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={f.titulo} className="h-full w-full">
      <defs>
        <filter id="oe-borroso"><feGaussianBlur stdDeviation={f.borroso} /></filter>
        <filter id="oe-gris"><feColorMatrix type="saturate" values="0" /></filter>
      </defs>
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={f.gris ? '#202020' : '#fffbea'} style={{ transition: 'fill 0.8s' }} />
      <g filter={f.gris ? 'url(#oe-gris)' : 'url(#oe-borroso)'}>
        <g style={{ transition: camara, transform: `translate(200px, 150px) scale(${f.k}) translate(${-f.x}px, ${-f.y}px)` }}>
          <CelulaVegetalCompleta />
        </g>
      </g>
      <rect x="10" y="262" width="380" height="30" rx="15" fill={f.gris ? '#ffffff' : '#3a4450'} opacity="0.9" />
      <text x="200" y="282" textAnchor="middle" fontSize="14" fontWeight="800" fill={f.gris ? '#202020' : '#ffffff'}>{f.titulo}</text>
    </svg>
  )
}
