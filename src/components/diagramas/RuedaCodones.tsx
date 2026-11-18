import { useEffect, useState, type ReactElement } from 'react'
import { AMINOACIDOS, BASES_ARN, traducir } from '../../lib/codigoGenetico.ts'
import { COLOR_BASE } from '../escenas/EscenasAdn.tsx'

// Rueda de codones: se lee de adentro hacia afuera (1.ª, 2.ª y 3.ª base) y en el borde aparece el aminoácido.
// Se eligen las tres letras con botones o teclas (U, C, A, G), o tocando un sector del anillo exterior.

const CX = 210
const CY = 210
const R = [0, 48, 100, 140, 196]

function sector(r0: number, r1: number, a0: number, a1: number) {
  const p = (r: number, a: number) => `${(CX + r * Math.sin(a)).toFixed(2)} ${(CY - r * Math.cos(a)).toFixed(2)}`
  const largo = a1 - a0 > Math.PI ? 1 : 0
  return `M ${p(r0, a0)} A ${r0} ${r0} 0 ${largo} 1 ${p(r0, a1)} L ${p(r1, a1)} A ${r1} ${r1} 0 ${largo} 0 ${p(r1, a0)} Z`
}

const AA_FONDO: Record<string, string> = { M: '#bfe3c6', '*': '#f3c1c1' }

export default function RuedaCodones() {
  const [codon, setCodon] = useState('')
  const elegir = (b: string) => setCodon((c) => (c.length >= 3 ? b : c + b))

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase()
      if ((BASES_ARN as readonly string[]).includes(k) && !e.ctrlKey && !e.metaKey && !e.altKey) elegir(k)
      if (e.key === 'Backspace') setCodon((c) => c.slice(0, -1))
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [])

  const aa = codon.length === 3 ? traducir(codon) : null
  const anillos: ReactElement[] = []
  const paso = (2 * Math.PI) / 4
  BASES_ARN.forEach((b1, i1) => {
    const a0 = i1 * paso
    const on1 = codon[0] === b1
    anillos.push(<path key={b1} d={sector(R[0] + 0.01, R[1], a0, a0 + paso)} fill={COLOR_BASE[b1]} opacity={codon && !on1 ? 0.35 : 1} />)
    anillos.push(<text key={`t${b1}`} x={CX + 26 * Math.sin(a0 + paso / 2)} y={CY - 26 * Math.cos(a0 + paso / 2) + 6} textAnchor="middle" fontSize="18" fontWeight="900" fill="#fff">{b1}</text>)
    BASES_ARN.forEach((b2, i2) => {
      const p2 = paso / 4
      const a2 = a0 + i2 * p2
      const on2 = on1 && codon[1] === b2
      anillos.push(<path key={b1 + b2} d={sector(R[1], R[2], a2, a2 + p2)} fill={COLOR_BASE[b2]} opacity={codon.length >= 2 ? (on2 ? 1 : 0.3) : codon.length === 1 && !on1 ? 0.3 : 0.9} stroke="#fff" strokeWidth="1" />)
      anillos.push(<text key={`t${b1}${b2}`} x={CX + 74 * Math.sin(a2 + p2 / 2)} y={CY - 74 * Math.cos(a2 + p2 / 2) + 5} textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff">{b2}</text>)
      BASES_ARN.forEach((b3, i3) => {
        const p3 = p2 / 4
        const a3 = a2 + i3 * p3
        const cod = b1 + b2 + b3
        const on3 = codon === cod
        const l = traducir(cod)
        const ang = a3 + p3 / 2
        const giro = (ang * 180) / Math.PI
        const volteado = giro > 90 && giro < 270
        anillos.push(
          <g key={cod} onClick={() => setCodon(cod)} style={{ cursor: 'pointer' }}>
            <path d={sector(R[2], R[3], a3, a3 + p3)} fill={COLOR_BASE[b3]} opacity={on3 ? 1 : codon.length >= 2 && on2 ? 0.75 : 0.3} stroke="#fff" strokeWidth="0.8" />
            <path d={sector(R[3], R[4], a3, a3 + p3)} fill={on3 ? '#ffe08a' : AA_FONDO[l] ?? '#f7f3ec'} stroke="#e2dccf" strokeWidth="0.8" />
            <text x={CX + 120 * Math.sin(ang)} y={CY - 120 * Math.cos(ang) + 3.5} textAnchor="middle" fontSize="9" fontWeight="900" fill="#fff">{b3}</text>
            <text transform={`translate(${CX + 168 * Math.sin(ang)} ${CY - 168 * Math.cos(ang)}) rotate(${volteado ? giro + 90 : giro - 90})`} textAnchor="middle" dy="3" fontSize="9" fontWeight={on3 ? 900 : 700} fill="#3a3a3a">
              {AMINOACIDOS[l].abrev}
            </text>
          </g>,
        )
      })
    })
  })

  return (
    <div data-diagrama>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <svg viewBox="0 0 420 420" role="img" aria-label="Rueda del código genético" className="w-full max-w-md">
          {anillos}
          <text x={CX} y={CY + 5} textAnchor="middle" fontSize="11" fontWeight="900" fill="#3a3a3a">1.ª</text>
        </svg>
        <div className="flex min-w-56 flex-col items-center gap-3">
          <div className="flex gap-1" aria-live="polite">
            {[0, 1, 2].map((k) => (
              <span key={k} className="flex h-14 w-12 items-center justify-center rounded-lg text-3xl font-black text-white"
                style={{ background: codon[k] ? COLOR_BASE[codon[k]] : '#ddd' }}>{codon[k] ?? '·'}</span>
            ))}
          </div>
          <div className="flex gap-2">
            {BASES_ARN.map((b) => (
              <button key={b} type="button" onClick={() => elegir(b)} className="min-h-12 min-w-12 rounded-xl text-2xl font-black text-white" style={{ background: COLOR_BASE[b] }}>{b}</button>
            ))}
          </div>
          <button type="button" onClick={() => setCodon('')} className="min-h-10 rounded-full border px-4 text-sm font-semibold">Borrar</button>
          <p className="max-w-64 text-center text-lg">
            {aa
              ? aa === '*' ? `${codon}: codón de parada. Aquí termina la proteína.` : `${codon} → ${AMINOACIDOS[aa].nombre} (${AMINOACIDOS[aa].abrev})`
              : 'Elige tres letras (o toca el borde de la rueda). Se lee de adentro hacia afuera.'}
          </p>
        </div>
      </div>
    </div>
  )
}
