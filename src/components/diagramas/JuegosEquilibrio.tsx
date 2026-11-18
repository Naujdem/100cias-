import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del equilibrio químico (Química área 4, tema 7). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })
const LADO = [o('der', 'Hacia productos →', '➡️'), o('izq', '← Hacia reactivos', '⬅️'), o('nada', 'No se corre', '⏸️')]

export function ReversibleJuego() {
  return (
    <JuegoDecide titulo="¿Se puede devolver?" pregunta="¿Es reversible?" instrucciones="Reversible: puede ir en los dos sentidos (⇌). Irreversible: solo en uno (→)." clave="cien:reversible-mejor"
      opciones={[o('rev', 'Reversible', '🔁'), o('irr', 'Irreversible', '➡️')]}
      cartas={[
        c('📄', 'Quemar una hoja de papel', 'irr', 'Con ceniza y humo no se rehace el papel.'),
        c('🥤', 'El CO₂ que entra y sale del agua en una gaseosa tapada', 'rev', 'CO₂ + H₂O ⇌ H₂CO₃.'),
        c('🍳', 'Freír un huevo', 'irr', 'Las proteínas no vuelven a su forma.'),
        c('🦇', 'La caliza que se disuelve y se vuelve a formar en una cueva', 'rev', 'Así crecen las estalactitas.'),
        c('🩸', 'La hemoglobina que toma y suelta oxígeno', 'rev', 'Hb + O₂ ⇌ HbO₂.'),
        c('🎆', 'La pólvora de un volador', 'irr', 'Los gases se escapan.'),
        c('🌱', 'El amoníaco que se forma a partir de nitrógeno e hidrógeno', 'rev', 'N₂ + 3 H₂ ⇌ 2 NH₃.'),
      ]}
      cierre="Muchas reacciones son reversibles si los productos no se escapan." />
  )
}

export function EquilibrioJuego() {
  return (
    <JuegoDecide titulo="¿Ya hay equilibrio?" pregunta="¿Es cierto?" instrucciones="En el equilibrio, la ida y la vuelta van a la misma velocidad y las cantidades ya no cambian." clave="cien:equilibrio-quimico-mejor" tiempo={12}
      opciones={[o('v', 'Cierto', '✅'), o('f', 'Falso', '❌')]}
      cartas={[
        c('⏸️', 'En el equilibrio la reacción se detiene', 'f', 'Sigue en los dos sentidos; por eso es dinámico.'),
        c('⚖️', 'En el equilibrio la ida y la vuelta van al mismo ritmo', 'v', 'Por eso las cantidades no cambian.'),
        c('🟰', 'En el equilibrio siempre hay igual cantidad de reactivos y de productos', 'f', 'Las cantidades son constantes, no necesariamente iguales.'),
        c('🫙', 'El equilibrio solo se alcanza en un recipiente cerrado', 'v', 'Si un producto se escapa, la reacción sigue en un solo sentido.'),
        c('🔁', 'Se llega al mismo equilibrio empezando desde los reactivos o desde los productos', 'v', 'A la misma temperatura.'),
        c('⚗️', 'Un catalizador cambia las cantidades del equilibrio', 'f', 'Solo hace que se llegue más rápido.'),
      ]}
      cierre="Equilibrio dinámico: mucho movimiento, ningún cambio visible." />
  )
}

export function ChatelierJuego() {
  return (
    <JuegoDecide titulo="Empujar el balancín" pregunta="¿Hacia dónde se corre el equilibrio?" instrucciones="N₂ + 3 H₂ ⇌ 2 NH₃ + calor (4 moléculas de gas a la izquierda, 2 a la derecha)" clave="cien:chatelier-mejor" tiempo={14}
      opciones={LADO}
      cartas={[
        c('➕', 'Se agrega más N₂', 'der', 'Para gastar el N₂ agregado.'),
        c('➖', 'Se retira el NH₃ apenas se forma', 'der', 'Para reponer lo que se quitó.'),
        c('🔥', 'Se calienta', 'izq', 'La reacción directa libera calor: se favorece la inversa.'),
        c('❄️', 'Se enfría', 'der', 'Se favorece la que libera calor.'),
        c('🗜️', 'Se aumenta la presión', 'der', 'Hacia el lado con menos moléculas de gas.'),
        c('⚗️', 'Se agrega un catalizador de hierro', 'nada', 'Solo se llega más rápido al equilibrio.'),
        c('➕', 'Se agrega más NH₃', 'izq', 'Para gastar el NH₃ agregado.'),
      ]}
      cierre="El equilibrio siempre se corre para contrarrestar el cambio." />
  )
}

export function KcJuego() {
  return (
    <JuegoDecide titulo="Leer la K" pregunta="¿Qué dice este valor?" instrucciones="K grande: casi todo es producto. K pequeña: casi todo es reactivo. Q < K: avanza →. Q > K: retrocede ←." clave="cien:kc-mejor" tiempo={14}
      opciones={[o('prod', 'Predominan productos', '🎁'), o('reac', 'Predominan reactivos', '🧱'), o('der', 'Avanza →', '➡️'), o('izq', 'Retrocede ←', '⬅️')]}
      cartas={[
        c('📈', 'K = 10¹⁵', 'prod', 'La reacción llega casi al final.'),
        c('📉', 'K = 10⁻¹⁰', 'reac', 'Casi no reacciona.'),
        c('🧮', 'Q = 0,2 y K = 5', 'der', 'Q < K: faltan productos.'),
        c('🧮', 'Q = 30 y K = 5', 'izq', 'Q > K: sobran productos.'),
        c('🧪', 'Solo hay reactivos al empezar (Q = 0)', 'der', 'Siempre avanza.'),
        c('🔥', 'K = 4,6 × 10⁻³ (N₂O₄ ⇌ 2 NO₂ a 25 °C)', 'reac', 'A esa temperatura predomina el N₂O₄.'),
      ]}
      cierre="Kc = [productos]^coef / [reactivos]^coef; solo cambia con la temperatura." />
  )
}

export function EquilibrioVidaJuego() {
  return (
    <JuegoDecide titulo="Equilibrios a nuestro alrededor" pregunta="¿Hacia dónde se corre?" instrucciones="Piensa qué se agrega o qué se quita." clave="cien:equilibrio-vida-mejor" tiempo={14}
      opciones={LADO}
      cartas={[
        c('🥤', 'Se destapa la gaseosa (CO₂ + H₂O ⇌ H₂CO₃) y el CO₂ se escapa', 'izq', 'El ácido carbónico se deshace y salen burbujas.'),
        c('🏔️', 'Hb + O₂ ⇌ HbO₂ al subir al Nevado del Huila', 'izq', 'Hay menos O₂: la sangre lleva menos oxígeno.'),
        c('🏥', 'Hb + O₂ ⇌ HbO₂ con una máscara de oxígeno', 'der', 'Más O₂: más oxihemoglobina.'),
        c('🦇', 'En la cueva, la gota suelta CO₂ al aire (CaCO₃ + CO₂ + H₂O ⇌ Ca(HCO₃)₂)', 'izq', 'Se forma caliza sólida: crece la estalactita.'),
        c('🌱', 'En la fábrica se retira el amoníaco (N₂ + 3 H₂ ⇌ 2 NH₃)', 'der', 'Se sigue formando más.'),
        c('🌊', 'El mar absorbe más CO₂ del aire (CO₂ + H₂O ⇌ H₂CO₃)', 'der', 'El mar se vuelve más ácido y los corales sufren.'),
      ]}
      cierre="Le Chatelier funciona en cuevas, en la sangre, en el mar y en las fábricas." />
  )
}
