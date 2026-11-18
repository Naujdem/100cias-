// Escenas vivas de Química, área 5 (orgánica), tema 1: el carbono y sus compuestos.
import { Molecula, construir, cadena, hexagono, MOLS, Lienzo, T, ver, idx, suave, Zigzag, ROJO, AZUL, VERDE, TINTA } from './Molecula.tsx'

/* ── De la fuerza vital a Wöhler ── */

const WO = ['vital', 'wohler', 'hoy']

export function EscenaWohler({ fase }: { fase: string }) {
  const i = idx(WO, fase)
  return (
    <Lienzo etiqueta={`Wöhler y la urea: ${fase}`}>
      <g style={ver(i === 0)}>
        <text x="90" y="150" fontSize="60" textAnchor="middle">🌿</text>
        <text x="200" y="150" fontSize="60" textAnchor="middle">🐄</text>
        <text x="310" y="150" fontSize="60" textAnchor="middle">🍯</text>
        <T x={200} y={210} t="«Solo la vida puede fabricar sustancias orgánicas»" s={13} />
        <T x={200} y={232} t="(teoría de la fuerza vital)" s={11} peso={600} />
      </g>
      <g style={ver(i === 1)}>
        <rect x="40" y="90" width="110" height="60" rx="8" fill="#fff" stroke={TINTA} strokeWidth="2" />
        <T x={95} y={115} t="NH₄OCN" s={15} />
        <T x={95} y={135} t="cianato de amonio" s={10} peso={600} />
        <path d="M160 120 h70" stroke={ROJO} strokeWidth="3" markerEnd="url(#wo-f)" />
        <T x={195} y={108} t="🔥 calor" s={12} c={ROJO} />
        <Molecula mol={construir([['C', 300, 120], ['O', 300, 82], ['N', 265, 140], ['N', 335, 140]], [[0, 1, 2], [0, 2], [0, 3]])} />
        <T x={300} y={185} t="urea: CO(NH₂)₂" s={13} c={AZUL} />
        <T x={200} y={235} t="Friedrich Wöhler, 1828: una sal mineral → una sustancia de la orina" s={12} />
      </g>
      <g style={ver(i === 2)}>
        {[['⛽', 'combustibles'], ['💊', 'medicamentos'], ['🧴', 'plásticos'], ['🎨', 'colorantes'], ['🧬', 'vida']].map(([e, n], k) => (
          <g key={n}><text x={60 + k * 70} y="135" fontSize="38" textAnchor="middle">{e}</text><T x={60 + k * 70} y={165} t={n} s={11} peso={600} /></g>
        ))}
        <T x={200} y={70} t="Química orgánica = química de los compuestos del carbono" s={14} c={VERDE} />
        <T x={200} y={220} t="(menos CO₂, carbonatos y cianuros, que van con la inorgánica)" s={11} peso={600} />
      </g>
      <defs><marker id="wo-f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill={ROJO} /></marker></defs>
    </Lienzo>
  )
}

/* ── El carbono hace 4 enlaces ── */

const CA = ['atomo', 'metano', 'cadena', 'multiples']

export function EscenaCarbono({ fase }: { fase: string }) {
  const i = idx(CA, fase)
  const anillo = hexagono(320, 150, 30)
  return (
    <Lienzo etiqueta={`El carbono: ${fase}`}>
      <g style={ver(i === 0)}>
        <circle cx="200" cy="140" r="14" fill={TINTA} /><T x={200} y={145} t="6+" s={10} c="#fff" />
        <circle cx="200" cy="140" r="38" fill="none" stroke="#999" strokeDasharray="3 3" />
        <circle cx="200" cy="140" r="75" fill="none" stroke="#999" strokeDasharray="3 3" />
        {[0, 180].map((g) => <circle key={g} cx={200 + 38 * Math.cos((g * Math.PI) / 180)} cy={140 + 38 * Math.sin((g * Math.PI) / 180)} r="6" fill={AZUL} />)}
        {[45, 135, 225, 315].map((g) => <circle key={g} cx={200 + 75 * Math.cos((g * Math.PI) / 180)} cy={140 + 75 * Math.sin((g * Math.PI) / 180)} r="7" fill={ROJO} />)}
        <T x={200} y={250} t="2 electrones adentro y 4 en el último nivel: 4 enlaces" s={13} />
      </g>
      <g style={ver(i === 1)}>
        <Molecula mol={MOLS.metano(200, 140)} s={1.6} />
        <T x={200} y={240} t="Metano, CH₄: el carbono comparte 4 pares de electrones" s={13} />
      </g>
      <g style={ver(i === 2)}>
        <Molecula mol={construir(cadena(4, 30, 120, 28).at, cadena(4, 30, 120, 28).en, 'no')} s={0.8} />
        <Molecula mol={construir([...cadena(4, 150, 120, 28).at, ['C', 178, 92]], [...cadena(4, 150, 120, 28).en, [1, 4]], 'no')} s={0.8} />
        <Molecula mol={{ at: anillo.map(([x, y]) => ['C', x, y] as [string, number, number]), en: anillo.map((_, k) => [k, (k + 1) % 6] as [number, number]) }} s={0.8} />
        <T x={72} y={175} t="lineal" s={12} /><T x={192} y={175} t="ramificada" s={12} /><T x={320} y={205} t="cíclica" s={12} />
        <T x={200} y={250} t="Los carbonos se unen entre sí: cadenas casi sin límite" s={13} />
      </g>
      <g style={ver(i === 3)}>
        {[[MOLS.etano(40, 120), 'etano C–C'], [MOLS.eteno(165, 120), 'eteno C=C'], [MOLS.etino(290, 120), 'etino C≡C']].map(([m, n], k) => (
          <g key={k}><Molecula mol={m as ReturnType<typeof MOLS.etano>} /><T x={60 + k * 125} y={190} t={n as string} s={12} c={[TINTA, AZUL, ROJO][k]} /></g>
        ))}
        <T x={200} y={240} t="Doble cuenta por 2 enlaces y triple por 3" s={13} />
      </g>
    </Lienzo>
  )
}

