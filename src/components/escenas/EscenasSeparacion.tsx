import type { ReactNode } from 'react'
// Escenas vivas de Química, área 1, tema 6 (Separación de mezclas).
// Una sola escena con todos los métodos; cada lámina usa solo las fases que le tocan.

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease, fill 0.8s ease'
const TINTA = '#3a3a3a'
const AZUL = '#2f6db3'
const ROJO = '#c43c3c'
const CAFE = '#6b4226'

function T({ x, y, t, c = TINTA, s = 11, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c} stroke="#fff" strokeWidth="3" paintOrder="stroke">{t}</text>
}
function Ver({ si, children }: { si: boolean; children: ReactNode }) {
  return <g style={{ transition: suave, opacity: si ? 1 : 0 }}>{children}</g>
}

const METODOS: Record<string, { t: string; sub: string }> = {
  tamizado: { t: 'Tamizado', sub: 'sólidos de distinto tamaño: la zaranda' },
  filtracion: { t: 'Filtración', sub: 'sólido que no se disuelve + líquido' },
  decantacion: { t: 'Decantación', sub: 'líquidos que no se mezclan, o sólido que se asienta' },
  imantacion: { t: 'Imantación', sub: 'un metal que atrae el imán' },
  evaporacion: { t: 'Evaporación', sub: 'sólido disuelto: se va el agua, queda el sólido' },
  destilacion: { t: 'Destilación', sub: 'líquidos con distinto punto de ebullición' },
  cromatografia: { t: 'Cromatografía', sub: 'los colores de una tinta suben a distinta velocidad' },
}

