// Ilustración esquemática (no es un plano técnico): microscopio compuesto del siglo XVII,
// con lámpara de aceite y un globo de agua que concentra la luz sobre la muestra.
export default function MicroscopioHooke() {
  return (
    <svg viewBox="0 0 240 260" role="img" aria-label="Microscopio compuesto del siglo XVII con lámpara de aceite" className="h-full w-full">
      <rect width="240" height="260" fill="#efe3cc" />

      {/* base de tres patas */}
      <ellipse cx="150" cy="240" rx="58" ry="8" fill="#000" opacity="0.12" />
      <path d="M150 215 L112 238 M150 215 L188 238 M150 215 L150 242" stroke="#4a3416" strokeWidth="6" strokeLinecap="round" />
      <circle cx="150" cy="212" r="9" fill="#b8893b" stroke="#6b4a1f" strokeWidth="2" />

      {/* columna y brazo */}
      <rect x="144" y="150" width="12" height="62" fill="#b8893b" stroke="#6b4a1f" strokeWidth="2" />
      <rect x="128" y="132" width="44" height="8" rx="3" fill="#b8893b" stroke="#6b4a1f" strokeWidth="2" />

      {/* tubo recubierto de cuero con bandas doradas */}
      <rect x="130" y="26" width="40" height="104" rx="6" fill="#7a4b24" stroke="#4a2c12" strokeWidth="2" />
      {[40, 68, 96].map((y) => (
        <rect key={y} x="128" y={y} width="44" height="5" rx="2" fill="#d6a94a" />
      ))}
      <rect x="138" y="14" width="24" height="14" rx="4" fill="#5b3a1b" stroke="#3b230f" strokeWidth="2" />
      <rect x="142" y="128" width="16" height="16" rx="3" fill="#b8893b" stroke="#6b4a1f" strokeWidth="2" />

      {/* platina y muestra de corcho */}
      <ellipse cx="150" cy="166" rx="26" ry="5" fill="#b8893b" stroke="#6b4a1f" strokeWidth="2" />
      <rect x="141" y="158" width="18" height="6" rx="1" fill="#e8cd98" stroke="#8a6a3b" strokeWidth="1.2" />

      {/* globo de agua */}
      <circle cx="84" cy="150" r="22" fill="#bae6fd" fillOpacity="0.55" stroke="#38bdf8" strokeWidth="2.5" />
      <path d="M70 142 C74 136 80 134 86 135" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />

      {/* lámpara de aceite */}
      <path d="M30 214 C26 196 44 186 58 196 C68 204 66 214 66 220 H30 Z" fill="#b8893b" stroke="#6b4a1f" strokeWidth="2" />
      <rect x="36" y="220" width="36" height="8" rx="3" fill="#6b4a1f" />
      <path d="M52 192 C44 180 52 172 52 164 C60 172 62 184 52 192 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />

      {/* trayecto de la luz */}
      <path d="M58 172 L66 160 M104 154 L141 160" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" fill="none" />
    </svg>
  )
}
