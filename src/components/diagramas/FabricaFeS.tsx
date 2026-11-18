import { useEffect, useState } from 'react'

// Explora (Química área 3, tema 6): fábrica de sulfuro de hierro. Fe + S → FeS en proporción de masa 7 : 4.
// A/D cambian los gramos de hierro, W/S los de azufre (de 1 en 1). Muestra cuánto FeS se forma y cuánto sobra.

export default function FabricaFeS() {
  const [fe, setFe] = useState(14)
  const [s, setS] = useState(8)
  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => {
      const t = ev.key.toLowerCase()
      if (t === 'a') setFe((v) => Math.max(0, v - 1))
      if (t === 'd') setFe((v) => Math.min(40, v + 1))
      if (t === 's') setS((v) => Math.max(0, v - 1))
      if (t === 'w') setS((v) => Math.min(40, v + 1))
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])
  // reacciona lo que alcance en la proporción 7 : 4
  const feUsado = Math.min(fe, (s * 7) / 4)
  const sUsado = (feUsado * 4) / 7
  const fes = feUsado + sUsado
  const sobraFe = fe - feUsado, sobraS = s - sUsado
  const r = (x: number) => (Math.round(x * 10) / 10).toLocaleString('es-CO')
  const sobra = sobraFe > 0.05 ? `Sobran ${r(sobraFe)} g de hierro` : sobraS > 0.05 ? `Sobran ${r(sobraS)} g de azufre` : 'No sobra nada: proporción exacta'
  const esc = 6
  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <label className="flex flex-col items-center text-sm font-semibold">Hierro (A/D): {fe} g
          <input type="range" min={0} max={40} value={fe} onChange={(e) => setFe(+e.target.value)} className="w-48" />
        </label>
        <label className="flex flex-col items-center text-sm font-semibold">Azufre (W/S): {s} g
          <input type="range" min={0} max={40} value={s} onChange={(e) => setS(+e.target.value)} className="w-48" />
        </label>
      </div>
      <svg viewBox="0 0 420 200" role="img" aria-label="Masas antes y después de la reacción" className="w-full max-w-2xl">
        <rect width="420" height="200" rx="10" fill="#f4f1ea" />
        <text x="100" y="22" textAnchor="middle" fontSize="13" fontWeight="800">Antes</text>
        <text x="310" y="22" textAnchor="middle" fontSize="13" fontWeight="800">Después</text>
        <line x1="210" y1="30" x2="210" y2="190" stroke="#bbb" strokeDasharray="4 3" />
        {/* antes */}
        <rect x="45" y={180 - fe * esc / 2} width="45" height={fe * esc / 2} fill="#8d97a3" />
        <text x="67" y="195" textAnchor="middle" fontSize="10" fontWeight="700">Fe {fe} g</text>
        <rect x="110" y={180 - s * esc / 2} width="45" height={s * esc / 2} fill="#e9d23f" />
        <text x="132" y="195" textAnchor="middle" fontSize="10" fontWeight="700">S {s} g</text>
        {/* después */}
        <rect x="240" y={180 - fes * esc / 2} width="45" height={fes * esc / 2} fill="#4b4b4b" />
        <text x="262" y="195" textAnchor="middle" fontSize="10" fontWeight="700">FeS {r(fes)} g</text>
        <rect x="305" y={180 - sobraFe * esc / 2} width="45" height={sobraFe * esc / 2} fill="#8d97a3" />
        <rect x="355" y={180 - sobraS * esc / 2} width="45" height={sobraS * esc / 2} fill="#e9d23f" />
        <text x="352" y="195" textAnchor="middle" fontSize="10" fontWeight="700">sobra</text>
      </svg>
      <div className="rounded-xl border-2 border-[var(--acento)] bg-white px-4 py-2 text-center">
        <p className="text-lg">Reaccionan <b>{r(feUsado)} g de Fe</b> con <b>{r(sUsado)} g de S</b> → <b>{r(fes)} g de FeS</b></p>
        <p className="font-semibold" style={{ color: sobraFe + sobraS > 0.05 ? '#c43c3c' : '#4f8a3c' }}>{sobra}</p>
        <p className="text-sm opacity-70">Masa antes: {fe + s} g · masa después: {r(fes + sobraFe + sobraS)} g (Lavoisier)</p>
      </div>
      <p className="max-w-xl text-center text-xs opacity-70">El sulfuro de hierro siempre lleva 7 g de hierro por cada 4 g de azufre (Proust). Lo que pasa de esa proporción no reacciona y sobra.</p>
    </div>
  )
}