export function EscenaSepararMezclas({ fase }: { fase: string }) {
  const m = METODOS[fase] ?? METODOS.tamizado
  const es = (f: string) => fase === f || (!METODOS[fase] && f === 'tamizado')
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Separación de mezclas: ${m.t}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f5f2ea" />
      {/* zaranda con arena y piedras */}
      <Ver si={es('tamizado')}>
        <path d="M 120 120 H 280" stroke="#8a6a3a" strokeWidth="8" />
        <path d="M 125 120 H 275" stroke="#555" strokeWidth="2" strokeDasharray="3 3" />
        {[150, 190, 240].map((x) => <ellipse key={x} cx={x} cy={108} rx="13" ry="9" fill="#888" />)}
        {Array.from({ length: 24 }, (_, k) => <circle key={k} cx={130 + (k * 37) % 140} cy={150 + (k * 13) % 80} r="2.5" fill="#c9a96a" />)}
        <ellipse cx="200" cy="245" rx="70" ry="12" fill="#c9a96a" />
        <T x={330} y={110} t="piedras" s={10} /><T x={330} y={248} t="arena" s={10} />
      </Ver>
      {/* embudo con papel filtro */}
      <Ver si={es('filtracion')}>
        <path d="M 150 80 L 250 80 L 210 150 L 210 190 L 190 190 L 190 150 Z" fill="#fff" stroke="#888" strokeWidth="2" />
        <path d="M 162 86 L 238 86 L 200 145 Z" fill="#c9a96a" opacity="0.8" />
        <path d="M 160 210 H 240 L 235 270 H 165 Z" fill="#cfe5f7" stroke="#888" strokeWidth="2" />
        <path d="M 200 192 V 230" stroke={AZUL} strokeWidth="3" strokeDasharray="4 6" />
        <T x={300} y={110} t="tierra en el filtro" s={10} /><T x={300} y={250} t="agua clara" c={AZUL} s={10} />
      </Ver>
      {/* embudo de decantación con aceite y agua */}
      <Ver si={es('decantacion')}>
        <path d="M 160 70 H 240 V 120 L 205 190 V 220 H 195 V 190 L 160 120 Z" fill="#fff" stroke="#888" strokeWidth="2" />
        <path d="M 162 72 H 238 V 100 H 162 Z" fill="#f0dc7a" />
        <path d="M 162 100 H 238 V 120 L 205 188 H 195 L 162 120 Z" fill="#9cc7ea" />
        <rect x="185" y="200" width="30" height="8" fill="#555" />
        <T x={300} y={90} t="aceite arriba" s={10} /><T x={300} y={140} t="agua abajo" c={AZUL} s={10} />
        <T x={200} y={250} t="se abre la llave y sale primero el agua" s={10} peso={600} />
      </Ver>
      {/* imán con limaduras */}
      <Ver si={es('imantacion')}>
        <path d="M 170 70 V 130 a 30 30 0 0 0 60 0 V 70 H 210 V 130 a 10 10 0 0 1 -20 0 V 70 Z" fill={ROJO} />
        <rect x="170" y="70" width="20" height="20" fill="#ddd" /><rect x="210" y="70" width="20" height="20" fill="#ddd" />
        {[180, 195, 210, 220].map((x, k) => <path key={x} d={`M ${x} ${170 + k * 3} l 6 -4`} stroke="#333" strokeWidth="2" />)}
        <ellipse cx="200" cy="245" rx="80" ry="14" fill="#c9a96a" />
        <T x={320} y={170} t="limaduras de hierro" s={10} /><T x={320} y={250} t="arena" s={10} />
      </Ver>
      {/* cápsula con agua salada al fuego */}
      <Ver si={es('evaporacion')}>
        <path d="M 140 170 Q 200 220 260 170 Z" fill="#fff" stroke="#888" strokeWidth="2" />
        {[175, 195, 215, 230].map((x) => <rect key={x} x={x} y={182} width="6" height="6" fill="#fff" stroke="#aaa" />)}
        {[170, 200, 230].map((x) => <path key={x} d={`M ${x} 150 q 6 -15 0 -30 q -6 -15 0 -30`} stroke="#9ab" strokeWidth="3" fill="none" />)}
        <text x="200" y="255" textAnchor="middle" fontSize="34">🔥</text>
        <T x={300} y={100} t="el agua se va como vapor" c={AZUL} s={10} /><T x={310} y={190} t="queda la sal" s={10} />
      </Ver>
      {/* alambique simple */}
      <Ver si={es('destilacion')}>
        <circle cx="110" cy="190" r="40" fill="#f5efc8" stroke="#888" strokeWidth="2" />
        <text x="110" y="270" textAnchor="middle" fontSize="28">🔥</text>
        <path d="M 110 150 V 120 L 290 170" stroke="#888" strokeWidth="8" fill="none" />
        <path d="M 180 130 L 270 155" stroke="#7fb3e0" strokeWidth="18" opacity="0.5" />
        <path d="M 290 170 V 200" stroke="#888" strokeWidth="4" />
        <path d="M 270 205 H 310 L 305 260 H 275 Z" fill="#eaf4fb" stroke="#888" strokeWidth="2" />
        <T x={110} y={140} t="se calienta" s={10} /><T x={225} y={120} t="el vapor se enfría" c={AZUL} s={10} /><T x={330} y={240} t="destilado" s={10} />
      </Ver>
      {/* papel con tinta que se separa en colores */}
      <Ver si={es('cromatografia')}>
        <rect x="170" y="60" width="60" height="190" fill="#fff" stroke="#aaa" />
        <rect x="160" y="225" width="80" height="30" fill="#9cc7ea" opacity="0.6" />
        {[['#2f6db3', 110], ['#c43c3c', 145], ['#e1b12c', 180]].map(([c, y]) => <ellipse key={String(c)} cx="200" cy={Number(y)} rx="10" ry="12" fill={String(c)} opacity="0.75" />)}
        <circle cx="200" cy="215" r="5" fill="#333" />
        <T x={290} y={215} t="punto de tinta negra" s={10} /><T x={295} y={140} t="se abre en colores" s={10} />
      </Ver>
      <T x={200} y={30} t={m.t} c={CAFE} s={16} />
      <T x={200} y={50} t={m.sub} s={11} peso={600} />
    </svg>
  )
}
