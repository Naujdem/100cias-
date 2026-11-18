import { useEffect, useState } from 'react'

// Maqueta de una ladera: se elige la cobertura (1 bosque, 2 potrero, 3 suelo desnudo) y la temporada (I invierno,
// V verano) y se ve cuánta lluvia se infiltra o escurre, cómo baja el río y cuánto barro lleva. Modelo cualitativo,
// con porcentajes redondos solo para comparar.

const COBERTURAS = [
  { id: 'bosque', n: 'Bosque', ic: '🌳', infiltra: 70, barro: 0.05, suelo: '#5a4630' },
  { id: 'potrero', n: 'Potrero', ic: '🐄', infiltra: 40, barro: 0.4, suelo: '#7a5a3a' },
  { id: 'desnudo', n: 'Suelo desnudo', ic: '🟫', infiltra: 15, barro: 0.85, suelo: '#a07a50' },
] as const

export default function MaquetaCuenca() {
  const [c, setC] = useState(0)
  const [invierno, setInvierno] = useState(true)
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const t = e.key.toLowerCase()
      if (t === '1' || t === '2' || t === '3') setC(Number(t) - 1)
      if (t === 'i') setInvierno(true)
      if (t === 'v') setInvierno(false)
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])

  const k = COBERTURAS[c]
  const escurre = 100 - k.infiltra
  // invierno: el río crece con lo que escurre; verano: lo sostiene lo que se infiltró
  const caudal = invierno ? 20 + escurre * 0.9 : 6 + k.infiltra * 0.5
  const agua = `rgb(${Math.round(90 + 90 * k.barro)}, ${Math.round(160 - 40 * k.barro)}, ${Math.round(214 - 130 * k.barro)})`
  const t = 'all 0.8s ease'

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 600 340" role="img" aria-label={`Ladera con ${k.n} en ${invierno ? 'invierno' : 'verano'}`} className="mx-auto w-full max-w-3xl">
        <rect x="0" y="0" width="600" height="340" fill={invierno ? '#dfe7ee' : '#f4eedc'} style={{ transition: t }} />
        {invierno
          ? <g>{Array.from({ length: 14 }, (_, n) => <line key={n} x1={40 + n * 28} y1={30 + (n % 3) * 10} x2={32 + n * 28} y2={52 + (n % 3) * 10} stroke="#2f7fc1" strokeWidth="2.5" />)}<ellipse cx="200" cy="25" rx="150" ry="18" fill="#b8c4ce" /></g>
          : <circle cx="80" cy="50" r="26" fill="#f4c542" />}
        {/* ladera */}
        <polygon points="0,110 440,250 440,340 0,340" fill={k.suelo} style={{ transition: t }} />
        <polygon points="0,170 440,290 440,340 0,340" fill="#3a5a8a" opacity="0.35" />
        <text x="90" y="290" fontSize="12" fontWeight="800" fill="#fff">agua guardada en el suelo</text>
        {/* cobertura */}
        {[30, 90, 150, 210, 270, 330, 390].map((x) => (
          <text key={x} x={x} y={110 + (x / 440) * 140} textAnchor="middle" fontSize={c === 0 ? 34 : 22}>{c === 2 ? '' : k.ic}</text>
        ))}
        {/* flechas: escorrentía (superficie) e infiltración (hacia abajo) */}
        {invierno && <>
          <line x1="40" y1="128" x2="400" y2="242" stroke="#a06a2a" strokeWidth={2 + escurre / 9} strokeDasharray="12 7" style={{ transition: t }} />
          {[80, 200, 320].map((x) => <line key={x} x1={x} y1={140 + (x / 440) * 140} x2={x} y2={190 + (x / 440) * 120} stroke="#2f7fc1" strokeWidth={2 + k.infiltra / 12} strokeDasharray="6 5" style={{ transition: t }} />)}
        </>}
        {/* río */}
        <rect x="440" y={330 - caudal} width="160" height={caudal} fill={agua} style={{ transition: t }} />
        <line x1="440" y1="250" x2="440" y2="340" stroke="#555" strokeWidth="3" />
        <text x="520" y={322 - caudal} textAnchor="middle" fontSize="13" fontWeight="800" fill="#3a3a3a" style={{ transition: t }}>río</text>
      </svg>
      <div className="grid w-full max-w-3xl grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-[#e3f0fa] p-2"><div className="text-2xl font-black text-[#2f7fc1]">{k.infiltra} %</div><div className="text-sm">se infiltra</div></div>
        <div className="rounded-xl bg-[#f6ebdc] p-2"><div className="text-2xl font-black text-[#a06a2a]">{escurre} %</div><div className="text-sm">escurre</div></div>
        <div className="rounded-xl bg-white p-2"><div className="text-2xl font-black">{k.barro < 0.2 ? 'clara' : k.barro < 0.6 ? 'turbia' : 'con mucho barro'}</div><div className="text-sm">agua del río</div></div>
      </div>
      <p aria-live="polite" className="max-w-3xl text-center text-lg">
        {invierno
          ? escurre > 50 ? <>En invierno el agua baja de golpe: <strong>creciente</strong> y barro.</> : <>En invierno el suelo absorbe el aguacero: el río crece <strong>poco</strong>.</>
          : k.infiltra > 50 ? <>En verano el agua guardada sigue saliendo: el río <strong>no se seca</strong>.</> : <>En verano no hay agua guardada: el río queda <strong>casi seco</strong>.</>}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {COBERTURAS.map((x, n) => (
          <button key={x.id} onClick={() => setC(n)} className={`rounded-xl border-2 px-3 py-1.5 font-bold ${n === c ? 'border-[#3f9a5a] bg-[#eef7f0]' : 'border-gray-300 bg-white'}`}>
            <span className="mr-1 rounded bg-gray-700 px-1.5 text-white">{n + 1}</span>{x.ic} {x.n}
          </button>
        ))}
        <button onClick={() => setInvierno(true)} className={`rounded-xl border-2 px-3 py-1.5 font-bold ${invierno ? 'border-[#2f7fc1] bg-[#e3f0fa]' : 'border-gray-300 bg-white'}`}><span className="mr-1 rounded bg-gray-700 px-1.5 text-white">I</span>🌧️ Invierno</button>
        <button onClick={() => setInvierno(false)} className={`rounded-xl border-2 px-3 py-1.5 font-bold ${!invierno ? 'border-[#e0a800] bg-[#fff6d6]' : 'border-gray-300 bg-white'}`}><span className="mr-1 rounded bg-gray-700 px-1.5 text-white">V</span>☀️ Verano</button>
      </div>
    </div>
  )
}
