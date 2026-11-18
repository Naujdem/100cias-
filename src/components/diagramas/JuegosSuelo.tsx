import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 5, tema 3 (Suelo y uso del territorio). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function QueEsSueloJuego() {
  return (
    <JuegoDecide titulo="¿Mineral u orgánico?" pregunta="¿De dónde viene?" instrucciones="Decide si cada componente del suelo viene de la roca o de los seres vivos." clave="cien:que-es-suelo-mejor"
      opciones={[o('mineral', 'De la roca', '🪨'), o('organico', 'De los seres vivos', '🍂')]}
      cartas={[
        c('⏳', 'Arena', 'mineral', 'Granos de roca desgastada.'),
        c('🍂', 'Humus', 'organico', 'Restos descompuestos.'),
        c('🏺', 'Arcilla', 'mineral', 'Las partículas más finas de la roca.'),
        c('💩', 'Excrementos de lombriz', 'organico', 'Abonan el suelo.'),
        c('🌫️', 'Limo', 'mineral', 'Partículas medianas, entre la arena y la arcilla.'),
      ]}
      cierre="El suelo mezcla roca desmenuzada con restos de vida." />
  )
}

export function HorizontesJuego() {
  return (
    <JuegoDecide titulo="¿En qué capa?" pregunta="¿Qué horizonte es?" instrucciones="Elige el horizonte que describe cada tarjeta." clave="cien:horizontes-mejor"
      opciones={[o('o', 'O · Hojarasca', '🍂'), o('a', 'A · Fértil', '🪱'), o('b', 'B · Subsuelo', '🟫'), o('r', 'C y R · Roca', '🪨')]}
      cartas={[
        c('🪱', 'Oscura, llena de lombrices y raíces', 'a', 'La capa fértil, con humus.'),
        c('🍂', 'Hojas secas recién caídas', 'o', 'Arriba de todo.'),
        c('🟫', 'Clara y arcillosa, con minerales lavados de arriba', 'b', 'El subsuelo.'),
        c('🪨', 'La roca de donde salió el suelo', 'r', 'La roca madre.'),
        c('🌱', 'Donde un fríjol tiene casi todas sus raíces', 'a', 'Ahí están el agua y los nutrientes.'),
      ]}
      cierre="O · A · B · C · R, de arriba hacia abajo." />
  )
}

export function ErosionJuego() {
  return (
    <JuegoDecide titulo="¿Causa o freno?" pregunta="¿Causa erosión o la frena?" instrucciones="Decide si cada acción causa erosión o la frena." clave="cien:erosion-mejor"
      opciones={[o('causa', 'La causa', '⚠️'), o('frena', 'La frena', '🛡️')]}
      cartas={[
        c('🔥', 'Quemar el rastrojo antes de sembrar', 'causa', 'Deja el suelo desnudo.'),
        c('🌾', 'Dejar los residuos de la cosecha sobre el suelo', 'frena', 'Lo cubren de las gotas.'),
        c('⬇️', 'Arar en surcos de arriba hacia abajo', 'causa', 'El agua corre por los surcos.'),
        c('🐄', 'Meter más ganado del que aguanta el potrero', 'causa', 'Es el sobrepastoreo: pela y compacta el suelo.'),
        c('🌳', 'Sembrar árboles en la orilla de la quebrada', 'frena', 'Las raíces sujetan la orilla.'),
      ]}
      cierre="Suelo cubierto es suelo protegido." />
  )
}

export function DeforestacionJuego() {
  return (
    <JuegoDecide titulo="¿Verdad o mito?" pregunta="¿Es cierto?" instrucciones="Decide si cada frase sobre la deforestación y la desertificación es verdad o mito." clave="cien:deforestacion-mejor"
      opciones={[o('v', 'Verdad', '✅'), o('m', 'Mito', '❌')]}
      cartas={[
        c('🐄', 'En Colombia, abrir potreros es la principal causa de tala', 'v', 'La ganadería extensiva o praderización.'),
        c('🏜️', 'La Tatacoa es un desierto verdadero', 'm', 'Es un bosque seco tropical con mucha erosión.'),
        c('🌫️', 'Talar un bosque libera carbono al aire', 'v', 'El carbono de la madera vuelve como CO₂.'),
        c('🏖️', 'Desertificación es que la arena de un desierto avanza', 'm', 'Es la degradación de la tierra en zonas secas.'),
        c('💧', 'Sin bosque, los ríos tienen más agua en verano', 'm', 'Tienen menos: el agua ya no se guarda en el suelo.'),
      ]}
      cierre="Perder el bosque es perder suelo, agua, vida y carbono guardado." />
  )
}

export function ConservarSueloJuego() {
  return (
    <JuegoDecide titulo="¿Cuida o daña?" pregunta="¿Cuida el suelo?" instrucciones="Decide si cada práctica cuida el suelo de la finca o lo daña." clave="cien:conservar-suelo-mejor"
      opciones={[o('cuida', 'Lo cuida', '💚'), o('dana', 'Lo daña', '⚠️')]}
      cartas={[
        c('↔️', 'Sembrar en curvas de nivel', 'cuida', 'Cada surco frena el agua.'),
        c('☕', 'Café con sombrío de guamos', 'cuida', 'Es un sistema agroforestal.'),
        c('🐄', 'Árboles y pasto juntos en el potrero', 'cuida', 'Es un sistema silvopastoril.'),
        c('🔁', 'Sembrar siempre lo mismo en el mismo lote', 'dana', 'Rotar los cultivos mantiene la fertilidad.'),
        c('🍂', 'Abonar con compost de la cocina', 'cuida', 'Devuelve materia orgánica.'),
      ]}
      cierre="Cubrir, frenar el agua y devolver materia orgánica." />
  )
}
