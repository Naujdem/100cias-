import { useEffect, useState } from 'react'

// Un día de glucosa: cada cosa que se hace (1 comer arroz, 2 tomar gaseosa, 3 hacer ejercicio, 4 esperar 2 horas)
// mueve la glucosa y el páncreas responde con insulina o glucagón. Con D se cambia a «sin insulina» (diabetes tipo 1
// sin tratamiento) para ver que la glucosa no baja. Números redondos de clase (mg/dL), no valores clínicos.

const NORMAL = 90
type Paso = { t: string; g: number; ins: number }

export default function GlucosaDia() {
  const [sinInsulina, setSin] = useState(false)
  const [hist, setHist] = useState<Paso[]>([{ t: 'Inicio', g: NORMAL, ins: 0 }])
  const g = hist[hist.length - 1].g

  const hacer = (accion: 'arroz' | 'gaseosa' | 'ejercicio' | 'esperar') => {
    setHist((h) => {
      const ult = h[h.length - 1].g
      let sube = 0
      if (accion === 'arroz') sube = 50
      if (accion === 'gaseosa') sube = 80
      if (accion === 'ejercicio') sube = -25
      const tras = Math.max(55, ult + sube)
      // el páncreas corrige hacia 90 (sin insulina, solo baja muy poco)
      let fin = tras
      let ins = 0
      if (tras > NORMAL) {
        ins = sinInsulina ? 0 : 1
        fin = sinInsulina ? tras - 5 : NORMAL + (tras - NORMAL) * 0.25
      } else if (tras < NORMAL) {
        ins = -1 // glucagón
        fin = NORMAL - (NORMAL - tras) * 0.3
      }
      const nombre = { arroz: '🍚 arroz', gaseosa: '🥤 gaseosa', ejercicio: '🏃 ejercicio', esperar: '⏳ 2 horas' }[accion]
      const nuevos: Paso[] = accion === 'esperar' ? [{ t: nombre, g: fin, ins }] : [{ t: nombre, g: tras, ins: 0 }, { t: ins === 1 ? 'insulina' : ins === -1 ? 'glucagón' : '…', g: fin, ins }]
      return [...h, ...nuevos].slice(-14)
    })
  }

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const t = e.key.toLowerCase()
      if (t === '1') hacer('arroz')
      if (t === '2') hacer('gaseosa')
      if (t === '3') hacer('ejercicio')
      if (t === '4') hacer('esperar')
      if (t === 'd') setSin((v) => !v)
      if (t === 'r') setHist([{ t: 'Inicio', g: NORMAL, ins: 0 }])
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  })

  const y = (v: number) => 260 - Math.min(300, v) * 0.75
  const x = (k: number) => 60 + k * 36
  const camino = hist.map((p, k) => `${k ? 'L' : 'M'} ${x(k)} ${y(p.g)}`).join(' ')
  const estado = g > 180 ? ['⚠️ Glucosa muy alta', '#c43c3c'] : g > 140 ? ['Glucosa alta', '#e08a2e'] : g < 70 ? ['Glucosa baja', '#2f6fc1'] : ['Glucosa normal', '#3f9a5a']

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 600 300" role="img" aria-label={`${estado[0]}: ${Math.round(g)} mg/dL`} className="mx-auto w-full max-w-3xl">
        <rect x="0" y="0" width="600" height="300" fill="#f3f0ea" />
        <rect x="50" y={y(140)} width="540" height={y(70) - y(140)} fill="#dcefe0" />
        <text x="45" y={y(105)} textAnchor="end" fontSize="11" fill="#3f9a5a" fontWeight="800">normal</text>
        <line x1="50" y1={y(180)} x2="590" y2={y(180)} stroke="#c43c3c" strokeDasharray="5 4" />
        <text x="45" y={y(180) + 4} textAnchor="end" fontSize="11" fill="#c43c3c">alta</text>
        <path d={camino} fill="none" stroke="#b5651d" strokeWidth="4" strokeLinejoin="round" />
        {hist.map((p, k) => (
          <g key={k}>
            <circle cx={x(k)} cy={y(p.g)} r="5" fill={p.ins === 1 ? '#7a4a9a' : p.ins === -1 ? '#2f6fc1' : '#b5651d'} />
            <text x={x(k)} y={285} textAnchor="middle" fontSize="9" fill="#555" transform={`rotate(-30 ${x(k)} 285)`}>{p.t}</text>
          </g>
        ))}
        <text x="580" y="30" textAnchor="end" fontSize="20" fontWeight="900" fill={estado[1]}>{Math.round(g)} mg/dL</text>
        <text x="580" y="50" textAnchor="end" fontSize="13" fontWeight="800" fill={estado[1]}>{estado[0]}</text>
        <text x="60" y="30" fontSize="13" fontWeight="800" fill={sinInsulina ? '#c43c3c' : '#7a4a9a'}>{sinInsulina ? 'Páncreas SIN insulina (tipo 1 sin tratamiento)' : 'Páncreas sano'}</text>
      </svg>
      <p aria-live="polite" className="max-w-3xl text-center text-lg">
        {sinInsulina
          ? g > 140 ? 'Sin insulina, la glucosa no puede entrar a las células: se queda alta en la sangre. Por eso las personas con diabetes tipo 1 se inyectan insulina.' : 'Prueba a comer algo (1 o 2) y mira qué pasa sin insulina.'
          : 'Morado: el páncreas suelta insulina y la glucosa baja. Azul: suelta glucagón y la glucosa sube.'}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {[['1', '🍚 Comer arroz', 'arroz'], ['2', '🥤 Gaseosa', 'gaseosa'], ['3', '🏃 Ejercicio', 'ejercicio'], ['4', '⏳ Esperar 2 h', 'esperar']].map(([k, n, a]) => (
          <button key={k} onClick={() => hacer(a as 'arroz')} className="rounded-xl border-2 border-gray-300 bg-white px-3 py-1.5 font-bold">
            <span className="mr-1 rounded bg-gray-700 px-1.5 text-white">{k}</span>{n}
          </button>
        ))}
        <button onClick={() => setSin((v) => !v)} className={`rounded-xl border-2 px-3 py-1.5 font-bold ${sinInsulina ? 'border-[#c43c3c] bg-[#fbeaea]' : 'border-gray-300 bg-white'}`}>
          <span className="mr-1 rounded bg-gray-700 px-1.5 text-white">D</span>Sin insulina
        </button>
      </div>
      <p className="max-w-3xl text-center text-sm text-gray-600">1–4: lo que haces · D: páncreas sin insulina · R: empezar de nuevo. Números redondos para la clase, no valores médicos.</p>
    </div>
  )
}
