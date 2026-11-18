import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del balanceo de ecuaciones (Química área 3, tema 5). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function BalanceadaJuego() {
  return (
    <JuegoDecide titulo="¿Cuadra o no cuadra?" pregunta="¿Está balanceada?" instrucciones="Cuenta los átomos de cada elemento a cada lado." clave="cien:balanceada-mejor" tiempo={15}
      opciones={[o('si', 'Balanceada', '✅'), o('no', 'No balanceada', '❌')]}
      cartas={[
        c('💧', '2 H₂ + O₂ → 2 H₂O', 'si', 'H 4–4, O 2–2.'),
        c('💧', 'H₂ + O₂ → H₂O', 'no', 'Hay 2 O a la izquierda y 1 a la derecha.'),
        c('🧂', '2 Na + Cl₂ → 2 NaCl', 'si', 'Na 2–2, Cl 2–2.'),
        c('🔥', 'CH₄ + O₂ → CO₂ + 2 H₂O', 'no', 'O: 2 a la izquierda, 4 a la derecha.'),
        c('🏭', 'CaCO₃ → CaO + CO₂', 'si', 'Ca 1–1, C 1–1, O 3–3.'),
        c('🌾', 'N₂ + H₂ → 2 NH₃', 'no', 'H: 2 a la izquierda, 6 a la derecha.'),
        c('🔩', '4 Fe + 3 O₂ → 2 Fe₂O₃', 'si', 'Fe 4–4, O 6–6.'),
        c('🫧', 'H₂O₂ → H₂O + O₂', 'no', 'O: 2 a la izquierda, 3 a la derecha.'),
      ]}
      cierre="Balanceada: los mismos átomos de cada elemento a los dos lados." />
  )
}

export function CoeficienteJuego() {
  return (
    <JuegoDecide titulo="El coeficiente que falta" pregunta="¿Qué número va en el espacio?" instrucciones="Cuenta el elemento que queda descuadrado." clave="cien:coeficiente-mejor" tiempo={15}
      opciones={[o('2', '2', '2️⃣'), o('3', '3', '3️⃣'), o('4', '4', '4️⃣')]}
      cartas={[
        c('💧', '__ H₂ + O₂ → 2 H₂O', '2', '4 H a la derecha.'),
        c('🌾', 'N₂ + __ H₂ → 2 NH₃', '3', '6 H a la derecha.'),
        c('🧂', '2 Na + Cl₂ → __ NaCl', '2', '2 Na a la izquierda.'),
        c('🔩', '4 Fe + __ O₂ → 2 Fe₂O₃', '3', '6 O a la derecha.'),
        c('🔥', 'CH₄ + __ O₂ → CO₂ + 2 H₂O', '2', '4 O a la derecha.'),
        c('🍳', 'C₃H₈ + 5 O₂ → __ CO₂ + 4 H₂O', '3', '3 C a la izquierda.'),
        c('🍳', 'C₃H₈ + 5 O₂ → 3 CO₂ + __ H₂O', '4', '8 H a la izquierda.'),
        c('🥫', '4 Al + 3 O₂ → __ Al₂O₃', '2', '4 Al a la izquierda.'),
        c('🫧', '__ H₂O₂ → 2 H₂O + O₂', '2', '4 H a la derecha.'),
      ]}
      cierre="Cuenta, ajusta un coeficiente y vuelve a contar." />
  )
}

export function OxidaReduceJuego() {
  return (
    <JuegoDecide titulo="OP-RG" pregunta="¿Qué le pasa al átomo marcado?" instrucciones="Si el estado sube, se oxida (pierde e⁻). Si baja, se reduce (gana e⁻)." clave="cien:oxida-reduce-mejor" tiempo={12}
      opciones={[o('ox', 'Se oxida', '⬆️'), o('red', 'Se reduce', '⬇️')]}
      cartas={[
        c('🔩', 'Fe: 0 → +2 (el clavo)', 'ox', 'Sube: pierde 2 electrones.'),
        c('🟠', 'Cu: +2 → 0', 'red', 'Baja: gana 2 electrones.'),
        c('🔥', 'C del metano: −4 → +4 al quemarse', 'ox', 'Sube: se oxida.'),
        c('🌬️', 'O del O₂: 0 → −2 en la combustión', 'red', 'Baja: se reduce.'),
        c('🧂', 'Na: 0 → +1 al formar sal', 'ox', 'Pierde un electrón.'),
        c('🧂', 'Cl: 0 → −1 al formar sal', 'red', 'Gana un electrón.'),
        c('🏭', 'Fe del Fe₂O₃: +3 → 0 en el alto horno', 'red', 'El mineral se reduce a hierro.'),
        c('🏭', 'C del CO: +2 → +4 en el alto horno', 'ox', 'Sube: se oxida.'),
      ]}
      cierre="Oxidación Pierde, Reducción Gana: siempre van juntas." />
  )
}
