import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de las soluciones (Química área 4, tema 4). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function SeDisuelveJuego() {
  return (
    <JuegoDecide titulo="¿Se disuelve en agua?" pregunta="¿Se disuelve en agua?" instrucciones="Lo semejante disuelve a lo semejante: el agua (polar) disuelve sustancias polares e iónicas." clave="cien:se-disuelve-mejor"
      opciones={[o('si', 'Sí', '✅'), o('no', 'No', '❌')]}
      cartas={[
        c('🧂', 'Sal de cocina', 'si', 'Es iónica: el agua separa sus iones.'),
        c('🟫', 'Panela', 'si', 'Por eso hay agua de panela.'),
        c('🫒', 'Aceite de cocina', 'no', 'Es apolar: queda flotando.'),
        c('🍶', 'Alcohol', 'si', 'Se mezcla en cualquier proporción.'),
        c('🏖️', 'Arena', 'no', 'Se va al fondo.'),
        c('⛽', 'Gasolina', 'no', 'Apolar: por eso no se apaga con agua.'),
        c('🕯️', 'Cera de vela', 'no', 'Apolar.'),
        c('🍋', 'Ácido del limón', 'si', 'Por eso hay limonada.'),
      ]}
      cierre="El agua disuelve tantas cosas que la llaman «solvente universal», pero no lo disuelve todo." />
  )
}

export function SaturacionJuego() {
  return (
    <JuegoDecide titulo="¿Cabe más?" pregunta="¿Cómo está la solución?" instrucciones="Insaturada: cabe más. Saturada: no cabe más (sobra en el fondo). Sobresaturada: tiene más de lo que debería, y cristaliza al tocarla." clave="cien:saturacion-mejor" tiempo={14}
      opciones={[o('in', 'Insaturada', '🥛'), o('sa', 'Saturada', '🧂'), o('so', 'Sobresaturada', '⚠️')]}
      cartas={[
        c('☕', 'Un tinto con una cucharadita de azúcar, todo disuelto', 'in', 'Le cabe muchísima más azúcar.'),
        c('🥤', 'Limonada con azúcar sin disolver en el fondo, por más que se revuelva', 'sa', 'Llegó al límite.'),
        c('🍯', 'Miel que de pronto se llena de cristales', 'so', 'La miel tiene más azúcar de la que cabe: cristaliza sola con el tiempo.'),
        c('🧪', 'A 20 °C, 20 g de sal en 100 g de agua', 'in', 'Caben unos 36 g.'),
        c('🧪', 'A 20 °C, 50 g de sal en 100 g de agua, con sal en el fondo', 'sa', 'Solo se disuelven unos 36 g.'),
        c('❄️', 'Agua con mucha azúcar disuelta en caliente, enfriada sin que nada la toque', 'so', 'Al echarle un grano, cristaliza.'),
        c('🌊', 'Agua de mar', 'in', 'Tiene unos 3,5 g de sales por 100 g: le cabe mucho más.'),
      ]}
      cierre="La solubilidad es el máximo que cabe a una temperatura dada." />
  )
}

export function FactoresSolubilidadJuego() {
  return (
    <JuegoDecide titulo="¿Qué ayudó?" pregunta="¿Qué factor actúa?" instrucciones="Temperatura, tamaño de las partículas, agitación o presión (en los gases)." clave="cien:factores-solubilidad-mejor"
      opciones={[o('t', 'Temperatura', '🌡️'), o('ta', 'Tamaño', '🔪'), o('ag', 'Agitación', '🥄'), o('p', 'Presión', '🥤')]}
      cartas={[
        c('🟫', 'Rallar la panela para hacer el agua de panela', 'ta', 'Más superficie, se disuelve más rápido.'),
        c('☕', 'Revolver el tinto con la cuchara', 'ag', 'Lleva agua nueva a los granos.'),
        c('🍵', 'El azúcar se disuelve mejor en el agua caliente', 't', 'A más temperatura, más solubilidad de casi todos los sólidos.'),
        c('🥤', 'La gaseosa hace espuma al destaparla', 'p', 'Baja la presión y el gas se escapa.'),
        c('🧂', 'La sal fina se disuelve antes que la gruesa', 'ta', 'Granos pequeños.'),
        c('🐟', 'En días de calor, el agua del estanque tiene menos oxígeno', 't', 'Los gases se disuelven menos en agua caliente.'),
        c('🍹', 'Batir el jugo en la licuadora', 'ag', 'Agitación fuerte.'),
        c('🤿', 'Los buzos que suben rápido sufren porque el nitrógeno sale de la sangre', 'p', 'Al bajar la presión, el gas disuelto forma burbujas.'),
      ]}
      cierre="Tamaño y agitación aceleran la disolución; la temperatura y la presión cambian cuánto cabe." />
  )
}

export function CurvaJuego() {
  return (
    <JuegoDecide titulo="Lee la curva" pregunta="¿Cómo queda la solución?" instrucciones="KNO₃ en 100 g de agua: 0 °C → 13 g · 20 °C → 32 g · 40 °C → 64 g · 60 °C → 110 g · 80 °C → 169 g" clave="cien:curva-mejor" tiempo={15}
      opciones={[o('in', 'Insaturada', '🥛'), o('sa', 'Saturada (sobra en el fondo)', '🧂')]}
      cartas={[
        c('🌡️', '50 g de KNO₃ a 60 °C', 'in', 'Caben 110 g.'),
        c('🌡️', '50 g de KNO₃ a 20 °C', 'sa', 'Solo caben 32 g: sobran 18 g.'),
        c('🌡️', '100 g de KNO₃ a 80 °C', 'in', 'Caben 169 g.'),
        c('🌡️', '100 g de KNO₃ a 40 °C', 'sa', 'Caben 64 g: sobran 36 g.'),
        c('🌡️', '10 g de KNO₃ a 0 °C', 'in', 'Caben 13 g.'),
        c('🌡️', '20 g de KNO₃ a 0 °C', 'sa', 'Caben 13 g: sobran 7 g.'),
      ]}
      cierre="Si el punto queda debajo de la curva, cabe más; encima, sobra (o está sobresaturada)." />
  )
}

export function ColoideJuego() {
  return (
    <JuegoDecide titulo="Del más fino al más grueso" pregunta="¿Qué tipo de mezcla es?" instrucciones="Solución: transparente, no se asienta. Coloide: turbio, no se asienta, desvía la luz. Suspensión: se asienta en reposo." clave="cien:coloide-mejor"
      opciones={[o('so', 'Solución', '💧'), o('co', 'Coloide', '🥛'), o('su', 'Suspensión', '🟤')]}
      cartas={[
        c('🧂', 'Agua con sal', 'so', 'Transparente.'),
        c('🥛', 'Leche', 'co', 'Gotitas de grasa repartidas.'),
        c('🟤', 'Agua del río crecido con tierra', 'su', 'En reposo, la tierra se va al fondo.'),
        c('🍮', 'Gelatina', 'co', 'Un coloide sólido.'),
        c('💊', 'Jarabe que dice «agítese antes de usar»', 'su', 'El medicamento se asienta.'),
        c('🌫️', 'Niebla del páramo', 'co', 'Gotitas en el aire: se ve el haz de luz de los carros.'),
        c('🟫', 'Agua de panela', 'so', 'Transparente aunque tenga color.'),
        c('🥫', 'Mayonesa', 'co', 'Gotas de aceite en agua y huevo (emulsión).'),
      ]}
      cierre="Lo que cambia es el tamaño de las partículas." />
  )
}
