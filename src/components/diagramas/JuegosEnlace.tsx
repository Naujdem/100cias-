import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del enlace químico (Química área 2, tema 6). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function OctetoJuego() {
  return (
    <JuegoDecide titulo="¿Gana, pierde o comparte?" pregunta="¿Qué hace para llegar a 8?" instrucciones="Mira los electrones de valencia y decide cómo completa el octeto." clave="cien:octeto-mejor"
      opciones={[o('pierde', 'Pierde electrones', '➖'), o('gana', 'Gana electrones', '➕'), o('nada', 'Ya está completo', '😌')]}
      cartas={[
        c('🧂', 'Sodio: 1 electrón de valencia', 'pierde', 'Suelta uno y le queda la capa anterior llena.'),
        c('🧪', 'Cloro: 7 electrones de valencia', 'gana', 'Le falta uno.'),
        c('🎈', 'Argón: 8 electrones de valencia', 'nada', 'Es un gas noble.'),
        c('🦴', 'Calcio: 2 electrones de valencia', 'pierde', 'Forma Ca²⁺.'),
        c('💨', 'Oxígeno: 6 electrones de valencia', 'gana', 'Gana dos (O²⁻) o comparte dos.'),
        c('🥫', 'Aluminio: 3 electrones de valencia', 'pierde', 'Forma Al³⁺.'),
      ]}
      cierre="Metales: pierden. No metales: ganan o comparten. Gases nobles: ya están completos." />
  )
}

export function TipoEnlaceJuego() {
  return (
    <JuegoDecide titulo="¿Qué enlace es?" pregunta="¿Qué tipo de enlace tiene?" instrucciones="Metal + no metal: iónico. No metal + no metal: covalente. Metal puro: metálico." clave="cien:tipo-enlace-mejor"
      opciones={[o('i', 'Iónico', '⚡'), o('c', 'Covalente', '🤝'), o('m', 'Metálico', '🔩')]}
      cartas={[
        c('🧂', 'Sal de cocina (NaCl)', 'i', 'Sodio (metal) y cloro (no metal).'),
        c('💧', 'Agua (H₂O)', 'c', 'Hidrógeno y oxígeno, dos no metales.'),
        c('🔌', 'Un cable de cobre', 'm', 'Átomos de cobre en un mar de electrones.'),
        c('🫁', 'Dióxido de carbono (CO₂)', 'c', 'Carbono y oxígeno comparten electrones.'),
        c('🦷', 'Fluoruro de calcio (CaF₂)', 'i', 'Calcio (metal) y flúor (no metal).'),
        c('🥇', 'Un anillo de oro', 'm', 'Solo átomos de oro.'),
        c('🔥', 'Metano (CH₄), el gas de cocina', 'c', 'Carbono e hidrógeno.'),
      ]}
      cierre="El tipo de enlace explica por qué la sal se disuelve, el agua es líquida y el cobre conduce." />
  )
}

export function PolarJuego() {
  return (
    <JuegoDecide titulo="¿Polar o apolar?" pregunta="¿Cómo es este enlace covalente?" instrucciones="Átomos iguales: apolar. Átomos con distinta electronegatividad: polar." clave="cien:polar-mejor"
      opciones={[o('a', 'Apolar', '⚖️'), o('p', 'Polar', '🧲')]}
      cartas={[
        c('🎈', 'H–H', 'a', 'Dos átomos iguales comparten por igual.'),
        c('💧', 'O–H del agua', 'p', 'El oxígeno jala más el par.'),
        c('🧪', 'Cl–Cl', 'a', 'Iguales: ninguno gana.'),
        c('🧪', 'H–Cl', 'p', 'El cloro es más electronegativo.'),
        c('🌬️', 'N≡N', 'a', 'Iguales, aunque el enlace sea triple.'),
        c('🔥', 'C–O', 'p', 'El oxígeno (3,4) jala más que el carbono (2,6).'),
      ]}
      cierre="Diferencia de electronegatividad: 0 → apolar; pequeña → polar; grande → iónico." />
  )
}

export function LewisJuego() {
  return (
    <JuegoDecide titulo="¿Cuántos enlaces forma?" pregunta="¿Cuántos enlaces suele formar?" instrucciones="Cuenta cuántos electrones le faltan para el octeto (al H, para 2)." clave="cien:lewis-mejor"
      opciones={[o('1', 'Uno', '1️⃣'), o('2', 'Dos', '2️⃣'), o('3', 'Tres', '3️⃣'), o('4', 'Cuatro', '4️⃣')]}
      cartas={[
        c('🎈', 'Hidrógeno', '1', 'Le falta uno para tener 2.'),
        c('💨', 'Oxígeno (6 e⁻)', '2', 'Le faltan dos: por eso H–O–H.'),
        c('🌬️', 'Nitrógeno (5 e⁻)', '3', 'Le faltan tres: NH₃.'),
        c('🔥', 'Carbono (4 e⁻)', '4', 'Le faltan cuatro: CH₄. Base de la química orgánica.'),
        c('🧪', 'Cloro (7 e⁻)', '1', 'Le falta uno: HCl, Cl₂.'),
        c('🪨', 'Azufre (6 e⁻)', '2', 'Como el oxígeno, de su mismo grupo: H₂S.'),
      ]}
      cierre="H forma 1, O forma 2, N forma 3 y C forma 4: con eso se arman muchas moléculas." />
  )
}
