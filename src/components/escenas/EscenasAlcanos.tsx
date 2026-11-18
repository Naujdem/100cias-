// Escenas vivas de Química orgánica, tema 3: alcanos.
import { Molecula, construir, cadena, MOLS, Lienzo, T, ver, idx, Zigzag, ROJO, AZUL, VERDE, TINTA } from './Molecula.tsx'

const CO = ['biogas', 'cilindro', 'gasolina', 'vela']

export function EscenaAlcCocina({ fase }: { fase: string }) {
  const i = idx(CO, fase)
  return (
    <Lienzo etiqueta={`Alcanos en la vida diaria: ${fase}`}>
      <g style={ver(i === 0)}>
        <text x="90" y="150" fontSize="56" textAnchor="middle">🐄</text>
        <path d="M150 150 q30 -40 60 0" fill="none" stroke="#8b6b3a" strokeWidth="4" />
        <ellipse cx="250" cy="160" rx="55" ry="30" fill="#c9b18a" stroke={TINTA} strokeWidth="2" />
        <T x={250} y={165} t="biodigestor" s={11} />
        <g transform="translate(0 -40)"><Molecula mol={MOLS.metano(330, 110)} s={0.8} /></g>
        <T x={200} y={240} t="El estiércol se descompone sin oxígeno y da metano: CH₄" s={13} />
      </g>
      <g style={ver(i === 1)}>
        <rect x="70" y="80" width="70" height="130" rx="30" fill="#7d8b99" stroke={TINTA} strokeWidth="2" />
        <rect x="95" y="65" width="20" height="18" fill="#555" />
        <Molecula mol={construir(cadena(3, 180, 120, 34).at, cadena(3, 180, 120, 34).en, 'todos', 18)} s={0.75} />
        <Molecula mol={construir(cadena(4, 180, 185, 34).at, cadena(4, 180, 185, 34).en, 'todos', 18)} s={0.75} />
        <T x={330} y={124} t="propano" s={12} c={AZUL} /><T x={330} y={190} t="butano" s={12} c={AZUL} />
        <T x={200} y={250} t="Gas licuado del cilindro: propano y butano" s={13} />
      </g>
      <g style={ver(i === 2)}>
        <rect x="60" y="90" width="80" height="120" rx="8" fill="#e05a3a" stroke={TINTA} strokeWidth="2" />
        <T x={100} y={155} t="⛽" s={30} />
        <Zigzag n={8} x={180} y={150} paso={24} alto={22} />
        <T x={265} y={195} t="octano: C₈H₁₈" s={12} c={AZUL} />
        <T x={200} y={250} t="Gasolina: alcanos líquidos de 5 a 10 carbonos" s={13} />
      </g>
      <g style={ver(i === 3)}>
        <rect x="85" y="120" width="40" height="100" fill="#f7f1d8" stroke={TINTA} strokeWidth="2" />
        <path d="M105 118 q-12 -22 0 -42 q12 20 0 42" fill="#f6a33c" />
        <Zigzag n={11} x={160} y={160} paso={20} alto={18} />
        <T x={260} y={200} t="… más de 20 carbonos" s={12} c={AZUL} />
        <T x={200} y={250} t="Parafina de las velas: alcanos sólidos" s={13} />
      </g>
      <T x={200} y={40} t={['1 carbono · gas', '3 y 4 carbonos · gases', '5 a 10 carbonos · líquidos', '20 o más carbonos · sólidos'][i]} s={15} c={ROJO} />
    </Lienzo>
  )
}

const RA = ['molecula', 'cadena', 'numerar', 'nombre']

export function EscenaAlcRamificado({ fase }: { fase: string }) {
  const i = idx(RA, fase)
  // CH₃–CH(CH₃)–CH₂–CH₂–CH₃ dibujado con la rama arriba
  const xs = [100, 150, 200, 250, 300]
  const cadenaOn = i >= 1
  return (
    <Lienzo etiqueta={`Nombrar un alcano ramificado: ${fase}`}>
      {cadenaOn && <rect x="80" y="130" width="240" height="40" rx="20" fill="#f6d55c" opacity="0.6" />}
      {xs.slice(1).map((x, k) => <line key={k} x1={xs[k]} y1="150" x2={x} y2="150" stroke={TINTA} strokeWidth="3" />)}
      <line x1="150" y1="150" x2="150" y2="95" stroke={TINTA} strokeWidth="3" />
      {xs.map((x, k) => <g key={k}><circle cx={x} cy="150" r="16" fill={TINTA} /><T x={x} y={155} t={['CH₃', 'CH', 'CH₂', 'CH₂', 'CH₃'][k]} s={9} c="#fff" /></g>)}
      <circle cx="150" cy="90" r="16" fill={i >= 3 ? VERDE : TINTA} /><T x={150} y={95} t="CH₃" s={9} c="#fff" />
      <g style={ver(i >= 2)}>{xs.map((x, k) => <T key={k} x={x} y={192} t={String(k + 1)} s={14} c={AZUL} />)}</g>
      <g style={ver(i === 2)}><T x={330} y={196} t="→" s={16} c={ROJO} /><T x={70} y={196} t="✔" s={14} c={VERDE} /></g>
      <T x={200} y={40} t={['CH₃–CH(CH₃)–CH₂–CH₂–CH₃', 'La cadena más larga: 5 carbonos → pentano', 'Numerar desde el extremo más cerca de la rama', '2-metilpentano'][i]} s={i === 3 ? 22 : 14} c={i === 3 ? VERDE : TINTA} />
      <T x={200} y={250} t={['¿Cuál es la cadena principal?', 'Puede estar doblada: hay que contar con cuidado', 'Así el metilo queda en el carbono 2 (no en el 4)', 'número de la rama + nombre de la rama + nombre de la cadena'][i]} s={12} peso={600} />
    </Lienzo>
  )
}

