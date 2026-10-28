// Ilustración esquemática (no a escala): los frascos del experimento de Redi (1668).
export default function FrascosRedi({ dia = 5 }: { dia?: number }) {
  const moscas = dia >= 1
  const larvas = dia >= 4
  const Frasco = ({ x, cubierto }: { x: number; cubierto: boolean }) => (
    <g>
      <rect x={x} y="120" width="120" height="130" rx="8" fill="#eaf6f8" fillOpacity="0.35" stroke="#3c7f8a" strokeWidth="4" />
      <ellipse cx={x + 60} cy="232" rx="38" ry="14" fill="#b4564a" />
      {cubierto ? (
        <>
          <line x1={x - 4} y1="120" x2={x + 124} y2="120" stroke="#6b5a3b" strokeWidth="3" strokeDasharray="3 2" />
          <text x={x + 60} y="108" textAnchor="middle" fontSize="12" fill="#4a3416">cubierto con gasa</text>
        </>
      ) : (
        <text x={x + 60} y="108" textAnchor="middle" fontSize="12" fill="#4a3416">abierto</text>
      )}
      {larvas && !cubierto && [0, 1, 2, 3, 4, 5].map((i) => <ellipse key={i} cx={x + 40 + (i % 3) * 20} cy={226 + Math.floor(i / 3) * 8} rx="5" ry="2" fill="#f4f0dc" stroke="#8a7a4b" strokeWidth="0.8" />)}
      {moscas && (
        <>
          {cubierto ? (
            <>
              <ellipse cx={x + 40} cy="112" rx="7" ry="3.5" fill="#2b2b2b" />
              <ellipse cx={x + 80} cy="114" rx="7" ry="3.5" fill="#2b2b2b" />
            </>
          ) : (
            <ellipse cx={x + 70} cy="170" rx="7" ry="3.5" fill="#2b2b2b" />
          )}
        </>
      )}
    </g>
  )
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Dos frascos con carne: uno abierto y otro cubierto con gasa, al día ${dia}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4efe4" />
      <Frasco x={50} cubierto={false} />
      <Frasco x={230} cubierto />
      <text x="110" y="276" textAnchor="middle" fontSize="12" fill="#4a3416">{larvas ? 'con larvas' : 'sin larvas aún'}</text>
      <text x="290" y="276" textAnchor="middle" fontSize="12" fill="#4a3416">{larvas ? 'sin larvas' : 'sin larvas'}</text>
    </svg>
  )
}
