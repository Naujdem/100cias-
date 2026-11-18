import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 5, tema 2 (El agua y las cuencas). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function AguaPlanetaJuego() {
  return (
    <JuegoDecide titulo="¿Salada o dulce?" pregunta="¿Qué agua es?" instrucciones="Decide si cada agua es salada o dulce." clave="cien:agua-planeta-mejor"
      opciones={[o('salada', 'Salada', '🌊'), o('dulce', 'Dulce', '💧')]}
      cartas={[
        c('🏝️', 'El mar Caribe', 'salada', 'Los océanos tienen casi toda el agua.'),
        c('🧊', 'El glaciar del Nevado del Huila', 'dulce', 'Es agua dulce congelada.'),
        c('🏞️', 'El río Magdalena', 'dulce', 'Ríos y lagos: menos del 1 % del agua.'),
        c('🕳️', 'El agua de un aljibe', 'dulce', 'Es agua subterránea.'),
        c('🐋', 'El océano Pacífico', 'salada', 'No sirve para tomar ni regar.'),
      ]}
      cierre="Casi toda el agua es salada; la dulce hay que cuidarla." />
  )
}

export function CuencaJuego() {
  return (
    <JuegoDecide titulo="Partes de la cuenca" pregunta="¿Qué parte es?" instrucciones="Elige la parte de la cuenca que describe cada tarjeta." clave="cien:cuenca-mejor"
      opciones={[o('div', 'Divisoria', '⛰️'), o('nac', 'Nacimiento', '💧'), o('afl', 'Afluente', '〰️'), o('des', 'Desembocadura', '🌊')]}
      cartas={[
        c('💧', 'Donde brota el agua en la parte alta', 'nac', 'Muchas veces en el páramo o el bosque.'),
        c('⛰️', 'El filo que separa el agua de dos cuencas', 'div', 'De ahí el agua baja a un lado o al otro.'),
        c('〰️', 'Una quebrada que se une al río', 'afl', 'Le lleva más agua al río principal.'),
        c('🌊', 'Donde el Magdalena llega al mar Caribe', 'des', 'En Bocas de Ceniza, Barranquilla.'),
        c('🏞️', 'El río Suaza que llega al Magdalena', 'afl', 'Es uno de sus afluentes en el Huila.'),
      ]}
      cierre="Nacimiento → afluentes → río principal → desembocadura." />
  )
}

export function FabricasAguaJuego() {
  return (
    <JuegoDecide titulo="¿Protege o daña?" pregunta="¿Qué le pasa al agua?" instrucciones="Decide si cada acción protege el agua de la cuenca o la daña." clave="cien:fabricas-agua-mejor"
      opciones={[o('protege', 'Protege', '💚'), o('dana', 'Daña', '⚠️')]}
      cartas={[
        c('🔥', 'Quemar el pajonal del páramo', 'dana', 'El suelo pierde su esponja.'),
        c('🌳', 'Sembrar árboles nativos alrededor del nacimiento', 'protege', 'El agua se infiltra y sale clara.'),
        c('🐄', 'Meter ganado en el páramo', 'dana', 'Compacta el suelo.'),
        c('🚧', 'Cercar el nacimiento de la quebrada', 'protege', 'Evita que los animales lo pisen y ensucien.'),
        c('🥔', 'Sembrar papa en el páramo', 'dana', 'Se pierde la cobertura que guarda el agua.'),
      ]}
      cierre="Sin páramo ni bosque, el agua baja de golpe y se acaba en verano." />
  )
}

export function HuellaHidricaJuego() {
  return (
    <JuegoDecide titulo="¿Mucha o poca agua?" pregunta="¿Cuánta agua escondida tiene?" instrucciones="Decide si cada producto tiene más o menos de 1.000 litros de agua escondida." clave="cien:huella-hidrica-mejor"
      opciones={[o('poca', 'Menos de 1.000 L', '💧'), o('mucha', 'Más de 1.000 L', '🌊')]}
      cartas={[
        c('☕', 'Una taza de café', 'poca', 'Unos 130 litros.'),
        c('🥩', 'Un kilo de carne de res', 'mucha', 'Más de 15.000 litros.'),
        c('👖', 'Un jean', 'mucha', 'Unos 8.000 litros por el algodón.'),
        c('🍎', 'Una manzana', 'poca', 'Unos 70 litros.'),
        c('🍫', 'Un kilo de chocolate', 'mucha', 'Más de 15.000 litros.'),
      ]}
      cierre="El agua que más usamos no sale de la llave: está en lo que comemos y compramos." />
  )
}
