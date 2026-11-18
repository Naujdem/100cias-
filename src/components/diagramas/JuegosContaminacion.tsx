import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 5, tema 5 (Contaminación). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function QueEsContaminacionJuego() {
  return (
    <JuegoDecide titulo="¿Qué contamina?" pregunta="¿Aire, agua o suelo?" instrucciones="Decide qué contamina principalmente cada situación." clave="cien:que-es-contaminacion-mejor"
      opciones={[o('aire', 'Aire', '🌫️'), o('agua', 'Agua', '💧'), o('suelo', 'Suelo', '🟫')]}
      cartas={[
        c('🔥', 'Quemar basura en el patio', 'aire', 'Suelta humo tóxico.'),
        c('🚽', 'Aguas negras directo a la quebrada', 'agua', 'Trae microorganismos y materia orgánica.'),
        c('🔋', 'Enterrar pilas usadas', 'suelo', 'Sueltan metales.'),
        c('☕', 'Echar las mieles del café al río', 'agua', 'Le quitan el oxígeno.'),
        c('🛢️', 'Derramar aceite de motor en la tierra', 'suelo', 'Un litro contamina mucha tierra y agua.'),
      ]}
      cierre="Lo que hacemos en la tierra llega tarde o temprano al aire o al agua." />
  )
}

export function AguaContaminadaJuego() {
  return (
    <JuegoDecide titulo="¿Limpia o contaminada?" pregunta="¿Cómo está el agua?" instrucciones="Mira la pista y decide si el agua está limpia o contaminada." clave="cien:agua-contaminada-mejor"
      opciones={[o('limpia', 'Limpia', '💧'), o('sucia', 'Contaminada', '⚠️')]}
      cartas={[
        c('🪰', 'Hay muchas larvas de efímeras bajo las piedras', 'limpia', 'Solo viven con mucho oxígeno.'),
        c('🪱', 'Solo hay lombrices rojas en el barro', 'sucia', 'Aguantan muy poco oxígeno.'),
        c('🐟', 'Los peces boquean en la superficie', 'sucia', 'Les falta oxígeno.'),
        c('🫧', 'Espuma blanca después del pueblo', 'sucia', 'Detergentes de las aguas negras.'),
        c('🪨', 'Plecópteros en una quebrada de montaña', 'limpia', 'Son bioindicadores de agua sana.'),
      ]}
      cierre="Los seres vivos del río cuentan cómo está el agua." />
  )
}

export function AireContaminadoJuego() {
  return (
    <JuegoDecide titulo="¿Más o menos humo?" pregunta="¿Aumenta o reduce la contaminación del aire?" instrucciones="Decide si cada acción aumenta o reduce la contaminación del aire." clave="cien:aire-contaminado-mejor"
      opciones={[o('mas', 'La aumenta', '🌫️'), o('menos', 'La reduce', '🌬️')]}
      cartas={[
        c('🔥', 'Quemar el rastrojo para sembrar', 'mas', 'Suelta humo y partículas.'),
        c('🏠', 'Cambiar el fogón por una estufa con chimenea', 'menos', 'Saca el humo de la casa.'),
        c('🚌', 'Un bus viejo que echa humo negro', 'mas', 'El diésel mal quemado suelta partículas.'),
        c('🚲', 'Ir al colegio en bicicleta', 'menos', 'No quema combustible.'),
        c('🌳', 'Sembrar árboles a lo largo de la vía', 'menos', 'Atrapan parte del polvo.'),
      ]}
      cierre="Casi toda la contaminación del aire viene de quemar algo." />
  )
}

export function MercurioJuego() {
  return (
    <JuegoDecide titulo="¿Quién tiene más mercurio?" pregunta="¿Poco o mucho mercurio?" instrucciones="En un río contaminado por minería, decide quién acumula poco y quién mucho mercurio." clave="cien:mercurio-mejor"
      opciones={[o('poco', 'Poco', '🟢'), o('mucho', 'Mucho', '🔴')]}
      cartas={[
        c('🦠', 'El plancton', 'poco', 'Está en la base de la cadena.'),
        c('🐠', 'Un bagre adulto', 'mucho', 'Depredador grande: come muchos peces.'),
        c('🌿', 'Las algas del río', 'poco', 'Absorben poco.'),
        c('🦅', 'Un águila pescadora', 'mucho', 'Come peces grandes.'),
        c('🧍', 'Una persona que come bagre todos los días', 'mucho', 'Está arriba de la cadena.'),
      ]}
      cierre="Entre más arriba en la cadena, más mercurio acumulado." />
  )
}

export function EutrofizacionJuego() {
  return (
    <JuegoDecide titulo="En orden" pregunta="¿Pasa antes o después de que mueran los peces?" instrucciones="Ordena la historia de un lago eutrofizado: decide si cada hecho pasa antes o después." clave="cien:eutrofizacion-mejor"
      opciones={[o('antes', 'Antes', '⏮️'), o('despues', 'Después', '⏭️')]}
      cartas={[
        c('🧪', 'Llegan fertilizantes con la lluvia', 'antes', 'Es el comienzo: nutrientes de más.'),
        c('🟢', 'Las algas cubren la superficie', 'antes', 'Crecen sin control.'),
        c('🦠', 'Las bacterias descomponen las algas muertas', 'antes', 'Y gastan el oxígeno.'),
        c('💀', 'Se forma una zona muerta', 'despues', 'Ya casi nada vive ahí.'),
        c('👃', 'El agua huele a podrido', 'despues', 'Por la descomposición sin oxígeno.'),
      ]}
      cierre="Nutrientes → algas → descomposición → sin oxígeno → zona muerta." />
  )
}

export function PlasticosJuego() {
  return (
    <JuegoDecide titulo="¿Cuánto dura?" pregunta="¿Se degrada pronto o tarda siglos?" instrucciones="Decide si cada residuo se degrada en menos de un año o tarda cientos de años o más." clave="cien:plasticos-mejor"
      opciones={[o('pronto', 'Menos de un año', '🍂'), o('siglos', 'Siglos o más', '⏳')]}
      cartas={[
        c('🍌', 'Cáscara de banano', 'pronto', 'Unas semanas.'),
        c('🛍️', 'Bolsa plástica', 'siglos', 'Y se parte en microplásticos.'),
        c('🍾', 'Botella de vidrio', 'siglos', 'Pero se puede reciclar sin fin.'),
        c('📰', 'Hoja de periódico', 'pronto', 'Unos meses.'),
        c('🥤', 'Pitillo de plástico', 'siglos', 'Se usa minutos y dura siglos.'),
      ]}
      cierre="Lo que se usa unos minutos puede durar siglos en el ambiente." />
  )
}
