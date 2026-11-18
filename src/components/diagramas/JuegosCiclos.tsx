import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 5, tema 1 (Ciclos biogeoquímicos). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function MateriaReciclaJuego() {
  return (
    <JuegoDecide titulo="¿Fluye o se recicla?" pregunta="¿Energía o materia?" instrucciones="La energía fluye y se pierde; la materia se recicla. Decide de qué habla cada tarjeta." clave="cien:materia-recicla-mejor"
      opciones={[o('energia', 'Energía', '☀️'), o('materia', 'Materia', '♻️')]}
      cartas={[
        c('🔥', 'El calor que suelta un venado al correr', 'energia', 'Sale del ecosistema como calor.'),
        c('⚛️', 'Un átomo de carbono que pasa de una hoja a una oruga', 'materia', 'Los átomos se reutilizan.'),
        c('☀️', 'La luz que llega del Sol cada día', 'energia', 'Entra de afuera todo el tiempo.'),
        c('💧', 'El agua que tomaste hoy, que antes fue lluvia', 'materia', 'El agua da vueltas por el planeta.'),
        c('🍂', 'El nitrógeno de una hoja que se pudre', 'materia', 'Vuelve al suelo y lo usan otras plantas.'),
      ]}
      cierre="La energía entra y sale; los átomos se quedan y dan vueltas." />
  )
}

export function CicloAguaJuego() {
  return (
    <JuegoDecide titulo="¿Qué le pasa al agua?" pregunta="¿Qué proceso es?" instrucciones="Elige el proceso del ciclo del agua que muestra cada tarjeta." clave="cien:ciclo-agua-mejor"
      opciones={[o('evap', 'Evaporación o transpiración', '♨️'), o('cond', 'Condensación', '☁️'), o('prec', 'Precipitación', '🌧️'), o('esc', 'Escorrentía o infiltración', '🏞️')]}
      cartas={[
        c('🪟', 'Gotas en la ventana de un bus frío', 'cond', 'El vapor se enfría y forma gotas.'),
        c('👕', 'La ropa que se seca al sol', 'evap', 'El agua pasa a vapor.'),
        c('🧊', 'Granizo en el páramo', 'prec', 'El agua cae de las nubes.'),
        c('🌳', 'Un árbol que suelta vapor por sus hojas', 'evap', 'Es la transpiración.'),
        c('🏞️', 'Una quebrada que crece después del aguacero', 'esc', 'El agua corre por la superficie.'),
        c('🌫️', 'La niebla de la madrugada en la montaña', 'cond', 'Es una nube a ras de suelo.'),
      ]}
      cierre="Evaporación → condensación → precipitación → escorrentía, y otra vez." />
  )
}

export function CicloCarbonoJuego() {
  return (
    <JuegoDecide titulo="¿Saca o devuelve?" pregunta="¿Qué hace con el CO₂ del aire?" instrucciones="Decide si cada proceso saca CO₂ del aire o lo devuelve." clave="cien:ciclo-carbono-mejor"
      opciones={[o('saca', 'Lo saca', '🌿'), o('devuelve', 'Lo devuelve', '💨')]}
      cartas={[
        c('🌿', 'Un cafetal haciendo fotosíntesis', 'saca', 'Convierte el CO₂ en azúcares.'),
        c('🐄', 'Una vaca respirando', 'devuelve', 'La respiración suelta CO₂.'),
        c('🚌', 'Un bus que quema diésel', 'devuelve', 'Suelta carbono guardado hace millones de años.'),
        c('🍄', 'Hongos que pudren un tronco', 'devuelve', 'La descomposición suelta CO₂.'),
        c('🌊', 'El mar que disuelve gas del aire', 'saca', 'El océano guarda mucho CO₂.'),
        c('🔥', 'Una quema para sembrar', 'devuelve', 'Además se pierden árboles que lo tomarían.'),
      ]}
      cierre="Solo la fotosíntesis y el océano sacan CO₂; casi todo lo demás lo devuelve." />
  )
}

export function CicloNitrogenoJuego() {
  return (
    <JuegoDecide titulo="¿Verdad o mito?" pregunta="¿Es cierto?" instrucciones="Decide si cada frase sobre el nitrógeno es verdad o mito." clave="cien:ciclo-nitrogeno-mejor"
      opciones={[o('v', 'Verdad', '✅'), o('m', 'Mito', '❌')]}
      cartas={[
        c('🌫️', 'Las plantas toman el nitrógeno directamente del aire', 'm', 'Necesitan que las bacterias lo fijen.'),
        c('🫘', 'El fríjol tiene bacterias que abonan el suelo', 'v', 'Viven en los nódulos de sus raíces.'),
        c('🥩', 'Los animales obtienen el nitrógeno al comer', 'v', 'Lo necesitan para sus proteínas.'),
        c('🍂', 'El nitrógeno de una hoja muerta se pierde para siempre', 'm', 'Los descomponedores lo devuelven al suelo.'),
        c('🧪', 'Echar abono de más ensucia ríos y lagos', 'v', 'La lluvia arrastra el sobrante.'),
      ]}
      cierre="Sin bacterias no habría nitrógeno para la vida." />
  )
}

export function CiclosRepasoJuego() {
  return (
    <JuegoDecide titulo="¿De qué ciclo hablo?" pregunta="¿Qué ciclo es?" instrucciones="Repaso de los cuatro ciclos: elige a cuál pertenece cada pista." clave="cien:ciclos-repaso-mejor"
      opciones={[o('agua', 'Agua', '💧'), o('c', 'Carbono', '🌿'), o('n', 'Nitrógeno', '🫘'), o('p', 'Fósforo', '🪨')]}
      cartas={[
        c('🪨', 'No pasa por el aire: su depósito son las rocas', 'p', 'Es el ciclo más lento.'),
        c('🫘', 'Lo fijan bacterias de las raíces del fríjol', 'n', 'Las plantas no lo toman del aire.'),
        c('🏭', 'Aumenta en el aire al quemar petróleo', 'c', 'Es carbono guardado hace millones de años.'),
        c('🌧️', 'Se evapora, forma nubes y cae como lluvia', 'agua', 'Lo mueve el Sol.'),
        c('🦴', 'Forma los huesos y el ATP', 'p', 'Sale de las rocas por meteorización.'),
        c('🌿', 'Las plantas lo toman con la fotosíntesis', 'c', 'Como CO₂.'),
      ]}
      cierre="Agua, carbono, nitrógeno y fósforo: la materia siempre vuelve." />
  )
}
