// Ilustración esquemática (no es un plano técnico): microscopio simple de Leeuwenhoek.
export default function MicroscopioLeeuwenhoek() {
  return (
    <svg viewBox="0 0 240 180" role="img" aria-label="Microscopio simple: una lente diminuta entre dos placas de metal y una aguja con la muestra" className="h-full w-full">
      <rect width="240" height="180" fill="#efe3cc" />
      <ellipse cx="120" cy="164" rx="70" ry="6" fill="#000" opacity="0.1" />
      {/* placa de metal */}
      <rect x="86" y="22" width="52" height="124" rx="6" fill="#c9a24f" stroke="#7a5a1c" strokeWidth="2.5" />
      <rect x="92" y="28" width="40" height="112" rx="4" fill="none" stroke="#7a5a1c" strokeWidth="1" opacity="0.6" />
      {/* lente */}
      <circle cx="112" cy="58" r="9" fill="#cfe9ee" stroke="#7a5a1c" strokeWidth="3" />
      <circle cx="109" cy="55" r="2.5" fill="#fff" opacity="0.8" />
      {/* aguja con la muestra */}
      <path d="M164 58 H119" stroke="#4a3416" strokeWidth="3" strokeLinecap="round" />
      <circle cx="121" cy="58" r="3" fill="#6fa0a8" />
      {/* tornillos */}
      <path d="M138 58 H168 M168 58 V100" stroke="#7a5a1c" strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="168" cy="106" r="8" fill="#b8893b" stroke="#6b4a1f" strokeWidth="2" />
      <path d="M138 100 H152" stroke="#7a5a1c" strokeWidth="4" strokeLinecap="round" />
      <circle cx="156" cy="100" r="4" fill="#b8893b" stroke="#6b4a1f" strokeWidth="2" />
      {/* rótulos */}
      <text x="22" y="52" fontSize="9" fill="#4a3416">lente</text>
      <path d="M44 50 L100 56" stroke="#4a3416" strokeWidth="1" />
      <text x="170" y="38" fontSize="9" fill="#4a3416">aguja con la muestra</text>
      <text x="22" y="150" fontSize="9" fill="#4a3416">placa de metal</text>
      <path d="M72 147 L90 140" stroke="#4a3416" strokeWidth="1" />
      <text x="176" y="124" fontSize="9" fill="#4a3416">tornillo</text>
    </svg>
  )
}
