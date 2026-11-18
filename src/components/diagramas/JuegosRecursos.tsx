import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 5, tema 6 (Recursos naturales y energía). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function RecursosJuego() {
  return (
    <JuegoDecide titulo="¿Se renueva?" pregunta="¿Renovable o no renovable?" instrucciones="Decide si cada recurso es renovable o no renovable." clave="cien:recursos-mejor"
      opciones={[o('ren', 'Renovable', '🌳'), o('no', 'No renovable', '🛢️')]}
      cartas={[
        c('🪙', 'El oro de una mina', 'no', 'Lo que se saca no vuelve.'),
        c('🐟', 'El bocachico del Magdalena', 'ren', 'Si se pesca con medida y se respeta la subienda.'),
        c('⛽', 'La gasolina', 'no', 'Viene del petróleo.'),
        c('🪵', 'La madera de un bosque manejado', 'ren', 'Si se siembra más de lo que se corta.'),
        c('⚫', 'El carbón del Cerrejón', 'no', 'Tardó millones de años en formarse.'),
        c('💧', 'El agua de una quebrada cuidada', 'ren', 'El ciclo del agua la renueva.'),
      ]}
      cierre="Renovable no es infinito: depende de cómo lo usemos." />
  )
}

export function HidroelectricaJuego() {
  return (
    <JuegoDecide titulo="¿Fósil o renovable?" pregunta="¿Qué tipo de fuente es?" instrucciones="Decide si cada fuente de energía es fósil o renovable." clave="cien:hidroelectrica-mejor"
      opciones={[o('fosil', 'Fósil', '🏭'), o('ren', 'Renovable', '🌱')]}
      cartas={[
        c('💧', 'Una hidroeléctrica', 'ren', 'El ciclo del agua la renueva.'),
        c('⚫', 'Una termoeléctrica de carbón', 'fosil', 'Quema carbón y emite CO₂.'),
        c('☀️', 'Un panel solar', 'ren', 'El Sol no se agota.'),
        c('🔥', 'Una planta de gas natural', 'fosil', 'El gas es un combustible fósil.'),
        c('🌾', 'Quemar bagazo de caña en un ingenio', 'ren', 'Es biomasa: la caña vuelve a crecer.'),
      ]}
      cierre="En Colombia la mayor parte de la electricidad viene del agua." />
  )
}

export function RepresasJuego() {
  return (
    <JuegoDecide titulo="¿Beneficio o impacto?" pregunta="¿Qué es?" instrucciones="Decide si cada efecto de una gran represa es un beneficio o un impacto negativo." clave="cien:represas-mejor"
      opciones={[o('ben', 'Beneficio', '⚡'), o('imp', 'Impacto', '🏚️')]}
      cartas={[
        c('⚡', 'Electricidad para millones de hogares', 'ben', 'Sin quemar combustibles.'),
        c('🌳', 'Se inundan hectáreas de bosque seco', 'imp', 'Un ecosistema muy amenazado.'),
        c('🐟', 'El bocachico no puede subir el río', 'imp', 'La represa le corta el camino.'),
        c('💰', 'Regalías para el municipio', 'ben', 'Dinero para obras públicas.'),
        c('🏠', 'Familias que deben dejar sus tierras', 'imp', 'Tienen derecho a ser reparadas.'),
      ]}
      cierre="Toda gran obra tiene dos caras: hay que pesarlas y escuchar a todos." />
  )
}

export function FuentesEnergiaJuego() {
  return (
    <JuegoDecide titulo="¿Cuál fuente?" pregunta="¿De qué fuente hablo?" instrucciones="Elige la fuente de energía que corresponde a cada pista." clave="cien:fuentes-energia-mejor"
      opciones={[o('hidro', 'Hidráulica', '💧'), o('term', 'Térmica', '🏭'), o('solar', 'Solar', '☀️'), o('eol', 'Eólica', '🌬️')]}
      cartas={[
        c('🌙', 'No produce nada de noche', 'solar', 'Necesita baterías o respaldo.'),
        c('🏜️', 'En La Guajira se instalan grandes molinos', 'eol', 'Hay vientos fuertes y constantes.'),
        c('☀️', 'Baja mucho en los años de El Niño', 'hidro', 'Los embalses se secan.'),
        c('💨', 'Funciona siempre, pero emite CO₂', 'term', 'Quema gas o carbón.'),
        c('🏞️', 'Necesita una represa y un embalse', 'hidro', 'Como Betania y El Quimbo.'),
      ]}
      cierre="Cada fuente tiene ventajas y límites: por eso se mezclan." />
  )
}

export function HuellaEcologicaJuego() {
  return (
    <JuegoDecide titulo="¿Sube o baja?" pregunta="¿Qué le pasa a tu huella?" instrucciones="Decide si cada hábito sube o baja la huella ecológica." clave="cien:huella-ecologica-mejor"
      opciones={[o('sube', 'La sube', '⬆️'), o('baja', 'La baja', '⬇️')]}
      cartas={[
        c('🥩', 'Comer carne de res todos los días', 'sube', 'Necesita mucha tierra y agua.'),
        c('🍽️', 'Servirse solo lo que se va a comer', 'baja', 'Menos desperdicio.'),
        c('🛵', 'Ir en moto a una cuadra', 'sube', 'Quema gasolina sin necesidad.'),
        c('🧺', 'Comprar frutas de la vereda', 'baja', 'Menos transporte.'),
        c('📱', 'Cambiar de celular cada año', 'sube', 'Fabricarlo usa minerales y energía.'),
      ]}
      cierre="Lo que comemos, cómo nos movemos y cuánto compramos marca la huella." />
  )
}