const IS = ['butano', 'metilpropano', 'pentanos']

export function EscenaAlcIsomeros({ fase }: { fase: string }) {
  const i = idx(IS, fase)
  const but = cadena(4, 130, 150, 45)
  const met = { at: [...cadena(3, 155, 165, 45).at, ['C', 200, 120] as [string, number, number]], en: [...cadena(3, 155, 165, 45).en, [1, 3] as [number, number]] }
  return (
    <Lienzo etiqueta={`Isómeros: ${fase}`}>
      <g style={ver(i === 0)}><Molecula mol={construir(but.at, but.en, 'todos', 22)} /></g>
      <g style={ver(i === 1)}><Molecula mol={construir(met.at, met.en, 'todos', 22)} /></g>
      <g style={ver(i === 2)}>
        <Zigzag n={5} x={30} y={150} paso={22} alto={20} />
        <g transform="translate(150 0)"><Zigzag n={4} x={0} y={150} paso={26} alto={20} /><line x1="26" y1="140" x2="26" y2="110" stroke={TINTA} strokeWidth="3" /></g>
        <g transform="translate(300 150)"><line x1="-25" y1="0" x2="25" y2="0" stroke={TINTA} strokeWidth="3" /><line x1="0" y1="-25" x2="0" y2="25" stroke={TINTA} strokeWidth="3" /></g>
        <T x={75} y={195} t="pentano · 36 °C" s={11} /><T x={190} y={195} t="metilbutano · 28 °C" s={11} /><T x={300} y={195} t="dimetilpropano · 10 °C" s={11} />
      </g>
      <T x={200} y={40} t={['C₄H₁₀ · butano', 'C₄H₁₀ · metilpropano', 'C₅H₁₂ · tres isómeros'][i]} s={16} c={AZUL} />
      <T x={200} y={255} t={['Cadena recta: hierve a −0,5 °C', 'La misma fórmula, ramificada: hierve a −12 °C', 'Más ramas → más compacta → hierve a menos temperatura'][i]} s={13} c={i === 2 ? ROJO : TINTA} />
    </Lienzo>
  )
}

const CB = ['completa', 'incompleta', 'ecuacion']

export function EscenaAlcCombustion({ fase }: { fase: string }) {
  const i = idx(CB, fase)
  const azul = i !== 1
  return (
    <Lienzo etiqueta={`Combustión de un alcano: ${fase}`}>
      <g style={ver(i < 2)}>
        <rect x="120" y="190" width="160" height="14" rx="4" fill="#666" />
        {[-40, -15, 15, 40].map((d) => (
          <path key={d} d={`M${200 + d} 188 q-10 -30 0 -${azul ? 50 : 80} q10 30 0 ${azul ? 50 : 80}`} fill={azul ? '#4a86e8' : '#f6a33c'} opacity="0.85" style={{ transition: 'all 0.8s' }} />
        ))}
        <g style={ver(i === 1)}>{[0, 1, 2, 3, 4].map((k) => <circle key={k} cx={175 + k * 12} cy={90 - (k % 2) * 10} r="6" fill="#333" opacity="0.7" />)}</g>
        <T x={200} y={40} t={azul ? 'Llama azul: combustión completa' : 'Llama amarilla: falta oxígeno'} s={15} c={azul ? AZUL : ROJO} />
        <T x={200} y={240} t={azul ? 'CH₄ + 2 O₂ → CO₂ + 2 H₂O + energía' : 'Sale hollín (C) y monóxido de carbono (CO), muy venenoso'} s={13} />
      </g>
      <g style={ver(i === 2)}>
        <Molecula mol={MOLS.metano(70, 140)} s={0.8} />
        <T x={115} y={145} t="+" s={20} />
        {[0, 1].map((k) => <Molecula key={k} mol={construir([['O', 140, 125 + k * 40], ['O', 166, 125 + k * 40]], [[0, 1, 2]], 'no')} s={0.8} />)}
        <T x={195} y={145} t="→" s={22} c={ROJO} />
        <Molecula mol={construir([['O', 220, 140], ['C', 246, 140], ['O', 272, 140]], [[0, 1, 2], [1, 2, 2]], 'no')} s={0.8} />
        <T x={295} y={145} t="+" s={20} />
        {[0, 1].map((k) => <Molecula key={k} mol={construir([['O', 335, 120 + k * 45]], [], 'todos', 16)} s={0.8} />)}
        <T x={200} y={40} t="1 CH₄ + 2 O₂ → 1 CO₂ + 2 H₂O" s={16} c={VERDE} />
        <T x={200} y={240} t="Todos los átomos se conservan: solo se reorganizan" s={13} />
      </g>
    </Lienzo>
  )
}
