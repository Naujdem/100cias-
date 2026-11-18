import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de la teoría cinética y los gases (Química área 4, tema 1). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function PropiedadGasJuego() {
  return (
    <JuegoDecide titulo="Así se porta un gas" pregunta="¿Qué propiedad del gas se ve?" instrucciones="Compresión: cabe en menos espacio. Expansión: ocupa todo el espacio. Difusión: se mezcla y se esparce." clave="cien:propiedad-gas-mejor"
      opciones={[o('com', 'Compresión', '🗜️'), o('exp', 'Expansión', '🎈'), o('dif', 'Difusión', '👃')]}
      cartas={[
        c('💉', 'Tapo la jeringa con el dedo y empujo el émbolo', 'com', 'Las partículas se acercan: hay espacio vacío entre ellas.'),
        c('☕', 'El olor del café llega a toda la casa', 'dif', 'Las partículas del aroma se mezclan con el aire.'),
        c('🧴', 'Un poquito de ambientador llena todo el cuarto', 'exp', 'El gas ocupa todo el espacio disponible.'),
        c('🛢️', 'En un cilindro pequeño cabe gas para cocinar un mes', 'com', 'Está comprimido.'),
        c('🚲', 'Con la bomba meto más y más aire en la llanta', 'com', 'Se comprime dentro de la llanta.'),
        c('🌸', 'Se siente el perfume de alguien que pasó hace rato', 'dif', 'Difusión del perfume en el aire.'),
        c('🎈', 'El aire de un globo que se revienta se reparte por el salón', 'exp', 'Se expande hasta llenar el espacio.'),
        c('🔥', 'Se siente olor a gas en la cocina: ¡hay una fuga!', 'dif', 'Por eso al gas le ponen olor: para detectarlo. Abre las ventanas y no prendas nada.'),
      ]}
      cierre="Las tres salen de lo mismo: partículas separadas y en movimiento." />
  )
}

export function VariableGasJuego() {
  return (
    <JuegoDecide titulo="P, V o T" pregunta="¿Qué variable se mide o se cambia?" instrucciones="P: presión (choques). V: volumen (espacio). T: temperatura (rapidez)." clave="cien:variable-gas-mejor"
      opciones={[o('p', 'Presión', '🎯'), o('v', 'Volumen', '📦'), o('t', 'Temperatura', '🌡️')]}
      cartas={[
        c('🚗', 'El calibrador de la llanta marca 32 psi', 'p', 'Psi es una unidad de presión.'),
        c('🛢️', 'El tanque de oxígeno del hospital es de 10 litros', 'v', 'Los litros miden el volumen del recipiente.'),
        c('☀️', 'Al mediodía el aire de la llanta se calienta', 't', 'Sube la temperatura y las partículas van más rápido.'),
        c('💉', 'Empujo el émbolo de la jeringa', 'v', 'Le quito espacio al gas.'),
        c('🌡️', 'El termómetro de la nevera marca 4 °C', 't', 'Temperatura.'),
        c('⛰️', 'En el páramo el barómetro marca menos', 'p', 'Hay menos aire encima.'),
        c('🎈', 'El globo crece al inflarlo', 'v', 'Más gas, más volumen.'),
        c('🍲', 'La olla a presión silba', 'p', 'El vapor empuja la válvula.'),
      ]}
      cierre="Un gas se describe con P, V, T y la cantidad de gas." />
  )
}

export function KelvinJuego() {
  return (
    <JuegoDecide titulo="Pásalo a Kelvin" pregunta="¿Cuántos kelvin son?" instrucciones="K = °C + 273" clave="cien:kelvin-mejor" tiempo={12}
      opciones={[o('0', '0 K', '🧊'), o('273', '273 K', '❄️'), o('300', '≈ 300 K', '🌤️'), o('373', '373 K', '♨️')]}
      cartas={[
        c('❄️', 'El agua se congela: 0 °C', '273', '0 + 273.'),
        c('♨️', 'El agua hierve a nivel del mar: 100 °C', '373', '100 + 273.'),
        c('🌤️', 'Un día templado: 27 °C', '300', '27 + 273 = 300.'),
        c('🥶', 'El cero absoluto: −273 °C', '0', 'No hay temperatura más baja.'),
        c('🏖️', 'Neiva en la tarde: unos 30 °C', '300', '30 + 273 = 303, casi 300.'),
        c('🧊', 'Hielo derritiéndose', '273', 'Está a 0 °C.'),
        c('🍲', 'Agua de la sopa hirviendo (en la costa)', '373', '100 °C.'),
        c('🌌', 'Lo más frío posible en el universo', '0', 'El cero absoluto.'),
      ]}
      cierre="En Kelvin no hay números negativos: empieza en el cero absoluto." />
  )
}

export function UnidadesPresionJuego() {
  return (
    <JuegoDecide titulo="Una atmósfera, muchos nombres" pregunta="¿A qué equivale?" instrucciones="1 atm = 760 mmHg = 101,3 kPa ≈ 14,7 psi" clave="cien:unidades-presion-mejor" tiempo={12}
      opciones={[o('1', '1 atm', '🌍'), o('half', '0,5 atm', '⛰️'), o('2', '2 atm', '🚲')]}
      cartas={[
        c('🌊', '760 mmHg', '1', 'La presión del aire a nivel del mar.'),
        c('🧪', '101,3 kPa', '1', 'Lo mismo, en kilopascales.'),
        c('🏔️', '380 mmHg', 'half', 'La mitad de 760.'),
        c('🔧', '1520 mmHg', '2', 'El doble de 760.'),
        c('📏', '≈ 50,7 kPa', 'half', 'La mitad de 101,3.'),
        c('🚲', '≈ 29,4 psi', '2', 'El doble de 14,7.'),
        c('🚗', '≈ 14,7 psi', '1', 'Una atmósfera.'),
        c('⚗️', '202,6 kPa', '2', 'El doble de 101,3.'),
      ]}
      cierre="Se puede medir en atm, mmHg, kPa o psi: es la misma presión con otro nombre." />
  )
}

export function AlturaPresionJuego() {
  return (
    <JuegoDecide titulo="¿Arriba o abajo?" pregunta="¿Dónde hay MÁS presión atmosférica?" instrucciones="Mientras más alto, menos aire encima y menos presión." clave="cien:altura-presion-mejor"
      opciones={[o('a', 'En el primero', '⬅️'), o('b', 'En el segundo', '➡️'), o('i', 'Igual', '⚖️')]}
      cartas={[
        c('🏙️', 'Neiva o Bogotá', 'a', 'Neiva está mucho más abajo.'),
        c('🏔️', 'Nevado del Huila o Tarqui', 'b', 'El nevado está a más de 5000 m.'),
        c('🌊', 'Cartagena (playa) o Neiva', 'a', 'A nivel del mar hay más aire encima.'),
        c('🏫', 'El primer piso o el segundo piso del colegio', 'i', 'La diferencia es tan pequeña que no se nota.'),
        c('🚌', 'Bajando a La Plata o subiendo al páramo de Moras', 'a', 'Más abajo, más presión.'),
        c('✈️', 'Dentro de un avión volando alto (sin presurizar) o en la pista', 'b', 'Por eso se presuriza la cabina.'),
        c('🥔', 'Donde el paquete de papas se ve normal o donde se ve inflado', 'a', 'Se infla donde hay menos presión afuera.'),
        c('🧗', 'La cima del Everest o Bogotá', 'b', 'En el Everest hay como un tercio de la presión del mar.'),
      ]}
      cierre="La presión atmosférica es el peso del aire que tenemos encima." />
  )
}
