import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de las propiedades periódicas (Química área 2, tema 5). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })
const LADOS = [o('a', 'El primero', '⬅️'), o('b', 'El segundo', '➡️')]

export function RadioJuego() {
  return (
    <JuegoDecide titulo="¿Cuál es más grande?" pregunta="¿Qué átomo tiene mayor radio?" instrucciones="Más grande hacia abajo y hacia la izquierda de la tabla." clave="cien:radio-mejor" opciones={LADOS}
      cartas={[
        c('⚪', 'Litio  o  potasio', 'b', 'El potasio está más abajo: más niveles.'),
        c('⚪', 'Sodio  o  cloro', 'a', 'Mismo periodo: el sodio, a la izquierda, tiene menos protones jalando.'),
        c('⚪', 'Flúor  o  yodo', 'b', 'El yodo está tres periodos más abajo.'),
        c('⚪', 'Carbono  o  oxígeno', 'a', 'Mismo periodo: el carbono está más a la izquierda.'),
        c('⚪', 'Cesio  o  litio', 'a', 'El cesio es de los átomos más grandes.'),
        c('⚪', 'Magnesio  o  bario', 'b', 'Mismo grupo; el bario está más abajo.'),
      ]}
      cierre="Radio: crece hacia abajo (más niveles) y se encoge hacia la derecha (más protones)." />
  )
}

export function IonizacionJuego() {
  return (
    <JuegoDecide titulo="¿A cuál le cuesta más?" pregunta="¿Cuál tiene mayor energía de ionización?" instrucciones="Mayor arriba y a la derecha: átomos pequeños que jalan fuerte a sus electrones." clave="cien:ionizacion-mejor" opciones={LADOS}
      cartas={[
        c('⚡', 'Sodio  o  cloro', 'b', 'Al cloro le cuesta mucho más perder un electrón.'),
        c('⚡', 'Litio  o  cesio', 'a', 'El electrón del cesio está lejos del núcleo.'),
        c('⚡', 'Neón  o  sodio', 'a', 'El neón tiene la capa llena: es muy difícil quitarle un electrón.'),
        c('⚡', 'Potasio  o  calcio', 'b', 'Mismo periodo; el calcio está a la derecha.'),
        c('⚡', 'Helio  o  hidrógeno', 'a', 'El helio tiene la mayor energía de ionización de todos.'),
        c('⚡', 'Oxígeno  o  azufre', 'a', 'El oxígeno está más arriba.'),
      ]}
      cierre="Los metales de la izquierda pierden electrones fácil; los gases nobles, casi nunca." />
  )
}

export function ElectronegatividadJuego() {
  return (
    <JuegoDecide titulo="¿Quién jala más?" pregunta="¿Cuál es más electronegativo?" instrucciones="El flúor es el campeón; disminuye hacia abajo y hacia la izquierda." clave="cien:electroneg-mejor" opciones={LADOS}
      cartas={[
        c('🪢', 'Hidrógeno  o  oxígeno', 'b', 'En el agua, el oxígeno se queda con más carga negativa.'),
        c('🪢', 'Flúor  o  cloro', 'a', 'El flúor es el más electronegativo de todos.'),
        c('🪢', 'Sodio  o  cloro', 'b', 'Por eso el cloro le quita el electrón al sodio.'),
        c('🪢', 'Carbono  o  nitrógeno', 'b', 'Mismo periodo, más a la derecha.'),
        c('🪢', 'Potasio  o  litio', 'b', 'El litio está más arriba.'),
        c('🪢', 'Azufre  o  oxígeno', 'b', 'Mismo grupo; el oxígeno está arriba.'),
      ]}
      cierre="Una gran diferencia de electronegatividad entre dos átomos da enlaces iónicos o polares." />
  )
}

export function MetalicoJuego() {
  return (
    <JuegoDecide titulo="¿Más o menos metálico?" pregunta="¿Cuál es más metálico?" instrucciones="El carácter metálico crece hacia abajo y hacia la izquierda." clave="cien:metalico-mejor" opciones={LADOS}
      cartas={[
        c('🔩', 'Sodio  o  potasio', 'b', 'El potasio reacciona aún más fuerte con el agua.'),
        c('🔩', 'Magnesio  o  azufre', 'a', 'El magnesio es metal; el azufre, no metal.'),
        c('🔩', 'Estaño  o  carbono', 'a', 'En el grupo 14 se pasa de no metal (C) a metal (Sn, Pb).'),
        c('🔩', 'Aluminio  o  sodio', 'b', 'Mismo periodo; el sodio está a la izquierda.'),
        c('🔩', 'Cesio  o  bario', 'a', 'El cesio es uno de los más metálicos.'),
        c('🔩', 'Silicio  o  plomo', 'b', 'El plomo, más abajo, es un metal.'),
      ]}
      cierre="Carácter metálico: lo contrario de la electronegatividad y de la energía de ionización." />
  )
}
