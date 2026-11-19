import { useEffect, useState } from 'react'

// El riñón ajusta la orina: se cambia el agua que se toma (A/D) y el sudor del día (W/S).
// Si falta agua, la ADH (desde 11°) hace que el riñón ahorre: orina poca y oscura. Si sobra, orina mucha y clara.
// Modelo de clase con números redondos (litros por día), no un cálculo médico.

const PERDIDA_FIJA = 0.9 // aliento, heces y piel sin sudor visible
const MIN_ORINA = 0.5

export default function RinonAgua() {
  const [bebe, setBebe] = useState(2) // litros (incluye el agua de la comida)
  const [sudor, setSudor] = useState(0.5)
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const t = e.key.toLowerCase()
      if (t === 'd') setBebe((v) => Math.min(5, +(v + 0.25).toFixed(2)))
      if (t === 'a') setBebe((v) => Math.max(0.5, +(v - 0.25).toFixed(2)))
      if (t === 'w') setSudor((v) => Math.min(3, +(v + 0.25).toFixed(2)))
      if (t === 's') setSudor((v) => Math.max(0, +(v - 0.25).toFixed(2)))
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])

  const disponible = bebe - PERDIDA_FIJA - sudor
  const orina = Math.max(MIN_ORINA, disponible)
  const falta = disponible < MIN_ORINA ? MIN_ORINA - disponible : 0
  const adh = Math.max(0, Math.min(1, 1 - (disponible - 0.5) / 2))
  const color = `hsl(${48 - adh * 18}, ${55 + adh * 40}%, ${85 - adh * 45}%)`
  const fmt = (n: number) => n.toFixed(2).replace('.', ',')
  const msg =
    falta > 0
      ? `⚠️ Deshidratación: aunque el riñón ahorra al máximo, se pierden ${fmt(falta)} L más de los que entran. Hay que tomar agua.`
      : adh > 0.6
        ? '🟧 El riñón está ahorrando agua: orina poca y oscura. Buena idea tomar un vaso de agua.'
        : adh < 0.2
          ? '🟨 Sobra agua: el riñón la deja ir. Orina mucha y clara.'
          : '🙂 Equilibrio: lo que entra es igual a lo que sale.'

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 600 300" role="img" aria-label={`Bebe ${fmt(bebe)} L, suda ${fmt(sudor)} L, orina ${fmt(orina)} L`} className="mx-auto w-full max-w-3xl">
        <rect x="0" y="0" width="600" height="300" fill="#f3f0ea" />
        <text x="90" y="40" textAnchor="middle" fontSize="15" fontWeight="800" fill="#2f6fc1">ENTRA</text>
        <text x="90" y="90" textAnchor="middle" fontSize="36">🥤</text>
        <text x="90" y="125" textAnchor="middle" fontSize="20" fontWeight="900" fill="#3a3a3a">{fmt(bebe)} L</text>
        <text x="90" y="145" textAnchor="middle" fontSize="11" fill="#555">bebidas y comida</text>
        <text x="300" y="40" textAnchor="middle" fontSize="15" fontWeight="800" fill="#c43c3c">SALE</text>
        <text x="240" y="90" textAnchor="middle" fontSize="28">💦</text>
        <text x="240" y="120" textAnchor="middle" fontSize="16" fontWeight="800" fill="#3a3a3a">{fmt(sudor)} L</text>
        <text x="240" y="138" textAnchor="middle" fontSize="11" fill="#555">sudor</text>
        <text x="360" y="90" textAnchor="middle" fontSize="28">🌬️</text>
        <text x="360" y="120" textAnchor="middle" fontSize="16" fontWeight="800" fill="#3a3a3a">{fmt(PERDIDA_FIJA)} L</text>
        <text x="360" y="138" textAnchor="middle" fontSize="11" fill="#555">aliento, piel y heces</text>
        {/* riñón y frasco de orina */}
        <path d="M 470 60 C 430 60 425 140 470 145 C 495 148 500 120 493 102 C 500 82 495 60 470 60 Z" fill="#a8504a" />
        <text x="470" y="170" textAnchor="middle" fontSize="12" fontWeight="800" fill="#3a3a3a">riñón</text>
        <text x="470" y="186" textAnchor="middle" fontSize="11" fill="#8a4a9a">ADH: {adh > 0.6 ? 'alta' : adh < 0.2 ? 'baja' : 'media'}</text>
        <rect x="440" y="200" width="60" height="85" rx="8" fill="#fff" stroke="#999" strokeWidth="2" />
        <rect x="444" y={281 - Math.min(77, orina * 22)} width="52" height={Math.min(77, orina * 22)} rx="5" fill={color} style={{ transition: 'all 0.6s ease' }} />
        <text x="540" y="250" textAnchor="middle" fontSize="18" fontWeight="900" fill="#3a3a3a">{fmt(orina)} L</text>
        <text x="540" y="268" textAnchor="middle" fontSize="11" fill="#555">orina</text>
        {/* balanza */}
        <line x1="90" y1="210" x2="330" y2={210 + Math.max(-30, Math.min(30, -falta * 30))} stroke="#666" strokeWidth="6" strokeLinecap="round" style={{ transition: 'all 0.6s ease' }} />
        <polygon points="210,212 195,245 225,245" fill="#888" />
        <text x="210" y="275" textAnchor="middle" fontSize="13" fontWeight="800" fill={falta > 0 ? '#c43c3c' : '#3f9a5a'}>{falta > 0 ? 'sale más de lo que entra' : 'entra = sale'}</text>
      </svg>
      <p aria-live="polite" className="max-w-3xl text-center text-lg">{msg}</p>
      <p className="max-w-3xl text-center text-sm text-gray-600">A/D: tomar menos o más agua. W/S: sudar más o menos (sol, ejercicio). Números redondos de clase: el riñón no puede bajar de unos 0,5 L de orina al día, porque necesita agua para sacar la urea.</p>
    </div>
  )
}
