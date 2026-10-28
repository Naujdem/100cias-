// Ilustración esquemática: una gota de agua vista con una lente fuerte (no a escala).
export default function GotaAnimalculos() {
  return (
    <svg viewBox="0 0 240 180" role="img" aria-label="Una gota de agua con un animálculo grande y muchas bacterias pequeñas" className="h-full w-full">
      <rect width="240" height="180" fill="#efe3cc" />
      <circle cx="120" cy="90" r="74" fill="#d8f0f3" stroke="#3c7f8a" strokeWidth="4" />
      {/* animálculo */}
      <ellipse cx="105" cy="78" rx="28" ry="12" fill="#a7d3a0" stroke="#3f7a3a" strokeWidth="2" transform="rotate(-20 105 78)" />
      <circle cx="98" cy="75" r="3" fill="#3f7a3a" />
      <path d="M126 66 q12 -6 18 -2 M127 71 q12 0 18 4 M125 76 q10 6 14 12" stroke="#3f7a3a" strokeWidth="1.5" fill="none" />
      <ellipse cx="150" cy="118" rx="18" ry="8" fill="#a7d3a0" stroke="#3f7a3a" strokeWidth="2" transform="rotate(25 150 118)" />
      {/* bacterias */}
      {[[72,108],[84,124],[100,112],[118,128],[132,100],[76,92],[90,138],[160,86],[168,104],[110,98],[140,134],[64,120]].map(([x,y],i)=> i%2 ? (
        <circle key={i} cx={x} cy={y} r="2.2" fill="#7a4a8a" />
      ) : (
        <rect key={i} x={x-3.5} y={y-1.6} width="7" height="3.2" rx="1.6" fill="#7a4a8a" transform={`rotate(${i*30} ${x} ${y})`} />
      ))}
      <text x="150" y="30" fontSize="9" fill="#3f7a3a">animálculo</text>
      <text x="22" y="166" fontSize="9" fill="#7a4a8a">bacterias</text>
    </svg>
  )
}
