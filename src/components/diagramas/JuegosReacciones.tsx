import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de reacciones y ecuaciones químicas (Química área 3, tema 4). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function PartesEcuacionJuego() {
  return (
    <JuegoDecide titulo="Partes de la ecuación" pregunta="¿Qué es?" instrucciones="En CH₄ + 2 O₂ → CO₂ + 2 H₂O." clave="cien:partes-ecuacion-mejor"
      opciones={[o('r', 'Reactivo', '⬅️'), o('p', 'Producto', '➡️'), o('co', 'Coeficiente', '🔴'), o('su', 'Subíndice', '🟢')]}
      cartas={[
        c('🔥', 'El CH₄ (metano)', 'r', 'Está a la izquierda de la flecha.'),
        c('💨', 'El CO₂', 'p', 'Está a la derecha.'),
        c('2️⃣', 'El 2 delante del O₂', 'co', 'Dice cuántas moléculas.'),
        c('4️⃣', 'El 4 pequeño del CH₄', 'su', 'Dice cuántos hidrógenos tiene la molécula.'),
        c('💧', 'El H₂O', 'p', 'Sale de la reacción.'),
        c('🌬️', 'El O₂', 'r', 'Entra a la reacción.'),
        c('2️⃣', 'El 2 delante del H₂O', 'co', 'Dos moléculas de agua.'),
        c('2️⃣', 'El 2 pequeño del O₂', 'su', 'Dos átomos de oxígeno por molécula.'),
      ]}
      cierre="Coeficiente: cuántas moléculas. Subíndice: cuántos átomos." />
  )
}

export function SintesisDescomposicionJuego() {
  return (
    <JuegoDecide titulo="¿Unir o separar?" pregunta="¿Qué tipo de reacción es?" instrucciones="Síntesis: A + B → AB. Descomposición: AB → A + B." clave="cien:sintesis-desc-mejor"
      opciones={[o('s', 'Síntesis', '🔗'), o('d', 'Descomposición', '💥')]}
      cartas={[
        c('🌾', 'CaO + H₂O → Ca(OH)₂', 's', 'Dos sustancias forman una.'),
        c('🔥', 'CaCO₃ → CaO + CO₂', 'd', 'La caliza se rompe con calor.'),
        c('⚡', '2 H₂O → 2 H₂ + O₂', 'd', 'Electrólisis del agua.'),
        c('🔩', '4 Fe + 3 O₂ → 2 Fe₂O₃', 's', 'El hierro se oxida.'),
        c('🫧', '2 H₂O₂ → 2 H₂O + O₂', 'd', 'El agua oxigenada se descompone.'),
        c('🌋', 'SO₃ + H₂O → H₂SO₄', 's', 'Se forma un oxácido.'),
        c('🧂', '2 Na + Cl₂ → 2 NaCl', 's', 'Sodio y cloro forman sal.'),
        c('🥚', '2 HgO → 2 Hg + O₂', 'd', 'Así obtuvo Lavoisier el oxígeno.'),
      ]}
      cierre="Una sola sustancia a la derecha: síntesis. Una sola a la izquierda: descomposición." />
  )
}

export function DesplazamientoJuego() {
  return (
    <JuegoDecide titulo="¿Uno o dos cambian?" pregunta="¿Qué desplazamiento es?" instrucciones="Simple: un elemento saca a otro. Doble: dos compuestos intercambian parejas." clave="cien:desplazamiento-mejor"
      opciones={[o('s', 'Simple', '🔁'), o('d', 'Doble', '💃')]}
      cartas={[
        c('🔩', 'Fe + CuSO₄ → FeSO₄ + Cu', 's', 'El hierro saca al cobre.'),
        c('⚪', 'AgNO₃ + NaCl → AgCl + NaNO₃', 'd', 'Se intercambian los iones.'),
        c('🫧', 'Zn + 2 HCl → ZnCl₂ + H₂', 's', 'El zinc saca al hidrógeno.'),
        c('⚖️', 'HCl + NaOH → NaCl + H₂O', 'd', 'La neutralización es un doble desplazamiento.'),
        c('🟡', 'BaCl₂ + Na₂SO₄ → BaSO₄ + 2 NaCl', 'd', 'Se forma un precipitado blanco.'),
        c('🥈', 'Cu + 2 AgNO₃ → Cu(NO₃)₂ + 2 Ag', 's', 'El cobre saca a la plata.'),
        c('💧', '2 Na + 2 H₂O → 2 NaOH + H₂', 's', 'El sodio saca al hidrógeno del agua.'),
        c('🟤', 'FeCl₃ + 3 NaOH → Fe(OH)₃ + 3 NaCl', 'd', 'Precipitado rojizo.'),
      ]}
      cierre="Un elemento solo a la izquierda: simple. Dos compuestos: doble." />
  )
}