/* ── Cuatro maneras de escribir el butano ── */

const FO = ['molecular', 'desarrollada', 'semi', 'esqueleto']

export function EscenaFormulas({ fase }: { fase: string }) {
  const i = idx(FO, fase)
  const b = cadena(4, 95, 140, 70)
  return (
    <Lienzo etiqueta={`Fórmulas del butano: ${fase}`}>
      <T x={200} y={40} t={['Fórmula molecular', 'Fórmula desarrollada', 'Fórmula semidesarrollada', 'Fórmula de esqueleto'][i]} s={16} c={AZUL} />
      <g style={ver(i === 0)}><T x={200} y={160} t="C₄H₁₀" s={48} /><T x={200} y={220} t="Dice cuántos átomos hay, no cómo están unidos" s={12} peso={600} /></g>
      <g style={ver(i === 1)}><Molecula mol={construir(b.at, b.en, 'todos', 30)} s={1.1} /></g>
      <g style={ver(i === 2)}><T x={200} y={155} t="CH₃–CH₂–CH₂–CH₃" s={28} /><T x={200} y={220} t="Los H van junto a su carbono" s={12} peso={600} /></g>
      <g style={ver(i === 3)}>
        <g transform="translate(125 0)" style={{ transition: suave }}><Zigzag n={4} x={0} y={150} paso={50} alto={50} /></g>
        {[0, 1, 2, 3].map((k) => <circle key={k} cx={125 + k * 50} cy={k % 2 ? 125 : 175} r="9" fill="none" stroke={ROJO} strokeWidth="2" strokeDasharray="3 2" />)}
        <T x={200} y={235} t="Cada punta es un C; los H de los carbonos no se escriben" s={12} peso={600} />
      </g>
    </Lienzo>
  )
}

/* ── Hibridación ── */

const HI = ['sp3', 'sp2', 'sp']

export function EscenaHibridacion({ fase }: { fase: string }) {
  const i = idx(HI, fase)
  const cx = 200, cy = 140
  const brazos = [
    [[0, -70], [-62, 30], [62, 30], [12, 45]],
    [[0, -70], [-61, 35], [61, 35]],
    [[-80, 0], [80, 0]],
  ][i]
  return (
    <Lienzo etiqueta={`Hibridación ${fase}`}>
      {brazos.map(([dx, dy], k) => (
        <g key={k} style={{ transition: suave }}>
          <ellipse cx={cx + dx / 2} cy={cy + dy / 2} rx={Math.hypot(dx, dy) / 2} ry="14" transform={`rotate(${(Math.atan2(dy, dx) * 180) / Math.PI} ${cx + dx / 2} ${cy + dy / 2})`} fill={['#9ec1e8', '#a7d39a', '#f2b38c'][i]} opacity={k === 3 ? 0.55 : 0.85} stroke={TINTA} />
        </g>
      ))}
      {i === 1 && <ellipse cx={cx} cy={cy} rx="10" ry="50" fill="#e9d36b" opacity="0.6" stroke={TINTA} />}
      {i === 2 && <><ellipse cx={cx} cy={cy} rx="10" ry="50" fill="#e9d36b" opacity="0.6" stroke={TINTA} /><ellipse cx={cx} cy={cy} rx="40" ry="10" fill="#e9d36b" opacity="0.45" stroke={TINTA} /></>}
      <circle cx={cx} cy={cy} r="12" fill={TINTA} /><T x={cx} y={cy + 4} t="C" s={11} c="#fff" />
      <T x={200} y={40} t={['sp³ · tetraédrico · 109,5°', 'sp² · plano · 120°', 'sp · lineal · 180°'][i]} s={16} c={AZUL} />
      <T x={200} y={250} t={['4 orbitales híbridos: 4 enlaces sencillos (metano)', '3 híbridos + 1 p que forma el enlace π del doble (eteno)', '2 híbridos + 2 p que forman los dos π del triple (etino)'][i]} s={12} />
      <T x={200} y={272} t={i === 0 ? 'todo σ' : i === 1 ? 'doble = σ + π: no gira' : 'triple = σ + 2π'} s={11} c={ROJO} />
    </Lienzo>
  )
}
