// Ilustración esquemática (no a escala): matraz de los experimentos de Pasteur.
export type TipoMatraz = 'recto' | 'cisne'

const PUNTOS: [number, number][] = [[170, 215], [190, 232], [215, 205], [232, 228], [200, 248], [180, 195], [222, 246], [160, 238], [205, 222], [240, 212]]

export default function Matraz({ tipo = 'cisne', turbio = false, roto = false }: { tipo?: TipoMatraz; turbio?: boolean; roto?: boolean }) {
  const cuello = tipo === 'cisne' && !roto ? 'M200 150 V100 Q200 70 230 70 Q260 70 260 100 V124' : roto ? 'M200 150 V112' : 'M200 150 V30'
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Matraz de cuello ${tipo === 'recto' ? 'recto' : roto ? 'de cisne roto' : 'de cisne'} con caldo ${turbio ? 'turbio' : 'limpio'}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef4f3" />
      <defs>
        <clipPath id="matraz-bulbo">
          <circle cx="200" cy="205" r="68" />
        </clipPath>
      </defs>
      {/* caldo */}
      <g clipPath="url(#matraz-bulbo)">
        <rect x="120" y="185" width="160" height="100" fill={turbio ? '#cdb78a' : '#f6e7a8'} />
        {turbio && PUNTOS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.4" fill="#7a5a2b" opacity="0.7" />)}
      </g>
      {/* vidrio */}
      <circle cx="200" cy="205" r="68" fill="#eaf6f8" fillOpacity="0.25" stroke="#3c7f8a" strokeWidth="4" />
      <path d={cuello} fill="none" stroke="#3c7f8a" strokeWidth="22" strokeLinecap="butt" />
      <path d={cuello} fill="none" stroke="#eef4f3" strokeWidth="14" strokeLinecap="butt" />
      <rect x="192" y="140" width="16" height="14" fill="#eef4f3" />

      {tipo === 'recto' && (
        <g fill="#7a5a2b">
          {[[196, 34], [206, 52], [198, 74], [205, 96]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.6" />)}
          <path d="M200 8 V22 M194 16 L200 22 L206 16" stroke="#7a5a2b" strokeWidth="2" fill="none" />
          <text x="222" y="16" fontSize="11">aire con polvo</text>
        </g>
      )}
      {tipo === 'cisne' && !roto && (
        <g>
          <g fill="#7a5a2b">
            {[[258, 110], [262, 103], [256, 98], [252, 90], [243, 74]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.4" />)}
          </g>
          <text x="276" y="100" fontSize="11" fill="#4a3416">el polvo queda</text>
          <text x="276" y="113" fontSize="11" fill="#4a3416">en la curva</text>
          <path d="M262 150 V132 M256 138 L262 132 L268 138" stroke="#4a3416" strokeWidth="2" fill="none" />
          <text x="276" y="148" fontSize="11" fill="#4a3416">entra aire</text>
        </g>
      )}
      {roto && (
        <g fill="#7a5a2b">
          {[[197, 90], [205, 78], [199, 60], [204, 40]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.6" />)}
          <path d="M200 20 V36 M194 30 L200 36 L206 30" stroke="#7a5a2b" strokeWidth="2" fill="none" />
          <text x="222" y="40" fontSize="11">entra todo, con polvo</text>
        </g>
      )}
    </svg>
  )
}