export function TiposReaccionJuego() {
  return (
    <JuegoDecide titulo="Reacciones de todos los días" pregunta="¿Qué tipo de reacción es?" instrucciones="Síntesis, descomposición, combustión o neutralización." clave="cien:tipos-reaccion-mejor" tiempo={12}
      opciones={[o('s', 'Síntesis', '🔗'), o('d', 'Descomposición', '💥'), o('c', 'Combustión', '🔥'), o('n', 'Neutralización', '⚖️')]}
      cartas={[
        c('🍳', 'El gas de la estufa arde', 'c', 'Propano + oxígeno → CO₂ + agua.'),
        c('💊', 'Un antiácido calma la acidez', 'n', 'Una base neutraliza el ácido del estómago.'),
        c('🔩', 'El machete se oxida', 's', 'Hierro + oxígeno → óxido.'),
        c('🏭', 'El horno de cal calcina la caliza', 'd', 'CaCO₃ → CaO + CO₂.'),
        c('🕯️', 'Una vela se consume', 'c', 'La parafina arde con oxígeno.'),
        c('🌱', 'La cal corrige un suelo ácido', 'n', 'Base + ácido.'),
        c('🫧', 'El agua oxigenada burbujea en la herida', 'd', 'H₂O₂ → H₂O + O₂.'),
        c('🌾', 'Se le echa agua a la cal viva', 's', 'CaO + H₂O → Ca(OH)₂.'),
        c('🚗', 'La gasolina se quema en el motor', 'c', 'Combustión.'),
        c('🐝', 'Bicarbonato en una picadura ácida', 'n', 'La base neutraliza el ácido.'),
      ]}
      ronda={10}
      cierre="Fuego: combustión. Ácido + base: neutralización. Unir o separar: síntesis o descomposición." />
  )
}

export function ExoEndoJuego() {
  return (
    <JuegoDecide titulo="¿Da o quita calor?" pregunta="¿Cómo es la reacción?" instrucciones="Exotérmica: libera energía. Endotérmica: la absorbe." clave="cien:exo-endo-mejor"
      opciones={[o('exo', 'Exotérmica', '🔥'), o('endo', 'Endotérmica', '❄️')]}
      cartas={[
        c('🪵', 'La leña que arde en el fogón', 'exo', 'Libera calor y luz.'),
        c('🌿', 'La fotosíntesis', 'endo', 'Absorbe la luz del Sol.'),
        c('🌾', 'Cal viva con agua', 'exo', 'Se calienta mucho.'),
        c('🏭', 'Calcinar la caliza en el horno', 'endo', 'Necesita calor todo el tiempo.'),
        c('🏃', 'La respiración celular', 'exo', 'Libera la energía de la glucosa.'),
        c('🥚', 'Cocinar un huevo', 'endo', 'Absorbe el calor de la olla.'),
        c('🧊', 'La compresa fría instantánea', 'endo', 'Absorbe calor de la piel.'),
        c('🎆', 'La pólvora de un volador', 'exo', 'Libera energía de golpe.'),
      ]}
      cierre="Si calienta el entorno: exotérmica. Si necesita calor o luz: endotérmica." />
  )
}
