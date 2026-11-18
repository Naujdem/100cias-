import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de los estados de oxidación (Química área 3, tema 1). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function OxidacionSignoJuego() {
  return (
    <JuegoDecide titulo="¿Gana o pierde?" pregunta="¿Cómo es su estado de oxidación?" instrucciones="Positivo si «pierde» electrones, negativo si los «gana», cero si está libre." clave="cien:ox-signo-mejor"
      opciones={[o('mas', 'Positivo', '➕'), o('menos', 'Negativo', '➖'), o('cero', 'Cero', '⚪')]}
      cartas={[
        c('🧂', 'El sodio en la sal (NaCl)', 'mas', 'Cede un electrón: +1.'),
        c('🧂', 'El cloro en la sal (NaCl)', 'menos', 'Recibe el electrón: −1.'),
        c('💧', 'El oxígeno en el agua', 'menos', 'Jala los electrones de los enlaces: −2.'),
        c('💧', 'El hidrógeno en el agua', 'mas', 'El oxígeno le «quita» el electrón: +1.'),
        c('🌬️', 'El oxígeno del aire (O₂)', 'cero', 'Es un elemento libre.'),
        c('🔩', 'Un clavo de hierro (Fe)', 'cero', 'Metal puro: elemento libre.'),
        c('🦴', 'El calcio en la cal (CaO)', 'mas', 'Es un metal: cede dos electrones, +2.'),
        c('🟡', 'Un anillo de oro (Au)', 'cero', 'Elemento libre.'),
      ]}
      cierre="Positivo: pierde. Negativo: gana. Libre: cero." />
  )
}

export function ReglasOxidacionJuego() {
  return (
    <JuegoDecide titulo="Usa las reglas" pregunta="¿Qué estado de oxidación tiene?" instrucciones="Libre 0 · O −2 · H +1 · grupo 1 +1 · F −1." clave="cien:ox-reglas-mejor"
      opciones={[o('0', '0', '⚪'), o('+1', '+1', '➕'), o('-1', '−1', '➖'), o('-2', '−2', '🔴')]}
      cartas={[
        c('🔌', 'El cobre de un cable (Cu)', '0', 'Elemento libre.'),
        c('🫧', 'El oxígeno en el CO₂', '-2', 'El oxígeno casi siempre es −2.'),
        c('🧪', 'El hidrógeno en el HCl', '+1', 'El hidrógeno casi siempre es +1.'),
        c('🧼', 'El sodio en la soda cáustica (NaOH)', '+1', 'Grupo 1: +1.'),
        c('🧂', 'El cloro en el NaCl', '-1', 'Ion cloruro, Cl⁻.'),
        c('🦷', 'El flúor en el HF', '-1', 'El flúor siempre es −1.'),
        c('🌬️', 'El nitrógeno del aire (N₂)', '0', 'Elemento libre.'),
        c('🍋', 'El oxígeno en el H₂SO₄', '-2', 'Regla del oxígeno.'),
      ]}
      cierre="Primero lo libre, luego los iones, luego O, H y los grupos 1 y 2." />
  )
}

export function CalculaOxidacionJuego() {
  return (
    <JuegoDecide titulo="Despeja la x" pregunta="¿Qué estado tiene el átomo marcado?" instrucciones="Suma los conocidos por su subíndice y busca lo que falta para llegar a cero." clave="cien:ox-calcula-mejor" tiempo={15}
      opciones={[o('+4', '+4', '4️⃣'), o('+5', '+5', '5️⃣'), o('+6', '+6', '6️⃣')]}
      cartas={[
        c('🔋', 'S en el H₂SO₄', '+6', '2 − 8 + x = 0.'),
        c('💥', 'N en el HNO₃', '+5', '1 − 6 + x = 0.'),
        c('🫧', 'C en el CO₂', '+4', 'x − 4 = 0.'),
        c('🌋', 'S en el SO₃', '+6', 'x − 6 = 0.'),
        c('🌱', 'P en el H₃PO₄', '+5', '3 − 8 + x = 0.'),
        c('🥤', 'C en el H₂CO₃', '+4', '2 − 6 + x = 0.'),
        c('🏊', 'Cl en el HClO₃', '+5', '1 − 6 + x = 0.'),
        c('🌋', 'S en el SO₂', '+4', 'x − 4 = 0: el azufre cambia según el compuesto.'),
      ]}
      cierre="Conocidos × subíndice, todo suma cero, despeja x." />
  )
}

export function IonOxidacionJuego() {
  return (
    <JuegoDecide titulo="Iones del abono" pregunta="¿Qué estado tiene el átomo central?" instrucciones="En un ion, la suma da la carga del ion." clave="cien:ox-ion-mejor" tiempo={15}
      opciones={[o('-3', '−3', '➖'), o('+4', '+4', '4️⃣'), o('+5', '+5', '5️⃣'), o('+6', '+6', '6️⃣')]}
      cartas={[
        c('🌾', 'N en el amonio (NH₄⁺)', '-3', 'x + 4 = +1.'),
        c('🌾', 'N en el nitrato (NO₃⁻)', '+5', 'x − 6 = −1.'),
        c('🧪', 'S en el sulfato (SO₄²⁻)', '+6', 'x − 8 = −2.'),
        c('🪨', 'C en el carbonato (CO₃²⁻)', '+4', 'x − 6 = −2.'),
        c('🌱', 'P en el fosfato (PO₄³⁻)', '+5', 'x − 8 = −3.'),
        c('🍞', 'C en el bicarbonato (HCO₃⁻)', '+4', '1 + x − 6 = −1.'),
        c('🧪', 'S en el sulfito (SO₃²⁻)', '+4', 'x − 6 = −2.'),
        c('🌬️', 'N en el amoníaco (NH₃)', '-3', 'x + 3 = 0.'),
      ]}
      cierre="Ion: la suma es la carga. Neutro: la suma es cero." />
  )
}
